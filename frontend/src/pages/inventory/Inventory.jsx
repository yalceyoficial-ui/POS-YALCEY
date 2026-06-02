import { useState } from 'react'
import { useProducts } from '../../controllers/useProducts'
import { adjustStock } from '../../services/inventoryService'
import './Inventory.css'

const MOVE_TYPES = [
  { value: 'IN', label: 'Entrada de mercancía' },
  { value: 'OUT', label: 'Salida manual' },
  { value: 'ADJUST', label: 'Ajuste de inventario' },
]

const Inventory = () => {
  const { products, loading, fetchProducts } = useProducts()
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ type: 'IN', quantity: '', reason: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdjust = async (e) => {
    e.preventDefault()
    if (!form.quantity || form.quantity <= 0) {
      alert('Ingresa una cantidad válida')
      return
    }
    setSaving(true)
    try {
      await adjustStock(selected.id, {
        type: form.type,
        quantity: parseInt(form.quantity),
        reason: form.reason,
      })
      await fetchProducts()
      setSelected(null)
      setForm({ type: 'IN', quantity: '', reason: '' })
    } catch (err) {
      alert(err.response?.data?.message || 'Error al ajustar stock')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="inv-loading">Cargando inventario...</div>

  return (
    <div className="inventory-page">
      <div className="inv-header">
        <div>
          <h1 className="inv-title">Inventario</h1>
          <p className="inv-subtitle">{products.length} productos en catálogo</p>
        </div>
      </div>

      <div className="inv-toolbar">
        <input
          className="inv-search"
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id}>
                <td className="sku-cell">{product.sku}</td>
                <td className="name-cell">{product.name}</td>
                <td>{product.category?.name}</td>
                <td>
                  <strong>{product.inventory?.stock ?? 0}</strong>
                </td>
                <td>{product.inventory?.minStock ?? 0}</td>
                <td>
                  <span className={`stock-badge ${
                    (product.inventory?.stock ?? 0) <= 0 ? 'stock-empty' :
                    (product.inventory?.stock ?? 0) <= (product.inventory?.minStock ?? 0) ? 'stock-low' :
                    'stock-ok'
                  }`}>
                    {(product.inventory?.stock ?? 0) <= 0 ? 'Sin stock' :
                     (product.inventory?.stock ?? 0) <= (product.inventory?.minStock ?? 0) ? 'Stock bajo' :
                     'OK'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-adjust"
                    onClick={() => setSelected(product)}
                  >
                    Ajustar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Ajustar stock — {selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-current">
              Stock actual: <strong>{selected.inventory?.stock ?? 0} unidades</strong>
            </div>
            <form onSubmit={handleAdjust} className="modal-form">
              <div className="form-field">
                <label>Tipo de movimiento</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  {MOVE_TYPES.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>
                  {form.type === 'ADJUST' ? 'Nuevo stock total' : 'Cantidad'}
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                  placeholder={form.type === 'ADJUST' ? 'Ej: 50' : 'Ej: 10'}
                  required
                />
              </div>
              <div className="form-field">
                <label>Motivo (opcional)</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Ej: Compra a proveedor, merma, etc."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setSelected(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar movimiento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory