import { useState } from "react"

import { useAuth } from "../context/AuthContext"
import { useUserActions } from "../context/UserActionsContext"

import Loading from "../components/Loading"
import GoBackButton from "../components/GoHomeButton"
import InfoButton from "../components/InfoButton"
import ProfileBar from "../components/ProfileBar"

import ToggleFollowButton from "../components/ToggleFollowButton"

export default function Friends(){
  const [email, setEmail] = useState('')
  const [searchedUser, setSearchedUser] = useState(null)
  const [toggledOption, setToggledOption] = useState("following")
  const { user } = useAuth()
  const { get_profile } = useUserActions()

  const handle_search = async _ => {
    const profile = await get_profile(email)
    
    if (profile) setSearchedUser(profile)
    else setSearchedUser({id: -1121})
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
            <ProfileBar profile={searchedUser} link={`/profile/${searchedUser.id}`} small={true} hover_color={'gray-50'} button={<ToggleFollowButton profile={searchedUser} small={true}/>}/>)
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
              accounts.map(friend => <ProfileBar key={friend.id} profile={friend} link={`/profile/${friend.id}`} hover_color={'gray-50'} button={<ToggleFollowButton profile={friend}/>}/>)
            }
          </div>
        </div>
      </div>
    </main>
  )
}
