import { FaReact } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";

import { IoAddCircleOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { GoBell } from "react-icons/go";
import { HiBars3 } from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header(){
  const {user} = useAuth()
  const navigate = useNavigate()

  return (
    <header className={"fixed top-0 h-fit w-screen  flex flex-col gap-2 md:items-end p-4"}>
      <div className="w-full  flex items-center justify-between">
        <div onClick={_ => navigate('/home')} className="flex items-center gap-2  cursor-pointer">
          <FaReact className="text-6xl text-gray-600"/>
          <p className="text-3xl">Rmedia</p>
        </div>

        <div className="flex items-center">
          {user && <AiOutlineMessage onClick={_ => navigate('/directs')} className="text-3xl  cursor-pointer  text-blue-700"/>}
        </div>
      </div>

      <div className="w-full md:w-fit flex justify-around md:justify-end md:gap-4 items-center">
          {user && <IoAddCircleOutline onClick={_ => navigate('/add/post')} className="text-4xl  cursor-pointer  text-gray-500"/>}
          {user && <IoPersonAddOutline onClick={_ => navigate('/directs')} className="text-3xl  cursor-pointer  text-gray-500"/>}
          {user && <GoBell onClick={_ => navigate('/directs')} className="text-3xl  cursor-pointer  text-gray-500"/>}
          {user && <HiBars3 onClick={_ => navigate('/directs')} className="text-4xl  cursor-pointer  text-gray-500"/>}
      </div>
    </header>
  )
}
