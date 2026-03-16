from django.shortcuts import render
from rest_framework import response
from rest_framework.decorators import api_view
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List':'/task-list/',
        'Detail View':'/task-detail/<str:pk>/',
        'Create':'/task-create/',
        'Update':'/task-update/<str:pk>/',
        'Delete':'/task-delete/<str:pk>/',
    }
    return response.Response(api_urls)
# Create your views here.
