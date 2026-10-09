import React from 'react';
import { PlusCircle, Search, RefreshCw, Bell, AlertTriangle } from 'lucide-react';

export default function TopBar({ 
  currentView, 
  onNewOrderClick, 
  onNewNotificationClick, 
  onResetData,
  urgentBreakdownsCount
}) {
  const getHeaderInfo = () => {
    switch (currentView) {
      case 'orders':
        return { title: 'Maintenance Work Orders Workbench', tcode: 'IW38 / IW32', subtitle: 'Plant Maintenance Execution & Scheduling' };
      case 'order_detail':
        return { title: 'Work Order Master Dossier', tcode: 'IW32 / IW33', subtitle: 'Detailed Asset Reference, Labor Logs & Cost Settlement' };
      case 'create_order':
        return { title: 'Create Work Order (Standard PM)', tcode: 'IW31', subtitle: 'Order Type, Operations, Movement 261 & Cost Settlement' };
      case 'notifications':
        return { title: 'Maintenance Notifications & Breakdown Log', tcode: 'IW21 / IW28', subtitle: 'Asset Malfunction Requests & Approval Intake' };
      case 'confirmation':
        return { title: 'Execution & Time Confirmation', tcode: 'IW41', subtitle: 'Technician Labor Hours & Goods Issue Posting' };
      case 'preventive':
        return { title: 'Preventive Maintenance Plans (IP01 / IP10)', tcode: 'IP01 / IP10', subtitle: 'Automated Routine Inspection Schedules & Order Calls' };
      case 'permits':
        return { title: 'Permit to Work & Safety Clearance', tcode: 'WCM / PTW', subtitle: 'Lockout/Tagout (LOTO) & Atmospheric Gas Clearance' };
      case 'master_data':
        return { title: 'Asset Master Data Registry', tcode: 'IH01', subtitle: 'Functional Locations, Equipment & Work Centers' };
      case 'materials':
        return { title: 'Spare Parts Inventory & Reservations (Mvt 261)', tcode: 'MM03 / MB21', subtitle: 'Stock Availability & Goods Issue Movement 261' };
      case 'analytics':
        return { title: 'Maintenance Cost Settlement & KPI Analytics', tcode: 'MCI8 / KO88', subtitle: 'Planned vs Actual Cost Variance & Reliability Stats' };
      default:
        return { title: 'Maintenance Operations', tcode: 'SAP PM', subtitle: 'Enterprise Asset Management' };
    }
  };

  const info = getHeaderInfo();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="page-title">{info.title}</h2>
            <span className="mono-chip">{info.tcode}</span>
            {urgentBreakdownsCount > 0 && (
              <span className="badge badge-urgent" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={12} />
                {urgentBreakdownsCount} Urgent Breakdown
              </span>
            )}
          </div>
          <div className="breadcrumb-sap">
            <span>Plant: PL01 (Hamburg Refinery)</span>
            <span>•</span>
            <span>{info.subtitle}</span>
          </div>
        </div>
      </div>

      <div className="top-bar-actions">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetData}
          title="Clear active work orders and notifications (saved in backup_data.txt)"
        >
          <RefreshCw size={14} />
          <span>Clear Data</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onNewNotificationClick}
        >
          <Bell size={14} />
          <span>New Notification (IW21)</span>
        </button>

        <button 
          className="btn btn-primary btn-sm"
          onClick={onNewOrderClick}
        >
          <PlusCircle size={15} />
          <span>Create Work Order (IW31)</span>
        </button>
      </div>
    </header>
  );
}
