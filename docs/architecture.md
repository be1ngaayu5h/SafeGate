# SafeGate Architecture

## Overview

SafeGate is a multi-society residential security platform. It manages society onboarding, residents, guards, visitors, packages, complaints, and attendance.

## Technology

- Frontend: React + Vite + TypeScript
- Backend: Java 21 + Spring Boot
- Security: Spring Security + JWT
- Persistence: Spring Data JPA
- Database migrations: Flyway
- Database: PostgreSQL
- API style: REST/JSON
- Frontend deployment: Vercel
- Backend deployment: Render
- Database hosting: Supabase or Neon
- Local development: Docker

## Roles

- `PLATFORM_ADMIN` — reviews and approves new society onboarding and manages the platform.
- `SOCIETY_ADMIN` — manages one society, including buildings, flats, residents, guards, and society operations.
- `GUARD` — performs gate and visitor/package operations.
- `RESIDENT` — manages visitors, packages, and complaints for their flat. Resident type is `OWNER` or `TENANT`.

## Authorization

SafeGate uses RBAC with granular permissions and scope checks.

Roles provide the primary authorization boundary. Backend checks also ensure that users can only access resources belonging to their society and, where applicable, their own flat.

## Core Hierarchy

```text
Platform
└── Society
    ├── Buildings
    │   └── Flats
    │       └── Residents
    ├── Gates
    ├── Guards
    ├── Visitors
    ├── Packages
    ├── Complaints
    └── Guard Attendance
```

## Initial Product Scope

Core functionality includes:

- Society onboarding and Platform Admin approval
- Society/building/flat management
- Resident and guard management
- Visitor scheduling and gate check-in/out
- Package management
- Complaint management
- Guard attendance
- Audit logging

Emergency/incident reporting is intentionally outside the current scope.
