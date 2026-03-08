import type { Supplier, StockOpportunity, Quote, MarginScenario, PurchaseOrder, SupplierEvaluation, ProcurementActivity } from '@/types/procurement';

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1', legalName: 'Global Beverages GmbH', tradeName: 'Global Beverages', vatNumber: 'DE123456789', country: 'Alemanha', address: 'Berliner Str. 45, Hamburg', website: 'https://globalbev.de', email: 'sales@globalbev.de', phone: '+49 40 1234567', defaultCurrency: 'EUR', defaultIncoterm: 'EXW', status: 'ativo', classification: 'estrategico',
    contacts: [{ id: 'sc-1', name: 'Hans Müller', role: 'comercial', email: 'hans@globalbev.de', phone: '+49 40 1234567', language: 'EN/DE', isPrimary: true }],
    categoriesSupplied: ['Bebidas', 'Bebidas Energéticas'], brandsSupplied: ['Red Bull', 'Monster', 'Coca-Cola'], marketsOfOrigin: ['Europa Central', 'DACH'], avgMOQ: '1 pallet', avgLeadTime: '5-7 dias', paymentTerms: 'Net 30', avgPaymentDays: 30, requiresAdvancePayment: false, financialRisk: 'baixo',
    stockLocations: ['Hamburg', 'Rotterdam'], scoreGlobal: 92, scorePrice: 88, scoreDelivery: 95, scoreQuality: 93, scoreResponsiveness: 90, abcClassification: 'A', tags: ['fornecedor estratégico', 'resposta rápida'], totalPurchases: 2450000, totalOrders: 87, incidentCount: 2, onTimeDeliveryRate: 96, owner: 'Miguel Costa', createdAt: '2024-01-15', lastInteraction: '2025-03-05', strategicNotes: 'Parceiro chave para bebidas energéticas na Europa.'
  },
  {
    id: 'sup-2', legalName: 'Mediterranean Foods S.r.l.', tradeName: 'MedFoods', vatNumber: 'IT987654321', country: 'Itália', address: 'Via Roma 120, Milano', website: 'https://medfoods.it', email: 'export@medfoods.it', phone: '+39 02 9876543', defaultCurrency: 'EUR', defaultIncoterm: 'FCA', status: 'ativo', classification: 'preferencial',
    contacts: [{ id: 'sc-2', name: 'Marco Rossi', role: 'comercial', email: 'marco@medfoods.it', phone: '+39 02 9876543', language: 'EN/IT', isPrimary: true }],
    categoriesSupplied: ['Snacks', 'Confeitaria', 'Alimentação'], brandsSupplied: ['Ferrero', 'Barilla', 'Nutella'], marketsOfOrigin: ['Sul da Europa', 'Mediterrâneo'], avgMOQ: '1/2 pallet', avgLeadTime: '7-10 dias', paymentTerms: 'Net 45', avgPaymentDays: 45, requiresAdvancePayment: false, financialRisk: 'baixo',
    stockLocations: ['Milano', 'Verona'], scoreGlobal: 87, scorePrice: 82, scoreDelivery: 90, scoreQuality: 91, scoreResponsiveness: 85, abcClassification: 'A', tags: ['premium', 'fornecedor estratégico'], totalPurchases: 1890000, totalOrders: 64, incidentCount: 3, onTimeDeliveryRate: 92, owner: 'Ana Silva', createdAt: '2024-02-20', lastInteraction: '2025-03-02'
  },
  {
    id: 'sup-3', legalName: 'Baltic Trading OÜ', tradeName: 'Baltic Trade', vatNumber: 'EE112233445', country: 'Estónia', address: 'Tartu mnt 22, Tallinn', email: 'info@baltictrade.ee', phone: '+372 5551234', defaultCurrency: 'EUR', defaultIncoterm: 'EXW', status: 'ativo', classification: 'qualificado',
    contacts: [{ id: 'sc-3', name: 'Andrei Kask', role: 'comercial', email: 'andrei@baltictrade.ee', phone: '+372 5551234', language: 'EN', isPrimary: true }],
    categoriesSupplied: ['Bebidas', 'Personal Care'], brandsSupplied: ['Pepsi', 'Dove', 'Nivea'], marketsOfOrigin: ['Bálticos', 'Escandinávia'], avgMOQ: '1 pallet', avgLeadTime: '10-14 dias', paymentTerms: 'Net 30', avgPaymentDays: 30, requiresAdvancePayment: true, financialRisk: 'medio',
    stockLocations: ['Tallinn', 'Riga'], scoreGlobal: 74, scorePrice: 80, scoreDelivery: 72, scoreQuality: 78, scoreResponsiveness: 68, abcClassification: 'B', tags: ['preço agressivo'], totalPurchases: 680000, totalOrders: 28, incidentCount: 5, onTimeDeliveryRate: 78, owner: 'Miguel Costa', createdAt: '2024-05-10', lastInteraction: '2025-02-18'
  },
  {
    id: 'sup-4', legalName: 'UK Consumer Goods Ltd', tradeName: 'UKCG', vatNumber: 'GB445566778', country: 'Reino Unido', address: '14 Trade Lane, London', email: 'trade@ukcg.co.uk', phone: '+44 20 7654321', defaultCurrency: 'GBP', defaultIncoterm: 'EXW', status: 'em_avaliacao', classification: 'em_observacao',
    contacts: [{ id: 'sc-4', name: 'James Wilson', role: 'comercial', email: 'james@ukcg.co.uk', phone: '+44 20 7654321', language: 'EN', isPrimary: true }],
    categoriesSupplied: ['Bebidas', 'Snacks', 'Personal Care'], brandsSupplied: ['Cadbury', 'Walkers', 'Lynx'], marketsOfOrigin: ['UK', 'Irlanda'], avgMOQ: '2 pallets', avgLeadTime: '14-21 dias', paymentTerms: 'Prepayment 50%', avgPaymentDays: 15, requiresAdvancePayment: true, financialRisk: 'medio',
    stockLocations: ['London', 'Birmingham'], scoreGlobal: 65, scorePrice: 70, scoreDelivery: 60, scoreQuality: 72, scoreResponsiveness: 58, abcClassification: 'C', tags: ['alto risco'], totalPurchases: 120000, totalOrders: 6, incidentCount: 2, onTimeDeliveryRate: 67, owner: 'Ana Silva', createdAt: '2024-11-01', lastInteraction: '2025-01-20'
  },
];

