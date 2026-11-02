export type PeriodKey = "month" | "quarter" | "ytd" | "all";

export interface PeriodInfo {
  kind: PeriodKey;
  from: string;
  to: string;
  granularity: "day" | "month";
}

export interface TrendPoint {
  date: string;
  income: number;
  expenses: number;
  label?: string;
}

export interface HomeReport {
  period: PeriodInfo;
  currency_code: string;
  invoiced: number;
  invoiced_change_pct: number | null;
  collected: number;
  collected_change_pct: number | null;
  expenses: number;
  expenses_change_pct: number | null;
  net_cash: number;
  net_cash_change_pct: number | null;
  collection_rate: number;
  invoice_count: number;
  other_currency_invoice_count: number;
  outstanding: number;
  outstanding_invoice_count: number;
  trend: TrendPoint[];
  revenue: number;
  revenue_change_pct: number | null;
  net_profit: number;
  net_profit_change_pct: number | null;
}

export interface ProductReportItem {
  product_id: string;
  name: string;
  quantity: number;
  revenue: number;
  invoice_count: number;
}

export interface CustomerReportItem {
  customer_id: string;
  name: string;
  invoiced: number;
  outstanding: number;
  oldest_overdue_days: number;
}

export interface ExpenseCategoryItem {
  category: string;
  amount: number;
  share: number;
}

export interface AgingBucket {
  bucket: string;
  amount: number;
  invoice_count: number;
}

export interface SpeedReport {
  paid_invoice_count: number;
  avg_days: number | null;
  median_days: number | null;
  on_time_count: number;
}

export interface AiAudit {
  data: any;
  success: any;
  source: string;
  headline: { en: string; ar: string };
  summary: { en: string; ar: string };
  actions: { en: string; ar: string }[];
}

export interface BusinessProfile {
  id: string;
  name: string;
  owner_name: string;
  default_currency: string;
  default_vat_rate: number;
}
