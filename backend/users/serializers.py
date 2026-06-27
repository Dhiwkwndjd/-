from rest_framework import serializers
from .models import CustomerUser
from django.db.models import Avg


class CustomerUserSerializer(serializers.ModelSerializer):
    password_2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomerUser
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "role",
            "bio",
            "password",
            "password_2"
        ]
        

        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, attrs):
        if attrs["password"] != attrs["password_2"]:
            raise serializers.ValidationError(
                {"message": "Пароли не совпадают"}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_2")

        password = validated_data.pop("password")

        user = CustomerUser(**validated_data)
        user.set_password(password)
        user.save()

        return user
    
    

class ProfileSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    ratings_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomerUser
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
            "role",
            "bio",
            "average_rating",
            "ratings_count",
        ]

    def get_average_rating(self, obj):
        if obj.role != "driver":
            return None

        ratings = obj.received_ratings.all()

        if not ratings.exists():
            return 0

        return round(
            ratings.aggregate(Avg("stars"))["stars__avg"],
            1,
        )

    def get_ratings_count(self, obj):
        if obj.role != "driver":
            return 0

        return obj.received_ratings.count()
