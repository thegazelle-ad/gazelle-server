# Server code

Feel free to add instructions for other editors/IDEs

## VS Code

Simply add the following `launch.json` file to your debugger config:

```json5
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  version: '0.2.0',
  configurations: [
    {
      type: 'node',
      request: 'launch',
      name: 'Launch Program',
      program: '${workspaceFolder}/src/index.js',
      sourceMaps: true,
      outFiles: ['build/server.js'],
    },
  ],
}
```

And you should now be able to set all those lovely breakpoints and enjoy the luxury of the VS code debugger!

# Client (browser) code

Chrome DevTools all the way! See [this official guide](https://developers.google.com/web/tools/chrome-devtools/) for some instructions
