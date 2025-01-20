import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

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

  return (
    <div className="pt-36">
      {
        notifications.map(notification => {
          return (
            <p key={notification.id}>{notification.message}</p>
          )
        })
      }
    </div>
  )
}
