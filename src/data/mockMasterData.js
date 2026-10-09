// Master Data and Initial Records for Plant Maintenance (PM) System
// Strictly modeled after industrial plant maintenance standards (SAP PM IW21 / IW31 / IW41)

export const PLANTS = [
  { id: 'PL01', name: 'PL01 - Hamburg Refinery & Petrochemical', location: 'Hamburg, DE', type: 'Refinery' },
  { id: 'PL02', name: 'PL02 - Munich Central Chemical Depot', location: 'Munich, DE', type: 'Chemical Depot' },
  { id: 'PL03', name: 'PL03 - Rotterdam Marine Terminal & Cracker', location: 'Rotterdam, NL', type: 'Cracker Terminal' }
];

export const FUNCTIONAL_LOCATIONS = [
  {
    id: 'FL-100-PUMP-01',
    name: 'Crude Distillation Unit (CDU) - Pumping Station Alpha',
    plantId: 'PL01',
    costCenterId: 'CC-4100',
    category: 'Process Plant Section',
    systemStatus: 'Active / Commissioned',
    superiorLocation: 'FL-100-CDU'
  },
  {
    id: 'FL-100-COMP-02',
    name: 'Gas Compression Area - Booster Train 2',
    plantId: 'PL01',
    costCenterId: 'CC-4100',
    category: 'Compression Train',
    systemStatus: 'Active / Commissioned',
    superiorLocation: 'FL-100-CDU'
  },
  {
    id: 'FL-200-BOIL-01',
    name: 'High Pressure Steam Boiler & Utility House',
    plantId: 'PL02',
    costCenterId: 'CC-3200',
    category: 'Utility Generation',
    systemStatus: 'Active / Commissioned',
    superiorLocation: 'FL-200-UTIL'
  },
  {
    id: 'FL-300-ELEC-01',
    name: 'High Voltage Substation 33kV Switchgear Yard',
    plantId: 'PL01',
    costCenterId: 'CC-1150',
    category: 'Electrical Distribution',
    systemStatus: 'Active / Commissioned',
    superiorLocation: 'FL-300-GRID'
  },
  {
    id: 'FL-400-HVAC-01',
    name: 'Central Control Room - Air Conditioning & Chiller Unit',
    plantId: 'PL02',
    costCenterId: 'CC-5200',
    category: 'HVAC Infrastructure',
    systemStatus: 'Active / Commissioned',
    superiorLocation: 'FL-400-BLDG'
  }
];

export const WORK_CENTERS = [
  {
    id: 'MECH_01',
    name: 'Mechanical Maintenance Workshop',
    lead: 'Alex Brandt (Lead Engineer)',
    hourlyRate: 85.00,
    skills: ['Pump alignment', 'Turbine overhaul', 'Flange torquing', 'LOTO'],
    plantId: 'PL01'
  },
  {
    id: 'ELEC_01',
    name: 'Electrical & Instrumentation Shop',
    lead: 'David Chen (Chief Electrician)',
    hourlyRate: 95.00,
    skills: ['Switchgear testing', 'PLC Diagnostics', 'VFD Calibration', 'Arc Flash'],
    plantId: 'PL01'
  },
  {
    id: 'CIVIL_01',
    name: 'Civil & Structural Engineering',
    lead: 'Marcus Vance (Civil Lead)',
    hourlyRate: 65.00,
    skills: ['Concrete inspection', 'Scaffolding', 'Structural integrity', 'Grouting'],
    plantId: 'PL02'
  },
  {
    id: 'HVAC_01',
    name: 'HVAC & Refrigeration Services',
    lead: 'Elena Rostova (HVAC Specialist)',
    hourlyRate: 75.00,
    skills: ['Refrigerant recovery', 'Chiller descaling', 'Air balancing', 'Compressors'],
    plantId: 'PL02'
  }
];

