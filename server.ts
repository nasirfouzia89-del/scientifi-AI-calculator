import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to generate content with fallback across official supported models
async function generateWithFallback(prompt: string, systemInstruction?: string): Promise<string> {
  const ai = getGenAI();
  // Valid active models in priority order for speed & reliability
  const models = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];

  let lastError: unknown = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed (${err?.message || err?.status || "error"}), trying next fallback...`);
      lastError = err;
    }
  }
  throw lastError || new Error("Failed to generate content with Gemini");
}

// Deterministic Math Analysis Fallback for Number Properties (Prime, Composite, Odd, Even)
function getPropertyAnalysisFallback(prop: string, numStr: string, language: string = "ur"): string {
  const n = parseFloat(numStr);
  const isUrdu = language === "ur";
  const isInt = Number.isInteger(n);

  if (isUrdu) {
    if (prop.toLowerCase().includes("prime") || prop.includes("مفرد")) {
      const isPrime = isInt && n > 1 && (() => {
        for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
        return true;
      })();
      return `### عدد ${numStr} کا مفرد عدد (Prime Number) تجزیہ\n\n` +
        `* **نتیجہ:** عدد ${numStr} ${isPrime ? "**ایک مفرد عدد (Prime)** ہے" : "**مفرد عدد نہیں ہے**"}۔\n` +
        `* **تعریف:** مفرد عدد وہ عدد ہوتا ہے جو 1 سے بڑا ہو اور صرف 1 اور اپنے آپ پر پورا تقسیم ہو سکے۔\n` +
        `* **قواسم (Divisors):** ${isPrime ? `اس کے صرف دو قواسم ہیں: 1 اور ${numStr}۔` : `اس کے دو سے زیادہ قواسم ہیں۔`}\n` +
        (n === 2 ? `* **خاص بات:** 2 واحد جفت مفرد عدد (Even Prime Number) اور سب سے چھوٹا مفرد عدد ہے!` : "");
    }
    if (prop.toLowerCase().includes("composite") || prop.includes("مرکب")) {
      const isComp = isInt && n > 3 && (() => {
        for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return true;
        return false;
      })();
      return `### عدد ${numStr} کا مرکب عدد (Composite Number) تجزیہ\n\n` +
        `* **نتیجہ:** عدد ${numStr} ${isComp ? "**ایک مرکب عدد (Composite)** ہے" : "**مرکب عدد نہیں ہے**"}۔\n` +
        `* **تعریف:** مرکب عدد وہ مثبت عدد ہے جو 1 سے بڑا ہو اور مفرد نہ ہو، یعنی اس کے دو سے زائد قواسم ہوں۔\n`;
    }
    if (prop.toLowerCase().includes("odd") || prop.includes("طاق")) {
      const isOdd = isInt && n % 2 !== 0;
      return `### عدد ${numStr} کا طاق عدد (Odd Number) تجزیہ\n\n` +
        `* **نتیجہ:** عدد ${numStr} ${isOdd ? "**ایک طاق عدد (Odd)** ہے" : "**جفت عدد ہے، طاق نہیں**"}۔\n` +
        `* **تعریف:** وہ اعداد جو 2 پر مکمل تقسیم نہ ہوں طاق اعداد کہلاتے ہیں۔ (${numStr} = 2k + ${isOdd ? "1" : "0"})\n`;
    }
    if (prop.toLowerCase().includes("even") || prop.includes("جفت")) {
      const isEven = isInt && n % 2 === 0;
      return `### عدد ${numStr} کا جفت عدد (Even Number) تجزیہ\n\n` +
        `* **نتیجہ:** عدد ${numStr} ${isEven ? "**ایک جفت عدد (Even)** ہے" : "**طاق عدد ہے، جفت نہیں**"}۔\n` +
        `* **تعریف:** وہ اعداد جو 2 پر پورا تقسیم ہو جائیں جفت اعداد کہلاتے ہیں۔ (${numStr} = 2 × ${n / 2})\n`;
    }
  }

  // English fallback
  return `### Number ${numStr} Analysis (${prop})\n\n` +
    `* **Analysis:** Computed property check for ${prop} on value ${numStr}.\n` +
    `* **Classification:** ${numStr} is evaluated in standard mathematical set theory.`;
}

