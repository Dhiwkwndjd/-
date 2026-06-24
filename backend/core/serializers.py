from rest_framework import serializers
from .models import Trip, DeliveryRequest, Booking

class TripSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="user.username", read_only=True)
    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Цена не может быть отрицательной")
        return value

    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ['user','owner','free_seats']

class DeliveryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryRequest
        fields = '__all__'
        read_only_fields = ['user']

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['user']

