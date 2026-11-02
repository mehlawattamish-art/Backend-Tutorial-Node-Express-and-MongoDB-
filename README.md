# Backend Tutorial: Node.js, Express, MongoDB & Postman

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

This repository contains the complete, step-by-step implementation of the freeCodeCamp tutorial: **["Intro to Backend Web Development – Node.js & Express Tutorial for Beginners"](https://www.youtube.com/watch?v=KOutPbKc9UM)**.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Folder Structure](#architecture--folder-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup Guide](#step-by-step-setup-guide)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Setup Online MongoDB Atlas Database](#3-setup-online-mongodb-atlas-database)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Run the Server](#5-run-the-server)
- [API Reference](#api-reference)
  - [User Authentication Endpoints](#user-authentication-endpoints)
  - [Post CRUD Endpoints](#post-crud-endpoints)
- [Testing APIs with Postman](#testing-apis-with-postman)
- [Key Concepts for 3rd Evaluation](#key-concepts-for-3rd-evaluation)

---

## 🎯 Overview

This project implements a RESTful backend server following modern JavaScript best practices (ES Modules, async/await, clean Model-Route-Controller pattern). It connects to MongoDB Atlas cloud database to store user accounts and blog posts.

---

## ✨ Key Features

1. **User Authentication**:
   - Registration with duplicate email check and field validation.
   - Secure password hashing using `bcrypt` (salt factor 10) in Mongoose pre-save hook.
   - Login endpoint verifying hashed passwords.
   - Logout endpoint.
2. **Complete CRUD on Posts**:
   - **Create**: Add new posts with validated fields (`name`, `description`, `age`).
   - **Read**: Fetch all post documents.
   - **Update**: Patch specific posts by MongoDB `_id` with non-empty payload validation.
   - **Delete**: Remove post documents by MongoDB `_id`.
3. **Clean Architecture**:
   - Separation of concerns into `config`, `models`, `controllers`, and `routes`.
4. **Postman Desktop Ready**:
   - Includes `postman_collection.json` for one-click import into the Postman Desktop App.

---

## 🏗️ Architecture & Folder Structure

```
intro-to-backend/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── constants.js       # App constants (e.g. DB_NAME)
│       │   └── database.js        # Mongoose database connection logic
│       ├── controllers/
│       │   ├── post.controller.js # CRUD handlers for posts
│       │   └── user.controller.js # Register, login, and logout handlers
│       ├── models/
│       │   ├── post.model.js      # Post Schema and Mongoose Model
│       │   └── user.model.js      # User Schema, bcrypt hashing hook, comparePassword
│       ├── routes/
│       │   ├── post.route.js      # Express router for post endpoints
│       │   └── user.route.js      # Express router for user endpoints
│       ├── app.js                 # Express app setup and middleware configuration
│       └── index.js               # Entry point: loads .env, connects DB, starts server
├── .env.example                   # Sample environment configuration
├── .gitignore                     # Git ignore rules for node_modules, .env, etc.
├── package.json                   # Project metadata, dependencies, and scripts
├── postman_collection.json        # Pre-configured Postman test suite
└── README.md                      # Comprehensive project documentation
```

---

## 📋 Prerequisites

- **Node.js** (v18 or higher recommended; run `node -v` to check)
- **npm** (run `npm -v` to check)
- **Git** (run `git --version` to check)
- **Postman Desktop App** ([Download from postman.com](https://www.postman.com/downloads/))
- **Free MongoDB Atlas Account** ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

---

## 🚀 Step-by-Step Setup Guide

### 1. Clone Repository

```bash
git clone https://github.com/mehlawattamish-art/Backend-Tutorial-Node-Express-and-MongoDB-.git
cd Backend-Tutorial-Node-Express-and-MongoDB-
```

### 2. Install Dependencies

```bash
npm install
```

Installed packages:
- `express`: Fast, unopinionated web framework for Node.js
- `mongoose`: MongoDB object modeling tool
- `dotenv`: Loads environment variables from `.env`
- `bcrypt`: Library to hash and salt passwords
- `nodemon`: Development tool that restarts server on code changes

### 3. Setup Online MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in (or create a free account).
2. Click **Create a Deployment** and select the **M0 Free Tier** cluster.
3. Under **Security Quickstart**:
   - Create a Database User (e.g. username `tamish`, set a password you will remember).
   - Under **Where would you like to connect from?**, select **My Local Environment**.
   - Add IP address `0.0.0.0/0` (Allow Access from Anywhere) so your laptop can connect.
4. Go to **Database** -> Click **Connect** -> Choose **Drivers** (Node.js).
5. Copy your connection string. It will look like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the credentials you created.

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=4000
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/intro-to-backend?retryWrites=true&w=majority"
```

### 5. Run the Server

- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

When successfully running, you will see in your terminal:
```
MONGODB_URI: mongodb+srv://...
 MongoDB connected !!! Host: cluster0-shard-00-00.xxxxx.mongodb.net
Server is running at port : 4000
```

---

## 📡 API Reference

Base URL: `http://localhost:4000`

### User Authentication Endpoints

#### 1. Register User
- **Method:** `POST`
- **Route:** `/api/v1/users/register`
- **Body:**
  ```json
  {
    "username": "tamish",
    "email": "tamish@example.com",
    "password": "secretPassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "User registered!",
    "user": {
      "id": "6724a1b2c3d4e5f678901234",
      "email": "tamish@example.com",
      "username": "tamish"
    }
  }
  ```

#### 2. Login User
- **Method:** `POST`
- **Route:** `/api/v1/users/login`
- **Body:**
  ```json
  {
    "email": "tamish@example.com",
    "password": "secretPassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "User Logged in",
    "user": {
      "id": "6724a1b2c3d4e5f678901234",
      "email": "tamish@example.com",
      "username": "tamish"
    }
  }
  ```

#### 3. Logout User
- **Method:** `POST`
- **Route:** `/api/v1/users/logout`
- **Body:**
  ```json
  {
    "email": "tamish@example.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

### Post CRUD Endpoints

#### 1. Create Post [CREATE]
- **Method:** `POST`
- **Route:** `/api/v1/posts/create`
- **Body:**
  ```json
  {
    "name": "Tamish Mehlawat",
    "description": "Learning Node.js and Express backend development!",
    "age": 21
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Post created successfully",
    "post": {
      "_id": "6724a5c6d7e8f90123456789",
      "name": "Tamish Mehlawat",
      "description": "Learning Node.js and Express backend development!",
      "age": 21,
      "createdAt": "2026-11-02T11:00:00.000Z",
      "updatedAt": "2026-11-02T11:00:00.000Z"
    }
  }
  ```

#### 2. Get All Posts [READ]
- **Method:** `GET`
- **Route:** `/api/v1/posts/getPosts`
- **Response (200 OK):**
  ```json
  [
    {
      "_id": "6724a5c6d7e8f90123456789",
      "name": "Tamish Mehlawat",
      "description": "Learning Node.js and Express backend development!",
      "age": 21,
      "createdAt": "2026-11-02T11:00:00.000Z",
      "updatedAt": "2026-11-02T11:00:00.000Z"
    }
  ]
  ```

#### 3. Update Post [UPDATE]
- **Method:** `PATCH`
- **Route:** `/api/v1/posts/update/:id`
- **Body:**
  ```json
  {
    "description": "Updated post content for evaluation demo",
    "age": 22
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Post Updated Successfully",
    "post": {
      "_id": "6724a5c6d7e8f90123456789",
      "name": "Tamish Mehlawat",
      "description": "Updated post content for evaluation demo",
      "age": 22,
      "updatedAt": "2026-11-02T11:05:00.000Z"
    }
  }
  ```

#### 4. Delete Post [DELETE]
- **Method:** `DELETE`
- **Route:** `/api/v1/posts/delete/:id`
- **Response (200 OK):**
  ```json
  {
    "message": "Post successfully deleted"
  }
  ```

---

## 📮 Testing APIs with Postman

1. Open **Postman Desktop App**.
2. Click **Import** (top left).
3. Drag and drop `postman_collection.json` located in the root of this project.
4. The collection **"Backend Tutorial - Node Express & MongoDB"** will appear with two folders:
   - `Users (Authentication)`
   - `Posts (CRUD Operations)`
5. Test in sequence:
   - Run `1. Register User` -> Verify `201 Created`
   - Run `2. Login User` -> Verify `200 OK`
   - Run `1. Create Post` -> Verify `201 Created` and copy the returned `_id`
   - Set the collection variable `postId` to that `_id` (or paste into URL)
   - Run `2. Get All Posts` -> Verify your created post is returned
   - Run `3. Update Post` -> Verify the post fields are updated
   - Run `4. Delete Post` -> Verify `200 OK` and post deletion

---

## 🎓 Key Concepts for 3rd Evaluation

| Concept | Explanation |
|---|---|
| **Express Middleware** | Functions like `express.json()` that intercept incoming HTTP requests before reaching route handlers, parsing the request body into `req.body`. |
| **Model-Route-Controller (MRC)** | Architectural pattern separating data representation (`models`), endpoint definitions (`routes`), and business logic (`controllers`). |
| **Password Hashing (bcrypt)** | Using a cryptographic one-way hashing function with a salt round (10) in `userSchema.pre('save')` so plaintext passwords are never stored in the database. |
| **Mongoose ODM** | Object Data Modeling library that provides schema validation, types, casting, and query helpers on top of raw MongoDB driver. |
| **HTTP Methods & Idempotency** | `GET` (safe/read), `POST` (create), `PATCH` (partial update), `DELETE` (removal). |
| **HTTP Status Codes** | `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`. |
| **Async / Await Error Handling** | Handling asynchronous database promises using `try...catch` blocks to prevent unhandled rejection crashes. |
