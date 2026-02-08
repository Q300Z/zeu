/* global __dirname, module*/

const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

let libraryName = 'zeu';

module.exports = (env) => {
  let outputFile, mode;

  if (env.build) {
    mode = 'production';
    outputFile = libraryName + '.min.js';
  } else {
    mode = 'development';
    outputFile = libraryName + '.js';
  }

  return {
    mode: mode,
    entry: path.join(__dirname, '/src/index.ts'),
    devtool: 'source-map',
    output: {
      path: path.join(__dirname, '/dist'),
      filename: outputFile,
      library: {
        name: libraryName,
        type: 'umd',
        export: 'default'
      },
      globalObject: 'typeof self !== "undefined" ? self : this'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /(\.jsx|\.js)$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/
        }
      ]
    },
    resolve: {
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
      extensions: ['.json', '.js', '.ts']
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['js', 'jsx'],
        exclude: 'node_modules'
      })
    ]
  };
};