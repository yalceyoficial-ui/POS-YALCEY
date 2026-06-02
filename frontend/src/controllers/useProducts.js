import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getProducts()
      setProducts(res.data.products)
    } catch (err) {
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addProduct = async (data) => {
    await createProduct(data)
    await fetchProducts()
  }

  const editProduct = async (id, data) => {
    await updateProduct(id, data)
    await fetchProducts()
  }

  const removeProduct = async (id) => {
    await deleteProduct(id)
    await fetchProducts()
  }

  return { products, loading, error, addProduct, editProduct, removeProduct, fetchProducts }
}