# 💰 MERN Expense Tracker

![MERN Expense Tracker Hero](https://via.placeholder.com/1200x600?text=Premium+MERN+Expense+Tracker)

A full-stack, interview-ready expense tracking application featuring a premium "glassmorphism" aesthetic, real-world engineering problem solving, and robust authentication.

## 🌟 Key Features

*   **Idempotent API Design:** Handles double-clicks, slow networks, and race conditions gracefully. Ensuring only one reliable record is inserted per request.
*   **Secure Authentication:** Secure user signup and login protected via JSON Web Tokens (JWT). Private routing restricts access to the dashboard.
*   **Dynamic Dashboard:**
    *   Add expenses with amounts, categories, dates, and descriptions.
    *   Sort expenses (newest/oldest) and filter by specific categories.
    *   Real-time total expenditure calculation based on active filters.
    *   Glassmorphic UI design featuring subtle micro-animations and gradients.
*   **Responsive Layout:** Fully responsive UI built with vanilla CSS variables and intelligent flex/grid layouts.

---

## 🛠 Tech Stack

*   **Frontend:** React (Vite), React Router DOM, Context API, Axios.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB, Mongoose.
*   **Security & Utils:** JWT, bcryptjs, Dotenv, CORS.
*   **Testing:** Jest, Supertest *(API validation)*.

---

## 🚀 How to Run

### 1. Prerequisites
*   [Node.js](https://nodejs.org/en/) (v16+. Recommended: v18+)
*   [MongoDB](https://www.mongodb.com/try/download/community) running locally or a MongoDB Atlas URI string.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. There should be a `.env` file in the `backend` folder containing:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server (dev mode):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a *new* terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive a JWT | ❌ |
| `GET` | `/api/auth/me` | Get the currently logged in user's details | ✅ |

### 💸 Expenses (`/api/expenses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/expenses` | Retrieve current user's expenses (Supports `?category=...&sort=...`) | ✅ |
| `POST` | `/api/expenses` | Create a new expense (Must include `idempotencyKey` in body) | ✅ |
| `DELETE` | `/api/expenses/:id`| Delete an expense | ✅ |

---

## 🏛 Design Decisions & Engineering Highlights

### 1. Idempotent POST Requests
In physical transaction processing flows (like Stripe or standard payment environments), network latency can cause users to submit forms multiple times.
This repository elegantly handles duplicate prevention:
1. The client generates a unique `idempotencyKey` globally unique identifier (`crypto.randomUUID()`) on initial submit.
2. The server intercepts requests via `/api/expenses` and queries the database for matches against this key.
3. If the key exists, the backend halts processing and safely returns a 200 OK along with the previously submitted data (`isDuplicate: true`), rather than throwing an error crashing the client, or mutating the database inappropriately.
4. Mongoose possesses a database level `unique: true` constraint on the `idempotencyKey`, providing a critical layer of defense against race conditions.

### 2. Multi-tier State Separation
Authentication state is managed intelligently via the native generic Context API wrapper (`AuthContext.jsx`), negating the necessity for hefty unneeded libraries like Redux for simplistic token verification flows. The Context API seamlessly governs the `PrivateRoute` & `PublicRoute` handlers in the frontend.

### 3. Seamless Security (JWT)
Protected routes verify standard structural `Authorization: Bearer <TOKEN>` mechanisms, ensuring only authenticated instances interact with MongoDB collections. The backend natively isolates documents explicitly utilizing `req.user._id` bindings per query.

---

## 🧪 Testing

This project incorporates robust isolated routing validation using `Jest` alongside `mongodb-memory-server` ensuring production models, unique key constraints, and authorization flows behave completely as anticipated without wiping actual local MongoDB databases.

To run the unit tests:
```bash
cd backend
npm test
```

---

> Built with ❤️ using the MERN Stack.
