import React from 'react';
import { 
  Wrench, 
  ClipboardList, 
  PlusCircle, 
  BellRing, 
  Clock, 
  Boxes, 
  ShieldAlert,
  BarChart3,
  Layers
} from 'lucide-react';

export default function Sidebar({ currentView, setView, counts }) {
  const navItems = [
    {
      id: 'orders',
      label: 'Work Orders',
      code: 'IW38',
      icon: ClipboardList,
      count: counts.orders
    },
    {
      id: 'create_order',
      label: 'Create Work Order',
      code: 'IW31',
      icon: PlusCircle,
      highlight: true
    },
    {
      id: 'notifications',
      label: 'Notifications',
      code: 'IW21',
      icon: BellRing,
      count: counts.notifications
    },
    {
      id: 'confirmation',
      label: 'Execution & Time Log',
      code: 'IW41',
      icon: Clock,
      count: counts.activeExecution
    },
    {
      id: 'preventive',
      label: 'Preventive Plans',
      code: 'IP01',
      icon: Layers,
      count: 4
    },
    {
      id: 'permits',
      label: 'Permits to Work (PTW)',
      code: 'WCM',
      icon: ShieldAlert,
      count: 2
    },
    {
      id: 'master_data',
      label: 'Asset Master Data',
      code: 'IH01',
      icon: Boxes,
      count: null
    },
    {
      id: 'materials',
      label: 'Spare Parts (Mvt 261)',
      code: 'MM03',
      icon: Boxes,
      count: counts.materials
    },
    {
      id: 'analytics',
      label: 'Cost & KPI Analytics',
      code: 'MCI8',
      icon: BarChart3,
      count: null
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Wrench size={22} />
        </div>
        <div className="brand-info">
          <h1>Aamys CRM</h1>
          <span>Enterprise Operations</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Transactions (SAP PM)</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <div className="nav-item-left">
                <Icon size={18} />
                <span className="nav-item-text">{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {item.count !== null && item.count !== undefined && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? '#2563eb' : 'rgba(255,255,255,0.08)',
                    color: '#ffffff'
                  }}>
                    {item.count}
                  </span>
                )}
                <span className="nav-shortcut-tag">{item.code}</span>
              </div>
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '16px' }}>Quick Actions</div>
        <button 
          className="nav-item" 
          style={{ color: '#fb7185', background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
          onClick={() => {
            setView('create_order');
          }}
        >
          <div className="nav-item-left">
            <ShieldAlert size={18} />
            <span className="nav-item-text">Log Breakdown (PM03)</span>
          </div>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">PM</div>
          <div className="user-meta">
            <div className="user-name">Dieter Braun</div>
            <div className="user-role">Maintenance Lead (PL01)</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
