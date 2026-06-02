const { createSale, getSales } = require('../models/saleModel')

const create = async (req, res) => {
  try {
    const { items, payMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' })
    }

    if (!payMethod) {
      return res.status(400).json({ message: 'Método de pago requerido' })
    }

    const sale = await createSale(req.userId, items, payMethod)
    res.status(201).json({ message: 'Venta registrada', sale })
  } catch (error) {
    console.error('Error create sale:', error)
    res.status(500).json({ message: 'Error al registrar venta' })
  }
}

const getAll = async (req, res) => {
  try {
    const sales = await getSales()
    res.json({ sales })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas' })
  }
}

module.exports = { create, getAll }