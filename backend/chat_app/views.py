import os
import uuid
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from openai import OpenAI
from dotenv import load_dotenv
from chat_app.serializers import ChatMessageSerializer, ChatSerializers
from chat_app.models import Chat, ChatMessage, CustomUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse

load_dotenv()

def hello(req):
    return HttpResponse("Hello Api Is Working")


def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def createChatTitle(user_message: str) -> str:
    try:
        client = get_client()
        response = client.responses.create(
            model="gpt-5-nano",
            input=[
                {
                    "role": "system",
                    "content": "Give a short descriptive title in not more than 5 words."
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )
        return response.output_text.strip()
    except Exception:
        return user_message[:50]


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'username': self.user.username,
            'email': self.user.email,
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.create_user(username=username, email=email, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "username": user.username,
            "email": user.email
        }
    }, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def prompt_gpt(request):
    chat_id = request.data.get("chat_id")
    content = request.data.get("content")

    if not content:
        return Response(
            {"error": "No prompt was provided."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ UUID SAFE HANDLING
    try:
        chat_uuid = uuid.UUID(chat_id) if chat_id else uuid.uuid4()
    except ValueError:
        chat_uuid = uuid.uuid4()

    chat, created = Chat.objects.get_or_create(id=chat_uuid, defaults={'user': request.user})

    if not created and chat.user != request.user:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

    if created or not chat.title:
        chat.title = createChatTitle(content)
        chat.save()

    ChatMessage.objects.create(
        role="user",
        chat=chat,
        content=content
    )

    # last 10 messages, oldest → newest
    chat_messages = chat.messages.order_by("-created_at")[:10][::-1]

    openai_messages = [
        {"role": msg.role, "content": msg.content}
        for msg in chat_messages
    ]

    openai_messages.insert(
        0,
        {"role": "system", "content": "You are a helpful assistant."}
    )

    try:
        client = get_client()
        response = client.responses.create(
            model="gpt-5-nano",
            input=openai_messages
        )
        openai_reply = response.output_text
    except Exception as e:
        return Response(
            {"error": f"OpenAI error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    ChatMessage.objects.create(
        role="assistant",
        chat=chat,
        content=openai_reply
    )

    return Response(
        {
            "chat_id": str(chat.id),
            "reply": openai_reply
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(req, pk):
    try:
        chat = Chat.objects.get(id=pk, user=req.user)
    except Chat.DoesNotExist:
        return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)
    
    chatmessages = chat.messages.all()
    serializer = ChatMessageSerializer(chatmessages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_chats(request):
    search_query = request.query_params.get("search", "")
    chats = request.user.chats.all().order_by("-created_at")

    if search_query:
        chats = chats.filter(title__icontains=search_query)

    serializer = ChatSerializers(chats, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat(request, pk):
    try:
        chat = Chat.objects.get(id=pk, user=request.user)
        chat.delete()
        return Response({"message": "Chat deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Chat.DoesNotExist:
        return Response({"error": "Chat not found"}, status=status.HTTP_404_NOT_FOUND)