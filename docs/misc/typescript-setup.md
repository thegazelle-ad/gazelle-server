# Typescript setup

## Motivation

This file explains how Typescript is included in our build process. The main intention is to address the request made in [this PR comment](https://github.com/thegazelle-ad/gazelle-server/pull/409#pullrequestreview-131656474) so that future developers will find it easier to remove Typescript if they would need to do that for any reason. It may also be an interesting read for someone interested in how our Typescript setup works, or as an introduction to our build process through a small case study.

## Webpack

For the webpack config we experimented with a few things such as the [`awesome-typescript-loader`](https://github.com/s-panferov/awesome-typescript-loader), but it scarily enough ended up in watch mode completely taking over all our cores as it forks different processes and takes up enormous amounts of processing power. So we tried the simple way of just including Typescript compilation in our babel setup, which seems to work great. We simply installed the babel preset `babel-preset-typescript` and added it in the config of the babel loader, and everything worked! On top of that we also needed to make a few more small changes such as adding `.ts` and `.tsx` to the resolved extensions, changing the babel test to include Typescript files by making it `(j|t)sx?$`, and moving the `eslint-loader` out of the same block as the `babel-loader` as it shouldn't run on Typescript as it doesn't seem to work well with it. We also added the `tslint-loader` here as we added `TSLint` to substitute `ESLint` for Typescript. You can see all the changes talked about here in the [`webpack-config-generator` diff](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-d297254286b02bb3501d89b4b9b025b1).


## Jest

For jest we simply added `.ts` and `.tsx` file extensions to the `moduleFileExtensions` to be resolved automatically, edited the `testRegex` to include `.test.ts` extensions and then the most significant change was that instead of letting `babel-jest` being implicitly recognized as the preprocessor, we added the `transform` field where we specified `ts-jest` for Typescript files and `babel-jest` for our javascript files. All these changes can be found [in this PR diff](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-547ca5f7a66cf69c47518093f8679766).

## Config

We already had a `jsconfig.json` file for VSCode users as that tells VSCode about the structure of our project, and it is in the exact same format as Typescript's config file `tsconfig.json` (since Microsoft is the author of both Typescript and VSCode). So we simply converted this to `tsconfig.json` and added some compilation rules about the strictness etc. This config can be seen in the [added `tsconfig.json`](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-e5e546dd2eb0351f813d63d1b39dbc48) and the [removed `jsconfig.json`](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-9be4f8e03a4f3bffa2e1404410a10da7). For TSLint, the linter for Typescript, we also added a small config file [tslint.json](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-ace19bd0c04529e685320269e3c05de9).

## Dependencies

On top of the obvious ones as mentioned other places we also added a lot of `@types` packages for typings of our npm dependencies as can be seen in the [`package.json` diff](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-b9cfc7f2cdf78a7f4b91a753d10865a2R74).

## CircleCI

In CircleCI we barely made any changes since the Webpack config takes care of the build changes. We just added some build steps as we had now broken out `Prettier` into it's own command away from ESLint and since the babel TS compilation doesn't check for type errors we also had to include that, which we do by simply running the TS compiler on all of our code with the `noEmit` option. You can see the changes in the [CircleCI config file diff](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-d297254286b02bb3501d89b4b9b025b1), and you can see the commands they reference in the [`package.json` diff](https://github.com/thegazelle-ad/gazelle-server/pull/409/files#diff-b9cfc7f2cdf78a7f4b91a753d10865a2).
