Firstly, just to reiterate, this is the guide to setup The Gazelle's server for production, you only need this if you are handling the main DevOps for The Gazelle, this is not related to normal development.

# Creating the server

At the time of writing we are using Digital Ocean. To setup a new Droplet you can follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-create-your-first-digitalocean-droplet). We are currently using one of the Ubuntu 16.04 "Flexible Droplets" with 2GB RAM and 2 vCPUs located in London.

# Initial Server Setup

Here is [a really good guide](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04) for setting up an Ubuntu 16.04 server initially (which is what we use), this is the recommended guide to follow regardless of whether the current provider is Digital Ocean or not. Remember to also follow the link about "common UFW operations" at the bottom to allow http(s) connections and possibly database connections from the staging server.

It is also handy to run

```
sudo apt update
```

we'll need that command to have been run for the future installations.

# Setting up git and connecting to Github

We use a Github "Machine User" as [described here](https://developer.github.com/v3/guides/managing-deploy-keys/#machine-users) with the username `gazelle-deployment-bot`. The login credentials can be found on the `nerds@thegazelle.org` LastPass account (which the lead engineers have access to). The `gazelle-deployment-bot` is an outside collaborator to the `thegazelle-ad` organization with read-only access to the repos it needs to use. Remember to add it as an outside collaborator to any new repos which may be needed, but only read-only as code should never be edited from the server (see [this guide](https://help.github.com/articles/adding-outside-collaborators-to-repositories-in-your-organization/), but as long as all the repos are public adding it as an outside collaborator shouldn't even be necessary).

Now install git

```
sudo apt install git
```

and then setup git

```
git config --global user.name "Gazelle Deployment Bot"
git config --global user.email nerds@thegazelle.org
# This one is just personal preference
git config --global core.editor vim
```

You should already have created an SSH key in the guide mentioned above, but in case you didn't it is also [described here](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/). Then you should [add the key](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) to the Github account of `gazelle-deployment-bot`.

# Install necessary programs

First install node, upgrade npm and install our necessary npm packages

```bash
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash - # At the time of writing we're using the newest version of node v9
sudo apt-get install -y nodejs
npm install -g npm@6.1 # You may want to use sudo here, also note this is just the version at the time of writing
npm install -g forever # Also may need to use sudo here
```

You will also need python2 for some of the npm packages to run and it doesn't ship with Ubuntu 16.0.4, you can probably install it in many ways but [here](https://askubuntu.com/a/831075) is a simple guide which basically consists of

```
sudo apt install -y python2.7
sudo apt install -y python-pip
sudo apt install -y python3-pip
sudo -H python2 -m pip install --upgrade pip
sudo -H python3 -m pip install --upgrade pip
```

# Reconfigure timezone

We run the server on UAE time, the easiest way to reconfigure the timezone is running

```
sudo dpkg-reconfigure tzdata
```

Which will take you through an interactive guide so you can set the timezone to `Asia/Dubai` (or Abu Dhabi, but I only found Dubai)

# Install the server

## Setting up simple dev environment

First clone the main repo

```bash
# We normally name the repo directory `server` as the command below will
git clone git@github.com:thegazelle-ad/gazelle-server.git server
```

Then (with the repo being your working directory, which you of course do by running `cd server`) run

```bash
# This is different from the npm install command and is more appropriate for deployment
npm ci
```

And then we just quickly want to disable the `postmerge` hook setup by Husky for development (and you might possibly want to disable others as well by doing something similar) by running

```bash
echo "#!/bin/sh" > .git/hooks/post-merge
```

You then just follow [the wiki page for setting up the server from the Setup Database section](../dev-environment/setting-up-dev-environment.md#setup-database) up until but not including [the build step](../dev-environment/setting-up-dev-environment.md#build-the-source-code) (which should just be setting up the database and environment variables). But remember to install the `stable` branch for production and `master` for staging!

## Production specific config/setup

### Amazon S3

In the dev setup you copied the dummy S3 config file `config/s3.config.js`, when setting up for production we also need actual credentials in that file. If you're simply migrating the server you can just copy the `s3.config.js` file from that server. If you're starting from scratch you'll need to generate a new pair of access keys which you do by going to your Amazon AWS account > My Security Credentials > Access Keys (Access Key ID and Secret Access Key) > Generate new key. And then you simply fill out the config file as is clearly outlined by the object.

### Generating static http error code pages

In order to not check in a lot of duplicate html pages we have written a short python generator that takes a template and creates specific error pages for each of the 5xx error codes. Generate these pages by simply running `python3 http-error-static-pages/5xx-static-html-generator.py` at the root of the `server` directory.

### Build the source

> NOTE: If you are setting this up on a server with a small amount of RAM you might want to setup swap space first or it might not be sufficient to build source

Now depending on whether you are setting up the staging or production server simply run

```
npm run build:staging
```

or

```
npm run build:production
```

in the root of the `server` directory.

# Update DNS

We use Cloudflare as our DNS provider. The lead engineers should have access to the login for it. Simply go here and update the IPs so they match the correct IPs for the production/staging server.

# Setup slack deployment bot

All you should have to do is clone [this repo](https://github.com/thegazelle-ad/slack-deployment-bot) into the home directory of your server and follow the README.

# Setup Swap Space

It is a good idea to setup swap space so that in case a huge load comes in (or we are deploying and therefore building source, Webpack takes up a lot of RAM!) our processes don't simply get killed. [this Digital Ocean guide](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04) details how to setup swap space. In our current setup on the production server we have bought a 2GB volume (very cheaply) so as to be nice to Digital Ocean and not setup swap space on the SSD and setup a 1.5GB swap file there. As the guide recommends we also changes the `swappiness` to 10 and the `vfs_cache_pressure` to 50.

# Setup deployment resources

Clone [this repo](https://github.com/thegazelle-ad/deployment-resources) to the root directory of your server and follow the instructions in the README.

# Run everything

First we start the main server:

```
cd ~/server
forever start --uid "server" build/server.js
```

Now startup a GNU Screen session (you can find a cheat sheet [here](http://neophob.com/2007/04/gnu-screen-cheat-sheet/), and several tutorials online). We recommend naming the session by for example running `screen -S main`. We also usually use the following `.screenrc` which you are welcome to setup

```
startup_message off
term screen-256color
hardstatus off
escape ^Ff
hardstatus alwayslastline
hardstatus string '%{= kG}[ %{G}%H %{g}][%= %{= kw}%?%-Lw%?%{r}(%{W}%n*%f%t%?(%u)%?%{r})%{w}%?%+Lw%?%?%= %{g}][%{B} %m-%d %{W} %c %{g}]'
vbell off
```

Note that if you use the above `.screenrc` the escape key will be `CTRL + f` instead of `CTRL + a`.

Now in the first window start Ghost:

```
cd ~/ghost
nvm use 4.2
npm start --production
```

Then open another window in the same screen session (`CTRL + f, c`) and start caddy

```
~/deployment-resources/scripts/run_caddy.sh
```

And then you can detach from the screen session (`CTRL + f, d`), to ever reattach to it (if you named it main) simply execute `screen -r main`.

# Connect to the CI

In order to let CircleCI know the IP/user etc. of your servers we need to set some environment variables. These are described as follows:

- `GAZELLE_SERVER_STAGING_USER`: The user we created for the staging Ubuntu server
- `GAZELLE_SERVER_STAGING_IP`: The IP for the staging Ubuntu server
- `GAZELLE_SERVER_PRODUCTION_USER`: The user we created for the production Ubuntu server
- `GAZELLE_SERVER_PRODUCTION_IP`: The IP for the production Ubuntu server

Also remember to add the CI ssh public key to the `.ssh/authorized_keys` file on the server to allow CircleCI to access it

# Done!

Congratulations! The server should now be setup and running on the relevant domain names, and all dev support such as CI and Slack integration should be working as well! Hope you don't have any stupid bugs to hunt down, and if you do please update this document to help future server admins.
