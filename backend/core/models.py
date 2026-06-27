from django.db import models
from django.conf import settings
from datetime import time
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import CustomerUser

class Trip(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="trips")
    departure_city = models.CharField(max_length=100)
    destination_city = models.CharField(max_length=100)
    trip_date = models.DateField()
    trip_time = models.TimeField(default=time(12, 0))
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    description = models.TextField(blank=True)
    total_seats = models.PositiveIntegerField(default=3)
    free_seats = models.PositiveIntegerField(default=3)
    is_finished = models.BooleanField(default=False)
    class Meta:
        ordering = ["trip_date", "trip_time"]

    def __str__(self):
        return f"{self.departure_city} -> {self.destination_city}"


class DeliveryRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pickup_city = models.CharField(max_length=100)
    delivery_city = models.CharField(max_length=100)
    package_description = models.TextField()
    delivery_date = models.DateField()
    def __str__(self):
        return f"{self.pickup_city} → {self.delivery_city}"


class Booking(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="bookings")
    seats = models.PositiveIntegerField(default=1)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "trip"],
                name="unique_trip_booking"
            )
        ]

    def __str__(self):
        return f"{self.user.username} | {self.trip}"


class TripChatMessage(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="chat_messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender.username}: {self.message[:25]}"
    


class Rating(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="ratings")
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="given_ratings")
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_ratings")
    stars = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("trip", "from_user")

    def __str__(self):
        return f"{self.from_user} → {self.to_user} ({self.stars})"
    

class ChatTyping(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomerUser, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)