// Utility functions for Plant Maintenance Calculations, Cost Settlement & Status Badges
import { WORK_CENTERS, EQUIPMENT_LIST, FUNCTIONAL_LOCATIONS } from '../data/mockMasterData';

export const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(val);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

export const calculateOrderCosting = (order) => {
  let plannedInternalLaborHours = 0;
  let actualInternalLaborHours = 0;
  let plannedLaborCost = 0;
  let actualLaborCost = 0;
  let plannedExternalCost = 0;
  let actualExternalCost = 0;

  (order.operations || []).forEach((op) => {
    const wc = WORK_CENTERS.find((w) => w.id === op.workCenter) || { hourlyRate: 85 };
    const rate = wc.hourlyRate || 85;

    if (op.controlKey === 'PM01') {
      const plannedHrs = (Number(op.laborHours) || 0) * (Number(op.technicians) || 1);
      const confHrs = Number(op.confirmedHours) || 0;

      plannedInternalLaborHours += plannedHrs;
      actualInternalLaborHours += confHrs;

      plannedLaborCost += plannedHrs * rate;
      actualLaborCost += confHrs * rate;
    } else if (op.controlKey === 'PM03') {
      const extCost = Number(op.externalCost) || 0;
      plannedExternalCost += extCost;
      if (op.status === 'CNF') {
        actualExternalCost += extCost;
      }
    }
  });

  let plannedMaterialCost = 0;
  let actualMaterialCost = 0;

  (order.components || []).forEach((comp) => {
    const itemCost = (Number(comp.quantity) || 0) * (Number(comp.unitPrice) || 0);
    plannedMaterialCost += itemCost;
    if (comp.isIssued) {
      actualMaterialCost += itemCost;
    }
  });

  const totalPlannedCost = plannedLaborCost + plannedExternalCost + plannedMaterialCost;
  const totalActualCost = actualLaborCost + actualExternalCost + actualMaterialCost;
  const variance = totalActualCost - totalPlannedCost;

  return {
    plannedInternalLaborHours,
    actualInternalLaborHours,
    plannedLaborCost,
    actualLaborCost,
    plannedExternalCost,
    actualExternalCost,
    plannedMaterialCost,
    actualMaterialCost,
    totalPlannedCost,
    totalActualCost,
    variance
  };
};

export const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'Urgent':
      return { label: 'Urgent (L1)', color: 'crimson', bg: '#fee2e2', text: '#991b1b', border: '#f87171' };
    case 'High':
      return { label: 'High (L2)', color: 'amber', bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
    case 'Medium':
      return { label: 'Medium (L3)', color: 'blue', bg: '#e0f2fe', text: '#075985', border: '#7dd3fc' };
    case 'Low':
    default:
      return { label: 'Low (L4)', color: 'emerald', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
  }
};

export const getStatusBadge = (status) => {
  switch (status) {
    case 'CRTD':
      return { code: 'CRTD', label: 'Created / Unreleased', color: 'slate', bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
    case 'REL':
      return { code: 'REL', label: 'Released (Execution Ready)', color: 'blue', bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
    case 'PCNF':
      return { code: 'PCNF', label: 'Partially Confirmed', color: 'indigo', bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc' };
    case 'CNF':
      return { code: 'CNF', label: 'Fully Confirmed', color: 'teal', bg: '#ccfbf1', text: '#115e59', border: '#5eead4' };
    case 'TECO':
      return { code: 'TECO', label: 'Technically Completed', color: 'emerald', bg: '#dcfce7', text: '#166534', border: '#86efac' };
    case 'CLSD':
      return { code: 'CLSD', label: 'Closed / Settled', color: 'gray', bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    default:
      return { code: status, label: status, color: 'slate', bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
  }
};

export const getOrderTypeInfo = (type) => {
  switch (type) {
    case 'PM01':
      return { code: 'PM01', name: 'Corrective Maintenance', short: 'Corrective', color: '#2563eb' };
    case 'PM02':
      return { code: 'PM02', name: 'Preventive Maintenance', short: 'Preventive', color: '#059669' };
    case 'PM03':
      return { code: 'PM03', name: 'Breakdown Maintenance', short: 'Breakdown', color: '#dc2626' };
    case 'PM04':
      return { code: 'PM04', name: 'Compliance & Calibration', short: 'Compliance', color: '#7c3aed' };
    default:
      return { code: type, name: type, short: type, color: '#475569' };
  }
};

export const getEquipmentDetails = (eqId) => {
  const eq = EQUIPMENT_LIST.find((e) => e.id === eqId);
  if (!eq) return null;
  const fl = FUNCTIONAL_LOCATIONS.find((f) => f.id === eq.functionalLocationId);
  return {
    ...eq,
    functionalLocation: fl
  };
};

export const generateDatesForPriority = (priority) => {
  const now = new Date();
  const start = new Date(now);
  const finish = new Date(now);

  if (priority === 'Urgent') {
    start.setMinutes(start.getMinutes() + 15);
    finish.setHours(finish.getHours() + 8);
  } else if (priority === 'High') {
    start.setDate(start.getDate() + 1);
    start.setHours(8, 0, 0, 0);
    finish.setDate(start.getDate() + 1);
    finish.setHours(18, 0, 0, 0);
  } else if (priority === 'Medium') {
    start.setDate(start.getDate() + 2);
    start.setHours(8, 0, 0, 0);
    finish.setDate(start.getDate() + 4);
    finish.setHours(17, 0, 0, 0);
  } else {
    start.setDate(start.getDate() + 5);
    start.setHours(8, 0, 0, 0);
    finish.setDate(start.getDate() + 12);
    finish.setHours(17, 0, 0, 0);
  }

  const toInputFormat = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return {
    startDate: toInputFormat(start),
    finishDate: toInputFormat(finish)
  };
};
