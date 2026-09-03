import { NumberProperties } from "../types";

export function isPrime(n: number): boolean {
  if (n <= 1 || !Number.isInteger(n)) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function isComposite(n: number): boolean {
  if (n <= 3 || !Number.isInteger(n)) return false;
  return !isPrime(n);
}

export function analyzeNumber(val: string | number): NumberProperties {
  const num = typeof val === "number" ? val : parseFloat(val);

  if (isNaN(num)) {
    return {
      isInteger: false,
      isPositive: false,
      isEven: false,
      isOdd: false,
      isPrime: false,
      isComposite: false,
    };
  }

  const isInt = Number.isInteger(num);
  const isPos = num > 0;
  const isEv = isInt && num % 2 === 0;
  const isOd = isInt && Math.abs(num % 2) === 1;
  const prime = isInt && num > 1 && isPrime(num);
  const comp = isInt && num > 3 && isComposite(num);

  const factors: number[] = [];
  if (isInt && num > 0 && num <= 100000) {
    for (let i = 1; i <= Math.min(num, 1000); i++) {
      if (num % i === 0) {
        factors.push(i);
      }
    }
  }

  return {
    isInteger: isInt,
    isPositive: isPos,
    isEven: isEv,
    isOdd: isOd,
    isPrime: prime,
    isComposite: comp,
    factors: factors.length > 0 ? factors : undefined,
  };
}

// Factorial calculation helper
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial only for non-negative integers");
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

// Safe expression evaluator
export function evaluateExpression(expr: string, isDegreeMode = true): { result: string; error: boolean } {
  if (!expr || expr.trim() === "") {
    return { result: "0", error: false };
  }

  try {
    let sanitized = expr
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/−/g, "-")
      .replace(/\^/g, "**")
      .replace(/π/g, `${Math.PI}`)
      .replace(/e/g, `${Math.E}`);

    // Detect leading invalid division or operators e.g. "/2+22"
    if (/^[\/*\+]/.test(sanitized.trim())) {
      return { result: "Error", error: true };
    }

    // Handle factorial e.g. 5! or (3+2)!
    sanitized = sanitized.replace(/(\d+)!/g, (_, num) => {
      const val = parseInt(num, 10);
      return `${factorial(val)}`;
    });

    // Handle square root e.g. √(9) or √9
    sanitized = sanitized.replace(/√\s*(\d+(\.\d+)?)/g, "Math.sqrt($1)");
    sanitized = sanitized.replace(/√\s*\(([^)]+)\)/g, "Math.sqrt($1)");

    // Handle x² e.g. 5² or (2+3)²
    sanitized = sanitized.replace(/(\d+(\.\d+)?)²/g, "Math.pow($1, 2)");
    sanitized = sanitized.replace(/\(([^)]+)\)²/g, "Math.pow(($1), 2)");

    // Handle log e.g. log(100) or log100
    sanitized = sanitized.replace(/log\s*(\d+(\.\d+)?)/g, "Math.log10($1)");
    sanitized = sanitized.replace(/log\s*\(([^)]+)\)/g, "Math.log10($1)");

    // Handle trig functions: sin, cos, tan
    const trigAngleConvert = (fn: string, arg: string) => {
      if (isDegreeMode) {
        return `Math.${fn}((${arg}) * Math.PI / 180)`;
      }
      return `Math.${fn}(${arg})`;
    };

    sanitized = sanitized.replace(/sin\s*\(([^)]+)\)/g, (_, arg) => trigAngleConvert("sin", arg));
    sanitized = sanitized.replace(/sin\s*(\d+(\.\d+)?)/g, (_, arg) => trigAngleConvert("sin", arg));

    sanitized = sanitized.replace(/cos\s*\(([^)]+)\)/g, (_, arg) => trigAngleConvert("cos", arg));
    sanitized = sanitized.replace(/cos\s*(\d+(\.\d+)?)/g, (_, arg) => trigAngleConvert("cos", arg));

    sanitized = sanitized.replace(/tan\s*\(([^)]+)\)/g, (_, arg) => trigAngleConvert("tan", arg));
    sanitized = sanitized.replace(/tan\s*(\d+(\.\d+)?)/g, (_, arg) => trigAngleConvert("tan", arg));

    // Security check: only allow safe Math operations, numbers, brackets, operators
    if (!/^[0-9+\-*/().,MathPIEpowsqrltangcsin\s**e]+$/.test(sanitized)) {
      return { result: "Error", error: true };
    }

    // Execute with Function
    const evalFn = new Function(`"use strict"; return (${sanitized});`);
    const numResult = evalFn();

    if (numResult === undefined || isNaN(numResult)) {
      return { result: "Error", error: true };
    }

    if (!isFinite(numResult)) {
      return { result: numResult > 0 ? "Infinity" : "-Infinity", error: false };
    }

    // Round clean floats
    const rounded = Number(Math.round(Number(numResult + "e+10")) + "e-10");
    return { result: rounded.toString(), error: false };
  } catch {
    return { result: "Error", error: true };
  }
}
