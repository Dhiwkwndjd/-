
from django.db import models
from django.conf import settings
from datetime import time

class Trip(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    departure_city = models.CharField(max_length=100)
    destination_city = models.CharField(max_length=100)
    trip_date = models.DateField()
    trip_time = models.TimeField(default=time(12, 0))
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField(blank=True)
    total_seats = models.PositiveIntegerField(default=3)
    free_seats = models.PositiveIntegerField(default=3)
    is_finished = models.BooleanField(default=False)
    def __str__(self):
        return (f"{self.departure_city} -> {self.destination_city}"
    )

class TripComment(models.Model):
    trip=models.ForeignKey(Trip,on_delete=models.CASCADE,related_name="comments")
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    text=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

class DeliveryRequest(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    pickup_city=models.CharField(max_length=100)
    delivery_city=models.CharField(max_length=100)
    package_description=models.TextField()
    delivery_date=models.DateField()

class Booking(models.Model):
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    trip=models.ForeignKey(Trip,on_delete=models.CASCADE,related_name="bookings")
    seats=models.PositiveIntegerField(default=1)
