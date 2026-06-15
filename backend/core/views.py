from .models import Trip, DeliveryRequest
from .serializers import TripSerializer, DeliveryRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated


class TripApiView(APIView):

    def get(self, request):
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"message": "Необходимо войти в систему"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = TripSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeliveryRequestApiView(APIView):

    def get(self, request):
        requests = DeliveryRequest.objects.all()
        serializer = DeliveryRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"message": "Необходимо войти в систему"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = DeliveryRequestSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)