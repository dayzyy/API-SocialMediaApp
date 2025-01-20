import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

import { useAuth } from "../context/AuthContext";
import { useUserActions } from "../context/UserActionsContext";

import { useState } from "react";

import { format_time } from "../utils/dateUtils";

export default function Post({post}){
  const { user } = useAuth()
  const { like, unlike } = useUserActions()

  const is_liked = _ => {
    return post.likes.some(acc => acc.id === user.id)
  }

  const [isLiked, setIsLiked] = useState(is_liked())
  const [likeCount, setLikeCount] = useState(post.likes.length)

  const handle_click_like = id => {
    if (isLiked) {
      unlike(id)
      setLikeCount(prev => prev - 1)
    }
    else{
      like(id)
      setLikeCount(prev => prev + 1)
    }

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
            <BiSolidLike onClick={_ => handle_click_like(post.id)} className="text-xl text-blue-400  cursor-pointer  active:scale-150"/>
            :
            <BiLike onClick={_ => handle_click_like(post.id)} className="text-xl text-blue-400  cursor-pointer  active:scale-150"/>
          }
          <p className="text-gray-500">{likeCount}</p>
        </div>
      </div>
    </div>
  )
}
