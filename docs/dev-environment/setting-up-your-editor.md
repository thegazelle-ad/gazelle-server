# Setting up your editor

There are many good code editors out there, such as [Atom](https://atom.io/), [Sublime Text](http://www.sublimetext.com/), or more barebone ones like [Emacs](https://www.gnu.org/software/emacs/) or [Vim](https://www.vim.org/). The choice of editor and how you set it up can greatly affect your productivity as a developer, so it's important to have a good setup. Here at The Gazelle we generally recommend using [Visual Studio Code (VSCode)](https://code.visualstudio.com/) as it is uniquely well suited for Javascript and Typescript as it is created by Microsoft, the creators of Typescript. Therefore the below guide is currently only for VSCode, but if you have found a good setup for another editor feel free to also add it in here for future people to have more choice.

## Keyboard Shortcuts

It's always worth learning the keybindings of your editor and/or customizing them. Check out this page from VSCode on their keybindings: https://code.visualstudio.com/docs/getstarted/keybindings. There's both a cheat sheet for the most common ones there, and it also shows extensions that allow you to use Vim, Atom, Sublime or many other editor's native keybindings within VSCode if that's what you're already used to!

# Must have extensions

## [Sublime Babel](https://marketplace.visualstudio.com/items?itemName=joshpeng.sublime-babel-vscode)

This is an upgraded syntax highlighting that can handle many of the advanced new features of Javascript which VSCode may not support natively yet

## [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Get your ESLint linting errors inline in your editor, very useful (and you can tab through your compilation / linting errors with `F8`)

## [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

Get your TSLint linting errors inline in your editor

## [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

You might be seeing a pattern by now... Get your Prettier formatting errors inline in your editor! This one is even cooler though, as if you change your preferences and set the `editor.formatOnSave` setting to `true`, every time you save all your ugly formatted code (because we all do that when quickly hacking together a prototype of our issue), it will automatically be formatted beautifully!

## [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

This one isn't quite as essential as the others but it's still very useful. It has so many features you'll probably never learn all of them, but a few of the very useful ones are that you can see who last edited the line of code your working on so you know who to ask questions, and you can right click a line and choose `Open File in Remote` to go to the Github version of the file so you can share the URL with others on the team if you need to reference a specific file.

# Debuggers

Setting up a good debugging environment can also greatly improve your life as a developer and speed you up in solving bugs as you encounter them, luckily VSCode has a great debugger! If you're unfamiliar with it you should quickly check out this guide: https://code.visualstudio.com/Docs/editor/debugging. Below are `launch.json` (if you don't understand what this means check out the guide just linked to before) configurations for different types of debugging, of course feel free to tweak any of them to fit your preferences.

## Server code

To debug code running on the server simply add the following configuration object to your `launch.json` file:

```json5
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "program": "${workspaceFolder}/src/index.js",
  "sourceMaps": true,
  "smartStep": true,
  "skipFiles": ["${workspaceFolder}/node_modules/**/*.js"],
  "outFiles": ["build/server.js"]
},
```

## Unit tests

To debug the unit tests you can use this config:

```json5
{
  name: 'Run unit tests',
  type: 'node',
  request: 'launch',
  program: '${workspaceRoot}/node_modules/jest/bin/jest.js',
  stopOnEntry: false,
  args: ['--runInBand', "--config='./__tests__/config/jest.unit.config.js'"],
  smartStep: true,
  skipFiles: ['${workspaceFolder}/node_modules/**/*.js'],
  console: 'integratedTerminal',
  internalConsoleOptions: 'neverOpen',
}
```

And you should now be able to set all those lovely breakpoints and enjoy the luxury of the VS code debugger!

## Client (browser) code

Chrome DevTools all the way! For client side debugging the Chrome Developer Tools are pretty good. You can see [this official guide](https://developers.google.com/web/tools/chrome-devtools/) for some instructions. It is also possible to debug client side code in VSCode using the [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) extension though. No one from the team has tried it yet, but it should work just fine, and if you try it and find it good feel free to add something to this guide to make it easier for others to set it up.
