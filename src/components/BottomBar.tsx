import React, { useState } from "react";
import { Plus, Mic, MicOff, ArrowUp, X, Sparkles, Binary } from "lucide-react";

interface BottomBarProps {
  onAskGemini: (prompt: string) => void;
  onInsertSymbol: (symbol: string) => void;
  isLoading: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  onAskGemini,
  onInsertSymbol,
  isLoading,
}) => {
  const [inputText, setInputText] = useState("");
  const [showExtraSymbols, setShowExtraSymbols] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onAskGemini(inputText.trim());
    setInputText("");
  };

  // Voice speech-to-text if available in browser
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          onAskGemini(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const extraSymbols = [
    { label: "π", val: "π" },
    { label: "e", val: "e" },
    { label: "%", val: "%" },
    { label: "^", val: "^" },
    { label: "|x|", val: "abs(" },
    { label: "1/x", val: "1/(" },
  ];

  return (
    <div id="bottom-assistant-wrapper" className="w-full px-4 pt-1 pb-3 flex flex-col items-center">
      {/* Expanded Symbols Drawer if '+' is pressed */}
      {showExtraSymbols && (
        <div id="extra-symbols-popup" className="w-full mb-2 p-2 bg-slate-900/90 border border-slate-700/60 rounded-2xl flex items-center justify-around gap-1.5 shadow-xl backdrop-blur-md">
          {extraSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onInsertSymbol(item.val);
                setShowExtraSymbols(false);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-sm font-semibold transition"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowExtraSymbols(false)}
            className="p-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Input Pill */}
      <form
        id="ask-gemini-form"
        onSubmit={handleSubmit}
        className="w-full h-13 bg-slate-900/90 border border-slate-700/70 hover:border-indigo-500/50 focus-within:border-indigo-500 rounded-full px-2.5 flex items-center gap-2 shadow-2xl backdrop-blur-md transition"
      >
        {/* Plus button */}
        <button
          id="btn-extra-symbols"
          type="button"
          onClick={() => setShowExtraSymbols(!showExtraSymbols)}
          className={`p-2 rounded-full transition ${
            showExtraSymbols
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
          title="More scientific constants and symbols"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          id="ask-gemini-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Gem..."
          className="flex-1 bg-transparent text-white text-sm sm:text-base outline-none placeholder:text-slate-500 font-normal"
        />

        {/* Mic button */}
        <button
          id="btn-voice-input"
          type="button"
          onClick={handleToggleVoice}
          className={`p-2 rounded-full transition ${
            isListening
              ? "bg-rose-600 text-white animate-pulse"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
          title={isListening ? "Listening... Speak now" : "Voice input"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send button */}
        <button
          id="btn-submit-gemini"
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className={`p-2 rounded-full transition ${
            inputText.trim() && !isLoading
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 active:scale-95 shadow-md shadow-indigo-600/30"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
          title="Send to Gemini"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* Android Bottom Navigation bar decoration */}
      <div id="android-nav-bar" className="w-full flex items-center justify-around text-slate-600 pt-3 px-8">
        <div className="flex flex-col gap-0.5 opacity-60">
          <div className="w-3 h-0.5 bg-slate-500 rounded"></div>
          <div className="w-3 h-0.5 bg-slate-500 rounded"></div>
          <div className="w-3 h-0.5 bg-slate-500 rounded"></div>
        </div>
        <div className="w-3 h-3 rounded-full border border-slate-500 opacity-60"></div>
        <div className="w-2.5 h-2.5 border-l-2 border-b-2 border-slate-500 rotate-45 opacity-60"></div>
      </div>
    </div>
  );
};
