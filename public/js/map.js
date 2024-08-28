
// Create a Leaflet map and set a default view
var map = L.map('myMap').setView([0, 0], 5);


// setting base layer
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const tiles = L.tileLayer(tileUrl, { attribution });

tiles.addTo(map);

// var marker = L.marker([51.5, -0.09]).addTo(map);


// Create a geocode service to search for the city with the API token
var geocodeService = L.esri.Geocoding.geocodeService({
    apikey: mapToken
});

// Replace 'YourCityName' with the city name variable from your listing
var cityName = city;

// Search for the city and center the map on it
geocodeService.geocode().text(cityName).run(function (err, results) {
    if (err || !results.results.length) {
        console.error("Geocoding error: ", err);
        return;
    }

    // Get the city's location and set the map view to it
    var latlng = results.results[0].latlng;
    map.setView(latlng, 10); // Zoom level 10

    // Add a marker at the city's location with a popup
    var marker = L.marker(latlng).addTo(map);
    marker.bindPopup(cityName).openPopup();
});

// on map click
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Exact location will be provided after booking " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick); 