export const CATALOG_PROFILES = [
  {
    id: 'CP-PUMP',
    name: 'CP-PUMP: Centrifugal & Slurry Pumps',
    category: 'Mechanical Rotary',
    objectParts: [
      { code: 'B-PMP-01', text: 'Mechanical Seal Cartridge' },
      { code: 'B-PMP-02', text: 'Deep Groove Radial / Thrust Bearing' },
      { code: 'B-PMP-03', text: 'Impeller & Suction Wear Ring' },
      { code: 'B-PMP-04', text: 'Shaft Sleeve & Keyway Assembly' },
      { code: 'B-PMP-05', text: 'Pump Volute Casing & Gasket' }
    ],
    damageCodes: [
      { code: 'C-DMG-01', text: 'Fluid / Slurry Leakage from Seal Gland' },
      { code: 'C-DMG-02', text: 'Excessive Dynamic Vibration (>7.2 mm/s RMS)' },
      { code: 'C-DMG-03', text: 'Abnormal Noise / Cavitation Rumbling' },
      { code: 'C-DMG-04', text: 'Impeller Vane Erosion / Pitting' },
      { code: 'C-DMG-05', text: 'High Bearing Housing Temperature (>85°C)' }
    ],
    causeCodes: [
      { code: '5-CAU-01', text: 'Particulate Ingress / Slurry Abrasion' },
      { code: '5-CAU-02', text: 'Lubrication Starvation or Lube Breakdown' },
      { code: '5-CAU-03', text: 'Dynamic Shaft Misalignment / Soft Foot' },
      { code: '5-CAU-04', text: 'Cavitation due to Low Suction Head (NPSH)' },
      { code: '5-CAU-05', text: 'Normal Operating Fatigue & Wear' }
    ],
    taskCodes: [
      { code: 'T-PMP-01', text: 'LOTO Isolation, pipe depressurization & chemical flush' },
      { code: 'T-PMP-02', text: 'Dismantle casing, pull shaft & extract failed seal' },
      { code: 'T-PMP-03', text: 'Mount replacement seal cartridge & set clearances' },
      { code: 'T-PMP-04', text: 'Precision laser alignment & dynamic balancing' },
      { code: 'T-PMP-05', text: 'Hydrostatic pressure & 2-hour vibration run-in test' }
    ]
  },
  {
    id: 'CP-COMP',
    name: 'CP-COMP: Reciprocating Gas Compressors',
    category: 'Reciprocating Machinery',
    objectParts: [
      { code: 'B-CMP-01', text: 'Suction / Discharge Valve Plate Assembly' },
      { code: 'B-CMP-02', text: 'Piston Compression Rings & Rider Bands' },
      { code: 'B-CMP-03', text: 'Crosshead Guide & Connecting Rod' },
      { code: 'B-CMP-04', text: 'Cylinder Liner & Head Gasket' },
      { code: 'B-CMP-05', text: 'Intercooler Heat Exchanger Tubes' }
    ],
    damageCodes: [
      { code: 'C-DMG-06', text: 'Interstage High Temperature (>148°C)' },
      { code: 'C-DMG-07', text: 'Compression Ratio Loss / Valve Chattering' },
      { code: 'C-DMG-08', text: 'Lube Oil Carryover into Process Gas' },
      { code: 'C-DMG-09', text: 'Cylinder Knocking / Acoustic Pulsation' }
    ],
    causeCodes: [
      { code: '5-CAU-06', text: 'Valve Plate Spring Breakage / Fatigue' },
      { code: '5-CAU-07', text: 'Process Gas Liquid Condensate Slugging' },
      { code: '5-CAU-08', text: 'Thermal Carbon Deposit Accumulation' }
    ],
    taskCodes: [
      { code: 'T-CMP-01', text: 'De-pressurize & Inert Gas Nitrogen Purge' },
      { code: 'T-CMP-02', text: 'Replace Suction / Discharge Valve Plates' },
      { code: 'T-CMP-03', text: 'Borescope inspection of cylinder liners' },
      { code: 'T-CMP-04', text: 'Nitrogen leak test at 12 Bar hold pressure' }
    ]
  },
  {
    id: 'CP-BOIL',
    name: 'CP-BOIL: High-Pressure Steam Boilers',
    category: 'Pressure Vessels & Utilities',
    objectParts: [
      { code: 'B-BLR-01', text: 'Water Wall Evaporator Tubes' },
      { code: 'B-BLR-02', text: 'Spring-Loaded Safety Relief Valves' },
      { code: 'B-BLR-03', text: 'Burner Nozzle & Igniter Electrode' },
      { code: 'B-BLR-04', text: 'Feedwater Regulating Valve Trim' }
    ],
    damageCodes: [
      { code: 'C-DMG-14', text: 'Tube Wall Thickness Loss (<3.5mm)' },
      { code: 'C-DMG-15', text: 'Safety Relief Valve Weeping / Steam Bypass' },
      { code: 'C-DMG-16', text: 'Flame Scanners Instability / Trip Fault' }
    ],
    causeCodes: [
      { code: '5-CAU-12', text: 'Flue Gas High Temperature Sulfur Corrosion' },
      { code: '5-CAU-13', text: 'Chemical Scaling & Boiler Feedwater Silica' }
    ],
    taskCodes: [
      { code: 'T-BLR-01', text: 'Controlled Cool Down & Confined Space Permit' },
      { code: 'T-BLR-02', text: 'Ultrasound Thickness Scan (UT Grid Analysis)' },
      { code: 'T-BLR-03', text: 'Safety valve bench pop-test & seal lapping' },
      { code: 'T-BLR-04', text: 'Hydrostatic pressure test at 1.5x design pressure' }
    ]
  },
  {
    id: 'CP-ELEC',
    name: 'CP-ELEC: 33kV Switchgear & Substations',
    category: 'Electrical Distribution',
    objectParts: [
      { code: 'B-ELC-01', text: 'Vacuum Interrupter Bottle & Main Contacts' },
      { code: 'B-ELC-02', text: 'SF6 Gas Chamber & Manometer Valve' },
      { code: 'B-ELC-03', text: 'Spring Charging Motor & Trip Coil' },
      { code: 'B-ELC-04', text: 'Microprocessor Protection Relay' }
    ],
    damageCodes: [
      { code: 'C-DMG-10', text: 'Contact Resistance Exceeded Pre-set Limit' },
      { code: 'C-DMG-11', text: 'SF6 Gas Pressure Loss Pre-Alarm (Stage 1)' },
      { code: 'C-DMG-12', text: 'Slow Trip Response on Secondary Current Test' }
    ],
    causeCodes: [
      { code: '5-CAU-09', text: 'Spring Mechanism Mechanical Fatigue' },
      { code: '5-CAU-10', text: 'O-Ring Seal Degradation on Gas Chamber' },
      { code: '5-CAU-11', text: 'Arcing Contact Erosion from Interruptions' }
    ],
    taskCodes: [
      { code: 'T-ELC-01', text: 'Rack-out Breaker to Disconnected & Apply Earth' },
      { code: 'T-ELC-02', text: 'Micro-Ohm Contact Resistance Measurement' },
      { code: 'T-ELC-03', text: 'SF6 Gas Sniffer Leak Detection & Top-up' },
      { code: 'T-ELC-04', text: 'Secondary Injection 50/51 Relay Timing Test' }
    ]
  },
  {
    id: 'CP-HVAC',
    name: 'CP-HVAC: Industrial Chillers & HVAC',
    category: 'Environmental & Chillers',
    objectParts: [
      { code: 'B-HVC-01', text: 'Evaporator Shell & Tube Bundle' },
      { code: 'B-HVC-02', text: 'Semi-Hermetic Screw Compressor Unit' },
      { code: 'B-HVC-03', text: 'Thermostatic Expansion Valve (TXV)' },
      { code: 'B-HVC-04', text: 'Condenser Fan & Variable Frequency Drive' }
    ],
    damageCodes: [
      { code: 'C-DMG-17', text: 'Low Evaporator Suction Pressure Alarm' },
      { code: 'C-DMG-18', text: 'Sub-cooling Deviation & Thermal Inefficiency' },
      { code: 'C-DMG-19', text: 'Refrigerant R-134a Micro-Leakage' }
    ],
    causeCodes: [
      { code: '5-CAU-14', text: 'Expansion Valve Packing Gland Degradation' },
      { code: '5-CAU-15', text: 'Condenser Tube Mineral Scale Fouling' }
    ],
    taskCodes: [
      { code: 'T-HVC-01', text: 'Certified Refrigerant Recovery & Weighing' },
      { code: 'T-HVC-02', text: 'Chemical Descaling of Water Tube Bundle' },
      { code: 'T-HVC-03', text: 'Nitrogen Pressure Decay Leak Test (24h)' },
      { code: 'T-HVC-04', text: 'Deep Vacuum Evacuation & R-134a Re-charge' }
    ]
  }
];

