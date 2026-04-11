from django.apps import AppConfig
from django.core.management import call_command
from django.db.models.signals import post_migrate


class StoreConfig(AppConfig):
    name = 'store'

    def ready(self):
        """Auto-populate database after migrations"""
        post_migrate.connect(self.populate_data, sender=self)

    def populate_data(self, sender, **kwargs):
        """Populate database if it's empty"""
        from django.contrib.auth.models import User
        
        # Only populate once when first migrating
        if User.objects.filter(username="testuser1").exists():
            return
        
        try:
            call_command('populate_db', verbosity=0)
        except Exception as e:
            print(f"Error populating database: {e}")
