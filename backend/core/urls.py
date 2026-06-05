from django.urls import path
from .views import TripApiView, DeliveryRequestApiView

urlpatterns = [
    path('trips/', TripApiView.as_view()),
    path('requests/', DeliveryRequestApiView.as_view()),
]