import {
  BankAccount, CashFlowEntry, FinanceDeal, FinanceAlert,
  CreditLine, MonthlyTracker, PnLYear, ExpenseLine,
  DisputedDebtor, CourtFrozen, HistoricMargin,
} from "@/types/finance";

// ============================================================
// 1.1 — Posição de caixa REAL (Março 2026). Liquidez total: 116.512,33 €
// ============================================================
export const mockBankAccounts: BankAccount[] = [
  { id: "b1", bank: "Millennium BCP",  label: "Conta à ordem",            country: "PT",     currency: "EUR", type: "current", balance: 47138.19, balanceEUR: 47138.19 },
  { id: "b2", bank: "Novo Banco",      label: "Conta à ordem",            country: "PT",     currency: "EUR", type: "current", balance:  2194.01, balanceEUR:  2194.01 },
  { id: "b3", bank: "Novo Banco",      label: "Poupança",                 country: "PT",     currency: "EUR", type: "current", balance: 23000.00, balanceEUR: 23000.00 },
  { id: "b4", bank: "Wise",            label: "Multi-currency EUR",       country: "GLOBAL", currency: "EUR", type: "fx",      balance: 14548.34, balanceEUR: 14548.34 },
  { id: "b5", bank: "Revolut Business",label: "Conta EUR",                country: "GLOBAL", currency: "EUR", type: "fx",      balance:   706.45, balanceEUR:   706.45 },
  { id: "b6", bank: "Bankinter PT",    label: "Conta à ordem",            country: "PT",     currency: "EUR", type: "current", balance: 24853.47, balanceEUR: 24853.47 },
  { id: "b7", bank: "BBVA España",     label: "Cuenta operativa",         country: "ES",     currency: "EUR", type: "current", balance:   790.00, balanceEUR:   790.00 },
  { id: "b8", bank: "Bankinter España",label: "Cuenta operativa",         country: "ES",     currency: "EUR", type: "current", balance:  3281.87, balanceEUR:  3281.87 },
];

// ============================================================
// 1.2 — Obrigações bancárias REAIS. Dívida total: 2.323.837,22 €
// ============================================================
export const mockCreditLines: CreditLine[] = [
  // Millennium BCP — a pagar: 1.500.000 € (apenas confirming em dívida; empréstimos amortizados)
  { id: "cl1",  bank: "Millennium BCP", product: "Confirming", contracted: 1500000, used: 1500000, nextCallDate: "+4", notes: "Conta 100% utilizada — call-in iminente" },
  { id: "cl2",  bank: "Millennium BCP", product: "Hot Money",  contracted:  411000, used:       0, notes: "Empréstimo 420155511 — amortizado, linha disponível" },
  { id: "cl3",  bank: "Millennium BCP", product: "Hot Money",  contracted:  500000, used:       0, notes: "Empréstimo 420077911 — amortizado, linha disponível" },
  // Novo Banco — a pagar: 273.850,51 €
  { id: "cl4",  bank: "Novo Banco",     product: "FEI",        contracted:  100000, used: 86112.97, notes: "FEI 1 (0770134066) — amortização em curso" },
  { id: "cl5",  bank: "Novo Banco",     product: "FEI",        contracted:  100000, used: 93860.55, notes: "FEI 2 (0770136421) — amortização em curso" },
  { id: "cl6",  bank: "Novo Banco",     product: "Hot Money",  contracted:  150000, used: 93876.99, notes: "Linha Extra Amortizável" },
  // Bankinter Portugal — a pagar: 549.986,71 €
  { id: "cl7",  bank: "Bankinter PT",   product: "Overdraft",  contracted:   50000, used:    50000, notes: "Conta caucionada — totalmente utilizada" },
  { id: "cl8",  bank: "Bankinter PT",   product: "Hot Money",  contracted:  150000, used:   150000, notes: "Apoio a Impostos — totalmente utilizado" },
  { id: "cl9",  bank: "Bankinter PT",   product: "Confirming", contracted:  100000, used: 99986.71, notes: "Confirming Bankinter PT — ~100% utilização" },
  { id: "cl10", bank: "Bankinter PT",   product: "FEI",        contracted:  250000, used:   250000, notes: "Financiamento à Exportação — totalmente utilizado" },
];

