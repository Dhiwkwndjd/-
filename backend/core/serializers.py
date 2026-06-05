from rest_framework import serializers
from .models import Trip, DeliveryRequest


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


class DeliveryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryRequest
        fields = '__all__'