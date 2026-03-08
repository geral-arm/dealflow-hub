import type { Lead, Client, Opportunity, Proposal, Activity, Negotiation } from '@/types/crm';

export const mockLeads: Lead[] = [
  {
    id: 'LD-001', companyName: 'Distribuidora Ibérica S.A.', contactName: 'Carlos Mendes', contactRole: 'Diretor Comercial',
    email: 'carlos@distribuidoraiberica.es', phone: '+34 612 345 678', country: 'Espanha', market: 'Ibéria',
    website: 'www.distribuidoraiberica.es', source: 'Feira Anuga 2025', categoriesOfInterest: ['Bebidas', 'Snacks'],
    brandsOfInterest: ['Coca-Cola', 'Pringles'], potentialVolume: '€120,000/mês', currency: 'EUR', preferredIncoterm: 'CIF',
    status: 'qualificado', score: 85, owner: 'Ana Silva', createdAt: '2026-02-15', lastInteraction: '2026-03-05',
    nextAction: 'Enviar proposta de Coca-Cola 330ml', nextActionDate: '2026-03-10', tags: ['alto_potencial', 'bebidas'],
    notes: 'Cliente interessado em volumes regulares de bebidas para Espanha e Portugal.',
  },
  {
    id: 'LD-002', companyName: 'Nordic Food Imports', contactName: 'Erik Johansson', contactRole: 'Procurement Manager',
    email: 'erik@nordicfood.se', phone: '+46 70 123 4567', country: 'Suécia', market: 'Escandinávia',
    source: 'LinkedIn', categoriesOfInterest: ['Confectionery', 'Personal Care'], brandsOfInterest: ['Nutella', 'Dove'],
    potentialVolume: '€80,000/mês', currency: 'EUR', preferredIncoterm: 'DAP', status: 'novo', score: 62,
    owner: 'Miguel Costa', createdAt: '2026-03-01', lastInteraction: '2026-03-01', tags: ['novo_mercado'],
    notes: 'Contacto feito via LinkedIn. Empresa com rede de distribuição nórdica.',
  },
  {
    id: 'LD-003', companyName: 'Al Rashid Trading LLC', contactName: 'Mohammed Al Rashid', contactRole: 'CEO',
    email: 'mohammed@alrashidtrading.ae', phone: '+971 50 987 6543', country: 'EAU', market: 'Médio Oriente',
    source: 'Referência', categoriesOfInterest: ['Bebidas Energéticas', 'Snacks', 'Chocolates'],
    brandsOfInterest: ['Red Bull', "M&M's", 'Toblerone'], potentialVolume: '€250,000/mês', currency: 'USD',
    preferredIncoterm: 'FOB', status: 'em_negociacao', score: 92, owner: 'Ana Silva',
    createdAt: '2026-01-20', lastInteraction: '2026-03-06', nextAction: 'Reunião por Zoom', nextActionDate: '2026-03-09',
    tags: ['key_account', 'alto_potencial', 'premium'], notes: 'Grande potencial. Rede de distribuição em 6 países do Golfo.',
  },
  {
    id: 'LD-004', companyName: 'Balkan Wholesale d.o.o.', contactName: 'Dragan Petrović', contactRole: 'Diretor de Compras',
    email: 'dragan@balkanwholesale.rs', phone: '+381 63 555 1234', country: 'Sérvia', market: 'Balcãs',
    source: 'Website', categoriesOfInterest: ['Bebidas', 'Alimentação'], brandsOfInterest: ['Pepsi', 'Kelloggs'],
    potentialVolume: '€45,000/mês', currency: 'EUR', preferredIncoterm: 'EXW', status: 'por_qualificar', score: 45,
    owner: 'Miguel Costa', createdAt: '2026-03-04', lastInteraction: '2026-03-04', tags: [],
    notes: 'Formulário preenchido no website. Necessário qualificar.',
  },
  {
    id: 'LD-005', companyName: 'West Africa Supplies Ltd', contactName: 'Kwame Asante', contactRole: 'Managing Director',
    email: 'kwame@wasupplies.gh', phone: '+233 24 123 4567', country: 'Gana', market: 'África Ocidental',
    source: 'Feira SIAL 2025', categoriesOfInterest: ['Dairy', 'Snacks', 'Bebidas'],
    brandsOfInterest: ['Nestlé', 'Pringles'], potentialVolume: '€60,000/mês', currency: 'USD',
    preferredIncoterm: 'CIF', status: 'proposta_enviada', score: 74, owner: 'Ana Silva',
    createdAt: '2026-02-01', lastInteraction: '2026-03-02', nextAction: 'Follow-up proposta',
    nextActionDate: '2026-03-08', tags: ['africa'], notes: 'Proposta enviada para Nestlé Nido e Pringles.',
  },
  {
    id: 'LD-006', companyName: 'MegaMart Polska', contactName: 'Katarzyna Nowak', contactRole: 'Head of Buying',
    email: 'k.nowak@megamart.pl', phone: '+48 22 567 8901', country: 'Polónia', market: 'Europa Central',
    source: 'Cold Call', categoriesOfInterest: ['Personal Care', 'Household'],
    brandsOfInterest: ['Dove', 'Fairy'], potentialVolume: '€35,000/mês', currency: 'EUR',
    preferredIncoterm: 'DAP', status: 'perdido', score: 30, owner: 'Miguel Costa',
    createdAt: '2026-01-10', lastInteraction: '2026-02-20', tags: [],
    notes: 'Perdido para concorrente local com preço mais competitivo.',
  },
];

