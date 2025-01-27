import csv
import time

from django.core.management.base import BaseCommand
from leafletjs_maps.models import Route



class Command(BaseCommand):
    help = 'Cria objetos no modelo Route a partir de um arquivo CSV'

    def handle(self, *args, **options):
        print("Deletando rotas anteriores")
        Route.objects.all().delete()

        with open('data/route.csv', 'r') as f:
            reader = csv.reader(f)
            next(reader)  # pula o header
            for row in reader:
                route = Route(
                    latitude=float(row[0]),
                    longitude=float(row[1]),
                )
                route.save()
                time.sleep(.1)
                print("Adicionando coordenada:", row[0], row[1])
        self.stdout.write(self.style.SUCCESS('Rotas finalizada com sucesso.'))