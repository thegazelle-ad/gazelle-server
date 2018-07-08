#!/bin/bash

# Setup functions we'll use below

function print_logs {
  forever list --no-colors | grep build/server | awk '{print $8}' | xargs cat
}

function check_server_alive {
  # Wait for servers to start
  IS_UP=1
  MAX_SERVER_RETRIES=30
  while [ $IS_UP -ne 0 ]
  do
    sleep 0.5
    curl -f http://localhost:3000/alive &> /dev/null
    IS_UP=$(echo $?)
    let "MAX_SERVER_RETRIES--"
    if [[ $MAX_SERVER_RETRIES -eq 0 ]]
    then
      echo "Server seems to not be responding, printing logs below"
      print_logs
      exit 1
    fi
  done
  # Now the server is running
  echo "Gazelle server is responding"
}

function run_test {
  # Clean up state in between
  forever restartall
  # db:seed is run by the package.json script so not needed
  check_server_alive
  npm run test:e2e -- --ci
}

# Prep the database

# First create the database that we are going to populate
mysql --protocol=TCP --user=root -pcircleci_test_gazelle -D the_gazelle -e 'create database the_gazelle'

# Create the structure of our database
npm run db:migrate


# Run our server
cd ~/gazelle-server

forever start build/server.js &> /dev/null

echo "Gazelle server started"

# Run display needed for nightmare that we use for E2E tests
sudo Xvfb -ac -screen scrn 1280x2000x24 :9.0 &
SCREEN_PID=$(echo $!)
export DISPLAY=:9.0

echo "Starting testing"

# Initialize variable
EXIT_CODE=1
MAX_TEST_RETRIES=3
while [[ $EXIT_CODE -ne 0 ]] && [[ $MAX_TEST_RETRIES -ne 0 ]]
do
  echo "$MAX_RETRIES left"
  run_test
  EXIT_CODE=$(echo $?)
  let "MAX_TEST_RETRIES--"
done

if [[ $EXIT_CODE -ne 0 ]]
then
  echo "Printing logs since test failed"
  print_logs
fi

# Cleanup
echo "Tests finished, starting cleanup"

forever stopall

sudo kill $SCREEN_PID

# We also have to kill the node processes that they spawn
ps -a | grep node | awk '{print $1}' | xargs sudo kill
exit $EXIT_CODE
