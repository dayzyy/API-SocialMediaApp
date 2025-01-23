import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export default function Input({value, label, change, type, password_toggler}){
  return (
      <div className="relative  w-64 md:w-80 h-14  border border-gray-400 rounded  flex items-center">
        <input type={type} placeholder="" value={value} onChange={e => change(e.target.value)}
          className="slideAnimation  absolute  h-full w-full  outline-none bg-transparent  text-gray-700  pl-4 pr-12 z-10"/>
        <label className="absolute  text-gray-800  px-8  bg-white  ease-linear duration-75">{label}</label>
        {password_toggler && (
          type == 'password' ?
          <FaRegEye onClick={password_toggler} className="absolute right-3  z-30  text-2xl text-green-400  cursor-pointer"/>
          : <FaRegEyeSlash onClick={password_toggler} className="absolute right-3  z-30  text-2xl text-green-500  cursor-pointer"/>
        )}
      </div>
  )
}
