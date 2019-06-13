# ckp

The Project Server is to be Run on an Ubuntu based machine as few dependencies are available only on Ubuntu. The server is built on Ubuntu 18.04.02. 

After cloning the project, run the below commands to setup the dependencies for npm.

## Dependencies - execute in CLI/shell

# install pkg-config:
```
sudo apt install pkg-config
```
# install poppler and cairo:
```
sudo apt install libpoppler-qt5-dev libcairo2-dev
```

## npm Init(assuming nodejs is installed):
```
npm install
```

After ```npm install```, there should not be any error.

Before proceeding further, please make sure to setup permissions(through firewall) to access contents in both the databases. Use the Public IP Address of the machine on which server is inteded to run. 
## Databases:
1. MYSQL
2. MongoDB

## To run the server:
cd to the directory server/
# start the server:
```
node server.js
```
# Expected message:
	CKP Server Running on port xxxxx
	Connected to MongoDB server
	Connected to mysql Server

# Open in Web-Browser
Open browser of your choice and type in ```ip:port``` to get to index.html page

## User credentials based on RBAC
1. Super Admin
	username:`sadmin@esl.com`
	password:`qwe`
1. Admin
	username:`admin@esl.com`
	password:`qwe`
1. Sales
	username:`sales@esl.com`
	password:`qwe`
