import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useUserActions } from "../context/UserActionsContext";

import API_URL from "../settings";
import Swal from "sweetalert2";

import Loading from "../components/Loading";
import GoBackButton from "../components/GoBackButton";

export default function EditProfilePage() {
  const sl = Swal
  const { user } = useAuth()
  const [picture, setPicture] = useState(null)
  const { update_profile_picture } = useUserActions()

  const handle_save = async _ => {
    if (!picture) {
      sl.fire({
        text: "make some changes before saving!",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      })
      return
    }

    await update_profile_picture(picture)
    setPicture(null)
  }

  if (!user) return <main className="pt-36 w-screen flex justify-center"><Loading/></main>

  return (
    <main className="pt-40 px-4 flex flex-col gap-8">
      <GoBackButton/>

      <div className="flex flex-wrap justify-center md:justify-start gap-12">
        <img className={`border rounded  h-32 w-32`}
        src={user.profile_picture !== null ? `${API_URL}${user.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

        <div className="relative  grid place-items-center  h-32 w-32  border border-gray-500 border-dashed rounded">
          <input onChange={e => setPicture(e.target.files[0])} type="file" className="h-full w-full opacity-0  cursor-pointer  z-20"/>
          {!picture && <p className="absolute  text-center  text-gray-400 font-semibold">Choose profile picture</p>}
          {picture && <img className="absolute  h-full w-full  border rounded" src={URL.createObjectURL(picture)}/>}
        </div>
      </div>

      <button onClick={handle_save} className="self-end md:self-start  h-14 w-24  rounded  bg-blue-500  text-white font-bold">Save</button>
    </main>
  )
}
