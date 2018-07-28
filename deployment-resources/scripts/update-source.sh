#!/bin/bash

function error {
  ERROR_MESSAGE=$1
  echo $ERROR_MESSAGE >&2
  node $SEND_TO_SLACK_SCRIPT "Deploying $GAZELLE_ENV failed: $ERROR_MESSAGE"
  exit 1
}

DIRECTORY=$(dirname ${BASH_SOURCE[0]})
SEND_TO_SLACK_SCRIPT="$DIRECTORY/helpers/send-to-slack.js"

source $DIRECTORY/source-environment.sh

# Tell Slack that we're starting deployment
if [ "$GAZELLE_ENV" == "staging" ]
then
  node $SEND_TO_SLACK_SCRIPT "Starting deployment to staging.thegazelle.org, and staging.admin.thegazelle.org"
fi
if [ "$GAZELLE_ENV" == "production" ]
then
  node $SEND_TO_SLACK_SCRIPT "Starting deployment to www.thegazelle.org, and admin.thegazelle.org"
fi
if [ $? -ne 0 ]
  then
    echo "Error posting to slack" >&2
    exit 1
fi

# Go to the main repo
cd "$HOME/server" || error "Couldn't cd into main repo"

# Checkout relevant branch
if [ "$GAZELLE_ENV" == "staging" ]
then
  git checkout master
fi
if [ "$GAZELLE_ENV" == "production" ]
then
  git checkout stable
fi
[[ $? -eq 0 ]] || error "Couldn't git checkout the branch"

# Pull the latest source
git pull || error "Couldn't pull new source"

# Install the latest dependencies
npm ci || error "couldn't install latest dependencies"

# Make sure nothing changed
[[ "$(git diff)" != "" ]] && error "Source unexpectedly changed during update"

# Build the new source
npm run "build:$GAZELLE_ENV" || error "Couldn't build source"

# Migrate database, important that we do this just before restarting server
# so that the database isn't incompatible for too long in case we did any
# breaking change migrations
npm run db:migrate || error "Couldn't migrate database"

# If we are on the staging server then we should also run the new seed to
# make sure we have the latest dummy data. VERY IMPORTANT NOT TO RUN
# THIS ON PRODUCTION. It would delete the production database (we
# of course have backups but let's not have to use them)
[[ $GAZELLE_ENV == "staging" ]] && (npm run db:seed || error "Couldn't run DB seed")

# Restart the server so it runs the new code
forever restart server || error "Couldn't restart server"

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
