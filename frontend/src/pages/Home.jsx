import Post from "../components/Post"
import Loading from "../components/Loading"

import { useAuth } from "../context/AuthContext"

export default function Home(){
  const { user } = useAuth()

  if (!user) return <main className="pt-36 flex justify-center"><Loading/></main>

  return(
    <main className="pt-40 px-4">
      {user.posts.length === 0 ?
        <h1>No posts available:(</h1>
        :
        <div className="flex flex-col gap-20">
          {
            user.posts.map(post => <Post key={post.id} post={post}/>)
          }
        </div>
      }
    </main>
  )
}
