# LBRCE Digital Notice Board Web Application

A centralized digital notice board web application for **Lakireddy Bali Reddy College of Engineering (LBRCE)** built using the MERN stack architecture with React, Node.js, Express, and JWT Authentication.

---

## 🚀 Features

- **Role-Based Access Control**:
  - **Administrators**: Create, edit, delete, pin high-priority notices, and view category-wise statistics on a dedicated dashboard.
  - **Students**: Search, filter by category (Academic, Examination, Events, Placement, General), and view complete notices.
- **Security**:
  - Passwords hashed with `bcryptjs`.
  - Stateless authentication via JSON Web Tokens (`jsonwebtoken`).
  - Protected API routes and admin middleware checks.
- **Pre-Loaded Sample Data**:
  - Sample academic announcements, placement drives, and technical fest notifications (Lakshya).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express.js
- **Authentication**: JWT & bcryptjs
- **HTTP Client**: Axios

---

## 📦 How to Run Locally

### 1. Prerequisites
Ensure you have Node.js (version 18 or higher) installed:
```bash
node -v
npm -v
```

### 2. Install Dependencies
In the root directory of the project, run:
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
(Optional: customize `JWT_SECRET` or specify a `MONGODB_URI` if connecting to an external MongoDB instance).

### 4. Start the Application
Run the full-stack development server:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Default Demo Accounts

- **Administrator:**
  - Email: `admin@college.edu`
  - Password: `Admin@123`
- **Student:**
  - Email: `student@college.edu`
  - Password: `Student@123`

*(You can also use the one-click demo credentials button on the login screen or register a new student account).*