export const mockClients: Client[] = [
  {
    id: 'CL-001', legalName: 'Metro Cash & Carry International GmbH', tradeName: 'Metro C&C',
    vatNumber: 'DE123456789', country: 'Alemanha', address: 'Metro-Straße 1, 40235 Düsseldorf',
    website: 'www.metro.de', clientType: 'Distribuidor', defaultCurrency: 'EUR', preferredLanguage: 'Inglês',
    defaultIncoterm: 'DAP', markets: ['Alemanha', 'Europa Central', 'Europa Oriental'], status: 'ativo',
    contacts: [
      { id: 'CC-001', name: 'Hans Weber', role: 'decisor', title: 'VP Procurement', email: 'h.weber@metro.de', phone: '+49 211 123 456', language: 'Alemão', decisionLevel: 'alto', isPrimary: true },
      { id: 'CC-002', name: 'Laura Schmidt', role: 'comprador', title: 'Category Buyer - Beverages', email: 'l.schmidt@metro.de', phone: '+49 211 123 457', language: 'Inglês', decisionLevel: 'medio', isPrimary: false },
      { id: 'CC-003', name: 'Peter Müller', role: 'logistica', title: 'Logistics Coordinator', email: 'p.muller@metro.de', phone: '+49 211 123 458', language: 'Alemão', decisionLevel: 'baixo', isPrimary: false },
    ],
    categoriesBought: ['Bebidas', 'Snacks', 'Confectionery', 'Personal Care'],
    brandsOfInterest: ['Coca-Cola', 'Pringles', 'Nutella', 'Dove'],
    avgTicket: 185000, purchaseFrequency: 'Semanal', creditLimit: 500000, paymentTerms: 'Net 30',
    commercialRisk: 'baixo', outstandingBalance: 142000, overdueInvoices: 0,
    estimatedPotential: 3000000, commercialPriority: 'alta', abcClassification: 'A',
    segment: 'Enterprise', vertical: 'Wholesale', tags: ['key_account', 'premium'],
    owner: 'Ana Silva', createdAt: '2024-06-15', lastPurchase: '2026-03-04', lastInteraction: '2026-03-06',
    strategicNotes: 'Conta estratégica. Objectivo: aumentar penetração em novas categorias.',
  },
  {
    id: 'CL-002', legalName: 'Carrefour France S.A.', tradeName: 'Carrefour',
    vatNumber: 'FR98765432100', country: 'França', address: '33 Avenue Émile Zola, 92100 Boulogne-Billancourt',
    website: 'www.carrefour.fr', clientType: 'Retalhista', defaultCurrency: 'EUR', preferredLanguage: 'Francês',
    defaultIncoterm: 'CIF', markets: ['França', 'Europa Ocidental'], status: 'ativo',
    contacts: [
      { id: 'CC-004', name: 'Pierre Dubois', role: 'decisor', title: 'Directeur des Achats', email: 'p.dubois@carrefour.fr', phone: '+33 1 2345 6789', language: 'Francês', decisionLevel: 'alto', isPrimary: true },
      { id: 'CC-005', name: 'Marie Laurent', role: 'financeiro', title: 'Credit Manager', email: 'm.laurent@carrefour.fr', phone: '+33 1 2345 6790', language: 'Francês', decisionLevel: 'medio', isPrimary: false },
    ],
    categoriesBought: ['Bebidas', 'Snacks', 'Dairy'],
    brandsOfInterest: ['Coca-Cola', "Lay's", 'Danone'],
    avgTicket: 220000, purchaseFrequency: 'Quinzenal', creditLimit: 750000, paymentTerms: 'Net 45',
    commercialRisk: 'baixo', outstandingBalance: 310000, overdueInvoices: 1,
    estimatedPotential: 4500000, commercialPriority: 'alta', abcClassification: 'A',
    segment: 'Enterprise', vertical: 'Retail', tags: ['key_account'],
    owner: 'Ana Silva', createdAt: '2024-03-10', lastPurchase: '2026-03-01', lastInteraction: '2026-03-05',
  },
  {
    id: 'CL-003', legalName: 'Aldi Süd Dienstleistungs-SE & Co.', tradeName: 'Aldi Süd',
    vatNumber: 'DE234567891', country: 'Alemanha', address: 'Burgstraße 37, 45476 Mülheim an der Ruhr',
    clientType: 'Retalhista', defaultCurrency: 'EUR', preferredLanguage: 'Inglês',
    defaultIncoterm: 'EXW', markets: ['Alemanha', 'Áustria', 'UK'], status: 'ativo',
    contacts: [
      { id: 'CC-006', name: 'Thomas Braun', role: 'comprador', title: 'Senior Buyer', email: 't.braun@aldi-sued.de', phone: '+49 208 999 111', language: 'Inglês', decisionLevel: 'alto', isPrimary: true },
    ],
    categoriesBought: ['Snacks', 'Bebidas', 'Household'],
    brandsOfInterest: ['Pringles', 'Monster Energy'],
    avgTicket: 95000, purchaseFrequency: 'Mensal', creditLimit: 300000, paymentTerms: 'Net 30',
    commercialRisk: 'baixo', outstandingBalance: 48000, overdueInvoices: 0,
    estimatedPotential: 1800000, commercialPriority: 'media', abcClassification: 'B',
    segment: 'Enterprise', vertical: 'Discount Retail', tags: ['comprador_frequente'],
    owner: 'Miguel Costa', createdAt: '2025-01-20', lastPurchase: '2026-02-28', lastInteraction: '2026-03-04',
  },
  {
    id: 'CL-004', legalName: 'Dubai Retail Group LLC', tradeName: 'DRG',
    vatNumber: 'AE-TRN-100234567', country: 'EAU', address: 'Dubai Mall, Sheikh Zayed Road, Dubai',
    clientType: 'Distribuidor', defaultCurrency: 'USD', preferredLanguage: 'Inglês',
    defaultIncoterm: 'CIF', markets: ['EAU', 'Arábia Saudita', 'Qatar'], status: 'ativo',
    contacts: [
      { id: 'CC-007', name: 'Ahmed Hassan', role: 'decisor', title: 'General Manager', email: 'ahmed@drg.ae', phone: '+971 4 123 4567', language: 'Inglês', decisionLevel: 'alto', isPrimary: true },
    ],
    categoriesBought: ['Confectionery', 'Bebidas Energéticas', 'Personal Care'],
    brandsOfInterest: ['Toblerone', 'Red Bull', 'Nivea'],
    avgTicket: 150000, purchaseFrequency: 'Quinzenal', creditLimit: 400000, paymentTerms: 'Net 30',
    commercialRisk: 'medio', outstandingBalance: 180000, overdueInvoices: 2,
    estimatedPotential: 2500000, commercialPriority: 'alta', abcClassification: 'A',
    segment: 'Mid-Market', vertical: 'Distribution', tags: ['premium', 'alto_potencial'],
    owner: 'Ana Silva', createdAt: '2025-06-01', lastPurchase: '2026-02-25', lastInteraction: '2026-03-03',
  },
];

