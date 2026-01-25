# Nexus AI Interviewer 🤖💼

> *Master your technical interviews with an adaptive, context-aware AI opponent.*

<div align="center">
  <img width="1914" height="951" alt="image" src="https://github.com/user-attachments/assets/072dc78e-a766-4b08-9429-2df0645c3825" />

</div>

<div align="center">
  <br />
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  </a>
  <a href="https://ai.google.dev/">
    <img src="https://img.shields.io/badge/Gemini-3.0_Flash-8E75B2?style=for-the-badge&logo=google" alt="Gemini AI" />
  </a>
  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-v18-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  </a>
  <a href="https://expressjs.com/">
    <img src="https://img.shields.io/badge/Express.js-v4-000000?style=for-the-badge&logo=express" alt="Express.js" />
  </a>
</div>

## 💡 Inspiration

Technical interviews are daunting. Most candidates struggle not with knowledge, but with articulation and pressure handling. Existing mock interview platforms are either static, expensive, or lack realistic conversational flow. 

**Nexus AI** bridges this gap by leveraging the latest **Gemini 3.0** models to create a hyper-realistic, voice-enabled interview simulation that adapts to your specific resume and difficulty level.

## 🚀 Key Features

- **🧠 Adaptive AI Persona**: "Alex", the interviewer, isn't just a chatbot. He adapts his tone, follow-up questions, and pressure based on your responses.
- **🗣️ Voice-First Interaction**: Full speech-to-text and text-to-speech integration for a realistic "out loud" interview experience.
- **📄 Resume Context**: Paste your resume or job description, and the AI generates tailored questions relevant to your actual target role.
- **📊 Detailed Analytics**: Get a comprehensive post-interview report card grading you on:
    - Technical Accuracy
    - Communication Clarity
    - Culture Fit
- **🕸️ Full-Stack Architecture**: A modern Microservices-ready architecture with a **Next.js Frontend** and a robust **Node.js/Express Backend**.

## 🛠️ How it's Built

This project was built for the Hackathon using a modern, scalable stack:

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion (for fluid animations).
- **UI Components**: Shadcn/UI for a premium, accessible design system.
- **Backend**: Node.js & Express (Separate Service).
- **AI Engine**: Google Gemini 1.5 Flash / 3.0 Flash Preview via the Google GenAI SDK.
- **Database**: MongoDB Atlas (Mongoose ODM) for storing session history and analytics.
- **Deployment**: Dockerized for easy deployment to Vercel or Render.

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key
- A MongoDB Connection String

### Installation

#### 1. Backend Setup
```bash
cd ai-interviewer/server
npm install
# Create .env file with MONGO_URI, API_KEY, PORT=5000
npm start
```

#### 2. Frontend Setup
```bash
cd ai-interviewer/frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for a detailed step-by-step guide on deploying both the Frontend and Backend.

**Quick Links:**
- [Backend Deployment (Render)](DEPLOYMENT.md#backend-deployment-rendercom)
- [Frontend Deployment (Vercel)](DEPLOYMENT.md#frontend-deployment-vercel)
- [Docker Deployment](DEPLOYMENT.md#docker-deployment-optional)

## 👥 Team

- **Sahil Deore** - *Full Stack Developer*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
