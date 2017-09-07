/* global moonCalcModuleNameSpace */

/**
 * 
 * MoonCalc Mobile Web App for calculating and displaying Age of the Moon,
 * Phase of the Moon, and Distance from the Moon to the center of Earth.
 * For residents of the Northern Hemisphere, the Southern Hemisphere, 
 * and the Equator.  
 *  
 * Copyright (C) 2011-2017  A.V.T. Software (Sole Proprietorship Vita Tolstikova)
 * 
 * @author Andrei Tolstikov
 * @author Vita Tolstikova
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Includes DaVinci SDK (http://davincisdk.blogspot.com/)
 *      
 * For calculate Moon parameters use algorithms from 
 * Moontool for Windows Release 2.0 by John Walker http://www.fourmilab.ch/
 * The  algorithms used in this program to calculate the positions of
 * the Sun and the Moon as seen from Earth are given  in  the  book
 * "Practical Astronomy With Your Calculator" by Peter Duffett-Smith,
 * Second Edition, Cambridge University Press, 1981.
 * 
 * "Astronomical Formulae  for  Calculators"  by  Jean  Meeus,  Third
 * Edition, Willmann-Bell, 1985.  A must-have.    
 *      
 * contact website: https://software.avt.dn.ua
 * contact E-mail: support@software.avt.dn.ua
 *      
 */

//Module Pattern to avoid globals
mainModuleNameSpace = function() {
    //The offset value of the current date set to zero 
    var offsetCurrentDate=0;
    
    //the width and height of the document 
    //based on the orientation of the device 
    var documentWidth;
    var documentHeight; 
    
    return{
        offsetCurrentDate:offsetCurrentDate,
        documentWidth:documentWidth,
        documentHeight:documentHeight
    }    
}();

/**
 * 
 * Initialization main events for MoonCalc Web App and 
 * call moonCalcModuleNameSpace.getGeoPosition()
 * for obtaining basic user's location information with W3C Geolocation API 
 * when DOM always created and ready to manipulation
 *   
 */
$(document).ready(function(){

    mainModuleNameSpace.documentWidth=$(document).width();		
    mainModuleNameSpace.documentHeight=$(document).height();

    //#user_agreement 
    //relative positioning and add User agreement button (#user_agreement)
    //calculate "left" CSS property for #user_agreement
    var userAgreementCSSLeft=mainModuleNameSpace.documentWidth/2-($("#user_agreement").width()/2);
    $("#user_agreement").css("left",userAgreementCSSLeft+"px");	


    //add click() event for #user_agreement button
    $("#user_agreement button").click(function(){
        $.mobile.changePage("#page3_UserAgreement");
    });

    //add click()event for #prev_date button
    $("#prev_date button").click(function(){
        mainModuleNameSpace.offsetCurrentDate--; 
        moonCalcModuleNameSpace.calcAndShowMoonParams();
    });

    //add click()event for #next_date button
    $("#next_date button").click(function(){
        mainModuleNameSpace.offsetCurrentDate++;
        moonCalcModuleNameSpace.calcAndShowMoonParams();
    });	

    //add click()event for #now button
    $("#now button").click(function(){
        mainModuleNameSpace.offsetCurrentDate=0;
        moonCalcModuleNameSpace.calcAndShowMoonParams();
    });

    $(window).on("orientationchange",function(){
        mainModuleNameSpace.documentWidth=$(document).width();		
        mainModuleNameSpace.documentHeight=$(document).height();		

        //relative positioning and add User agreement button (#user_agreement)
        //calculate "left" CSS property for #user_agreement
        var userAgreementCSSLeft=mainModuleNameSpace.documentWidth/2-($("#user_agreement").width()/2);
        $("#user_agreement").css("left",userAgreementCSSLeft+"px");

        moonCalcModuleNameSpace.getActionShowMoonParams();
    });

    //add click() event for #PopupCloseButton
    $("#PopupClosebutton").click(function(){
        moonCalcModuleNameSpace.getActionShowMoonParams();
    });	
    
    moonCalcModuleNameSpace.getGeoPosition();
});


















