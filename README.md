# 📚 StudyAI — AI-Powered Study Platform

An intelligent SaaS platform that helps students upload PDF study materials and interact with them through an AI-powered chatbot using Google's Gemini API with **Retrieval-Augmented Generation (RAG)**.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Gemini](https://img.shields.io/badge/Google_Gemini-API-orange?logo=google)

---

## ✨ Features

- **📄 PDF Upload & Management** — Drag & drop PDF upload with duplicate detection, file viewing, download, and deletion
- **🤖 AI Chat with RAG** — Ask questions about your uploaded documents; the AI reads your PDFs and responds with context-aware answers
- **🎨 Markdown Rendering** — AI responses render with proper formatting (bold, headers, lists, code blocks)
- **⚡ Real-time Model Display** — Dynamically shows the active AI model (configurable via environment)
- **🗄️ PostgreSQL Storage** — Persistent document storage with in-memory fallback for demos
- **📱 Responsive Design** — Modern, premium UI that works across all screen sizes

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router, Lucide Icons, React Markdown |
| **Backend** | Node.js, Express, Multer (file uploads), pdf2json (PDF parsing) |
| **Database** | PostgreSQL 15 (Docker) with in-memory fallback |
| **AI** | Google Gemini API (`gemini-3.1-flash-lite` / configurable) |
| **Styling** | Custom CSS with glassmorphism, gradients, and micro-animations |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Docker** (for PostgreSQL) or a remote PostgreSQL instance
- **Google AI API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/techwithmohan/studyai.git
cd studyai
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 3. Set Up PostgreSQL (Docker)

```bash
docker run -d \
  --name studyai-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=studyai \
  -p 5433:5432 \
  postgres:15-alpine
```

### 4. Configure Environment Variables

Create `server/.env`:

```env
GEMINI_API_KEY=your_google_ai_api_key
GEMINI_MODEL=gemini-3.1-flash-lite
PORT=5000

# PostgreSQL Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=studyai
DB_PASSWORD=postgres
DB_PORT=5433
```

### 5. Run the Application

```bash
# Terminal 1 — Start Backend
npm run server

# Terminal 2 — Start Frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
studyai/
├── public/                  # Static assets
├── server/
│   ├── uploads/             # Uploaded PDF files (gitignored)
│   ├── index.js             # Express API server
│   ├── .env                 # Server environment variables (gitignored)
│   └── package.json         # Server dependencies
├── src/
│   ├── lib/
│   │   └── gemini.js        # Frontend API client for chat
│   ├── pages/
│   │   └── Dashboard/
│   │       ├── Dashboard.jsx # Main dashboard component
│   │       └── Dashboard.css # Dashboard styles
│   └── App.jsx              # Root component with routing
├── .env.example             # Environment template
├── .gitignore
├── package.json
└── vite.config.js
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload a PDF file (multipart form) |
| `GET` | `/api/documents` | List all uploaded documents |
| `GET` | `/api/documents/:id/view` | View/stream a PDF file inline |
| `DELETE` | `/api/documents/:id` | Delete a document (DB + disk) |
| `POST` | `/api/chat` | Send a message to the AI (with RAG context) |
| `GET` | `/api/config` | Get current model configuration |

---

## 🧠 How RAG Works

1. **Upload** — User uploads a PDF via the dashboard
2. **Store** — File is saved to disk and metadata is stored in PostgreSQL
3. **Parse** — When the user asks a question, the backend extracts text from all uploaded PDFs using `pdf2json`
4. **Augment** — The extracted text is prepended to the user's message as context
5. **Generate** — The augmented prompt is sent to Google Gemini, which generates a context-aware response
6. **Render** — The response is rendered in the chat UI with full Markdown support

---

## ⚙️ Available AI Models

You can change the model in `server/.env` by updating `GEMINI_MODEL`. Some options:

| Model | Speed | Quality |
|-------|-------|---------|
| `gemini-3.1-flash-lite` | ⚡ Fastest | Good |
| `gemini-2.5-flash` | Fast | Great |
| `gemini-2.5-pro` | Moderate | Best |
| `gemma-4-31b-it` | Moderate | Great (open model) |

---

## 🛡️ Security Notes

- `server/.env` is **gitignored** — never commit your API keys
- The Gemini API key is kept **server-side only** — never exposed to the frontend
- File uploads are validated for PDF type and stored with unique timestamps

---

## 📜 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ by [TechWithMohan](https://github.com/techwithmohan)**
