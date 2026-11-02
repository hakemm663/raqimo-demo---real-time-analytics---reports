import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Package,
  Timer,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  HomeReport,
  ProductReportItem,
  CustomerReportItem,
  ExpenseCategoryItem,
  AgingBucket,
  SpeedReport,
  AiAudit,
  PeriodKey,
} from "../../types";
import {
  raqimoApi,
  FALLBACK_REPORTS,
  FALLBACK_PRODUCTS,
  FALLBACK_CUSTOMERS,
  FALLBACK_CATEGORIES,
  FALLBACK_AGING,
  FALLBACK_SPEED,
  FALLBACK_AUDIT,
} from "../../lib/api";

// Local helper functions to ensure zero errors when reportsMetrics.ts is removed
function formatMoney(amount: number, currency: string = "USD", isAr: boolean = false): string {
  const num = Number(amount || 0);
  const formatted = new Intl.NumberFormat(isAr ? "ar-EG" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  if (currency === "USD") {
    return isAr ? `${formatted} $` : `$${formatted}`;
  }
  return `${currency} ${formatted}`;
}

function formatChange(changePct: number | null | undefined): string {
  if (changePct == null || isNaN(changePct)) return "";
  const sign = changePct > 0 ? "+" : "";
  return `${sign}${changePct}%`;
}

function getChartThemeColors(isDark: boolean) {
  return {
    axisText: isDark ? "#CBD5E1" : "#334155",
    axisSubtle: isDark ? "#94A3B8" : "#64748B",
    gridLine: isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(15, 23, 42, 0.08)",
    cardBg: isDark ? "#0F0F0F" : "#FFFFFF",
    tooltipBg: isDark ? "#0A0A0A" : "#FFFFFF",
    tooltipText: isDark ? "#F8FAFC" : "#0F172A",
    tooltipBorder: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.15)",
    incomeBar: "#10B981",
    expenseBar: "#F43F5E",
    netLine: "#38BDF8",
  };
}

interface ReportsTabProps {
  isDark: boolean;
  language: "en" | "ar";
}

const PERIODS: { key: PeriodKey; en: string; ar: string }[] = [
  { key: "month", en: "This month", ar: "هذا الشهر" },
  { key: "quarter", en: "This quarter", ar: "هذا الربع" },
  { key: "ytd", en: "This year", ar: "هذا العام" },
  { key: "all", en: "All time", ar: "كل الوقت" },
];

const CAT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#ef4444", "#64748b"];

const AGING: Record<string, { en: string; ar: string; bar: string; text: string }> = {
  not_due: { en: "Not due yet", ar: "لم يحل موعدها بعد", bar: "bg-emerald-400", text: "text-emerald-400" },
  no_due_date: { en: "No due date", ar: "بدون تاريخ استحقاق", bar: "bg-white/40", text: "text-white/60" },
  "1_30": { en: "1–30 days late", ar: "متأخر 1-30 يوم", bar: "bg-amber-400", text: "text-amber-400" },
  "31_60": { en: "31–60 days late", ar: "متأخر 31-60 يوم", bar: "bg-orange-400", text: "text-orange-400" },
  "61_90": { en: "61–90 days late", ar: "متأخر 61-90 يوم", bar: "bg-rose-400", text: "text-rose-400" },
  "90_plus": { en: "Over 90 days late", ar: "متأخر أكثر من 90 يوم", bar: "bg-red-500", text: "text-red-400" },
};

const AGING_ORDER = ["90_plus", "61_90", "31_60", "1_30", "not_due", "no_due_date"];

