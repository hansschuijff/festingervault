/** @type {import('prettier').Config} */
export default {
  tailwindFunctions: ["clsx"],
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindConfig: "./tailwind.config.js",
  arrowParens: "avoid",
};
