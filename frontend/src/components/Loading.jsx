import { BiLoaderAlt } from "react-icons/bi";

export default function Loading({addCss}){
  return <BiLoaderAlt className={`text-4xl  animate-spin  text-gray-400 ${addCss && addCss}`} />
}
