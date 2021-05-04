// GeoJSON URL Variables
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson"

// Initialize and Create LayerGroups
var earthquakes = new L.LayerGroup();

// Define Variables for Tile Layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

// Define baseMaps Object for Base Layers
var baseMaps = {
    "Lightmap": lightmap,
};

// Create Overlay Object for Overlay Layers
var overlayMaps = {
    "Earthquakes": earthquakes,
};

// Create the Map
var myMap = L.map("mapid", {
    center: [40.7608, -111.8910],
    zoom: 5,
    layers: {lightmap, earthquakes}
});

// Create a Layer Control
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Retrieve earthquakesURL with D3
d3.json(earthquakesURL, function(earthquakesURL) {
    // Function to Determine marker size
    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 3;
    }
    // Function to determine marker style
    function styleInfo(feature) {
        return {
            opacity: 1, 
            fillOpacity: 1,
            fillColor: chooseColor(feature.properties.mag),
            color: "#000000",
            radius: markerSize(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }   
})