import { config } from "dotenv";
import fs from "fs-extra";
import { sync } from "glob";
import path, { format } from "path";
import po2json from "po2json";
config();
const patterns = ["languages/**/*.po"];
const files = sync(patterns, { nocase: true, nodir: true });
files.forEach(file => {
  const jsonData = po2json.parseFileSync(file, {
    fuzzy: false,
    format: "raw",
    domain: process.env.TEXTDOMAIN,
    "fallback-to-msgid": true,
  });
  const res = Object.entries(jsonData).map(([key, val]) => {
    if (key == "" && !Array.isArray(val)) {
      return [
        key,
        {
          domain: process.env.TEXTDOMAIN,
          plural_forms: val["plural-forms"],
          lang: val.language,
        },
      ];
    }
    return [key, Array.isArray(val) ? val.filter(i => i !== null) : val];
  });
  fs.writeFileSync(
    path.join("languages", `${path.parse(file).name}-vault-main.json`),
    JSON.stringify({
      domain: process.env.TEXTDOMAIN,
      locale_data: { [process.env.TEXTDOMAIN]: Object.fromEntries(res) },
    }),
  );
});
