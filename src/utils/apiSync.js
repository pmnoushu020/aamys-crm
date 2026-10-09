// API client for syncing Work Orders and Notifications to MongoDB Atlas
const API_BASE = '/api';

export async function fetchCloudOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveCloudOrder(order) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateCloudOrder(orderId, updateData) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchCloudNotifications() {
  try {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveCloudNotification(notification) {
  try {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function updateCloudNotification(notificationNo, updateData) {
  try {
    const res = await fetch(`${API_BASE}/notifications/${notificationNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function resetCloudDatabase() {
  try {
    const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
