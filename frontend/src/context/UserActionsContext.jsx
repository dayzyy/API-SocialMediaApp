import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

import API_URL from "../settings";
import Swal from "sweetalert2";

const UserActionsContext = createContext()

export function UserActionsProvider({children}){
  const { user, tokens, setUser, get_user } = useAuth()
  const navigate = useNavigate()
  const sl = Swal

  const follow = async id => {
    if (!tokens) return

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

    await fetch(`${API_URL}/user/unfollow/${id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    setUser(prev => {
      let updated_user = {...prev}

      updated_user.following = updated_user.following.filter(friend => friend.id != id)

      return updated_user
    })
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

  const delete_post = async id => {
    const response = await fetch(`${API_URL}/user/post/delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'applicaton/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    if (response.status == 200) {
      sl.fire({
        text: "post deleted!",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })

      navigate('/home')

      setUser(prev => {
        let updated_user = {...prev}

        updated_user.posts = updated_user.posts.filter(post => post.id != id)

        return updated_user
      })
    }

    if (response.status == 404) {
      const error = await response.json()
      console.log(error)
    }
  }

  const delete_comment = async id => {
    const response = await fetch(`${API_URL}/user/post/comment/${id}/delete/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'applicaton/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    if (response.ok) {
      sl.fire({
        text: "comment deleted",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return true
    }
    else {
      const error = await response.json()['error']
      console.log(error)
      return false
    }
  }

  const comment = async (text, id) => {
    if (!tokens) return

    const response = await fetch(`${API_URL}/user/post/${id}/comment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'applicaton/json',
        'Authorization': `Bearer ${tokens.access}`
      },
      body: JSON.stringify({text: text})
    })

    if (response.status == 200) {
      sl.fire({
        text: "comment added",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return 200
    }
  }

  const mark_message_as_read = async (friend, message_id) => {
    await fetch(`${API_URL}/chat/${friend.id}/${message_id}/`,  {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      }
    })

    setUser(prev => {
      let updated_user = {...prev}

      updated_user.following = updated_user.following.map(f => {
        if (f.id == friend.id) {
          return {...f, last_message: {...f.last_message, is_read: true}}
        }
        else {
          return f
        }
      })

      return updated_user
    })
  }

  const mark_notification_as_read = async notification => {
    await fetch(`${API_URL}/notification/${notification.id}/seen/`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${tokens.access}`
      },
      body: JSON.stringify({"category": notification.category})
    })
  }

  return (
    <UserActionsContext.Provider 
      value={{follow, unfollow, like, unlike, get_post, delete_post, delete_comment, get_profile,
              make_post, comment, mark_message_as_read, mark_notification_as_read}}>
      {children}
    </UserActionsContext.Provider>
  )
}

export const useUserActions = _ => {
  return useContext(UserActionsContext)
}
