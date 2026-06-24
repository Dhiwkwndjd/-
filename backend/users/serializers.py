from rest_framework import serializers
from .models import CustomerUser


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
    class Meta:
        model = CustomerUser
        fields = [
            "id",
            "username",
            "email",
            "phone_number",
        ]