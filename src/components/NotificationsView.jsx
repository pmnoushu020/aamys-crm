import React, { useState } from 'react';
import { 
  BellRing, 
  PlusCircle, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Clock, 
  Search,
  Layers,
  X
} from 'lucide-react';
import { EQUIPMENT_LIST, FUNCTIONAL_LOCATIONS } from '../data/mockMasterData';
import { getPriorityBadge } from '../utils/pmUtils';

export default function NotificationsView({ 
  notifications, 
  onConvertNotification, 
  onAddNotification 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState('EQ-100421');
  const [functionalLocationId, setFunctionalLocationId] = useState('FL-100-PUMP-01');
  const [priority, setPriority] = useState('High');
  const [reportedBy, setReportedBy] = useState('Wolfgang Meyer (Operator #441)');
  const [breakdown, setBreakdown] = useState(false);
  const [breakdownStart, setBreakdownStart] = useState('');

  const handleEquipmentSelect = (eqId) => {
    setEquipmentId(eqId);
    const eq = EQUIPMENT_LIST.find((e) => e.id === eqId);
    if (eq?.functionalLocationId) {
      setFunctionalLocationId(eq.functionalLocationId);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const notifNo = `NOTIF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif = {
      notificationNo: notifNo,
      equipmentId: equipmentId || null,
      functionalLocationId: functionalLocationId || null,
      title: title.trim(),
      description: description.trim() || title.trim(),
      priority,
      reportedBy: reportedBy.trim(),
      reportedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      breakdown,
      breakdownStart: breakdown ? (breakdownStart || new Date().toISOString().substring(0, 16)) : null,
      status: 'Approved',
      orderId: null
    };

    onAddNotification(newNotif);
    setShowCreateModal(false);
    // Reset form
    setTitle('');
    setDescription('');
    setBreakdown(false);
  };

  const filteredNotifs = notifications.filter((n) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      n.notificationNo.toLowerCase().includes(q) ||
      n.title.toLowerCase().includes(q) ||
      n.equipmentId?.toLowerCase().includes(q) ||
      n.functionalLocationId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-body">
      {/* Top Banner explaining IW21 -> IW31 standard pipeline */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.12), rgba(16, 185, 129, 0.08))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            <BellRing size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Standard SAP Maintenance Notification Intake (IW21 / IW28)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Notifications record asset defects, anomalies, and breakdowns. Approved requests convert directly into scheduled Work Orders (IW31).
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle size={15} />
          <span>Create Notification (IW21)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="filter-bar">
        <div className="search-box-wrap">
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search notification no, equipment, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredNotifs.length}</strong> maintenance notification records
        </div>
      </div>

      {/* Notifications Table */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <span className="panel-title">Active Maintenance Notifications</span>
            <span className="mono-chip">{filteredNotifs.length} items</span>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Notification No</th>
                <th style={{ width: '110px' }}>Breakdown</th>
                <th>Malfunction Short Text</th>
                <th>Reference Asset</th>
                <th style={{ width: '90px' }}>Priority</th>
                <th>Reported By / Date</th>
                <th style={{ width: '100px' }}>Status</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Workflow Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <BellRing size={32} style={{ opacity: 0.35 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {notifications.length === 0 ? 'No Maintenance Notifications Logged' : 'No Notifications Match Search'}
                      </div>
                      <div style={{ fontSize: '0.85rem', maxWidth: '440px', lineHeight: 1.5 }}>
                        {notifications.length === 0 
                          ? 'Operational notification records have been cleared (preserved in backup_data.txt). Log a new equipment defect or breakdown below.'
                          : 'No notifications match your current search query.'}
                      </div>
                      {notifications.length === 0 && (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)} style={{ marginTop: '6px' }}>
                          <PlusCircle size={14} />
                          <span>Create Notification (IW21)</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotifs.map((notif) => {
                const pBadge = getPriorityBadge(notif.priority);
                const hasOrder = Boolean(notif.orderId);

                return (
                  <tr key={notif.notificationNo}>
                    <td>
                      <span className="mono-chip" style={{ fontWeight: 700 }}>
                        {notif.notificationNo}
                      </span>
                    </td>

                    <td>
                      {notif.breakdown ? (
                        <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>
                          <AlertTriangle size={10} /> Breakdown Halt
                        </span>
                      ) : (
                        <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                          Operational
                        </span>
                      )}
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#ffffff' }}>{notif.title}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {notif.description.substring(0, 90)}...
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>
                          {notif.equipmentId || 'No direct EQ link'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>
                          {notif.functionalLocationId}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`badge badge-${pBadge.color}`}>
                        {pBadge.label}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.78rem', color: '#ffffff' }}>{notif.reportedBy}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notif.reportedDate}</div>
                    </td>

                    <td>
                      {hasOrder ? (
                        <span className="mono-chip mono-chip-emerald">
                          Order: {notif.orderId}
                        </span>
                      ) : (
                        <span className="mono-chip mono-chip-amber">
                          {notif.status}
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {hasOrder ? (
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                          ✓ Order Assigned
                        </span>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => onConvertNotification(notif)}
                          title="Generate Work Order IW31 from this notification"
                        >
                          <Wrench size={13} />
                          <span>Convert to Order (IW31)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Maintenance Notification (IW21) */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BellRing size={20} color="#60a5fa" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Create Maintenance Notification (IW21)
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">
                    <span>Malfunction Short Title <span className="required">*</span></span>
                  </label>
                  <input 
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Centrifugal pump high vibration & slurry leakage"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Malfunction Description & Detailed Symptoms</span>
                  </label>
                  <textarea 
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe failure symptoms, operating temperature, pressure deviations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <span>Target Equipment</span>
                    </label>
                    <select 
                      className="form-select"
                      value={equipmentId}
                      onChange={(e) => handleEquipmentSelect(e.target.value)}
                    >
                      {EQUIPMENT_LIST.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.id} - {eq.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Functional Location</span>
                    </label>
                    <select 
                      className="form-select"
                      value={functionalLocationId}
                      onChange={(e) => setFunctionalLocationId(e.target.value)}
                    >
                      {FUNCTIONAL_LOCATIONS.map((fl) => (
                        <option key={fl.id} value={fl.id}>
                          {fl.id} - {fl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <span>Priority</span>
                    </label>
                    <select 
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Urgent">Urgent (Immediate Action)</option>
                      <option value="High">High (Within 24 Hours)</option>
                      <option value="Medium">Medium (Scheduled)</option>
                      <option value="Low">Low (Backlog)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Reported By</span>
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={reportedBy}
                      onChange={(e) => setReportedBy(e.target.value)}
                    />
                  </div>
                </div>

                {/* Breakdown Switch */}
                <div style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={breakdown}
                      onChange={(e) => setBreakdown(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5' }}>
                      Breakdown Halt (Asset currently stopped or tripped)
                    </span>
                  </label>

                  {breakdown && (
                    <div className="form-group">
                      <label className="form-label" style={{ color: '#fca5a5' }}>
                        <span>Breakdown Start Timestamp</span>
                      </label>
                      <input 
                        type="datetime-local"
                        className="form-input"
                        value={breakdownStart}
                        onChange={(e) => setBreakdownStart(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle size={15} />
                  <span>Submit Notification (IW21)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
