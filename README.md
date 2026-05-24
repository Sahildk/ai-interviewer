# <div align="center">Nexus AI Interviewer 🤖💼</div>

<div align="center">
  <em>Master your technical interviews with an adaptive, context-aware AI opponent.</em>
</div>

<br />

<div align="center">
  <img width="100%" alt="Nexus AI Interviewer Demo" src="https://github.com/user-attachments/assets/072dc78e-a766-4b08-9429-2df0645c3825" />
</div>

<br />

<!-- Tech Stack -->
<div align="center">
  <table>
    <tr>
      <td align="center" width="96">
        <a href="https://nextjs.org">
          <img src="https://skillicons.dev/icons?i=nextjs&theme=dark" width="48" height="48" alt="Next.js" />
        </a>
        <br>Next.js
      </td>
      <td align="center" width="96">
        <a href="https://react.dev">
          <img src="https://skillicons.dev/icons?i=react&theme=dark" width="48" height="48" alt="React" />
        </a>
        <br>React
      </td>
      <td align="center" width="96">
        <a href="https://tailwindcss.com">
          <img src="https://skillicons.dev/icons?i=tailwind&theme=dark" width="48" height="48" alt="Tailwind" />
        </a>
        <br>Tailwind
      </td>
      <td align="center" width="96">
        <a href="https://nodejs.org">
          <img src="https://skillicons.dev/icons?i=nodejs&theme=dark" width="48" height="48" alt="Node.js" />
        </a>
        <br>Node.js
      </td>
      <td align="center" width="96">
        <a href="https://expressjs.com">
          <img src="https://skillicons.dev/icons?i=express&theme=dark" width="48" height="48" alt="Express" />
        </a>
        <br>Express
      </td>
      <td align="center" width="96">
        <a href="https://www.mongodb.com">
          <img src="https://skillicons.dev/icons?i=mongodb&theme=dark" width="48" height="48" alt="MongoDB" />
        </a>
        <br>MongoDB
      </td>
      <td align="center" width="96">
        <a href="https://ai.google.dev">
          <img src="https://skillicons.dev/icons?i=gcp&theme=dark" width="48" height="48" alt="Gemini" />
        </a>
        <br>Gemini
      </td>
      <td align="center" width="96">
        <a href="https://www.docker.com">
          <img src="https://skillicons.dev/icons?i=docker&theme=dark" width="48" height="48" alt="Docker" />
        </a>
        <br>Docker
      </td>
    </tr>
  </table>
</div>

<br />

<!-- Deploy Buttons -->
<div align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsahildk%2Fai-interviewer">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
  <a href="https://render.com/deploy">
    <img src="https://img.shields.io/badge/Deploy%20to-Render-46E3B7?style=for-the-badge&logo=render" height="32" alt="Deploy to Render" />
  </a>
</div>

<br />
<br />

<div align="center">
  <h2>💡 Inspiration</h2>
</div>

> Technical interviews are daunting. Most candidates struggle not with knowledge, but with articulation and pressure handling. Existing mock interview platforms are either static, expensive, or lack realistic conversational flow.
> 
> **Nexus AI** bridges this gap by leveraging the latest **Gemini 3.0** models to create a hyper-realistic, voice-enabled interview simulation that adapts to your specific resume and difficulty level.

<br />

---

<div align="center">
  <h2>🚀 Key Features</h2>
</div>

<br />

| Feature | Description |
| :--- | :--- |
| **🧠 Adaptive AI Persona** | "Alex", the interviewer, adapts his tone, follow-up questions, and pressure based on your responses. |
| **🗣️ Voice-First Interaction** | Full speech-to-text and text-to-speech integration for a realistic "out loud" interview experience. |
| **📄 Resume Context** | Paste your resume or job description, and the AI generates tailored questions relevant to your actual target role. |
| **📊 Detailed Analytics** | Get a comprehensive post-interview report card grading you on Technical Accuracy, Communication Clarity, and Culture Fit. |
| **🕸️ Full-Stack Architecture** | A modern Microservices-ready architecture with a **Next.js Frontend** and a robust **Node.js/Express Backend**. |

<br />

---


  <h2>🛠️ How it's Built</h2>


This project was built for the Hackathon using a modern, scalable stack:

