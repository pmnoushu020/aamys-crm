import React, { useState } from 'react';
import { 
  BellRing, 
  PlusCircle, 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  Search, 
  Layers, 
  X, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Trash2, 
  UserCheck, 
  ClipboardList
} from 'lucide-react';
import { 
  EQUIPMENT_LIST, 
  FUNCTIONAL_LOCATIONS, 
  CATALOG_PROFILES 
} from '../data/mockMasterData';
import { 
  formatCurrency, 
  formatDate, 
  getPriorityBadge, 
  getNotificationStatusBadge 
} from '../utils/pmUtils';

export default function NotificationsView({ 
  notifications = [], 
  onConvertNotification, 
  onAddNotification,
  onUpdateNotification
}) {
  // Navigation & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, breakdown, pending_supv, approved, order_assigned

  // Modals State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [workbenchTab, setWorkbenchTab] = useState('overview'); // overview, catalog, tasks, supervision

  // =========================================================================
  // IW21 Multi-Step Creation Wizard State
  // Step 1: Header & Breakdown Info
  // Step 2: Catalog Profile & Cost Entry
  // Step 3: Notification Tasks
  // Step 4: Supervision & Approval
  // =========================================================================
  const [wizardStep, setWizardStep] = useState(1);

  // Step 1 Form Data
  const [notifType, setNotifType] = useState('M2'); // M1, M2, M3
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState('EQ-100421');
  const [functionalLocationId, setFunctionalLocationId] = useState('FL-100-PUMP-01');
  const [priority, setPriority] = useState('High');
  const [reportedBy, setReportedBy] = useState('Wolfgang Meyer (Technician #441)');
  const [breakdown, setBreakdown] = useState(true);
  const [breakdownStart, setBreakdownStart] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [breakdownPoint, setBreakdownPoint] = useState('Drive-End Mechanical Seal Gland & Bearing Pedestal');

  // Step 2 Form Data (Catalog Profile & Items with Cost)
  const [catalogProfileId, setCatalogProfileId] = useState('CP-PUMP');
  const [items, setItems] = useState([
    {
      itemNo: '0010',
      objectPartCode: 'B-PMP-01',
      objectPartText: 'Mechanical Seal Cartridge',
      damageCode: 'C-DMG-01',
      damageText: 'Fluid / Slurry Leakage from Seal Gland',
      causeCode: '5-CAU-01',
      causeText: 'Particulate Ingress / Slurry Abrasion',
      cost: 640.00,
      notes: 'Slurry leakage observed during morning inspection'
    }
  ]);
  // Temp inputs for adding item in Step 2
  const [tempItemPart, setTempItemPart] = useState('');
  const [tempItemDamage, setTempItemDamage] = useState('');
  const [tempItemCause, setTempItemCause] = useState('');
  const [tempItemCost, setTempItemCost] = useState('');
  const [tempItemNotes, setTempItemNotes] = useState('');

  // Step 3 Form Data (Tasks)
  const [tasks, setTasks] = useState(() => [
    {
      taskNo: 'T01',
      taskCode: 'T-PMP-01',
      description: 'LOTO Isolation, pipe depressurization & chemical flush',
      assignedTo: 'Hans Gruber (Technician #302)',
      plannedStart: new Date().toISOString().slice(0, 10) + 'T09:00',
      plannedFinish: new Date().toISOString().slice(0, 10) + 'T11:00',
      status: 'Pending'
    }
  ]);
  // Temp inputs for adding task in Step 3
  const [tempTaskCode, setTempTaskCode] = useState('');
  const [tempTaskDesc, setTempTaskDesc] = useState('');
  const [tempTaskAssignee, setTempTaskAssignee] = useState('Hans Gruber (Technician #302)');
  const [tempTaskFinish, setTempTaskFinish] = useState('');

  // Step 4 Form Data (Supervision)
  const [supervisorName, setSupervisorName] = useState('Dieter Braun (Maintenance Supervisor)');
  const [supervisorDecision, setSupervisorDecision] = useState('Approved & Released for Work Order');
  const [supervisorComments, setSupervisorComments] = useState('Technical failure assessment verified. Estimated costs approved for scheduled repair.');

  // Inline forms for Workbench modal (IW22)
  const [wbItemPart, setWbItemPart] = useState('');
  const [wbItemDamage, setWbItemDamage] = useState('');
  const [wbItemCause, setWbItemCause] = useState('');
  const [wbItemCost, setWbItemCost] = useState('');
  const [wbItemNotes, setWbItemNotes] = useState('');

  const [wbTaskCode, setWbTaskCode] = useState('');
  const [wbTaskDesc, setWbTaskDesc] = useState('');
  const [wbTaskAssignee, setWbTaskAssignee] = useState('Alex Brandt (Lead Engineer)');
  const [wbTaskFinish, setWbTaskFinish] = useState('');

  const [wbSupvName, setWbSupvName] = useState('Dieter Braun (Maintenance Supervisor)');
  const [wbSupvDecision, setWbSupvDecision] = useState('Approved & Released for Work Order');
  const [wbSupvComments, setWbSupvComments] = useState('Approved under Plant Maintenance Operational Budget.');

  // =========================================================================
  // Equipment Selection & Auto-Fill
  // =========================================================================
  const handleEquipmentSelect = (eqId) => {
    setEquipmentId(eqId);
    const eq = EQUIPMENT_LIST.find((e) => e.id === eqId);
    if (eq) {
      if (eq.functionalLocationId) {
        setFunctionalLocationId(eq.functionalLocationId);
      }
      if (eq.catalogProfileId) {
        setCatalogProfileId(eq.catalogProfileId);
        // Pre-fill sensible default breakdown point based on equipment category
        if (eq.category?.includes('Rotary')) {
          setBreakdownPoint('Drive-End Mechanical Seal Gland & Bearing Pedestal');
        } else if (eq.category?.includes('Compressor')) {
          setBreakdownPoint('Stage 2 Suction / Discharge Valve Pocket');
        } else if (eq.category?.includes('Pressure')) {
          setBreakdownPoint('Safety Relief Valve Nozzle & Superheater Flange');
        } else if (eq.category?.includes('Switchgear')) {
          setBreakdownPoint('Vacuum Interrupter Contact Gland & SF6 Manometer');
        } else if (eq.category?.includes('Chiller')) {
          setBreakdownPoint('Evaporator Refrigerant Expansion Valve (TXV)');
        }
      }
    }
  };

  const currentProfile = CATALOG_PROFILES.find((p) => p.id === catalogProfileId) || CATALOG_PROFILES[0];

  // =========================================================================
  // Item Management (Step 2)
  // =========================================================================
  const handleAddItem = () => {
    if (!tempItemCost && !tempItemPart && !tempItemDamage) return;

    const partObj = currentProfile.objectParts.find((p) => p.code === tempItemPart) || currentProfile.objectParts[0];
    const dmgObj = currentProfile.damageCodes.find((d) => d.code === tempItemDamage) || currentProfile.damageCodes[0];
    const cauObj = currentProfile.causeCodes.find((c) => c.code === tempItemCause) || currentProfile.causeCodes[0];

    const nextItemNo = String((items.length + 1) * 10).padStart(4, '0');
    const newItem = {
      itemNo: nextItemNo,
      objectPartCode: partObj.code,
      objectPartText: partObj.text,
      damageCode: dmgObj.code,
      damageText: dmgObj.text,
      causeCode: cauObj.code,
      causeText: cauObj.text,
      cost: Number(tempItemCost) || 0,
      notes: tempItemNotes.trim() || 'Defect noted by technician'
    };

    setItems([...items, newItem]);
    setTempItemPart('');
    setTempItemDamage('');
    setTempItemCause('');
    setTempItemCost('');
    setTempItemNotes('');
  };

  const handleRemoveItem = (itemNo) => {
    setItems(items.filter((i) => i.itemNo !== itemNo));
  };

  const totalEstimatedCost = items.reduce((acc, cur) => acc + (Number(cur.cost) || 0), 0);

  // =========================================================================
  // Task Management (Step 3)
  // =========================================================================
  const handleAddTask = () => {
    if (!tempTaskDesc.trim() && !tempTaskCode) return;

    const taskObj = currentProfile.taskCodes.find((t) => t.code === tempTaskCode);
    const desc = tempTaskDesc.trim() || taskObj?.text || 'Standard Maintenance Task';
    const nextTaskNo = `T${String(tasks.length + 1).padStart(2, '0')}`;

    const newTask = {
      taskNo: nextTaskNo,
      taskCode: tempTaskCode || (taskObj?.code || 'T-GEN-01'),
      description: desc,
      assignedTo: tempTaskAssignee.trim() || 'Unassigned Technician',
      plannedStart: new Date().toISOString().slice(0, 16),
      plannedFinish: tempTaskFinish || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: 'Pending'
    };

    setTasks([...tasks, newTask]);
    setTempTaskCode('');
    setTempTaskDesc('');
    setTempTaskFinish('');
  };

  const handleRemoveTask = (taskNo) => {
    setTasks(tasks.filter((t) => t.taskNo !== taskNo));
  };

  // =========================================================================
  // Create Modal Submit (Technician Raise & Supervisor Sign-off)
  // =========================================================================
  const handleFinishIntake = (asSupervised = true, convertToOrder = false) => {
    if (!title.trim()) {
      alert('Please provide a malfunction title.');
      setWizardStep(1);
      return;
    }

    const notifNo = `NOTIF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalStatus = asSupervised ? 'APRV' : (items.length > 0 ? 'PNDG_SUPV' : 'OSNO');

    const newNotif = {
      notificationNo: notifNo,
      type: notifType,
      notificationType: notifType,
      equipmentId: equipmentId || null,
      functionalLocationId: functionalLocationId || null,
      title: title.trim(),
      description: description.trim() || title.trim(),
      priority,
      reportedBy: reportedBy.trim(),
      reportedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      breakdown,
      breakdownStart: breakdown ? breakdownStart : null,
      breakdownPoint: breakdown ? breakdownPoint.trim() : null,
      breakdownDurationHours: breakdown ? 2.5 : 0,
      catalogProfileId,
      items,
      totalEstimatedCost,
      tasks,
      supervisorSignOff: asSupervised ? {
        isSupervised: true,
        supervisorName: supervisorName.trim() || 'Plant Supervisor',
        decision: supervisorDecision,
        signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comments: supervisorComments.trim()
      } : {
        isSupervised: false,
        supervisorName: '',
        decision: 'Pending Supervisor Review',
        signedAt: null,
        comments: ''
      },
      status: finalStatus,
      orderId: null
    };

    onAddNotification(newNotif);
    setShowCreateModal(false);
    resetWizardForm();

    if (convertToOrder && onConvertNotification) {
      onConvertNotification(newNotif);
    }
  };

  const resetWizardForm = () => {
    setWizardStep(1);
    setTitle('');
    setDescription('');
    setBreakdown(true);
    setBreakdownPoint('Drive-End Mechanical Seal Gland & Bearing Pedestal');
    setItems([]);
    setTasks([]);
    setTempItemCost('');
    setTempItemNotes('');
  };

  // =========================================================================
  // Workbench Modal Actions (IW22 Updates)
  // =========================================================================
  const handleWbAddItem = () => {
    if (!selectedNotif) return;
    const prof = CATALOG_PROFILES.find((p) => p.id === selectedNotif.catalogProfileId) || CATALOG_PROFILES[0];
    const partObj = prof.objectParts.find((p) => p.code === wbItemPart) || prof.objectParts[0];
    const dmgObj = prof.damageCodes.find((d) => d.code === wbItemDamage) || prof.damageCodes[0];
    const cauObj = prof.causeCodes.find((c) => c.code === wbItemCause) || prof.causeCodes[0];

    const currentItems = selectedNotif.items || [];
    const nextItemNo = String((currentItems.length + 1) * 10).padStart(4, '0');
    const newItem = {
      itemNo: nextItemNo,
      objectPartCode: partObj.code,
      objectPartText: partObj.text,
      damageCode: dmgObj.code,
      damageText: dmgObj.text,
      causeCode: cauObj.code,
      causeText: cauObj.text,
      cost: Number(wbItemCost) || 0,
      notes: wbItemNotes.trim() || 'Defect observed in inspection'
    };

    const updatedItems = [...currentItems, newItem];
    const newTotalCost = updatedItems.reduce((acc, c) => acc + (Number(c.cost) || 0), 0);
    const updated = {
      ...selectedNotif,
      items: updatedItems,
      totalEstimatedCost: newTotalCost
    };

    setSelectedNotif(updated);
    if (onUpdateNotification) onUpdateNotification(updated);
    setWbItemCost('');
    setWbItemNotes('');
  };

  const handleWbRemoveItem = (itemNo) => {
    if (!selectedNotif) return;
    const updatedItems = (selectedNotif.items || []).filter((i) => i.itemNo !== itemNo);
    const newTotalCost = updatedItems.reduce((acc, c) => acc + (Number(c.cost) || 0), 0);
    const updated = {
      ...selectedNotif,
      items: updatedItems,
      totalEstimatedCost: newTotalCost
    };
    setSelectedNotif(updated);
    if (onUpdateNotification) onUpdateNotification(updated);
  };

  const handleWbAddTask = () => {
    if (!selectedNotif) return;
    const prof = CATALOG_PROFILES.find((p) => p.id === selectedNotif.catalogProfileId) || CATALOG_PROFILES[0];
    const taskObj = prof.taskCodes.find((t) => t.code === wbTaskCode);
    const desc = wbTaskDesc.trim() || taskObj?.text || 'Maintenance Task';

    const currentTasks = selectedNotif.tasks || [];
    const nextTaskNo = `T${String(currentTasks.length + 1).padStart(2, '0')}`;
    const newTask = {
      taskNo: nextTaskNo,
      taskCode: wbTaskCode || (taskObj?.code || 'T-GEN-01'),
      description: desc,
      assignedTo: wbTaskAssignee.trim() || 'Technician',
      plannedStart: new Date().toISOString().slice(0, 16),
      plannedFinish: wbTaskFinish || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: 'Pending'
    };

    const updatedTasks = [...currentTasks, newTask];
    const updated = {
      ...selectedNotif,
      tasks: updatedTasks
    };

    setSelectedNotif(updated);
    if (onUpdateNotification) onUpdateNotification(updated);
    setWbTaskDesc('');
    setWbTaskCode('');
  };

  const handleWbToggleTaskStatus = (taskNo) => {
    if (!selectedNotif) return;
    const updatedTasks = (selectedNotif.tasks || []).map((t) => {
      if (t.taskNo === taskNo) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : (t.status === 'Pending' ? 'In Progress' : 'Completed');
        return { ...t, status: nextStatus };
      }
      return t;
    });
    const updated = { ...selectedNotif, tasks: updatedTasks };
    setSelectedNotif(updated);
    if (onUpdateNotification) onUpdateNotification(updated);
  };

  const handleWbSupervisorSignOff = () => {
    if (!selectedNotif) return;
    const updated = {
      ...selectedNotif,
      status: 'APRV',
      supervisorSignOff: {
        isSupervised: true,
        supervisorName: wbSupvName.trim() || 'Plant Supervisor',
        decision: wbSupvDecision,
        signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        comments: wbSupvComments.trim()
      }
    };
    setSelectedNotif(updated);
    if (onUpdateNotification) onUpdateNotification(updated);
  };

  // =========================================================================
  // Filtering & Metrics Calculations
  // =========================================================================
  const breakdownCount = notifications.filter((n) => n.breakdown).length;
  const pendingSupvCount = notifications.filter((n) => !n.supervisorSignOff?.isSupervised && !n.orderId).length;
  const approvedCount = notifications.filter((n) => n.status === 'APRV' || n.supervisorSignOff?.isSupervised).length;
  const totalDefectCost = notifications.reduce((acc, n) => {
    const cost = n.totalEstimatedCost || (n.items || []).reduce((sub, i) => sub + (Number(i.cost) || 0), 0);
    return acc + cost;
  }, 0);

  const filteredNotifs = notifications.filter((n) => {
    // Search query match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = (
        n.notificationNo.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.equipmentId?.toLowerCase().includes(q) ||
        n.functionalLocationId?.toLowerCase().includes(q) ||
        n.breakdownPoint?.toLowerCase().includes(q) ||
        n.reportedBy?.toLowerCase().includes(q)
      );
      if (!match) return false;
    }

    // Filter pills
    if (activeFilter === 'breakdown') return Boolean(n.breakdown);
    if (activeFilter === 'pending_supv') return !n.supervisorSignOff?.isSupervised && !n.orderId;
    if (activeFilter === 'approved') return n.status === 'APRV' || n.supervisorSignOff?.isSupervised;
    if (activeFilter === 'order_assigned') return Boolean(n.orderId);

    return true;
  });

  return (
    <div className="page-body">
      {/* Top Standard SAP PM Pipeline Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(16, 185, 129, 0.08))',
        border: '1px solid rgba(59, 130, 246, 0.28)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <BellRing size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                SAP Maintenance Notification Intake (IW21 / IW28)
              </span>
              <span className="mono-chip mono-chip-blue" style={{ fontSize: '0.72rem' }}>
                T-Code: IW21
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Standard industrial lifecycle: <strong>Technician Intake & Breakdown</strong> ➔ <strong>Catalog Profile & Cost Entry</strong> ➔ <strong>Action Tasks</strong> ➔ <strong>Supervision Sign-off & Order Conversion (IW31)</strong>.
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setWizardStep(1);
            setShowCreateModal(true);
          }}
          style={{ padding: '10px 18px', fontWeight: 700 }}
        >
          <PlusCircle size={16} />
          <span>Create Notification (IW21)</span>
        </button>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid-cards-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Total Notifications</span>
            <div className="summary-card-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
              <BellRing size={18} />
            </div>
          </div>
          <div className="summary-card-value">{notifications.length}</div>
          <div className="summary-card-subtext">Logged maintenance defects</div>
        </div>

        <div className="summary-card" style={{ borderColor: breakdownCount > 0 ? 'rgba(239, 68, 68, 0.4)' : undefined }}>
          <div className="summary-card-header">
            <span className="summary-card-title">Breakdown Halts</span>
            <div className="summary-card-icon" style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="summary-card-value" style={{ color: breakdownCount > 0 ? 'var(--danger)' : undefined }}>
            {breakdownCount}
          </div>
          <div className="summary-card-subtext">Assets tripped or halted</div>
        </div>

        <div className="summary-card" style={{ borderColor: pendingSupvCount > 0 ? 'rgba(245, 158, 11, 0.4)' : undefined }}>
          <div className="summary-card-header">
            <span className="summary-card-title">Pending Supervision</span>
            <div className="summary-card-icon" style={{ background: 'var(--warning-subtle)', color: 'var(--warning)' }}>
              <UserCheck size={18} />
            </div>
          </div>
          <div className="summary-card-value" style={{ color: pendingSupvCount > 0 ? 'var(--warning)' : undefined }}>
            {pendingSupvCount}
          </div>
          <div className="summary-card-subtext">Awaiting supervisor review</div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <span className="summary-card-title">Estimated Defect Costs</span>
            <div className="summary-card-icon" style={{ background: 'var(--success-subtle)', color: 'var(--success)' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="summary-card-value" style={{ color: 'var(--success)' }}>
            {formatCurrency(totalDefectCost)}
          </div>
          <div className="summary-card-subtext">Catalog profile cost estimates</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div className="search-box-wrap" style={{ flex: '1 1 320px', maxWidth: '480px' }}>
          <Search size={16} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search notification no, equipment, failure point, reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'breakdown', label: `Breakdowns (${breakdownCount})` },
            { id: 'pending_supv', label: `Pending Supervision (${pendingSupvCount})` },
            { id: 'approved', label: `Supervised (${approvedCount})` },
            { id: 'order_assigned', label: `Order Assigned (${notifications.filter((n) => n.orderId).length})` }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveFilter(btn.id)}
              className={`btn btn-sm ${activeFilter === btn.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Table Panel */}
      <div className="panel-card">
        <div className="panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="panel-title-wrap">
            <span className="panel-title">Active Maintenance Notification Records</span>
            <span className="mono-chip">{filteredNotifs.length} records</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click any row to open Notification Workbench (IW22)
          </div>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '135px' }}>Notification No</th>
                <th style={{ width: '140px' }}>Breakdown Point</th>
                <th>Malfunction Short Text</th>
                <th>Reference Asset / Location</th>
                <th style={{ width: '140px' }}>Catalog & Cost</th>
                <th style={{ width: '120px' }}>Tasks Status</th>
                <th style={{ width: '85px' }}>Priority</th>
                <th style={{ width: '130px' }}>Status</th>
                <th style={{ width: '180px', textAlign: 'right' }}>Workflow Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <BellRing size={34} style={{ opacity: 0.35 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {notifications.length === 0 ? 'No Maintenance Notifications Logged' : 'No Notifications Match Filters'}
                      </div>
                      <div style={{ fontSize: '0.84rem', maxWidth: '440px', lineHeight: 1.5 }}>
                        {notifications.length === 0 
                          ? 'Raise a new technician notification (IW21) to record equipment anomalies, breakdown start times, catalog defect costs, and tasks.'
                          : 'Try modifying your search or filter criteria.'}
                      </div>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => {
                          setWizardStep(1);
                          setShowCreateModal(true);
                        }} 
                        style={{ marginTop: '8px' }}
                      >
                        <PlusCircle size={14} />
                        <span>Create Notification (IW21)</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotifs.map((notif) => {
                  const pBadge = getPriorityBadge(notif.priority);
                  const sBadge = getNotificationStatusBadge(notif.status);
                  const hasOrder = Boolean(notif.orderId);
                  const isSupervised = notif.supervisorSignOff?.isSupervised || notif.status === 'APRV';
                  const itemsCount = (notif.items || []).length;
                  const tasksCount = (notif.tasks || []).length;
                  const completedTasksCount = (notif.tasks || []).filter((t) => t.status === 'Completed').length;
                  const notifCost = notif.totalEstimatedCost || (notif.items || []).reduce((acc, i) => acc + (Number(i.cost) || 0), 0);

                  return (
                    <tr 
                      key={notif.notificationNo}
                      onClick={() => {
                        setSelectedNotif(notif);
                        setWorkbenchTab('overview');
                      }}
                      style={{ cursor: 'pointer' }}
                      className="table-row-hoverable"
                    >
                      <td>
                        <div>
                          <span className="mono-chip" style={{ fontWeight: 700, color: '#2563eb' }}>
                            {notif.notificationNo}
                          </span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {notif.notificationType || notif.type || 'M1'} Defect
                          </div>
                        </div>
                      </td>

                      <td>
                        {notif.breakdown ? (
                          <div>
                            <span className="badge badge-urgent" style={{ fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={10} /> Breakdown Halt
                            </span>
                            {notif.breakdownPoint && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--danger)', fontWeight: 600, marginTop: '3px' }}>
                                📍 {notif.breakdownPoint.substring(0, 28)}...
                              </div>
                            )}
                            {notif.breakdownStart && (
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                {formatDate(notif.breakdownStart)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                              Operational
                            </span>
                            {notif.breakdownPoint && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                                📍 {notif.breakdownPoint.substring(0, 24)}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ maxWidth: '280px' }}>
                          <strong style={{ color: 'var(--text-main)', fontSize: '0.86rem' }}>
                            {notif.title}
                          </strong>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                            {notif.description?.substring(0, 75)}...
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>
                            {notif.equipmentId || 'No direct EQ link'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 500 }}>
                            {notif.functionalLocationId}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.86rem' }}>
                            {formatCurrency(notifCost)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {notif.catalogProfileId || 'Profile'}: {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {tasksCount > 0 ? `${completedTasksCount}/${tasksCount} Done` : 'No tasks'}
                          </div>
                          {tasksCount > 0 && (
                            <div style={{
                              width: '100%',
                              height: '5px',
                              background: '#e2e8f0',
                              borderRadius: '3px',
                              marginTop: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${(completedTasksCount / tasksCount) * 100}%`,
                                height: '100%',
                                background: completedTasksCount === tasksCount ? 'var(--success)' : 'var(--primary)',
                                borderRadius: '3px'
                              }} />
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <span className={`badge badge-${pBadge.color}`} style={{ fontSize: '0.7rem' }}>
                          {pBadge.label}
                        </span>
                      </td>

                      <td>
                        <span className={`mono-chip mono-chip-${sBadge.color}`} style={{ fontSize: '0.7rem' }}>
                          {sBadge.label}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        {hasOrder ? (
                          <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700 }}>
                            ✓ {notif.orderId}
                          </span>
                        ) : isSupervised ? (
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => onConvertNotification(notif)}
                            title="Convert approved notification into Scheduled Work Order (IW31)"
                            style={{ gap: '6px' }}
                          >
                            <Wrench size={13} />
                            <span>Convert to IW31</span>
                          </button>
                        ) : (
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setSelectedNotif(notif);
                              setWorkbenchTab('supervision');
                            }}
                            title="Open Supervisor Review & Sign-off"
                            style={{ gap: '6px' }}
                          >
                            <UserCheck size={13} color="var(--warning)" />
                            <span>Supervise</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================================
          MODAL 1: Create Maintenance Notification (IW21 Multi-Step Wizard)
          Step 1: Technician Intake (Equipment, FL, Breakdown Start Point)
          Step 2: Catalog Profile & Cost Entry
          Step 3: Notification Tasks
          Step 4: Supervision & Approval
          ===================================================================== */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div 
            className="modal-box" 
            style={{ maxWidth: '820px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BellRing size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Create Maintenance Notification (IW21)
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Standard Plant Maintenance Intake: Defect Breakdown ➔ Catalog Profile & Costs ➔ Tasks ➔ Supervision
                  </div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Wizard Progress Ribbon */}
            <div style={{ padding: '14px 28px', background: '#f8fafc', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="workflow-ribbon" style={{ margin: 0, padding: '4px' }}>
                <div 
                  className={`ribbon-step ${wizardStep === 1 ? 'current' : wizardStep > 1 ? 'done' : ''}`}
                  onClick={() => setWizardStep(1)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>1. Header & Breakdown</span>
                </div>
                <div className="ribbon-arrow">➔</div>

                <div 
                  className={`ribbon-step ${wizardStep === 2 ? 'current' : wizardStep > 2 ? 'done' : ''}`}
                  onClick={() => title.trim() && setWizardStep(2)}
                  style={{ cursor: title.trim() ? 'pointer' : 'not-allowed' }}
                >
                  <span>2. Catalog Profile & Costs (${totalEstimatedCost})</span>
                </div>
                <div className="ribbon-arrow">➔</div>

                <div 
                  className={`ribbon-step ${wizardStep === 3 ? 'current' : wizardStep > 3 ? 'done' : ''}`}
                  onClick={() => title.trim() && setWizardStep(3)}
                  style={{ cursor: title.trim() ? 'pointer' : 'not-allowed' }}
                >
                  <span>3. Action Tasks ({tasks.length})</span>
                </div>
                <div className="ribbon-arrow">➔</div>

                <div 
                  className={`ribbon-step ${wizardStep === 4 ? 'current' : ''}`}
                  onClick={() => title.trim() && setWizardStep(4)}
                  style={{ cursor: title.trim() ? 'pointer' : 'not-allowed' }}
                >
                  <span>4. Supervision & Approval</span>
                </div>
              </div>
            </div>

            {/* Modal Body: Wizard Step Forms */}
            <div className="modal-body" style={{ maxHeight: '65vh' }}>
              {/* STEP 1: Notification Header & Breakdown Details */}
              {wizardStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    background: 'var(--primary-subtle)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong>Step 1: Technician Defect Intake (IW21)</strong> — Specify the target equipment, functional location, and the precise physical point and timestamp where the breakdown started.
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Notification Type</span>
                      </label>
                      <select 
                        className="form-select"
                        value={notifType}
                        onChange={(e) => setNotifType(e.target.value)}
                      >
                        <option value="M2">M2 - Breakdown Halt (Malfunction)</option>
                        <option value="M1">M1 - Corrective Defect (Maintenance Request)</option>
                        <option value="M3">M3 - Activity / Inspection Report</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <span>Priority Level</span>
                      </label>
                      <select 
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="Urgent">Urgent (L1 - Production Stoppage)</option>
                        <option value="High">High (L2 - Within 24 Hours)</option>
                        <option value="Medium">Medium (L3 - Scheduled Plan)</option>
                        <option value="Low">Low (L4 - Backlog)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Malfunction Short Title <span className="required">*</span></span>
                    </label>
                    <input 
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. Centrifugal slurry pump severe seal gland leak & high bearing vibration"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Detailed Failure Symptoms & Observations</span>
                    </label>
                    <textarea 
                      className="form-textarea"
                      rows={3}
                      placeholder="Describe vibration thresholds, temperature readings, pressure drop, liquid ingress..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <span>Target Equipment Reference</span>
                      </label>
                      <select 
                        className="form-select"
                        value={equipmentId}
                        onChange={(e) => handleEquipmentSelect(e.target.value)}
                      >
                        {EQUIPMENT_LIST.map((eq) => (
                          <option key={eq.id} value={eq.id}>
                            {eq.id} — {eq.name}
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
                            {fl.id} — {fl.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* BREAKDOWN SECTION: Where Breakdown Started & Timestamp */}
                  <div style={{
                    background: breakdown ? 'var(--danger-subtle)' : '#f8fafc',
                    border: `1px solid ${breakdown ? 'rgba(239, 68, 68, 0.35)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'var(--transition-normal)'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={breakdown}
                        onChange={(e) => {
                          setBreakdown(e.target.checked);
                          if (e.target.checked) setNotifType('M2');
                        }}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: breakdown ? 'var(--danger)' : 'var(--text-main)' }}>
                        Breakdown Halt (Asset currently tripped or out of service)
                      </span>
                    </label>

                    {breakdown && (
                      <div className="form-grid-2" style={{ marginTop: '4px' }}>
                        <div className="form-group">
                          <label className="form-label" style={{ color: 'var(--danger)', fontWeight: 600 }}>
                            <span>Where Breakdown Started (Failure Point) <span className="required">*</span></span>
                          </label>
                          <input 
                            type="text"
                            required
                            className="form-input"
                            placeholder="e.g. Drive-End Mechanical Seal Gland & Bearing Pedestal"
                            value={breakdownPoint}
                            onChange={(e) => setBreakdownPoint(e.target.value)}
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Component or physical location where initial failure was detected
                          </span>
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ color: 'var(--danger)', fontWeight: 600 }}>
                            <span>Breakdown Start Timestamp <span className="required">*</span></span>
                          </label>
                          <input 
                            type="datetime-local"
                            required
                            className="form-input"
                            value={breakdownStart}
                            onChange={(e) => setBreakdownStart(e.target.value)}
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Time production was disrupted or tripped
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Reported By / Technician</span>
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={reportedBy}
                      onChange={(e) => setReportedBy(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Catalog Profile Items & Cost Entry */}
              {wizardStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    background: 'var(--success-subtle)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong>Step 2: Catalog Profile & Cost Entry</strong> — Select the appropriate Catalog Profile and add defect items (Object Part, Damage Code, Cause Code). Enter what is the estimated repair / replacement cost for each item.
                  </div>

                  {/* Catalog Profile Selector */}
                  <div className="form-group">
                    <label className="form-label">
                      <span>Catalog Profile Template</span>
                    </label>
                    <select 
                      className="form-select"
                      value={catalogProfileId}
                      onChange={(e) => setCatalogProfileId(e.target.value)}
                    >
                      {CATALOG_PROFILES.map((cp) => (
                        <option key={cp.id} value={cp.id}>
                          {cp.name} ({cp.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current Added Items Table */}
                  <div className="panel-card" style={{ margin: 0, boxShadow: 'none' }}>
                    <div className="panel-header" style={{ padding: '12px 18px', background: '#f8fafc' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        Catalog Profile Defect Items ({items.length})
                      </span>
                      <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                        Total Cost: {formatCurrency(totalEstimatedCost)}
                      </span>
                    </div>

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>Item</th>
                            <th>Object Part (B)</th>
                            <th>Damage Code (C)</th>
                            <th>Cause Code (5)</th>
                            <th style={{ width: '110px' }}>Est. Cost</th>
                            <th style={{ width: '50px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.length === 0 ? (
                            <tr>
                              <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                No catalog items added yet. Use the form below to enter the defect parts and their estimated repair costs.
                              </td>
                            </tr>
                          ) : (
                            items.map((it) => (
                              <tr key={it.itemNo}>
                                <td><span className="mono-chip">{it.itemNo}</span></td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>{it.objectPartText}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.objectPartCode}</div>
                                </td>
                                <td>
                                  <div style={{ color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 500 }}>{it.damageText}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.damageCode}</div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.82rem' }}>{it.causeText}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.causeCode}</div>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.86rem' }}>
                                    {formatCurrency(it.cost)}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <button 
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '4px', color: 'var(--danger)' }}
                                    onClick={() => handleRemoveItem(it.itemNo)}
                                    title="Remove item"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add New Catalog Item Card */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      + Add Catalog Profile Defect Item & Cost Entry
                    </div>

                    <div className="form-grid-3">
                      <div className="form-group">
                        <label className="form-label"><span>Object Part (Baugruppe)</span></label>
                        <select 
                          className="form-select"
                          value={tempItemPart}
                          onChange={(e) => setTempItemPart(e.target.value)}
                        >
                          <option value="">-- Select Object Part --</option>
                          {currentProfile.objectParts.map((p) => (
                            <option key={p.code} value={p.code}>{p.code}: {p.text}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Damage Code (Schadensbild)</span></label>
                        <select 
                          className="form-select"
                          value={tempItemDamage}
                          onChange={(e) => setTempItemDamage(e.target.value)}
                        >
                          <option value="">-- Select Damage Code --</option>
                          {currentProfile.damageCodes.map((d) => (
                            <option key={d.code} value={d.code}>{d.code}: {d.text}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Cause Code (Ursache)</span></label>
                        <select 
                          className="form-select"
                          value={tempItemCause}
                          onChange={(e) => setTempItemCause(e.target.value)}
                        >
                          <option value="">-- Select Cause Code --</option>
                          {currentProfile.causeCodes.map((c) => (
                            <option key={c.code} value={c.code}>{c.code}: {c.text}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">
                          <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                            Estimated Item Cost ($) <span className="required">*</span>
                          </span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }}>$</span>
                          <input 
                            type="number"
                            min="0"
                            step="10"
                            className="form-input"
                            style={{ paddingLeft: '28px', fontWeight: 700 }}
                            placeholder="e.g. 640.00"
                            value={tempItemCost}
                            onChange={(e) => setTempItemCost(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Technician Defect Notes</span></label>
                        <input 
                          type="text"
                          className="form-input"
                          placeholder="e.g. Seal face cracked from abrasive slurry particles"
                          value={tempItemNotes}
                          onChange={(e) => setTempItemNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleAddItem}
                        style={{ fontWeight: 600 }}
                      >
                        <PlusCircle size={14} />
                        <span>Add Item to Notification</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Notification Tasks */}
              {wizardStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    background: 'var(--warning-subtle)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong>Step 3: Notification Action Tasks (Catalog 2 - Maßnahmen)</strong> — Add the required technical tasks, safety mitigations (LOTO), and inspections that must be executed to resolve the notification.
                  </div>

                  {/* Tasks List */}
                  <div className="panel-card" style={{ margin: 0, boxShadow: 'none' }}>
                    <div className="panel-header" style={{ padding: '12px 18px', background: '#f8fafc' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        Planned Notification Action Tasks ({tasks.length})
                      </span>
                    </div>

                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>Task</th>
                            <th>Description</th>
                            <th>Assigned Technician</th>
                            <th style={{ width: '140px' }}>Target Finish</th>
                            <th style={{ width: '50px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.length === 0 ? (
                            <tr>
                              <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                No tasks added yet. Add tasks below to instruct the maintenance crew.
                              </td>
                            </tr>
                          ) : (
                            tasks.map((tsk) => (
                              <tr key={tsk.taskNo}>
                                <td><span className="mono-chip">{tsk.taskNo}</span></td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>{tsk.description}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code: {tsk.taskCode}</div>
                                </td>
                                <td><span style={{ fontSize: '0.82rem' }}>{tsk.assignedTo}</span></td>
                                <td><span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{formatDate(tsk.plannedFinish)}</span></td>
                                <td style={{ textAlign: 'center' }}>
                                  <button 
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '4px', color: 'var(--danger)' }}
                                    onClick={() => handleRemoveTask(tsk.taskNo)}
                                    title="Remove task"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add New Task Form */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      + Add Action Task
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label"><span>Standard Task Template (from Catalog)</span></label>
                        <select 
                          className="form-select"
                          value={tempTaskCode}
                          onChange={(e) => {
                            setTempTaskCode(e.target.value);
                            const t = currentProfile.taskCodes.find((tc) => tc.code === e.target.value);
                            if (t) setTempTaskDesc(t.text);
                          }}
                        >
                          <option value="">-- Choose Standard Task --</option>
                          {currentProfile.taskCodes.map((tc) => (
                            <option key={tc.code} value={tc.code}>{tc.code}: {tc.text}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Task Description</span></label>
                        <input 
                          type="text"
                          className="form-input"
                          placeholder="e.g. LOTO lockout, casing wash, and alignment test"
                          value={tempTaskDesc}
                          onChange={(e) => setTempTaskDesc(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label"><span>Assigned Technician / Lead</span></label>
                        <input 
                          type="text"
                          className="form-input"
                          value={tempTaskAssignee}
                          onChange={(e) => setTempTaskAssignee(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Target Finish Date & Time</span></label>
                        <input 
                          type="datetime-local"
                          className="form-input"
                          value={tempTaskFinish}
                          onChange={(e) => setTempTaskFinish(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button 
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleAddTask}
                        style={{ fontWeight: 600 }}
                      >
                        <PlusCircle size={14} />
                        <span>Add Task to Notification</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Supervision & Approval */}
              {wizardStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    background: 'var(--primary-subtle)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <strong>Step 4: Maintenance Supervision & Disposition</strong> — The maintenance supervisor reviews the defect details, breakdown halt conditions, catalog items, estimated cost, and planned tasks before authorizing execution.
                  </div>

                  {/* Summary Card for Supervisor */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {title}
                      </div>
                      <span className={`badge badge-${getPriorityBadge(priority).color}`}>
                        {priority} Priority
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '6px' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target Equipment</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>{equipmentId}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>{functionalLocationId}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Breakdown Status</div>
                        {breakdown ? (
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--danger)' }}>
                            🚨 Breakdown Halt
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Point: {breakdownPoint}</div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--success)' }}>
                            Operational / Degraded
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Catalog Items & Cost</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--success)' }}>
                          {formatCurrency(totalEstimatedCost)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          {items.length} items logged ({catalogProfileId})
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Action Tasks</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {tasks.length} planned tasks
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          Reported by: {reportedBy}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supervisor Sign-Off Form */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserCheck size={18} color="var(--primary)" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Supervisor Authorization Sign-Off
                      </span>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label"><span>Supervisor Name / Designation</span></label>
                        <input 
                          type="text"
                          className="form-input"
                          value={supervisorName}
                          onChange={(e) => setSupervisorName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Supervision Decision</span></label>
                        <select 
                          className="form-select"
                          value={supervisorDecision}
                          onChange={(e) => setSupervisorDecision(e.target.value)}
                        >
                          <option value="Approved & Released for Work Order">Approved & Released for Work Order (IW31)</option>
                          <option value="Approved for Direct Technical Execution">Approved for Direct Technical Execution</option>
                          <option value="Revision Requested">Revision Requested (More inspection needed)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label"><span>Supervisor Remarks & Engineering Instructions</span></label>
                      <textarea 
                        className="form-textarea"
                        rows={2}
                        value={supervisorComments}
                        onChange={(e) => setSupervisorComments(e.target.value)}
                        placeholder="e.g. Failure confirmed. Authorized for immediate overhaul under OpEx budget."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div>
                {wizardStep > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setWizardStep(wizardStep - 1)}
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                {wizardStep < 4 ? (
                  <>
                    <button 
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleFinishIntake(false, false)}
                      title="Save as Outstanding Notification (OSNO) without completing all steps"
                    >
                      Save Draft
                    </button>

                    <button 
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        if (wizardStep === 1 && !title.trim()) {
                          alert('Please enter a malfunction title.');
                          return;
                        }
                        setWizardStep(wizardStep + 1);
                      }}
                    >
                      <span>Proceed to {wizardStep === 1 ? 'Catalog Profile (Step 2)' : wizardStep === 2 ? 'Tasks (Step 3)' : 'Supervision (Step 4)'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleFinishIntake(true, false)}
                      style={{ fontWeight: 700 }}
                    >
                      <CheckCircle size={15} />
                      <span>Submit Supervised Notification (APRV)</span>
                    </button>

                    <button 
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleFinishIntake(true, true)}
                      style={{ fontWeight: 700 }}
                    >
                      <Wrench size={15} />
                      <span>Approve & Convert to Work Order (IW31)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: Notification Workbench & Detail Modal (IW22 / Display IW23)
          Tabs: Overview & Breakdown | Catalog & Costs | Tasks | Supervision
          ===================================================================== */}
      {selectedNotif && (
        <div className="modal-overlay" onClick={() => setSelectedNotif(null)}>
          <div 
            className="modal-box" 
            style={{ maxWidth: '860px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BellRing size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Notification Workbench: {selectedNotif.notificationNo}
                    </h3>
                    <span className={`mono-chip mono-chip-${getNotificationStatusBadge(selectedNotif.status).color}`}>
                      {getNotificationStatusBadge(selectedNotif.status).label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedNotif.equipmentId} • {selectedNotif.functionalLocationId}
                  </div>
                </div>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedNotif(null)}>
                <X size={16} />
              </button>
            </div>

            {/* Tabs Nav */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)', background: '#f8fafc', padding: '0 24px' }}>
              <div className="tabs-nav" style={{ margin: 0 }}>
                <button 
                  className={`tab-btn ${workbenchTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setWorkbenchTab('overview')}
                >
                  <FileText size={14} />
                  <span>Overview & Breakdown</span>
                </button>

                <button 
                  className={`tab-btn ${workbenchTab === 'catalog' ? 'active' : ''}`}
                  onClick={() => setWorkbenchTab('catalog')}
                >
                  <DollarSign size={14} />
                  <span>Catalog & Costs ({(selectedNotif.items || []).length})</span>
                </button>

                <button 
                  className={`tab-btn ${workbenchTab === 'tasks' ? 'active' : ''}`}
                  onClick={() => setWorkbenchTab('tasks')}
                >
                  <ClipboardList size={14} />
                  <span>Tasks ({(selectedNotif.tasks || []).length})</span>
                </button>

                <button 
                  className={`tab-btn ${workbenchTab === 'supervision' ? 'active' : ''}`}
                  onClick={() => setWorkbenchTab('supervision')}
                >
                  <ShieldCheck size={14} />
                  <span>Supervision & Approval</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ maxHeight: '65vh' }}>
              {/* TAB 1: Overview & Breakdown */}
              {workbenchTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{
                    background: selectedNotif.breakdown ? 'var(--danger-subtle)' : '#f8fafc',
                    border: `1px solid ${selectedNotif.breakdown ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Breakdown Status</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: selectedNotif.breakdown ? 'var(--danger)' : 'var(--success)' }}>
                        {selectedNotif.breakdown ? '🚨 Breakdown Halt Active' : '✅ Operational Maintenance'}
                      </div>
                      {selectedNotif.breakdownPoint && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '4px', fontWeight: 600 }}>
                          Failure Point: {selectedNotif.breakdownPoint}
                        </div>
                      )}
                    </div>

                    {selectedNotif.breakdownStart && (
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Breakdown Start Time</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {formatDate(selectedNotif.breakdownStart)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      {selectedNotif.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {selectedNotif.description}
                    </p>
                  </div>

                  <div className="grid-cards-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Equipment & Asset</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        {selectedNotif.equipmentId}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--primary)', marginTop: '2px' }}>
                        {selectedNotif.functionalLocationId}
                      </div>
                    </div>

                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reported By & Date</div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                        {selectedNotif.reportedBy}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {selectedNotif.reportedDate}
                      </div>
                    </div>

                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Priority & Order Link</div>
                      <div style={{ marginTop: '2px' }}>
                        <span className={`badge badge-${getPriorityBadge(selectedNotif.priority).color}`}>
                          {selectedNotif.priority}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {selectedNotif.orderId ? `Order: ${selectedNotif.orderId}` : 'No work order assigned yet'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Catalog Profile & Costs */}
              {workbenchTab === 'catalog' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Catalog Profile: {selectedNotif.catalogProfileId || 'Standard Profile'}
                      </span>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Item defect codification (Object Part, Damage Code, Cause Code, Estimated Cost)
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Estimated Defect Cost</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--success)' }}>
                        {formatCurrency(selectedNotif.totalEstimatedCost || (selectedNotif.items || []).reduce((acc, i) => acc + (Number(i.cost) || 0), 0))}
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="panel-card" style={{ margin: 0, boxShadow: 'none' }}>
                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>Item</th>
                            <th>Object Part</th>
                            <th>Damage / Defect</th>
                            <th>Cause Code</th>
                            <th style={{ width: '110px' }}>Cost</th>
                            <th style={{ width: '40px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!selectedNotif.items || selectedNotif.items.length === 0) ? (
                            <tr>
                              <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                No catalog profile items added to this notification.
                              </td>
                            </tr>
                          ) : (
                            selectedNotif.items.map((it) => (
                              <tr key={it.itemNo}>
                                <td><span className="mono-chip">{it.itemNo}</span></td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>{it.objectPartText}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.objectPartCode}</div>
                                </td>
                                <td>
                                  <div style={{ color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 500 }}>{it.damageText}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.damageCode}</div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.82rem' }}>{it.causeText}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{it.causeCode}</div>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.86rem' }}>
                                    {formatCurrency(it.cost)}
                                  </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    style={{ padding: '4px', color: 'var(--danger)' }}
                                    onClick={() => handleWbRemoveItem(it.itemNo)}
                                    title="Delete item"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add New Item Form inside Workbench */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      + Enter Additional Catalog Profile Item & Cost
                    </span>

                    {(() => {
                      const prof = CATALOG_PROFILES.find((p) => p.id === selectedNotif.catalogProfileId) || CATALOG_PROFILES[0];
                      return (
                        <>
                          <div className="form-grid-3">
                            <div className="form-group">
                              <label className="form-label"><span>Object Part</span></label>
                              <select 
                                className="form-select"
                                value={wbItemPart}
                                onChange={(e) => setWbItemPart(e.target.value)}
                              >
                                <option value="">-- Choose Part --</option>
                                {prof.objectParts.map((p) => (
                                  <option key={p.code} value={p.code}>{p.code}: {p.text}</option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label"><span>Damage Code</span></label>
                              <select 
                                className="form-select"
                                value={wbItemDamage}
                                onChange={(e) => setWbItemDamage(e.target.value)}
                              >
                                <option value="">-- Choose Damage --</option>
                                {prof.damageCodes.map((d) => (
                                  <option key={d.code} value={d.code}>{d.code}: {d.text}</option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label"><span>Cause Code</span></label>
                              <select 
                                className="form-select"
                                value={wbItemCause}
                                onChange={(e) => setWbItemCause(e.target.value)}
                              >
                                <option value="">-- Choose Cause --</option>
                                {prof.causeCodes.map((c) => (
                                  <option key={c.code} value={c.code}>{c.code}: {c.text}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="form-grid-2">
                            <div className="form-group">
                              <label className="form-label">
                                <span style={{ color: 'var(--success)', fontWeight: 700 }}>Cost ($)</span>
                              </label>
                              <input 
                                type="number"
                                className="form-input"
                                placeholder="e.g. 450.00"
                                value={wbItemCost}
                                onChange={(e) => setWbItemCost(e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label"><span>Item Notes</span></label>
                              <input 
                                type="text"
                                className="form-input"
                                placeholder="Failure remarks"
                                value={wbItemNotes}
                                onChange={(e) => setWbItemNotes(e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={handleWbAddItem}>
                              <PlusCircle size={14} />
                              <span>Add Item & Update Cost</span>
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* TAB 3: Tasks */}
              {workbenchTab === 'tasks' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Action Tasks & Mitigation Steps
                      </span>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Click a task status badge to toggle between Pending, In Progress, and Completed
                      </div>
                    </div>
                  </div>

                  <div className="panel-card" style={{ margin: 0, boxShadow: 'none' }}>
                    <div className="data-table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>Task</th>
                            <th>Description</th>
                            <th>Assigned Lead</th>
                            <th style={{ width: '130px' }}>Target Finish</th>
                            <th style={{ width: '110px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!selectedNotif.tasks || selectedNotif.tasks.length === 0) ? (
                            <tr>
                              <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                No tasks assigned to this notification yet.
                              </td>
                            </tr>
                          ) : (
                            selectedNotif.tasks.map((tsk) => (
                              <tr key={tsk.taskNo}>
                                <td><span className="mono-chip">{tsk.taskNo}</span></td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.82rem' }}>{tsk.description}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code: {tsk.taskCode}</div>
                                </td>
                                <td><span style={{ fontSize: '0.82rem' }}>{tsk.assignedTo}</span></td>
                                <td><span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{formatDate(tsk.plannedFinish)}</span></td>
                                <td>
                                  <button 
                                    className={`btn btn-sm ${tsk.status === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{
                                      fontSize: '0.72rem',
                                      padding: '4px 10px',
                                      background: tsk.status === 'Completed' ? 'var(--success)' : undefined,
                                      color: tsk.status === 'Completed' ? '#ffffff' : undefined
                                    }}
                                    onClick={() => handleWbToggleTaskStatus(tsk.taskNo)}
                                    title="Click to toggle status"
                                  >
                                    {tsk.status === 'Completed' ? '✓ Completed' : tsk.status || 'Pending'}
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add New Task Form inside Workbench */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      + Add New Task
                    </span>

                    {(() => {
                      const prof = CATALOG_PROFILES.find((p) => p.id === selectedNotif.catalogProfileId) || CATALOG_PROFILES[0];
                      return (
                        <>
                          <div className="form-grid-2">
                            <div className="form-group">
                              <label className="form-label"><span>Standard Task Template</span></label>
                              <select 
                                className="form-select"
                                value={wbTaskCode}
                                onChange={(e) => {
                                  setWbTaskCode(e.target.value);
                                  const t = prof.taskCodes.find((tc) => tc.code === e.target.value);
                                  if (t) setWbTaskDesc(t.text);
                                }}
                              >
                                <option value="">-- Choose Standard Task --</option>
                                {prof.taskCodes.map((tc) => (
                                  <option key={tc.code} value={tc.code}>{tc.code}: {tc.text}</option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group">
                              <label className="form-label"><span>Task Description</span></label>
                              <input 
                                type="text"
                                className="form-input"
                                placeholder="Task description"
                                value={wbTaskDesc}
                                onChange={(e) => setWbTaskDesc(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="form-grid-2">
                            <div className="form-group">
                              <label className="form-label"><span>Assigned Technician</span></label>
                              <input 
                                type="text"
                                className="form-input"
                                value={wbTaskAssignee}
                                onChange={(e) => setWbTaskAssignee(e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label"><span>Target Finish Date</span></label>
                              <input 
                                type="datetime-local"
                                className="form-input"
                                value={wbTaskFinish}
                                onChange={(e) => setWbTaskFinish(e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={handleWbAddTask}>
                              <PlusCircle size={14} />
                              <span>Add Task</span>
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* TAB 4: Supervision & Approval */}
              {workbenchTab === 'supervision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {selectedNotif.supervisorSignOff?.isSupervised ? (
                    <div style={{
                      background: 'var(--success-subtle)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '22px 26px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--success)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#065f46' }}>
                            Supervised & Approved
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#047857' }}>
                            Signed by {selectedNotif.supervisorSignOff.supervisorName} on {selectedNotif.supervisorSignOff.signedAt}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginTop: '4px' }}>
                        <strong>Decision:</strong> {selectedNotif.supervisorSignOff.decision}
                      </div>

                      {selectedNotif.supervisorSignOff.comments && (
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 14px',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic'
                        }}>
                          "{selectedNotif.supervisorSignOff.comments}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      background: 'var(--warning-subtle)',
                      border: '1px solid rgba(245, 158, 11, 0.35)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserCheck size={20} color="var(--warning)" />
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400e' }}>
                            Pending Supervisor Review
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
                            Review technician breakdown details, catalog defect items, estimated costs, and approve.
                          </div>
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label"><span>Supervisor Name</span></label>
                          <input 
                            type="text"
                            className="form-input"
                            value={wbSupvName}
                            onChange={(e) => setWbSupvName(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label"><span>Decision</span></label>
                          <select 
                            className="form-select"
                            value={wbSupvDecision}
                            onChange={(e) => setWbSupvDecision(e.target.value)}
                          >
                            <option value="Approved & Released for Work Order">Approved & Released for Work Order (IW31)</option>
                            <option value="Approved for Direct Technical Execution">Approved for Direct Technical Execution</option>
                            <option value="Revision Requested">Revision Requested</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label"><span>Supervisor Engineering Remarks</span></label>
                        <textarea 
                          className="form-textarea"
                          rows={2}
                          value={wbSupvComments}
                          onChange={(e) => setWbSupvComments(e.target.value)}
                          placeholder="e.g. Failure verified. Authorized for Work Order conversion."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button className="btn btn-primary" onClick={handleWbSupervisorSignOff}>
                          <CheckCircle size={15} />
                          <span>Sign & Approve Notification</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Conversion to Order (IW31) Section */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Order Conversion Pipeline (IW31)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Converts this approved notification, equipment, catalog items, and tasks into an active SAP Work Order.
                      </div>
                    </div>

                    {selectedNotif.orderId ? (
                      <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700, padding: '8px 14px' }}>
                        Order Assigned: {selectedNotif.orderId}
                      </span>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          const notifToConvert = selectedNotif;
                          setSelectedNotif(null);
                          if (onConvertNotification) {
                            onConvertNotification(notifToConvert);
                          }
                        }}
                        style={{ fontWeight: 700 }}
                      >
                        <Wrench size={15} />
                        <span>Convert to Work Order (IW31)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedNotif(null)}>
                Close
              </button>
              {!selectedNotif.orderId && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const notifToConvert = selectedNotif;
                    setSelectedNotif(null);
                    if (onConvertNotification) {
                      onConvertNotification(notifToConvert);
                    }
                  }}
                >
                  <Wrench size={14} />
                  <span>Convert to Order (IW31)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
