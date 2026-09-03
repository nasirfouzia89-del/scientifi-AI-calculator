import React from "react";
import { Sparkles, GraduationCap, Lightbulb } from "lucide-react";
import { NumberProperties } from "../types";

interface AiButtonsProps {
  onOpenAiTutor: () => void;
  onOpenAiExplain: () => void;
  onSelectProperty: (property: string) => void;
  numberProperties: NumberProperties;
  currentResult: string;
}

export const AiButtons: React.FC<AiButtonsProps> = ({
  onOpenAiTutor,
  onOpenAiExplain,
  onSelectProperty,
  numberProperties,
  currentResult,
}) => {
  return (
    <div id="ai-controls-wrapper" className="w-full px-5 py-2 flex flex-col gap-2.5">
      {/* Top 2 AI Action Cards */}
      <div id="ai-main-action-buttons" className="grid grid-cols-2 gap-3">
        {/* AI Math Tutor Button */}
        <button
          id="btn-ai-math-tutor"
          type="button"
          onClick={onOpenAiTutor}
          className="relative overflow-hidden rounded-2xl py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center cursor-pointer border border-purple-400/30 group"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>AI Math ✨</span>
          </div>
          <span className="text-xs sm:text-sm text-purple-200 font-semibold tracking-wide">
            Tutor
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>

        {/* AI Explain Button */}
        <button
          id="btn-ai-explain"
          type="button"
          onClick={onOpenAiExplain}
          className="relative overflow-hidden rounded-2xl py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg shadow-rose-900/30 hover:shadow-rose-700/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center text-center cursor-pointer border border-rose-400/30 group"
        >
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold">
            <span>AI Explain</span>
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <span className="text-[11px] sm:text-xs text-rose-100/90 font-medium tracking-wide">
            Step-by-Step
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
      </div>

      {/* 4 Math Property Pills */}
      <div id="ai-property-pills-row" className="grid grid-cols-4 gap-2">
        {/* Composite */}
        <button
          id="pill-composite"
          type="button"
          onClick={() => onSelectProperty("Composite")}
          className={`py-1.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all border text-center ${
            numberProperties.isComposite
              ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-900/40 ring-2 ring-indigo-400/40"
              : "bg-indigo-950/60 text-indigo-300/80 border-indigo-900/60 hover:bg-indigo-900/50 hover:text-indigo-200"
          }`}
          title={
            numberProperties.isComposite
              ? `${currentResult} is a Composite number`
              : `Click to analyze if ${currentResult} is Composite`
          }
        >
          Composite
        </button>

        {/* Prime */}
        <button
          id="pill-prime"
          type="button"
          onClick={() => onSelectProperty("Prime")}
          className={`py-1.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all border text-center ${
            numberProperties.isPrime
              ? "bg-cyan-500 text-white border-cyan-300 shadow-md shadow-cyan-900/40 ring-2 ring-cyan-300/40"
              : "bg-cyan-950/60 text-cyan-300/80 border-cyan-900/60 hover:bg-cyan-900/50 hover:text-cyan-200"
          }`}
          title={
            numberProperties.isPrime
              ? `${currentResult} is a Prime number`
              : `Click to analyze if ${currentResult} is Prime`
          }
        >
          Prime
        </button>

        {/* Odd */}
        <button
          id="pill-odd"
          type="button"
          onClick={() => onSelectProperty("Odd")}
          className={`py-1.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all border text-center ${
            numberProperties.isOdd
              ? "bg-amber-500 text-white border-amber-300 shadow-md shadow-amber-900/40 ring-2 ring-amber-300/40"
              : "bg-amber-950/60 text-amber-300/80 border-amber-900/60 hover:bg-amber-900/50 hover:text-amber-200"
          }`}
          title={
            numberProperties.isOdd
              ? `${currentResult} is an Odd number`
              : `Click to analyze if ${currentResult} is Odd`
          }
        >
          Odd
        </button>

        {/* Even */}
        <button
          id="pill-even"
          type="button"
          onClick={() => onSelectProperty("Even")}
          className={`py-1.5 px-2 rounded-xl text-xs font-semibold tracking-wide transition-all border text-center ${
            numberProperties.isEven
              ? "bg-emerald-500 text-white border-emerald-300 shadow-md shadow-emerald-900/40 ring-2 ring-emerald-300/40"
              : "bg-emerald-950/60 text-emerald-300/80 border-emerald-900/60 hover:bg-emerald-900/50 hover:text-emerald-200"
          }`}
          title={
            numberProperties.isEven
              ? `${currentResult} is an Even number`
              : `Click to analyze if ${currentResult} is Even`
          }
        >
          Even
        </button>
      </div>
    </div>
  );
};
