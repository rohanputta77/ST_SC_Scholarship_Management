# Project Limitations & Boundary Constraints

To provide total transparency regarding the implementation depth of this prototype, the following lists every explicitly mocked, unverified, or roadmap-bound feature. 

### 1. Unverified Domain Knowledge (Configs)
Per `docs/coverage_gaps.md` and `AGENTS.md`, the following elements are marked `verified: false` and are implemented based on assumed/fallback logic:
- **NET-Score Scaling Method**: The exact mathematical normalization used by MoTA to scale distinct subject NET scores to 100 is unknown. The prototype configures a pluggable scaling function, but defaults to a 1:1 map.
- **No-NET Handling**: How applicants without NET scores are handled in the 50/50 formula is unknown. The prototype currently requires a NET score for NFST or treats missing scores as 0.
- **Current-Year NFST Rate**: The fellowship rate is set to the 2022 baseline (₹31,000/₹35,000). A rumored 2023 revision exists but lacks documented verification.
- **ST Master-List Validation**: The Gazette-based ST community master list is unavailable. We dynamically validate against the PVTG list, but standard ST validation is marked as a mocked roadmap feature.

### 2. External Adapters (Mocked)
All external API integrations are structurally written in `apps/api/src/adapters/index.ts` but are explicitly mocked to avoid real HTTP requests in this environment:
- **DigiLocker / API Setu**: Document fetch is mocked.
- **PFMS SFTP Batch Generation**: Generates correct XML structures but does not transmit them.
- **eSign (CDAC / NSDL)**: Returns a mock buffer string instead of a PKCS#7 verifiable signature.
- **SMS / WhatsApp**: Logs to console rather than hitting the NIC gateway.
- **Bhashini NMT**: Neural Machine Translation is intercepted and mocked.

### 3. Analytics & UX (Roadmap)
The following features represent "Phase 2" roadmap items that are architected but not deeply implemented:
- **Graph-Based Fraud Depth**: NetworkX ring detection is active (catching shared banks/addresses), but deeper historical graph analysis (linking cross-scheme applicants over 5 years) requires a larger data warehouse.
- **Real-Time Bhashini Translation**: The deficiency cards simulate Hindi translations based on synthetic ground-truth data, rather than calling the Bhashini API dynamically at runtime.
- **Production File Storage**: While MinIO is configured in `docker-compose.yml`, the synthetic PDFs are generated and read from local disk paths to optimize demo execution speed.
