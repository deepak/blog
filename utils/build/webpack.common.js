const paths = require("./paths");
const env = require("./env");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// TODO: not able to read `env.isProduction()`
module.exports = {
  entry: paths.entryPath,
  output: {
    filename: paths.bundleFile,
    path: paths.outputPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(html|htm)$/,
        use: [
          {
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
              minimize: env.isProduction()
            }
          }
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name]-[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from:'public/robots.txt' }
    ])
  ]
};