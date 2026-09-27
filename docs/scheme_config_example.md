# Scheme Configuration Explained

This repository externalizes all scholarship rules into `JSON` configuration files (e.g., `configs/nfst.json`). This ensures that the Ministry can update policies without changing the core codebase.

Here is a plain-language breakdown of how a scheme configuration is structured:

### 1. Scheme Metadata
```json
"id": "NFST",
"version": "2024-25_v1",
"effectiveFrom": "2024-04-01"
```
Every scheme is strictly versioned. When policy changes (e.g., a new Ministry circular), a *new* version is created. Existing inflight applications are locked to the version they started under, preventing unfair "mid-flight" policy shifts.

### 2. Eligibility Engine (JSON Logic)
```json
"eligibilityRules": {
  "and": [
    { "<=": [{ "var": "age" }, 36] },
    { ">=": [{ "var": "marksPercent" }, 55] },
    { "==": [{ "var": "category" }, "ST"] }
  ]
}
```
This is the machine-readable translation of the scheme guidelines. The system reads this block to autonomously check if an applicant is exactly 36 or younger, scored 55% or above, and belongs to the ST category. If the guidelines change to 37 years of age, an admin updates this JSON without writing a single line of backend code.

### 3. Slot Quotas and Cascades
```json
"slots": {
  "total": 750,
  "buckets": [
    { "id": "Divyangjan", "count": 38, "priority": 1, "cascadeTo": "PVTG" },
    { "id": "PVTG", "count": 25, "priority": 2, "cascadeTo": "Female" },
    { "id": "Female", "count": 225, "priority": 3, "cascadeTo": "ST_Others", "isOverlapping": true },
    { "id": "ST_Others", "count": 462, "priority": 4, "cascadeTo": null }
  ]
}
```
This defines the exact allocation physics of the scheme. It explicitly tells the Allocation Engine to fill the `Divyangjan` bucket first. If there aren't 38 qualified Divyangjan candidates, the leftover slots immediately flow into the `PVTG` bucket, and so on. The `isOverlapping` flag mathematically allows a female PVTG candidate to count against both quotas simultaneously.

### 4. Merit Formula Weights
```json
"meritFormula": [
  { "component": "netScore", "weight": 50, "scaling": "PERCENTILE" },
  { "component": "masterScore", "weight": 50, "scaling": "NONE" }
]
```
This defines how the final rank is calculated. The 50/50 split ensures transparency in the leaderboard. If a new circular drops this to 60/40, the JSON diff updates this block, and the engine immediately recalculates the top-N list.
