const generateWebpackConfig = require('./webpack-config-generator.js');

module.exports = [
  generateWebpackConfig({
    NODE_ENV: 'beta',
    type: 'server',
    compileScss: true,
  }),
  generateWebpackConfig({
    NODE_ENV: 'beta',
    type: 'main-client',
    compileScss: false,
  }),
  generateWebpackConfig({
    NODE_ENV: 'beta',
    type: 'admin-client',
    compileScss: false,
  }),
];
