import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './components/Header.jsx'

import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <Header/>
      <App />
    </AuthProvider>
  </Router>
)
