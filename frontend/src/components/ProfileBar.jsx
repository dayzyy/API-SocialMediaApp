import { useNavigate } from "react-router-dom"

import { format_time } from "../utils/dateUtils"

import ToggleFollowButton from "./ToggleFollowButton"

import API_URL from "../settings"

export default function ProfileBar({profile, post, link, small, big, show_follow_button, hover_color}){
  const navigate = useNavigate()

  let picture_size = 'w-12 h-12'
  if (small) picture_size = 'w-10 h-10'
  else if (big) picture_size = 'w-16 h-16'
  const div_height = picture_size.split(' ')[1]

  let font_size = 'text-[16px]'
  let secondary_font_size = 'text-[13px]'
  if (small) {
    font_size = 'text-md'
    secondary_font_size = 'text-sm'
  }
  else if(big) {
    font_size = 'text-xl'
    secondary_font_size = 'text-md'
  }

  return (
    <div onClick={_ => navigate(link)} key={profile.id} className={`w-full  flex justify-between items-center  p-2 cursor-pointer  hover:${hover_color}`}>
      <div className="flex items-end gap-1">
        <img className={`border rounded  ${picture_size}`}
        src={profile.profile_picture !== null ? `${API_URL}${profile.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>
        
        <div className={`${div_height} flex flex-col justify-between`}>
          <p className={`${font_size} text-gray-600`}>{profile.first_name} {profile.last_name}</p>
          {post && <p className={`${secondary_font_size} text-gray-400`}>{format_time(post.created_at)}</p>}
          {!post && <p className={`${secondary_font_size} text-gray-400`}>{profile.email}</p>}
        </div>
      </div>

      {show_follow_button && <ToggleFollowButton profile={profile} small={small} big={big}/>}
    </div>
  )
}
