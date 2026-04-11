from django.contrib.auth.models import Group, User
from django.conf import settings
from rest_framework import serializers
from .models import Item, CartItem


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class ItemSerializer(serializers.ModelSerializer):
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Item
        fields = ['id', 'title', 'description', 'price', 'image', 'image_url', 'seller', 'seller_username', 'date_added', 'status', 'sold_count']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url

        default_path = settings.MEDIA_URL + 'item_images/Add image.jpg'
        if request:
            return request.build_absolute_uri(default_path)
        return default_path


class CartItemSerializer(serializers.ModelSerializer):
    buyer_username = serializers.CharField(source='buyer.username', read_only=True)
    item_title = serializers.CharField(source='item.title', read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'buyer', 'buyer_username', 'item', 'item_title']
