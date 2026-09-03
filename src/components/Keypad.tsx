import React from "react";

interface KeypadProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onFunction: (fn: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onCalculate: () => void;
  onQuad: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onOperator,
  onFunction,
  onClear,
  onDelete,
  onCalculate,
  onQuad,
}) => {
  return (
    <div id="calculator-keypad-grid" className="w-full px-5 py-2 grid grid-cols-4 gap-2.5">
      {/* Row 1: C, (, ), ÷ */}
      <button
        id="key-clear"
        type="button"
        onClick={onClear}
        className="h-13 sm:h-14 rounded-2xl bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-bold text-xl shadow-md shadow-orange-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        C
      </button>
      <button
        id="key-open-paren"
        type="button"
        onClick={() => onOperator("(")}
        className="h-13 sm:h-14 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 text-white font-bold text-xl shadow-md shadow-fuchsia-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        (
      </button>
      <button
        id="key-close-paren"
        type="button"
        onClick={() => onOperator(")")}
        className="h-13 sm:h-14 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 text-white font-bold text-xl shadow-md shadow-fuchsia-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        )
      </button>
      <button
        id="key-divide"
        type="button"
        onClick={() => onOperator("÷")}
        className="h-13 sm:h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        ÷
      </button>

      {/* Row 2: sin, cos, tan, × */}
      <button
        id="key-sin"
        type="button"
        onClick={() => onFunction("sin(")}
        className="h-13 sm:h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold text-lg shadow-md shadow-purple-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        sin
      </button>
      <button
        id="key-cos"
        type="button"
        onClick={() => onFunction("cos(")}
        className="h-13 sm:h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-lg shadow-md shadow-indigo-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        cos
      </button>
      <button
        id="key-tan"
        type="button"
        onClick={() => onFunction("tan(")}
        className="h-13 sm:h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-lg shadow-md shadow-blue-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        tan
      </button>
      <button
        id="key-multiply"
        type="button"
        onClick={() => onOperator("×")}
        className="h-13 sm:h-14 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-sky-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        ×
      </button>

      {/* Row 3: 7, 8, 9, - */}
      <button
        id="key-digit-7"
        type="button"
        onClick={() => onDigit("7")}
        className="h-13 sm:h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-emerald-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        7
      </button>
      <button
        id="key-digit-8"
        type="button"
        onClick={() => onDigit("8")}
        className="h-13 sm:h-14 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-teal-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        8
      </button>
      <button
        id="key-digit-9"
        type="button"
        onClick={() => onDigit("9")}
        className="h-13 sm:h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        9
      </button>
      <button
        id="key-subtract"
        type="button"
        onClick={() => onOperator("-")}
        className="h-13 sm:h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-3xl shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        -
      </button>

      {/* Row 4: 4, 5, 6, + */}
      <button
        id="key-digit-4"
        type="button"
        onClick={() => onDigit("4")}
        className="h-13 sm:h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-emerald-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        4
      </button>
      <button
        id="key-digit-5"
        type="button"
        onClick={() => onDigit("5")}
        className="h-13 sm:h-14 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-teal-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        5
      </button>
      <button
        id="key-digit-6"
        type="button"
        onClick={() => onDigit("6")}
        className="h-13 sm:h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        6
      </button>
      <button
        id="key-add"
        type="button"
        onClick={() => onOperator("+")}
        className="h-13 sm:h-14 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-teal-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        +
      </button>

      {/* Row 5: 1, 2, 3, log */}
      <button
        id="key-digit-1"
        type="button"
        onClick={() => onDigit("1")}
        className="h-13 sm:h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-emerald-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        1
      </button>
      <button
        id="key-digit-2"
        type="button"
        onClick={() => onDigit("2")}
        className="h-13 sm:h-14 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-teal-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        2
      </button>
      <button
        id="key-digit-3"
        type="button"
        onClick={() => onDigit("3")}
        className="h-13 sm:h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        3
      </button>
      <button
        id="key-log"
        type="button"
        onClick={() => onFunction("log(")}
        className="h-13 sm:h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold text-lg shadow-md shadow-purple-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        log
      </button>

      {/* Row 6: 0, ., x², √ */}
      <button
        id="key-digit-0"
        type="button"
        onClick={() => onDigit("0")}
        className="h-13 sm:h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-emerald-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        0
      </button>
      <button
        id="key-decimal"
        type="button"
        onClick={() => onDigit(".")}
        className="h-13 sm:h-14 rounded-2xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-white font-bold text-3xl shadow-md shadow-cyan-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        .
      </button>
      <button
        id="key-power2"
        type="button"
        onClick={() => onOperator("²")}
        className="h-13 sm:h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-semibold text-lg shadow-md shadow-purple-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        x²
      </button>
      <button
        id="key-sqrt"
        type="button"
        onClick={() => onFunction("√(")}
        className="h-13 sm:h-14 rounded-2xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xl shadow-md shadow-purple-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        √
      </button>

      {/* Row 7: n!, Quad, =, DEL */}
      <button
        id="key-factorial"
        type="button"
        onClick={() => onOperator("!")}
        className="h-13 sm:h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-bold text-lg shadow-md shadow-amber-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        n!
      </button>
      <button
        id="key-quad"
        type="button"
        onClick={onQuad}
        className="h-13 sm:h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-base shadow-md shadow-blue-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        Quad
      </button>
      <button
        id="key-equals"
        type="button"
        onClick={onCalculate}
        className="h-13 sm:h-14 rounded-2xl bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-bold text-2xl shadow-md shadow-rose-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        =
      </button>
      <button
        id="key-delete"
        type="button"
        onClick={onDelete}
        className="h-13 sm:h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-base shadow-md shadow-rose-950/30 transition-all flex items-center justify-center cursor-pointer"
      >
        DEL
      </button>
    </div>
  );
};
