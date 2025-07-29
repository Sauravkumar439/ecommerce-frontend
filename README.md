# AI-Powered E-Commerce Store

A full-stack, AI-ready e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js), designed for modern shopping experiences with powerful admin capabilities and a beautiful UI/UX.

---

## 🚀 Project Overview

This project includes both **user-facing features** (browsing, cart, checkout, profile) and an **admin dashboard** for managing orders, products, and users. The admin panel includes statistics, revenue graphs, and real-time updates.

---

## 📊 Features

### 👩‍🎓 User Side:

* User registration & login (JWT based)
* Browse products by category
* View product details
* Add items to cart and checkout
* View order history
* Update profile (image & password)

### 📈 Admin Side:

* Admin login with route protection
* View, confirm, reject, and mark orders as delivered
* View dashboard statistics (users, products, orders, revenue)
* Graph: Revenue trends for 7 & 30 days
* Manage products (Add/Edit/Delete)
* Manage users (non-admin only)
* Fully responsive sidebar layout

---

## 📚 Tech Stack

### 🔧 Backend:

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* Cloudinary (Image Upload)
* Render (Deployment)

### 🌈 Frontend:

* React + Tailwind CSS
* Framer Motion (Animations)
* Context API (Cart & Auth)
* React Router DOM
* Netlify (Deployment)

---

## 📂 Folder Structure

```
E-commerce/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── App.jsx
```

---

## 🔢 Environment Variables

### Frontend (`.env`)

```
VITE_API_BASE_URL=/api
```

### Backend (`.env`)

```
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_CLOUD_NAME=<cloudinary_name>
CLOUDINARY_API_KEY=<cloudinary_key>
CLOUDINARY_API_SECRET=<cloudinary_secret>
```

---

## 📦 Install & Run Locally

### Backend:

```bash
cd backend
npm install
nodemon server.js
```

### Frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 📋 Sample Product Upload (Postman)

Send a `POST` request to `/api/products` using:

```json
{
  "title": "Sony WH-1000XM5",
  "description": "Noise Cancelling Wireless Headphones",
  "images": ["https://images.unsplash.com/photo-..."],
  "price": 24999,
  "category": "Electronics",
  "stock": 30
}
```

Repeat for bulk upload across 10 categories.

---

## 🔄 Admin API Endpoints

| Route                           | Method | Description       |
| ------------------------------- | ------ | ----------------- |
| `/api/admin/orders`             | GET    | Get all orders    |
| `/api/admin/orders/:id/confirm` | PUT    | Confirm order     |
| `/api/admin/stats`              | GET    | Get total stats   |
| `/api/admin/revenue?days=7`     | GET    | Get revenue graph |

All routes use `adminMiddleware` for access control.

---

## ✅ Completed Features Checklist

* [x] Full user-side flow (browse, cart, checkout)
* [x] Full admin panel with charts & stats
* [x] Cloudinary image upload (unsigned)
* [x] Product management with real images
* [x] JWT Auth with route protection
* [x] Deploy frontend to Netlify
* [x] Deploy backend to Render

---

## 👍 Credits

* Backend Hosting: [Render](https://ecommerce-backend-vi8k.onrender.com)
* Frontend Hosting: [Netlify](https://e-commerceai.netlify.app/)
* Built by: **Saurav Kumar**

---

## 📄 License

This project is open source under the MIT License.
