import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useUserActions } from "./UserActionsContext.jsx"
import { useLocation, useNavigate } from "react-router-dom";

import API_URL from "../settings";
import Swal from "sweetalert2";
import { handle_response_error, handle_api_problem } from "../utils/errorHandlingUtils.jsx";

const NotificationContext = createContext()

export function NotificationProvider({children}){
  const [socket, setSocket] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [liveNotifications, setLiveNotifications] = useState([])
  const { user, tokens, setUser } = useAuth()
  const { mark_message_as_read } = useUserActions()
  const navigate = useNavigate()
  const location = useLocation()
  const sl = Swal

  // Get the count of new(unread) notifications
  const get_new_notifications_count = async _ => {
    let response;
    try {
     response = await fetch(`${API_URL}/notification/new/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      const data = await response.json()
      setNotificationCount(data.count)
    }
    else await handle_response_error(response)
  }

  useEffect(_ => {
    if (!user) return

    const fetch_new_notifications_count = async _ => {
      await get_new_notifications_count()
    }
    
    fetch_new_notifications_count()
  }, [user])

  useEffect(_ => {
    if (liveNotifications.length != 0 && liveNotifications.at(-1).category == "message") {
      setUser(prev => {
        const updatedUser = {...prev}

        updatedUser.following = updatedUser.following.map(f => {
          if (liveNotifications.at(-1).sender.id == f.id) {
            return {...f, last_message: liveNotifications.at(-1).content}
          }
          else return {...f}
        })

        return updatedUser
      })
    }
  }, [liveNotifications])

  // Initiate a websocket connection with the backend server to recieve notifications in real time
  useEffect(_ => {
    if (!user) return

    const ws = new WebSocket(`${API_URL}/ws/notifications/${encodeURIComponent(tokens.access)}/`)
    setSocket(ws)

    ws.onerror = error => {
      console.error("error while trying to connect to the websocket", error)
    }

    ws.onclose = event => {
      if (!event.wasClean || event.code == 1006) {
        console.error("Websocket connection failed or was refused!")

        navigate('/directs')
        sl.fire({
          text: "couldnt establish connection with the chat server",
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 2500,
        })
      }
    }

    ws.onmessage = event => {
      const notification = JSON.parse(event.data)

      if (notification.category == "message") {
        if (location.pathname != `/chat/${notification.sender.first_name}${notification.sender.last_name}`) {
          sl.fire({
            text: notification.message,
            icon: 'info',
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
          })
        }
        else mark_message_as_read(notification.sender, notification.content.id)
      }
      else {
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

  // Get all the notifications
  const get_notifications = async _ => {
    if (!tokens) return

    let response;
    try {
       response = await fetch(`${API_URL}/notification/all/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      setLiveNotifications([])
      const data = await response.json()
      return data
    }
    else await handle_response_error(response)
  }

  return(
    <NotificationContext.Provider value={{notificationCount, setNotificationCount, liveNotifications, get_notifications, get_new_notifications_count}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = _ => {
  return useContext(NotificationContext)
}
