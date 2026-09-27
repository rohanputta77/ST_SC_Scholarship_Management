# Adoption Roadmap & Integration Strategy

This AI-Enabled Scholarship Management System is designed to **complement and integrate with**, rather than immediately rip-and-replace, the existing MoTA IT ecosystem.

## Integration over Replacement
The current National Fellowship portal (fellowship.tribal.gov.in) and Overseas portal (overseas.tribal.gov.in) already handle applicant registration. This prototype is designed to sit directly behind them as the **Intelligent Scrutiny & Rule Engine Layer**. 
- Existing portals can push JSON payloads to this API.
- This engine will execute the AI extraction, verification, JSON Logic, and ranking.
- Decisions and state updates are pushed back to the legacy portals via Webhooks.

## Phased Rollout Plan

### Phase 1: Shadow Mode Pilot (NFST Scheme)
- **Scope**: Deploy the AI Extraction & Rules Engine in "Shadow Mode" alongside the upcoming NFST application cycle.
- **Action**: Run real applications through the pipeline silently. 
- **Goal**: Tune the AI fuzzy matching thresholds (e.g., transliteration tolerance for tribal community names) and measure the true Straight-Through Processing (STP) rate against human officers' manual decisions.

### Phase 2: Live Scrutiny Workbench (NOS Scheme)
- **Scope**: Introduce the Scrutiny Workbench to the Ministry Exception Handlers for the smaller NOS cohort (~300 applicants).
- **Action**: Clean applications are fast-tracked for visual review. Flagged applications hit the split-screen UI.
- **Goal**: Measure processing time reduction and reduction in SLA breaches.

### Phase 3: Automated Allocation & Post-Selection
- **Scope**: Activate the JSON-Logic Allocation Engine (managing complex cascades and female/PVTG overlaps).
- **Action**: Selection Committee uses the dashboard to review the ranked outputs and approve the PFMS payment batch adapter generation.
- **Goal**: End-to-end management of NFST/NOS, unlocking the What-If Simulator for policy tweaking.

### Phase 4: MoTA-Wide Expansion
- Expand the generic `scheme_version` JSON configurations to accommodate standard pre-matric and post-matric scholarship schemes managed by the Ministry of Tribal Affairs.
