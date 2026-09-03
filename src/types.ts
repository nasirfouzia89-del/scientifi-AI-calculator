export type Language = "ur" | "en";

export type AiModalType = "tutor" | "explain" | "ask" | "property" | "quadratic" | null;

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface NumberProperties {
  isInteger: boolean;
  isPositive: boolean;
  isEven: boolean;
  isOdd: boolean;
  isPrime: boolean;
  isComposite: boolean;
  factors?: number[];
}