export const mockOpportunities: StockOpportunity[] = [
  {
    id: 'opp-1', code: 'OPP-2025-0142', supplierId: 'sup-1', supplierName: 'Global Beverages', product: 'Red Bull Energy Drink 250ml x24', brand: 'Red Bull', category: 'Bebidas Energéticas', ean: '9002490100070', description: 'Red Bull classic 250ml, tray 24un, stock disponível imediato', quantityAvailable: 2400, unitOfMeasure: 'caixas', buyPrice: 18.50, currency: 'EUR', incoterm: 'EXW', stockOrigin: 'Overstock', country: 'Alemanha', warehouseLocation: 'Hamburg', productExpiry: '2026-02-15', offerExpiry: '2025-03-20', moq: 100, leadTimeDays: 5, priority: 'alta', status: 'em_analise', estimatedMargin: 4200, estimatedMarginPct: 9.5, tags: ['oportunidade urgente', 'bonded stock'], attachments: 2, owner: 'Miguel Costa', createdAt: '2025-03-01', updatedAt: '2025-03-06', notes: 'Stock de overstock, boas condições.'
  },
  {
    id: 'opp-2', code: 'OPP-2025-0143', supplierId: 'sup-2', supplierName: 'MedFoods', product: 'Nutella 750g x6', brand: 'Nutella', category: 'Alimentação', ean: '8000500217467', description: 'Nutella 750g pack 6un, produção recente', quantityAvailable: 800, unitOfMeasure: 'caixas', buyPrice: 22.80, currency: 'EUR', incoterm: 'FCA', stockOrigin: 'Produção', country: 'Itália', warehouseLocation: 'Milano', productExpiry: '2026-06-30', offerExpiry: '2025-03-25', moq: 50, leadTimeDays: 7, priority: 'media', status: 'nova', estimatedMargin: 3600, estimatedMarginPct: 8.2, tags: ['premium'], attachments: 1, owner: 'Ana Silva', createdAt: '2025-03-03', updatedAt: '2025-03-03'
  },
  {
    id: 'opp-3', code: 'OPP-2025-0144', supplierId: 'sup-1', supplierName: 'Global Beverages', product: 'Monster Energy 500ml x24', brand: 'Monster', category: 'Bebidas Energéticas', description: 'Monster Energy Green 500ml tray 24', quantityAvailable: 1500, unitOfMeasure: 'caixas', buyPrice: 16.20, currency: 'EUR', incoterm: 'EXW', stockOrigin: 'Distribuidor', country: 'Alemanha', warehouseLocation: 'Hamburg', productExpiry: '2026-01-10', offerExpiry: '2025-03-15', moq: 200, leadTimeDays: 5, priority: 'urgente', status: 'cotacao_comparacao', estimatedMargin: 2800, estimatedMarginPct: 7.8, tags: ['oportunidade urgente', 'validade curta'], attachments: 0, owner: 'Miguel Costa', createdAt: '2025-02-28', updatedAt: '2025-03-06', notes: 'Validade curta, preço bom. Comparar com Baltic Trade.'
  },
  {
    id: 'opp-4', code: 'OPP-2025-0138', supplierId: 'sup-3', supplierName: 'Baltic Trade', product: 'Pepsi Max 330ml x24', brand: 'Pepsi', category: 'Bebidas', description: 'Pepsi Max 330ml cans tray 24un', quantityAvailable: 3000, unitOfMeasure: 'caixas', buyPrice: 7.90, currency: 'EUR', incoterm: 'EXW', stockOrigin: 'Overstock', country: 'Estónia', warehouseLocation: 'Tallinn', productExpiry: '2025-12-01', offerExpiry: '2025-03-12', moq: 300, leadTimeDays: 12, priority: 'alta', status: 'aprovada', estimatedMargin: 5400, estimatedMarginPct: 11.2, tags: ['preço agressivo'], attachments: 1, owner: 'Miguel Costa', createdAt: '2025-02-20', updatedAt: '2025-03-05'
  },
  {
    id: 'opp-5', code: 'OPP-2025-0135', supplierId: 'sup-2', supplierName: 'MedFoods', product: 'Ferrero Rocher T30 x6', brand: 'Ferrero', category: 'Confeitaria', description: 'Ferrero Rocher T30 pack 6un, edição standard', quantityAvailable: 500, unitOfMeasure: 'caixas', buyPrice: 38.50, currency: 'EUR', incoterm: 'FCA', stockOrigin: 'Produção', country: 'Itália', warehouseLocation: 'Verona', productExpiry: '2026-04-15', offerExpiry: '2025-04-01', moq: 25, leadTimeDays: 8, priority: 'media', status: 'convertida', estimatedMargin: 2200, estimatedMarginPct: 6.5, tags: ['sazonal'], attachments: 3, owner: 'Ana Silva', createdAt: '2025-02-10', updatedAt: '2025-03-01'
  },
  {
    id: 'opp-6', code: 'OPP-2025-0130', supplierId: 'sup-4', supplierName: 'UKCG', product: 'Cadbury Dairy Milk 200g x24', brand: 'Cadbury', category: 'Confeitaria', description: 'Cadbury Dairy Milk bar 200g, tray 24un', quantityAvailable: 600, unitOfMeasure: 'caixas', buyPrice: 28.00, currency: 'GBP', incoterm: 'EXW', stockOrigin: 'Distribuidor', country: 'Reino Unido', warehouseLocation: 'Birmingham', offerExpiry: '2025-03-08', moq: 100, leadTimeDays: 18, priority: 'baixa', status: 'expirada', tags: ['alto risco'], attachments: 0, owner: 'Ana Silva', createdAt: '2025-02-05', updatedAt: '2025-03-08'
  },
];

