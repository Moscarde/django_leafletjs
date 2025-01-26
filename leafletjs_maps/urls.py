from django.urls import path, include
from .views import index, route_coordinates

urlpatterns = [
    path("", index, name="index"),
    path("route-coordinates", route_coordinates, name="route_coordinates"),
]