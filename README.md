# Messaging Service Case Study for Armut.com

This document provides some useful information about the project and its deployment process.

**Table of Contents**

1. [About the project](#about-the-project)
2. [How does it work?](#how-does-it-work)
3. [What is its deployment process?](#what-is-its-deployment-process)
4. [Use cases](#use-cases)
5. [API endpoints](#api-endpoints)
6. [Project utilities](#project-utilities)


## [About the project](#about-the-project)

This project provides services which users can register/login and send message to other users. Also users can block other users.


## [How does it work?](#how-does-it-work)

This project designed to run as docker containers. It uses **docker-compose.yml** file to operate and **.env** file to set env variables for services. Currently there are 3 services:

- **app**: authenticates user and implements functionalites
- **dbprovider**: provides db. Currently uses mongo service. Acts as a db interface.
- **mongo**: runs mongo db.

## [What is its deployment process?](#what-is-its-deployment-process)

This project can be deployed on a host by using docker-compose commands. Each services is isolated and can communicate through a network. Run provided ```./init.sh``` to run project with docker-compose. 

## [Use cases](#use-cases)

1. Users can register with username and password
2. Users can login with username and password
3. Users can send messages to other users by their username
4. Users can block another user by their username
5. Users cannot send message if reciever is blocked him/her
6. Users can view their all incoming messages


## [API endpoints](#api-endpoints)

- **/auth/register**:               User register route
- **/auth/login**:                  User login route
- **/api/user/:userId/send**:       User send message service
- **/api/user/:userId/message**:    User list all messages

Also **dbprovider** has its own API but I didn't include here.