from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .serializers import CustomerUserSerializer, ProfileSerializer
from django.db.models import Avg
from core.models import Rating


class UserApiView(APIView):

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        serializer = CustomerUserSerializer(request.user)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = CustomerUserSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = serializer.save()
            token = RefreshToken.for_user(user)

            return Response(
                {
                    "user": serializer.data,
                    "access": str(token.access_token),
                    "refresh": str(token),
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class ProfileApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        data = serializer.data
        rating = Rating.objects.filter(to_user=request.user).aggregate(average=Avg("stars"))
        data["rating"] = (round(rating["average"], 1)
            if rating["average"] is not None
                else 0
        )

        data["ratings_count"] = Rating.objects.filter(to_user=request.user).count()

        return Response(data)

    def put(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data)

        return Response(serializer.errors, status=400)