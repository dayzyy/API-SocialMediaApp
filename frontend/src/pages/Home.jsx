import Post from "../components/Post"
import Loading from "../components/Loading"

import { useAuth } from "../context/AuthContext"

export default function Home(){
  const { user } = useAuth()

  if (!user) return <main className="pt-36 flex justify-center"><Loading/></main>

  let posts = [...user.posts]

  user.following.forEach(friend => {
    posts = posts.concat(friend.posts)
  })

  posts.sort((post1, post2) => post2.created_at.localeCompare(post1.created_at))

  console.log(posts)

  return(
    <main className="py-40 px-4">
      {posts.length === 0 ?
        <h1 className="text-gray-700 font-bold">No posts available:(</h1>
        :
        <div className="flex flex-col gap-20">
          {
            posts.map(post => <Post key={post.id} post={post}/>)
          }
        </div>
      }
    </main>
  )
}
