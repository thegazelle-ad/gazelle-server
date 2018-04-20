If you encounter unexpected errors during setup, or later during usage, see the `Frequently Encountered Errors` section at the bottom of this page.

Also, if not obvious, all instructions in this setup guide assume that you have already cloned [this repo](https://github.com/thegazelle-ad/gazelle-server) which the repo is located in, and that your current working directory is this repo.

# Install

Make sure you have NodeJS and npm installed

You can [install nodejs and npm via nvm](https://github.com/creationix/nvm), feel free to install it any other way, but nvm is a nice way to manage your node versions if you work on different projects that use different versions.

> **IMPORTANT**: For this repo we use **node v9.11.1** and **npm 5.6.0**. Use any other versions at your own peril.

Then install dependencies locally

```
npm install
```

# Setup Database
You should first install MariaDB, which can be done here: https://downloads.mariadb.org/mariadb/repositories. Simply follow the instructions to download MariaDB if you are using Linux. We use 10.1 in production / CircleCI so that's the recommended version. If you are not using Linux you should easily be able to Google how to download it for your operating system. If you are only setting up for development and not for deployment you can also use MySQL which is also 100% compatible.

After having installed MariaDB (or MySQL) setting up a development database should be as easy as running these three commands:

```bash
mysql -u root -p -e 'create database the_gazelle character set utf8'
npm run db:migrate
npm run db:seed
```

When running the first command it will ask you for your password for the database client which should have been set during installation of MariaDB/MySQL. It may also just be empty, in which case you can try running the first command without the `-p` flag.

When this is done copy database.config.example.json5 (it is in the config folder) to its non-example counterpart, you would do this as follows in bash:

```
cp config/database.config.example.json5 config/database.config.json5
```

It is important that you name it exactly as specified above.

Now change the config as necessary. The most important is the password and database name of the database being used in database.config.js. Most likely all you will have to change is the password though.

Your database should now be set up!

# Amazon S3

For development purposes all you need for Amazon S3 is a dummy config file as while in dev mode the server doesn't actually try connecting to Amazon's servers

`cp config/s3.config.example.js config/s3.config.js`

# Run build tool

For single build

```
npm run build
```

Or in watch mode (for active development), which will continously rebuild in a few seconds every time you change any code.

```
npm run build:watch
```

You will find the results in the `./build/` and `./static/build/` folders (not pushed to git)

Make sure to keep watching the build window, in case there is a syntax error or something else preventing builds. Your code will not recompile if there are build errors.

# Run server

You need to re-run the server every time the code is rebuilt to serve the latest version. However, if you are just changing frontend, you can choose to not restart the server on change, and just refresh the page, and the frontend code will still be up to date time. The isomorphism will be broken, but it's not important for development.

```
npm start
```

If you are not restarting the server you may have to disable caching for refresh to work. There's an option in Chrome dev tools to do this.

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

This is served isomorphically. That means the initial render is on the server, then the identical code is served to the client, and the web browser client does subsequent renders. If you want to know more about what isomorphism is, here's an article that might help:

[What is an isomorphic application?](https://www.lullabot.com/articles/what-is-an-isomorphic-application)

# Frequently Encountered Issues

* If you're unable to get the database running and receive the error `Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`, this means that the database server didn't automatically run on startup, run the command `mysqld &` to start the database server. This seems to happen often on MacOS

* MySQL error 1045 (you don't know what password was set)<br /> For Ubuntu - Download and Install synaptic package manager. Using synaptic, remove all instances of mariadb. Then, follow this guide and completely remove MySQL. https://askubuntu.com/questions/640899/how-do-i-uninstall-mysql-completely. Reinstall mariadb and make sure to set a different password this time when prompted. Hopefully the error does not repeat.
