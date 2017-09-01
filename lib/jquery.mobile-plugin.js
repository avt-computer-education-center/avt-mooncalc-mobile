/*!
 * SEC Web App SDK 1.0
 *
 * Copyright ¨Ï 2013 Samsung Electronics Co., Ltd. All rights reserved.
 */

/* start plugin : default */
(function( window, undefined ) {
    var userLang = navigator.language || navigator.userLanguage;
    Globalize.culture( userLang );
    
    window._isDesigner = (window.navigator.userAgent.indexOf("Designer") > -1);

    document.addEventListener('DOMContentLoaded', function() {
    	var check = function ($elems) {
    		$elems.each(function (idx) {
    			var $elem = $(this);
	        	if ($elem.find('div[data-role="header"]').length > 0) {
	        		$elem.addClass("sec-header");
	        	}
	        	if ($elem.find('div[data-role="footer"]').length > 0) {
	        		$elem.addClass("sec-footer");
	        	}
    		});
    	}
    	var first = $('div[data-role="page"]');
    	check(first);

    	$(document).on('pagebeforeshow', function (e, ui) {
	    	var target = e.target;
	    	check($(target));
	    });
    }, false);
}(this));
/* end plugin : default */

/* start plugin : mobile.dialog */
(function( window, undefined ) {
    if (window._isDesigner == false) {
	    $(document).ready(function () {
	        $('div[data-role="dialog"]').on('pagebeforeshow', function (e, ui) {
	            ui.prevPage.addClass("ui-dialog-background ui-disabled");
	        });
	
	        $('div[data-role="dialog"]').on('pagehide', function (e, ui) {
	            $(".ui-dialog-background ").removeClass("ui-dialog-background ui-disabled");
	        });
	    });
    }    
}(this));
/* end plugin : mobile.dialog */

/* start plugin : mobile.picker */
(function($) {
  $.widget('mobile.picker', $.mobile.widget, {
    options: {
		shadow: true,
		corners: true
    },
    
    _create: function () {
    },
    
    _createBar: function() {
        var instance = this;
        
        var bar = document.createElement("div");
        bar.className = 'ui-picker-bar';
        this.element.append(bar);
        
        $(bar).bind("vmousedown", function (e) {
            var px = e.clientX - $(e.target).offset().left;
            if (px < instance.colPos[0]) {
                instance.columns[0].iscroll._start(e);
            }
            else if (px < instance.colPos[1]) {
                instance.columns[1].iscroll._start(e);
            }
            else {
                instance.columns[2].iscroll._start(e);
            }
        });
    },
    
    _checkDesigner: function (elem, minV, maxV, cur, idx, max2) {
        if (window._isDesigner) {
            if (this.scrArr == undefined) {
                this.scrArr = [1, 1, 1];
            }
            this.scrArr[idx] = 1;
            var min = cur - 1;
            var max = cur + 1;
            if (min < minV) {
                elem.style.verticalAlign = "top";
                min = minV;
                this.scrArr[idx] = 0;                
            }
            if (max2 != undefined) {
                maxV = Math.min(max2, maxV);
            }
            if (max > maxV) {
                elem.style.verticalAlign = "top";
                max = maxV;
                this.scrArr[idx] = 1;                
            }
            return [min, max];
        }
        return [minV, maxV];
    },

    _initByTimer: function() {
        if (window._isDesigner) {
            this.element.find("*").addClass("inneritem");

            var h = this.element.find(".ui-picker-wrapper").height();
            for (var i = 0; i < 3; i++) {
                this.columns[i].refresh();

           		//this.columns[i].move(tInstance.scrArr[i]);
           		this.columns[i].wrapper.css("-webkit-transform", "translate(0px, " + (-h * this.scrArr[i]) + "px)");
           	}
        }
    },
    
    _createColumn: function (elem, min, max, clsName, text) {
        var ret = {};

        var back = document.createElement("div");
        back.className = 'ui-picker-wrapper-back';
        
        var wrapper = document.createElement("div");
        wrapper.className = 'ui-picker-wrapper';

        back.appendChild(wrapper);

        var scroller = document.createElement("div");
        scroller.className = 'ui-picker-scroller';
        wrapper.appendChild(scroller);
        
        ret.elem = $(elem);
        ret.wrapper = $(wrapper);
        ret.scroller = $(scroller);
        ret.getValue = function(idx) {
            if (idx == undefined || idx < 0 || idx >= scroller.children.length) {
                return 0;
            }
            return scroller.children[idx].getAttribute("value");
        };
        
        ret.clsFunc = clsName;
        ret.txtFunc = text;
        ret.getItemStr = function (idx) {
            var elem = document.createElement("div");
            elem.className = ret.clsFunc(idx);
            elem.setAttribute("value", "" + idx);
            var txt = document.createTextNode(ret.txtFunc(idx));
            elem.appendChild(txt);
            return elem;
            //return "<div class='" + ret.clsFunc(idx) + "' value='" + idx +"'>" + ret.txtFunc(idx) + "</div>";
        };
        ret.appendItem = function (idx) {
            ret.scroller.append(ret.getItemStr(idx));
        };
        
        for(var i = min; i <= max; i++) {
            ret.appendItem(i);
        }

        ret.iscroll = new iScroll(wrapper, {
            snap: true,
            useTransform: false,
            momentum: true,
            vScrollbar: false,
			hScroll: false,
            hScrollbar: false,
            hideScrollbar:true,
    		onBeforeScrollStart: function(e) {
   				e.preventDefault();
    		},
    		onCheckScroll : function (e) {
    		    /*
    		    var owner = $(e.target).closest(".dvc-iscrollview");
    		    if (owner.length > 0) {
    		        return true;
    		    }
    		    */
    		    return false;
    		},
			onScrollStart: function (e) {
			    var owner = $(this.wrapper).parent().closest(".dvc-iscrollview");
			    if (owner.length > 0) {
    			    owner.dvciScrollview("disable");
    			}
			},
			onScrollEnd: function () {
			    var owner = $(this.wrapper).parent().closest(".dvc-iscrollview");
			    if (owner.length > 0) {
    			    owner.dvciScrollview("enable");
    			}
			}
        });

        var instance = ret.iscroll;
        instance.handleEvent = function (e) {
            if (e.type == 'touchstart' || e.type == 'mousedown') {
                if (instance.options.onCheckScroll.call(this, e)) {
                    return;
                }
            }

            iScroll.prototype.handleEvent.call(instance, e);
        };

        ret.getSelected = function() {
    	    var idx = ret.iscroll.currPageY;
    	    if (ret.iscroll.pagesY.length <= idx && idx > 0) {
    	        idx = ret.iscroll.pagesY.length - 1;
    	    }
    	    return ret.getValue(idx);
        };
        
        ret.refresh = function() {
            ret.iscroll.refresh();
        };
        
        ret.move = function (idx) {
            ret.iscroll.scrollToPage(0, idx, 0);
        };
        
        elem.appendChild(back);
        
        return ret;
    },
    
    _refreshColPos: function () {
   		var pos1 = this.columns[0].elem.outerWidth(true);
   		var pos2 = this.columns[1].elem.outerWidth(true) + pos1;
   		this.colPos = [pos1, pos2];

        if (this.columnsIdx == undefined) {
            var instance = this;

            instance.columnsIdx = 0;
            instance.columns[0].wrapper.addClass("ui-focus-column");
        
            instance.handleKeydown = function (event) {
            
                var column = instance.columns[instance.columnsIdx];
           		switch ( event.keyCode ) {
                    case $.mobile.keyCode.UP:
                        column.move(column.iscroll.currPageY - 1);
                        break;
                    case $.mobile.keyCode.RIGHT:
                        if (instance.columnsIdx < 2) {
                            column.wrapper.removeClass("ui-focus-column");
                            instance.columnsIdx++;
                            instance.columns[instance.columnsIdx].wrapper.addClass("ui-focus-column");
                        }
                        break;
                    case $.mobile.keyCode.DOWN:
                        column.move(column.iscroll.currPageY + 1);
                        break;
                    case $.mobile.keyCode.LEFT:
                        if (instance.columnsIdx > 0) {
                            column.wrapper.removeClass("ui-focus-column");
                            instance.columnsIdx--;
                            instance.columns[instance.columnsIdx].wrapper.addClass("ui-focus-column");
                        }
                        break;
           		}
            };
            
            this.element.bind( "keydown", instance.handleKeydown);
        }
    }
    
  });
})(jQuery);
/* end plugin : mobile.picker */

/* start plugin : mobile.datepicker */
(function($) {
  $.widget('mobile.datepicker', $.mobile.picker, {
    options: {
		shadow: true,
		corners: true,
		date: new Date(),
		initSelector: ":jqmData(role='datepicker')"
    },
    	
	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-corner-all");
                    }
                break;
            }
        }

        return this;
	},

    _create: function () {
		var $el = this.element,
			o = this.options,
			clsName = "ui-" + $.mobile.ns + "datepicker";
			instance = this;

		var viewClass = clsName;
		viewClass += o.shadow ? " ui-shadow" : "";
		viewClass += o.corners ? " ui-corner-all" : "";

		if ( o.inline !== undefined ) {
			viewClass += o.inline === true ? " " + clsName + "-inline" : " " + clsName + "-block";
		}
		
		this.element.addClass("ui-checkscroll ui-scrollview");
        
        this.element.addClass(viewClass);

        var yearElem = document.createElement("div");
        var monthElem = document.createElement("div");
        var dayElem = document.createElement("div");

        yearElem.className = 'ui-picker-item ui-date-year';
        monthElem.className = 'ui-picker-item ui-date-month';
        dayElem.className = 'ui-picker-item ui-date-day';

        this.element.append(yearElem);
        this.element.append(monthElem);
        this.element.append(dayElem);
        
        this._createBar();

        if ( Object.prototype.toString.call(o.date) === '[object Date]') {
            this.dateObj = o.date;
        }
        else {
            this.dateObj = new Date(o.date);
            if (window._isDesigner && isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date(o.date.replace(/-/gi, "/"));
            }
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
        }
        
        this.currYear = this.dateObj.getFullYear();
        
        var minV = this.currYear - 20;
        var maxV = this.currYear + 10;

        var range = this._checkDesigner(yearElem, minV, maxV, this.currYear, 0);

        this.year = this._createColumn(yearElem, range[0], range[1],
            function(idx) { return "year y" + idx; },
            function(idx) { return "" + idx; }
        );

        var monthStrs = Globalize.culture().calendars.standard.months;

        var cur = this.dateObj.getMonth() + 1;
        var range = this._checkDesigner(monthElem, 1, 12, cur, 1);
        this.month = this._createColumn(monthElem, range[0], range[1],
            function(idx) { return "month m" + idx; },
            function(idx) { return monthStrs.namesAbbr[idx - 1]; }
            //function(idx) { return (monthStrs.namesAbbr[idx - 1] == idx) ? monthStrs.names[idx - 1] : (monthStrs.namesAbbr[idx - 1] + " " + (idx)); }
        );
        
        var dm = this._daysInMonth(this.dateObj.getFullYear(), this.dateObj.getMonth());
        var range = this._checkDesigner(dayElem, 1, 31, this.dateObj.getDate(), 2, dm);
        this.day = this._createColumn(dayElem, range[0], range[1],
            function(idx) { return "day d" + idx; },
            function(idx) { return "" + idx; }
        );
        
        this.columns = [this.year, this.month, this.day];
        
        this._initByTimer();
        
        if (this.element.closest(":jqmData(role='page')").hasClass("ui-page-active")) {
            this.init();
        }
    },
    
    init: function () {
        if (this._initCalled || window._isDesigner) {
            return;
        }
        
        this._initCalled = true;
        
        var instance = this;
        
        var hh = this.element.find(".ui-picker-wrapper").height();
        this.element.find(".ui-picker-scroller > div").height(hh);
        this.element.find(".ui-picker-scroller > div").css("line-height", hh + "px");
        
        this.year.refresh();
   		
        var minY = parseInt(instance.year.getValue(0));
   		this.year.move(this.dateObj.getFullYear() - minY);

        if (this.year.onScrollEnd_OLD == undefined) {
        	this.year.onScrollEnd_OLD = this.year.iscroll.options.onScrollEnd;
        	this.year.iscroll.options.onScrollEnd = function (e) {
        	    instance.year.onScrollEnd_OLD.call(this, e);
    
        	    var y = parseInt(instance.year.getSelected());
        	    var m = parseInt(instance.month.getSelected());
        	    
        	    var changed = instance._refreshDate(y, m - 1);
                
                var min = parseInt(instance.year.getValue(0));
                if (y < min + 5) {
                    var first = instance.year.scroller.children().first();
                    for (var i = min - 9; i < min; i++) {
                        first.before(instance.year.getItemStr(i));
                    }
                    instance.year.refresh();
                    instance.year.move(y - min + 9);
                }
                var len = instance.year.scroller.children().length;
                var max = parseInt(instance.year.getValue(len - 1));
                if (y > max - 5) {
                    for (var i = max + 1; i < max + 10; i++) {
                        instance.year.appendItem(i);
                    }
                    instance.year.refresh();
                }
                
                if (changed == false) {
                    instance._trigger("change", e, [instance._getDate()]);
                }
    		};
    	}

        this.month.refresh();
   		this.month.move(this.dateObj.getMonth());
   		if (this.month.onScrollEnd_OLD == undefined) {
        	this.month.onScrollEnd_OLD = this.month.iscroll.options.onScrollEnd;
        	this.month.iscroll.options.onScrollEnd = function (e) {
        	    instance.month.onScrollEnd_OLD.call(this, e);
    
        	    var y = parseInt(instance.year.getSelected());
        	    var m = parseInt(instance.month.getSelected());
        	    
        	    var changed = instance._refreshDate(y, m - 1);
    
                if (changed == false) {
                    instance._trigger("change", e, [instance._getDate()]);
                }
    		};
    	}

        this.day.refresh();
   	    instance._refreshDate(this.dateObj.getFullYear(), this.dateObj.getMonth());
   	    this.day.move(this.dateObj.getDate() - 1);
   	    
   	    if (this.day.onScrollEnd_OLD == undefined) {
        	this.day.onScrollEnd_OLD = this.day.iscroll.options.onScrollEnd;
        	this.day.iscroll.options.onScrollEnd = function (e) {
        	    instance.day.onScrollEnd_OLD.call(this, e);
    
                instance._trigger("change", e, [instance._getDate()]);
    		};
    	}

        this._refreshColPos();
    },
    
    _refreshYear: function(y) {
        this.year.scroller.children().remove();
        
        for(var i = y - 20; i <= y + 10; i++) {
            this.year.appendItem(i);
        }

        this.year.refresh();
    },
    
    _refreshDate: function(y, m) {
        var instance = this;
        
	    var lastDay = instance._daysInMonth(m, y);
	    var selected = parseInt(instance.day.getSelected());
	    
	    var refresh = false;
	    var changed = false;
    	    
    	    for (var i = 27; i < 31; i++) {
    	        if (i > lastDay - 1) {
	            if (instance.day.scroller[0].children[i].style.display != "none") {
	                refresh = true;
	                if (i == selected - 1) {
	                    changed = true;
    	        }
            }
	            instance.day.scroller[0].children[i].style.display = "none";
	        }
	        else {
	            if (instance.day.scroller[0].children[i].style.display != "") {
	                refresh = true;
	            }
	            instance.day.scroller[0].children[i].style.display = "";
	        }
        }
        
        if (refresh) {
            instance.day.refresh();
        }
        return changed;
    },
    
    date: function () {
        if (arguments.length == 0) {
            return this._getDate();
        }
        else {
            this._setDateEx.apply(this, arguments);
        }
    },
    
    _setDateEx: function () {
        if (arguments.length == 2) {
            this.dateObj = new Date(arguments[0], arguments[1]);
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
            this._setDate(this.dateObj.getFullYear(), this.dateObj.getMonth(), 1);
        }
        else if (arguments.length == 3) {
            this.dateObj = new Date(arguments[0], arguments[1], arguments[2]);
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
            this._setDate(this.dateObj.getFullYear(), this.dateObj.getMonth(), this.dateObj.getDate());
        }
        else if (arguments.length == 1) {
            if (Object.prototype.toString.call(arguments[0]) === '[object Date]') {
                this.dateObj = arguments[0];
            }
            else if (typeof arguments[0] === "number") {
                this.dateObj = new Date(arguments[0]);
            }
            else {
                this.dateObj = new Date(arguments[0]);
            }
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
            this._setDate(this.dateObj.getFullYear(), this.dateObj.getMonth(), this.dateObj.getDate());
        }
    },
    
    _setDate: function (year, month, day) {
        this._refreshYear(year);
        var minY = parseInt(this.year.getValue(0));
   		this.year.move(year - minY);

   		this.month.move(month);
   		this._refreshDate(year, month);
   		this.day.move(day - 1);
    },
    
    _getDate: function () {
        var instance = this;

	    var yy = parseInt(instance.year.getSelected());
	    var mm = parseInt(instance.month.getSelected());
	    var dd = parseInt(instance.day.getSelected());

        var ret = new Date(yy, mm - 1, dd);

        var timeID = this.element.attr("timepicker");

        if (timeID) {
            timeID = timeID.trim();
            if (timeID.indexOf("#") != 0) {
                timeID = "#" + timeID;
            }
            var time =  $(timeID);
    
            if (time.length > 0) {
                var t = time.timepicker("time");
                ret.setHours(t.getHours());
                ret.setMinutes(t.getMinutes());
            }
        }

        return ret;
    },
    
    _daysInMonth: function (iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }
  });
 
  $(document).bind('pagecreate create', function(e) {
	$.mobile.datepicker.prototype.enhanceWithin( e.target );
  });
  
  $(document).bind('pageshow', function(e) {
    return $(e.target).find(".ui-datepicker").datepicker("init");
  });
})(jQuery);
/* end plugin : mobile.datepicker */

