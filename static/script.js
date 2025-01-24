console.log("Hello from script.js");

document.addEventListener('DOMContentLoaded', () => {
    function createMap(center, zoom) {
        const map = L.map('map').setView(center, zoom);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        return map;
    }

    function updateMarkers(markersGroup) {
        fetch('/vehicle-positions')
            .then(response => response.json())
            .then(data => {
                const prevLatLons = [];

                markersGroup.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        prevLatLons.push(layer.getLatLng());
                        markersGroup.removeLayer(layer);
                    }
                });

                data.vehicle.forEach((vehicle, i) => {
                    const newLatLon = [vehicle.latitude, vehicle.longitude];
                    L.marker(newLatLon).addTo(markersGroup);

                    if (prevLatLons[i]) {
                        const prevLatLon = [prevLatLons[i].lat, prevLatLons[i].lng];
                        L.polyline([prevLatLon, newLatLon], { color: "red" }).addTo(markersGroup);
                    }
                });
            })
            .catch(error => console.error('Erro ao atualizar os marcadores:', error));
    }

    const map = createMap([-22.85, -43.28], 12);
    const markersFeaturesGroup = L.featureGroup().addTo(map);
    const vehicles = JSON.parse(document.getElementById('vehicles-json').textContent);

    vehicles.forEach(vehicle => {
        L.marker([vehicle.latitude, vehicle.longitude]).addTo(markersFeaturesGroup);
    });

    setInterval(() => updateMarkers(markersFeaturesGroup), 5000);
});