export const EQUIPMENT_LIST = [
  {
    id: 'EQ-100421',
    name: 'Centrifugal Slurry Pump P-101A (Primary)',
    functionalLocationId: 'FL-100-PUMP-01',
    plantId: 'PL01',
    workCenterId: 'MECH_01',
    catalogProfileId: 'CP-PUMP',
    defaultCostCenterId: 'CC-4100',
    category: 'Mechanical Rotary',
    manufacturer: 'Sulzer Pumps AG',
    model: 'CP-150/400 Multi-Stage',
    serialNo: 'SZ-993821-DE',
    criticality: 'Urgent',
    status: 'Maintenance Required',
    installDate: '2021-04-15'
  },
  {
    id: 'EQ-100422',
    name: 'Centrifugal Slurry Pump P-101B (Standby)',
    functionalLocationId: 'FL-100-PUMP-01',
    plantId: 'PL01',
    workCenterId: 'MECH_01',
    catalogProfileId: 'CP-PUMP',
    defaultCostCenterId: 'CC-4100',
    category: 'Mechanical Rotary',
    manufacturer: 'Sulzer Pumps AG',
    model: 'CP-150/400 Multi-Stage',
    serialNo: 'SZ-993822-DE',
    criticality: 'Medium',
    status: 'In Operation',
    installDate: '2021-04-15'
  },
  {
    id: 'EQ-200843',
    name: 'Reciprocating Gas Compressor C-202',
    functionalLocationId: 'FL-100-COMP-02',
    plantId: 'PL01',
    workCenterId: 'MECH_01',
    catalogProfileId: 'CP-COMP',
    defaultCostCenterId: 'CC-4100',
    category: 'Reciprocating Compressor',
    manufacturer: 'Burckhardt Compression',
    model: 'Laby-GI 2-Stage High Pressure',
    serialNo: 'BK-55201-CH',
    criticality: 'High',
    status: 'In Operation',
    installDate: '2019-11-20'
  },
  {
    id: 'EQ-300115',
    name: 'High-Pressure Water Tube Boiler B-10',
    functionalLocationId: 'FL-200-BOIL-01',
    plantId: 'PL02',
    workCenterId: 'MECH_01',
    catalogProfileId: 'CP-BOIL',
    defaultCostCenterId: 'CC-3200',
    category: 'Static Pressure Vessel',
    manufacturer: 'Babcock & Wilcox',
    model: 'WT-5000 Industrial Steam',
    serialNo: 'BW-2018-990',
    criticality: 'High',
    status: 'Scheduled Inspection',
    installDate: '2018-08-10'
  },
  {
    id: 'EQ-400920',
    name: 'Vacuum Circuit Breaker 33kV VCB-03',
    functionalLocationId: 'FL-300-ELEC-01',
    plantId: 'PL01',
    workCenterId: 'ELEC_01',
    catalogProfileId: 'CP-ELEC',
    defaultCostCenterId: 'CC-1150',
    category: 'Electrical Switchgear',
    manufacturer: 'Siemens Energy',
    model: 'SION 3AE 36kV 2500A',
    serialNo: 'SIEM-77441-VCB',
    criticality: 'Urgent',
    status: 'In Operation',
    installDate: '2022-02-14'
  },
  {
    id: 'EQ-500108',
    name: 'Centrifugal Water Chiller CH-01',
    functionalLocationId: 'FL-400-HVAC-01',
    plantId: 'PL02',
    workCenterId: 'HVAC_01',
    catalogProfileId: 'CP-HVAC',
    defaultCostCenterId: 'CC-5200',
    category: 'HVAC Chiller',
    manufacturer: 'Trane Technologies',
    model: 'CenTraVac CVHE 500-Ton',
    serialNo: 'TRN-44109-US',
    criticality: 'Medium',
    status: 'In Operation',
    installDate: '2020-06-30'
  }
];

