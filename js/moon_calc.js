/*
 * Copyright (c) SP Vita Tolstikova, 2011-2014
 * 
 * The calculation of the following Moon parameters:  
 * 1. Age of Moon; 
 * 2. Moon Phase(with output Moon Phase image) for Northern or Southern Hemisphere 
 *		and Equator;
 * 3. Moon's distance;
 * 
 * For calculate Moon parameters use algorithms from 
 * Moontool for Windows Release 2.0 by John Walker http://www.fourmilab.ch/
 * The  algorithms used in this program to calculate the positions of
 * the Sun and Moon as seen from the Earth  are  given  in  the  book
 * "Practical Astronomy With Your Calculator" by Peter Duffett-Smith,
 * Second Edition, Cambridge University Press, 1981.
 * 
 * "Astronomical Formulae  for  Calculators"  by  Jean  Meeus,  Third
 * Edition, Willmann-Bell, 1985.  A must-have.
 * 
 * 
*/

 //--------------------------------------------------------------------
 //--------- New Algorithms of Moon Calculations ----------------------
 //--------------------------------------------------------------------
 /*  JYEAR  --  Convert  Julian  date  to  year,  month, day, which are
 returned as an Array.  */

function jyear(td) {
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

/*  JHMS  --  Convert Julian time to hour, minutes, and seconds,
returned as a three-element array.  */

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


/*  UTCTOJ  --	Convert GMT date and time to astronomical
	Julian time (i.e. Julian date plus day fraction,
	expressed as a double).  */

function utctoj(year, mon, mday, hour, min, sec){

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
	
	if ((year < 1582) || ((year == 1582) && ((mon < 9) || (mon == 9 && mday < 5)))) {
	b = 0;
	} else {
	a = Math.floor(y / 100);
	b = 2 - a + (a / 4);
	}
	
	jd=((Math.floor(365.25 * (y + 4716))) + (Math.floor(30.6001 * (m + 1))) +	mday + b - 1524.5) + 
		((sec + 60 * (min + 60 * hour)) / 86400.0); 
	
	return jd;
}


/*  DTR  --  Degrees to radians.  */

function dtr(d)
{
	return (d * Math.PI) / 180.0;
}

/*  RTD  --   Radians to Degrees  */

function rtd(r)
{
	return (r * 180.0) / Math.PI;
}



/*  FIXANGLE  --  Range reduce angle in degrees.  */

function fixangle(a)
{
	//alert("a="+a);
	//alert("(Math.floor(a / 360.0))"+(Math.floor(a / 360.0)));
	return (a - 360.0 * (Math.floor(a / 360.0)));
}



/*  PAD  --  Pad a string to a given length with a given fill character.  */

function pad(str, howlong, padwith) {
	var s = str.toString();
	
	while (s.length < howlong) {
	s = padwith + s;
	}
	return s;
}

/*  EDATE  --  Edit date and time to application specific format.  */

//var Months_en = new Array("January", "February", "March", "April", "May", "Junе",
//        "July", "August", "September", "October", "November", "December");

//Used the array literal notation []
var Months_en = ["January", "February", "March", "April", "May", "Junе",
        "July", "August", "September", "October", "November", "December"];


function edate(j) {
	var date, time, OutputStr;
	
	j += (30.0 / (24 * 60 * 60));// Round to nearest minute
	date = jyear(j);
	time = jhms(j);
	
	OutputStr=pad(date[2], 2, " ")+ " " + Months_en[date[1] - 1] + ", " + date[0] + " " + 
	pad(time[0], 2, " ") + ":" + pad(time[1], 2, "0")+" (UTC)";

    return OutputStr;
}

/*  TRUEPHASE  --  Given a K value used to determine the mean phase of
the new moon, and a phase selector (0.0, 0.25, 0.5,
0.75), obtain the true, corrected phase time.  */

function dsin(x) {
	return Math.sin(dtr(x));
}

function dcos(x) {
	return Math.cos(dtr(x));
}


function truephase(k, phase)
{
	var t, t2, t3, pt, m, mprime, f;
	
	var SynMonth = 29.53058868;     /* Synodic month (mean time from new to next new Moon) */
	
	k += phase;                     /* Add phase to new moon time */
	t = k / 1236.85;                /* Time in Julian centuries from
	                    1900 January 0.5 */
	t2 = t * t;                     /* Square for frequent use */
	t3 = t2 * t;                    /* Cube for frequent use */
	pt = 2415020.75933              /* Mean time of phase */
	+ SynMonth * k
	+ 0.0001178 * t2
	- 0.000000155 * t3
	+ 0.00033 * dsin(166.56 + 132.87 * t - 0.009173 * t2);
	
	m = 359.2242                    /* Sun's mean anomaly */
	+ 29.10535608 * k
	- 0.0000333 * t2
	- 0.00000347 * t3;
	mprime = 306.0253               /* Moon's mean anomaly */
	+ 385.81691806 * k
	+ 0.0107306 * t2
	+ 0.00001236 * t3;
	f = 21.2964                     /* Moon's argument of latitude */
	+ 390.67050646 * k
	- 0.0016528 * t2
	- 0.00000239 * t3;
	if ((phase < 0.01) || (Math.abs(phase - 0.5) < 0.01)) {
	
	/* Corrections for New and Full Moon */
	
	pt +=    (0.1734 - 0.000393 * t) * dsin(m)
	+ 0.0021 * dsin(2 * m)
	- 0.4068 * dsin(mprime)
	+ 0.0161 * dsin(2 * mprime)
	- 0.0004 * dsin(3 * mprime)
	+ 0.0104 * dsin(2 * f)
	- 0.0051 * dsin(m + mprime)
	- 0.0074 * dsin(m - mprime)
	+ 0.0004 * dsin(2 * f + m)
	- 0.0004 * dsin(2 * f - m)
	- 0.0006 * dsin(2 * f + mprime)
	+ 0.0010 * dsin(2 * f - mprime)
	+ 0.0005 * dsin(m + 2 * mprime);
	} else if ((Math.abs(phase - 0.25) < 0.01 || (Math.abs(phase - 0.75) < 0.01))) {
	pt +=     (0.1721 - 0.0004 * t) * dsin(m)
	+ 0.0021 * dsin(2 * m)
	- 0.6280 * dsin(mprime)
	+ 0.0089 * dsin(2 * mprime)
	- 0.0004 * dsin(3 * mprime)
	+ 0.0079 * dsin(2 * f)
	- 0.0119 * dsin(m + mprime)
	- 0.0047 * dsin(m - mprime)
	+ 0.0003 * dsin(2 * f + m)
	- 0.0004 * dsin(2 * f - m)
	- 0.0006 * dsin(2 * f + mprime)
	+ 0.0021 * dsin(2 * f - mprime)
	+ 0.0003 * dsin(m + 2 * mprime)
	+ 0.0004 * dsin(m - 2 * mprime)
	- 0.0003 * dsin(2 * m + mprime);
	if (phase < 0.5)
	/* First quarter correction */
	pt += 0.0028 - 0.0004 * dcos(m) + 0.0003 * dcos(mprime);
	else
	/* Last quarter correction */
	pt += -0.0028 + 0.0004 * dcos(m) - 0.0003 * dcos(mprime);
	}
	return pt;
}


/*  KEPLER  --   Solve the equation of Kepler.  */
function kepler(m, ecc)
{
	var e, delta;
	var EPSILON=1E-6;
	
	e = m = dtr(m);
	do {
	delta = e - ecc * Math.sin(e) - m;
	e -= delta / (1 - ecc * Math.cos(e));
	} while (Math.abs(delta) > EPSILON);
	return e;
}

/*  PHASE  --  Calculate phase of moon as a fraction:

The  argument  is  the  time  for  which  the  phase is requested,
expressed as a Julian date and fraction.  Returns  the  terminator
phase  angle  as a percentage of a full circle (i.e., 0 to 1), and
stores into pointer arguments  the  illuminated  fraction  of  the
Moon's  disc, the Moon's age in days and fraction, the distance of
the Moon from the centre of the Earth, and  the  angular  diameter
subtended  by the Moon as seen by an observer at the centre of the
Earth.
*/


//moon_params as global array
var moon_params = new Array(7);


function phase(pdate) /* pdate-Date for which to calculate phase */           

{
	
	/* The calculated parameters of the resulting */  
	
	var	pphase,                /* Illuminated fraction */
	mage,                      /* Age of moon in days */
	dist,                      /* Distance in kilometres */
	angdia,                    /* Angular diameter in degrees */
	sudist,                    /* Distance to Sun */
	suangdia;                  /* Sun's angular diameter */
	
	
	
	var Day, N, M, Ec, Lambdasun, ml, MM, MN, Ev, Ae, A3, MmP,
	mEc, A4, lP, V, lPP, NP, y, x, Lambdamoon, BetaM,
	MoonAge, MoonPhase,
	MoonDist, MoonDFrac, MoonAng, MoonPar,
	F, SunDist, SunAng;
	
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
	
	var mmlong=64.975464;      /* Moon's mean longitude at the epoch */
	var mmlongp=349.383063;    /* Mean longitude of the perigee at the
	                   epoch */
	var mlnode=151.950429;     /* Mean longitude of the node at the
	                   epoch */
	var minc=5.145396;			/* Inclination of the Moon's orbit */
	
	var mecc=0.054900;			/* Eccentricity of the Moon's orbit */
	var mangsiz=0.5181;         /* Moon's angular size at distance a
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
	SunDist = sunsmax / F;                  /* Distance to Sun in km */
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
	
	/* Calculate distance of moon from the centre of the Earth */
	
	MoonDist = (msmax * (1 - mecc * mecc)) /
	(1 + mecc * Math.cos(dtr(MmP + mEc)));
	
	/* Calculate Moon's angular diameter */
	
	MoonDFrac = MoonDist / msmax;
	MoonAng = mangsiz / MoonDFrac;
	
	/* Calculate Moon's parallax */
	
	MoonPar = mparallax / MoonDFrac;
	
	mage = SynMonth * (fixangle(MoonAge) / 360.0);
	
	//correcting negative mage value
	if (mage < 0.0) {
		mage+=SynMonth;
	}
	

	moon_params[0]=MoonPhase;
	moon_params[1]=mage;
	moon_params[2]=MoonDist;
	moon_params[3]=MoonAng;
	moon_params[4]=SunDist;
	moon_params[5]=SunAng;
	moon_params[6]=fixangle(MoonAge) / 360.0;

}


//Offset currentDate Global variable
var offsetCurrentDate=0; 


function AddMoonPhasesImage(typeHemisphereStr) { 
   

	var NumPhasesImage=25;

	var MoonPhasesImageArray=new Array(NumPhasesImage);	
	
	if (typeHemisphereStr=='Equator') {
		MoonPhasesImageArray[0]="images/img_equator.png";
	}
	else {
		  for(var i=0; i < NumPhasesImage; i++)
		  {
		    if (typeHemisphereStr=='Northern')
                MoonPhasesImageArray[i] = "images/img_"+i+"_n.png";
			else 
				MoonPhasesImageArray[i] = "images/img_"+i+"_s.png";
		  }		
		
	}
	
	return MoonPhasesImageArray;
}


//MoonCalc  --  Calculating and Output type Hemispere Moon Age, Moon Phase, Moon Distance etc.
function calcAndShowMoonParams() {

	var v, l, s, Itemlen = 36,
	dat, evt, m = 0, epad, pchar, phnear,
	k1, mtime, minx, phaset,
	Pitemlen = 25,
	typeHemisphereStr,
	nowUTC, currUTCFullYear, currUTCMonth, currUTCDate, currUTCHours, currUTCMinutes, currUTCSeconds;
	

	//Identification type of the Hemisphere (Northern, Southern or Equator)

	//latitude=0.0; //for testing
	
	if (latitude == 0.0) {
		typeHemisphereStr='Equator';
	}
	else if (latitude < 0.0) {
	   typeHemisphereStr='Southern';
	} 
	else {
		typeHemisphereStr='Northern';
	}
	
	//calc current Date
	nowUTC = new Date();

	nowUTC.setUTCDate(nowUTC.getUTCDate()+offsetCurrentDate);
	
	currUTCFullYear=nowUTC.getUTCFullYear();
	currUTCMonth=nowUTC.getUTCMonth();
	currUTCDate=nowUTC.getUTCDate();
	currUTCHours=nowUTC.getUTCHours();
	currUTCMinutes=nowUTC.getUTCMinutes();
	currUTCSeconds=nowUTC.getUTCSeconds();


	//Define Julian date equilalent current Gregorian Date
	var curr_jdate=utctoj(currUTCFullYear, currUTCMonth, currUTCDate, currUTCHours, currUTCMinutes, currUTCSeconds);
	
	//Calc Moon Age, Moon Phase, Moon's distancy
	//and store in moon_params Array
	//moon_params=phase(curr_jdate);
	phase(curr_jdate);
	
	//Moon Age
	var aom=moon_params[1];

	var aom_d = Math.floor(aom);
	var aom_h = Math.floor(24 * (aom - Math.floor(aom)));
	var aom_m = Math.floor(1440 * (aom - Math.floor(aom))) % 60;
	
	var NumPhasesImage=25;

	//Define array for store Moon Phase Images 
	var moonPhasesImageArray=new Array(NumPhasesImage);	
	
	if (typeHemisphereStr=='Equator') {
		moonPhasesImageArray[0]="images/img_equator.png";
	}
	else {
		  for(var i=0; i < NumPhasesImage; i++)
		  {
		    if (typeHemisphereStr=='Northern')
                moonPhasesImageArray[i] = "images/img_"+i+"_n.png";
			else 
				moonPhasesImageArray[i] = "images/img_"+i+"_s.png";
		  }		
		
	}
	
	var currentMoonPhaseImageURL="";
	
	
	//Output Moon Image egual Moon phase
	if (typeHemisphereStr=='Equator') {
		currentMoonPhaseImageURL=moonPhasesImageArray[0];
	} 
	else {
	     if (aom_d>=1 && aom_d<=13)
             currentMoonPhaseImageURL=moonPhasesImageArray[aom_d-1];
		 else if (aom_d==14 || aom_d==15)
			 currentMoonPhaseImageURL=moonPhasesImageArray[13];
		 else if (aom_d>=16 && aom_d<=20)
			 currentMoonPhaseImageURL=moonPhasesImageArray[aom_d-2];
		 else if (aom_d==21 || aom_d==22)
			 currentMoonPhaseImageURL=moonPhasesImageArray[19];
		 else if (aom_d>=23 && aom_d<=25)
			 currentMoonPhaseImageURL=moonPhasesImageArray[aom_d-3];
         else if (aom_d==26 || aom_d==27 || aom_d==28)
             currentMoonPhaseImageURL=moonPhasesImageArray[23];
         else if (aom_d==29 || aom_d==0)
			 currentMoonPhaseImageURL=moonPhasesImageArray[0];
	}	

	//Calculate Phase of the Moon in percent
	var moonPhaseInPercent=Math.floor(moon_params[0]*100);
	var moonPhaseInPercentStr=moonPhaseInPercent.toString();
	//var moonPhaseInPercent=(moon_params[0]*100).toFixed(2);
	//var moonPhaseInPercent=moon_params[0];
	
	//alert("moon_params[0]="+moon_params[0]);
	//alert("moonPhaseInPercent="+moonPhaseInPercent);
	
	//Output the name Phase of the Moon as suffix
	var moonPhaseStr='';
	
	if ((aom_d==29 && Math.abs(-moon_params[0]) < 0.001)|| 
		(aom_d==0 && Math.abs(-moon_params[0]) < 0.001) || 
		(aom_d==0 && Math.abs(-moon_params[0]) < 0.01)  ||
		(aom_d==0 && Math.abs(-moon_params[0]) < 0.1)   ||
		(aom_d==0 && Math.abs(-moon_params[0]) < 1.0)){
		//calc indent for name of the Moon Phase
		//calc name of the Moon Phase
		moonPhaseStr+=" (New Moon)"; 
	}
	else if (aom_d==7){
		moonPhaseStr+=" (First Quarter)";
	}
	else if ((aom_d==14 && Math.abs(1.00000-moon_params[0]) < 0.001) ||
		(aom_d==15 && Math.abs(1.00000-moon_params[0]) < 0.001) ||
		(aom_d==15 && Math.abs(1.00000-moon_params[0]) < 0.01)  ||
		(aom_d==15 && Math.abs(1.00000-moon_params[0]) < 0.1)){
		
		moonPhaseStr+=" (Full Moon)"; 

	}
	else if (aom_d==22){
		moonPhaseStr+=" (Last Quarter)";
	}

   //output Yesterday, Today, Tomorrow info
   var todayStr="";

   if (offsetCurrentDate==-1) {
	   todayStr="Yesterday, ";
   }
   else if (offsetCurrentDate==0){
	   todayStr="Today, ";
   }
   else if (offsetCurrentDate==1){
	   todayStr="Tomorrow, ";
   }
   
	//output current Date and Time (on UTC System)
	var nowStr = edate(curr_jdate);
	
	// output Hemisphere
	if (typeHemisphereStr=="Northern" || typeHemisphereStr=="Southern"){
		typeHemisphereStr+=" Hemishere";
	}
	
	//Output Moon Age, Moon Phase, Moon's distancy 

	var ageOfMoonStr='Age of moon: '+aom_d + ' days ';
	
	moonPhaseStr='Moon phase: ' + moonPhaseInPercentStr + ' %' + moonPhaseStr;
	
	var moonsDistanceStr='Moon\'s distanse: '+Math.floor(moon_params[2]) +' km.';

	
//	var resultMoonParamsArray=new Array(currentMoonPhaseImageURL, 
//								  todayStr, 
//								  nowStr, 
//								  typeHemisphereStr,
//								  ageOfMoonStr,
//								  moonPhaseStr,
//								  moonsDistanceStr);
	
	//hide Moon parameters with fadeOut effect
	
	//hide #moon_container with fadeOut effect
	$("#moon_container img").fadeOut("slow");
	
//	//hide #curr_date with fadeOut effect
//	$("#curr_date").fadeOut("slow");
//	
//	//hide #hemisphere with fadeOut effect
//	$("#hemisphere").fadeOut("slow");
	
//	//hide #age_of_moon with fadeOut effect
//	$("#age_of_moon").fadeOut("slow");		
//	
//	//hide #moon_phase with fadeOut effect
//	$("#moon_phase").fadeOut("slow");
//	
//	//hide #moon_distance with fadeOut effect
//	$("#moon_distance").fadeOut("slow");		
	

	//show Moon parameters with fadeIn effect
	
	// MoonPhase image  
	//show #moon_container with fadeIn effect
	$("#moon_container img").fadeIn("slow",function(){
		
		$("#moon_container img").attr("src", currentMoonPhaseImageURL);
		
		//$("#moon_container img").attr("src", resultMoonParamsArray[0]);
		
		$("#moon_container img").css("width",$("#moon_container").width()+"px");
		$("#moon_container img").css("height",$("#moon_container").height()+"px");
		
	});
	
//	$("#moon_container img").attr("src", currentMoonPhaseImageURL);
//	$("#moon_container img").css("width",$("#moon_container").width()+"px");
//	$("#moon_container img").css("height",$("#moon_container").height()+"px");
	
	
	// Current Date 
	//todayStr+nowStr=resultMoonParamsArray[1]+resultMoonParamsArray[2]
	//id="curr_date"
	
	
	$("#curr_date").html(todayStr+nowStr);
	
	//$("#curr_date").html(resultMoonParamsArray[1]+resultMoonParamsArray[2]);
	
	//show #curr_date with fadeIn effect	
//	$("#curr_date").fadeIn("slow",function(){
//		$("#curr_date").html(resultMoonParamsArray[1]+resultMoonParamsArray[2]);
//	});
	
	
	

	//Hemisphere (Northern, Southern or Equator)
	//typeHemisphereStr=resultMoonParamsArray[3]
	//id="hemisphere"
	
	
	$("#hemisphere").html(typeHemisphereStr);	
	
	//$("#hemisphere").html(resultMoonParamsArray[3]);

	//show #hemisphere with fadeIn effect	
//	$("#hemisphere").fadeIn("slow",function(){
//		$("#hemisphere").html(resultMoonParamsArray[3]);
//	});		
	
	
	
	// Moon parameters 

	//Age of Moon
	
	//ageOfMoonStr=resultMoonParamsArray[4]
	//id="age_of_moon"
	
	$("#age_of_moon").html(ageOfMoonStr);
	
	//$("#age_of_moon").html(resultMoonParamsArray[4]);

	//show #age_of_moon with fadeIn effect	
//	$("#age_of_moon").fadeIn("slow",function(){
//		$("#age_of_moon").html(resultMoonParamsArray[4]);
//	});		

	//moonPhaseStr=resultMoonParamsArray[5]
	//id="moon_phase"
	
	$("#moon_phase").html(moonPhaseStr);
	

	//$("#moon_phase").html(resultMoonParamsArray[5]);

	//show #moon_phase with fadeIn effect
//	$("#moon_phase").fadeIn("slow",function(){
//		$("#moon_phase").html(resultMoonParamsArray[5]);
//	});		
	
	//moonsDistanceStr=resultMoonParamsArray[6]
	//id="moon_distance"
	
	$("#moon_distance").html(moonsDistanceStr);
	
	//$("#moon_distance").html(resultMoonParamsArray[6]);

	//show #moon_distance with fadeIn effect
//	$("#moon_distance").fadeIn("slow",function(){
//		$("#moon_distance").html(resultMoonParamsArray[7]);
//	});	
	
	
	
	
	
//	$(document).ready(function(){
//
//		
//
//	});
	
	//return resultMoonParamsArray; 
}
 
 
 
 
 

