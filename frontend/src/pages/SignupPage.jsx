import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [type, setType] = useState('password')
  const { register } = useAuth()
  const navigate = useNavigate()

  const toggle_type = _ => {
    setType(prev => prev == 'text' ? 'password' : 'text')
  }

  return(
    <main className="pt-40  h-screen w-screen flex justify-center">
      <div className="flex flex-col items-end gap-6">
        <Input value={email} change={value => setEmail(value)} type="email" label="email"/>
        <Input value={name} change={value => setName(value)} type="text" label="first name"/>
        <Input value={lastName} change={value => setLastName(value)} type="text" label="last name"/>
        <Input value={password1} change={value => setPassword1(value)} password_toggler={toggle_type} type={type} label="password"/>
        <Input value={password2} change={value => setPassword2(value)} password_toggler={toggle_type} type={type} label="confirm password"/>

        <button onClick={_ => register(email, password1, password2, name, lastName)} className="h-16 w-40  border border-gray-400 rounded-md  text-gray-700 font-semibold">signup</button>
        <p onClick={_ => navigate('/login')} className="self-start  text-blue-500 underline  cursor-pointer">Have an account? Login</p>
      </div>
    </main>
  )
}
