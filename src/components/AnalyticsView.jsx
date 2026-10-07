import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Wrench, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { calculateOrderCosting, formatCurrency } from '../utils/pmUtils';
import { COST_CENTERS, WORK_CENTERS } from '../data/mockMasterData';

export default function AnalyticsView({ orders }) {
  let totalPlannedLabor = 0;
  let totalActualLabor = 0;
  let totalPlannedExt = 0;
  let totalActualExt = 0;
  let totalPlannedMat = 0;
  let totalActualMat = 0;

  orders.forEach((o) => {
    const c = calculateOrderCosting(o);
    totalPlannedLabor += c.plannedLaborCost;
    totalActualLabor += c.actualLaborCost;
    totalPlannedExt += c.plannedExternalCost;
    totalActualExt += c.actualExternalCost;
    totalPlannedMat += c.plannedMaterialCost;
    totalActualMat += c.actualMaterialCost;
  });

  const grandPlanned = totalPlannedLabor + totalPlannedExt + totalPlannedMat;
  const grandActual = totalActualLabor + totalActualExt + totalActualMat;
  const totalVariance = grandActual - grandPlanned;

  // Breakdown orders
  const pm03Count = orders.filter((o) => o.orderType === 'PM03').length;
  const pm01Count = orders.filter((o) => o.orderType === 'PM01').length;
  const pm02Count = orders.filter((o) => o.orderType === 'PM02').length;

  return (
    <div className="page-body">
      {/* Top Banner */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
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
            background: 'rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc'
          }}>
            <BarChart3 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Maintenance Cost Settlement & Reliability Analytics (MCI8)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Plant Maintenance order accounting variance, internal vs external labor breakdown, and reliability metrics.
            </div>
          </div>
        </div>
        <span className="mono-chip mono-chip-emerald">
          Real-time CO-OM Settlement Active
        </span>
      </div>

      {/* KPI Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-blue">
            <DollarSign size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Planned Budget</span>
            <span className="metric-value">{formatCurrency(grandPlanned)}</span>
            <span className="metric-sub">Approved maintenance plan</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-purple">
            <DollarSign size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Actual Incurred</span>
            <span className="metric-value">{formatCurrency(grandActual)}</span>
            <span className="metric-sub">Confirmed labor + parts</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-emerald">
            <TrendingUp size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Budget Variance</span>
            <span className="metric-value" style={{ color: totalVariance > 0 ? '#f87171' : '#34d399' }}>
              {formatCurrency(totalVariance)}
            </span>
            <span className="metric-sub">{totalVariance > 0 ? 'Over budget' : 'Under committed budget'}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-icon-rose">
            <ShieldAlert size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Breakdown Ratio</span>
            <span className="metric-value">{orders.length > 0 ? Math.round((pm03Count / orders.length) * 100) : 0}%</span>
            <span className="metric-sub">{pm03Count} emergency stops</span>
          </div>
        </div>
      </div>

      {/* Cost Settlement Category Breakdown */}
      <div className="panel-card">
        <div className="panel-header">
          <span className="panel-title">Planned vs Actual Cost Expenditure by Category</span>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Internal Labor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span>Internal Workshop Labor (MECH_01, ELEC_01, etc.)</span>
              <span><strong>{formatCurrency(totalActualLabor)}</strong> / {formatCurrency(totalPlannedLabor)}</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(100, totalPlannedLabor > 0 ? (totalActualLabor / totalPlannedLabor) * 100 : 0)}%`, 
                  background: '#3b82f6',
                  borderRadius: '5px'
                }} 
              />
            </div>
          </div>

          {/* External Vendor Services */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span>External Contractor Services (Control Key PM03 PR)</span>
              <span><strong>{formatCurrency(totalActualExt)}</strong> / {formatCurrency(totalPlannedExt)}</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(100, totalPlannedExt > 0 ? (totalActualExt / totalPlannedExt) * 100 : 0)}%`, 
                  background: '#f59e0b',
                  borderRadius: '5px'
                }} 
              />
            </div>
          </div>

          {/* Materials */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
              <span>Warehouse Spare Parts & Consumables (Movement Type 261)</span>
              <span><strong>{formatCurrency(totalActualMat)}</strong> / {formatCurrency(totalPlannedMat)}</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${Math.min(100, totalPlannedMat > 0 ? (totalActualMat / totalPlannedMat) * 100 : 0)}%`, 
                  background: '#10b981',
                  borderRadius: '5px'
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cost Center Absorption Matrix */}
      <div className="panel-card">
        <div className="panel-header">
          <span className="panel-title">Cost Center Maintenance Absorption (CO-OM)</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cost Center</th>
                <th>Description</th>
                <th>Orders Charged</th>
                <th>Actual Settleable Cost</th>
                <th>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              {COST_CENTERS.map((cc) => {
                const matchingOrders = orders.filter((o) => o.costCenter === cc.id);
                const ccActual = matchingOrders.reduce((acc, o) => {
                  return acc + calculateOrderCosting(o).totalActualCost;
                }, 0);

                return (
                  <tr key={cc.id}>
                    <td>
                      <span className="mono-chip" style={{ fontWeight: 700 }}>
                        {cc.id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{cc.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Manager: {cc.manager}</div>
                    </td>
                    <td>{matchingOrders.length} work order(s)</td>
                    <td>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>
                        {formatCurrency(ccActual)}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-low">
                        Settlement Ready
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
