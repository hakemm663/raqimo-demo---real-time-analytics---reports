import React, { useState } from "react";
import {
  Bell,
  Globe,
  CheckCircle2,
  Smartphone,
  Menu,
  CreditCard,
  Sun,
  Moon,
  X,
  TrendingUp,
} from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  language: "en" | "ar";
  onToggleLanguage: () => void;
  onToggleMobileMenu: () => void;
  netCashAmount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  language,
  onToggleLanguage,
  onToggleMobileMenu,
  netCashAmount = 11600,
}) => {
  const isAr = language === "ar";
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  return (
    <>
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#050505] sticky top-0 z-30 transition-colors">
        {/* Left: Mobile Menu Button + User Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors"
            title={isAr ? "القائمة" : "Open menu"}
            aria-label={isAr ? "فتح القائمة" : "Open menu"}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative shrink-0 hidden sm:block">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold shadow-sm font-mono text-base">
              Q
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full" />
          </div>

          <div>
            <h2 className="text-sm lg:text-base font-light text-white/90">
              {isAr ? "أهلاً، " : "Hello, "}
              <span className="font-semibold text-white">QA Engineer</span>
            </h2>
            <p className="text-[11px] text-white/60 flex items-center gap-1.5 mt-0.5 font-mono">
              <span className="truncate max-w-[120px] sm:max-w-[200px]">DevOps</span>
              <span>•</span>
              <span className="text-cyan-400 font-medium flex items-center gap-0.5 shrink-0">
                <CheckCircle2 className="w-3 h-3 inline text-cyan-400" aria-hidden="true" />
                {isAr ? "متزامن" : "Synced"}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Net Cash Flow & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
          {/* Net cash this month */}
          <div className="text-right rtl:text-left hidden md:block">
            <p className="text-[10px] text-white/60 uppercase tracking-widest font-mono">
              {isAr ? "صافي النقد هذا الشهر" : "Net cash this month"}
            </p>
            <p className="text-base lg:text-lg font-mono font-bold text-emerald-400">
              +${netCashAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Theme Toggle (light / dark) */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 flex items-center justify-center transition-colors cursor-pointer"
            title={isDark ? (isAr ? "الوضع الفاتح" : "Switch to light mode") : (isAr ? "الوضع الداكن" : "Switch to dark mode")}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[11px] font-bold flex items-center gap-1.5 transition-colors font-mono cursor-pointer"
            title={language === "en" ? "التبديل إلى العربية" : "Switch to English"}
            aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <Globe className="w-3.5 h-3.5 text-white/60" />
            <span>{language === "en" ? "العربية" : "EN"}</span>
          </button>

          {/* Plans Button */}
          <button
            className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-bold font-mono transition-all hidden sm:flex items-center gap-1.5 cursor-pointer"
            title={isAr ? "إدارة الاشتراك" : "Manage subscription"}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isAr ? "الخطط" : "Plans"}</span>
          </button>

          {/* Mobile App Trigger */}
          <button
            onClick={() => setMobileModalOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-cyan-400 transition-colors cursor-pointer"
            title={isAr ? "تطبيق الهاتف" : "Mobile App"}
            aria-label="Mobile App"
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
              title={isAr ? "الإشعارات" : "Notifications"}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full font-mono">
                9+
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-80 p-3 rounded-2xl bg-[#0F0F0F] border border-white/10 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-white">{isAr ? "الإشعارات" : "Notifications"} (9+)</span>
                  <button onClick={() => setNotificationsOpen(false)} className="text-white/60 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <div className="font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {isAr ? "تم تسجيل دفعة بقيمة $12,000" : "Payment received: $12,000.00"}
                    </div>
                    <div className="text-[10px] text-white/60 mt-0.5">{isAr ? "من عميل تجريبي" : "From Test Customer"}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5 text-white/80">
                    <div className="font-bold">{isAr ? "فاتورة جديدة متأخرة" : "Invoice payment due"}</div>
                    <div className="text-[10px] text-white/60 mt-0.5">$23,200.00 · Test Customer</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile App Modal */}
      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <span>{isAr ? "تطبيق رقيمو" : "Raqimo Mobile"}</span>
              </div>
              <button onClick={() => setMobileModalOpen(false)} className="p-1 rounded-lg text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {isAr
                ? "إدارة الفواتير والمصروفات والتقارير المالية لحظياً عبر هاتفك الذكي (iOS & Android)."
                : "Manage invoices, track expenses, and view real-time financial reports on iOS & Android."}
            </p>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xs font-mono text-cyan-400 font-bold">App Store & Google Play</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
