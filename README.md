# STSC AI-Enabled Scholarship Management Prototype

## Ministry of Tribal Affairs (NFST & NOS-ST)

This repository contains a Next.js/NestJS/FastAPI monorepo prototype for the Ministry of Tribal Affairs (MoTA). It demonstrates a fully deterministic, AI-assisted approach to processing National Fellowship for Scheduled Tribes (NFST) and National Overseas Scholarship (NOS) applications.

### Key Principles Enforced
1. **Deterministic Processing**: AI never makes final eligibility decisions. AI acts as an extraction and flagging assistant. All eligibility is processed by a JSON Logic Rules Engine.
2. **Immutable Configurations**: Schemes are configuration-driven, not hardcoded. Policy changes result in new `scheme_version` rows; history is never overwritten.
3. **Cryptographic Auditing**: Every state change forms a SHA-256 hash-chained log (`AuditLog`), preventing tamper-evident operations.

---

### Setup Instructions

1. **Prerequisites**
   - Docker & Docker Compose
   - Node.js (v20+) & pnpm

2. **One-Command Launch**
   Start the entire stack (PostgreSQL, MinIO, Redis, Web, API, AI services) via docker-compose:
   ```bash
   docker compose up --build -d
   ```

3. **Verify Execution**
   - Web App: `http://localhost:3000`
   - API Swagger: `http://localhost:3001/api/docs`
   - AI FastAPI Docs: `http://localhost:8000/docs`

4. **Run Synthetic Data / Demos**
   - Synthetic Applicant Generator: `node apps/api/scripts/generate_synthetic_data.js`
   - Audit Chain Integrity Check: `npx ts-node apps/api/scripts/verify-audit-chain.ts`
   - E2E Playwright Tests: `npx playwright test tests/e2e/demo_flow.spec.ts`

---
*For detailed architecture limits and roadmap planning, consult the `docs/` folder.*
