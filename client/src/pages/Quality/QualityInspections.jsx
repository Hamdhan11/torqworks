import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DataTable } from '../../components/Common/DataTable';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Plus, 
  CheckCircle2, 
  FileText, 
  XCircle,
  Activity
} from 'lucide-react';

export const QualityInspections = () => {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);

  // Form for new QC log
  const [form, setForm] = useState({
    inspectionType: 'Final (FERT)',
    referenceDocument: 'PO-MFG-8001',
    materialOrProductCode: 'WHL-STL-22C',
    batchNumber: 'BATCH-QC-091',
    sampleSize: 10,
    inspectionStage: 'Final Dynamic Runout & Balancing Gate',
    parameter1_reading: '0.52 mm',
    parameter1_result: 'Pass',
    parameter2_reading: 'Zero defect',
    parameter2_result: 'Pass',
    overallResult: 'Accepted',
    defectCategory: 'None',
    reworkAction: ''
  });

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const res = await api.getInspections();
      setInspections(res.data.data);
    } catch (err) {
      console.error('Failed to load inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    try {
      await api.createInspection({
        inspectionType: form.inspectionType,
        referenceDocument: form.referenceDocument,
        materialOrProductCode: form.materialOrProductCode,
        batchNumber: form.batchNumber,
        sampleSize: Number(form.sampleSize),
        inspectionStage: form.inspectionStage,
        overallResult: form.overallResult,
        defectCategory: form.defectCategory,
        reworkAction: form.reworkAction,
        parametersChecked: [
          {
            parameter: 'Radial & Lateral Runout (TIR)',
            nominalValue: '< 0.8 mm',
            actualReading: form.parameter1_reading,
            result: form.parameter1_result
          },
          {
            parameter: 'Dynamic Radial Weld Integrity & Leak Test',
            nominalValue: 'Zero bubble leak at 8 bar',
            actualReading: form.parameter2_reading,
            result: form.parameter2_result
          }
        ]
      });
      setIsModalOpen(false);
      loadInspections();
    } catch (err) {
      alert(`Error recording QC inspection: ${err.response?.data?.message || err.message}`);
    }
  };

  const columns = [
    {
      header: 'Inspection #',
      accessor: 'inspectionNumber',
      render: (row) => (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
          {row.inspectionNumber}
        </span>
      )
    },
    {
      header: 'QC Type',
      accessor: 'inspectionType',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {row.inspectionType}
        </span>
      )
    },
    {
      header: 'Material / Product',
      accessor: 'materialOrProductCode',
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            {row.materialOrProductCode}
          </span>
          <p className="text-[10px] text-slate-400">Doc: {row.referenceDocument}</p>
        </div>
      )
    },
    {
      header: 'Stage Gate',
      accessor: 'inspectionStage',
      render: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {row.inspectionStage || 'Incoming Gate'}
        </span>
      )
    },
    {
      header: 'Sample Size',
      accessor: 'sampleSize',
      render: (row) => <span className="font-mono">{row.sampleSize} units</span>
    },
    {
      header: 'Result',
      accessor: 'overallResult',
      render: (row) => (
        <StatusBadge 
          status={row.overallResult} 
          variant={row.overallResult === 'Accepted' ? 'success' : row.overallResult === 'Rework Required' ? 'warning' : 'danger'} 
        />
      )
    },
    {
      header: 'Defect Category',
      accessor: 'defectCategory',
      render: (row) => (
        <span className={`text-xs font-mono ${row.defectCategory !== 'None' ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-400'}`}>
          {row.defectCategory}
        </span>
      )
    },
    {
      header: 'Inspector',
      accessor: 'inspectorName'
    },
    {
      header: 'Date',
      accessor: 'inspectionDate',
      render: (row) => (
        <span className="text-xs font-mono text-slate-400">
          {new Date(row.inspectionDate).toLocaleDateString()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Quality Management & Defect Analytics (QM)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Incoming Raw Material Verification, In-Process Welding & Runout Inspection, and Final Wheel Release
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Record Inspection Lot</span>
        </button>
      </div>

      <DataTable
        title="Quality Inspection Lots & Defect Records"
        columns={columns}
        data={inspections}
        searchPlaceholder="Search inspection #, product, or defect..."
        filterKey="overallResult"
        filterOptions={[
          { label: 'Accepted', value: 'Accepted' },
          { label: 'Rework Required', value: 'Rework Required' },
          { label: 'Rejected', value: 'Rejected' }
        ]}
      />

      {/* Record Inspection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Quality Inspection & Defect Measurement"
      >
        <form onSubmit={handleCreateInspection} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Inspection Type</label>
              <select
                value={form.inspectionType}
                onChange={(e) => setForm({ ...form, inspectionType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Incoming (GRN)">Incoming (GRN Goods Receipt)</option>
                <option value="In-Process (Production)">In-Process (Production Shop Floor)</option>
                <option value="Final (FERT)">Final Quality Gate (FERT Finished Goods)</option>
                <option value="Customer Return">Customer Return / RMA Audit</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Reference Document #</label>
              <input
                type="text"
                value={form.referenceDocument}
                onChange={(e) => setForm({ ...form, referenceDocument: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Material / Product Code</label>
              <input
                type="text"
                value={form.materialOrProductCode}
                onChange={(e) => setForm({ ...form, materialOrProductCode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Sample Size (Units)</label>
              <input
                type="number"
                value={form.sampleSize}
                onChange={(e) => setForm({ ...form, sampleSize: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Tolerance & Measurement Parameters</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Radial Runout Reading (Nominal &lt; 0.8mm)</label>
                <input
                  type="text"
                  value={form.parameter1_reading}
                  onChange={(e) => setForm({ ...form, parameter1_reading: e.target.value })}
                  className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Weld Integrity & Air Leak Check</label>
                <input
                  type="text"
                  value={form.parameter2_reading}
                  onChange={(e) => setForm({ ...form, parameter2_reading: e.target.value })}
                  className="w-full px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Overall Inspection Verdict</label>
              <select
                value={form.overallResult}
                onChange={(e) => setForm({ ...form, overallResult: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="Accepted">Accepted (Pass)</option>
                <option value="Rework Required">Rework Required</option>
                <option value="Rejected">Rejected (Scrap Disposal)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Defect Classification</label>
              <select
                value={form.defectCategory}
                onChange={(e) => setForm({ ...form, defectCategory: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="None">None (Zero Defect)</option>
                <option value="Radial Runout">Radial Runout Out of Spec</option>
                <option value="Weld Porosity">Weld Porosity / Undercut</option>
                <option value="Paint Blister">Paint Blister / CED Thickness Low</option>
                <option value="Rim Flange Dent">Rim Flange Dent / Mechanical Mark</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Record QC Verdict</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
