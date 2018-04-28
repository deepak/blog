const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('css/index.css');

const GLOBS = {
  HTML_EXTENSION: /\.(html|htm)$/,
  SVG_EXTENSION: /\.(svg)$/,
  POSTCSS_EXTENSION: /\.pcss$/,
  ALL_POSTCSS: '**/*.pcss'
};

const DEFAULT_RULE = {
  exclude: /node_modules/,
};

function buildRule(rule) {
  return Object.assign({},
    DEFAULT_RULE,
    rule
  );
}

module.exports = {
  entry: './public/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      buildRule({
        test: GLOBS.HTML_EXTENSION,
        use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            }
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'html-loader',
            options: {
              interpolate: 'true',
              minimize: true
            }
          }
        ]
      }),
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
    new CopyWebpackPlugin([{
      from: 'public/robots.txt'
    }]),
    new StyleLintPlugin({
      context: './public/postcss',
      files: [GLOBS.ALL_POSTCSS],
      emitErrors: true,
      failOnError: true,
      quiet: false
    }),
    extractCSS
  ]
};