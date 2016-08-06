var mapaUcr = (function() {
    var instance;

    function createInstance() {
        return {
            tracker: null,
            showPosition: null,
            onError: null,
            trackUserLocation: function(showPosition, onError) {
                this.showPosition = showPosition;
                this.onError = onError;
                this.tracker = setInterval(function() {
                    debugger;
                    mapaUcr.getInstance().getLocation();
                }, 3000);
            },

            getLocation: function() {
                var showError = this.onError == null ? this.showErrorBuildIn : this.onError
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(this.showPosition, showError);
                } else {
                    showError({ code: -5 });
                }
            },
            showErrorBuildIn: function(error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.");
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
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };

})();