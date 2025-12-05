import {type User } from "firebase/auth";
import { SquareArrowRight, Wallet } from "lucide-react"
import { useEffect, useState } from "react";
import { auth } from "../database/config";
// type userProps ={
//   user: User,
//   logout: (user: User) => void; 
// }{ user, logout }: userProps

const Header = () => {
  const [user, setUser] =  useState<User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  })

  const logout = () =>{
    auth.signOut();
    setUser(null);
  }

  return (
    <header className="flex flex-row justify-between items-center h-[60px] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15)] px-2 py-4 fixed top-0 left-0 right-0 z-10 mx-auto bg-secondary-content max-w-[1920px]">
        <h3 className="text-info text-extrabold text-3xl flex items-center"><Wallet className="w-10 h-10" /> Track</h3>
        <nav className="">
          <ul className="flex flex-row gap-2">
              <li className="text-xl p-4 text-hover-primary"><a href="/">Home</a></li>
              {!user ? (
                  <li className="text-xl p-4 cursor-pointer text-accent"><a href="/login">Login</a></li>
                ): (
                  <li className="text-xl p-4 cursor-pointer text-accent flex items-center" onClick={()=>logout()}> {user.displayName} <SquareArrowRight /></li>
                )
              }
          </ul>            
        </nav>
    </header>
  )
}

export default Header