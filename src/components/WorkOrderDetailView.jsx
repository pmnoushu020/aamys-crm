import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  Package, 
  CheckCircle2, 
  Printer, 
  Layers, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  AlertTriangle,
  User,
  Calendar,
  Wrench,
  Lock,
  Sparkles,
  FileText
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
import { FUNCTIONAL_LOCATIONS, WORK_CENTERS, PERMITS_TO_WORK } from '../data/mockMasterData';

export default function WorkOrderDetailView({ 
  order, 
  onBack, 
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
  const linkedPermit = PERMITS_TO_WORK.find((p) => p.orderId === order.id);

  const isCreated = order.status === 'CRTD';
  const isReleased = ['REL', 'PCNF', 'CNF'].includes(order.status);
  const isTeco = order.status === 'TECO';

  const laborPercentage = costing.plannedInternalLaborHours > 0
    ? Math.min(100, Math.round((costing.actualInternalLaborHours / costing.plannedInternalLaborHours) * 100))
    : 0;

  return (
    <div className="page-body">
      {/* Top Breadcrumb & Return Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontWeight: 600 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Work Orders</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Plant Maintenance / Work Orders /
          </span>
          <span className="mono-chip" style={{ fontSize: '0.85rem' }}>{order.id}</span>
        </div>
      </div>

      {/* Main Order Header Hero Card */}
      <div className="view-page-header">
        <div className="view-page-title-row">
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="mono-chip" style={{ fontSize: '0.95rem', fontWeight: 800, padding: '4px 10px' }}>
                {order.id}
              </span>
              <span 
                className="status-pill"
                style={{ background: statusBadge.bg, color: statusBadge.text, borderColor: statusBadge.border, fontSize: '0.8rem' }}
              >
                {statusBadge.code} — {statusBadge.label}
              </span>
              <span className={`badge badge-${priorityBadge.color}`}>
                {priorityBadge.label}
              </span>
              <span className="mono-chip" style={{ color: orderType.color, fontWeight: 700 }}>
                {orderType.code}: {orderType.name}
              </span>
            </div>

            <h1 className="view-page-title">{order.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span>Created: <strong>{order.createdAt}</strong> by {order.createdBy}</span>
              <span>•</span>
              <span>Planning Plant: <strong>{order.planningPlant}</strong></span>
              <span>•</span>
              <span>Main Shop: <strong>{order.mainWorkCenter}</strong></span>
              {order.notificationNo && (
                <>
                  <span>•</span>
                  <span>Origin Notification: <strong style={{ color: 'var(--primary)' }}>{order.notificationNo}</strong></span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => onOpenJobCard(order)}
              title="Print professional industrial job card sheet"
            >
              <Printer size={16} />
              <span>Job Card / Print</span>
            </button>

            {isCreated && (
              <button 
                className="btn btn-primary"
                onClick={() => onReleaseOrder(order.id)}
              >
                <Send size={16} />
                <span>Release Order (REL)</span>
              </button>
            )}

            {isReleased && (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={() => onOpenTimeConfirmation(order)}
                  style={{ color: 'var(--primary)', borderColor: 'rgba(37, 99, 235, 0.3)' }}
                >
                  <Clock size={16} />
                  <span>Log Time (IW41)</span>
                </button>

                <button 
                  className="btn btn-secondary"
                  onClick={() => onOpenGoodsIssue(order)}
                  style={{ color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <Package size={16} />
                  <span>Issue Parts (261)</span>
                </button>

                <button 
                  className="btn btn-success"
                  onClick={() => onTecoOrder(order.id)}
                >
                  <CheckCircle2 size={16} />
                  <span>Technical Completion (TECO)</span>
                </button>
              </>
            )}

            {isTeco && (
              <span className="mono-chip mono-chip-emerald" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} /> Order Technically Completed
              </span>
            )}
          </div>
        </div>

        {/* 5-Step Process Ribbon */}
        <div className="workflow-ribbon" style={{ margin: '8px 0 0' }}>
          <div className="ribbon-step done">
            <CheckCircle2 size={15} />
            <span>1. Notification (IW21)</span>
          </div>
          <div className="ribbon-arrow">→</div>

          <div className={`ribbon-step ${isCreated ? 'current' : 'done'}`}>
            <Sparkles size={15} />
            <span>2. Order Planned (CRTD)</span>
          </div>
          <div className="ribbon-arrow">→</div>

          <div className={`ribbon-step ${order.status === 'REL' ? 'current' : (['PCNF', 'CNF', 'TECO'].includes(order.status) ? 'done' : '')}`}>
            <Send size={15} />
            <span>3. Order Released (REL)</span>
          </div>
          <div className="ribbon-arrow">→</div>

          <div className={`ribbon-step ${['PCNF', 'CNF'].includes(order.status) ? 'current' : (isTeco ? 'done' : '')}`}>
            <Clock size={15} />
            <span>4. Execution & Labor (IW41)</span>
          </div>
          <div className="ribbon-arrow">→</div>

          <div className={`ribbon-step ${isTeco ? 'done' : ''}`}>
            <CheckCircle2 size={15} />
            <span>5. Technical Signoff (TECO)</span>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards (Spacious, airy) */}
      <div className="view-hero-kpi-grid">
        {/* Metric 1: Asset Reference */}
        <div className="view-hero-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="view-hero-kpi-title">Reference Object</span>
            <Layers size={18} color="var(--primary)" />
          </div>
          <div className="view-hero-kpi-val" style={{ fontSize: '1.15rem' }}>
            {order.equipmentId || order.functionalLocationId}
          </div>
          <div className="view-hero-kpi-sub">
            {eqDetail ? `${eqDetail.name} • ${eqDetail.model}` : flDetail?.name}
          </div>
        </div>

        {/* Metric 2: Execution Labor Hours */}
        <div className="view-hero-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="view-hero-kpi-title">Labor Confirmation</span>
            <Clock size={18} color="#0284c7" />
          </div>
          <div className="view-hero-kpi-val" style={{ color: costing.actualInternalLaborHours > 0 ? 'var(--success)' : 'var(--text-main)' }}>
            {costing.actualInternalLaborHours}h <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {costing.plannedInternalLaborHours}h planned</span>
          </div>
          <div style={{ marginTop: '6px' }}>
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${laborPercentage}%`, background: 'var(--primary)', borderRadius: '4px' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {laborPercentage}% technician hours confirmed
            </div>
          </div>
        </div>

        {/* Metric 3: Total Settleable Cost */}
        <div className="view-hero-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="view-hero-kpi-title">Maintenance Cost</span>
            <DollarSign size={18} color="var(--success)" />
          </div>
          <div className="view-hero-kpi-val" style={{ color: 'var(--text-main)' }}>
            {formatCurrency(costing.totalActualCost)}
          </div>
          <div className="view-hero-kpi-sub">
            Budget Plan: {formatCurrency(costing.totalPlannedCost)} ({costing.variance > 0 ? `+$${costing.variance.toFixed(2)}` : '$0.00'})
          </div>
        </div>

        {/* Metric 4: Safety & LOTO Permit */}
        <div className="view-hero-kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="view-hero-kpi-title">Safety & Isolation</span>
            <ShieldCheck size={18} color={linkedPermit ? '#059669' : '#d97706'} />
          </div>
          <div className="view-hero-kpi-val" style={{ fontSize: '1.05rem' }}>
            {linkedPermit ? linkedPermit.permitNo : 'LOTO Mandatory'}
          </div>
          <div className="view-hero-kpi-sub">
            {linkedPermit ? (
              <span style={{ color: '#059669', fontWeight: 600 }}>✓ Zero-Energy Isolation Certified</span>
            ) : (
              <span>Permit to Work verification required</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Spacious Content Card */}
      <div className="panel-card">
        {/* Tab Headers */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FileText size={16} />
            <span>Overview & Asset Dossier</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            <Clock size={16} />
            <span>Operations & Tasks ({order.operations?.length || 0})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <Package size={16} />
            <span>Spare Parts & Movement 261 ({order.components?.length || 0})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            <DollarSign size={16} />
            <span>Cost Settlement Ledger</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
            onClick={() => setActiveTab('safety')}
          >
            <ShieldCheck size={16} />
            <span>Safety & LOTO Clearance</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Technical Failure Scope */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Maintenance Task Scope & Failure Report
              </h3>
              <div style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 22px',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
              }}>
                {order.headerText || order.title}
              </div>
            </div>

            {/* Asset Reference Information Box */}
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="var(--primary)" />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Core Reference Object Master Data
                  </h4>
                </div>
                <span className="mono-chip mono-chip-emerald">Master Record Linked</span>
              </div>

              <div className="form-grid-3">
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Target Equipment ID
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {order.equipmentId || 'No direct EQ link'}
                  </div>
                  {eqDetail && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '2px' }}>
                      {eqDetail.name} ({eqDetail.category})
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Functional Location
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {order.functionalLocationId || '—'}
                  </div>
                  {flDetail && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {flDetail.name}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Equipment Serial & Model
                  </div>
                  {eqDetail ? (
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{eqDetail.manufacturer}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model: {eqDetail.model} | S/N: {eqDetail.serialNo}</div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</div>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule & Plant Data */}
            <div className="form-grid-2">
              <div style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px'
              }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span>Execution Schedule Window</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Scheduled Basic Start:</span>
                    <strong>{formatDate(order.basicStartDate)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Scheduled Basic Finish:</span>
                    <strong>{formatDate(order.basicFinishDate)}</strong>
                  </div>
                  {order.releasedAt && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Order Released At:</span>
                      <strong style={{ color: 'var(--primary)' }}>{order.releasedAt}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px'
              }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} color="var(--primary)" />
                  <span>Administrative & Organization Units</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Planning Plant:</span>
                    <strong>{order.planningPlant} (Hamburg Refinery)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Maintenance Plant:</span>
                    <strong>{order.maintenancePlant}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Settlement Cost Center:</span>
                    <strong style={{ color: 'var(--success)' }}>{order.costCenter}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPERATIONS */}
        {activeTab === 'operations' && (
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Internal Operations & Contractor Services
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Step-by-step task breakdown with estimated technician labor (PM01) and external purchase requisitions (PM03).
                </p>
              </div>

              {isReleased && (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenTimeConfirmation(order)}
                >
                  <Clock size={14} />
                  <span>Post Time Confirmation (IW41)</span>
                </button>
              )}
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Op No</th>
                    <th>Control Key</th>
                    <th>Work Center</th>
                    <th>Task Specification & Vendor Details</th>
                    <th>Planned Duration</th>
                    <th>Confirmed Labor</th>
                    <th>Technician Signoff</th>
                    <th>Task Status</th>
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
                            {isInternal ? 'PM01 (Internal)' : 'PM03 (External PR)'}
                          </span>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>{op.workCenter}</strong>
                        </td>
                        <td>
                          <div>
                            <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{op.description}</div>
                            {op.vendor && (
                              <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: '3px' }}>
                                Contractor: <strong>{op.vendor}</strong> | PR: {op.prNumber} (${op.externalCost})
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {isInternal ? `${plannedTotal}h (${op.laborHours}h × ${op.technicians} tech)` : 'PR Contract'}
                        </td>
                        <td>
                          {isInternal ? (
                            <strong style={{ color: op.confirmedHours > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                              {op.confirmedHours || 0} hrs
                            </strong>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        <td>
                          {op.confirmedBy ? (
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>{op.confirmedBy}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{op.confirmedDate}</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Unconfirmed</span>
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
          </div>
        )}

        {/* TAB 3: SPARE PARTS */}
        {activeTab === 'materials' && (
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Spare Parts Reservation & Consumption
                  </h3>
                  <span className="mono-chip mono-chip-emerald">
                    SAP Movement Type 261
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Reserved components automatically generate warehouse picking tickets. Posting goods issue debits the maintenance order.
                </p>
              </div>

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
                    <th>Quantity Required</th>
                    <th>Storage Location</th>
                    <th>Valuation Price</th>
                    <th>Total Line Value</th>
                    <th>Warehouse Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.components || []).length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                        No spare parts reserved for this order.
                      </td>
                    </tr>
                  ) : (
                    order.components.map((comp, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="mono-chip">{comp.reservationNo}</span>
                        </td>
                        <td>
                          <span className="mono-chip mono-chip-emerald">{comp.materialNo}</span>
                        </td>
                        <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                          {comp.description}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>{comp.quantity} {comp.unit}</strong>
                        </td>
                        <td>{comp.storageLocation}</td>
                        <td>{formatCurrency(comp.unitPrice)}</td>
                        <td>
                          <strong style={{ color: 'var(--text-main)' }}>
                            {formatCurrency(comp.quantity * comp.unitPrice)}
                          </strong>
                        </td>
                        <td>
                          {comp.isIssued ? (
                            <span className="badge badge-low">
                              ✓ Issued 261 ({comp.issuedDate || 'Complete'})
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
          </div>
        )}

        {/* TAB 4: FINANCIAL COST SETTLEMENT */}
        {activeTab === 'costs' && (
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '26px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Plant Maintenance Cost Settlement Matrix (CO-OM)
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Compares planned budget estimates with actual incurred labor hours, contractor invoices, and warehouse goods issues.
              </p>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cost Category</th>
                    <th>Planned Maintenance Budget</th>
                    <th>Actual Incurred Cost</th>
                    <th>Variance Amount</th>
                    <th>Settlement Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>Internal Workshop Labor (Shop Rates)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Planned: {costing.plannedInternalLaborHours}h | Confirmed: {costing.actualInternalLaborHours}h
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {formatCurrency(costing.plannedLaborCost)}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      {formatCurrency(costing.actualLaborCost)}
                    </td>
                    <td style={{ color: costing.actualLaborCost > costing.plannedLaborCost ? 'var(--danger)' : 'var(--success)' }}>
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
                      <strong style={{ color: 'var(--text-main)' }}>External Contractor Services (PM03 PRs)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Specialist vendor contracts & balancing</div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#d97706' }}>
                      {formatCurrency(costing.plannedExternalCost)}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      {formatCurrency(costing.actualExternalCost)}
                    </td>
                    <td style={{ color: 'var(--success)' }}>
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
                      <strong style={{ color: 'var(--text-main)' }}>Spare Parts & Consumables (Mvt 261)</strong>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Warehouse inventory goods issues posted to order</div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                      {formatCurrency(costing.plannedMaterialCost)}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      {formatCurrency(costing.actualMaterialCost)}
                    </td>
                    <td style={{ color: 'var(--success)' }}>
                      {formatCurrency(costing.actualMaterialCost - costing.plannedMaterialCost)}
                    </td>
                    <td>
                      <span className="mono-chip">
                        {costing.actualMaterialCost === costing.plannedMaterialCost && costing.plannedMaterialCost > 0 ? 'All Issued' : 'Partial'}
                      </span>
                    </td>
                  </tr>

                  <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                    <td style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      Total Maintenance Order Settleable
                    </td>
                    <td style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {formatCurrency(costing.totalPlannedCost)}
                    </td>
                    <td style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>
                      {formatCurrency(costing.totalActualCost)}
                    </td>
                    <td style={{ color: costing.variance > 0 ? 'var(--danger)' : 'var(--success)', fontSize: '1.05rem' }}>
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

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 24px',
              fontSize: '0.84rem'
            }}>
              <strong style={{ color: 'var(--text-main)' }}>Settlement Rule Allocation:</strong>
              <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                100% of order expenses settle to Cost Center <strong>{order.costCenter}</strong>.
                {order.wbsElement && ` Capital Account Allocation: ${order.wbsElement}.`}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SAFETY & PERMIT TO WORK */}
        {activeTab === 'safety' && (
          <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Work Clearance Management & LOTO Isolation
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Lockout/Tagout isolation points and atmospheric toxicity testing verified prior to work commencement.
                </p>
              </div>

              {linkedPermit && (
                <span className="badge badge-low">
                  <ShieldCheck size={14} /> {linkedPermit.status}
                </span>
              )}
            </div>

            {linkedPermit ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Permit Document</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{linkedPermit.permitNo} — {linkedPermit.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Issuer: <strong>{linkedPermit.issuer}</strong> | Recipient: <strong>{linkedPermit.receiver}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Validity Window:</div>
                    <strong>{linkedPermit.issuedAt} to {linkedPermit.validUntil}</strong>
                  </div>
                </div>

                {/* Gas Test Certificate */}
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 22px'
                }}>
                  <div style={{ fontWeight: 800, color: '#065f46', fontSize: '0.85rem', marginBottom: '6px' }}>
                    ✓ Pre-Entry Atmospheric Gas Test Clearance:
                  </div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '0.85rem' }}>
                    <div>Combustible LEL: <strong style={{ color: '#065f46' }}>{linkedPermit.gasTest.lel}</strong></div>
                    <div>Oxygen (O2): <strong style={{ color: '#065f46' }}>{linkedPermit.gasTest.o2}</strong></div>
                    <div>Hydrogen Sulfide (H2S): <strong style={{ color: '#065f46' }}>{linkedPermit.gasTest.h2s}</strong></div>
                    <div>Certified By: <strong style={{ color: '#065f46' }}>{linkedPermit.gasTest.tester}</strong></div>
                  </div>
                </div>

                {/* LOTO Tags List */}
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lockout Tag No</th>
                        <th>Isolation Device Description</th>
                        <th>Zero-Energy Physical State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedPermit.isolations.map((iso, i) => (
                        <tr key={i}>
                          <td>
                            <span className="mono-chip mono-chip-amber">{iso.tagNo}</span>
                          </td>
                          <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>
                            {iso.breaker || iso.valve}
                          </td>
                          <td>
                            <span className="badge badge-low">
                              <Lock size={12} /> {iso.state}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                textAlign: 'center',
                color: '#92400e'
              }}>
                <AlertTriangle size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                <strong>No Active Work Clearance Permit Linked</strong>
                <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                  Technicians must acquire a signed Lockout/Tagout certificate before beginning mechanical dismantling on this asset.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
