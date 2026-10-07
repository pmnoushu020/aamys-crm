import React, { useState } from 'react';
import { X, Clock, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/pmUtils';
import { WORK_CENTERS } from '../data/mockMasterData';

export default function TimeConfirmationModal({ order, onClose, onConfirmTime }) {
  if (!order) return null;

  const internalOps = (order.operations || []).filter((op) => op.controlKey === 'PM01');
  const [selectedOpNo, setSelectedOpNo] = useState(internalOps[0]?.opNo || '0010');
  const [technician, setTechnician] = useState('Hans Gruber (Mechanical Tech #104)');
  const [actualHours, setActualHours] = useState(2.5);
  const [isFinalConfirmation, setIsFinalConfirmation] = useState(true);
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [error, setError] = useState('');

  const currentOp = order.operations?.find((op) => op.opNo === selectedOpNo);
  const currentWc = WORK_CENTERS.find((w) => w.id === currentOp?.workCenter) || { hourlyRate: 85 };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOpNo) {
      setError('Please select an operation to confirm.');
      return;
    }
    if (actualHours <= 0) {
      setError('Actual labor hours must be greater than 0.');
      return;
    }

    onConfirmTime({
      orderId: order.id,
      opNo: selectedOpNo,
      actualHours: Number(actualHours),
      technician,
      isFinal: isFinalConfirmation,
      notes: confirmationNotes.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa'
            }}>
              <Clock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Time Confirmation (IW41)
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Order: <strong style={{ color: '#93c5fd' }}>{order.id}</strong> — {order.title}
              </span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Select Operation */}
            <div className="form-group">
              <label className="form-label">
                <span>Select Operation Number (Task)</span>
                <span className="mono-chip">Operation Checklist</span>
              </label>
              <select 
                className="form-select"
                value={selectedOpNo}
                onChange={(e) => setSelectedOpNo(e.target.value)}
              >
                {internalOps.map((op) => (
                  <option key={op.opNo} value={op.opNo}>
                    {op.opNo} - {op.description} ({op.workCenter}, Planned: {op.laborHours}h × {op.technicians} tech)
                  </option>
                ))}
              </select>
            </div>

            {/* Operation Planned Context Box */}
            {currentOp && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem'
              }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Operation Context:</div>
                  <div style={{ color: '#ffffff', fontWeight: 600 }}>{currentOp.description}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                    Shop: {currentOp.workCenter} | Labor Rate: ${currentWc.hourlyRate}/hr
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Previously Confirmed:</div>
                  <strong style={{ color: currentOp.confirmedHours > 0 ? '#34d399' : '#ffffff' }}>
                    {currentOp.confirmedHours || 0} hrs
                  </strong>
                </div>
              </div>
            )}

            {/* Technician & Hours */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Executing Technician</span>
                </label>
                <input 
                  type="text"
                  className="form-input"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  placeholder="Technician name and ID"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Actual Labor Hours Worked</span>
                  <span className="mono-chip">IW41 Hours</span>
                </label>
                <input 
                  type="number"
                  step="0.25"
                  min="0.25"
                  className="form-input"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  style={{ fontWeight: 700, fontSize: '0.95rem' }}
                />
                <span className="input-helper">
                  Incurred Cost: {formatCurrency(actualHours * currentWc.hourlyRate)}
                </span>
              </div>
            </div>

            {/* Confirmation Type */}
            <div className="form-group">
              <label className="form-label">
                <span>Confirmation Type</span>
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
                  <input 
                    type="radio"
                    name="cnfType"
                    checked={isFinalConfirmation}
                    onChange={() => setIsFinalConfirmation(true)}
                  />
                  <span><strong>Final Confirmation (CNF)</strong> — Task completely finished</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem' }}>
                  <input 
                    type="radio"
                    name="cnfType"
                    checked={!isFinalConfirmation}
                    onChange={() => setIsFinalConfirmation(false)}
                  />
                  <span><strong>Partial (PCNF)</strong> — More work remains</span>
                </label>
              </div>
            </div>

            {/* Completion Notes */}
            <div className="form-group">
              <label className="form-label">
                <span>Confirmation Notes / Technical Measurements</span>
              </label>
              <textarea 
                className="form-textarea"
                rows={3}
                placeholder="e.g. Mechanical seal gland bolts torqued to 45 Nm. Runout measured at 0.015mm. No seal leakage on test."
                value={confirmationNotes}
                onChange={(e) => setConfirmationNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={15} />
              <span>Post Time Confirmation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
