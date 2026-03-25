# 📱 Recharge Portal - Full Stack Web Application

[![React](https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20(Express)-339933?logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%20(Sequelize)-4479A1?logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A comprehensive, production-ready full-stack recharge system designed for fast, secure, and reliable mobile, bill, and digital asset payments.

---

## 🚀 Project Overview

**Recharge Portal** is a high-performance web application that enables users to perform instant mobile recharges, bill payments (Electricity, Water, Gas), and digital asset management. Built with a modern tech stack, it provides a seamless user experience, secure payment processing, and real-time transaction updates.

### 💼 Real-World Use Case
- **Recharge System**: Instant Prepaid/Postpaid mobile recharges.
- **Bill Payments**: Centralized portal for utility bills (Electricity, Water, Gas, Landline).
- **Payment Processing**: Integrated with Razorpay for secure transactions.
- **Admin Management**: Dedicated dashboard for monitoring system health, users, and transactions.

---

## ✨ Features

- **🔐 User Authentication**: Secure Login/Register system using Firebase Authentication integrated with a Node.js backend.
- **💳 Recharge Functionality**: Support for Mobile, Card, Broadband, Landline, Cable TV, Electricity, Gas, and Water payments.
- **📊 Admin Dashboard**: Real-time stats, user management, transaction monitoring, system configuration, and cashback rule management.
- **🔌 API Integration**: Robust RESTful API architecture with error handling and rate limiting.
- **⚡ Real-time Updates**: Socket.io integration for instant status updates.
- **🛡️ Security**: IP whitelisting for admin routes and JWT-based authentication middleware.
- **📱 Responsive UI**: Beautifully designed, mobile-first interface using Tailwind CSS and GSAP animations.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, GSAP, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MySQL (using Sequelize ORM) |
| **Auth** | Firebase Authentication |
| **Payments** | Razorpay SDK |
| **Tools** | Axios, Dotenv, Concurrently, Nodemon, bcrpytjs |

---

## 📂 Folder Structure

```text
recharge-portal/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/         # Images & static assets
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Theme)
│   │   ├── pages/          # Application pages (Home, Dashboard)
│   │   └── services/       # API & Firebase services
│   └── package.json
├── server/                 # Backend (Node + Express)
│   ├── config/             # DB & Firebase config
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & Security middleware
│   ├── models/             # Sequelize models (MySQL)
│   ├── routes/             # API Endpoints
│   └── package.json
├── package.json            # Root scripts (Concurrently)
└── .env                    # Environment variables (Root)
```

---

## ⚙️ Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/recharge-portal.git
cd recharge-portal
```

### 2. Install Dependencies
Install all dependencies for root, client, and server using the built-in script:
```bash
npm run install-all
```

### 3. Setup Environment Variables
Create a `.env` file in the **server/** directory (and optionally root):
```env
# Server Config
PORT=5000
NODE_ENV=development

# Database (MySQL)
DB_HOST=localhost
DB_NAME=recharge_portal
DB_USER=root
DB_PASSWORD=your_password

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

### 4. Setup Database
1. Open your MySQL client (e.g., MySQL Workbench, XAMPP).
2. Create a new database named `recharge_portal`.
3. The server will automatically sync and create tables on the first run using Sequelize.

### 5. Run the Application
Start both the client and server concurrently from the root directory:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Backend**: [http://localhost:5000/](http://localhost:5000/)

---

## 📜 Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `concurrently ...` | Runs both client and server in development mode |
| `npm run server` | `nodemon index.js` | Runs only the backend server with hot-reload |
| `npm run client` | `vite` | Runs only the frontend client |
| `npm run install-all` | `npm install ...` | Installs all dependencies for the entire project |

---

## 📡 API Endpoints

### 📲 Recharge Routes (`/api/recharge`)
- `POST /detect-operator` - Detects mobile operator from number.
- `POST /create-order` - Creates a Razorpay order.
- `POST /verify-payment` - Verifies the payment signature.
- `GET /offers/:operator` - Fetches dynamic offers for an operator.

### 🛡️ Admin Routes (`/api/admin`)
- `GET /stats` - Retrieves system-wide analytics.
- `GET /users` - Lists all registered users.
- `GET /transactions` - Lists all transaction history.
- `POST /settings` - Updates global system settings.
- `POST /cashback-rules` - Creates new cashback triggers.

---

## 🗄️ Database Schema (Basic)

- **Users**: `id`, `name`, `email`, `role`, `wallet_balance`, `created_at`
- **Transactions**: `id`, `user_id`, `amount`, `type`, `status`, `razorpay_order_id`, `created_at`
- **CashbackRules**: `id`, `trigger_amount`, `cashback_percent`, `is_active`

---

## 📸 Screenshots (Placeholders)

> *Add your screenshots here after deployment*
> ![Home Page](https://via.placeholder.com/800x400?text=Home+Page+Preview)
> ![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard+Preview)

---

## 🚢 Deployment Guide

### **Backend (Node.js)**
1. Host on platforms like **Render**, **Railway**, or **AWS EC2**.
2. Configure Environment Variables on the platform.
3. Use a managed MySQL database (e.g., **Aiven**, **PlanetScale**, or **AWS RDS**).

### **Frontend (React)**
1. Build the project: `npm run build` inside the `client/` folder.
2. Deploy the `dist/` folder to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 🛠️ Common Errors & Fixes

- **Port already in use (5000)**:
  - *Fix*: Change the `PORT` in `.env` or kill the process using `npx kill-port 5000`.
- **Database Connection Error**:
  - *Fix*: Ensure MySQL service is running and credentials in `.env` match your local setup.
- **Firebase Auth Initialization Error**:
  - *Fix*: Check if the `FIREBASE_PRIVATE_KEY` is correctly formatted in your `.env`.

---

## 🔮 Future Improvements
- [ ] 📱 Native Mobile App using React Native.
- [ ] 💳 Integration with more payment gateways (Stripe, PayPal).
- [ ] 🧾 Automated PDF receipt generation.
- [ ] 🤖 AI-powered recharge reminders.

---

## 👨‍💻 Author
**Your Name / Team Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [yourportfolio.com](https://yourportfolio.com)

---

*Made with ❤️ for a better recharge experience.*
