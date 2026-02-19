import { useContext, useState } from "react";
import API from "../api";
import { AuthContext } from "../content";
import "./Login.css";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token",res.data.token);
      login(res.data.token);

    } catch (err) {
      alert("Login failed. Check email or password.");
      console.error(err);
    }
  };

  return (
    <div className="loginbody">
      <div className="heading">
      <h1>AI EXPENSES TRACKER</h1>
      

      <div className="login-box">
      <input className="input"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({ ...data, email: e.target.value })
        }
      />

      <input className="input"
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button className= "submit" onClick={submit}>Login</button>
      </div>
      </div>
    </div>
  );
}