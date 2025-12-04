import {type User } from "firebase/auth";
import { SquareArrowRight } from "lucide-react"
type userProps ={
  user: User,
  logout: (user: User) => void; 
}

const Header = ({ user, logout }: userProps) => {
  return (
    <header className="flex flex-row justify-between items-center h-[60px] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.15)] px-2 py-4">
        <h3 className="text-info text-extrabold text-3xl">Expense Track</h3>
        <nav className="">
          <ul className="flex flex-row gap-2">
              <li className="text-xl p-4 text-hover-primary"><a href="/">Home</a></li>
              {!user ? (
                  <li className="text-xl p-4 cursor-pointer text-accent"><a href="/login">Login</a></li>
                ): (
                  <li className="text-xl p-4 cursor-pointer text-accent flex items-center" onClick={()=>logout(user)}> {user.displayName} <SquareArrowRight /></li>
                )
              }
          </ul>            
        </nav>
    </header>
  )
}

export default Header