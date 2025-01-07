import Header from "../components/Header";

import { useState } from "react";

import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";

export default function Signup(){
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [type, setType] = useState('password')

  return(
    <div className="pt-40  h-screen w-screen flex justify-center">
      <Header />

      <div className="flex flex-col items-end gap-6">
        <div className="relative  w-80 md:w-96 h-16  border border-black rounded  flex items-center">
          <input type="text" id="email" placeholder="" value={email} onChange={e => setEmail(e.target.value)} className="absolute  h-full w-full  outline-none bg-transparent  pl-4 pr-12 z-10"/>
          <label htmlFor="email" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">email</label>
        </div>

        <div className="relative  w-80 md:w-96 h-16  border border-black rounded  flex items-center">
          <input type={type} id="email" placeholder="" value={password1} onChange={e => setPassword1(e.target.value)} className="absolute  h-full w-full  outline-none bg-transparent  pl-4  z-10"/>
          <label htmlFor="email" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">password</label>
          {
            type == 'password' ?
            <FaRegEye onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl  cursor-pointer"/>
            : <FaRegEyeSlash onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl  cursor-pointer"/>
          }
        </div>

        <div className="relative  w-80 md:w-96 h-16  border border-black rounded  flex items-center">
          <input type={type} id="email" placeholder="" value={password2} onChange={e => setPassword2(e.target.value)} className="absolute  h-full w-full  outline-none bg-transparent  pl-4  z-10"/>
          <label htmlFor="email" className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">password</label>
          {
            type == 'password' ?
            <FaRegEye onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl  cursor-pointer"/>
            : <FaRegEyeSlash onClick={_ => setType(prev => prev == 'text' ? 'password' : 'text')} className="absolute right-3  z-30  text-2xl  cursor-pointer"/>
          }
        </div>

        <button onClick={_ => console.log(email, password1, password2)} className="h-20 w-40  border border-black rounded-md  font-semibold">signup</button>
      </div>
    </div>
  )
}
