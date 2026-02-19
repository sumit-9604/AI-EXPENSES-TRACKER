import "../pages/dashboard.css";
export default function Expenseslist({ expenses , onDelete }){
    if(expenses.length ===0) return null;
    return(
        <div className="list">
        <ul className="list-items">
            {expenses.map((e)=>{

                const date = new Date(e.createdAt);
                const formattedDate =
                    date.toLocaleDateString("en-IN") + " " +
                    date.toLocaleTimeString("en-IN");

                    return(
                <li
                    key={e._id}
                    style={{
                        display:"flex",
                        justifyContent:"space-between",
                        alignItems:"center",
                        padding:"8px",
                        marginBottom:"6px",
                        border: "2px solid black",
                        borderRadius:"6px",
                    }}>

                    <span>
                        {e.title} - {e.amount} ({e.category})
                    </span>

                    
                    <small>
                        added on: {formattedDate}
                    </small>

                    <button onClick={()=> onDelete(e._id)}>
                        <div className="button-text">DELETE</div>
                    </button>

                </li>    
            )})}
        </ul>
        </div>
    );
}