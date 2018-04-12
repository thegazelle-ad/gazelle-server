#!/bin/bash

# First create the database that we are going to populate
mysql --protocol=TCP --user=root -pcircleci_test_gazelle -D the_gazelle -e 'create database the_gazelle'

# Create the structure of our database
npm run db:migrate

# Populate the database with test data
npm run db:seed
