from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomerUser(AbstractUser):
    phone_number = models.CharField(
        max_length=40,
        blank=True,
        null=True
    )

    ROLE_CHOICES = [("driver", "Водитель"), ("passenger", "Пассажир")]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="passenger")
    bio = models.TextField(blank=True, default="")