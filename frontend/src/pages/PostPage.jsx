import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserActions } from "../context/UserActionsContext";
import { useEffect, useState } from "react";

import GoBackButton from "../components/GoHomeButton";
import LikeButton from "../components/LikeButton";
import CommentButton from "../components/CommentButton";
import MoreOptionsButton from "../components/MoreOptionsButton"

import ProfileBar from "../components/ProfileBar";

import Loading from "../components/Loading";

import { BsSendFill } from "react-icons/bs";

import Swal from "sweetalert2";

export default function PostPage(){
  const { id } = useParams()
  const { user } = useAuth()
  const { get_post, comment } = useUserActions()
  const [post, setPost] = useState(null)
  const [message, setMessage] = useState('')
  const sl = Swal

  useEffect(_ => {
    const fetch_post = async _ => {
      const post = await get_post(id)
      setPost(post)
    }
    
    fetch_post()
  }, [id])

  const handle_click = async _ => {
    if (!post) return

    if (message.length > 200) {
      sl.fire({
        text: `comment is too long ${message.length}/200`,
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    const status = await comment(message, post.id)
    if (status == 200) setMessage('')
  }

  const handle_delete = _ => {
    console.log('deleting')
  }

  const handle_report = _ => {
    console.log('reporting')
  }

  if (!post || !user) return <main className="pt-36 flex justify-center"><Loading/></main>

  return (
    <main className="w-screen pt-36  px-4  flex flex-col items-center">
      <div className="w-full md:max-w-[750px]  flex flex-col gap-4">
        <GoBackButton/>

        <div className="flex flex-col gap-4">
          <ProfileBar profile={post.author} timestamp={post.created_at} link={`/profile/${post.author.id}`} big={true} hover_color={'gray-50'}
            button={post.author.id == user.id ? <MoreOptionsButton options={[{text: 'delete', click: handle_delete}, {text: 'report', click: handle_report}]} big={true}/> : null}
          />

          <div className="px-4  flex flex-col gap-3">
            <p className="text-gray-700 text-xl">{post.content}</p>
            <div className="flex items-center gap-6">
              <LikeButton post={post}/>
              <CommentButton post={post}/>
            </div>
          </div>
        </div>

        <div className="flex-none  flex  h-12 w-full  border">
          <input type="text" value={message} onChange={e => setMessage(e.target.value)}
            className="h-full  flex-1  outline-none border-r  px-4  bg-transparent" placeholder="Add comment" />

          <div className="w-16  grid place-content-center">
            <BsSendFill onClick={handle_click} className="text-blue-700 text-2xl  cursor-pointer"/>
          </div>
        </div>

        <div className="py-10 px-4">
          {
            post.comments.length === 0 && <p className="text-gray-500 text-xl">No comments</p>
          }
          { 
            post.comments.length > 0 &&
              <div className="flex flex-col gap-4">
                {post.comments.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(comment => {
                  return (
                    <div key={comment.id} className="div">
                      <ProfileBar key={comment.id} profile={comment.author} link={`/profile/${comment.author.id}`} timestamp={comment.created_at} small={true} hover_color={'gray-50'}/>
                      <p className="text-gray-700 px-4">{comment.content}</p>
                    </div>
                  )
                })}
                
              </div>
          }
        </div>
      </div>
    </main>
  )
}
