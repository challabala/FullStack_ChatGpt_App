# Deployment Guide

## 1. Backend Deployment (Render)

We have prepared the backend for deployment on Render using a Blueprint file (`render.yaml`).

1.  **Push Changes**: Commit and push the latest changes (including `render.yaml`, `runtime.txt`, and updated `settings.py`) to your GitHub repository.
2.  **Render Dashboard**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** and select **Blueprint**.
    *   Connect your GitHub repository.
    *   It will automatically detect the `render.yaml` file.
    *   Click **Apply** or **Create Global Service**.
3.  **Get Backend URL**:
    *   Once the deployment finishes, copy the service URL (e.g., `https://fullstack-chat-backend.onrender.com`).

## 2. Frontend Configuration (Vercel)

Your frontend is already on Vercel, but it needs to know where the backend is.

1.  **Vercel Dashboard**:
    *   Go to your project settings on Vercel.
    *   Navigate to **Environment Variables**.
2.  **Add Variable**:
    *   **Key**: `VITE_API_URL`
    *   **Value**: Paste your Render Backend URL (e.g., `https://fullstack-chat-backend.onrender.com`).
    *   *Note: Ensure there is no trailing slash if your code adds slashes efficiently, but usually `https://...` is fine.*
3.  **Redeploy**:
    *   Go to **Deployments** and redeploy the latest commit (or trigger a new build) so the environment variable takes effect.

## 3. Verification

1.  Open your frontend URL: `https://full-stack-chat-gpt-app.vercel.app/`
2.  Try to **Register** a new user.
3.  If successful, log in and check the chat functionality.
