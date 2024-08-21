import viteReact from "@vitejs/plugin-react";
import { InputOption } from "rollup";
import { Plugin, PluginOption } from "vite";
import { devServer, externalizeWpPackages } from "./plugins/index.js";
import WPEnvProcess from "./plugins/wp.js";

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
};

export function viteWpReact({
  input = "js/main.js",
  outDir = "build",
  assetsDir,
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
  return [mainPlugin, devServer(), externalizeWpPackages(), viteReact({ jsxRuntime: "automatic" }),WPEnvProcess()];
}

export default viteWpReact;
