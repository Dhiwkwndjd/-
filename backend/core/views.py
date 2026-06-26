from .models import Trip, DeliveryRequest,  Booking, Comment
from .serializers import TripSerializer, DeliveryRequestSerializer, BookingSerializer, CommentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

class TripApiView(APIView):
    def get(self, request):
        return Response(TripSerializer(Trip.objects.filter(is_finished=False), many=True).data)

    def post(self, request):
        if request.user.role != "driver":
            return Response({"error": "Только водитель может создавать поездки"}, status=403)
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class MyTripsApiView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request):
        return Response(TripSerializer(Trip.objects.filter(user=request.user), many=True).data)


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
    permission_classes=[IsAuthenticated]

    def post(self, request):
        trip = get_object_or_404(Trip, id=request.data.get("trip_id"))

        if trip.free_seats <= 0:
            return Response({"error": "Нет свободных мест"}, status=400)

        booking = Booking.objects.create(user=request.user, trip=trip, seats=1)
        trip.free_seats -= 1
        trip.save()

        return Response(BookingSerializer(booking).data, status=201)


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
    def get(self, request, pk):
        return Response(TripSerializer(get_object_or_404(Trip, pk=pk)).data)

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
        trip=get_object_or_404(Trip,pk=pk)
        if trip.user != request.user or request.user.role != "driver":
            return Response({"error":"Нет доступа"}, status=403)
        trip.delete()
        return Response(status=204)


class TripCommentsApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        comments = Comment.objects.filter(trip_id=pk).order_by("created_at")
        return Response(CommentSerializer(comments, many=True).data)

    def post(self, request, pk):
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save( user=request.user, trip_id=pk)
            return Response(serializer.data, status=201)

        print("ERRORS:", serializer.errors)

        return Response(
            serializer.errors,
            status=400
        )