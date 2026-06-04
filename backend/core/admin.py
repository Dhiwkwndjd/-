from django.contrib import admin
from .models import Trip, DeliveryRequest


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = (
        "departure_city",
        "destination_city",
        "trip_date",
        "user",
    )


@admin.register(DeliveryRequest)
class DeliveryRequestAdmin(admin.ModelAdmin):
    list_display = (
        "pickup_city",
        "delivery_city",
        "delivery_date",
        "user",
    )