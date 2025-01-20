import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useUserActions } from "../context/UserActionsContext"
import { is_following } from "../utils/accountUtils"

export default function ProfileBar({profile, small}){
  const { follow, unfollow } = useUserActions()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handle_click = (e, profile) => {
    e.stopPropagation()

    if (is_following(user, profile)) {
      unfollow(profile.id)
    }
    else {
      follow(profile.id)
    }
  }

  return (
    <div onClick={_ => navigate(`/profile/${profile.id}`)} key={profile.id} className="w-full  flex justify-between items-center  hover:bg-gray-50  p-2 cursor-pointer">
      <div className="flex items-end gap-1">
        <img className={`border rounded  ${small ? 'w-10 h-10' : 'w-12 h-12'}`}
        src={profile.profile_picture !== null ? `${API_URL}${profile.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>
        
        <p className="text-gray-500">{profile.first_name} {profile.last_name}</p>
      </div>
      <button 
        className={`rounded-md  z-10 text-sm
        ${!is_following(user, profile) ? 'bg-blue-600 hover:bg-blue-500 text-white'  : 'border bg-white hover:bg-gray-100'}
        ${small ? 'h-[2.2rem] px-2' : 'h-[2.5rem] px-4'}
        `}
        onClick={e => handle_click(e, profile)}>
        {is_following(user, profile) ? 'following' : 'follow'}
      </button>
    </div>
  )
}
