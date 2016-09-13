#!/bin/bash

# To get your own nodePath run `which node` in your terminal and copy the output
# to the nodePath variable
nodePath=""
# Enter the name of the mariaDB database to dump from here.
databaseName=""
directive=$(dirname $0)

# printf "Dumping database temporarily to temp.dump\n"
mysqldump -u root -ppassword "$databaseName" > "$directive/helperFiles/temp.dump"
# printf "\ndump successful\n"
# printf "\ninitiating database backup\n"
eval "$nodePath $directive/helperFiles/uploadDatabaseDump.js $directive/helperFiles/temp.dump"
# printf "\nbackup complete\n"
rm "$directive/helperFiles/temp.dump"
# printf "\ntemp.dump deleted\n"
# printf "\nScript terminating\n"
