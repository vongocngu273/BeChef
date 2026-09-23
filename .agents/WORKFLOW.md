# BeChef Multi-Agent System Workflow & Ownership Matrix

## 1. Orchestration Model

```text
MAIN AGENT / ORCHESTRATOR
        │
        ├───────────────┐
        ▼               ▼
BACKEND SPECIALIST   FRONTEND UX/UI SPECIALIST
        │               │
        └───────┬───────┘
                ▼
        INTEGRATED BUILD
                │
                ▼
     QA & TEST AUTOMATION
                │
          PASS / FAIL
                │
      ┌─────────┴─────────┐
      │                   │
     PASS                FAIL
      │                   │
      ▼                   ▼
   COMPLETE          BUG ROUTING
                          │
                    Backend / Frontend
                          │
                          ▼
                         FIX
                          │
                          ▼
                         QA
                          │
                       repeat
```

## 2. File Ownership Matrix

| Area | Owner | Path |
| :--- | :--- | :--- |
| Express Server & API | **Backend Specialist** | `server.js`, `routes/**`, `services/**`, `middleware/**` |
| Nutrition Guardrails | **Backend Specialist** | `services/geminiService.js` |
| UI & Client Components | **Frontend UX/UI Specialist** | `client/src/**`, `client/public/**`, `client/*.config.js` |
| Test Suites & Runner | **QA Specialist** | `tests/**`, `scripts/**`, `.agents/qa/bugs/**` |
| Orchestration & Contracts | **Main Agent (Orchestrator)**| `.agents/**`, `TASK_CONTRACT.md` |

## 3. Shared Frozen Contract
- Endpoint: `POST /api/generate-recipes`
- Port: `5001` (to avoid macOS AirPlay Receiver port 5000 conflict)
- JSON Schemas frozen before parallel execution.

## 4. Self-Healing Loop
When QA flags a failure:
1. QA creates structured ticket in `.agents/qa/bugs/BUG-XXX.md`.
2. Orchestrator assigns fix to owner (`backend-specialist` or `frontend-ux-ui-specialist`).
3. Specialist resolves bug in isolated test.
4. QA reruns full regression test suite until 100% pass.
