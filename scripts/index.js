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
		$('#tbRutas > tbody:last-child').append('<tr class="trRuta" data-rutaIdx="'+rutaIdx+'"><td>'+ruta.nombre+'</td></tr>');		
    }
	
    map.fitBounds(bounds);
	//Click filtro ruta
	$(".trRuta").click(function(e){		
		var hasClass = $(this).hasClass("active");
		google.maps.event.trigger( listaRutas.rutas[$(this).attr("data-rutaIdx")].trazo, 'click' ,{});
		$(".trRuta.active").removeClass("active");
		if(!hasClass)
			$(this).addClass("active");
		$('#mdFiltro').modal('hide');
		return false;
		
	});
	//click 	btnRutas
	$("#btnRutas").click(function(e){
		if($("#mdbFiltro").children().length==0) 
		$("#mdbFiltro").append($("#tbRutas"));
		$('#mdFiltro').modal('show');
	});
    //Bus
    busA = configureBus({
        pinColor: listaRutas.rutas[rutaIdx].pinColor,
        lat: listaRutas.rutas[1].estaciones[0].datos.lat,
        lng: listaRutas.rutas[1].estaciones[0].datos.lng,
        nombre: "lata 1",
		ruta:listaRutas.rutas[0]
    });

    //Estaciones
    for (r in listaRutas.rutas[rutaIdx].puntos) {
		if(r>50)
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
        var estacion = ruta.estaciones[estaIdx].datos;
		if((estacion != undefined) || (estacion != null))
		{
			var marker ;
			if((estacion.marker == undefined) || (estacion.marker == null))
			{
				marker = new google.maps.Marker({
					position: new google.maps.LatLng({
						lat: estacion.lat,
						lng: estacion.lng
					}),
					map: map,
					title: estacion.nombre,
					draggable: false,
					icon: new google.maps.MarkerImage("img/"+(estacion.compartida === true?estacion.imgC:ruta.img), 
														new google.maps.Size(24, 29),
														new google.maps.Point(0, 0),
														new google.maps.Point(10, 34)),
					shadow: pinShadow,
					estacion:estacion,
					ruta:ruta
				});
				google.maps.event.addListener(marker, "click", function(evt) {  
					infowindow.setContent(this.get('title'));
					infowindow.open(map,this);
				});
				estacion.marker = marker;
			}
			else
			{
				marker = estacion.marker;
			}
			rutaLinea.markers.push(marker);
		}
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
	rutaLinea.ruta= ruta;
	rutaLinea.mostrando = true;
	rutaLinea.actual = false;
	
    for (punto in ruta.puntos)
        bounds.extend(new google.maps.LatLng({
            lat: ruta.puntos[punto].lat,
            lng: ruta.puntos[punto].lng
        }));
    dibujarPin(ruta, rutaLinea);
	
	google.maps.event.addListener(rutaLinea, 'click', rutaLineaClick);
}
function rutaLineaClick(e){
	var m = this.actual;
	for (rutaIdx in listaRutas.rutas) 
	{
		var ruta1 = listaRutas.rutas[rutaIdx];
		if(ruta1.id != this.ruta.id)
		{
			ruta1.trazo.actual = false;
			actualizarRuta(ruta1, m,true);
		}
		else
		{
			actualizarRuta(ruta1, true, m);
			for(mk in listaEstaciones)
					actualizarMarkers(listaEstaciones[mk].marker.ruta,listaEstaciones[mk].marker,m,m);
			if(!m)
			{
				for(mk in ruta1.trazo.markers)
					actualizarMarkers(ruta1,ruta1.trazo.markers[mk],true,false);
			}
		}
	}
	this.actual = !this.actual;
}
function actualizarMarkers(ruta,marker,mostrar,compartido)
{
	marker.setVisible(mostrar);
	
	var icon=marker.getIcon();
	var currentIconUrl = icon.url;
	icon.url="img/"+(marker.estacion.compartida === true && compartido? marker.estacion.imgC:ruta.img);
	if(currentIconUrl!= icon.url)
	{
		marker.setIcon(icon)
	}	
}
function actualizarRuta(ruta1, mostrar,compartido){
	 var fillOpacity = mostrar?1:0.5;
	 
	 ruta1.trazo.setOptions({fillOpacity:fillOpacity,strokeOpacity:fillOpacity}); 
	 ruta1.trazo.mostrando = mostrar;
	 
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