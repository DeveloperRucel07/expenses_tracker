import { useState } from "react";
import { signUpSchema, type SignUpInput } from "../database/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../database/config";


function firebaseErrorMessage(code?: string) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try signing in or reset your password.";
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/weak-password":
      return "Password is too weak. It must be at least 6 characters (frontend enforces stronger rules).";
    default:
      return "Something went wrong. Please try again later.";
  }
}


const SignUp = () => {

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState:{errors}} = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: ""
    }
  })

  async function onSubmit(data: SignUpInput) {
    setServerError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      if (data.displayName) {
        await updateProfile(userCredential.user, { displayName: data.displayName });
      }
      console.log("User created:", userCredential.user.uid);
    } catch (err:any) {
      console.error("Sign up error:", err);
      const code = err?.code ?? err?.message ?? "";
      setServerError(firebaseErrorMessage(code));
    } finally {
      setLoading(false);
    }
  }




  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-5 mt-6 max-w-[600px] mx-auto h-[600px] flex items-center justify-center flex-col p-2">
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        <h1 className="px-6 py-6 text-semibold text-5xl underline uppercase ">Sign Up</h1>
    
        <div className="flex items-center justify-center flex-col gap-2 w-full">
            <input type="text" placeholder="Name" className="input px-4 py-6 w-full m-4 "
              {...register("displayName", {
                required: true
              })}

            />
            <div className="h-2">
              {errors.displayName && <p style={{ color: "red" }}>{errors.displayName.message}</p>}
            </div>
            <input {...register("email")} type="email" autoComplete="email" placeholder="Email" className="input px-4 py-6 w-full m-4 "
            
            />
            <div className="h-2">
              {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
            </div>
            <input {...register("password")} type="password" autoComplete="new-password" placeholder="Password" className="input px-4 py-6 w-full m-4"

            />
            <div className="h-2">
              {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
            </div>
            <input {...register("confirmPassword")} type="password" autoComplete="new-password" placeholder="confirm Password" className="input px-4 py-6 w-full m-4"

            />
            <div className="h-2">
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
              )}
            </div>
        
            <button className="btn p-6 btn-info m-4" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </button>
        </div>

    </form>
  )
}

export default SignUp