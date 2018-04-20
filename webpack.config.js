const webpackMerge = require("webpack-merge");
const env = require("./utils/build/env");
const commonConfig = require("./utils/build/webpack.common");
const bundleAnalyzerConfig = require("./utils/build/addons/bundle-analyzer");
const WEBPACK_ADDONS = JSON.parse(process.env.WEBPACK_ADDONS || "[]");

// WTF: html is not minimized even though option is set.
// depending on NODE_ENV right now, but fails even when 'true' is hardcoded!!!
// console.log(JSON.stringify(commonConfig.module.rules[0], null, 2));

const addons = (toLoad) => {
  const addonMap = {
    'bundle-analyzer': bundleAnalyzerConfig
  };

  return toLoad
    .map(name => addonMap[name])
    .filter(addon => addon);
};

module.exports = () => {
  const mergedConfig = webpackMerge(
    commonConfig,
    ...addons(env.WEBPACK_ADDONS)
  );
  // console.log(JSON.stringify(mergedConfig, null, 2))

  return mergedConfig;
}
