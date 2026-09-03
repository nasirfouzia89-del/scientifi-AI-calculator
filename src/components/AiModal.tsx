import React from "react";
import Markdown from "react-markdown";
import { X, Sparkles, Copy, Check, Globe, RefreshCw } from "lucide-react";
import { AiModalType, Language } from "../types";

interface AiModalProps {
  isOpen: boolean;
  type: AiModalType;
  title?: string;
  expression: string;
  result: string;
  content: string;
  isLoading: boolean;
  language: Language;
  onClose: () => void;
  onToggleLanguage: () => void;
  onRetry: () => void;
}

export const AiModal: React.FC<AiModalProps> = ({
  isOpen,
  type,
  title,
  expression,
  result,
  content,
  isLoading,
  language,
  onClose,
  onToggleLanguage,
  onRetry,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine modal header based on type and language
  const getHeaderTitle = () => {
    if (title) return title;
    if (type === "tutor") {
      return language === "ur" ? "ٹیوٹر گائیڈ (AI Math Tutor)" : "AI Math Tutor Guide";
    }
    if (type === "explain") {
      return language === "ur" ? "وضاحت (AI Explanation)" : "Step-by-Step AI Explanation";
    }
    if (type === "ask") {
      return language === "ur" ? "Gemini 2.5 ریاضی معاون" : "Gemini 2.5 Math Intelligence";
    }
    if (type === "property") {
      return language === "ur" ? "عددی خصوصیات کا تجزیہ" : "Number Property Analysis";
    }
    return "Gemini AI";
  };

  const isUrdu = language === "ur";

  return (
    <div
      id="ai-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ai-modal-card"
        dir={isUrdu ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] bg-slate-950 border border-purple-900/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 ring-1 ring-purple-500/20"
      >
        {/* Header */}
        <div
          id="ai-modal-header"
          className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
              {getHeaderTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Language toggle: Urdu / English */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold border border-purple-800/40 flex items-center gap-1 transition"
              title="Toggle Language / زبان تبدیل کریں"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isUrdu ? "English" : "اردو"}</span>
            </button>

            {/* Copy button */}
            {content && !isLoading && (
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Copy text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}

            {/* Close icon */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expression context banner */}
        {(expression || result) && (
          <div className="px-6 py-2 bg-purple-950/30 border-b border-purple-900/30 flex items-center justify-between text-xs text-purple-200 font-mono">
            <span className="truncate">
              {expression ? `Expr: ${expression}` : "Number"}
            </span>
            <span className="font-bold text-cyan-300">
              {result && result !== "0" ? `= ${result}` : ""}
            </span>
          </div>
        )}

        {/* Content Body */}
        <div
          id="ai-modal-content-body"
          className={`flex-1 p-6 overflow-y-auto space-y-4 text-sm sm:text-base leading-relaxed ${
            isUrdu ? "font-sans leading-loose text-right" : "font-sans text-left"
          }`}
        >
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-5">
              {/* Circular Spinner like in video */}
              <div className="relative w-14 h-14">
                <div className="w-14 h-14 rounded-full border-4 border-purple-900 border-t-purple-400 animate-spin"></div>
                <Sparkles className="w-5 h-5 text-amber-300 absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="text-center space-y-1">
                <p className="text-base sm:text-lg font-semibold text-purple-200">
                  {isUrdu ? "Gemini سوچ رہا ہے...✨" : "Gemini is thinking...✨"}
                </p>
                <p className="text-xs text-slate-400">
                  {type === "tutor"
                    ? isUrdu
                      ? "ریاضی کے اصول اور گائیڈ تیار کی جا رہی ہے..."
                      : "Preparing pedagogical concepts & intuition..."
                    : isUrdu
                    ? "مرحلہ وار حل مرتب کیا جا رہا ہے..."
                    : "Computing step-by-step breakdown..."}
                </p>
              </div>
            </div>
          ) : content ? (
            <div className="markdown-body prose prose-invert max-w-none text-slate-200 space-y-3">
              <Markdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-purple-300 border-b border-slate-800 pb-2 mb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-bold text-cyan-300 mt-4 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold text-amber-300 mt-3 mb-1">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => <p className="mb-2.5 text-slate-200">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
                  li: ({ children }) => <li className="text-slate-200">{children}</li>,
                  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                  code: ({ children }) => (
                    <code className="px-1.5 py-0.5 rounded bg-slate-900 text-pink-300 font-mono text-xs sm:text-sm border border-slate-800">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-3 my-2 text-slate-300 italic bg-purple-950/20 py-1.5 rounded-r">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </Markdown>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <p>{isUrdu ? "کوئی وضاحت دستیاب نہیں ہے۔" : "No content available."}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isUrdu ? "دوبارہ کوشش کریں" : "Try Again"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer with video-matching purple close button */}
        <div
          id="ai-modal-footer"
          className="p-4 border-t border-slate-900 bg-slate-950 flex flex-col gap-2"
        >
          {content && (content.startsWith("خرابی:") || content.startsWith("Error:")) && (
            <button
              id="ai-modal-retry-btn"
              type="button"
              onClick={onRetry}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 font-semibold text-sm border border-purple-700/50 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isUrdu ? "دوبارہ کوشش کریں (Retry)" : "Retry"}</span>
            </button>
          )}
          <button
            id="ai-modal-close-btn"
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-purple-950/50 transition cursor-pointer text-center"
          >
            {isUrdu ? "بند کریں" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
