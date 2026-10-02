# SafeGate Database Design

SafeGate uses PostgreSQL with Flyway migrations. The database is designed for multiple societies from the beginning.

## Core Tables

### Identity and onboarding

- `users`
- `society_onboarding_requests`
- `societies`
- `refresh_tokens`

### Society structure

- `buildings`
- `flats`
- `flat_residents`
- `society_admins`
- `guards`
- `gates`

### Operations

- `visitors`
- `visitor_visits`
- `packages`
- `complaints`
- `guard_attendance`
- `audit_logs`

## Important Relationships

```text
Society
├── Buildings
│   └── Flats
│       └── Flat Residents → Users
├── Society Admins → Users
├── Guards → Users
├── Gates
├── Visitor Visits
├── Packages
├── Complaints
└── Guard Attendance
```

## Identity Rules

`users.id` and `visitors.id` are generated internal primary keys.

A visitor's Aadhaar last four digits are stored only as a verification/search attribute. They are not a primary key and are not unique because different people can have the same last four digits.

A visitor and a visit are separate entities:

- `visitors` represents the person.
- `visitor_visits` represents an individual visit to a flat/society.

This allows the same visitor to make multiple visits.

## Multi-Society Isolation

Every society-owned operational resource must be associated with a society, directly or through its parent entity.

Backend authorization must ensure that a user cannot access resources belonging to another society.

## Migration Strategy

Database schema changes will be managed with Flyway. Hibernate will not be responsible for automatically modifying the production schema.

The project will use explicit migrations such as:

```text
V1__initial_schema.sql
V2__add_packages.sql
V3__add_complaints.sql
```

## Scope Exclusions

Emergency/incident reporting is not part of the current database scope.