export const FINANCE_TOTALS = {
  liquidity: 116512.33,
  debt: 2323837.22,
  netPosition: -2207324.89,           // liquidez − dívida
  purchasingPower: 253.29,            // disponível REAL para compras (crítico)
  activeAccounts: 8,
  activeBanks: 7,
  currentGrossMargin: 5.02, // % YTD
  currentNetMargin: 3.52,   // % YTD
  targetGrossMargin: 5.0,
};

// Detalhe "a pagar" por banco (visão CEO: "Quanto devo a cada um?")
export const DEBT_BY_BANK = [
  { bank: "Millennium BCP", amount: 1500000.00, share: 64.55 },
  { bank: "Bankinter PT",   amount:  549986.71, share: 23.67 },
  { bank: "Novo Banco",     amount:  273850.51, share: 11.78 },
];

// ============================================================
// 1.3 — Tracker mensal REAL 2026 (sheet RESUMO)
// Despesa fixa estimada: 69.167 €/mês
// ============================================================
const FIXED_EXPENSES_MONTHLY = 69167;

export const mockMonthlyTracker: MonthlyTracker[] = [
  { month: "Jan", year: 2026, purchases: 332822.92, sales: 369287.22, marginToReceive: 36464.30, marginReceived: 28991.42, expenses: FIXED_EXPENSES_MONTHLY, netResult:  11363.89 },
  { month: "Fev", year: 2026, purchases: 548175.80, sales: 565529.72, marginToReceive: 17353.92, marginReceived:  8762.52, expenses: FIXED_EXPENSES_MONTHLY, netResult:  -2882.00 },
  { month: "Mar", year: 2026, purchases: 189189.00, sales: 191961.00, marginToReceive:  2772.00, marginReceived:  1940.40, expenses: FIXED_EXPENSES_MONTHLY, netResult:    182.91 },
  { month: "Abr", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Mai", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Jun", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Jul", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Ago", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Set", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Out", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Nov", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
  { month: "Dez", year: 2026, purchases: 0, sales: 0, marginToReceive: 0, marginReceived: 0, expenses: FIXED_EXPENSES_MONTHLY, netResult: 0 },
];

// Totais YTD reais (3 meses)
export const YTD_2026 = {
  purchases:        1070187.72,
  sales:            1126777.94,
  marginToReceive:    56590.22,
  marginReceived:     39694.34,
  netResult:           8664.80,
  avgPurchases:      356729.24,
  avgSales:          375592.65,
  avgMargin:          18863.41,
  grossMarginPct:        5.02,
  netMarginPct:          3.52,
};

// 1.4 — Objetivo anual REAL 2026
export const TARGET_2026 = {
  marginGoal: 1200000,                        // objetivo ilíquido 2026
  ytdMargin: 56590.22,                        // realizado YTD
  missingMargin: 1143409.78,                  // falta para objetivo
  progressPct: 4.72,                          // % concluído
  // mantidos por compat — derivados da meta de margem (5% target)
  salesGoal: 24000000,
  netResultGoal: 90000,
};

// ============================================================
// 1.5 — Margem histórica por recuperar — 132.986,31 €
// ============================================================
export const historicMarginToRecover: HistoricMargin[] = [
  { year: 2024, amount: 55287.62 },
  { year: 2025, amount: 77698.69 },
];
export const HISTORIC_MARGIN_TOTAL = 132986.31;

export const mockDisputedDebtors: DisputedDebtor[] = [
  { id: "dd1", debtor: "MFI",              group: "Grupo FIA",    amount: 48200, origin: "Faturas 2024 não pagas",   withPenalty: true,  status: "Em disputa — advogado contactado" },
  { id: "dd2", debtor: "PROAMFAMILY 2017", group: "FAIZ",         amount: 31500, origin: "Devolução de mercadoria",  withPenalty: false, status: "Negociação em curso" },
  { id: "dd3", debtor: "BODEGA EXPRESS",   group: "FAIZ",         amount: 22850, origin: "Diferenças de quality",    withPenalty: false, status: "Aguarda confirmação" },
  { id: "dd4", debtor: "TCC Consulting",   group: undefined,      amount: 14600, origin: "Comissões em revisão",     withPenalty: true,  status: "Escalado" },
];

export const mockCourtFrozen: CourtFrozen[] = [
  { id: "cf-m",  label: "Moscatel — processo",     amount: 17285, status: "Aguarda decisão (T2 2026)" },
  { id: "cf-c",  label: "Caução judicial",         amount:  6000, status: "Depositado em tribunal" },
  { id: "cf-mj", label: "Manjeff — execução",      amount: 19000, status: "Penhora em curso" },
];

// ============================================================
// 1.9 — Despesas FSE (Jan-Mar agregadas)
// ============================================================
export const mockExpenses: ExpenseLine[] = [
  { id: "e1",  category: "Pessoal",  name: "Salários Gerente",          monthly: 7200,    jan: 7200, feb: 7200, mar: 7200 },
  { id: "e2",  category: "Pessoal",  name: "Salários Funcionários",     monthly: 4800,    jan: 4800, feb: 4800, mar: 4800 },
  { id: "e3",  category: "Pessoal",  name: "Subsídio Alimentação",      monthly: 1309.56, jan: 1309.56, feb: 1309.56, mar: 1309.56 },
  { id: "e4",  category: "Seguros",  name: "Seguro Saúde",              monthly: 1045.11, jan: 1045.11, feb: 1045.11, mar: 1045.11 },
  { id: "e5",  category: "Gerais",   name: "Contabilidade (Brasague)",  monthly: 645.75,  jan: 645.75,  feb: 645.75,  mar: 645.75 },
  { id: "e6",  category: "Gerais",   name: "Telecomunicações/Internet", monthly: 310.51,  jan: 310.51,  feb: 310.51,  mar: 310.51 },
  { id: "e7",  category: "Gerais",   name: "Supermercados",             monthly: 328.45,  jan: 328.45,  feb: 328.45,  mar: 328.45 },
  { id: "e8",  category: "Gerais",   name: "Energia + Gás",             monthly: 360.13,  jan: 360.13,  feb: 360.13,  mar: 360.13 },
  { id: "e9",  category: "Gerais",   name: "Aluguer Escritório",        monthly: 795,     jan: 795, feb: 795, mar: 795 },
  { id: "e10", category: "Gerais",   name: "Renting Informática",       monthly: 144.43,  jan: 144.43, feb: 144.43, mar: 144.43 },
  { id: "e11", category: "Veículos", name: "Via Verde",                 monthly: 178.66,  jan: 178.66, feb: 178.66, mar: 178.66 },
  { id: "e12", category: "Viagens",  name: "Viagens (BCN / DXB)",       monthly: 339,     jan: 339, feb: 339, mar: 339 },
  // Balanceamento até ao real fixo mensal (69.167 €) — encargos financeiros + amortizações + outras FSE
  { id: "e13", category: "Gerais",   name: "Encargos financeiros + Amortizações + Outras FSE", monthly: 51710.40, jan: 51710.40, feb: 51710.40, mar: 51710.40 },
];

export const EXPENSE_TOTALS = {
  fixedMonthly: 69167,
  fixedAnnualEstimate: 830004,
};

// ============================================================
// 3.4 — DRE / Histórico multi-ano
// ============================================================
export const mockPnLHistory: PnLYear[] = [
  { year: 2012, sales:  120000, cogs:  102000, grossProfit:  18000, grossMarginPct: 15.0, fse:  18000, personnel:  12000, ebitda: -12000, netResult: -14500 },
  { year: 2013, sales:  430000, cogs:  395000, grossProfit:  35000, grossMarginPct:  8.1, fse:  22000, personnel:  18000, ebitda:  -5000, netResult:  -7200 },
  { year: 2014, sales:  920000, cogs:  845000, grossProfit:  75000, grossMarginPct:  8.2, fse:  29000, personnel:  25000, ebitda:  21000, netResult:  12400 },
  { year: 2015, sales: 1450000, cogs: 1340000, grossProfit: 110000, grossMarginPct:  7.6, fse:  37000, personnel:  34000, ebitda:  39000, netResult:  24800 },
  { year: 2016, sales: 2100000, cogs: 1968000, grossProfit: 132000, grossMarginPct:  6.3, fse:  44000, personnel:  41000, ebitda:  47000, netResult:  29500 },
  { year: 2017, sales: 3250000, cogs: 3055000, grossProfit: 195000, grossMarginPct:  6.0, fse:  52000, personnel:  48000, ebitda:  95000, netResult:  61200 },
  { year: 2018, sales: 4800000, cogs: 4512000, grossProfit: 288000, grossMarginPct:  6.0, fse:  58000, personnel:  55000, ebitda: 175000, netResult: 118000 },
  { year: 2019, sales: 5600000, cogs: 5320000, grossProfit: 280000, grossMarginPct:  5.0, fse:  62000, personnel:  59000, ebitda: 159000, netResult: 102000 },
  { year: 2020, sales: 4900000, cogs: 4655000, grossProfit: 245000, grossMarginPct:  5.0, fse:  65000, personnel:  61000, ebitda: 119000, netResult:  73500 },
  { year: 2021, sales: 7200000, cogs: 6840000, grossProfit: 360000, grossMarginPct:  5.0, fse:  68000, personnel:  63000, ebitda: 229000, netResult: 152000 },
  { year: 2022, sales: 8600000, cogs: 8170000, grossProfit: 430000, grossMarginPct:  5.0, fse:  71000, personnel:  66000, ebitda: 293000, netResult: 198000 },
  { year: 2023, sales: 7400000, cogs: 7030000, grossProfit: 370000, grossMarginPct:  5.0, fse:  73000, personnel:  68000, ebitda: 229000, netResult: 142000 },
  { year: 2024, sales: 5200000, cogs: 4944000, grossProfit: 256000, grossMarginPct:  4.9, fse:  74000, personnel:  69000, ebitda: 113000, netResult:  61000 },
  { year: 2025, sales: 4800000, cogs: 4569600, grossProfit: 230400, grossMarginPct:  4.8, fse:  76000, personnel:  72000, ebitda:  82400, netResult:  44000 },
];

const today = new Date();
const addDays = (d: number) => {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};

// ============================================================
// Cash Flow — entradas/saídas reais ligadas a deals (KB26-NNN)
// ============================================================
export const mockCashFlow: CashFlowEntry[] = [
  // Saídas a fornecedores reais
  { id: "cf1",  date: addDays(2),  type: "supplier_payment", description: "ALPHA SOLUTIONS — KB26-014 (Evian 12x)",        counterparty: "ALPHA SOLUTIONS",       amount: -42500, bankId: "b6", status: "scheduled", dealId: "kb26-014" },
  { id: "cf2",  date: addDays(3),  type: "client_receivable", description: "PROAMFAMILY 2017 SL — KB26-014",                counterparty: "PROAMFAMILY 2017 SL",   amount:  45200, bankId: "b6", status: "confirmed", dealId: "kb26-014" },
  { id: "cf3",  date: addDays(4),  type: "confirming",       description: "Confirming call-in MillenniumBCP",               counterparty: "MillenniumBCP",         amount: -85000, bankId: "b1", status: "scheduled" },
  { id: "cf4",  date: addDays(6),  type: "supplier_payment", description: "BEBIDAS INTERNATIONAL — KB26-018 (Monster IT)",  counterparty: "BEBIDAS INTERNATIONAL", amount: -38400, bankId: "b6", status: "scheduled", dealId: "kb26-018" },
  { id: "cf5",  date: addDays(7),  type: "client_receivable", description: "BODEGA EXPRESS 2020 SL — KB26-018",              counterparty: "BODEGA EXPRESS 2020 SL",amount:  40800, bankId: "b5", status: "confirmed", dealId: "kb26-018" },
  { id: "cf6",  date: addDays(9),  type: "confirming",       description: "Confirming call-in Bankinter ES",                counterparty: "Bankinter ES",          amount: -55000, bankId: "b5", status: "scheduled" },
  { id: "cf7",  date: addDays(10), type: "supplier_payment", description: "FAMOBRA GMBH — KB26-021 (Coca-Cola DE)",         counterparty: "FAMOBRA GMBH",          amount: -28500, bankId: "b6", status: "scheduled", dealId: "kb26-021" },
  { id: "cf8",  date: addDays(12), type: "loan_repayment",   description: "NovoBanco — amortização FEI",                    counterparty: "NovoBanco",             amount: -12500, bankId: "b3", status: "scheduled" },
  { id: "cf9",  date: addDays(14), type: "client_receivable", description: "UNIVERSAL COMPRAS SL — KB26-021",                counterparty: "UNIVERSAL COMPRAS SL",  amount:  30100, bankId: "b6", status: "confirmed", dealId: "kb26-021" },
  { id: "cf10", date: addDays(18), type: "supplier_payment", description: "NOSTRA TRADE — KB26-027 (Chicco D'Oro)",         counterparty: "NOSTRA TRADE",          amount: -22000, bankId: "b1", status: "scheduled", dealId: "kb26-027" },
  { id: "cf11", date: addDays(21), type: "client_receivable", description: "ND North Distribution GmbH — KB26-027",          counterparty: "ND North Distribution", amount:  23450, bankId: "b3", status: "confirmed", dealId: "kb26-027" },
  { id: "cf12", date: addDays(25), type: "supplier_payment", description: "PSA TRADING — KB26-031 (Monster IT Green)",      counterparty: "PSA TRADING",           amount: -31200, bankId: "b6", status: "scheduled", dealId: "kb26-031" },
  { id: "cf13", date: addDays(28), type: "client_receivable", description: "BVBA HSF GROUP — KB26-031",                      counterparty: "BVBA HSF GROUP",        amount:  33100, bankId: "b5", status: "scheduled", dealId: "kb26-031" },
  { id: "cf14", date: addDays(45), type: "client_receivable", description: "SAS Futura Finances — KB26-024",                 counterparty: "SAS Futura Finances",   amount:  41200, bankId: "b6", status: "scheduled", dealId: "kb26-024" },
  // Atrasos reais
  { id: "cf15", date: addDays(-14), type: "client_receivable", description: "PROAMFAMILY 2017 SL — KB26-008 (atraso)",       counterparty: "PROAMFAMILY 2017 SL",   amount:  28500, bankId: "b6", status: "overdue", dealId: "kb26-008" },
  { id: "cf16", date: addDays(-38), type: "client_receivable", description: "BODEGA EXPRESS 2020 SL — KB26-003 (atraso)",    counterparty: "BODEGA EXPRESS 2020 SL",amount:  22850, bankId: "b5", status: "overdue", dealId: "kb26-003" },
  // FSE
  { id: "cf17", date: addDays(5),  type: "expense",          description: "Aluguer Escritório",                              counterparty: "Senhorio",              amount:   -795, bankId: "b1", status: "scheduled" },
  { id: "cf18", date: addDays(8),  type: "expense",          description: "Salários (gerente + funcionários)",              counterparty: "Folha salarial",        amount: -12000, bankId: "b1", status: "scheduled" },
];

// ============================================================
// Deals reais (lot KB26-NNN). Status: 5 reais — perspective, ongoing, concluded, unpaid, canceled.
// O pipeline 2026 tem 36 unpaid (margem presa) — representamos uma amostra significativa.
// ============================================================
const unpaidSample: FinanceDeal[] = Array.from({ length: 12 }).map((_, i) => {
  const idx = i + 1;
  const buy = 18000 + (i * 1500);
  const sell = Math.round(buy * (1.045 + (i % 3) * 0.005));
  return {
    id: `kb-unpaid-${idx}`,
    reference: `KB26-${String(40 + idx).padStart(3, "0")}`,
    client: ["PROAMFAMILY 2017 SL", "BODEGA EXPRESS 2020 SL", "UNIVERSAL COMPRAS SL", "BVBA HSF GROUP", "ND North Distribution GmbH", "SAS Futura Finances"][i % 6],
    market: ["Spain", "Spain", "Spain", "Belgium", "Germany", "France"][i % 6],
    supplier: ["ALPHA SOLUTIONS", "BEBIDAS INTERNATIONAL", "FAMOBRA GMBH", "LOUROCHE COMMERCE", "NOSTRA TRADE", "PSA TRADING"][i % 6],
    product: ["Evian 12x", "Monster IT 24x mixed", "Coca-Cola DE/DK 24x", "Coca-Cola IT 6x4", "Chicco D'Oro Coffee 1Kg", "Monster IT Green 24x"][i % 6],
    status: "unpaid",
    buyPrice: buy, sellPrice: sell, logistics: 800 + i * 50,
    orderDate: addDays(-(60 + i * 2)),
    expectedPaymentDate: addDays(-(31 + i)),
  };
});

export const mockFinanceDeals: FinanceDeal[] = [
  { id: "kb26-014", reference: "KB26-014", client: "PROAMFAMILY 2017 SL", market: "Spain",      supplier: "ALPHA SOLUTIONS",       product: "Evian 12x",                 status: "ongoing",     buyPrice: 42500, sellPrice: 45200, logistics: 850, orderDate: addDays(-9),  expectedPaymentDate: addDays(3) },
  { id: "kb26-018", reference: "KB26-018", client: "BODEGA EXPRESS 2020 SL", market: "Spain",   supplier: "BEBIDAS INTERNATIONAL", product: "Monster IT 24x mixed",      status: "ongoing",     buyPrice: 38400, sellPrice: 40800, logistics: 780, orderDate: addDays(-7),  expectedPaymentDate: addDays(7) },
  { id: "kb26-021", reference: "KB26-021", client: "UNIVERSAL COMPRAS SL", market: "Spain",     supplier: "FAMOBRA GMBH",          product: "Coca-Cola DE/DK 24x",       status: "ongoing",     buyPrice: 28500, sellPrice: 30100, logistics: 620, orderDate: addDays(-5),  expectedPaymentDate: addDays(14) },
  { id: "kb26-024", reference: "KB26-024", client: "SAS Futura Finances", market: "France",     supplier: "LOUROCHE COMMERCE",     product: "Coca-Cola IT 6x4",          status: "concluded",   buyPrice: 38900, sellPrice: 41200, logistics: 900, orderDate: addDays(-22), expectedPaymentDate: addDays(45) },
  { id: "kb26-027", reference: "KB26-027", client: "ND North Distribution GmbH", market: "Germany", supplier: "NOSTRA TRADE",      product: "Chicco D'Oro Coffee 1Kg",   status: "ongoing",     buyPrice: 22000, sellPrice: 23450, logistics: 540, orderDate: addDays(-4),  expectedPaymentDate: addDays(21) },
  { id: "kb26-031", reference: "KB26-031", client: "BVBA HSF GROUP", market: "Belgium",         supplier: "PSA TRADING",           product: "Monster IT Green 24x",      status: "ongoing",     buyPrice: 31200, sellPrice: 33100, logistics: 690, orderDate: addDays(-2),  expectedPaymentDate: addDays(28) },
  { id: "kb26-050", reference: "KB26-050", client: "TCC Consulting", market: "Spain",           supplier: "ALPHA SOLUTIONS",       product: "Evian 12x (pipeline)",      status: "perspective", buyPrice: 50000, sellPrice: 52800, logistics: 1100, orderDate: addDays(0),  expectedPaymentDate: addDays(60) },
  { id: "kb26-007", reference: "KB26-007", client: "PROAMFAMILY 2017 SL", market: "Spain",      supplier: "BEBIDAS INTERNATIONAL", product: "Monster IT 24x (cancelado)",status: "canceled",    buyPrice: 18000, sellPrice: 0,     logistics: 0,    orderDate: addDays(-40), expectedPaymentDate: addDays(-10) },
  // Unpaid sample (representa parte dos 36 unpaid 2026)
  { id: "kb26-008", reference: "KB26-008", client: "PROAMFAMILY 2017 SL", market: "Spain",      supplier: "ALPHA SOLUTIONS",       product: "Evian 12x",                 status: "unpaid",      buyPrice: 26800, sellPrice: 28500, logistics: 590,  orderDate: addDays(-58), expectedPaymentDate: addDays(-14) },
  { id: "kb26-003", reference: "KB26-003", client: "BODEGA EXPRESS 2020 SL", market: "Spain",   supplier: "BEBIDAS INTERNATIONAL", product: "Monster IT 24x mixed",      status: "unpaid",      buyPrice: 21500, sellPrice: 22850, logistics: 480,  orderDate: addDays(-82), expectedPaymentDate: addDays(-38) },
  ...unpaidSample,
];

// Sinaliza que o pipeline 2026 contém 36 deals unpaid (margem presa)
export const UNPAID_2026_TOTAL = 36;

export const mockFinanceAlerts: FinanceAlert[] = [
  { id: "a1", severity: "critical", type: "cash_threshold", title: "Disponível para compras crítico", description: "Apenas 253 € disponíveis para compras. Linhas de confirming a 100%.", createdAt: addDays(0), actionable: "Reunião CFO" },
  { id: "a2", severity: "critical", type: "concentration", title: "Concentração MillenniumBCP 65%", description: "MillenniumBCP representa 1.500.000 € (65%) da dívida total. Regra: nenhum banco > 50%.", createdAt: addDays(-1), actionable: "Rebalancear" },
  { id: "a3", severity: "critical", type: "overdue", title: "PROAMFAMILY — KB26-008 em atraso", description: "28.500 € com 14 dias de atraso. Regra: Unpaid > 30 dias → escalação.", createdAt: addDays(-2), actionable: "Iniciar escalação" },
  { id: "a4", severity: "critical", type: "overdue", title: "BODEGA EXPRESS — KB26-003 atraso crítico", description: "22.850 € com 38 dias de atraso. Escalado para legal.", createdAt: addDays(-5), actionable: "Contactar legal" },
  { id: "a5", severity: "warning",  type: "confirming", title: "Confirming MillenniumBCP — call < 5 dias", description: "Call-in de 85.000 € marcado para os próximos 4 dias.", createdAt: addDays(-1), actionable: "Preparar pagamento" },
  { id: "a6", severity: "warning",  type: "low_margin", title: "Margem KB26-027 abaixo do target", description: "ND North Distribution — margem real 3.9% após logística. Target 5%.", createdAt: addDays(-1), actionable: "Rever pricing" },
  { id: "a7", severity: "warning",  type: "cash_threshold", title: "Saldo caixa < 100.000 €", description: "Liquidez total 116.512 € — buffer de apenas 16.512 € acima do threshold CEO.", createdAt: addDays(0) },
  { id: "a8", severity: "info",     type: "bbd", title: "Monster IT Green — BBD < 90 dias", description: "Lote KB26-031 com Best Before Date a 78 dias. Priorizar saída.", createdAt: addDays(0) },
];