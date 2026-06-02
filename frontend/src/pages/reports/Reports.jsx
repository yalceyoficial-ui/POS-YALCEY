import { useState, useEffect } from 'react'
import { getSalesReport, getInventoryReport } from '../../services/reportService'
import './Reports.css'

const Reports = () => {
  const [tab, setTab] = useState('sales')
  const [salesReport, setSalesReport] = useState(null)
  const [inventoryReport, setInventoryReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const loadSales = async () => {
    setLoading(true)
    try {
      const res = await getSalesReport(startDate, endDate)
      setSalesReport(res.data.report)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadInventory = async () => {
    setLoading(true)
    try {
      const res = await getInventoryReport()
      setInventoryReport(res.data.report)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tab === 'sales') loadSales()
    if (tab === 'inventory') loadInventory()
  }, [tab])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const PAY_LABELS = { CASH: 'Efectivo', CARD: 'Tarjeta', TRANSFER: 'Transferencia' }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="reports-title">Reportes</h1>
        <p className="reports-subtitle">Consulta el historial de ventas e inventario</p>
      </div>

      <div className="reports-tabs">
        <button
          className={`reports-tab ${tab === 'sales' ? 'active' : ''}`}
          onClick={() => setTab('sales')}
        >
          Ventas
        </button>
        <button
          className={`reports-tab ${tab === 'inventory' ? 'active' : ''}`}
          onClick={() => setTab('inventory')}
        >
          Inventario
        </button>
      </div>

      {tab === 'sales' && (
        <div>
          <div className="reports-filters">
            <div className="filter-field">
              <label>Desde</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-field">
              <label>Hasta</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
            <button className="btn-filter" onClick={loadSales}>Filtrar</button>
          </div>

          {salesReport && (
            <div className="reports-summary">
              <div className="summary-card">
                <div className="summary-label">Total ventas</div>
                <div className="summary-value">${salesReport.total.toFixed(2)}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Transacciones</div>
                <div className="summary-value">{salesReport.count}</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Ticket promedio</div>
                <div className="summary-value">${salesReport.avg.toFixed(2)}</div>
              </div>
            </div>
          )}

          <div className="reports-table-wrap">
            {loading ? (
              <div className="reports-loading">Cargando...</div>
            ) : salesReport?.sales.length === 0 ? (
              <div className="reports-empty">No hay ventas en este período</div>
            ) : (
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cajero</th>
                    <th>Productos</th>
                    <th>Método</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport?.sales.map(sale => (
                    <tr key={sale.id}>
                      <td className="id-cell">#{sale.id.slice(0, 8)}</td>
                      <td>{formatDate(sale.createdAt)}</td>
                      <td>{sale.user?.name}</td>
                      <td>
                        <div className="sale-items-list">
                          {sale.items.map((item, i) => (
                            <div key={i} className="sale-item-chip">
                              {item.quantity}x {item.product.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="pay-badge">
                          {PAY_LABELS[sale.payMethod]}
                        </span>
                      </td>
                      <td className="total-cell">${sale.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="reports-table-wrap">
          {loading ? (
            <div className="reports-loading">Cargando...</div>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {inventoryReport?.map(inv => (
                  <tr key={inv.id}>
                    <td className="id-cell">{inv.product.sku}</td>
                    <td>{inv.product.name}</td>
                    <td>{inv.product.category?.name}</td>
                    <td>{inv.stock}</td>
                    <td>{inv.minStock}</td>
                    <td>
                      <span className={`stock-badge ${
                        inv.stock <= 0 ? 'stock-empty' :
                        inv.stock <= inv.minStock ? 'stock-low' :
                        'stock-ok'
                      }`}>
                        {inv.stock <= 0 ? 'Sin stock' :
                         inv.stock <= inv.minStock ? 'Stock bajo' :
                         'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default Reports