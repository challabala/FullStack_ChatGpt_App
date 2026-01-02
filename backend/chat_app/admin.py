from django.contrib import admin
from .models import Chat, ChatMessage, CustomUser
from django.contrib.auth.admin import UserAdmin

# Register your models here.

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email","username")


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    model = Chat
    list_display = ("id","title","created_at")
    

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    models = ChatMessage
    list_display = ("id","role","content","created_at")