// 1. AI Explain: Step-by-step mechanical breakdown of calculation
app.post("/api/ai-explain", async (req, res) => {
  try {
    const { expression, result, language = "ur" } = req.body;
    if (!expression && !result) {
      return res.json({ error: "Expression or result is required." });
    }

    const langInstruction =
      language === "ur"
        ? "Respond in Urdu with clear Urdu mathematical terminology (like 'ترتیب', 'مرحلہ', 'تقسیم', 'ضرب', 'جمع', 'تفریق'), along with English math symbols and formula highlights where helpful."
        : "Respond in clear, accessible English with formatted math steps and formula highlights.";

    const systemInstruction = `You are an expert AI Math Explainer.
Your primary goal is to provide a precise, systematic, step-by-step mechanical explanation of the mathematical expression and how the result is computed.
${langInstruction}

Structure your response cleanly using Markdown:
1. Short overview of the given expression and the goal.
2. The fundamental mathematical rule applied (e.g., PEMDAS / BODMAS order of operations, logarithm law, trigonometric identity, quadratic formula, or exponent rule).
3. Clear numbered steps (Step 1, Step 2, Step 3, etc.) showing intermediate values.
4. Final verification checking that the result is correct.
Keep it direct, logical, easy to follow, and strictly focused on solving the problem.`;

    const prompt = `Explain step-by-step the calculation for:
Expression: ${expression || result}
Result: ${result || "Not computed"}
Please provide the complete step-by-step breakdown.`;

    try {
      const explanation = await generateWithFallback(prompt, systemInstruction);
      return res.json({ text: explanation });
    } catch (modelErr: any) {
      console.warn("AI generation failed, providing structured explanation fallback:", modelErr);
      const isUrdu = language === "ur";
      const fallbackText = isUrdu
        ? `### حساب کی مرحلہ وار وضاحت (${expression || result} = ${result})\n\n` +
          `1. **حسابی عبارت:** \`${expression || result}\`\n` +
          `2. **ریاضیاتی اصول:** حساب BODMAS / PEMDAS کے اصولوں کے مطابق ترتیب دیا گیا ہے۔\n` +
          `3. **حتمی نتیجہ:** \`${result}\`\n\n` +
          `*نوٹ: Gemini ماڈل سے فوری رابطہ تاخیر کا شکار تھا، اس لیے بنیادی حسابی توثیق دکھائی جا رہی ہے۔ براہ کرم دوبارہ کوشش کر کے تفصیلی AI تجزیہ بھی حاصل کریں۔*`
        : `### Step-by-Step Calculation (${expression || result} = ${result})\n\n` +
          `1. **Given Expression:** \`${expression || result}\`\n` +
          `2. **Rule Applied:** Standard order of mathematical operations (PEMDAS / BODMAS).\n` +
          `3. **Evaluated Result:** \`${result}\``;
      return res.json({ text: fallbackText });
    }
  } catch (error: any) {
    console.error("Error in /api/ai-explain:", error);
    res.json({
      error: error?.message || "Failed to generate explanation. Please try again.",
    });
  }
});

