/*********************************************
 * Production build for deployment
 *********************************************/

// For excluding /node_modules/
var webpack = require("webpack");
var nodeExternals = require('webpack-node-externals');
var Fs = require('fs')
var nodeModules = {}
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var cssnext = require('postcss-cssnext');

Fs.readdirSync('node_modules').forEach(function (module) {
  if (module !== '.bin') {
    nodeModules[module] = true
  }
})

module.exports = [{
// Front end
  target: 'node',
  entry: './src/server.js',
  output: {
    path: __dirname,
    filename: "./build/server.js",
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src/',
    ],
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new ExtractTextPlugin('./static/build/main.css', {
      allChunks: true,
    }),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': '"beta"', // compiles React as beta build
	      'MAIN_PORT': 8003, // we use a reverse proxy to forward this to port 80 of editor.thegazelle.org
        'EDITOR_PORT': 8004,
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true,
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
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

      /*
       * Parse SCSS to minified CSS, then postprocess with postcss autoprefixer plugin
       */
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', ['css?minimize', 'postcss', 'sass']),
      },

      /*
       * Load in files with CSS alone
       */
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=10000',
      },
    ],
  },
  postcss: function () {
    return [cssnext];
  },
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
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new webpack.OldWatchingPlugin(),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': '"beta"', // compiles React as beta build
      },
    }),
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
        loader: "null",
      },
    ],
  },
},
{
  target: 'web',
  entry: './src/editor-client.js',
  output: {
    filename: "./static/build/editor-client.js",
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src/',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.OldWatchingPlugin(),
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': '"beta"', // compiles React as production build
      },
    }),
  ],
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
}]
