/*
 *  Copyright (c) SP Vita Tolstikova, 2011-2014
 *  
*/

//-------------------------------------
//View 'Network problems' popup window
//-------------------------------------
function getActionNotNetworkConnection() {

	
//	$("#PopupCloseButton").on("click",function(event){
//		getActionMoonCalc();  
//	});	
	
	
	$("#networkErrorPopup").popup("open");
}

//Calculation of the current Moon parameters
//And display them in a scratchpad

//----------------------------------------------
//Calculated and view in #Content1_MoonCalc 
//of the current Moon parameters 
//----------------------------------------------

function getActionMoonCalc()
{
	//Array for store calculated Moon parameters
	//var moonParamsArray;

	
	
//	$(document).ready(function(){
//
//	});
	
	//The offset value of the current date set to zero 
	//when the menu item 'Calculate Moon parameters' is selected		
	//offsetCurrentDate=0;
	
	//call function for Calculate and Show Moon parameters
	//moonParamsArray=calcMoonParams();
	calcAndShowMoonParams();
	

	//positioning control elements on #page1_MoonCalc 
	
	//the offset in pixels from the top #Content1 
	var offsetTop=30; 

	//---1---  #prev_date ----		
	//absolute positioning Previous date button (#prev_date)  
	//calculate "left" CSS property for #prev_date
	var prevDateCSSLeft=(documentWidth/3)*(1/2)-($("#prev_date button").width()/2);
	$("#prev_date").css("left",prevDateCSSLeft+"px");

	//calculate "top" CSS property for #prev_date
	var prevDateCSSTop=offsetTop+($("#moon_container").height()/2-$("#prev_date button").height()/2)
	$("#prev_date").css("top",prevDateCSSTop+"px");		
	
	//---2---  #moon_container ----
	//absolute positioning #moon_container
	//calculate "left" CSS property for #moon_container
	var moonContainerCSSLeft=documentWidth/2-($("#moon_container").width()/2);
	$("#moon_container").css("left",moonContainerCSSLeft+"px");

	//calculate "top" CSS property for #moon_container
	var moonContainerCSSTop=offsetTop;
			
	$("#moon_container").css("top",moonContainerCSSTop+"px");

	
	//---3---  #next_date ----		
	//absolute positioning Next date button (#next_date)  
	//calculate "left" CSS property for #next_date
	var nextDateCSSLeft=(documentWidth*2/3)+(documentWidth*(1/3))*(1/2)-($("#next_date button").width()/2);
	$("#next_date").css("left",nextDateCSSLeft+"px");

	//calculate "top" CSS property for #next_date
	var nextDateCSSTop=offsetTop+($("#moon_container").height()/2-$("#next_date button").height()/2)
	$("#next_date").css("top",nextDateCSSTop+"px");		
	
	//---4---  #curr_date ----
	//calculate "margin-top" CSS property for #curr_date
	var currDateCSSMarginTop=offsetTop+$("#moon_container").height()+20;		
	$("#curr_date").css("margin-top",currDateCSSMarginTop+"px");
	
	
	//---5---  #now ----
	//relative positioning Now date button (#now)
	//calculate "left" CSS property for #now
	var nowCSSLeft=documentWidth/2-($("#now").width()/2);
	$("#now").css("left",nowCSSLeft+"px");
	
	
	//show #Content1_MoonCalc without effects
	$("#Content1_MoonCalc").show();

}