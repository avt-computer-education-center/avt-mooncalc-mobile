/*
 * Copyright (c) SP Vita Tolstikova, 2013-2014
 * 
 * Solution is to implement a timer that aborts the XMLHttprequest 
 * if it is taking too long to complete.    
 * 
*/
var timeOutDelay = 2000; //2 sec.  
var timerId;           
var xmlHttpRequest = new XMLHttpRequest();

//current latitude for MoonCalc() method as global var
var latitude=1.0; //default value for Nortern Hemisphere


//function notNetworkConnection() {
//	getActionNotNetworkConnection();
//}


function xmlHttpRequestOnTimeOut(){  
	   //alert("Not Network connection.");
	   xmlHttpRequest.abort();  
	   //notNetworkConnection();
	   getActionNotNetworkConnection();
	   
	}


function activeNetworkConnection(returnedJSONData){
	
	//alert("Network connection is OK.");
	
	// Checking the correct structure of JSON using regular expressions, 
	//which is described in RFC 4627, section 6.
	var geoIPDataControl = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test( 
		returnedJSONData.replace(/"(\\.|[^"\\])*"/g, ''))) &&  
		eval('(' + returnedJSONData + ')'); 

	if (!geoIPDataControl) {
		alert("Error in the structure of the received data.");		
		return;
	}
	else {
		var geoIPData = eval('('+returnedJSONData+')');
		latitude=parseFloat(geoIPData.latitude);
		getActionMoonCalc();
		
	}
	
}

function checkNetworkConnection(){

	xmlHttpRequest.open("GET", "http://www.telize.com/geoip", true);
	
	xmlHttpRequest.onreadystatechange = function(){
		if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
			clearTimeout(timerId);

			activeNetworkConnection(xmlHttpRequest.responseText);
		}
	}
	xmlHttpRequest.send(null);
	timerId = setTimeout(xmlHttpRequestOnTimeOut, timeOutDelay);
	
}


