import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

import API_URL from "../settings";

const UserActionsContext = createContext()

export function UserActionsProvider({children}){
  const { tokens, get_user } = useAuth()

  const follow = async id => {
    if (!tokens) return

    console.log('Following...')

    await fetch(`${API_URL}/user/follow/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    get_user()
  }

  const unfollow = async id => {
    if (!tokens) return

    console.log('Unfollowing')

    await fetch(`${API_URL}/user/unfollow/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    get_user()
  }

  const like = async id => {
    if (!tokens) return

    await fetch(`${API_URL}/user/post/${id}/like/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })
  }

  const unlike = async id => {
    if (!tokens) return

    await fetch(`${API_URL}/user/post/${id}/unlike/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })
  }

  return (
    <UserActionsContext.Provider value={{follow, unfollow, like, unlike}}>
      {children}
    </UserActionsContext.Provider>
  )
}

export const useUserActions = _ => {
  return useContext(UserActionsContext)
}
