import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useDashboard } from '../../controllers/useDashboard'
import './Dashboard.css'

const StatCard = ({ label, value, sub, color }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color }}>{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
)

const Dashboard = () => {
  const { stats, loading } = useDashboard()

  if (loading) return <div className="dash-loading">Cargando estadísticas...</div>
  if (!stats) return <div className="dash-loading">Error al cargar datos</div>

  const maxVal = Math.max(...stats.salesChart.map(d => d.total), 1)

  return (
    <div className="dashboard">
      <div className="dash-header">
        <h1 className="dash-title">Dashboard</h1>
        <p className="dash-subtitle">Resumen de operaciones de hoy</p>
      </div>

      {/* KPIs */}
      <div className="stats-grid">
        <StatCard
          label="Ventas hoy"
          value={`$${stats.totalToday.toFixed(2)}`}
          sub="Total del día"
          color="#10B981"
        />
        <StatCard
          label="Transacciones"
          value={stats.transactionsToday}
          sub="Ventas registradas"
          color="#3B82F6"
        />
        <StatCard
          label="Ticket promedio"
          value={`$${stats.avgTicket.toFixed(2)}`}
          sub="Por venta"
          color="#8B5CF6"
        />
        <StatCard
          label="Stock crítico"
          value={stats.criticalStockCount}
          sub="Productos bajo mínimo"
          color={stats.criticalStockCount > 0 ? '#F59E0B' : '#10B981'}
        />
      </div>

      <div className="dash-grid">
        {/* Gráfica de ventas */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Ventas — últimos 7 días</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.salesChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`$${value.toFixed(2)}`, 'Ventas']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {stats.salesChart.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={index === stats.salesChart.length - 1 ? '#10B981' : '#E2E8F0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Productos con stock crítico */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2 className="dash-card-title">Stock crítico</h2>
            <span className="dash-card-count">{stats.criticalProducts.length} productos</span>
          </div>
          {stats.criticalProducts.length === 0 ? (
            <div className="dash-empty">✅ Todos los productos tienen stock suficiente</div>
          ) : (
            <div className="critical-list">
              {stats.criticalProducts.map((p, i) => (
                <div key={i} className="critical-item">
                  <div className="critical-info">
                    <div className="critical-name">{p.name}</div>
                    <div className="critical-sku">{p.sku}</div>
                  </div>
                  <div className="critical-stock">
                    <span className={`stock-badge ${p.stock <= 0 ? 'stock-empty' : 'stock-low'}`}>
                      {p.stock} uds
                    </span>
                    <div className="critical-min">mín: {p.minStock}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard