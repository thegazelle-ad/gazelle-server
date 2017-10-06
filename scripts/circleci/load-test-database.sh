#!/bin/bash
mysql --protocol=TCP --user=root -pcircleci_test_gazelle -D the_gazelle < ./scripts/circleci/helpers/test.dump
