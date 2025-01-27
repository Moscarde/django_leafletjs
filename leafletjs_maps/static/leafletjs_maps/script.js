console.log("Hello from script.js");

document.addEventListener("DOMContentLoaded", () => {
	let polyline = null; // Armazena a linha do trajeto
	let currentMarker = null; // Marcador para a posição atual do veículo
	let routeCoordinates = []; // Histórico das coordenadas do trajeto
	const markers = {}; // Armazena os marcadores por coordenada

	const vehicleIcon = L.AwesomeMarkers.icon({
		markerColor: "black",
		iconColor: "white",
		icon: "motorcycle",
		prefix: "fa",
		extraClasses: "fa-rotate-0"
	});

	const houseIcon = L.AwesomeMarkers.icon({
		markerColor: "orange",
		iconColor: "white",
		icon: "house",
		prefix: "fa",
		extraClasses: "fa-rotate-0"
	});

	const completedIcon = L.AwesomeMarkers.icon({
		markerColor: "green",
		iconColor: "white",
		icon: "check",
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
						})
							.bindPopup(
								`
                            <h5>Gabriel Silva</h5>
                            <p><strong>Veículo</strong>: Honda CG Cargo</p>
                            <p><strong>Ano</strong>: 2013</p>
                            <p><strong>Placa</strong>: ABC1923</p>
                        `
							)
							.addTo(map);
					}

					// Verifica se a rota passou por um local de entrega
					destinations.forEach((destination) => {
						const destinationLatLng = L.latLng(destination.latitude, destination.longitude);
						const alreadyVisited = destination.visited; // Marca se já foi visitado

						if (!alreadyVisited) {
							// Calcula a menor distância da rota ao destino
							const distances = routeCoordinates.map((coord) => destinationLatLng.distanceTo([coord.latitude, coord.longitude]));
							const minDistance = Math.min(...distances);

							if (minDistance <= 20 && markers[destination.id]) {
								// Ajuste o raio aqui, se necessário
								// Atualiza o ícone do marcador e marca como visitado
								markers[destination.id].setIcon(completedIcon);
								destination.status = "Entregue";
								markers[destination.id].getPopup().setContent(`
                                    <h5>${destination.name}</h5>
                                    <p>${destination.address}</p>
                                    <p>${destination.phone}</p>
                                    <p>Status: <span class="text-success">${destination.status}</span></p>
                                `);

								destination.visited = true;
							}
						}
					});
				}
			})
			.catch((error) => console.error("Erro ao atualizar a rota:", error));
	}

	const map = createMap([-22.92942, -43.55495], 14);

	const destinations = JSON.parse(document.getElementById("destinations-json").textContent);

	destinations.forEach((destination) => {
		const marker = L.marker([destination.latitude, destination.longitude], {
			icon: houseIcon
		})
			.bindPopup(
				`
            <h5>${destination.name}</h5>
            <p>${destination.address}</p>
            <p>${destination.phone}</p>
            <p>Status: <span class="text-danger">${destination.status}</span></p>
        `
			)
			.addTo(map);
		markers[destination.id] = marker; // Armazena o marcador associado ao destino
		destination.visited = false; // Inicializa o estado "não visitado"
	});

	// Atualiza a rota e o marcador a cada 5 segundos
	updateRoute(map);
	setInterval(() => updateRoute(map), 5000);
});
