const path = require('path');
const NoEmitOnErrorsPlugin = require("webpack").NoEmitOnErrorsPlugin;
const merge = require("webpack-merge");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanEntryPlugin = require('clean-entry-webpack-plugin');
const PRODUCTION_NODE_ENV = "production";

const GLOBS = {
  SVG_EXTENSION: /\.(svg)$/,
  POSTCSS_EXTENSION: /\.pcss$/,
  ALL_POSTCSS: '**/*.pcss'
};

const PATHS = {
  static: path.resolve(__dirname, 'site', 'static'),
  manifest: path.join(path.resolve(__dirname, 'site', 'data'), 'manifest.json')
};

function buildRule(rule) {
  const DEFAULT_RULE = {
    exclude: /node_modules/,
  };

  return Object.assign({},
    DEFAULT_RULE,
    rule
  );
}

function extractCSS(cssName = '[name]-[md5:contenthash:hex].css') {
  const cssPlugin = new ExtractTextPlugin(`css/${cssName}`)

  return {
    module: {
      rules: [
        buildRule({
          test: GLOBS.POSTCSS_EXTENSION,
          use: cssPlugin.extract({
            use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            }, {
              loader: 'postcss-loader'
            }]
          })
        })
      ]
    },
    plugins: [
      cssPlugin
    ]
  };
}

function extractSVG(svgName = '[name]-[hash].svg') {
  return {
    module: {
      rules: [
        buildRule({
          test: GLOBS.SVG_EXTENSION,
          use: [{
            loader: 'file-loader',
            options: {
              name: `images/${svgName}`
            }
          }]
        })
      ]
    }
  }
}

const commonConfig = {
  mode: PRODUCTION_NODE_ENV,
  bail: true,
  entry: {
    main: './src/postcss/index.pcss',
    styleguide: './src/postcss/styleguide.pcss'
  },
  output: {
    filename: '[name].js',
    path: PATHS.static,
    publicPath: '/'
  },
  module: {
    rules: []
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new StyleLintPlugin({
      context: './public/postcss',
      files: [GLOBS.ALL_POSTCSS],
      emitErrors: true,
      failOnError: true,
      quiet: false
    }),
    new CleanEntryPlugin({
      manifestPath: PATHS.manifest
    }),
    new ManifestPlugin({
      fileName: PATHS.manifest
    })
  ]
};

const developmentConfig = merge(
  {
    plugins: [
      new CleanWebpackPlugin([
        PATHS.static
      ])
    ]
  },
  extractCSS('[name].css'),
  extractSVG('[name].svg')
);

const productionConfig = merge(
  {
    plugins: [
      new CleanWebpackPlugin(Object.values(PATHS))
    ]
  },
  extractCSS(),
  extractSVG()
);

module.exports = (env = {}, argv) => {
  const mode = argv.mode || PRODUCTION_NODE_ENV;
  // console.log(`[webpack] mode ===> ${mode}`);
  const mergedConfig = merge.smart(
    commonConfig,
    { mode: mode },
    PRODUCTION_NODE_ENV === mode ?
      productionConfig :
      developmentConfig
  );
  // TODO: pretty print config https://github.com/lewie9021/webpack-configurator/issues/6
  // console.log(`[webpack] config ===> ${JSON.stringify(mergedConfig, null, 2)}`);
  return mergedConfig;
};