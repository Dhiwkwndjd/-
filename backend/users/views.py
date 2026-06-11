from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomerUserSerializer


class UserApiView(APIView):

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"message": "not auth"},
                status=status.HTTP_401_UNAUTHORIZED
            )

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