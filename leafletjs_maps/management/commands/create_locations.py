import csv

from django.core.management.base import BaseCommand
from leafletjs_maps.models import Location


class Command(BaseCommand):
    help = 'Cria objetos no modelo Locations a partir de um arquivo CSV'

    def handle(self, *args, **options):
        with open('data/locations.csv', 'r') as f:
            reader = csv.reader(f)
            next(reader)  # pula o header
            for row in reader:
                location = Location(
                    address=row[0],
                    name=row[1],
                    phone=row[2],
                    latitude=float(row[3]),
                    longitude=float(row[4]),
                    status=row[5],
                )
                location.save()
        self.stdout.write(self.style.SUCCESS('Locations criados com sucesso.'))
