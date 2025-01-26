console.log("Hello from script.js");

document.addEventListener("DOMContentLoaded", () => {
	let polyline = null; // Armazena a linha do trajeto
	let currentMarker = null; // Marcador para a posição atual do veículo
	let routeCoordinates = []; // Histórico das coordenadas do trajeto
	const vehicleIcon = L.AwesomeMarkers.icon({
		markerColor: "black",
		iconColor: "white",
		icon: "motorcycle",
		prefix: "fa",
		extraClasses: "fa-rotate-0"
	});

    const houseIcon = L.AwesomeMarkers.icon({
		markerColor: "black",
		iconColor: "white",
		icon: "house",
		prefix: "fa",
		extraClasses: "fa-rotate-0"
	});

	function createMap(center, zoom) {
		const map = L.map("map").setView(center, zoom);
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(map);
		return map;
	}

	function updateRoute(map) {
		fetch("/route-coordinates")
			.then((response) => response.json())
			.then((data) => {
				const newRoute = data.route;

				// Adiciona apenas as coordenadas novas
				const newPoints = newRoute.slice(routeCoordinates.length);

				if (newPoints.length > 0) {
					// Atualiza o histórico de coordenadas
					routeCoordinates = routeCoordinates.concat(newPoints);

					// Atualiza ou cria a polyline
					if (polyline) {
						polyline.setLatLngs(routeCoordinates.map((point) => [point.latitude, point.longitude]));
					} else {
						polyline = L.polyline(
							routeCoordinates.map((point) => [point.latitude, point.longitude]),
							{
								color: "red",
								weight: 4
							}
						).addTo(map);
					}

					// Atualiza o marcador na última posição
					const lastPoint = [newRoute[newRoute.length - 1].latitude, newRoute[newRoute.length - 1].longitude];
					if (currentMarker) {
						currentMarker.setLatLng(lastPoint);
					} else {
						currentMarker = L.marker(lastPoint, {
							icon: vehicleIcon
						}).addTo(map);
					}
				}
			})
			.catch((error) => console.error("Erro ao atualizar a rota:", error));
	}

	const map = createMap([-22.92942, -43.55495], 14);

	// Atualiza a rota e o marcador a cada 5 segundos
	updateRoute(map);
	setInterval(() => updateRoute(map), 5000);
});
