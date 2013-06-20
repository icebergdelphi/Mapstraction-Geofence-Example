<!DOCTYPE html "-//W3C//DTD XHTML 1.0 Strict//EN"
 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>MapStraction Geofence Example</title>
    <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAl41B4LVy3qJUj-JbnPK3HBSr-NUsf9xrGbPTfPu5KGoAPzM_cxTyxApuWMtJuS3lHkfRHiYbZV_A9g" type="text/javascript"></script>
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
	<script src='http://openlayers.org/api/OpenLayers.js'></script>  
	<script type="text/javascript" src="http://api.maps.yahoo.com/ajaxymap?v=3.8&appid= 46rZ7hXV34HvIGPdyVuvmSIW8yOWwAKfJUpTuW06DINTgOsnHQ1BxdqLh.Bsjkf8BYQQ"></script>
     	<script type="text/javascript" src="http://mapscripting.com/examples/js/mxn.js?( googlev3, google, yahoo, openlayers, cloudmade, microsoft)"></script>
    <style>
    div#mymap {
        width: 1100px;
        height: 550px;
    }
    </style>
    <script type="text/javascript">
    var mapstraction, cnt, points=[];//Variable Global;
	function create_map() {
        mapstraction = new mxn.Mapstraction('mymap', 'googlev3');
		//mapstraction.setMapType(mxn.Mapstraction.ROADMAP);
        mapstraction.setCenterAndZoom(
          new mxn.LatLonPoint(21.9838, -101.2061), 5);
        mapstraction.addControls({
						pan: true,
						zoom: 'large',
					    map_type: false //Diferentes tipos de Mapas
					});
		mapstraction.enableScrollWheelZoom();
        cnt = mapstraction.getCenter();
		/*mapstraction.polylineAdded.addHandler(function(event,map,polyline){
             alert('Polyline Agregados: Tiene '+polyline.polyline.points.length+' vertices')})*/		
    }
	
    function polygon_circle(center, radius) {
	  points=[];//Limpiamos el Array si contenia datos del Polygono
	  var puntos=[];
      var rad = new mxn.Radius(center, 10);
      var poly = rad.getPolyline(mxn.util.milesToKM(radius), '#F00014');
	  console.log(poly.points);
	  //Si deseas extraer las coordenadas del circulo :console.log(poly.points[0].lat+' '+poly.points[0].lon);
	  //Asignamos las codenadas del circulo al array points
	  points=poly.points;
	  mapstraction.addPolyline(poly);
      mapstraction.setCenterAndZoom(center, 5);
    }
    
	//Dibujar Geofence////////////
	 DrawGeofence=function(){
	     var puntos=[];
		 points=[];//Limpiamos el Array si contenia datos del circulo
		 //Show Clicked Points
		 mapstraction.click.addHandler(function(eventName, eventSource, eventArgs) {
		 var coords = eventArgs.location;	// coords are an mxn.LatLonPoint object
		 console.log(coords);
		 puntos.push(coords);
		 points=puntos;
		 var polygon = new mxn.Polyline(puntos);
		 polygon.setColor('#F00014');
		 polygon.setWidth(3);
		// polygon.setClosed(true);
		 mapstraction.addPolyline(polygon);
		});	
 
	 }
   ///Terminar de dibujar Geofence////
	StopDrawGeofence=function(){
	    mapstraction.click.removeAllHandlers();
	   
	}
	
	////Funcion Para calcular In Out GeoFence////
	function FindPoint(X,Y) {
	var count = 0;
	 //Calculamos el Numero de Lados del Polygono
	 for (var i = 0; i < points.length; i++)
	 {
		if (points[i] !== undefined)
		{
				
				++count;
		}
	}
	var sides = count ;// Numero de Lados  del Polygono a Evaluar
	var j = sides-1;
	var pointStatus = false;
	 for (var i = 0; i < sides; i++)
		{
		  if (points[i].lon < Y && points[j].lon >= Y || points[j].lon < Y && points[i].lon >= Y)
			{
				if (points[i].lat + (Y - points[i].lon) / (points[j].lon - points[i].lon) * (points[j].lat - points[i].lat) < X)
				{
					pointStatus = !pointStatus;
				}
			}
			j = i;
		}
		   return pointStatus;
	
	}
	//Probamos los Marcadores dentro y fuera de las Geofences
	function addClickMarkers(){
	 mapstraction.click.addHandler(function(event_type, event_source, event_args) {
					      // 	var reply = "";
							var clickpoint = event_args.location;
							// Creamos Marcador al hacer click
							var mk = new mxn.Marker(clickpoint);
							//mk.setInfoBubble(reply);
							mapstraction.addMarker(mk);
		});	 
	mapstraction.markerAdded.addHandler(function(event,map,marker){
			 // alert('Marker added at: '+marker.marker.location.lat+' , '+marker.marker.location.lon)
		   if( FindPoint(marker.marker.location.lat,marker.marker.location.lon)==true)
		   {
			alert("Estas dentro de los limites permitidos(You are In) ");			   
		   }
		   else
		   {
			 alert("Lo sentimos---Estas fuera de los limites permitidos(You are Out) ");			     
		   }
		})
	
	}
		//////////////////////////////////////////
    </script>
  </head>
  <body onload="create_map()">
    <div id="mymap"></div>
	<br >Nota: Cada vez que quieras dibujar y agregar marcadores, por favor da click en: Detener Dibujado->Stop Drawing
	<br >Note: Every time you want to draw a new shape and add Markers, please click: Detener Dibujado->Stop Drawing<br />
    <a href="javascript:polygon_circle(cnt, 400)">Dibujar Circulo->Draw Circle</a>
    <br /><a href="javascript:DrawGeofence()">Dibujar Poligono->Draw Polygon</a>
	<br /><a href="javascript:StopDrawGeofence()">Detener Dibujado->Stop Drawing</a>
	<br /><a href="javascript:addClickMarkers()">Agregar Marcadores fuera y dentro de las figuras->Add Markers in and out of the shapes</a>
	<br /><a href="http://alienryderflex.com/polygon/">Based: Reference for finding a point inside a polygon </a>
	<h1 > Hiber Tadeo Moreno Tovilla--IcebergDelphi 19/Junio/2013</h1>
  </body>
</html>
