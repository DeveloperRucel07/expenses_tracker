import { Route, Routes} from "react-router-dom"
import Header from "./components/Header"
import Login from "./pages/Login"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import type { User } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "./database/config"

function App() {

  const [user, setUser] =  useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  })
 
  return (
    <>
      <Header></Header>
      <main>
        <Routes>
          <Route path="/" element = {<Home></Home>}></Route>
          <Route path="/login" element = { user ? <Dashboard></Dashboard> : <Login></Login> }></Route>
          <Route path="/sign-up" element = {user ? <Dashboard></Dashboard> : <SignUp></SignUp>}></Route>
          <Route path="/dashboard" element = {<Dashboard></Dashboard>}></Route>
        </Routes>
      </main>
    </>
  )
}

export default App
