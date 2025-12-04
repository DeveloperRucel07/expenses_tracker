import { useForm } from "react-hook-form";
import { signInSchema, type SignInInput } from "../database/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState:{errors}} = useForm<SignInInput>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        email: "",
        password: "",
      }
    })
    const onSubmit =(data:SignInInput) => {
      loginUser(data.email, data.password);
      setLoading(true);
    };

    async function loginUser(email:string, password:string){
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const currentUser = cred.user;
        console.log(currentUser.displayName)
        onLogin(currentUser);
        navigate("/dashboard") 
      }catch (error) {
        if(error){
            setShow(true);
        }else{
            return
        }
      }finally {
        setLoading(false);
        setShow(false);
      }
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-5 mt-6 max-w-[600px] mx-auto h-[600px] flex items-center justify-center flex-col p-2">
        <h1 className="px-6 py-6 text-semibold text-5xl underline uppercase ">Login</h1>
        <div className={`w-full h-8 ${show ? 'badge badge-error' : 'hidden' }`}>Please check Your Email and Password</div>
        <div className="flex items-center justify-center flex-col gap-4 w-full">
            <input {...register("email")} type="email" placeholder="Entyer your Email" className="input px-4 py-6 w-full m-4 "
            
            />
            <div className="h-2">
              {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
            </div>

            <input {...register("password")} type="password" autoComplete="password" placeholder="Enter Your Password" className="input px-4 py-6 w-full m-4"

            />
            <div className="h-2">
              {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
            </div>
            <button className="btn p-6 btn-info m-4">
              {loading ? "Connexion…" : "Sign In"}
            </button>
        </div>
        <div className="w-full text-center">
          <p>Don't have an Account?  <a href="/sign-up" className="text-info hover:underline">Create an account</a></p>

        </div>
    </form>
  )
}