- **Frontend**: `Next.js 16` (App Router), `React 19`, `Tailwind CSS v4`, `Framer Motion` (for fluid animations).
- **UI Components**: `Shadcn/UI` for a premium, accessible design system.
- **Backend**: `Node.js` & `Express` (Separate Service) handling complex logic.
- **AI Engine**: `Google Gemini 2.5 Flash` via the Google GenAI SDK.
- **Database**: `MongoDB Atlas` (Mongoose ODM) for storing session history and analytics.
- **Deployment**: Dockerized for easy deployment to Vercel or Render.

<br />

---


  <h2>🚧 Challenges I Ran Into</h2>


- **Real-time Latency**: Ensuring the voice interaction felt natural required optimizing the API calls to Gemini and the browser's speech recognition.
- **Prompt Engineering**: Creating an AI persona ("Alex") that could push back on candidates without being rude was a delicate balance of system instructions.
- **Full Stack Integration**: Coordinating state between a Next.js frontend and a separate Express backend while managing a unified user experience.

<br />

---


  <h2>🏅 Accomplishments That I'm Proud Of</h2>


- **Seamless Voice UI**: I achieved a near-conversational latency that makes the interview feel real.
- **Dynamic Report Generation**: The post-interview analysis is genuinely helpful, offering specific actionable feedback rather than generic advice.
- **Clean Architecture**: Successfully implementing a decoupled Full Stack architecture.

<br />

---


  <h2>🧠 What I Learned</h2>


- **Gemini's Capabilities**: I pushed the limits of Gemini 3.0 Flash's context window to maintain long interview history.
- **Modern React Patterns**: Deepened my understanding of React 19 features and Next.js App Router patterns.
- **Microservices Deployment**: Learned the intricacies of deploying separate frontend and backend services to different providers (Vercel & Render).

<br />

---


  <h2>🔮 What's Next for Nexus AI</h2>


- [ ] **Video Analysis**: Using Gemini's multimodal capabilities to analyze body language via webcam.
- [ ] **Code Execution Environment**: Adding a live coding sandbox for technical questions.
- [ ] **Custom Personas**: Allowing users to choose between "Friendly HR", "Strict CTO", or "Neutral Peer".

<br />

---


<h2>⚡ Getting Started</h2>


### Prerequisites

- Node.js 18+
- A Google Gemini API Key
- A MongoDB Connection String

### Installation

<details>
<summary><strong>1. Backend Setup</strong> (Click to expand)</summary>

```bash
git clone https://github.com/sahildk/ai-interviewer.git
cd ai-interviewer/server
npm install

# Copy the example env file and fill in your values
cp .env.example .env
```

Edit `server/.env` with your credentials:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/db
API_KEY=your_gemini_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000   # your frontend origin (for CORS)
```

> ⚠️ The server will **exit immediately** on startup if `MONGO_URI` or `API_KEY` are missing.

```bash
npm start
```
</details>

<details>
<summary><strong>2. Frontend Setup</strong> (Click to expand)</summary>

```bash
cd ai-interviewer/frontend
npm install

# Copy the example env file and fill in your values
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
</details>

<br />

---


  <h2>🐳 Deployment</h2>


See [DEPLOYMENT.md](DEPLOYMENT.md) for a detailed step-by-step guide on deploying both the Frontend and Backend.

| Service | Platform | Link |
| :--- | :--- | :--- |
| **Backend** | Render | [Guide](DEPLOYMENT.md#backend-deployment-rendercom) |
| **Frontend** | Vercel | [Guide](DEPLOYMENT.md#frontend-deployment-vercel) |
| **Container** | Docker | [Guide](DEPLOYMENT.md#docker-deployment-optional) |

<br />

---

<div align="center">
  <h2>👤 Author</h2>
</div>

<div align="center">
  <strong>Sahil Deore</strong>
  <br />
  <em>Full Stack Developer | Hackathon Enthusiast</em>
  <br />
  <br />
  <a href="https://github.com/sahildk">
    <img src="https://img.shields.io/github/followers/sahildk?style=social" alt="GitHub Followers" />
  </a>
</div>

<br />

---

<div align="center">
  <p>Licensed under the MIT License.</p>
  <p>Made with ❤️ during the Hackathon.</p>
</div>
