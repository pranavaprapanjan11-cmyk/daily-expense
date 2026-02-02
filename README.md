# Daily Expense Manager

A full-featured Daily Expense Manager application built for students. Track your daily spending, categorize expenses, and visualize your financial habits.

## Features

- **Key Functionality**:
    - Add, Edit, Delete expenses.
    - Categorize expenses (Food, Travel, etc.).
    - Interactive Dashboard with Total Spending summary.
    - Visual Charts: Pie Chart (Category distribution) and Bar Chart (Last 7 days trend).
    - Secure Authentication (Register/Login).
    - Mobile-first responsive design.
- **Tech Stack**:
    - **Frontend**: Next.js 14, Tailwind CSS, Recharts, Axios, Lucide React.
    - **Backend**: Node.js, Express, Mongoose, JWT.
    - **Database**: MongoDB.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB installed and running locally on default port (27017).

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Seed Data
Register a new user to start adding expenses. The dashboard will populate automatically.

## API Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/expenses` - Get expenses
- `POST /api/expenses` - Add expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get summary stats
