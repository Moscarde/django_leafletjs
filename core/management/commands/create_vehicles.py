import random
from django.core.management.base import BaseCommand
from core.models import Vehicle

class Command(BaseCommand):
    help = 'Generates vehicle objects in the database'

    def handle(self, *args, **options):
        NUM_VEHICLES_TO_GENERATE = 5
        for _ in range(NUM_VEHICLES_TO_GENERATE):
            # -22.913755052155462, -43.22928637460225
            Vehicle.objects.create(
                latitude=random.uniform(-22.82,-22.92),
                longitude=random.uniform(-43.31,-43.21)
            )

        print(f"{Vehicle.objects.count()} vehicles now in the database")