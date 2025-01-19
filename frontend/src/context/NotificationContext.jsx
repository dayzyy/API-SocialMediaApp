import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import API_URL from "../settings";

import Swal from "sweetalert2";

const NotificationContext = createContext()

export function NotificationProvider({children}){
  const [socket, setSocket] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [liveNotifications, setLiveNotifications] = useState([])
  const { user, tokens } = useAuth()
  const sl = Swal

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
      const notification = JSON.parse(event.data)

      sl.fire({
        text: notification.notification_message,
        icon: 'info',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      })

      setLiveNotifications(prev => [...prev, notification])
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
