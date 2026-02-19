import { useContext } from "react";
import { AuthProvider, AuthContext } from "./content";
import Dashboard from "./pages/dashboard";
import Login from "../src/pages/login";

function Appcontent(){
  const { token } = useContext(AuthContext);
  return token ? <Dashboard/> : <Login/>;
}

function App(){
  return(
    <AuthProvider>
      <Appcontent/>
    </AuthProvider>
  );
}

export default App;