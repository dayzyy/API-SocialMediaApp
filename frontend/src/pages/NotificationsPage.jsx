import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

import Loading from "../components/Loading";
import GoBackButton from "../components/GoHomeButton";
import ProfileBar from "../components/ProfileBar";

import { IoMdPersonAdd } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { PiNewspaper } from "react-icons/pi";

export default function Notifications(){
  const { get_notifications, liveNotifications } = useNotifications()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { tokens } = useAuth()

  useEffect(_ => {
    const fetch_notifications = async _ => {
      const data = await get_notifications()
      setNotifications(data)
      setLoading(false)
    }

    fetch_notifications()
  }, [tokens])

  const get_icon = category => {
    if (category == "follow") return <IoMdPersonAdd className="absolute -bottom-2 -right-3  text-2xl text-gray-500"/>
    else if (category == "like") return <BiSolidLike className="absolute -bottom-2 -right-3  text-xl text-blue-500"/>
    else if (category == "post") return <PiNewspaper className="absolute -bottom-2 -right-3  text-xl text-green-600"/>
  }

  if (loading) return <main className="pt-36 flex justify-center"><Loading/></main>

  const all_notifications = [...notifications, ...liveNotifications].sort((a, b) => b.created_at.localeCompare(a.created_at))
  
  return (
    <main className="pt-36 flex flex-col items-center gap-1">
      <GoBackButton addCss="ml-4 self-start"/>

      <div className="flex flex-col gap-1">
        { all_notifications.length === 0 ? <p className="text-gray-500 text-xl">No notifications</p> :
          all_notifications.map(notification => {
            return (
              <div key={notification.id} className="px-4 w-screen h-20  border  flex items-center cursor-pointer  bg-gray-50">
                <ProfileBar profile={notification.friend} timestamp={notification.created_at} icon={get_icon(notification.category)} message={notification.message}/>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
