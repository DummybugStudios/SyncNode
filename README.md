# SyncNode
A collaborative music experience

Reduces lag when listening to music together because the
clients maintain a local copy of the music and keeps it
in the sync. 
(Well actually it doesn't do anything at the moment it's
still massively in dev)

## Requirements 
* node js (https://nodejs.org/en/) 
* ffmpeg (https://www.ffmpeg.org/download.html)
* A c/c++ compiler

## Installing

### Client
* Open a terminal in the **app** folder
* run `npm install` to install dependencies  
* To run the client run `npm start`

### Server
* Open a terminal in the **server** folder
* Run `node install` to install dependencies
* Run `npm start` to start the server 

### Note for Windows users
Since the client uses native node modules you will need to have python 2.7
and visual studio c++ compilers
if you don't have them installed look at this:
https://github.com/felixrieseberg/windows-build-tools
