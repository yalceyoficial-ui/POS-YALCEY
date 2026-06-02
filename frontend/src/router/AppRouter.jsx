import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import Login from '../pages/auth/Login'
import ProductList from '../pages/products/ProductList'
import Layout from '../components/layout/Layout'
import POSTerminal from '../pages/sales/POSTerminal'
import Dashboard from '../pages/dashboard/Dashboard'
import Reports from '../pages/reports/Reports'
import Inventory from '../pages/inventory/Inventory'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return <Layout>{children}</Layout>
}

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute>
            <POSTerminal />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter