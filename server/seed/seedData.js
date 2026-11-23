import bcrypt from 'bcryptjs';
import { collections } from '../services/dbStore.js';

export const seedDatabase = async () => {
  console.log('[Seed Engine] Seeding SmartManufacture ERP initial enterprise database...');

  // 1. Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const usersData = [
    {
      _id: 'USR-ADMIN',
      username: 'admin',
      email: 'admin@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Vikramaditya Singhania',
      role: 'Super Admin',
      department: 'Executive Management',
      employeeId: 'EMP-001',
      isActive: true
    },
    {
      _id: 'USR-PLANT',
      username: 'planthead',
      email: 'planthead@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Rajesh K. Nambiar',
      role: 'Plant Head',
      department: 'Plant Operations',
      employeeId: 'EMP-002',
      isActive: true
    },
    {
      _id: 'USR-SALES',
      username: 'salesmgr',
      email: 'sales@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Ananya Deshmukh',
      role: 'Sales Manager',
      department: 'Sales & Distribution (SD)',
      employeeId: 'EMP-003',
      isActive: true
    },
    {
      _id: 'USR-PROD',
      username: 'prodmgr',
      email: 'production@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Karthik Subramanian',
      role: 'Production Manager',
      department: 'Production Planning (PP)',
      employeeId: 'EMP-004',
      isActive: true
    },
    {
      _id: 'USR-STORE',
      username: 'storemgr',
      email: 'store@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Gopalakrishnan Nair',
      role: 'Store Manager',
      department: 'Materials Management (MM)',
      employeeId: 'EMP-005',
      isActive: true
    },
    {
      _id: 'USR-PROC',
      username: 'procmgr',
      email: 'procurement@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Sanjay Chawla',
      role: 'Procurement Manager',
      department: 'Purchasing (MM-PUR)',
      employeeId: 'EMP-006',
      isActive: true
    },
    {
      _id: 'USR-QUAL',
      username: 'qualitymgr',
      email: 'quality@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Dr. Meenakshi Sundaram',
      role: 'Quality Manager',
      department: 'Quality Management (QM)',
      employeeId: 'EMP-007',
      isActive: true
    },
    {
      _id: 'USR-MAINT',
      username: 'maintmgr',
      email: 'maintenance@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Arun Varma',
      role: 'Maintenance Manager',
      department: 'Plant Maintenance (PM)',
      employeeId: 'EMP-008',
      isActive: true
    },
    {
      _id: 'USR-FIN',
      username: 'financemgr',
      email: 'finance@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Pooja Agarwal (CA)',
      role: 'Finance Manager',
      department: 'Finance & Controlling (FI/CO)',
      employeeId: 'EMP-009',
      isActive: true
    },
    {
      _id: 'USR-OPER',
      username: 'operator1',
      email: 'operator@smartmanufacture.com',
      password: hashedPassword,
      fullName: 'Manoj Kumar',
      role: 'Operator',
      department: 'Shop Floor - Rim Line',
      employeeId: 'EMP-010',
      isActive: true
    }
  ];

  await collections.users.deleteMany({});
  await collections.users.insertMany(usersData);

  // 2. Customers
  const customersData = [
    {
      customerCode: 'CUST-TATA-CV',
      companyName: 'Tata Motors Ltd - Commercial Vehicle Div',
      contactPerson: 'Suresh Patil (VP Sourcing)',
      email: 'suresh.patil@tatamotors.com',
      phone: '+91 20 6613 1111',
      address: 'Pimpri Works, Pune',
      city: 'Pune',
      creditLimit: 15000000,
      paymentTerms: 'Net 45 Days',
      rating: 4.9
    },
    {
      customerCode: 'CUST-MM-AUTO',
      companyName: 'Mahindra & Mahindra Automotive Sector',
      contactPerson: 'Deepak Sharma (GM Procurement)',
      email: 'sharma.deepak@mahindra.com',
      phone: '+91 22 2490 1441',
      address: 'Kandivali Plant, Akurli Road',
      city: 'Mumbai',
      creditLimit: 12000000,
      paymentTerms: 'Net 30 Days',
      rating: 4.8
    },
    {
      customerCode: 'CUST-ASHOK-LEY',
      companyName: 'Ashok Leyland Limited',
      contactPerson: 'V. Ramanathan (Head Supply Chain)',
      email: 'v.ramanathan@ashokleyland.com',
      phone: '+91 44 2573 4500',
      address: 'Ennore Works, Chennai',
      city: 'Chennai',
      creditLimit: 18000000,
      paymentTerms: 'Net 60 Days',
      rating: 4.7
    },
    {
      customerCode: 'CUST-MARUTI-SUZ',
      companyName: 'Maruti Suzuki India Limited',
      contactPerson: 'Ashish Mittal (Chief Engineer Vendor Dev)',
      email: 'a.mittal@maruti.co.in',
      phone: '+91 124 234 6721',
      address: 'Palam Gurgaon Road',
      city: 'Gurugram',
      creditLimit: 25000000,
      paymentTerms: 'Net 30 Days',
      rating: 4.9
    },
    {
      customerCode: 'CUST-HYUNDAI-IND',
      companyName: 'Hyundai Motor India Ltd',
      contactPerson: 'K. S. Narayanan (Director Parts Purchasing)',
      email: 'narayanan.ks@hmil.net',
      phone: '+91 44 4710 0000',
      address: 'Irrungattukottai, Sriperumbudur',
      city: 'Chennai',
      creditLimit: 20000000,
      paymentTerms: 'Net 45 Days',
      rating: 4.8
    }
  ];
  await collections.customers.deleteMany({});
  await collections.customers.insertMany(customersData);

  // 3. Vendors
  const vendorsData = [
    {
      vendorCode: 'VND-JSW-STEEL',
      companyName: 'JSW Steel Coated Products Ltd',
      contactPerson: 'Manish Trivedi',
      email: 'm.trivedi@jsw.in',
      phone: '+91 22 4286 1000',
      city: 'Mumbai / Vijayanagar',
      rating: 4.8,
      paymentTerms: 'Net 30 Days',
      leadTimeScore: 94,
      qualityScore: 98,
      onTimeDeliveryRate: 96,
      materialsSupplied: ['RM-STL-440', 'RM-WLD-ER70']
    },
    {
      vendorCode: 'VND-HINDALCO-ALU',
      companyName: 'Hindalco Industries Ltd',
      contactPerson: 'Raghavan Iyer',
      email: 'raghavan.iyer@adityabirla.com',
      phone: '+91 80 2558 4000',
      city: 'Belagavi / Bengaluru',
      rating: 4.7,
      paymentTerms: 'Net 45 Days',
      leadTimeScore: 92,
      qualityScore: 97,
      onTimeDeliveryRate: 93,
      materialsSupplied: ['RM-ALU-A356']
    },
    {
      vendorCode: 'VND-LINCOLN-WLD',
      companyName: 'Lincoln Electric Consumables India',
      contactPerson: 'Amitabh Sen',
      email: 'sen.amitabh@lincolnelectric.com',
      phone: '+91 44 2681 1234',
      city: 'Chennai',
      rating: 4.9,
      paymentTerms: 'Net 30 Days',
      leadTimeScore: 98,
      qualityScore: 99,
      onTimeDeliveryRate: 97,
      materialsSupplied: ['RM-WLD-ER70']
    },
    {
      vendorCode: 'VND-KANSAI-PNT',
      companyName: 'Kansai Nerolac Paints Ltd (Industrial Coatings)',
      contactPerson: 'Sudhir Ranade',
      email: 'sudhir.ranade@nerolac.com',
      phone: '+91 22 2493 4001',
      city: 'Mumbai',
      rating: 4.6,
      paymentTerms: 'Net 30 Days',
      leadTimeScore: 91,
      qualityScore: 96,
      onTimeDeliveryRate: 92,
      materialsSupplied: ['RM-PNT-CED', 'RM-ZNC-PHOS']
    },
    {
      vendorCode: 'VND-SUNDRAM-FAST',
      companyName: 'Sundram Fasteners Automotive Ltd',
      contactPerson: 'V. Balasubramanian',
      email: 'v.bala@sundram.com',
      phone: '+91 44 2852 1201',
      city: 'Chennai',
      rating: 4.9,
      paymentTerms: 'Net 60 Days',
      leadTimeScore: 97,
      qualityScore: 99,
      onTimeDeliveryRate: 98,
      materialsSupplied: ['RM-HUB-FAST']
    }
  ];
  await collections.vendors.deleteMany({});
  await collections.vendors.insertMany(vendorsData);

  // 4. Materials (RM, HALB, FERT)
  const materialsData = [
    // Raw Materials
    {
      materialCode: 'RM-STL-440',
      name: 'Steel Coil SAPH440 (Automotive Grade Wheel Rim Steel)',
      description: 'Hot rolled high-strength steel coil, 4.2mm thickness, ASTM A715 / JIS G3113 SAPH440',
      materialType: 'RM',
      uom: 'KG',
      unitPrice: 75,
      currentStock: 8200, // Below safety stock! Trigger for MRP shortage
      allocatedStock: 2500,
      availableStock: 5700,
      safetyStock: 10000,
      reorderPoint: 12000,
      leadTimeDays: 7,
      storageLocation: 'RMS1-A01',
      standardCost: 75,
      inspectionRequired: true
    },
    {
      materialCode: 'RM-ALU-A356',
      name: 'Aluminium Foundry Alloy Ingot A356.2',
      description: 'Primary aluminium casting ingot AlSi7Mg0.3 for automotive wheels with Sr modification',
      materialType: 'RM',
      uom: 'KG',
      unitPrice: 235,
      currentStock: 14500,
      allocatedStock: 3200,
      availableStock: 11300,
      safetyStock: 6000,
      reorderPoint: 8000,
      leadTimeDays: 10,
      storageLocation: 'RMS1-B02',
      standardCost: 235,
      inspectionRequired: true
    },
    {
      materialCode: 'RM-WLD-ER70',
      name: 'Robotic MIG Welding Wire ER70S-6 (1.2mm Spool)',
      description: 'Copper-coated solid MIG wire for automated circumferential rim-to-disc welding',
      materialType: 'RM',
      uom: 'KG',
      unitPrice: 185,
      currentStock: 480, // Low stock alert!
      allocatedStock: 200,
      availableStock: 280,
      safetyStock: 600,
      reorderPoint: 800,
      leadTimeDays: 4,
      storageLocation: 'RMS1-C03',
      standardCost: 185,
      inspectionRequired: true
    },
    {
      materialCode: 'RM-PNT-CED',
      name: 'Cathodic Electro-Deposition Epoxy Resin (CED Black)',
      description: 'Anti-corrosion electrophoretic epoxy primer coating resin conforming to SAE J2334',
      materialType: 'RM',
      uom: 'LTR',
      unitPrice: 420,
      currentStock: 520, // Low stock scenario
      allocatedStock: 200,
      availableStock: 320,
      safetyStock: 500,
      reorderPoint: 750,
      leadTimeDays: 5,
      storageLocation: 'CHM-STOR-01',
      standardCost: 420,
      inspectionRequired: true
    },
    {
      materialCode: 'RM-ZNC-PHOS',
      name: 'Zinc Phosphate Chemical Pretreatment Compound',
      description: 'Micro-crystalline tri-cationic zinc phosphate surface conditioner for wheel immersion',
      materialType: 'RM',
      uom: 'LTR',
      unitPrice: 145,
      currentStock: 950,
      allocatedStock: 150,
      availableStock: 800,
      safetyStock: 400,
      reorderPoint: 600,
      leadTimeDays: 3,
      storageLocation: 'CHM-STOR-02',
      standardCost: 145,
      inspectionRequired: false
    },
    {
      materialCode: 'RM-HUB-FAST',
      name: 'Wheel Hub Studs & Flange Nuts Set (Grade 10.9)',
      description: 'High-tensile zinc nickel plated stud fasteners with spherical seat flange nuts',
      materialType: 'RM',
      uom: 'SET',
      unitPrice: 38,
      currentStock: 12400,
      allocatedStock: 2500,
      availableStock: 9900,
      safetyStock: 4000,
      reorderPoint: 6000,
      leadTimeDays: 4,
      storageLocation: 'FAST-RACK-04',
      standardCost: 38,
      inspectionRequired: true
    },

    // Semi-Finished Materials (HALB)
    {
      materialCode: 'HLB-RIM-16',
      name: 'Formed & Coiled Rim Ring 16x6.5J',
      description: 'Cold roll-formed, flash butt welded and flare-expanded steel rim band',
      materialType: 'HALB',
      uom: 'PCS',
      unitPrice: 1180,
      currentStock: 380,
      allocatedStock: 150,
      availableStock: 230,
      safetyStock: 100,
      reorderPoint: 200,
      leadTimeDays: 2,
      storageLocation: 'SAB2-LINE1',
      standardCost: 1180,
      inspectionRequired: true
    },
    {
      materialCode: 'HLB-DSC-16',
      name: 'Stamped Wheel Centre Disc 16x6.5J',
      description: '2500-ton hydraulic press blanked, formed, pierced and coined central wheel disc',
      materialType: 'HALB',
      uom: 'PCS',
      unitPrice: 960,
      currentStock: 350,
      allocatedStock: 150,
      availableStock: 200,
      safetyStock: 100,
      reorderPoint: 200,
      leadTimeDays: 2,
      storageLocation: 'SAB2-LINE2',
      standardCost: 960,
      inspectionRequired: true
    },
    {
      materialCode: 'HLB-ASY-16',
      name: 'Sub-Assembled Welded Wheel Blank 16x6.5J',
      description: 'Pressed-fit rim and disc welded via multi-torch robotic MIG welding cell',
      materialType: 'HALB',
      uom: 'PCS',
      unitPrice: 2420,
      currentStock: 210,
      allocatedStock: 100,
      availableStock: 110,
      safetyStock: 50,
      reorderPoint: 100,
      leadTimeDays: 1,
      storageLocation: 'SAB2-LINE3',
      standardCost: 2420,
      inspectionRequired: true
    },
    {
      materialCode: 'HLB-RIM-17',
      name: 'Alloy Rim Shell Flow-Formed 17x7.0J',
      description: 'Rotary flow-formed lightweight aluminium outer rim section',
      materialType: 'HALB',
      uom: 'PCS',
      unitPrice: 1680,
      currentStock: 190,
      allocatedStock: 80,
      availableStock: 110,
      safetyStock: 60,
      reorderPoint: 120,
      leadTimeDays: 3,
      storageLocation: 'SAB2-ALU1',
      standardCost: 1680,
      inspectionRequired: true
    },

    // Finished Goods (FERT)
    {
      materialCode: 'WHL-ALU-16D',
      name: '16x6.5J Diamond Cut Tubeless Alloy Wheel',
      description: 'OEM Passenger Vehicle Specification, 5x114.3 PCD, ET45 Offset, Diamond Polish & Gunmetal',
      materialType: 'FERT',
      uom: 'PCS',
      unitPrice: 6800,
      currentStock: 380,
      allocatedStock: 200,
      availableStock: 180,
      safetyStock: 150,
      reorderPoint: 250,
      leadTimeDays: 5,
      storageLocation: 'FGW1-BAY-A',
      standardCost: 4250,
      inspectionRequired: true
    },
    {
      materialCode: 'WHL-ALU-17S',
      name: '17x7.0J Silver Metallic Premium Alloy Wheel',
      description: 'Mid-size SUV Specification, 5x112 PCD, ET42 Offset, Hyper-Silver Metallic Polyurethane Finish',
      materialType: 'FERT',
      uom: 'PCS',
      unitPrice: 8400,
      currentStock: 260,
      allocatedStock: 120,
      availableStock: 140,
      safetyStock: 100,
      reorderPoint: 180,
      leadTimeDays: 5,
      storageLocation: 'FGW1-BAY-B',
      standardCost: 5100,
      inspectionRequired: true
    },
    {
      materialCode: 'WHL-STL-22C',
      name: '22.5x9.00 Heavy Commercial Steel Wheel (Truck & Bus)',
      description: '10x335 PCD Heavy Duty Forged Rim with Ventilated Hand Holes, ISO 4107 Compliant, E-Coated Black',
      materialType: 'FERT',
      uom: 'PCS',
      unitPrice: 11500,
      currentStock: 190,
      allocatedStock: 100,
      availableStock: 90,
      safetyStock: 80,
      reorderPoint: 150,
      leadTimeDays: 6,
      storageLocation: 'FGW1-BAY-C',
      standardCost: 7900,
      inspectionRequired: true
    },
    {
      materialCode: 'WHL-ALU-19P',
      name: '19x8.5J Forged High-Performance Alloy Wheel',
      description: 'Aerospace Grade 6061-T6 Forged Monoblock Wheel, Satin Bronze Anodized, 5x120 PCD, ET35',
      materialType: 'FERT',
      uom: 'PCS',
      unitPrice: 16500,
      currentStock: 85,
      allocatedStock: 40,
      availableStock: 45,
      safetyStock: 40,
      reorderPoint: 60,
      leadTimeDays: 8,
      storageLocation: 'FGW1-BAY-D',
      standardCost: 10200,
      inspectionRequired: true
    }
  ];
  await collections.materials.deleteMany({});
  await collections.materials.insertMany(materialsData);

  // 5. Products
  const productsData = [
    {
      productCode: 'WHL-ALU-16D',
      name: '16x6.5J Diamond Cut Tubeless Alloy Wheel',
      wheelType: 'Alloy Wheel',
      sizeSpec: '16x6.5J',
      finish: 'Diamond Cut Polish & Gunmetal Grey',
      pcd: '5x114.3',
      offsetET: 'ET45',
      loadRatingKg: 780,
      bomId: 'BOM-WHL-16D',
      routingId: 'ROUT-WHL-16D',
      standardCost: 4250,
      sellingPrice: 6800
    },
    {
      productCode: 'WHL-ALU-17S',
      name: '17x7.0J Silver Metallic Premium Alloy Wheel',
      wheelType: 'Alloy Wheel',
      sizeSpec: '17x7.0J',
      finish: 'Hyper-Silver Metallic Coat',
      pcd: '5x112',
      offsetET: 'ET42',
      loadRatingKg: 890,
      bomId: 'BOM-WHL-17S',
      routingId: 'ROUT-WHL-17S',
      standardCost: 5100,
      sellingPrice: 8400
    },
    {
      productCode: 'WHL-STL-22C',
      name: '22.5x9.00 Heavy Commercial Steel Wheel',
      wheelType: 'Commercial Steel Wheel',
      sizeSpec: '22.5x9.00',
      finish: 'Cathodic Electro-Deposition (CED) Black',
      pcd: '10x335',
      offsetET: 'ET135',
      loadRatingKg: 3750,
      bomId: 'BOM-WHL-22C',
      routingId: 'ROUT-WHL-22C',
      standardCost: 7900,
      sellingPrice: 11500
    },
    {
      productCode: 'WHL-ALU-19P',
      name: '19x8.5J Forged High-Performance Alloy Wheel',
      wheelType: 'Forged Monoblock Alloy',
      sizeSpec: '19x8.5J',
      finish: 'Satin Bronze Hard Anodized',
      pcd: '5x120',
      offsetET: 'ET35',
      loadRatingKg: 950,
      bomId: 'BOM-WHL-19P',
      routingId: 'ROUT-WHL-19P',
      standardCost: 10200,
      sellingPrice: 16500
    }
  ];
  await collections.products.deleteMany({});
  await collections.products.insertMany(productsData);

  // 6. Bill of Materials (BOM)
  const bomsData = [
    {
      bomNumber: 'BOM-WHL-16D',
      productCode: 'WHL-ALU-16D',
      productName: '16x6.5J Diamond Cut Tubeless Alloy Wheel',
      version: '1.2',
      status: 'Active',
      baseQuantity: 1,
      components: [
        {
          materialCode: 'RM-ALU-A356',
          materialName: 'Aluminium Foundry Alloy Ingot A356.2',
          materialType: 'RM',
          quantity: 11.5,
          uom: 'KG',
          scrapPercentage: 3.5,
          unitCost: 235,
          totalCost: 2795.3
        },
        {
          materialCode: 'RM-PNT-CED',
          materialName: 'Cathodic Electro-Deposition Epoxy Resin',
          materialType: 'RM',
          quantity: 0.65,
          uom: 'LTR',
          scrapPercentage: 2.0,
          unitCost: 420,
          totalCost: 278.46
        },
        {
          materialCode: 'RM-ZNC-PHOS',
          materialName: 'Zinc Phosphate Chemical Pretreatment Compound',
          materialType: 'RM',
          quantity: 0.4,
          uom: 'LTR',
          scrapPercentage: 1.0,
          unitCost: 145,
          totalCost: 58.58
        },
        {
          materialCode: 'RM-HUB-FAST',
          materialName: 'Wheel Hub Studs & Flange Nuts Set',
          materialType: 'RM',
          quantity: 1,
          uom: 'SET',
          scrapPercentage: 0.5,
          unitCost: 38,
          totalCost: 38.19
        }
      ],
      totalBomCost: 3170.53,
      validFrom: new Date('2026-01-01').toISOString(),
      approvedBy: 'Dr. Meenakshi Sundaram (VP Quality)'
    },
    {
      bomNumber: 'BOM-WHL-22C',
      productCode: 'WHL-STL-22C',
      productName: '22.5x9.00 Heavy Commercial Steel Wheel',
      version: '2.0',
      status: 'Active',
      baseQuantity: 1,
      components: [
        {
          materialCode: 'RM-STL-440',
          materialName: 'Steel Coil SAPH440',
          materialType: 'RM',
          quantity: 48.0,
          uom: 'KG',
          scrapPercentage: 4.0,
          unitCost: 75,
          totalCost: 3744.0
        },
        {
          materialCode: 'RM-WLD-ER70',
          materialName: 'Robotic MIG Welding Wire ER70S-6',
          materialType: 'RM',
          quantity: 1.8,
          uom: 'KG',
          scrapPercentage: 2.5,
          unitCost: 185,
          totalCost: 341.33
        },
        {
          materialCode: 'RM-PNT-CED',
          materialName: 'Cathodic Electro-Deposition Epoxy Resin',
          materialType: 'RM',
          quantity: 1.4,
          uom: 'LTR',
          scrapPercentage: 2.0,
          unitCost: 420,
          totalCost: 599.76
        },
        {
          materialCode: 'RM-ZNC-PHOS',
          materialName: 'Zinc Phosphate Chemical Pretreatment Compound',
          materialType: 'RM',
          quantity: 0.8,
          uom: 'LTR',
          scrapPercentage: 1.0,
          unitCost: 145,
          totalCost: 117.16
        }
      ],
      totalBomCost: 4802.25,
      validFrom: new Date('2026-01-15').toISOString(),
      approvedBy: 'Rajesh K. Nambiar (Plant Head)'
    }
  ];
  await collections.boms.deleteMany({});
  await collections.boms.insertMany(bomsData);

  // 7. Work Centres
  const workCentresData = [
    {
      workCentreCode: 'WC-RIM-FORMING',
      name: 'Rim Cold Roll Forming & Coiling Section',
      department: 'Rim Shop',
      capacityPerShift: 300,
      availableMachines: ['MCH-RIM-ROLL-01', 'MCH-RIM-EXP-02'],
      costPerHour: 550,
      efficiencyPercentage: 94
    },
    {
      workCentreCode: 'WC-DISC-STAMP',
      name: 'Heavy Disc Stamping & Blanking Press',
      department: 'Press Shop',
      capacityPerShift: 280,
      availableMachines: ['MCH-PRESS-2500T', 'MCH-PIERCE-600T'],
      costPerHour: 680,
      efficiencyPercentage: 91
    },
    {
      workCentreCode: 'WC-ASSY-WELD',
      name: 'Automated Rim-Disc Assembly & Robotic MIG Weld Cell',
      department: 'Assembly Shop',
      capacityPerShift: 240,
      availableMachines: ['MCH-ROBOT-WELD-01', 'MCH-FITUP-PRESS-01'],
      costPerHour: 620,
      efficiencyPercentage: 95
    },
    {
      workCentreCode: 'WC-HEAT-TREAT',
      name: 'Continuous T6 Solutionizing & Artificial Aging Furnace',
      department: 'Thermal Processing',
      capacityPerShift: 350,
      availableMachines: ['MCH-FURNACE-T6-01'],
      costPerHour: 800,
      efficiencyPercentage: 96
    },
    {
      workCentreCode: 'WC-ED-PAINT',
      name: '8-Stage Cathodic Electro-Deposition (CED) Paint Line',
      department: 'Surface Finishing',
      capacityPerShift: 400,
      availableMachines: ['MCH-CED-LINE-01'],
      costPerHour: 720,
      efficiencyPercentage: 93
    },
    {
      workCentreCode: 'WC-QC-RUNOUT',
      name: 'Radial / Lateral Runout & Helium Leak Testing Station',
      department: 'Quality Inspection',
      capacityPerShift: 450,
      availableMachines: ['MCH-RUNOUT-TEST-01', 'MCH-CMM-ZEISS'],
      costPerHour: 480,
      efficiencyPercentage: 98
    },
    {
      workCentreCode: 'WC-PACK-DISPATCH',
      name: 'Automated Palletizing, Barcode Labeling & Packaging',
      department: 'Logistics & Dispatch',
      capacityPerShift: 500,
      availableMachines: ['MCH-ROBOT-PACK-01'],
      costPerHour: 350,
      efficiencyPercentage: 97
    }
  ];
  await collections.workCentres.deleteMany({});
  await collections.workCentres.insertMany(workCentresData);

  // 8. Machines
  const machinesData = [
    {
      machineCode: 'MCH-PRESS-2500T',
      name: 'Schuler 2500-Ton Hydraulic Multi-Stage Stamping Press',
      workCentreCode: 'WC-DISC-STAMP',
      type: 'Hydraulic Press',
      status: 'Running',
      healthScore: 89,
      lastMaintenanceDate: new Date('2026-10-15').toISOString(),
      nextScheduledMaintenance: new Date('2026-12-05').toISOString(),
      mtbfHours: 480,
      mttrHours: 2.8,
      totalDowntimeHours: 14.2
    },
    {
      machineCode: 'MCH-RIM-ROLL-01',
      name: 'Fontijne Grotnes 3-Roll CNC Rim Forming Machine',
      workCentreCode: 'WC-RIM-FORMING',
      type: 'Spin Forming Lathe',
      status: 'Running',
      healthScore: 94,
      lastMaintenanceDate: new Date('2026-10-28').toISOString(),
      nextScheduledMaintenance: new Date('2026-12-15').toISOString(),
      mtbfHours: 520,
      mttrHours: 2.1,
      totalDowntimeHours: 8.5
    },
    {
      machineCode: 'MCH-ROBOT-WELD-01',
      name: 'ABB IRB-6700 Twin-Torch Robotic MIG Welding Cell',
      workCentreCode: 'WC-ASSY-WELD',
      type: 'Robotic MIG Welder',
      status: 'Running',
      healthScore: 92,
      lastMaintenanceDate: new Date('2026-11-02').toISOString(),
      nextScheduledMaintenance: new Date('2026-12-10').toISOString(),
      mtbfHours: 610,
      mttrHours: 1.9,
      totalDowntimeHours: 6.4
    },
    {
      machineCode: 'MCH-FURNACE-T6-01',
      name: 'Seco/Warwick Mesh Belt Continuous T6 Heat Treatment Furnace',
      workCentreCode: 'WC-HEAT-TREAT',
      type: 'Heat Treatment Furnace',
      status: 'Running',
      healthScore: 86, // Needs monitoring
      lastMaintenanceDate: new Date('2026-09-20').toISOString(),
      nextScheduledMaintenance: new Date('2026-11-28').toISOString(),
      mtbfHours: 350,
      mttrHours: 4.5,
      totalDowntimeHours: 22.0
    },
    {
      machineCode: 'MCH-CED-LINE-01',
      name: 'Durr 8-Stage Pretreatment & Cathodic Electro-Deposition Paint Line',
      workCentreCode: 'WC-ED-PAINT',
      type: 'CED Coating Line',
      status: 'Running',
      healthScore: 95,
      lastMaintenanceDate: new Date('2026-11-10').toISOString(),
      nextScheduledMaintenance: new Date('2026-12-20').toISOString(),
      mtbfHours: 720,
      mttrHours: 1.5,
      totalDowntimeHours: 5.1
    },
    {
      machineCode: 'MCH-RUNOUT-TEST-01',
      name: 'Hofmann Dynamic Radial/Lateral Runout & Balancing Tester',
      workCentreCode: 'WC-QC-RUNOUT',
      type: 'Dynamic Tester',
      status: 'Operational',
      healthScore: 97,
      lastMaintenanceDate: new Date('2026-11-05').toISOString(),
      nextScheduledMaintenance: new Date('2026-12-28').toISOString(),
      mtbfHours: 850,
      mttrHours: 1.2,
      totalDowntimeHours: 3.4
    },
    {
      machineCode: 'MCH-ROBOT-PACK-01',
      name: 'Fanuc M-410iC Automated Palletizing & Protective Film Cell',
      workCentreCode: 'WC-PACK-DISPATCH',
      type: 'Robotic Palletizer',
      status: 'Running',
      healthScore: 98,
      lastMaintenanceDate: new Date('2026-11-12').toISOString(),
      nextScheduledMaintenance: new Date('2027-01-10').toISOString(),
      mtbfHours: 920,
      mttrHours: 0.8,
      totalDowntimeHours: 2.1
    }
  ];
  await collections.machines.deleteMany({});
  await collections.machines.insertMany(machinesData);

  // 9. Routings (The 7 canonical manufacturing stages)
  const routingsData = [
    {
      routingNumber: 'ROUT-WHL-16D',
      productCode: 'WHL-ALU-16D',
      productName: '16x6.5J Diamond Cut Tubeless Alloy Wheel',
      version: '1.0',
      operations: [
        {
          sequence: 10,
          stageName: 'Rim',
          workCentreCode: 'WC-RIM-FORMING',
          machineRequired: 'MCH-RIM-ROLL-01',
          setupTimeMin: 20,
          cycleTimeMin: 2.5,
          laborHours: 0.1,
          costPerHour: 550
        },
        {
          sequence: 20,
          stageName: 'Disc',
          workCentreCode: 'WC-DISC-STAMP',
          machineRequired: 'MCH-PRESS-2500T',
          setupTimeMin: 30,
          cycleTimeMin: 1.8,
          laborHours: 0.1,
          costPerHour: 680
        },
        {
          sequence: 30,
          stageName: 'Assembly',
          workCentreCode: 'WC-ASSY-WELD',
          machineRequired: 'MCH-ROBOT-WELD-01',
          setupTimeMin: 15,
          cycleTimeMin: 2.2,
          laborHours: 0.15,
          costPerHour: 620
        },
        {
          sequence: 40,
          stageName: 'Heat Treatment',
          workCentreCode: 'WC-HEAT-TREAT',
          machineRequired: 'MCH-FURNACE-T6-01',
          setupTimeMin: 45,
          cycleTimeMin: 12.0, // Batch furnace
          laborHours: 0.05,
          costPerHour: 800
        },
        {
          sequence: 50,
          stageName: 'Painting',
          workCentreCode: 'WC-ED-PAINT',
          machineRequired: 'MCH-CED-LINE-01',
          setupTimeMin: 15,
          cycleTimeMin: 4.5,
          laborHours: 0.08,
          costPerHour: 720
        },
        {
          sequence: 60,
          stageName: 'Quality Inspection',
          workCentreCode: 'WC-QC-RUNOUT',
          machineRequired: 'MCH-RUNOUT-TEST-01',
          setupTimeMin: 10,
          cycleTimeMin: 1.5,
          laborHours: 0.12,
          costPerHour: 480
        },
        {
          sequence: 70,
          stageName: 'Packing',
          workCentreCode: 'WC-PACK-DISPATCH',
          machineRequired: 'MCH-ROBOT-PACK-01',
          setupTimeMin: 10,
          cycleTimeMin: 1.0,
          laborHours: 0.05,
          costPerHour: 350
        }
      ],
      totalCycleTimeMin: 25.5,
      totalRoutingCost: 1079.47
    },
    {
      routingNumber: 'ROUT-WHL-22C',
      productCode: 'WHL-STL-22C',
      productName: '22.5x9.00 Heavy Commercial Steel Wheel',
      version: '1.0',
      operations: [
        {
          sequence: 10,
          stageName: 'Rim',
          workCentreCode: 'WC-RIM-FORMING',
          machineRequired: 'MCH-RIM-ROLL-01',
          setupTimeMin: 25,
          cycleTimeMin: 3.8,
          laborHours: 0.15,
          costPerHour: 550
        },
        {
          sequence: 20,
          stageName: 'Disc',
          workCentreCode: 'WC-DISC-STAMP',
          machineRequired: 'MCH-PRESS-2500T',
          setupTimeMin: 35,
          cycleTimeMin: 2.8,
          laborHours: 0.12,
          costPerHour: 680
        },
        {
          sequence: 30,
          stageName: 'Assembly',
          workCentreCode: 'WC-ASSY-WELD',
          machineRequired: 'MCH-ROBOT-WELD-01',
          setupTimeMin: 20,
          cycleTimeMin: 4.2,
          laborHours: 0.2,
          costPerHour: 620
        },
        {
          sequence: 40,
          stageName: 'Heat Treatment',
          workCentreCode: 'WC-HEAT-TREAT',
          machineRequired: 'MCH-FURNACE-T6-01',
          setupTimeMin: 30,
          cycleTimeMin: 8.0,
          laborHours: 0.05,
          costPerHour: 800
        },
        {
          sequence: 50,
          stageName: 'Painting',
          workCentreCode: 'WC-ED-PAINT',
          machineRequired: 'MCH-CED-LINE-01',
          setupTimeMin: 20,
          cycleTimeMin: 5.0,
          laborHours: 0.1,
          costPerHour: 720
        },
        {
          sequence: 60,
          stageName: 'Quality Inspection',
          workCentreCode: 'WC-QC-RUNOUT',
          machineRequired: 'MCH-RUNOUT-TEST-01',
          setupTimeMin: 15,
          cycleTimeMin: 2.2,
          laborHours: 0.15,
          costPerHour: 480
        },
        {
          sequence: 70,
          stageName: 'Packing',
          workCentreCode: 'WC-PACK-DISPATCH',
          machineRequired: 'MCH-ROBOT-PACK-01',
          setupTimeMin: 10,
          cycleTimeMin: 1.5,
          laborHours: 0.08,
          costPerHour: 350
        }
      ],
      totalCycleTimeMin: 27.5,
      totalRoutingCost: 1420.5
    }
  ];
  await collections.routings.deleteMany({});
  await collections.routings.insertMany(routingsData);

  // 10. Sales Orders
  const salesOrdersData = [
    {
      orderNumber: 'SO-2026-001',
      customerCode: 'CUST-TATA-CV',
      customerName: 'Tata Motors Ltd - Commercial Vehicle Div',
      orderDate: new Date('2026-11-15').toISOString(),
      deliveryDate: new Date('2026-12-10').toISOString(),
      items: [
        {
          productCode: 'WHL-STL-22C',
          productName: '22.5x9.00 Heavy Commercial Steel Wheel',
          orderedQuantity: 500,
          deliveredQuantity: 0,
          unitPrice: 11500,
          lineTotal: 5750000
        }
      ],
      totalAmount: 5750000,
      orderStatus: 'In Production',
      priority: 'High',
      shippingCarrier: 'VRL Commercial Logistics',
      trackingNumber: 'VRL-778921-IN'
    },
    {
      orderNumber: 'SO-2026-002',
      customerCode: 'CUST-MM-AUTO',
      customerName: 'Mahindra & Mahindra Automotive Sector',
      orderDate: new Date('2026-11-18').toISOString(),
      deliveryDate: new Date('2026-12-15').toISOString(),
      items: [
        {
          productCode: 'WHL-ALU-17S',
          productName: '17x7.0J Silver Metallic Premium Alloy Wheel',
          orderedQuantity: 300,
          deliveredQuantity: 0,
          unitPrice: 8400,
          lineTotal: 2520000
        }
      ],
      totalAmount: 2520000,
      orderStatus: 'Production Scheduled',
      priority: 'Normal',
      shippingCarrier: 'TCI Freight Services',
      trackingNumber: 'TCI-441209-MH'
    },
    {
      orderNumber: 'SO-2026-003',
      customerCode: 'CUST-MARUTI-SUZ',
      customerName: 'Maruti Suzuki India Limited',
      orderDate: new Date('2026-11-20').toISOString(),
      deliveryDate: new Date('2026-12-01').toISOString(),
      items: [
        {
          productCode: 'WHL-ALU-16D',
          productName: '16x6.5J Diamond Cut Tubeless Alloy Wheel',
          orderedQuantity: 400,
          deliveredQuantity: 0,
          unitPrice: 6800,
          lineTotal: 2720000
        }
      ],
      totalAmount: 2720000,
      orderStatus: 'Confirmed',
      priority: 'Urgent',
      shippingCarrier: 'Safexpress Automotive Rapid',
      trackingNumber: 'SAF-993812-DL'
    }
  ];
  await collections.salesOrders.deleteMany({});
  await collections.salesOrders.insertMany(salesOrdersData);

  // 11. Production Orders (Tracking Stage by Stage)
  const productionOrdersData = [
    {
      productionOrderNumber: 'PO-MFG-8001',
      salesOrderNumber: 'SO-2026-001',
      productCode: 'WHL-STL-22C',
      productName: '22.5x9.00 Heavy Commercial Steel Wheel',
      quantityToProduce: 500,
      completedQuantity: 180,
      scrappedQuantity: 4,
      startDate: new Date('2026-11-16').toISOString(),
      dueDate: new Date('2026-12-08').toISOString(),
      currentStage: 'Assembly', // Rim -> Disc -> Assembly -> Heat Treatment -> Painting -> Quality Inspection -> Packing
      status: 'In Progress',
      assignedWorkCentre: 'WC-ASSY-WELD',
      assignedMachine: 'MCH-ROBOT-WELD-01',
      shift: 'Shift A (Morning)',
      stageHistory: [
        {
          stage: 'Rim',
          enteredAt: new Date('2026-11-16T08:00:00').toISOString(),
          completedAt: new Date('2026-11-17T16:30:00').toISOString(),
          operator: 'Manoj Kumar (Operator)',
          acceptedQty: 498,
          rejectedQty: 2,
          notes: 'Flash butt weld bead profile verified within 0.8mm tolerance'
        },
        {
          stage: 'Disc',
          enteredAt: new Date('2026-11-18T08:00:00').toISOString(),
          completedAt: new Date('2026-11-19T17:00:00').toISOString(),
          operator: 'Suresh Babu',
          acceptedQty: 496,
          rejectedQty: 2,
          notes: 'Vent hole edge radius and coin depth inspected'
        },
        {
          stage: 'Assembly',
          enteredAt: new Date('2026-11-20T08:00:00').toISOString(),
          completedAt: null,
          operator: 'Karthik Subramanian',
          acceptedQty: 180,
          rejectedQty: 0,
          notes: 'Circumferential robotic MIG weld pass in progress on MCH-ROBOT-WELD-01'
        }
      ],
      actualCostAccumulated: 1894000
    },
    {
      productionOrderNumber: 'PO-MFG-8002',
      salesOrderNumber: 'SO-2026-002',
      productCode: 'WHL-ALU-17S',
      productName: '17x7.0J Silver Metallic Premium Alloy Wheel',
      quantityToProduce: 300,
      completedQuantity: 0,
      scrappedQuantity: 0,
      startDate: new Date('2026-11-21').toISOString(),
      dueDate: new Date('2026-12-12').toISOString(),
      currentStage: 'Rim',
      status: 'Released',
      assignedWorkCentre: 'WC-RIM-FORMING',
      assignedMachine: 'MCH-RIM-ROLL-01',
      shift: 'Shift B (Evening)',
      stageHistory: [],
      actualCostAccumulated: 0
    }
  ];
  await collections.productionOrders.deleteMany({});
  await collections.productionOrders.insertMany(productionOrdersData);

  // 12. Purchase Requisitions (PR)
  const prsData = [
    {
      prNumber: 'PR-2026-101',
      requestedBy: 'Karthik Subramanian (Production Manager)',
      department: 'Production Planning (PP)',
      requiredByDate: new Date('2026-11-28').toISOString(),
      items: [
        {
          materialCode: 'RM-STL-440',
          materialName: 'Steel Coil SAPH440',
          requiredQuantity: 15000,
          uom: 'KG',
          estimatedUnitCost: 75,
          estimatedTotalCost: 1125000,
          reasonForRequisition: 'Critical Material Shortage for SO-2026-001 & MRP replenishment'
        },
        {
          materialCode: 'RM-WLD-ER70',
          materialName: 'Robotic MIG Welding Wire ER70S-6',
          requiredQuantity: 1000,
          uom: 'KG',
          estimatedUnitCost: 185,
          estimatedTotalCost: 185000,
          reasonForRequisition: 'Stock below safety threshold (480 KG vs 600 KG safety)'
        }
      ],
      totalAmount: 1310000,
      status: 'Pending Approval', // Demonstrates approval workflow!
      approvedBy: null,
      approvalDate: null
    },
    {
      prNumber: 'PR-2026-100',
      requestedBy: 'Gopalakrishnan Nair (Store Manager)',
      department: 'Materials Management (MM)',
      requiredByDate: new Date('2026-11-22').toISOString(),
      items: [
        {
          materialCode: 'RM-PNT-CED',
          materialName: 'Cathodic Electro-Deposition Epoxy Resin',
          requiredQuantity: 500,
          uom: 'LTR',
          estimatedUnitCost: 420,
          estimatedTotalCost: 210000,
          reasonForRequisition: 'Replenishment for CED Paint Line'
        }
      ],
      totalAmount: 210000,
      status: 'Approved',
      approvedBy: 'Rajesh K. Nambiar (Plant Head)',
      approvalDate: new Date('2026-11-20').toISOString()
    }
  ];
  await collections.purchaseRequisitions.deleteMany({});
  await collections.purchaseRequisitions.insertMany(prsData);

  // 13. Purchase Orders (PO)
  const posData = [
    {
      poNumber: 'PO-2026-501',
      prNumber: 'PR-2026-100',
      vendorCode: 'VND-KANSAI-PNT',
      vendorName: 'Kansai Nerolac Paints Ltd',
      orderDate: new Date('2026-11-21').toISOString(),
      expectedDeliveryDate: new Date('2026-11-26').toISOString(),
      items: [
        {
          materialCode: 'RM-PNT-CED',
          materialName: 'Cathodic Electro-Deposition Epoxy Resin',
          orderedQuantity: 500,
          receivedQuantity: 0,
          unitPrice: 420,
          lineTotal: 210000
        }
      ],
      totalAmount: 210000,
      status: 'Submitted'
    }
  ];
  await collections.purchaseOrders.deleteMany({});
  await collections.purchaseOrders.insertMany(posData);

  // 14. GRN (Goods Receipt Note)
  const grnsData = [
    {
      grnNumber: 'GRN-2026-301',
      poNumber: 'PO-2026-498',
      vendorCode: 'VND-JSW-STEEL',
      vendorName: 'JSW Steel Coated Products Ltd',
      receiptDate: new Date('2026-11-19').toISOString(),
      invoiceNumber: 'INV-JSW-99210',
      items: [
        {
          materialCode: 'RM-STL-440',
          materialName: 'Steel Coil SAPH440',
          receivedQuantity: 10000,
          acceptedQuantity: 10000,
          rejectedQuantity: 0,
          batchNumber: 'JSW-COIL-BATCH-440-26A',
          storageLocation: 'RMS1-A01'
        }
      ],
      receivedBy: 'Gopalakrishnan Nair (Store Manager)',
      inspectionStatus: 'QC Passed'
    }
  ];
  await collections.grns.deleteMany({});
  await collections.grns.insertMany(grnsData);

  // 15. Quality Inspections
  const qualityData = [
    {
      inspectionNumber: 'QC-INS-9001',
      inspectionType: 'In-Process (Production)',
      referenceDocument: 'PO-MFG-8001',
      materialOrProductCode: 'WHL-STL-22C',
      batchNumber: 'BATCH-MFG-8001-A',
      sampleSize: 15,
      inspectionStage: 'Assembly (Robotic MIG Welding)',
      parametersChecked: [
        {
          parameter: 'Weld Penetration Depth',
          nominalValue: '4.5 mm',
          minTolerance: '4.0 mm',
          maxTolerance: '5.2 mm',
          actualReading: '4.7 mm',
          result: 'Pass'
        },
        {
          parameter: 'Radial Runout (TIR)',
          nominalValue: '0.6 mm',
          minTolerance: '0.0 mm',
          maxTolerance: '0.9 mm',
          actualReading: '0.55 mm',
          result: 'Pass'
        },
        {
          parameter: 'Lateral Runout (TIR)',
          nominalValue: '0.7 mm',
          minTolerance: '0.0 mm',
          maxTolerance: '1.0 mm',
          actualReading: '0.68 mm',
          result: 'Pass'
        },
        {
          parameter: 'Weld Porosity / Undercut',
          nominalValue: 'Zero defect',
          minTolerance: '0',
          maxTolerance: '0',
          actualReading: 'No defect detected under dye-penetrant test',
          result: 'Pass'
        }
      ],
      overallResult: 'Accepted',
      defectCategory: 'None',
      reworkAction: null,
      inspectorName: 'Dr. Meenakshi Sundaram (Quality Manager)',
      inspectionDate: new Date('2026-11-20T14:30:00').toISOString()
    },
    {
      inspectionNumber: 'QC-INS-9002',
      inspectionType: 'Final (FERT)',
      referenceDocument: 'WHL-ALU-16D-LOT14',
      materialOrProductCode: 'WHL-ALU-16D',
      batchNumber: 'LOT-ALU16-014',
      sampleSize: 10,
      inspectionStage: 'Final Quality Gate',
      parametersChecked: [
        {
          parameter: 'CED Paint Film Thickness',
          nominalValue: '25 um',
          minTolerance: '20 um',
          maxTolerance: '32 um',
          actualReading: '27 um',
          result: 'Pass'
        },
        {
          parameter: 'Dynamic Radial Fatigue Test (1M cycles)',
          nominalValue: '1000000 revs',
          minTolerance: '1000000',
          maxTolerance: 'N/A',
          actualReading: '1200000 revs with zero crack',
          result: 'Pass'
        },
        {
          parameter: 'Flange Air Leakage Test (at 8 bar)',
          nominalValue: 'Zero bubble leak',
          minTolerance: '0',
          maxTolerance: '0',
          actualReading: 'No bubbles observed during 60s water immersion',
          result: 'Pass'
        }
      ],
      overallResult: 'Accepted',
      defectCategory: 'None',
      reworkAction: null,
      inspectorName: 'G. Swaminathan (Lead QC Inspector)',
      inspectionDate: new Date('2026-11-21T11:00:00').toISOString()
    }
  ];
  await collections.qualityInspections.deleteMany({});
  await collections.qualityInspections.insertMany(qualityData);

  // 16. Plant Maintenance & Downtime
  const maintenanceData = [
    {
      orderNumber: 'MO-2026-401',
      machineCode: 'MCH-FURNACE-T6-01',
      machineName: 'Seco/Warwick Mesh Belt Continuous T6 Heat Treatment Furnace',
      maintenanceType: 'Preventive',
      scheduledDate: new Date('2026-11-28').toISOString(),
      completionDate: null,
      priority: 'High',
      reportedIssue: 'Zone 3 thermocouple calibration drift detected; heating elements inspection required',
      actionTaken: 'Scheduled replacement of Type-K thermocouples and heating element resistance check',
      downtimeHours: 4.5,
      sparePartsUsed: [
        { materialCode: 'SP-TC-TYPE-K', quantity: 4, cost: 12000 }
      ],
      laborCost: 6500,
      totalCost: 18500,
      status: 'Open',
      technicianName: 'Arun Varma (Maintenance Lead)'
    },
    {
      orderNumber: 'MO-2026-398',
      machineCode: 'MCH-PRESS-2500T',
      machineName: 'Schuler 2500-Ton Hydraulic Multi-Stage Stamping Press',
      maintenanceType: 'Breakdown',
      scheduledDate: new Date('2026-11-12').toISOString(),
      completionDate: new Date('2026-11-12T18:00:00').toISOString(),
      priority: 'Emergency',
      reportedIssue: 'Main ram hydraulic proportional valve oil seal leakage causing pressure drop',
      actionTaken: 'Replaced high-pressure Viton seals and flushed hydraulic return filter cartridge',
      downtimeHours: 3.2,
      sparePartsUsed: [
        { materialCode: 'SP-SEAL-VITON-120', quantity: 2, cost: 8500 }
      ],
      laborCost: 4800,
      totalCost: 13300,
      status: 'Completed',
      technicianName: 'Arun Varma & Rexroth Service Engineer'
    }
  ];
  await collections.maintenanceOrders.deleteMany({});
  await collections.maintenanceOrders.insertMany(maintenanceData);

  const downtimeLogsData = [
    {
      logNumber: 'DTL-2026-112',
      machineCode: 'MCH-PRESS-2500T',
      machineName: 'Schuler 2500-Ton Hydraulic Multi-Stage Stamping Press',
      startTime: new Date('2026-11-12T14:45:00').toISOString(),
      endTime: new Date('2026-11-12T18:00:00').toISOString(),
      durationMinutes: 195,
      reasonCategory: 'Mechanical Failure',
      rootCause: 'High-pressure oil seal rupture due to thermal fatigue on hydraulic manifold',
      loggedBy: 'Arun Varma (Maintenance Manager)'
    },
    {
      logNumber: 'DTL-2026-113',
      machineCode: 'MCH-FURNACE-T6-01',
      machineName: 'Continuous T6 Heat Treatment Furnace',
      startTime: new Date('2026-11-18T10:15:00').toISOString(),
      endTime: new Date('2026-11-18T11:45:00').toISOString(),
      durationMinutes: 90,
      reasonCategory: 'Electrical Fault',
      rootCause: 'Zone 3 SCR thyristor fuse blown due to power surge',
      loggedBy: 'K. Selvam (Electrical Technician)'
    }
  ];
  await collections.downtimeLogs.deleteMany({});
  await collections.downtimeLogs.insertMany(downtimeLogsData);

  // 17. Cost Centers & Profit Centers
  const costCentresData = [
    {
      costCenterCode: 'CC-PRESS-SHOP',
      name: 'Press & Blanking Shop Cost Center',
      department: 'Manufacturing',
      monthlyBudget: 1800000,
      actualExpenditure: 1650000,
      variance: -150000 // Favorable
    },
    {
      costCenterCode: 'CC-WELDING',
      name: 'Robotic Welding Cost Center',
      department: 'Assembly',
      monthlyBudget: 1400000,
      actualExpenditure: 1495000,
      variance: 95000 // Unfavorable (Weld wire price increase)
    },
    {
      costCenterCode: 'CC-PAINT-CED',
      name: 'Cathodic Paint Shop Cost Center',
      department: 'Finishing',
      monthlyBudget: 2200000,
      actualExpenditure: 2120000,
      variance: -80000
    },
    {
      costCenterCode: 'CC-HEAT-TREAT',
      name: 'T6 Thermal Processing Cost Center',
      department: 'Thermal Operations',
      monthlyBudget: 2500000,
      actualExpenditure: 2680000,
      variance: 180000 // Unfavorable power tariff impact
    }
  ];
  await collections.costCentres.deleteMany({});
  await collections.costCentres.insertMany(costCentresData);

  const profitCentresData = [
    {
      profitCenterCode: 'PC-COMMERCIAL-WHEELS',
      name: 'Commercial Vehicle Wheels Business Unit',
      division: 'Heavy Commercial & Bus',
      revenueTarget: 45000000,
      actualRevenue: 48200000,
      directCosts: 33100000,
      grossMarginPercentage: 31.3
    },
    {
      profitCenterCode: 'PC-PASSENGER-ALLOY',
      name: 'Passenger Car Alloy Wheels Business Unit',
      division: 'OEM & Aftermarket Car',
      revenueTarget: 38000000,
      actualRevenue: 36500000,
      directCosts: 24800000,
      grossMarginPercentage: 32.1
    }
  ];
  await collections.profitCentres.deleteMany({});
  await collections.profitCentres.insertMany(profitCentresData);

  // 18. Cost Records (Standard vs Actual Cost Variance)
  const costRecordsData = [
    {
      recordNumber: 'CR-2026-701',
      productionOrderNumber: 'PO-MFG-8001',
      productCode: 'WHL-STL-22C',
      standardMaterialCost: 4802.25,
      actualMaterialCost: 4910.50,
      standardLaborCost: 450.00,
      actualLaborCost: 480.00,
      standardOverheadCost: 850.00,
      actualOverheadCost: 910.00,
      totalStandardCost: 6102.25,
      totalActualCost: 6300.50,
      costVariance: 198.25,
      variancePercentage: 3.25,
      status: 'Action Required' // Minor cost overrun flagged by AI
    },
    {
      recordNumber: 'CR-2026-699',
      productionOrderNumber: 'PO-MFG-7995',
      productCode: 'WHL-ALU-16D',
      standardMaterialCost: 3170.53,
      actualMaterialCost: 3140.00,
      standardLaborCost: 380.00,
      actualLaborCost: 375.00,
      standardOverheadCost: 700.00,
      actualOverheadCost: 685.00,
      totalStandardCost: 4250.53,
      totalActualCost: 4200.00,
      costVariance: -50.53,
      variancePercentage: -1.19,
      status: 'Optimal'
    }
  ];
  await collections.costRecords.deleteMany({});
  await collections.costRecords.insertMany(costRecordsData);

  // 19. Notifications
  const notificationsData = [
    {
      id: 'NOTIF-01',
      type: 'SHORTAGE_ALERT',
      title: 'Material Shortage Detected: Steel Coil SAPH440',
      message: 'Current available stock (5,700 KG) is below safety stock (10,000 KG). PR-2026-101 pending approval.',
      severity: 'danger',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/mrp'
    },
    {
      id: 'NOTIF-02',
      type: 'APPROVAL_REQUEST',
      title: 'PR-2026-101 Awaiting Plant Head Approval',
      message: 'Purchase Requisition for ₹13,10,000 submitted by Production Manager requires executive sign-off.',
      severity: 'warning',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/procurement/requisitions'
    },
    {
      id: 'NOTIF-03',
      type: 'BOTTLENECK_ALERT',
      title: 'Assembly Station Load at 96% Capacity',
      message: 'Robotic MIG Welding station (WC-ASSY-WELD) queue is increasing. Potential delivery delay of 1.5 days if unmitigated.',
      severity: 'warning',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/production/tracking'
    },
    {
      id: 'NOTIF-04',
      type: 'DOWNTIME_ALERT',
      title: 'Preventive Maintenance Due on T6 Furnace',
      message: 'Furnace MCH-FURNACE-T6-01 scheduled for calibration on 28-Nov-2026.',
      severity: 'info',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/maintenance'
    }
  ];
  await collections.notifications.deleteMany({});
  await collections.notifications.insertMany(notificationsData);

  // 20. Audit Logs
  const auditLogsData = [
    {
      id: 'AUD-001',
      user: 'admin',
      action: 'SYSTEM_INITIALIZATION',
      module: 'Basis / System Admin',
      documentNumber: 'SYS-INIT-2026',
      details: 'Enterprise ERP seed database successfully loaded with automotive manufacturing configuration.',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    },
    {
      id: 'AUD-002',
      user: 'salesmgr',
      action: 'SALES_ORDER_CREATE',
      module: 'Sales & Distribution (SD)',
      documentNumber: 'SO-2026-003',
      details: 'Created urgent order for Maruti Suzuki India (400 Units WHL-ALU-16D).',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      ipAddress: '192.168.1.45'
    },
    {
      id: 'AUD-003',
      user: 'prodmgr',
      action: 'PRODUCTION_ORDER_RELEASE',
      module: 'Production Planning (PP)',
      documentNumber: 'PO-MFG-8001',
      details: 'Released production order for 500 units of Commercial Steel Wheels (WHL-STL-22C).',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      ipAddress: '192.168.1.62'
    }
  ];
  await collections.auditLogs.deleteMany({});
  await collections.auditLogs.insertMany(auditLogsData);

  console.log('[Seed Engine] Seeding complete! 20 enterprise collections loaded.');
};

// If run directly via node seed/seedData.js
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => {
    console.log('[Seed Engine] Finished direct execution.');
    process.exit(0);
  }).catch(err => {
    console.error('[Seed Engine] Seed error:', err);
    process.exit(1);
  });
}
