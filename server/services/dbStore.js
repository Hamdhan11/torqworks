import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'smart_erp_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data store structure
let store = {
  users: [],
  customers: [],
  materials: [],
  vendors: [],
  products: [],
  boms: [],
  routings: [],
  workCentres: [],
  machines: [],
  salesOrders: [],
  productionOrders: [],
  inventory: [],
  stockMovements: [],
  purchaseRequisitions: [],
  purchaseOrders: [],
  grns: [],
  qualityInspections: [],
  maintenanceOrders: [],
  downtimeLogs: [],
  costCentres: [],
  profitCentres: [],
  costRecords: [],
  notifications: [],
  auditLogs: []
};

// Load initial data from file if present
const loadStoreFromFile = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      store = { ...store, ...parsed };
      console.log(`[Persistence Engine] Loaded data store from ${DATA_FILE}`);
    }
  } catch (err) {
    console.error(`[Persistence Engine] Error loading file store:`, err.message);
  }
};

// Save current memory state to file immediately
export const persistStoreToFile = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[Persistence Engine] Error writing file store:`, err.message);
  }
};

// Initialize file load
loadStoreFromFile();

// Matcher helper for filtering
const matchQuery = (item, query) => {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key of Object.keys(query)) {
    const queryVal = query[key];
    if (queryVal && typeof queryVal === 'object' && !Array.isArray(queryVal)) {
      if ('$in' in queryVal) {
        if (!queryVal.$in.includes(item[key])) return false;
      } else if ('$regex' in queryVal) {
        const regex = new RegExp(queryVal.$regex, queryVal.$options || 'i');
        if (!regex.test(item[key] || '')) return false;
      } else if ('$gte' in queryVal) {
        if (item[key] < queryVal.$gte) return false;
      } else if ('$lte' in queryVal) {
        if (item[key] > queryVal.$lte) return false;
      } else if ('$ne' in queryVal) {
        if (item[key] === queryVal.$ne) return false;
      }
    } else {
      if (item[key] !== queryVal) return false;
    }
  }
  return true;
};

// Generic Collection Wrapper
class StoreCollection {
  constructor(name) {
    this.name = name;
    if (!store[name]) store[name] = [];
  }

  get items() {
    return store[this.name] || [];
  }

  set items(val) {
    store[this.name] = val;
    persistStoreToFile();
  }

  async find(query = {}) {
    return this.items.filter(item => matchQuery(item, query));
  }

  async findOne(query = {}) {
    return this.items.find(item => matchQuery(item, query)) || null;
  }

  async findById(id) {
    return this.items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    const now = new Date().toISOString();
    const newItem = {
      _id: data._id || `${this.name.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: data.createdAt || now,
      updatedAt: now,
      ...data
    };
    this.items.push(newItem);
    persistStoreToFile();
    return newItem;
  }

  async insertMany(array) {
    const now = new Date().toISOString();
    const created = array.map((data, idx) => ({
      _id: data._id || `${this.name.slice(0, 3)}_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: data.createdAt || now,
      updatedAt: now,
      ...data
    }));
    this.items.push(...created);
    persistStoreToFile();
    return created;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const idx = this.items.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const existing = this.items[idx];
    const updated = {
      ...existing,
      ...update,
      updatedAt: new Date().toISOString()
    };
    this.items[idx] = updated;
    persistStoreToFile();
    return updated;
  }

  async updateOne(query, update) {
    const idx = this.items.findIndex(item => matchQuery(item, query));
    if (idx === -1) return { modifiedCount: 0 };
    this.items[idx] = {
      ...this.items[idx],
      ...update,
      updatedAt: new Date().toISOString()
    };
    persistStoreToFile();
    return { modifiedCount: 1 };
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      const count = this.items.length;
      this.items = [];
      persistStoreToFile();
      return { deletedCount: count };
    }
    const initialCount = this.items.length;
    this.items = this.items.filter(item => !matchQuery(item, query));
    persistStoreToFile();
    return { deletedCount: initialCount - this.items.length };
  }

  async countDocuments(query = {}) {
    return (await this.find(query)).length;
  }
}

// Export collections
export const collections = {
  users: new StoreCollection('users'),
  customers: new StoreCollection('customers'),
  materials: new StoreCollection('materials'),
  vendors: new StoreCollection('vendors'),
  products: new StoreCollection('products'),
  boms: new StoreCollection('boms'),
  routings: new StoreCollection('routings'),
  workCentres: new StoreCollection('workCentres'),
  machines: new StoreCollection('machines'),
  salesOrders: new StoreCollection('salesOrders'),
  productionOrders: new StoreCollection('productionOrders'),
  inventory: new StoreCollection('inventory'),
  stockMovements: new StoreCollection('stockMovements'),
  purchaseRequisitions: new StoreCollection('purchaseRequisitions'),
  purchaseOrders: new StoreCollection('purchaseOrders'),
  grns: new StoreCollection('grns'),
  qualityInspections: new StoreCollection('qualityInspections'),
  maintenanceOrders: new StoreCollection('maintenanceOrders'),
  downtimeLogs: new StoreCollection('downtimeLogs'),
  costCentres: new StoreCollection('costCentres'),
  profitCentres: new StoreCollection('profitCentres'),
  costRecords: new StoreCollection('costRecords'),
  notifications: new StoreCollection('notifications'),
  auditLogs: new StoreCollection('auditLogs')
};

export const resetStore = () => {
  for (const key of Object.keys(store)) {
    store[key] = [];
  }
  persistStoreToFile();
};
