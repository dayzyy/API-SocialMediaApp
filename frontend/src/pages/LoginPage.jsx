import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('password')
  const { login } = useAuth()
  const navigate = useNavigate()

  const toggle_type = _ => {
    setType(prev => prev == 'text' ? 'password' : 'text')
  }

  return(
    <main className="pt-40  h-screen w-screen flex justify-center">
      <div className="flex flex-col items-end gap-6">
        <Input value={email} change={value => setEmail(value)} type="email" label="email"/>
        <Input value={password} change={value => setPassword(value)} type={type} password_toggler={toggle_type} label="password"/>

        <button onClick={_ => login(email, password)} className="h-16 w-40  border border-gray-400 rounded-md  text-gray-700 font-semibold">login</button>
        <p onClick={_ => navigate('/signup')} className="self-start  text-blue-500 underline  cursor-pointer">No account? Signup</p>
      </div>
    </main>
  )
}
