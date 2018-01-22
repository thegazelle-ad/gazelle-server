const generateWebpackConfig = require('./webpack-config-generator.js');

module.exports = [
  generateWebpackConfig({
    NODE_ENV: 'staging',
    type: 'server',
    compileScss: true,
  }),
  generateWebpackConfig({
    NODE_ENV: 'staging',
    type: 'main-client',
    compileScss: false,
  }),
  generateWebpackConfig({
    NODE_ENV: 'staging',
    type: 'admin-client',
    compileScss: false,
  }),
];