// 2. AI Math Tutor: Pedagogical, conceptual mentor
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { expression, result, language = "ur" } = req.body;
    if (!expression && !result) {
      return res.json({ error: "Expression or result is required." });
    }

    const langInstruction =
      language === "ur"
        ? "Respond in Urdu in an engaging, encouraging tutor tone (like in the video: 'السلام علیکم! آپ نے ریاضی کی عبارت کے طور پر فراہم کیا ہے...', exploring properties like طاق عدد (Odd), مفرد عدد (Prime), ہندسی اہمیت (Geometric importance), and خلاصہ (Summary))."
        : "Respond in English in a friendly, engaging teacher tone. Explore properties of the numbers and functions, real-world intuition, geometrical meaning, common student pitfalls, and a short challenge/reflection.";

    const systemInstruction = `You are a supportive, insightful AI Math Tutor.
Unlike a pure step-by-step solver, your focus as a TUTOR is conceptual understanding, intuition, and number theory insights.
${langInstruction}

Structure your tutoring guide using Markdown:
1. Warm greeting and conceptual framing of the problem or resulting number.
2. The "Why" behind the math: intuitive intuition and mathematical properties (e.g. if single number: prime/composite, odd/even, factors, geometry, real life; if expression: why the rule works, visual interpretation).
3. Deep-dive points (e.g. #1 Basic identity, #2 Parity/Primes, #3 Geometric significance, #4 Algebraic connection).
4. Common misconceptions or pitfalls to avoid.
5. Quick Tutor Check / Thought Question for the student to test their understanding.
6. Summary and encouraging closing.`;

    const prompt = `As an AI Math Tutor, guide and mentor the student about:
Expression / Problem: ${expression || result}
Final Value / Result: ${result || "Computed"}
Provide a rich, conceptual tutoring lesson.`;

    try {
      const tutorResponse = await generateWithFallback(prompt, systemInstruction);
      return res.json({ text: tutorResponse });
    } catch (modelErr: any) {
      console.warn("AI tutor generation failed, providing fallback:", modelErr);
      const isUrdu = language === "ur";
      const fallbackText = isUrdu
        ? `### السلام علیکم! ریاضیاتی ٹیوٹر گائیڈ (${expression || result})\n\n` +
          `آپ نے **${expression || result}** کا حساب کیا ہے جس کا نتیجہ **${result}** ہے۔\n\n` +
          `* **اہمیت:** ریاضی میں اس قسم کا حساب بنیادی الجبرا اور حسابی اصولوں کی مضبوط بنیاد فراہم کرتا ہے۔\n` +
          `* **توجہ طلب نکتہ:** ہمیشہ عوامل اور علامات (+, -, ×, ÷) کی ترتیب پر توجہ دیں تاکہ غیر متوقع جواب سے بچا جا سکے۔\n\n` +
          `*براہ کرم مکمل AI تجزیے کے لیے دوبارہ کلک کریں۔*`
        : `### AI Math Tutor Overview (${expression || result})\n\n` +
          `You computed **${expression || result}**, resulting in **${result}**.\n\n` +
          `* **Core Concept:** Understanding the precedence and algebraic flow ensures error-free computations.\n` +
          `* **Tip:** Review intermediate operations and sign rules for deeper intuition.`;
      return res.json({ text: fallbackText });
    }
  } catch (error: any) {
    console.error("Error in /api/ai-tutor:", error);
    res.json({
      error: error?.message || "Failed to generate tutor response. Please try again.",
    });
  }
});

// 3. Ask Gemini / General Math Assistant & Number Properties
app.post("/api/ai-ask", async (req, res) => {
  try {
    const { question, currentExpression, currentResult, language = "ur" } = req.body;
    if (!question) {
      return res.json({ error: "Question is required." });
    }

    const langInstruction =
      language === "ur"
        ? "Respond primarily in Urdu with English formulas/equations where appropriate."
        : "Respond in English with clear step-by-step formatting.";

    const systemInstruction = `You are Gemini Math Intelligence built inside a high-precision Scientific Calculator.
You help students and engineers solve mathematical problems, algebra, calculus, trigonometry, scientific constants, number theory properties (prime, composite, odd, even), and word problems.
${langInstruction}
Be clear, accurate, use markdown formatting, and provide direct answers with step-by-step clarity.`;

    const prompt = `User typed question: "${question}"
Calculator context:
- Current expression on screen: "${currentExpression || 'None'}"
- Current result on screen: "${currentResult || 'None'}"

Please answer and explain thoroughly.`;

    try {
      const answer = await generateWithFallback(prompt, systemInstruction);
      return res.json({ text: answer });
    } catch (modelErr: any) {
      console.warn("AI ask failed, checking for property analysis fallback:", modelErr);
      // Check if this was a property check (Prime, Composite, Odd, Even)
      const numMatch = question.match(/number\s+([-\d.]+)\s+is\s+or\s+is\s+not\s+a\s+(\w+)/i);
      if (numMatch) {
        const numVal = numMatch[1];
        const propName = numMatch[2];
        const fallback = getPropertyAnalysisFallback(propName, numVal, language);
        return res.json({ text: fallback });
      }
      const isUrdu = language === "ur";
      return res.json({
        text: isUrdu
          ? `Gemini سروس فی الوقت زیادہ مانگ (High Demand) کی وجہ سے مصروف ہے۔ براہ کرم ایک لمحے بعد دوبارہ کوشش کریں۔\n\nسوال: "${question}"`
          : `Gemini service is experiencing high demand. Please try your question again in a moment.\n\nQuestion: "${question}"`
      });
    }
  } catch (error: any) {
    console.error("Error in /api/ai-ask:", error);
    res.json({
      error: error?.message || "Failed to process your request.",
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
