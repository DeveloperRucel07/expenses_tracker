import { Route, Routes, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/Login"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "./database/config"

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const  handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate("/");
  };
 
  return (
    <>
      <Header user = {user!} logout={handleLogout}></Header>
      <main>
        <Routes>
          <Route path="/" element = {<Home></Home>}></Route>
          <Route path="/login" element = {<Login onLogin={setUser}></Login>}></Route>
          <Route path="/sign-up" element = {<SignUp></SignUp>}></Route>
          <Route path="/dashboard" element = {<Dashboard user={user}></Dashboard>}></Route>
        </Routes>
      </main>
    </>
  )
}

export default App
