import React, { useState } from "react";
import { X, Calculator, Sparkles } from "lucide-react";

interface QuadraticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolveWithAi: (problem: string) => void;
  onApplyResult: (expr: string, res: string) => void;
}

export const QuadraticModal: React.FC<QuadraticModalProps> = ({
  isOpen,
  onClose,
  onSolveWithAi,
  onApplyResult,
}) => {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");

  if (!isOpen) return null;

  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  const numC = parseFloat(c) || 0;

  // Calculate roots
  let root1 = "";
  let root2 = "";
  let discriminant = 0;
  let hasValidSolution = false;

  if (numA !== 0) {
    discriminant = numB * numB - 4 * numA * numC;
    hasValidSolution = true;
    if (discriminant > 0) {
      const r1 = (-numB + Math.sqrt(discriminant)) / (2 * numA);
      const r2 = (-numB - Math.sqrt(discriminant)) / (2 * numA);
      root1 = `x₁ = ${r1.toFixed(4).replace(/\.?0+$/, "")}`;
      root2 = `x₂ = ${r2.toFixed(4).replace(/\.?0+$/, "")}`;
    } else if (discriminant === 0) {
      const r = -numB / (2 * numA);
      root1 = `x = ${r.toFixed(4).replace(/\.?0+$/, "")} (double root)`;
      root2 = "";
    } else {
      const real = (-numB / (2 * numA)).toFixed(3);
      const imag = (Math.sqrt(-discriminant) / (2 * numA)).toFixed(3);
      root1 = `x₁ = ${real} + ${imag}i`;
      root2 = `x₂ = ${real} - ${imag}i`;
    }
  }

  const equationStr = `${numA !== 1 ? numA : ""}x² ${numB >= 0 ? "+ " + numB : "- " + Math.abs(numB)}x ${numC >= 0 ? "+ " + numC : "- " + Math.abs(numC)} = 0`;

  return (
    <div
      id="quadratic-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="quadratic-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-950 border border-blue-800/60 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-lg text-white">Quadratic Solver (ax² + bx + c = 0)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Coefficients */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">a (x²)</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">b (x)</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-semibold mb-1 block">c (constant)</label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold"
            />
          </div>
        </div>

        {/* Display Equation & Solution */}
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-center space-y-2">
          <p className="font-mono text-cyan-300 font-bold text-base">{equationStr}</p>
          {numA === 0 ? (
            <p className="text-rose-400 text-xs font-semibold">Value of 'a' cannot be zero for quadratic equation.</p>
          ) : (
            <div className="space-y-1 text-sm font-mono text-white">
              <p className="text-xs text-slate-400">
                Discriminant Δ = b² - 4ac = <span className="font-bold text-amber-300">{discriminant}</span>
              </p>
              <p className="text-emerald-300 font-bold text-base">{root1}</p>
              {root2 && <p className="text-emerald-300 font-bold text-base">{root2}</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onSolveWithAi(`Solve the quadratic equation ${equationStr} step-by-step with derivation.`);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explain with Gemini AI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onApplyResult(equationStr, root1 + (root2 ? `, ${root2}` : ""));
              onClose();
            }}
            className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Insert into Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
