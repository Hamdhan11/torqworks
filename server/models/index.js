import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// User Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: [
      'Super Admin',
      'Plant Head',
      'Sales Manager',
      'Production Manager',
      'Store Manager',
      'Procurement Manager',
      'Quality Manager',
      'Maintenance Manager',
      'Finance Manager',
      'Operator'
    ]
  },
  department: { type: String, required: true },
  employeeId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

// Material Schema (RM, HALB, FERT)
const MaterialSchema = new Schema({
  materialCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  materialType: { type: String, required: true, enum: ['RM', 'HALB', 'FERT'] },
  uom: { type: String, required: true }, // KG, PCS, MTR, LTR, SET
  unitPrice: { type: Number, required: true },
  currentStock: { type: Number, default: 0 },
  allocatedStock: { type: Number, default: 0 },
  availableStock: { type: Number, default: 0 },
  safetyStock: { type: Number, default: 10 },
  reorderPoint: { type: Number, default: 20 },
  leadTimeDays: { type: Number, default: 7 },
  storageLocation: { type: String, default: 'RMS1-A01' },
  standardCost: { type: Number, required: true },
  inspectionRequired: { type: Boolean, default: true }
}, { timestamps: true });

// Vendor Schema
const VendorSchema = new Schema({
  vendorCode: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  city: { type: String },
  rating: { type: Number, default: 4.5 },
  paymentTerms: { type: String, default: 'Net 30 Days' },
  leadTimeScore: { type: Number, default: 95 },
  qualityScore: { type: Number, default: 98 },
  onTimeDeliveryRate: { type: Number, default: 94 },
  materialsSupplied: [{ type: String }]
}, { timestamps: true });

// Customer Schema
const CustomerSchema = new Schema({
  customerCode: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  creditLimit: { type: Number, default: 5000000 },
  paymentTerms: { type: String, default: 'Net 45 Days' },
  rating: { type: Number, default: 4.8 }
}, { timestamps: true });

// Product Schema
const ProductSchema = new Schema({
  productCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  wheelType: { type: String, required: true },
  sizeSpec: { type: String, required: true },
  finish: { type: String, required: true },
  pcd: { type: String, required: true },
  offsetET: { type: String, required: true },
  loadRatingKg: { type: Number, default: 850 },
  bomId: { type: String },
  routingId: { type: String },
  standardCost: { type: Number, required: true },
  sellingPrice: { type: Number, required: true }
}, { timestamps: true });

// Multi-Level BOM Schema
const BOMSchema = new Schema({
  bomNumber: { type: String, required: true, unique: true },
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  version: { type: String, default: '1.0' },
  status: { type: String, enum: ['Active', 'Draft', 'Obsolete'], default: 'Active' },
  baseQuantity: { type: Number, default: 1 },
  components: [{
    materialCode: { type: String, required: true },
    materialName: { type: String, required: true },
    materialType: { type: String, enum: ['RM', 'HALB', 'FERT'], required: true },
    quantity: { type: Number, required: true },
    uom: { type: String, required: true },
    scrapPercentage: { type: Number, default: 2 },
    unitCost: { type: Number, required: true },
    totalCost: { type: Number, required: true }
  }],
  totalBomCost: { type: Number, required: true },
  validFrom: { type: Date, default: Date.now },
  approvedBy: { type: String }
}, { timestamps: true });

// Routing Schema (Rim -> Disc -> Assembly -> Heat Treatment -> Painting -> Quality Inspection -> Packing)
const RoutingSchema = new Schema({
  routingNumber: { type: String, required: true, unique: true },
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  version: { type: String, default: '1.0' },
  operations: [{
    sequence: { type: Number, required: true },
    stageName: { 
      type: String, 
      required: true,
      enum: ['Rim', 'Disc', 'Assembly', 'Heat Treatment', 'Painting', 'Quality Inspection', 'Packing']
    },
    workCentreCode: { type: String, required: true },
    machineRequired: { type: String, required: true },
    setupTimeMin: { type: Number, default: 15 },
    cycleTimeMin: { type: Number, required: true },
    laborHours: { type: Number, default: 0.5 },
    costPerHour: { type: Number, default: 450 }
  }],
  totalCycleTimeMin: { type: Number },
  totalRoutingCost: { type: Number }
}, { timestamps: true });

