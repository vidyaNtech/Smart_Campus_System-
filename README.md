# SmartCampus Resource Optimization Platform

A hackathon-winning, intelligent platform for managing campus resources. It features an advanced optimization engine, automated conflict resolution, and beautiful data visualization.

## Quick Start

The platform consists of a Node.js backend and a React/Vite frontend.

### 1. Start the Backend
The backend runs an in-memory MongoDB instance automatically, so you don't need to install a database locally. It will also automatically seed the database with sample users and resources.

```bash
cd backend
npm install
npm start
# Server will run on http://localhost:5000
```

### 2. Start the Frontend
The frontend is built with React, Vite, and TailwindCSS.

```bash
cd frontend
npm install
npm run dev
# App will run on http://localhost:5173
```

## Demo Accounts

You can log in to the system using the following seeded accounts:

- **Admin Account**
  - Email: `admin@example.com`
  - Password: `password`
  - Features: Access to the analytics dashboard, heatmaps, and utilization metrics.

- **User Account**
  - Email: `john@example.com`
  - Password: `password`
  - Features: Access to the calendar booking interface and intelligent conflict resolution.
