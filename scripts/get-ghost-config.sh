#!/bin/bash

node "`dirname $0`/helpers/get-ghost-config.js"
if [ $? -ne 0 ]
  then
    exit 1
fi

echo "successfully fetched Ghost API config"
