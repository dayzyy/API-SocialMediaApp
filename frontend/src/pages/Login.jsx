import { useState } from "react";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('password')
  const { login } = useAuth()
  const navigate = useNavigate()

  return(
    <main className="pt-40  h-screen w-screen flex justify-center">
      <div className="flex flex-col items-end gap-6">
        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type="text" id="email" placeholder="" value={email} onChange={e => setEmail(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4 pr-12 z-10"/>
          <label htmlFor="email" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">email</label>
        </div>

        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type={type} id="password" placeholder="" value={password} onChange={e => setPassword(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4 pr-12 z-10"/>
          <label htmlFor="password" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">password</label>
          {
            type == 'password' ?
            <FaRegEye onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl text-green-400  cursor-pointer"/>
            : <FaRegEyeSlash onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl text-green-500  cursor-pointer"/>
          }
        </div>

        <button onClick={_ => login(email, password)} className="h-16 w-40  border border-gray-600 rounded-md  text-gray-800 font-semibold">login</button>
        <p onClick={_ => navigate('/signup')} className="self-start  text-blue-500 underline  cursor-pointer">No account? Signup</p>
      </div>
    </main>
  )
}
