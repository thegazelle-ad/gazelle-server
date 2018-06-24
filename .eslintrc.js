module.exports = {
  root: true,
  plugins: ['react', 'import', 'jsx-a11y'],
  settings: {
    resolve: {
      root: 'src',
    },
    react: {
      pragma: 'React',
      version: '15.0',
    },
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.dev.config.js',
        'config-index': 0,
      },
    },
  },
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'airbnb',
    'prettier', // Disable the rules prettier handles for us
  ],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    // We want to re-enable no-alert when we have something to replace it with
    'no-use-before-define': 'off',
    'valid-jsdoc': [
      'error',
      {
        prefer: {
          arg: 'param',
          argument: 'param',
          class: 'constructor',
          return: 'returns',
          virtual: 'abstract',
        },
        preferType: {
          Boolean: 'boolean',
          Number: 'number',
          object: 'Object',
          String: 'string',
        },
        requireReturn: false,
        requireReturnType: true,
        requireReturnDescription: false,
        requireParamDescription: false,
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'react/no-multi-comp': 'off',
    'class-methods-use-this': 'off',
    'func-names': ['error', 'as-needed'],
    'jsx-a11y/no-autofocus': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      { components: ['Link'], specialLink: ['to'] },
    ],
    // Prettier handles this for us
    'react/jsx-indent': 'off',
    // Emil: We might contemplate adding in these rules later, some of them I'm disabling because
    // I find them overly restrictive, others simply because I don't want to fix them right now
    'import/first': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': [2, { ignore: ['/articleLogic$'] }], // Basically all the typescript files
    'import/extensions': [2, 'never'],
    'no-underscore-dangle': 'off',
  },
};