/* start plugin : mobile.timepicker */
(function($) {
  $.widget('mobile.timepicker', $.mobile.picker, {
    options: {
		shadow: true,
		corners: true,
		time: new Date(),
    	initSelector: ":jqmData(role='timepicker')"
    },

	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-corner-all");
                    }
                break;
            }
        }

        return this;
	},

    _create: function () {
		var $el = this.element,
			o = this.options,
			clsName = "ui-" + $.mobile.ns + "timepicker";
			instance = this;

		var viewClass = clsName;
		viewClass += o.shadow ? " ui-shadow" : "";
		viewClass += o.corners ? " ui-corner-all" : "";

		if ( o.inline !== undefined ) {
			viewClass += o.inline === true ? " " + clsName + "-inline" : " " + clsName + "-block";
		}
		
		this.element.addClass("ui-checkscroll ui-scrollview");
        
        this.element.addClass(viewClass);

        var hourElem = document.createElement("div");
        var minuteElem = document.createElement("div");
        var ampmElem = document.createElement("div");

        hourElem.className = 'ui-picker-item ui-time-hour';
        minuteElem.className = 'ui-picker-item ui-time-minute';
        ampmElem.className = 'ui-picker-item ui-time-ampm';

        this.element.append(hourElem);
        this.element.append(minuteElem);
        this.element.append(ampmElem);
        
        this._createBar();

        this.timeObj = o.time;

        if ( Object.prototype.toString.call(o.time) === '[object Date]') {
            this.timeObj = o.time;
        }
        else {
            this.timeObj = new Date(new Date().toDateString() + ' ' + o.time);
        }

        if (isNaN(this.timeObj.getTime())) {
            this.timeObj = new Date();
        }

        var cur = this.timeObj.getHours();
        if (window._isDesigner) {
            this.apmpScr = 0;
            if (cur > 12) {
                cur -= 12;
                this.apmpScr = 1;
            }
        }
        var range = this._checkDesigner(hourElem, 1, 12, cur, 0);
        this.hour = this._createColumn(hourElem, range[0], range[1],
            function(idx) { return "hour h" + idx; },
            function(idx) { return "" + idx; }
        );
		

        var range = this._checkDesigner(hourElem, 0, 59, this.timeObj.getMinutes(), 1);
        this.minute = this._createColumn(minuteElem, range[0], range[1],
            function(idx) { return "minute m" + idx; },
            function(idx) { return "" + idx; }
        );

        if (window._isDesigner) {
            this.scrArr[2] = this.apmpScr;
        }
        var strAM = Globalize.culture().calendars.standard.AM[0];
        var strPM = Globalize.culture().calendars.standard.PM[0];
        this.ampm = this._createColumn(ampmElem, 0, 1,
            function(idx) { return "ampm ap" + idx; },
            function(idx) { return (idx == 0) ? strAM: strPM; }
        );
        
        this.columns = [this.hour, this.minute, this.ampm];

        this._initByTimer();

        if (this.element.closest(":jqmData(role='page')").hasClass("ui-page-active")) {
            this.init();
        }
    },

    init: function () {
        if (this._initCalled || window._isDesigner) {
            return;
        }
        
        this._initCalled = true;
        
        var instance = this;

        var hh = this.element.find(".ui-picker-wrapper").height();
        this.element.find(".ui-picker-scroller > div").height(hh);
        this.element.find(".ui-picker-scroller > div").css("line-height", hh + "px");
        
        this.hour.refresh();
   		
    	var hour_onScrollEnd = this.hour.iscroll.options.onScrollEnd;
    	this.hour.iscroll.options.onScrollEnd = function (e) {
    	    hour_onScrollEnd.call(this, e);

            instance._trigger("change", e, [instance._getTime()]);
		};

        this.minute.refresh();
    	var minute_onScrollEnd = this.minute.iscroll.options.onScrollEnd;
    	this.minute.iscroll.options.onScrollEnd = function (e) {
    	    minute_onScrollEnd.call(this, e);

            instance._trigger("change", e, [instance._getTime()]);
		};

   	    this.ampm.refresh();
    	var ampm_onScrollEnd = this.ampm.iscroll.options.onScrollEnd;
    	this.ampm.iscroll.options.onScrollEnd = function (e) {
    	    ampm_onScrollEnd.call(this, e);

            instance._trigger("change", e, [instance._getTime()]);            
		};
		
		this._setTime(this.timeObj.getHours(), this.timeObj.getMinutes());

        this._refreshColPos();
    },
    
    time: function () {
        if (arguments.length == 0) {
            return this._getTime();
        }
        else {
            this._setTimeEx.apply(this, arguments);
        }
    },
    
    _setTimeEx: function () {
        if (arguments.length == 2) {
            this.timeObj = new Date(arguments[0], arguments[1]);
            if (isNaN(this.timeObj.getTime())) {
                this.timeObj = new Date();
            }
            this._setTime(this.timeObj.getHours(), this.timeObj.getMinutes());
        }
        else if (arguments.length == 3) {
            this.timeObj = new Date(arguments[0], arguments[1], arguments[2]);
            if (isNaN(this.timeObj.getTime())) {
                this.timeObj = new Date();
            }
            this._setTime(this.timeObj.getHours(), this.timeObj.getMinutes());
        }
        else if (arguments.length == 1) {
            if (Object.prototype.toString.call(arguments[0]) === '[object Date]') {
                this.timeObj = arguments[0];
            }
            else if (typeof arguments[0] === "number") {
                this.timeObj = new Date(arguments[0]);
            }
            else {
                this.timeObj = new Date(new Date().toDateString() + ' ' + arguments[0]);
            }
            if (isNaN(this.timeObj.getTime())) {
                this.timeObj = new Date();
            }
            this._setTime(this.timeObj.getHours(), this.timeObj.getMinutes());
        }
    },
    
    _setTime: function (hour, minute) {
        var h = hour;
        var ampm = 0;
        if (h > 12) {
            h -= 12;
            ampm = 1; 
        }
   		this.hour.move(h - 1);
   		this.minute.move(minute);
   		this.ampm.move(ampm);
    },
    
    _getTime: function () {
        var instance = this;

	    var h = parseInt(instance.hour.getSelected());
	    var m = parseInt(instance.minute.getSelected());
	    var ap = parseInt(instance.ampm.getSelected());
	    h += (12 * ap);

        var dateID = this.element.attr("datepicker");
        if (dateID) {
            dateID = dateID.trim();
            if (dateID.indexOf("#") != 0) {
                dateID = "#" + dateID;    
            }
        }

        var date =  $(dateID);
        var ret;
        if (date.length > 0) {
            ret = date.datepicker("date");
        }
        else {
            ret = new Date();
        }

        ret.setHours(h);
        ret.setMinutes(m);
        ret.setSeconds(0);

        return ret;
    }
  });
 
  $(document).bind('pagecreate create', function(e) {
	$.mobile.timepicker.prototype.enhanceWithin( e.target );
  });
  
  $(document).bind('pageshow', function(e) {
    return $(e.target).find(".ui-timepicker").timepicker("init");
  });
})(jQuery);
/* end plugin : mobile.timepicker */

