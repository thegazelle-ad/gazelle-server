#!/bin/bash

# Increase maximum amount of file descriptors available, recommended for production
ulimit -n 8192
# Run the server
sudo "$DEPLOYMENT_RESOURCES_DIRECTORY/caddy/caddy" -conf "$DEPLOYMENT_RESOURCES_DIRECTORY/config/$GAZELLE_ENV.caddy"
