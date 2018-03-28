#!/bin/bash
mysql --protocol=TCP --user=root -pcircleci_test_gazelle -D the_gazelle < ./scripts/circleci/helpers/test.dump

# This is a hack to make the CI work until we actually provide it with a new database dump with the correct schema
npm run db:migrate
