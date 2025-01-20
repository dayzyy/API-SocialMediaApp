import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

import Loading from "../components/Loading";
import GoBackButton from "../components/GoHomeButton";

import { IoMdPersonAdd } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { PiNewspaper } from "react-icons/pi";

import { format_time } from "../utils/dateUtils";

export default function Notifications(){
  const { get_notifications, liveNotifications } = useNotifications()
  const [notifications, setNotifications] = useState([])
  const { tokens } = useAuth()

  useEffect(_ => {
    const fetch_notifications = async _ => {
      const data = await get_notifications()
      console.log(data)
      setNotifications(data)
    }

    fetch_notifications()
  }, [tokens])

  if (!notifications) return <main className="pt-36 flex justify-center"><Loading/></main>

  const all_notifications = [...notifications, ...liveNotifications].sort((a, b) => b.created_at.localeCompare(a.created_at))
  console.log(all_notifications)
  
  return (
    <main className="pt-36 flex flex-col items-center gap-1">
      <GoBackButton addCss="ml-4 self-start"/>

      <div className="flex flex-col gap-1">
        { all_notifications.length === 0 ? <p className="text-gray-500 text-xl">No notifications</p> :
          all_notifications.map(notification => {
            return (
              <div key={notification.id} className="px-4 w-screen h-20  border  flex items-center cursor-pointer  bg-gray-50">
                <div className="flex items-end gap-6">
                  <div className="relative">
                    <img className="w-12 h-12  border rounded"
                    src={notification.friend.profile_picture !== null ? `${API_URL}${notification.friend.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

                    {notification.category === "follow" && <IoMdPersonAdd className="absolute -bottom-2 -right-3  text-2xl text-gray-500"/>}
                    {notification.category === "like" && <BiSolidLike className="absolute -bottom-2 -right-3  text-xl text-blue-500"/>}
                    {notification.category === "post" && <PiNewspaper className="absolute -bottom-2 -right-3  text-xl text-green-600"/>}
                  </div>

                  <div className="flex flex-col justify-between">
                    <p className="text-md text-gray-700">{notification.message}</p>
                    <p className="text-sm text-gray-500">{format_time(notification.created_at)}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
