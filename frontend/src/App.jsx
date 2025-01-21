import { Routes, Route } from 'react-router-dom'

import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import DirectsPage from './pages/DirectsPage'
import ChatPage from './pages/ChatPage'
import FriendsPage from './pages/FriendsPage'
import NotificationsPage from './pages/NotificationsPage'

import AddPostPage from './pages/AddPostPage'

import NotFoundPage from './pages/NotFoundPage'

export default function App(){
  return(
    <Routes>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/profile/:id' element={<ProfilePage/>}/>
      <Route path='/directs' element={<DirectsPage/>}/>
      <Route path='/chat/:friend' element={<ChatPage/>}/>
      <Route path='/add/post' element={<AddPostPage/>}/>
      <Route path='/friends' element={<FriendsPage/>}/>
      <Route path='/notifications' element={<NotificationsPage/>}/>
      <Route path='*' element={<NotFoundPage/>} />
    </Routes>
  )
}
