#!/bin/bash

DIRECTIVE=$(dirname $0)

mysqldump -u "$DATABASE_USER" -p"$DATABASE_PASSWORD" "$DATABASE_NAME" > "$DIRECTIVE"/helpers/temp.dump

if [ $? -ne 0 ]
then
  ERROR_MESSAGE="Creating database dump failed"
  echo $ERROR_MESSAGE >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" error-logging "$GAZELLE_ENV server: $ERROR_MESSAGE"
  exit 1
fi


node $DIRECTIVE/helpers/upload-database-dump.js $DIRECTIVE/helpers/temp.dump

if [ $? -ne 0 ]
then
  ERROR_MESSAGE="Uploading database dump failed"
  echo $ERROR_MESSAGE >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" error-logging "$GAZELLE_ENV server: $ERROR_MESSAGE"
  exit 1
fi

rm $DIRECTIVE/helpers/temp.dump

if [ $? -ne 0 ]
then
  ERROR_MESSAGE="Removing database dump file failed"
  echo $ERROR_MESSAGE >&2
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" error-logging "$GAZELLE_ENV server: $ERROR_MESSAGE"
  exit 1
fi

node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "$GAZELLE_ENV server: Database backup successfully completed"