export const MATERIALS_CATALOG = [
  {
    materialNo: 'MAT-70021',
    description: 'Mechanical Seal Cartridge SiC/Carbon 65mm',
    category: 'Seals & Gaskets',
    unit: 'EA',
    unitPrice: 640.00,
    inStock: 12,
    storageLocation: 'SL01 - Central Mechanical Stores',
    minStock: 4
  },
  {
    materialNo: 'MAT-44012',
    description: 'Viton O-Ring High Temperature Gasket Set',
    category: 'Seals & Gaskets',
    unit: 'SET',
    unitPrice: 85.00,
    inStock: 48,
    storageLocation: 'SL01 - Central Mechanical Stores',
    minStock: 10
  },
  {
    materialNo: 'MAT-90182',
    description: 'SKF Deep Groove Ball Bearing 6309-2RS / C3',
    category: 'Bearings',
    unit: 'EA',
    unitPrice: 128.00,
    inStock: 22,
    storageLocation: 'SL01 - Central Mechanical Stores',
    minStock: 6
  },
  {
    materialNo: 'MAT-10093',
    description: 'Mobil SHC 630 Synthetic Gear & Bearing Lube (20L Drum)',
    category: 'Lubricants & Oils',
    unit: 'CAN',
    unitPrice: 215.00,
    inStock: 18,
    storageLocation: 'SL02 - Lube & Chemical Depot',
    minStock: 5
  },
  {
    materialNo: 'MAT-60045',
    description: 'PTFE Spiral Wound Flange Gasket DN150 PN40',
    category: 'Piping & Flanges',
    unit: 'EA',
    unitPrice: 34.50,
    inStock: 95,
    storageLocation: 'SL01 - Central Mechanical Stores',
    minStock: 20
  },
  {
    materialNo: 'MAT-88120',
    description: 'Arc Flash Optical Sensor Module 24V DC',
    category: 'Electrical Components',
    unit: 'EA',
    unitPrice: 480.00,
    inStock: 5,
    storageLocation: 'SL03 - Electrical Instrument Stores',
    minStock: 2
  },
  {
    materialNo: 'MAT-33104',
    description: 'Compressor Suction Valve Plate Assembly',
    category: 'Compressor Spares',
    unit: 'SET',
    unitPrice: 1120.00,
    inStock: 3,
    storageLocation: 'SL01 - Central Mechanical Stores',
    minStock: 1
  },
  {
    materialNo: 'MAT-55029',
    description: 'R-134a Eco Refrigerant Gas Cylinder (13.6 kg)',
    category: 'HVAC Gases',
    unit: 'CYL',
    unitPrice: 340.00,
    inStock: 8,
    storageLocation: 'SL02 - Lube & Chemical Depot',
    minStock: 2
  }
];

