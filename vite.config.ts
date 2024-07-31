import generouted from "@generouted/react-router/plugin";
import Crypto from "crypto";
import path from "path";
import { defineConfig } from "vite";
import viteWpReact from "./vite-plugins/wp-react";
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import babel from 'vite-plugin-babel';

function randomString(size = 6) {
	return Crypto.randomBytes(size).toString("hex").slice(0, size);
}
const rand = randomString();
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				entryFileNames: `assets/[hash].${rand}.js`,
				chunkFileNames: `assets/[hash].${rand}.js`,
				assetFileNames: `assets/[hash].${rand}.[ext]`,
			},
		},
	},
	plugins: [
		generouted(),
		viteWpReact(
			{
				input: { main: "src/index.tsx" },
				outDir: "build",
			},
			{
				externalizeWpPackages: true,
				extractWpDependencies: true,
				enableReact: true,
			},
		),
		ViteMinifyPlugin(),
	],
});
