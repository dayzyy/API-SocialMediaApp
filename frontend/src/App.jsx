import { Routes, Route } from 'react-router-dom'

import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import DirectsPage from './pages/DirectsPage'
import ChatPage from './pages/ChatPage'
import FriendsPage from './pages/FriendsPage'
import NotificationsPage from './pages/NotificationsPage'
import PostPage from './pages/PostPage'

import AddPostPage from './pages/AddPostPage'

import NotFoundPage from './pages/NotFoundPage'
import SettingsPage from './pages/SettingsPage'

export default function App(){
  return(
    <Routes>
      <Route path='/home' element={<HomePage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/profile/:id' element={<ProfilePage/>}/>
      <Route path='/directs' element={<DirectsPage/>}/>
      <Route path='/chat/:friend' element={<ChatPage/>}/>
      <Route path='/post/:id' element={<PostPage/>}/>
      <Route path='/post/add' element={<AddPostPage/>}/>
      <Route path='/friends' element={<FriendsPage/>}/>
      <Route path='/notifications' element={<NotificationsPage/>}/>
      <Route path='/settings' element={<SettingsPage/>}/>
      <Route path='*' element={<NotFoundPage/>} />
    </Routes>
  )
}
