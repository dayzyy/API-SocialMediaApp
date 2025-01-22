import Post from "../components/Post"
import Loading from "../components/Loading"

import { useAuth } from "../context/AuthContext"

export default function Home(){
  const { user } = useAuth()

  if (!user) return <main className="pt-36 flex justify-center"><Loading/></main>

  let posts = []
  user.following.forEach(friend => posts = posts.concat(friend.posts))

  return(
    <main className="py-40 px-4">
      {user.posts.length === 0 ?
        <h1 className="text-gray-700 font-bold">No posts available:(</h1>
        :
        <div className="flex flex-col gap-20">
          {
            posts.sort((a, b) => b.created_at.localeCompare(a.created_at)).map(post => <Post key={post.id} post={post}/>)
          }
        </div>
      }
    </main>
  )
}
