import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, UserCheck, Flame, Plus, X } from 'lucide-react';
import { PERMITS_TO_WORK } from '../data/mockMasterData';

export default function PermitToWorkView({ permits = PERMITS_TO_WORK, onAuthorizePermit }) {
  const [permitList, setPermitList] = useState(permits);
  const [selectedPermit, setSelectedPermit] = useState(null);

  const handleAuthorize = (permitNo) => {
    setPermitList((prev) =>
      prev.map((p) =>
        p.permitNo === permitNo
          ? { ...p, status: 'Active / Authorized', validUntil: '2026-10-08 20:00' }
          : p
      )
    );
    if (selectedPermit && selectedPermit.permitNo === permitNo) {
      setSelectedPermit((prev) => ({
        ...prev,
        status: 'Active / Authorized',
        validUntil: '2026-10-08 20:00'
      }));
    }
  };

  return (
    <div className="page-body">
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.12), rgba(245, 158, 11, 0.08))',
        border: '1px solid rgba(239, 68, 68, 0.25)',
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
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f87171'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Permit to Work & Work Clearance Management (PTW / WCM / LOTO)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Ensures zero-energy electrical & process isolation (Lockout/Tagout) and toxic gas clearance before equipment dismantling.
            </div>
          </div>
        </div>

        <span className="mono-chip mono-chip-emerald">
          Plant Safety Compliance Enforced
        </span>
      </div>

      {/* Permits Table */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="panel-title-wrap">
            <span className="panel-title">Active Work Clearance Permits</span>
            <span className="mono-chip">{permitList.length} permits</span>
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Permit No</th>
                <th>Work Order Link</th>
                <th>Permit Scope & Activity</th>
                <th>Category</th>
                <th>Safety Issuer</th>
                <th>Recipient (Shop)</th>
                <th>Gas Clearance</th>
                <th>Safety Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {permitList.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No safety permits currently issued. Safety permits can be created and linked to active work orders.
                  </td>
                </tr>
              ) : (
                permitList.map((permit) => (
                <tr key={permit.permitNo}>
                  <td>
                    <span 
                      className="mono-chip mono-chip-amber" 
                      style={{ fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => setSelectedPermit(permit)}
                    >
                      {permit.permitNo}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#60a5fa' }}>{permit.orderId}</strong>
                  </td>
                  <td>
                    <strong 
                      style={{ color: '#ffffff', cursor: 'pointer' }}
                      onClick={() => setSelectedPermit(permit)}
                    >
                      {permit.title}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Valid: {permit.issuedAt} to {permit.validUntil}
                    </div>
                  </td>
                  <td>
                    <span className="mono-chip">{permit.type}</span>
                  </td>
                  <td>{permit.issuer}</td>
                  <td>{permit.receiver}</td>
                  <td>
                    {permit.gasTest.tested ? (
                      <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                        LEL {permit.gasTest.lel} | O2 {permit.gasTest.o2}
                      </span>
                    ) : (
                      <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>
                        Pending Gas Test
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-low">{permit.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedPermit(permit)}
                    >
                      View Isolations
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPermit && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '680px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  Safety Isolation Certificate: {selectedPermit.permitNo}
                </h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPermit(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ color: '#ffffff', fontWeight: 700 }}>{selectedPermit.title}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Linked Order: <strong style={{ color: '#60a5fa' }}>{selectedPermit.orderId}</strong> | Authorized Issuer: {selectedPermit.issuer}
                </div>
              </div>

              {/* Gas Testing Panel */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>
                  Atmospheric Safety Gas Test Certificate:
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem' }}>
                  <div>Combustible Gases (LEL): <strong style={{ color: '#34d399' }}>{selectedPermit.gasTest.lel}</strong></div>
                  <div>Oxygen Level: <strong style={{ color: '#34d399' }}>{selectedPermit.gasTest.o2}</strong></div>
                  <div>Hydrogen Sulfide (H2S): <strong style={{ color: '#34d399' }}>{selectedPermit.gasTest.h2s}</strong></div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Certified Tester: {selectedPermit.gasTest.tester}
                </div>
              </div>

              {/* LOTO Isolation Points Table */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  Physical LOTO (Lockout / Tagout) Isolation Points:
                </div>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Lock Tag ID</th>
                        <th>Isolation Device / Valve / Breaker</th>
                        <th>Zero-Energy Locked State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPermit.isolations.map((iso, i) => (
                        <tr key={i}>
                          <td>
                            <span className="mono-chip mono-chip-amber">{iso.tagNo}</span>
                          </td>
                          <td style={{ color: '#ffffff' }}>
                            {iso.breaker || iso.valve}
                          </td>
                          <td>
                            <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                              <Lock size={10} /> {iso.state}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedPermit(null)}>
                Close
              </button>
              {selectedPermit.status !== 'Active / Authorized' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAuthorize(selectedPermit.permitNo)}
                >
                  <CheckCircle2 size={15} />
                  <span>Sign & Authorize Permit</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
