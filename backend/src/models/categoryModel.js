const prisma = require('../config/database')

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

module.exports = { getAllCategories }