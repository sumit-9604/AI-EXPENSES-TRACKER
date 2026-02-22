# AI Expense Tracker

An AI-powered full-stack expense tracking web application that helps users manage expenses, analyze spending, and predict future expenses.

## Live Demo

Frontend: https://ai-expenses-tracker9604.netlify.app
Backend: https://ai-expenses-tracker.onrender.com


## Features

• User authentication (Signup/Login)
• Add, delete, and view expenses
• AI-based expense categorization
• Expense prediction system
• Analytics dashboard with charts
• Secure REST API
• Fully deployed frontend and backend

## Tech Stack

Frontend:

* React.js
* Vite
* Chart.js
* Axios

Backend:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

Deployment:

* Netlify (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

## Project Structure

server/

* models/
* routes/
* ai/
* db.js
* server.js

client/

* components/
* pages/
* api/

## Installation (Local Setup)

Clone repository

git clone https://github.com/yourusername/ai-expenses-tracker.git

Install backend dependencies

cd server
npm install

Install frontend dependencies

cd client
npm install

---

## Environment Variables

Create .env file in server folder:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000

---

## Run Locally

Backend:

npm run dev

Frontend:

npm run dev

---

## API Endpoints

Auth:
POST /api/auth/register
POST /api/auth/login

Expenses:
GET /api/expenses
POST /api/expenses
DELETE /api/expenses/:id

Analytics:
GET /api/analytics

---

## Deployment

Frontend deployed on Netlify
Backend deployed on Render
Database hosted on MongoDB Atlas

---

## Author

Sumit Chaudhary

GitHub: https://github.com/sumit-9604
LinkedIn:www.linkedin.com/in/sumit-chaudhary9604

---

## Future Improvements

• Real AI model integration
• Mobile app version
• Export reports
• Advanced predictions

---

## License

This project is open source and free to use.

##DEPENDENCIES##
<img width="1567" height="834" alt="Screenshot 2026-02-18 233547" src="https://github.com/user-attachments/assets/9ba5c143-7cf7-4bfa-8017-2e06bcde96d9" />

