import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './store/AuthContext'
import { CartProvider } from './store/CartContext'
import AppRouter from './router/AppRouter'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
)