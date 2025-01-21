import { useState } from "react"
import { useAuth } from "../context/AuthContext"

import Swal from "sweetalert2"

import API_URL from "../settings"

import GoBackButton from "../components/GoHomeButton"

export default function AddPost(){
  const [text, setText] = useState('')
  const { user, tokens } = useAuth()
  const sl = Swal

  const handle_click = async _ => {
    if (!user || !tokens) return

    if (!text) {
      sl.fire({
        text: "cant post an empty string",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    if (text.length > 500) {
      sl.fire({
        text: `Too many words! ${text.length}/500`,
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const response = await fetch(`${API_URL}/user/post/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      },
      body: JSON.stringify({
        text: text
      })
    })

    if (response.status == 200) {
      sl.fire({
        text: "post made successfuly",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      setText('')
    }
  }

  return (
    <main className="pt-36 flex flex-col items-center justify-center gap-1">
      <GoBackButton addCss="self-start ml-4"/>

      <div className="w-9/12 md:w-fit flex flex-col gap-4">
        <div className="relative  flex flex-col items-end  border rounded  h-80  w-full md:w-96  p-4">
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add a post"
          className="w-full h-5/6  resize-none outline-none  text-gray-700">
          </textarea>

          <p className="text-gray-700">{text.length}/500</p>
        </div>

        <button onClick={handle_click} className="self-end  w-32  border rounded-md  p-2  text-gray-500 font-bold">post</button>
      </div>
    </main>
  )
}