export const mockQuotes: Quote[] = [
  { id: 'q-1', opportunityId: 'opp-3', supplierId: 'sup-1', supplierName: 'Global Beverages', product: 'Monster Energy 500ml x24', brand: 'Monster', quantity: 1500, unitPrice: 16.20, currency: 'EUR', incoterm: 'EXW', leadTimeDays: 5, offerExpiry: '2025-03-15', moq: 200, location: 'Hamburg', paymentTerms: 'Net 30', supplierScore: 92, estimatedLogisticsCost: 1.20, estimatedLandedCost: 17.40, estimatedMargin: 2.10, estimatedMarginPct: 10.8, isWinner: true, createdAt: '2025-03-02' },
  { id: 'q-2', opportunityId: 'opp-3', supplierId: 'sup-3', supplierName: 'Baltic Trade', product: 'Monster Energy 500ml x24', brand: 'Monster', quantity: 1500, unitPrice: 15.80, currency: 'EUR', incoterm: 'EXW', leadTimeDays: 12, offerExpiry: '2025-03-18', moq: 300, location: 'Tallinn', paymentTerms: 'Prepayment 50%', supplierScore: 74, estimatedLogisticsCost: 2.50, estimatedLandedCost: 18.30, estimatedMargin: 1.20, estimatedMarginPct: 6.2, isWinner: false, createdAt: '2025-03-03' },
  { id: 'q-3', opportunityId: 'opp-1', supplierId: 'sup-1', supplierName: 'Global Beverages', product: 'Red Bull 250ml x24', brand: 'Red Bull', quantity: 2400, unitPrice: 18.50, currency: 'EUR', incoterm: 'EXW', leadTimeDays: 5, offerExpiry: '2025-03-20', moq: 100, location: 'Hamburg', paymentTerms: 'Net 30', supplierScore: 92, estimatedLogisticsCost: 1.00, estimatedLandedCost: 19.50, estimatedMargin: 2.50, estimatedMarginPct: 11.4, isWinner: true, createdAt: '2025-03-01' },
];

