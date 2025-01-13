import Loading from "../components/Loading"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

import API_URL from "../settings"

import { IoMdArrowBack } from "react-icons/io"

export default function Directs(){
  const {user} = useAuth()
  const navigate = useNavigate()

  return(
    <main className="pt-24  flex flex-col gap-1  items-center justify-center">
      {!user && <Loading/>}
      
      <IoMdArrowBack onClick={_ => navigate('/home')} className="text-3xl  cursor-pointer  self-start  ml-4"/>
      {user && user.friends.map(friend => {
        console.log(friend)
        return(
          <div onClick={_ => navigate(`/chat/${friend.first_name}${friend.last_name}`, {state: {friend}})} key={friend.id}
          className="px-4 w-screen h-20  border  flex items-center cursor-pointer  bg-gray-50">

            <div className="w-full  flex gap-4">
              <img className="w-12 h-12  border rounded"
              src={friend.profile_picture !== null ? `${API_URL}${friend.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

              <div className="flex flex-col justify-between">
                <p>{friend.first_name} {friend.last_name}</p>
                <div className="flex gap-4 items-center">
                  <p className={`text-sm text-gray-400 ${friend.last_message.sender && friend.last_message.sender !== user.email && !friend.last_message.is_read ?'font-bold text-gray-500':''}`}>
                    {friend.last_message.content != '' ? friend.last_message.content : 'Start a conversation!'}
                  </p>
                  <p className={`text-sm text-gray-600`}>
                    {friend.last_message.sender && (friend.last_message.sender == user.email ? '-You' : '')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </main>
  )
}
