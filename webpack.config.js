// For excluding /node_modules/
var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');
var Fs = require('fs')
var nodeModules = {}
var path = require('path')

Fs.readdirSync('node_modules').forEach(function (module) {
  if (module !== '.bin') {
    nodeModules[module] = true
  }
})

module.exports = [{
  target: 'node',
  entry: './src/server.js',
  output: {
    path: __dirname,
    filename: "./build/server.js",
  },
  externals: [nodeExternals()],
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src/',
    ],
    alias: {
      applicationStyles: '../styles/main.scss',
    },
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new webpack.OldWatchingPlugin(),
  ],

  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {
          plugins: ['lodash'],
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
      },
    ],
  },
  devtool: 'source-map',
}, {
  target: 'web',
  entry: './src/client.js',
  output: {
    filename: "./static/build/client.js",
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src/',
    ],
    alias: {
      applicationStyles: '../styles/main.scss',
    },
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new webpack.OldWatchingPlugin(),
  ],

  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {
          plugins: ['lodash'],
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
      },
    ],
  },
  devtool: 'source-map',
}]
