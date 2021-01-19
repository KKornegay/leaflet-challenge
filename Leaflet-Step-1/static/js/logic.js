// // Creating map object
// var myMap = L.map("mapid", {
//     center: [15.5994, -28.6731],
//     zoom: 3
//   });
  
//   // Adding tile layer to the map
//   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
//   }).addTo(myMap);
  
  // Store API query variables
//   var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 
//     // Grab the data with d3
//   d3.json(url, function(response) {
//     console.log(response);
//     // Create a new marker cluster group
//     var markers = L.markerClusterGroup();
  
//     // Loop through data
//     for (var i = 0; i < response.length; i++) {
  
//       // Set the data location property to a variable
//       var location = response[i].geometry;
  
//       // Check for location property
//       if (location) {
  
//         // Add a new marker to the cluster group and bind a pop-up
//         markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
//           .bindPopup(response[i].descriptor));
//       }
  
//     }
  
//     // Add our marker cluster layer to the map
//     myMap.addLayer(markers);
  
//   });
// d3.json(url, function(response) {

//     console.log(response);
  
//     for (var i = 0; i < response.length; i++) {
//       var location = response[i].features[geometry];
  
//       if (location) {
//         L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
//       }
//     }
  
//   });

  function createMap(earthQuakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthsquakes": earthQuakes
    };
  
    // Create the map object with options
    var map = L.map("mapid", {
      center: [15.5994, -28.6731],
      zoom: 3,
      layers: [lightmap, earthQuakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    // Pull the "stations" property off of response.data
    var quakes = response.features;
  
    // Initialize an array to hold bike markers
    var quakeMarkers = [];
  
    // Loop through the stations array
    for (var index = 0; index < quakes.length; index++) {
      var quake = quakes[index];
  
      // For each station, create a marker and bind a popup with the station's name
      var quakeMarker = L.marker([quake.geometry.coordinates[1], quake.geometry.coordinates[0]])
        .bindPopup("<h3>" + quake.properties.place + "</h3>");
  
      // Add the marker to the bikeMarkers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);