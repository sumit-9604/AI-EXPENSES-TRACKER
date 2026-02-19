import { useState,useEffect } from "react";
import API from "../api";
import "../pages/form.css";


export default function ExpenseForm({ 
  onAdd , 
  salary , 
  setSalary ,
  showSalaryInput ,
  onSalarySave }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [salaryInput, setSalaryInput] = useState("");

 useEffect(() => {
    const savedSalary = localStorage.getItem("salary");
    if (savedSalary) {
      setSalary(Number(savedSalary));
    }
  }, [setSalary]);


 const handleSalarySave = async () => {

    const value = Number(salaryInput);

    if (value <= 0) return;

    try {

      await API.post("/auth/salary", { salary: value });

      setSalary(value);

      localStorage.setItem("salary", value);

      setSalaryInput("");

      if (onSalarySave) onSalarySave(value);

      console.log("Salary saved successfully");

    } catch (err) {

      console.error("Salary save error:", err);

    }
  };


  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/expenses", {
        title,
        amount: Number(amount),
        category
      });

      onAdd(res.data);
      setTitle("");
      setAmount("");
      setCategory("food");

    } catch (err) {
      console.error("Add error:", err.response?.data || err.message);
    }
  };

  return (
    
    <form onSubmit={submit}>
      <input className="form-tube"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input className="form-tube"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {showSalaryInput &&(
      <>
        <input
        type="number"
        placeholder="Monthly Salary"
        value={salaryInput}
        onChange={(e) => setSalaryInput(e.target.value)}

        className="form-tube"
        min="0"/>
        
        <button
            type="button"
            className="form-tube"
            onClick={handleSalarySave}>
            Save Salary
        </button>      
      </>)}

      <select className="form-tube"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="food">Food</option>
        <option value="travel">Travel</option>
        <option value="shopping">Shopping</option>
        <option value="bills">Bills</option>
        <option value="other">Other</option>
      </select>

      <button className="form-tube" type="submit">Add

      </button>
    </form>
  );
}
