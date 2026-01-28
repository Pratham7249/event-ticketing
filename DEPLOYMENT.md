# 🚀 MERN Stack Deployment Guide (Render + Vercel)

Follow these steps exactly to deploy your Ticket Management App.

## Phase 1: Code Configuration (Already Done ✅)

I have automatically applied the following changes to your codebase:
1.  **Backend CORS:** Updated `server.js` to allow requests from your future Vercel domain.
2.  **Frontend API:** Created `client/src/api.js` to automatically switch between `localhost` and production URLs using `import.meta.env`.
3.  **Vercel Routing:** Created `client/vercel.json` to handle React Router 404 errors on refresh.

### ⚠️ IMPORTANT: Push Changes First
Before starting, run these commands in your terminal to save the configuration changes:
```bash
git add .
git commit -m "Config for deployment: CORS, API helper, vercel.json"
git push origin main
```

---

## Phase 2: Platform Instructions

### 1️⃣ Backend Deployment (Render)
1.  Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2.  Connect your GitHub repo (`event-ticketing`).
3.  **Root Directory:** `server` (Critical!)
4.  **Name:** `event-ticketing-api` (or similar)
5.  **Environment:** `Node`
6.  **Build Command:** `npm install`
7.  **Start Command:** `node server.js`
8.  **Free Instance:** Yes
9.  Click **Create Web Service**.

**Wait for it to deploy.** Once live, copy the URL (e.g., `https://event-ticketing-api.onrender.com`). You will need this for the Frontend setup.

### 2️⃣ Frontend Deployment (Vercel)
1.  Go to [vercel.com/new](https://vercel.com/new).
2.  Import your GitHub repo (`event-ticketing`).
3.  **Root Directory:** Click "Edit" and select `client`. (Critical!)
4.  **Framework Preset:** Vite (should detect automatically).
5.  **Environment Variables:**
    *   **Key:** `VITE_API_BASE_URL`
    *   **Value:** `https://your-app-name.onrender.com/api` (The URL you copied from Render + `/api` at the end).
6.  Click **Deploy**.

---

## Phase 3: Environment Variables (Checklist)

### 🌍 Render (Backend)
Go to **Settings** -> **Environment Variables** in Render and add:

| Key | Value |
| :--- | :--- |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster.mongodb.net/events_db` (Your Atlas URI) |
| `JWT_SECRET` | `supersecretkey123` (Or any long random string) |
| `PORT` | `5005` (Optional, Render sets this automatically) |

*Note: If you don't have a MongoDB Atlas URI yet, the app will try to run in "In-Memory" mode, but data will vanish on restart. For production, **MongoDB Atlas is highly recommended**.*

### 🌍 Vercel (Frontend)
(Set during creation, but you can add later in Settings -> Environment Variables)

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://<your-render-app>.onrender.com/api` |

---

## ✅ Final Check
1.  Open your **Vercel URL** (e.g., `https://event-ticketing-client.vercel.app`).
2.  Try to **Login/Register**.
3.  If you get a "Network Error", check:
    *   Did you add the Vercel URL to `allowedOrigins` in `server/server.js`? (I added a wildcard for `vercel.app`, so it should work).
    *   Is the Render backend "Live"?
    *   Did you add `/api` to the end of `VITE_API_BASE_URL` in Vercel?
