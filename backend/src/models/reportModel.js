const prisma = require('../config/database')

const getSalesReport = async (startDate, endDate) => {
  const where = {
    status: 'COMPLETED',
  }

  if (startDate && endDate) {
    where.createdAt = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    }
  }

  const sales = await prisma.sale.findMany({
    where,
    include: {
      user: { select: { name: true } },
      items: {
        include: {
          product: { select: { name: true, sku: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const total = sales.reduce((sum, s) => sum + s.total, 0)
  const count = sales.length
  const avg = count > 0 ? total / count : 0

  return { sales, total, count, avg }
}

const getInventoryReport = async () => {
  const inventory = await prisma.inventory.findMany({
    include: {
      product: {
        include: { category: true },
      },
    },
    orderBy: { stock: 'asc' },
  })

  return inventory.filter(inv => inv.product.active)
}

module.exports = { getSalesReport, getInventoryReport }