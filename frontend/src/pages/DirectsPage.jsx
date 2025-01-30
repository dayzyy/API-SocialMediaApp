import Loading from "../components/Loading"
import { useAuth } from "../context/AuthContext"
import { useUserActions } from "../context/UserActionsContext"
import { useNavigate } from "react-router-dom"

import API_URL from "../settings"
import { format_time } from "../utils/dateUtils"

import GoBackButton from "../components/GoBackButton"

export default function Directs(){
  const { user} = useAuth()
  const { mark_message_as_read } = useUserActions()
  const navigate = useNavigate()


  if (!user) return <main className="pt-36 w-screen flex justify-center"><Loading/></main>

  const sorted_friends = user.following.sort((a, b) => {
    const date_a = a.last_message?.created_at || null
    const date_b = b.last_message?.created_at || null

    if (date_a && date_b) return date_b.localeCompare(date_a)
    else if (date_a) return -1
    else if (date_b) return 1
    else return 0
  })

  const handle_click = async friend => {
    navigate(`/chat/${friend.first_name}${friend.last_name}`, {state: {friend: friend}})

    if (user && friend.last_message?.sender === friend.email && !friend.last_message.is_read) {
      await mark_message_as_read(friend, friend.last_message.id)
    }
  }

  return (
    <main className="pt-36  flex flex-col gap-1  items-center justify-center">
      <GoBackButton addCss="self-start  ml-4"/>
      {user.following.length == 0 && <p className="text-gray-500 text-xl">You have no friends:(</p>}
      
      {sorted_friends.map(friend => {
        return(
          <div onClick={_ => handle_click(friend)}  key={friend.id}
          className="px-4 w-screen h-20  border  flex items-center cursor-pointer  bg-gray-50">

            <div className="w-full  flex gap-4">
              <img className="w-12 h-12  border rounded"
              src={friend.profile_picture !== null ? `${API_URL}${friend.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

              <div className="flex flex-col justify-between">
                <p>{friend.first_name} {friend.last_name}</p>
                <div className="flex gap-2 items-center">
                  {friend.last_message.sender && friend.last_message.sender == user.email && <p className={`text-sm text-gray-600`}>You:</p>}
                  <p className={`text-sm text-gray-400 ${friend.last_message.sender && friend.last_message.sender !== user.email && !friend.last_message.is_read ?'font-bold text-gray-500':''}`}>
                    {friend.last_message.content != '' ? friend.last_message.content.slice(0, 7) + '...' : 'Start a conversation!'}
                  </p>
                  {friend.last_message.sender && <p className={`text-sm text-gray-600`}>{format_time(friend.last_message.created_at)}</p>}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </main>
  )
}
