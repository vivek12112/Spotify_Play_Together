# music_controller/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Handles all URLs starting with /api/
    path('api/', include('api.urls')),

    # Forwards all other URLs to the frontend app
    path('', include('frontend.urls')),
    path('spotify/', include('spotify.urls')),
]