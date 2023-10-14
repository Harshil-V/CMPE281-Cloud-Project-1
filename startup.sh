#!/bin/bash -ex
# Update and Upgrade
sudo apt-get update && sudo apt-get upgrade -y
# Download - NVM 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc
# install node
nvm install v18.8.0

#upgrade yum
sudo apt remove nodejs

sudo apt purge nodejs
# get source code from githubt
git clone https://github.com/Harshil-V/CMPE281-Cloud-Project-1
#get in project dir
cd server
#give permission
sudo chmod -R 755 .
#install node module
npm install
# start the app
node server.js > app.out.log 2> app.err.log < /dev/null &