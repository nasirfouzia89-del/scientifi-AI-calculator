import React from "react";
import { ChevronLeft, RotateCcw } from "lucide-react";

interface DisplayProps {
  expression: string;
  result: string;
  isDegreeMode: boolean;
  onToggleDegreeMode: () => void;
  onOpenHistory: () => void;
  onClear: () => void;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  isDegreeMode,
  onToggleDegreeMode,
  onOpenHistory,
  onClear,
}) => {
  const isError = result === "Error";

  return (
    <div id="calculator-display-container" className="w-full flex flex-col px-5 pt-4 pb-2 text-white select-none">
      {/* Top action row */}
      <div id="top-nav-row" className="flex items-center justify-between text-slate-400 mb-2">
        <button
          id="history-btn"
          type="button"
          onClick={onOpenHistory}
          className="p-1.5 -ml-1 rounded-xl hover:bg-slate-800/60 transition text-slate-300 flex items-center gap-1 cursor-pointer"
          title="History"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
          <span className="text-xs font-semibold">History</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            id="deg-rad-toggle"
            type="button"
            onClick={onToggleDegreeMode}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/90 text-cyan-300 font-mono font-semibold border border-slate-700/80 hover:bg-slate-700 transition cursor-pointer"
            title="Toggle Angle Unit (Degree / Radian)"
          >
            {isDegreeMode ? "DEG" : "RAD"}
          </button>

          {expression && (
            <button
              id="clear-small-btn"
              type="button"
              onClick={onClear}
              className="text-xs text-slate-400 hover:text-rose-300 flex items-center gap-1 transition px-2 py-1 rounded-lg hover:bg-slate-800/60 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expression line */}
      <div id="expression-preview-line" className="min-h-[28px] text-right font-mono text-slate-300 text-lg sm:text-xl font-medium tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none">
        {expression ? (
          <span>= {expression}</span>
        ) : (
          <span className="text-slate-600">= 0</span>
        )}
      </div>

      {/* Main Result */}
      <div
        id="main-result-display"
        className={`text-right font-bold tracking-tight transition-all duration-200 overflow-x-auto whitespace-nowrap scrollbar-none ${
          isError
            ? "text-rose-400 text-4xl sm:text-5xl my-1"
            : "text-white text-5xl sm:text-6xl my-1"
        }`}
      >
        {result || "0"}
      </div>
    </div>
  );
};
