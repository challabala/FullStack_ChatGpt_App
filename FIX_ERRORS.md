# Fixing Deployment Errors

The check revealed a **500 Internal Server Error** during registration. This is caused by the database not being configured or migrated correctly on Render.

## Solution

We have updated `render.yaml` to include a **PostgreSQL Database**. This is required because the default file-based database (SQLite) does not work reliably on Render and loses data on every restart.

### Step 1: Update Render Blueprint

1.  **Commit & Push**: Push the updated `render.yaml` to GitHub.
2.  **Render Dashboard**:
    *   Go to your existing "Blueprint" or "Web Service" in Render.
    *   If you used a Blueprint originally, go to the **Blueprints** tab, select your blueprint, and click **Sync**.
    *   **CRITICAL**: If you created a "Web Service" manually, you should DELETE it and create a **New Blueprint Instance** instead.
        *   Click **New +** -> **Blueprint**.
        *   Select your repository.
        *   It will detect `render.yaml` and verify that it will create a **Database** and a **Web Service**.
        *   Click **Apply**.

### Step 2: Configure Environment Variables

1.  Once the Blueprint is created/synced, go to the **fullstack-chat-backend** service in the Dashboard.
2.  Go to **Environment**.
3.  You will see `OPENAI_API_KEY` listed but empty (or asking for value). **Edit** it and paste your actual OpenAI API Key.
4.  Save changes.

### Step 3: Verify Frontend

1.  Ensure your Frontend Vercel deployment has the correct `VITE_API_URL`.
    *   The user-modified code hardcoded the URL, which is fine for now, but ensure it matches the new service URL if it changed (unlikely/optional).
2.  Register a new user. It should now work because the Postgres database is connected and migrated.
