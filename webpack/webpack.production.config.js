const generateWebpackConfig = require('./webpack-config-generator.js');

module.exports = [
  generateWebpackConfig({
    NODE_ENV: 'production',
    type: 'server',
    compileScss: true,
  }),
  generateWebpackConfig({
    NODE_ENV: 'production',
    type: 'main-client',
    compileScss: false,
  }),
  generateWebpackConfig({
    NODE_ENV: 'production',
    type: 'admin-client',
    compileScss: false,
  }),
];
