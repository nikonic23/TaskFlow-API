# Scalable REST API with Authentication & RBAC

A full-stack scalable REST API project built using Flask, React, and MySQL.

---

# Tech Stack

## Backend
- Flask
- Flask JWT Extended
- SQLAlchemy
- MySQL
- Marshmallow
- Swagger

## Frontend
- React.js
- Vite
- Axios
- React Router DOM

---

# Features

## Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing

## Authorization
- Role-Based Access Control
- Admin/User Roles
- Protected Routes

## Task Management
- Create Tasks
- Read Tasks
- Update Tasks
- Delete Tasks

## Security
- JWT Protected APIs
- Password Encryption
- Validation & Sanitization

## Documentation
- Swagger API Docs
- RESTful API Design

---

# Project Structure

backend/
frontend/

---

# API Endpoints

## Auth

POST /api/v1/auth/register

POST /api/v1/auth/login

GET /api/v1/auth/profile

---

## Tasks

GET /api/v1/tasks/

GET /api/v1/tasks/<id>

POST /api/v1/tasks/

PUT /api/v1/tasks/<id>

DELETE /api/v1/tasks/<id>

---

# Installation

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt