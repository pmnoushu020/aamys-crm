import React, { useState } from 'react';
import { Calendar, Plus, Play, CheckCircle2, Clock, Wrench, AlertCircle, Sparkles } from 'lucide-react';
import { PREVENTIVE_PLANS, EQUIPMENT_LIST, WORK_CENTERS } from '../data/mockMasterData';
import { generateDatesForPriority } from '../utils/pmUtils';

export default function PreventiveMaintenanceView({ plans = PREVENTIVE_PLANS, onGenerateOrderFromPlan }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [planList, setPlanList] = useState(plans);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState('EQ-100421');
  const [cycleInterval, setCycleInterval] = useState('30 Days');
  const [workCenterId, setWorkCenterId] = useState('MECH_01');
  const [estimatedHours, setEstimatedHours] = useState(3.5);

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const eq = EQUIPMENT_LIST.find((e) => e.id === equipmentId);
    const newPlan = {
      planId: `MP-${Math.floor(500 + Math.random() * 400)}`,
      description: description.trim(),
      equipmentId,
      functionalLocationId: eq?.functionalLocationId || 'FL-100-PUMP-01',
      cycleInterval,
      orderType: 'PM02',
      workCenterId,
      lastCallDate: new Date().toISOString().substring(0, 10),
      nextCallDate: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      status: 'Scheduled (Active)',
      tasksCount: 3,
      estimatedHours: Number(estimatedHours)
    };

    setPlanList([newPlan, ...planList]);
    setShowAddModal(false);
    setDescription('');
  };

  const handleCallSchedule = (plan) => {
    const dates = generateDatesForPriority('Medium');
    const newOrder = {
      id: `WO-${Math.floor(300300 + Math.random() * 600)}`,
      orderType: 'PM02', // Preventive Maintenance
      title: `[PM Plan ${plan.planId}] ${plan.description}`,
      headerText: `Routine scheduled preventive maintenance generated automatically from PM Plan ${plan.planId}. Cycle Interval: ${plan.cycleInterval}.`,
      equipmentId: plan.equipmentId,
      functionalLocationId: plan.functionalLocationId,
      notificationNo: null,
      planningPlant: 'PL01',
      maintenancePlant: 'PL01',
      mainWorkCenter: plan.workCenterId,
      priority: 'Medium',
      status: 'REL', // Automatically Released
      basicStartDate: dates.startDate,
      basicFinishDate: dates.finishDate,
      costCenter: 'CC-4100',
      wbsElement: null,
      createdBy: 'SAP Auto-Scheduler (IP10)',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      releasedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      operations: [
        {
          opNo: '0010',
          workCenter: plan.workCenterId,
          description: `Execute routine checklist: ${plan.description}`,
          controlKey: 'PM01',
          laborHours: plan.estimatedHours,
          technicians: 1,
          confirmedHours: 0,
          confirmedBy: '',
          confirmedDate: '',
          status: 'PENDING',
          vendor: '',
          prNumber: '',
          externalCost: 0
        }
      ],
      components: [
        {
          materialNo: 'MAT-10093',
          description: 'Mobil SHC 630 Synthetic Gear & Bearing Lube (20L Drum)',
          quantity: 1,
          unit: 'CAN',
          movementType: '261',
          storageLocation: 'SL02',
          unitPrice: 215.00,
          reservationNo: `RES-${Math.floor(92000 + Math.random() * 800)}`,
          isIssued: false,
          issuedDate: null
        }
      ]
    };

    onGenerateOrderFromPlan(newOrder);
  };

  return (
    <div className="page-body">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.08))',
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
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Preventive Maintenance Plans & Scheduling (IP01 / IP10)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Automated recurring maintenance cycles (e.g. 30-day vibration checks, quarterly boiler tests). Generate PM02 Work Orders on demand.
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={15} />
          <span>New Maintenance Plan (IP01)</span>
        </button>
      </div>

      {/* Plans List Table */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <span className="panel-title">Active Recurring Maintenance Plans</span>
            <span className="mono-chip">{planList.length} scheduled plans</span>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan ID</th>
                <th>Maintenance Plan Description</th>
                <th>Target Asset</th>
                <th>Cycle Frequency</th>
                <th>Shop</th>
                <th>Est. Labor</th>
                <th>Last Run</th>
                <th>Next Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Schedule Call</th>
              </tr>
            </thead>
            <tbody>
              {planList.map((plan) => (
                <tr key={plan.planId}>
                  <td>
                    <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700 }}>
                      {plan.planId}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#ffffff' }}>{plan.description}</strong>
                  </td>
                  <td>
                    <span className="mono-chip">{plan.equipmentId}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#93c5fd' }}>{plan.cycleInterval}</strong>
                  </td>
                  <td>{plan.workCenterId}</td>
                  <td>{plan.estimatedHours}h</td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{plan.lastCallDate}</td>
                  <td>
                    <strong style={{ color: '#fbbf24' }}>{plan.nextCallDate}</strong>
                  </td>
                  <td>
                    <span className="badge badge-low">{plan.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#60a5fa' }}
                      onClick={() => handleCallSchedule(plan)}
                      title="Trigger IP10 Schedule Call to generate PM02 Work Order"
                    >
                      <Play size={13} />
                      <span>Call Order (IP10)</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Create Preventive Maintenance Plan (IP01)
              </h3>
            </div>
            <form onSubmit={handleCreatePlan}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Plan Title & Scope <span className="required">*</span></span>
                  </label>
                  <input 
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Monthly Centrifugal Pump Bearing Greasing & Alignment Check"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label"><span>Target Asset</span></label>
                    <select 
                      className="form-select"
                      value={equipmentId}
                      onChange={(e) => setEquipmentId(e.target.value)}
                    >
                      {EQUIPMENT_LIST.map((eq) => (
                        <option key={eq.id} value={eq.id}>{eq.id} - {eq.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label"><span>Cycle Interval</span></label>
                    <select 
                      className="form-select"
                      value={cycleInterval}
                      onChange={(e) => setCycleInterval(e.target.value)}
                    >
                      <option value="7 Days">7 Days (Weekly)</option>
                      <option value="14 Days">14 Days (Bi-Weekly)</option>
                      <option value="30 Days">30 Days (Monthly)</option>
                      <option value="90 Days">90 Days (Quarterly)</option>
                      <option value="180 Days">180 Days (Semi-Annual)</option>
                      <option value="365 Days">365 Days (Annual)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label"><span>Responsible Work Center</span></label>
                    <select 
                      className="form-select"
                      value={workCenterId}
                      onChange={(e) => setWorkCenterId(e.target.value)}
                    >
                      {WORK_CENTERS.map((w) => (
                        <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label"><span>Estimated Labor Hours</span></label>
                    <input 
                      type="number"
                      step="0.5"
                      min="0.5"
                      className="form-input"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={15} />
                  <span>Save Plan (IP01)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
