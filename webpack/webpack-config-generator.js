// @ts-nocheck
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const _ = require('lodash');
const stringifedEnvironmentVariables = _.mapValues(
  require('dotenv').config().parsed,
  JSON.stringify,
);

const ROOT_DIRECTORY = JSON.parse(
  stringifedEnvironmentVariables.ROOT_DIRECTORY,
);
const getAbsolute = relativePath => path.resolve(ROOT_DIRECTORY, relativePath);

/**
 * @param {Object} config
 * @param {'production' | 'staging' | 'development'} config.NODE_ENV
 * @param {'server' | 'admin-client' | 'main-client'} config.type
 * @param {boolean} config.compileScss
 * @returns {Object[]}
 */
const generateWebpackConfig = config => {
  // Initialized shared config variables based on environment and
  // what type of compilation we're doing. This also simultaneously validates the arguments
  let entry;
  let output;
  let target;
  let MAIN_PORT;
  let ADMIN_PORT;
  switch (config.NODE_ENV) {
    case 'production':
    case 'staging':
      MAIN_PORT = stringifedEnvironmentVariables.DEPLOYMENT_MAIN_PORT;
      ADMIN_PORT = stringifedEnvironmentVariables.DEPLOYMENT_ADMIN_PORT;
      break;

    default:
      // Validate that it is undefined as expected
      if (config.NODE_ENV !== 'development') {
        throw new Error(
          "webpack config option NODE_ENV is to either be 'production', " +
            "'staging' or 'development'",
        );
      }

      MAIN_PORT = stringifedEnvironmentVariables.DEVELOPMENT_MAIN_PORT;
      ADMIN_PORT = stringifedEnvironmentVariables.DEVELOPMENT_ADMIN_PORT;
  }
  switch (config.type) {
    case 'server':
      entry = getAbsolute('src/index.js');
      output = {
        path: getAbsolute('build'),
        filename: 'server.js',
      };
      target = 'node';
      break;

    case 'main-client':
      entry = getAbsolute('src/client-scripts/main-client.js');
      output = {
        path: getAbsolute('static/build'),
        filename: 'main-client.js',
      };
      target = 'web';
      break;

    case 'admin-client':
      entry = getAbsolute('src/client-scripts/admin-client.js');
      output = {
        path: getAbsolute('static/build'),
        filename: 'admin-client.js',
      };
      target = 'web';
      break;

    default:
      throw new Error(
        "Webpack config option 'type' is supposed to be either 'server', " +
          "'main-client', or 'admin-client'",
      );
  }

  if (config.compileScss) {
    entry = [entry, getAbsolute('src/styles/main.scss')];
  }

  const extractScss = new ExtractTextPlugin({
    filename: path.relative(
      getAbsolute(output.path),
      getAbsolute('static/build/main.css'),
    ),
  });

  return {
    entry,

    output,

    target,

    context: ROOT_DIRECTORY,

    // This makes __dirname and __filename act as expected based on the src file
    node: {
      __dirname: true,
      __filename: true,
    },

    resolve: {
      modules: [
        getAbsolute('.'),
        getAbsolute('src'),
        getAbsolute('node_modules'),
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    // This makes webpack not bundle in node_modules but leave the require statements
    // since this is unnecessary on the serverside
    externals:
      config.type === 'server'
        ? [
            nodeExternals({
              modulesDir: getAbsolute('node_modules'),
            }),
          ]
        : undefined,

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // We use JSON.stringify here to add the extra quotes as webpack does
          // a direct substition of the string value, so "value" would just
          // substitute value, not "value" which is what we want to be in the code
          NODE_ENV: JSON.stringify(config.NODE_ENV),
          MAIN_PORT,
          ADMIN_PORT,
          CI: JSON.stringify(process.env.CI),
          CIRCLECI: JSON.stringify(process.env.CIRCLECI),
          ...stringifedEnvironmentVariables,
        },
      }),
      // Only add the plugin if we include the scss entry point
    ]
      .concat(config.compileScss ? [extractScss] : [])
      // Minimize code in production environments
      .concat(
        config.NODE_ENV !== 'development'
          ? [
              new UglifyJSPlugin({
                sourceMap: true,
              }),
            ]
          : [],
      ),

    // There are faster sourcemaps to use during development, but it seems it's simpler to
    // get css source maps with this (mostly used for production) setting, and our build
    // time isn't horribly long + we usually use watch so it shouldn't be really bad
    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: [getAbsolute('node_modules'), getAbsolute('config')],

          use: [
            // Notice we are using babel loader after the typescript loader
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                  [
                    '@babel/preset-env',
                    {
                      modules: false,
                      useBuiltIns: 'usage',
                      // If on the server we don't want to compile for browsers
                      ignoreBrowserslistConfig: config.type === 'server',
                      targets:
                        config.type === 'server'
                          ? // This is for the node server
                            { node: 'current' }
                          : // If not node, then it is 'web' and therefore our client scripts
                            // Here we simply let preset-env find the browserlist key
                            undefined,
                    },
                  ],
                ],
                plugins: [
                  '@babel/plugin-proposal-object-rest-spread',
                  '@babel/plugin-proposal-class-properties',
                ],
                minified: config.NODE_ENV !== 'development',
              },
            },
          ],
        },
        // Lint all that is compiled, notice enforce: 'pre' that ensures they run first
        {
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          exclude: [getAbsolute('node_modules'), getAbsolute('config')],
          enforce: 'pre',
          options: {
            emitWarning: true, // Emit linting errors as warnings
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'tslint-loader',
          exclude: [getAbsolute('node_modules'), getAbsolute('config')],
          enforce: 'pre',
          // Tslint errors are warnings by default so no option needed
          options: {
            tsConfigFile: 'tsconfig.json',
          },
        },
        // Only add the scss loaders if we're actually compiling it
      ].concat(
        config.compileScss
          ? /**
             * Transpile and compile SCSS to one minified, autoprefixed, vanilla css file
             */
            {
              test: /\.scss$/,
              exclude: getAbsolute('node_modules'),

              loader: extractScss.extract([
                // Convert css to JS module which Webpack can handle and we can extract to a file
                {
                  loader: 'css-loader',
                  options: {
                    minimize: config.NODE_ENV !== 'development',
                    sourceMap: true,
                  },
                },
                // Transpile CSSNext features and autoprefix
                {
                  loader: 'postcss-loader',
                  options: {
                    config: {
                      path: getAbsolute('webpack/postcss.config.js'),
                    },
                    sourceMap: true,
                  },
                },
                // Converts scss to css
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                  },
                },
              ]),
            }
          : [],
      ),
    },
  };
};

module.exports = generateWebpackConfig;
