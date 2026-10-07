import React, { useState } from 'react';
import { X, Package, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/pmUtils';

export default function GoodsIssueModal({ order, onClose, onPostGoodsIssue }) {
  if (!order) return null;

  const [selectedMaterials, setSelectedMaterials] = useState(() => {
    // Select all unissued materials by default
    return (order.components || [])
      .filter((c) => !c.isIssued)
      .map((c) => c.materialNo);
  });

  const toggleSelect = (matNo) => {
    if (selectedMaterials.includes(matNo)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== matNo));
    } else {
      setSelectedMaterials([...selectedMaterials, matNo]);
    }
  };

  const handlePost = () => {
    if (selectedMaterials.length === 0) return;
    onPostGoodsIssue({
      orderId: order.id,
      materialNos: selectedMaterials
    });
    onClose();
  };

  const pendingComponents = (order.components || []).filter((c) => !c.isIssued);

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <Package size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Post Goods Issue (Movement Type 261)
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Order: <strong style={{ color: '#93c5fd' }}>{order.id}</strong> — Warehouse Issue to Maintenance Order
              </span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            fontSize: '0.8rem',
            color: '#a7f3d0'
          }}>
            SAP Movement Type <strong>261</strong> issues reserved inventory items from the warehouse specifically to this maintenance work order. Posting decrements plant inventory and updates actual material costs.
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Issue</th>
                  <th>Reservation No</th>
                  <th>Material No</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Storage Loc</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(order.components || []).map((comp, idx) => {
                  const isChecked = selectedMaterials.includes(comp.materialNo);
                  const lineTotal = (Number(comp.quantity) || 0) * (Number(comp.unitPrice) || 0);

                  return (
                    <tr key={idx} style={{ opacity: comp.isIssued ? 0.6 : 1 }}>
                      <td>
                        <input 
                          type="checkbox"
                          disabled={comp.isIssued}
                          checked={comp.isIssued || isChecked}
                          onChange={() => toggleSelect(comp.materialNo)}
                          style={{ cursor: comp.isIssued ? 'not-allowed' : 'pointer' }}
                        />
                      </td>
                      <td>
                        <span className="mono-chip">{comp.reservationNo}</span>
                      </td>
                      <td>
                        <span className="mono-chip mono-chip-emerald">{comp.materialNo}</span>
                      </td>
                      <td style={{ color: '#ffffff', fontWeight: 500 }}>
                        {comp.description}
                      </td>
                      <td style={{ fontWeight: 600 }}>{comp.quantity} {comp.unit}</td>
                      <td>{comp.storageLocation}</td>
                      <td>{formatCurrency(lineTotal)}</td>
                      <td>
                        {comp.isIssued ? (
                          <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                            Issued
                          </span>
                        ) : (
                          <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>
                            Reserved (261)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {pendingComponents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              All reserved materials for this work order have already been issued to the floor!
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-success" 
            onClick={handlePost}
            disabled={selectedMaterials.length === 0}
          >
            <Check size={15} />
            <span>Post Goods Issue 261 ({selectedMaterials.length} item{selectedMaterials.length !== 1 ? 's' : ''})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
