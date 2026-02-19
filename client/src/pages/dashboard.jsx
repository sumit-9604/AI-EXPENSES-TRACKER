import { useEffect, useState } from "react";
import API from "../api";
import ExpenseChart from "../components/Expensescharts";
import PredictionCard from "../components/PredictionCard";
import ExpenseForm from "../components/Expenseform";
import Expenseslist from "../components/Expenseslist";
import "./dashboard.css";



export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(0);
  const [total, setTotal] = useState(0);
  const [salary, setSalary] = useState(()=>{
    return Number(localStorage.getItem("salary")) || 0;
  });



useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return;
  }

  fetchExpenses();
  fetchPrediction();

}, []);


  const fetchExpenses = async() => {
    try{
    const res = await API.get("/expenses");
    setExpenses(res.data);
    }catch(err){console.error(err)}};


const handleAddExpense = (newExpense) => {
  setExpenses(prev => [newExpense, ...prev]);
  fetchPrediction();
};

  const deleteExpense = async(id) => {
    try{
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
      fetchPrediction();
    }catch(err){
      console.error("delete error",err);}};
    

  const handleSalarySave = (value) => {
        const num = Number(value);
        setSalary(num);
        localStorage.setItem("salary", num);
    };


  const fetchPrediction = async () => {
    try {
      const res = await API.get("/analytics/summary");

      setPrediction(res.data.prediction || 0);
      setTotal(res.data.total || 0);

      if (!localStorage.getItem("salary")) {
        setSalary(res.data.salary || 0);
        localStorage.setItem("salary", res.data.salary || 0);
      }

    } catch (err) {
      console.error("analytic error : ", err);
    }
  };



  return (
    <div className="dashboard-body">

    <div className="dashboard-top">
      <div className="dashboard-text">
      <h1>DASHBOARD</h1>
      <h1>MY EXPENSES</h1>
      </div>

      <ExpenseForm 
        className="form" 
        onAdd={handleAddExpense} 
        salary={salary}
        setSalary={setSalary}
        onSalarySave={handleSalarySave}
        showSalaryInput={salary === 0} />
    </div>

      <ExpenseChart expenses={expenses}/> 



      <div className="lower-part">
        <PredictionCard 
          prediction={prediction}
          total={total} 
          salary={salary} />

        <Expenseslist expenses={expenses} onDelete=     {deleteExpense} />
      </div>



      <button className="logout"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("salary");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}
