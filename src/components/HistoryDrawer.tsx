import React from "react";
import { X, Trash2, Clock, CornerDownLeft } from "lucide-react";
import { CalculationHistoryItem } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  history: CalculationHistoryItem[];
  onClose: () => void;
  onSelect: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  onClose,
  onSelect,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="history-drawer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="history-drawer-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[80vh] bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col text-slate-200"
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-lg text-white">Calculation History</h3>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                title="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No calculation history yet. Perform calculations to see them here!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/60 hover:border-cyan-500/40 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-mono truncate">{item.expression}</p>
                  <p className="text-lg font-bold text-white font-mono">{item.result}</p>
                </div>
                <button
                  type="button"
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:text-cyan-300 group-hover:bg-slate-700 transition shrink-0 ml-2"
                  title="Load into calculator"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
