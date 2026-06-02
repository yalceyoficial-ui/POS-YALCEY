// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Sembrando datos iniciales para YALCEY POS...')

  // ── Usuarios ────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 10)
  const employeePassword = await bcrypt.hash('empleado123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'yalceyoficial@gmail.com' },
    update: {},
    create: {
      name: 'Administrador YALCEY',
      email: 'yalceyoficial@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const employee = await prisma.user.upsert({
    where: { email: 'empleado@yalcey.com' },
    update: {},
    create: {
      name: 'ZERO',
      email: 'empleado@yalcey.com',
      password: employeePassword,
      role: 'EMPLOYEE',
    },
  })

  // ── Categorías ──────────────────────────────────────────
  const categorias = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Bebidas' },
      update: {},
      create: { name: 'Bebidas' },
    }),
    prisma.category.upsert({
      where: { name: 'Snacks' },
      update: {},
      create: { name: 'Snacks' },
    }),
    prisma.category.upsert({
      where: { name: 'Lácteos' },
      update: {},
      create: { name: 'Lácteos' },
    }),
    prisma.category.upsert({
      where: { name: 'Limpieza' },
      update: {},
      create: { name: 'Limpieza' },
    }),
  ])

  const [bebidas, snacks, lacteos, limpieza] = categorias

  // ── Productos con inventario ─────────────────────────────
  const productos = [
    { name: 'Coca-Cola 600ml',    sku: 'BEB-001', price: 18.00, cost: 11.00, categoryId: bebidas.id,  stock: 120, minStock: 20 },
    { name: 'Agua Bonafont 1L',   sku: 'BEB-002', price: 12.00, cost:  7.00, categoryId: bebidas.id,  stock: 200, minStock: 30 },
    { name: 'Sabritas Original',  sku: 'SNA-001', price: 20.00, cost: 12.00, categoryId: snacks.id,   stock: 80,  minStock: 15 },
    { name: 'Doritos Nacho',      sku: 'SNA-002', price: 20.00, cost: 12.00, categoryId: snacks.id,   stock: 4,   minStock: 15 },
    { name: 'Leche Lala 1L',      sku: 'LAC-001', price: 24.00, cost: 16.00, categoryId: lacteos.id,  stock: 60,  minStock: 10 },
    { name: 'Yogurt Yoplait',     sku: 'LAC-002', price: 15.00, cost:  9.00, categoryId: lacteos.id,  stock: 3,   minStock: 10 },
    { name: 'Jabón Zote',         sku: 'LIM-001', price: 14.00, cost:  8.00, categoryId: limpieza.id, stock: 45,  minStock: 10 },
    { name: 'Detergente Roma 1kg',sku: 'LIM-002', price: 28.00, cost: 18.00, categoryId: limpieza.id, stock: 2,   minStock: 10 },
  ]

  for (const prod of productos) {
    const { stock, minStock, ...productData } = prod

    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    })

    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {},
      create: {
        productId: product.id,
        stock,
        minStock,
      },
    })
  }

  console.log('─────────────────────────────────────────')
  console.log('YALCEY POS — Seed completado exitosamente')
  console.log(`Admin:    yalceyoficial@gmail.com    / PondNavarit`)
  console.log(`Empleado: empleado@yalcey.com / empleado123`)
  console.log('─────────────────────────────────────────')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })