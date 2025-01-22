import { useState } from "react"

import Swal from "sweetalert2"

import { useAuth } from "../context/AuthContext"

import API_URL from "../settings"
import Loading from "../components/Loading"
import GoBackButton from "../components/GoHomeButton"
import InfoButton from "../components/InfoButton"
import ProfileBar from "../components/ProfileBar"

export default function Friends(){
  const [email, setEmail] = useState('')
  const [searchedUser, setSearchedUser] = useState(null)
  const [toggledOption, setToggledOption] = useState("following")
  const { user, tokens} = useAuth()
  const sl = Swal

  const handle_search = async _ => {
    if (!email) {
      sl.fire({
        text: "type in an email",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    if (!user || !tokens) return
  
    const response = await fetch(`${API_URL}/user/get/${encodeURIComponent(email)}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    if (response.status == 200) {
      const data = await response.json()
      setSearchedUser(data)
    }
    if (response.status == 404) {
      setSearchedUser({id: -1121})
    }
  }

  if (!user) return <main className="pt-36 -screen h-screen flex justify-center"><Loading/></main>

  const accounts = toggledOption === "following" ? user.following : user.followers

  return (
    <main className="pt-36  w-screen flex flex-col gap-1 items-center">
      <GoBackButton addCss="self-start ml-4"/>

      <div className="flex flex-col gap-16 items-center px-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-end">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-500">Search for users</label>
              <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" className="text-gray-600  outline-none border rounded p-2"/>
            </div>
            <button onClick={handle_search} className="text-gray-500 font-bold  border rounded-md p-2">search</button>
          </div>

          {searchedUser && (searchedUser.id === -1121 ?
            <p className="text-gray-500">user not found!</p>
            :
            <ProfileBar profile={searchedUser} link={`/profile/${searchedUser.id}`} small={true} hover_color={'bg-gray-50'} show_follow_button={true}/>)
          }
        </div>

        <div className="w-full md:w-[45rem] flex flex-col gap-12">
          <div className="flex justify-around">
            <InfoButton text={`following ~${user.following.length}`} toggled={toggledOption === "following"} on_click={_ => setToggledOption("following")} />
            <InfoButton text={`followers ~${user.followers.length}`} toggled={toggledOption === "followers"} on_click={_ => setToggledOption("followers")} />
          </div>

          <div className="w-full max-h-[15rem] overflow-y-scroll flex flex-col gap-4 items-center">
            {accounts.length == 0 && (
              toggledOption === "following" ?
              <p className="text-gray-500 text-xl">You dont follow anyone</p>
              :
              <p className="text-gray-500 text-xl">Nobody follows you:(</p>
            )}

            {
              accounts.map(friend => <ProfileBar key={friend.id} profile={friend} link={`/profile/${friend.id}`} hover_color={'bg-gray-50'} show_follow_button={true}/>)
            }
          </div>
        </div>
      </div>
    </main>
  )
}