/* start plugin : mobile.schedule */
(function( $, undefined ) {
$.widget("mobile.schedule", $.mobile.widget, {
    options: {
        theme: null,
        shadow: true,
        corners: true,
        date : new Date(),
        initSelector: ":jqmData(role='schedule')"
    },
    
	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-corner-all");
                        $(".ui-btn-active").addClass("ui-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-corner-all");
                        $(".ui-btn-active").removeClass("ui-corner-all");
                    }
                break;
                case "theme":
                    this.element.removeClass("ui-bar-" + prev);
                    this.element.addClass("ui-bar-" + value);
                break;
            }
        }

        return this;
	},
    
    _create: function () {
		var $el = this.element,
			o = this.options;
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

		//var calendarCls = "ui-calendar ui-bar-" + o.theme;
		var calendarCls = "ui-calendar";
		calendarCls += o.shadow ? " ui-shadow" : "";
		calendarCls += o.corners ? " ui-corner-all" : "";
		calendarCls += " ui-bar-" + o.theme;
/*
		if ( o.inline !== undefined ) {
			calendarCls += o.inline === true ? " ui-calendar-inline" : " ui-calendar-block";
		}
*/        
        this.element.addClass(calendarCls);
        
        var titlebar = document.createElement("div");
        titlebar.className = "titlebar";
        
        var prevBtn = document.createElement("div");
        prevBtn.className = "prev";
        this.titleTxt = document.createElement("div");
        this.titleTxt.className = "title";
        var nextBtn = document.createElement("div");
        nextBtn.className = "next";
        
        titlebar.appendChild(prevBtn);
        titlebar.appendChild(this.titleTxt);
        titlebar.appendChild(nextBtn);
        
        this.dayArea = document.createElement("table");
        this.dayArea.className = "dayarea";
        
        this._createCalendar();

        if ( Object.prototype.toString.call(o.date) === '[object Date]') {
        this.dateObj = o.date;
        }
        else {
            this.dateObj = new Date(o.date);
            if (window._isDesigner && isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date(o.date.replace(/-/gi, "/"));
            }
        }
        
        var year = this.dateObj.getFullYear();
        var month = this.dateObj.getMonth();
        this.date(year, month, this.dateObj.getDate());

        this.element.append(titlebar);
        this.element.append(this.dayArea);
        
        var instance = this;

        $(this.dayArea).bind("vclick", function (e) {
            var target = $(e.target);
            if (target.hasClass("ui-day")) {
                //alert(e.target.className);
                $(instance.dayArea).find(".ui-btn-active").removeClass("ui-btn-active");
                var clsName = "ui-btn-active";
                clsName += instance.options.corners ? " ui-corner-all" : "";
                target.addClass(clsName);

                var needRefresh = false;
                var yy = instance.dateObj.getFullYear();
                var mm = instance.dateObj.getMonth();
                var num = parseInt(target.attr("day"));
                
                var retDate = new Date(yy, mm, 1);

                if (target.hasClass("ui-prev-month")) {
                    retDate.setMonth(mm - 1);
                    needRefresh = true;
                }
                else if (target.hasClass("ui-next-month")) {
                    retDate.setMonth(mm + 1);;
                    needRefresh = true;
                }

                retDate.setDate(num);

                if (needRefresh) {
                    instance.date(retDate);
                }
                
                //instance.element.addClass("ui-focus");
                instance._trigger("change", e, [retDate]);
            }
        });
        
        $(prevBtn).buttonMarkup({ mini: true, icon: "arrow-l", iconpos: "notext", theme: o.theme }).bind("vclick", function (e) {
            instance.dateObj = new Date(instance.dateObj.getFullYear(), instance.dateObj.getMonth() - 1);
            instance.date(instance.dateObj.getFullYear(), instance.dateObj.getMonth());
        });;
        $(nextBtn).buttonMarkup({ mini: true, icon: "arrow-r", iconpos: "notext", theme: o.theme }).bind("vclick", function (e) {
            instance.dateObj = new Date(instance.dateObj.getFullYear(), instance.dateObj.getMonth() + 1);
            instance.date(instance.dateObj.getFullYear(), instance.dateObj.getMonth());
        });;
        
        this.handleKeydown = function( event ) {
    		switch ( event.keyCode ) {
    		 case $.mobile.keyCode.UP:
    			event.preventDefault();
    		    instance.date(instance.dateObj.getFullYear(), instance.dateObj.getMonth(), instance.dateObj.getDate() - 7);
    		    break;
    		 case $.mobile.keyCode.RIGHT:
    			event.preventDefault();
    		    instance.date(instance.dateObj.getFullYear(), instance.dateObj.getMonth(), instance.dateObj.getDate() + 1);
    		    break;
    		 case $.mobile.keyCode.DOWN:
    			event.preventDefault();
    		    instance.date(instance.dateObj.getFullYear(), instance.dateObj.getMonth(), instance.dateObj.getDate() + 7);
    		    break;
    		 case $.mobile.keyCode.LEFT:
    			event.preventDefault();
    		    instance.date(instance.dateObj.getFullYear(), instance.dateObj.getMonth(), instance.dateObj.getDate() - 1);
    			break;
    		 case $.mobile.keyCode.ENTER:
    			event.preventDefault();
    			instance._trigger("change", event, [instance.dateObj]);
    			break;
    		}
    	},

        this.element.bind( "keydown", instance.handleKeydown );
        
        // Call the widget _create prototype
        $.mobile.widget.prototype._create.call(this);      
    },
    
    _createCalendar: function () {
        var tr1 = document.createElement("tr");
        tr1.className = "ui-day-week";
        for(var i = 0; i < 7; i++) {
            var day = document.createElement("th");
            day.className = "ui-day-head";
            var txt = Globalize.culture().calendars.standard.days.namesShort[i];
            day.innerHTML = txt;
            tr1.appendChild(day);
        }
        this.dayArea.appendChild(tr1);
        
        for(var j = 0; j < 6; j++) {
            var tr = document.createElement("tr");
            tr.className = "ui-day-week";
            for(var i = 0; i < 7; i++) {
                var day = document.createElement("td");
                tr.appendChild(day);
            }
            this.dayArea.appendChild(tr);
        }
    },
    
    date: function () {
        if (arguments.length == 0) {
            return this._getDate();
        }
        else {
            this._setDateEx.apply(this, arguments);
        }
    },
    
    _setDateEx: function () {
        if (arguments.length == 2) {
            this.dateObj = new Date(arguments[0], arguments[1]);
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
            this._setDate(this.dateObj.getFullYear(), this.dateObj.getMonth());
        }
        else if (arguments.length == 3) {
            this.dateObj = new Date(arguments[0], arguments[1], arguments[2]);
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
            this._setDate(this.dateObj.getFullYear(), this.dateObj.getMonth(), this.dateObj.getDate());
        }
        else if (arguments.length == 1) {
            if (Object.prototype.toString.call(arguments[0]) === '[object Date]') {
            this.dateObj = arguments[0];
            }
            else {
                this.dateObj = new Date(arguments[0]);
            }
            if (isNaN(this.dateObj.getTime())) {
                this.dateObj = new Date();
            }
            this._setDate(this.dateObj.getFullYear(), this.dateObj.getMonth(), this.dateObj.getDate());
        }
    },
    
    _setDate: function (year, month, day) {
        var startDay = (new Date(year, month, 1)).getDay();
        //var lastDay = (new Date(year, month + 1, 0)).getDate();
        this.titleTxt.innerHTML = Globalize.format(new Date(year, month), "Y");
        for(var j = 0; j < 6; j++) {
            var tr = this.dayArea.children[j + 1];
            for(var i = 0; i < 7; i++) {
                var dayTag = tr.children[i];
                var idx = (7 * j + i) - startDay + 1;
                var date = new Date(year, month, idx);
                dayTag.setAttribute("day", date.getDate());
                var clsName = "ui-day";
                if (idx < 1) {
                    clsName = "ui-prev-month " + clsName;
                }
                else {
                    if (date.getMonth() != month) {
                        clsName = "ui-next-month " + clsName;
                        if (i == 0) {
                            //tr.style.display = "none";
                        }
                    }
                    else {
                        if (i == 0) {
                            tr.style.display = "";
                        }
                        if (date.getDate() == day) {
                            clsName = "ui-btn-active " + clsName;
                            clsName += this.options.corners ? " ui-corner-all" : "";
                        }
                    }
                }
                dayTag.className = clsName;
                dayTag.innerHTML =  + date.getDate();
            }
        }
    },
    
    _getDate: function () {
        return new Date(this.dateObj.getFullYear(), this.dateObj.getMonth(), this.dateObj.getDate());
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.schedule.prototype.enhanceWithin( e.target );
});
})( jQuery );
/* end plugin : mobile.schedule */

/* start plugin : mobile.menu */
(function( $, undefined ) {
$.widget("mobile.menu", $.mobile.widget, {
    options: {
        theme: null,
        shadow: true,
        corners: false,
        initSelector: ":jqmData(role='menu')"
    },

	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            var all = this.element.find(".ui-submenu");
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                        all.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                        all.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-corner-all");
                        all.addClass("ui-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-corner-all");
                        all.removeClass("ui-corner-all");
                    }
                break;
                case "theme":
                    this.element.removeClass("ui-bar-" + prev);
                    all.removeClass("ui-bar-" + prev);
                    this.element.addClass("ui-bar-" + value);
                    all.addClass("ui-bar-" + value);
                break;
            }
            
        }

        return this;
	},

    _create: function () {
		var $el = this.element,
			o = this.options;
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

		var menuCls = "";
		menuCls += o.shadow ? " ui-shadow" : "";
		menuCls += o.corners ? " ui-corner-all" : "";
		menuCls += " ui-bar-" + o.theme;

        this.menuCls = menuCls;
        this.element.addClass("ui-menu" + menuCls);

        this.element.children().filter(function(index) {
            return (this.tagName == "UL");
        }).addClass("ui-mainmenu ui-menu-ul");
        this.element.find("ul ul").addClass("ui-submenu ui-menu-ul" + this.menuCls);
        
        var liElems = this.element.find("li");
        for (var i = 0; i < liElems.length; i++) {
            this._applyNode(liElems[i]);
        }

        this._evtState = false;
        var instance = this;

        this._closeMenu = function (e) {
            instance.element.find(".ui-submenu").css("display", "none"); //.stop(true, true).slideUp();
            $(document).unbind("vclick", instance._closeMenu);
            instance._evtState = false;
            instance.element.trigger("closeMenu");
        };
        
        this._addEvent = function () {
            if (instance._evtState == false) {
                $(document).bind("vclick", instance._closeMenu);
                instance._evtState = true;
            }
        };
        
        this.element.bind("vclick", function (e) {
            var $target = $(e.target); //$(e.target).parent();
            while ($target.length > 0 && $target[0].tagName && $target[0].tagName.toLowerCase() != "li") {
                $target = $target.parent();
            }
            var ul = $target.children().filter("ul");
            if (ul && ul.length > 0) {
                instance._trigger("select", e, [$target[0]]);
                
                var isHidden = (ul.css("display") != "block");

                instance.element.find(".ui-submenu").filter(function (index) {
                    if (ul[0] == this) {
                        return false;
                    }
                    var tmp = ul.parent().closest("ul.ui-submenu");
                    while (tmp.length > 0) {
                        if (tmp[0] == this) {
                            return false;
                        }
                        tmp = tmp.parent().closest("ul.ui-submenu");
                    }
                    return true;
                }).css("display", "none"); //.stop(true, true).slideUp();
                
                if (isHidden) {
                    $(document).trigger("vclick");
                    ul.css("display", "block"); //.stop(true, true).slideDown();
                    //var tOff = $target.position();
                    var uOff = ul.offset();
                    if (ul.parent().closest("ul").hasClass("ui-submenu")) {
                        var right = uOff.left + $target.innerWidth() + ul.outerWidth();
                        ul.css( "top" , (0) + "px" );
                        if (right < window.outerWidth) {
                            ul.css( "left" , ($target.innerWidth()) + "px" );
                            ul.css( "width" , "auto" );
                        }
                        else {
                            var w = ul.outerWidth();
                            ul.css( "left" , -w + "px" );
                            ul.css( "width" , w + "px" );
                        }
                    }
                    instance._addEvent();
                }
                else {
                    ul.css("display", "none");
                    var tmp = ul.parent().closest("ul.ui-submenu");
                    if (tmp.length == 0) {
                        instance._closeMenu();
                    }
                }

                e.stopPropagation();
            }
            else {
                instance._closeMenu();

                instance._trigger("select", e, [$target[0]]);
            }
            //$(e.target).find("ul").stop(true, true).slideUp();
        });

        $.mobile.widget.prototype._create.call(this);              
    },
    
    _applyNode: function(node) {
        var textNode = node.firstChild;
        var text = "";
        if (textNode != null) {
            if (textNode.nodeType == 3) {
                text = textNode.nodeValue.trim();
            }
            else if (textNode.nodeType == 1 && textNode.nodeName != "UL") {
                if ($(textNode).find("span.ui-node").length > 0) {
                    return;
                }
                text = textNode.innerHTML.trim();
            }
            else {
                return;
            }
        }
        node.className = "ui-menu-li";
        var aElem = document.createElement("span");
        //aElem.href = "#";
        aElem.className = "ui-node";
        aElem.innerHTML = text;
        node.replaceChild(aElem, textNode);
        //node.insertBefore(aElem, node.firstChild);
    },
    
    getNode: function(parent, idx) {
        var p = $(parent);
        if (p.length == 0) {
            p = this.element;
        }
        var items = $(p).children().filter("ul").children().filter("li");
        if (idx >= 0 && idx < items.length) {
            return items[idx];
        }
        return null;
    },
    
    childCount: function(node) {
        $n = $(node);
        if ($n.length == 0) {
            $n = this.element;
        }
        return ($n.children().filter("ul").children().filter("li").length);
    },
    
    getText: function(node) {
        var text = $(node).find("span.ui-node").text();
        return text;
    },
    
    setText: function(node, text) {
        $(node).find("span.ui-node").text(text);
    },
    
    append: function (node, parent) {
        var p = $(parent);
        var n = $(node);
        if (p.length == 0) {
            p = this.element;
        }
        this._applyNode(n[0]);
        var pNode = $(p).children().filter("ul");
        if (pNode.length == 0) {
            var ulElem = document.createElement("ul");
            pNode = $(ulElem);

            if (p == this.element) {
                pNode.addClass("ui-mainmenu");
            }
            else {
                pNode.addClass("ui-submenu" + this.menuCls);
            }
            p.append(pNode);
        }
        pNode.append(n);
    },
    
    insertBefore: function (node, next) {
        var n = $(node);
        this._applyNode(n[0]);
        n.insertBefore($(next));
    },
    
    remove: function (node) {
        var n = $(node);
        var pNode = $(n).closest("ul");
        if (pNode.length == 0) {
            return;
        }
        n.remove();
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.menu.prototype.enhanceWithin( e.target );
});
})( jQuery );
/* end plugin : mobile.menu */

/* start plugin : mobile.progressbar */
(function( $, undefined ) {
$.widget("mobile.progressbar", $.mobile.widget, {
    options: {
        theme: null,
        shadow: true,
        corners: true,
        initSelector: ":jqmData(role='progressbar')"
    },
    
	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            var all = this.element.find("*");
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-btn-corner-all");
                        all.addClass("ui-btn-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-btn-corner-all");
                        all.removeClass("ui-btn-corner-all");
                    }
                break;
                case "theme":
                    this.element.removeClass("ui-bar-" + prev);
                    this.element.addClass("ui-bar-" + value);
                break;
            }
            
        }

        return this;
	},
    
    _create: function () {
		var $el = this.element,
			o = this.options;
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

        var val = parseInt(this.element.attr("value"));

        if ( isNaN(val) ) {
            val = 0;
        }
                
		var cls = "";
		cls += " ui-btn-down-" + o.theme;
		cls += o.shadow ? " ui-shadow" : "";
		cls += o.corners ? " ui-btn-corner-all" : "";
		
        this.element.addClass("ui-progressbar" + cls);
        
        this.bg = $(document.createElement("div"));
        
        var bgCls = o.corners ? " ui-btn-corner-all" : "";
        
        this.bg.addClass("ui-progressbar-bg ui-btn-active" + bgCls);
        
        this.element.append(this.bg);
        
        this.setValue(val);

        $.mobile.widget.prototype._create.call(this);              
    },
    
    getValue: function () {
        return this.value;
    },
    
    setValue: function (val) {
        this.value = val;
        this.bg.css("width", this.value + "%");
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.progressbar.prototype.enhanceWithin( e.target );
});
})( jQuery );
/* end plugin : mobile.progressbar */

