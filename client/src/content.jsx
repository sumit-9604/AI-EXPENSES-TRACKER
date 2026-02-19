import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const login = (newtoken) => {
    localStorage.setItem("token", newtoken);
    setToken(newtoken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/dashboard";
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};