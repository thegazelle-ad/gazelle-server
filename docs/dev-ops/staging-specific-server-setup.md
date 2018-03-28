>**ATTENTION**: This is not for normal dev setup, only for setting up the actual staging server, and it is intended to be used in conjunction with https://github.com/thegazelle-ad/gazelle-server/wiki/Setting-Up-The-Server-(DevOps)

This guide is only meant for the case when you are setting up the staging server on a separate machine, if you are setting up both staging and production on the same machine you should be able to follow the guide linked to above, and not read any further.

# Staging specific deviations / additions
- You don't need to install the Ghost repo at all (this includes installing MariaDB, no need to look at the README of that repo at all)
- You don't need to setup database backups (assuming this is setup on the production server)
- You will need to setup a new user on the mysql database of the production server that corresponds to the host of the ip of the staging server (see [this guide](https://support.rackspace.com/how-to/mysql-connect-to-your-database-remotely/)
- You will need to make mysql listen on your public IP (on the production server), the easiest way is to make it listen to the wildcard IP `0.0.0.0`, you do this by making the `bind-address` in your `my.cnf` file `0.0.0.0`. See [this SO answer](https://stackoverflow.com/a/2485758/5711883) for directions on how to find this file. After changing it you will have to restart mysql which is described how to do in [this SO answer](https://superuser.com/a/282145)
- You will need to make Ghost listen on the public IP, which again is easiest by making it listen to the wildcard. So in your production server's Ghost repository you should change the `BLOG_HOST` variable in the `config.js` file to `0.0.0.0`
- You will have to update the `ufw` firewall rules on the production server to allow incoming connections for both mysql and Ghost. You can see how to update it for mysql [here](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands#service-mysql). And you should be able to do something very similar by just changing the port number to the port you run Ghost on on the production server (currently 8003)

Other than this you should be able to just follow [the normal guide](https://github.com/thegazelle-ad/gazelle-server/wiki/Setting-Up-The-Server-(DevOps)) and have everything setup so the staging server connects to the main database!