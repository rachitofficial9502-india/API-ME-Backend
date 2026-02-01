# Profile API (Backend)

A minimal, production-readable backend for storing and exposing **a single personal profile** via a REST API.

---

## ✨ Features

- Single-user profile stored in MongoDB Atlas
- Public read-only endpoints
- Authenticated write access (email + password)
- JWT-based authentication & authorization
- Search endpoints for skills and projects
- CORS-enabled (frontend can be separated later)
- Clean, beginner-friendly, production-style codebase

---

## 🧱 Tech Stack

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- CORS

---

## 📁 Project Structure

```
server/
├── index.js # App entry point
├── db.js # MongoDB connection
├── routes.js # API routes
├── Profile.js # Profile schema
├── User.js # Admin user schema
├── auth.js # JWT authorization middleware
```

---

## 🔐 Authentication Model

- Single **admin user**
- Email + hashed password
- Login returns a **JWT**
- JWT required only for write operations

### Protected Routes
- `PUT /api/profile`

### Public Routes
- `GET /api/profile`
- `GET /api/projects`
- Search endpoints

---

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

PORT=3000

On server startup:
Admin user is auto-created if it does not exist
Password is securely hashed

---

## Getting Strated

Install dependencies
npm install

Start the server
npm start

Server runs at:
http://localhost:3000

---

## API Endpoints

Health Check: 
GET /api/health

Get Profile (Public): 
GET /api/profile

Update Profile (Protected): 
PUT /api/profile 
Authorization: Bearer <token>

List Projects: 
GET /api/projects

Search Skills: 
GET /api/search/skills?skill=python

Search Projects by Tech: 
GET /api/search/projects?tech=node

Generic Search: 
GET /api/search?q=ai

