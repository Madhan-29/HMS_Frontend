<div align="center">

# 🏠 Hostel Management System — Frontend

A modern, responsive hostel management dashboard built with **React 19** + **Vite**, featuring JWT authentication, role-based access control, and a sleek glassmorphism dark UI.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/register with token-based auth & auto role extraction
- 🛡️ **Role-Based Access Control** — Separate Admin & User dashboards with protected routes
- 🏠 **Room Management** — View room details, availability, and capacity
- 🛏️ **Room Allocation** *(Admin)* — Allocate & vacate rooms for students
- 📌 **Attendance Tracking** — Students mark attendance; admins view attendance history
- 👤 **Profile Management** — Mandatory profile setup on first login + editable profiles
- 🌑 **Dark Glassmorphism UI** — Beautiful frosted-glass cards with gradient backgrounds
- ⚡ **Blazing Fast** — Powered by Vite for instant HMR and fast builds

---

## 🏗️ Architecture

```
src/
├── pages/                  # All page components
│   ├── Login.jsx           # User login
│   ├── Register.jsx        # New user registration
│   ├── Dashboard.jsx       # Main dashboard (role-aware)
│   ├── Rooms.jsx           # Room listing & details
│   ├── Attendance.jsx      # Student attendance marking
│   ├── Allocations.jsx     # 🔒 Admin: Room allocation
│   ├── AdminAttendance.jsx # 🔒 Admin: Attendance history
│   ├── ProfileSetup.jsx    # First-time profile setup
│   └── ProfileEdit.jsx     # Edit existing profile
│
├── routes/                 # Route guards
│   ├── AdminRoute.jsx      # Restricts access to ROLE_ADMIN
│   └── ProfileGuard.jsx    # Ensures profile is completed
│
├── services/               # API layer
│   ├── api.js              # Axios instance config
│   ├── authService.js      # Login, Register, Logout, Role check
│   └── profileService.js   # Profile CRUD operations
│
├── utils/
│   └── jwtHelper.js        # JWT decode & token utilities
│
├── App.jsx                 # Root component with all routes
├── App.css                 # Global styles
├── index.css               # Base styles & resets
└── main.jsx                # Entry point
```

---

## 🛠️ Tech Stack

| Layer          | Technology              |
|----------------|-------------------------|
| **Framework**  | React 19                |
| **Build Tool** | Vite 7                  |
| **Routing**    | React Router DOM 7      |
| **HTTP Client**| Axios                   |
| **Auth**       | JWT (jwt-decode)        |
| **Styling**    | CSS (Glassmorphism)     |
| **Backend**    | Spring Boot *(separate repo)* |

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API

    U->>F: Enter credentials
    F->>B: POST /auth/login
    B-->>F: JWT Token
    F->>F: Decode JWT → Extract roles
    F->>F: Store token + roles in localStorage

    alt First Login
        F->>U: Redirect → /profile-setup
    else Returning User
        F->>U: Redirect → /dashboard
    end

    Note over F: AdminRoute checks ROLE_ADMIN
    Note over F: ProfileGuard ensures profile exists
```

---

## 👤 Role-Based Access

| Page               | User ✅ | Admin ✅ |
|--------------------|---------|----------|
| Dashboard          | ✅      | ✅       |
| View Rooms         | ✅      | ✅       |
| Mark Attendance    | ✅      | ✅       |
| Edit Profile       | ✅      | ✅       |
| Room Allocation    | ❌      | ✅       |
| Admin Attendance   | ❌      | ✅       |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node.js)
- Backend API running *(Spring Boot — separate repo)*

### Installation

```bash
# Clone the repository
git clone https://github.com/Madhan-29/HMS_Frontend.git

# Navigate to project directory
cd HMS_Frontend/hms-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173** 🚀

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔗 API Configuration

The frontend connects to the backend via Axios. Update the base URL in:

```
src/services/api.js
```

```js
const api = axios.create({
  baseURL: "http://localhost:8080/api",  // ← Your Spring Boot backend URL
});
```

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| **Login** | Clean login form with JWT authentication |
| **Register** | New user registration |
| **Dashboard** | Role-aware hub with action cards for navigation |
| **Rooms** | Browse all hostel rooms with availability status |
| **Attendance** | Students mark daily attendance |
| **Allocations** | Admin panel for room allocation & vacation |
| **Admin Attendance** | Admin view of all student attendance records |
| **Profile Setup** | Mandatory first-login profile completion |
| **Profile Edit** | Update existing profile information |

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by **Madhan M**

</div>
