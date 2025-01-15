import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

import API_URL from "../settings";

const UserActionsContext = createContext()

export function UserActionsProvider({children}){
  const { tokens } = useAuth()

  const follow = async id => {
    if (!tokens) return

    await fetch(`${API_URL}/user/follow/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })
  }

  const unfollow = async id => {
    if (!tokens) return

    await fetch(`${API_URL}/user/unfollow/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })
  }

  return (
    <UserActionsContext.Provider value={{follow, unfollow}}>
      {children}
    </UserActionsContext.Provider>
  )
}

export const useUserActions = _ => {
  return useContext(UserActionsContext)
}
