from django.http import JsonResponse
from django.shortcuts import render

from .models import Location, Route


# Create your views here.
def index(request):
    context = {}
    return render(request, "index.html", context)


def route_coordinates(request):
    return JsonResponse({"route": list(Route.objects.values("latitude", "longitude"))})
