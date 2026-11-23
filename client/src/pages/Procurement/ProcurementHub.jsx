import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { 
  Truck, 
  FileCheck, 
  PackageCheck, 
  Plus, 
  Check, 
  X, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const ProcurementHub = () => {
  const [activeTab, setActiveTab] = useState('prs'); // 'prs', 'pos', 'grns', 'vendors'
  const [prs, setPrs] = useState([]);
  const [pos, setPos] = useState([]);
  const [grns, setGrns] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isGRNModalOpen, setIsGRNModalOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  // PO Form from PR
  const [poForm, setPoForm] = useState({
    vendorCode: 'VND-JSW-STEEL',
    expectedDeliveryDate: ''
  });

  // GRN Form from PO
  const [grnForm, setGrnForm] = useState({
    invoiceNumber: '',
    storageLocation: 'RMS1-A01',
    receivedQuantity: 0
  });

  useEffect(() => {
    loadProcurementData();
  }, []);

  const loadProcurementData = async () => {
    try {
      setLoading(true);
      const [prsRes, posRes, grnsRes, vndRes] = await Promise.all([
        api.getPRs(),
        api.getPOs(),
        api.getGRNs(),
        api.getVendors()
      ]);
      setPrs(prsRes.data.data);
      setPos(posRes.data.data);
      setGrns(grnsRes.data.data);
      setVendors(vndRes.data.data);
    } catch (err) {
      console.error('Failed to load procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePR = async (prId, action) => {
    try {
      await api.approvePR(prId, action);
      loadProcurementData();
    } catch (err) {
      alert(`Approval error: ${err.response?.data?.message || err.message}`);
    }
  };

  const openCreatePOModal = (pr) => {
    setSelectedPR(pr);
    setIsPOModalOpen(true);
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    if (!selectedPR) return;
    try {
      await api.createPOFromPR({
        prId: selectedPR._id,
        vendorCode: poForm.vendorCode,
        expectedDeliveryDate: poForm.expectedDeliveryDate
      });
      setIsPOModalOpen(false);
      setActiveTab('pos');
      loadProcurementData();
    } catch (err) {
      alert(`Create PO error: ${err.response?.data?.message || err.message}`);
    }
  };

  const openReceiveGRNModal = (po) => {
    setSelectedPO(po);
    setGrnForm({
      invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
      storageLocation: 'RMS1-A01',
      receivedQuantity: po.items?.[0]?.orderedQuantity || 100
    });
    setIsGRNModalOpen(true);
  };

  const handleCreateGRN = async (e) => {
    e.preventDefault();
    if (!selectedPO) return;
    try {
      const item = selectedPO.items?.[0];
      await api.createGRN({
        poNumber: selectedPO.poNumber,
        invoiceNumber: grnForm.invoiceNumber,
        storageLocation: grnForm.storageLocation,
        items: [
          {
            materialCode: item.materialCode,
            materialName: item.materialName,
            receivedQuantity: Number(grnForm.receivedQuantity),
            acceptedQuantity: Number(grnForm.receivedQuantity),
            rejectedQuantity: 0
          }
        ]
      });
      setIsGRNModalOpen(false);
      setActiveTab('grns');
      loadProcurementData();
    } catch (err) {
      alert(`Create GRN error: ${err.response?.data?.message || err.message}`);
    }
  };

  // PR Columns
  const prColumns = [
    {
      header: 'PR #',
      accessor: 'prNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.prNumber}
        </span>
      )
    },
    {
      header: 'Department / Requester',
      accessor: 'department',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.department}</p>
          <span className="text-[10px] text-slate-400">{row.requestedBy}</span>
        </div>
      )
    },
    {
      header: 'Items Requested',
      accessor: 'items',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {row.items?.[0]?.materialName}
          </p>
          <span className="text-[10px] font-mono text-slate-400">
            {row.items?.length > 1 ? `+${row.items.length - 1} other items • ` : ''}
            Qty: {row.items?.[0]?.requiredQuantity} {row.items?.[0]?.uom}
          </span>
        </div>
      )
    },
    {
      header: 'Total Est. Value',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          ₹{row.totalAmount ? row.totalAmount.toLocaleString() : '0'}
        </span>
      )
    },
    {
      header: 'Approval Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Workflow Actions',
      accessor: '_id',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Pending Approval' && (
            <>
              <button
                onClick={() => handleApprovePR(row._id, 'Approved')}
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
              >
                <Check className="w-3 h-3" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => handleApprovePR(row._id, 'Rejected')}
                className="px-2 py-1 text-xs rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          )}

          {row.status === 'Approved' && (
            <button
              onClick={() => openCreatePOModal(row)}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
            >
              <span>Convert to PO</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {row.status === 'PO Created' && (
            <span className="text-[11px] text-slate-400 font-mono">PO Generated</span>
          )}
        </div>
      )
    }
  ];

  // PO Columns
  const poColumns = [
    {
      header: 'PO #',
      accessor: 'poNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.poNumber}
        </span>
      )
    },
    {
      header: 'PR Ref',
      accessor: 'prNumber',
      render: (row) => <span className="font-mono text-slate-500">{row.prNumber || 'Manual'}</span>
    },
    {
      header: 'Vendor Name',
      accessor: 'vendorName',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{row.vendorName}</p>
          <span className="text-[10px] text-slate-400 font-mono">{row.vendorCode}</span>
        </div>
      )
    },
    {
      header: 'PO Total',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-mono font-bold">₹{row.totalAmount?.toLocaleString()}</span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Delivery Expectation',
      accessor: 'expectedDeliveryDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-500">
          {row.expectedDeliveryDate ? new Date(row.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        row.status !== 'Received' ? (
          <button
            onClick={() => openReceiveGRNModal(row)}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 shadow-sm transition-colors"
          >
            <PackageCheck className="w-3 h-3" />
            <span>Create GRN</span>
          </button>
        ) : (
          <span className="text-[11px] text-emerald-600 font-bold font-mono">Completed</span>
        )
      )
    }
  ];

  // GRN Columns
  const grnColumns = [
    {
      header: 'GRN #',
      accessor: 'grnNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.grnNumber}
        </span>
      )
    },
    {
      header: 'PO Reference',
      accessor: 'poNumber',
      render: (row) => <span className="font-mono">{row.poNumber}</span>
    },
    {
      header: 'Vendor',
      accessor: 'vendorName'
    },
    {
      header: 'Invoice #',
      accessor: 'invoiceNumber',
      render: (row) => <span className="font-mono text-slate-500">{row.invoiceNumber}</span>
    },
    {
      header: 'QC Inspection',
      accessor: 'inspectionStatus',
      render: (row) => <StatusBadge status={row.inspectionStatus} />
    },
    {
      header: 'Received Date',
      accessor: 'receiptDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-400">
          {new Date(row.receiptDate).toLocaleDateString()}
        </span>
      )
    }
  ];

  // Vendor Columns
  const vendorColumns = [
    {
      header: 'Vendor Code',
      accessor: 'vendorCode',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.vendorCode}
        </span>
      )
    },
    {
      header: 'Company Name',
      accessor: 'companyName',
      render: (row) => <span className="font-semibold">{row.companyName}</span>
    },
    {
      header: 'Supplied Materials',
      accessor: 'materialsSupplied',
      render: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.materialsSupplied?.map((m, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              {m}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Lead Time Score',
      accessor: 'leadTimeScore',
      render: (row) => <span className="font-mono font-bold text-emerald-600">{row.leadTimeScore}%</span>
    },
    {
      header: 'Quality Score',
      accessor: 'qualityScore',
      render: (row) => <span className="font-mono font-bold text-blue-600">{row.qualityScore}%</span>
    },
    {
      header: 'Vendor Rating',
      accessor: 'rating',
      render: (row) => <span className="font-mono font-bold text-amber-500">★ {row.rating}</span>
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>Procurement & Purchasing Lifecycle (MM-PUR)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Purchase Requisitions (PR) → Approvals → Purchase Orders (PO) → Goods Receipt (GRN) → Stock & QC
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs">
          <button
            onClick={() => setActiveTab('prs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'prs' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Requisitions (PR)
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'pos' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Purchase Orders (PO)
          </button>
          <button
            onClick={() => setActiveTab('grns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'grns' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Goods Receipts (GRN)
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'vendors' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Vendor Master
          </button>
        </div>
      </div>

      {activeTab === 'prs' && (
        <DataTable
          title="Purchase Requisitions & Plant Head Approvals"
          columns={prColumns}
          data={prs}
          searchPlaceholder="Search PR #, requester, or department..."
          filterKey="status"
          filterOptions={[
            { label: 'Pending Approval', value: 'Pending Approval' },
            { label: 'Approved', value: 'Approved' },
            { label: 'PO Created', value: 'PO Created' },
            { label: 'Rejected', value: 'Rejected' }
          ]}
        />
      )}

      {activeTab === 'pos' && (
        <DataTable
          title="Active Purchase Orders (PO) to Vendors"
          columns={poColumns}
          data={pos}
          searchPlaceholder="Search PO #, vendor, or material..."
        />
      )}

      {activeTab === 'grns' && (
        <DataTable
          title="Goods Receipt Notes (GRN) & Inward Receiving Inspection"
          columns={grnColumns}
          data={grns}
          searchPlaceholder="Search GRN #, invoice, or vendor..."
        />
      )}

      {activeTab === 'vendors' && (
        <DataTable
          title="Automotive Tier-1 / Tier-2 Vendor Master"
          columns={vendorColumns}
          data={vendors}
          searchPlaceholder="Search vendor name, contact or city..."
        />
      )}

      {/* Convert PR to PO Modal */}
      <Modal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        title={`Generate Purchase Order from ${selectedPR?.prNumber}`}
      >
        <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl">
            <p className="font-semibold text-blue-900 dark:text-blue-200">
              PR Approved Value: <strong className="font-mono">₹{selectedPR?.totalAmount?.toLocaleString()}</strong>
            </p>
            <p className="text-blue-700 dark:text-blue-400 text-[11px] mt-0.5">
              Items: {selectedPR?.items?.map(i => `${i.materialCode} (${i.requiredQuantity} ${i.uom})`).join(', ')}
            </p>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Select Automotive Vendor</label>
            <select
              value={poForm.vendorCode}
              onChange={(e) => setPoForm({ ...poForm, vendorCode: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              {vendors.map(v => (
                <option key={v.vendorCode} value={v.vendorCode}>
                  {v.companyName} (Rating: {v.rating}★, OTD: {v.onTimeDeliveryRate}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Delivery Date</label>
            <input
              type="date"
              value={poForm.expectedDeliveryDate}
              onChange={(e) => setPoForm({ ...poForm, expectedDeliveryDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsPOModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Issue Purchase Order</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Create GRN Modal */}
      <Modal
        isOpen={isGRNModalOpen}
        onClose={() => setIsGRNModalOpen(false)}
        title={`Receive Goods & Generate GRN: ${selectedPO?.poNumber}`}
      >
        <form onSubmit={handleCreateGRN} className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              Vendor: {selectedPO?.vendorName}
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5">
              Ordered: {selectedPO?.items?.[0]?.orderedQuantity} units of {selectedPO?.items?.[0]?.materialName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Vendor Invoice Number</label>
              <input
                type="text"
                value={grnForm.invoiceNumber}
                onChange={(e) => setGrnForm({ ...grnForm, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Received Quantity</label>
              <input
                type="number"
                value={grnForm.receivedQuantity}
                onChange={(e) => setGrnForm({ ...grnForm, receivedQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Receiving Storage Location</label>
            <select
              value={grnForm.storageLocation}
              onChange={(e) => setGrnForm({ ...grnForm, storageLocation: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            >
              <option value="RMS1-A01">RMS1-A01 (Raw Material Steel Coils Yard)</option>
              <option value="RMS1-B02">RMS1-B02 (Aluminium Ingot Bay)</option>
              <option value="CHM-STOR-01">CHM-STOR-01 (Chemical & Paint Store)</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Automatic Action: Creating GRN will update inventory and trigger Incoming QC Inspection lot.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsGRNModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Confirm Receipt & Update Stock</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
