const path = require("path");
const PROJECT_ROOT = path.resolve(__dirname, "../../");

module.exports = {
  entryPath: path.join(PROJECT_ROOT, "public/index.js"),
  outputPath: path.join(PROJECT_ROOT, "dist"),
  bundleFile: 'bundle.js'
};