FROM circleci/node:9.3.0

# We update to npm 5.6.0 since 5.5 breaks node 9
# This weird workaround is taken from https://github.com/npm/npm/issues/15611
RUN sudo npm install npm@5.6.0
RUN sudo rm -rf /usr/local/lib/node_modules package.json package-lock.json
RUN sudo mv node_modules /usr/local/lib

RUN sudo apt-get install mysql-client

RUN sudo npm i -g forever

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

# Enable NVM and install node 4.2
ENV NVM_DIR /home/circleci/.nvm
# We need to be in bash to call nvm
RUN ["/bin/bash", "-c", ". $NVM_DIR/nvm.sh && nvm install 4.2"]

# Remove the auto load nvm commands from the bashrc
RUN head --lines=-3 ${HOME}/.bashrc > ${HOME}/tmp.txt
RUN mv ${HOME}/tmp.txt ${HOME}/.bashrc

# Install electron dependencies
RUN sudo apt-get update &&\
    sudo apt-get install -y libgtk2.0-0 libgconf-2-4 \
        libasound2 libxtst6 libxss1 libnss3 xvfb
