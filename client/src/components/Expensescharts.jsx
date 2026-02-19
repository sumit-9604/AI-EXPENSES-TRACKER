
import "../pages/dashboard.css";
import { 
    PieChart,
    Pie, 
    Tooltip,
    Cell,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    ScatterChart,
    Scatter,
    ZAxis

 } from "recharts";

const COLORS = [
  "#00E5FF",
  "#00FF9C",
  "#FFB800",
  "#FF5C8A",
  "#8B5CF6",
  "#FF8042"
];

export default function ExpenseChart({ expenses =[]}) {

    const categoryData = Object.values(
        expenses.reduce((acc, e) => {
            acc[e.category] = acc[e.category] || {
                name: e.category,
                value: 0
            };
            acc[e.category].value += Number( e.amount);
            return acc;
        },{})
    );

    const lineData = expenses.map(e =>({
        date: new Date(e.createdAt).toLocaleDateString("en-IN"),
        amount: Number(e.amount)
    })).sort((a,b) => new Date(a.date) - new Date (b.date));

    const scatterData = expenses.map((e,index)=> ({
        x:new Date(e.createdAt).getDate(),
        y:Number(e.amount),
        z:Number(e.amount)
    }));

    const barData = categoryData;

    return (
    <div className="expensechart">

        <div className="chart-box">
          {/* PIE CHART */}
          <h3>PIE CHART</h3>
          <h3>Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index %   COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
    </div>

    <div className="chart-box">
      {/* LINE CHART */}
      <h3>LINE CHART</h3>
      <h3>Expenses Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>


    <div className="chart-box">
      {/* BAR CHART */}
      <h3>BAR CHART</h3>
      <h3>Category Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    

    <div className="chart-box">
      {/* SCATTER CHART */}
      <h3>SCATTER CHART</h3>
      <h3>Expense Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="Day" />
          <YAxis type="number" dataKey="y" name="Amount" />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Scatter data={scatterData} fill="#ff7300" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
    </div>
    );
    
}
