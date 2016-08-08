var map;
var markers = [];
var bounds;
var pinShadow;

var busA;
var usuarioMarker = null;
var infowindow;

$(document).ready(function() {
    var mpConfig = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(9.65, -84.15), // centro costa rica
        zoom: 14,
        streetViewControl: false,
    };
    cargarExtGoogle();
	infowindow = new google.maps.InfoWindow();
    $("#map_canvas").height($("#main").height()-$("header").height()-$("footer").height()-2);

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
        markers = markers;
        debugger;
    });
    //Bus
    busA = configureBus({
        pinColor: listaRutas.rutas[rutaIdx].pinColor,
        lat: listaRutas.rutas[rutaIdx].estaciones[0].lat,
        lng: listaRutas.rutas[rutaIdx].estaciones[0].lng,
        nombre: "lata 1",
		ruta:listaRutas.rutas[0]
    });

    //Estaciones
    for (r in listaRutas.rutas[rutaIdx].puntos) {
		if(r>120)
        busA.transition(new google.maps.LatLng({
            lat: listaRutas.rutas[rutaIdx].puntos[r].lat,
            lng: listaRutas.rutas[rutaIdx].puntos[r].lng
        }));
    }
    mapaUcr.getInstance().trackUserLocation(showUserLocation, onTrackUserLocationError);
});


function dibujarPin(ruta, rutaLinea) {
    var pinColor = ruta.pinColor;    
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
            icon: new google.maps.MarkerImage("img/"+(estacion.compartida?estacion.imgC:estacion.img), //"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
												new google.maps.Size(24, 29),
												new google.maps.Point(0, 0),
												new google.maps.Point(10, 34)),
            shadow: pinShadow,
			estacion:estacion
        });
		google.maps.event.addListener(marker, "click", function(evt) {  
			infowindow.setContent(this.get('title'));
			infowindow.open(map,this);
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
	ruta.trazo = rutaLinea; 
	
    for (punto in ruta.puntos)
        bounds.extend(new google.maps.LatLng({
            lat: ruta.puntos[punto].lat,
            lng: ruta.puntos[punto].lng
        }));
    dibujarPin(ruta, rutaLinea);
}

function configureBus(bus) {
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
        shadow: pinShadow,
        zIndex: 100000
    });

    marker.numDeltas = 100;
    marker.delay = 10; //milliseconds
    marker.i = 0;
    marker.deltaLat = 0;
    marker.deltaLng = 0;
    marker.funqueue = [];
	marker.ruta=bus.ruta;
    return marker;
}

function showUserLocation(position) {
	var d= new Date();
	var dividir=100000;
    if (usuarioMarker == null) {
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=glyphish_walk|00FF00",
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
		
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng({
                lat: 9.9369079 +d.getSeconds()/dividir ,//position.coords.latitude,
                lng: -84.0501299 +d.getSeconds()/dividir//position.coords.longitude
            }),
            map: map,
            draggable: false,
            icon: pinImage,
            zIndex: 100000
        });

        marker.numDeltas = 100;
        marker.delay = 10; //milliseconds
        marker.i = 0;
        marker.deltaLat = 0;
        marker.deltaLng = 0;
        marker.funqueue = [];
        usuarioMarker = marker;
    } else {
        usuarioMarker.transition(new google.maps.LatLng({
            lat: 9.9369079 +d.getSeconds()/dividir,//position.coords.latitude,
            lng:  -84.0501299 +d.getSeconds()/dividir//position.coords.longitude
        }));
    }
}

function onTrackUserLocationError(error) {}