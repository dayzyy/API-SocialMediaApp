import { IoMdArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"

export default function GoBackButton({addCss}){
  const navigate = useNavigate()

  const handle_click = _ => {
    if (window.history.length > 1) {
      navigate(-1)
    }
    else {
      navigate('/home')
    }
  }

  return <IoMdArrowBack onClick={handle_click} className={`text-3xl  cursor-pointer  ${addCss}`}/>
}
