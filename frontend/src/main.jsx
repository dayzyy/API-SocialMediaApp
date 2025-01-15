import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './components/Header.jsx'

import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UserActionsProvider } from './context/UserActionsContext.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <UserActionsProvider>
        <Header/>
        <App />
      </UserActionsProvider>
    </AuthProvider>
  </Router>
)
