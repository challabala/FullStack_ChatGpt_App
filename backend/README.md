# 🧠 Promptify Backend – Django REST API

This is the backend service for **Promptify**, built using  
**Django REST Framework** and powered by **OpenAI**.

---

## ⚙️ Tech Stack

- Django (>= 5.0)
- Django REST Framework
- SimpleJWT (Authentication)
- PostgreSQL (Render)
- OpenAI API
- Gunicorn
- WhiteNoise
- django-cors-headers
- dj-database-url

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` directory:

SECRET_KEY=your_django_secret_key
DEBUG=False
DATABASE_URL=postgresql://user:password@host:5432/dbname
OPENAI_API_KEY=your_openai_api_key
ALLOWED_HOSTS=your-backend-domain

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver


## API Endpoints

Method	       Endpoint	                            Description
POST	       /api/register/	                    Register new user
POST	       /api/login/	                        Login (JWT)
POST	       /api/token/refresh/	                Refresh JWT token
GET	           /api/get_user_chats/                 Get all user chats
POST	       /api/prompt_gpt/	                    Send message to AI
GET	           /api/get_chat_messages/<chat_id>/	Get chat messages
DELETE	       /api/delete_chat/<chat_id>/	        Delete chat

## 🔐 Authentication Flow

User logs in and receives Access & Refresh tokens
Access token must be sent with every protected request:
Authorization: Bearer <access_token>
Refresh token is used when the access token expires

## 🧠 Key Design Decisions

Custom CustomUser model for flexibility
Stateless JWT authentication
CSRF-exempt JWT login
Clean REST API architecture
PostgreSQL for production stability
Scalable deployment on Render

## 🚀 Deployment

Hosted on Render
Gunicorn used as WSGI server
PostgreSQL database hosted on Render
Environment variables used for secrets



