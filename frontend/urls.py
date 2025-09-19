# frontend/urls.py
from django.urls import re_path # Note: We use re_path here
from .views import index
from django.urls import path
urlpatterns = [
    path("",index),
    path("join",index),
    path("create",index),
    path('room/<str:roomCode>',index)
]