
# 🎨 Promptify Frontend – React (Vite)

This is the frontend for **Promptify**, built using **React 19** and **Vite**,  
featuring a modern UI, Light/Dark mode toggle, and seamless backend integration.

---

## ⚙️ Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- TanStack React Query
- Tailwind CSS
- Radix UI
- shadcn/ui
- Lucide Icons

---

## 🌗 UI Features

- Light & Dark theme toggle
- Responsive design
- Clean chat interface
- Smooth user experience

---

## 🔑 Environment Variables

Create a `.env` file inside the `frontend/` directory:

VITE_API_BASE_URL = https://full-stack-chat-gpt-app.vercel.app/

## Setup Instructions

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

## Project Structure

src/
├── components/   # Reusable UI components
├── pages/        # Page-level components
├── hooks/        # Custom React hooks
├── lib/          # API helpers & axios config
└── index.css     # Global styles

## 🔗 API Integration

Axios for HTTP requests
React Query for caching & state management
JWT token attached to requests
Fully decoupled backend communication

## 🚀 Deployment

Hosted on Vercel
Optimized Vite production build
Environment-based API configuration
Secure CORS-enabled backend communication

