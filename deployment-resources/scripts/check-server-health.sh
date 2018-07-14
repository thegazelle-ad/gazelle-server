#!/bin/bash

if [[ $# -ne 1 ]];
then
  echo "Incorrect usage"
  echo "Correct usage: $0 <slack_channel_to_post_to>"
  exit 1
fi

DIRECTORY=$(dirname ${BASH_SOURCE[0]})
source $DIRECTORY/source-environment.sh

SLACK_CHANNEL=$1

curl -f http://localhost:8001/alive &> /dev/null

if [[ $? -ne 0 ]];
then
  # Server is down
  forever restartall

  # Notify Slack channel
  node "$DIRECTORY/helpers/send-to-slack.js" "$SLACK_CHANNEL" "The $GAZELLE_ENV server stopped responding and was restarted"
  if [[ $? -ne 0 ]];
  then
    echo "Slack Deployment Bot failed"
    exit 1
  fi
fi

curl -f http://localhost:8001 -m 5 &> /dev/null

if [[ $? -ne 0 ]];
then
  # Server is down
  forever restartall

  # Notify Slack channel
  node "$DIRECTORY/helpers/send-to-slack.js" "$SLACK_CHANNEL" "The $GAZELLE_ENV server stopped responding and was restarted"
  if [[ $? -ne 0 ]];
  then
    echo "Slack Deployment Bot failed"
    exit 1
  fi
fi
