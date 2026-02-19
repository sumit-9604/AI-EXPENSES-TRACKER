export function predictmonthlyexpenses(expenses){
    if(expenses.length === 0 ) return {total:0,prediction:0};


const today = new Date();

const currentmonthExpenses = expenses.filter((e) =>{
    const date = new Date(e.createdAt);
    return(
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
});

const total = currentmonthExpenses.reduce(
    (sum,e) => sum + Number(e.amount),
    0
);

const dayofMonth = today.getDate();
const daysinMonth = new Date(
    today.getFullYear(),
    today.getMonth()+1,
    0
).getDate();

const dailyAVG = dayofMonth > 0 ? total/dayofMonth:0;
const prediction = Math.round(dailyAVG*daysinMonth);
return {total, prediction};
}
