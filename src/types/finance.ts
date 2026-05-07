export type BankAccount = {
  id: string;
  bank: string;
  country: "PT" | "ES" | "FR" | "NL" | "BE" | "UK" | "GLOBAL";
  currency: "EUR" | "GBP" | "USD" | "SEK" | "DKK";
  type: "current" | "credit" | "confirming" | "fx";
  balance: number; // in account currency
  balanceEUR: number;
  creditLimit?: number;
  used?: number;
  iban?: string;
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

export type FinanceDeal = {
  id: string;
  reference: string;
  client: string;
  market: string;
  supplier: string;
  product: string;
  status: "perspective" | "ongoing" | "concluded" | "paid" | "unpaid";
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
  type: "cash_threshold" | "overdue" | "low_margin" | "bbd" | "confirming" | "fx";
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