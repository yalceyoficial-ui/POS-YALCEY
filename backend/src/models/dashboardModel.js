const prisma = require('../config/database')

const getStats = async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Ventas de hoy
  const salesToday = await prisma.sale.findMany({
    where: {
      createdAt: { gte: today, lt: tomorrow },
      status: 'COMPLETED',
    },
  })

  const totalToday = salesToday.reduce((sum, s) => sum + s.total, 0)
  const transactionsToday = salesToday.length
  const avgTicket = transactionsToday > 0 ? totalToday / transactionsToday : 0

  // Productos con stock bajo o crítico
  const lowStock = await prisma.inventory.findMany({
    where: {
      stock: { lte: prisma.inventory.fields.minStock },
    },
    include: {
      product: { select: { name: true, sku: true } },
    },
  })

  // Ventas de los últimos 7 días
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const salesWeek = await prisma.sale.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: 'COMPLETED',
    },
    select: { total: true, createdAt: true },
  })

  // Agrupar ventas por día
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const daySales = salesWeek.filter(s => {
      const d = new Date(s.createdAt)
      return d >= date && d < nextDate
    })

    const dayLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

    days.push({
      label: dayLabels[date.getDay()],
      total: daySales.reduce((sum, s) => sum + s.total, 0),
    })
  }

  // Stock crítico — donde stock <= minStock
  const allInventory = await prisma.inventory.findMany({
    include: {
      product: { select: { name: true, sku: true, active: true } },
    },
  })

  const criticalStock = allInventory.filter(
    inv => inv.product.active && inv.stock <= inv.minStock
  )

  return {
    totalToday,
    transactionsToday,
    avgTicket,
    criticalStockCount: criticalStock.length,
    salesChart: days,
    criticalProducts: criticalStock.map(inv => ({
      name: inv.product.name,
      sku: inv.product.sku,
      stock: inv.stock,
      minStock: inv.minStock,
    })),
  }
}

module.exports = { getStats }