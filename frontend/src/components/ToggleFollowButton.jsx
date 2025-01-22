import { useAuth } from "../context/AuthContext"
import { useUserActions } from "../context/UserActionsContext"
import { is_following } from "../utils/accountUtils"

export default function ToggleFollowButton({profile, small, big}){
  const { user } = useAuth()
  const { follow, unfollow } = useUserActions()

  let size = 'h-[2.5rem] px-2'
  if (small) size = 'h-[2.2rem] px-2'
  else if (big) size = 'h-[3rem] px-4'

  const handle_click = (e) => {
    e.stopPropagation()

    if (is_following(user, profile)) {
      unfollow(profile.id)
    }
    else {
      follow(profile.id)
    }
  }

  return (
    <button 
      className={`rounded-md  z-10 text-sm ${size} ${!is_following(user, profile) ? 'bg-blue-600 hover:bg-blue-500 text-white'  : 'border bg-white hover:bg-gray-100'}`}
      onClick={e => handle_click(e)}>
      {is_following(user, profile) ? 'following' : 'follow'}
    </button>
  )
}
