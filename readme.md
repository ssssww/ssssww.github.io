## Synopsis


Go to https://ssssww.github.io to see current bus stop status in vancovuer area.

## Motivation

It is frustrating to wait for a bus to show up,
especially when it is late or even cancelled without you knowing about it.
I cannot imagine you waiting outside on a wet rainy day or on a cold winter nights.
This is why I made it; and maybe because I needed something to show?

## Construction

Data is requested from TransLink's RESTful web service in JSON format.
This JSON formatted data is then processed with javascript.
Since TransLink does not allow any Access-Control-Allow-Origin, CORS proxy is used.
This proxy server is merely a copy and paste of Rob Wu's 'cors-anywhere' -- you can find the reference below at Resources.
I tweaked Access-Control-Allow-Origin part to allow only request from 'ssssww.github.io'.

## Installation

No installation required.
Maybe a web brower to view the page.  
goto https://ssssww.github.io

## Usage

- ***OUTPUT:***
    - Maximum of next ten buses per scheduled routes starting from requested time.
- ***INPUT:***
    - (required) five-digit bus stop #
    - (optional) three-digit bus route #


## Known issues

***1. It takes some time to load results sometimes***
  * This is due to heroku(or dyno) puts the server to sleep after 30min of idle state; I am using free version :)

***2 It shows negative minutes***
  * That is the original data from the tanslink; too bad you missed that one :(

## Resoruces

CORS proxy:  
  (cors-anywhere)  
  https://github.com/Rob--W/cors-anywhere
  
Translink open API:  
  https://developer.translink.ca
