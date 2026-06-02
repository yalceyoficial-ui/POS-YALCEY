import { useState } from 'react'
import { useProducts } from '../../controllers/useProducts'
import ProductForm from './ProductForm'
import './Products.css'

const ProductList = () => {
  const { products, loading, removeProduct, fetchProducts } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (loading) return <div className="products-loading">Cargando productos...</div>

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1 className="products-title">Productos</h1>
          <p className="products-subtitle">{products.length} productos registrados</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Nuevo producto
        </button>
      </div>

      <div className="products-toolbar">
        <input
          className="search-input"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="products-table-wrap">
        <table className="products-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Costo</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id}>
                <td className="sku-cell">{product.sku}</td>
                <td className="name-cell">{product.name}</td>
                <td>{product.category?.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.cost.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${
                    product.inventory?.stock <= 0 ? 'stock-empty' :
                    product.inventory?.stock <= product.inventory?.minStock ? 'stock-low' :
                    'stock-ok'
                  }`}>
                    {product.inventory?.stock ?? 0}
                  </span>
                </td>
                <td>
                  <span className="badge-active">Activo</span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => removeProduct(product.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="products-empty">No se encontraron productos</div>
        )}
      </div>

     {showForm && (
  <ProductForm
    product={editingProduct}
    onClose={handleClose}
    onSaved={fetchProducts}
  />
)}
    </div>
  )
}

export default ProductList