export const ReportsTab: React.FC<ReportsTabProps> = ({ isDark, language }) => {
  const isAr = language === "ar";
  const [period, setPeriod] = useState<PeriodKey>("quarter");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [homeReport, setHomeReport] = useState<HomeReport | null>(FALLBACK_REPORTS["quarter"]);
  const [products, setProducts] = useState<ProductReportItem[]>(FALLBACK_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerReportItem[]>(FALLBACK_CUSTOMERS);
  const [categories, setCategories] = useState<ExpenseCategoryItem[]>(FALLBACK_CATEGORIES);
  const [aging, setAging] = useState<AgingBucket[]>(FALLBACK_AGING);
  const [speed, setSpeed] = useState<SpeedReport | null>(FALLBACK_SPEED);
  const [audit, setAudit] = useState<AiAudit | null>(FALLBACK_AUDIT);
  const [budget, setBudget] = useState<number | null>(1000);

  const colors = useMemo(() => getChartThemeColors(isDark), [isDark]);

  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [homeData, prodData, custData, catData, agingData, speedData, auditData] =
        await Promise.all([
          raqimoApi.getHomeReport(period),
          raqimoApi.getTopProducts(period),
          raqimoApi.getTopCustomers(period),
          raqimoApi.getExpensesByCategory(period),
          raqimoApi.getReceivablesAging(),
          raqimoApi.getCollectionSpeed(period),
          raqimoApi.getAiAudit(),
        ]);
      setHomeReport(homeData);
      setProducts(prodData);
      setCustomers(custData);
      setCategories(catData);
      setAging(agingData);
      setSpeed(speedData);
      setAudit(auditData);
    } catch (e) {
      console.error("[ReportsTab] Error loading reports", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const periodLabel = PERIODS.find((p) => p.key === period) || PERIODS[0];

  // Raw unaligned trend data representing the live bug state
  const chartData = useMemo(() => {
    if (!homeReport?.trend) return [];
    return homeReport.trend.map((t) => ({
      name:
        homeReport.period.granularity === "month"
          ? new Date(`${t.date}T12:00:00Z`).toLocaleDateString(isAr ? "ar-EG" : "en-GB", {
              month: "short",
              year: period === "all" ? "2-digit" : undefined,
              timeZone: "UTC",
            })
          : String(Number(t.date.slice(8, 10))),
      date: t.date,
      income: Number(t.income || 0),
      expenses: Number(t.expenses || 0),
      net: Number(t.income || 0) - Number(t.expenses || 0),
    }));
  }, [homeReport, period, isAr]);

  const agingRows = useMemo(() => {
    return (aging || [])
      .filter((a) => a.amount > 0)
      .sort((a, b) => AGING_ORDER.indexOf(a.bucket) - AGING_ORDER.indexOf(b.bucket));
  }, [aging]);

  const owedTotal = agingRows.reduce((sum, a) => sum + a.amount, 0);

  const cats = useMemo(() => {
    return (categories || []).map((c, i) => ({
      name: c.category || (isAr ? "أخرى" : "Other"),
      amount: Number(c.amount || 0),
      share: Number(c.share || 0),
      color: CAT_COLORS[i % CAT_COLORS.length],
    }));
  }, [categories, isAr]);

  const currencyCode = homeReport?.currency_code || "USD";

  return (
    <div className="space-y-5 pb-12 max-w-7xl mx-auto px-1 sm:px-2">
      {/* Reports Header & Period Tabs */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {isAr ? "التقارير" : "Reports"}
          </h2>
          <span className="text-xs text-white/60">
            {isAr ? "كيف تسير أعمالك - من أرقامك الحقيقية" : "How your business is doing — from your real numbers"}
          </span>
        </div>
        {/* Period Selector Pills */}
        <div className="flex gap-1.5 flex-wrap p-1 rounded-full bg-white/5 border border-white/5" role="tablist">
          {PERIODS.map((p) => {
            const isSelected = period === p.key;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500 text-black font-extrabold shadow-sm scale-[1.02]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {isAr ? p.ar : p.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI summary card */}
      <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-3 relative overflow-hidden transition-colors shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-400">
                {isAr ? `${periodLabel.ar} باختصار` : `${periodLabel.en} in brief`}
              </h3>
              <p className="text-[10px] text-white/50">{isAr ? "من أرقامك الفعلية" : "From your actual numbers"}</p>
            </div>
          </div>
          <button
            onClick={() => loadData(true)}
            className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Refresh AI brief"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-1.5 pt-1">
          <p className="text-sm font-black text-white">
            {isAr ? (audit?.headline.ar || "لقد احتفظت بـ 11,600 دولار هذا الشهر") : (audit?.headline.en || "You kept USD 11,600 this month")}
          </p>
          <p className="text-xs text-white/70 leading-relaxed">
            {isAr
              ? (audit?.summary.ar || "لقد حصلت على 34% مما فاتورته، ومستحق لك 23,200 دولار.")
              : (audit?.summary.en || "You've collected 34% of what you billed, and you're owed USD 23,200 across 1 invoice(s).")}
          </p>
          <ol className="space-y-2 pt-2">
            {(audit?.actions || []).map((action, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs text-white/80">
                <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span>{isAr ? action.ar : action.en}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 Headline KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Sales */}
        <div className="p-4 rounded-3xl bg-[#0F0F0F] border border-white/5 transition-colors shadow-sm">
          <div className="text-[11px] font-bold text-white/60">{isAr ? "المبيعات" : "Sales"}</div>
          <div className="text-[10px] text-white/40">{isAr ? "الفواتير الصادرة" : "Invoices issued"}</div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {formatMoney(homeReport?.invoiced ?? 35200, currencyCode, isAr)}
          </div>
          {homeReport?.invoiced_change_pct != null && (
            <div className="mt-1 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{formatChange(homeReport.invoiced_change_pct)}</span>
            </div>
          )}
        </div>
        {/* Money received */}
        <div className="p-4 rounded-3xl bg-[#0F0F0F] border border-white/5 transition-colors shadow-sm">
          <div className="text-[11px] font-bold text-white/60">{isAr ? "الأموال المستلمة" : "Money received"}</div>
          <div className="text-[10px] text-white/40">{isAr ? "المدفوعات الفعلية" : "Actual payments"}</div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {formatMoney(homeReport?.collected ?? 12000, currencyCode, isAr)}
          </div>
          {homeReport?.collected_change_pct != null && (
            <div className="mt-1 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{formatChange(homeReport.collected_change_pct)}</span>
            </div>
          )}
        </div>
        {/* Expenses */}
        <div className="p-4 rounded-3xl bg-[#0F0F0F] border border-white/5 transition-colors shadow-sm">
          <div className="text-[11px] font-bold text-white/60">{isAr ? "المصروفات" : "Expenses"}</div>
          <div className="text-[10px] text-white/40">{isAr ? "ما أنفقته" : "What you spent"}</div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {formatMoney(homeReport?.expenses ?? 400, currencyCode, isAr)}
          </div>
          {homeReport?.expenses_change_pct != null && (
            <div className="mt-1 text-[10px] font-bold text-rose-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              <span>{formatChange(homeReport.expenses_change_pct)}</span>
            </div>
          )}
        </div>
        {/* Net cash */}
        <div className="p-4 rounded-3xl bg-[#0F0F0F] border border-white/5 transition-colors shadow-sm">
          <div className="text-[11px] font-bold text-white/60">{isAr ? "السيولة الصافية" : "Net cash"}</div>
          <div className="text-[10px] text-white/40">{isAr ? "المستلم - المصروفات" : "Received − expenses"}</div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {formatMoney(homeReport?.net_cash ?? 11600, currencyCode, isAr)}
          </div>
          {homeReport?.net_cash_change_pct != null && (
            <div className="mt-1 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{formatChange(homeReport.net_cash_change_pct)}</span>
            </div>
          )}
        </div>
      </section>

      {/* Currency & exclusions note */}
      <p className="text-[11px] text-white/60 px-1 -mt-2">
        {isAr
          ? `الأرقام بالعملة ${currencyCode} فقط. 4 فاتورة بعملات أخرى غير مشمولة.`
          : `Figures are in ${currencyCode} only. 4 invoice(s) in other currencies aren't included.`}
      </p>

      {/* Main Data Visualization: Money In vs Money Out */}
      <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-4 transition-colors shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isAr ? "الأموال الواردة مقابل الصادرة" : "Money in vs. money out"}</span>
              <span className="text-white/40 font-normal">•</span>
              <span className="text-white/60 font-medium">{isAr ? periodLabel.ar : periodLabel.en}</span>
            </h3>
            <p className="text-[10px] text-white/50 mt-0.5">
              {isAr ? "عرض التحليلات المالية" : "Real-time analytics chart"}
            </p>
          </div>
        </div>

        {/* Chart Container */}
        {loading ? (
          <div className="h-64 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center text-xs text-white/40">
            {isAr ? "جارِ تحميل التحليلات..." : "Loading analytics..."}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 rounded-2xl bg-white/5 flex items-center justify-center text-xs text-white/50">
            {isAr ? "لا توجد أموال متداولة في هذه الفترة بعد." : "No money moved in this period yet."}
          </div>
        ) : (
          <div className="w-full h-64 sm:h-72 transition-colors relative" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
                barCategoryGap={0}
                barGap={0}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.02)"
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fontWeight: 600,
                    fill: "rgba(255,255,255,0.4)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 9,
                    fontWeight: 600,
                    fill: "rgba(255,255,255,0.4)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : String(v))}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.tooltipBorder,
                    borderRadius: 12,
                    fontSize: 11,
                    color: colors.tooltipText,
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
                  }}
                  formatter={(val: any, name: any) => [
                    formatMoney(Number(val), currencyCode, isAr),
                    name === "income" ? (isAr ? "المستلم" : "Received") : (isAr ? "المصروفات" : "Expenses"),
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="rect"
                  iconSize={10}
                  wrapperStyle={{ paddingTop: 8, fontSize: 11 }}
                  formatter={(k) => (
                    <span style={{ color: colors.axisText, fontWeight: 600, paddingLeft: 4, paddingRight: 4 }}>
                      {k === "income" ? (isAr ? "المستلم" : "Received") : (isAr ? "المصروفات" : "Expenses")}
                    </span>
                  )}
                />
                <Bar
                  dataKey="expenses"
                  fill={colors.expenseBar}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="income"
                  fill={colors.incomeBar}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Row 2: Getting Paid & Money Owed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Getting paid */}
        <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-4 transition-colors shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{isAr ? "تحصيل الأموال" : "Getting paid"}</h3>
              <p className="text-[10px] text-white/50">{isAr ? periodLabel.ar : periodLabel.en}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="text-lg font-black text-white font-mono">{homeReport?.collection_rate ?? 34}%</div>
              <div className="text-[10px] text-white/50 mt-0.5">{isAr ? "محصل من المفوتر" : "Collected of billed"}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="text-lg font-black text-white font-mono">
                {speed?.avg_days != null ? `${speed.avg_days} ${isAr ? "يوم" : "d"}` : "3 d"}
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">{isAr ? "متوسط أيام الدفع" : "Avg. days to pay"}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5">
              <div className="text-lg font-black text-white font-mono">
                {speed ? `${speed.on_time_count}/${speed.paid_invoice_count}` : "1/1"}
              </div>
              <div className="text-[10px] text-white/50 mt-0.5">{isAr ? "مدفوع في الموعد" : "Paid on time"}</div>
            </div>
          </div>
          <p className="text-[11px] text-white/60">
            {isAr
              ? `بناءً على ${speed?.paid_invoice_count ?? 1} فاتورة مدفوعة بالكامل في هذه الفترة.`
              : `Based on ${speed?.paid_invoice_count ?? 1} invoice(s) fully paid in this period.`}
          </p>
        </section>

        {/* Money owed right now */}
        <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-4 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{isAr ? "المستحق لك الآن" : "Owed to you right now"}</h3>
                <p className="text-[10px] text-white/50">{isAr ? "ذمم مدينة مستحقة" : "Outstanding receivables"}</p>
              </div>
            </div>
            <span className="text-sm font-black text-white font-mono">
              {formatMoney(owedTotal || 23200, currencyCode, isAr)}
            </span>
          </div>
          <div className="space-y-2.5">
            {agingRows.length === 0 ? (
              <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">{isAr ? "لم يحل موعدها بعد" : "Not due yet"}</span>
                  <span className="font-bold text-white font-mono">$23,200.00 • 1</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: "100%" }} />
                </div>
              </div>
            ) : (
              agingRows.map((a) => {
                const m = AGING[a.bucket] ?? { en: a.bucket, ar: a.bucket, bar: "bg-white/40", text: "text-white/60" };
                const pct = owedTotal ? Math.round((a.amount / owedTotal) * 100) : 100;
                return (
                  <div key={a.bucket} className="space-y-1 p-2 rounded-xl bg-[#0A0A0A] border border-white/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${m.text}`}>{isAr ? m.ar : m.en}</span>
                      <span className="font-bold text-white font-mono">
                        {formatMoney(a.amount, currencyCode, isAr)} <span className="text-white/40 font-normal">• {a.invoice_count}</span>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full ${m.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Row 3: What Earns You Most & Best Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Products */}
        <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-4 transition-colors shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{isAr ? "المنتجات الأكثر ربحية" : "What earns you the most"}</h3>
              <p className="text-[10px] text-white/50">{isAr ? periodLabel.ar : periodLabel.en}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {products.map((p, idx) => (
              <div key={p.product_id || idx} className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{p.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">
                    {formatMoney(p.revenue, currencyCode, isAr)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/50 px-1">
                  <span>{isAr ? `الكمية: ${p.quantity}` : `Qty: ${p.quantity}`}</span>
                  <span>{isAr ? `${p.invoice_count} فاتورة` : `${p.invoice_count} invoice(s)`}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Customers */}
        <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-4 transition-colors shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{isAr ? "أفضل عملائك" : "Your best customers"}</h3>
              <p className="text-[10px] text-white/50">{isAr ? periodLabel.ar : periodLabel.en}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {customers.map((c, idx) => (
              <div key={c.customer_id || idx} className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono shrink-0">
                    {formatMoney(c.invoiced, currencyCode, isAr)}
                  </span>
                </div>
                <div className="text-[10px] text-amber-400 px-1">
                  {c.outstanding > 0 ? (
                    isAr ? `لا يزال مدينًا بـ ${formatMoney(c.outstanding, currencyCode, isAr)}` : `Still owes ${formatMoney(c.outstanding, currencyCode, isAr)}`
                  ) : (
                    <span className="text-emerald-400">{isAr ? "مسدد بالكامل" : "Fully paid"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Row 4: Where Your Money Goes (Expenses & Pie Chart) */}
      <section className="p-5 rounded-3xl bg-[#0F0F0F] border border-white/5 space-y-4 transition-colors shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{isAr ? "أين تذهب أموالك" : "Where your money goes"}</h3>
              <p className="text-[10px] text-white/50">{isAr ? periodLabel.ar : periodLabel.en}</p>
            </div>
          </div>
          <span className="text-sm font-black text-white font-mono">
            {formatMoney(homeReport?.expenses ?? 400, currencyCode, isAr)}
          </span>
        </div>
        {/* Budget progress bar */}
        {budget && (
          <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">
                {isAr ? "من موازنة هذا الشهر" : "of this month's budget"}{" "}
                <span className="font-bold text-white font-mono">{formatMoney(budget, currencyCode, isAr)}</span>
              </span>
              <span className="font-bold text-emerald-400 font-mono">
                {Math.round(((homeReport?.expenses ?? 400) / budget) * 100)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round(((homeReport?.expenses ?? 400) / budget) * 100))}%` }}
              />
            </div>
          </div>
        )}
        {/* Pie Chart and breakdown */}
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-12 sm:col-span-5 h-44" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cats}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {cats.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.tooltipBorder,
                    borderRadius: 12,
                    fontSize: 11,
                    color: colors.tooltipText,
                  }}
                  formatter={(val: any) => formatMoney(Number(val), currencyCode, isAr)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="col-span-12 sm:col-span-7 space-y-2 text-xs">
            {cats.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#0A0A0A] border border-white/5">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} aria-hidden="true" />
                  <span className="text-white/80 font-medium truncate">{c.name}</span>
                </span>
                <span className="font-bold text-white font-mono shrink-0">
                  {formatMoney(c.amount, currencyCode, isAr)}{" "}
                  <span className="text-white/50 font-normal">• {c.share}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};