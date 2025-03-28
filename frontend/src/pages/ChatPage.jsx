import API_URL from '../settings'
import Swal from 'sweetalert2'

import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useUserActions } from '../context/UserActionsContext'

import { format_time } from '../utils/dateUtils'

import { BsSendFill } from "react-icons/bs";

import Loading from '../components/Loading'
import GoBackButton from '../components/GoBackButton';

export default function Chat(){
  const sl = Swal
  const navigate = useNavigate()
  const location = useLocation()
  const friend = location.state?.friend
  const { user, tokens } = useAuth()
  const { update_user_last_message } = useUserActions()

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(null)
  const [socket, setSocket] = useState(null)


  if (!friend) {
    navigate('/home')
    return
  }

  useEffect(_ => {
    if (!user) return

    const ws = new WebSocket(`${API_URL}/ws/chat/${friend.id}/${encodeURIComponent(tokens.access)}/`)
    setSocket(ws)

    ws.onerror = error => {
      console.error("error while trying to connect to the chat websocket", error)
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
      const data = JSON.parse(event.data)
      const newMessage = data.message
      setMessages(prev => [...prev, newMessage])
      update_user_last_message(newMessage)
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
  }, [messages])

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

      <div id="chat" className="w-full  flex-1  flex flex-col  overflow-y-auto gap-1 p-4">
        {!messages && <Loading addCss="self-center"/>}
        <p className="self-center text-xl text-gray-500 font-bold  mb-8">Start of your conversation!</p>
        {messages && messages.map((msg, index) => {
          const acc = msg.sender == user.email ? user : friend
          const isLastMessage = index === messages.length - 1 || messages[index + 1]?.sender != msg.sender

          return (
            <div key={msg.id} className={`flex items-center ${msg.sender == user.email ? 'flex-row-reverse' : ''}`}>
              <div className={`w-full flex flex-col ${msg.sender == user.email ? 'items-end' : 'items-start'}`}>
                <div className={`w-full flex ${msg.sender == user.email ? 'flex-row-reverse' : ''} items-end gap-1`}>
                  {isLastMessage &&
                    <img className="w-7 h-7  border rounded-3xl"
                    src={acc.profile_picture != null ? `${API_URL}${acc.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>
                  }
                  <p className={`w-fit overflow-y-auto maxWidthHalf break-words  p-2 rounded-md
                  ${!isLastMessage && (msg.sender == user.email ? 'mr-8' : 'ml-8')}
                  ${msg.sender == user.email ? 'border' : 'bg-blue-100'}`}>{msg.content}</p>
                </div>

                {msg == messages.at(-1) && <p className={`text-sm text-gray-400 ${msg.sender == user.email ? 'mr-8' : 'ml-8'}`}>{format_time(msg.created_at)}</p>}
              </div>
            </div>
          )
        })}
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
