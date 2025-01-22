import ProfileBar from "./ProfileBar";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";

export default function Post({post}){
  return (
    <div className="w-full flex flex-col gap-4 border rounded-md p-2 bg-gray-50">
      <ProfileBar profile={post.author} post={post} link={`/post/${post.id}`} hover_color={'bg-gray-100'}/>

      <div className="px-6  flex flex-col gap-3">
        <p className="text-gray-700">{post.content}</p>
        
        <div className="flex gap-6">
          <LikeButton post={post} small={true}/>
          <CommentButton post={post} small={true}/>
        </div>
      </div>
    </div>
  )
}
