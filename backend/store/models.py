from django.db import models
from django.contrib.auth.models import User

class Item(models.Model):
    STATUS_CHOICES = [
        ("onsale", "On Sale"),
        ("sold", "Sold")
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    seller = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="onsale")
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CartItem(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.buyer.username} - {self.item.title}"