export const mockMarginScenarios: MarginScenario[] = [
  { id: 'ms-1', name: 'Red Bull EXW Hamburg - Cenário Base', opportunityId: 'opp-1', buyPrice: 18.50, quantity: 2400, currency: 'EUR', exchangeRate: 1, transportCost: 2400, insuranceCost: 350, documentCost: 150, financialCost: 200, commissions: 0, otherCosts: 100, targetSellPrice: 22.00, landedCost: 19.83, totalCost: 47600, marginUnit: 2.17, marginTotal: 5200, marginPct: 9.9, minSellPrice: 20.82, belowMinMargin: false, createdAt: '2025-03-04' },
  { id: 'ms-2', name: 'Red Bull EXW Hamburg - Cenário Otimista', opportunityId: 'opp-1', buyPrice: 18.50, quantity: 2400, currency: 'EUR', exchangeRate: 1, transportCost: 2000, insuranceCost: 300, documentCost: 150, financialCost: 150, commissions: 0, otherCosts: 80, targetSellPrice: 23.00, landedCost: 19.62, totalCost: 47080, marginUnit: 3.38, marginTotal: 8120, marginPct: 14.7, minSellPrice: 20.60, belowMinMargin: false, createdAt: '2025-03-04' },
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1', poNumber: 'PO-2025-0089', supplierId: 'sup-1', supplierName: 'Global Beverages', supplierContact: 'Hans Müller', issueDate: '2025-03-05', expectedDelivery: '2025-03-12',
    items: [{ id: 'poi-1', product: 'Red Bull Energy Drink 250ml x24', brand: 'Red Bull', category: 'Bebidas Energéticas', quantity: 2400, unitPrice: 18.50, subtotal: 44400 }],
    totalValue: 44400, currency: 'EUR', incoterm: 'EXW', loadingLocation: 'Hamburg', paymentTerms: 'Net 30', status: 'enviada', approver: 'Director Geral', createdBy: 'Miguel Costa', createdAt: '2025-03-05', updatedAt: '2025-03-06', attachments: 1
  },
  {
    id: 'po-2', poNumber: 'PO-2025-0090', supplierId: 'sup-3', supplierName: 'Baltic Trade', supplierContact: 'Andrei Kask', issueDate: '2025-03-06', expectedDelivery: '2025-03-20',
    items: [{ id: 'poi-2', product: 'Pepsi Max 330ml x24', brand: 'Pepsi', category: 'Bebidas', quantity: 3000, unitPrice: 7.90, subtotal: 23700 }],
    totalValue: 23700, currency: 'EUR', incoterm: 'EXW', loadingLocation: 'Tallinn', paymentTerms: 'Prepayment 50%', status: 'em_aprovacao', createdBy: 'Miguel Costa', createdAt: '2025-03-06', updatedAt: '2025-03-06', attachments: 0
  },
  {
    id: 'po-3', poNumber: 'PO-2025-0085', supplierId: 'sup-2', supplierName: 'MedFoods', supplierContact: 'Marco Rossi', issueDate: '2025-02-28', expectedDelivery: '2025-03-08',
    items: [
      { id: 'poi-3', product: 'Ferrero Rocher T30 x6', brand: 'Ferrero', category: 'Confeitaria', quantity: 500, unitPrice: 38.50, subtotal: 19250 },
      { id: 'poi-4', product: 'Nutella 750g x6', brand: 'Nutella', category: 'Alimentação', quantity: 200, unitPrice: 22.80, subtotal: 4560 },
    ],
    totalValue: 23810, currency: 'EUR', incoterm: 'FCA', loadingLocation: 'Verona', paymentTerms: 'Net 45', status: 'confirmada', approver: 'Director Geral', createdBy: 'Ana Silva', createdAt: '2025-02-28', updatedAt: '2025-03-02', attachments: 2
  },
];

