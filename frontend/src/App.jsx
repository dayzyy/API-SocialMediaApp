import { Routes, Route } from 'react-router-dom'

import Signup from './pages/Signup'
import Login from './pages/Login'

export default function App(){
  return(
    <Routes>
      <Route index element={<h1>main page</h1>}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/login' element={<Login />}/>
    </Routes>
  )
}
