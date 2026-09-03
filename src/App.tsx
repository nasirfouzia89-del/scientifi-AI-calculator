/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Display } from "./components/Display";
import { AiButtons } from "./components/AiButtons";
import { Keypad } from "./components/Keypad";
import { BottomBar } from "./components/BottomBar";
import { AiModal } from "./components/AiModal";
import { QuadraticModal } from "./components/QuadraticModal";
import { HistoryDrawer } from "./components/HistoryDrawer";
import {
  evaluateExpression,
  analyzeNumber,
} from "./utils/calculator";
import {
  Language,
  AiModalType,
  CalculationHistoryItem,
} from "./types";

export default function App() {
  // Calculator core states
  const [expression, setExpression] = useState<string>("2+2÷2");
  const [result, setResult] = useState<string>("3");
  const [isDegreeMode, setIsDegreeMode] = useState<boolean>(true);
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    return [
      {
        id: "1",
        expression: "2+2÷2",
        result: "3",
        timestamp: Date.now() - 60000,
      },
    ];
  });

  // Language state (default Urdu as shown in video, toggleable to English)
  const [language, setLanguage] = useState<Language>("ur");

  // AI Modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<AiModalType>(null);
  const [aiModalTitle, setAiModalTitle] = useState<string>("");
  const [aiModalContent, setAiModalContent] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [lastRequestPayload, setLastRequestPayload] = useState<{
    endpoint: string;
    body: any;
  } | null>(null);

  // Sub-modals
  const [isQuadOpen, setIsQuadOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Dynamic analysis of current result
  const numberProperties = useMemo(() => {
    return analyzeNumber(result);
  }, [result]);

  // Keypad actions
  const handleDigit = (digit: string) => {
    setExpression((prev) => {
      // If previous was Error, start fresh
      if (result === "Error") {
        setResult("0");
        return digit;
      }
      return prev + digit;
    });
  };

  const handleOperator = (op: string) => {
    setExpression((prev) => {
      if (result === "Error") {
        setResult("0");
        return prev + op;
      }
      return prev + op;
    });
  };

  const handleFunction = (fn: string) => {
    setExpression((prev) => {
      if (result === "Error") {
        setResult("0");
        return fn;
      }
      return prev + fn;
    });
  };

  const handleClear = () => {
    setExpression("");
    setResult("0");
  };

  const handleDelete = () => {
    setExpression((prev) => {
      if (prev.length <= 1) return "";
      // Handle multi-character functions like 'sin(', 'log(', etc.
      if (prev.endsWith("sin(") || prev.endsWith("cos(") || prev.endsWith("tan(") || prev.endsWith("log(")) {
        return prev.slice(0, -4);
      }
      if (prev.endsWith("√(")) {
        return prev.slice(0, -2);
      }
      return prev.slice(0, -1);
    });
  };

  const handleCalculate = () => {
    if (!expression || expression.trim() === "") return;
    const { result: evalResult, error } = evaluateExpression(expression, isDegreeMode);
    setResult(evalResult);

    if (!error && evalResult !== "Error") {
      setHistory((prev) => [
        {
          id: Date.now().toString(),
          expression,
          result: evalResult,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 19),
      ]);
    }
  };

  // Safe fetch helper that handles HTML warmup pages, non-JSON responses, and errors cleanly
  const safeCallAi = async (endpoint: string, body: Record<string, any>, currentLang: "ur" | "en"): Promise<string> => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const rawText = await res.text();
        if (rawText.includes("<!doctype") || rawText.includes("<html") || rawText.includes("warmup")) {
          throw new Error(
            currentLang === "ur"
              ? "سرور اس وقت بیدار ہو رہا ہے۔ براہ کرم 'دوبارہ کوشش کریں' بٹن دبائیں۔"
              : "Server is warming up. Please tap 'Retry' in a moment."
          );
        }
        throw new Error(
          currentLang === "ur"
            ? "سرور سے غیر متوقع جواب موصول ہوا ہے۔"
            : "Unexpected server response. Please retry."
        );
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data.text || (currentLang === "ur" ? "کوئی جواب موصول نہیں ہوا۔" : "No response received.");
    } catch (err: any) {
      // If error already has a friendly Urdu/English message, preserve it
      if (err.message && (err.message.includes("<!doctype") || err.message.includes("is not valid JSON"))) {
        throw new Error(
          currentLang === "ur"
            ? "سرور سے رابطہ عارضی طور پر منقطع تھا۔ براہ کرم دوبارہ کوشش کریں۔"
            : "Connection briefly interrupted. Please retry."
        );
      }
      throw err;
    }
  };

  // AI Math Tutor Trigger
  const handleOpenAiTutor = async () => {
    setIsAiModalOpen(true);
    setAiModalType("tutor");
    setAiModalTitle(
      language === "ur" ? "ٹیوٹر گائیڈ (AI Math Tutor)" : "AI Math Tutor Guide"
    );
    setAiModalContent("");
    setIsAiLoading(true);

    const payload = {
      endpoint: "/api/ai-tutor",
      body: {
        expression: expression || result,
        result: result,
        language,
      },
    };
    setLastRequestPayload(payload);

    try {
      const text = await safeCallAi(payload.endpoint, payload.body, language);
      setAiModalContent(text);
    } catch (err: any) {
      setAiModalContent(
        language === "ur"
          ? `خرابی: ${err.message || "Gemini سے رابطہ کرنے میں مسئلہ پیش آیا۔ براہ کرم دوبارہ کوشش کریں۔"}`
          : `Error: ${err.message || "Failed to reach Gemini. Please verify your connection."}`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Explain Trigger
  const handleOpenAiExplain = async () => {
    setIsAiModalOpen(true);
    setAiModalType("explain");
    setAiModalTitle(
      language === "ur" ? "وضاحت (AI Explanation)" : "Step-by-Step AI Explanation"
    );
    setAiModalContent("");
    setIsAiLoading(true);

    const payload = {
      endpoint: "/api/ai-explain",
      body: {
        expression: expression || result,
        result: result,
        language,
      },
    };
    setLastRequestPayload(payload);

    try {
      const text = await safeCallAi(payload.endpoint, payload.body, language);
      setAiModalContent(text);
    } catch (err: any) {
      setAiModalContent(
        language === "ur"
          ? `خرابی: ${err.message || "Gemini سے رابطہ کرنے میں مسئلہ پیش آیا۔"}`
          : `Error: ${err.message || "Failed to contact Gemini."}`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Triggered when user taps a property pill (Composite, Prime, Odd, Even)
  const handleSelectProperty = async (prop: string) => {
    const currentNum = result !== "Error" ? result : "3";
    setIsAiModalOpen(true);
    setAiModalType("property");
    setAiModalTitle(
      language === "ur"
        ? `${prop} عدد کا تجزیہ (${currentNum})`
        : `${prop} Number Analysis (${currentNum})`
    );
    setAiModalContent("");
    setIsAiLoading(true);

    const promptText = `Explain why the number ${currentNum} is or is not a ${prop} number. Detail the mathematical definition, prime factor breakdown, and mathematical proofs.`;
    const payload = {
      endpoint: "/api/ai-ask",
      body: {
        question: promptText,
        currentExpression: expression,
        currentResult: result,
        language,
      },
    };
    setLastRequestPayload(payload);

    try {
      const text = await safeCallAi(payload.endpoint, payload.body, language);
      setAiModalContent(text);
    } catch (err: any) {
      setAiModalContent(
        language === "ur"
          ? `خرابی: ${err.message || "تجزیہ مکمل نہیں ہو سکا۔"}`
          : `Error: ${err.message || "Could not complete analysis."}`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Ask Gemini bottom bar
  const handleAskGemini = async (query: string) => {
    setIsAiModalOpen(true);
    setAiModalType("ask");
    setAiModalTitle(
      language === "ur" ? "Gemini ریاضی معاون" : "Gemini Math Intelligence"
    );
    setAiModalContent("");
    setIsAiLoading(true);

    const payload = {
      endpoint: "/api/ai-ask",
      body: {
        question: query,
        currentExpression: expression,
        currentResult: result,
        language,
      },
    };
    setLastRequestPayload(payload);

    try {
      const text = await safeCallAi(payload.endpoint, payload.body, language);
      setAiModalContent(text);
    } catch (err: any) {
      setAiModalContent(
        language === "ur"
          ? `خرابی: ${err.message || "درخواست پر کارروائی نہیں ہو سکی۔"}`
          : `Error: ${err.message || "Failed to process question."}`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Toggle Language between Urdu and English
  const handleToggleLanguage = async () => {
    const nextLang = language === "ur" ? "en" : "ur";
    setLanguage(nextLang);
    // If modal is currently open and has a payload, re-fetch with new language
    if (isAiModalOpen && lastRequestPayload) {
      const updatedPayload = {
        ...lastRequestPayload,
        body: {
          ...lastRequestPayload.body,
          language: nextLang,
        },
      };
      setLastRequestPayload(updatedPayload);
      setIsAiLoading(true);
      try {
        const text = await safeCallAi(updatedPayload.endpoint, updatedPayload.body, nextLang);
        setAiModalContent(text);
      } catch (err: any) {
        setAiModalContent(
          nextLang === "ur"
            ? `خرابی: ${err.message || "Gemini سے رابطہ کرنے میں مسئلہ پیش آیا۔"}`
            : `Error: ${err.message || "Failed to contact Gemini."}`
        );
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  // Retry last request
  const handleRetryAi = async () => {
    if (lastRequestPayload) {
      setIsAiLoading(true);
      try {
        const text = await safeCallAi(lastRequestPayload.endpoint, lastRequestPayload.body, language);
        setAiModalContent(text);
      } catch (err: any) {
        setAiModalContent(
          language === "ur"
            ? `خرابی: ${err.message || "دوبارہ رابطہ ناکام رہا۔"}`
            : `Error: ${err.message || "Retry failed."}`
        );
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  return (
    <main
      id="main-app-viewport"
      className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-0 sm:p-4 text-slate-100 font-sans select-none overflow-x-hidden"
    >
      {/* Phone container mockup matching video aspect ratio and frame */}
      <div
        id="phone-device-shell"
        className="w-full max-w-[430px] min-h-screen sm:min-h-[860px] sm:h-[92vh] sm:max-h-[940px] bg-[#070b14] sm:border sm:border-slate-800/80 sm:rounded-[42px] shadow-2xl flex flex-col justify-between overflow-hidden relative"
      >
        {/* Top Display Area */}
        <div className="w-full flex flex-col">
          <Display
            expression={expression}
            result={result}
            isDegreeMode={isDegreeMode}
            onToggleDegreeMode={() => setIsDegreeMode(!isDegreeMode)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onClear={handleClear}
          />

          {/* AI Math Tutor & AI Explain Buttons + 4 Property Pills */}
          <AiButtons
            onOpenAiTutor={handleOpenAiTutor}
            onOpenAiExplain={handleOpenAiExplain}
            onSelectProperty={handleSelectProperty}
            numberProperties={numberProperties}
            currentResult={result}
          />
        </div>

        {/* 4x7 Scientific Keypad Grid */}
        <div className="w-full flex-1 flex flex-col justify-center">
          <Keypad
            onDigit={handleDigit}
            onOperator={handleOperator}
            onFunction={handleFunction}
            onClear={handleClear}
            onDelete={handleDelete}
            onCalculate={handleCalculate}
            onQuad={() => setIsQuadOpen(true)}
          />
        </div>

        {/* Bottom Floating Bar: '+' button, 'Ask Gem...' input, mic, send */}
        <div className="w-full">
          <BottomBar
            onAskGemini={handleAskGemini}
            onInsertSymbol={(sym) => setExpression((prev) => prev + sym)}
            isLoading={isAiLoading}
          />
        </div>
      </div>

      {/* AI Explanation & Tutor Modal */}
      <AiModal
        isOpen={isAiModalOpen}
        type={aiModalType}
        title={aiModalTitle}
        expression={expression}
        result={result}
        content={aiModalContent}
        isLoading={isAiLoading}
        language={language}
        onClose={() => setIsAiModalOpen(false)}
        onToggleLanguage={handleToggleLanguage}
        onRetry={handleRetryAi}
      />

      {/* Quadratic Solver Dialog */}
      <QuadraticModal
        isOpen={isQuadOpen}
        onClose={() => setIsQuadOpen(false)}
        onSolveWithAi={(problem) => handleAskGemini(problem)}
        onApplyResult={(expr, res) => {
          setExpression(expr);
          setResult(res);
        }}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={(item) => {
          setExpression(item.expression);
          setResult(item.result);
          setIsHistoryOpen(false);
        }}
        onClearHistory={() => setHistory([])}
      />
    </main>
  );
}
