/**
 * Seed canónico do módulo financeiro KnownBrands.
 * Todos os números são REAIS (Março 2026). Re-exporta o conteúdo atual
 * para que a migração para backend (Lovable Cloud) substitua apenas este
 * ficheiro sem tocar nos componentes.
 */
export {
  mockBankAccounts,
  mockCreditLines,
  mockMonthlyTracker,
  mockCashFlow,
  mockFinanceDeals,
  mockFinanceAlerts,
  mockExpenses,
  mockPnLHistory,
  mockDisputedDebtors,
  mockCourtFrozen,
  historicMarginToRecover,
  HISTORIC_MARGIN_TOTAL,
  FINANCE_TOTALS,
  DEBT_BY_BANK,
  TARGET_2026,
  YTD_2026,
  EXPENSE_TOTALS,
  UNPAID_2026_TOTAL,
} from "./finance-mock";