import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

import { useAuth } from "../context/AuthContext";

import { useState } from "react";

export default function Post({post}){
  const { user } = useAuth()
  console.log(post)

  const format_time = date => {
    const current_date = new Date()


    const [year, month, day, hour, minute, second] = date.split(" ")
    const post_date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    )

    const diff_in_seconds = Math.floor((current_date - post_date) / 1000)
    if (diff_in_seconds < 60) return `${diff_in_seconds} second${diff_in_seconds === 1 ? '' : 's'} ago`

    const diff_in_minutes = Math.floor(diff_in_seconds / 60)
    if (diff_in_minutes < 60) return `${diff_in_minutes} minute${diff_in_minutes === 1 ? '' : 's'} ago`

    const diff_in_hours = Math.floor(diff_in_minutes / 60)
    if (diff_in_hours < 24) return `${diff_in_hours} hour${diff_in_hours === 1 ? '' : 's'} ago`

    const diff_in_days = Math.floor(diff_in_hours / 24)
    if (diff_in_days < 30) return `${diff_in_days} day${diff_in_days === 1 ? '' : 's'} ago`

    const diff_in_months = Math.floor(diff_in_days / 30)
    if (diff_in_months < 12) return `${diff_in_months} month${diff_in_months === 1 ? '' : 's'} ago`

    const diff_in_years = Math.floor(diff_in_days / 365)
    return `${diff_in_years} year${diff_in_years === 1 ? '' : 's'} ago`
  }

  const is_liked = _ => {
    return post.likes.some(acc => acc.id === user.id)
  }

  const [isLiked, setIsLiked] = useState(is_liked())

  const handle_click_like = _ => {
    setIsLiked(prev => !prev)
  }

  return (
    <div className="flex flex-col gap-4 border rounded-md p-2 bg-gray-50">
      <div className="flex gap-2 items-center hover:bg-gray-100 cursor-pointer">
        <img className="w-11 h-11  border rounded-3xl"
        src={post.author.profile_picture != null ? `${API_URL}${post.author.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

        <div className="flex  flex-col justify-between">
          <p className="text-gray-800">{post.author.first_name} {post.author.last_name}</p>
          <p className="text-sm text-gray-500">{format_time(post.created_at)}</p>
        </div>
      </div>

      <p className="px-4  text-gray-900">{post.content}</p>

      <div className="px-4">
        <div className="flex items-center gap-1">
          {isLiked ? 
            <BiSolidLike onClick={handle_click_like} className="text-xl text-blue-400  cursor-pointer"/>
            :
            <BiLike onClick={handle_click_like} className="text-xl text-blue-400  cursor-pointer"/>
          }
          <p className="text-gray-500">{post.likes.length}</p>
        </div>
      </div>
    </div>
  )
}
