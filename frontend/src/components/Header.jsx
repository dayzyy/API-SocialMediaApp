import { FaReact } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Loading from "./Loading";

export default function Header(){
  const {user} = useAuth()
  const navigate = useNavigate()

  return (
    <header className={`fixed top-0 h-20 w-screen  flex items-center justify-between  p-4`}>
      <div onClick={_ => navigate('/home')} className="flex items-center gap-2  cursor-pointer">
        <FaReact className="text-6xl text-gray-800"/>
        <p className="text-3xl">Rmedia</p>
      </div>

      <div className="flex items-center">
        {user && <AiOutlineMessage onClick={_ => navigate('/directs')} className="text-3xl  cursor-pointer  text-blue-700"/>}
      </div>
    </header>
  )
}
