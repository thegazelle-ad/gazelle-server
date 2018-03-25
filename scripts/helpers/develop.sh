nvm use 4 && cd ~/database-and-ghost-blog-server/ && npm start --production & sleep 2 && nvm use 9 && cd ~/gazelle-server/ && npm run build:watch & sleep 5 && npm start && fg && fg
