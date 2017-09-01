/*
 *  Copyright (c) SP Vita Tolstikova, 2011-2014
 *  
*/


//the width and height of the document 
//based on the orientation of the device 
var documentWidth;
var documentHeight;


//initialization main app events and
//call checkNetworkConnection() function
//after DOM always created and ready to manipulation
$(document).ready(function(){

	documentWidth=$(document).width();		
	documentHeight=$(document).height();
	
	//The offset value of the current date set to zero 
	//when the menu item 'Calculate Moon parameters' is selected		
	offsetCurrentDate=0;
	
	//  #user_agreement 
	//relative positioning and add events User agreement button (#user_agreement)
	//calculate "left" CSS property for #user_agreement
	var userAgreementCSSLeft=documentWidth/2-($("#user_agreement").width()/2);
	$("#user_agreement").css("left",userAgreementCSSLeft+"px");	
	

	//add click() event for #now button 
	$("#user_agreement button").click(function(){
		$.mobile.changePage("#page3_UserAgreement");
	});
	
	//add click()event for #prev_date button
	$("#prev_date button").click(function(){
		offsetCurrentDate--; 
		//moonParamsArray=calcMoonParams();
		calcAndShowMoonParams();
	});
	
	//add click()event for #next_date button
	$("#next_date button").click(function(){
		offsetCurrentDate++;
		//moonParamsArray=calcMoonParams();
		calcAndShowMoonParams();
	});	
	
	//add click()event for #now button
	$("#now button").click(function(){
		offsetCurrentDate=0;
		//moonParamsArray=calcMoonParams();
		calcAndShowMoonParams();
	});
	
	
	$(window).on("orientationchange",function(event){
		  //alert("Orientation is: " + event.orientation);

		documentWidth=$(document).width();		
		documentHeight=$(document).height();		
		
		
		//  #user_agreement 
		//relative positioning and add events User agreement button (#user_agreement)
		//calculate "left" CSS property for #user_agreement
		var userAgreementCSSLeft=documentWidth/2-($("#user_agreement").width()/2);
		$("#user_agreement").css("left",userAgreementCSSLeft+"px");
		
		//checkNetworkConnection();
		getActionMoonCalc();
		
	});
	
	$("#RefreshButton").click(function(){
		checkNetworkConnection();
	});
	
	$("#PopupCloseButton").click(function(){
		getActionMoonCalc();
	});	
	
	
	checkNetworkConnection();
});
