import pandas as pd
import random
import string

# Load and preprocess data
df = pd.read_csv("data/data_google_my_maps.csv").iloc[:8]
df.drop(columns=["tessellate"], inplace=True)

# Split data into routes and locations
df_locations = df.iloc[2:-1].reset_index(drop=True)
df_routes = df.iloc[:1].reset_index(drop=True)

# Extract coordinates for routes
def extract_coordinates(wkt):
    coords = wkt.replace("LINESTRING Z (", "").replace(")", "")
    points = coords.split(", ")
    return [(float(point.split()[0]), float(point.split()[1])) for point in points]

df_routes["coordinates"] = df_routes["WKT"].apply(extract_coordinates)
df_routes_exploded = df_routes.explode("coordinates", ignore_index=True)
df_routes_exploded[["longitude", "latitude"]] = pd.DataFrame(
    df_routes_exploded["coordinates"].tolist(), index=df_routes_exploded.index
)
routes_result = df_routes_exploded[["latitude", "longitude"]]
routes_result.to_csv("data/route.csv", index=False)

# Extract coordinates for locations
def extract_coordinates_point(wkt):
    coords = wkt.replace("POINT Z (", "").replace(")", "")
    longitude, latitude, _ = map(float, coords.split())
    return longitude, latitude

df_locations[["longitude", "latitude"]] = df_locations["WKT"].apply(
    extract_coordinates_point
).apply(pd.Series)

# Rename the original "name" column to "address"
df_locations.rename(columns={"name": "address"}, inplace=True)

# Generate random names
def generate_random_name():
    first_names = ["Alice", "João", "Caio", "Gabriela", "Beatriz", "Miguel"]
    last_names = ["Silva", "Ferreira", "Garcia", "Santos", "Oliveira", "Pereira"]
    return f"{random.choice(first_names)} {random.choice(last_names)}"

df_locations["name"] = [generate_random_name() for _ in range(len(df_locations))]

# Generate random phone numbers
def generate_random_phone():
    return f"(21) {random.randint(90000, 99999)}-{random.randint(1000, 9999)}"

df_locations["phone"] = [generate_random_phone() for _ in range(len(df_locations))]
df_locations["status"] = "Aguardando entrega"

# Final output
locations_result = df_locations[["address", "name", "phone", "latitude", "longitude", "status"]]
locations_result.to_csv("data/locations.csv", index=False)
