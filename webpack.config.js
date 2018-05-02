const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/[name]-[md5:contenthash:hex].css');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CleanEntryPlugin = require('clean-entry-webpack-plugin');

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

module.exports = {
  entry: {
    main: './src/postcss/index.pcss'
  },
  output: {
    filename: '[name].js',
    path: PATHS.static,
    publicPath: '/'
  },
  module: {
    rules: [
      buildRule({
        test: GLOBS.POSTCSS_EXTENSION,
        use: extractCSS.extract({
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader'
          }]
        })
      }),
      buildRule({
        test: GLOBS.SVG_EXTENSION,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/[name]-[hash].[ext]'
          }
        }]
      })
    ]
  },
  plugins: [
    new StyleLintPlugin({
      context: './public/postcss',
      files: [GLOBS.ALL_POSTCSS],
      emitErrors: true,
      failOnError: true,
      quiet: false
    }),
    extractCSS,
    new CleanWebpackPlugin(Object.values(PATHS)),
    new CleanEntryPlugin({
      manifestPath: PATHS.manifest
    }),
    new ManifestPlugin({
      fileName: PATHS.manifest
    })
  ]
};