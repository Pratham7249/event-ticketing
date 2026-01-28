# 🚀 Render-Only MERN Deployment Guide

Deploy both your Frontend and Backend on Render.com.

## Phase 1: Push Changes (Do this first!)
I have updated `server.js` to allow CORS connections from any `.onrender.com` domain.
```bash
git add .
git commit -m "Allow Render CORS"
git push origin main
```

---

## Phase 2: Deploy Backend (Web Service)
1.  Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Web Service**.
2.  Connect your repo.
3.  **Settings:**
    *   **Root Directory:** `server`
    *   **Name:** `event-api` (example)
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
4.  **Environment Variables:**
    *   `MONGO_URI`: (Your MongoDB Atlas connection string)
    *   `JWT_SECRET`: `supersecret123`
5.  **Create Service**.
6.  **Copy the URL** once live (e.g., `https://event-api.onrender.com`).

---

## Phase 3: Deploy Frontend (Static Site)
1.  Go to **New +** -> **Static Site**.
2.  Connect your repo.
3.  **Settings:**
    *   **Root Directory:** `client`
    *   **Name:** `event-client` (example)
    *   **Build Command:** `npm run build`
    *   **Publish Directory:** `dist`
4.  **Environment Variables:**
    *   `VITE_API_BASE_URL`: `https://event-api.onrender.com/api` (The Backend URL you copied + `/api`).
5.  **Rewrite Rules (Critical for React Router):**
    *   Go to the **Redirects/Rewrites** tab in your new Static Site settings.
    *   Add a new rule:
        *   **Source:** `/*`
        *   **Destination:** `/index.html`
        *   **Action:** `Rewrite`
    *   Save changes.
    
---

## ✅ Final Verification
1.  Open your Frontend URL (e.g., `https://event-client.onrender.com`).
2.  The app should load.
3.  Refresh the page on a route like `/login`. If the Rewrite rule worked, you won't see a 404.
4.   Register a user. If CORS worked, the request will succeed.
