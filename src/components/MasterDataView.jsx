import React, { useState } from 'react';
import { Layers, Wrench, Building2, ShieldCheck, DollarSign, Search } from 'lucide-react';
import { 
  FUNCTIONAL_LOCATIONS, 
  EQUIPMENT_LIST, 
  WORK_CENTERS, 
  COST_CENTERS, 
  PLANTS 
} from '../data/mockMasterData';
import { formatCurrency } from '../utils/pmUtils';

export default function MasterDataView() {
  const [activeTab, setActiveTab] = useState('equipment');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEquipment = EQUIPMENT_LIST.filter((eq) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      eq.id.toLowerCase().includes(q) ||
      eq.name.toLowerCase().includes(q) ||
      eq.manufacturer.toLowerCase().includes(q) ||
      eq.functionalLocationId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-body">
      <div className="panel-card">
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            <Wrench size={16} />
            <span>Equipment Master ({EQUIPMENT_LIST.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'funcloc' ? 'active' : ''}`}
            onClick={() => setActiveTab('funcloc')}
          >
            <Layers size={16} />
            <span>Functional Locations ({FUNCTIONAL_LOCATIONS.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'workcenters' ? 'active' : ''}`}
            onClick={() => setActiveTab('workcenters')}
          >
            <Building2 size={16} />
            <span>Main Work Centers ({WORK_CENTERS.length})</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'costcenters' ? 'active' : ''}`}
            onClick={() => setActiveTab('costcenters')}
          >
            <DollarSign size={16} />
            <span>Cost Centers ({COST_CENTERS.length})</span>
          </button>
        </div>

        {/* Tab: Equipment Master */}
        {activeTab === 'equipment' && (
          <div>
            <div className="filter-bar" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
              <div className="search-box-wrap">
                <Search size={16} className="search-icon" />
                <input 
                  type="text"
                  className="search-input"
                  placeholder="Filter equipment by ID, description, manufacturer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Equipment ID</th>
                    <th>Equipment Description</th>
                    <th>Functional Location</th>
                    <th>Plant</th>
                    <th>Responsible Shop</th>
                    <th>Cost Center</th>
                    <th>Manufacturer & Model</th>
                    <th>Serial Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipment.map((eq) => (
                    <tr key={eq.id}>
                      <td>
                        <span className="mono-chip" style={{ fontWeight: 700 }}>
                          {eq.id}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-main)' }}>{eq.name}</strong>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{eq.category}</div>
                      </td>
                      <td>
                        <span className="mono-chip">{eq.functionalLocationId}</span>
                      </td>
                      <td>{eq.plantId}</td>
                      <td>
                        <strong style={{ color: '#2563eb' }}>{eq.workCenterId}</strong>
                      </td>
                      <td>{eq.defaultCostCenterId}</td>
                      <td>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>{eq.manufacturer}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{eq.model}</div>
                      </td>
                      <td>
                        <span className="mono-chip" style={{ fontSize: '0.72rem' }}>{eq.serialNo}</span>
                      </td>
                      <td>
                        <span className="badge badge-low">{eq.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Functional Locations */}
        {activeTab === 'funcloc' && (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Functional Location ID</th>
                  <th>Description / Facility Section</th>
                  <th>Plant</th>
                  <th>Default Cost Center</th>
                  <th>Category</th>
                  <th>Superior Hierarchy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {FUNCTIONAL_LOCATIONS.map((fl) => (
                  <tr key={fl.id}>
                    <td>
                      <span className="mono-chip mono-chip-emerald" style={{ fontWeight: 700 }}>
                        {fl.id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{fl.name}</strong>
                    </td>
                    <td>{fl.plantId}</td>
                    <td>
                      <span className="mono-chip">{fl.costCenterId}</span>
                    </td>
                    <td>{fl.category}</td>
                    <td>
                      <span className="mono-chip">{fl.superiorLocation}</span>
                    </td>
                    <td>
                      <span className="badge badge-low">{fl.systemStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Work Centers */}
        {activeTab === 'workcenters' && (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Work Center ID</th>
                  <th>Shop Description</th>
                  <th>Team Lead / Supervisor</th>
                  <th>Standard Cost Rate ($/hr)</th>
                  <th>Core Competencies</th>
                  <th>Plant</th>
                </tr>
              </thead>
              <tbody>
                {WORK_CENTERS.map((wc) => (
                  <tr key={wc.id}>
                    <td>
                      <span className="mono-chip mono-chip-amber" style={{ fontWeight: 700 }}>
                        {wc.id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{wc.name}</strong>
                    </td>
                    <td>{wc.lead}</td>
                    <td>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                        {formatCurrency(wc.hourlyRate)} / hr
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {wc.skills.map((s, i) => (
                          <span key={i} className="mono-chip" style={{ fontSize: '0.7rem' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{wc.plantId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Cost Centers */}
        {activeTab === 'costcenters' && (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cost Center ID</th>
                  <th>Department Name</th>
                  <th>Plant</th>
                  <th>Budget Manager</th>
                  <th>Accounting System</th>
                </tr>
              </thead>
              <tbody>
                {COST_CENTERS.map((cc) => (
                  <tr key={cc.id}>
                    <td>
                      <span className="mono-chip" style={{ fontWeight: 700 }}>
                        {cc.id}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-main)' }}>{cc.name}</strong>
                    </td>
                    <td>{cc.plantId}</td>
                    <td>{cc.manager}</td>
                    <td>
                      <span className="badge badge-low">SAP CO-OM Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
