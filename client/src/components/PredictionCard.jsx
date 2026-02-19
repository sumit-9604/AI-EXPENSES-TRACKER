import "../pages/dashboard.css";

export default function PredictionCard({ prediction = 0, total = 0, salary = 0 }) {

    // ensure numbers
    const predValue = Number(prediction) || 0;
    const totalValue = Number(total) || 0;
    const salaryValue = Number(salary) || 0;

    const remaining = salaryValue - predValue;

    const percentUsed =
        salaryValue > 0
            ? Math.round((predValue / salaryValue) * 100)
            : 0;

    return (
        <div className="prediction-box">

            <h3>PREDICTED MONTHLY EXPENSES</h3>
            <h2>₹{predValue.toLocaleString()}</h2>

            <h3>TOTAL EXPENSES TILL NOW</h3>
            <h2>₹{totalValue.toLocaleString()}</h2>


            {salaryValue > 0 ? (

                <div className="budget-details">

                    <h4>
                        💰 Monthly Salary: ₹{salaryValue.toLocaleString()}
                    </h4>

                    <h4>
                        💸 Remaining: ₹{remaining.toLocaleString()}
                    </h4>

                    <h4>
                        📊 {percentUsed}% used this month
                    </h4>


                    {remaining < 0 && (
                        <h4 className="over-budget">
                            ⚠️ Over budget by ₹{Math.abs(remaining).toLocaleString()}
                        </h4>
                    )}

                </div>

            ) : (

                <p className="salary-prompt">
                    Enter your monthly salary in the form to enable budget tracking
                </p>

            )}

        </div>
    );
}