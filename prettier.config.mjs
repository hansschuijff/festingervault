/** @type {import('prettier').Config} */
export default {
  tailwindFunctions: ["clsx","cn"],
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./tailwind.config.ts",
  arrowParens: "avoid",
};
