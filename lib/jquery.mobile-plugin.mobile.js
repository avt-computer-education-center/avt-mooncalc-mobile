/*
 * SEC Web App SDK 1.0
 *
 * Copyright ¨Ï 2013 Samsung Electronics Co., Ltd. All rights reserved.
 */

(function ( $, undefined ) {
$.widget( "mobile.android", $.mobile.widget, {
	options: {
	    display: true,
	    theme: null,
	    corners: true,
	    shadow: true
	},

	_setOption: function( key, value ) {
	    var prev = this.options[key];
	    
		$.mobile.widget.prototype._setOption.apply( this, arguments );
        
        if (prev != value) {
            var btn = this.element.find("a");
            var span = this.element.find("a > span");
            switch (key) {
                case "shadow":
                    if (value) {
                        btn.addClass("ui-shadow");
                    }
                    else {
                        btn.removeClass("ui-shadow");
                    }
                break;
                case "corners":
                    if (value) {
                        btn.addClass("ui-btn-corner-all");
                        span.addClass("ui-btn-corner-all");
                    }
                    else {
                        btn.removeClass("ui-btn-corner-all");
                        span.removeClass("ui-btn-corner-all");
                    }
                break;
                case "theme":
                    btn.removeClass("ui-btn-up-" + prev);
                    btn.addClass("ui-btn-up-" + value);
                break;
            }
            
        }

        return this;
	},
	
	_setDisplay: function (value) {
	    var $el = this.element,
	        o = this.options,
	        $btn;
	    
	    if (value === true) {
	        $el.removeClass("ui-android-nodisplay");
	        $el.addClass("ui-android-display");
	        $el.append("<a class='ui-android-button' data-theme='" + o.theme + "' data-corners='" + o.corners + "' data-shadow='" + o.shadow + "'></a>");
    		
		    $btn = $el.find(".ui-android-button");
		    $btn.button();
		    this._eventBind();
	    }
	    else {
	        $el.removeClass("ui-android-display");
	        $el.addClass("ui-android-nodisplay");
	        $el.html("");
	    }
	    o.display = value;
	},
	
	_eventBind: function () {
	    var instance = this;
	    this.element.find(".ui-android-button").bind("vclick", function(e) {
	        instance.open();
	    });
	},
	
	_create: function () {
	},
	
	open: function() {
	},
	
	setDisplay: function (value) {
	    if (typeof value === "boolean" && this.options.display !== value) {
	        this._setDisplay(value);
	    }
	}
});
})( jQuery );
/* end plugin : mobile.android */

