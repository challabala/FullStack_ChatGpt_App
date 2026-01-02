from django.urls import path
from . import views 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("get_user_chats/", views.get_user_chats, name="get_user_chats"),
    path("prompt_gpt/", views.prompt_gpt, name="prompt_gpt"),
    path("get_chat_messages/<str:pk>/", views.get_chat_messages, name="get_chat_messages"),
    path("delete_chat/<str:pk>/", views.delete_chat, name="delete_chat"),
    path("hello/", views.hello),
]