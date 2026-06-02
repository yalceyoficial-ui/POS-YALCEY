const { getAllCategories } = require('../models/categoryModel')

const getAll = async (req, res) => {
  try {
    const categories = await getAllCategories()
    res.json({ categories })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías' })
  }
}

module.exports = { getAll }