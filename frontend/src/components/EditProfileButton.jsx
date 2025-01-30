import { useNavigate } from "react-router-dom"

export default function EditProfileButton() {
  const navigate = useNavigate()

  return (
    <button onClick={_ =>  navigate('/profile/edit')} className="h-[3rem] px-4  border rounded  hover:bg-gray-50">Edit profile</button>
  )
}
