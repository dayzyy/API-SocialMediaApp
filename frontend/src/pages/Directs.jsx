import Loading from "../components/Loading"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Directs(){
  const {user} = useAuth()
  const navigate = useNavigate()

  return(
    <main className="pt-40  flex flex-col gap-1  items-center justify-center">
      {!user && <Loading/>}

      { user && user.friends.map(friend => {
        return(
          <div onClick={_ => navigate(`/chat/${friend.first_name}${friend.last_name}`, {state: {friend}})} key={friend.id}
          className="px-4 w-screen h-20  border  flex items-center cursor-pointer  bg-gray-50">

            <div className="w-full  flex gap-4">
              <img className="w-12 h-12  border rounded" src="https://cdn-icons-png.flaticon.com/512/2105/2105556.png"/>

              <div className="flex flex-col justify-between">
                <p>{friend.email}</p>
                <p className="text-sm text-gray-400">Hey how are you:)</p>
              </div>
            </div>
          </div>
        )
      })}
    </main>
  )
}
