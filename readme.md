This is a simple bus stop status checker for vancovuer area.

This web-page shows next 10 (maximum) buses per scheduled routes starting from current time.

You must know the bus stop number you are interested in, which is five digits, and the bus number, which is three digits.

The bus stop number is a required field, however, the bus number is a optional field.


==Construction of the web-page==

Data from TransLink is in JSON format and is processed with javascript.
Since TransLink does not allow any Access-Control-Allow-Origin, CORS proxy is used.
This proxy server is merely a copy and paste with tweaked Access-Control-Allow-Origin to allow 'ssssww.github.io'.



==Known issues==

-It takes some time to load results sometimes;
  this is due to heroku(or dyno) puts the server to sleep after 30min of idle state -- Yes, I'm a free loader.

-It shows negative minutes;
  that is the original data from the tanslink too bad you missed that one.
  

==Resoruces==

CORS proxy:

  (cors-anywhere)
  
  https://github.com/Rob--W/cors-anywhere
  
Translink open API:

  https://developer.translink.ca
