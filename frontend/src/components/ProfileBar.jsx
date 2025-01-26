import { useNavigate } from "react-router-dom"

import { format_time } from "../utils/dateUtils"

import API_URL from "../settings"

export default function ProfileBar({profile, timestamp, icon, message, link, small, big, button, hover_color}){
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

  const hover_colors = {
    'gray-50': 'hover:bg-gray-50 cursor-pointer',
    'gray-100': 'hover:bg-gray-100 cursor-pointer'
  }

  const handle_click = _ => {
    if (link) navigate(link)
  }

  return (
    <div onClick={handle_click} key={profile.id} className={`w-full  flex justify-between items-center  py-2 ${hover_colors[hover_color] || ''}`}>
      <div className={`flex ${icon ? 'gap-8' : 'gap-1'}`}>
        <div className="relative">
          <img className={`border rounded  ${picture_size}`}
          src={profile.profile_picture !== null ? `${API_URL}${profile.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

          {icon && icon}
        </div>
        
        <div className={`${div_height} flex flex-col justify-between`}>
          {!message && <p className={`${font_size} text-gray-600`}>{profile.first_name} {profile.last_name}</p>}
          {timestamp && <p className={`${secondary_font_size} text-gray-400`}>{format_time(timestamp)}</p>}
          {!timestamp && <p className={`${secondary_font_size} text-gray-400`}>{profile.email}</p>}
          {message && <p className={`${font_size} text-gray-600`}>{message}</p>}
        </div>
      </div>

      {button}
    </div>
  )
}
