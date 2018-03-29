If you encounter unexpected errors during setup, or later during usage, see the `Frequently Encountered Errors` section at the bottom of this page.

Also, if not obvious, all instructions in this setup guide assume that you have already cloned [this repo](https://github.com/thegazelle-ad/gazelle-server) which the wiki is located in, and that your current working directory is this repo.

# Install

Make sure you have NodeJS and npm installed

[Install nodejs and npm via nvm](https://github.com/creationix/nvm)

> **IMPORTANT**: For this, the main, repo we use **node v9.3.0** and **npm 5.6.0** (it's important not to use npm 5.5.x which may come as the default with node v9.3.0 as npm 5.5.x has a bug that breaks on node 9.3.0). Use any other versions at your own peril.

Then install dependencies locally

```
npm install
```

# Connect to Ghost and Database
To get Ghost and the database up and running on your server first clone [this repo](https://github.com/thegazelle-ad/database-and-ghost-blog-server) to your computer (outside the main repo) and follow the readme to get it set up.

> NOTE: The README in that repo assumes you have cloned that repo and have your working directory set to be that repo. When you're done and return here we again assume you have your working directory set to this repository

When this is done copy database.config.example.js and ghost.config.example.js (They are both in the config folder) to their non example counterparts, you would do this as follows in bash:

```
cp config/database.config.example.js config/database.config.js
cp config/ghost.config.example.js config/ghost.config.js
```

It is important that you name them exactly as specified above.

Now change the config as necessary. The most important is the host and port of your Ghost blog (you can see where it is running in the ghost config.js file in the database-and-ghost repo), and the password and database name of the database being used in database.config.js. In special situations other things might be relevant as well.

When this is done run

`./scripts/get-ghost-config.sh`

which will fetch the user and password from the database for the Ghost API for you and put it in the ghost.config.js file.

Your repo should now be connected successfully to your local database and Ghost blog.

# Amazon S3

For development purposes all you need for Amazon S3 is a dummy config file as while in dev mode the server doesn't actually try connecting to Amazon's servers

`cp config/s3.config.example.js config/s3.config.js`

# Run build tool

For single build

```
npm run build
```

Or in watch mode (for active development)

```
npm run build:watch # or npm run build -- -w
```

You will find the results in the `./build/` and `./static/build/` folders (not pushed to git)

Make sure to keep watching the build window, in case there is
a syntax error or something else preventing builds. Your code will not
recompile if there are build errors

# Run Ghost Blog

Remember to run your Ghost blog before running the server so you can access the article data by running:
```
nvm use 4.2
npm start --production
```
in the database-and-ghost repository.

# Run server

You need to re-run the server to isomorphically serve the latest
version. However, if you are just changing frontend, you can choose
to not restart the server on change, and just refresh the page, and the frontend code will still
be up to date time. The isomorphism will be broken, but it's not
important for development.

```
npm start # or node build/server.js
```

If you are not restarting the server you may have to disable caching for refresh to work. There's an option in Chrome
dev tools to do this.

# Convenience setup

To manage your node versions it can be nice setting up some scripts, one way of doing that is using `virtualenv` and `virtualenvwrapper` that is normally used for Python development but can still be a nice tool. If you install these two packages a nice setup can be created by making two virtual environments as follows:

```
mkvirtualenv -a path/to/gazelle-server gazelle_server
mkvirtualenv -a path/to/database-and-ghost-blog-server gazelle_ghost
```

Where the last argument is the names of the virtual environments.

You can now setup some scripts to run when you `activate` these virtual environments. By adding the following to `~/.virtualenvs/gazelle_server/bin/postactivate`:

```bash
nvm use 9.3.0
```

and to `~/.virtualenvs/gazelle_server/bin/postactivate`:

```bash
nvm use 4.2
npm start --production # This is just personal preference as I only ever visit this repo to start the ghost blog
```

Now when you write `workon gazelle_server` from any directory your current working directory will move to the `gazelle-server` repo and the correct node version will be started for you.

When you write `workon gazelle_ghost` your current working directory will then move to the `database-and-ghost-blog-server` repo, the node version will be correctly changed and the server will start.

> NOTE: `workon` also has autocomplete functionality which is a nice detail

To exit any of these virtual environments at any point (though unless you're actually writing python the virtual env itself won't actually do anything, we're just using it as a nice way to write some postactivate scripts), just run `deactivate`.

# Note on linters and tests

Linting is included in webpack, so when building your code while developing check the linting errors to make sure you're following the recommended coding style.

We also have precommit hooks setup, so every time you make a commit both the linter and all relevant unit tests will be run to check you didn't break anything in your commit. If you ever need to make a temporary commit for any reason that either breaks the linter or tests (sometimes you need to save work for for example switching a branch and your current changes may be a work in progress) just use the `--no-verify` option with `git commit`.

If you ever want to run all the unit tests simply run

```
npm run test:unit
```

and for linting

```
npm run lint
```

# Fun Facts

## Isomorphism

This is served isomorphically. That means the initial render is
on the server, then the identical code is served to the client, and
the web browser client does subsequent renders. If you want to know
more about what isomorphism is, here's an article that might help:

[What is an isomorphic application?](https://www.lullabot.com/articles/what-is-an-isomorphic-application)

# Frequently Encountered Issues

* If you're unable to get the database running and receive the error `Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`, this means that the database server didn't automatically run on startup, run the command `mysqld &` to start the database server. This seems to happen often on MacOS

* MySQL error 1045 (you don't know what password was set)<br />
For Ubuntu - Download and Install synaptic package manager.
Using synaptic, remove all instances of mariadb. 
Then, follow this guide and completely remove MySQL. https://askubuntu.com/questions/640899/how-do-i-uninstall-mysql-completely. Reinstall mariadb and make sure to set a different password this time when prompted. Hopefully the error does not repeat.