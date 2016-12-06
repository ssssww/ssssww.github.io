//java script

//so lonely without it
function main()
{
}//main

$(document).ready( main );



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//translink bus stop stat api
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////
//use it for DEBUGGING: show full json in text
//sub-function to print json in string
//used in onSuccess and onFailure
///////////////
function printJsonData(data)
{
	var strJsonData = JSON.stringify(data);
	//equivalent:: document.getElementById("jsonFull").innerHTML = strJsonData;
	$("#jsonFull").text(strJsonData);
}//printJsondata

///////////////
//create html tag with string in it
// type: html tag
// string: string between tags
// option: tag attributes
///////////////
function htmlString( type, string, option )
{
	if( option == undefined ){ 
		option = ""
	}else{
		option = " " + option;
	}//if/e
	return "<"+type+option+">" + string + "</"+type+">";
}//htmlString 

///////////////////////
//create table of a single schedule using json data
///////////////////////
function jsonScheduleToTableArray( json )
{
	var schedules = [];
	var numSchedule = json.Schedules.length;

	var j = 0; // schedules incrementor
	// for( let jsche of json.Schedules ) //ie doesn't allow this
	for( var iter = 0; iter <  numSchedule; iter++ )
	{
		var jsche = json.Schedules[iter];
		var sche = [], i = 0; // single shceudle and its incrementor
		// EXPECTED LEAVE TIME + EXPECTED COUNTDOWN
		sche[i++] = $.trim(jsche.ExpectedLeaveTime.slice(0, 7))
			+ "</br>(in  "
			+ htmlString("span", jsche.ExpectedCountdown)
			+ " min)";
		// SCHEDULE STATUS
		sche[i] = jsche.ScheduleStatus;
		var id = "";
		//set schedule status
		switch(sche[i])
		{
			case "-":
				sche[i] = "DELAYED";
				id = "stat_delayed";
				break;
			case "*":
				sche[i] = "on time";
				id = "stat_ontime";
				break;
			case "+":
				sche[i] = "AHEAD";
				id = "stat_ahead";
				break;
			default:
				sche[i] = "?";
		}//switch
		sche[i] = htmlString( "span", sche[i], "id="+ id);
		i++; // 
		// SCHEDULE CANCEL STATUS
		sche[i++] =
			( jsche.CancelledTrip || jsche.CancelledStop
			  ?
			  htmlString( "b", "CANCELLED", "style=\"color:red\"")
			  :
			  "on route"
			);

		// put schedules together
		schedules[j++] = sche;
	}//for/of
	return schedules;
}//jsonScheduleToTableArray

///////////////////
//given arrary from jsonScheduleToTableArray,
//turn it into list containing table of bus schedule(next max 6)
///////////////////
function scheduleArrayToHtmlString( scheduleArray )
{
	// number of schedule entries
	var numSchedule = scheduleArray.length;
	// number of entries;
	// they are leave time, expected countdown, schedule stat, cancelled
	var numEntry = scheduleArray[0].length;

	// this ugly code because html sucks; need to pass datas in rows
	// plus, variable names get unintelligable
	// make string of td and then add it to tr; start from the inside
	var htmlTableRowStr = "";
	var htmlSingleEntriesStr ="";
	for( var i = 0; i < numEntry; i++ )
	{
		htmlSingleEntriesStr = "";
		for( var j = 0; j < numSchedule; j++ )
		{
			htmlSingleEntriesStr += htmlString( "td", scheduleArray[j][i] );
		}//for j
		htmlTableRowStr += htmlString( "tr", htmlSingleEntriesStr );

	}//for i

	return htmlString( "table", htmlTableRowStr );
}//scheduleArrayToHtmlString

////////////
// add html list of a single route to a given bus stop
// input: json should in json[0] format
///////////
function stopSingleRouteHtmlList( jquery, json )
{
	var routeNo = json.RouteNo;
	var routeName = json.RouteName;
	//TODO direction with arrow
	var direction = json.Direction;

	//turn it into a list (inside out construction; li then ul)
	var htmlListString = "";
	routeDetail = "<" + routeNo + "> " + routeName + " (" + direction +")";
	routeDetail = htmlString( "b", routeDetail );

	// array of data -> html table string -> list entry
	var scheduleArray2 = jsonScheduleToTableArray( json );
	routeDetail += "<br>" + scheduleArrayToHtmlString( scheduleArray2 );

	htmlListString += htmlString( "li", routeDetail );

	return htmlString( "ul", htmlListString );
}//stopSingleRouteHtmlList

