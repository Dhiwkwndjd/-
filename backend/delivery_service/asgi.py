import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "delivery_service.settings",
)

from django.core.asgi import get_asgi_application

django_asgi_app = get_asgi_application()


from channels.routing import ProtocolTypeRouter, URLRouter
from core.jwt_middleware import JwtAuthMiddleware
import core.routing

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": JwtAuthMiddleware(
            URLRouter(core.routing.websocket_urlpatterns)
        ),
    }
)