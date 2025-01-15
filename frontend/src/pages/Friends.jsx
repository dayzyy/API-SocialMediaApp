import { useState } from "react"

import Swal from "sweetalert2"

import { useAuth } from "../context/AuthContext"

import API_URL from "../settings"
import Loading from "../components/Loading"

export default function Friends(){
  const [email, setEmail] = useState('')
  const [searchedUser, setSearchedUser] = useState(null)
  const [toggledFollowing, setToggledFollowing] = useState(true)
  const [toggledFollowers, setToggledFollowers] = useState(false)
  const { user, tokens } = useAuth()
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
      console.log(data)
      setSearchedUser(data)
    }
    if (response.status == 400) {
      setSearchedUser({id: -1121})
    }
  }

  const is_following = (user1, user2) => {
    return user1.following.some(friend => friend.id === user2.id)
  }

  if (!user) return <Loading/>

  const accounts = toggledFollowing ? user.following : user.followers

  return (
    <main className="pt-36  w-screen flex flex-col gap-16 items-center px-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-500">Search for users</label>
            <input type="text" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" className="text-gray-600  outline-none border rounded p-2"/>
          </div>
          <button onClick={handle_search} className="text-gray-500 font-bold  border rounded-md p-2">search</button>
        </div>

        {searchedUser && (searchedUser.id === -1121 ?
          <p>user not found</p>
          :
          <div className="flex gap-2 justify-between gap-1 hover:bg-gray-50  p-2 cursor-pointer">
            <div className="flex items-end gap-1">
              <img className="w-10 h-10  border rounded"
              src={searchedUser.profile_picture !== null ? `${API_URL}${searchedUser.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>
              
              <p className="text-gray-500">{searchedUser.first_name} {searchedUser.last_name}</p>
            </div>
            <button className={`p-2  rounded-md  ${!is_following(searchedUser, user) ? 'bg-blue-600 text-white'  : 'border'}`}>
              {is_following(searchedUser, user) ? 'following' : 'follow'}
            </button>
          </div>)
        }
      </div>

      <div className="w-full md:w-[45rem] flex flex-col gap-12">
        <div className="flex justify-around">
          <div className="flex flex-col gap-2 items-center  cursor-pointer">
            <p onClick={_ => {setToggledFollowing(true); setToggledFollowers(false)}} className="text-gray-500 font-semibold  hover:text-gray-300">following</p>
            <hr className={`border border-transparent duration-200  ${toggledFollowing ? 'w-[200%] border-gray-200' : 'w-0'}`}/>
          </div>

          <div className="flex flex-col gap-2 items-center  cursor-pointer">
            <p onClick={_ => {setToggledFollowers(true); setToggledFollowing(false)}} className="text-gray-500 font-semibold  hover:text-gray-300">followers</p>
            <hr className={`border border-transparent duration-200  ${toggledFollowers ? 'w-[200%] border-gray-200' : 'w-0'}`}/>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          {
            accounts.map(friend => {
              return (
                <div key={friend.id} className="w-full  flex justify-between  hover:bg-gray-50  p-2 cursor-pointer">
                  <div className="flex items-end gap-1">
                    <img className="w-12 h-12  border rounded"
                    src={friend.profile_picture !== null ? `${API_URL}${friend.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>
                    
                    <p className="text-gray-500">{friend.first_name} {friend.last_name}</p>
                  </div>
                  <button className={`p-2  rounded-md  ${!is_following(user, friend) ? 'bg-blue-600 text-white'  : 'border'}`}>
                    {is_following(user, friend) ? 'following' : 'follow'}
                  </button>
                </div>
              )})
          }
        </div>
      </div>
    </main>
  )
}
