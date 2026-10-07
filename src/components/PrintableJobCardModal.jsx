import React from 'react';
import { X, Printer, Download, CheckSquare, ShieldCheck, Wrench, Package } from 'lucide-react';
import { getEquipmentDetails, formatCurrency, formatDate } from '../utils/pmUtils';

export default function PrintableJobCardModal({ order, onClose }) {
  if (!order) return null;

  const eq = order.equipmentId ? getEquipmentDetails(order.equipmentId) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '850px', background: '#0b1120' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Printer size={18} color="#60a5fa" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Maintenance Job Card & Field Execution Sheet (Print Preview)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '6px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Job Sheet Content */}
        <div className="modal-body" style={{ background: '#ffffff', color: '#111827', padding: '36px 40px', fontFamily: 'serif' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #111827', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: 0 }}>
                AAMYS CRM
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#4b5563', fontFamily: 'sans-serif' }}>
                Enterprise Plant Maintenance & Asset Operations Division
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontFamily: 'sans-serif' }}>
                Planning Plant: {order.planningPlant} | Maint Plant: {order.maintenancePlant}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontFamily: 'sans-serif' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' }}>SAP PM WORK ORDER</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1d4ed8' }}>{order.id}</div>
              <div style={{ fontSize: '0.8rem', color: '#374151', fontWeight: 600 }}>Type: {order.orderType} | Status: {order.status}</div>
            </div>
          </div>

          {/* Reference Asset Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            padding: '14px',
            marginBottom: '20px',
            fontFamily: 'sans-serif',
            fontSize: '0.8rem'
          }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase' }}>Target Equipment:</div>
              <div style={{ fontWeight: 800, color: '#111827' }}>{order.equipmentId || 'N/A'}</div>
              {eq && <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>{eq.name}</div>}
              {eq && <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>S/N: {eq.serialNo}</div>}
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase' }}>Functional Location:</div>
              <div style={{ fontWeight: 800, color: '#111827' }}>{order.functionalLocationId}</div>
              <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '4px', textTransform: 'uppercase' }}>Cost Center:</div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{order.costCenter}</div>
            </div>

            <div>
              <div style={{ color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase' }}>Priority & Schedule:</div>
              <div style={{ fontWeight: 800, color: '#b91c1c' }}>PRIORITY: {order.priority.toUpperCase()}</div>
              <div style={{ fontSize: '0.75rem', color: '#374151' }}>Start: {formatDate(order.basicStartDate)}</div>
              <div style={{ fontSize: '0.75rem', color: '#374151' }}>Finish: {formatDate(order.basicFinishDate)}</div>
            </div>
          </div>

          {/* Task Scope */}
          <div style={{ marginBottom: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '8px' }}>
              Maintenance Header Task & Symptoms:
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>{order.title}</div>
            <div style={{ fontSize: '0.82rem', color: '#374151', lineHeight: '1.5', marginTop: '4px' }}>
              {order.headerText}
            </div>
          </div>

          {/* Operations Table */}
          <div style={{ marginBottom: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '8px' }}>
              Operations / Execution Tasks (Sign-off Checklist):
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #9ca3af' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Op</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Shop</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Task Specification</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>Plan Hrs</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>Actual</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>Technician Sign</th>
                </tr>
              </thead>
              <tbody>
                {(order.operations || []).map((op, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 700 }}>{op.opNo}</td>
                    <td style={{ padding: '8px' }}>{op.workCenter}</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ fontWeight: 600 }}>{op.description}</div>
                      {op.vendor && <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Contractor: {op.vendor} (PR: {op.prNumber})</div>}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{op.laborHours * (op.technicians || 1)}h</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{op.confirmedHours > 0 ? `${op.confirmedHours}h` : '______'}</td>
                    <td style={{ padding: '8px', textAlign: 'center', border: '1px dashed #d1d5db', width: '130px' }}>
                      {op.confirmedBy || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Materials Section */}
          <div style={{ marginBottom: '24px', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '1px solid #d1d5db', paddingBottom: '4px', marginBottom: '8px' }}>
              Spare Parts Reserved (SAP Movement Type 261):
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #9ca3af' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Reservation #</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Material #</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>Qty Req</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>Loc</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>Warehouse Issued</th>
                </tr>
              </thead>
              <tbody>
                {(order.components || []).map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>{c.reservationNo}</td>
                    <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 700 }}>{c.materialNo}</td>
                    <td style={{ padding: '6px 8px' }}>{c.description}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>{c.quantity} {c.unit}</td>
                    <td style={{ padding: '6px 8px' }}>{c.storageLocation}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                      {c.isIssued ? '✓ ISSUED 261' : '[   ] PENDING'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safety & LOTO Sign-off Box */}
          <div style={{
            border: '2px solid #b91c1c',
            borderRadius: '4px',
            padding: '10px 14px',
            marginBottom: '28px',
            fontFamily: 'sans-serif',
            fontSize: '0.75rem',
            background: '#fff5f5'
          }}>
            <div style={{ fontWeight: 800, color: '#b91c1c', textTransform: 'uppercase', marginBottom: '4px' }}>
              SAFETY MANDATE & ZERO-ENERGY ISOLATION (PTW / LOTO):
            </div>
            <div>
              1. Electrical Lockout / Tagout verified by lead technician. 2. Pipeline depressurized and atmospheric gas test (LEL 0.0%) confirmed.
              3. PPE Class 3 required (Hardhat, flame retardant coveralls, safety goggles, H2S sensor).
            </div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', paddingTop: '20px', borderTop: '1px solid #111827', fontFamily: 'sans-serif' }}>
            <div>
              <div style={{ height: '36px' }}></div>
              <div style={{ borderTop: '1px solid #6b7280', fontSize: '0.75rem', fontWeight: 700 }}>
                Executing Lead Technician
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Signature & Date</div>
            </div>

            <div>
              <div style={{ height: '36px' }}></div>
              <div style={{ borderTop: '1px solid #6b7280', fontSize: '0.75rem', fontWeight: 700 }}>
                Operations Shift Supervisor
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Permit Release Signature</div>
            </div>

            <div>
              <div style={{ height: '36px' }}></div>
              <div style={{ borderTop: '1px solid #6b7280', fontSize: '0.75rem', fontWeight: 700 }}>
                Plant Reliability Inspector (TECO)
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Final Technical Signoff</div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ background: '#0d1527' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Work Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
