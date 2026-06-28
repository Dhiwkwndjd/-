from .models import Trip, DeliveryRequest,  Booking, TripChatMessage, Rating
from .serializers import (
    TripSerializer, DeliveryRequestSerializer, 
    BookingSerializer, TripChatMessageSerializer, 
    RatingSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import generics
from .pagination import TripPagination

class TripApiView(generics.ListCreateAPIView):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = TripPagination

    def get_queryset(self):
        queryset = Trip.objects.filter(is_finished=False).order_by("-trip_date", "-trip_time").select_related("user")
        departure = self.request.GET.get("departure")
        destination = self.request.GET.get("destination")

        if departure:
            queryset = queryset.filter(departure_city__icontains=departure)

        if destination:
            queryset = queryset.filter(destination_city__icontains=destination)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from django.db.models import Avg

class MyTripsApiView(APIView):
    permission_classes = [IsAuthenticated]

    def serialize_trip(self, trip):
        data = TripSerializer(trip).data
        rating = Rating.objects.filter(trip=trip).aggregate(average=Avg("stars"))

        data["average_rating"] = (
            round(rating["average"], 1)
            if rating["average"] is not None
            else 0
        )

        data["ratings_count"] = Rating.objects.filter(trip=trip).count()

        return data

    def get(self, request):
        active = Trip.objects.filter(user=request.user, is_finished=False).order_by(
            "-trip_date",
            "-trip_time"
        )

        finished = Trip.objects.filter(user=request.user,is_finished=True).order_by(
            "-trip_date",
            "-trip_time"
        )

        return Response({

            "active": [
                self.serialize_trip(trip)
                for trip in active
            ],

            "finished": [
                self.serialize_trip(trip)
                for trip in finished
            ]

        })


class MyBookingsApiView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        bookings = Booking.objects.filter(user=request.user)
        data = []

        for booking in bookings:

            trip = booking.trip

            data.append({
                "booking_id": booking.id,
                "trip_id": trip.id,
                "route": f"{trip.departure_city} -> {trip.destination_city}",
                "trip_date": trip.trip_date,
                "trip_time": trip.trip_time,
                "price": trip.price,
                "driver": trip.user.username,
                "phone": trip.user.phone_number,
                "free_seats": trip.free_seats,
                "total_seats": trip.total_seats,
                "description": trip.description,
                "is_finished": trip.is_finished
            })

        return Response(data)


class BookingApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        trip = get_object_or_404(Trip, id=request.data.get("trip_id"))
        if trip.user == request.user:
            return Response({"error": "Нельзя забронировать свою поездку"}, status=status.HTTP_400_BAD_REQUEST)

        if trip.is_finished:
            return Response({"error": "Поездка уже завершена"}, status=status.HTTP_400_BAD_REQUEST)

        if Booking.objects.filter(user=request.user, trip=trip).exists():
            return Response({"error": "Вы уже забронировали эту поездку"},status=status.HTTP_400_BAD_REQUEST)

        if trip.free_seats <= 0:
            return Response({"error": "Нет свободных мест"},status=status.HTTP_400_BAD_REQUEST)

        booking = Booking.objects.create(user=request.user, trip=trip, seats=1)
        trip.free_seats -= 1
        trip.save(update_fields=["free_seats"])

        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)

class DeliveryRequestApiView(APIView):
    def get(self, request):
        return Response(DeliveryRequestSerializer(DeliveryRequest.objects.all(), many=True).data)

    def post(self, request):
        serializer = DeliveryRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class FinishTripApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        trip = get_object_or_404(
            Trip,
            pk=pk
        )

        if trip.user != request.user:
            return Response(
                {"message": "Это не ваша поездка"},
                status=403
            )

        trip.is_finished = True
        trip.save()

        return Response({"message": "Поездка завершена"})


class TripDetailApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)
        data = TripSerializer(trip).data
        data["is_owner"] = trip.user == request.user
        data["is_booked"] = Booking.objects.filter(trip=trip, user=request.user).exists()
        data["passengers"] = [
            {
                "username": booking.user.username,
                "phone": booking.user.phone_number,
                "seats": booking.seats,
            }
            for booking in trip.bookings.select_related("user")
        ]
        data["is_rated"] = Rating.objects.filter(trip=trip, from_user=request.user).exists()

        return Response(data)

    def put(self, request, pk):
        trip=get_object_or_404(Trip,pk=pk)
        if trip.user != request.user or request.user.role != "driver":
            return Response({"error":"Нет доступа"}, status=403)
        serializer=TripSerializer(trip,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors,status=400)

    def delete(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)
        if trip.user != request.user:
            return Response({"error": "Нет доступа"}, status=403)
        if request.user.role != "driver":
            return Response({"error": "Нет доступа"}, status=403)
        trip.delete()
        return Response(status=204)


class TripChatApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get_trip(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)
        allowed = ( trip.user == request.user or Booking.objects.filter(trip=trip, user=request.user).exists())

        if not allowed:
            return None

        return trip

    def get(self, request, pk):
        trip = self.get_trip(request, pk)
        if trip is None:
            return Response(status=403)

        messages = TripChatMessage.objects.filter(trip=trip).select_related("sender").order_by("created_at")

        serializer = TripChatMessageSerializer(messages, many=True)

        return Response(serializer.data)

    def post(self, request, pk):
        trip = self.get_trip(request, pk)
        if trip is None:
            return Response(status=403)

        serializer = TripChatMessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(sender=request.user, trip=trip)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
class TripRatingApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)

        if trip.user != request.user:
            return Response({"error": "Нет доступа"}, status=403)

        ratings = Rating.objects.filter(trip=trip).select_related("from_user")

        data = []

        for rating in ratings:
            data.append({
                "username": rating.from_user.username,
                "stars": rating.stars,
                "comment": rating.comment,
                "created_at": rating.created_at
            })

        return Response(data)

    def post(self, request, pk):
        trip = get_object_or_404(Trip, pk=pk)

        if not trip.is_finished:
            return Response({"error": "Поездка ещё не завершена."}, status=400)

        booked = Booking.objects.filter(trip=trip, user=request.user).exists()

        if not booked:
            return Response({"error": "Вы не участвовали в поездке."}, status=403)

        if Rating.objects.filter(trip=trip, from_user=request.user).exists():
            return Response({"error": "Вы уже оценили эту поездку."},status=400)

        serializer = RatingSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(trip=trip, from_user=request.user, to_user=trip.user)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    