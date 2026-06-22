from django.db import models
from django.conf import settings


class Trip(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    departure_city = models.CharField(max_length=100)
    destination_city = models.CharField(max_length=100)
    trip_date = models.DateField()
    description = models.TextField(blank=True)
    total_seats = models.PositiveIntegerField(default=3)
    free_seats = models.PositiveIntegerField(default=3)

    def __str__(self):
        return f"{self.departure_city} -> {self.destination_city}"



class DeliveryRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pickup_city = models.CharField(max_length=100)
    delivery_city = models.CharField(max_length=100)
    package_description = models.TextField()
    delivery_date = models.DateField()

    def __str__(self):
        return f"{self.pickup_city} -> {self.delivery_city}"


class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="bookings")
    seats = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("user", "trip")