export const mockOpportunities: Opportunity[] = [
  { id: 'OP-001', name: 'Coca-Cola 330ml x 24 - Metro DE', clientId: 'CL-001', clientName: 'Metro C&C', stage: 'proposta_enviada', estimatedValue: 185000, estimatedMargin: 12.5, probability: 70, currency: 'EUR', expectedCloseDate: '2026-03-20', nextAction: 'Follow-up proposta', owner: 'Ana Silva', categories: ['Bebidas'], brands: ['Coca-Cola'], createdAt: '2026-02-20', updatedAt: '2026-03-05' },
  { id: 'OP-002', name: 'Nutella 750g - Carrefour FR', clientId: 'CL-002', clientName: 'Carrefour', stage: 'negociacao', estimatedValue: 320000, estimatedMargin: 9.8, probability: 60, currency: 'EUR', expectedCloseDate: '2026-03-25', nextAction: 'Contra-proposta preço', owner: 'Ana Silva', categories: ['Confectionery'], brands: ['Nutella'], createdAt: '2026-02-10', updatedAt: '2026-03-06' },
  { id: 'OP-003', name: 'Pringles Mixed Flavors - Aldi', clientId: 'CL-003', clientName: 'Aldi Süd', stage: 'proposta_preparacao', estimatedValue: 95000, estimatedMargin: 14.2, probability: 50, currency: 'EUR', expectedCloseDate: '2026-04-01', nextAction: 'Preparar proposta', owner: 'Miguel Costa', categories: ['Snacks'], brands: ['Pringles'], createdAt: '2026-03-01', updatedAt: '2026-03-05' },
  { id: 'OP-004', name: 'Red Bull 250ml x 48 - DRG Dubai', clientId: 'CL-004', clientName: 'DRG', stage: 'contacto_inicial', estimatedValue: 210000, estimatedMargin: 11.0, probability: 30, currency: 'USD', expectedCloseDate: '2026-04-15', nextAction: 'Agendar reunião', owner: 'Ana Silva', categories: ['Bebidas Energéticas'], brands: ['Red Bull'], createdAt: '2026-03-03', updatedAt: '2026-03-04' },
  { id: 'OP-005', name: 'Dove Body Wash - Metro CE', clientId: 'CL-001', clientName: 'Metro C&C', stage: 'necessidade_identificada', estimatedValue: 78000, estimatedMargin: 16.5, probability: 40, currency: 'EUR', expectedCloseDate: '2026-04-10', owner: 'Miguel Costa', categories: ['Personal Care'], brands: ['Dove'], createdAt: '2026-02-28', updatedAt: '2026-03-03' },
  { id: 'OP-006', name: 'Toblerone 100g - DRG Dubai', clientId: 'CL-004', clientName: 'DRG', stage: 'aprovacao_interna', estimatedValue: 145000, estimatedMargin: 13.1, probability: 85, currency: 'USD', expectedCloseDate: '2026-03-12', nextAction: 'Aguardar aprovação', owner: 'Ana Silva', categories: ['Confectionery'], brands: ['Toblerone'], createdAt: '2026-02-05', updatedAt: '2026-03-06' },
  { id: 'OP-007', name: 'Monster Energy 500ml - Aldi', clientId: 'CL-003', clientName: 'Aldi Süd', stage: 'lead_qualificado', estimatedValue: 62000, estimatedMargin: 10.8, probability: 20, currency: 'EUR', expectedCloseDate: '2026-05-01', owner: 'Miguel Costa', categories: ['Bebidas Energéticas'], brands: ['Monster Energy'], createdAt: '2026-03-06', updatedAt: '2026-03-06' },
  { id: 'OP-008', name: "Kellogg's Cereal Mix - Carrefour", clientId: 'CL-002', clientName: 'Carrefour', stage: 'fechado_ganho', estimatedValue: 175000, estimatedMargin: 11.5, probability: 100, currency: 'EUR', expectedCloseDate: '2026-02-28', owner: 'Ana Silva', categories: ['Alimentação'], brands: ["Kellogg's"], createdAt: '2026-01-15', updatedAt: '2026-02-28' },
];

