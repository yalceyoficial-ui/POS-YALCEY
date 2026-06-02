const { getSalesReport, getInventoryReport } = require('../models/reportModel')

const sales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    const report = await getSalesReport(startDate, endDate)
    res.json({ report })
  } catch (error) {
    console.error('Error reporte ventas:', error)
    res.status(500).json({ message: 'Error al generar reporte' })
  }
}

const inventory = async (req, res) => {
  try {
    const report = await getInventoryReport()
    res.json({ report })
  } catch (error) {
    console.error('Error reporte inventario:', error)
    res.status(500).json({ message: 'Error al generar reporte' })
  }
}

module.exports = { sales, inventory }