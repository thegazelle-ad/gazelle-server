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
  externals: nodeModules,
  module: {
    loaders: [
      {
        loader: 'babel',
        test: /\.js$/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'source-map'
}
