import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserActions } from "../context/UserActionsContext";

import Loading from "../components/Loading";
import GoBackButton from "../components/GoHomeButton";
import InfoButton from "../components/InfoButton";
import Post from "../components/Post";
import ProfileBar from "../components/ProfileBar";

import ToggleFollowButton from "../components/ToggleFollowButton";

export default function Profile(){
  const { id } = useParams()
  const { tokens, user } = useAuth()
  const { get_user_by_id } = useUserActions()
  const [profile, setProfile] = useState(null)
  const [toggledOption, setToggledOption] = useState("posts")

  useEffect(_ => {
    if (!tokens) return

    const fetch_profile = async _ => {
      const profile_data = await get_user_by_id(id)

      if (profile_data) setProfile(user_data)
    }

    fetch_profile()
  }, [tokens, id])


  if (!profile || !user) return <main className="pt-36 flex justify-center"><Loading/></main>

  return (
    <main className="pt-36 px-4 w-screen flex flex-col items-center">
      <div className="w-full md:w-[750px]  flex flex-col gap-8">
        <GoBackButton addCss="self-start"/>

        <ProfileBar profile={profile} big={true} button={profile.id == user.id ? null : <ToggleFollowButton profile={profile} big={true}/>}/>

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
            profile.following.map(friend => <ProfileBar key={friend.id} profile={friend} link={`/profile/${friend.id}`} hover_color={'gray-50'} button={<ToggleFollowButton profile={friend}/>}/>)
          }

          {toggledOption === "followers" &&
            profile.followers.map(friend => <ProfileBar key={friend.id} profile={friend} link={`/profile/${friend.id}`} hover_color={'gray-50'} button={<ToggleFollowButton profile={friend}/>}/>)
          }
        </div>
      </div>
    </main>
  )
}
