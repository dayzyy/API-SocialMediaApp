import { useState } from "react";

import { confirmation_screen } from "../utils/confirmationUtils";

import { CiCircleMore } from "react-icons/ci";

export default function MoreOptionsButton({options, big}){
  const [isToggled, setIsToggled] = useState(false)

  const toggle = e => {
    e.stopPropagation()

    setIsToggled(prev => !prev)

    const hide_options = _ => {
      setIsToggled(false)
      document.removeEventListener('click', hide_options)
    }

    document.addEventListener('click', hide_options)
  }

  const get_handler = (e, confirmation, func) => {
    e.stopPropagation()
    confirmation_screen(confirmation, _ => {func(), toggle(e)}, _ => toggle(e))
  }

  return (
    <div className="relative flex gap-1">
      <div className={`${!isToggled ? 'hidden h-0' : 'h-fit'} ${big ? 'right-10' : 'right-2'} absolute border rounded  p-1 bg-white z-20`}>
        {options.map(option => <p key={option.text} className="text-gray-700 hover:bg-gray-100 p-2" onClick={e => get_handler(e, option.confirmation, option.click)}>{option.text}</p>)}
      </div>

      <CiCircleMore className={`text-gray-600 hover:text-gray-800 ${big && 'text-4xl'}`}
        onClick={e => toggle(e)}
      />
    </div>
  )
}
