import { FaReact } from "react-icons/fa6";

export default function Header(){
  return (
    <header className="fixed top-0 h-20 w-screen  bg-gray-100  flex items-center  p-4">
      <div className="flex items-center gap-2">
        <FaReact className="text-6xl text-gray-800"/>
        <p className="text-3xl">Rmedia</p>
      </div>
    </header>
  )
}
