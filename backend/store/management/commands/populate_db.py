from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Item
import random

class Command(BaseCommand):
    help = 'Populate the database with test data'

    def handle(self, *args, **options):
        # Check if test users already exist to avoid duplicates
        if User.objects.filter(username="testuser1").exists():
            self.stdout.write(self.style.WARNING('Database already populated, skipping...'))
            return

        users = []
        for i in range(1, 7):
            user = User.objects.create_user(
                username=f"testuser{i}",
                password=f"pass{i}",
                email=f"testuser{i}@shop.aa"
            )
            users.append(user)

        sellers = users[:3]
        for seller in sellers:
            for i in range(10):
                Item.objects.create(
                    title=f"Item {i} from {seller.username}",
                    description="Test item",
                    price=random.randint(10, 100),
                    seller=seller,
                    status="onsale"
                )

        self.stdout.write(self.style.SUCCESS('Database populated successfully'))
        