// Sales Order Schema
const SalesOrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerCode: { type: String, required: true },
  customerName: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date, required: true },
  items: [{
    productCode: { type: String, required: true },
    productName: { type: String, required: true },
    orderedQuantity: { type: Number, required: true },
    deliveredQuantity: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['Confirmed', 'Production Scheduled', 'In Production', 'Quality Approved', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  shippingCarrier: { type: String, default: 'LogiTrans Automotive Express' },
  trackingNumber: { type: String }
}, { timestamps: true });

// Production Order Schema
const ProductionOrderSchema = new Schema({
  productionOrderNumber: { type: String, required: true, unique: true },
  salesOrderNumber: { type: String, required: true },
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  quantityToProduce: { type: Number, required: true },
  completedQuantity: { type: Number, default: 0 },
  scrappedQuantity: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  currentStage: { 
    type: String, 
    enum: ['Rim', 'Disc', 'Assembly', 'Heat Treatment', 'Painting', 'Quality Inspection', 'Packing', 'Completed'],
    default: 'Rim'
  },
  status: { 
    type: String, 
    enum: ['Created', 'BOM Verified', 'MRP Checked', 'Released', 'In Progress', 'Technical Complete (TECO)', 'Closed'],
    default: 'Created'
  },
  assignedWorkCentre: { type: String },
  assignedMachine: { type: String },
  shift: { type: String, default: 'Shift A (Morning)' },
  stageHistory: [{
    stage: { type: String },
    enteredAt: { type: Date },
    completedAt: { type: Date },
    operator: { type: String },
    acceptedQty: { type: Number },
    rejectedQty: { type: Number },
    notes: { type: String }
  }],
  actualCostAccumulated: { type: Number, default: 0 }
}, { timestamps: true });

// Machine Master
const MachineSchema = new Schema({
  machineCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  workCentreCode: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Operational', 'Running', 'Under Maintenance', 'Breakdown', 'Idle'], default: 'Operational' },
  healthScore: { type: Number, default: 95 },
  lastMaintenanceDate: { type: Date },
  nextScheduledMaintenance: { type: Date },
  mtbfHours: { type: Number, default: 420 },
  mttrHours: { type: Number, default: 3.2 },
  totalDowntimeHours: { type: Number, default: 12.5 }
}, { timestamps: true });

// Work Centre
const WorkCentreSchema = new Schema({
  workCentreCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  capacityPerShift: { type: Number, default: 250 },
  availableMachines: [{ type: String }],
  costPerHour: { type: Number, default: 450 },
  efficiencyPercentage: { type: Number, default: 92 }
}, { timestamps: true });

// Purchase Requisition (PR)
const PRSchema = new Schema({
  prNumber: { type: String, required: true, unique: true },
  requestedBy: { type: String, required: true },
  department: { type: String, required: true },
  requiredByDate: { type: Date, required: true },
  items: [{
    materialCode: { type: String, required: true },
    materialName: { type: String, required: true },
    requiredQuantity: { type: Number, required: true },
    uom: { type: String, required: true },
    estimatedUnitCost: { type: Number, required: true },
    estimatedTotalCost: { type: Number, required: true },
    reasonForRequisition: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Pending Approval', 'Approved', 'PO Created', 'Rejected'], default: 'Pending Approval' },
  approvedBy: { type: String },
  approvalDate: { type: Date }
}, { timestamps: true });

// Purchase Order (PO)
const POSchema = new Schema({
  poNumber: { type: String, required: true, unique: true },
  prNumber: { type: String },
  vendorCode: { type: String, required: true },
  vendorName: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date, required: true },
  items: [{
    materialCode: { type: String, required: true },
    materialName: { type: String, required: true },
    orderedQuantity: { type: Number, required: true },
    receivedQuantity: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Draft', 'Submitted', 'Vendor Acknowledged', 'Partially Received', 'Received', 'Cancelled'], default: 'Submitted' }
}, { timestamps: true });

// Goods Receipt Note (GRN)
const GRNSchema = new Schema({
  grnNumber: { type: String, required: true, unique: true },
  poNumber: { type: String, required: true },
  vendorCode: { type: String, required: true },
  vendorName: { type: String, required: true },
  receiptDate: { type: Date, default: Date.now },
  invoiceNumber: { type: String, required: true },
  items: [{
    materialCode: { type: String, required: true },
    materialName: { type: String, required: true },
    receivedQuantity: { type: Number, required: true },
    acceptedQuantity: { type: Number, required: true },
    rejectedQuantity: { type: Number, default: 0 },
    batchNumber: { type: String, required: true },
    storageLocation: { type: String, required: true }
  }],
  receivedBy: { type: String, required: true },
  inspectionStatus: { type: String, enum: ['Pending QC', 'QC Passed', 'QC Rejected'], default: 'QC Passed' }
}, { timestamps: true });

// Quality Inspection
const QualityInspectionSchema = new Schema({
  inspectionNumber: { type: String, required: true, unique: true },
  inspectionType: { type: String, enum: ['Incoming (GRN)', 'In-Process (Production)', 'Final (FERT)', 'Customer Return'], required: true },
  referenceDocument: { type: String, required: true },
  materialOrProductCode: { type: String, required: true },
  batchNumber: { type: String, required: true },
  sampleSize: { type: Number, required: true },
  inspectionStage: { type: String },
  parametersChecked: [{
    parameter: { type: String, required: true },
    nominalValue: { type: String, required: true },
    minTolerance: { type: String },
    maxTolerance: { type: String },
    actualReading: { type: String, required: true },
    result: { type: String, enum: ['Pass', 'Fail'], required: true }
  }],
  overallResult: { type: String, enum: ['Accepted', 'Rejected', 'Rework Required'], required: true },
  defectCategory: { type: String, default: 'None' },
  reworkAction: { type: String },
  inspectorName: { type: String, required: true },
  inspectionDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Maintenance Order
const MaintenanceOrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  machineCode: { type: String, required: true },
  machineName: { type: String, required: true },
  maintenanceType: { type: String, enum: ['Preventive', 'Breakdown', 'Predictive'], required: true },
  scheduledDate: { type: Date },
  completionDate: { type: Date },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Emergency'], default: 'Medium' },
  reportedIssue: { type: String },
  actionTaken: { type: String },
  downtimeHours: { type: Number, default: 0 },
  sparePartsUsed: [{
    materialCode: { type: String },
    quantity: { type: Number },
    cost: { type: Number }
  }],
  laborCost: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed', 'Cancelled'], default: 'Open' },
  technicianName: { type: String }
}, { timestamps: true });

// Cost Center & Profit Center Schemas
const CostCenterSchema = new Schema({
  costCenterCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  monthlyBudget: { type: Number, required: true },
  actualExpenditure: { type: Number, default: 0 },
  variance: { type: Number, default: 0 }
}, { timestamps: true });

const ProfitCenterSchema = new Schema({
  profitCenterCode: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  division: { type: String, required: true },
  revenueTarget: { type: Number, required: true },
  actualRevenue: { type: Number, default: 0 },
  directCosts: { type: Number, default: 0 },
  grossMarginPercentage: { type: Number, default: 0 }
}, { timestamps: true });

const CostRecordSchema = new Schema({
  recordNumber: { type: String, required: true, unique: true },
  productionOrderNumber: { type: String, required: true },
  productCode: { type: String, required: true },
  standardMaterialCost: { type: Number, required: true },
  actualMaterialCost: { type: Number, required: true },
  standardLaborCost: { type: Number, required: true },
  actualLaborCost: { type: Number, required: true },
  standardOverheadCost: { type: Number, required: true },
  actualOverheadCost: { type: Number, required: true },
  totalStandardCost: { type: Number, required: true },
  totalActualCost: { type: Number, required: true },
  costVariance: { type: Number, required: true },
  variancePercentage: { type: Number, required: true },
  status: { type: String, default: 'Analyzed' }
}, { timestamps: true });

export const Models = {
  User: model('User', UserSchema),
  Material: model('Material', MaterialSchema),
  Vendor: model('Vendor', VendorSchema),
  Customer: model('Customer', CustomerSchema),
  Product: model('Product', ProductSchema),
  BOM: model('BOM', BOMSchema),
  Routing: model('Routing', RoutingSchema),
  SalesOrder: model('SalesOrder', SalesOrderSchema),
  ProductionOrder: model('ProductionOrder', ProductionOrderSchema),
  Machine: model('Machine', MachineSchema),
  WorkCentre: model('WorkCentre', WorkCentreSchema),
  PR: model('PR', PRSchema),
  PO: model('PO', POSchema),
  GRN: model('GRN', GRNSchema),
  QualityInspection: model('QualityInspection', QualityInspectionSchema),
  MaintenanceOrder: model('MaintenanceOrder', MaintenanceOrderSchema),
  CostCenter: model('CostCenter', CostCenterSchema),
  ProfitCenter: model('ProfitCenter', ProfitCenterSchema),
  CostRecord: model('CostRecord', CostRecordSchema)
};
