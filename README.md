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

This project provides services where users can login and send message to other users.


## [How does it work?](#how-does-it-work)

This project designed to run as docker containers. It uses an **docker-compose.yml** file to operate and **.env** file to set env variables for services.  

## [What is its deployment process?](#what-is-its-deployment-process)

This project can be deployed on a host by using docker-compose commands. Each services is isolated and can communicate through a network. 

## [Use cases](#use-cases)

1. Users can register
2. Users can login
3. Users can send messages to other users
4. Users can block another user
5. Users can view their all incoming messages


## [API endpoints](#api-endpoints)

- **/auth/register**:   User register route
- **/auth/login**:      User login route
- **/send**:            User send message service
- **/messages**:        User list all messages