export const mockProposals: Proposal[] = [
  {
    id: 'PR-001', reference: 'PROP-2026-001', clientId: 'CL-001', clientName: 'Metro C&C', opportunityId: 'OP-001',
    items: [
      { id: 'PI-001', productName: 'Coca-Cola Classic 330ml x 24', brand: 'Coca-Cola', category: 'Bebidas', quantity: 5000, unitPrice: 8.50, discount: 5, total: 40375 },
      { id: 'PI-002', productName: 'Coca-Cola Zero 330ml x 24', brand: 'Coca-Cola', category: 'Bebidas', quantity: 3000, unitPrice: 8.50, discount: 5, total: 24225 },
      { id: 'PI-003', productName: 'Fanta Orange 330ml x 24', brand: 'Coca-Cola', category: 'Bebidas', quantity: 2000, unitPrice: 7.80, discount: 3, total: 15132 },
    ],
    totalValue: 79732, currency: 'EUR', incoterm: 'DAP', deliveryEstimate: '3-4 semanas',
    paymentTerms: 'Net 30', validUntil: '2026-03-25', status: 'enviada', version: 2,
    notes: 'Proposta revista com desconto adicional de 2%', owner: 'Ana Silva',
    createdAt: '2026-02-25', updatedAt: '2026-03-05',
  },
  {
    id: 'PR-002', reference: 'PROP-2026-002', clientId: 'CL-002', clientName: 'Carrefour', opportunityId: 'OP-002',
    items: [
      { id: 'PI-004', productName: 'Nutella 750g', brand: 'Nutella', category: 'Confectionery', quantity: 8000, unitPrice: 4.20, discount: 0, total: 33600 },
      { id: 'PI-005', productName: 'Nutella 400g', brand: 'Nutella', category: 'Confectionery', quantity: 10000, unitPrice: 2.80, discount: 0, total: 28000 },
    ],
    totalValue: 61600, currency: 'EUR', incoterm: 'CIF', deliveryEstimate: '2-3 semanas',
    paymentTerms: 'Net 45', validUntil: '2026-03-20', status: 'em_negociacao', version: 1,
    owner: 'Ana Silva', createdAt: '2026-03-01', updatedAt: '2026-03-06',
  },
  {
    id: 'PR-003', reference: 'PROP-2026-003', clientId: 'CL-004', clientName: 'DRG', opportunityId: 'OP-006',
    items: [
      { id: 'PI-006', productName: 'Toblerone 100g x 20', brand: 'Toblerone', category: 'Confectionery', quantity: 4000, unitPrice: 12.50, discount: 8, total: 46000 },
    ],
    totalValue: 46000, currency: 'USD', incoterm: 'CIF', deliveryEstimate: '4-5 semanas',
    paymentTerms: 'Net 30', validUntil: '2026-03-15', status: 'aceite', version: 3,
    owner: 'Ana Silva', createdAt: '2026-02-10', updatedAt: '2026-03-06',
  },
];

