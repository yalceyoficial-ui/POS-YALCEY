import { useState, useEffect } from 'react'
import { getDashboardStats } from '../services/dashboardService'

export const useDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data.stats))
      .catch(err => console.error('Error dashboard:', err))
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}