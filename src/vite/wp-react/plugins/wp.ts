import dotenv from "dotenv";
import {
	existsSync,
	readFileSync,
	watch,
	writeFileSync
} from "fs";
import { sync } from "glob";
import { dirname, relative, resolve } from "path";
import { PluginOption, ResolvedConfig } from "vite";
type Props = {
  envFile?: string;
  mainPluginFile?: string;
  composerJSON?: string;
  constants?: Record<string, any>;
  constantsFile?: string;
  srcDir?: string;
};
export default function WPEnvProcess({
  envFile,
  mainPluginFile,
  composerJSON,
  constants,
  constantsFile,
  srcDir,
}: Props = {}): PluginOption {
  let env: NodeJS.ProcessEnv;
  let config: ResolvedConfig;
  let fsTimeout: NodeJS.Timeout;

  const loadEnv = (override = false) => {
    dotenv.config({ override, path: envFile ?? ".env" });
    env = process.env;
    if (!env.NAMESPACE || !env.TEXTDOMAIN) {
      throw new Error("NAMESPACE and TEXTDOMAIN must be defined in .env");
    }
  };

  const replaceNamespace = (content: string, filePath: string) => {
    const dir = relative(srcDir ?? "includes/src", dirname(filePath)).replace(
      new RegExp("/", "g"),
      "\\",
    );
    const chunks = [env.NAMESPACE];
    if (dir.length > 0) {
      chunks.push(dir);
    }
    return content.replace(
      /namespace\s+(.+)?;/gi,
      "namespace " + chunks.join("\\") + ";",
    );
  };

  const replaceTextdomain = (content: string, textdomain: string) => {
    const pattern =
      /((esc_attr__|esc_attr_e|esc_html_e|esc_html__|__|_e)\((\"|\'))(((?!\((\'|\")).)*)((\'|\")\s?,\s?(\'|\"))([\w_-]+)?((\'|\")\))/gi;
    return content.replace(pattern, `$1$4$7${textdomain}$11`);
  };

  const processPHPFiles = () => {
    const files = sync("**/*.php", {
      ignore: ["includes/lib/**", "vendor/**", "composer/**"],
      absolute: true,
      cwd: srcDir ?? "includes/src",
    });
    files.forEach(file => {
      const filePath = resolve(file);
      let fileContent = readFileSync(filePath, "utf8");
      fileContent = replaceNamespace(fileContent, filePath);
      fileContent = replaceTextdomain(fileContent, env.TEXTDOMAIN);
      writeFileSync(filePath, fileContent, "utf8");
    });
  };

  const processMainFile = () => {
    const filePath = resolve(mainPluginFile ?? `${env.SLUG}.php`);
    if (existsSync(filePath)) {
      let fileContent = readFileSync(filePath, "utf8");
      const headers = {
        "Plugin Name": env.NAME,
        "Plugin URI": env.URI,
        Version: env.VERSION,
        Description: env.DESCRIPTION,
        Author: env.AUTHOR_NAME,
        "Author URI": env.AUTHOR_URL,
        "Text Domain": env.TEXTDOMAIN,
        "Requires at Least": env.MIN_WP,
        "Requires PHP": env.MIN_PHP,
        "Update URI": env.UPDATE_URI,
        "Requires Plugins": env.REQUIRES_PLUGINS,
        License: env.LICENSE,
        "License URI": env.LICENSE_URL,
        "Domain Path": env.DOMAIN_PATH,
      };
      Object.entries(headers).forEach(([key, value]) => {
        if (value && value.length > 0) {
          fileContent = fileContent.replace(
            new RegExp(`${key}[\\s+]{0,}:[\\s+]{0,}(.+)`, "gi"),
            `${key}: ${value}`,
          );
        }
      });
      writeFileSync(filePath, fileContent, "utf8");
    } else {
      console.log("Main Plugin file missing");
    }
  };

  const updateComposer = () => {
    const composerPath = composerJSON ?? "composer.json";
    if (existsSync(composerPath)) {
      const composerContent = JSON.parse(readFileSync(composerPath).toString());
      const newContent = {
        ...composerContent,
        autoload: {
          "psr-4": {},
        },
      };
      newContent.autoload["psr-4"][`${env.NAMESPACE}\\`] = "includes/src/";
      writeFileSync(composerPath, JSON.stringify(newContent, null, 4), "utf8");
    } else {
      console.log("Composer JSON file not found");
    }
  };

  const processConstantsFile = () => {
    const filePath = constantsFile ?? resolve("includes/src", "Constants.php");
    if (existsSync(filePath)) {
      if (constants) {
        let fileContent = readFileSync(filePath, "utf8");
        Object.entries(constants).forEach(([key, value]) => {
          const regexp = new RegExp(
            `(const ${key}\\s?=\\s?'?"?)([^'";]+)('"?\\s?;)`,
            "g",
          );
          fileContent = fileContent.replace(regexp, `$1${value}$3`);
        });
        writeFileSync(filePath, fileContent, "utf8");
      }
    } else {
      console.log("Constants file not found");
    }
  };

  const runEvents = () => {
    loadEnv(true);
    processConstantsFile();
    updateComposer();
    processPHPFiles();
    processMainFile();
  };

  return {
    name: "sovit:vite-wp-plugin",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      runEvents();
    },
    buildStart() {
      runEvents();
    },

    configureServer(server) {
      if (server.config.mode === "development") {
        watch(envFile ?? ".env", eventType => {
          if (eventType === "change") {
            if (!fsTimeout) {
              console.log(
                ".env file changed, reloading environment variables...",
              );
              fsTimeout = setTimeout(function () {
                fsTimeout = null;
                runEvents();
              }, 5000);
            }
          }
        });
      }
    },
  };
}
