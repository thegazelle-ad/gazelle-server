const generateWebpackConfig = require('./webpack-config-generator.js');

module.exports = [
  generateWebpackConfig({
    NODE_ENV: 'development',
    type: 'server',
    compileScss: true,
  }),
  generateWebpackConfig({
    NODE_ENV: 'development',
    type: 'main-client',
    compileScss: false,
  }),
  generateWebpackConfig({
    NODE_ENV: 'development',
    type: 'admin-client',
    compileScss: false,
  }),
];
