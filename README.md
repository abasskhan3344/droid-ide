# Droid IDE — Mobile + Web Android IDE

Droid IDE is a full-stack Android IDE platform designed for **Android phones** and **web browsers**, with a cloud build + emulator backend.

## Monorepo Architecture

- `frontend/` — Flutter app (Android + Web) with Monaco editor embedding, project explorer, terminal panel, AI assistant UI.
- `backend/` — FastAPI service providing REST + WebSocket APIs for auth, projects, files, builds, emulator sessions, logs, terminal, and AI actions.
- `infra/` — Docker Compose and Kubernetes manifests for production deployment.
- `scripts/` — Build and emulator orchestration scripts.

## Core Features Delivered

- Project lifecycle: create/import/export/list/delete projects
- File system APIs: read/write/tree upload/download ZIP
- Build pipeline: Gradle wrapper execution in secure containers, real-time log streaming
- APK artifact management
- Cloud emulator session API (WebRTC signaling + touch/input relay)
- Terminal over WebSocket (PTY-backed)
- Git API integrations (clone/pull/push/commit/branch)
- SDK manager API to install/manage API levels/build tools
- AI assistant endpoint for code generation/fixing/explanations
- Plugin registry + activation system
- Mobile-first UX plan for low-RAM mode + offline sync strategy

---

## 1) Quick Start (Local)

### Prerequisites

- Docker + Docker Compose
- Node.js 20+
- Python 3.11+
- Flutter 3.22+
- Android SDK (for local fallback builds)

### Run full stack

```bash
docker compose -f infra/docker-compose.yml up --build
```

Services:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- Redis: `localhost:6379`
- Postgres: `localhost:5432`

---

## 2) Frontend (Flutter)

### Setup

```bash
cd frontend
flutter pub get
flutter run -d chrome
```

### UI modules

- Workspace shell with touch-first split panes
- Monaco-based code editor webview
- File tree + tabbed editor
- Build/log panel (WebSocket)
- Emulator stream viewport + gesture translation
- Layout Designer panel with live XML preview bridge
- AI side panel

---

## 3) Backend (FastAPI)

### Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### API surface (high-level)

- `POST /api/auth/login`
- `POST /api/projects`
- `GET /api/projects/{id}/tree`
- `POST /api/projects/{id}/import-zip`
- `GET /api/projects/{id}/export-zip`
- `POST /api/builds/{project_id}`
- `GET /api/builds/{build_id}`
- `GET /api/builds/{build_id}/artifacts`
- `POST /api/emulator/sessions`
- `POST /api/emulator/sessions/{session_id}/input`
- `POST /api/git/clone`
- `POST /api/plugins/install`
- `POST /api/ai/complete`

WebSockets:

- `/ws/builds/{build_id}/logs`
- `/ws/terminal/{project_id}`
- `/ws/emulator/{session_id}/stream`

---

## 4) Build & APK Pipeline

The build engine runs in isolated containers per build request:

1. Pull project snapshot
2. Mount Android SDK + Gradle cache
3. Run `./gradlew assembleDebug` (or release task)
4. Stream logs through Redis pub/sub to WebSocket
5. Persist APK/AAB artifacts to object storage
6. Return artifact URLs via API

Script entrypoint:

```bash
./scripts/run_build_worker.sh <project_id> <build_id>
```

---

## 5) Cloud Emulator Architecture

- Android Emulator runs in GPU-enabled node pools
- ADB bridge sidecar manages install/run/logcat
- WebRTC gateway streams display and accepts touch/key input
- Session allocator supports multiple API levels and device profiles

Lifecycle:

1. `POST /api/emulator/sessions`
2. Receive signaling metadata + ICE config
3. Frontend connects WebRTC stream
4. User taps/keys relay to input endpoint/WebSocket
5. APK install via ADB bridge

---

## 6) Security Model

- Build jobs run in sandboxed containers with CPU/RAM/time limits
- No host mount access except scoped project workspace
- Secrets loaded from environment/secret manager only
- JWT auth for API + per-project RBAC checks
- Signed URLs for artifact download
- Input validation + rate limiting middleware

---

## 7) Mobile Optimization

- Low RAM mode: reduced editor services + deferred panels
- PWA offline cache for last synced projects
- Background sync queue for file mutations
- Gesture shortcuts + floating coding toolbar
- Adaptive layout for one-handed use

---

## 8) Plugin System

Plugins implement backend and/or frontend manifests:

```json
{
  "id": "com.droidide.lintplus",
  "name": "Lint Plus",
  "version": "1.0.0",
  "capabilities": ["editor.codeActions", "build.preHook"],
  "entrypoints": {
    "frontend": "plugins/lintplus/index.js",
    "backend": "plugins/lintplus/server.py"
  }
}
```

---

## 9) Deployment (Kubernetes)

```bash
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/redis.yaml
kubectl apply -f infra/k8s/backend.yaml
kubectl apply -f infra/k8s/frontend.yaml
kubectl apply -f infra/k8s/emulator-pool.yaml
```

Use HPA + cluster autoscaler for build/emulator load.

---

## 10) API Keys / Environment

Copy and edit:

```bash
cp .env.example .env
```

Required keys:

- `OPENAI_API_KEY`
- `JWT_SECRET`
- `DATABASE_URL`
- `REDIS_URL`
- `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`
- `TURN_SERVER_URL`, `TURN_USERNAME`, `TURN_PASSWORD`

---

## 11) Testing Checklist

- Create project from template
- Edit Kotlin/XML files in tabs
- Run build and verify streamed logs
- Download/install APK in emulator session
- Trigger breakpoint + inspect logcat
- Clone/push via Git integration
- Enable plugin and verify hook execution
- Disconnect network, edit offline, re-sync changes

---

## 12) Production Notes

- Prefer managed Postgres/Redis and object storage
- Enable CDN for static frontend bundle and artifacts
- Isolate emulator nodes from API nodes
- Use OIDC SSO for enterprise deployment
- Add billing/quotas for build minutes and emulator runtime

