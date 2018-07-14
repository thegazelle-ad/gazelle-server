#!/bin/bash

function error {
  ERROR_MESSAGE=$1
  echo $ERROR_MESSAGE >&2
  node $DIRECTORY/send-to-slack.js error-logging "$GAZELLE_ENV server: $ERROR_MESSAGE"
  exit 1
}

DIRECTORY=$(dirname ${BASH_SOURCE[0]})
DUMP_PATH=$DIRECTORY/helpers/temp.dump

source $DIRECTORY/source_environment.sh

mysqldump -u $DATABASE_USER -p$DATABASE_PASSWORD $DATABASE_NAME > $DUMP_PATH || error "Creating database dump failed"

node $DIRECTORY/helpers/upload-database-dump.js $DUMP_PATH || error "Uploading database dump failed"

rm $DUMP_PATH || error "Removing database dump file failed"

node "$DIRECTORY/send-to-slack.js" "$GAZELLE_ENV server: Database backup successfully completed"
