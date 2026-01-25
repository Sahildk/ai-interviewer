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
- **🕸️ Full-Stack Architecture**: Built with a production-ready Next.js 15 App Router structure, utilizing Server Actions and API routes for security and speed.

## 🛠️ How it's Built

This project was built for the Hackathon using a modern, scalable stack:

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion (for fluid animations).
- **UI Components**: Shadcn/UI for a premium, accessible design system.
- **Backend**: Next.js API Routes (Serverless functions) handling secure API calls.
- **AI Engine**: Google Gemini 1.5 Flash / 3.0 Flash Preview via the Google GenAI SDK.
- **Database**: MongoDB Atlas (Mongoose ODM) for storing session history and analytics.
- **Deployment**: Dockerized for easy deployment to Vercel or Render.

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key
- A MongoDB Connection String

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sahildk/ai-interviewer.git
    cd ai-interviewer/frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the `frontend` directory:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    MONGO_URI=your_mongodb_connection_string
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Deployment

The project includes a production-ready `Dockerfile`.

**Deploy with Vercel:**
Simply import the repo into Vercel. The `vercel.json` configuration ensures seamless deployment.

**Deploy with Docker:**
```bash
docker build -t nexus-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY=... -e MONGO_URI=... nexus-ai
```

## 👥 Team

- **Sahil Deore** - *Full Stack Developer*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
