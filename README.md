# softskills-web

# Internal Learning Platform

This project aims to develop an **internal learning platform**, similar to Udemy, designed for corporate or academic environments.

The platform supports synchronous and asynchronous courses, file sharing (PDFs, documents, videos), assignment submissions, and user interaction through a discussion forum.

---

## Main Features

* **Course Management**

  * Create, edit, and enroll in courses.
  * Support for synchronous (live sessions) and asynchronous (recorded content) courses.

* **Study Materials**

  * Upload and manage files: PDFs, DOCX, videos, slides, and more.
  * Files stored in **MinIO Object Storage**.

* **Discussion Forum**

  * Dedicated space for sharing questions, answers, and knowledge among users.

* **Assignment Submissions**

  * Submit and validate assignments and projects linked to courses.

* **Authentication & User Profiles**

  * User registration and login.
  * User profiles with course history and activity tracking.

---

## Tech Stack

### Frontend

* **React** (modular and reusable components).
* **MaterialUI** for responsive UI.
* API integration with the backend.

### Backend

* **Node.js / Express** for REST API.
* **Sequelize ORM** for database interaction.
* Authentication and authorization management.

### Database

* **PostgreSQL** for relational data management (users, courses, forum, submissions).

### Object Storage

* **MinIO** for file storage (videos, PDFs, docs).

---

## Project Structure

```
Backend:
backend/
├── controllers/            # Business logic (API controllers)
├── cron/                   # Scheduled tasks (cron jobs)
├── models/                 # Sequelize models
├── routes/                 # API routes
├── services/               # Reusable services & helpers
├── app.js                  # Express server setup
├── bdConexao.js            # PostgreSQL database connection
├── minio.js                # MinIO client setup
├── notificationWorker.js   # Background worker for notifications
└── tokenUtils.js           # Token generation & validation

Frontend:
frontend/
├── components/             # Reusable UI components
├── config/                 # Configurations (API endpoints, constants)
├── images/                 # Static images and icons
├── modals/                 # Reusable modal components
├── pages/                  # Main application pages
├── utils/                  # Utility functions/helpers
├── App.css                 # Main app styling
├── App.js                  # Main React component
```

## Project Goal

The main goal was to build a complete **internal e-learning and knowledge-sharing platform** that integrates:

* Synchronous and asynchronous courses.
* File upload and management in object storage.
* User discussion forum.
* Assignment submissions and tracking.

---

## Team

Alexandre Marques — Team Manager | Fullstack Developer | Database Manager | Object Storage Manager (MinIO) | Server Deploy
Rodrigo Marques — Fullstack Developer
Tiago Carvalho — Frontend Developer

---
