FROM circleci/node:9.11.2

RUN sudo apt-get install mysql-client

RUN sudo npm i -g npm@6.1.0

RUN sudo npm i -g forever

# Install electron dependencies
RUN sudo apt-get update &&\
  sudo apt-get install -y libgtk2.0-0 libgconf-2-4 \
  libasound2 libxtst6 libxss1 libnss3 xvfb
