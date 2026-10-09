import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Check, 
  X, 
  Printer, 
  Search, 
  Plus, 
  Wrench, 
  Phone, 
  FileText, 
  CheckCircle, 
  CheckCircle2,
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  ClipboardList, 
  ExternalLink, 
  Clock, 
  UserCheck, 
  RotateCcw, 
  Edit3, 
  MoreHorizontal, 
  Info,
  DollarSign,
  Trash2,
  List,
  Monitor,
  Building2,
  Send
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
  // Primary view toggle: 'sap_gui' (matches user's screenshot) or 'list' (IW28 grid table)
  const [viewMode, setViewMode] = useState('sap_gui');

  // Currently selected notification or create mode
  const [selectedNotifId, setSelectedNotifId] = useState(() => {
    return notifications.length > 0 ? notifications[0].notificationNo : 'NEW';
  });
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Active SAP Tab (Screenshot tabs: Notification, Reference object, Malfunction, breakdown, Items, Tasks, Supervision)
  const [activeSapTab, setActiveSapTab] = useState('notification');

  // Search in list view
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Command Prompt Input (e.g. "IW21", "IW22", "IW28")
  const [commandText, setCommandText] = useState('IW21');

  // Form State for Active Notification
  const [notifNo, setNotifNo] = useState('%00000000001');
  const [notifType, setNotifType] = useState('M1'); // M1: Maintenance Request, M2: Breakdown, M3: Activity
  const [status, setStatus] = useState('OSNO');
  const [orderId, setOrderId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [equipmentId, setEquipmentId] = useState('EQ-100421');
  const [functionalLocationId, setFunctionalLocationId] = useState('FL-100-PUMP-01');
  const [assembly, setAssembly] = useState('Mechanical Seal Cartridge');
  const [plannerGroup, setPlannerGroup] = useState('MECH');
  const [mainWorkCtr, setMainWorkCtr] = useState('MECH_01');
  const [reportedBy, setReportedBy] = useState('Wolfgang Meyer (Operator #441)');
  const [reportedDate, setReportedDate] = useState(() => new Date().toISOString().replace('T', ' ').substring(0, 16));
  const [priority, setPriority] = useState('High');

  // Malfunction & Breakdown Data
  const [breakdown, setBreakdown] = useState(true);
  const [breakdownStart, setBreakdownStart] = useState(() => new Date().toISOString().slice(0, 16));
  const [breakdownPoint, setBreakdownPoint] = useState('Drive-End Mechanical Seal Gland & Bearing Pedestal');
  const [breakdownDurationHours, setBreakdownDurationHours] = useState(2.5);

  // Catalog Profile & Items
  const [catalogProfileId, setCatalogProfileId] = useState('CP-PUMP');
  const [items, setItems] = useState([]);
  const [tempItemPart, setTempItemPart] = useState('');
  const [tempItemDamage, setTempItemDamage] = useState('');
  const [tempItemCause, setTempItemCause] = useState('');
  const [tempItemCost, setTempItemCost] = useState('');
  const [tempItemNotes, setTempItemNotes] = useState('');

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [tempTaskCode, setTempTaskCode] = useState('');
  const [tempTaskDesc, setTempTaskDesc] = useState('');
  const [tempTaskAssignee, setTempTaskAssignee] = useState('Hans Gruber');
  const [tempTaskFinish, setTempTaskFinish] = useState('');

  // Supervision
  const [supervisorName, setSupervisorName] = useState('Dieter Braun (Maintenance Supervisor)');
  const [supervisorDecision, setSupervisorDecision] = useState('Approved & Released for Work Order');
  const [supervisorComments, setSupervisorComments] = useState('Defect verified. Authorized for Work Order conversion.');
  const [isSupervised, setIsSupervised] = useState(false);

  // Notification saved feedback toast
  const [actionNotice, setActionNotice] = useState(null);

  // Sync form when selectedNotifId changes
  useEffect(() => {
    if (selectedNotifId === 'NEW') {
      enterCreateMode();
    } else {
      const found = notifications.find((n) => n.notificationNo === selectedNotifId);
      if (found) {
        loadNotificationIntoForm(found);
      }
    }
  }, [selectedNotifId, notifications]);

  const loadNotificationIntoForm = (notif) => {
    setIsCreateMode(false);
    setNotifNo(notif.notificationNo);
    setNotifType(notif.notificationType || notif.type || 'M1');
    setStatus(notif.status || 'OSNO');
    setOrderId(notif.orderId || '');
    setTitle(notif.title || '');
    setDescription(notif.description || '');
    setEquipmentId(notif.equipmentId || 'EQ-100421');
    setFunctionalLocationId(notif.functionalLocationId || 'FL-100-PUMP-01');
    setAssembly(notif.assembly || 'Main Bearing & Seal Assembly');
    setPlannerGroup(notif.plannerGroup || 'MECH');
    setMainWorkCtr(notif.mainWorkCtr || 'MECH_01');
    setReportedBy(notif.reportedBy || 'Wolfgang Meyer');
    setReportedDate(notif.reportedDate || new Date().toISOString().replace('T', ' ').substring(0, 16));
    setPriority(notif.priority || 'High');
    setBreakdown(Boolean(notif.breakdown));
    setBreakdownStart(notif.breakdownStart || new Date().toISOString().slice(0, 16));
    setBreakdownPoint(notif.breakdownPoint || 'Drive-End Mechanical Seal Gland & Bearing Pedestal');
    setBreakdownDurationHours(notif.breakdownDurationHours || 2.5);
    setCatalogProfileId(notif.catalogProfileId || 'CP-PUMP');
    setItems(Array.isArray(notif.items) ? notif.items : []);
    setTasks(Array.isArray(notif.tasks) ? notif.tasks : []);
    setIsSupervised(Boolean(notif.supervisorSignOff?.isSupervised || notif.status === 'APRV'));
    setSupervisorName(notif.supervisorSignOff?.supervisorName || 'Dieter Braun (Maintenance Supervisor)');
    setSupervisorDecision(notif.supervisorSignOff?.decision || 'Approved & Released for Work Order');
    setSupervisorComments(notif.supervisorSignOff?.comments || 'Defect verified. Authorized for Work Order conversion.');
    setCommandText('IW22');
  };

  const enterCreateMode = () => {
    setIsCreateMode(true);
    setSelectedNotifId('NEW');
    setNotifNo(`%${Math.floor(10000000000 + Math.random() * 90000000000)}`);
    setNotifType('M1');
    setStatus('OSNO');
    setOrderId('');
    setTitle('Check Motor & Mechanical Rotary Gland Leakage');
    setDescription('Maintenance notification for testing purpose. Elevated vibration and slurry fluid weeping detected during morning shift inspection.');
    setEquipmentId('EQ-100421');
    setFunctionalLocationId('FL-100-PUMP-01');
    setAssembly('Mechanical Seal Gland Housing');
    setPlannerGroup('MECH');
    setMainWorkCtr('MECH_01');
    setReportedBy('Wolfgang Meyer (Operator #441)');
    setReportedDate(new Date().toISOString().replace('T', ' ').substring(0, 16));
    setPriority('High');
    setBreakdown(true);
    setBreakdownStart(new Date().toISOString().slice(0, 16));
    setBreakdownPoint('Drive-End Mechanical Seal Gland & Bearing Pedestal');
    setBreakdownDurationHours(2.5);
    setCatalogProfileId('CP-PUMP');
    setItems([
      {
        itemNo: '0010',
        objectPartCode: 'B-PMP-01',
        objectPartText: 'Mechanical Seal Cartridge',
        damageCode: 'C-DMG-01',
        damageText: 'Fluid / Slurry Leakage from Seal Gland',
        causeCode: '5-CAU-01',
        causeText: 'Particulate Ingress / Slurry Abrasion',
        cost: 640.00,
        notes: 'Abrasive particle ingress across primary dynamic sealing faces'
      }
    ]);
    setTasks([
      {
        taskNo: 'T01',
        taskCode: 'T-PMP-01',
        description: 'LOTO Isolation, pipe depressurization & chemical flush',
        assignedTo: 'Hans Gruber (Technician #302)',
        plannedStart: new Date().toISOString().slice(0, 16),
        plannedFinish: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
        status: 'Pending'
      }
    ]);
    setIsSupervised(false);
    setCommandText('IW21');
    setActiveSapTab('notification');
  };

  const currentProfile = CATALOG_PROFILES.find((p) => p.id === catalogProfileId) || CATALOG_PROFILES[0];
  const currentEquipment = EQUIPMENT_LIST.find((e) => e.id === equipmentId);
  const currentFuncLoc = FUNCTIONAL_LOCATIONS.find((f) => f.id === functionalLocationId);

  const handleEquipmentSelect = (eqId) => {
    setEquipmentId(eqId);
    const eq = EQUIPMENT_LIST.find((e) => e.id === eqId);
    if (eq) {
      if (eq.functionalLocationId) setFunctionalLocationId(eq.functionalLocationId);
      if (eq.catalogProfileId) setCatalogProfileId(eq.catalogProfileId);
      if (eq.workCenterId) setMainWorkCtr(eq.workCenterId);
    }
  };

  // Add Item
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
      notes: tempItemNotes.trim() || 'Defect observed by technician'
    };

    setItems([...items, newItem]);
    setTempItemPart('');
    setTempItemDamage('');
    setTempItemCause('');
    setTempItemCost('');
    setTempItemNotes('');
  };

  // Add Task
  const handleAddTask = () => {
    if (!tempTaskDesc.trim() && !tempTaskCode) return;
    const taskObj = currentProfile.taskCodes.find((t) => t.code === tempTaskCode);
    const desc = tempTaskDesc.trim() || taskObj?.text || 'Maintenance Task';
    const nextTaskNo = `T${String(tasks.length + 1).padStart(2, '0')}`;

    const newTask = {
      taskNo: nextTaskNo,
      taskCode: tempTaskCode || (taskObj?.code || 'T-GEN-01'),
      description: desc,
      assignedTo: tempTaskAssignee.trim() || 'Technician',
      plannedStart: new Date().toISOString().slice(0, 16),
      plannedFinish: tempTaskFinish || new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      status: 'Pending'
    };

    setTasks([...tasks, newTask]);
    setTempTaskCode('');
    setTempTaskDesc('');
    setTempTaskFinish('');
  };

  const totalEstimatedCost = items.reduce((acc, cur) => acc + (Number(cur.cost) || 0), 0);

  // Save / Post Notification (IW21 / IW22)
  const handleSaveNotification = (newStatusOverride = null) => {
    if (!title.trim()) {
      alert('Please enter a description for the notification.');
      setActiveSapTab('notification');
      return;
    }

    const currentStatus = newStatusOverride || (isSupervised ? 'APRV' : status);
    const assignedNo = isCreateMode
      ? `NOTIF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      : notifNo;

    const notifRecord = {
      notificationNo: assignedNo,
      type: notifType,
      notificationType: notifType,
      status: currentStatus,
      orderId: orderId || null,
      title: title.trim(),
      description: description.trim() || title.trim(),
      equipmentId: equipmentId || null,
      functionalLocationId: functionalLocationId || null,
      assembly: assembly.trim(),
      plannerGroup: plannerGroup.trim(),
      mainWorkCtr: mainWorkCtr.trim(),
      reportedBy: reportedBy.trim(),
      reportedDate: reportedDate,
      priority,
      breakdown,
      breakdownStart: breakdown ? breakdownStart : null,
      breakdownPoint: breakdown ? breakdownPoint.trim() : null,
      breakdownDurationHours: breakdown ? Number(breakdownDurationHours) : 0,
      catalogProfileId,
      items,
      totalEstimatedCost,
      tasks,
      supervisorSignOff: {
        isSupervised,
        supervisorName: supervisorName.trim(),
        decision: supervisorDecision,
        signedAt: isSupervised ? new Date().toISOString().replace('T', ' ').substring(0, 16) : null,
        comments: supervisorComments.trim()
      }
    };

    if (isCreateMode) {
      onAddNotification(notifRecord);
      setSelectedNotifId(assignedNo);
      setIsCreateMode(false);
      showNotice(`Notification ${assignedNo} created successfully (IW21)!`);
    } else {
      if (onUpdateNotification) onUpdateNotification(notifRecord);
      showNotice(`Notification ${assignedNo} saved successfully (IW22)!`);
    }
  };

  const handlePutInProcess = () => {
    setStatus('NOPR');
    handleSaveNotification('NOPR');
  };

  const handleCompleteNotification = () => {
    setStatus('NOCO');
    handleSaveNotification('NOCO');
  };

  const handleSupervisorApproval = () => {
    setIsSupervised(true);
    setStatus('APRV');
    handleSaveNotification('APRV');
  };

  const handleConvertToWorkOrder = () => {
    const currentNotif = {
      notificationNo: notifNo,
      type: notifType,
      notificationType: notifType,
      title,
      description,
      equipmentId,
      functionalLocationId,
      priority,
      breakdown,
      breakdownStart,
      breakdownPoint,
      catalogProfileId,
      items,
      totalEstimatedCost,
      tasks
    };
    if (onConvertNotification) {
      onConvertNotification(currentNotif);
    }
  };

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = commandText.trim().toUpperCase();
    if (cmd === 'IW21') {
      enterCreateMode();
      setViewMode('sap_gui');
    } else if (cmd === 'IW28' || cmd === 'IW29') {
      setViewMode('list');
    } else if (cmd === 'IW31') {
      handleConvertToWorkOrder();
    } else {
      showNotice(`T-Code ${cmd} recognized.`);
    }
  };

  // Filtered notifications for list view
  const filteredNotifs = notifications.filter((n) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match = (
        n.notificationNo.toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q) ||
        n.equipmentId?.toLowerCase().includes(q) ||
        n.functionalLocationId?.toLowerCase().includes(q) ||
        n.reportedBy?.toLowerCase().includes(q)
      );
      if (!match) return false;
    }
    if (activeFilter === 'breakdown') return Boolean(n.breakdown);
    if (activeFilter === 'pending_supv') return !n.supervisorSignOff?.isSupervised && !n.orderId;
    if (activeFilter === 'approved') return n.status === 'APRV' || n.supervisorSignOff?.isSupervised;
    return true;
  });

  return (
    <div className="page-body" style={{ padding: '16px 20px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Toast Notice */}
      {actionNotice && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: '#064e3b',
          color: '#ffffff',
          border: '1px solid #10b981',
          borderRadius: '4px',
          padding: '10px 18px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          ✓ {actionNotice}
        </div>
      )}

      {/* View Switcher Ribbon & Record Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '12px'
      }}>
        {/* Record Quick Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Active Notification Record:
          </span>
          <select 
            className="form-select"
            style={{ width: '280px', height: '32px', fontSize: '0.82rem', padding: '2px 8px' }}
            value={isCreateMode ? 'NEW' : notifNo}
            onChange={(e) => {
              if (e.target.value === 'NEW') {
                enterCreateMode();
              } else {
                setSelectedNotifId(e.target.value);
              }
            }}
          >
            {notifications.map((n) => (
              <option key={n.notificationNo} value={n.notificationNo}>
                {n.notificationNo} — {n.title?.substring(0, 32)}...
              </option>
            ))}
            <option value="NEW">+ Create New (IW21 Intake)</option>
          </select>

          <button 
            className="btn btn-primary btn-sm"
            onClick={enterCreateMode}
            style={{ gap: '6px', height: '32px' }}
          >
            <Plus size={14} />
            <span>New (IW21)</span>
          </button>
        </div>

        {/* View Mode: SAP GUI Screen vs IW28 List */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className={`btn btn-sm ${viewMode === 'sap_gui' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('sap_gui')}
            style={{ gap: '6px', height: '32px', fontWeight: 600 }}
          >
            <Monitor size={14} />
            <span>SAP PM Screen (IW21 / IW22)</span>
          </button>

          <button 
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('list')}
            style={{ gap: '6px', height: '32px', fontWeight: 600 }}
          >
            <List size={14} />
            <span>Notification List (IW28)</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          PRIMARY VIEW: Authentic SAP PM Screen (Matches Screenshots Exactly)
          ===================================================================== */}
      {viewMode === 'sap_gui' ? (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #d1d9e2',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {/* SAP Top Command & System Bar (Header bar in screenshot #2) */}
          <div style={{
            background: '#eef2f6',
            borderBottom: '1px solid #c9d3df',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {/* T-Code Command Input Box */}
            <form onSubmit={handleCommandSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #a8b5c4', borderRadius: '2px', padding: '1px 6px' }}>
                <input 
                  type="text"
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  style={{
                    width: '70px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    color: '#0f172a'
                  }}
                  placeholder="IW21"
                />
                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex' }} title="Execute T-Code">
                  <Check size={13} color="#16a34a" />
                </button>
              </div>

              {/* SAP Standard System Toolbar Icons (Floppy Save, Back, Exit, Cancel, Print) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', borderLeft: '1px solid #cbd5e1', paddingLeft: '8px', marginLeft: '4px' }}>
                <button 
                  type="button"
                  onClick={() => handleSaveNotification()}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '2px' }}
                  title="Save Notification (Ctrl+S)"
                >
                  <Save size={15} color="#2563eb" />
                </button>

                <button 
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '2px' }}
                  title="Back (F3)"
                >
                  <ArrowLeft size={15} color="#16a34a" />
                </button>

                <button 
                  type="button"
                  onClick={() => enterCreateMode()}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '2px' }}
                  title="Create New (IW21)"
                >
                  <Plus size={15} color="#ca8a04" />
                </button>

                <button 
                  type="button"
                  onClick={() => window.print()}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: '2px' }}
                  title="Print Notification"
                >
                  <Printer size={15} color="#475569" />
                </button>
              </div>
            </form>

            {/* Top Toolbar Action Links (Matches Screenshot #2) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#1e40af' }}>
              <span 
                style={{ cursor: 'pointer', textDecoration: 'none', fontWeight: 500 }}
                onClick={() => setActiveSapTab('reference')}
              >
                Display object
              </span>
              <span>•</span>
              <span 
                style={{ cursor: 'pointer', fontWeight: 500 }}
                onClick={handlePutInProcess}
              >
                Put in process
              </span>
              <span>•</span>
              <span 
                style={{ cursor: 'pointer', fontWeight: 500 }}
                onClick={handleCompleteNotification}
              >
                Complete...
              </span>
              <span>•</span>
              <span 
                style={{ cursor: 'pointer', fontWeight: 700, color: '#2563eb' }}
                onClick={handleConvertToWorkOrder}
                title="Generate Work Order IW31 directly from this notification"
              >
                Convert to Order (IW31)
              </span>
              <span>•</span>
              <span 
                style={{ cursor: 'pointer', color: '#dc2626', fontWeight: 500 }}
                onClick={() => setViewMode('list')}
              >
                Exit
              </span>
            </div>
          </div>

          {/* SAP Screen Title Bar (Matches Screenshot #1 & #2 Title) */}
          <div style={{
            background: '#ffffff',
            padding: '12px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#1e3a8a',
                letterSpacing: '-0.01em',
                margin: 0
              }}>
                {isCreateMode 
                  ? `Create PM Notification: Maintenance Request (${commandText || 'IW21'})`
                  : `Change PM Notification: ${notifNo} (IW22)`}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`mono-chip mono-chip-${getNotificationStatusBadge(status).color}`} style={{ fontWeight: 700 }}>
                {getNotificationStatusBadge(status).label}
              </span>
              {orderId && (
                <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700 }}>
                  Order: {orderId}
                </span>
              )}
            </div>
          </div>

          {/* SAP Header Fields Section (Matches Top section of Screenshot #1 & #2) */}
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #dbe2ea',
            padding: '14px 20px',
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(220px, 320px) minmax(200px, 260px)',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Notification No & Short Text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155', minWidth: '85px' }}>
                Notification:
              </span>
              <input 
                type="text"
                readOnly
                value={notifNo}
                style={{
                  width: '135px',
                  height: '28px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '2px 8px',
                  fontSize: '0.84rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#1e293b'
                }}
              />
              <select 
                value={notifType}
                onChange={(e) => setNotifType(e.target.value)}
                style={{
                  height: '28px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  padding: '2px 6px'
                }}
              >
                <option value="M1">M1 Maintenance Request</option>
                <option value="M2">M2 Breakdown Halt</option>
                <option value="M3">M3 Activity Report</option>
              </select>
            </div>

            {/* Notific. Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                Notific. Status:
              </span>
              <input 
                type="text"
                readOnly
                value={status}
                style={{
                  width: '90px',
                  height: '28px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '2px 8px',
                  fontSize: '0.84rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#2563eb'
                }}
              />
              <span 
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '2px',
                  background: '#e2e8f0',
                  color: '#3b82f6',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontStyle: 'italic',
                  cursor: 'pointer'
                }}
                title="System Status Details (OSNO / APRV / NOCO)"
              >
                i
              </span>
            </div>

            {/* Order Field */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                Order:
              </span>
              <input 
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="[ None ]"
                style={{
                  width: '120px',
                  height: '28px',
                  background: orderId ? '#ecfdf5' : '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '2px 8px',
                  fontSize: '0.84rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: orderId ? '#065f46' : '#64748b'
                }}
              />
              <button 
                type="button" 
                onClick={handleConvertToWorkOrder}
                style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '3px 6px', cursor: 'pointer' }}
                title="Assign or Generate Work Order IW31"
              >
                <Wrench size={13} color="#2563eb" />
              </button>
            </div>
          </div>

          {/* SAP Tab Strip Bar (Matches Screenshot #1 & #2 exactly!) */}
          <div style={{
            background: '#eef2f6',
            borderBottom: '2px solid #2563eb',
            padding: '4px 14px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            overflowX: 'auto'
          }}>
            {[
              { id: 'notification', label: 'Notification' },
              { id: 'reference', label: 'Reference object' },
              { id: 'malfunction', label: 'Malfunction, breakdown' },
              { id: 'items', label: `Items (${items.length})` },
              { id: 'tasks', label: `Tasks (${tasks.length})` },
              { id: 'supervision', label: 'Supervision / Activities' }
            ].map((tab) => {
              const isActive = activeSapTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSapTab(tab.id)}
                  style={{
                    background: isActive ? '#ffffff' : '#dbe3ed',
                    color: isActive ? '#1e3a8a' : '#475569',
                    border: '1px solid #cbd5e1',
                    borderBottom: isActive ? '2px solid #ffffff' : '1px solid #cbd5e1',
                    borderRadius: '4px 4px 0 0',
                    padding: '7px 18px',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    marginBottom: '-2px',
                    zIndex: isActive ? 2 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Two-Column SAP Layout: Main Form Area + Right Side Action Box */}
          <div style={{ display: 'flex', minHeight: '520px', background: '#ffffff' }}>
            {/* MAIN TAB CONTENT AREA */}
            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
              {/* TAB 1: NOTIFICATION (Main View matching Screenshot #1 & #2!) */}
              {activeSapTab === 'notification' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* SAP Group Box: Reference object (Screenshot highlight!) */}
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '16px 20px',
                    background: '#ffffff',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '14px',
                      background: '#ffffff',
                      padding: '0 8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#1e3a8a'
                    }}>
                      Reference Object
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                      {/* Functional Location (Highlighted in green box in Screenshot #1!) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '130px', fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
                          Functional loc.:
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <input 
                            type="text"
                            value={functionalLocationId}
                            onChange={(e) => setFunctionalLocationId(e.target.value)}
                            style={{
                              width: '210px',
                              height: '28px',
                              background: '#ffffff',
                              border: '2px solid #22c55e', // Highlighted green like user screenshot #1!
                              borderRadius: '2px',
                              padding: '2px 8px',
                              fontSize: '0.84rem',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: '#0f172a'
                            }}
                          />
                          <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 500 }}>
                            {currentFuncLoc?.name || 'Plant Pumping Station Section'}
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '2px',
                            fontSize: '0.72rem',
                            color: '#64748b'
                          }}>
                            🏢 Structure
                          </span>
                        </div>
                      </div>

                      {/* Equipment */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '130px', fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
                          Equipment:
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <select 
                            value={equipmentId}
                            onChange={(e) => handleEquipmentSelect(e.target.value)}
                            style={{
                              width: '210px',
                              height: '28px',
                              background: '#ffffff',
                              border: '1px solid #aeb8c3',
                              borderRadius: '2px',
                              padding: '2px 8px',
                              fontSize: '0.84rem',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              color: '#0f172a'
                            }}
                          >
                            {EQUIPMENT_LIST.map((eq) => (
                              <option key={eq.id} value={eq.id}>{eq.id}</option>
                            ))}
                          </select>
                          <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 500 }}>
                            {currentEquipment?.name || 'Conveyor Line / Pump'}
                          </span>
                          <span style={{
                            padding: '2px 6px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '2px',
                            fontSize: '0.72rem',
                            color: '#64748b'
                          }}>
                            ⚙ Asset
                          </span>
                        </div>
                      </div>

                      {/* Assembly */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '130px', fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
                          Assembly:
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <input 
                            type="text"
                            value={assembly}
                            onChange={(e) => setAssembly(e.target.value)}
                            style={{
                              width: '210px',
                              height: '28px',
                              background: '#ffffff',
                              border: '1px solid #aeb8c3',
                              borderRadius: '2px',
                              padding: '2px 8px',
                              fontSize: '0.84rem',
                              color: '#0f172a'
                            }}
                          />
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Sub-assembly component unit
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SAP Group Box: Subject (Matches Screenshot #2 Subject box!) */}
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '16px 20px',
                    background: '#ffffff',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '14px',
                      background: '#ffffff',
                      padding: '0 8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#1e3a8a'
                    }}>
                      Subject
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                      {/* Coding & Description line */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '110px', fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
                          Coding:
                        </label>
                        <input 
                          type="text" 
                          value={notifType} 
                          readOnly 
                          style={{ width: '50px', height: '28px', background: '#f1f5f9', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700, borderRadius: '2px' }} 
                        />
                        <input 
                          type="text" 
                          value={notifType === 'M2' ? 'Breakdown' : notifType === 'M1' ? 'Maintenance Request' : 'Activity'} 
                          readOnly 
                          style={{ width: '160px', height: '28px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.82rem', borderRadius: '2px' }} 
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '110px', fontSize: '0.84rem', color: '#334155', fontWeight: 600 }}>
                          Description:
                        </label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Short description of maintenance defect or request"
                          style={{
                            flex: 1,
                            height: '28px',
                            background: '#ffffff',
                            border: '1px solid #aeb8c3',
                            borderRadius: '2px',
                            padding: '2px 10px',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            color: '#0f172a'
                          }}
                        />
                      </div>

                      {/* Multi-line SAP Text Editor Box (Exact match to Screenshot #2!) */}
                      <div style={{ marginTop: '4px' }}>
                        <textarea 
                          rows={5}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Maintenance notification for the testing purpose. Detailed description of symptoms..."
                          style={{
                            width: '100%',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            border: '1px solid #aeb8c3',
                            borderRadius: '2px',
                            padding: '10px 12px',
                            background: '#ffffff',
                            color: '#0f172a'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SAP Group Box: Responsibilities (Matches Screenshot #1 bottom box) */}
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '16px 20px',
                    background: '#ffffff',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '14px',
                      background: '#ffffff',
                      padding: '0 8px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#1e3a8a'
                    }}>
                      Responsibilities
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '110px', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                          Planner group:
                        </label>
                        <input 
                          type="text"
                          value={plannerGroup}
                          onChange={(e) => setPlannerGroup(e.target.value)}
                          style={{ width: '130px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '2px 8px', fontSize: '0.84rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '110px', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                          Main WorkCtr:
                        </label>
                        <input 
                          type="text"
                          value={mainWorkCtr}
                          onChange={(e) => setMainWorkCtr(e.target.value)}
                          style={{ width: '130px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '2px 8px', fontSize: '0.84rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '110px', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                          Reported by:
                        </label>
                        <input 
                          type="text"
                          value={reportedBy}
                          onChange={(e) => setReportedBy(e.target.value)}
                          style={{ flex: 1, height: '28px', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '2px 8px', fontSize: '0.84rem' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label style={{ width: '110px', fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                          Priority:
                        </label>
                        <select 
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          style={{ width: '130px', height: '28px', border: '1px solid #cbd5e1', borderRadius: '2px', padding: '2px 8px', fontSize: '0.82rem' }}
                        >
                          <option value="Urgent">Urgent (L1)</option>
                          <option value="High">High (L2)</option>
                          <option value="Medium">Medium (L3)</option>
                          <option value="Low">Low (L4)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REFERENCE OBJECT (Deep Dive) */}
              {activeSapTab === 'reference' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '16px 20px', background: '#ffffff' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '14px' }}>
                      Asset Master Data Hierarchy
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Maintenance Plant</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>PL01 — Hamburg Refinery</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Functional Location</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb' }}>{functionalLocationId}</div>
                        <div style={{ fontSize: '0.74rem', color: '#475569' }}>{currentFuncLoc?.name}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Target Equipment</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{equipmentId}</div>
                        <div style={{ fontSize: '0.74rem', color: '#475569' }}>{currentEquipment?.name}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Category & Criticality</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                          {currentEquipment?.category} ({currentEquipment?.criticality})
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Manufacturer & Serial</div>
                        <div style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                          {currentEquipment?.manufacturer} • {currentEquipment?.serialNo}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Cost Center</div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                          {currentFuncLoc?.costCenterId || 'CC-4100'} (Process OpEx)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MALFUNCTION, BREAKDOWN (Where breakdown started requirement!) */}
              {activeSapTab === 'malfunction' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '18px 20px',
                    background: breakdown ? '#fef2f2' : '#ffffff'
                  }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: breakdown ? '#dc2626' : '#1e3a8a', marginBottom: '14px' }}>
                      Breakdown & Malfunction Intake Data
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: breakdown ? '#dc2626' : '#0f172a' }}>
                          Breakdown Halt (Asset currently tripped or out of operational service)
                        </span>
                      </label>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '6px' }}>
                            Where Breakdown Started (Failure Point):
                          </label>
                          <input 
                            type="text"
                            value={breakdownPoint}
                            onChange={(e) => setBreakdownPoint(e.target.value)}
                            placeholder="e.g. Drive-End Mechanical Seal Gland & Bearing Pedestal"
                            style={{
                              width: '100%',
                              height: '30px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '2px',
                              padding: '2px 10px',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              background: '#ffffff'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '6px' }}>
                            Malfunction Start Timestamp:
                          </label>
                          <input 
                            type="datetime-local"
                            value={breakdownStart}
                            onChange={(e) => setBreakdownStart(e.target.value)}
                            style={{
                              width: '100%',
                              height: '30px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '2px',
                              padding: '2px 10px',
                              fontSize: '0.85rem',
                              background: '#ffffff'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                            Breakdown Duration (Hours):
                          </label>
                          <input 
                            type="number"
                            min="0"
                            step="0.5"
                            value={breakdownDurationHours}
                            onChange={(e) => setBreakdownDurationHours(e.target.value)}
                            style={{
                              width: '100%',
                              height: '30px',
                              border: '1px solid #cbd5e1',
                              borderRadius: '2px',
                              padding: '2px 10px',
                              fontSize: '0.85rem',
                              background: '#ffffff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ITEMS (Catalog profile items with cost requirement!) */}
              {activeSapTab === 'items' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '16px 20px',
                    background: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e3a8a' }}>
                          Catalog Profile: {currentProfile.name}
                        </h4>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          Defect items with Object Part (B), Damage Code (C), Cause Code (5) and Estimated Costs
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Total Defect Cost: </span>
                        <strong style={{ fontSize: '1.1rem', color: '#16a34a' }}>{formatCurrency(totalEstimatedCost)}</strong>
                      </div>
                    </div>

                    {/* Items Table */}
                    <table className="data-table" style={{ width: '100%', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ width: '50px' }}>Item</th>
                          <th>Object Part (Baugruppe)</th>
                          <th>Damage Code (Schaden)</th>
                          <th>Cause Code (Ursache)</th>
                          <th style={{ width: '120px' }}>Cost ($)</th>
                          <th style={{ width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                              No catalog profile defect items entered yet.
                            </td>
                          </tr>
                        ) : (
                          items.map((it) => (
                            <tr key={it.itemNo}>
                              <td><span className="mono-chip">{it.itemNo}</span></td>
                              <td><strong>{it.objectPartText}</strong> <span style={{ fontSize: '0.7rem', color: '#64748b' }}>({it.objectPartCode})</span></td>
                              <td><span style={{ color: '#dc2626', fontWeight: 600 }}>{it.damageText}</span></td>
                              <td>{it.causeText}</td>
                              <td><strong style={{ color: '#16a34a' }}>{formatCurrency(it.cost)}</strong></td>
                              <td>
                                <button 
                                  type="button" 
                                  onClick={() => setItems(items.filter((x) => x.itemNo !== it.itemNo))}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Add Item Form */}
                    <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '3px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '10px' }}>
                        + Add Defect Item & Enter Cost:
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Object Part (B):</label>
                          <select 
                            value={tempItemPart} 
                            onChange={(e) => setTempItemPart(e.target.value)}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                          >
                            <option value="">-- Choose Part --</option>
                            {currentProfile.objectParts.map((p) => (
                              <option key={p.code} value={p.code}>{p.code}: {p.text}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Damage Code (C):</label>
                          <select 
                            value={tempItemDamage} 
                            onChange={(e) => setTempItemDamage(e.target.value)}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                          >
                            <option value="">-- Choose Damage --</option>
                            {currentProfile.damageCodes.map((d) => (
                              <option key={d.code} value={d.code}>{d.code}: {d.text}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Cause Code (5):</label>
                          <select 
                            value={tempItemCause} 
                            onChange={(e) => setTempItemCause(e.target.value)}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                          >
                            <option value="">-- Choose Cause --</option>
                            {currentProfile.causeCodes.map((c) => (
                              <option key={c.code} value={c.code}>{c.code}: {c.text}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 700, display: 'block' }}>Item Cost ($):</label>
                          <input 
                            type="number"
                            min="0"
                            placeholder="e.g. 640.00"
                            value={tempItemCost}
                            onChange={(e) => setTempItemCost(e.target.value)}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.82rem', fontWeight: 700 }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddItem}>
                          <Plus size={13} />
                          <span>Add Item & Calculate Cost</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TASKS (Action tasks requirement!) */}
              {activeSapTab === 'tasks' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '3px', padding: '16px 20px', background: '#ffffff' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '14px' }}>
                      Notification Action Tasks (Catalog 2 - Maßnahmen)
                    </h4>

                    <table className="data-table" style={{ width: '100%', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          <th style={{ width: '50px' }}>Task</th>
                          <th>Task Description</th>
                          <th>Assigned Technician</th>
                          <th>Target Finish</th>
                          <th style={{ width: '110px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                              No tasks planned for this notification.
                            </td>
                          </tr>
                        ) : (
                          tasks.map((tsk) => (
                            <tr key={tsk.taskNo}>
                              <td><span className="mono-chip">{tsk.taskNo}</span></td>
                              <td><strong>{tsk.description}</strong></td>
                              <td>{tsk.assignedTo}</td>
                              <td>{formatDate(tsk.plannedFinish)}</td>
                              <td>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    setTasks(tasks.map((t) => t.taskNo === tsk.taskNo ? {
                                      ...t,
                                      status: t.status === 'Completed' ? 'Pending' : 'Completed'
                                    } : t));
                                  }}
                                  style={{
                                    border: 'none',
                                    padding: '3px 8px',
                                    borderRadius: '2px',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    background: tsk.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                                    color: tsk.status === 'Completed' ? '#166534' : '#92400e'
                                  }}
                                >
                                  {tsk.status === 'Completed' ? '✓ Completed' : tsk.status || 'Pending'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Add Task Form */}
                    <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '3px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '10px' }}>
                        + Add Action Task:
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Standard Task Template:</label>
                          <select 
                            value={tempTaskCode}
                            onChange={(e) => {
                              setTempTaskCode(e.target.value);
                              const found = currentProfile.taskCodes.find((tc) => tc.code === e.target.value);
                              if (found) setTempTaskDesc(found.text);
                            }}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                          >
                            <option value="">-- Choose Standard Task --</option>
                            {currentProfile.taskCodes.map((tc) => (
                              <option key={tc.code} value={tc.code}>{tc.code}: {tc.text}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Task Description:</label>
                          <input 
                            type="text" 
                            value={tempTaskDesc} 
                            onChange={(e) => setTempTaskDesc(e.target.value)}
                            placeholder="Task description"
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.82rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Assigned Technician:</label>
                          <input 
                            type="text" 
                            value={tempTaskAssignee} 
                            onChange={(e) => setTempTaskAssignee(e.target.value)}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.82rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Target Finish:</label>
                          <input 
                            type="datetime-local" 
                            value={tempTaskFinish} 
                            onChange={(e) => setTempTaskFinish(e.target.value)}
                            style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddTask}>
                          <Plus size={13} />
                          <span>Add Task</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SUPERVISION / ACTIVITIES (Supervisor sign-off requirement!) */}
              {activeSapTab === 'supervision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '18px 20px',
                    background: isSupervised ? '#ecfdf5' : '#fffbeb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <UserCheck size={20} color={isSupervised ? '#16a34a' : '#d97706'} />
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: isSupervised ? '#065f46' : '#92400e' }}>
                        {isSupervised ? 'Supervision Sign-Off Verified (APRV)' : 'Pending Supervisor Review & Authorization'}
                      </h4>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Supervisor Name:</label>
                        <input 
                          type="text" 
                          value={supervisorName} 
                          onChange={(e) => setSupervisorName(e.target.value)}
                          style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.84rem', fontWeight: 600 }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Decision:</label>
                        <select 
                          value={supervisorDecision} 
                          onChange={(e) => setSupervisorDecision(e.target.value)}
                          style={{ width: '100%', height: '28px', border: '1px solid #cbd5e1', padding: '2px 8px', fontSize: '0.82rem' }}
                        >
                          <option value="Approved & Released for Work Order">Approved & Released for Work Order (IW31)</option>
                          <option value="Approved for Direct Technical Execution">Approved for Direct Technical Execution</option>
                          <option value="Revision Requested">Revision Requested</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Supervisor Remarks:</label>
                      <textarea 
                        rows={3}
                        value={supervisorComments} 
                        onChange={(e) => setSupervisorComments(e.target.value)}
                        style={{ width: '100%', border: '1px solid #cbd5e1', padding: '6px 10px', fontSize: '0.84rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={handleSupervisorApproval}
                        style={{ fontWeight: 700 }}
                      >
                        <CheckCircle size={14} />
                        <span>Sign & Approve Notification</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={handleConvertToWorkOrder}
                        style={{ fontWeight: 700 }}
                      >
                        <Wrench size={14} />
                        <span>Convert to Work Order (IW31)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR: Authentic SAP Action Box (Matches Screenshot #2!) */}
            <div style={{
              width: '240px',
              borderLeft: '1px solid #cbd5e1',
              background: '#f8fafc',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1e3a8a' }}>
                  Action box
                </span>
                <div style={{ width: '100%', height: '1px', background: '#cbd5e1', marginTop: '6px' }} />
              </div>

              {/* Action Box Links matching screenshot #2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <button
                  type="button"
                  onClick={handleConvertToWorkOrder}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left',
                    fontWeight: 600
                  }}
                  title="Generate Work Order (IW31) from this notification"
                >
                  <Wrench size={14} color="#2563eb" />
                  <span>Convert to Order (IW31)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePutInProcess}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#1e40af',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <Send size={14} color="#3b82f6" />
                  <span>Put in process (NOPR)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCompleteNotification}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#065f46',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span>Complete (NOCO)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSapTab('supervision')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#92400e',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <UserCheck size={14} color="#d97706" />
                  <span>Supervisor Sign-Off</span>
                </button>

                <div style={{ width: '100%', height: '1px', background: '#e2e8f0', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => showNotice('Solution Database checked. 4 related Sulzer seal repair manuals found.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#334155',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <FileText size={14} color="#64748b" />
                  <span>Solution Database</span>
                </button>

                <button
                  type="button"
                  onClick={() => showNotice('Internal engineering technical note logged.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#334155',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <Edit3 size={14} color="#64748b" />
                  <span>Create Internal Note</span>
                </button>

                <button
                  type="button"
                  onClick={() => showNotice('Telephone log recorded: Control room notified of standby P-101B start.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#334155',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <Phone size={14} color="#64748b" />
                  <span>Log Telephone Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => showNotice('Confirmation receipt transmitted to operator dispatch.')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#334155',
                    cursor: 'pointer',
                    padding: '4px 0',
                    textAlign: 'left'
                  }}
                >
                  <ClipboardList size={14} color="#64748b" />
                  <span>Send Confirmation of Receipt</span>
                </button>
              </div>

              {/* Status & Cost Stamp in Action Box */}
              <div style={{
                marginTop: 'auto',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '3px',
                padding: '10px 12px',
                fontSize: '0.74rem'
              }}>
                <div style={{ color: '#64748b' }}>Estimated Defect Cost:</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#16a34a', margin: '2px 0' }}>
                  {formatCurrency(totalEstimatedCost)}
                </div>
                <div style={{ color: '#64748b' }}>
                  {items.length} items • {tasks.length} tasks
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
           SECONDARY VIEW: Notification Grid List (IW28)
           ===================================================================== */
        <div className="panel-card" style={{ boxShadow: 'none' }}>
          <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="panel-title-wrap">
              <span className="panel-title">Notifications Overview List (IW28)</span>
              <span className="mono-chip">{filteredNotifs.length} records</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Search notification no, equipment..." 
                className="search-input"
                style={{ width: '220px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  enterCreateMode();
                  setViewMode('sap_gui');
                }}
              >
                <Plus size={13} />
                <span>Create (IW21)</span>
              </button>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Notification No</th>
                  <th style={{ width: '130px' }}>Breakdown Point</th>
                  <th>Malfunction Description</th>
                  <th>Equipment & FL</th>
                  <th style={{ width: '110px' }}>Cost</th>
                  <th style={{ width: '90px' }}>Priority</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotifs.map((n) => (
                  <tr 
                    key={n.notificationNo}
                    onClick={() => {
                      setSelectedNotifId(n.notificationNo);
                      setViewMode('sap_gui');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td><span className="mono-chip" style={{ fontWeight: 700, color: '#2563eb' }}>{n.notificationNo}</span></td>
                    <td>
                      {n.breakdown ? (
                        <span className="badge badge-urgent" style={{ fontSize: '0.66rem' }}>
                          🚨 {n.breakdownPoint?.substring(0, 20) || 'Breakdown'}
                        </span>
                      ) : (
                        <span className="badge badge-low" style={{ fontSize: '0.66rem' }}>Operational</span>
                      )}
                    </td>
                    <td><strong>{n.title}</strong></td>
                    <td>{n.equipmentId} • {n.functionalLocationId}</td>
                    <td><strong style={{ color: '#16a34a' }}>{formatCurrency(n.totalEstimatedCost || 0)}</strong></td>
                    <td><span className={`badge badge-${getPriorityBadge(n.priority).color}`}>{n.priority}</span></td>
                    <td><span className={`mono-chip mono-chip-${getNotificationStatusBadge(n.status).color}`}>{n.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNotifId(n.notificationNo);
                          setViewMode('sap_gui');
                        }}
                      >
                        Open (IW22)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
