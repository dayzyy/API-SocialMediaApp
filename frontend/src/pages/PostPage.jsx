import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

import API_URL from "../settings";
import { format_time } from "../utils/dateUtils";

import GoBackButton from "../components/GoHomeButton";
import LikeButton from "../components/LikeButton";
import Loading from "../components/Loading";

export default function PostPage(){
  const { id } = useParams()
  const { tokens } = useAuth()
  const [post, setPost] = useState(null)
  const navigate = useNavigate()

  useEffect(_ => {
    if (!tokens) return

    const get_post = async _ => {
      const response = await fetch(`${API_URL}/user/post/get/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'applicaton/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })

      if (response.status == 200) {
        const data = await response.json()
        setPost(data)
      }
    }

    get_post()
  }, [tokens])

  if (!post) return <main className="pt-36 flex justify-center"><Loading/></main>

  return (
    <main className="w-screen pt-36  px-4  flex flex-col items-center">
      <div className="w-full md:max-w-[750px]  flex flex-col gap-4">
        <GoBackButton/>

        <div className="flex flex-col gap-4">
          <div onClick={_ => navigate(`/profile/${post.author.id}`)} className="flex items-center gap-2 hover:bg-gray-50 p-2 cursor-pointer">
            <img className="w-16 h-16  border rounded"
            src={post.author.profile_picture != null ? `${API_URL}${post.author.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

            <div className="h-16 flex flex-col  justify-between">
              <p className="text-gray-500 font-bold">{post.author.first_name} {post.author.last_name}</p>
              <p className="text-gray-400">{format_time(post.created_at)}</p>
            </div>
          </div>

          <div className="px-4  flex flex-col gap-3">
            <p className="text-gray-700 text-xl">{post.content}</p>
            <LikeButton post={post}/>
          </div>
        </div>
      </div>

    </main>
  )
}
