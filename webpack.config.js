// For excluding /node_modules/
var Fs = require('fs')
var nodeModules = {}
Fs.readdirSync('node_modules').forEach(function (module) {
  if (module !== '.bin') {
    nodeModules[module] = true
  }
})
var nodeModulesTransform = function(context, request, callback) {
  // search for a '/' indicating a nested module
  var slashIndex = request.indexOf("/");
  var rootModuleName;
  if (slashIndex == -1) {
    rootModuleName = request;
  } else {
    rootModuleName = request.substr(0, slashIndex);
  }

  // Match for root modules that are in our node_modules
  if (nodeModules.hasOwnProperty(rootModuleName)) {
    callback(null, "commonjs " + request);
  } else {
    callback();
  }
}

module.exports = [{
  target: 'node',
  entry: './src/server.js',
  output: {
    filename: "./build/server.js"
  },
  externals: nodeModulesTransform,
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devtool: 'source-map'
}, {
  target: 'web',
  entry: './src/client.js',
  output: {
    filename: "./static/build/client.js"
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devtool: 'source-map'
}]
