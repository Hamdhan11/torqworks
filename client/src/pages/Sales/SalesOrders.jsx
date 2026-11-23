import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { 
  ShoppingCart, 
  Plus, 
  Users, 
  Truck, 
  CheckCircle2, 
  Calendar,
  Building2
} from 'lucide-react';

export const SalesOrders = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'customers'
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Forms
  const [newOrderForm, setNewOrderForm] = useState({
    customerCode: 'CUST-TATA-CV',
    productCode: 'WHL-STL-22C',
    productName: '22.5x9.00 Heavy Commercial Steel Wheel',
    quantity: 350,
    unitPrice: 11500,
    deliveryDate: '',
    priority: 'Normal'
  });

  const [newCustomerForm, setNewCustomerForm] = useState({
    customerCode: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    creditLimit: 10000000,
    paymentTerms: 'Net 30 Days'
  });

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const [ordRes, custRes] = await Promise.all([
        api.getSalesOrders(),
        api.getCustomers()
      ]);
      setOrders(ordRes.data.data);
      setCustomers(custRes.data.data);
    } catch (err) {
      console.error('Failed to load sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await api.createSalesOrder({
        customerCode: newOrderForm.customerCode,
        deliveryDate: newOrderForm.deliveryDate,
        priority: newOrderForm.priority,
        items: [
          {
            productCode: newOrderForm.productCode,
            productName: newOrderForm.productName,
            orderedQuantity: Number(newOrderForm.quantity),
            unitPrice: Number(newOrderForm.unitPrice)
          }
        ]
      });
      setIsOrderModalOpen(false);
      loadSalesData();
    } catch (err) {
      alert(`Error creating order: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(newCustomerForm);
      setIsCustomerModalOpen(false);
      loadSalesData();
    } catch (err) {
      alert(`Error creating customer: ${err.response?.data?.message || err.message}`);
    }
  };

  const orderColumns = [
    {
      header: 'Order #',
      accessor: 'orderNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.orderNumber}
        </span>
      )
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.customerName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{row.customerCode}</span>
        </div>
      )
    },
    {
      header: 'Product Ordered',
      accessor: 'items',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {row.items?.[0]?.productName || 'Wheel Assembly'}
          </p>
          <span className="text-[10px] font-mono text-slate-400">
            Qty: {row.items?.[0]?.orderedQuantity} pcs
          </span>
        </div>
      )
    },
    {
      header: 'Total Order Value',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          ₹{row.totalAmount ? row.totalAmount.toLocaleString() : '0'}
        </span>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
          row.priority === 'Urgent' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
          row.priority === 'High' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }`}>
          {row.priority}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'orderStatus',
      render: (row) => <StatusBadge status={row.orderStatus} />
    },
    {
      header: 'Scheduled Delivery',
      accessor: 'deliveryDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-500">
          {row.deliveryDate ? new Date(row.deliveryDate).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  const customerColumns = [
    {
      header: 'Customer Code',
      accessor: 'customerCode',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.customerCode}
        </span>
      )
    },
    {
      header: 'Company Name',
      accessor: 'companyName',
      render: (row) => <span className="font-semibold">{row.companyName}</span>
    },
    {
      header: 'Contact Person',
      accessor: 'contactPerson'
    },
    {
      header: 'City / Plant',
      accessor: 'city'
    },
    {
      header: 'Credit Limit',
      accessor: 'creditLimit',
      render: (row) => (
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
          ₹{(row.creditLimit / 10000000).toFixed(2)} Cr
        </span>
      )
    },
    {
      header: 'Payment Terms',
      accessor: 'paymentTerms'
    },
    {
      header: 'Vendor Rating',
      accessor: 'rating',
      render: (row) => (
        <span className="font-mono font-bold text-amber-500">
          ★ {row.rating}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>Sales & Distribution Management (SD)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Customer Master, OEM Commercial Contracts, and Delivery Scheduling
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'orders' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Customer Orders
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'customers' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Customer Master
            </button>
          </div>

          <button
            onClick={() => activeTab === 'orders' ? setIsOrderModalOpen(true) : setIsCustomerModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'orders' ? 'New Customer Order' : 'New Customer'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <DataTable
          title="OEM Customer Sales Orders Ledger"
          columns={orderColumns}
          data={orders}
          searchPlaceholder="Search order #, customer, or product..."
          filterKey="orderStatus"
          filterOptions={[
            { label: 'Confirmed', value: 'Confirmed' },
            { label: 'Production Scheduled', value: 'Production Scheduled' },
            { label: 'In Production', value: 'In Production' },
            { label: 'Quality Approved', value: 'Quality Approved' },
            { label: 'Dispatched', value: 'Dispatched' }
          ]}
        />
      ) : (
        <DataTable
          title="Automotive OEM Customer Master"
          columns={customerColumns}
          data={customers}
          searchPlaceholder="Search company name, contact, or city..."
        />
      )}

      {/* New Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Create OEM Customer Sales Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Select Customer</label>
            <select
              value={newOrderForm.customerCode}
              onChange={(e) => setNewOrderForm({ ...newOrderForm, customerCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              {customers.map(c => (
                <option key={c.customerCode} value={c.customerCode}>{c.companyName} ({c.customerCode})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Wheel Product Specification</label>
            <select
              value={newOrderForm.productCode}
              onChange={(e) => {
                const prodMap = {
                  'WHL-STL-22C': { name: '22.5x9.00 Heavy Commercial Steel Wheel', price: 11500 },
                  'WHL-ALU-16D': { name: '16x6.5J Diamond Cut Tubeless Alloy Wheel', price: 6800 },
                  'WHL-ALU-17S': { name: '17x7.0J Silver Metallic Premium Alloy', price: 8400 },
                  'WHL-ALU-19P': { name: '19x8.5J Forged High-Performance Alloy', price: 16500 }
                };
                const sel = prodMap[e.target.value];
                setNewOrderForm({
                  ...newOrderForm,
                  productCode: e.target.value,
                  productName: sel.name,
                  unitPrice: sel.price
                });
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="WHL-STL-22C">WHL-STL-22C (22.5x9.00 Heavy Commercial Steel Wheel - ₹11,500)</option>
              <option value="WHL-ALU-16D">WHL-ALU-16D (16x6.5J Diamond Cut Alloy Wheel - ₹6,800)</option>
              <option value="WHL-ALU-17S">WHL-ALU-17S (17x7.0J Silver Metallic Premium - ₹8,400)</option>
              <option value="WHL-ALU-19P">WHL-ALU-19P (19x8.5J Forged Monoblock Alloy - ₹16,500)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity (PCS)</label>
              <input
                type="number"
                value={newOrderForm.quantity}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Order Priority</label>
              <select
                value={newOrderForm.priority}
                onChange={(e) => setNewOrderForm({ ...newOrderForm, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-blue-900 dark:text-blue-200">Total Calculated Order Value:</span>
            <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-300">
              ₹{(newOrderForm.quantity * newOrderForm.unitPrice).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Sales Order</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* New Customer Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Register OEM Customer in Master"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Customer Code</label>
              <input
                type="text"
                value={newCustomerForm.customerCode}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customerCode: e.target.value })}
                placeholder="e.g. CUST-VOLVO-IND"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                value={newCustomerForm.companyName}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, companyName: e.target.value })}
                placeholder="e.g. Volvo Commercial Vehicles"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
              <input
                type="text"
                value={newCustomerForm.contactPerson}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, contactPerson: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">City / Plant Location</label>
              <input
                type="text"
                value={newCustomerForm.city}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Save Customer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
