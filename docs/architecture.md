# Architecture Diagram

```mermaid
graph TD
    %% Presentation Layer
    subgraph "Presentation Layer (apps/web)"
        A[Applicant PWA (i18n, IndexedDB)] 
        B[Institute Portal] 
        C[Ministry Dashboard & Workbench]
    end

    %% API Gateway & Orchestration
    subgraph "Core API Layer (apps/api - NestJS)"
        D[Auth & RBAC Middleware]
        E[Application Lifecycle Machine (XState)]
        F[Policy & Scheme Config Engine]
        G[Audit Logging (Hash Chained)]
    end

    %% External Adapters
    subgraph "Integration Adapters"
        H[DigiLocker / API Setu Mock]
        I[PFMS SFTP Batch Mock]
        J[ESign / Bhashini Mocks]
    end

    %% Intelligence Layer
    subgraph "Intelligence Layer (services/ai - FastAPI)"
        K[OCR & Extraction (PyMuPDF Mock)]
        L[Policy Diff Extractor]
        M[NetworkX Fraud Analytics]
    end

    %% Data Layer
    subgraph "Data Layer"
        N[(PostgreSQL 16)]
        O[(MinIO Object Storage)]
        P[(Redis Caching/Jobs)]
    end

    %% Connections
    A -->|REST / JWT| D
    B -->|REST / JWT| D
    C -->|REST / JWT| D

    D --> E
    D --> F
    E --> G
    F --> G

    E -->|gRPC / HTTP| K
    F -->|Policy Docs| L
    E -->|Trigger Cron| M

    E -.-> H
    E -.-> I
    E -.-> J

    E --> N
    E --> O
    E --> P
    F --> N
    G --> N
```
