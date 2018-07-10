#!/bin/bash

# Tell Slack that we're starting deployment
if [ "$GAZELLE_ENV" == "staging" ]
then
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Starting deployment to staging.thegazelle.org, and staging.admin.thegazelle.org"
fi
if [ "$GAZELLE_ENV" == "production" ]
then
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Starting deployment to www.thegazelle.org, and admin.thegazelle.org"
fi
if [ $? -ne 0 ]
  then
    echo "Error posting to slack" >&2
    exit 1
fi

# Go to the main repo
cd "$HOME/server"
if [ $? -ne 0 ]
then
  echo "couldn't find folder" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: Couldn't cd into main repo"
  exit 1
fi

# Checkout relevant branch
if [ "$GAZELLE_ENV" == "staging" ]
then
  git checkout master
fi
if [ "$GAZELLE_ENV" == "production" ]
then
  git checkout stable
fi
if [ $? -ne 0 ]
then
  echo "Git checkout failed" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: couldn't git checkout the branch"
  exit 1
fi

# Pull the latest source
git pull
if [ $? -ne 0 ]
then
  echo "Git pull failed" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: couldn't pull new source"
  exit 1
fi

# Install the latest dependencies
npm install
if [ $? -ne 0 ]
then
  echo "npm install failed" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: couldn't install new dependencies"
  exit 1
fi

# Make sure nothing changed
if [ "$(git diff)" != "" ]
then
  echo "source changed during update" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: source changed during update"
  exit 1
fi

# Build the new source
if [ "$GAZELLE_ENV" == "staging" ]
then
  npm run build:staging
fi
if [ "$GAZELLE_ENV" == "production" ]
then
  npm run build:production
fi
if [ $? -ne 0 ]
then
  echo "build failed" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: couldn't build source"
  exit 1
fi

# Restart the server so it runs the new code
forever restart server
if [ $? -ne 0 ]
then
  echo "server restart failed" >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "Deploying $GAZELLE_ENV failed: couldn't restart server"
  exit 1
fi

# Announce the deployment success
cd ..
if [ "$GAZELLE_ENV" == "staging" ]
then
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "staging.thegazelle.org and staging.admin.thegazelle.org were deployed successfully!"
fi
if [ "$GAZELLE_ENV" == "production" ]
then
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "www.thegazelle.org and admin.thegazelle.org were deployed successfully!"
fi
if [ $? -ne 0 ]
  then
    echo "Error posting to slack" >&2
    exit 1
fi
echo "Deployed successfully"
