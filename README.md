
# ✅ SafeGate – Smart Society Security & Management System

SafeGate is a web-based application designed to manage visitor entry, package deliveries, and complaints in residential societies. It replaces manual registers with a secure, digital system that improves tracking, transparency, and operational efficiency for residents, security staff, and administrators.

---

## 🚀 Features

### 👤 Role-Based Access
- **Admin**: Manage residents, guards, view complaints, and monitor activities
- **Resident**: Request visitors, raise complaints, track packages
- **Security (Guard)**: Check-in/check-out visitors, manage packages, scan QR (future scope)

### 📋 Core Modules
- Visitor Management (request, approve, check-in, check-out)
- Complaint Management (raise, assign, update status)
- Package Management (add, update status, verify OTP)
- Guard Attendance Tracking
- Role-based Dashboards
- Secure Login System

---

## 🛠️ Tech Stack

### Frontend
- Next.js (React)
- TypeScript
- Tailwind CSS
- Shadcn UI Components

### Backend
- Java Spring Boot (Core backend services)
- .NET Web API (Package & Complaint services)

### Database
- MySQL 8.0

### Tools
- PNPM
- Maven
- Visual Studio / VS Code
- Git & GitHub

---

## 🗂️ Project Structure



SafeGate/
│── backend/        # Spring Boot backend (Java)
│── client/         # Next.js frontend
│── server/         # .NET backend services
│── package.json
│── pnpm-workspace.yaml
│── README.md



---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/be1ngaayu5h/SafeGate.git
cd SafeGate


### 2️⃣ Start Java Backend (Spring Boot)


cd backend
mvn spring-boot:run


### 3️⃣ Start .NET Backend

Open the `server` folder in Visual Studio and run the project
OR use:


cd server
dotnet run


### 4️⃣ Start Frontend


cd client
pnpm install
pnpm dev


Frontend will run at:


http://localhost:3000


---

## 🔐 User Roles & Demo Flow

### Admin

* Login → Dashboard
* Manage residents and guards
* View and assign complaints
* Monitor visitors and packages

### Resident

* Login → Dashboard
* Create visitor requests
* Raise complaints
* Track packages

### Security (Guard)

* Login → Dashboard
* View visitors
* Check-in / Check-out visitors
* Manage package delivery status

---

## 🗄️ Database

* MySQL 8.0
* Main Tables:

  * admin
  * resident
  * guard
  * guard_attendance
  * visitor
  * qr_visitors
  * packages
  * complaints

---

## 🔮 Future Scope

* QR Code based visitor entry system
* Mobile application for guards and residents
* SMS / Email notifications
* Advanced analytics dashboard
* Enhanced security verification methods

---

## 📄 Documentation

* Complete project report prepared
* Includes:

  * System Architecture
  * ER Diagram
  * Flow Diagrams
  * Database Design
* Screenshots will be added after final demo execution

---

## 👨‍💻 Author

**Aayush Pardeshi**
MCA / PG-DAC Student
Project: SafeGate – Society Security Management System

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!

---

## 📌 Note

This project is developed for academic and learning purposes to demonstrate full-stack development using modern web technologies and backend frameworks.


- Make a **CDAC/college-friendly version**
```
