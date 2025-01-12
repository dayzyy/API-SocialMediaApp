import API_URL from '../settings'

import { useLocation } from "react-router-dom"
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

import { BsSendFill } from "react-icons/bs";

import Loading from '../components/Loading'

export default function Chat(){
  const location = useLocation()
  const friend = location.state?.friend
  const {user, tokens} = useAuth()

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)

  if (!friend) return <h1>404</h1>

  useEffect(_ => {
    if (!user) return

    const ws = new WebSocket(`${API_URL}/ws/chat/${friend.id}/${encodeURIComponent(tokens.access)}/`)
    setSocket(ws)

    ws.onmessage = event => {
      const data = JSON.parse(event.data)
      const newMessage = {
        content: data.message,
        sender: data.user,
      }
      setMessages(prev => [...prev, newMessage])
    }

    return _ => {
      if (ws) ws.close()
    }
  }, [user])

  const send_message = _ => {
    if (socket && message) {
      const text_data = {
        "message": message
      }
      socket.send(JSON.stringify(text_data))
      setMessage('')
    }
  }

  return(
    <main className="pt-24  h-screen w-screen  flex flex-col justify-between">
      <div className="flex-none  px-4 w-full h-20  border  flex items-center gap-4  cursor-pointer  bg-gray-50">
        <img className="w-12 h-12  border rounded" src="https://cdn-icons-png.flaticon.com/512/2105/2105556.png"/>
        <p>{friend.email}</p>
      </div>

      <div className="w-full  flex-1  flex flex-col gap-2  overflow-y-auto  p-4">
        {messages && messages.map((msg, index) => {
          return <p key={index} className={`w-fit  p-2  border rounded-md  ${msg.sender == user.email ? 'self-end' : ''}`}>{msg.content}</p>
        })}
        {!messages && <Loading/>}
      </div>

      <div className="flex-none  flex  h-12 w-full  border">
        <input type="text" value={message} onChange={e => setMessage(e.target.value)} className="h-full  flex-1  outline-none  border-r  px-4  bg-transparent" placeholder="Send message" />

        <div className="w-16  grid place-content-center">
          <BsSendFill onClick={send_message} className="text-blue-700 text-2xl  cursor-pointer"/>
        </div>
      </div>
    </main>
  )
}