export const mockEvaluations: SupplierEvaluation[] = [
  { id: 'ev-1', supplierId: 'sup-1', supplierName: 'Global Beverages', period: 'Q1 2025', priceScore: 88, deliveryScore: 95, qualityScore: 93, responsivenessScore: 90, documentScore: 92, flexibilityScore: 85, reliabilityScore: 94, globalScore: 92, onTimeRate: 96, incidentRate: 2.3, avgPriceVariation: 1.2, evaluatedBy: 'Miguel Costa', evaluatedAt: '2025-03-01' },
  { id: 'ev-2', supplierId: 'sup-2', supplierName: 'MedFoods', period: 'Q1 2025', priceScore: 82, deliveryScore: 90, qualityScore: 91, responsivenessScore: 85, documentScore: 88, flexibilityScore: 80, reliabilityScore: 89, globalScore: 87, onTimeRate: 92, incidentRate: 4.7, avgPriceVariation: 2.1, evaluatedBy: 'Ana Silva', evaluatedAt: '2025-03-01' },
  { id: 'ev-3', supplierId: 'sup-3', supplierName: 'Baltic Trade', period: 'Q1 2025', priceScore: 80, deliveryScore: 72, qualityScore: 78, responsivenessScore: 68, documentScore: 70, flexibilityScore: 75, reliabilityScore: 73, globalScore: 74, onTimeRate: 78, incidentRate: 8.5, avgPriceVariation: 3.8, evaluatedBy: 'Miguel Costa', evaluatedAt: '2025-03-01' },
  { id: 'ev-4', supplierId: 'sup-4', supplierName: 'UKCG', period: 'Q1 2025', priceScore: 70, deliveryScore: 60, qualityScore: 72, responsivenessScore: 58, documentScore: 55, flexibilityScore: 62, reliabilityScore: 65, globalScore: 65, onTimeRate: 67, incidentRate: 12.5, avgPriceVariation: 5.2, evaluatedBy: 'Ana Silva', evaluatedAt: '2025-03-01' },
];

export const mockProcurementActivities: ProcurementActivity[] = [
  { id: 'pa-1', type: 'follow_up', title: 'Follow-up cotação Monster Energy', relatedTo: 'Global Beverages', relatedType: 'opportunity', relatedId: 'opp-3', dueDate: '2025-03-08', completed: false, owner: 'Miguel Costa', createdAt: '2025-03-05' },
  { id: 'pa-2', type: 'chamada', title: 'Confirmar disponibilidade Pepsi Max', relatedTo: 'Baltic Trade', relatedType: 'supplier', relatedId: 'sup-3', dueDate: '2025-03-07', completed: true, owner: 'Miguel Costa', createdAt: '2025-03-04' },
  { id: 'pa-3', type: 'tarefa', title: 'Preparar comparação de cotações Ferrero', relatedTo: 'MedFoods', relatedType: 'quote', relatedId: 'q-3', dueDate: '2025-03-10', completed: false, owner: 'Ana Silva', createdAt: '2025-03-06' },
  { id: 'pa-4', type: 'reuniao', title: 'Reunião avaliação trimestral UKCG', relatedTo: 'UKCG', relatedType: 'supplier', relatedId: 'sup-4', dueDate: '2025-03-12', completed: false, owner: 'Ana Silva', createdAt: '2025-03-05' },
  { id: 'pa-5', type: 'reminder', title: 'Verificar PO pendente Baltic Trade', relatedTo: 'Baltic Trade', relatedType: 'po', relatedId: 'po-2', dueDate: '2025-03-09', completed: false, owner: 'Miguel Costa', createdAt: '2025-03-06' },
];
