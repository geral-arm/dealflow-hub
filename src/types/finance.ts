export type BankAccount = {
  id: string;
  bank: string;
  country: "PT" | "ES" | "GLOBAL";
  currency: "EUR" | "GBP" | "USD";
  type: "current" | "credit" | "confirming" | "fx";
  balance: number; // in account currency
  balanceEUR: number;
  creditLimit?: number;
  used?: number;
  iban?: string;
  label?: string;
};

export type CreditLine = {
  id: string;
  bank: string;
  product: "Confirming" | "FEI" | "Hot Money" | "Overdraft";
  contracted: number;
  used: number;
  nextCallDate?: string;
  notes?: string;
};

export type CashFlowEntry = {
  id: string;
  date: string;
  type: "supplier_payment" | "client_receivable" | "loan_repayment" | "confirming" | "expense" | "other";
  description: string;
  counterparty: string;
  amount: number; // negative = outflow
  bankId: string;
  status: "scheduled" | "confirmed" | "executed" | "overdue";
  dealId?: string;
};

export type DealStatus = "perspective" | "ongoing" | "concluded" | "unpaid" | "canceled";

export type FinanceDeal = {
  id: string;
  reference: string; // KB26-NNN
  client: string;
  market: string;
  supplier: string;
  product: string;
  status: DealStatus;
  buyPrice: number;
  sellPrice: number;
  logistics: number;
  orderDate: string;
  expectedPaymentDate: string;
  actualPaymentDate?: string;
  daysToCash?: number;
};

export type FinanceAlert = {
  id: string;
  severity: "critical" | "warning" | "info";
  type: "cash_threshold" | "overdue" | "low_margin" | "bbd" | "confirming" | "fx" | "concentration";
  title: string;
  description: string;
  createdAt: string;
  actionable?: string;
};

export type ScenarioResult = {
  label: string;
  liquidityImpact: number;
  newCashIn7d: number;
  newCashIn30d: number;
  riskLevel: "low" | "medium" | "high" | "critical";
};

export type MonthlyTracker = {
  month: string; // "Jan", "Fev", ...
  year: number;
  purchases: number;
  sales: number;
  netResult: number;
};

export type PnLYear = {
  year: number;
  sales: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
  fse: number;
  personnel: number;
  ebitda: number;
  netResult: number;
};

export type ExpenseCategory = "Pessoal" | "Seguros" | "Veículos" | "Viagens" | "Gerais";

export type ExpenseLine = {
  id: string;
  category: ExpenseCategory;
  name: string;
  monthly: number;
  jan?: number;
  feb?: number;
  mar?: number;
};

export type DisputedDebtor = {
  id: string;
  debtor: string;
  group?: string;
  amount: number;
  origin: string;
  withPenalty: boolean;
  status: string;
};

export type CourtFrozen = {
  id: string;
  label: string;
  amount: number;
  status: string;
};

export type HistoricMargin = {
  year: number;
  amount: number;
};