#!/bin/bash

function error {
  ERROR_MESSAGE=$1
  echo $ERROR_MESSAGE >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" error-logging "$GAZELLE_ENV server: $ERROR_MESSAGE"
  exit 1
}

DIRECTORY=$(dirname ${BASH_SOURCE[0]})
DUMP_PATH=$DIRECTIVE/helpers/temp.dump

source $DIRECTIVE/source_env.sh

mysqldump -u $DATABASE_USER -p$DATABASE_PASSWORD $DATABASE_NAME > $DUMP_PATH || error "Creating database dump failed"

node $DIRECTIVE/helpers/upload-database-dump.js $DUMP_PATH || error "Uploading database dump failed"

rm $DUMP_PATH || error "Removing database dump file failed"

node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "$GAZELLE_ENV server: Database backup successfully completed"
