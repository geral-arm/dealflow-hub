import { BankAccount, CashFlowEntry, FinanceDeal, FinanceAlert } from "@/types/finance";

export const mockBankAccounts: BankAccount[] = [
  { id: "b1", bank: "MillenniumBCP", country: "PT", currency: "EUR", type: "current", balance: 245000, balanceEUR: 245000, iban: "PT50 0033..." },
  { id: "b2", bank: "MillenniumBCP", country: "PT", currency: "EUR", type: "confirming", balance: -480000, balanceEUR: -480000, creditLimit: 750000, used: 480000 },
  { id: "b3", bank: "NovoBanco", country: "PT", currency: "EUR", type: "current", balance: 132500, balanceEUR: 132500 },
  { id: "b4", bank: "NovoBanco", country: "PT", currency: "EUR", type: "credit", balance: -320000, balanceEUR: -320000, creditLimit: 500000, used: 320000 },
  { id: "b5", bank: "Bankinter PT", country: "PT", currency: "EUR", type: "current", balance: 87200, balanceEUR: 87200 },
  { id: "b6", bank: "Bankinter ES", country: "ES", currency: "EUR", type: "current", balance: 156800, balanceEUR: 156800 },
  { id: "b7", bank: "Bankinter ES", country: "ES", currency: "EUR", type: "confirming", balance: -610000, balanceEUR: -610000, creditLimit: 800000, used: 610000 },
  { id: "b8", bank: "BBVA España", country: "ES", currency: "EUR", type: "current", balance: 198400, balanceEUR: 198400 },
  { id: "b9", bank: "BBVA España", country: "ES", currency: "EUR", type: "credit", balance: -890000, balanceEUR: -890000, creditLimit: 1200000, used: 890000 },
  { id: "b10", bank: "Revolut Business", country: "GLOBAL", currency: "EUR", type: "fx", balance: 64200, balanceEUR: 64200 },
  { id: "b11", bank: "Revolut Business", country: "GLOBAL", currency: "GBP", type: "fx", balance: 38500, balanceEUR: 44950 },
  { id: "b12", bank: "Wise", country: "GLOBAL", currency: "EUR", type: "fx", balance: 28400, balanceEUR: 28400 },
  { id: "b13", bank: "Wise", country: "GLOBAL", currency: "USD", type: "fx", balance: 15200, balanceEUR: 14100 },
];

