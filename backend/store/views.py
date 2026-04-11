from rest_framework.decorators import action, api_view, renderer_classes
from rest_framework.response import Response
from django.contrib.auth.models import Group, User
from .models import Item, CartItem
import random
from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from rest_framework import permissions, viewsets
from .serializers import GroupSerializer, UserSerializer, ItemSerializer, CartItemSerializer

class UserViewSet (viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited
    """
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    

class GroupViewSet (viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    permission_classes = [permissions.AllowAny]


class ItemViewSet (viewsets.ModelViewSet):
    """
    API endpoint that allows items to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def most_sold(self, request):
        most_sold_items = Item.objects.filter(status='onsale').order_by('-sold_count')[:10]
        serializer = self.get_serializer(most_sold_items, many=True)
        return Response(serializer.data)


class CartItemViewSet (viewsets.ModelViewSet):
    """
    API endpoint that allows cart items to be viewed or edited.
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.AllowAny]


def home(request):
    return HttpResponse("Welcome to the Web shop!")

@api_view(['GET'])
@renderer_classes([JSONRenderer])
def populate_db(request):
    User.objects.all().delete()
    Item.objects.all().delete()

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

    return Response({"message": "Database populated"})



@api_view(['GET'])
def get_items(request):

    items = Item.objects.filter(status="onsale")

    data = []

    for item in items:
        data.append({
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "price": item.price,
            "date_added": item.date_added,
            "seller": item.seller.username
        })

    return Response(data)


@api_view(['POST'])
def create_item(request):

    user = User.objects.get(id=request.data["user_id"])

    item = Item.objects.create(
        title=request.data["title"],
        description=request.data["description"],
        price=request.data["price"],
        seller=user
    )

    return Response({"message": "Item created"})


@api_view(['POST'])
def add_to_cart(request):

    user = User.objects.get(id=request.data["user_id"])
    item = Item.objects.get(id=request.data["item_id"])

    if item.seller == user:
        return Response({"error": "You cannot buy your own item"})

    CartItem.objects.create(
        buyer=user,
        item=item
    )

    return Response({"message": "Added to cart"})


@api_view(['POST'])
def pay(request):

    user = User.objects.get(id=request.data["user_id"])

    cart = CartItem.objects.filter(buyer=user)

    for cart_item in cart:

        item = cart_item.item

        if item.status != "onsale":
            return Response({"error": f"{item.title} is no longer available"})

    for cart_item in cart:

        item = cart_item.item
        item.status = "sold"
        item.save()

    cart.delete()

    return Response({"message": "Payment successful"})
