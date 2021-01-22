 // Define streetmap, darkmap, satellite layers
 var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  accessToken: API_KEY
});

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("mapid", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap]
});

// adding one streetmap tile layer to the map.
streetmap.addTo(map);

// add layer groups
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Satellite Map": satelliteMap
};

// Define a overlayMaps object to hold out overlays 
var overlayMaps = {
  "Fault Lines": tectonicplates,
  "Earthquakes": earthquakes
};

// control which layers are visible.
L.control.layers(baseMaps, overlayMaps,{
  collapsed: false
}).addTo(map);


// use this link to get geojson data for earthquakes
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Grab the data with d3
d3.json(url, function(response) {
    createFeatures(response.features);
});
    //Define and Create features, from website
function createFeatures(earthquakedata){
    // Function that will determine the color of mag
function chooseColor(depth) {
    switch (true) {
    case depth > 90:
      return "red";
    case depth > 70:
      return "orangered";
    case depth > 50:
      return "darkorange";
    case depth > 30:
      return "orange";
    case depth > 10:
      return "yellow";
    case depth > -10:
      return "greenyellow";
    default:
      return "green";
    }
}
    L.geoJSON(earthquakedata, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3>" + "Location: " + feature.properties.place)
        },

        pointToLayer: function(feature, latlng) {
            return new L.circleMarker(latlng,
                {radius: feature.properties.mag * 6,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: .8,
                color: "navy",
                weight: 1
            })
        }
    
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);
}

 // Set up the legend
 var legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   var colors = ["red", "orangered", "darkorange", "orange", "yellow", "greenyellow", "green"].reverse();
   var labels = [];

   // Add min & max
   var legendInfo = "<h1>Depth</h1>" +
     "<div class=\"labels\">" +
       "<div class=\"min\">" + "-10" + "</div>" +
       "<div class=\"max\">" + "90+" + "</div>" +
     "</div>";

   div.innerHTML = legendInfo;

   colors.forEach(function(color, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding legend to the map
 legend.addTo(myMap);

// use this link to get geojson data
var url2 = "https://github.com/fraxen/tectonicplates/tree/master/GeoJSON/PB2002_boundaries.json";
// retrive Tectonic Plate geoJSON data.
d3.json(url2,
function(platedata) {

  L.geoJson(platedata, {
    color: "orange",
    weight: 2
  })
  .addTo(tectonicplates);

  // add the tectonicplates layer to the map.
  tectonicplates.addTo(myMap);
});

// function createMap(earthquakes){
//     console.log(earthquakes)
//    // Define streetmap, darkmap, satellite layers
//   var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
//   });

//   var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
//     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
//     maxZoom: 18,
//     accessToken: API_KEY
//   });

//   // // layers for two different sets of data, earthquakes and tectonicplates.
//   // var tectonicplates = new L.LayerGroup();
//   // var earthquakes = new L.LayerGroup();

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap,
//     "Satellite Map": satelliteMap
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes,
//     FaultLines: tectonicplates,
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("mapid", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [streetmap, earthquakes]
//   });

//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

//   // Set up the legend
//   var legend = L.control({ position: "bottomright" });
//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var colors = ["red", "orangered", "darkorange", "orange", "yellow", "greenyellow", "green"].reverse();
//     var labels = [];

//     // Add min & max
//     var legendInfo = "<h1>Depth</h1>" +
//       "<div class=\"labels\">" +
//         "<div class=\"min\">" + "-10" + "</div>" +
//         "<div class=\"max\">" + "90+" + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     colors.forEach(function(color, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding legend to the map
//   legend.addTo(myMap);
// }