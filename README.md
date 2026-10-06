# Full-Stack To-Do List Application

A production-grade, secure, responsive Full-Stack To-Do List application built with **React**, **Express.js**, and **Supabase (PostgreSQL + Auth + RLS)**.

---

## 🌟 Architecture Overview

- **Frontend:** React (Vite) + Tailwind CSS + Lucide Icons + React Router DOM
- **Backend:** Node.js + Express.js + Zod Validation + Helmet + CORS
- **Database & Auth:** Supabase PostgreSQL + Row Level Security (RLS) + JWT Auth

```
React Frontend (Vite)  <--->  Express REST API  <--->  Supabase PostgreSQL (RLS)
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- Supabase project credentials

### 2. Apply Database Migrations
Migrations have already been applied to Supabase, but if needed:
```bash
npm run migrate
```

### 3. Start Backend Server
In a terminal:
```bash
npm run dev:server
```
Backend runs at `http://localhost:5000` (Health check: `http://localhost:5000/health`).

### 4. Start Frontend Client
In a second terminal:
```bash
npm run dev:client
```
Frontend runs at `http://localhost:5173`.

---

## 📂 Project Structure

```
bts/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, TaskForm, TaskList, TaskItem, etc.)
│   │   ├── context/        # AuthContext (Supabase Auth state)
│   │   ├── pages/          # LoginPage, RegisterPage, DashboardPage, NotFoundPage
│   │   ├── services/       # api.js, supabaseClient.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express Backend REST API
│   ├── src/
│   │   ├── config/         # env.js, supabase.js
│   │   ├── controllers/    # task.controller.js
│   │   ├── middleware/     # auth.middleware.js, validate.middleware.js, errorHandler.js
│   │   ├── routes/         # task.routes.js
│   │   ├── schemas/        # task.schema.js (Zod)
│   │   ├── services/       # task.service.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── supabase/               # Database Migrations & Runner
│   ├── migrations/         # 001_initial_schema.sql
│   └── scripts/            # migrate.js
│
└── package.json            # Root workspace scripts
```

---

## 🔒 Security & Data Isolation

- **Row Level Security (RLS):** All queries and mutations in PostgreSQL enforce `auth.uid() = user_id`.
- **JWT Verification:** All `/api/tasks` endpoints authenticate via Supabase Auth Bearer tokens.
- **Zod Validation:** All client input is validated and sanitized on the server before database execution.
- **Client Key Isolation:** `SUPABASE_SERVICE_ROLE_KEY` is kept strictly server-side.
