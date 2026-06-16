from django.urls import path
from .views import TripApiView, DeliveryRequestApiView, TripDetailApiView

urlpatterns = [
    path('trips/', TripApiView.as_view()),
    path("trips/<int:pk>/", TripDetailApiView.as_view()),
    path('requests/', DeliveryRequestApiView.as_view()),
]