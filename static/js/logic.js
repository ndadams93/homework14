var earthquakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// magnitude marker
function markerSize(magnitude) {
    return magnitude * 2;
};

var earthquakeLayer = new L.LayerGroup()

d3.json(earthquakesUrl, function (geoJson) {
    
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, {radius: markerSize(geoJsonPoint.properties.mag)});
        },

        style: function (geoJsonStyle) {
            return {
                fillColor: magColor(geoJsonStyle.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h5 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h5><hr><h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakeLayer);
});

var faultlines = new L.LayerGroup();

d3.json(platesUrl, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 1,
                color: 'brown'
            }
        },
    }).addTo(faultlines);
});


function magColor(mag) {
    return mag > 8 ? "#800026":
            mag > 7 ? "#bd0024":
            mag > 6 ? "#e31a1c":
            mag > 5 ? "#fc4e2b":
            mag > 4 ? "#fd8d3a":
            mag > 3 ? "#feb24a":
            mag > 2 ? "#fed975":
            mag > 1 ? "#ffeda1":
                      "#ffffcd";
};

function createMap() {
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/cherngywh/cjfkdlw8x057v2smizo9hqksx/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibmRhZGFtcyIsImEiOiJjazE0NHllODEwZ2tvM2Nyc3lub3FpaWhmIn0.eSlLBnYctz_TmB-CUw7SYg");

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/cherngywh/cjfon2bd904iy2spdjzs1infc/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibmRhZGFtcyIsImEiOiJjazE0NHllODEwZ2tvM2Nyc3lub3FpaWhmIn0.eSlLBnYctz_TmB-CUw7SYg");

    var street = L.tileLayer("https://api.mapbox.com/styles/v1/cherngywh/cjfokxy6v0s782rpc1bvu8tlz/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibmRhZGFtcyIsImEiOiJjazE0NHllODEwZ2tvM2Nyc3lub3FpaWhmIn0.eSlLBnYctz_TmB-CUw7SYg");

    var baseLayers = {
        "Street": street,     
        "Dark": dark,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakeLayer,
        "Plate Boundaries": faultlines,
    };

    mymap = L.map('map', {
        center: [30, -15],
        zoom: 2.5,
        layers: [dark, earthquakeLayer, faultlines]
    })

    L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(mymap);

    var legend = L.control({position: "bottomright"});

    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend"),
            scale = [0, 1, 2, 3, 4, 5, 6, 7, 8],
            labels =[];
            
        for (var i = 0; i < scale.length; i++) {
            div.innerHTML +=
            '<i style="background:' + magColor(scale[i]) + '"></i> ' +
            scale[i] + (scale[i+1] ? '&ndash;' + scale[i+1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
};

// call the create map function
createMap();
