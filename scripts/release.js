import { sync as syncGlob } from "glob";
import fs from "fs-extra";
import path from "path";
import moment from "moment";
const packageContent = JSON.parse(fs.readFileSync("./package.json"));
import AdmZip from "adm-zip";
const zip = new AdmZip();

const patterns = [
  "admin/**",
  "build/**",
  "includes/**",
  "languages/**",
  "public/**",
  `${packageContent.name}.php`,
  "uninstall.php",
  "block.json",
  "changelog.*",
  "license.*",
  "readme.*",
];

// Define the destination directory
const destination = `deploy`;
// Ensure the destination directory exists
fs.ensureDirSync(destination);
// Function to copy matched files to the destination
patterns.forEach(pattern => {
  const files = syncGlob(pattern, { caseSensitiveMatch: false });
  files.forEach(file => {
    const destPath = path.join(destination, file);
    fs.ensureDirSync(path.dirname(destPath)); // Ensure the destination directory exists
    fs.copySync(file, destPath);
  });
});
zip.addLocalFolder("./deploy", packageContent.name);
fs.ensureDirSync("./dist");
zip.writeZip(`./dist/${packageContent.name}.zip`);
const data = {
  name: packageContent.wp.name,
  slug: packageContent.name,
  version: packageContent.version,
  author: packageContent.wp?.author?.name,
  author_profile: packageContent.wp?.author?.uri,
  requires: packageContent.wp.minWP,
  tested: packageContent.wp.testedWP,
  requires_php: packageContent.wp.minPHP,
  requires_plugins: [],
  compatibility: [],
  last_updated: moment().utc().format(),
  added: moment().utc().format(),
  homepage: packageContent.wp.uri,
  sections: {
    description: packageContent.wp?.description,
    installation: "Will be added soon",
    changelog: "Will be added soon",
  },
  banners: {
    low: "https://festinger-client.sovit.top/wp-content/plugins/festingervault/public/assets/banner.jpg",
    high: "https://festinger-client.sovit.top/wp-content/plugins/festingervault/public/assets/banner.jpg",
  },
  icon: "https://festinger-client.sovit.top/wp-content/plugins/festingervault/public/assets/icon.png",
  screenshots: {},
};

fs.writeFileSync("./dist/info.json", JSON.stringify(data));

console.log("All files have been copied successfully.");