export const mockActivities: Activity[] = [
  { id: 'ACT-001', type: 'follow_up', title: 'Follow-up proposta Coca-Cola', relatedTo: 'Metro C&C', relatedType: 'proposal', relatedId: 'PR-001', dueDate: '2026-03-10', completed: false, owner: 'Ana Silva', createdAt: '2026-03-05' },
  { id: 'ACT-002', type: 'reuniao', title: 'Reunião Zoom - Al Rashid Trading', relatedTo: 'Al Rashid Trading LLC', relatedType: 'lead', relatedId: 'LD-003', dueDate: '2026-03-09', completed: false, owner: 'Ana Silva', createdAt: '2026-03-06' },
  { id: 'ACT-003', type: 'chamada', title: 'Ligar para Carrefour - negociação Nutella', relatedTo: 'Carrefour', relatedType: 'negotiation', relatedId: 'NG-001', dueDate: '2026-03-08', completed: false, owner: 'Ana Silva', createdAt: '2026-03-06' },
  { id: 'ACT-004', type: 'tarefa', title: 'Preparar proposta Pringles para Aldi', relatedTo: 'Aldi Süd', relatedType: 'opportunity', relatedId: 'OP-003', dueDate: '2026-03-11', completed: false, owner: 'Miguel Costa', createdAt: '2026-03-05' },
  { id: 'ACT-005', type: 'follow_up', title: 'Follow-up proposta West Africa Supplies', relatedTo: 'West Africa Supplies Ltd', relatedType: 'lead', relatedId: 'LD-005', dueDate: '2026-03-08', completed: false, owner: 'Ana Silva', createdAt: '2026-03-02' },
  { id: 'ACT-006', type: 'email', title: 'Enviar ficha técnica Dove para Metro', relatedTo: 'Metro C&C', relatedType: 'opportunity', relatedId: 'OP-005', dueDate: '2026-03-07', completed: true, owner: 'Miguel Costa', createdAt: '2026-03-04' },
  { id: 'ACT-007', type: 'tarefa', title: 'Qualificar lead Balkan Wholesale', relatedTo: 'Balkan Wholesale d.o.o.', relatedType: 'lead', relatedId: 'LD-004', dueDate: '2026-03-12', completed: false, owner: 'Miguel Costa', createdAt: '2026-03-05' },
];

