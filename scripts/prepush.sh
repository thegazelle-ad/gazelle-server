#!/bin/bash

# Adapted from https://blog.ghost.org/prevent-master-push/

current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [[ "master" = $current_branch ]] || [[ "stable" = $current_branch ]]
then
    read -p "You're about to push $current_branch, is that what you intended? [y|n] " -n 1 -r < /dev/tty
    echo
    if echo $REPLY | grep -E '^[Yy]$' > /dev/null
    then
        exit 0 # push will execute
    fi
    exit 1 # push will not execute
else
    exit 0 # push will execute
fi