const today = new Date();
const addDays = (d: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

export const mockCashFlow: CashFlowEntry[] = [
  { id: "cf1", date: addDays(2), type: "supplier_payment", description: "Coca-Cola Iberia PO-4521", counterparty: "Coca-Cola Iberia", amount: -185000, bankId: "b9", status: "scheduled", dealId: "d1" },
  { id: "cf2", date: addDays(3), type: "client_receivable", description: "Carrefour FR INV-2891", counterparty: "Carrefour FR", amount: 220000, bankId: "b6", status: "confirmed", dealId: "d1" },
  { id: "cf3", date: addDays(5), type: "confirming", description: "Confirming call BBVA", counterparty: "BBVA", amount: -145000, bankId: "b9", status: "scheduled" },
  { id: "cf4", date: addDays(6), type: "supplier_payment", description: "Unilever PO-4533", counterparty: "Unilever", amount: -98000, bankId: "b1", status: "scheduled", dealId: "d2" },
  { id: "cf5", date: addDays(7), type: "client_receivable", description: "Albert Heijn INV-2902", counterparty: "Albert Heijn NL", amount: 142000, bankId: "b3", status: "confirmed", dealId: "d2" },
  { id: "cf6", date: addDays(10), type: "supplier_payment", description: "P&G España PO-4540", counterparty: "P&G", amount: -76000, bankId: "b8", status: "scheduled", dealId: "d3" },
  { id: "cf7", date: addDays(12), type: "loan_repayment", description: "Loan NovoBanco", counterparty: "NovoBanco", amount: -42000, bankId: "b3", status: "scheduled" },
  { id: "cf8", date: addDays(14), type: "client_receivable", description: "Mercadona ES INV-2915", counterparty: "Mercadona", amount: 88000, bankId: "b6", status: "confirmed", dealId: "d3" },
  { id: "cf9", date: addDays(18), type: "supplier_payment", description: "Nestlé PO-4555", counterparty: "Nestlé", amount: -210000, bankId: "b9", status: "scheduled", dealId: "d4" },
  { id: "cf10", date: addDays(21), type: "client_receivable", description: "Tesco UK INV-2922", counterparty: "Tesco UK", amount: 268000, bankId: "b11", status: "confirmed", dealId: "d4" },
  { id: "cf11", date: addDays(25), type: "supplier_payment", description: "Pepsi PO-4561", counterparty: "PepsiCo", amount: -132000, bankId: "b1", status: "scheduled", dealId: "d5" },
  { id: "cf12", date: addDays(28), type: "client_receivable", description: "Delhaize BE INV-2930", counterparty: "Delhaize BE", amount: 168000, bankId: "b6", status: "scheduled", dealId: "d5" },
  { id: "cf13", date: addDays(45), type: "client_receivable", description: "Auchan FR INV-2945", counterparty: "Auchan FR", amount: 195000, bankId: "b6", status: "scheduled", dealId: "d6" },
  { id: "cf14", date: addDays(-12), type: "client_receivable", description: "Lidl ES INV-2855 (atraso)", counterparty: "Lidl ES", amount: 112000, bankId: "b6", status: "overdue", dealId: "d7" },
  { id: "cf15", date: addDays(-35), type: "client_receivable", description: "Intermarché INV-2820 (atraso)", counterparty: "Intermarché", amount: 78500, bankId: "b6", status: "overdue", dealId: "d8" },
];

export const mockFinanceDeals: FinanceDeal[] = [
  { id: "d1", reference: "DEAL-2025-1042", client: "Carrefour FR", market: "France", supplier: "Coca-Cola Iberia", product: "Coca-Cola 33cl x 24 (12 pal)", status: "ongoing", buyPrice: 185000, sellPrice: 220000, logistics: 8500, orderDate: addDays(-12), expectedPaymentDate: addDays(3) },
  { id: "d2", reference: "DEAL-2025-1043", client: "Albert Heijn NL", market: "Netherlands", supplier: "Unilever", product: "Knorr soup mix (8 pal)", status: "ongoing", buyPrice: 98000, sellPrice: 142000, logistics: 6200, orderDate: addDays(-9), expectedPaymentDate: addDays(7) },
  { id: "d3", reference: "DEAL-2025-1044", client: "Mercadona", market: "Spain", supplier: "P&G", product: "Ariel detergent (5 pal)", status: "ongoing", buyPrice: 76000, sellPrice: 88000, logistics: 3200, orderDate: addDays(-7), expectedPaymentDate: addDays(14) },
  { id: "d4", reference: "DEAL-2025-1045", client: "Tesco UK", market: "UK", supplier: "Nestlé", product: "Nescafé (10 pal)", status: "ongoing", buyPrice: 210000, sellPrice: 268000, logistics: 14500, orderDate: addDays(-3), expectedPaymentDate: addDays(21) },
  { id: "d5", reference: "DEAL-2025-1046", client: "Delhaize BE", market: "Belgium", supplier: "PepsiCo", product: "Lay's chips (6 pal)", status: "ongoing", buyPrice: 132000, sellPrice: 168000, logistics: 7800, orderDate: addDays(-1), expectedPaymentDate: addDays(28) },
  { id: "d6", reference: "DEAL-2025-1040", client: "Auchan FR", market: "France", supplier: "Danone", product: "Activia (4 pal)", status: "concluded", buyPrice: 158000, sellPrice: 195000, logistics: 9200, orderDate: addDays(-25), expectedPaymentDate: addDays(45) },
  { id: "d7", reference: "DEAL-2025-1031", client: "Lidl ES", market: "Spain", supplier: "Mondelez", product: "Oreo (7 pal)", status: "unpaid", buyPrice: 88000, sellPrice: 112000, logistics: 4100, orderDate: addDays(-52), expectedPaymentDate: addDays(-12) },
  { id: "d8", reference: "DEAL-2025-1018", client: "Intermarché", market: "France", supplier: "Bimbo", product: "Pão Bimbo (3 pal)", status: "unpaid", buyPrice: 62000, sellPrice: 78500, logistics: 2900, orderDate: addDays(-78), expectedPaymentDate: addDays(-35) },
  { id: "d9", reference: "DEAL-2025-1011", client: "El Corte Inglés", market: "Spain", supplier: "Heineken", product: "Cerveja 33cl (15 pal)", status: "paid", buyPrice: 240000, sellPrice: 285000, logistics: 11200, orderDate: addDays(-95), expectedPaymentDate: addDays(-42), actualPaymentDate: addDays(-38), daysToCash: 57 },
  { id: "d10", reference: "DEAL-2025-1050", client: "Sainsbury's", market: "UK", supplier: "Coca-Cola Iberia", product: "Sprite 1.5L (8 pal)", status: "perspective", buyPrice: 124000, sellPrice: 158000, logistics: 8800, orderDate: addDays(0), expectedPaymentDate: addDays(60) },
];

export const mockFinanceAlerts: FinanceAlert[] = [
  { id: "a1", severity: "critical", type: "overdue", title: "Lidl ES — recebível em atraso", description: "INV-2855 (€112.000) com 12 dias de atraso. Escalação recomendada.", createdAt: addDays(-2), actionable: "Iniciar escalação" },
  { id: "a2", severity: "critical", type: "overdue", title: "Intermarché — atraso crítico", description: "INV-2820 (€78.500) com 35 dias de atraso. Avaliar provisão.", createdAt: addDays(-5), actionable: "Contactar legal" },
  { id: "a3", severity: "warning", type: "confirming", title: "Confirming BBVA dentro de 5 dias", description: "Call-in de €145.000 marcado para a próxima semana.", createdAt: addDays(-1) },
  { id: "a4", severity: "warning", type: "low_margin", title: "Margem DEAL-2025-1044 abaixo de 12%", description: "Mercadona ES — margem real 11.1% após logística. Rever pricing.", createdAt: addDays(-1), actionable: "Rever pricing" },
  { id: "a5", severity: "warning", type: "cash_threshold", title: "Concentração BBVA elevada", description: "BBVA representa 49% da dívida total. Rebalancear linhas.", createdAt: addDays(-3) },
  { id: "a6", severity: "info", type: "fx", title: "Exposição GBP estável", description: "GBP/EUR oscilou 0.4% nos últimos 7 dias. Sem ação necessária.", createdAt: addDays(0) },
];