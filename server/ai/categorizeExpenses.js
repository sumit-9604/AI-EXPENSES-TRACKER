import fetch from "node-fetch";

const labels =[
    "food",
    "travel",
    "Shopping",
    "Education",
    "Health",
    "Entertainment",
    "Subscriptions",
    "Others"
];



export async function categorizeExpenses(text) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",

        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: text,
                parameters: {candidate_labels: labels}
            })
        }
    );
    const data = await response.json();
    return data.labels[0];
    
}