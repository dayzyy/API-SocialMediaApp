import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

import { useAuth } from "../context/AuthContext";

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [type, setType] = useState('password')
  const { register } = useAuth()
  const navigate = useNavigate()

  return(
    <main className="pt-40  h-screen w-screen flex justify-center">
      <div className="flex flex-col items-end gap-6">
        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type="text" id="email" placeholder="" value={email} onChange={e => setEmail(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4 pr-12 z-10"/>
          <label htmlFor="email" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">email</label>
        </div>

        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type={type} id="password1" placeholder="" value={password1} onChange={e => setPassword1(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4  z-10"/>
          <label htmlFor="password1" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">password</label>
          {
            type == 'password' ?
            <FaRegEye onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl text-green-400  cursor-pointer"/>
            : <FaRegEyeSlash onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl text-green-500  cursor-pointer"/>
          }
        </div>

        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type={type} id="password2" placeholder="" value={password2} onChange={e => setPassword2(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4  z-10"/>
          <label htmlFor="password2" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">password</label>
          {
            type == 'password' ?
            <FaRegEye onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl text-green-400  cursor-pointer"/>
            : <FaRegEyeSlash onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl text-green-500  cursor-pointer"/>
          }
        </div>

        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type="text" id="name" placeholder="" value={name} onChange={e => setName(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4 pr-12 z-10"/>
          <label htmlFor="name" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">name</label>
        </div>

        <div className="relative  w-64 md:w-80 h-14  border border-gray-600 rounded  flex items-center">
          <input type="text" id="lastName" placeholder="" value={lastName} onChange={e => setLastName(e.target.value)} className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  pl-4 pr-12 z-10"/>
          <label htmlFor="lastName" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">last name</label>
        </div>

        <button onClick={_ => register(email, password1, password2, name, lastName)} className="h-16 w-40  border border-gray-600 rounded-md  text-gray-800 font-semibold">signup</button>
        <p onClick={_ => navigate('/login')} className="self-start  text-blue-500 underline  cursor-pointer">Have an account? Login</p>
      </div>
    </main>
  )
}
