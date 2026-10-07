import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  Package, 
  CheckCircle, 
  FileText, 
  Layers, 
  Building2, 
  Printer, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';
import { 
  getPriorityBadge, 
  getStatusBadge, 
  getOrderTypeInfo, 
  calculateOrderCosting, 
  formatCurrency, 
  formatDate,
  getEquipmentDetails
} from '../utils/pmUtils';
import { WORK_CENTERS, FUNCTIONAL_LOCATIONS } from '../data/mockMasterData';

export default function WorkOrderDetailModal({ 
  order, 
  onClose, 
  onReleaseOrder, 
  onOpenTimeConfirmation, 
  onOpenGoodsIssue, 
  onTecoOrder,
  onOpenJobCard
}) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!order) return null;

  const priorityBadge = getPriorityBadge(order.priority);
  const statusBadge = getStatusBadge(order.status);
  const orderType = getOrderTypeInfo(order.orderType);
  const costing = calculateOrderCosting(order);
  const eqDetail = order.equipmentId ? getEquipmentDetails(order.equipmentId) : null;
  const flDetail = order.functionalLocationId ? FUNCTIONAL_LOCATIONS.find((f) => f.id === order.functionalLocationId) : null;

  const isCreated = order.status === 'CRTD';
  const isReleased = order.status === 'REL' || order.status === 'PCNF' || order.status === 'CNF';
  const isTeco = order.status === 'TECO';

  const handlePrint = () => {
    if (onOpenJobCard) {
      onOpenJobCard(order);
    } else {
      window.print();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '960px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="mono-chip" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {order.id}
            </span>
            <span 
              className="status-pill"
              style={{ background: statusBadge.bg, color: statusBadge.text, borderColor: statusBadge.border }}
            >
              {statusBadge.code} - {statusBadge.label}
            </span>
            <span className={`badge badge-${priorityBadge.color}`}>
              {priorityBadge.label}
            </span>
            <span className="mono-chip" style={{ color: orderType.color }}>
              {orderType.code}: {orderType.short}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print Work Order Ticket">
              <Printer size={14} />
              <span>Print Order</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{
          background: '#0a1020',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              {order.title}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', marginTop: '2px' }}>
              <span>Created: {order.createdAt} by {order.createdBy}</span>
              {order.notificationNo && (
                <span>Ref Notif: <strong style={{ color: '#93c5fd' }}>{order.notificationNo}</strong></span>
              )}
            </div>
          </div>

          {/* Quick Transaction Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isCreated && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onReleaseOrder(order.id)}
              >
                <Send size={14} />
                <span>Release Order (REL)</span>
              </button>
            )}

            {isReleased && (
              <>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenTimeConfirmation(order)}
                  title="Confirm labor hours worked (IW41)"
                >
                  <Clock size={14} color="#60a5fa" />
                  <span>Time Confirmation (IW41)</span>
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenGoodsIssue(order)}
                  title="Issue reserved spare parts with Movement 261"
                >
                  <Package size={14} color="#34d399" />
                  <span>Issue Parts (Mvt 261)</span>
                </button>

                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => onTecoOrder(order.id)}
                  title="Technically complete the maintenance order"
                >
                  <CheckCircle size={14} />
                  <span>Complete (TECO)</span>
                </button>
              </>
            )}

            {isTeco && (
              <span className="mono-chip mono-chip-emerald" style={{ padding: '4px 10px' }}>
                <CheckCircle size={14} /> Technical Completion Confirmed
              </span>
            )}
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FileText size={15} />
            <span>Overview & Reference Asset</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            <Clock size={15} />
            <span>Operations & Labor ({order.operations?.length || 0})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <Package size={15} />
            <span>Spare Parts Mvt 261 ({order.components?.length || 0})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            <Sparkles size={15} />
            <span>Cost Settlement & Variance</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* TAB 1: Overview & Asset Dossier */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Asset Reference Highlight */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Equipment Reference
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                    {order.equipmentId || 'No direct EQ link'}
                  </div>
                  {eqDetail && (
                    <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>
                      {eqDetail.name} ({eqDetail.category})
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Functional Location
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                    {order.functionalLocationId || '—'}
                  </div>
                  {flDetail && (
                    <div style={{ fontSize: '0.78rem', color: '#93c5fd' }}>
                      {flDetail.name}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Plant & Shop Location
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                    Planning: {order.planningPlant} | Maint: {order.maintenancePlant}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Main Work Center: <strong style={{ color: '#ffffff' }}>{order.mainWorkCenter}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Settlement Cost Center
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
                    {order.costCenter}
                  </div>
                  {order.wbsElement && (
                    <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                      WBS: {order.wbsElement}
                    </div>
                  )}
                </div>
              </div>

              {/* Header Text / Description */}
              <div style={{
                background: 'var(--bg-card-subtle)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Maintenance Scope & Failure Report
                </div>
                <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {order.headerText || 'No extended header text provided.'}
                </p>
              </div>

              {/* Execution Schedule Times */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scheduled Basic Start</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
                    {formatDate(order.basicStartDate)}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scheduled Basic Finish</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
                    {formatDate(order.basicFinishDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Operations Execution */}
          {activeTab === 'operations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Op No</th>
                      <th>Control Key</th>
                      <th>Work Center</th>
                      <th>Description</th>
                      <th>Planned Work</th>
                      <th>Confirmed Labor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.operations || []).map((op, idx) => {
                      const isInternal = op.controlKey === 'PM01';
                      const plannedTotal = (Number(op.laborHours) || 0) * (Number(op.technicians) || 1);

                      return (
                        <tr key={idx}>
                          <td>
                            <span className="mono-chip">{op.opNo}</span>
                          </td>
                          <td>
                            <span className="mono-chip">
                              {op.controlKey === 'PM01' ? 'PM01 (Internal)' : 'PM03 (External)'}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: '#ffffff', fontWeight: 600 }}>{op.workCenter}</span>
                          </td>
                          <td>
                            <div>
                              <div style={{ color: '#ffffff', fontWeight: 500 }}>{op.description}</div>
                              {op.vendor && (
                                <div style={{ fontSize: '0.72rem', color: '#fbbf24', marginTop: '2px' }}>
                                  Vendor: {op.vendor} | PR: {op.prNumber} (${op.externalCost})
                                </div>
                              )}
                              {op.confirmedBy && (
                                <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '2px' }}>
                                  Confirmed by {op.confirmedBy} on {op.confirmedDate}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            {isInternal ? `${plannedTotal}h (${op.laborHours}h × ${op.technicians})` : 'PR Svc'}
                          </td>
                          <td>
                            {isInternal ? (
                              <strong style={{ color: op.confirmedHours > 0 ? '#34d399' : 'var(--text-muted)' }}>
                                {op.confirmedHours || 0} hrs
                              </strong>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-pill status-${(op.status || 'crtd').toLowerCase()}`}>
                              {op.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {isReleased && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenTimeConfirmation(order)}
                  >
                    <Clock size={14} />
                    <span>Post Labor Confirmation for Operations (IW41)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Spare Parts (Movement 261) */}
          {activeTab === 'materials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Standard SAP Movement Type: <strong>261 (Goods Issue to Maintenance Order)</strong>
                </span>
                {isReleased && (
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => onOpenGoodsIssue(order)}
                  >
                    <Package size={14} />
                    <span>Post Goods Issue (Movement 261)</span>
                  </button>
                )}
              </div>

              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Reservation No</th>
                      <th>Material No</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Unit</th>
                      <th>Mvt</th>
                      <th>Storage Loc</th>
                      <th>Unit Price</th>
                      <th>Issue Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.components || []).length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          No materials reserved for this order.
                        </td>
                      </tr>
                    ) : (
                      order.components.map((c, i) => (
                        <tr key={i}>
                          <td>
                            <span className="mono-chip">{c.reservationNo || 'RES-PENDING'}</span>
                          </td>
                          <td>
                            <span className="mono-chip mono-chip-emerald">{c.materialNo}</span>
                          </td>
                          <td style={{ color: '#ffffff', fontWeight: 500 }}>
                            {c.description}
                          </td>
                          <td style={{ fontWeight: 600 }}>{c.quantity}</td>
                          <td>{c.unit}</td>
                          <td>
                            <span className="mono-chip">261</span>
                          </td>
                          <td>{c.storageLocation}</td>
                          <td>{formatCurrency(c.unitPrice)}</td>
                          <td>
                            {c.isIssued ? (
                              <span className="badge badge-low">
                                Issued ({c.issuedDate || 'Posted'})
                              </span>
                            ) : (
                              <span className="badge badge-high">
                                Reserved / Pending Issue
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Cost Settlement & Variance */}
          {activeTab === 'costs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Cost Summary Matrix */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Cost Category</th>
                      <th>Planned Budget</th>
                      <th>Actual Incurred</th>
                      <th>Variance ($)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Internal Maintenance Labor</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Planned: {costing.plannedInternalLaborHours}h | Confirmed: {costing.actualInternalLaborHours}h
                        </div>
                      </td>
                      <td style={{ color: '#60a5fa', fontWeight: 600 }}>
                        {formatCurrency(costing.plannedLaborCost)}
                      </td>
                      <td style={{ color: '#ffffff', fontWeight: 700 }}>
                        {formatCurrency(costing.actualLaborCost)}
                      </td>
                      <td style={{ color: costing.actualLaborCost > costing.plannedLaborCost ? '#f87171' : '#34d399' }}>
                        {formatCurrency(costing.actualLaborCost - costing.plannedLaborCost)}
                      </td>
                      <td>
                        <span className="mono-chip">
                          {costing.actualInternalLaborHours >= costing.plannedInternalLaborHours ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <strong>External Vendor Services (PM03 PR)</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Specialist contracts & laser alignment</div>
                      </td>
                      <td style={{ color: '#fbbf24', fontWeight: 600 }}>
                        {formatCurrency(costing.plannedExternalCost)}
                      </td>
                      <td style={{ color: '#ffffff', fontWeight: 700 }}>
                        {formatCurrency(costing.actualExternalCost)}
                      </td>
                      <td style={{ color: '#34d399' }}>
                        {formatCurrency(costing.actualExternalCost - costing.plannedExternalCost)}
                      </td>
                      <td>
                        <span className="mono-chip">
                          {costing.actualExternalCost > 0 ? 'Invoiced' : 'Pending'}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <strong>Materials & Spares (Movement 261)</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Warehouse goods issues posted to order</div>
                      </td>
                      <td style={{ color: '#34d399', fontWeight: 600 }}>
                        {formatCurrency(costing.plannedMaterialCost)}
                      </td>
                      <td style={{ color: '#ffffff', fontWeight: 700 }}>
                        {formatCurrency(costing.actualMaterialCost)}
                      </td>
                      <td style={{ color: '#34d399' }}>
                        {formatCurrency(costing.actualMaterialCost - costing.plannedMaterialCost)}
                      </td>
                      <td>
                        <span className="mono-chip">
                          {costing.actualMaterialCost === costing.plannedMaterialCost && costing.plannedMaterialCost > 0 ? 'All Issued' : 'Partial'}
                        </span>
                      </td>
                    </tr>

                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', fontWeight: 800 }}>
                      <td style={{ color: '#ffffff' }}>Total Maintenance Order Settleable</td>
                      <td style={{ color: '#60a5fa', fontSize: '0.95rem' }}>
                        {formatCurrency(costing.totalPlannedCost)}
                      </td>
                      <td style={{ color: '#ffffff', fontSize: '1.05rem' }}>
                        {formatCurrency(costing.totalActualCost)}
                      </td>
                      <td style={{ color: costing.variance > 0 ? '#f87171' : '#34d399', fontSize: '0.95rem' }}>
                        {formatCurrency(costing.variance)}
                      </td>
                      <td>
                        <span className="badge badge-low">
                          Debit: {order.costCenter}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Settlement Instructions */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                  Settlement Rule Specification:
                </div>
                <div>Receiver Category: <strong>Cost Center ({order.costCenter})</strong> | 100% Full Settlement</div>
                {order.wbsElement && (
                  <div>Capital Project Account: <strong>{order.wbsElement}</strong></div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
