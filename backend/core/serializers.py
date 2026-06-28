from rest_framework import serializers
from .models import Trip, DeliveryRequest, Booking, TripChatMessage, Rating

class TripSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source="user.username", read_only=True)
    owner_username = serializers.CharField(source="user.username", read_only=True)
    owner_id = serializers.IntegerField(source="user.id", read_only=True)
    owner_phone = serializers.CharField(source="user.phone_number", read_only=True)

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Цена не может быть отрицательной"
            )
        return value

    class Meta:
        model = Trip
        fields = "__all__"
        read_only_fields = [
            "user",
            "owner",
            "owner_username",
            "owner_id",
            "owner_phone",
            "free_seats",
        ]

class DeliveryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryRequest
        fields = '__all__'
        read_only_fields = ['user']

class BookingSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source="trip.user.username", read_only=True)
    driver_phone = serializers.CharField(source="trip.user.phone_number", read_only=True)
    departure_city = serializers.CharField(source="trip.departure_city", read_only=True)
    destination_city = serializers.CharField(source="trip.destination_city", read_only=True)
    trip_date = serializers.DateField(source="trip.trip_date", read_only=True)
    trip_time = serializers.TimeField(source="trip.trip_time", read_only=True)
    price = serializers.DecimalField(source="trip.price", max_digits=10, decimal_places=2, read_only=True)
    is_finished = serializers.BooleanField(source="trip.is_finished", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "trip",
            "seats",
            "driver_name",
            "driver_phone",
            "departure_city",
            "destination_city",
            "trip_date",
            "trip_time",
            "price",
            "is_finished"
        ]

        read_only_fields = fields


class TripChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="sender.username", read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = TripChatMessage
        fields = [
            "id",
            "trip",
            "sender",
            "username",
            "message",
            "created_at"
        ]

        read_only_fields = ["trip", "sender", "created_at"]

class RatingSerializer(serializers.ModelSerializer):
    from_username = serializers.CharField(source="from_user.username", read_only=True)

    class Meta:
        model = Rating
        fields = [
            "id",
            "trip",
            "from_user",
            "from_username",
            "to_user",
            "stars",
            "comment",
            "created_at"
        ]

        read_only_fields = [
            "trip",
            "from_user",
            "to_user",
            "created_at"
        ]