#!/bin/bash

IS_NUM_REGEX="^[0-9]+$"

NOTIFICATION_LOG_PATH=~/.memory_low_notified.txt

if ! [[ $# -eq 2 && $2 =~ $IS_NUM_REGEX ]];
then
  echo "Incorrect usage"
  echo "Correct usage: ./check_free_memory.sh <slack_channel_to_post_to> <memory_limit_to_check>"
  exit 1
fi

SLACK_CHANNEL=$1
MEMORY_LIMIT=$2

MEMORY_FREE=$(free -m | grep Mem | awk '{print $7}')

if [[ "$MEMORY_FREE" -le "$MEMORY_LIMIT" ]];
then
  # The option makes date return the time in seconds since 1st of January 1970 which
  # is easy to work with for calculations
  CURRENT_TIME=$(date +"%s")
  # Check if there is any notification log present
  if [[ -f "$NOTIFICATION_LOG_PATH" ]];
  then
    NOTIFICATION_TIME=$(cat "$NOTIFICATION_LOG_PATH" | awk '{print $1}')
    NOTIFICATION_MEMORY_FREE=$(cat "$NOTIFICATION_LOG_PATH" | awk '{print $2}')
    TEN_MINUTES=$((60 * 10))
    # If notification was more than 10 minutes ago we disregard it and delete the log
    if [[ $((CURRENT_TIME - NOTIFICATION_TIME)) -gt "$TEN_MINUTES" ]];
    then
      rm "$NOTIFICATION_LOG_PATH"
    # If memory free in last notification was more than 50MB more than it is now we want to notify again
    # else we exit now as there is nothing new to tell
    else
      if [[ $((MEMORY_FREE + 50)) -ge "$NOTIFICATION_MEMORY_FREE" ]];
      then
        # Exit gracefully
        exit 0
      fi
    fi
  fi

  # Log that we have notified the channel at the current limit at the current time
  echo "$CURRENT_TIME $MEMORY_FREE" > "$NOTIFICATION_LOG_PATH"

  TOP_MEMORY_CONSUMING_PROCESSES=$(ps -eo pid,ppid,cmd:5000,%mem,%cpu --sort=-%mem | head)
  # Newlines here are on purpose for formatting
  ALERT_MESSAGE="*The ${GAZELLE_ENV} server only has ${MEMORY_FREE}MB free in main memory.*

The top consuming processes are:

>>> ${TOP_MEMORY_CONSUMING_PROCESSES}"
  # Notify Slack channel
  node "$SLACK_DEPLOYMENT_BOT_DIRECTORY/index.js" "$SLACK_CHANNEL" "$ALERT_MESSAGE"
  if [[ $? -ne 0 ]];
  then
    echo "Slack Deployment Bot failed"
    exit 1
  fi
fi
