import { readFileSync, writeFileSync } from "fs";
import { relative, dirname as _dirname, resolve } from "path";
import { sync } from "glob";
import {config} from "dotenv";
config();
const packageContent = JSON.parse(readFileSync("./package.json"));
const composerContent = JSON.parse(readFileSync("./composer.json"));
const textdomain = packageContent.wp?.textdomain || packageContent.name;
const replaceNamespace = (content, filePath) => {
  try {
    const dirname = relative("includes/src", _dirname(filePath)).replace(
      "/",
      "\\",
    );
    let chunks = [packageContent.namespace];
    if (dirname.length > 0) {
      chunks.push(dirname);
    }
    return content.replace(
      /namespace\s+(.+)?;/gi,
      "namespace " + chunks.join("\\") + ";",
    );
  } catch (e) {
    return content;
  }
};
const replaceTextdomain = (content, textdomain) => {
  try {
    const pattern =
      /((esc_attr__|esc_attr_e|esc_html_e|esc_html__|__|_e)\((\"|\'))(((?!\((\'|\")).)*)((\'|\")\s?,\s?(\'|\"))([\w_-]+)?((\'|\")\))/gi;
    return content.replace(pattern, "$1$4$7" + textdomain + "$11");
  } catch (e) {
    console.log(e);
    return content;
  }
};
const processPHPFiles = () => {
  const files = sync("includes/src/**/*.php", {
    ignore: ["includes/lib/**", "vendor/**", "composer/**"],
    absolute: true,
  });
  files.forEach(file => {
    const filePath = resolve(file);
    let fileContent = readFileSync(filePath, "utf8");
    fileContent = replaceNamespace(fileContent, filePath);
    fileContent = replaceTextdomain(fileContent, textdomain);
    writeFileSync(filePath, fileContent, "utf8");
  });
};

const processMainFile = () => {
  try {
    const filePath = resolve(
      packageContent.wp.mainFile ?? `${packageContent.name}.php`,
    );
    let fileContent = readFileSync(filePath, "utf8");
    const headers = {
      "Plugin Name": packageContent.wp?.name || packageContent.name,
      "Plugin URI": packageContent.wp?.uri || "https://ssovit.com",
      Description:
        packageContent.wp?.description || "Beautiful WordPress Plugin",
      Version: packageContent.wp?.version || packageContent.version,
      "Requires at Least": packageContent.wp?.minWP || "6.0.0",
      "Requires PHP": packageContent.wp?.minPHP || "7.2",
      Author: packageContent.wp?.author?.name || "Sovit Tamrakar",
      "Author URI": packageContent.wp?.author?.uri || "https://ssovit.com",
      License: packageContent.wp?.license || "GPL-2.0+",
      "License URI":
        packageContent.wp.licenseURI ||
        "https://www.gnu.org/licenses/gpl-2.0.html",
      "Update URI": packageContent.wp?.updateURI || "https://wordpress.org",
      "Text Domain": packageContent.wp?.textdomain || packageContent.name,
      "Domain Path": packageContent.wp?.domainPath || "/langauges/",
    };
    Object.keys(headers).forEach(header => {
      if (headers[header].length < 1) {
        return;
      }
      let tabs = 10 - Math.ceil((header.length + 1) / 4);
      fileContent = fileContent.replace(
        new RegExp(`${header}[\\s+]{0,}:[\\s+]{0,}(.+)`, "gi"),
        `${header}:${"\t".repeat(tabs)}${headers[header]}`,
      );
    });
    writeFileSync(filePath, fileContent, "utf8");
  } catch (e) {
    console.log(e);
  }
};

const updateComposer = () => {
  try {
    const newContent = {
      ...composerContent,
      autoload: {
        "psr-4": {},
      },
    };

    newContent.autoload["psr-4"][`${packageContent.namespace}\\`] =
      "includes/src/";
    writeFileSync(
      "./composer.json",
      JSON.stringify(newContent, null, 4),
      "utf8",
    );
  } catch (e) {
    console.log(e);
  }
};

const processConstantsFile = () => {
  const variables = {
    ENGINE_URL:
      process.env.ENGINE_URL,
	  API_SLUG:packageContent.name,
	  ACTION_KEY:packageContent.name,
  };
  const filePath = resolve("includes/src/", "Constants.php");
  let fileContent = readFileSync(filePath, "utf8");
  Object.keys(variables).forEach(key => {
    const regexp = new RegExp(
      "(const " + key + "\\s?\\=\\s?\\'?\\\"?)([^\\'\\\";]+)(\\'?\\\"?\\s?;)",
      "g",
    );
    fileContent = fileContent.replace(regexp, "$1" + variables[key] + "$3");
  });
  writeFileSync(filePath, fileContent, "utf8");
};
processConstantsFile();
updateComposer();
processPHPFiles();
processMainFile();
