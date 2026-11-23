import { collections } from '../services/dbStore.js';
import { logAudit, triggerNotification } from '../services/workflowEngine.js';

// Customers CRUD
export const getCustomers = async (req, res) => {
  try {
    const customers = await collections.customers.find({});
    return res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { customerCode, companyName, contactPerson, email, phone, city, creditLimit, paymentTerms } = req.body;
    if (!customerCode || !companyName) {
      return res.status(400).json({ success: false, message: 'Customer Code and Company Name are required.' });
    }

    const existing = await collections.customers.findOne({ customerCode });
    if (existing) {
      return res.status(400).json({ success: false, message: `Customer code ${customerCode} already exists.` });
    }

    const newCustomer = await collections.customers.create({
      customerCode,
      companyName,
      contactPerson,
      email,
      phone,
      city,
      creditLimit: Number(creditLimit || 5000000),
      paymentTerms: paymentTerms || 'Net 30 Days',
      rating: 4.8
    });

    await logAudit(req.user, 'CUSTOMER_CREATE', 'Sales Management (SD)', customerCode, `Created customer ${companyName}`, req);

    return res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Sales Orders CRUD
export const getSalesOrders = async (req, res) => {
  try {
    const orders = await collections.salesOrders.find({});
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSalesOrder = async (req, res) => {
  try {
    const { customerCode, deliveryDate, items, priority, notes } = req.body;
    if (!customerCode || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer and items are required.' });
    }

    const customer = await collections.customers.findOne({ customerCode });
    if (!customer) {
      return res.status(404).json({ success: false, message: `Customer ${customerCode} not found.` });
    }

    const orderNumber = `SO-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    let totalAmount = 0;

    const validatedItems = items.map(item => {
      const lineTotal = Number(item.orderedQuantity) * Number(item.unitPrice);
      totalAmount += lineTotal;
      return {
        productCode: item.productCode,
        productName: item.productName || item.productCode,
        orderedQuantity: Number(item.orderedQuantity),
        deliveredQuantity: 0,
        unitPrice: Number(item.unitPrice),
        lineTotal
      };
    });

    const newOrder = await collections.salesOrders.create({
      orderNumber,
      customerCode,
      customerName: customer.companyName,
      orderDate: new Date().toISOString(),
      deliveryDate: deliveryDate || new Date(Date.now() + 15 * 86400000).toISOString(),
      items: validatedItems,
      totalAmount,
      orderStatus: 'Confirmed',
      priority: priority || 'Normal',
      shippingCarrier: 'LogiTrans Automotive Express',
      trackingNumber: `TRK-${Date.now().toString().slice(-6)}`
    });

    await logAudit(req.user, 'SALES_ORDER_CREATE', 'Sales Management (SD)', orderNumber, `Created order for ₹${totalAmount.toLocaleString()}`, req);

    await triggerNotification(
      'APPROVAL_REQUEST',
      `New Sales Order Confirmed: ${orderNumber}`,
      `Customer order from ${customer.companyName} for ₹${totalAmount.toLocaleString()} is confirmed. Ready for Production Planning.`,
      'info',
      '/sales/orders'
    );

    return res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, shippingCarrier } = req.body;

    const order = await collections.salesOrders.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Sales Order not found' });
    }

    const updated = await collections.salesOrders.findByIdAndUpdate(id, {
      orderStatus: orderStatus || order.orderStatus,
      trackingNumber: trackingNumber || order.trackingNumber,
      shippingCarrier: shippingCarrier || order.shippingCarrier
    });

    await logAudit(req.user, 'ORDER_STATUS_UPDATE', 'Sales Management (SD)', order.orderNumber, `Updated status to ${orderStatus}`, req);

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
