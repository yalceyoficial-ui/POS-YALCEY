const prisma = require('../config/database')

const getAllProducts = async () => {
  return await prisma.product.findMany({
    where: { active: true },
    include: {
      category: true,
      inventory: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      inventory: true,
    },
  })
}

const createProduct = async (data) => {
  const { name, sku, price, cost, categoryId, stock, minStock } = data

  return await prisma.product.create({
    data: {
      name,
      sku,
      price: parseFloat(price),
      cost: parseFloat(cost),
      categoryId,
      inventory: {
        create: {
          stock: parseInt(stock) || 0,
          minStock: parseInt(minStock) || 5,
        },
      },
    },
    include: {
      category: true,
      inventory: true,
    },
  })
}

const updateProduct = async (id, data) => {
  const { name, sku, price, cost, categoryId } = data

  return await prisma.product.update({
    where: { id },
    data: {
      name,
      sku,
      price: parseFloat(price),
      cost: parseFloat(cost),
      categoryId,
    },
    include: {
      category: true,
      inventory: true,
    },
  })
}

const deleteProduct = async (id) => {
  return await prisma.product.update({
    where: { id },
    data: { active: false },
  })
}

const updateStock = async (productId, quantity, type, reason) => {
  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  })

  let newStock = inventory.stock
  if (type === 'IN') newStock += quantity
  if (type === 'OUT' || type === 'SALE') newStock -= quantity
  if (type === 'ADJUST') newStock = quantity

  const [updatedInventory] = await prisma.$transaction([
    prisma.inventory.update({
      where: { productId },
      data: { stock: newStock },
    }),
    prisma.inventoryMove.create({
      data: { productId, type, quantity, reason },
    }),
  ])

  return updatedInventory
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
}