/* start plugin : mobile.indicator */
(function ( $, undefined ) {
$.widget( "mobile.indicator", $.mobile.widget, {
	options: {
	    size: 1,
	    index: 0,
		circular: false,
	    theme: null
	},
	
	_setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "theme":
                    $el.removeClass(prev);
                    $el.addClass(value);
                    break;
            }   
        }
        return this;
	},
	
	_checkRange: function (size, index) {
	    if (typeof(size) !== "number" || size < 1
	        || typeof(index) !== "number" || index < 0 || index > size - 1) {
		    return -1;
		}
	},
	
	_setElement: function (size, index) {
	},
	
	_create: function () {
	},
	
	next: function () {
	    var o = this.options,
			index = o.index + 1;
		if (o.circular) {
		    if (index === o.size) index = 0;
		}
		this.setIndex(index);
	},
	previous: function () {
	    var o = this.options,
			index = o.index - 1;
		if (o.circular) {
		    if (index < 0) index = o.size - 1;
		}
		this.setIndex(index);
	},
	setIndex: function (index) {
	    var $el = this.element,
			o = this.options;
			
		if (typeof(index) === "number" && index >= 0) {	
    	    elem = $el.children().get(index);
    	    if (elem) {
                $el.find(".ui-indicator-dot-focus").removeClass("ui-indicator-dot-focus");
                $(elem).addClass("ui-indicator-dot-focus");
                o.index = index;
            }
        }
	},
	getIndex: function () {
	    return this.options.index;
	},
	setSize: function (size) {
	    var $el = this.element,
			o = this.options;
			
		if (typeof(size) === "number" && size > 0) {
    	    $el.empty();
    	    if (size <= o.index) o.index = size - 1;
    	    this._setElement(size, o.index);
    	    o.size = size;
        }
	},
	getSize: function () {
	    return this.options.size;
	}
});
})( jQuery );
/* end plugin : mobile.indicator */

