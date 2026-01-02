from rest_framework import serializers

from chat_app.models import Chat, ChatMessage

class ChatSerializers(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"
        
# class ChatMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ChatMessage
#         fields = ["id","role","content","created_at"]

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["role","content"]
        
