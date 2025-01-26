import { useState } from "react";

import { CiCircleMore } from "react-icons/ci";

export default function MoreOptionsButton({options, big}){
  const [isToggled, setIsToggled] = useState(false)

  const toggle = e => {
    e.stopPropagation()

    setIsToggled(prev => !prev)
  }

  const get_handler = (e, func) => {
    e.stopPropagation()
    func()
  }

  return (
    <div className="relative flex gap-1">
      <div className={`${!isToggled ? 'hidden h-0' : 'h-fit'} ${big ? 'right-10' : 'r-2'} absolute  duration-75  border rounded  p-1 bg-white z-20`}>
        {options.map(option => <p key={option.text} className="text-gray-700 hover:bg-gray-100 p-2" onClick={e => get_handler(e, option.click)}>{option.text}</p>)}
      </div>

      <CiCircleMore className={`text-gray-600 hover:text-gray-800 ${big && 'text-4xl'}`}
        onClick={e => toggle(e)}
      />
    </div>
  )
}