export const COST_CENTERS = [
  { id: 'CC-4100', name: 'Refinery Process Maintenance OpEx', plantId: 'PL01', manager: 'K. Schmidt' },
  { id: 'CC-3200', name: 'Boiler & Steam Utility Operations', plantId: 'PL02', manager: 'M. Becker' },
  { id: 'CC-1150', name: 'Electrical Grid Infrastructure & Substations', plantId: 'PL01', manager: 'T. Richter' },
  { id: 'CC-5200', name: 'Facilities, HVAC & Environmental Control', plantId: 'PL02', manager: 'L. Weber' }
];

export const WBS_ELEMENTS = [
  { id: 'WBS-2026-TURNAROUND-PUMP', name: 'Q3 Turnaround - Primary Rotary Pump Overhauls', budget: 140000 },
  { id: 'WBS-2026-EFFICIENCY-UPG', name: 'Decarbonization & Boiler Efficiency Retrofit 2026', budget: 280000 },
  { id: 'WBS-2026-SUBSTATION-UPG', name: 'Substation Protection Relay Modernization', budget: 95000 },
  { id: 'IO-99201', name: 'Internal Order: Emergency Unplanned Breakdown Reserve', budget: 50000 }
];

export const ORDER_TYPES = [
  {
    id: 'PM01',
    name: 'Corrective Maintenance',
    description: 'Restores asset after minor defect or non-critical deviation.',
    badgeColor: 'blue'
  },
  {
    id: 'PM02',
    name: 'Preventive Maintenance',
    description: 'Scheduled inspection, servicing, lubrication, or statutory compliance.',
    badgeColor: 'emerald'
  },
  {
    id: 'PM03',
    name: 'Breakdown Maintenance',
    description: 'Urgent unplanned halt. Direct production stoppage or safety hazard.',
    badgeColor: 'rose'
  },
  {
    id: 'PM04',
    name: 'Calibration / Compliance',
    description: 'Statutory recertification, relief valve pressure test, environmental audits.',
    badgeColor: 'purple'
  }
];

