export interface UtilityTool {
  id: string;
  title: string;
  description: string;
  path: string;
  keywords: string[];
}

export const utilityTools: UtilityTool[] = [
  { id: "binary-decimal", title: "Binary ↔ Decimal", description: "Convert between binary and decimal numbers instantly.", path: "/tools/binary-decimal", keywords: ["binary", "decimal", "base 2", "base 10"] },
  { id: "hex-rgb", title: "Hex ↔ RGB", description: "Convert hex color codes to RGB and back.", path: "/tools/hex-rgb", keywords: ["hex", "rgb", "color", "css"] },
  { id: "scientific-notation", title: "Scientific Notation", description: "Convert large and small numbers to scientific notation.", path: "/tools/scientific-notation", keywords: ["scientific", "notation", "exponent"] },
  { id: "unicode", title: "Unicode Converter", description: "Translate characters to Unicode code points and back.", path: "/tools/unicode", keywords: ["unicode", "code point", "utf-16"] },
  { id: "morse-code", title: "Morse Code Translator", description: "Translate text to Morse code and back.", path: "/tools/morse-code", keywords: ["morse", "dots", "dashes"] },
  { id: "number-to-words", title: "Number to Words", description: "Convert numbers into written English words.", path: "/tools/number-to-words", keywords: ["number", "words", "spell out"] },
  { id: "age-calculator", title: "Age Calculator", description: "Calculate age from birthday with exact years, months, and days.", path: "/tools/age-calculator", keywords: ["age", "birthday", "years"] },
  { id: "date-diff", title: "Date Difference", description: "Measure the time between two dates in days, months, and years.", path: "/tools/date-diff", keywords: ["date", "difference", "interval"] },
  { id: "duration", title: "Time Duration", description: "Convert durations between seconds, minutes, and hours.", path: "/tools/duration", keywords: ["duration", "time", "seconds"] },
  { id: "percentage", title: "Percentage Calculator", description: "Calculate percentages for ratios, discounts, and growth rates.", path: "/tools/percentage", keywords: ["percentage", "percent", "ratio"] },
  { id: "gpa-calculator", title: "GPA Calculator", description: "Compute GPA from course grades and credit hours.", path: "/tools/gpa-calculator", keywords: ["gpa", "grades", "average"] },
  { id: "ai-formula-explainer", title: "AI Formula Explainer", description: "Break down math formulas into plain English meanings.", path: "/tools/ai-formula-explainer", keywords: ["formula", "explainer", "math"] },
];

export function getToolById(id: string) {
  return utilityTools.find((tool) => tool.id === id);
}

export function decimalToBinary(value: number) {
  return value.toString(2);
}

export function binaryToDecimal(value: string) {
  const clean = value.replace(/[^01]/g, "");
  return clean ? parseInt(clean, 2) : 0;
}

export function hexToRgb(hex: string) {
  const normalized = hex.trim().replace(/^#/, "");
  const expanded = normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized;
  if (!/^([0-9a-fA-F]{6})$/.test(expanded)) return null;
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number) {
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function toScientific(value: number) {
  return value.toExponential();
}

export function fromScientific(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

const unicodeMap: Record<string, string> = {};
for (let code = 32; code < 127; code += 1) {
  unicodeMap[String.fromCharCode(code)] = `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
}

export function charToUnicode(text: string) {
  return text.split("").map((char) => unicodeMap[char] ?? `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}`).join(" ");
}

export function unicodeToChar(text: string) {
  return text
    .split(/\s+/)
    .map((code) => {
      const normalized = code.replace(/^(?:U\+|u\+)/, "");
      const point = parseInt(normalized, 16);
      return Number.isFinite(point) ? String.fromCodePoint(point) : "";
    })
    .join("");
}

const morseMap: Record<string, string> = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....",
  i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-",
  r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-", "@": ".--.-." };
const reverseMorseMap = Object.entries(morseMap).reduce<Record<string, string>>((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

export function textToMorse(text: string) {
  return text
    .toLowerCase()
    .split("")
    .map((char) => morseMap[char] ?? "")
    .join(" ")
    .replace(/\s{2,}/g, " /");
}

export function morseToText(code: string) {
  return code
    .split(" ")
    .map((symbol) => reverseMorseMap[symbol] ?? (symbol === "/" ? " " : ""))
    .join("");
}

const words = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

export function numberToWords(num: number) {
  if (Number.isNaN(num) || !Number.isFinite(num)) return "Invalid number";
  if (num < 0) return `minus ${numberToWords(Math.abs(num))}`;
  if (num < 20) return words[num];
  if (num < 100) return `${tens[Math.floor(num / 10)]}${num % 10 ? `-${words[num % 10]}` : ""}`;
  if (num < 1000) return `${words[Math.floor(num / 100)]} hundred${num % 100 ? ` ${numberToWords(num % 100)}` : ""}`;
  if (num < 1000000) return `${numberToWords(Math.floor(num / 1000))} thousand${num % 1000 ? ` ${numberToWords(num % 1000)}` : ""}`;
  return num.toString();
}

export function calculateAge(birth: string) {
  const birthDate = new Date(birth);
  if (Number.isNaN(birthDate.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function dateDifference(start: string, end: string) {
  const from = new Date(start);
  const to = new Date(end);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
  const diff = Math.abs(to.getTime() - from.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export function durationToSeconds(value: string) {
  const parts = value.split(/[:\s]+/).map(Number).filter((n) => !Number.isNaN(n));
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

export function formatDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

export function calculatePercentage(base: number, percent: number) {
  return (base * percent) / 100;
}

export function calculateGPA(grades: Array<{ grade: string; credits: number }>) {
  const scale: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0, A+: 4, B+: 3.3, C+: 2.3, A-: 3.7, B-: 2.7, C-: 1.7, D+: 1.3, D-: 0.7 };
  let totalPoints = 0;
  let totalCredits = 0;
  grades.forEach(({ grade, credits }) => {
    const value = scale[grade.toUpperCase()] ?? 0;
    totalPoints += value * credits;
    totalCredits += credits;
  });
  return totalCredits === 0 ? null : totalPoints / totalCredits;
}

export function explainFormula(formula: string) {
  const symbols: Record<string, string> = {
    "+": "Addition — adds two values.",
    "-": "Subtraction — subtracts one value from another.",
    "*": "Multiplication — multiplies two values.",
    "/": "Division — divides one value by another.",
    "^": "Exponent — raises a value to the power of another.",
    "%": "Percentage — computes a proportion of 100.",
    "=": "Equals — assigns or compares values.",
    "(": "Open parenthesis — groups expressions.",
    ")": "Close parenthesis — ends a group.",
  };
  return formula
    .split("")
    .map((char) => symbols[char] ?? (/[0-9A-Za-z]/.test(char) ? `Symbol ${char}` : ""))
    .filter(Boolean)
    .join(" ");
}
