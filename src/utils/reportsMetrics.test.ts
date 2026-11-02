import test from "node:test";
import assert from "node:assert/strict";
import { alignTrendData, getChartThemeColors, formatMoney, formatChange } from "./reportsMetrics";
import { TrendPoint } from "../types";

test("alignTrendData trims leading empty months for all time period", () => {
  // Generate 100 empty months from 2000 to 2026, with data only in late 2026
  const dummyTrend: TrendPoint[] = [];
  for (let y = 2000; y <= 2025; y++) {
    dummyTrend.push({ date: `${y}-01-01`, income: 0, expenses: 0 });
  }
  // Add active months
  dummyTrend.push({ date: "2026-10-01", income: 0, expenses: 0 });
  dummyTrend.push({ date: "2026-11-01", income: 12000, expenses: 400 });

  const aligned = alignTrendData(dummyTrend, "all", "month", false);
  assert.ok(aligned.length < 30, "Should truncate the 25 years of dead zero columns");
  assert.equal(aligned[aligned.length - 1].income, 12000);
  assert.equal(aligned[aligned.length - 1].expenses, 400);
  assert.equal(aligned[aligned.length - 1].net, 11600);
});

test("alignTrendData preserves small periods without loss", () => {
  const quarterTrend: TrendPoint[] = [
    { date: "2026-10-01", income: 0, expenses: 0 },
    { date: "2026-11-01", income: 12000, expenses: 400 },
  ];
  const aligned = alignTrendData(quarterTrend, "quarter", "month", false);
  assert.equal(aligned.length, 2);
  assert.equal(aligned[1].income, 12000);
  assert.equal(aligned[1].net, 11600);
});

test("getChartThemeColors guarantees contrast in both dark and light modes", () => {
  const darkColors = getChartThemeColors(true);
  const lightColors = getChartThemeColors(false);

  // In dark mode, axis text must be light (#CBD5E1 or similar light tone)
  assert.equal(darkColors.axisText, "#CBD5E1");

  // In light mode, axis text must be dark slate (#334155), NOT transparent or white
  assert.equal(lightColors.axisText, "#334155");
  assert.notEqual(lightColors.axisText, "rgba(255,255,255,0.4)");
  assert.equal(lightColors.cardBg, "#FFFFFF");
});

test("formatMoney correctly formats USD currency", () => {
  assert.equal(formatMoney(11600, "USD", false), "$11,600.00");
  assert.equal(formatMoney(400, "USD", false), "$400.00");
});

test("formatChange formats percentage changes with signs", () => {
  assert.equal(formatChange(34), "+34%");
  assert.equal(formatChange(-12), "-12%");
  assert.equal(formatChange(null), "");
});
