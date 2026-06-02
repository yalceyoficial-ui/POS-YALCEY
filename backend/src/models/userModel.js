const prisma = require('../config/database')

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  })
}

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })
}

module.exports = {
  findUserByEmail,
  findUserById,
}