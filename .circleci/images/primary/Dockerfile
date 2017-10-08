FROM circleci/node:7.10

RUN sudo apt-get install mysql-client

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

# Enable NVM and install node 4.2
ENV NVM_DIR /home/circleci/.nvm
# We need to be in bash to call nvm
RUN ["/bin/bash", "-c", ". $NVM_DIR/nvm.sh && nvm install 4.2"]

# Remove the auto load nvm commands from the bashrc
RUN head --lines=-3 ${HOME}/.bashrc > ${HOME}/tmp.txt
RUN mv ${HOME}/tmp.txt ${HOME}/.bashrc
