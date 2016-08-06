com.dacore.mapaUcr=  (function () {
  var instance;
  function createInstance() {
        return {
        var tracker = null,
        var showPosition = null,
        var onError = null,
 trackUserLocation= function(showPosition,onError)
{
this.showPosition = showPosition;
this.onError= onError;
 tracker = setInterval( function(){ com.dacore.mapaUcr.getInstance().getLocation(); }, 3000);
},

 getLocation= function () {
   var showError =  onError == null? this.showErrorBuildIn : onError
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        showError({code:-5});
    }
},
 showErrorBuildIn= function  (error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert( "Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
        case -5:
            alert("Geolocation is not supported by this browser.");
            break;
    }
  }
  
        };
    }
     return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
    
})();
