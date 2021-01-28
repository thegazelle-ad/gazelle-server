If you encounter unexpected errors during setup, or later during usage, see the [`Frequently Encountered issues`](#frequently-encountered-issues) section at the bottom of this page.

You should read this guide very carefully, if you are encountering issues it is most likely because you missed a step in the guide because of skimming or not following a URL you had to follow. All the URLs linked to are important, and it's in most cases assumed that you go to the URLs linked and follow instructions there before coming back and continuing the guide. In case you do find that something was missing or unclear in this guide though, and you either figure out the issue yourself or reach out for help from the lead developers, please submit a pull request editing this guide so that future new developers won't encounter the same issue.

Also, if not obvious, all instructions in this setup guide assume that you have already cloned [this repo](https://github.com/thegazelle-ad/gazelle-server) which the repo is located in, and that your current working directory is this repo. To do so, navigate to the directory where you would like to keep your working copy of The Gazelle, then clone.

```bash
git clone https://github.com/thegazelle-ad/gazelle-server
cd gazelle-server
```

# SSH + Github

Some npm packages require ssh authentication. Follow this guide to connect SSH with Github.
(https://help.github.com/articles/connecting-to-github-with-ssh/)

# Install

Make sure you have NodeJS and npm installed

You can [install nodejs and npm via nvm](https://github.com/creationix/nvm), feel free to install it any other way, but nvm is a nice way to manage your node versions if you work on different projects that use different versions. We also have a [`.nvmrc`](../../.nvmrc) file so when you `cd` into the directory of the repo, you can just run `nvm use` to change to our version, or `nvm install` both without any arguments as it finds it in `.nvmrc` and it'll install the correct version.

> **IMPORTANT**: For this repo we use **node v9.11.2** and **npm 6.1.0**. Use any other versions at your own peril. Note that the default npm version with node `9.11.2` is `5.6.0` so you'll have to install the npm version manually `npm i -g npm@6.1.0`.

Then install dependencies locally

```
npm install
```

# Setup Database

You should first install MariaDB, which for Linux can be done here: https://downloads.mariadb.org/mariadb/repositories, and a guide for MacOS is here: https://mariadb.com/kb/en/library/installing-mariadb-on-macos-using-homebrew/. Follow the installation steps found on the guide, except for the last step: 'sudo apt install mariadb-server'. Run 'sudo apt install mariadb-server-10.2' instead as we use version 10.2 of MariaDB in production / CircleCI so that's the recommended version. We recommend using either a Linux distribution or MacOS as your operating system when developing for The Gazelle. If you are only setting up for development and not for deployment you can also use MySQL which is 100% compatible.

After running the final apt install command, you should see a pink screen on your terminal asking you to set a password for the database. You can choose to set a password or leave it blank. After having installed MariaDB (or MySQL) we can create the database that we will use with The Gazelle:

```bash
mysql -u root -p -e 'create database the_gazelle'
```

When running the command it will ask you for your password for the database client which should have been set during installation of MariaDB/MySQL. It may also just be empty, in which case you can try running the first command without the `-p` flag, or just press enter without entering anything into the password prompt.

> NOTE: This is one of the places some people encounter errors where they somehow didn't get prompted to set a password when installing MariaDB and then the password ends up being unknown, the [`Frequently Encountered issues`](#frequently-encountered-issues) section has some tips on solving this issue.

Before we can finish the setup of our newly created database, we just need to setup some config variables.

# Setup config

Before you can run certain database commands or build the code you need to specify some environment specific configurations such as what the name and password of your database is, and which ports to run the servers on. Luckily we have written a nice little interactive script that should guide you through this, so you should just have to run

```bash
node setup-env.js
```

and you should be guided through the rest. In case you encounter issues with it, it would firstly be great if you submit a PR with a fix when you find out what was wrong, but you can also pretty easily manually setup the configuration by running

```bash
cp .sample-env .env
```

and filling out everything manually. This is basically what the setup script does for you.

Also note that if you already have an up to date `.env` file stored somewhere else you should be able to just copy it in (such as if you're changing computers or migrating the servers to a new provider etc.)

# Finish Database Setup

Now everything should be ready to populate the database we created earler by simply running these two commands

```bash
npm run db:migrate
npm run db:seed
```

# Run build tool

For single build

```
npm run build
```

Or in watch mode, which will continously rebuild in a few seconds every time you change any code (this is the recommended way to build while developing).

```
npm run build:watch
```

You will find the results in the `./build/` and `./static/build/` folders (not pushed to git)

Make sure to keep watching the build window, in case there is a syntax error or something else preventing builds. Your code will not recompile if there are build errors.

# Run server

You need to re-run the server every time the code is rebuilt to serve the latest version. However, if you are just changing frontend code, and not anything in the server files, you can choose to not restart the server on change, and just refresh the page. In this case the frontend code will still be up to date. The isomorphism will be broken (which means the serverside and client side renders will be different), but it's not important for development.

```
npm start
```

You should now be able to go to `localhost:3000` and `localhost:4000` in your browser to see your local copy of The Gazelle and our admin interface! Just because you have it running now don't stop reading though, the below is also important information!

# Note on linters and tests

Linting is included in webpack, so when building your code while developing check the linting errors to make sure you're following the recommended coding style.

You also want to make sure that tests are always passing (and that you write tests yourself for the code you develop so we can ship with confidence).

If you ever want to run all the unit tests simply run

```
npm run test:unit
```

and for linting

```
npm run lint:all
```

There's also a nice trick if you have a lot of linting errors you don't want to fix where you can simply run

```
npm run lint:all:fix
```

and it'll automatically fix all the errors that auto fix is implemented for (which is most of the formatting related ones)

> NOTE: We actually have 3 types of linting, ESLint for javascript TSLint for Typescript and Prettier for code formatting, and each of them can be run as follows (and all of them can be postfixed with `:fix` like above):

```bash
npm run lint:js
npm run lint:ts
npm run lint:prettier
```

# Git hooks

We have both precommit and postmerge hooks setup. For the precommit hook this means that every time you make a commit both the linter and all relevant unit tests will be run to check you didn't break anything in your commit. If you ever need to make a temporary commit for any reason that either breaks the linter or tests (sometimes you need to save work for for example switching a branch and your current changes may be a work in progress) just use the `--no-verify` option with `git commit`.

For the postmerge hook this automatically runs `npm install` to check whether any new dependencies were added, followed by `npm run db:migrate` to check that you have the newest version of the database. This is just added for convenience as many a build has failed because people forgot to run `npm install` after pulling / merging in master. You of course will still have to rebuild (if you're not already running `npm run build:watch`) as the code and dependencies may have changed, and probably restart the server as well if the database has changed.

# Fun Facts

## Isomorphism

This is served isomorphically. That means the initial render is on the server, then the identical code is served to the client, and the web browser client does subsequent renders. If you want to know more about what isomorphism is, here's an article that might help:

[What is an isomorphic application?](https://www.lullabot.com/articles/what-is-an-isomorphic-application)

# Frequently Encountered Issues

- If you're unable to get the database running and receive the error `Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`, this means that the database server didn't automatically run on startup, run the command `mysqld &` to start the database server. This seems to happen often on MacOS

- MySQL error 1045 (you don't know what password was set)<br />
  Hopefully the 2 approaches described here should be sufficient https://linuxconfig.org/how-to-reset-root-mysql-password-on-ubuntu-18-04-bionic-beaver-linux at least for Ubuntu.<br />
  For very dire circumstances on Ubuntu this may help: Download and Install synaptic package manager. Using synaptic, remove all instances of mariadb. Then, follow this guide and completely remove MySQL. https://askubuntu.com/questions/640899/how-do-i-uninstall-mysql-completely. Reinstall mariadb and make sure to set a different password this time when prompted. Hopefully the error does not repeat.
