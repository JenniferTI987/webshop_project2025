from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # root URL
    path('populate/', views.populate_db, name='populate_db'),
    path('items/', views.get_items, name='get_items'),
    path('create-item/', views.create_item, name='create_item'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('pay/', views.pay, name='pay'),
]
