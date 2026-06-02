import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import './Layout.css'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '▦' },
  { path: '/sales', label: 'Nueva venta', icon: '🧾' },
  { path: '/products', label: 'Productos', icon: '📦' },
  { path: '/inventory', label: 'Inventario', icon: '🗃️' },
  { path: '/reports', label: 'Reportes', icon: '📊' },
]

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">Y</div>
          <div>
            <div className="sidebar-logo-name">YALCEY POS</div>
            <div className="sidebar-logo-sub">Sistema de ventas</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">Principal</div>
          {menuItems.slice(0, 2).map(item => (
            <button
              key={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="sidebar-section">Gestión</div>
          {menuItems.slice(2).map(item => (
            <button
              key={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout