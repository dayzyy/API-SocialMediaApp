import { IoMdArrowBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"

export default function GoBackButton({addCss, customPath}){
  const navigate = useNavigate()

  const handle_click = _ => {
    if (customPath) {
      navigate(customPath)
    }
    else if (window.history.length > 1) {
      navigate(-1)
    }
    else {
      navigate('/home')
    }
  }

  return <IoMdArrowBack onClick={handle_click} className={`text-3xl  cursor-pointer z-20 ${addCss}`}/>
}
