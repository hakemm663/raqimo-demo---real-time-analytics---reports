import React from "react";

export const RaqimoLogo: React.FC<{ className?: string; size?: number }> = ({ className = "w-8 h-8", size }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={size ? { width: size, height: size } : undefined}>
      <img
        src="/raqimo_logo.png"
        alt="Raqimo"
        className="w-full h-full object-contain rounded-xl"
        onError={(e) => {
          // If image fails, show SVG fallback
          (e.currentTarget as HTMLElement).style.display = "none";
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const fallback = document.createElement("div");
            fallback.className = "w-full h-full bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md";
            fallback.innerText = "R";
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
};
