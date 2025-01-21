import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";


export default function PostPage(){
  const { id } = useParams()
  const { tokens } = useAuth()
  const [post, setPost] = useState(null)

  useEffect(_ => {
    if (!tokens) return

    const get_post = fetch()

  }, [tokens])

  return (
    <h1>LOL</h1>
  )
}
