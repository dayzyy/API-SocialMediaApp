import { useState, useEffect } from "react"

import { useAuth } from "../context/AuthContext";
import { useUserActions } from "../context/UserActionsContext";

import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

export default function LikeButton({post, small}){
  const { user } = useAuth()
  const { like, unlike } = useUserActions()
  const [isLiked, setIsLiked] = useState(0)
  const [likeCount, setLikeCount] = useState(post.likes.length)

  useEffect(_ => {
    if(!user) return

    setIsLiked(post.likes.some(acc => acc.id === user.id))
  }, [user])

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
    <div className="px-2">
      <div className="flex items-center gap-1">
        {isLiked ? 
          <BiSolidLike onClick={_ => handle_click_like(post.id)} className={`${small ? 'text-xl' : 'text-2xl'} text-blue-400  cursor-pointer  active:scale-150`}/>
          :
          <BiLike onClick={_ => handle_click_like(post.id)} className={`${small ? 'text-xl' : 'text-2xl'} text-blue-400  cursor-pointer  active:scale-150`}/>
        }
        <p className="text-gray-500">{likeCount}</p>
      </div>
    </div>
  )
}
