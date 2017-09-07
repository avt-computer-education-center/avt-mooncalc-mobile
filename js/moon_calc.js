/* global mainModuleNameSpace */

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
moonCalcModuleNameSpace = function() {
    
    //default latitude value for the Nortern Hemisphere
    var latitude = 1.0;  
    
    //determine type of the Hemisphere ("Northern", "Sourthern", or "Equator")
    var typeHemisphereStr;

    const numMoonPhasesImages = 25;
    
    //Define array for store the Moon Phases Images file names
    var moonPhasesImagesArray = new Array(numMoonPhasesImages);    
    
    
    /**
    * 
    * jyear  --  Convert  Julian  date  to  year,  month, day, which are
    *            returned as an Array.
    * 
    * @param {Number} td - Julian  date
    * @returns {Array} - year,  month, day 
    */
    function jyear (td) {
	var z, f, a, alpha, b, c, d, e, mm;
	
	td += 0.5;
	z = Math.floor(td);
	f = td - z;
	
	if (z < 2299161.0) {
            a = z;
	} else {
            alpha = Math.floor((z - 1867216.25) / 36524.25);
            a = z + 1 + alpha - Math.floor(alpha / 4);
	}
	
	b = a + 1524;
	c = Math.floor((b - 122.1) / 365.25);
	d = Math.floor(365.25 * c);
	e = Math.floor((b - d) / 30.6001);
	mm = Math.floor((e < 14) ? (e - 1) : (e - 13));
	
	var year=Math.floor((mm > 2) ? (c - 4716) : (c - 4715));
	var month=mm;
	var day=Math.floor(b - d - Math.floor(30.6001 * e) + f);
	
	
	var resultJyearArray=new Array(year,month,day);
	
	return resultJyearArray;
    }
    
    /**
     * 
     * jhms  --  Convert Julian time to hour, minutes, and seconds,
     *           returned as a three-element array.
     * 
     * @param {Number} j - Julian time
     * @returns {Array} - hour, minutes, and seconds
     * 
     */
    function jhms(j) {
        var ij;

        j += 0.5; /* Astronomical to civil */
        ij = (j - Math.floor(j)) * 86400.0;

        var hours=Math.floor(ij / 3600);
        var minutes=Math.floor((ij / 60) % 60);
        var seconds=Math.floor((ij / 60) % 60);

        var resultJhmsArray=new Array(hours, minutes, seconds);

        return resultJhmsArray;
    }
    
    /**
     * 
     * Convert GMT date and time 
     * to astronomical Julian time 
     * (i.e. Julian date plus day fraction, expressed as a double).
     * 
     * @param {type} year - as part of GMT Date
     * @param {type} mon - as part of GMT Date
     * @param {type} mday - as part of GMT Date
     * @param {type} hour - as part of GMT Time
     * @param {type} min - as part of GMT Time
     * @param {type} sec - as part of GMT Time
     * @returns {Number} - astronomical Julian time
     * 
     */
    function utctoj(year, mon, mday, hour, min, sec) {

        // Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61

        var a, b, m;
        var y;
        var jd;

        m = mon + 1;
        y = year;

        if (m <= 2) {
            y--;
            m += 12;
        }

        /* Determine whether date is in Julian or Gregorian calendar based on
        canonical date of calendar reform. */

        if ((year < 1582) || ((year === 1582) && ((mon < 9) || (mon === 9 && mday < 5)))) {
            b = 0;
        } else {
            a = Math.floor(y / 100);
            b = 2 - a + (a / 4);
        }

        jd=((Math.floor(365.25 * (y + 4716))) + (Math.floor(30.6001 * (m + 1))) + mday + b - 1524.5) + 
                ((sec + 60 * (min + 60 * hour)) / 86400.0); 

        return jd;
    }
    
    /**
    * 
    * Degrees to Radians
    * 
    * @param {Number} d - Degrees
    * @returns {Number} - Radians
    */
   function dtr(d) {
        return (d * Math.PI) / 180.0;
   }
   
   
   /**
    * 
    * Radians to Degrees
    * 
    * @param {Number} r - Radians
    * @returns {Number} - Degrees
    */
   function rtd(r) {
        return (r * 180.0) / Math.PI;
   }
   
   /**
    * 
    * Range reduce angle in degrees.
    * 
    * @param {Number} a - angle
    * @returns {Number} - reduced angle
    */
   function fixangle(a) {
        return (a - 360.0 * (Math.floor(a / 360.0)));
   }
   
   /**
    * 
    * Pad a string to a given length with a given fill character.
    * 
    * @param {String} str - original string
    * @param {Number} howlong - given length of the string
    * @param {String} padwith - fill character
    * @returns {String} - the resulting string
    */
   function pad(str, howlong, padwith) {
        var s = str.toString();

        while (s.length < howlong) {
            s = padwith + s;
        }
        return s;
   }
   
   
    /**
     * 
     * Edit date and time to application specific format. 
     * 
     * @param {Number} j - astronomical Julian time
     * @returns {String} - date and time in application specific format
     */
    function edate(j) {

        var date, time, formatted_str;

        //An array that stores the names of the months
        var months = ["January", "February", "March",
                        "April", "May", "Junе",
                        "July", "August", "September",
                        "October", "November", "December"];

        j += (30.0 / (24 * 60 * 60)); // Round to nearest minute
        date = jyear(j);
        time = jhms(j);

        formatted_str=pad(date[2], 2, " ")+ " " + months[date[1] - 1] + ", " + date[0] + " " + 
        pad(time[0], 2, " ") + ":" + pad(time[1], 2, "0")+" (UTC)";

        return formatted_str;
    }

   /**
    * 
    * Solve the equation of Kepler.
    * 
    * @param {Number} m -  mean anomaly
    * @param {Number} ecc -  eccentricity
    * @returns {Number} - eccentric anomaly
    */
   function kepler(m, ecc) {
        var e, delta;
        var EPSILON=1E-6;

        e = m = dtr(m);
        do {
            delta = e - ecc * Math.sin(e) - m;
            e -= delta / (1 - ecc * Math.cos(e));
        } while (Math.abs(delta) > EPSILON);
        return e;
   }
   
   /**
    * 
    * Calculate phase of the moon as a fraction:
    * 
    * The  argument  is  the  time  for  which  the  phase is requested,
    * expressed as a Julian date and fraction.  Returns  the  terminator
    * phase  angle  as a percentage of a full circle (i.e., 0 to 1), and
    * stores into pointer arguments  the  illuminated  fraction  of  the
    * Moon's  disc, the Moon's age in days and fraction, the distance of
    * the Moon from the centre of the Earth, and  the  angular  diameter
    * subtended  by the Moon as seen by an observer at the centre of the
    * Earth.
    * 
    * @param {Number} pdate - the  time  for  which  the  phase is requested, 
    *                         expressed as a Julian date and fraction
    * 
    */
   function phase(pdate) {

        var 
            MoonPhase,  /* Phase of the Moon */
            mage,       /* Age of the Moon in days */ 
            MoonDist,   /* Distance of the moon from the centre of Earth */
            MoonAng,    /* Moon's angular diameter */    
            SunDist,    /* Distance to the Sun in km */
            SunAng;     /* Sun's angular size in degrees */

        var 
            Day, N, M, Ec, Lambdasun, ml, MM, MN, Ev, Ae, A3, MmP,
            mEc, A4, lP, V, lPP, NP, y, x, Lambdamoon, BetaM,
            MoonAge, MoonDFrac, MoonPar, F; 
        
       var
            moonParamTmp_1, moonParamTmp_2, 
            moonParamTmp_3, moonParamTmp_4,
            moonParamTmp_5, moonParamTmp_6, 
            moonParamTmp_7;

        /*  Astronomical constants  */

        var epoch=2444238.5;      /* 1980 January 0.0 */

        /*  Constants defining the Sun's apparent orbit  */

        var elonge=278.833540;     /* Ecliptic longitude of the Sun
                           at epoch 1980.0 */
        var elongp=282.596403;     /* Ecliptic longitude of the Sun at
                           perigee */
        var eccent=0.016718;       /* Eccentricity of Earth's orbit */

        var sunsmax=1.495985e8;     /* Semi-major axis of Earth's orbit, km */
        var sunangsiz=0.533128;     /* Sun's angular size, degrees, at
                           semi-major axis distance */

        /*  Elements of the Moon's orbit, epoch 1980.0  */

        var mmlong=64.975464;    /* Moon's mean longitude at the epoch */
        var mmlongp=349.383063;  /* Mean longitude of the perigee at the
                           epoch */
        var mlnode=151.950429;    /* Mean longitude of the node at the
                           epoch */
        var minc=5.145396;	/* Inclination of the Moon's orbit */

        var mecc=0.054900;	/* Eccentricity of the Moon's orbit */
        var mangsiz=0.5181;     /* Moon's angular size at distance a
                           from Earth */
        var msmax=384401.0;			/* Semi-major axis of Moon's orbit in km */
        var mparallax=0.9507;       /* Parallax at distance a from Earth */	

        var SynMonth = 29.53058868;     /* Synodic month (mean time from new to next new Moon) */


        /* Calculation of the Sun's position */

        Day = pdate - epoch;                    /* Date within epoch */
        N = fixangle((360 / 365.2422) * Day);   /* Mean anomaly of the Sun */
        M = fixangle(N + elonge - elongp);      /* Convert from perigee
                                    co-ordinates to epoch 1980.0 */
        Ec = kepler(M, eccent);                 /* Solve equation of Kepler */
        Ec = Math.sqrt((1 + eccent) / (1 - eccent)) * Math.tan(Ec / 2);
        Ec = 2 * rtd(Math.atan(Ec));               /* True anomaly */
        Lambdasun = fixangle(Ec + elongp);      /* Sun's geocentric ecliptic
                                    longitude */
        /* Orbital distance factor */
        F = ((1 + eccent * Math.cos(dtr(Ec))) / (1 - eccent * eccent));
        SunDist = sunsmax / F;                  /* Distance to the Sun in km */
        SunAng = F * sunangsiz;                 /* Sun's angular size in degrees */


        /* Calculation of the Moon's position */

        /* Moon's mean longitude */
        ml = fixangle(13.1763966 * Day + mmlong);

        /* Moon's mean anomaly */
        MM = fixangle(ml - 0.1114041 * Day - mmlongp);

        /* Moon's ascending node mean longitude */
        MN = fixangle(mlnode - 0.0529539 * Day);

        /* Evection */
        Ev = 1.2739 * Math.sin(dtr(2 * (ml - Lambdasun) - MM));

        /* Annual equation */
        Ae = 0.1858 * Math.sin(dtr(M));

        /* Correction term */
        A3 = 0.37 * Math.sin(dtr(M));

        /* Corrected anomaly */
        MmP = MM + Ev - Ae - A3;

        /* Correction for the equation of the centre */
        mEc = 6.2886 * Math.sin(dtr(MmP));

        /* Another correction term */
        A4 = 0.214 * Math.sin(dtr(2 * MmP));

        /* Corrected longitude */
        lP = ml + Ev + mEc - Ae + A4;

        /* Variation */
        V = 0.6583 * Math.sin(dtr(2 * (lP - Lambdasun)));

        /* True longitude */
        lPP = lP + V;

        /* Corrected longitude of the node */
        NP = MN - 0.16 * Math.sin(dtr(M));

        /* Y inclination coordinate */
        y = Math.sin(dtr(lPP - NP)) * Math.cos(dtr(minc));

        /* X inclination coordinate */
        x = Math.cos(dtr(lPP - NP));

        /* Ecliptic longitude */
        Lambdamoon = rtd(Math.atan2(y, x));
        Lambdamoon += NP;

        /* Ecliptic latitude */
        BetaM = rtd(Math.asin(Math.sin(dtr(lPP - NP)) * Math.sin(dtr(minc))));

        /* Calculation of the phase of the Moon */

        /* Age of the Moon in degrees */
        MoonAge = lPP - Lambdasun;


        /* Phase of the Moon */
        MoonPhase = (1 - Math.cos(dtr(MoonAge))) / 2;

        /* Calculate distance of the moon from the centre of Earth */
        MoonDist = (msmax * (1 - mecc * mecc)) /
        (1 + mecc * Math.cos(dtr(MmP + mEc)));

        /* Calculate Moon's angular diameter */

        MoonDFrac = MoonDist / msmax;
        MoonAng = mangsiz / MoonDFrac;

        /* Calculate Moon's parallax */

        MoonPar = mparallax / MoonDFrac;

       /* Age of the Moon in days */  
       mage = SynMonth * (fixangle(MoonAge) / 360.0);

        //correcting negative mage value
        if (mage < 0.0) {
            mage+=SynMonth;
        }

         moonParamTmp_1 = MoonPhase;
         moonParamTmp_2 = mage;
         moonParamTmp_3 = MoonDist;
         moonParamTmp_4 = MoonAng;
         moonParamTmp_5 = SunDist;
         moonParamTmp_6 = SunAng;
         moonParamTmp_7 = fixangle(MoonAge) / 360.0;

         var moonParamsArray=new Array(moonParamTmp_1, 
                                       moonParamTmp_2, 
                                       moonParamTmp_3,
                                       moonParamTmp_4,
                                       moonParamTmp_5,
                                       moonParamTmp_6,
                                       moonParamTmp_7);

         return moonParamsArray;
   }
   
   /**
    * 
    * Create Array with file names of the images of all phases of the Moon 
    * for the current Hemisphere
    * 
    * @param {String} typeHemisphereStr ('Northern', 'Southern', or 'Equator' )
    * @returns {Array} - File names of the images of all phases of the Moon 
    *                    for the current Hemisphere
    */
   function addMoonPhasesImages(typeHemisphereStr) { 
        
           const numMoonPhasesImages = 25;
    
           //Define array for store Moon Phases Images 
           var moonPhasesImagesArray = new Array(numMoonPhasesImages);  

           if (typeHemisphereStr==='Equator') {
                moonPhasesImagesArray[0]="images/img_equator.png";
           } else {
                     for(var i=0; i < numMoonPhasesImages; i++) {
                        if (typeHemisphereStr==='Northern') {
                            moonPhasesImagesArray[i] = "images/img_"+i+"_n.png";
                        } else {
                            moonPhasesImagesArray[i] = "images/img_"+i+"_s.png";
                        }
                     }		
           }

           return moonPhasesImagesArray;
   }
   
   /**
    * 
    * Returns type of the Hemisphere depending on the latitude
    * 
    * @param {Number} latitude
    * @returns {String} - type of the Hemisphere ("Northern", 
    *                     "Sourthern", or "Equator")
    */
   function getTypeHemisphereStr(latitude){
        if (latitude === 0.0) {
            typeHemisphereStr='Equator';
        } else if (latitude < 0.0) {
          typeHemisphereStr='Southern';
        } else {
            typeHemisphereStr='Northern';
        }
        
       return typeHemisphereStr;
   }
   
   /**
    * 
    * Calculating and displaying type of the Hemispere, Age of the Moon, 
    * Phase of the Moon, and Distance from the Moon to the center of Earth. 
    *  
    */
    function calcAndShowMoonParams() {

        var
            nowUTC, currUTCFullYear, currUTCMonth, currUTCDate, 
            currUTCHours, currUTCMinutes, currUTCSeconds, moonParamsArray;

        //calc current Date
        nowUTC = new Date();

        nowUTC.setUTCDate(nowUTC.getUTCDate()+mainModuleNameSpace.offsetCurrentDate);

        currUTCFullYear=nowUTC.getUTCFullYear();
        currUTCMonth=nowUTC.getUTCMonth();
        currUTCDate=nowUTC.getUTCDate();
        currUTCHours=nowUTC.getUTCHours();
        currUTCMinutes=nowUTC.getUTCMinutes();
        currUTCSeconds=nowUTC.getUTCSeconds();


        //Define Julian date equilalent current Gregorian Date
        var curr_jdate=utctoj(currUTCFullYear, currUTCMonth, currUTCDate, currUTCHours, currUTCMinutes, currUTCSeconds);

        //Calc Age of the Moon, Phase of the Moon, 
        //Distance from the Moon to the center of Earth
        //and store in moonParamsArray
        moonParamsArray=phase(curr_jdate);

        //Age of the Moon
        var aom=moonParamsArray[1];

        var aom_d = Math.floor(aom);

        var currentMoonPhaseImageURL="";

        //Output Image of the Moon egual Phase of the Moon 
        if (typeHemisphereStr==='Equator') {
                currentMoonPhaseImageURL=moonPhasesImagesArray[0];
        } else {
             if (aom_d>=1 && aom_d<=13) {
                 currentMoonPhaseImageURL=moonPhasesImagesArray[aom_d-1];
             } else if (aom_d===14 || aom_d===15) {
                     currentMoonPhaseImageURL=moonPhasesImagesArray[13];
             } else if (aom_d>=16 && aom_d<=20) {
                 currentMoonPhaseImageURL=moonPhasesImagesArray[aom_d-2];
             } else if (aom_d===21 || aom_d===22) {
                 currentMoonPhaseImageURL=moonPhasesImagesArray[19];
             } else if (aom_d>=23 && aom_d<=25) {
                 currentMoonPhaseImageURL=moonPhasesImagesArray[aom_d-3];
             } else if (aom_d===26 || aom_d===27 || aom_d===28) {
                 currentMoonPhaseImageURL=moonPhasesImagesArray[23];
             } else if (aom_d===29 || aom_d===0) {
                 currentMoonPhaseImageURL=moonPhasesImagesArray[0];
             }
        }

        //Calculate Phase of the Moon in percent
        var moonPhaseInPercent=Math.floor(moonParamsArray[0]*100);
        var moonPhaseInPercentStr=moonPhaseInPercent.toString();

        //Output the name Phase of the Moon as suffix
        var moonPhaseStr='';

        if ((aom_d===29 && Math.abs(-moonParamsArray[0]) < 0.001)|| 
                (aom_d===0 && Math.abs(-moonParamsArray[0]) < 0.001) || 
                (aom_d===0 && Math.abs(-moonParamsArray[0]) < 0.01)  ||
                (aom_d===0 && Math.abs(-moonParamsArray[0]) < 0.1)   ||
                (aom_d===0 && Math.abs(-moonParamsArray[0]) < 1.0)){
                //calc indent for name of the Moon Phase
                //calc name of the Moon Phase
                moonPhaseStr+=" (New Moon)"; 
        } else if (aom_d===7){
             moonPhaseStr+=" (First Quarter)";
        } else if ((aom_d===14 && Math.abs(1.00000-moonParamsArray[0]) < 0.001) ||
                (aom_d===15 && Math.abs(1.00000-moonParamsArray[0]) < 0.001) ||
                (aom_d===15 && Math.abs(1.00000-moonParamsArray[0]) < 0.01)  ||
                (aom_d===15 && Math.abs(1.00000-moonParamsArray[0]) < 0.1)){
             moonPhaseStr+=" (Full Moon)"; 
        } else if (aom_d===22){
                moonPhaseStr+=" (Last Quarter)";
        }

        //output Yesterday, Today, Tomorrow info
        var todayStr="";

        if (mainModuleNameSpace.offsetCurrentDate===-1) {
          todayStr="Yesterday, ";
        } else if (mainModuleNameSpace.offsetCurrentDate===0){
          todayStr="Today, ";
        } else if (mainModuleNameSpace.offsetCurrentDate===1){
          todayStr="Tomorrow, ";
        }

        //output current Date and Time (on UTC System)
        var nowStr = edate(curr_jdate);

        // output Hemisphere
        if (typeHemisphereStr==="Northern" || typeHemisphereStr==="Southern"){
            typeHemisphereStr+=" Hemishere";
        }

        //Output Age of the Moon, Phase of the Moon, 
        //Distance from the Moon to the center of Earth

        var ageOfMoonStr='Age of the Moon: '+aom_d + ' days ';

        moonPhaseStr='Phase of the Moon: ' + moonPhaseInPercentStr + ' %' + moonPhaseStr;

        var moonDistanceStr='Distance to the Moon: '+Math.floor(moonParamsArray[2]) +' km.';


        //hide the Moon parameters with fadeOut effect

        //hide #moon_container with fadeOut effect
        $("#moon_container img").fadeOut("slow");

        //show the Moon parameters with fadeIn effect

        // Phase of the Moon image  
        //show #moon_container with fadeIn effect
        $("#moon_container img").fadeIn("slow",function(){

            $("#moon_container img").attr("src", currentMoonPhaseImageURL);

            $("#moon_container img").css("width",$("#moon_container").width()+"px");
            $("#moon_container img").css("height",$("#moon_container").height()+"px");

        });

        // Current Date 
        $("#curr_date").html(todayStr+nowStr);

        //Hemisphere (Northern, Southern or Equator)
        $("#hemisphere").html(typeHemisphereStr);	

        // The Moon parameters 

        // Age of Moon
        $("#age_of_moon").html(ageOfMoonStr);

        // Phase of the Moon
        $("#moon_phase").html(moonPhaseStr);

        // Distance from the Moon to the center of Earth
        $("#moon_distance").html(moonDistanceStr);
   }
   
    /**
     * 
     * Open 'Do not allow Location Access'  popup window
     * 
     */
    function getActionLocationAccessDontAllow() {
            $("#locationAccessDontAllowPopup").popup("open");

    }

    /**
     * 
     * Positioning and displaying in #Content1_MoonCalc GUI controls 
     * depending on the current size and orientation of the screen
     * 
     */
    function getActionShowMoonParams(){

        //positioning GUI control on #page1_MoonCalc 

        //the offset in pixels from the top #Content1 
        var offsetTop=30; 

        //---1---  #prev_date ----		
        //absolute positioning Previous date button (#prev_date)  
        //calculate "left" CSS property for #prev_date
        var prevDateCSSLeft=(mainModuleNameSpace.documentWidth/3)*(1/2)-($("#prev_date button").width()/2);
        $("#prev_date").css("left",prevDateCSSLeft+"px");

        //calculate "top" CSS property for #prev_date
        var prevDateCSSTop=offsetTop+($("#moon_container").height()/2-$("#prev_date button").height()/2);
        $("#prev_date").css("top",prevDateCSSTop+"px");		

        //---2---  #moon_container ----
        //absolute positioning #moon_container
        //calculate "left" CSS property for #moon_container
        var moonContainerCSSLeft=mainModuleNameSpace.documentWidth/2-($("#moon_container").width()/2);
        $("#moon_container").css("left",moonContainerCSSLeft+"px");

        //calculate "top" CSS property for #moon_container
        var moonContainerCSSTop=offsetTop;

        $("#moon_container").css("top",moonContainerCSSTop+"px");

        //---3---  #next_date ----		
        //absolute positioning Next date button (#next_date)  
        //calculate "left" CSS property for #next_date
        var nextDateCSSLeft=(mainModuleNameSpace.documentWidth*2/3)+(mainModuleNameSpace.documentWidth*(1/3))*(1/2)-($("#next_date button").width()/2);
        $("#next_date").css("left",nextDateCSSLeft+"px");

        //calculate "top" CSS property for #next_date
        var nextDateCSSTop=offsetTop+($("#moon_container").height()/2-$("#next_date button").height()/2);
        $("#next_date").css("top",nextDateCSSTop+"px");		

        //---4---  #curr_date ----
        //calculate "margin-top" CSS property for #curr_date
        var currDateCSSMarginTop=offsetTop+$("#moon_container").height()+20;		
        $("#curr_date").css("margin-top",currDateCSSMarginTop+"px");

        //---5---  #now ----
        //relative positioning Now date button (#now)
        //calculate "left" CSS property for #now
        var nowCSSLeft=mainModuleNameSpace.documentWidth/2-($("#now").width()/2);
        $("#now").css("left",nowCSSLeft+"px");

        //show #Content1_MoonCalc without effects
        $("#Content1_MoonCalc").show();

        //Calculate and Show the Moon parameters
        calcAndShowMoonParams();
    }   
   
   /**
    * 
    * Obtaining basic user's location information with W3C Geolocation API 
    * when loading a document
    * 
    */
   function getGeoPosition() {
       navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
   }

   /**
    * 
    * handle success here 
    * (When the user's location was successfully received
    *  with W3C Geolocation API)
    *        
    * @param {Number} position
    *        use: position.coords.latitude, position.coords.longitude
    *             position.coords.accuracy and position.timeStamp  
    * 
    */
   function geoSuccess (position){ 

        latitude=(position.coords.latitude).toFixed(4);
        console.log(latitude);

        //determine type of the Hemispher
        typeHemisphereStr = getTypeHemisphereStr(latitude);
        
        //Create Array with file names of the images 
        //of all phases of the Moon for the current Hemisphere
        moonPhasesImagesArray = addMoonPhasesImages(typeHemisphereStr);
        
        //Positioning and displaying in #Content1_MoonCalc GUI controls 
        //depending on the current size and orientation of the screen
        getActionShowMoonParams();
   }

   /**
    * handle failure here
    * (When the user's location don't received with W3C Geolocation API)
    *      
    * @param {String} error
    *        use: error.code and error.message         
    * 
    */
   function geoFailure (error){
        console.log(error.message);

        //set typeHemisphereStr to default value
        typeHemisphereStr = "Northern";

        //Create Array with file names of the images 
        //of all phases of the Moon for the current Hemisphere
        moonPhasesImagesArray = addMoonPhasesImages(typeHemisphereStr);
        
        //Open 'Do not allow Location Access' popup window
        getActionLocationAccessDontAllow();
   }
   
   return{
        getGeoPosition:getGeoPosition,
        getActionShowMoonParams:getActionShowMoonParams,
        calcAndShowMoonParams:calcAndShowMoonParams
    }
}();
