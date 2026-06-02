import { useState } from 'react'
import { useCart } from '../../store/CartContext'
import { useProducts } from '../../controllers/useProducts'
import { createSale } from '../../services/saleService'
import './POSTerminal.css'

const PAY_METHODS = [
  { value: 'CASH', label: '💵 Efectivo' },
  { value: 'CARD', label: '💳 Tarjeta' },
  { value: 'TRANSFER', label: '🏦 Transferencia' },
]

const POSTerminal = () => {
  const { products, fetchProducts } = useProducts()
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCart()
  const [search, setSearch] = useState('')
  const [payMethod, setPayMethod] = useState('CASH')
  const [loading, setLoading] = useState(false)
  const [lastSale, setLastSale] = useState(null)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 12)

  const handleAddItem = (product) => {
    const cartItem = items.find(i => i.productId === product.id)
    const currentQty = cartItem ? cartItem.quantity : 0
    if (currentQty >= (product.inventory?.stock || 0)) {
      alert('No hay suficiente stock')
      return
    }
    addItem(product)
  }

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    try {
      const res = await createSale({ items, payMethod })
      setLastSale(res.data.sale)
      clearCart()
      fetchProducts()
      setSearch('')
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar venta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pos-layout">
      {/* Panel izquierdo — productos */}
      <div className="pos-products">
        <div className="pos-search-wrap">
          <input
            className="pos-search"
            placeholder="Buscar producto por nombre o SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="pos-grid">
          {filtered.map(product => (
            <button
              key={product.id}
              className="pos-product-card"
              onClick={() => handleAddItem(product)}
              disabled={!product.inventory?.stock || product.inventory.stock <= 0}
            >
              <div className="pos-product-name">{product.name}</div>
              <div className="pos-product-sku">{product.sku}</div>
              <div className="pos-product-price">${product.price.toFixed(2)}</div>
              <div className={`pos-product-stock ${
                product.inventory?.stock <= 0 ? 'stock-empty' :
                product.inventory?.stock <= product.inventory?.minStock ? 'stock-low' :
                'stock-ok'
              }`}>
                Stock: {product.inventory?.stock ?? 0}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="pos-no-results">No se encontraron productos</div>
          )}
        </div>
      </div>

      {/* Panel derecho — carrito */}
      <div className="pos-cart">
        <div className="pos-cart-header">
          <h2>Carrito</h2>
          {items.length > 0 && (
            <button className="pos-clear" onClick={clearCart}>Limpiar</button>
          )}
        </div>

        {lastSale && (
          <div className="pos-success">
            ✅ Venta registrada — Total: ${lastSale.total.toFixed(2)}
            <button onClick={() => setLastSale(null)}>✕</button>
          </div>
        )}

        <div className="pos-cart-items">
          {items.length === 0 ? (
            <div className="pos-cart-empty">
              <div className="pos-cart-empty-icon">🛒</div>
              <div>Agrega productos al carrito</div>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="pos-cart-item">
                <div className="pos-cart-item-info">
                  <div className="pos-cart-item-name">{item.name}</div>
                  <div className="pos-cart-item-price">${item.unitPrice.toFixed(2)} c/u</div>
                </div>
                <div className="pos-cart-item-controls">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className="pos-cart-item-subtotal">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </div>
                <button className="pos-cart-item-remove" onClick={() => removeItem(item.productId)}>✕</button>
              </div>
            ))
          )}
        </div>

        <div className="pos-cart-footer">
          <div className="pos-pay-methods">
            {PAY_METHODS.map(m => (
              <button
                key={m.value}
                className={`pos-pay-btn ${payMethod === m.value ? 'active' : ''}`}
                onClick={() => setPayMethod(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="pos-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            className="pos-checkout-btn"
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
          >
            {loading ? 'Procesando...' : `Cobrar $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default POSTerminal