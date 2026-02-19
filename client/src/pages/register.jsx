import { useState } from "react";
import { api } from "../api";
import {useNavigate} from "react-router-dom";

export default function Register(){

    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();
    
    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const res = await api.post("/auth/register",{
                email,password
            });
            localStorage.setItem("token",res.data.token);
            navigate("/dashboard");

        }catch(err){
            alert("registeration failed");}
    };

    return(
        <form onSubmit={handleRegister}>
        <h2>register</h2>
        
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setpassword(e.target.value)}
            required
        />

        <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
        />

        <button type="submit">Register</button>
        </form>
    );
}