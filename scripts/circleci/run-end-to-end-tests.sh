#!/bin/bash

# Run our server
cd ~/gazelle-server

forever start build/server.js &> /dev/null

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
  curl -f http://localhost:3000/alive &> /dev/null
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

# Run display needed for nightmare that we use for E2E tests
sudo Xvfb -ac -screen scrn 1280x2000x24 :9.0 &
SCREEN_PID=$(echo $!)
export DISPLAY=:9.0

echo "Starting test"

npm run test:e2e
EXIT_CODE=$(echo $?)

# Cleanup
echo "Tests finished, starting cleanup"

forever stopall

kill $GHOST_PID
kill $SCREEN_PID

# We also have to kill the node processes that they spawn
ps -a | grep node | awk '{print $1}' | xargs kill
exit $EXIT_CODE
