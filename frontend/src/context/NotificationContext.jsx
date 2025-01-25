import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";

import API_URL from "../settings";

import Swal from "sweetalert2";

const NotificationContext = createContext()

export function NotificationProvider({children}){
  const [socket, setSocket] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [liveNotifications, setLiveNotifications] = useState([])
  const { user, tokens } = useAuth()
  const location = useLocation()
  const sl = Swal

  useEffect(_ => {
    console.log(liveNotifications)
  }, [liveNotifications])

  useEffect(_ => {
    if (!user) return

    const get_new_notifications_count = async _ => {
      const response = await fetch(`${API_URL}/notification/new/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })

      if (response.status == 200) {
        const data = await response.json()
        setNotificationCount(data.count)
      }
    }
    get_new_notifications_count()
  }, [user])

  useEffect(_ => {
    if (!user) return

    const ws = new WebSocket(`${API_URL}/ws/notifications/${encodeURIComponent(tokens.access)}/`)
    setSocket(ws)

    ws.onmessage = event => {
      console.log('NOTIF RECIEVED')
      const notification = JSON.parse(event.data)
      console.log(notification)

      if (location.pathname != `/chat/${notification.sender.first_name}${notification.sender.last_name}`) {
        sl.fire({
          text: notification.message,
          icon: 'info',
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        })
      }

      setLiveNotifications(prev => [...prev, notification])
      setNotificationCount(prev => prev + 1)
    }

    return _ => {
      if (ws) {
        ws.close()
      }
    }
  }, [user])

  const get_notifications = async _ => {
    if (!tokens) return

    const response = await fetch(`${API_URL}/notification/all/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    if (response.status == 200) {
      setLiveNotifications([])
      const data = await response.json()
      return data
    }
  }

  return(
    <NotificationContext.Provider value={{notificationCount, liveNotifications, get_notifications}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = _ => {
  return useContext(NotificationContext)
}
