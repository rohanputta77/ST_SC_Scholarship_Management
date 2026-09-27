---
trigger: always_on
---

This repo is an AI-enabled scholarship management prototype for the Ministry of Tribal Affairs (NFST and NOS-ST). Non-negotiables:
1. Eligibility, scoring and ranking are deterministic, versioned rules. AI never decides; it extracts, flags and explains. Officers approve.
2. Schemes are configuration (JSON + JSON Logic), never hard-coded. Every rule/rate has: source_doc, clause, effective_from, verified(bool).
3. Synthetic data only. Never store raw Aadhaar; use tokens and masked display.
4. External systems (DigiLocker, PFMS, eSign, SMS, Bhashini) are adapter interfaces with mock implementations.
5. TypeScript strict, OpenAPI for every endpoint, tests for every rule, hash-chained audit log for every state change.
Read /docs/source before making any domain assumption. If a fact is not in the sources, mark it unverified instead of guessing.
## Current verified knowledge state (as of docs/coverage_gaps.md)
- NFST eligibility, documents, slots, lifecycle, and base rates (₹31,000/₹35,000 monthly, effective 1 Apr 2022) are VERIFIED from nfst_part_a_full_guidelines_2021-26.
- NFST 2025-26 merit formula (50% NET/CSIR-NET + 50% Master's/4-yr Bachelor's, both scaled to 100) is VERIFIED from the notice dated 04.08.2026, but the NET-score scaling method and no-NET-score handling are NOT specified anywhere — keep these two fields verified:false and configurable.
- NFST current-year exact fellowship rate is possibly superseded by an untraced 2023 revision notice — use ₹31,000/₹35,000 as the dated fallback, mark verified:false for "current" rate.
- ST master list (Gazette-based, for community-name validation) is NOT available — build this feature as roadmap/mocked only, do not claim it's functional.
- PVTG list IS available and should be used for real validation.
- NOS is fully covered by existing documents — no gaps.