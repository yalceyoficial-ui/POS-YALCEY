const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const saleRoutes = require('./routes/saleRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const reportRoutes = require('./routes/reportRoutes')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'YALCEY POS API funcionando', status: 'ok' })
})

module.exports = app