import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

import API_URL from "../settings";
import Swal from "sweetalert2";

const UserActionsContext = createContext()

export function UserActionsProvider({children}){
  const { user, tokens, get_user } = useAuth()
  const sl = Swal

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

  const get_post = async id => {
    if (!tokens) return
      
    const response = await fetch(`${API_URL}/user/post/get/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'applicaton/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    if (response.status == 200) {
      const data = await response.json()
      return data
    }
  }

  const get_profile = async email => {
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
      return data
    }
    if (response.status == 404) return null
  }

  const make_post = async text => {
    if (!user || !tokens) return

    if (!text) {
      sl.fire({
        text: "cant post an empty string",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    if (text.length > 500) {
      sl.fire({
        text: `Too many words! ${text.length}/500`,
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const response = await fetch(`${API_URL}/user/post/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      },
      body: JSON.stringify({
        text: text
      })
    })

    if (response.status == 200) {
      sl.fire({
        text: "post made successfuly",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return 200
    }
  }

  return (
    <UserActionsContext.Provider value={{follow, unfollow, like, unlike, get_post, get_profile, make_post}}>
      {children}
    </UserActionsContext.Provider>
  )
}

export const useUserActions = _ => {
  return useContext(UserActionsContext)
}
