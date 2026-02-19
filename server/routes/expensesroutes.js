import express from "express";
import Expenses from "../models/expenses.js";
import auth from "../auth.js";  

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const newExpense = new Expenses({
      title,
      amount,
      category,
      userid: req.user.id
    });

    await newExpense.save();
    res.json(newExpense);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/", auth, async (req, res, next) => {
  try {
    const expensesList = await Expenses
      .find({ userid: req.user.id })
      .sort({ createdAt: -1 });

    res.json(expensesList);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id" , auth, async(req,res,next) =>{
  try{
    const deleted = await Expenses.findOneAndDelete({
      _id: req.params.id,
      userid: req.user.id,
    });

    if(!deleted){
      return res.status(404).json({message:"expense not found"});}

    res.json({message:"expense deleted successfully"});
  }catch(err){
    console.error("delete error : ", err);
    next(err);
  }
});


export default router;
