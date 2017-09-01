/*
 * SEC Web App SDK 1.0
 *
 * Copyright ¨Ï 2013 Samsung Electronics Co., Ltd. All rights reserved.
 */

/*Do not edit the source code below.*/
window.appWidth=720;
window.appHeight=1280;

function setMetaDefaultPageSize() {
	$("html").addClass("w" + window.appWidth);

    if (window._isDesigner) {
        return;
    }
    
    var gameScreen = Math.min(window.appWidth, window.appHeight);
    var gameDensity = 160 * window.devicePixelRatio;
    var sSize = Math.min(window.outerWidth, window.outerHeight);
    
    var dpi = 0;
    
    if (sSize != gameScreen) {
      dpi = parseInt(gameScreen * gameDensity / sSize, 10);
      var heads = document.getElementsByTagName('head');
      if (heads && heads[0]) {
        if (heads[0].myReady) {
            return;
        }
        var metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "viewport");
        metaTag.setAttribute("content", "target-densitydpi="+dpi);
        heads[0].appendChild(metaTag);
        heads[0].myReady = true;
      }
    }
}

document.addEventListener('DOMContentLoaded', setMetaDefaultPageSize, false);

setMetaDefaultPageSize();
