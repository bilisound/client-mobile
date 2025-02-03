const fs = require("fs");
const packageJson = require("../package.json");

packageJson.version = process.env.EXPO_VERSION.slice(1);

console.log("packageJson.version: " + packageJson.version);

fs.writeFileSync("../package.json", JSON.stringify(packageJson, null, 2));