export const mockNegotiations: Negotiation[] = [
  {
    id: 'NG-001', proposalId: 'PR-002', opportunityId: 'OP-002', clientId: 'CL-002', clientName: 'Carrefour',
    entries: [
      { id: 'NE-001', date: '2026-03-01', user: 'Ana Silva', type: 'email', summary: 'Proposta inicial enviada para Nutella 750g e 400g', proposedPrice: 4.20, status: 'Proposta enviada', nextStep: 'Aguardar resposta' },
      { id: 'NE-002', date: '2026-03-03', user: 'Ana Silva', type: 'chamada', summary: 'Pierre ligou a pedir desconto de 10%. Argumentou preço de concorrente.', proposedPrice: 4.20, counterPrice: 3.78, status: 'Contra-proposta recebida', nextStep: 'Analisar margem e responder', nextFollowUp: '2026-03-06' },
      { id: 'NE-003', date: '2026-03-06', user: 'Ana Silva', type: 'email', summary: 'Enviada contra-proposta com desconto de 5% e bónus por volume.', proposedPrice: 3.99, status: 'Contra-proposta enviada', nextStep: 'Aguardar decisão', nextFollowUp: '2026-03-08' },
    ],
    currentStatus: 'Em negociação de preço', probability: 60, obstacles: 'Preço - concorrente oferece mais barato',
    perceivedCompetitor: 'EuroTrade GmbH', owner: 'Ana Silva', createdAt: '2026-03-01', updatedAt: '2026-03-06',
  },
];
