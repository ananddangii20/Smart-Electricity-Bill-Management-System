# ⚡ Smart Electricity Bill Management System

A modern full-stack Electricity Bill Management System built for Indian consumers and electricity providers.
Voltix helps users manage electricity bills, monitor usage, make online payments, and download professional PDF bills with a clean and futuristic UI.

---

# 🚀 Features

## 👤 Consumer Features

* Secure Login & Registration
* View Current & Previous Bills
* Download Bills as PDF
* Online Bill Payments with Razorpay
* Payment Status Tracking
* Electricity Usage Monitoring
* Consumer Profile Management

---

## 🛠️ Admin Features

* Manage Consumers
* Add Meter Readings
* Configure Tariff Slabs
* Generate Bills Automatically
* Track Payments & Transactions
* Monthly Automated Billing System

---

# 🏗️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Razorpay Payment Gateway
* node-cron

---

# 📂 Project Structure

```bash
Voltix/
│
├── client/       # Frontend (React)
│
├── server/       # Backend (Node.js + Express)
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone <your_repo_url>
```

---

## 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key

RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Run backend:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# 🌐 Local URLs

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5000 |

---

# 🔐 Authentication System

Voltix uses:

* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Admin & Consumer Dashboards

---

# 💳 Payment Integration

Integrated with:

* Razorpay
* Demo Test Payments

Supported Payment Methods:

* UPI
* Credit/Debit Cards
* Net Banking
* Wallets

---

# 📄 PDF Bill Download

Consumers can download professional electricity bills containing:

* Consumer Details
* Meter Information
* Electricity Usage
* Tariff Calculation
* Payment Status
* Transaction ID

---

# 📊 Billing Logic

```bash
Units Consumed = Current Reading - Previous Reading
```

Bill amount is calculated using slab-based Indian electricity tariff rates.

### Example Tariff

| Units     | Rate     |
| --------- | -------- |
| 0 - 100   | ₹4/unit  |
| 101 - 300 | ₹6/unit  |
| 301 - 500 | ₹8/unit  |
| 500+      | ₹10/unit |

---

# ⏰ Automated Monthly Billing

Implemented using `node-cron`

```bash
0 0 1 * *
```

Automatically generates bills on:

* 1st day of every month
* 12:00 AM

---

# 🔌 API Routes

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

---

## User

```http
GET /api/user/dashboard
GET /api/user/bills
GET /api/user/bills/:id
```

---

## Admin

```http
GET /api/admin/users
POST /api/admin/user
PUT /api/admin/user/:id
DELETE /api/admin/user/:id
```

---

## Meter

```http
POST /api/meter
```

---

## Billing

```http
POST /api/bill/generate
POST /api/bill/generate-all
```

---

## Tariff

```http
POST /api/tariff
GET /api/tariff
```

---

## Payment

```http
POST /api/payment/create-order
POST /api/payment/verify-payment
POST /api/payment/mock-intent
POST /api/payment/confirm-mock
```

---

# ✨ Key Highlights

* Modern Futuristic UI
* Fully Responsive Design
* Razorpay Integration
* Secure Authentication
* Automated Billing
* Realistic Indian Tariff System
* Downloadable PDF Bills
* Clean Modular Architecture

---

# 🔮 Future Improvements

* SMS Bill Notifications
* Email Receipts
* Smart Meter IoT Integration
* Electricity Usage Charts
* AI-based Usage Prediction
* Mobile App Version
* Multi-language Support

---

# 👨‍💻 Developer

Developed with ❤️ by Anand Dangi

---

# 📜 License

This project is for educational and portfolio purposes.
