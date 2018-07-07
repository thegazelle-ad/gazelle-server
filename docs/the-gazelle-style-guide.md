# The Gazelle's Programming Style Guide

Welcome to our style guide! This is where we outline the principles we try and stick to while writing code to make our own and future developer's lives easier.

To first give you a bit of context, what drives many of the decisions made in this guide is the environment this software engineering project lives in. It is a project that will change hands many times, often between hands that do not have a lot of experience, and we will continuously be onboarding new developers that can have as little experience as only having completed Intro to Computer Science. This is a big challenge, and that is why in this guide we try to outline some best practices that we think will make it easier for less experienced developers to write high-quality code as soon as possible. This also means that we are setting some pretty strict guidelines sometimes to make it easier to code with consistency and to take away some choices or worries from the developer. It is kind of treated like an open source project. We have also tried to be aware of not adding too many dependencies to our project that new developers need to learn, as we know that just getting into web development is something of a steep learning curve already. Every dependency we've added we've estimated (or at least hoped) that the ease it gives in terms of developer experience outweighs the extra learning curve it adds.

Also note that at the time of writing the codebase is far from compliant with this style guide, but we hope that as you contribute to our project you can help us reach a point where the codebase is good enough quality to at least be close to adhering to everything we write here, and we expect all new code added to be compliant.

Finally, unless you already feel very advanced in the section you are reading, we encourage you to follow every link in this guide and study it carefully so you have these principles at the back of your mind when you code. Even if it takes you a long time to get through all of this, we find it worth it as it will greatly increase the quality of the code you contribute, and you'll get to understand a lot of the decisions we have made.

## The simple things that are actually so important

There are many things that developers new to Software Engineering can be surprised at how seriously we take, and we can seem a bit pedantic, but software engineering is in big part about making code readable and maintainable so that someone else (or yourself after being away from your code for a few weeks or months) could come in and modify or extend what you were working on. The points we make below all attribute to that.

### Variable Names

Writing good variable names is important, it is also very hard actually, but when done right it can make code delightfully easy to read. Here are some short articles that talk about variable naming, all with their different merits:

- [A good guide to variable naming](https://a-nickels-worth.blogspot.com/2016/04/a-guide-to-naming-variables.html)
- [an interesting WIKI with discussions on variable naming](http://wiki.c2.com/?GoodVariableNames)
- [an interesting small case study on variable naming](https://m.signalvnoise.com/hunting-for-great-names-in-programming-16f624c8fc03)

Don't necessarily take everything they say as facts as much of this is a matter of style, it is completely okay to disagree with some of their preferences, but try to take away the idea of using variable names to document your code well, and to avoid making bad mistakes like naming your variables `var1`, or `i`, `j`, `k`, `a`, `b`, `c`. The part current members of The Gazelle's dev management (at the time of writing) probably disagree the most with from the first article is when it's okay to use 1-2 letter variable names (we want less of them), but as mentioned above this is not an easy issue to come to a clean solution to, and people have many differing opinions!

### Comments

Similarly, being good at writing comments is very important to the readability of your code. Contrary to what you may think, the point is not just writing lots of comments, and it can actually be very detrimental writing too many comments if they aren't high quality and/or necessary. Here is a good post about good practices of commenting code that we recommend reading:

- https://blog.codinghorror.com/code-tells-you-how-comments-tell-you-why/.

For documenting functions (in both Javascript and Typescript, but more needed in Javascript) we use the [JSDoc format](http://usejsdoc.org/) which we have linting rules to enforce. Some editors including VSCode also automatically parse this and can show this documentation when you hover over the use of your function.

### Documentation

Hopefully it is clear that good documentation is important, as you're in the process of reading our documentation right now and hopefully appreciate the good parts, and can maybe feel the problem in the areas where we still lack in quality. Especially since our team has a lot of new developers we focus on having very strong documentation by writing guides like this and giving good resources for learning how to use the technologies we use.

If you change anything in how our dev environment works it should be documented in [the setup guide](./dev-environment/setting-up-dev-environment.md), if you change how the server setup works it should be documented in the [server setup guide](./dev-ops/setting-up-server.md), and if you've had to ask for help for anything during your onboarding process to this project, please do consider whether you could add something to the documentation that would've helped you solve your problem had it been here, in order to make the onboarding process smoother for future Gazelle developers.

### Indentation, semicolons, trailing commas and more

The thing that can maybe seem the most pedantic to new software engineers in pull request reviews is when things like white space, whether there's a trailing comma, or where you put your opening and closing brackets, are commented on. The reasoning behind this is that having a consistent style in these matters across the whole codebase makes it a lot easier to read for developers. Luckily you won't have to have many of these comments as we have the checking of these things automated by linters! If you skipped that section before here's a bit of an explanation of how we use linters: [linting explanation](./dev-environment/setting-up-dev-environment.md#note-on-linters-and-tests).

## Types

We use Typescript to add static typing at compile time to Javascript. If you're not familiar with Typescript you can either now or later check out our [resources guide](./guides/dependency-learning-resources.md).

Typescript is not right for every project, and at the time of writing, we very recently added it. Our main reasons for adding it were:

- Reducing stupid bugs regarding typos in accessing objects such as `data.artcles.byId...` <!-- typo in articles is on purpose --> which if typed properly would error, but in normal Javascript, you would simply have to very carefully check all your spelling (and we're human so we make mistakes)
- Reducing stupid bugs regarding variable types, such as trying to call a string method on a number because you hadn't cast it yet
- Typescript provides great developer tooling such as autocompletion and automatic refactoring, especially when used with VSCode
- It provides good automatic documentation of functions, making input and output types very clear

There are also many other reasons to use Typescript, and also quite a few not to use it. The main reasons mentioned not to use it are often:

1.  it is unnecessary for small projects
2.  there is an added overhead for the time needed to program a feature as more code is needed to be written by the programmer
3.  it adds an extra learning curve if your developers aren't familiar with Typescript already

Our responses to these points are:

1.  We feel the project has become big enough now that types will greatly help manage the many files we operate in.
2.  The types make it harder for even very experienced developers to make errors, and we believe it will be a huge help for new developers as it'll warn them and stop them from making many mistakes they may otherwise have made.
3.  We are very aware of this one and it feels like the strongest counterargument in our case. Given that you already know Javascript (otherwise, you will need to learn it for the project anyway), the simple features of Typescript aren't too big of a learning curve, and we want to restrict ourselves to these. Given that we restrict ourselves to the simplest features of Typescript we really do feel that the pros outweigh the cons.

Here is also an interesting article on the different benefits of Typescript and when you should choose it vs Javascript for a project: https://medium.freecodecamp.org/when-should-i-use-typescript-311cb5fe801b

So when coding we expect you to in by far most cases type all your code, and if you are modifying code that has not been migrated to Typescript yet please feel free to migrate it. On top of that try only using basic types, and if you happen to be very proficient in Typescript, don't go all out in advanced types as we don't think we need those, and we don't believe the learning curve for new developers is worth the advanced features.

## File naming

We generally name files and directories (folders) in all lower case with separate words separated by hyphens (`like-this`). The exception is React components which we name in [`CamelCase`](https://en.wikipedia.org/wiki/Camel_case) (`LikeThis`). Also, the extension for anything with React (JSX) code inside it is postfixed with an `x`. so `.jsx` or `.tsx`.

Also, all tests are postfixed with the `.test.js` or `.test.ts` extension.

## Promises

When writing asynchronous code, we prefer using the new [async/await syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) over promises as we find it much more readable. It is important to understand how Promises and asynchronous programming works to be able to understand the async await functions though. Check out our [resources guide's Javascript section](./guides/dependency-learning-resources.md#javascript) for more information.

## Testing

The more tests the better! For a quick explanation some of the many benefits of writing lots of good tests are:

- Even more documentation! Unit tests describe very well how your functions are supposed to behave
- They of course give confidence in that the code you wrote works correctly
- If the code is ever refactored or changed as part of another feature we can have confidence that it didn't break the intended behavior, as in that case our tests would've broken

The first two could be handled differently with good documentation + manual testing when you develop your feature (tests still do a very good job of this though, so it's still reasons to write them), but the last one is especially crucial, as accidentally breaking features during refactors or small edits happens often, and strong test coverage can reduce most of these problems. The errors in specifically unit tests are also very specific and tell you exactly what thing is broken so it becomes super easy to fix.

Please do write as many unit tests as possible, the more the better, and we also expect every bug fix to have a regression test to make sure the encountered bug won't resurface later unnoticed.

We also write [end to end (E2E) tests](./guides/developing-end-to-end-tests.md) to give us more confidence when deploying, and with these tests we aim to cover most of the possible user interactions that can occur in our CMS (content management system, the admin interface). We of course also want confidence in thegazelle.org but that site isn't as complex as the CMS, and it therefore doesn't need as much E2E testing. You usually will not have to write new E2E tests unless developing a new feature.

If you are unfamiliar with unit testing here is a good short Quora answer on what unit testing is and why it's important: https://www.quora.com/What-is-software-unit-testing-and-why-is-it-important. Also feel free to follow the link at the bottom of the most upvoted answer which goes a bit more in-depth.

## Database development

If you ever need to change the database schema we require you to write a migration in the [migrations folder](../database-management/migrations). You create a new migration (this just creates a properly named template, you still have to write the migration) by running

```
npx knex migrate:make migration_name
```

and please name it something meaningful. If you change the database schema we also expect you to change the [database seed](../database-management/seeds/replace-database-with-dummy-data.js) so that our dummy/test data is up to date.

## Modularization

We try to keep our code as modularized and reusable as possible, including trying to keep our code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (to throw in a buzzword). Try to keep files from getting too big. As a rule of thumb, you should start thinking about possibly breaking a file up into several files each with their own responsibilities if it crosses 200-300 lines, it is not a hard limit though. For React components we generally try and split up our components into presentational and container components (which we have usually called controllers in our code). Good resources for understanding these paradigms can be found here:

- [Dan Abramov (a huge name in the React community) explains how he uses presentational and container components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [A nice little example of using container components that Abramov also references in the above article](https://medium.com/@learnreact/container-components-c0e67432e005)

For our functions (or methods in a React component) we also try and separate out as much logic as possible into [pure functions](https://en.wikipedia.org/wiki/Pure_function), which are easy to understand and much much easier to unit test. Therefore we usually try to make all impure functions (meaning they have side effects, i.e. they are affected by other things that function parameters or affect non-function parameters) mostly just call other functions and not have too much logic themselves as testing impure functions is hard. Here is a great article about unit testing and simultaneously making your code much cleaner and easier to test:

- https://www.toptal.com/qa/how-to-write-testable-code-and-why-it-matters

It is written in an Object Oriented Programming (OOP) context but the way of thinking about writing testable code presented in the article should still be helpful to anyone starting to consider these issues.

Modularizing well is something professional developers also find hard to get right and discuss a lot, so if you're feeling a piece of code you're writing is getting a bit out of hand, feel free to consult the rest of the team and crowdsource opinions about how to best structure a big complex piece of code.

## Directory Structure

Both as a resource for you as new to our codebase, and as a guide for how to keep things this is currently the structure of our sourcecode. Please stick to it or update this guide if you change anything in this structure.

Firstly note that the root of the directory has a lot of hidden (starting with `.`) config files such as: `.nvmrc`, `.eslintrc.js`, `.babelrc`, `.gitignore`, `.prettierrc.js`. Our dependencies interact with these.

Also note that `__tests__` folders in subdirectories are where unit tests for the files in that directory lie and will not be mentioned every time. `__snapshots__` are where the snapshots for those tests lie, and the `__mocks__` folder is where test mocks for files in that directory lie.

- [\_\_tests\_\_](__tests__) [The directory with all our global tests and test config]
  - [config](../__tests__/config) [This is where we keep all the Jest config]
  - [end-to-end](../__tests__/end-to-end) [The location of all our E2E tests, it also has the [jest-setup](../__tests__/end-to-end/jest-setup.js) file which is set to run before all our E2E tests to setup some config, and it has some E2E utilities and constants files for reuse across all the tests]
    - [admin-tests](../__tests__/end-to-end/admin-tests) [The location of all the E2E tests for the admin site]
    - [main-tests](../__tests__/end-to-end/main-tests) [The location of all the E2E tests for the main site]
  - [helpers](../__tests__/helpers) [Here lie the helpers for our different tests, at the time of writing there are only helpers for database tests]
- [.circleci](../.circleci) [Where config and CI related files lie]
  - [images](../.circleci/images) [The place where we have the docker images used for our CircleCI runs]
  - [scripts](../.circleci/scripts) [The place where we have the scripts used by CircleCI]
- [.github](../.github) [Files used by github such as the CODEOWNER file, and the templates for pull requests and issues]
- [build](../build) [This is where all the built code goes, you shouldn't need to ever look in here]
- [database-management](../database-management) [where we have all the code we use for database management such as migrations and database seeds]
  - [migrations](../database-management/migrations) [where we keep all our database migrations as discussed in the [Database Development](#database-development) section]
  - [seeds](../database-management/seeds) [where we keep all our database seeds as discussed in the [Database Development](#database-development) section]
- [docs](../docs) [where you are right now! The indices explain the structure very well, but this is where all our documentation is]
- [http-error-static-pages](../http-error-static-pages) [A generator of error html pages for our main web server Caddy to send if our node server experiences problems]
- [scripts](../scripts) [these are bash scripts needed by the server]
- [src](../src) [where all the actual source code of The Gazelle and the admin site lies. The `index.js` file in this directory is the entry point to the server of both the websites]
  - [client-scripts](../src/client-scripts) [here are the entry points for the javascript that runs in the browser]
  - [components](../src/components) [This is where all our React components lie which is where all the html the manipulation of DOM code lies]
    - [admin](../src/components/admin) [Where all the React components used exclusively on the Admin site lie. We are still experimenting with the directory structure within here, but need something better and strict. Update this when we settle into something]
    - [hocs](../src/components/hocs) [Where we have all our HOCs (see the [Design Patterns](#design-patterns) section for an explanation)]
    - [main](../src/components/main) [Where we keep the React components for the main site]
  - [lib](../src/lib) [Where we keep all our raw logic and database related code, this has helpers, utility functions, some base React components that we're trying to refactor away, and SQL]
    - [falcor](../src/lib/falcor]) [Here lies all the code related to Falcor and therefore the database]
      - [routes](../src/lib/falcor/routes) [All the sql lies here, organized in a neat structure that resembles the structure of the actual routes, please keep this clean]
  - [routes](../src/routes) [This is where the URL routes lie for our two websites, this is where you can see how our URLs are structured and how you change or add a route if you want]
  - [server-code](../src/server-code) [Where all the server code lies for the two websites]
  - [styles](../src/styles) [where all the CSS for the main site lies (we use Material UI for the CMS so basically have no CSS), the directory structure isn't super tight, but pretty neat, feel free to formalize it here if you want]
  - [transitions](../src/transitions) [Where the transitions animations lie for the main site, this should probably be in components or at least be structured in a better way]
- [static](../static) [Where our static assets lie that the server serves, the `admin.css` files is all the global CSS the admin site uses and can be directly edited here. Try and keep as little as possible in that one though as it's more confusing to understand, only truly global CSS should be here]
  - [build](../src/static/build) [Built static files, so essentially the built client files that have entry points in [src/client-scripts](../src/client-scripts) as mentioned earlier]
- [webpack](../src/webpack) [where all our webpack config lies for the different types of builds we have, the main file to look at is `webpack-config-generator.js`]
- [.sample-env](../.sample-env) [This is the template for all environment specific config that shouldn't be hardcoded into the code. It is also written in a format so [`setup-env.js`](../setup-env.js) can parse it, this is all described in the file]
- [setup-env.js](../setup-env.js) [This is a script that parses the [`.sample-env`](../.sample-env) file and guides the user through generating the `.env` file which is the actual config file our code uses. It also has a `--check-outdated` option which will make it simply check whether the current `.env` file is outdated or not]

## Git workflow

If you are unfamiliar with git you might want to check out our [resources guide](./guides/dependency-learning-resources.md) now or later to read up on it a bit.

We work with a [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) with requirements of an approved code review and passing of our automated tests run on [CircleCI](https://circleci.com/) before being able to merge your code into our master branch.

Fun fact: An old study showed that every hour spent on code review saves 33 hours of maintenance. See this interesting article on the tangible benefits of code review and test-driven development (TDD) here: https://medium.com/javascript-scene/the-outrageous-cost-of-skipping-tdd-code-reviews-57887064c412.

When merging pull requests we prefer merging over rebasing. To understand the differences between merging and rebasing you can check out these two posts:

- [A more detailed (and educational) explanation of the two git features of rebasing and merging](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
- [A more relevant discussion of rebasing vs merging for incorporating features into the master branch](https://www.atlassian.com/git/articles/git-team-workflows-merge-or-rebase)

We used to use the rebase workflow but have changed to a merge based workflow mostly for the following reasons:

- Rebasing is hard and error-prone with dangers of overwriting history as mentioned above. We don't feel it is worth forcing new developers to learn these tools just for merging in code
- Rebasing introduces many more merge conflicts that are tedious and error prone to fix
- We don't really use the history that much, and with Github's merge commits that include a pointer to the pull request associated with the merge, tracking the changes is actually still very easy through Github's GUI.
- It allows several developers to easily work together on the same feature and not worry about history changing
- Merging without squashing gives you more [green squares](https://blog.github.com/2013-01-07-introducing-contributions/#contributions-calendar) on Github! ;), this is half a joke, but the serious part is that it looks good to employers if you have an active Github profile and by not squashing each PR to just a single commit we help our developers with exposure, which is also a small further incentive for developers to join us. Of course don't abuse this by making dummy commits, but any reasonable amount of understandable commits will be excepted and merged.

## Design Patterns

We have a few high level design patterns we use in our codebase that are good to be familiar with, and we expect you to use them when applicable so our general patterns are similar across the codebase:

- We [prefer composition over inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)
- We adhere to a [top down data flow](https://reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down) and therefore [lift up state to the nearest common container component](https://reactjs.org/docs/lifting-state-up.html)
- The [Thinking in React guide](https://reactjs.org/docs/thinking-in-react.html) is a must read for any React developer
- We use [Higher Order Components (HOCs)](https://reactjs.org/docs/higher-order-components.html) to further go down the road of composition, and we also often use HOC factories which are functions that return a HOC function and will be invoked like `HOCFactory(HOCparameters)(componentToWrap)`. You can find [a more complete example here](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e).
- We use the [context API](https://github.com/facebook/react/blob/v15.4.2/docs/docs/context.md) once in a while for global variables. We only use it when we have to, and use HOCs to make the variables available instead of directly accessing the API in normal components. The reason the URL above is not to React's main site is because we haven't upgraded to React 16 yet where they have cemented context (no longer calling it scary and experimental, see [the latest context docs](https://reactjs.org/docs/context.html) if you're curious), and slightly updated the API which won't be helpful to read before we upgrade.
