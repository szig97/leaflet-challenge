// Referenced Andy McRae's code to complete the assignment

// Initialize and Create LayerGroup
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
    center: [37.09, -95.71],
    zoom: 4.5,
    layers: [lightmap, earthquakes]
});

// Create a Layer Control
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Retrieve earthquakesURL using D3
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(earthquakeData) {
    console.log(earthquakeData);
    // Function to determine marker color
    var colors = ["#a3f600", "#dcf400", "#f7db11", "#fbd72a", "#fca35d", "#ff5f65"]
    function color(depth) {
        var fillingColor = "black";
        switch(true) {
            case depth > 90:
                fillingColor = colors[5];
                break;
            case depth > 70:
                fillingColor = colors[4];
                break;
            case depth > 50:
                fillingColor = colors[3];
                break;
            case depth > 30:
                fillingColor = colors[2];
                break;
            case depth > 10:
                fillingColor = colors[1];
                break;
            case depth > -10:
                fillingColor = colors[0];
                break;
        }
        return fillingColor;
    }
    // Function to determine marker style
    function styleInfo(feature) {
        return {
            opacity: 1, 
            fillOpacity: 1,
            fillColor: color(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: 5 * feature.properties.mag,
            stroke: true,
            weight: 0.5
        };
    }
    // Use GeoJSON to add layers of circles and popups
    L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +
            "</h3><h3>Depth: " + feature.geometry.coordinates[2] + "</h3><hr><p>" + feature.properties.place + "<p>");
        }
    }).addTo(earthquakes);
    earthquakes.addTo(myMap);

    // Legend Setup
    var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var labels = [];

        var legendInfo = "<u1 class=\"labels\">";
        var legendEnd = "</u1>";

        for (i=0; i < limits.length; i++) {
            labels.push(
                "<li style=\"background-color: " + colors[i] + "\"></li" + "div class=\labels\">" + limits[i] + "</div>"
            );
        }
        
        legendInfo = legendInfo + legendEnd;

        div.innerHTML = legendInfo;

        div.innerHTML += "<u1>" + labels.join("") + "</u1>";
        return div;
    };
    
    // Add legend to map
    legend.addTo(myMap);
});