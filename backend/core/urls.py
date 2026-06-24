from django.urls import path
from .views import TripApiView, DeliveryRequestApiView, TripDetailApiView, FinishTripApiView, MyTripsApiView, BookingApiView, MyBookingsApiView

urlpatterns = [
    path('trips/', TripApiView.as_view()),
    path('trips/<int:pk>/', TripDetailApiView.as_view()),
    path('trips/<int:pk>/finish/', FinishTripApiView.as_view()),
    path('trips/book/', BookingApiView.as_view()),
    path('requests/', DeliveryRequestApiView.as_view()),
    path('my-trips/', MyTripsApiView.as_view()),
    path('my-bookings/', MyBookingsApiView.as_view()),
]