// Sample operational notifications modeled after industrial SAP PM IW21 / IW28 standards
export const INITIAL_NOTIFICATIONS = [
  {
    notificationNo: 'NOTIF-2026-0812',
    notificationType: 'M2',
    equipmentId: 'EQ-100421',
    functionalLocationId: 'FL-100-PUMP-01',
    title: 'Severe mechanical seal leakage & high bearing vibration on Pump P-101A',
    description: 'During morning shift inspection, slurry leakage was observed from drive-end seal gland. Vibration sensor reading exceeded 8.2 mm/s RMS (tripping pre-alarm threshold). Standby pump P-101B started manually.',
    priority: 'Urgent',
    reportedBy: 'Wolfgang Meyer (Operator #441)',
    reportedDate: '2026-10-06 08:30',
    breakdown: true,
    breakdownStart: '2026-10-06T08:15',
    breakdownPoint: 'Drive-End Mechanical Seal Gland & Bearing Pedestal',
    catalogProfileId: 'CP-PUMP',
    items: [
      {
        itemNo: '0010',
        objectPartCode: 'B-PMP-01',
        objectPartText: 'Mechanical Seal Cartridge',
        damageCode: 'C-DMG-01',
        damageText: 'Fluid / Slurry Leakage from Seal Gland',
        causeCode: '5-CAU-01',
        causeText: 'Particulate Ingress / Slurry Abrasion',
        cost: 640.00,
        notes: 'Cartridge seal face cracked due to abrasive particles in slurry.'
      },
      {
        itemNo: '0020',
        objectPartCode: 'B-PMP-02',
        objectPartText: 'Deep Groove Radial / Thrust Bearing',
        damageCode: 'C-DMG-02',
        damageText: 'Excessive Dynamic Vibration (>7.2 mm/s RMS)',
        causeCode: '5-CAU-02',
        causeText: 'Lubrication Starvation or Lube Breakdown',
        cost: 256.00,
        notes: 'Outer race spalling detected during vibration spectrum FFT analysis.'
      }
    ],
    totalEstimatedCost: 896.00,
    tasks: [
      {
        taskNo: 'T01',
        taskCode: 'T-PMP-01',
        description: 'LOTO Isolation, pipe depressurization & chemical flush',
        assignedTo: 'Hans Gruber (Technician #302)',
        plannedStart: '2026-10-06T09:00',
        plannedFinish: '2026-10-06T11:00',
        status: 'Completed'
      },
      {
        taskNo: 'T02',
        taskCode: 'T-PMP-02',
        description: 'Dismantle casing, pull shaft & extract failed seal',
        assignedTo: 'Hans Gruber (Technician #302)',
        plannedStart: '2026-10-06T11:30',
        plannedFinish: '2026-10-06T15:30',
        status: 'Completed'
      },
      {
        taskNo: 'T03',
        taskCode: 'T-PMP-03',
        description: 'Mount replacement seal cartridge & set clearances',
        assignedTo: 'Alex Brandt (Lead Engineer)',
        plannedStart: '2026-10-07T08:30',
        plannedFinish: '2026-10-07T12:00',
        status: 'In Progress'
      }
    ],
    supervisorSignOff: {
      isSupervised: true,
      supervisorName: 'Dieter Braun (Maintenance Supervisor)',
      decision: 'Approved & Released for Work Order',
      signedAt: '2026-10-06 09:15',
      comments: 'Priority 1 emergency breakdown approved. Cost estimation $896 verified. Work Order WO-300101 generated.'
    },
    status: 'ORD_GEN',
    orderId: 'WO-300101'
  },
  {
    notificationNo: 'NOTIF-2026-0824',
    notificationType: 'M2',
    equipmentId: 'EQ-300115',
    functionalLocationId: 'FL-200-BOIL-01',
    title: 'High-Pressure Steam Boiler B-10 safety valve weeping & pressure fluctuation',
    description: 'During load ramp-up, steam leakage detected from safety relief valve B-10 SV-01 exhaust stack. Temperature anomaly observed at superheater header.',
    priority: 'High',
    reportedBy: 'Klaus Wagner (Operator #512)',
    reportedDate: '2026-10-08 22:45',
    breakdown: true,
    breakdownStart: '2026-10-08T22:30',
    breakdownPoint: 'Safety Relief Valve Header & Superheater Flange Joint',
    catalogProfileId: 'CP-BOIL',
    items: [
      {
        itemNo: '0010',
        objectPartCode: 'B-BLR-02',
        objectPartText: 'Spring-Loaded Safety Relief Valves',
        damageCode: 'C-DMG-15',
        damageText: 'Safety Relief Valve Weeping / Steam Bypass',
        causeCode: '5-CAU-13',
        causeText: 'Chemical Scaling & Boiler Feedwater Silica',
        cost: 1450.00,
        notes: 'Valve disc seat requires lapping and spring recalibration.'
      }
    ],
    totalEstimatedCost: 1450.00,
    tasks: [
      {
        taskNo: 'T01',
        taskCode: 'T-BLR-01',
        description: 'Controlled Cool Down & Confined Space Permit preparation',
        assignedTo: 'Marcus Vance (Civil Lead)',
        plannedStart: '2026-10-09T08:00',
        plannedFinish: '2026-10-09T12:00',
        status: 'Completed'
      },
      {
        taskNo: 'T02',
        taskCode: 'T-BLR-03',
        description: 'Safety valve bench pop-test & seal lapping at certified test rig',
        assignedTo: 'Alex Brandt (Lead Engineer)',
        plannedStart: '2026-10-09T13:00',
        plannedFinish: '2026-10-09T17:00',
        status: 'Pending'
      }
    ],
    supervisorSignOff: {
      isSupervised: false,
      supervisorName: '',
      decision: 'Pending Supervisor Review',
      signedAt: null,
      comments: ''
    },
    status: 'PNDG_SUPV',
    orderId: null
  },
  {
    notificationNo: 'NOTIF-2026-0825',
    notificationType: 'M1',
    equipmentId: 'EQ-500108',
    functionalLocationId: 'FL-400-HVAC-01',
    title: 'Central Chiller CH-01 low evaporator suction refrigerant pressure alarm',
    description: 'Central control room HVAC cooling capacity reduced. Diagnostic code LP-04 active. Possible packing gland leak on expansion valve.',
    priority: 'Medium',
    reportedBy: 'Elena Rostova (HVAC Specialist)',
    reportedDate: '2026-10-09 07:15',
    breakdown: false,
    breakdownStart: null,
    breakdownPoint: 'Evaporator Shell Thermostatic Expansion Valve (TXV)',
    catalogProfileId: 'CP-HVAC',
    items: [
      {
        itemNo: '0010',
        objectPartCode: 'B-HVC-03',
        objectPartText: 'Thermostatic Expansion Valve (TXV)',
        damageCode: 'C-DMG-17',
        damageText: 'Low Evaporator Suction Pressure Alarm',
        causeCode: '5-CAU-14',
        causeText: 'Expansion Valve Packing Gland Degradation',
        cost: 340.00,
        notes: 'Refrigerant R-134a micro-leak detected using electronic halogen sniffer.'
      }
    ],
    totalEstimatedCost: 340.00,
    tasks: [
      {
        taskNo: 'T01',
        taskCode: 'T-HVC-01',
        description: 'Certified Refrigerant Recovery & Weighing cylinder logging',
        assignedTo: 'Elena Rostova (HVAC Specialist)',
        plannedStart: '2026-10-09T10:00',
        plannedFinish: '2026-10-09T13:00',
        status: 'Pending'
      }
    ],
    supervisorSignOff: {
      isSupervised: false,
      supervisorName: '',
      decision: 'Pending Supervisor Review',
      signedAt: null,
      comments: ''
    },
    status: 'PNDG_SUPV',
    orderId: null
  }
];

