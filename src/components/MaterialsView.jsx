import React, { useState } from 'react';
import { Package, Boxes, CheckCircle2, AlertTriangle, Search, Plus } from 'lucide-react';
import { formatCurrency } from '../utils/pmUtils';

export default function MaterialsView({ materials, orders, onRestockMaterial }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');

  // Extract all reservations from active orders
  const allReservations = [];
  orders.forEach((o) => {
    (o.components || []).forEach((c) => {
      allReservations.push({
        ...c,
        orderId: o.id,
        orderTitle: o.title,
        orderStatus: o.status
      });
    });
  });

  const filteredMaterials = materials.filter((m) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.materialNo.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.storageLocation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-body">
      {/* Top Banner */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399'
          }}>
            <Package size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Materials Management & Goods Issue (Movement Type 261)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Movement 261 posts consumption of spare parts directly to maintenance orders, decrementing warehouse physical stock.
            </div>
          </div>
        </div>
        <span className="mono-chip mono-chip-emerald">
          Standard SAP Movement 261 Active
        </span>
      </div>

      <div className="panel-card">
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Boxes size={16} />
            <span>Warehouse Inventory Catalog ({materials.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            <Package size={16} />
            <span>Active Order Reservations (Mvt 261) ({allReservations.length})</span>
          </button>
        </div>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="filter-bar" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
              <div className="search-box-wrap">
                <Search size={16} className="search-icon" />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Filter materials by number, description, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Material No</th>
                    <th>Material Description</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Min Level</th>
                    <th>Storage Location</th>
                    <th>Unit Valuation</th>
                    <th>Stock Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((m) => {
                    const isLow = m.inStock <= m.minStock;

                    return (
                      <tr key={m.materialNo}>
                        <td>
                          <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700 }}>
                            {m.materialNo}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>{m.description}</strong>
                        </td>
                        <td>{m.category}</td>
                        <td>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isLow ? '#ef4444' : 'var(--text-main)' }}>
                            {m.inStock} {m.unit}
                          </span>
                        </td>
                        <td>{m.minStock} {m.unit}</td>
                        <td>{m.storageLocation}</td>
                        <td>{formatCurrency(m.unitPrice)}</td>
                        <td>
                          {isLow ? (
                            <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>
                              <AlertTriangle size={10} /> Low Stock Alert
                            </span>
                          ) : (
                            <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                              Adequate Stock
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => onRestockMaterial(m.materialNo, 10)}
                            title="Restock +10 units"
                          >
                            <Plus size={13} />
                            <span>+10</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reservation No</th>
                  <th>Order Reference</th>
                  <th>Material No</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Mvt Type</th>
                  <th>Storage Loc</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allReservations.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No active material reservations.
                    </td>
                  </tr>
                ) : (
                  allReservations.map((res, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="mono-chip">{res.reservationNo}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#60a5fa' }}>{res.orderId}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{res.orderTitle}</div>
                      </td>
                      <td>
                        <span className="mono-chip mono-chip-emerald">{res.materialNo}</span>
                      </td>
                      <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                        {res.description}
                      </td>
                      <td style={{ fontWeight: 600 }}>{res.quantity} {res.unit}</td>
                      <td>
                        <span className="mono-chip">261 (GI Order)</span>
                      </td>
                      <td>{res.storageLocation}</td>
                      <td>{formatCurrency(res.quantity * res.unitPrice)}</td>
                      <td>
                        {res.isIssued ? (
                          <span className="badge badge-low">
                            Issued ({res.issuedDate || 'Complete'})
                          </span>
                        ) : (
                          <span className="badge badge-high">
                            Reserved (Pending Mvt 261)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
