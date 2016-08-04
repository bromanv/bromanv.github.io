var map;
var l = [];
var markers= [];
var bounds;
var pinShadow;
var busA;
$(document).ready(function() {
  var mpConfig = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(9.65, -84.15), // centro costa rica
    zoom: 14,
    streetViewControl: false,
  };
  $("#map_canvas").height ($("body").height()-20);
  bounds = new google.maps.LatLngBounds();
  map = new google.maps.Map(document.getElementById("map_canvas"), mpConfig);
  pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
    new google.maps.Size(40, 37),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 35));

  for (rutaIdx in listaRutas.rutas) {
    var ruta = listaRutas.rutas[rutaIdx];
    dibujarRuta(ruta);
  }
  map.fitBounds(bounds);
  $("#btnHola").click(function(e) {
    l = l;
    markers=markers;
    debugger;
  });
busA =configureBus({
  pinColor:listaRutas.rutas[rutaIdx].pinColor, 
  lat:listaRutas.rutas[rutaIdx].estaciones[0].lat,
  lng:listaRutas.rutas[rutaIdx].estaciones[0].lng,
  nombre:"lata 1",
});
busA.transition(new google.maps.LatLng({
        lat:listaRutas.rutas[rutaIdx].puntos[5].lat,
        lng:listaRutas.rutas[rutaIdx].puntos[5].lng
      }));
});


function dibujarPin(ruta,rutaLinea) {
  var pinColor = ruta.pinColor;
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34));
    rutaLinea.markers = [];
  for (estaIdx in ruta.estaciones) {
    var estacion = ruta.estaciones[estaIdx];
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng({
        lat: estacion.lat,
        lng: estacion.lng
      }),
      map: map,
      title: estacion.nombre,
      draggable: false,
      icon: pinImage,
      shadow: pinShadow
    });
   
    rutaLinea.markers.push(marker);
  }
}

function dibujarRuta(ruta) {
  var rutaLinea = new google.maps.Polyline({
    path: ruta.puntos,
    geodesic: true,
    strokeColor: ruta.color,
    strokeOpacity: 1.0,
    strokeWeight: ruta.strokeWeight,
    fillColor: ruta.color,
    fillOpacity: 1,
    editable: false,
    zIndex: 100
  });

  rutaLinea.setMap(map);
  l.push(rutaLinea);
  for (punto in ruta.puntos)
    bounds.extend(new google.maps.LatLng({
      lat: ruta.puntos[punto].lat,
      lng: ruta.puntos[punto].lng
    }));
  dibujarPin(ruta,rutaLinea);
}
function configureBus(bus)
{
   var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|" + bus.pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34));
 
   var marker = new google.maps.Marker({
      position: new google.maps.LatLng({
        lat: bus.lat,
        lng: bus.lng
      }),
      map: map,
      title: bus.nombre,
      draggable: false,
      icon: pinImage,
      shadow: pinShadow
    });
    
    marker.numDeltas = 100;
    marker.delay = 10; //milliseconds
    marker.i = 0;
    marker.deltaLat=0;
    marker.deltaLng=0;
    marker.moveMarker= moveMarker;
    marker.transition= transition;
    return marker;
}

/**********************/
function transition(result){
    this.i = 0;
    this.deltaLat = (result.lat() - this.position.lat())/this.numDeltas;
    this.deltaLng = (result.lng() - this.position.lng())/this.numDeltas;
    this.moveMarker();
}
function moveMarker(){
    var lat = this.position.lat() + this.deltaLat;
    var lon = this.position.lng() + this.deltaLng;
    var latlng = new google.maps.LatLng(lat,lon);
    this.setPosition(latlng);
    if(this.i!=this.numDeltas){
        this.i++;
        setTimeout(function(){this.moveMarker;}, this.delay);
    }
}
