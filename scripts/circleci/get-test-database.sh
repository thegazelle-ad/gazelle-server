#!/bin/bash
node ./scripts/circleci/helpers/get-test-database-dump.js
if [ $? -ne 0 ]
  then
    exit 1
fi

mysql --protocol=TCP --user=root -pcircleci_test_gazelle -D the_gazelle < ./scripts/circleci/helpers/test.dump
if [ $? -ne 0 ]
  then
    exit 1
fi

rm ./scripts/circleci/helpers/test.dump
