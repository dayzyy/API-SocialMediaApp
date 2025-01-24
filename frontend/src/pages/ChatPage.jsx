import API_URL from '../settings'

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

import { BsSendFill } from "react-icons/bs";

import Loading from '../components/Loading'
import GoBackButton from '../components/GoHomeButton';

export default function Chat(){
  const navigate = useNavigate()
  const location = useLocation()
  const friend = location.state?.friend
  const {user, tokens} = useAuth()

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)


  if (!friend) {
    navigate('/home')
    return
  }

  useEffect(_ => {
    if (!user) return

    const ws = new WebSocket(`${API_URL}/ws/chat/${friend.id}/${encodeURIComponent(tokens.access)}/`)
    setSocket(ws)

    ws.onmessage = event => {
      const data = JSON.parse(event.data)
      const newMessage = data.message
      setMessages(prev => [...prev, newMessage])
    }

    return _ => {
      if (ws) ws.close()
    }
  }, [user])

  useEffect(_ => {
    if (!socket) return

    const get_chat = async _ => {
      const response = await fetch(`${API_URL}/chat/${friend.id}/`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })

      if (response.status == 200) {
        const data = await response.json()
        setMessages(data)
      }

      if (response.status == 400) {
        navigate('/home')
      }
    }

    get_chat()
  }, [socket])

  useEffect(_ => {
    const chat = document.getElementById("chat")
    chat.scrollTop = chat.scrollHeight
  }, [])

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
    <main className="pt-36  h-screen w-screen  flex flex-col justify-between">
      <div className="flex-none  px-4 w-full h-20  border  flex items-center gap-4  bg-gray-50">
        <GoBackButton customPath='/directs'/>

        <div onClick={_ => navigate(`/profile/${friend.id}`)} className="flex flex-1 gap-4 items-center cursor-pointer">
          <img className="w-12 h-12  border rounded"
          src={friend.profile_picture != null ? `${API_URL}${friend.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

          <p>{friend.first_name} {friend.last_name}</p>
        </div>
      </div>

      <div id="chat" className="w-full  flex-1  flex flex-col gap-2  overflow-y-auto  p-4">
        {messages && messages.map((msg, index) => {
          const acc = msg.sender == user.email ? user : friend
          const isLastMessage = index === messages.length - 1 || messages[index + 1]?.sender != msg.sender

          return (

            <div key={msg.id} className={`flex items-center gap-1 ${msg.sender == user.email ? 'flex-row-reverse' : ''}`}>
              {
                isLastMessage &&
                <img className="w-7 h-7  border rounded-3xl"
                src={acc.profile_picture != null ? `${API_URL}${acc.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>
              }

              <p className={`w-fit overflow-y-auto maxWidthHalf break-words  p-2 rounded-md
              ${!isLastMessage && (msg.sender == user.email ? 'mr-8' : 'ml-8')}
              ${msg.sender == user.email ? 'border' : 'bg-blue-100'}`}>{msg.content}</p>
            </div>
          )
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
