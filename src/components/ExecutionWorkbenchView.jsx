import React from 'react';
import { 
  Clock, 
  Wrench, 
  Package, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { calculateOrderCosting, getPriorityBadge, getStatusBadge, formatCurrency, formatDate } from '../utils/pmUtils';

export default function ExecutionWorkbenchView({ 
  orders, 
  onOpenTimeConfirmation, 
  onOpenGoodsIssue, 
  onTecoOrder,
  onSelectOrder 
}) {
  const activeExecutionOrders = orders.filter((o) => ['REL', 'PCNF', 'CNF'].includes(o.status));

  // Extract all operations across active orders
  const allActiveOps = [];
  activeExecutionOrders.forEach((order) => {
    (order.operations || []).forEach((op) => {
      allActiveOps.push({
        ...op,
        orderId: order.id,
        orderTitle: order.title,
        orderPriority: order.priority,
        orderStatus: order.status
      });
    });
  });

  return (
    <div className="page-body">
      {/* Top Banner */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Execution & Time Confirmation Workbench (IW41)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Technicians record actual labor hours worked per operation, material issuances (Mvt 261), and complete tasks.
            </div>
          </div>
        </div>

        <span className="mono-chip mono-chip-emerald">
          {activeExecutionOrders.length} Orders In Execution
        </span>
      </div>

      {/* Orders In Execution Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {activeExecutionOrders.length === 0 ? (
          <div className="panel-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders currently released for execution. Release a draft order from the Work Orders tab to begin field work!
          </div>
        ) : (
          activeExecutionOrders.map((order) => {
            const costing = calculateOrderCosting(order);
            const pBadge = getPriorityBadge(order.priority);
            const sBadge = getStatusBadge(order.status);
            const unissuedCount = (order.components || []).filter((c) => !c.isIssued).length;

            return (
              <div key={order.id} className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span 
                      className="mono-chip" 
                      style={{ cursor: 'pointer', fontWeight: 700 }}
                      onClick={() => onSelectOrder(order)}
                    >
                      {order.id}
                    </span>
                    <span className={`badge badge-${pBadge.color}`}>{pBadge.label}</span>
                    <span 
                      className="status-pill"
                      style={{ background: sBadge.bg, color: sBadge.text, borderColor: sBadge.border }}
                    >
                      {sBadge.code}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {order.mainWorkCenter}
                  </span>
                </div>

                <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 
                    style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => onSelectOrder(order)}
                  >
                    {order.title}
                  </h4>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Asset: <strong style={{ color: '#2563eb' }}>{order.equipmentId || order.functionalLocationId}</strong>
                  </div>

                  {/* Operations status overview */}
                  <div style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Operations Progress:</span>
                      <strong style={{ color: 'var(--text-main)' }}>
                        {order.operations?.filter((o) => o.status === 'CNF').length} / {order.operations?.length} Finished
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Confirmed Hours:</span>
                      <strong style={{ color: '#34d399' }}>
                        {costing.actualInternalLaborHours}h / {costing.plannedInternalLaborHours}h
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>Actual Costs Settleable:</span>
                      <strong style={{ color: '#60a5fa' }}>
                        {formatCurrency(costing.totalActualCost)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{
                  padding: '12px 20px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenTimeConfirmation(order)}
                      title="Post time confirmation (IW41)"
                    >
                      <Clock size={13} />
                      <span>Log IW41</span>
                    </button>

                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenGoodsIssue(order)}
                      title="Issue parts with movement 261"
                    >
                      <Package size={13} />
                      <span>Issue Parts {unissuedCount > 0 && `(${unissuedCount})`}</span>
                    </button>
                  </div>

                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => onTecoOrder(order.id)}
                    title="Mark technical completion (TECO)"
                  >
                    <CheckCircle2 size={13} />
                    <span>TECO</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Operations Master Checklist */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <span className="panel-title">Operations Checklist & Technician Logs</span>
            <span className="mono-chip">{allActiveOps.length} tasks scheduled</span>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Op</th>
                <th>Shop</th>
                <th>Task Description</th>
                <th>Planned</th>
                <th>Confirmed Actual</th>
                <th>Technician</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allActiveOps.map((op, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="mono-chip">{op.orderId}</span>
                  </td>
                  <td>
                    <span className="mono-chip">{op.opNo}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--text-main)' }}>{op.workCenter}</strong>
                  </td>
                  <td>
                    <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{op.description}</div>
                  </td>
                  <td>
                    {op.controlKey === 'PM01' ? `${op.laborHours * op.technicians}h` : 'Vendor PR'}
                  </td>
                  <td>
                    <strong style={{ color: op.confirmedHours > 0 ? '#34d399' : 'var(--text-muted)' }}>
                      {op.confirmedHours || 0} hrs
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: op.confirmedBy ? '#93c5fd' : 'var(--text-muted)' }}>
                      {op.confirmedBy || 'Unassigned'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill status-${(op.status || 'crtd').toLowerCase()}`}>
                      {op.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
