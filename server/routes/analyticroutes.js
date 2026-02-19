import express from "express";
import expense from "../models/expenses.js";
import auth from "../auth.js";
import User from "../models/user.js";
import { predictmonthlyexpenses } from "../ai/predictexpenses.js";

const router = express.Router();

router.get("/summary", auth, async (req, res) => {
  try {
    
    const expenses = await expense.find({ userid: req.user.id });
    const user = await User.findById(req.user.id);
    const {total, prediction} = predictmonthlyexpenses(expenses);

    res.json({
      total,
      prediction,
      salary: user?.salary || 0 
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;