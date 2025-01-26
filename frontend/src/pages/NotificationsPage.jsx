import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useUserActions } from "../context/UserActionsContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading";
import GoBackButton from "../components/GoHomeButton";
import ProfileBar from "../components/ProfileBar";

import { IoMdPersonAdd } from "react-icons/io";
import { BiSolidLike } from "react-icons/bi";
import { PiNewspaper } from "react-icons/pi";
import { GoComment } from "react-icons/go";

export default function Notifications(){
  const { get_notifications, liveNotifications } = useNotifications()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { tokens } = useAuth()
  const { mark_notification_as_read } = useUserActions()
  const navigate = useNavigate()

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
    else if (category == "comment") return <GoComment className="absolute -bottom-2 -right-3  text-xl text-green-500"/>
  }

  const mark_as_read = async notification => {
    if (notification.is_read == true) return

    await mark_notification_as_read(notification)

    setNotifications(prev => {
      return prev.map(ntf => {
        if (ntf.id == notification.id) {
          return {...ntf, is_read: true}
        }
        else {
          return ntf
        }
      })
    })
  }

  const get_handler = notification => {
    let redirect = _ => {}

    if (notification.category == "follow") redirect = _ => navigate(`/profile/${notification.friend.id}`)
    else if (notification.category == "like") redirect = _ => navigate(`/post/${notification.about.id}`)
    else if (notification.category == "post") redirect = _ => navigate(`/post/${notification.about.id}`)
    else if (notification.category == "comment") redirect = _ => navigate(`/post/${notification.about.id}`)

    return (
      _ => {
        redirect()
      }
    )
  }

  const handle_click = notification => {
    get_handler(notification)()
    mark_as_read(notification)
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
              <div key={notification.id}
                className={`px-4 w-screen h-20  border  flex items-center cursor-pointer  ${notification.is_read ? 'bg-gray-50' : 'bg-gray-100'}`}
                onClick={_ => handle_click(notification)}
              >
                <ProfileBar profile={notification.friend} timestamp={notification.created_at} icon={get_icon(notification.category)} message={notification.message}/>
              </div>
            )
          })
        }
      </div>
    </main>
  )
}
