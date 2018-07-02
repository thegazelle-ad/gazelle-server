# Resources for learning about our dependencies

Before reading anything else in this guide you should read this article: https://medium.freecodecamp.org/how-to-escape-tutorial-purgatory-as-a-new-developer-or-at-any-time-in-your-career-e3a4b2384a40

The main point is that reading tutorials and documentation isn't worth it if you don't also get to use it. This article is therefore meant not as a study guide you should go through step by step and complete all the resources listed here, but rather you should use it to maybe skim the most important parts, and when you are working on an issue that requires more knowledge than you currently have about a technology used for that issue, you can consult this article and find good resources to learn more about this.

With that said, here are some resources listed by technology, feel free to add more resources to this article if you find any useful ones as you look around the internet. Also remember that we don't always use the latest version of each of these libraries, so you may find features we don't have if you don't look back into the versioning of the documentation and find the relevant one. Also remember that if you're ever stuck with how to do something with a library, often Google and StackOverflow have the answer! There's a great community of programmers out there!

## Javascript

We use a lot of new Javascript, and Javascript is also very different from other languages since it is very asynchronous in nature. We really recommend watching this talk: https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=8s to understand how the event loop works. Here are some more resources on promises and asynchronous functions which we use heavily:

- [an extensive tutorial on Promises](https://developers.google.com/web/fundamentals/primers/promises)
- [a nice article on asynchronous functions from the perspective of Promises](https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8)
- [an async/await tutorial](https://codeburst.io/javascript-es-2017-learn-async-await-by-example-48acc58bad65)
- [a good article on bad habits in async/await](https://medium.freecodecamp.org/avoiding-the-async-await-hell-c77a0fb71c4c)
- [an async await tutorial](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)

> NOTE TO REVIEWER FROM EMIL: I barely read any of the above yet, as I quickly put this together this morning as I remembered I should, will try to read them later and actually check for quality and relevance, they have lots of upvotes on Medium though and look quite good. If you want to read them and help me out feel free ;).

We also use a lot of the newer ES6 and above syntax, a good guide for the most common ones that we basically use all of see this one:

- https://webapplog.com/es6/

And you might also want to check out two other features he doesn't cover:

- [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

If you want to dive deeper here's a compilation of resources for ES6 that may be helpful, though the internet is full of things like this:

- https://github.com/ericdouglas/ES6-Learning

Just to reiterate though, please don't sit down and study every feature of ES6 heavily, maybe read the above guides of the most important ones, and then look up others as you come across syntax in the codebase that you don't understand and you'll learn them in a context which will help you remember them.

## React

React has a lot of resources and articles on the internet as it is so popular, but the best is probably simply their own documentation and guides, it is really well written:

https://reactjs.org/docs/getting-started.html

Especially their "Main Concepts" and "Advanced Guides" are very educational

## Express

You shouldn't need to know too much about Express, and we don't use it in a super advanced way, but if you should need their documentation is also good http://expressjs.com/.

## Falcor

The Falcor documentation has gotten better recently. Check it out here: http://netflix.github.io/falcor/. We use a Router so this guide is especially relevant: http://netflix.github.io/falcor/documentation/router.html.

## Typescript

The Typescript documentation can sometimes be a bit outdated and incomplete for advanced usages, but for more basic uses it is pretty decent, and we generally try to stick to the most basic use cases. Check it out here: https://www.typescriptlang.org/docs/home.html

## Jest

Jest is our test runner, they have very decent documentation as well that can be found here: http://jestjs.io/docs/en/getting-started

## Material UI

This is the library we use for the styling of our CMS (the admin interface) so we don't have to worry about design too much when it's useability that's important of this platform. Check out the documentation here: https://v0.material-ui.com/#/ note that this is the documentation for v0.\* and that if we upgrade to v1 we should update this URL.

## Slate

Slate is the library we use for building our editor in the CMS. Check out their website here: https://www.slatejs.org/#/rich-text

## SQL

We use SQL, through Knex as describe below, to query and update our database. There are many good resources online to get a primer on SQL, one that is quick but gives you a good idea of the basic syntax is the [codecademy course](https://www.codecademy.com/learn/learn-sql), but feel free to use other resources if you find them better. If there's ever any syntax you might need or something you don't know how to do, remember that Google and StackOverflow are your best friends! They basically always know the answer.

## Knex

Knex is the interface we use for writing our SQL queries. Check out the documentation here: https://knexjs.org/. It is pretty good but far from perfect. If something is confusing you or you have to do some non standard SQL of course feel free to reach out to a lead developer, and you might need to use `knex.raw` if it's something MySQL specific.

## Git

Git is a treasure trove of useful commands, so even if you're very experienced with git there are probably still a few treasures you can find. One resource of treasures can be found here: https://medium.com/@porteneuve/30-git-cli-options-you-should-know-about-15423e8771df. It's short and we recommend everybody to read it, while it's not crucial to the level of code you will produce it's just nice and useful to know!

If you're new to git there's a nice official cheat sheet here: https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf. There is also nice documentation on Git written by Atlassian here: https://www.atlassian.com/git/tutorials.

## Webpack

You probably won't need to understand this unless adding a new build tool / compiler etc. But if you do the Webpack documentation is also nice: https://webpack.js.org/

Here is also a nice article written to introduce beginners to Webpack:
https://medium.freecodecamp.org/a-beginners-introduction-to-webpack-2620415e46b3

## Babel

We don't expect you to need this either but it can be found here: https://babeljs.io/docs/en/next

## And more...

We also use a lot of other small libraries to support us for smaller tasks. If you feel there should be a section here with a link feel free to add it, but otherwise you can generally find a README and links to their Github at `npmjs.com/package/name-of-package`.
