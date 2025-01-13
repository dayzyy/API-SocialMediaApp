import { Routes, Route } from 'react-router-dom'

import Signup from './pages/Signup'
import Login from './pages/Login'

import Home from './pages/Home'
import Directs from './pages/Directs'
import Chat from './pages/Chat'

import NotFound from './pages/NotFound'

export default function App(){
  return(
    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/directs' element={<Directs/>}/>
      <Route path='/chat/:friend' element={<Chat/>}/>
      <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}
