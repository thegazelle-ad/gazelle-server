#!/bin/bash

# Run our server
cd ~/gazelle-server

npm start &> /dev/null &

SERVER_PID=$(echo $!)

echo "Gazelle server started"

# Run Ghost blog
cd ~/database-and-ghost-blog-server

# Activate node 4.2
. ~/.nvm/nvm.sh

npm start --production &> /dev/null &

GHOST_PID=$(echo $!)

echo "Ghost server started"

# Go back to default node version
nvm deactivate &> /dev/null

# Return to main repo
cd ~/gazelle-server

# Wait for servers to start
IS_UP=1
while [ $IS_UP -ne 0 ]
do
  sleep 0.5
  curl -f http://localhost:8001/alive &> /dev/null
  IS_UP=$(echo $?)
done
# Now the server is running
echo "Gazelle server is responding"

IS_UP=1
while [ $IS_UP -ne 0 ]
do
  sleep 0.5
  curl -f http://localhost:2368/ghost/api/v0.1/ &> /dev/null
  IS_UP=$(echo $?)
done
# Now Ghost and therefore everything is running
echo "Ghost server is responding"

# Just an initial dummy test until we implement proper ones
echo "Starting test"

curl http://localhost:8001

# Cleanup
echo "Tests finished, starting cleanup"

kill $SERVER_PID
kill $GHOST_PID

# We also have to kill the node processes that they spawn
ps -a | grep node | awk '{print $1}' | xargs kill
