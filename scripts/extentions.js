/*********************************************************/
/****************        google.maps       ***************/
/*********************************************************/
function cargarExtGoogle()
{
google.maps.Marker.prototype.transition = function(result) {

    result.tsMark = Math.floor(Date.now() / 1000);
    result.tsMark = result.tsMark + (this.funqueue.length % 2 == 0 ? this.funqueue.length / 2 : 0);
    this.funqueue.push(result);
    if (this.funqueue.length == 1) {
        this.transitionProcess(result);
    }
};

google.maps.Marker.prototype.transitionProcess = function(result) {
    this.i = 0;
    if (Math.abs(result.tsMark - Math.floor(Date.now() / 1000)) < 5) {
        this.deltaLat = (result.lat() - this.position.lat()) / this.numDeltas;
        this.deltaLng = (result.lng() - this.position.lng()) / this.numDeltas;
    } else {
		if (Math.abs(result.tsMark - Math.floor(Date.now() / 1000)) < 10) {
			this.deltaLat = (result.lat() - this.position.lat()) / 10;
			this.deltaLng = (result.lng() - this.position.lng()) / 10;		
			this.i = this.numDeltas - 10;
		}
		else
		{
			this.deltaLat = (result.lat() - this.position.lat());
			this.deltaLng = (result.lng() - this.position.lng());		
			this.i =  this.numDeltas;
		}
    }
    this.moveMarker();
};

google.maps.Marker.prototype.moveMarker = function() {
    var lat1 = this.position.lat() + this.deltaLat;
    var lon1 = this.position.lng() + this.deltaLng;
    var latlng1 = new google.maps.LatLng(lat1, lon1);
    this.setPosition(latlng1);
	if(((this.ruta != undefined) &&(this.ruta != null) ) &&
	   ((this.ruta.trazo != undefined) &&(this.ruta.trazo != null) ))
	{
		var enRuta = google.maps.geometry.poly.isLocationOnEdge(latlng1, this.ruta.trazo,0.000125) ;
		var icon=this.getIcon();
		var currentIconUrl = icon.url;
		if(enRuta)
		{
			icon.url=icon.url.replace("ff0000","f59f2b").replace("repair","bus");//this.ruta.pinColor);
		}
		else
		{			
			icon.url=icon.url.replace("f59f2b","ff0000").replace("bus","repair");//(this.ruta.pinColor,"ffffff");
		}
		if(currentIconUrl!= icon.url)
		{
			this.setIcon(icon)
		}
	}	  
    if (this.i != this.numDeltas) {
        this.i++;
        var self = this;
        self.ejecucionD = setTimeout(function() { self.moveMarker(); }, self.delay);
    } else {
        this.funqueue.shift();
        if (this.funqueue.length > 0)
            this.transitionProcess(this.funqueue[0]);
    }
};
}