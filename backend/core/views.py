from django.shortcuts import render
from .models import Trip, DeliveryRequest
from .serializers import TripSerializer, DeliveryRequestSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class TripApiView(APIView):

    def get(self, request):
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)

        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = TripSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            data=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class DeliveryRequestApiView(APIView):

    def get(self, request):
        requests = DeliveryRequest.objects.all()
        serializer = DeliveryRequestSerializer(requests, many=True)

        return Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = DeliveryRequestSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            data=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )