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

export const EQUIPMENT_LIST = [
  {
    id: 'EQ-100421',
    name: 'Centrifugal Slurry Pump P-101A (Primary)',
    functionalLocationId: 'FL-100-PUMP-01',
    plantId: 'PL01',
    workCenterId: 'MECH_01',
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

// Sample operational data has been backed up to backup_data.txt and src/data/backup_sample_data.txt
export const INITIAL_NOTIFICATIONS = [];

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

