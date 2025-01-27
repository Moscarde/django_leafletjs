from django.db import models

# Create your models here.
class Route(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

class Location(models.Model):
    address = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    status = models.CharField(max_length=255, default="Aguardando entrega")
    latitude = models.FloatField()
    longitude = models.FloatField()