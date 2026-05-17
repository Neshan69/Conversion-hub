"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@/components/ui/components";
import {
  binaryToDecimal,
  calculateAge,
  calculateGPA,
  calculatePercentage,
  charToUnicode,
  dateDifference,
  decimalToBinary,
  explainFormula,
  formatDuration,
  fromScientific,
  getToolById,
  hexToRgb,
  morseToText,
  numberToWords,
  rgbToHex,
  textToMorse,
  toScientific,
  durationToSeconds,
} from "@/lib/tools";

interface ToolPageClientProps {
  toolId: string;
}

export function ToolPageClient({ toolId }: ToolPageClientProps) {
  const tool = getToolById(toolId);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [result, setResult] = useState<string>("");

  const handleRender = () => {
    if (!tool) return;
    switch (tool.id) {
      case "binary-decimal": {
        const onlyDigits = inputA.replace(/[^0-9]/g, "");
        const onlyBinary = inputB.replace(/[^01]/g, "");
        setInputA(onlyDigits);
        setInputB(onlyBinary);
        setResult(`Decimal: ${onlyDigits ? Number(onlyDigits) : 0}, Binary: ${onlyBinary ? decimalToBinary(Number(onlyDigits || "0")) : ""}`);
        break;
      }
      case "hex-rgb": {
        const hex = inputA.trim();
        const rgb = hexToRgb(hex);
        if (rgb) {
          setResult(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        } else {
          const values = inputB.split(/[,\s]+/).map(Number);
          if (values.length === 3) {
            setResult(rgbToHex(values[0], values[1], values[2]));
          } else {
            setResult("Enter a valid hex or RGB triple.");
          }
        }
        break;
      }
      case "scientific-notation": {
        const value = Number(inputA);
        if (!Number.isNaN(value)) {
          setResult(toScientific(value));
        } else {
          const parsed = fromScientific(inputB);
          setResult(Number.isNaN(parsed) ? "Enter a valid scientific expression." : parsed.toString());
        }
        break;
      }
      case "unicode": {
        setResult(inputA ? charToUnicode(inputA) : unicodeToChars(inputB));
        break;
      }
      case "morse-code": {
        if (inputA) setResult(textToMorse(inputA));
        else setResult(morseToText(inputB));
        break;
      }
      case "number-to-words": {
        const value = Number(inputA);
        setResult(Number.isNaN(value) ? "Enter a valid number." : numberToWords(value));
        break;
      }
      case "age-calculator": {
        const age = calculateAge(inputA);
        setResult(age ? `${age.years} years, ${age.months} months, ${age.days} days` : "Enter a valid birth date.");
        break;
      }
      case "date-diff": {
        const diff = dateDifference(inputA, inputB);
        setResult(diff ? `${diff.days} days, ${diff.hours} hours, ${diff.minutes} minutes, ${diff.seconds} seconds` : "Enter valid dates.");
        break;
      }
      case "duration": {
        const seconds = durationToSeconds(inputA || inputB);
        setResult(formatDuration(seconds));
        break;
      }
      case "percentage": {
        const base = Number(inputA);
        const percent = Number(inputB);
        setResult(Number.isNaN(base) || Number.isNaN(percent) ? "Enter values." : `${calculatePercentage(base, percent)} (${percent}% of ${base})`);
        break;
      }
      case "gpa-calculator": {
        const entries = inputA
          .split(/\n|,|;/)
          .map((row) => row.trim())
          .filter(Boolean)
          .map((row) => {
            const parts = row.split(/\s+/);
            return { grade: parts[0], credits: Number(parts[1]) || 0 };
          });
        const gpa = calculateGPA(entries);
        setResult(gpa === null ? "Enter at least one grade with credits." : `GPA: ${gpa.toFixed(2)}`);
        break;
      }
      case "ai-formula-explainer": {
        setResult(inputA ? explainFormula(inputA) : "Enter a formula like a+b=c.");
        break;
      }
      default:
        setResult("");
    }
  };

  const toolIntro = tool?.description ?? "Utility tool";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-muted-foreground">Utility tool</p>
          <h1 className="text-3xl font-semibold text-foreground">{tool?.title}</h1>
          <p className="text-sm leading-7 text-muted-foreground">{toolIntro}</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-2xl shadow-slate-950/5">
        <div className="grid gap-6">
          {renderToolInputs(toolId, inputA, inputB, setInputA, setInputB)}
          <Button variant="default" size="md" onClick={handleRender}>
            Calculate
          </Button>
          <div className="rounded-3xl border border-border/60 bg-background/90 p-5">
            <p className="text-sm font-medium text-muted-foreground">Result</p>
            <p className="mt-3 text-lg text-foreground whitespace-pre-wrap">{result || "Results will appear here."}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function renderToolInputs(toolId: string, inputA: string, inputB: string, setInputA: (value: string) => void, setInputB: (value: string) => void) {
  switch (toolId) {
    case "binary-decimal":
      return (
        <>
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Decimal input" placeholder="Enter a decimal number" />
          <Input value={inputB} onChange={(e) => setInputB(e.target.value)} label="Binary input" placeholder="Enter a binary string" />
        </>
      );
    case "hex-rgb":
      return (
        <>
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Hex input" placeholder="#1A73E8" />
          <Input value={inputB} onChange={(e) => setInputB(e.target.value)} label="RGB input" placeholder="255 115 0" />
        </>
      );
    case "scientific-notation":
      return (
        <>
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Decimal input" placeholder="123456" />
          <Input value={inputB} onChange={(e) => setInputB(e.target.value)} label="Scientific input" placeholder="1.23e5" />
        </>
      );
    case "unicode":
      return (
        <>
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Text input" placeholder="Hello" />
          <Input value={inputB} onChange={(e) => setInputB(e.target.value)} label="Unicode input" placeholder="U+0048 U+0065" />
        </>
      );
    case "morse-code":
      return (
        <>
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Text to Morse" placeholder="SOS" />
          <Input value={inputB} onChange={(e) => setInputB(e.target.value)} label="Morse to text" placeholder="... --- ..." />
        </>
      );
    case "number-to-words":
      return <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Number" placeholder="2025" />;
    case "age-calculator":
      return <Input type="date" value={inputA} onChange={(e) => setInputA(e.target.value)} label="Birthday" />;
    case "date-diff":
      return (
        <>
          <Input type="date" value={inputA} onChange={(e) => setInputA(e.target.value)} label="Start date" />
          <Input type="date" value={inputB} onChange={(e) => setInputB(e.target.value)} label="End date" />
        </>
      );
    case "duration":
      return <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Duration" placeholder="HH MM SS or seconds" />;
    case "percentage":
      return (
        <>
          <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Base value" placeholder="100" />
          <Input value={inputB} onChange={(e) => setInputB(e.target.value)} label="Percent" placeholder="15" />
        </>
      );
    case "gpa-calculator":
      return (
        <Input
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          label="Grades and credits"
          placeholder="A 4, B+ 3, C 2"
        />
      );
    case "ai-formula-explainer":
      return <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Formula" placeholder="a+b=c" />;
    default:
      return <Input value={inputA} onChange={(e) => setInputA(e.target.value)} label="Input" placeholder="Enter values" />;
  }
}

function unicodeToChars(value: string) {
  return value
    .split(/\s+/)
    .map((code) => {
      const cleaned = code.replace(/^(?:U\+|u\+)/, "");
      const point = parseInt(cleaned, 16);
      return Number.isFinite(point) ? String.fromCodePoint(point) : "";
    })
    .join("");
}
