# SafeGate (SecuraCore)

SafeGate is a role-based society management system designed to manage visitor entry, security operations, complaint handling, and package tracking in a residential society.

## Project Structure

- client/   → Frontend (Next.js / React)
- backend/  → Java Spring Boot backend (Visitor, Security, Attendance)
- server/   → ASP.NET Core backend (Complaints, Packages)
- MySQL     → Database

## How to Run the Project

1. Start MySQL server
2. Start Java backend:
   cd backend
   mvn spring-boot:run

3. Start .NET backend:
   cd server
   dotnet run

4. Start Frontend:
   cd client
   pnpm dev

Open browser:
http://localhost:3000

## Roles in System

- Resident: Raises complaints, tracks packages, requests visitors
- Security: Handles visitor check-in/check-out and attendance
- Admin: Manages and resolves complaints

## Future Scope

- QR-based visitor authentication
- Automated notifications
- Mobile app integration
