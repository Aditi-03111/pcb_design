# 🔌 CircuitMind AI — AI-Powered PCB Design Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-green.svg)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![KiCad](https://img.shields.io/badge/KiCad-9.x-blue.svg)](https://kicad.org)

An **AI-powered PCB design platform** that combines a modern web dashboard with a KiCad plugin, enabling circuit generation from natural language, intelligent component placement, and DFM (Design for Manufacturability) analysis — all running locally on your machine.

---

## ✨ Key Features

- 🧠 **AI Circuit Generation** — Describe a circuit in plain English; get a complete schematic with BOM
- 📐 **Smart Component Placement** — Automated placement optimization powered by machine learning
- 🔍 **DFM Analysis** — Real-time manufacturing rule checks and design validation
- 📊 **Modern Web Dashboard** — Beautiful Next.js frontend with live circuit preview, template library, and architecture visualization
- 🔧 **KiCad Plugin** — Direct integration into KiCad 9.x PCB Editor as an Action Plugin
- 📦 **Export to KiCad** — Generate `.kicad_sch` schematics ready for production
- 🏠 **100% Local** — AI runs via [Ollama](https://ollama.com/) — no cloud, no API keys

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  ┌──────────────────┐    ┌───────────────────────────┐  │
│  │  Next.js Frontend│    │  KiCad Action Plugin      │  │
│  │  (Port 3000)     │    │  (Embedded in KiCad 9)    │  │
│  └────────┬─────────┘    └────────────┬──────────────┘  │
│           │          REST API         │                  │
│           └──────────┬────────────────┘                  │
│                      ▼                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              FastAPI Backend (Port 8765)           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────────┐│  │
│  │  │LLM Engine│ │Placement │ │DFM Engine          ││  │
│  │  │(Ollama)  │ │Engine    │ │                    ││  │
│  │  └──────────┘ └──────────┘ └────────────────────┘│  │
│  │  ┌──────────────┐ ┌────────────────────────────┐ │  │
│  │  │Schematic Eng.│ │KiCad Exporter (.kicad_sch) │ │  │
│  │  └──────────────┘ └────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                      ▼                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │        Ollama (localhost:11434)                    │  │
│  │        deepseek-coder:6.7b / codellama / llama3   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

```
pcb_design/
├── ai_backend/                 # FastAPI backend server + AI engines
│   ├── ai_server.py            # Main FastAPI application
│   ├── circuit_schema.py       # Pydantic models / request schemas
│   ├── requirements.txt        # Python dependencies
│   ├── smoke_test.py           # Backend smoke tests
│   ├── engines/
│   │   ├── llm_engine.py       # Ollama / GGUF LLM interface
│   │   ├── placement_engine.py # ML-powered placement optimization
│   │   ├── dfm_engine.py       # DFM rule checker
│   │   ├── schematic_engine.py # Circuit graph builder
│   │   └── kicad_exporter.py   # .kicad_sch file generator
│   ├── templates/              # Built-in circuit templates (JSON)
│   └── output/                 # Generated schematics, BOMs, SVGs
│
├── frontend/                   # Next.js 16 web dashboard
│   └── src/
│       ├── app/
│       │   ├── page.tsx                # Landing / hero page
│       │   └── dashboard/
│       │       ├── page.tsx            # Main dashboard overview
│       │       ├── generate/page.tsx   # AI circuit generation
│       │       ├── placement/page.tsx  # Placement optimization
│       │       ├── dfm/page.tsx        # DFM analysis
│       │       ├── templates/page.tsx  # Template library browser
│       │       └── architecture/page.tsx # System architecture view
│       └── components/
│           ├── layout/Sidebar.tsx      # Dashboard sidebar navigation
│           └── ui/                     # Reusable UI components
│
├── plugin/                     # KiCad 9 Action Plugin
│   ├── __init__.py             # Plugin registration
│   ├── pcbnew_action.py        # KiCad 9 PCM entry point
│   ├── plugin.py               # Full UI + board integration logic
│   └── metadata.json           # KiCad PCM package descriptor
│
├── models/                     # Local AI model assets (optional GGUF)
├── files/                      # Project documentation & plans
│   ├── AI_PCB_Platform_Comprehensive_Plan.md
│   ├── Technical_Architecture_Specification.md
│   ├── Executive_Summary.md
│   └── Week_by_Week_Execution_Guide.md
│
├── stitch_ai_pcb_design_platform_judge_demo/  # UI demo screenshots & code
├── build_pcm.ps1               # Build versioned KiCad PCM ZIP
└── deploy_kicad_plugin.ps1     # Fast dev deploy to KiCad
```

---

## 🖥 System Requirements

| Requirement | Version |
|-------------|---------|
| Python      | 3.10 or newer |
| Node.js     | 18.x or newer |
| KiCad       | 9.x (for plugin only) |
| Ollama      | Latest — [ollama.com](https://ollama.com/) |
| OS          | macOS, Windows 10/11, Linux |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/praju455/pcb_design.git
cd pcb_design
```

### 2. Set up the AI backend

```bash
cd ai_backend
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

Start the backend server:

```bash
python -m uvicorn ai_server:app --host 0.0.0.0 --port 8765
```

Verify it's running:

```bash
curl http://127.0.0.1:8765/health
```

Expected response:

```json
{
  "status": "healthy",
  "version": "2.1.0",
  "llm_loaded": true,
  "templates_available": 5
}
```

### 3. Set up the frontend dashboard

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Install & start Ollama (for AI generation)

Download from [ollama.com](https://ollama.com/) and pull the recommended model:

```bash
ollama pull deepseek-coder:6.7b
```

Verify it's running:

```bash
curl http://localhost:11434/api/tags
```

### 5. (Optional) Install the KiCad plugin

Copy the `plugin/` folder into KiCad's scripting plugins directory:

**macOS:**
```
~/Library/Preferences/kicad/9.0/scripting/plugins/ai_pcb_assistant/
```

**Windows:**
```
%APPDATA%\KiCad\9.0\scripting\plugins\ai_pcb_assistant\
```

**Linux:**
```
~/.local/share/kicad/9.0/scripting/plugins/ai_pcb_assistant/
```

Then **fully restart KiCad**.

---

## 🌐 Frontend Dashboard Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Hero page with platform overview |
| **Dashboard** | `/dashboard` | Main overview with status cards and quick actions |
| **Generate** | `/dashboard/generate` | AI circuit generation from natural language prompts |
| **Placement** | `/dashboard/placement` | Component placement optimization tool |
| **DFM Analysis** | `/dashboard/dfm` | Design for Manufacturability checks |
| **Templates** | `/dashboard/templates` | Browse and use built-in circuit templates |
| **Architecture** | `/dashboard/architecture` | System architecture visualization |

---

## 🤖 AI Generation Modes

The backend selects the best available mode automatically:

### Mode 1 — Ollama (recommended)

Auto-detects Ollama at `http://localhost:11434` and picks the first available model:

| Model | Status |
|-------|--------|
| `deepseek-coder:6.7b` | ⭐ Recommended |
| `deepseek-coder:latest` | Supported |
| `codellama` | Supported |
| `llama3` | Supported |
| `mistral` | Supported |

### Mode 2 — Template-only (no AI required)

Built-in deterministic templates — works offline with zero AI dependencies:

| Template | Description |
|----------|-------------|
| 555 Timer | Astable / monostable NE555 |
| LED Resistor | LED with current limiting resistor |
| 3.3V Regulator | LDO from 5V or 12V |
| MOSFET Switch | N-channel low-side switch |
| Op-Amp Buffer | Unity gain buffer |

### Mode 3 — GGUF local model (fallback)

Uses a local GGUF file via `llama-cpp-python`. See `models/README.md` for download instructions.

---

## 📡 Backend API Reference

Base URL: `http://127.0.0.1:8765`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health & capability status |
| `GET` | `/templates` | List available circuit templates |
| `POST` | `/generate` | Generate a circuit from a text prompt |
| `POST` | `/placement/optimize` | Optimize component placement |
| `POST` | `/dfm/check` | Run DFM analysis on a design |
| `GET` | `/download/{filename}` | Download generated `.kicad_sch` file |

### Example: Generate a circuit

```bash
curl -X POST http://127.0.0.1:8765/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "555 timer astable LED blinker at 1Hz", "priority": "quality"}'
```

Priority options: `"quality"` | `"speed"` | `"template"`

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Radix UI, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic, NumPy |
| **AI/ML** | Ollama, llama-cpp-python, deepseek-coder |
| **PCB Integration** | KiCad 9 Action Plugin, `.kicad_sch` export |
| **Design System** | shadcn/ui components, custom MechButton, NodeCanvas, StatusLabel |

---

## 🧪 Development

### Run backend smoke tests

```bash
cd ai_backend
python smoke_test.py
```

### Build KiCad PCM ZIP (for distribution)

```powershell
.\build_pcm.ps1
```

Output: `dist/pcm/v{version}/ai-pcb-assistant-pcm-v{version}.zip`

### Fast dev deploy (direct copy to KiCad)

```powershell
.\deploy_kicad_plugin.ps1
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|---------|
| Backend not reachable | Ensure `uvicorn` is running on port 8765. Check with `curl http://127.0.0.1:8765/health` |
| LLM not loaded | Run `ollama list` to check models. Pull with `ollama pull deepseek-coder:6.7b` |
| Plugin not in KiCad | Ensure folder is named `ai_pcb_assistant` in the plugins dir. Fully restart KiCad |
| Port 8765 in use | Set `PORT=8767` env var and update plugin/frontend config |
| `onnxruntime` warning | Non-critical — run `pip install onnxruntime` to enable RL placement |

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. See individual files for license details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/praju455">praju455</a>
</p>
