import { FaReact } from "react-icons/fa6";
import { AiOutlineMessage } from "react-icons/ai";

import { IoAddCircleOutline } from "react-icons/io5";
import { PiUsers } from "react-icons/pi";
import { GoBell } from "react-icons/go";
import { HiBars3 } from "react-icons/hi2";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Header(){
  const { user } = useAuth()
  const { notificationCount } = useNotifications()
  const navigate = useNavigate()
  const [isShown, setIsShown] = useState(true)
  const lastY = useRef(0)

  useEffect(_ => {
    const handle_scroll = _ => {
      if (lastY.current < window.scrollY) setIsShown(false)
      else setIsShown(true)
      lastY.current = window.scrollY
    }

    document.addEventListener('scroll', handle_scroll)
    return _ => document.removeEventListener('scroll', handle_scroll)
  }, [])

  return (
    <header className={`fixed top-0 h-fit w-screen  flex flex-col gap-2 md:items-end p-4  bg-white  duration-200 ${!isShown ? '-translate-y-full' : ''}`}>
      <div className="w-full  flex items-center justify-between">
        <div onClick={_ => navigate('/home')} className="flex items-center gap-2  cursor-pointer">
          <FaReact className="text-6xl text-gray-600"/>
          <p className="text-3xl hover:text-gray-600">Rmedia</p>
        </div>

        <div className="flex items-center">
          {user && <AiOutlineMessage onClick={_ => navigate('/directs')} className="text-3xl  cursor-pointer  text-blue-700 hover:text-blue-500"/>}
        </div>
      </div>

      <div className="w-full md:w-fit flex justify-around md:justify-end md:gap-4 items-center">
          {user && <IoAddCircleOutline onClick={_ => navigate('/add/post')} className="text-4xl  cursor-pointer  text-gray-500 hover:text-gray-400"/>}
          {user && <PiUsers onClick={_ => navigate('/friends')} className="text-4xl  cursor-pointer  text-gray-500 hover:text-gray-400"/>}
          {user && 
            <div className="relative">
              <GoBell onClick={_ => navigate('/notifications')} className="text-3xl  cursor-pointer  text-gray-500 hover:text-gray-400"/>
              {notificationCount != 0 && <p className="absolute -top-2 right-0  text-sm text-red-600 font-bold">{notificationCount}</p>}
            </div>
          }
          {user && <HiBars3 onClick={_ => navigate('/directs')} className="text-4xl  cursor-pointer  text-gray-500 hover:text-gray-400"/>}
      </div>
    </header>
  )
}
