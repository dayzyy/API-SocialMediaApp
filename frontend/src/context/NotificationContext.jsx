import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import API_URL from "../settings";

const NotificationContext = createContext()

export function NotificationProvider({children}){
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])
  const { user, tokens } = useAuth()

  useEffect(_ => {
    if (!user) return

    const ws = new WebSocket(`${API_URL}/ws/notifications/${encodeURIComponent(tokens.access)}/`)
    setSocket(ws)

    ws.onmessage = event => {
      console.log("MEssage recieved")
      const notification = JSON.parse(event.data)
      console.log(notification)
    }

    return _ => ws.close()
  }, [user])

  return(
    <NotificationContext.Provider value={{notifications}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = _ => {
  return useContext(NotificationContext)
}
