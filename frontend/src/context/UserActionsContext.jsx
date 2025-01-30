import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

import API_URL from "../settings";
import Swal from "sweetalert2";
import { handle_response_error, handle_api_problem } from "../utils/errorHandlingUtils";

const UserActionsContext = createContext()

export function UserActionsProvider({children}){
  const { user, tokens, setUser, get_user } = useAuth()
  const navigate = useNavigate()
  const sl = Swal

  // FOLLOW AND UNFOLLOW

  const follow = async id => {
    if (!tokens) return

    let response;
    try {
      response = await fetch(`${API_URL}/user/follow/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch (error) {handle_api_problem(error)}

    if (response.ok) {
      get_user()
    }
    else await handle_response_error(response)
  }

  const unfollow = async id => {
    if (!tokens) return

    let response;
    try {
       response = await fetch(`${API_URL}/user/unfollow/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      setUser(prev => {
        let updated_user = {...prev}

        updated_user.following = updated_user.following.filter(friend => friend.id != id)

        return updated_user
      })
    }
    else await handle_response_error(response)
  }

  // LIKE AND UNLIKE

  const like = async id => {
    if (!tokens) return

    try {
      await fetch(`${API_URL}/user/post/${id}/like/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}
  }

  const unlike = async id => {
    if (!tokens) return

    try {
      await fetch(`${API_URL}/user/post/${id}/unlike/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}
  }

  // POST CRUD OPERATIONS options:[READ(GET), CREATE, DELETE]
  
  const get_post = async id => {
    if (!tokens) return
      
    let response;
    try {
      response = await fetch(`${API_URL}/user/post/get/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'applicaton/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      const data = await response.json()
      return data
    }
    else await handle_response_error(response)
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

    let response;
    try {
       response = await fetch(`${API_URL}/user/post/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        },
        body: JSON.stringify({
          text: text
        })
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      sl.fire({
        text: "post made successfuly",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return 200
    }
    else await handle_response_error(response)
  }

  const delete_post = async id => {
    if (!tokens) return

    let response;
    try {
       response = await fetch(`${API_URL}/user/post/delete/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'applicaton/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      sl.fire({
        text: "post deleted!",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })

      navigate(-1)

      setUser(prev => {
        let updated_user = {...prev}

        updated_user.posts = updated_user.posts.filter(post => post.id != id)

        return updated_user
      })
    }
    else await handle_response_error(response)
  }

  // GET PROFILE BY EMAIL OR ID

  const get_profile_by_email = async email => {
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
  
    let response;
    try {
      response = await fetch(`${API_URL}/user/get/${encodeURIComponent(email)}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      const data = await response.json()
      return data
    }
    else if (response.status == 404) return null
    else await handle_response_error(response)
  }

  const get_profile_by_id = async id => {
    if (!tokens) return

    let response;
    try {
       response = await fetch(`${API_URL}/user/get/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      const data = await response.json()
      return data
    }
    else if (response.status == 404) return null
    else await handle_response_error(response)
  }

  // COMMENT CRUD OPERATIONS options:[CREATE, DELETE]

  const comment = async (text, id) => {
    if (!tokens) return

    let response;
    try {
       response = await fetch(`${API_URL}/user/post/${id}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'applicaton/json',
          'Authorization': `Bearer ${tokens.access}`
        },
        body: JSON.stringify({text: text})
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      sl.fire({
        text: "comment added",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return 200
    }
    else await handle_response_error(response)
  }

  const delete_comment = async id => {
    if (!tokens) return

    let response;
    try {
       response = await fetch(`${API_URL}/user/post/comment/${id}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'applicaton/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

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
    else await handle_response_error(response)
  }

  // MARKING MESSAGES AND NOTIFICATIONS AS READ

  const mark_message_as_read = async (friend, message_id) => {
    if (!tokens) return

    let response;
    try {
      response = await fetch(`${API_URL}/chat/${friend.id}/${message_id}/`,  {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        }
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
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
    else await handle_response_error(response)
  }

  const mark_notification_as_read = async notification => {
    if (!tokens) return

    try {
      await fetch(`${API_URL}/notification/${notification.id}/seen/`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`
        },
        body: JSON.stringify({"category": notification.category})
      })
    } catch(error) {handle_api_problem(error)}
  }

  // Update the state of user
  // (change last message in a specific chat, when new messages are sent. This is done so that component re-renders and you can see the last message dispalyed at '/directs' right away)
  const update_user_last_message = msg => {
    setUser(prev => {
      const updatedUser = {...prev}

      updatedUser.following = updatedUser.following.map(f => {
        if (msg.recipient == f.email) {
          console.log('Found!')
          return {...f, last_message: msg}
        }
        else return {...f}
      })

      return updatedUser
    })
  }

  // UPDATE PROFILE

  const update_profile_picture = async picture => {
    if (!picture || !tokens) return

    const formData = new FormData()
    formData.append('picture', picture)

    let response;
    try {
      response = await fetch(`${API_URL}/user/update/picture/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        },
        body: formData
      })
    } catch(error) {handle_api_problem(error)}

    if (response.ok) {
      sl.fire({
        text: "profile updated!",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      get_user()
    }
    else await handle_response_error(response)
  }

  return (
    <UserActionsContext.Provider 
      value={{follow, unfollow, like, unlike, get_post, delete_post, delete_comment, get_profile_by_email,
              get_profile_by_id, make_post, comment, mark_message_as_read, mark_notification_as_read, update_user_last_message, update_profile_picture}}>
      {children}
    </UserActionsContext.Provider>
  )
}

export const useUserActions = _ => {
  return useContext(UserActionsContext)
}
