import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Atlas connection
let MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  // Strip surrounding quotes or whitespace that might be pasted in Render dashboard
  MONGODB_URI = MONGODB_URI.trim().replace(/^["']|["']$/g, '');
}

let isDbConnected = false;

if (MONGODB_URI && !MONGODB_URI.includes('<db_password>')) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      isDbConnected = true;
      console.log('✅ Connected to MongoDB Atlas successfully.');
    })
    .catch((err) => {
      isDbConnected = false;
      console.error('⚠️ MongoDB Atlas connection error:', err.message);
    });
} else {
  console.log('ℹ️ MONGODB_URI not configured. Running in local fallback mode.');
}

// ---------------------------------------------------------------------------
// Mongoose Models
// ---------------------------------------------------------------------------
const workOrderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    orderType: { type: String, required: true },
    title: { type: String, required: true },
    headerText: { type: String },
    equipmentId: { type: String },
    functionalLocationId: { type: String },
    notificationNo: { type: String },
    planningPlant: { type: String, default: 'PL01' },
    maintenancePlant: { type: String, default: 'PL01' },
    mainWorkCenter: { type: String, default: 'MECH_01' },
    priority: { type: String, default: 'Medium' },
    status: { type: String, default: 'CRTD' },
    basicStartDate: { type: String },
    basicFinishDate: { type: String },
    costCenter: { type: String },
    wbsElement: { type: String },
    createdBy: { type: String, default: 'Plant Engineer' },
    createdAt: { type: String },
    releasedAt: { type: String },
    tecoAt: { type: String },
    operations: { type: Array, default: [] },
    components: { type: Array, default: [] },
    permits: { type: Array, default: [] }
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    notificationNo: { type: String, required: true, unique: true },
    type: { type: String, default: 'M1' },
    title: { type: String, required: true },
    description: { type: String },
    equipmentId: { type: String },
    functionalLocationId: { type: String },
    priority: { type: String, default: 'Medium' },
    reportedBy: { type: String },
    reportedDate: { type: String },
    breakdown: { type: Boolean, default: false },
    breakdownDurationHours: { type: Number, default: 0 },
    status: { type: String, default: 'Outstanding' },
    orderId: { type: String }
  },
  { timestamps: true }
);

const WorkOrder = mongoose.models.WorkOrder || mongoose.model('WorkOrder', workOrderSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

// ---------------------------------------------------------------------------
// REST API Routes
// ---------------------------------------------------------------------------

// 1. Health check & DB Status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'online',
    appName: 'Aamys CRM',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// 2. Work Orders (IW38 / IW31 / IW32)
app.get('/api/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const orders = await WorkOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch work orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    const existing = await WorkOrder.findOne({ id: orderData.id });
    if (existing) {
      Object.assign(existing, orderData);
      await existing.save();
      return res.json(existing);
    }
    const newOrder = new WorkOrder(orderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: err.message || 'Failed to save work order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await WorkOrder.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update work order' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await WorkOrder.deleteOne({ id: req.params.id });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// 3. Notifications (IW21 / IW28)
app.get('/api/notifications', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }
    const notifs = await Notification.find().sort({ reportedDate: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notifData = req.body;
    if (!notifData.notificationNo) {
      return res.status(400).json({ error: 'Notification No is required' });
    }
    const existing = await Notification.findOne({ notificationNo: notifData.notificationNo });
    if (existing) {
      Object.assign(existing, notifData);
      await existing.save();
      return res.json(existing);
    }
    const newNotif = new Notification(notifData);
    await newNotif.save();
    res.status(201).json(newNotif);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to save notification' });
  }
});

app.put('/api/notifications/:id', async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { notificationNo: req.params.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// 4. Reset operational data
app.post('/api/reset', async (req, res) => {
  try {
    await WorkOrder.deleteMany({});
    await Notification.deleteMany({});
    res.json({ success: true, message: 'All operational data cleared from MongoDB.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// ---------------------------------------------------------------------------
// Static Files & SPA Routing
// ---------------------------------------------------------------------------
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other routes to index.html for React SPA
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aamys CRM production server listening on port ${PORT}`);
});
