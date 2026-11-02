import React from "react";
import { RaqimoLogo } from "./RaqimoLogo";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Wallet,
  Users,
  Package,
  BarChart3,
  Sparkles,
  CreditCard,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  language: "en" | "ar";
  isOpen?: boolean;
  onClose?: () => void;
  activeSection?: string;
  onSelectSection?: (s: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  isOpen = false,
  onClose,
  activeSection = "reports",
  onSelectSection,
}) => {
  const isAr = language === "ar";

  const content = (
    <div className="flex flex-col h-full bg-[#050505] border-r border-white/5 p-4 select-none">
      {/* Brand & Logo Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <RaqimoLogo className="w-9 h-9" />
          <div>
            <h1 className="font-black text-sm tracking-wider text-white">RAQIMO</h1>
            <p className="text-[10px] text-white/50">{isAr ? "عملك، بوضوح تام." : "Your Business, Clearly."}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Greeting card */}
      <div className="py-4 border-b border-white/5">
        <h3 className="text-base font-bold text-white leading-tight">
          {isAr ? "مرحباً بعودتك، QA" : "Welcome back, QA"}
        </h3>
        <p className="text-[11px] text-white/60 flex items-center gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isAr ? "كل شيء محدّث الآن" : "Everything is up to date"}</span>
        </p>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto space-y-5 py-4 no-scrollbar">
        {/* Overview */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 px-3">
            {isAr ? "نظرة عامة" : "Overview"}
          </span>
          <div className="mt-1.5 space-y-1">
            <button
              onClick={() => onSelectSection?.("home")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeSection === "home"
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-white/60" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </button>
          </div>
        </div>

        {/* Business */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 px-3">
            {isAr ? "الأعمال" : "Business"}
          </span>
          <div className="mt-1.5 space-y-1">
            <button
              onClick={() => onSelectSection?.("invoices")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeSection === "invoices"
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-white/60" />
                <span>{isAr ? "الفواتير" : "Invoices"}</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-white/10 text-white/80">
                6
              </span>
            </button>

            <button
              onClick={() => onSelectSection?.("new-invoice")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-white/60" />
              <span>{isAr ? "فاتورة جديدة" : "New invoice"}</span>
            </button>

            <button
              onClick={() => onSelectSection?.("expenses")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeSection === "expenses"
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Wallet className="w-4 h-4 text-white/60" />
              <span>{isAr ? "المصروفات" : "Expenses"}</span>
            </button>

            <button
              onClick={() => onSelectSection?.("customers")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeSection === "customers"
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4 text-white/60" />
              <span>{isAr ? "العملاء" : "Customers"}</span>
            </button>

            <button
              onClick={() => onSelectSection?.("products")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeSection === "products"
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Package className="w-4 h-4 text-white/60" />
              <span>{isAr ? "المنتجات والخدمات" : "Products & services"}</span>
            </button>
          </div>
        </div>

        {/* Insights */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 px-3">
            {isAr ? "التحليلات" : "Insights"}
          </span>
          <div className="mt-1.5 space-y-1">
            {/* Active Reports tab matching screenshot */}
            <button
              onClick={() => onSelectSection?.("reports")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeSection === "reports"
                  ? "bg-white/10 text-white shadow-sm border border-white/5"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className={`w-4 h-4 ${activeSection === "reports" ? "text-cyan-400" : "text-white/60"}`} />
                <span>{isAr ? "التقارير" : "Reports"}</span>
              </div>
              {/* Vertical pill indicator */}
              {activeSection === "reports" && (
                <span className="w-1 h-4 rounded-full bg-cyan-400 shrink-0" />
              )}
            </button>

            <button
              onClick={() => onSelectSection?.("ai")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeSection === "ai"
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4 text-white/60" />
              <span>{isAr ? "رقيمو AI" : "Raqimo AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account footer matching screenshot */}
      <div className="pt-3 border-t border-white/5 space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 px-1">
          {isAr ? "الحساب" : "Account"}
        </span>

        {/* Plan badge */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#0F0F0F] border border-white/5">
          <span className="text-xs font-bold text-white">{isAr ? "الخطة المجانية" : "Free plan"}</span>
          <button className="px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
            <CreditCard className="w-3 h-3" />
            <span>{isAr ? "الخطط" : "Plans"}</span>
          </button>
        </div>

        {/* User bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-transparent hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs flex items-center justify-center shrink-0">
              Q
            </div>
            <span className="text-xs text-white/80 truncate font-mono">testprod12@gmail.com</span>
          </div>
          <button
            title={isAr ? "تسجيل الخروج" : "Sign out"}
            className="p-1.5 text-white/50 hover:text-white rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-40 transition-colors">
        {content}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">{content}</div>
        </div>
      )}
    </>
  );
};
