from django.http import JsonResponse
from django.shortcuts import render

from .models import Location, Route


# Create your views here.
def index(request):
    locations = Location.objects.values(
        "id", "address", "name", "phone", "latitude", "longitude", "status"
    )
    context = {"destinations": list(locations)}
    return render(request, "index.html", context)


def route_coordinates(request):
    return JsonResponse({"route": list(Route.objects.values("latitude", "longitude"))})
