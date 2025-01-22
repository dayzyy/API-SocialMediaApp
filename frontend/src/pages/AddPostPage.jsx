import { useState } from "react"
import { useUserActions } from "../context/UserActionsContext"

import GoBackButton from "../components/GoHomeButton"

export default function AddPost(){
  const [text, setText] = useState('')
  const { make_post } = useUserActions()

  const handle_click = async _ => {
    const status = await make_post(text)

    if (status == 200) setText('')
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
