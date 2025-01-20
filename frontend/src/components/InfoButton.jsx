export default function InfoButton({text, on_click, toggled}){
  return (
    <div onClick={on_click} className="flex flex-col items-center gap-2  cursor-pointer">
      <p className="text-gray-500 font-semibold  hover:text-gray-300">{text}</p>
      <hr className={`border duration-200  ${toggled ? 'w-[110%] md:w-[200%] border-gray-200' : 'w-0 border-transparent'}`}/>
    </div>
  )
}
