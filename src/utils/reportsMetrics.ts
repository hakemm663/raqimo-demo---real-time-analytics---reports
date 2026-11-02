import { HomeReport, TrendPoint, PeriodKey } from "../types";

/**
 * Fixes column misalignment and the 323 empty months bug in "All time" view.
 * The backend returns monthly buckets starting from year 2000 even if business was created recently.
 * We trim leading zero-activity months while keeping the relevant active window.
 */
export function alignTrendData(
  trend: TrendPoint[],
  period: PeriodKey,
  granularity: "day" | "month",
  isAr: boolean = false
): Array<{ name: string; date: string; income: number; expenses: number; net: number }> {
  if (!trend || trend.length === 0) return [];

  let filtered = [...trend];

  if (period === "all" && filtered.length > 24) {
    // Find the first index with non-zero income or expenses
    const firstActiveIndex = filtered.findIndex((t) => (t.income || 0) > 0 || (t.expenses || 0) > 0);
    if (firstActiveIndex > 0) {
      // Keep a buffer of up to 5 preceding months for context, but drop the years of dead 0s
      const startIndex = Math.max(0, firstActiveIndex - 5);
      filtered = filtered.slice(startIndex);
    } else {
      // If no activity, keep the last 12 months
      filtered = filtered.slice(-12);
    }
  }

  return filtered.map((t) => {
    let label = t.date;
    try {
      if (granularity === "month") {
        const d = new Date(`${t.date}T12:00:00Z`);
        label = d.toLocaleDateString(isAr ? "ar-EG" : "en-US", {
          month: "short",
          year: period === "all" ? "2-digit" : undefined,
          timeZone: "UTC",
        });
      } else {
        // Day format
        const dayNum = Number(t.date.slice(8, 10));
        label = String(isNaN(dayNum) ? t.date : dayNum);
      }
    } catch {
      label = t.date;
    }

    const income = Number(t.income || 0);
    const expenses = Number(t.expenses || 0);

    return {
      name: label,
      date: t.date,
      income,
      expenses,
      net: income - expenses,
    };
  });
}

/**
 * Get contrast-safe colors for chart text (X & Y axis ticks, legends, tooltips)
 * In dark mode: high-contrast slate/white (#CBD5E1)
 * In light mode: deep slate (#334155), preventing the hidden-text bug
 */
export function getChartThemeColors(isDark: boolean) {
  return {
    axisText: isDark ? "#CBD5E1" : "#334155",
    axisSubtle: isDark ? "#94A3B8" : "#64748B",
    gridLine: isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(15, 23, 42, 0.08)",
    cardBg: isDark ? "#0F0F0F" : "#FFFFFF",
    tooltipBg: isDark ? "#0A0A0A" : "#FFFFFF",
    tooltipText: isDark ? "#F8FAFC" : "#0F172A",
    tooltipBorder: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.15)",
    incomeBar: "#10B981", // Emerald
    expenseBar: "#F43F5E", // Rose
    netLine: "#38BDF8", // Cyan / sky
  };
}

/**
 * Format currency with proper symbols and locale
 */
export function formatMoney(amount: number, currency: string = "USD", isAr: boolean = false): string {
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

/**
 * Format KPI change label
 */
export function formatChange(changePct: number | null | undefined): string {
  if (changePct == null || isNaN(changePct)) return "";
  const sign = changePct > 0 ? "+" : "";
  return `${sign}${changePct}%`;
}
