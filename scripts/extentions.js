/*********************************************************/
/****************        google.maps       ***************/
/*********************************************************/

google.maps.Marker.prototype.transition = function(result) {

    result.tsMark = Math.floor(Date.now() / 1000);
    result.tsMark = result.tsMark + (this.funqueue.length % 2 == 0 ? this.funqueue.length / 2 : 0);
    this.funqueue.push(result);
    if (this.funqueue.length == 1) {
        this.transitionProcess(result);
    }
}

google.maps.Marker.prototype.transitionProcess = function(result) {
    this.i = 0;
    if (Math.abs(result.tsMark - Math.floor(Date.now() / 1000)) < 5) {
        this.deltaLat = (result.lat() - this.position.lat()) / this.numDeltas;
        this.deltaLng = (result.lng() - this.position.lng()) / this.numDeltas;
    } else {
        this.deltaLat = (result.lat() - this.position.lat()) / 10;
        this.deltaLng = (result.lng() - this.position.lng()) / 10;
        this.i = this.numDeltas - 10;
    }
    this.moveMarker();
}

google.maps.Marker.prototype.moveMarker = function() {
    var lat1 = this.position.lat() + this.deltaLat;
    var lon1 = this.position.lng() + this.deltaLng;
    var latlng1 = new google.maps.LatLng(lat1, lon1);
    this.setPosition(latlng1);
    if (this.i != this.numDeltas) {
        this.i++;
        var self = this;
        self.ejecucionD = setTimeout(function() { self.moveMarker(); }, self.delay);
    } else {
        this.funqueue.shift();
        if (this.funqueue.length > 0)
            this.transitionProcess(this.funqueue[0]);
    }
}