///////////////
//on json data retrival was successful do the following:json
//return suitable data; for now, routemap reference page kmz
//////////////
function onSuccess(jsonDataSuccess)
{
	//for DEBUGGING
	//printJsonData();
	var $stat = $("#stat");
	var $result = $("#result");

	var stopStatus = jsonDataSuccess;

	var numRoute = stopStatus.length;

	$stat.text( "number of route: " + numRoute);

	//clear paragraph
	var routeSchedule;
	$result.html( "" );
	//print requested routes with schedule
	//for( let json of stopStatus ) {  // fancier but IE doesn't allow this
	for( var i = 0; i < numRoute; i++ ) {
		var json = stopStatus[i];
		routeSchedule = stopSingleRouteHtmlList( $result, json );
		$result.append(routeSchedule);
	}//for
}//onsuccess

//////////////////
//if json data did not returned with fail then do the following:
//output error code and message
/////////////////
function onFailure(jsonDataFail)
{
	//printJsonData(jsonDataFail);
	var jsonData = jsonDataFail;

	if( jsonData.status != 500 ){
		// show html error
		$("#result").html(jsonData.status +" error(html)");
		return;
	}//if

	$("#result").html (
			"error code: " + jsonData.responseJSON.Code +
			"<br/>Message: " + jsonData.responseJSON.Message
			); 
}//onfailure

////////////////////
//request json
//get bus stop information using json
//output to html
///////////////////
function BusStopInfo()
{

	//bus stop # and route # for json request
	var apiKey = "D6cuDlHX37i2uBtw4JqX";
	var busStopNumber = $("#stopNo").val();
	var routeNumber = $("#routeNo").val();

	// if route number has not been specified
	var reg3Digit = new RegExp(/^\d{3}$/);
	if( !reg3Digit.test(routeNumber) ){
		routeNumber= "";
	}//if

	// cors url + api url to get json data
	var cors = "https://fierce-citadel-24828.herokuapp.com/";//cloned version of "https://cors-anywhere.herokuapp.com/";
	//	var cors = "https://cors-anywhere.herokuapp.com/";
	var stopEstimatesJSON = "http://api.translink.ca/rttiapi/v1/stops/"
		+ busStopNumber
		+ "/estimates?apikey=" + apiKey
		+ "&count=10"
		+ "&routeNo=" + routeNumber;
	var translinkURL = cors + stopEstimatesJSON;

	// get json data
	$.getJSON( translinkURL, onSuccess)
		.fail(onFailure);
}// bus stop info



//////////////////////
// change color of ipnut(id=stopNo) text and
// check wether it is a five-digit-number
/////////////////////
function changeColorAndClear( text )
{
	var $text = $(text);

	// when class is not set change text color & replace text
	if( $text.attr("class") != "inputChanged"){
		$text.val("");
		$text.attr("class", "inputChanged");
		$text.prop({'selectionStart': 0, 'selectionEnd': 1 });
	} else {
		var length = $text.prop('selectionStart');
		$text.prop({'selectionStart': length, 'selectionEnd': length+1 });
	}//if/else


}//changeColorAndClear


////////////////////////
// pad input with '#'
///////////////////////
function padding( input )
{
	var $input = $(input);
	var id = $input.attr("id");
	var value = $input.val();
	var textLength = $input.prop('selectionStart');
	var absoluteLength = value.length;

	// set length of the given input
	var stopNumberLength = 5;
	var routeNumberLength = 3;
	//TODO: use it when extended
	var busIdLength = 4;

	var wantedLength = stopNumberLength;

	// deal with left arrow key; unable to move left
	switch( event.keyCode )
	{
		case 8:		// backspace	
		case 37:	// left arrow
			textLength -= 1;
			break;
		default:
	}//switch/ keyCode

	//simulate insert mode
	switch( id )
	{
		case "routeNo":
			wantedLength--;
		case "busID":
			wantedLength--;
		case "stopNo":
			// enforce input length
			var paddingLength = wantedLength - absoluteLength;
			if( paddingLength >=0 && paddingLength < wantedLength) {
				//$input.val( value + "#".repeat(paddingLength)); // ie does not allow this
				var paddings = ""
					for( var i = 0; i < paddingLength; i++ ) {
						paddings +="#";
					}//for
				$input.val( value + paddings );
			}//if

			// set insert
			$("#"+id).prop( {'selectionStart': textLength, 'selectionEnd': textLength+1 });
			break;

		default:
			alert("wtf?");
	}//switch
}//checkinput

