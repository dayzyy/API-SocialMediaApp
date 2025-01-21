import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import API_URL from "../settings";
import Loading from "../components/Loading";
import GoBackButton from "../components/GoHomeButton";
import InfoButton from "../components/InfoButton";
import Post from "../components/Post";
import ProfileBar from "../components/ProfileBar";


export default function Profile(){
  const { id } = useParams()
  const { tokens } = useAuth()
  const [profile, setProfile] = useState(null)
  const [toggledOption, setToggledOption] = useState("posts")

  useEffect(_ => {
    if (!tokens) return

    const get_profile = async _ => {
      const response = await fetch(`${API_URL}/user/get/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })

      if (response.status == 200) {
        const data = await response.json()
        setProfile(data)
      }
    }
    get_profile()
  }, [tokens])


  if (!profile) return <main className="pt-36 flex justify-center"><Loading/></main>
  console.log(profile)

  return (
    <main className="pt-36 px-4 w-screen flex flex-col items-center">
      <div className="w-full md:w-[750px]  flex flex-col gap-8">
        <GoBackButton addCss="self-start"/>

        <div className="flex w-full gap-2">
          <img className="w-16 h-16  border rounded"
          src={profile.profile_picture != null ? `${API_URL}${profile.profile_picture}` : "https://cdn-icons-png.flaticon.com/512/2105/2105556.png"}/>

          <div className="flex flex-col justify-between">
            <p className="text-gray-600 text-xl">{profile.first_name} {profile.last_name}</p>
            <p className="text-gray-500 text-md">{profile.email}</p>
          </div>
        </div>

        <div className="w-full flex justify-around">
          <InfoButton text={`Posts ~${profile.posts.length}`} toggled={toggledOption === "posts"} on_click={_ => setToggledOption("posts")}/>
          <InfoButton text={`Following ~${profile.following.length}`} toggled={toggledOption === "following"} on_click={_ => setToggledOption("following")}/>
          <InfoButton text={`Followers ~${profile.followers.length}`} toggled={toggledOption === "followers"} on_click={_ => setToggledOption("followers")}/>
        </div>

        <div className="w-full flex flex-col items-center gap-2  max-h-[15rem] overflow-y-scroll">
          {toggledOption === "posts" &&
            profile.posts.sort((post1, post2) => post2.created_at.localeCompare(post1.created_at)).map(post => <Post key={post.id} post={post} />)
          }

          {toggledOption === "following" &&
            profile.following.map(friend => <ProfileBar key={friend.id} profile={friend} />)
          }

          {toggledOption === "followers" &&
            profile.followers.map(friend => <ProfileBar key={friend.id} profile={friend} />)
          }
        </div>
      </div>
    </main>
  )
}
