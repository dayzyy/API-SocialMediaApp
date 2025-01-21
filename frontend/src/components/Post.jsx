import { useNavigate } from "react-router-dom";

import { format_time } from "../utils/dateUtils";

import LikeButton from "./LikeButton";

export default function Post({post}){
  const navigate = useNavigate()


  return (
    <div className="w-full flex flex-col gap-4 border rounded-md p-2 bg-gray-50">
      <div onClick={_ => navigate(`/post/${post.id}`)} className="flex gap-2 items-center hover:bg-gray-100 cursor-pointer">
        <img className="w-11 h-11  border rounded-3xl"
        src={post.author.profile_picture != null ? `${API_URL}${post.author.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

        <div className="flex  flex-col justify-between">
          <p className="text-gray-800">{post.author.first_name} {post.author.last_name}</p>
          <p className="text-sm text-gray-500">{format_time(post.created_at)}</p>
        </div>
      </div>

      <div className="px-6  flex flex-col gap-3">
        <p className="text-gray-700">{post.content}</p>
        <LikeButton post={post} small={true}/>
      </div>
    </div>
  )
}
