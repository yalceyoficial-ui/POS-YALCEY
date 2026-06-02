const prisma = require('../config/database')

const createSale = async (userId, items, payMethod) => {
  // Calcular total
  const total = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity
  }, 0)

  // Crear venta con sus items en una transacción
  const sale = await prisma.$transaction(async (tx) => {
    // 1. Crear la venta
    const newSale = await tx.sale.create({
      data: {
        userId,
        total,
        payMethod,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    // 2. Descontar stock de cada producto
    for (const item of items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: { stock: { decrement: item.quantity } },
      })

      await tx.inventoryMove.create({
        data: {
          productId: item.productId,
          type: 'SALE',
          quantity: item.quantity,
          reason: `Venta #${newSale.id.slice(0, 8)}`,
        },
      })
    }

    return newSale
  })

  return sale
}

const getSales = async () => {
  return await prisma.sale.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: { select: { name: true, sku: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

module.exports = { createSale, getSales }