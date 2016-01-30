var Fs = require('fs')
var nodeModules = {}
Fs.readdirSync('node_modules').forEach(function (module) {
  if (module !== '.bin') nodeModules[module] = 'commonjs ' + module
})

module.exports = {
  target: 'node',
  entry: './src/server.js',
  output: {
    filename: "./build/server.js"
  },
  // Every non-relative module is external
  // abc -> require("abc")
  externals: /^[a-z\/\-0-9]+$/i,
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.js$/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devtool: 'source-map'
}
