import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_WORK_ORDERS, 
  INITIAL_NOTIFICATIONS, 
  MATERIALS_CATALOG 
} from './data/mockMasterData';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WorkOrdersList from './components/WorkOrdersList';
import CreateWorkOrderView from './components/CreateWorkOrderView';
import WorkOrderDetailModal from './components/WorkOrderDetailModal';
import TimeConfirmationModal from './components/TimeConfirmationModal';
import GoodsIssueModal from './components/GoodsIssueModal';
import NotificationsView from './components/NotificationsView';
import ExecutionWorkbenchView from './components/ExecutionWorkbenchView';
import MasterDataView from './components/MasterDataView';
import MaterialsView from './components/MaterialsView';
import AnalyticsView from './components/AnalyticsView';
import PreventiveMaintenanceView from './components/PreventiveMaintenanceView';
import PermitToWorkView from './components/PermitToWorkView';
import PrintableJobCardModal from './components/PrintableJobCardModal';
import WorkOrderDetailView from './components/WorkOrderDetailView';

export default function App() {
  // Theme State (default light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('aamys_crm_theme') || 'light';
  });

  // Application Data States (Clean slate; full backup saved in backup_data.txt)
  const [orders, setOrders] = useState(() => {
    try {
      // Clear legacy PM keys from previous sessions
      localStorage.removeItem('aamys_pm_orders');
      const saved = localStorage.getItem('aamys_crm_orders');
      return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
    } catch {
      return INITIAL_WORK_ORDERS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      localStorage.removeItem('aamys_pm_notifications');
      const saved = localStorage.getItem('aamys_crm_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [materials, setMaterials] = useState(() => {
    try {
      localStorage.removeItem('aamys_pm_materials');
      const saved = localStorage.getItem('aamys_crm_materials');
      return saved ? JSON.parse(saved) : MATERIALS_CATALOG;
    } catch {
      return MATERIALS_CATALOG;
    }
  });

  // UI Navigation State
  const [currentView, setView] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeConfirmOrder, setTimeConfirmOrder] = useState(null);
  const [goodsIssueOrder, setGoodsIssueOrder] = useState(null);
  const [creatingFromNotification, setCreatingFromNotification] = useState(null);
  const [jobCardOrder, setJobCardOrder] = useState(null);

  // Toast Banner
  const [toast, setToast] = useState(null);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aamys_crm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('aamys_crm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aamys_crm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('aamys_crm_materials', JSON.stringify(materials));
  }, [materials]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Reset or clear operational data
  const handleResetData = () => {
    if (window.confirm('Clear all active work orders and notifications? (All previous data is backed up in backup_data.txt)')) {
      setOrders([]);
      setNotifications([]);
      setMaterials(MATERIALS_CATALOG);
      localStorage.removeItem('aamys_crm_orders');
      localStorage.removeItem('aamys_crm_notifications');
      localStorage.removeItem('aamys_pm_orders');
      localStorage.removeItem('aamys_pm_notifications');
      showToast('All active data cleared. Backup is preserved in backup_data.txt', 'info');
    }
  };

  // 1. Create / Save Work Order (IW31)
  const handleSaveOrder = (newOrder, releaseImmediately = false) => {
    // If order was created from a notification, link the notification
    if (newOrder.notificationNo) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationNo === newOrder.notificationNo
            ? { ...n, orderId: newOrder.id, status: 'Converted to Order' }
            : n
        )
      );
    }

    setOrders([newOrder, ...orders]);
    setCreatingFromNotification(null);
    setView('orders');

    if (releaseImmediately) {
      showToast(`Work Order ${newOrder.id} saved & RELEASED (REL). Reservations & Purchase Requisitions created!`, 'success');
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } catch (err) {}
    } else {
      showToast(`Work Order ${newOrder.id} created as Draft (CRTD).`, 'info');
    }
  };

  // 2. Release Order (REL)
  const handleReleaseOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'REL',
            releasedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return o;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        status: 'REL',
        releasedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }));
    }

    showToast(`Order ${orderId} released (REL). Material reservations & PR documents generated.`, 'success');
  };

  // 3. Time Confirmation (IW41)
  const handleConfirmTime = ({ orderId, opNo, actualHours, technician, isFinal, notes }) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        let hasPendingOps = false;
        const updatedOps = (order.operations || []).map((op) => {
          if (op.opNo === opNo) {
            const newConfirmedHours = (Number(op.confirmedHours) || 0) + actualHours;
            const newStatus = isFinal ? 'CNF' : 'PCNF';
            return {
              ...op,
              confirmedHours: newConfirmedHours,
              confirmedBy: technician,
              confirmedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              status: newStatus
            };
          }
          if (op.status !== 'CNF') {
            hasPendingOps = true;
          }
          return op;
        });

        // Determine order status
        const allFinal = updatedOps.every((o) => o.status === 'CNF');
        const anyConfirmed = updatedOps.some((o) => o.status === 'CNF' || o.status === 'PCNF');
        let newOrderStatus = order.status;

        if (allFinal) {
          newOrderStatus = 'CNF';
        } else if (anyConfirmed) {
          newOrderStatus = 'PCNF';
        }

        return {
          ...order,
          status: newOrderStatus,
          operations: updatedOps
        };
      })
    );

    // Update open modal if selected
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => {
        const updatedOps = (prev.operations || []).map((op) => {
          if (op.opNo === opNo) {
            return {
              ...op,
              confirmedHours: (Number(op.confirmedHours) || 0) + actualHours,
              confirmedBy: technician,
              confirmedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              status: isFinal ? 'CNF' : 'PCNF'
            };
          }
          return op;
        });
        return {
          ...prev,
          status: updatedOps.every((o) => o.status === 'CNF') ? 'CNF' : 'PCNF',
          operations: updatedOps
        };
      });
    }

    showToast(`IW41: Recorded ${actualHours}h labor on Op ${opNo} for Order ${orderId}.`, 'success');
  };

  // 4. Goods Issue (Movement Type 261)
  const handlePostGoodsIssue = ({ orderId, materialNos }) => {
    // 1. Update order components to isIssued = true
    let issuedItems = [];

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedComps = (order.components || []).map((comp) => {
          if (materialNos.includes(comp.materialNo) && !comp.isIssued) {
            issuedItems.push(comp);
            return {
              ...comp,
              isIssued: true,
              issuedDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
            };
          }
          return comp;
        });

        return {
          ...order,
          components: updatedComps
        };
      })
    );

    // 2. Decrement physical inventory
    setMaterials((prev) =>
      prev.map((mat) => {
        const matchedIssued = issuedItems.find((i) => i.materialNo === mat.materialNo);
        if (matchedIssued) {
          return {
            ...mat,
            inStock: Math.max(0, mat.inStock - matchedIssued.quantity)
          };
        }
        return mat;
      })
    );

    // Update modal if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        components: (prev.components || []).map((c) =>
          materialNos.includes(c.materialNo)
            ? { ...c, isIssued: true, issuedDate: new Date().toISOString().replace('T', ' ').substring(0, 16) }
            : c
        )
      }));
    }

    showToast(`Movement 261: Issued ${materialNos.length} spare part(s) to order ${orderId}. Inventory updated!`, 'success');
  };

  // 5. Technical Completion (TECO)
  const handleTecoOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'TECO',
            tecoDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return o;
      })
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        status: 'TECO',
        tecoDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
      }));
    }

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    showToast(`Order ${orderId} marked Technically Complete (TECO). Ready for final financial settlement.`, 'success');
  };

  // 6. Convert Notification to Work Order
  const handleConvertNotification = (notif) => {
    setCreatingFromNotification(notif);
    setView('create_order');
    showToast(`Converting notification ${notif.notificationNo} into new Work Order (IW31).`, 'info');
  };

  // 7. Add Notification (IW21)
  const handleAddNotification = (newNotif) => {
    setNotifications([newNotif, ...notifications]);
    showToast(`Notification ${newNotif.notificationNo} created and registered.`, 'success');
  };

  // Restock material
  const handleRestockMaterial = (matNo, qty) => {
    setMaterials((prev) =>
      prev.map((m) => (m.materialNo === matNo ? { ...m, inStock: m.inStock + qty } : m))
    );
    showToast(`Replenished +${qty} units of ${matNo} to warehouse storage.`, 'success');
  };

  // Metrics counts for Sidebar badges
  const activeExecutionCount = orders.filter((o) => ['REL', 'PCNF', 'CNF'].includes(o.status)).length;
  const urgentBreakdownsCount = orders.filter((o) => o.orderType === 'PM03' && o.status !== 'TECO').length;

  return (
    <div className="app-container">
      {/* Toast Alert Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'info' ? '#1e293b' : '#064e3b',
          color: '#ffffff',
          border: `1px solid ${toast.type === 'info' ? '#3b82f6' : '#10b981'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toast.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView}
        setView={(v) => {
          if (v === 'create_order') {
            setCreatingFromNotification(null);
          }
          setView(v);
        }}
        counts={{
          orders: orders.length,
          notifications: notifications.length,
          activeExecution: activeExecutionCount,
          materials: materials.length
        }}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <TopBar 
          currentView={currentView}
          onNewOrderClick={() => {
            setCreatingFromNotification(null);
            setView('create_order');
          }}
          onNewNotificationClick={() => setView('notifications')}
          onResetData={handleResetData}
          urgentBreakdownsCount={urgentBreakdownsCount}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* View Routing */}
        {currentView === 'orders' && (
          <WorkOrdersList 
            orders={orders}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setView('order_detail');
            }}
            onNewOrderClick={() => {
              setCreatingFromNotification(null);
              setView('create_order');
            }}
            onReleaseOrder={handleReleaseOrder}
            onOpenTimeConfirmation={(order) => setTimeConfirmOrder(order)}
            onOpenGoodsIssue={(order) => setGoodsIssueOrder(order)}
            onTecoOrder={handleTecoOrder}
          />
        )}

        {currentView === 'order_detail' && (
          <WorkOrderDetailView 
            order={orders.find((o) => o.id === selectedOrder?.id) || selectedOrder}
            onBack={() => setView('orders')}
            onReleaseOrder={handleReleaseOrder}
            onOpenTimeConfirmation={(order) => setTimeConfirmOrder(order)}
            onOpenGoodsIssue={(order) => setGoodsIssueOrder(order)}
            onTecoOrder={handleTecoOrder}
            onOpenJobCard={(order) => setJobCardOrder(order)}
          />
        )}

        {currentView === 'create_order' && (
          <CreateWorkOrderView 
            initialNotification={creatingFromNotification}
            onSaveOrder={handleSaveOrder}
            onCancel={() => {
              setCreatingFromNotification(null);
              setView('orders');
            }}
          />
        )}

        {currentView === 'notifications' && (
          <NotificationsView 
            notifications={notifications}
            onConvertNotification={handleConvertNotification}
            onAddNotification={handleAddNotification}
          />
        )}

        {currentView === 'confirmation' && (
          <ExecutionWorkbenchView 
            orders={orders}
            onOpenTimeConfirmation={(order) => setTimeConfirmOrder(order)}
            onOpenGoodsIssue={(order) => setGoodsIssueOrder(order)}
            onTecoOrder={handleTecoOrder}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setView('order_detail');
            }}
          />
        )}

        {currentView === 'preventive' && (
          <PreventiveMaintenanceView 
            onGenerateOrderFromPlan={(newOrder) => {
              setOrders([newOrder, ...orders]);
              setView('orders');
              showToast(`Preventive Work Order ${newOrder.id} generated & released (REL)!`, 'success');
            }} 
          />
        )}

        {currentView === 'permits' && (
          <PermitToWorkView />
        )}

        {currentView === 'master_data' && (
          <MasterDataView />
        )}

        {currentView === 'materials' && (
          <MaterialsView 
            materials={materials}
            orders={orders}
            onRestockMaterial={handleRestockMaterial}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView orders={orders} />
        )}
      </main>

      {/* Modals */}
      {selectedOrder && currentView !== 'order_detail' && (
        <WorkOrderDetailModal 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReleaseOrder={handleReleaseOrder}
          onOpenTimeConfirmation={(order) => setTimeConfirmOrder(order)}
          onOpenGoodsIssue={(order) => setGoodsIssueOrder(order)}
          onTecoOrder={handleTecoOrder}
          onOpenJobCard={(order) => setJobCardOrder(order)}
        />
      )}

      {jobCardOrder && (
        <PrintableJobCardModal 
          order={jobCardOrder}
          onClose={() => setJobCardOrder(null)}
        />
      )}

      {timeConfirmOrder && (
        <TimeConfirmationModal 
          order={timeConfirmOrder}
          onClose={() => setTimeConfirmOrder(null)}
          onConfirmTime={handleConfirmTime}
        />
      )}

      {goodsIssueOrder && (
        <GoodsIssueModal 
          order={goodsIssueOrder}
          onClose={() => setGoodsIssueOrder(null)}
          onPostGoodsIssue={handlePostGoodsIssue}
        />
      )}
    </div>
  );
}
