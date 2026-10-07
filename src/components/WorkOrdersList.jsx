import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  Send, 
  Clock, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Wrench,
  DollarSign
} from 'lucide-react';
import { 
  getPriorityBadge, 
  getStatusBadge, 
  getOrderTypeInfo, 
  calculateOrderCosting, 
  formatCurrency, 
  formatDate 
} from '../utils/pmUtils';
import { WORK_CENTERS, ORDER_TYPES } from '../data/mockMasterData';

export default function WorkOrdersList({ 
  orders, 
  onSelectOrder, 
  onNewOrderClick,
  onReleaseOrder, 
  onOpenTimeConfirmation, 
  onOpenGoodsIssue, 
  onTecoOrder 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [workCenterFilter, setWorkCenterFilter] = useState('ALL');

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (typeFilter !== 'ALL' && order.orderType !== typeFilter) return false;
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && order.priority !== priorityFilter) return false;
    if (workCenterFilter !== 'ALL' && order.mainWorkCenter !== workCenterFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = order.id?.toLowerCase().includes(q);
      const matchTitle = order.title?.toLowerCase().includes(q);
      const matchEq = order.equipmentId?.toLowerCase().includes(q);
      const matchFl = order.functionalLocationId?.toLowerCase().includes(q);
      const matchNotif = order.notificationNo?.toLowerCase().includes(q);
      return matchId || matchTitle || matchEq || matchFl || matchNotif;
    }

    return true;
  });

  // Calculate high-level KPIs
  const totalOrders = orders.length;
  const breakdowns = orders.filter((o) => o.orderType === 'PM03' && o.status !== 'TECO').length;
  const readyToRelease = orders.filter((o) => o.status === 'CRTD').length;
  const underExecution = orders.filter((o) => ['REL', 'PCNF', 'CNF'].includes(o.status)).length;
  const tecoCompleted = orders.filter((o) => o.status === 'TECO').length;

  const totalActualCost = orders.reduce((acc, o) => {
    const c = calculateOrderCosting(o);
    return acc + c.totalActualCost;
  }, 0);

  return (
    <div className="page-body">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-blue">
            <Wrench size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Active Orders</span>
            <span className="metric-value">{totalOrders}</span>
            <span className="metric-sub">{underExecution} currently under execution</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-rose">
            <ShieldAlert size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">PM03 Breakdowns</span>
            <span className="metric-value">{breakdowns}</span>
            <span className="metric-sub">Unplanned emergency stops</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-amber">
            <Clock size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Drafts (CRTD)</span>
            <span className="metric-value">{readyToRelease}</span>
            <span className="metric-sub">Pending planner release</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-emerald">
            <CheckCircle size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Completed (TECO)</span>
            <span className="metric-value">{tecoCompleted}</span>
            <span className="metric-sub">Technically completed & signed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-purple">
            <DollarSign size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Total Actual Costs</span>
            <span className="metric-value">{formatCurrency(totalActualCost)}</span>
            <span className="metric-sub">Labor + Services + Mvt 261</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box-wrap">
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search order ID, equipment, description, FL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-group">
          <select 
            className="select-custom"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Order Types (PM01-04)</option>
            {ORDER_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.id} - {t.short || t.name}</option>
            ))}
          </select>

          <select 
            className="select-custom"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="CRTD">CRTD (Created)</option>
            <option value="REL">REL (Released)</option>
            <option value="PCNF">PCNF (Partially Confirmed)</option>
            <option value="CNF">CNF (Confirmed)</option>
            <option value="TECO">TECO (Technically Completed)</option>
          </select>

          <select 
            className="select-custom"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            className="select-custom"
            value={workCenterFilter}
            onChange={(e) => setWorkCenterFilter(e.target.value)}
          >
            <option value="ALL">All Work Centers</option>
            {WORK_CENTERS.map((wc) => (
              <option key={wc.id} value={wc.id}>{wc.id}</option>
            ))}
          </select>

          <button 
            className="btn btn-primary btn-sm"
            onClick={onNewOrderClick}
          >
            <PlusCircle size={15} />
            <span>New Order (IW31)</span>
          </button>
        </div>
      </div>

      {/* Main Work Orders Table */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <span className="panel-title">Maintenance Work Orders List</span>
            <span className="mono-chip">{filteredOrders.length} records</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing Plant Maintenance Records (Hamburg PL01 / Munich PL02)
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Order No</th>
                <th style={{ width: '80px' }}>Type</th>
                <th>Order Description & Header Text</th>
                <th>Reference Object (Asset)</th>
                <th style={{ width: '90px' }}>Priority</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ width: '100px' }}>Shop / Plant</th>
                <th style={{ width: '110px' }}>Labor (h)</th>
                <th style={{ width: '130px' }}>Actual Cost</th>
                <th style={{ width: '160px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <Wrench size={32} style={{ opacity: 0.35 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {orders.length === 0 ? 'No Work Orders in System' : 'No Work Orders Match Filter'}
                      </div>
                      <div style={{ fontSize: '0.85rem', maxWidth: '440px', lineHeight: 1.5 }}>
                        {orders.length === 0 
                          ? 'Operational data has been cleared (preserved in backup_data.txt). Click below to create your first maintenance work order.'
                          : 'No work orders match your search or filter parameters. Try clearing the filters.'}
                      </div>
                      {orders.length === 0 && (
                        <button className="btn btn-primary btn-sm" onClick={onNewOrderClick} style={{ marginTop: '6px' }}>
                          <PlusCircle size={14} />
                          <span>Create Work Order (IW31)</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const priority = getPriorityBadge(order.priority);
                  const status = getStatusBadge(order.status);
                  const type = getOrderTypeInfo(order.orderType);
                  const costing = calculateOrderCosting(order);

                  return (
                    <tr key={order.id}>
                      <td>
                        <span 
                          className="mono-chip" 
                          style={{ cursor: 'pointer', fontWeight: 700 }}
                          onClick={() => onSelectOrder(order)}
                          title="Click to view full dossier"
                        >
                          {order.id}
                        </span>
                      </td>

                      <td>
                        <span 
                          className="status-pill"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            color: type.color,
                            border: `1px solid ${type.color}40`,
                            fontSize: '0.68rem'
                          }}
                        >
                          {type.code}
                        </span>
                      </td>

                      <td>
                        <div>
                          <span 
                            className="order-title-link"
                            onClick={() => onSelectOrder(order)}
                          >
                            {order.title}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                            <span>Scheduled: {formatDate(order.basicStartDate)}</span>
                            {order.notificationNo && (
                              <span>• Ref Notif: <strong style={{ color: '#93c5fd' }}>{order.notificationNo}</strong></span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {order.equipmentId || 'No direct EQ link'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                            {order.functionalLocationId || '—'}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`badge badge-${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>

                      <td>
                        <span 
                          className="status-pill"
                          style={{ background: status.bg, color: status.text, borderColor: status.border }}
                        >
                          {status.code}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{order.mainWorkCenter}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{order.maintenancePlant}</div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.82rem' }}>
                          <strong style={{ color: costing.actualInternalLaborHours > 0 ? 'var(--success)' : 'var(--text-main)' }}>
                            {costing.actualInternalLaborHours}h
                          </strong>
                          <span style={{ color: 'var(--text-muted)' }}> / {costing.plannedInternalLaborHours}h</span>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                            {formatCurrency(costing.totalActualCost)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Plan: {formatCurrency(costing.totalPlannedCost)}
                          </div>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => onSelectOrder(order)}
                            title="View order details"
                          >
                            <Eye size={13} />
                          </button>

                          {order.status === 'CRTD' && (
                            <button 
                              className="btn btn-primary btn-sm"
                              style={{ padding: '4px 8px' }}
                              onClick={() => onReleaseOrder(order.id)}
                              title="Release Order (REL)"
                            >
                              <Send size={13} />
                            </button>
                          )}

                          {['REL', 'PCNF', 'CNF'].includes(order.status) && (
                            <>
                              <button 
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', color: '#60a5fa' }}
                                onClick={() => onOpenTimeConfirmation(order)}
                                title="Time Confirmation (IW41)"
                              >
                                <Clock size={13} />
                              </button>

                              <button 
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '4px 8px', color: '#34d399' }}
                                onClick={() => onOpenGoodsIssue(order)}
                                title="Issue Spare Parts (Mvt 261)"
                              >
                                <Package size={13} />
                              </button>

                              <button 
                                className="btn btn-success btn-sm"
                                style={{ padding: '4px 8px' }}
                                onClick={() => onTecoOrder(order.id)}
                                title="Mark Technical Completion (TECO)"
                              >
                                <CheckCircle size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
