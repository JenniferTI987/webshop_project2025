# urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),  # make sure store/urls.py exists
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
