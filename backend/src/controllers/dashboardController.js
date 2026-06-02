const { getStats } = require('../models/dashboardModel')

const getStats_ = async (req, res) => {
  try {
    const stats = await getStats()
    res.json({ stats })
  } catch (error) {
    console.error('Error dashboard:', error)
    res.status(500).json({ message: 'Error al obtener estadísticas' })
  }
}

module.exports = { getStats: getStats_ }