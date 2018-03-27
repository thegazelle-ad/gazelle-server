## March 27 2018 (related to issue #301 and the PRs associated with it)
- You will have to either download a new database dump or run `npm run db:migrate`
- You will have to re-copy the database config example file as I changed the format to JSON5 because there were some annoying things with importing it from the `knexfile.js` (be careful you don't check in the old `database.config.js` file into source control as it is no longer ignored by git)
- You can completely delete your Ghost repo! No need for it anymore! EVER!
- You should also remove your ghost config file