/////////////////
//handle on return key; input box to allow return on enter
////////////////
function returnOnEnter( keyStroke )
{
	//not a return key; exit function
	if( keyStroke.keyCode != 13 ) {
		return;
	}//if

	//extra details depending on id; use for extra extensions
	$id=$(keyStroke.currentTarget).attr("id");

	switch( $id )
	{
		case "stopNo":
		case "routeNo":
			BusStopInfo();
			break;
		default:
			alert("What are you?");
	}
}//returnOnEnter


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//google map + translink api to locate buses and bus stops
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//retrieve geolocation

function geoFindMe() {
	var output = document.getElementById("out");

	if (!navigator.geolocation){
		output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
		return;
	}

	function success(position) {
		var latitude  = position.coords.latitude;
		var longitude = position.coords.longitude;

		output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';

	
		// get bus stop# and coordinates
		var routeNo = "";
		var transLinkApi = "D6cuDlHX37i2uBtw4JqX";
		var cors = "https://fierce-citadel-24828.herokuapp.com/";
		var busStopURL =
			cors + "http://api.translink.ca/rttiapi/v1/stops?apikey=" + transLinkApi
			+ "&lat=" + latitude.toFixed(6)
			+ "&long=" + longitude.toFixed(6)
			+ "&routeNo=" + routeNo;


		// make this more useful
		function test(json)
		{
			var len = json.length;
			//start with coordinate of current location
			var markerCoordinates = "&markers=color:red%7Clabel:" + "home" +  "%7C" + latitude + "," + longitude;
			for( var iter = 0; iter < len; iter++ )
			{
				markerCoordinates +=
					"&markers=icon:http://chart.apis.google.com/chart%3Fchst%3Dd_map_spin%26Chld=2.1%7C0%7CFFFF42%7C13%7Cb%7CKumquats"
					+ "label:" + json[iter].StopNo + "%7C"
					+ json[iter].Latitude.toFixed(6) + "," + json[iter].Longitude.toFixed(6);
					//+"chst=d_map_spin%26chld=2.1%7C0%7CFFFF42%7C13%7Cb%7CKumquats";

//http://maps.google.com/maps/api/staticmap?center=toulouse&sensor=false&zoom=6&size=400x400&markers=icon:http://chart.apis.google.com/chart%3Fchst%3Dd_map_spin%26chld%3D1%257C30%257CFFFFFF%257C10%257C_%257Cfoo%257Cbar|toulouse 

				/*
					"&markers=size:tiny%7Ccolor:green%7C"
					+ "label:" + json[iter].StopNo + "%7C"
					+ json[iter].Latitude.toFixed(6) + "," + json[iter].Longitude.toFixed(6);
					*/
			}//for
			// plot bus stop and current location
			var img = new Image();
			var googleMapApi = "AIzaSyBK8dWP_CilHBITIsK3Z_oTTVZCN1r_xLM";
			img.src =
				"https://maps.googleapis.com/maps/api/staticmap?"
				+ "center=" + latitude + "," + longitude
				+ "&zoom=15&size=300x300&maptpe=roadmap"
				+ markerCoordinates
				+ "&key=" + googleMapApi;

			console.log(markerCoordinates);

			output.appendChild(img);
		}//test

		$.getJSON( busStopURL, test )
			.fail( test );

		//busnum + coordinate
		// get jsondata
		// parse it
		// make google map api url
		// get static map image

	}

	function error() {
		output.innerHTML = "Unable to retrieve your location";
	}

	output.innerHTML = "<p>Locating…</p>";

	navigator.geolocation.getCurrentPosition(success, error);
}

// map with marks with their bus stop number
// hide map with button click

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//track buses with bus numbers on a map
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//google cloud speech api (limit to 60min/month)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