export const INITIAL_WORK_ORDERS = [];

export const PREVENTIVE_PLANS = [
  {
    planId: 'MP-101',
    description: 'Monthly Rotary Pump Dynamic Vibration & Lube Oil Sampling',
    equipmentId: 'EQ-100421',
    functionalLocationId: 'FL-100-PUMP-01',
    cycleInterval: '30 Days / 720 Hours',
    orderType: 'PM02',
    workCenterId: 'MECH_01',
    lastCallDate: '2026-09-15',
    nextCallDate: '2026-10-15',
    status: 'Scheduled (Active)',
    tasksCount: 3,
    estimatedHours: 4.5
  },
  {
    planId: 'MP-202',
    description: 'Bi-Weekly Gas Compressor Valve Clearance & Interstage Temp Inspection',
    equipmentId: 'EQ-200843',
    functionalLocationId: 'FL-100-COMP-02',
    cycleInterval: '14 Days / 336 Hours',
    orderType: 'PM02',
    workCenterId: 'MECH_01',
    lastCallDate: '2026-09-28',
    nextCallDate: '2026-10-12',
    status: 'Scheduled (Active)',
    tasksCount: 4,
    estimatedHours: 6.0
  },
  {
    planId: 'MP-303',
    description: 'Quarterly Boiler Safety Valve Pop-Test & Ultrasound Shell Thickness',
    equipmentId: 'EQ-300115',
    functionalLocationId: 'FL-200-BOIL-01',
    cycleInterval: '90 Days / 2160 Hours',
    orderType: 'PM02',
    workCenterId: 'MECH_01',
    lastCallDate: '2026-07-30',
    nextCallDate: '2026-10-30',
    status: 'Scheduled (Active)',
    tasksCount: 5,
    estimatedHours: 12.0
  },
  {
    planId: 'MP-404',
    description: 'Annual 33kV Vacuum Circuit Breaker SF6 Gas Pressure & Trip Timing Test',
    equipmentId: 'EQ-400920',
    functionalLocationId: 'FL-300-ELEC-01',
    cycleInterval: '365 Days / 8760 Hours',
    orderType: 'PM02',
    workCenterId: 'ELEC_01',
    lastCallDate: '2025-10-25',
    nextCallDate: '2026-10-25',
    status: 'Due Soon (Call Ready)',
    tasksCount: 6,
    estimatedHours: 8.0
  }
];

// Sample operational permits have been backed up to backup_data.txt and src/data/backup_sample_data.txt
export const PERMITS_TO_WORK = [];

