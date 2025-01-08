import { Routes, Route } from 'react-router-dom'

import Signup from './pages/Signup'
import Login from './pages/Login'

import { AuthProvider } from './context/AuthContext'

export default function App(){
  return(
    <AuthProvider>
      <Routes>
        <Route path='/home' element={<h1>main page</h1>}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='*' element={<h1>404</h1>} />
      </Routes>
    </AuthProvider>
  )
}
