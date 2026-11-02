/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ReportsTab } from "./components/tabs/ReportsTab";
import { authenticateTestUser } from "./lib/api";

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem("raqimo_theme") !== "light";
    } catch {
      return true;
    }
  });

  const [language, setLanguage] = useState<"en" | "ar">(() => {
    try {
      return (localStorage.getItem("raqimo_lang") as "en" | "ar") || "en";
    } catch {
      return "en";
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("reports");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    try {
      localStorage.setItem("raqimo_theme", isDark ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    try {
      localStorage.setItem("raqimo_lang", language);
    } catch {
      // ignore
    }
  }, [language]);

  // Attempt real live authentication on mount
  useEffect(() => {
    authenticateTestUser().catch((err) => {
      console.warn("[App] Initial auth attempt", err);
    });
  }, []);

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-[#050505] text-[#F0F0F0]" : "bg-[#F4F6F8] text-[#0B1220]"} transition-colors duration-200`}>
      {/* Sidebar */}
      <Sidebar
        language={language}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          setMobileMenuOpen(false);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          language={language}
          onToggleLanguage={() => setLanguage((prev) => (prev === "en" ? "ar" : "en"))}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          netCashAmount={11600}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeSection === "reports" ? (
            <ReportsTab isDark={isDark} language={language} />
          ) : (
            <div className="p-8 rounded-3xl bg-[#0F0F0F] border border-white/5 text-center space-y-3">
              <h3 className="text-base font-bold text-white">
                {language === "ar" ? "قسم تجريبي" : "Demo Navigation"}
              </h3>
              <p className="text-xs text-white/60">
                {language === "ar"
                  ? "تم تخصيص هذا التطبيق التجريبي لصفحة التقارير والتحليلات الحية وإصلاح مخططات البيانات."
                  : "This demo focuses on the Reports page with real-time analytics, responsive chart grids, and theme contrast fixes."}
              </p>
              <button
                onClick={() => setActiveSection("reports")}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold cursor-pointer"
              >
                {language === "ar" ? "العودة للتقارير" : "Back to Reports"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
