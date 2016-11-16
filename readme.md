## Synopsis

This is a web-page to check status of bus stops in vancovuer area.

## Motivation

It is always painful to wait your bus to show up, but it never shows up on time or is cancelled when you need them the most.
This seems to be one of the reasons why TransLink decied to provide open API.
All we need to do is make use of it right?

## Construction

Data from TransLink is in JSON format and is processed with javascript.
Since TransLink does not allow any Access-Control-Allow-Origin, CORS proxy is used.
This proxy server is merely a copy and paste with tweaked Access-Control-Allow-Origin to allow 'ssssww.github.io'.

## Installation

No installation required.
Maybe a web brower to view the page.
goto https://sssssww.github.io

## Usage

-[OUTPUT:]  
    -[Maximum of next ten buses per scheduled routes starting from requested time.]
-[INPUT:]  
    -[(required) five-digit bus stop #]
    -[(optional) three-digit bus route #]


## Known issues

1. It takes some time to load results sometimes;  
  ==> this is due to heroku(or dyno) puts the server to sleep after 30min of idle state; I am using free version :)

2. It shows negative minutes;  
  ==> that is the original data from the tanslink; too bad you missed that one :(
  

## Resoruces

CORS proxy:  
  (cors-anywhere)  
  https://github.com/Rob--W/cors-anywhere
  
Translink open API:  
  https://developer.translink.ca
