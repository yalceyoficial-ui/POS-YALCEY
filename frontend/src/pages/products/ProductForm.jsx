import { useState, useEffect } from 'react'
import { getCategories } from '../../services/categoryService'
import { createProduct, updateProduct } from '../../services/productService'

const ProductForm = ({ product, onClose, onSaved }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price || '',
    cost: product?.cost || '',
    categoryId: product?.categoryId || '',
    stock: product?.inventory?.stock || 0,
    minStock: product?.inventory?.minStock || 5,
  })

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.categories))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (product) {
        await updateProduct(product.id, form)
      } else {
        await createProduct(form)
      }
      onSaved()
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>{product ? 'Editar producto' : 'Nuevo producto'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-field">
              <label>Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Precio venta</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Costo</label>
              <input name="cost" type="number" step="0.01" value={form.cost} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Categoría</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Stock inicial</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Stock mínimo</label>
              <input name="minStock" type="number" value={form.minStock} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm