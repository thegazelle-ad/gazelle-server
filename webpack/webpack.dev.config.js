const generateWebpackConfig = require('./webpack-config-generator.js');

module.exports = [
  generateWebpackConfig({
    NODE_ENV: undefined,
    type: 'server',
    compileScss: true,
  }),
  generateWebpackConfig({
    NODE_ENV: undefined,
    type: 'main-client',
    compileScss: false,
  }),
  generateWebpackConfig({
    NODE_ENV: undefined,
    type: 'admin-client',
    compileScss: false,
  }),
];
