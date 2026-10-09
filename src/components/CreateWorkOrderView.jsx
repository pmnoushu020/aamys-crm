import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Send, 
  Layers, 
  Wrench, 
  Package, 
  DollarSign, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  PLANTS, 
  FUNCTIONAL_LOCATIONS, 
  WORK_CENTERS, 
  EQUIPMENT_LIST, 
  MATERIALS_CATALOG, 
  COST_CENTERS, 
  WBS_ELEMENTS, 
  ORDER_TYPES 
} from '../data/mockMasterData';
import { 
  formatCurrency, 
  generateDatesForPriority 
} from '../utils/pmUtils';

export default function CreateWorkOrderView({ 
  initialNotification = null, 
  onSaveOrder, 
  onCancel 
}) {
  const [activeTab, setActiveTab] = useState('header');

  // Form State
  const [orderType, setOrderType] = useState('PM01');
  const [title, setTitle] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  // Dates
  const [basicStartDate, setBasicStartDate] = useState('');
  const [basicFinishDate, setBasicFinishDate] = useState('');

  // Core Reference Objects
  const [equipmentId, setEquipmentId] = useState('');
  const [functionalLocationId, setFunctionalLocationId] = useState('');
  const [notificationNo, setNotificationNo] = useState('');

  // Organizational Data
  const [planningPlant, setPlanningPlant] = useState('PL01');
  const [maintenancePlant, setMaintenancePlant] = useState('PL01');
  const [mainWorkCenter, setMainWorkCenter] = useState('MECH_01');

  // Cost Settlement
  const [costCenter, setCostCenter] = useState('CC-4100');
  const [wbsElement, setWbsElement] = useState('');

  // Operations
  const [operations, setOperations] = useState([
    {
      opNo: '0010',
      workCenter: 'MECH_01',
      description: 'Perform initial safety assessment and equipment isolation (LOTO)',
      controlKey: 'PM01',
      laborHours: 2.0,
      technicians: 1,
      vendor: '',
      prNumber: '',
      externalCost: 0
    },
    {
      opNo: '0020',
      workCenter: 'MECH_01',
      description: 'Dismantle components, clean surfaces and inspect tolerance wear',
      controlKey: 'PM01',
      laborHours: 4.0,
      technicians: 2,
      vendor: '',
      prNumber: '',
      externalCost: 0
    }
  ]);

  // Materials / Components (Movement 261)
  const [components, setComponents] = useState([
    {
      materialNo: 'MAT-44012',
      description: 'Viton O-Ring High Temperature Gasket Set',
      quantity: 1,
      unit: 'SET',
      movementType: '261',
      storageLocation: 'SL01',
      unitPrice: 85.00
    }
  ]);

  // Errors / validation
  const [validationErrors, setValidationErrors] = useState([]);

  // Auto-fill dates based on priority
  useEffect(() => {
    const dates = generateDatesForPriority(priority);
    setBasicStartDate(dates.startDate);
    setBasicFinishDate(dates.finishDate);
  }, [priority]);

  // If created from notification
  useEffect(() => {
    if (initialNotification) {
      setNotificationNo(initialNotification.notificationNo);
      setTitle(initialNotification.title);
      setHeaderText(initialNotification.description);
      setPriority(initialNotification.priority || 'High');
      if (initialNotification.breakdown) {
        setOrderType('PM03'); // Breakdown Maintenance
      } else {
        setOrderType('PM01'); // Corrective
      }
      if (initialNotification.equipmentId) {
        handleEquipmentChange(initialNotification.equipmentId);
      } else if (initialNotification.functionalLocationId) {
        handleFuncLocChange(initialNotification.functionalLocationId);
      }
      // Inherit tasks from notification if present
      if (Array.isArray(initialNotification.tasks) && initialNotification.tasks.length > 0) {
        const mappedOps = initialNotification.tasks.map((task, idx) => ({
          opNo: String((idx + 1) * 10).padStart(4, '0'),
          workCenter: 'MECH_01',
          description: task.description || task.taskCode || 'Maintenance Activity',
          controlKey: 'PM01',
          laborHours: 2.5,
          technicians: 1,
          vendor: '',
          prNumber: '',
          externalCost: 0
        }));
        setOperations(mappedOps);
      }
      if (initialNotification.breakdownPoint) {
        setHeaderText((prev) => 
          `${prev ? prev + '\n' : ''}[Failure Point: ${initialNotification.breakdownPoint}]${initialNotification.totalEstimatedCost ? ` [Estimated Damage Cost: $${initialNotification.totalEstimatedCost}]` : ''}`
        );
      }
    }
  }, [initialNotification]);

  // Equipment selection auto-populates FL, Plant, Work Center, and Cost Center
  const handleEquipmentChange = (eqId) => {
    setEquipmentId(eqId);
    if (!eqId) return;

    const eq = EQUIPMENT_LIST.find((e) => e.id === eqId);
    if (eq) {
      if (eq.functionalLocationId) setFunctionalLocationId(eq.functionalLocationId);
      if (eq.plantId) {
        setPlanningPlant(eq.plantId);
        setMaintenancePlant(eq.plantId);
      }
      if (eq.workCenterId) setMainWorkCenter(eq.workCenterId);
      if (eq.defaultCostCenterId) setCostCenter(eq.defaultCostCenterId);
    }
  };

  // Functional Location change handler
  const handleFuncLocChange = (flId) => {
    setFunctionalLocationId(flId);
    const fl = FUNCTIONAL_LOCATIONS.find((f) => f.id === flId);
    if (fl) {
      if (fl.plantId) {
        setPlanningPlant(fl.plantId);
        setMaintenancePlant(fl.plantId);
      }
      if (fl.costCenterId) setCostCenter(fl.costCenterId);
    }
  };

  // Operations management
  const addOperation = () => {
    const nextOpNum = String((operations.length + 1) * 10).padStart(4, '0');
    setOperations([
      ...operations,
      {
        opNo: nextOpNum,
        workCenter: mainWorkCenter || 'MECH_01',
        description: '',
        controlKey: 'PM01',
        laborHours: 2.0,
        technicians: 1,
        vendor: '',
        prNumber: '',
        externalCost: 0
      }
    ]);
  };

  const updateOperation = (index, field, value) => {
    const updated = [...operations];
    updated[index][field] = value;
    if (field === 'controlKey' && value === 'PM03' && !updated[index].prNumber) {
      // Auto-assign mock PR number when external service PM03 is selected
      updated[index].prNumber = `PR-${Math.floor(10000 + Math.random() * 90000)}`;
    }
    setOperations(updated);
  };

  const removeOperation = (index) => {
    if (operations.length <= 1) return;
    setOperations(operations.filter((_, i) => i !== index));
  };

  // Components management
  const addComponent = () => {
    const sampleMat = MATERIALS_CATALOG[0];
    setComponents([
      ...components,
      {
        materialNo: sampleMat.materialNo,
        description: sampleMat.description,
        quantity: 1,
        unit: sampleMat.unit,
        movementType: '261',
        storageLocation: 'SL01',
        unitPrice: sampleMat.unitPrice
      }
    ]);
  };

  const updateComponent = (index, field, value) => {
    const updated = [...components];
    if (field === 'materialNo') {
      const mat = MATERIALS_CATALOG.find((m) => m.materialNo === value);
      if (mat) {
        updated[index].materialNo = mat.materialNo;
        updated[index].description = mat.description;
        updated[index].unit = mat.unit;
        updated[index].unitPrice = mat.unitPrice;
      }
    } else {
      updated[index][field] = value;
    }
    setComponents(updated);
  };

  const removeComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  // Calculate live costs
  const calculateEstimatedCosts = () => {
    let laborCost = 0;
    let laborHoursTotal = 0;
    let externalCost = 0;

    operations.forEach((op) => {
      const wc = WORK_CENTERS.find((w) => w.id === op.workCenter) || { hourlyRate: 85 };
      if (op.controlKey === 'PM01') {
        const totalOpHrs = (Number(op.laborHours) || 0) * (Number(op.technicians) || 1);
        laborHoursTotal += totalOpHrs;
        laborCost += totalOpHrs * wc.hourlyRate;
      } else if (op.controlKey === 'PM03') {
        externalCost += Number(op.externalCost) || 0;
      }
    });

    let materialCost = 0;
    components.forEach((comp) => {
      materialCost += (Number(comp.quantity) || 0) * (Number(comp.unitPrice) || 0);
    });

    return {
      laborCost,
      laborHoursTotal,
      externalCost,
      materialCost,
      totalCost: laborCost + externalCost + materialCost
    };
  };

  const costEst = calculateEstimatedCosts();

  // Validate form
  const validate = () => {
    const errors = [];
    if (!title.trim()) errors.push('Order Description / Header title is required.');
    if (!equipmentId && !functionalLocationId) {
      errors.push('Core Reference Object is mandatory: Select either an Equipment Number or a Functional Location.');
    }
    if (!mainWorkCenter) errors.push('Main Work Center is required.');
    if (!costCenter) errors.push('Cost Center for settlement is required.');
    if (operations.length === 0) errors.push('At least one Operation / Task must be planned.');

    operations.forEach((op, idx) => {
      if (!op.description.trim()) {
        errors.push(`Operation ${op.opNo} requires a task description.`);
      }
      if (op.controlKey === 'PM03' && (!op.vendor || !op.externalCost)) {
        errors.push(`External Operation ${op.opNo} (PM03) requires a Vendor name and Estimated Cost for PR generation.`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (releaseOrder = false) => {
    if (!validate()) {
      setActiveTab('header');
      return;
    }

    const orderId = `WO-${Math.floor(300200 + Math.random() * 800)}`;
    const newOrder = {
      id: orderId,
      orderType,
      title: title.trim(),
      headerText: headerText.trim() || title.trim(),
      equipmentId: equipmentId || null,
      functionalLocationId: functionalLocationId || null,
      notificationNo: notificationNo.trim() || null,
      planningPlant,
      maintenancePlant,
      mainWorkCenter,
      priority,
      status: releaseOrder ? 'REL' : 'CRTD',
      basicStartDate,
      basicFinishDate,
      costCenter,
      wbsElement: wbsElement || null,
      createdBy: 'Dieter Braun (Planner)',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      releasedAt: releaseOrder ? new Date().toISOString().replace('T', ' ').substring(0, 16) : null,
      operations: operations.map((op) => ({
        ...op,
        confirmedHours: 0,
        confirmedBy: '',
        confirmedDate: '',
        status: 'PENDING'
      })),
      components: components.map((comp, idx) => ({
        ...comp,
        reservationNo: `RES-${Math.floor(90100 + idx + Math.random() * 500)}`,
        isIssued: false,
        issuedDate: null
      }))
    };

    onSaveOrder(newOrder, releaseOrder);
  };

  const selectedEquipment = EQUIPMENT_LIST.find((e) => e.id === equipmentId);
  const selectedFuncLoc = FUNCTIONAL_LOCATIONS.find((f) => f.id === functionalLocationId);

  return (
    <div className="page-body">
      {/* Workflow Navigation Ribbon */}
      <div className="workflow-ribbon">
        <div className="ribbon-step done">
          <CheckCircle2 size={14} />
          <span>1. Notification (IW21)</span>
        </div>
        <div className="ribbon-arrow">→</div>
        <div className="ribbon-step current">
          <Sparkles size={14} />
          <span>2. Work Order Creation (IW31)</span>
        </div>
        <div className="ribbon-arrow">→</div>
        <div className="ribbon-step">
          <Clock size={14} />
          <span>3. Order Release & PR / Reservation (REL)</span>
        </div>
        <div className="ribbon-arrow">→</div>
        <div className="ribbon-step">
          <Wrench size={14} />
          <span>4. Execution & Time Confirmation (IW41)</span>
        </div>
        <div className="ribbon-arrow">→</div>
        <div className="ribbon-step">
          <DollarSign size={14} />
          <span>5. TECO & Cost Settlement</span>
        </div>
      </div>

      {/* Validation Errors Notice */}
      {validationErrors.length > 0 && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          color: '#fca5a5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
            <AlertCircle size={18} color="#ef4444" />
            <span>Please complete mandatory maintenance specifications:</span>
          </div>
          <ul style={{ paddingLeft: '24px', fontSize: '0.82rem', lineHeight: '1.6' }}>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Creation Card */}
      <div className="panel-card">
        {/* Navigation Tabs */}
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'header' ? 'active' : ''}`}
            onClick={() => setActiveTab('header')}
          >
            <Building2 size={16} />
            <span>1. Header & Reference Object</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'operations' ? 'active' : ''}`}
            onClick={() => setActiveTab('operations')}
          >
            <Wrench size={16} />
            <span>2. Operations & External Services ({operations.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <Package size={16} />
            <span>3. Spare Parts & Mvt 261 ({components.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settlement' ? 'active' : ''}`}
            onClick={() => setActiveTab('settlement')}
          >
            <DollarSign size={16} />
            <span>4. Cost Settlement & Accounting</span>
          </button>
        </div>

        {/* Tab 1: Header & Reference Objects */}
        {activeTab === 'header' && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Top Row: Order Type & Priority */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  <span>Order Type <span className="required">*</span></span>
                  <span className="mono-chip">SAP PM</span>
                </label>
                <select 
                  className="form-select"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  {ORDER_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.name}
                    </option>
                  ))}
                </select>
                <span className="input-helper">
                  {ORDER_TYPES.find((t) => t.id === orderType)?.description}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Priority <span className="required">*</span></span>
                  <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>Auto-Schedules</span>
                </label>
                <select 
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Urgent">Urgent (Breakdown / Within 8h)</option>
                  <option value="High">High (Within 24 hours)</option>
                  <option value="Medium">Medium (Scheduled within 3-4 days)</option>
                  <option value="Low">Low (Routine backlog / 7-10 days)</option>
                </select>
                <span className="input-helper">Determines basic start and end timestamps</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Linked Notification (IW21)</span>
                  <span className="mono-chip">Optional</span>
                </label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. NOTIF-2026-0812"
                  value={notificationNo}
                  onChange={(e) => setNotificationNo(e.target.value)}
                />
                <span className="input-helper">Reference notification origin if approved</span>
              </div>
            </div>

            {/* Title & Header Text */}
            <div className="form-group">
              <label className="form-label">
                <span>Description / Header Short Text <span className="required">*</span></span>
                <span className="input-helper">Summary explaining failure or task</span>
              </label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Centrifugal Slurry Pump P-101A vibration & mechanical seal replacement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ fontSize: '0.95rem', fontWeight: 600 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Long Header Text / Failure Diagnosis</span>
              </label>
              <textarea 
                className="form-textarea"
                placeholder="Detail technical scope, observed symptoms, operating parameters, and work precautions..."
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                rows={3}
              />
            </div>

            {/* SECTION: 1. Core Reference Object (Where is work being done?) */}
            <div style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    1. Core Reference Object (Asset Hierarchy)
                  </h3>
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--primary)' }}>
                  Must link to Equipment or Functional Location
                </span>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Equipment Number</span>
                    <span className="mono-chip">EQ Master Data</span>
                  </label>
                  <select 
                    className="form-select"
                    value={equipmentId}
                    onChange={(e) => handleEquipmentChange(e.target.value)}
                  >
                    <option value="">-- Select Target Equipment (or FL below) --</option>
                    {EQUIPMENT_LIST.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.id} — {eq.name} ({eq.category})
                      </option>
                    ))}
                  </select>
                  <span className="input-helper">
                    Selecting equipment auto-resolves Functional Location, Plant, Work Center & Cost Center
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Functional Location <span className="required">*</span></span>
                    <span className="mono-chip">FL Master Data</span>
                  </label>
                  <select 
                    className="form-select"
                    value={functionalLocationId}
                    onChange={(e) => handleFuncLocChange(e.target.value)}
                  >
                    <option value="">-- Select Functional Location --</option>
                    {FUNCTIONAL_LOCATIONS.map((fl) => (
                      <option key={fl.id} value={fl.id}>
                        {fl.id} — {fl.name}
                      </option>
                    ))}
                  </select>
                  <span className="input-helper">Defines where in the plant the work is performed</span>
                </div>
              </div>

              {/* Asset Snapshot Card */}
              {(selectedEquipment || selectedFuncLoc) && (
                <div style={{
                  background: 'var(--primary-subtle)',
                  border: '1px solid rgba(37, 99, 235, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--primary)', fontWeight: 700 }}>
                      Selected Asset Master Record:
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                      {selectedEquipment ? `${selectedEquipment.id} - ${selectedEquipment.name}` : selectedFuncLoc?.name}
                    </div>
                    {selectedEquipment && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                        Mfr: {selectedEquipment.manufacturer} | Model: {selectedEquipment.model} | S/N: {selectedEquipment.serialNo}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="mono-chip mono-chip-emerald">
                      Active Asset
                    </span>
                    {selectedEquipment && (
                      <span className="badge badge-high">{selectedEquipment.criticality} Criticality</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION: 2. Administrative & Organizational Data */}
            <div style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--success)" />
                <h3 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  2. Administrative & Organizational Data
                </h3>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label">
                    <span>Planning Plant <span className="required">*</span></span>
                    <span className="mono-chip">Org Unit</span>
                  </label>
                  <select 
                    className="form-select"
                    value={planningPlant}
                    onChange={(e) => setPlanningPlant(e.target.value)}
                  >
                    {PLANTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <span className="input-helper">Unit managing maintenance planning</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Maintenance Plant <span className="required">*</span></span>
                    <span className="mono-chip">Site</span>
                  </label>
                  <select 
                    className="form-select"
                    value={maintenancePlant}
                    onChange={(e) => setMaintenancePlant(e.target.value)}
                  >
                    {PLANTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <span className="input-helper">Physical site where the asset resides</span>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Main Work Center <span className="required">*</span></span>
                    <span className="mono-chip">Shop</span>
                  </label>
                  <select 
                    className="form-select"
                    value={mainWorkCenter}
                    onChange={(e) => setMainWorkCenter(e.target.value)}
                  >
                    {WORK_CENTERS.map((wc) => (
                      <option key={wc.id} value={wc.id}>
                        {wc.id} - {wc.name} (${wc.hourlyRate}/h)
                      </option>
                    ))}
                  </select>
                  <span className="input-helper">Responsible shop/trade executing the order</span>
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    <span>Basic Start Date & Time <span className="required">*</span></span>
                  </label>
                  <input 
                    type="datetime-local"
                    className="form-input"
                    value={basicStartDate}
                    onChange={(e) => setBasicStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span>Basic Finish Date & Time <span className="required">*</span></span>
                  </label>
                  <input 
                    type="datetime-local"
                    className="form-input"
                    value={basicFinishDate}
                    onChange={(e) => setBasicFinishDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Operations & Tasks */}
        {activeTab === 'operations' && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
                  3. Operations / Tasks (Execution Planning)
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Outline step-by-step internal tasks (Control Key PM01) and external vendor services (Control Key PM03).
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={addOperation}>
                <Plus size={14} />
                <span>Add Operation</span>
              </button>
            </div>

            {/* Operations Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>Op No</th>
                    <th style={{ width: '130px' }}>Control Key</th>
                    <th style={{ width: '160px' }}>Work Center</th>
                    <th>Task Description / Vendor Specs</th>
                    <th style={{ width: '100px' }}>Duration (h)</th>
                    <th style={{ width: '80px' }}>Techs</th>
                    <th style={{ width: '110px' }}>Est. Cost</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((op, idx) => {
                    const wc = WORK_CENTERS.find((w) => w.id === op.workCenter) || { hourlyRate: 85 };
                    const isInternal = op.controlKey === 'PM01';
                    const internalOpHours = (Number(op.laborHours) || 0) * (Number(op.technicians) || 1);
                    const internalOpCost = internalOpHours * wc.hourlyRate;

                    return (
                      <tr key={idx}>
                        <td>
                          <span className="mono-chip">{op.opNo}</span>
                        </td>
                        <td>
                          <select 
                            className="form-select"
                            style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            value={op.controlKey}
                            onChange={(e) => updateOperation(idx, 'controlKey', e.target.value)}
                          >
                            <option value="PM01">PM01 - Internal Labor</option>
                            <option value="PM03">PM03 - External Service (PR)</option>
                          </select>
                        </td>
                        <td>
                          <select 
                            className="form-select"
                            style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            value={op.workCenter}
                            onChange={(e) => updateOperation(idx, 'workCenter', e.target.value)}
                          >
                            {WORK_CENTERS.map((w) => (
                              <option key={w.id} value={w.id}>{w.id}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <input 
                              type="text"
                              className="form-input"
                              placeholder="Describe task..."
                              value={op.description}
                              onChange={(e) => updateOperation(idx, 'description', e.target.value)}
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            />
                            {!isInternal && (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input 
                                  type="text"
                                  className="form-input"
                                  placeholder="Vendor name (e.g. VibroTech GmbH)"
                                  value={op.vendor}
                                  onChange={(e) => updateOperation(idx, 'vendor', e.target.value)}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1 }}
                                />
                                <span className="mono-chip mono-chip-amber" style={{ fontSize: '0.7rem' }}>
                                  Auto PR: {op.prNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {isInternal ? (
                            <input 
                              type="number"
                              step="0.5"
                              min="0.5"
                              className="form-input"
                              value={op.laborHours}
                              onChange={(e) => updateOperation(idx, 'laborHours', Number(e.target.value))}
                              style={{ padding: '4px 8px', fontSize: '0.8rem', textAlign: 'center' }}
                            />
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>External PR</span>
                          )}
                        </td>
                        <td>
                          {isInternal ? (
                            <input 
                              type="number"
                              min="1"
                              className="form-input"
                              value={op.technicians}
                              onChange={(e) => updateOperation(idx, 'technicians', Number(e.target.value))}
                              style={{ padding: '4px 8px', fontSize: '0.8rem', textAlign: 'center' }}
                            />
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                          )}
                        </td>
                        <td>
                          {isInternal ? (
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#93c5fd' }}>
                              {formatCurrency(internalOpCost)}
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                {internalOpHours}h @ ${wc.hourlyRate}
                              </div>
                            </div>
                          ) : (
                            <input 
                              type="number"
                              step="50"
                              placeholder="$ Amount"
                              className="form-input"
                              value={op.externalCost}
                              onChange={(e) => updateOperation(idx, 'externalCost', Number(e.target.value))}
                              style={{ padding: '4px 8px', fontSize: '0.8rem', textAlign: 'right' }}
                            />
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 6px', color: '#f87171' }}
                            onClick={() => removeOperation(idx)}
                            disabled={operations.length <= 1}
                            title="Delete operation"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Operations Summary Strip */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem'
            }}>
              <div>
                <span>Total Planned Labor Duration: </span>
                <strong style={{ color: '#ffffff' }}>{costEst.laborHoursTotal} person-hours</strong>
              </div>
              <div>
                <span>Planned Labor Cost: </span>
                <strong style={{ color: '#60a5fa' }}>{formatCurrency(costEst.laborCost)}</strong>
                {costEst.externalCost > 0 && (
                  <span style={{ marginLeft: '12px' }}>
                    + External PR Services: <strong style={{ color: '#fbbf24' }}>{formatCurrency(costEst.externalCost)}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Spare Parts & Materials (Movement Type 261) */}
        {activeTab === 'materials' && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
                    Spare Parts Reservation (Movement Type 261)
                  </h3>
                  <span className="mono-chip mono-chip-emerald">
                    Movement 261: Goods Issue for Order
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Reserve parts against warehouse stock. Movement 261 generates automatic stock reservations upon order release.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={addComponent}>
                <Plus size={14} />
                <span>Add Material</span>
              </button>
            </div>

            {/* Components Table */}
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Material Number</th>
                    <th>Description</th>
                    <th style={{ width: '130px' }}>Movement Type</th>
                    <th style={{ width: '90px' }}>Qty</th>
                    <th style={{ width: '70px' }}>Unit</th>
                    <th style={{ width: '140px' }}>Storage Loc</th>
                    <th style={{ width: '110px' }}>Stock Check</th>
                    <th style={{ width: '100px' }}>Unit Price</th>
                    <th style={{ width: '110px' }}>Total Cost</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {components.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        No spare parts added. Click "Add Material" above if replacement items or lubricants are needed.
                      </td>
                    </tr>
                  ) : (
                    components.map((comp, idx) => {
                      const matItem = MATERIALS_CATALOG.find((m) => m.materialNo === comp.materialNo);
                      const isStockSufficient = matItem ? matItem.inStock >= comp.quantity : false;
                      const lineTotal = (Number(comp.quantity) || 0) * (Number(comp.unitPrice) || 0);

                      return (
                        <tr key={idx}>
                          <td>
                            <select 
                              className="form-select"
                              style={{ padding: '4px 8px', fontSize: '0.8rem', width: '140px' }}
                              value={comp.materialNo}
                              onChange={(e) => updateComponent(idx, 'materialNo', e.target.value)}
                            >
                              {MATERIALS_CATALOG.map((m) => (
                                <option key={m.materialNo} value={m.materialNo}>
                                  {m.materialNo}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td style={{ color: '#ffffff', fontWeight: 500 }}>
                            {comp.description}
                          </td>
                          <td>
                            <span className="mono-chip mono-chip-emerald">
                              261 (GI Order)
                            </span>
                          </td>
                          <td>
                            <input 
                              type="number"
                              min="1"
                              className="form-input"
                              value={comp.quantity}
                              onChange={(e) => updateComponent(idx, 'quantity', Number(e.target.value))}
                              style={{ padding: '4px 8px', fontSize: '0.8rem', textAlign: 'center' }}
                            />
                          </td>
                          <td>
                            <span className="mono-chip">{comp.unit}</span>
                          </td>
                          <td>
                            <select 
                              className="form-select"
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                              value={comp.storageLocation}
                              onChange={(e) => updateComponent(idx, 'storageLocation', e.target.value)}
                            >
                              <option value="SL01">SL01 - Central Mechanical</option>
                              <option value="SL02">SL02 - Lube Depot</option>
                              <option value="SL03">SL03 - Electrical Stores</option>
                            </select>
                          </td>
                          <td>
                            {isStockSufficient ? (
                              <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                                In Stock ({matItem?.inStock})
                              </span>
                            ) : (
                              <span className="badge badge-urgent" style={{ fontSize: '0.68rem' }}>
                                Shortage ({matItem?.inStock} Avail)
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {formatCurrency(comp.unitPrice)}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600, color: '#34d399' }}>
                            {formatCurrency(lineTotal)}
                          </td>
                          <td>
                            <button 
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '4px 6px', color: '#f87171' }}
                              onClick={() => removeComponent(idx)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Materials Value */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.82rem'
            }}>
              <div>
                <span>Total Reserved Spare Parts: </span>
                <strong style={{ color: '#ffffff' }}>{components.length} item(s)</strong>
              </div>
              <div>
                <span>Total Materials Reservation Value: </span>
                <strong style={{ color: '#34d399' }}>{formatCurrency(costEst.materialCost)}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cost Settlement & Accounting */}
        {activeTab === 'settlement' && (
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
                4. Cost Settlement & Accounting
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Maintenance expenditures are captured and settled to the assigned Cost Center or Project Capital Budget (WBS Element).
              </p>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  <span>Cost Center (Settlement Receiver) <span className="required">*</span></span>
                  <span className="mono-chip">CO-OM</span>
                </label>
                <select 
                  className="form-select"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                >
                  {COST_CENTERS.map((cc) => (
                    <option key={cc.id} value={cc.id}>
                      {cc.id} — {cc.name} ({cc.manager})
                    </option>
                  ))}
                </select>
                <span className="input-helper">
                  Auto-populated from asset master data; receives order debits
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>WBS Element or Internal Order</span>
                  <span className="mono-chip">Capex / Project</span>
                </label>
                <select 
                  className="form-select"
                  value={wbsElement}
                  onChange={(e) => setWbsElement(e.target.value)}
                >
                  <option value="">-- None (Pure OpEx Maintenance) --</option>
                  {WBS_ELEMENTS.map((wbs) => (
                    <option key={wbs.id} value={wbs.id}>
                      {wbs.id} — {wbs.name}
                    </option>
                  ))}
                </select>
                <span className="input-helper">
                  Mandatory if repair is covered under capital budget or turnaround overhaul
                </span>
              </div>
            </div>

            {/* Live Planned Cost Estimate Summary Card */}
            <div style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '22px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Pre-Calculation Order Cost Estimate
                </span>
                <span className="mono-chip mono-chip-emerald">SAP CO Order Simulation</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Planned Internal Labor</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatCurrency(costEst.laborCost)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{costEst.laborHoursTotal} total hours</div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>External Services (PM03 PR)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#d97706' }}>
                    {formatCurrency(costEst.externalCost)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vendor Purchase Requisitions</div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Materials (Mvt 261)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
                    {formatCurrency(costEst.materialCost)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{components.length} reserved parts</div>
                </div>

                <div style={{ background: 'var(--primary-subtle)', border: '1px solid rgba(37, 99, 235, 0.3)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700 }}>Total Planned Budget</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatCurrency(costEst.totalCost)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>Committed Maintenance Cost</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panel Footer Actions */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => handleSubmit(false)}
            title="Save order with status CRTD (Created)"
          >
            <Save size={15} />
            <span>Save as Draft / Created (CRTD)</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => handleSubmit(true)}
            title="Saves and releases the order (status REL), triggering PRs and material reservations"
          >
            <Send size={15} />
            <span>Save & Release Order (REL)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
