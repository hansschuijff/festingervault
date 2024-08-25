import viteReact from "@vitejs/plugin-react";
import { InputOption } from "rollup";
import { Plugin, PluginOption } from "vite";
import { devServer, externalizeWpPackages } from "./plugins/index.js";
import WPEnvProcess from "./plugins/wp.js";
import { reactMakePot } from "./plugins/make-pot.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export type ViteWpReactOptions = {
  /**
   * The entry point to your application. Defaults to `js/main.js`.
   * @default 'js/main.js'
   */
  input?: InputOption;

  /**
   * The directory to write the build to. Defaults to `build`.
   * @default 'build'
   */
  outDir?: string;

  /**
   * The directory to write assets to.
   */
  assetsDir?: string;
	constants?:string[];
};

export function viteWpReact({
  input = "js/main.js",
  outDir = "build",
  assetsDir,
	constants,
}: ViteWpReactOptions = {}): PluginOption {
  const mainPlugin: Plugin = {
    name: "vwpr:config",
    enforce: "post",
    config() {
      return {
        build: {
          outDir,
          assetsDir,
          manifest: "manifest.json",
          modulePreload: false,
          rollupOptions: { input },
          //sourcemap: "inline",
        },
        css: {
          devSourcemap: false,
        },
      };
    },
  };
  return [
    mainPlugin,
    devServer(),
    externalizeWpPackages(),
    viteReact({
      jsxRuntime: "automatic",
      babel: {
        plugins: [["@wordpress/babel-plugin-makepot", {
					output:`languages/en.pot`
				}]],
      },
    }),
    WPEnvProcess({constants})
  ];
}

export default viteWpReact;
