import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/Common/StatusBadge';
import { Modal } from '../../components/Common/Modal';
import { Layers, Plus, CheckCircle, Calculator, ChevronDown, ChevronRight } from 'lucide-react';

export const BOMManagement = () => {
  const [boms, setBoms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBom, setExpandedBom] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New BOM Form
  const [newBomForm, setNewBomForm] = useState({
    productCode: 'WHL-ALU-19P',
    productName: '19x8.5J Forged High-Performance Alloy Wheel',
    version: '1.0',
    baseQuantity: 1,
    components: [
      { materialCode: 'RM-ALU-A356', materialName: 'Aluminium Ingot A356.2', quantity: 14.5, uom: 'KG', scrapPercentage: 4, unitCost: 235 },
      { materialCode: 'RM-PNT-CED', materialName: 'Cathodic CED Resin', quantity: 0.8, uom: 'LTR', scrapPercentage: 2, unitCost: 420 },
      { materialCode: 'RM-HUB-FAST', materialName: 'Hub Studs Set', quantity: 1, uom: 'SET', scrapPercentage: 0, unitCost: 38 }
    ]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bomRes, matRes] = await Promise.all([
        api.getBOMs(),
        api.getMaterials()
      ]);
      setBoms(bomRes.data.data);
      setMaterials(matRes.data.data);
      if (bomRes.data.data.length > 0) {
        setExpandedBom(bomRes.data.data[0].bomNumber);
      }
    } catch (err) {
      console.error('Failed to load BOMs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBOM = async (e) => {
    e.preventDefault();
    try {
      await api.createBOM(newBomForm);
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      alert(`Error creating BOM: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Bill of Materials (BOM) & Component Engineering</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multi-level automotive component explosion, scrap factors, and automated unit standard cost calculation
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Multi-Level BOM</span>
        </button>
      </div>

      {/* BOM Cards List */}
      <div className="space-y-4">
        {boms.map((bom) => {
          const isExpanded = expandedBom === bom.bomNumber;
          return (
            <div key={bom._id || bom.bomNumber} className="sap-card overflow-hidden">
              {/* Card Header Bar */}
              <div 
                onClick={() => setExpandedBom(isExpanded ? null : bom.bomNumber)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {bom.bomNumber}
                      </span>
                      <StatusBadge status={`v${bom.version} ${bom.status}`} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {bom.productName} ({bom.productCode})
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-mono text-slate-400">Standard BOM Cost</p>
                    <p className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{bom.totalBomCost ? Math.round(bom.totalBomCost).toLocaleString() : '0'} / unit
                    </p>
                  </div>
                </div>
              </div>

              {/* Components Explosion Table */}
              {isExpanded && (
                <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Sub-Components Breakdown ({bom.components?.length || 0} items)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Approved By: {bom.approvedBy || 'Plant Head'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                          <th className="py-2 px-3 font-semibold">Material Code</th>
                          <th className="py-2 px-3 font-semibold">Component Description</th>
                          <th className="py-2 px-3 font-semibold">Type</th>
                          <th className="py-2 px-3 font-semibold text-right">Quantity</th>
                          <th className="py-2 px-3 font-semibold text-right">Scrap Rate</th>
                          <th className="py-2 px-3 font-semibold text-right">Unit Price</th>
                          <th className="py-2 px-3 font-semibold text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {bom.components?.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {comp.materialCode}
                            </td>
                            <td className="py-2.5 px-3 font-medium">{comp.materialName}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">
                                {comp.materialType || 'RM'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold">
                              {comp.quantity} {comp.uom}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-amber-600">
                              {comp.scrapPercentage}%
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono">
                              ₹{comp.unitCost}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                              ₹{Math.round(comp.totalCost).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create BOM Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Author Multi-Level Automotive BOM"
      >
        <form onSubmit={handleCreateBOM} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Product Code</label>
              <input
                type="text"
                value={newBomForm.productCode}
                onChange={(e) => setNewBomForm({ ...newBomForm, productCode: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Version</label>
              <input
                type="text"
                value={newBomForm.version}
                onChange={(e) => setNewBomForm({ ...newBomForm, version: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
            <input
              type="text"
              value={newBomForm.productName}
              onChange={(e) => setNewBomForm({ ...newBomForm, productName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Preset Components (3 items)</p>
            <ul className="space-y-1 text-slate-500 text-[11px]">
              <li>• RM-ALU-A356: 14.5 KG @ ₹235 (Scrap 4%)</li>
              <li>• RM-PNT-CED: 0.8 LTR @ ₹420 (Scrap 2%)</li>
              <li>• RM-HUB-FAST: 1 SET @ ₹38 (Scrap 0%)</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Save & Calculate BOM</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
