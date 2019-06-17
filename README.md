# ckp

The Project Server is to be Run on an Ubuntu based machine as project based dependencies are available only on Ubuntu. The server is built on Ubuntu 18.04.02. 

After cloning the project, run the below commands to setup the dependencies before running npm install.

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

NOTE: Once you plan to run the server, please share your public IP with me so that I can add you as an authorized user to access the content from both the databases. Do not forget to share your IP, I need to add you in firewall rules and create user in the database administration.

## to find public-IP
please use any one of the instructions :https://www.tecmint.com/find-linux-server-public-ip-address/

## Databases:
1. MYSQL
2. MongoDB

## need to install pdfmake package in the ckp folder
cd to the directory ckp/
```
git clone --branch 0.1 https://github.com/bpampuch/pdfmake.git
```
```
cd pdfmake/
```
```
npm install
```

Reference guide:~ https://www.npmjs.com/package/pdfmake

## To run the server: (come back one folder after completing the above step)
cd to the directory server/

# start the server:
```
node server.js
```

# Expected message:
	CKP Server Running on port xxxxx
	Connected to MongoDB server
	Connected to mysql Server

please proceed further only after geting the above message on console. Neglect any warnings!!!

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
