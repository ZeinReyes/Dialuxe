# 📦 Dialuxe – Luxury Watch Ecommerce Platform

Dialuxe is a full-stack MERN (MongoDB, Express, React, Node.js) eCommerce platform focused on showcasing and delivering high-end luxury watches. Unlike typical marketplaces, Dialuxe operates as a single-vendor store—**the company is the exclusive seller**. The platform supports three primary user roles: **Client**, **Admin**, and **Rider**.

---

## 🚀 Features

### 🛍 Clients
- Browse luxury watches with detailed specs and images.
- Add items to cart and proceed to checkout.
- Track orders in real-time via integrated maps.
- Receive email notifications about orders.

### ⚙️ Admin
- Manage products (CRUD operations).
- View user accounts and assign roles.
- Monitor and log product updates.
- Oversee all orders and delivery statuses.

### 🛵 Rider
- View assigned deliveries.
- Update delivery status.
- Send real-time location updates for order tracking.

---

## 🧰 Tech Stack

- **Frontend:** React, React Router, Bootstrap, Leaflet
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Maps & Routing:** Leaflet + OpenRouteService API
- **Authentication:** JWT-based auth
- **Styling:** Bootstrap 5

---

## 🔧 Setup Instructions

1. **Clone the repository**
- git clone https://github.com/yourusername/dialuxe.git
- cd dialuxe
2. **Install dependencies**
- cd backend && npm install
- cd ../frontend && npm install
3. **Configure .env**
- PORT=5000
- MONGO_URI=your_mongo_connection_string
- JWT_SECRET=your_secret_key
4. **Run the app**
- cd backend
- npm start
- cd frontend
- npm start
