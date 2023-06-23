let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";


let myMap = L.map("map", {
    center: [39.83, -98.58],
    zoom:3
});


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function depthColor(depth) {
    if (depth >= 90) return "#f36c49"
    else if (depth >= 70) return "#f3b249"
    else if (depth >= 50) return "#f3da49"
    else if (depth >= 30) return "#e4f349"
    else if (depth >= 10) return "#b5f349"
    else return "#49f350"
}

function getColor(category) {
    if (category == "90+") return "#f36c49"
    else if (category == "70-90") return "#f3b249"
    else if (category == "50-70") return "#f3da49"
    else if (category == "30-50") return "#e4f349"
    else if (category == "10-30") return "#b5f349"
    else return "#49f350"
}


d3.json(queryUrl).then(function (data) {
    L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
            return new L.Circle(latlng, {
                color: "black", 
                fillColor: depthColor(feature.geometry.coordinates[2]), 
                fillOpacity : 100,
                radius: feature.properties.mag * 50000});
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
        }
    }).addTo(myMap)

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Depth</strong>'];
        categories = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML += 
            labels.push('<li style="background-color: ' + getColor(categories[i]) + '"> ' + categories[i]);
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(myMap);
});

