from .models import Trip, DeliveryRequest
from .serializers import TripSerializer, DeliveryRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

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
        print(request.user)
        print(request.user.is_authenticated)

        serializer = TripSerializer(
        data=request.data
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


class TripDetailApiView(APIView):

    def put(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)
        serializer = TripSerializer(
            trip,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )
    
    def get(self, request, pk):
        trip = get_object_or_404(
            Trip,
            pk=pk
        )

        serializer = TripSerializer(trip)

        return Response(serializer.data)

    def delete(self, request, pk):
        trip = get_object_or_404(
            Trip,
            pk=pk
        )
        trip.delete()
        return Response(status=204)