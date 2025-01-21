import { GoComment } from "react-icons/go";

export default function CommentButton({post, small}){
  
  return (
    <div className="flex items-center gap-1">
      <GoComment className={`${small ? 'text-xl' : 'text-2xl'}  text-green-500`}/>
      <p className="text-gray-500">{post.comment_count}</p>
    </div>
  )
}
