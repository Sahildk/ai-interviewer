# Deployment Guide

This guide covers the deployment of the **AI Interviewer** as a proper **Full Stack Application** with separate Frontend and Backend services.

## 📋 Architecture Overview

- **Frontend:** Next.js application (hosted on Vercel).
- **Backend:** Node.js/Express server (hosted on Render).
- **Database:** MongoDB Atlas.

---

## ⚙️ Environment Variables Checklist

### Backend Secrets (for Render)
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | Connection string for MongoDB. |
| `API_KEY` | Google Gemini API Key. |
| `FRONTEND_URL` | Your Vercel frontend URL (e.g. `https://your-app.vercel.app`) — used to restrict CORS. |
| `PORT` | `5000` (Optional/Default). |

### Frontend Secrets (for Vercel)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | The URL of your deployed Backend (e.g., `https://my-api.onrender.com`). |

---

## 🚀 Step 1: Deploy Backend (Render)

We need to deploy the backend first to get the URL for the frontend.

1.  **Push code to GitHub.**
2.  Log in to [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your repository.
5.  **Configuration:**
    -   **Root Directory:** `server`
    -   **Build Command:** `npm install`
    -   **Start Command:** `npm start`
6.  **Environment Variables:**
    -   Add `MONGO_URI`, `API_KEY`, and `FRONTEND_URL` (your Vercel URL from Step 2 — go back and add this after deploying frontend).
7.  **Deploy**.
8.  **Copy the Service URL** (e.g., `https://ai-interviewer-backend.onrender.com`). You will need this for the frontend.

---

## 🌐 Step 2: Deploy Frontend (Vercel)

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your repository.
4.  **Configuration:**
    -   **Framework Preset:** Next.js
    -   **Root Directory:** `frontend`
5.  **Environment Variables:**
    -   Add `NEXT_PUBLIC_API_URL`.
    -   **Value:** Paste the Render Backend URL from Step 1 (e.g., `https://ai-interviewer-backend.onrender.com`).
6.  **Deploy**.

---

## 🐳 Docker Deployment (Optional)

### Backend
```bash
cd server
docker build -t ai-backend .
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e API_KEY="your_key_here" \
  -e FRONTEND_URL="http://localhost:3000" \
  ai-backend
```

### Frontend
```bash
cd frontend
docker build -t ai-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL="http://localhost:5000" ai-frontend
```

