#!/bin/bash

node "`dirname $0`/helperFiles/getGhostConfig.js"

if [ $? -e 0 ]
  then
    echo "successfully fetched Ghost API config"
    exit 0
fi
