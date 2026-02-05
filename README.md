# WATCHDOG - AI Hallucination Detection & Output Control System

WATCHDOG is an enterprise-grade AI safety platform that prevents harmful outputs from reaching users through real-time hallucination detection and enforcement policies.

## 🎯 Overview

WATCHDOG acts as an AI safety gateway that detects hallucinations and enforces ALLOW/WARN/BLOCK policies on LLM outputs before they reach end users.

**Key Features:**
- Real-time hallucination detection
- Configurable enforcement policies (ALLOW/WARN/BLOCK)
- LLM proxy with safety controls
- Production-ready FastAPI backend
- Modern React frontend interface

## 📁 Project Structure
```
watchdog/
├── backend/                 # Complete Backend System
│   ├── app/                # FastAPI Main Application
│   │   ├── api/            # REST API endpoints
│   │   ├── proxy/          # LLM proxy & enforcement
│   │   ├── main.py         # Application entry point
│   │   ├── requirements.txt
│   │   └── .env.example    # Environment configuration template
│   └── ...
├── frontend/               # React Application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.9+ with `pip`
- **Node.js**: 16+ (recommended 18+) with `npm` or `yarn`

### Backend Setup (Development)

1. **Configure environment**:
```bash
   cd backend/app
   cp .env.example .env
```
   Edit `.env` and set `OPENROUTER_API_KEY` (or keep `MOCK_LLM=true` for local testing)

2. **Install dependencies**:
```bash
   pip install -r requirements.txt
```

3. **Run development server** (auto-reload enabled):
```bash
   # Option 1: From backend/app directory
   cd backend/app
   uvicorn main:app --reload --host 0.0.0.0 --port 8000

   # Option 2: From repository root
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. **Access API documentation**: Navigate to `http://localhost:8000/docs`

### Frontend Setup (Development)

1. **Install dependencies and start**:
```bash
   cd frontend
   npm install
   npm start
```

2. **Access application**: React dev server runs on `http://localhost:3000`

## 🏗️ Production Build

### Frontend

Build static assets for production:
```bash
cd frontend
npm run build
```

Serve the `build/` directory with any static host (nginx, `serve`, etc.)

### Backend

For production deployment, configure your `.env` file appropriately and run:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## ⚙️ Environment Configuration

The backend environment file is located at `backend/app/.env.example`.

**Key Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `MOCK_LLM` | Use mock responses (`true`) or real LLM provider (`false`) | `true` |
| `OPENROUTER_API_KEY` | API key for OpenRouter (required when `MOCK_LLM=false`) | - |
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `8000` |
| `RELOAD` | Enable auto-reload in development | `true` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000` |

## 🧪 Testing

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
pytest
```

## 🔧 Troubleshooting

**Backend import issues:**
- If the backend fails to import `app` when running from repository root, run uvicorn from `backend/app` using `uvicorn main:app`

**CORS blocking requests:**
- Adjust `CORS_ORIGINS` in the backend `.env` file to include your frontend URL

**Port already in use:**
- Change the `PORT` variable in `.env` or specify a different port with `--port` flag

## 📝 API Endpoints

Access the interactive API documentation at `http://localhost:8000/docs` when running the backend server.

Key endpoints include:
- `/api/*` - REST API endpoints
- `/proxy/*` - LLM proxy with safety enforcement


---

**Note**: For detailed API documentation and advanced configuration options, please refer to the `/docs` endpoint when running the backend server.
