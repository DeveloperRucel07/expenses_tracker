import type { User } from "firebase/auth"
import { Navigate } from "react-router-dom"

type userProps ={
    user: User | null,
    
}
const Dashboard = ({user}: userProps) => {
  return (
    <div>
      {user? (
          <h1>Dashboard {user.displayName}</h1>
        ):(
          <Navigate to="/login" replace></Navigate>
        )}
    </div>
  )
}

export default Dashboard