/* start plugin : mobile.bluetooth */
(function ( $, undefined ) {
$.widget( "mobile.bluetooth", $.mobile.android, {
	options: {
	    initSelector: ":jqmData(role='bluetooth')"
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
	    if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-android ui-android-bluetooth ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	open: function() {
	    window.location.href = "intent://#Intent;action=android.settings.BLUETOOTH_SETTINGS;end";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.bluetooth.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.bluetooth */

/* start plugin : mobile.nfc */
(function ( $, undefined ) {
$.widget( "mobile.nfc", $.mobile.android, {
	options: {
	    initSelector: ":jqmData(role='nfc')"
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
	    if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-android ui-android-nfc ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	open: function() {
	    window.location.href = "intent://#Intent;action=android.settings.NFC_SETTINGS;package=com.android.nfc;end";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.nfc.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.nfc */

/* start plugin : mobile.call */
(function ( $, undefined ) {
$.widget( "mobile.call", $.mobile.android, {
	options: {
	    phonenumber: null,
	    initSelector: ":jqmData(role='call')"
	},
	
	_eventBind: function () {
	    this.element.find(".ui-android-button").bind("vclick", {phonenumber : this.options.phonenumber}, this._open);
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
        o.phonenumber = $el.attr("phonenumber") || o.phonenumber;
        
		$el.addClass("ui-android ui-android-call ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	_open: function (e) {
	    window.location.href = "tel:" + (e.data.phonenumber || "");
	},
	
	open: function(phoneNum) {
	    var num = phoneNum;
	    if (num == undefined) {
	        num = "";
	    }
	    num = num.trim();
	    window.location.href = "tel:" + num;
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.call.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.call */

/* start plugin : mobile.alarm */
(function ( $, undefined ) {
$.widget( "mobile.alarm", $.mobile.android, {
	options: {
	    initSelector: ":jqmData(role='alarm')"
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
	    if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-android ui-android-alarm ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	open: function() {
	    window.location.href = "intent://#Intent;package=com.sec.android.app.clockpackage;end";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.alarm.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.alarm */

/* start plugin : mobile.contact */
(function ( $, undefined ) {
$.widget( "mobile.contact", $.mobile.android, {
	options: {
	    initSelector: ":jqmData(role='contact')"
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-android ui-android-contact ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	open: function() {
	    window.location.href = "intent://#Intent;package=com.android.contacts;end";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.contact.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.contact */

/* start plugin : mobile.calendar */
(function ( $, undefined ) {
$.widget( "mobile.calendar", $.mobile.android, {
	options: {
	    initSelector: ":jqmData(role='calendar')"
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-android ui-android-calendar ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	open: function() {
	    window.location.href = "intent://#Intent;package=com.android.calendar;end";
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.calendar.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.calendar */

/* start plugin : mobile.message */
(function ( $, undefined ) {
$.widget( "mobile.message", $.mobile.android, {
	options: {
	    type: "sms",
	    phonenumber: null,
	    title: "",
	    body: "",
	    initSelector: ":jqmData(role='message')"
	},
	
	_eventBind: function () {
	    this.element.find(".ui-android-button").bind("vclick", {options : this.options}, this._open);
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
        o.type = $el.attr("type") || o.type;
        o.phonenumber = $el.attr("phonenumber") || o.phonenumber;
        o.title = $el.attr("title") || o.title;
        o.body = $el.attr("body") || o.body;
        
		$el.addClass("ui-android ui-android-message ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	_open: function (e) {
	    var o = e.data.options;
	    if (o.type === "mms") {
	        window.location.href = "mmsto:" + (o.phonenumber || "") + "?subject=" + (o.title || "") + "&body=" + (o.body || "");
	    }
	    else {
	        window.location.href = "sms:" + (o.phonenumber || "") + "?body=" + (o.body || "");
	    }
	},

	sms: function(phoneNum, body) {
	    var num = phoneNum;
	    if (num == undefined) {
	        num = "";
	    }
	    num = num.trim();
	    var msg = body;
	    if (msg == undefined) {
	        msg = "";
	    }
	    msg = msg.trim();
	    window.location.href = "sms:" + num + "?body=" + msg;
	},

	mms: function(phoneNum, title, body) {
	    var num = phoneNum;
	    if (num == undefined) {
	        num = "";
	    }
	    num = num.trim();
	    var t = title;
	    if (t == undefined) {
	        t = "";
	    }
	    t = t.trim();
	    var msg = body;
	    if (msg == undefined) {
	        msg = "";
	    }
	    msg = msg.trim();
	    var url = "mmsto:" + num + "?subject=" + t + "&body=" + msg;
	    window.location.href = url;
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.message.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.message */

/* start plugin : mobile.filebrowser */
(function ( $, undefined ) {
$.widget( "mobile.filebrowser", $.mobile.android, {
	options: {
	    type: "CONTENT",
	    initSelector: ":jqmData(role='filebrowser')"
	},
	
	_create: function () {
	    var $el = this.element,
	        o = this.options;
	    
		if (!o.theme) {
        	o.theme = $.mobile.getInheritedTheme(this.element, "c");
        }
        
		$el.addClass("ui-android ui-android-filebrowser ui-android-nodisplay");
		
		if (o.display) {
		    this._setDisplay(true);
		}
	},
	
	_onSuccess: function (fileList) {
	    this.element.trigger("filebrowsersuccess", [fileList]);
	},
	
	_onFail: function () {
	    this.element.trigger("filebrowserfail");
	},
	
	open: function () {
        try{
            var instance = this;
            var onSuccess = function (fileList) {
                instance._onSuccess(fileList);
            };
            
            var onFail = function () {
                instance._onFail();
            };
            
            webapis.filechooser.showOpenFileBrowser(onSuccess, onFail, instance.options.type);
        }catch(e){
            //alert(e.toString());
            console.log(e.toString());
        }
	}
});

$( document ).bind( "pagecreate create", function( e ) {
	$.mobile.filebrowser.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
/* end plugin : mobile.filebrowser */
