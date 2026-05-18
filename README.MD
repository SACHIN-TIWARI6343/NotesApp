# NotesApp — Backend API

A secure and scalable RESTful API for managing personal notes, 
built with Node.js, Express, and MongoDB Atlas.

---

## Live URL
https://notesapp-2lkp.onrender.com

## API Docs
https://notesapp-2lkp.onrender.com/openapi.json

---

## Tech Stack
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- JWT Authentication
- bcrypt Password Hashing
- OpenAPI 3.0 Documentation
- Deployed on Render

---

## Features
- User Registration & Login with JWT
- Create, Read, Update, Delete Notes
- Share Notes with other users by email
- Archive & Unarchive Notes
- Strong Input Validation
- Secure Password Hashing
- Protected Routes with Auth Middleware
- OpenAPI Documentation

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /register | Register new user | No |
| POST | /login | Login and get token | No |
| GET | /notes | Get all notes | Yes |
| POST | /notes | Create a note | Yes |
| GET | /notes/:id | Get note by ID | Yes |
| PUT | /notes/:id | Update a note | Yes |
| DELETE | /notes/:id | Delete a note | Yes |
| POST | /notes/:id/share | Share note by email | Yes |
| PATCH | /notes/:id/archive | Archive/Unarchive note | Yes |
| GET | /about | About this API | No |
| GET | /openapi.json | API Documentation | No |

---

## Authentication
All protected routes require a Bearer token in the header:
Authorization: Bearer <your_jwt_token>

---

## Custom Feature
**Archive Notes** — Toggle archive status of any note using:
PATCH /notes/:id/archive
Returns updated note with `archived: true` or `archived: false`

---

## Local Setup
```bash
git clone https://github.com/SACHIN-TIWARI6343/NotesApp.git
cd NotesApp
npm install
```

Create a `.env` file:
MONGODB_URI=my_mongodb_atlas_uri
JWT_SECRET=my_jwt_secret
PORT=my_server_port

```bash
nodemon src/server.js
```

---

## Future Improvements
- Dockerize the application
- Add automated unit and integration tests
- Add pagination for notes listing
- Add email notifications for shared notes
- Add role-based access control

---

## Developer
**Sachin Tiwari**
tiwarisachin6343@gmail.com
github.com/SACHIN-TIWARI6343