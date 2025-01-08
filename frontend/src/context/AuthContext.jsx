import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

import API_URL from '../settings'

const AuthContext = createContext()

export function AuthProvider({children}){
  const [tokens, setTokens] = useState(JSON.parse(localStorage.getItem('tokens')))
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const sl = Swal

  useEffect(_ => {
    if (tokens) console.log('getting user...')

    else {
      if (location.pathname != '/login' && location.pathname != '/signup') {
          navigate('/login')
        }
    }
  }, [tokens])

  const login = async (email, password) => {
    if (!email || !password) {
      sl.fire({
        text: "fill out the form",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const response = await fetch(`${API_URL}/tokens/obtain/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    })

    if (response.status == 200){
      sl.fire({
        title: "Success",
        text: "logged in!",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      const data = await response.json()
      localStorage.setItem('tokens', JSON.stringify(data))
      setTokens(data)

      navigate('/home')
      return
    }

    if (response.status == 401){
      sl.fire({
        title: "Unauthorized",
        text: "Wrong credentials",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  const register = async (email, password1, password2, firstName, lastName) => {
    if (!email || !password1 || !firstName || !lastName) {
      sl.fire({
        text: "fill out the form",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    if (password1 != password2) {
      sl.fire({
        text: "passwords dont match",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      return
    }

    const response = await fetch(`${API_URL}/user/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password1,
        first_name: firstName,
        last_name: lastName,
      })
    })

    if (response.status == 200) {
      sl.fire({
        title: "Success",
        text: "signed up!",
        icon: 'success',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
      navigate('/login')
      return
    }

    if (response.status == 409) {
      sl.fire({
        title: "Invalid",
        text: "email already in use",
        icon: 'error',
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
      })
    }
  }

  return (
    <AuthContext.Provider value={{login, register}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
