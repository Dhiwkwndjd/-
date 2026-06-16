from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny # <-- Импортируем AllowAny
from .serializers import CustomerUserSerializer


class UserApiView(APIView):

    def get_permissions(self):
        """
        Динамически управляем правами доступа:
        - Для GET (просмотр данных) нужна авторизация (IsAuthenticated).
        - Для POST (регистрация) доступ открыт всем (AllowAny).
        """
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