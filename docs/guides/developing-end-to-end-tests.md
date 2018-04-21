## API
This guide is not meant to explain the API of either `jest` nor `nightmare`, but rather the specifics about how we use them in the context of our E2E tests. If you see functions that confuse you in the code, or you want to look up features that could be useful for further development of tests you can check out the [`nightmare` api](https://github.com/segmentio/nightmare#api) or the [`jest` docs](http://facebook.github.io/jest/docs/en/getting-started.html). Another good resource is also the W3's page on [CSS selectors](https://www.w3schools.com/cssref/css_selectors.asp).

## Running E2E tests locally
The E2E tests are written to be run in our CI environment, so you need to do a bit more than what we do in the [Setting Up](https://github.com/thegazelle-ad/gazelle-server/wiki/Setting-Up) guide in order to run the E2E tests locally.

Firstly you should install `forever` if you haven't already
```
npm i -g forever
```

you should then build our source using the `build-emulate-ci` script instead of a normal build
```
npm run build:emulate-ci
```
> NOTE: This will take longer than a normal dev build as it's actually the production build with a few environment variables added. It is also not worth putting this into watch mode, but most of the time you shouldn't be needing to recompile this very often as you will mainly be editing the tests and we don't compile them

Now run the Ghost server as usual, but instead of the normal `npm start` for running the server, instead run
```
forever start build/server.js
```
> NOTE: This will keep the server running in the background until you turn off your computer or you run `forever stopall` (or the specific id but `stopall` is easier). The reason we need forever here is that's how the production server runs it and that's the only way we can test whether restarting the server works + restarting it for various tests.

To stop the server, run
```
forever stopall
```
or
```
forever stop <id>
```
and for restart, run
```
forever restart all
```
or
```
forever restart <id>
```

You can now run the E2E tests via the `test:e2e` script
```
CIRCLECI_ADMIN_PASSWORD=password npm run test:e2e
```

where password is the actual password which you should get from the lead engineers

## Debugging
There are a few debugging tricks that are useful to know when writing these automated browser scripts. The first one is running the tests with the `nightmare` debug flag `nightmare*`:
```
DEBUG=nightmare* npm run test:e2e
```

You can also use `nightmare:actions*` or `nightmare:log*` as the debug environment variable, in order to either just see the actions or just see the logs.

The second one is using our own `ELECTRON_SHOW_DISPLAY` environment variable which will change the shared config all our `nightmare` instances use. This will make the browser window actually show so you can see your tests running which can be very useful to see where it is the website stops reacting as you expect:
```
ELECTRON_SHOW_DISPLAY=1 npm run test:e2e
```

You can of course also run both of these at the same time. 

The last tip is a `jest` tip, which allows you to run just a single test at a time which is nice for debugging (and is especially invaluable if you're using `ELECTRON_SHOW_DISPLAY` as it will all just be a mess otherwise). You can use the `it.only` command in a test file, and then only tests (yes you can do it on several if you want) that have the `.only` suffix will run, it also works with `describe.only` if you want (and there's also a `it.skip`/`describe.skip` but that's usually used more for skipping temporarily broken tests until they get fixed in the future). So you would for example change
```js
it('test something', () => expect(something).toBe(somethingElse))
```
to
```js
it.only('test something', () => expect(something).toBe(somethingElse))
```

This only takes effect within a single file though so you want to be sure you're only running the file where the test you're debugging resides. In vim's command line while in the relevant test file this would look like
```
:!npx jest %
```

To run it from bash you would just remove the first two characters `:!` and substitute `%` with the path to the file your relevant test is in.

## Development tips
Remember not to be afraid to add new HTML ids or classes to elements in order to make your selectors cleaner (or simply work), of course always check whether there's already a good selection available, but if not, add them wherever necessary.

[This Chrome extension](https://github.com/segmentio/daydream) could also possibly be helpful to you, the selectors it generates aren't very pretty though, so it's not necessarily great (it also still missed some of the quirks like the `.mouseup` quirk mentioned below), but if you find it helpful in your process feel free to use it.

And this is hopefully obvious, but if you don't already, use browser dev tools! (Chrome dev tools are great but Firefox's also got improved a lot recently I heard).

## Quirks
This section is here to just explain a few of the quirks you might see in the codebase. Especially a lot come from MaterialUI which is a fantastic package, but it also comes with some downsides since their implementation isn't very straight forward, which means you might see some weird `nightmare` code (that is hopefully commented well), and encounter some weird edge cases you'll have to handle when selecting or interacting with the website programmatically with `nightmare`. Examples include that on some buttons you need to use `.mouseup` instead of `.click` because of something related to the fact that MaterialUI uses `react-touchtap-events` (which should go away in 1.0 though which is soon to be released and we'll probably upgrade to then). Another example is that tabs don't actually get removed from the DOM tree when not visible, but instead simply get changed to `height: 0px` instead, which is the reason for the `isVisible` function (as opposed to the normal pattern of `wait(selector)`). Finally MaterialUI just has a lot of nested elements, and it can take a bit of "hacky" code to access the right elements at times.

Another small thing worth mentioning is that our `npm run test:e2e` script runs with the `jest` flag `--runInBand`, this makes our tests run sequentially instead of in parallel, and the reason for this is that some (and probably the majority will end up doing this) restart the server at times, and this would of course interfere with other tests running in parallel.

## Conclusion
Remember, there are indeed a few quirks in this process, and other people have discovered good ways around most of these before. Therefore it's a great idea to read some of the tests that were already written to get a bit of inspiration from them, and if you encounter problems of course try a bit yourself first, but if you have a question that doesn't seem obvious feel free to ask in the Slack `#dev` channel, and there'll surely be someone that can help or point you to the right resource.

Happy testing!