/* start plugin : mobile.circleindicator */
(function ( $, undefined ) {
$.widget( "mobile.circleindicator", $.mobile.indicator, {
	options: {
	    initSelector: ":jqmData(role='circleindicator')"
	},
	
	_setElement: function(size, index) {
	    var $el = this.element,
	        dots = "",
	        i;
	    
	    if (this._checkRange(size, index) === -1) return;
	    
	    for (i = 0; i < size; i++) {
		    dots += "<div class='ui-indicator-dot" + (i === index ? " ui-indicator-dot-focus" : "") + "'></div>";
		}
		
		$el.append(dots);
	},
	
	_create: function () {
		var $el = this.element,
			o = this.options,
			size = Number($el.attr("size")) || 1,
			index = Number($el.attr("index")) || 0,
			circular = $el.attr("circular") === "true" ? true : false;
			
			o.size = size;
			o.index = index;
			o.circular = circular;
			
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme($el, "c");
        }

		$el.addClass("ui-indicator ui-circleindicator " + o.theme);
		
		this._setElement(size, index);
		
		$el.bind("vclick", function (e) {
		    e.preventDefault();
		    e.stopPropagation();
		    
		    var $target = $(e.target),
		        idx;
		    if ($target.hasClass("ui-indicator-dot")) {
		        idx = $el.children().index($target);
		        $el.trigger("circleindicatorselect", [idx]);
		    }
		});
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.circleindicator.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.circleindicator */

/* start plugin : mobile.barindicator */
(function ( $, undefined ) {
$.widget( "mobile.barindicator", $.mobile.indicator, {
	options: {
	    initSelector: ":jqmData(role='barindicator')"
	},
	
	_setElement: function(size, index) {
	    var $el = this.element,
	        dots = "",
	        i;
	    
	    if (this._checkRange(size, index) === -1) return;
	    
	    for (i = 0; i < size; i++) {
		    dots += "<div class='ui-indicator-dot" + (i === index ? " ui-indicator-dot-focus" : "") 
		        + "' style='width:" + (Math.floor(100 / size) - 3) + "%;'></div>";
		}
		
		$el.append(dots);
	},
	
	_create: function () {
		var $el = this.element,
			o = this.options,
			size = Number($el.attr("size")) || 1,
			index = Number($el.attr("index")) || 0,
			circular = $el.attr("circular") === "true" ? true : false;
			
			o.size = size;
			o.index = index;
			o.circular = circular;
			
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme($el, "c");
        }

		$el.addClass("ui-indicator ui-barindicator " + o.theme);
		
		this._setElement(size, index);
		
		$el.bind("vclick", function (e) {
		    e.preventDefault();
		    e.stopPropagation();
		    
		    var $target = $(e.target),
		        idx;
		    if ($target.hasClass("ui-indicator-dot")) {
		        idx = $el.children().index($target);
		        $el.trigger("barindicatorselect", [idx]);
		    }
		});
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.barindicator.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.barindicator */

/* start plugin : mobile.numberindicator */
(function ( $, undefined ) {
$.widget( "mobile.numberindicator", $.mobile.indicator, {
	options: {
	    initSelector: ":jqmData(role='numberindicator')"
	},
	
	_setElement: function(size, index) {
	    var $el = this.element,
	        elems = "";
	    
	    if (this._checkRange(size, index) === -1) return;
	    
	    elems = "<span class='ui-numberindicator-index'>" + (index + 1) + "</span>"
	        + "/"
	        + "<span class='ui-numberindicator-size'>" + size + "</span>";
		
		$el.append(elems);
	},
	
	_create: function () {
		var $el = this.element,
			o = this.options,
			size = Number($el.attr("size")) || 1,
			index = Number($el.attr("index")) || 0,
			circular = $el.attr("circular") === "true" ? true : false;
			
			o.size = size;
			o.index = index;
			o.circular = circular;
			
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme($el, "c");
        }

		$el.addClass("ui-indicator ui-numberindicator " + o.theme);
		
		this._setElement(size, index);
	},
	
	setIndex: function (index) {
	    var $el = this.element,
			o = this.options;
			
	    if (typeof(index) === "number" && index >= 0) {
    	    if (index < o.size) {
                $el.find(".ui-numberindicator-index").text(index + 1);
                o.index = index;
            }
        }
	},
	setSize: function (size) {
	    var $el = this.element,
			o = this.options;
			
		if (typeof(size) === "number" && size > 0) {
    	    $el.find(".ui-numberindicator-size").text(size);
    	    o.size = size;
        }
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.numberindicator.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.numberindicator */

/* start plugin : mobile.label */
(function( $, undefined ) {
$.widget("mobile.label", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='label')"
    },
    
    _create: function () {
		var $el = this.element,
			o = this.options;
/*			
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }
*/
		//var calendarCls = "ui-calendar ui-bar-" + o.theme;
		var labelCls = "ui-label aligned";
		//labelCls += o.shadow ? " ui-shadow" : "";
		//labelCls += o.corners ? " ui-corner-all" : "";
		//calendarCls += " ui-bar-" + o.theme;

        this.element.addClass(labelCls);
        
        var inner = document.createElement("span");
        inner.className = "ui-label-inner";
        
        var text = document.createElement("span");
        text.className = "ui-label-text";
        
        inner.appendChild(text);

        $(text).text(this.element[0].innerHTML);
        this.element[0].innerHTML = "";

        this.element.append(inner);
        
        this.textElem = $(text);

        $.mobile.widget.prototype._create.call(this);      
    },
    
    text: function () {
        if (arguments.length == 0) {
            return this._getText();
        }
        else {
            this._setText(arguments[0]);
        }
    },
    
    _setText: function (str) {
        this.textElem.text(str);
    },
    
    _getText: function () {
        return this.textElem.text();
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.label.prototype.enhanceWithin( e.target );
});
})( jQuery );
/* end plugin : mobile.label */

/* start plugin : mobile.buttonex */
(function( $, undefined ) {
$.widget("mobile.buttonex", $.mobile.widget, {
    options: {
        theme: null,
        shadow: true,
        corners: true,
        initSelector: ":jqmData(role='buttonex')"
    },
    
    _create: function () {
        if ( !this.options.theme ) {
            this.options.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

        this.element.addClass("ui-buttonex aligned");

        this.element.buttonMarkup(this.options);

        $.mobile.widget.prototype._create.call(this);      
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.buttonex.prototype.enhanceWithin( e.target );
});
})( jQuery );
/* end plugin : mobile.buttonex */

/* start plugin : mobile.mediacontrol */
(function( $, undefined ) {
$.widget("mobile.mediacontrol", $.mobile.widget, {
    options: {
        theme: null,
        media: null,
        owner: null,
        autoHide: false,
        hide: false,
        initSelector: ":jqmData(role='mediacontrol')"
    },
    
    _create: function () {
		var $el = this.element,
			o = this.options;
			
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

		var myCls = "ui-mediacontrol";
		myCls += o.shadow ? " ui-shadow" : "";
		myCls += o.corners ? " ui-corner-all" : "";
		myCls += o.hide ? " ui-hidden" : "";
		myCls += " ui-bar-" + o.theme;
		
        this.element.addClass(myCls);
        
        var play_pause = document.createElement("div");
        play_pause.className = "ui-btn-play aligned";
        play_pause.ctype = 0;
        
        var progress = document.createElement("input");
        progress.className = "ui-slider-progress";
        progress.setAttribute("min", "0");
        progress.setAttribute("max", "200");
        progress.setAttribute("value", "0");
        progress.setAttribute("data-highlight", "true");
        
        var volume = document.createElement("input");
        volume.className = "ui-slider-volume";
        volume.setAttribute("min", "0");
        volume.setAttribute("max", "100");
        volume.setAttribute("value", "0");
        volume.setAttribute("data-highlight", "true");
        
        var mute = document.createElement("div");
        mute.className = "ui-btn-mute aligned";
        mute.ctype = 1;
        
        var fullscreen = document.createElement("div");
        fullscreen.className = "ui-btn-fullscreen aligned";
        fullscreen.ctype = 2;
                
        this.element.append(play_pause);
        this.element.append(progress);
        this.element.append(volume);
        this.element.append(mute);
        this.element.append(fullscreen);
        
        this.playBtn = $(play_pause);
        this.progressElem = $(progress);
        this.volumeElem = $(volume);
        this.muteBtn = $(mute);
        this.fullScrBtn = $(fullscreen);
        
        //this.playBtn.text("play");
        //this.muteBtn.text("mute");
        //this.fullScrBtn.text("full");

        this.playBtn.buttonMarkup({ mini: true, corners: false, theme: o.theme, inline: true });
        this.progressElem.slider({ mini: true, inline: true, highlight: true });
        this.volumeElem.slider({ mini: true, inline: true, highlight: true });    
        this.muteBtn.buttonMarkup({ mini: true, corners: false, theme: o.theme, inline: true });
        this.fullScrBtn.buttonMarkup({ mini: true, corners: false, theme: o.theme, inline: true });
        
        this.element.children().addClass("inneritem");
        
        this.owner = o.owner;
		this.setMedia(o.media);

        this.seekState = false;

        var instance = this;
        
        this.element.find(".ui-btn").bind("vclick", function (e) {
            var btn = $(e.currentTarget);
            var state = btn.hasClass("on");
            
            instance._autoHide(true);
            switch (e.currentTarget.ctype) {
              case 0: // play,pause
                if (state) {
                  instance.pause();
                }
                else {
                  instance.play();
                }
                break;
              case 1: // mute
                instance.mute(!state);
                break;
              case 2: // fullscreen
                instance.setFullScreen(!state);
                break;
            }
        });
        
        $.mobile.widget.prototype._create.call(this);      
    },
    
    setMedia : function (media) {
        if (this.media) {
            this.media.init = false;
        }
        this.media = media;
        this.init();
    },
    
    init : function () {
        if (this.media) {
            var instance = this;

            this.media.addEventListener("loadedmetadata", function (e) {
                if (instance.media.readyState > 0) {
                    instance._init();
                }
            });

            if (this.media.readyState > 0) {
                this._init();
            }
        }        
    },
    
    _init: function () {
        if (this.media && this.media.init != true) {
            var instance = this;

            this.media.addEventListener("play", function (e) {
                instance._setPlayState(true);
            });
            this.media.addEventListener("pause", function (e) {
                instance._setPlayState(false);
            });

            //this.media.addEventListener("error", function (e) {
                instance._checkError();
            //});

            this.media.addEventListener("timeupdate", function (e) {
                instance._setProgress(e.currentTarget.currentTime);
                instance.owner._trigger("timeupdate", e, [e.currentTarget.currentTime]);
            });

            this.media.addEventListener("ended", function (e) {
                instance._setProgress(0);
                instance.owner._trigger("end");
            });
            
            this.progressElem.bind( "slidestart", function(event, ui) {
                //console.log("progress1 : " + instance.media.currentTime);
                instance.seekState = true;
                instance._autoHide(false);
            });

            this.progressElem.bind( "slidestop", function(event, ui) {
                //console.log("progress2 : " + event.currentTarget.value);
                instance._seekPercent(parseInt(event.currentTarget.value));
                instance.seekState = false;
                instance._autoHide(true);
            });

            this.volumeElem.bind( "slidestart", function(event, ui) {
                instance._autoHide(false);
            });
            
            this.volumeElem.bind( "slidestop", function(event, ui) {
                //console.log("progress2 : " + event.currentTarget.value);
                instance._setVolumePercent(parseInt(event.currentTarget.value));
                instance._autoHide(true);
            });

            this.media.addEventListener("volumechange", function (e) {
                if (instance.media.muted == false) {
                    instance._setVolume(instance.media.volume);
                }
                instance.mute(instance.media.muted);
            });

            if (this.options.hide == false) {
                this._autoHide(true);
            }
            
            this.media.init = true;
        }
        
        this.refresh();
    },
    
    _autoHide: function (val) {
        if (this.options.autoHide && window._isDesigner == false) {
            var instance = this;
            clearTimeout(this.timeout);
            if (val) {
                this.timeout = setTimeout(function () {
                    instance.hide();
                }, 4000);
            }
        }
    },
    
    _checkError : function () {
        if (this.media.error != null) {
            var msg = "";
            switch (this.media.error.code) {
                 case this.media.error.MEDIA_ERR_ABORTED:
                   msg = 'You aborted the video playback.';
                   break;
                 case this.media.error.MEDIA_ERR_NETWORK:
                   msg = 'A network error caused the video download to fail part-way.';
                   break;
                 case this.media.error.MEDIA_ERR_DECODE:
                   msg = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
                   break;
                 case this.media.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                   msg = 'The video could not be loaded, either because the server or network failed or because the format is not supported.';
                   break;
                 default:
                   msg = 'An unknown error occurred.';
                   break;
            }
            alert(msg);
            return true;
        } else {
            
        }
        return false;
    },
    
    refresh : function () {
        if (this.media) {
            this.setVolume(this.media.volume);
            this.mute(this.media.muted);

            this._initProgress();

            var seekable = this.media.seekable;
            
            if (seekable && seekable.length > 0) {
                this.progressElem.slider("enable");
            }
            else {
                this.progressElem.slider("disable");
            }
        }
    },
    
    _setProgress: function (value) {
        if (this.seekState == false) {
            var newVal = (value * 200) / this.media.duration;
            if (this.progressElem[0].value != newVal) {
                this.progressElem[0].value = newVal;
                this.progressElem.slider("refresh");
            }
        }
    },
    
    _seekPercent : function (value) {
        this.seek( value * this.media.duration / 200 );
    },

    seek: function (time) {
        if (time < 0) {
            time = 0;
        }
        else if (time > this.media.duration) {
            time = this.media.duration;
        }
        this.media.currentTime = time;
    },
    
    _initProgress: function () {
        if (this.media.readyState > 0) {
            this.seek(0);
        }
        //this.progressElem.attr("min", "0");
        //this.progressElem.attr("max", Math.round(this.media.duration));
        this.progressElem.attr("value", "0");
        this.progressElem.slider("refresh");
    },
    
    setVolume : function (value) {
        if (value > 1) {
            value = 1;
        }
        else if (value < 0) {
            value = 0;
        }
        if (this.media && this.media.volume != value) {
            this.media.volume = value;
        }
        this._setVolume(value);
    },
    
    _setVolumePercent : function (value) {
        this.setVolume( value / 100 );
    },

    _setVolume : function (value) {
        var newVal = (value * 100);
        if (this.volumeElem[0].value != newVal) {
            this.volumeElem[0].value = newVal;
            this.volumeElem.slider("refresh");
        }
    },
    
    getVolume : function () {
        return this.media.volume;
    },
    
    play: function () {
        if (this._checkError() == true) {
            return;
        }
        this._setPlayState(true);
        // play start.
        if (this.media) {
          this.media.play();
        }
    },
    
    pause: function () {
        this._setPlayState(false);
        // play pause.
        if (this.media) {
          this.media.pause();
        }
    },

    _setPlayState: function (val) {
        if (val) {
            this.playBtn.addClass("on");
        }
        else {
            this.playBtn.removeClass("on");
        }    
    },
    
    isPlaying: function () {
        return this.playBtn.hasClass("on");
    },
    
    mute: function (value) {
        if (value) {
            this.muteBtn.addClass("on");
        }
        else {
            this.muteBtn.removeClass("on");
        }

        if (this.media) {
            //
            this.media.muted = value;

            if (value) {
                this._setVolume(0);
                this.volumeElem.slider("disable");
            }
            else {
                this.setVolume(this.media.volume);
                this.volumeElem.slider("enable");
            }      
        }
    },
    
    show: function() {
        this.element.removeClass("ui-hidden");
        this.element.addClass("ani ui-shown");
        this._autoHide(true);
    },

    hide: function() {
        this.element.removeClass("ui-shown");
        this.element.addClass("ani ui-hidden");
    },
    
    setFullScreen: function (value) {
        if (value) {
            this.fullScrBtn.addClass("on");
        }
        else {
            this.fullScrBtn.removeClass("on");
        }

        if (this.media) {
          var isPlaying = this.isPlaying();
          if (value) {
            //this.media.webkitEnterFullScreen();
            this.parentElem = $(this.media).closest(".ui-video");
            var bodyElem = $(document.body);
            var videoElem = bodyElem.find(".ui-video.fullscreen");
            if (videoElem.length == 0) {
                var video = document.createElement("div");
                video.className = "ui-video fullscreen";
                videoElem = $(video);
                bodyElem.append(videoElem);
            }
            
            var theme = "ui-bar-" + this.options.theme;
            
            videoElem.addClass(theme);

            videoElem.css("display", "block");
            videoElem.append(this.parentElem.children());
            videoElem.data("target", this);
          }
          else {
            var bodyElem = $(document.body);
            var videoElem = bodyElem.find(".ui-video.fullscreen");
            if (videoElem.length > 0) {
                this.parentElem.append(videoElem.children());
                videoElem.css("display", "none");
            }
            var theme = "ui-bar-" + this.options.theme;
            
            videoElem.removeClass(theme);
            videoElem.data("target", null);
          }
          if (isPlaying) {
            this.media.play();
          }
        }
    },
    
    isFullScreen: function () {
        return this.fullScrBtn.hasClass("on");
    },
    
    handleKeydown: function (event) {
   		switch ( event.keyCode ) {
		 case $.mobile.keyCode.UP:
		    this.setVolume(this.getVolume() + 0.1);
		    break;
		 case $.mobile.keyCode.RIGHT:
		    this.seek(this.media.currentTime + 5);
		    break;
		 case $.mobile.keyCode.DOWN:
		    this.setVolume(this.getVolume() - 0.1);
		    break;
		 case $.mobile.keyCode.LEFT:
		    this.seek(this.media.currentTime - 5);
			break;
		 case $.mobile.keyCode.ENTER:
		    if (this.isPlaying()) {
		        this.pause();
		    }
		    else {
		        this.play();
		    }
			break;
   		}
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.mediacontrol.prototype.enhanceWithin( e.target );
});
})( jQuery );
/* end plugin : mobile.mediacontrol */

/* start plugin : mobile.video */
(function( $, undefined ) {
$.widget("mobile.video", $.mobile.widget, {
    options: {
        theme: null,
        shadow: true,
        corners: false,
        autoHideControl: true,
        hideControl: false,
        initSelector: ":jqmData(role='video')"
    },
    
	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-corner-all");
                    }
                break;
                case "theme":
                    this.element.removeClass("ui-bar-" + prev);
                    this.element.addClass("ui-bar-" + value);
                break;
            }
            
        }

        return this;
	},

    _create: function () {
		var $el = this.element,
			o = this.options;
			
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

		var myCls = "ui-video";
		myCls += o.shadow ? " ui-shadow" : "";
		myCls += o.corners ? " ui-corner-all" : "";
		myCls += " ui-bar-" + o.theme;

        this.element.addClass(myCls);
        
        var videoarea = document.createElement("div");
        videoarea.className = "videoarea inneritem";
        
        this.video = document.createElement("video");
        this.video.className = "video inneritem";
        this.video.src = this.element.attr("src");
        //this.video.setAttribute("controls", "controls");
        
        videoarea.appendChild(this.video);

        this.block = document.createElement("div");
        this.block.className = "block";

        videoarea.appendChild(this.block);

        var control = document.createElement("div");
        
                
        this.element.append(videoarea);
        this.element.append(control);
        
        this.control = $(control);
        
        this.control.mediacontrol({ media: this.video, owner: this, autoHide: o.autoHideControl, hide: o.hideControl });
        this.control.addClass("inneritem");
        
        var instance = this;

        $(this.block).bind("click", function (e) {
            if (instance.control.hasClass("ui-hidden")) {
                instance.showControl();
            }
            else {
                instance.hideControl();
            }
        });
        
        $.mobile.widget.prototype._create.call(this);      
    },
    
    URL : function () {
        if (arguments.length > 0) {
            if (this.video.src != arguments[0].trim()) {
                this.control.mediacontrol("pause");

                this.element.attr("src", arguments[0]);
                this.video.src = arguments[0];
                //this.control.mediacontrol("refresh");
            }
        }
        else {
            return this.video.src;
        }        
    },
    
    volume : function () {
        if (arguments.length > 0) {
            this.control.mediacontrol("setVolume", arguments[0]);
        }
        else {
            return this.video.volume;
        }
    },
    
    play: function () {
        this.control.mediacontrol("play");
    },
    
    pause: function () {
        this.control.mediacontrol("pause");
    },
    
    isPlaying: function () {
        return this.control.mediacontrol("isPlaying");
    },

    mute: function (value) {
        this.control.mediacontrol("mute", value);
    },
    
    isMuted: function () {
        return this.video.muted;
    },
    
    seek: function (time) {
        this.control.mediacontrol("seek", time);
    },
    
    getCurrentTime: function () {
        return this.video.currentTime;
    },
    
    getDuration: function () {
        return this.video.duration;  
    },

    setFullScreen: function (value) {
        this.control.mediacontrol("setFullScreen", value);
    },
    
    isFullScreen: function () {
        return this.control.mediacontrol("isFullScreen");
    },
    
    showControl: function() {
        this.control.mediacontrol("show");
    },
    
    hideControl: function() {
        this.control.mediacontrol("hide");
    },
    
    handleKeydown: function (event) {
        this.control.mediacontrol("handleKeydown", event);
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.video.prototype.enhanceWithin( e.target );
});

$(document).on("pagehide popupafterclose", function(evt) {
    var page = evt.target;
    var media = $(page).find("video");
    for (var i = 0; i < media.length; i++) {
        if (media[i].pause) {
            media[i].pause();
        }
    }
});
})( jQuery );
/* end plugin : mobile.video */

/* start plugin : mobile.audio */
(function( $, undefined ) {
$.widget("mobile.audio", $.mobile.widget, {
    options: {
        theme: null,
        shadow: true,
        corners: false,
        initSelector: ":jqmData(role='audio')"
    },

	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    if (value) {
                        this.element.addClass("ui-shadow");
                    }
                    else {
                        this.element.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        this.element.addClass("ui-corner-all");
                    }
                    else {
                        this.element.removeClass("ui-corner-all");
                    }
                break;
                case "theme":
                    this.element.removeClass("ui-bar-" + prev);
                    this.element.addClass("ui-bar-" + value);
                break;
            }
            
        }

        return this;
	},
    
    _create: function () {
		var $el = this.element,
			o = this.options;
			
        if ( !o.theme ) {
        	o.theme = $.mobile.getInheritedTheme( this.element, "c" );
        }

		var myCls = "ui-audio";
		myCls += o.shadow ? " ui-shadow" : "";
		myCls += o.corners ? " ui-corner-all" : "";
		myCls += " ui-bar-" + o.theme;

        this.element.addClass(myCls);
        
        this.audio = document.createElement("audio");
        this.audio.className = "audio";
        this.audio.src = this.element.attr("src");
        //this.audio.setAttribute("controls", "controls");
        
        var control = document.createElement("div");
                
        this.element.append(this.audio);
        this.element.append(control);
        
        this.control = $(control);
        
        this.control.mediacontrol({ media: this.audio, owner: this });
        this.control.addClass("inneritem");
        
        var instance = this;
        
        $.mobile.widget.prototype._create.call(this);      
    },

    URL : function () {
        if (arguments.length > 0) {
            if (this.audio.src != arguments[0].trim()) {
                this.control.mediacontrol("pause");

                this.element.attr("src", arguments[0]);
                this.audio.src = arguments[0];
                //this.control.mediacontrol("refresh");
            }
        }
        else {
            return this.audio.src;
        }        
    },
    
    volume : function () {
        if (arguments.length > 0) {
            this.control.mediacontrol("setVolume", arguments[0]);
        }
        else {
            return this.audio.volume;
        }
    },
    
    play: function () {
        this.control.mediacontrol("play");
    },
    
    pause: function () {
        this.control.mediacontrol("pause");
    },
    
    isPlaying: function () {
        return this.control.mediacontrol("isPlaying");
    },

    mute: function (value) {
        this.control.mediacontrol("mute", value);
    },
    
    isMuted: function () {
        return this.audio.muted;
    },
    
    seek: function (time) {
        this.control.mediacontrol("seek", time);
    },
    
    getCurrentTime: function () {
        return this.audio.currentTime;
    },
    
    getDuration: function () {
        return this.audio.duration;  
    },

    handleKeydown: function (event) {
        this.control.mediacontrol("handleKeydown", event);
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.audio.prototype.enhanceWithin( e.target );
});

$(document).on("pagehide popupafterclose", function(evt) {
    var page = evt.target;
    var media = $(page).find("audio");
    for (var i = 0; i < media.length; i++) {
        if (media[i].pause) {
            media[i].pause();
        }
    }
});
})( jQuery );
/* end plugin : mobile.audio */

/* start plugin : mobile.rectangle */
(function ( $, undefined ) {
$.widget( "mobile.rectangle", $.mobile.widget, {
	options: {
	    background: null,
	    borderColor: null,
	    borderStyle: null,
	    borderWidth: null,
	    radius: null,
	    shadow: true,
	    initSelector: ":jqmData(role='rectangle')"
	},
	
	_setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    $el.toggleClass("ui-shadow");
                    break;
                case "background":
                    $el[0].style.background = value;
                    break;
                case "borderColor":
                    $el[0].style.borderColor = value;
                    break;
                case "borderStyle":
                    $el[0].style.borderStyle = value;
                    break;
                case "borderWidth":
                    $el[0].style.borderWidth = value;
                    break;
                case "radius":
                    $el[0].style.borderRadius = value;
                    break;
            }   
        }
        return this;
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	        
		$el.addClass("ui-rectangle" + (o.shadow ? " ui-shadow" : ""));
		
		$el[0].style.background = o.background ? o.background : "";		
	    $el[0].style.borderColor = o.borderColor ? o.borderColor : "";
	    $el[0].style.borderStyle = o.borderStyle ? o.borderStyle : "";
	    $el[0].style.borderWidth = o.borderWidth ? o.borderWidth : "";
		$el[0].style.borderRadius = o.radius ? o.radius : "";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.rectangle.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.rectangle */

/* start plugin : mobile.circle */
(function ( $, undefined ) {
$.widget( "mobile.circle", $.mobile.widget, {
	options: {
	    background: null,
	    borderColor: null,
	    borderStyle: null,
	    borderWidth: null,
	    shadow: true,
	    initSelector: ":jqmData(role='circle')"
	},
	
	_setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    $el.toggleClass("ui-shadow");
                    break;
                case "background":
                    $el[0].style.background = value;
                    break;
                case "borderColor":
                    $el[0].style.borderColor = value;
                    break;
                case "borderStyle":
                    $el[0].style.borderStyle = value;
                    break;
                case "borderWidth":
                    $el[0].style.borderWidth = value;
                    break;
            }   
        }
        return this;
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	        
		$el.addClass("ui-circle" + (o.shadow ? " ui-shadow" : ""));
		
		$el[0].style.background = o.background ? o.background : "";
		$el[0].style.borderColor = o.borderColor ? o.borderColor : "";
	    $el[0].style.borderStyle = o.borderStyle ? o.borderStyle : "";
	    $el[0].style.borderWidth = o.borderWidth ? o.borderWidth : "";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.circle.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.circle */

/* start plugin : mobile.line */
(function ( $, undefined ) {
$.widget( "mobile.line", $.mobile.widget, {
	options: {
	    vertical: false,
	    borderColor: null,
	    borderStyle: null,
	    borderWidth: null,
	    initSelector: ":jqmData(role='line')"
	},
	
	_line: null,
	
	_setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "vertical":
                    if (typeof value === "boolean") {
                        this._line.className = value ? "vertical" : "horizontal";
                    }
                    break;
                case "borderColor":
                    $el[0].style.borderColor = value;
                    break;
                case "borderStyle":
                    $el[0].style.borderStyle = value;
                    break;
                case "borderWidth":
                    $el[0].style.borderWidth = value;
                    break;
            }   
        }
        return this;
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
		$el.addClass("ui-line");
		
		this._line = document.createElement("div");
		this._line.className = o.vertical ? "vertical" : "horizontal";
		this._line.style.borderColor = o.borderColor ? o.borderColor : "";
		this._line.style.borderStyle = o.borderStyle ? o.borderStyle : "";
		this._line.style.borderWidth = o.borderWidth ? o.borderWidth : "";
		$el.append(this._line);
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.line.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.line */

/* start plugin : mobile.maps */
function __MAPLIBCB() {
    var mapElems = document.querySelectorAll(".ui-maps");
    for (var i = 0; i < mapElems.length; i++) {
        $(mapElems[i]).trigger("mapslibloaded");
    }
}

(function ( $, undefined ) {
$.widget( "mobile.maps", $.mobile.widget, {
	options: {
	    shadow: true,
	    apikey: null,
	    center: null,
	    zoom: null,
	    type: null,
	    initSelector: ":jqmData(role='maps')"
	},
	
	_setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    $el.toggleClass("ui-shadow");
                    break;
            }   
        }
        return this;
	},
	
    _map: null,
    
    _mapCreate: function () {
        var $el = this.element,
	        o = this.options;
	        
        if (!$el.hasClass("ui-maps-unable")) return;
		    
	    $el[0].innerHTML = "";
	    $el.removeClass("ui-maps-unable");
	    
	    this._map = new google.maps.Map(
    	    $el[0],
            {
                zoom: o.zoom,
                center: new google.maps.LatLng(Number(o.center[0]), Number(o.center[1])),
                mapTypeId: o.type,
                streetViewControl: false,
                disableDefaultUI: true
            });
       
        this._map.addListener("click", function (e) {
            var param = new Array(e.latLng.lat(), e.latLng.lng());
            $el.trigger("mapsclick", [param]);
        });
        this._map.addListener("dblclick", function (e) {
            var param = new Array(e.latLng.lat(), e.latLng.lng());
            $el.trigger("mapsdblclick", [param]);
        });
    },
    
	_create: function () {
	    var $el = this.element,
	        o = this.options,
	        self = this;
	    
	    o.apikey = $el.attr("apikey");
		o.zoom = Number($el.attr("zoom")) || 9;
		var center = $el.attr("center");
	    o.center = center ? center.split(",") : [37.566, 126.977];
	    o.type = this._setGoogleMapTypeId($el.attr("type"));
	    
	    this.isInit = false;
	    
	    $el[0].innerHTML = "<div class='ui-maps-unable-text'>M A P</div>";
		$el.addClass("ui-maps ui-maps-unable" + (o.shadow ? " ui-shadow" : ""));
		
	    var $page = $el.closest(".ui-page");
		$page.one("pageshow", function () {
		    self._loadGoogleMapsLib();
			self.init();
		});

	    $el.bind("mapslibloaded", function () {
	        self.init();
	    });
	},
	
	init: function () {
	    if (this.isInit == false && window.google && window.google.maps) {
	        this.isInit = true;

	        this._mapCreate();
	    }
	},
	
	_loadGoogleMapsLib: function () {
    	var googleMapsLib = document.getElementById("google_maps_lib");
    	if (!googleMapsLib && !window._isDesigner) {
            var apikey = this.options.apikey || null;
                script = document.createElement('script');
            script.id = 'google_maps_lib';
            script.type = 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + (apikey ? ('&key=' + apikey) : '') + '&sensor=true&callback=__MAPLIBCB';
            document.body.appendChild(script);
    	}
	},
	
	_setGoogleMapTypeId: function (type) {
	    type = type ? type.toLowerCase() : "roadmap";
	    if (typeof type !== "string" 
	        || !(type === "hybrid" || type === "roadmap" || type === "satellite" || type === "terrain"))
	        type = "roadmap";
	    return type;
	},
	
	_checkMapObj: function () {
	    if (this._map === null) {
	        console.log("Not create Map Object.");
	        return -1;
	    }
	},
	
	getMapObject: function () {
	    return this._map;
	},
	
	getCenter: function () {
	    if (this._checkMapObj === -1) return;
	    
	    var center = this._map.getCenter(),
	        rt = new Array();
	    rt.push(center.lat());
	    rt.push(center.lng());
	    return rt;
	},
	
	setCenter: function (center) {
	    if (this._checkMapObj === -1 || center.length !== 2 || typeof center[0] !== "number" || typeof center[1] !== "number") return;
	    this._map.setCenter(new google.maps.LatLng(center[0], center[1]));
	},
	
	getMapType: function () {
	    if (this._checkMapObj === -1) return;
	    return this._map.getMapTypeId();
	},
	
	setMapType: function (type) {
	    if (this._checkMapObj === -1 || typeof type !== "string") return;
	    this._map.setMapTypeId(type.toLowerCase());
	},
	
	getZoom: function () {
	    if (this._checkMapObj === -1) return;
	    return this._map.getZoom();
	},
	
	setZoom: function (zoom) {
	    if (this._checkMapObj === -1 || typeof zoom !== "number") return;
	    this._map.setZoom(zoom);
	},
	
	moveBy: function (distance) {
	    if (this._checkMapObj === -1 || distance.length !== 2 || typeof distance[0] !== "number" || typeof distance[1] !== "number") return;
	    this._map.panBy(distance[0], distance[1]);
	},
	
	moveTo: function (center) {
	    if (this._checkMapObj === -1 || center.length !== 2 || typeof center[0] !== "number" || typeof center[1] !== "number") return;
	    this._map.panTo(new google.maps.LatLng(center[0], center[1]));
	},
	
	zoomIn: function () {
	    var o = this.options;
	    if (this._checkMapObj === -1) return;
	    ++o.zoom;
	    this._map.setZoom(o.zoom);
	},
	
	zoomOut: function () {
	    var o = this.options;
	    if (this._checkMapObj === -1) return;
	    --o.zoom;
	    this._map.setZoom(o.zoom);
	},
	
	addMarker: function (position) {
	    if (this._checkMapObj === -1 || position.length !== 2 || typeof position[0] !== "number" || typeof position[1] !== "number") return;
	    return new google.maps.Marker({
            map: this._map,
            position: new google.maps.LatLng(position[0], position[1])
        });            
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.maps.prototype.enhanceWithin( e.target, true );	
});

$(document).bind('pageshow', function(e) {
    return $(e.target).find(".ui-maps").maps("init");
});

})( jQuery );
/* end plugin : mobile.maps */

/* start plugin : mobile.imageview */
(function ( $, undefined ) {
$.widget( "mobile.imageview", $.mobile.widget, {
    options: {
        shadow: true,
        index: 0,
        circular: false,
        slideshow: false,
        slideshowDuration: 1000,
        slideshowDirection: "left",
        initSelector: ":jqmData(role='imageview')"
    },
    
    _setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "shadow":
                    $el.toggleClass("ui-shadow");
                    break;
            }   
        }
        return this;
	},
    
    _imageArray : null,
    _moveThreshold : 100,
    _start_x : 0,
    _last_x : 0,
    _slideshowTimer : null,
    _previousIndex : 0,
    
    _vmousedown: function (e) {
        this._start_x = e.pageX;
        this.stopSlideshow();
        e.preventDefault();
    },
    
    _vmousemove: function (e) {
        if (this._start_x === 0) return;

        var $el = this.element,
            content;
            
        this._last_x = this._start_x - e.pageX;
        content = $el.find(".ui-imageview-content")[0];
        content.style.webkitTransform = "translate(" + -(this._last_x) + "px, 0px)";
        e.preventDefault();
    },
    
    _move: function (mx) {
        var $el             = this.element,
            o               = this.options,
            content         = $el.find(".ui-imageview-content")[0],
            widget_width    = $el.width(),
            length          = this._imageArray.length,
            aX              = 0,
            expectIndex,
            change          = (mx > 0) ? 1 : -1;

        o.slideshowDirection = (mx > 0) ? "right" : "left";
        
        if (length > 0) {
            expectIndex = this._getExpectIndex(change);
            if (expectIndex === o.index) {
                aX = -mx;
            } else {
                o.index = expectIndex;
                this._refreshImage(change);
                aX = (widget_width * change) - mx;
            }
            content.style.WebkitTransition  = "";
            content.style.webkitTransform   = "translate(" + aX + "px, 0px)";
        }
    },
    
    _setOriginalPosition: function () {
        var self = this,
            callback = function () {
                var content = self.element.find(".ui-imageview-content")[0];
                content.style.WebkitTransition = "all 250ms ease-out 0ms";
                content.style.webkitTransform = "translate(0px, 0px)";
            };
        window.setTimeout(callback, 0);
    },
    
    _vmouseup: function (e) {
        if (this._start_x === 0) return;
        
        if (Math.abs(this._last_x) > this._moveThreshold) {
            this._move(this._last_x);
        }

        this._setOriginalPosition();
        this._start_x = 0;
        this._last_x = 0;
        if (this.options.slideshow) {
            this._startSlideshow();
        }
    },
    
    _load: function () {
        var $el = this.element,
	        $images = $el.find("img"),
	        image,
	        image_data, tmp_width, tmp_height,
            i;
        
        this._imageArray = new Array();
        for (i = 0; i < $images.length; i++) {
            image = $images[i];
            image.className = "ui-nojs";
            image_data = {};
            image_data.src = image.src || "";
            tmp_width = parseInt(image.getAttribute("width"));
            tmp_height = parseInt(image.getAttribute("height"));
            if (tmp_width) image_data.width = tmp_width;
            if (tmp_height) image_data.height = tmp_height;
            this._imageArray.push(image_data);
        }
    },
    
    _addUI: function () {
        var $el = this.element,
            panelString = '<div class="ui-imageview-content">'
                        + '<div class="ui-imageview-prev"><span class="ui-imageview-image"></span></div>'
                        + '<div class="ui-imageview-center"><span class="ui-imageview-image"></span></div>'
                        + '<div class="ui-imageview-next"><span class="ui-imageview-image"></span></div>'
                        + '</div>';
            
        $el.append(panelString);
    },
    
    _setViewImage: function ($view, info) {
        var image = $view.find(".ui-imageview-image")[0],
            backgroundSizeValue,
            tmp_width, tmp_height;

        if (info === undefined) {
            image.src = "";
            image.style.backgroundImage = "";
            image.style.backgroundSize = "";
        } 
        else if (image.src !== info.src) {
            image.src = info.src;
            image.style.backgroundImage = "url(" + info.src + ")";
            tmp_width = info.width;
            tmp_width = tmp_width ? info.width : "auto";
            tmp_width = typeof tmp_width === "number" ? tmp_width + "px" : tmp_width;
            tmp_height = info.height ? info.height : "auto";
            tmp_height = typeof tmp_height === "number" ? tmp_height + "px" : tmp_height;
            image.style.backgroundSize = (tmp_width === "auto" && tmp_height === "auto") ? "" : tmp_width + " " + tmp_height;
        }
    },

    _getExpectIndex: function(value) {
        var o = this.options,
            index = o.index,
            length = this._imageArray.length;
            
        index += value;
        
        if (o.circular) {
            if (index < 0) {
                index = length - 1;
            } else if (index >= length) {
                index = 0;
            }
        } else {
            if (index < 0) {
                index = 0;
            } else if (index >= length) {
                index = length - 1;
            }
        }
        return index;
    },
    
    _refreshImage: function (moveDir) {
        var $el             = this.element,
            $viewPrev = $view0 = $el.find(".ui-imageview-prev"),
            $viewCenter = $view1 = $el.find(".ui-imageview-center"),
            $viewNext = $view2 = $el.find(".ui-imageview-next"),
            center_index    = this.options.index,
            prev_index,
            next_index;
            
        if (this._imageArray.length > 0) {
            prev_index = this._getExpectIndex(-1);
            next_index = this._getExpectIndex(1);

            if (moveDir === -1) { //prev
                $view2[0].className = "ui-imageview-prev";
                $viewPrev = $view2;
                $view0[0].className = "ui-imageview-center";
                $viewCenter = $view0;
                $view1[0].className = "ui-imageview-next";
                $viewNext = $view1;
            } else if (moveDir === 1) { //next
                $view1[0].className = "ui-imageview-prev";
                $viewPrev = $view1;
                $view2[0].className = "ui-imageview-center";
                $viewCenter = $view2;
                $view0[0].className = "ui-imageview-next";
                $viewNext = $view0;
            }

            this._setViewImage($viewPrev, prev_index !== center_index ? this._imageArray[prev_index] : undefined);
            this._setViewImage($viewCenter, this._imageArray[center_index]);
            this._setViewImage($viewNext, next_index !== center_index ? this._imageArray[next_index] : undefined);
        } else {
            this._setViewImage($viewPrev);
            this._setViewImage($viewCenter);
            this._setViewImage($viewNext);
        }
    },
    
    _addEvent: function () {
        var self = this,
            $el = this.element,
            $content = $el.find(".ui-imageview-content");

        $el.bind("vmousedown.imageview", function (e) {
            self._vmousedown(e);
        });
        
        $el.bind("vmousemove.imageview", function (e) {
            self._vmousemove(e);
        });
        
        $(document).bind("vmouseup.imageview", function (e) {
            self._vmouseup(e);
        });
        
        $content.bind("webkitTransitionEnd", function (e) {
            $content[0].style.WebkitTransition = "";
            if (self._previousIndex !== self.options.index) {
                $el.trigger("imageviewchanged", [self.options.index]);
                self._previousIndex = self.options.index;
            }
        });
    },
    
    _create: function () {
        var $el = this.element,
            o = this.options,
            index, 
            img;
        
        $el.addClass("ui-imageview" + (o.shadow ? " ui-shadow" : ""));
        
        index = parseInt($el.attr("index")) || 0;
        img = $el.find("img");
        o.index = (index < 0 || index >= img.length) ? 0 : index;
        this._previousIndex = o.index;
        o.circular = ($el.attr("circular") === "true") ? true : false;
        o.slideshow = ($el.attr("slideshow") === "true") ? true : false;
        o.slideshowDuration = parseInt($el.attr("slideshowDuration")) || o.slideshowDuration;
        o.slideshowDirection = ($el.attr("slideshowDirection") === "left") ? "left" : "right";
        
        this._load();
        this._addUI();
        this._refreshImage();
        this._addEvent();
        
        if (o.slideshow) {
            this._startSlideshow();
        }
    },
    
    _isDoMove: function(value) {
        var o = this.options;

        if (o.circular === true) {
            return true;
        } else {
            return (this._getExpectIndex(value) === o.index) ? false : true;
        }
    },
    
    _startSlideshow: function () {
        var self = this,
            o = this.options,
            callback;
            
        if (!this._slideshowTimer) {
            callback = function () {
                if (self._isDoMove(o.slideshowDirection === "right" ? 1 : -1)) {
                    if (o.slideshowDirection === "right") {
                        self.next();
                    } else {
                        self.previous();
                    }
                }
                else {
                    self.stopSlideshow();
                }
            };
            
            this._slideshowTimer = setInterval(callback, o.slideshowDuration);
        }
    },
    
    append: function (value) {
        var i, image;
        if (Array.isArray(value)) {
            for (i = 0; i < value.length; i++) {
                image = value[i];
                if (typeof image === "object" && image.hasOwnProperty("src")) {
                    this._imageArray.push(image);
                }
            }
            this._refreshImage();
        }
        else {
            if (typeof value === "object" && value.hasOwnProperty("src")) {
                this._imageArray.push(value);
                this._refreshImage();
            }
        }
    },
    
    insertBefore: function (value, index) {
        var images = this._imageArray;
        
        if (index < 0 || index >= images.length) return;
        if (Array.isArray(value)) {
            images.splice(index, 0, value);
            this._refreshImage();
        }
        else {
            if (typeof value === "object" && value.hasOwnProperty("src")) {
                images.splice(index, 0, value);
                this._refreshImage();
            }
        }
    },
    
    remove: function (value) {
        var o = this.options,
            images = this._imageArray,
            index,
            rt, i;
        
        if (Array.isArray(value)) {
            value.sort(function(a, b){ return b - a; });
            rt = new Array();
            for (i = 0; i < value.length; i++) {
                index = value[i];
                if (typeof index === "number") {
                    if (index >= 0 && index < images.length) {
                        rt.push(images.splice(index, 1));
                        
                        if (images.length <= o.index) {
                            o.index = images.length - 1;
                        }
                    }
                }
            }
            this._refreshImage();
        }
        else if (typeof value === "number"){
            if (value >= 0 && value < images.length) {
                rt = images.splice(value, 1);
                
                if (images.length <= o.index) {
                    o.index = images.length - 1;
                }
                this._refreshImage();
            }
        }
        
        return rt;
    },
    
    setImages: function (images) {
        var i;
        if (Array.isArray(images)) {
            this._imageArray = new Array();
            for (i = 0; i < images.length; i++) {
                if (typeof images[i] === "object") {
                    this._imageArray.push(images[i]);
                }
            }
            this._refreshImage();
        }
    },
    
    startSlideshow: function (duration, dir) {
        var o = this.options,
            duration = parseInt(duration);
        
        if (typeof duration === "number" && duration > 0) {
            o.slideshowDuration = duration;
        }
        if (dir && (dir === "left" || dir === "right")) {
            o.slideshowDirection  = dir;
        }
        this._startSlideshow();
    },
    
    stopSlideshow: function () {
        if (this._slideshowTimer) {
            clearInterval(this._slideshowTimer);
            this._slideshowTimer = null;
        }
    },
    
    getIndex: function () {
        return this.options.index;
    },
    
    setIndex: function (index) {
        if (typeof index === "number") {
            if (index >= 0 && index < this._imageArray.length) {
                this.options.index = index;
                this._refreshImage();
                this.element.trigger("imageviewchanged", [this.options.index]);
            }
        }
    },
    
    getImageInfo: function (index) {
        var images = this._imageArray;
        if (typeof index !== "number" || index < 0 || index >= images.length) {
            return null;
        }
        else if (!index) {
            index = this.options.index;
        }
        return images[index];
    },
    
    getCircular: function () {
        return this.options.circular;
    },
    
    setCircular: function(value) {
        var o = this.options;
        if (typeof value === "boolean") {
            if (o.circular !== value) {
                o.circular = value;
                this._refreshImage();
            }
        }
    },
    
    next: function () {
        this._move(1);
        this._setOriginalPosition();
    },
    
    previous: function () {
        this._move(-1);
        this._setOriginalPosition();
    }    
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.imageview.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.imageview */

/* start plugin : mobile.tabview */
(function ( $, undefined ) {
$.widget( "mobile.tabview", $.mobile.widget, {
    options: {
        theme: null,
        corners: true,
        shadow: true,
        index: 0,
        disable: null,
        position: "top",
        initSelector: ":jqmData(role='tabview')"
    },
    
    _setOption: function (key, value) {
	    var $el = this.element,
	        o = this.options,
	        prev = o[key],
	        nav_items = $el.find(".ui-tabview-nav-item");
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "position":
                    this._setPosition(value, prev);
                    break;
                case "shadow":
                    $el.find(".ui-tabview-wrapper").toggleClass("ui-shadow");
                    break;
                case "corners":
                    $el.find(".ui-tabview-wrapper").toggleClass("ui-corner-all");
                    if (value) {
                        nav_items.addClass("ui-corner-" + o.position);
                    }
                    else {
                        nav_items.removeClass("ui-corner-" + o.position);
                    }
                    break;
                case "theme":
                    nav_items.removeClass("ui-bar-" + prev);
                    nav_items.addClass("ui-bar-" + value);
                    break;
            }   
        }
        return this;
	},
    
    _setPositionOption: function (value) {
        var o = this.options;
        if (!(typeof value === "string" && (value === "top" || value === "bottom" || value === "left" || value === "right"))) {
            value = "top";
        }
        o.position = value;
    },
    
    _setPosition: function (value, prev) {
        var $el = this.element,
            o = this.options,
            nav_items = $el.find("li");
        
        nav_items.removeClass("ui-corner-" + prev);
        $el.removeClass(prev);
        this._setPositionOption(value);
        nav_items.addClass("ui-corner-" + value)
        $el.addClass(value);
    },
    
    _setDisable: function () {
        var $el = this.element,
            o = this.options,
            rst = new Array(),
            $disableItems, $disableItem, 
            i;
            
        $disableItems = $el.find(".ui-tabview-nav-item.ui-disabled");
        for (i = 0; i < $disableItems.length; i++) {
            $disableItem = $($disableItems[i]);
            rst.push($disableItem.parent().children().index($disableItem));
        }
        o.disable = rst;
    },
    
    _createTab: function () {
        var $el = this.element,
            o = this.options,
            items = $el.find("> div"),
            items_length = items.length,
            nav_tag,
            $wrapper,
            i;
        
        items.addClass("ui-tabitem");
        
        nav_tag = "<ul class='ui-tabview-nav'>";
        for (i = 0; i < items_length; i++ ) {
            nav_tag += "<li class='ui-tabview-nav-item ui-bar-" + o.theme + (o.index === i ? " selected" : "") + (o.corners ? " ui-corner-" + o.position : "") + "'>" + items[i].getAttribute("title") + "</li>";
        }
        nav_tag += "</ul>";
        nav_tag += "<div class='ui-tabview-wrapper" + (o.corners ? " ui-corner-all" : "") + (o.shadow ? " ui-shadow" : "") + "'></div>";
        
        $el.append(nav_tag);
        
        $wrapper = $el.find(".ui-tabview-wrapper");
        items.appendTo($wrapper);
        
        this.setDisable($el.attr("disable"));
        
        if (items.length > 0 && items[o.index]) {
            $(items[o.index]).addClass("show");
        }
    },
    
    _create: function () {
        var $el = this.element,
            o = this.options;
            
        if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }

        o.index = parseInt($el.attr("index")) || o.index;
        this._setPositionOption(o.position);
        
        $el.addClass("ui-tabview "+ o.position);
        
        this._createTab();
        
        var self = this;
        $el.find(".ui-tabview-nav").bind("vclick", function (e) {
            var $target = $(e.target);
            if ($target[0].tagName === "LI") {
                self.select($target.parent().children().index($target));
            }
        });
    },

    select: function (index) { 
        var $el = this.element, 
            o = this.options, 
            navItems = $el.find(".ui-tabview-nav-item"), 
            items = $el.find(".ui-tabitem");

        if (index < 0) {
            index = 0;
        }
        else if (index >= items.length) {
            index = items.length - 1;
        }
        
        $el.find("li.selected").removeClass("selected");
        $(navItems[index]).addClass("selected");
        $el.find("div.show").removeClass("show");
        $(items[index]).addClass("show");
        o.index = index;
        
        $el.trigger("tabviewselected", [o.index]);
    },
    
    append: function (item) {
        var $el = this.element,
            o = this.options,
            $navTarget, $itemTarget,
            $item, navStr;
        
        $item = $(item);
        if ($item[0].tagName === "DIV") {
            $itemTarget = $el.find(".ui-tabview-wrapper");
            $navTarget = $el.find(".ui-tabview-nav");
            
            navStr = "<li class='ui-tabview-nav-item ui-bar-" + o.theme + (o.corners ? " ui-corner-" + o.position : "") + "'>" + $item.attr("title") + "</li>";
            $item.addClass("ui-tabitem");
            
            $navTarget.append(navStr);
            $itemTarget.append($item);
        }
    },
    
    insertBefore: function (item, target) {
        var $el = this.element,
            o = this.options,
            $navTarget, $itemTarget,
            $item, navStr;
        
        $item = $(item);
        if ($item[0].tagName === "DIV" && typeof target === "number") {
            $itemTarget = $el.find(".ui-tabview-wrapper").children().eq(target);
            $navTarget = $el.find(".ui-tabview-nav").children().eq(target);
            if ($navTarget.length === 0 || $itemTarget.length === 0) return;
            
            navStr = "<li class='ui-tabview-nav-item ui-bar-" + o.theme + (o.corners ? " ui-corner-" + o.position : "") + "'>" + $item.attr("title") + "</li>";
            $item.addClass("ui-tabitem");
            
            $navTarget.before(navStr);
            $itemTarget.before($item);
            
            if (target <= o.index) {
                this.select(target + 1);
            }
            
            this._setDisable();
        }
    },
    
    remove: function (index) {
        var $el = this.element,
            o = this.options,
            delElem;
        
        if (typeof index === "number" && index >= 0) {
            $el.find(".ui-tabview-nav").children().eq(index).remove();
            delElem = $el.find(".ui-tabview-wrapper").children().eq(index);
            delElem.remove();
            if (index <= o.index) {
                this.select(o.index - 1);
            }
            
            this._setDisable();
            return delElem[0];
        }
    },
    
    setItem: function (index, item) {
        var $el = this.element,
            $navTarget, $itemTarget,
            $item;
        
        $item = $(item);
        if (typeof $item === "object" && $item[0].tagName === "DIV") {
            $itemTarget = $el.find(".ui-tabview-wrapper").children().eq(index);
            $navTarget = $el.find(".ui-tabview-nav").children().eq(index);
            if ($navTarget.length === 0 || $itemTarget.length === 0) return;
            
            $navTarget.html($item.attr("title"));
            $itemTarget.html($item.html());
        }
    },
    
    getItem: function (index) {
        return this.element.find(".ui-tabview-wrapper").children().eq(index)[0];
    },
    
    setTitle: function (index, text) {
        this.element.find(".ui-tabview-nav").children().eq(index).text(text);
        this.element.find(".ui-tabview-wrapper").children().eq(index).attr("title", text);
    },
    
    getTitle: function (index) {
        return this.element.find(".ui-tabview-nav").children().eq(index).text();
    },
    
    setDisable: function (value) {
        var $el = this.element,
            o = this.options,
            nav_items = $el.find("li"),
            disable_items = $el.find("li.ui-disabled"),
            temp_value,
            temp_elem,
            rst = new Array(),
            i;
        
        if (value === undefined) {
            disable_items.removeClass("ui-disabled");
            o.disable = null;
        }
        else {
            if (typeof value === "string") {
                temp_value = value.split(",");
                value = temp_value.map(function (elem) { return parseInt(elem); });
            }
            if (!Array.isArray(value)) return;
            
            disable_items.removeClass("ui-disabled");
            for (i = 0; i < value.length; i++) {
                temp_elem = nav_items[value[i]];
                if (temp_elem) {
                    $(temp_elem).addClass("ui-disabled");
                    rst.push(value[i]);
                }
            }
            o.disable = rst;
        }
    },
    
    getDisable: function () {
        return this.options.disable;
    }
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.tabview.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.tabview */

/* start plugin : mobile.treeview */
(function ( $, undefined ) {
$.widget( "mobile.treeview", $.mobile.widget, {
	options: {
	    checkbox: false,
	    openNodes: null,
	    corners: false,
	    shadow: true,
	    theme: null,
		initSelector: ":jqmData(role='treeview')"
	},
	
	_setOption: function(key, value) {
	    var $el = this.element,
	        prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply(this, arguments);
        
        if (prev != value) {
            switch (key) {
                case "checkbox":
                    if (value) {
                        this.showCheckbox();
                    }
                    else {
                        this.hideCheckbox();
                    }
                break;
                case "shadow":
                    $el.toggleClass("ui-shadow");
                break;
                case "corners":
                    $el.toggleClass("ui-corner-all");
                break;
                case "theme":
                    var theme_elem = this.element.find(".ui-bar-" + prev);
                    theme_elem.removeClass("ui-bar-" + prev);
                    theme_elem.addClass("ui-bar-" + value);
                break;
            }
        }

        return this;
	},
	
	_close: function ($nodes) {
	    var rt = new Array(),
	        i;
	    $nodes.removeClass("open");
        $nodes.addClass("closed");
        
        for (i = 0; i < $nodes.length; i++) {
            rt.push($nodes[i]);
        }
        this.element.trigger("treeviewclosed", [rt]);
	},
	
	_open: function ($nodes) {
	    var rt = new Array(),
	        i;
	    $nodes.removeClass("closed");
        $nodes.addClass("open");
        
        for (i = 0; i < $nodes.length; i++) {
            rt.push($nodes[i]);
        }
        this.element.trigger("treeviewopen", [rt]);
	},
	
	_addNode: function ($node, $target, position) {
	    var $parent = $node.parent(),
	        $targetRoot;
	    
        switch (position) {
            case "before":
                $target.before($node);
                break;
            case "inside":
                $targetRoot = $target.find("> .ui-treeview-ul");
                if ($targetRoot.length === 0) {
                    $target.addClass("ui-treeview-root open");
                    $targetRoot = $("<ul class='ui-treeview-ul'></ul>");
                    $target.append($targetRoot);
                }
                $targetRoot.append($node);
                break;
            default:
                $target.after($node);
        }
        this._refresh($parent);
        this._refresh($target.parent());
	},
	
	_refresh: function ($node) {
	    $node = $node.hasClass("ui-treeview-ul") ? $node.parent() : $node;
	    if ($node.find("> .ui-treeview-ul > .ui-treeview-li").length === 0) {
	        $node.find("> .ui-treeview-ul").remove();
            $node.removeClass("ui-treeview-root open closed undetermined");
        }
        this._setChecked($node.children());
	},
	
	_setCheckedDownNode: function ($node) {
	    var $nodes = $node.find(".ui-treeview-li");
	    if ($node.hasClass("ui-treeview-root")) {
	        $nodes.removeClass("undetermined");
	        if ($node.hasClass("checked")) {
	            $nodes.addClass("checked");
	        }
	        else {
	            $nodes.removeClass("checked");
	        }
	    }
	},
	
	_setCheckedUpNode: function ($node) {
	    var $parent = $node.parent(),
			checkItemLen,
			checkedLen,
			$grandParent = $parent.parent();
	    
	    $parent.removeClass("undetermined checked");
                
        checkItemLen = $parent.find(".ui-treeview-li").length;
        checkedLen = $parent.find(".ui-treeview-li.checked").length;
        
        if (checkedLen !== 0 && checkItemLen !== checkedLen) {
            $parent.addClass("undetermined");
        }
        else if (checkedLen !== 0 && checkItemLen === checkedLen) {
            $parent.addClass("checked");
        }
        
        if ($grandParent.length !== 0) {
            this._setCheckedUpNode($parent);
        }
	},
	
	_setChecked: function ($node) {
	    if (!this.options.checkbox && !$node) return;
	    this._setCheckedDownNode($node);
	    for (var i = 0; i < $node.length; i++) {
	        this._setCheckedUpNode($($node[i]));
	    }
	},
	
	_setSelect: function ($parent) {
	    var $el = this.element,
	        o = this.options,
	        themeClass = "ui-bar-" + o.theme,
	        $node = $parent.find("> .ui-treeview-li-item");
	    if (!$node.hasClass(themeClass)) {
	        $el.find("." + themeClass).removeClass(themeClass);
	        $el.trigger("treeviewselected", [$parent[0]]);	    
	    }
	    $node.toggleClass(themeClass);
	},
	
	_eventBind: function () {
	    var self = this,
	        $el = this.element,
			o = this.options;
			
	    $el.delegate("li > .ui-treeview-marker", "vclick.treeview", function (e) {
		    var $parent = $(e.target.parentElement);
		    if ($parent.hasClass("closed")) {
		        self._open($parent);
		    }
		    else if ($parent.hasClass("open")) {
		        self._close($parent);
		    }
		});
		
		$el.delegate(".ui-treeview-li-item", "vclick.treeview", function (e) {
		    self._setSelect($(e.target).parent());
		});
		
		if (o.checkbox) {
		    this._eventBindCheckbox();
		}
	},
	
	_eventBindCheckbox: function () {
	    var self = this,
	        $el = this.element;
	    $el.delegate("li > .ui-treeview-checkbox", "vclick.treeview", function (e) {
		    var $target = $(e.target).parent();
		    $target.removeClass("undetermined");
            $target.toggleClass("checked");
            
		    self._setChecked($target);
		    $el.trigger("treeviewchecked", [$target[0]]);
	    });
	},
	
	_createNode: function ($li) {
	    var o = this.options,
	        temp_html = $li.html();
	    $li.html("<span class='ui-treeview-marker'></span>" + (o.checkbox ? "<span class='ui-treeview-checkbox'></span>" : "") + "<span class='ui-treeview-li-item'>" + temp_html.trim() + "</span>");
	    var temp_ul = $li.find("> .ui-treeview-li-item > .ui-treeview-ul");
	    if (temp_ul.length > 0) {
	        temp_ul.appendTo($li);
	        $li.addClass("ui-treeview-root closed");
	    }
	},
	
	_createTree: function ($el) {
	    var o = this.options,
			$uls = $el.find("ul"),
			$lis = $el.find("li"),
			$li, temp_html,
			i;
	    
		$uls.addClass("ui-treeview-ul");
		$lis.addClass("ui-treeview-li");
		
		for (i = $lis.length - 1; i >= 0; i--) {
		    $li = $($lis[i]);
		    this._createNode($li);
		}
		return $el;
	},
	
	_create: function () {
		var $el = this.element,
			o = this.options,
			openNodes, 
			$roots;
		
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-treeview" + (o.shadow ? " ui-shadow" : "") + (o.corners ? " ui-corner-all" : ""));
		
		this._createTree($el);

		openNodes = $el.attr("openNodes");
        o.openNodes = openNodes ? (openNodes === "true" ? true : openNodes.split(",")) : null;
        if (o.openNodes !== null) {
            if (o.openNodes === true) {
                $roots = $el.find(".ui-treeview-root.closed");
                $roots.removeClass("closed");
                $roots.addClass("open");
            }
            else if (Array.isArray(o.openNodes)) {
                o.openNodes.forEach(function (value) {
                    var $node = $el.find(value);
                    if ($node.length > 0 && $node.hasClass("ui-treeview-root")) {
                        $node.removeClass("closed");
                        $node.addClass("open");
                    }
                });
            }
        }
		
		this._eventBind();
	},
	
	openAll: function (node) {
	    var $el = this.element,
	        $node;
	    if (!node) {
	        $node = $el;
	    }
	    else {
	        $node = $(node);
	    }
	    this._open($node.find(".ui-treeview-root.closed"));
	},
	closeAll: function (node) {
	    var $el = this.element,
	        $node;
	    if (!node) {
	        $node = $el;
	    }
	    else {
	        $node = $(node);
	    }
	    this._close($node.find(".ui-treeview-root.open"));
	},
	toggleNode: function (node) {
	    var $node;
	    if (node) {
	        $node = $(node);
	        if ($node.hasClass("closed")) {
	            this._open($node);
	        }
	        else {
	            this._close($node);
	        }
	    }
	},
	openNode: function (node) {
	    if (node && $(node).hasClass("closed")) {
	        this._open($(node));
	    }
	},
	closeNode: function (node) {
	    if (node && $(node).hasClass("open")) {
	        this._close($(node));
	    }
	},
	append: function (node, target) {
	    var $el = this.element,
	        $node = $(node),
	        $parent,
	        $target = $el.find(target);
	    
	    if ($target.length === 0) {
	        $target = $el;
	    }
	        
	    if ($node[0].tagName === "LI") {
	        $node.addClass("ui-treeview-li");
	        $node.find("ul").addClass("ui-treeview-ul");
	        this._createNode($node);
	        $node = this._createTree($node);
	        this._addNode($node, $target, "inside");
	    }  
	},
	insertBefore: function (node, target) {
	    var $el = this.element,
	        $node = $(node),
	        $target = $el.find(target);
	    
	    if ($node[0].tagName === "LI" && $target.length === 1 && $target.hasClass("ui-treeview-li")) {
	        if (!$node.hasClass("ui-treeview-li")) {
	            $node.addClass("ui-treeview-li");
	            $node.find("ul").addClass("ui-treeview-ul");
	            this._createNode($node);
	            $node = this._createTree($node);
	        }
	        this._addNode($node, $target, "before");
	    }
	},
	remove: function (node) {
	    var $el = this.element,
	        $node = $(node),
	        $parent;
	    if ($node[0].tagName === "LI" || $node[0].tagName === "UL") {
	        $node.remove();
	        this._refresh($node.parent());
	        return $node[0];
	    }
	},
	getText: function (node) {
	    if (node && $(node).hasClass("ui-treeview-li")) {
	        return $(node).find("> .ui-treeview-li-item").html().trim();
	    }
	},
	setText: function (node, value) {
	    if (node && $(node).hasClass("ui-treeview-li")) {
	        $(node).find("> .ui-treeview-li-item").html(value);
	    }
	},
	
	select: function (node) {
	    var themeClass = "ui-bar-" + this.options.theme,
	        $node = $(node);
	    if ($node.find("> ." + themeClass).length === 0) {
	        this._setSelect($node);
	    }
	},
	deselect: function (node) {
	    var themeClass = "ui-bar-" + this.options.theme,
	        $node = $(node);
	    if ($node.find("> ." + themeClass).length !== 0) {
	        this._setSelect($node);
	    }
	},
	toggleSelect: function (node) {
	    this._setSelect($(node));
	}, 
	getSelected: function () {
	    var $el = this.element,
	        themeClass = "ui-bar-" + this.options.theme;
	    return $el.find("." + themeClass).parent()[0] || null;
	},
	isSelected: function (node) {
	    var themeClass = "ui-bar-" + this.options.theme;
	    return ($(node).find("." + themeClass).length > 0);
	},
	
	toggleCheck: function (node) {
	    var $el = this.element,
	        o = this.options,
	        $node = $el.find(node);
	    if (o.checkbox && $node.length > 0) {
	        $node.removeClass("undetermined");
	        $node.toggleClass("checked");
	        this._setChecked($node);
	        $el.trigger("treeviewchecked", [$node[0]]);
	    }
	},
	checkNode: function (node) {
	    var $el = this.element,
	        o = this.options,
	        $node = $el.find(node);
	    
	    if (o.checkbox && $node.length > 0 && !$node.hasClass("checked")) {
	        $node.removeClass("undetermined");
	        $node.addClass("checked");
	        this._setChecked($node);
	        $el.trigger("treeviewchecked", [$node[0]]);
	    }
	},
	uncheckNode: function (node) {
	    var $el = this.element,
	        o = this.options,
	        $node = $el.find(node);
	    if (o.checkbox && $node.length > 0 && ($node.hasClass("checked") || $node.hasClass("undetermined"))) {
	        $node.removeClass("undetermined");
	        $node.removeClass("checked");
	        this._setChecked($node);
	        $el.trigger("treeviewchecked", [$node[0]]);
	    }
	},
	getChecked: function (node) {
	    var $el = this.element,
	        o = this.options,
	        $node = node ? $el.find(node) : $el;
	    if (o.checkbox && $node.length === 1) {
	        return $node[0].querySelectorAll(".checked");
	    }
	    return null;
	},
	getUnchecked: function (node) {
	    var $el = this.element,
	        o = this.options,
	        $node = node ? $el.find(node) : $el;
	    if (o.checkbox && $node.length === 1) {
	        return $node[0].querySelectorAll("li:not(.checked)");
	    }
	    return null;
	},
	isChecked: function (node) {
	    var $el = this.element,
	        o = this.options,
	        $node = $el.find(node);
	    if (o.checkbox && $node) {
	        return $node.hasClass("checked");
	    }
	    return null;
	},
	showCheckbox: function () {
	    this.element.find(".ui-treeview-marker").after("<span class='ui-treeview-checkbox'></span>");
	    this._eventBindCheckbox();
	    this.options.checkbox = true;
	},
	hideCheckbox: function () {
	    this.element.find(".ui-treeview-checkbox").remove();
	    this.options.checkbox = false;
	}
});

$( document ).bind( "pagecreate create", function( e ) {
    $.mobile.treeview.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.treeview */