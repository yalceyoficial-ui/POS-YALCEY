const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = require('../models/productModel')

const getAll = async (req, res) => {
  try {
    const products = await getAllProducts()
    res.json({ products })
  } catch (error) {
    console.error('Error getAll products:', error)
    res.status(500).json({ message: 'Error al obtener productos' })
  }
}

const getOne = async (req, res) => {
  try {
    const product = await getProductById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json({ product })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto' })
  }
}

const create = async (req, res) => {
  try {
    const product = await createProduct(req.body)
    res.status(201).json({ message: 'Producto creado', product })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'El SKU ya existe' })
    }
    console.error('Error create product:', error)
    res.status(500).json({ message: 'Error al crear producto' })
  }
}

const update = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body)
    res.json({ message: 'Producto actualizado', product })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto' })
  }
}

const remove = async (req, res) => {
  try {
    await deleteProduct(req.params.id)
    res.json({ message: 'Producto desactivado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto' })
  }
}

const adjustStock = async (req, res) => {
  try {
    const { quantity, type, reason } = req.body
    const inventory = await updateStock(req.params.id, quantity, type, reason)
    res.json({ message: 'Stock actualizado', inventory })
  } catch (error) {
    console.error('Error adjustStock:', error)
    res.status(500).json({ message: 'Error al actualizar stock' })
  }
}

module.exports = { getAll, getOne, create, update, remove, adjustStock }