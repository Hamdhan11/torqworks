import http from 'http';
import { collections } from '../services/dbStore.js';

const BASE_URL = 'http://localhost:5000/api';

const request = (path, method = 'GET', body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });

    req.on('error', err => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

export const runIntegrationTest = async () => {
  console.log('================================================================');
  console.log('🏭 RUNNING SMARTMANUFACTURE ERP END-TO-END INTEGRATION TEST SUITE');
  console.log('================================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, extra = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName} ${extra ? `(${extra})` : ''}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${extra ? `(${extra})` : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const health = await request('/health');
    assert(health.status === 200 && health.body.status === 'ONLINE', 'System Health Check', `DB: ${health.body.database?.type}`);

    // 2. Authentication
    const loginRes = await request('/auth/login', 'POST', { username: 'admin', password: 'password123' });
    assert(loginRes.status === 200 && loginRes.body.token, 'User Authentication (admin / Super Admin)', `Token received`);
    const token = loginRes.body.token;

    // 3. Sales Management (SD)
    const soRes = await request('/sales/orders', 'GET', null, token);
    assert(soRes.status === 200 && Array.isArray(soRes.body.data), 'Sales Orders Fetch (SD)', `${soRes.body.data.length} orders found`);

    const newSoRes = await request('/sales/orders', 'POST', {
      customerCode: 'CUST-TATA-CV',
      deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      priority: 'High',
      items: [
        {
          productCode: 'WHL-STL-22C',
          productName: '22.5x9.00 Heavy Commercial Steel Wheel',
          orderedQuantity: 200,
          unitPrice: 11500
        }
      ]
    }, token);
    assert(newSoRes.status === 201 && newSoRes.body.data.orderNumber, 'Create OEM Sales Order (SD)', `Order #: ${newSoRes.body.data.orderNumber}`);

    // 4. Materials Management (MM)
    const matRes = await request('/materials', 'GET', null, token);
    assert(matRes.status === 200 && matRes.body.data.length >= 10, 'Materials Master Fetch (MM)', `${matRes.body.data.length} items (RM, HALB, FERT)`);

    // 5. Bill of Materials (BOM)
    const bomRes = await request('/bom', 'GET', null, token);
    assert(bomRes.status === 200 && bomRes.body.data.length >= 2, 'BOM Component Explosion', `${bomRes.body.data.length} active BOMs`);

    // 6. Material Requirement Planning (MRP)
    const mrpRes = await request('/mrp/run', 'GET', null, token);
    assert(mrpRes.status === 200 && mrpRes.body.data.shortagesCount > 0, 'MRP Shortage Detection', `${mrpRes.body.data.shortagesCount} material shortages detected`);

    // 7. Procurement (MM-PUR): Auto PR Generation -> Approval -> PO -> GRN -> Stock Update
    const shortages = mrpRes.body.data.shortages;
    const autoPrRes = await request('/mrp/generate-pr', 'POST', { shortageItems: shortages }, token);
    assert(autoPrRes.status === 201 && autoPrRes.body.data.prNumber, 'Auto-PR Generation from MRP Shortages', `PR #: ${autoPrRes.body.data.prNumber}`);
    const generatedPR = autoPrRes.body.data;

    // Approve PR
    const approveRes = await request(`/procurement/prs/${generatedPR._id}/approve`, 'PUT', { action: 'Approved' }, token);
    assert(approveRes.status === 200 && approveRes.body.data.status === 'Approved', 'Plant Head PR Executive Approval', `Status: Approved`);

    // Convert to PO
    const poRes = await request('/procurement/pos/from-pr', 'POST', {
      prId: generatedPR._id,
      vendorCode: 'VND-JSW-STEEL',
      expectedDeliveryDate: new Date(Date.now() + 5 * 86400000).toISOString()
    }, token);
    assert(poRes.status === 201 && poRes.body.data.poNumber, 'Issue Purchase Order (PO) to Vendor', `PO #: ${poRes.body.data.poNumber}`);
    const generatedPO = poRes.body.data;

    // Create GRN (Goods Receipt)
    const grnRes = await request('/procurement/grns', 'POST', {
      poNumber: generatedPO.poNumber,
      invoiceNumber: `INV-TEST-${Date.now().toString().slice(-4)}`,
      storageLocation: 'RMS1-A01',
      items: [
        {
          materialCode: generatedPO.items[0].materialCode,
          materialName: generatedPO.items[0].materialName,
          receivedQuantity: 5000,
          acceptedQuantity: 5000,
          rejectedQuantity: 0
        }
      ]
    }, token);
    assert(grnRes.status === 201 && grnRes.body.data.grnNumber, 'Goods Receipt Note (GRN) & Inward Stock Posting', `GRN #: ${grnRes.body.data.grnNumber}`);

    // Verify Incoming QC inspection was auto-triggered
    const qcRes = await request('/quality/inspections', 'GET', null, token);
    const triggeredQC = qcRes.body.data.find(q => q.referenceDocument === grnRes.body.data.grnNumber);
    assert(!!triggeredQC, 'Automated Incoming QC Lot Trigger from GRN', `QC Lot: ${triggeredQC?.inspectionNumber}`);

    // 8. Production Planning (PP): Create Order -> Release -> 7 Stages Execution
    const prodRes = await request('/production/orders', 'POST', {
      salesOrderNumber: newSoRes.body.data.orderNumber,
      productCode: 'WHL-STL-22C',
      quantityToProduce: 150,
      shift: 'Shift A (Morning)'
    }, token);
    assert(prodRes.status === 201 && prodRes.body.data.productionOrderNumber, 'Create Shop Floor Production Order', `PO #: ${prodRes.body.data.productionOrderNumber}`);
    const prodOrder = prodRes.body.data;

    // Release order
    const releaseRes = await request(`/production/orders/${prodOrder._id}/release`, 'PUT', null, token);
    assert(releaseRes.status === 200 && releaseRes.body.data.status === 'Released', 'Order Release & BOM Material Allocation', `Status: Released`);

    // Advance through the 7 stages: Rim -> Disc -> Assembly -> Heat Treatment -> Painting -> Quality Inspection -> Packing -> Completed
    const stages = ['Rim', 'Disc', 'Assembly', 'Heat Treatment', 'Painting', 'Quality Inspection', 'Packing'];
    let currentOrder = releaseRes.body.data;

    for (let i = 0; i < stages.length; i++) {
      const stageName = stages[i];
      const advRes = await request(`/production/orders/${currentOrder._id}/advance`, 'PUT', {
        acceptedQty: 148,
        rejectedQty: 2,
        notes: `Automated test gate sign-off for ${stageName}`
      }, token);
      assert(advRes.status === 200, `Stage Gate Advance: ${stageName} → ${i === stages.length - 1 ? 'Completed (FERT)' : stages[i + 1]}`, `Accepted: 148, Scrapped: 2`);
      currentOrder = advRes.body.data;
    }
    assert(currentOrder.currentStage === 'Completed' && currentOrder.status === 'Technical Complete (TECO)', '7-Stage Wheel Execution Technical Completion (TECO)', 'Moved to Finished Goods (FERT)');

    // 9. Plant Maintenance (PM)
    const machRes = await request('/maintenance/machines', 'GET', null, token);
    assert(machRes.status === 200 && machRes.body.data.length >= 7, 'Machine Master & Health Telemetry', `${machRes.body.data.length} heavy machines monitored`);

    // 10. Finance & Controlling (FI/CO)
    const finRes = await request('/finance/analysis', 'GET', null, token);
    assert(finRes.status === 200 && finRes.body.data.summary, 'Manufacturing Cost Variance & Profitability Analysis', `Gross Margin: ${finRes.body.data.summary.grossMarginOverall}%`);

    // 11. AI Intelligence Engine
    const aiRes = await request('/ai/summary', 'GET', null, token);
    assert(aiRes.status === 200 && aiRes.body.data.plantHealthIndex !== undefined, 'AI Executive Health Index & Forecasting', `Health Index: ${aiRes.body.data.plantHealthIndex} (${aiRes.body.data.healthStatus})`);

    // 12. SAP Basis Administration & Custom Reports
    const repRes = await request('/admin/report', 'POST', { reportType: 'MATERIAL_STOCK_VALUATION' }, token);
    assert(repRes.status === 200 && repRes.body.recordCount > 0, 'ABAP-Style MB52 Stock Valuation Report Execution', `${repRes.body.recordCount} rows generated`);

    const logRes = await request('/admin/logs', 'GET', null, token);
    assert(logRes.status === 200 && logRes.body.data.length >= 5, 'SAP Transaction Audit Trail Ledger', `${logRes.body.data.length} audit entries captured`);

    console.log('================================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED.`);
    console.log('================================================================');

    if (failed === 0) {
      console.log('🏆 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Integration test exception:', err);
    process.exit(1);
  }
};

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('integrationTest.js')) {
  runIntegrationTest().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
