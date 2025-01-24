console.log("Hello from script.js");



document.addEventListener('DOMContentLoaded', function () {
    function createMap(center, zoom) {
        let map = L.map('map').setView(center, zoom);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        return map
    }



    let map = createMap([-22.85, -43.28], 12)
    let vehicles = JSON.parse(document.getElementById('vehicles-json').textContent);
    
    let markersFeaturesGroup = L.featureGroup().addTo(map);

    for (let vehicle of vehicles) {
        L.marker([vehicle.latitude, vehicle.longitude]).addTo(markersFeaturesGroup);
        // marker.bindPopup(vehicle.name);
    }

});