from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'items', views.ItemViewSet)
router.register(r'cart-items', views.CartItemViewSet)

urlpatterns = [
    path('', views.home, name='home'),  # root URL
    path('populate/', views.populate_db, name='populate_db'),
    path('get-items/', views.get_items, name='get_items'),
    path('create-item/', views.create_item, name='create_item'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('pay/', views.pay, name='pay'),
    path('api/', include(router.urls)),
]
