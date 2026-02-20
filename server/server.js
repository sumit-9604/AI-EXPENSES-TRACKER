/* eslint-env node */
import path from "path";
import express from 'express';
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./models/user.js";
import authRoute from "./routes/authroutes.js";
import expenseRoutes from "./routes/expensesroutes.js"
import analyticRoute from "./routes/analyticroutes.js";
const __dirname = path.resolve();
dotenv.config();

const app = express();


app.use(cors({
  origin: "https://ai-expenses-tracker.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api/auth", authRoute);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analytics", analyticRoute);
app.use("/api/user", userRoutes);


app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully 🚀" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});







