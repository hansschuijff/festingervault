import {sync as syncGlob} from "glob";
import fs from "fs-extra";
import path from "path";
const packageContent = JSON.parse( fs.readFileSync( './package.json' ) );

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
fs.removeSync(destination);
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

console.log("All files have been copied successfully.");
