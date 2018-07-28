#!/bin/bash

DIRECTORY=$(dirname ${BASH_SOURCE[0]})
source $DIRECTORY/source-environment.sh

# Increase maximum amount of file descriptors available, recommended for production
ulimit -n 8192
# Run the server
sudo caddy -conf "$DIRECTORY/../config/$GAZELLE_ENV.caddy"
