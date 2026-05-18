"use client";

import { useEffect, useRef, useState } from "react";

export function BasicCalculator() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | number>("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("calculator-basic-history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("calculator-basic-history", JSON.stringify(history.slice(0, 50)));
    } catch {}
  }, [history]);

  const append = (v: string) => setExpr((s) => s + v);
  const clear = () => {
    setExpr("");
    setResult("");
  };
  const back = () => setExpr((s) => s.slice(0, -1));

  const evaluate = () => {
    try {
      // safe-eval: allow only numbers and math operators
      if (!/^[0-9+\-*/(). %eE]+$/.test(expr)) {
        setResult("Invalid expression");
        return;
      }
      // eslint-disable-next-line no-eval
      const val = eval(expr);
      setResult(val);
      setHistory((h) => [`${expr} = ${val}`, ...h]);
    } catch (err) {
      setResult("Error");
    }
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(String(result));
    } catch {}
  };

  const handleKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.tagName === "INPUT") return;
    if (e.key === "Enter") evaluate();
    else if (e.key === "Backspace") back();
    else if (/^[0-9+\-*/().]$/.test(e.key)) append(e.key);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expr]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <input
          ref={inputRef}
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          className="w-full bg-transparent outline-none text-2xl font-mono"
          placeholder="Enter expression"
          aria-label="Calculator input"
        />
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Result:</div>
          <div className="text-xl font-semibold">{String(result)}</div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","%","+"].map((k)=> (
            <button key={k} onClick={() => append(k)} className="py-3 rounded-lg bg-accent/5 hover:bg-accent/10">{k}</button>
          ))}
          <button onClick={clear} className="col-span-2 py-3 rounded-lg bg-red-500 text-white">C</button>
          <button onClick={back} className="py-3 rounded-lg bg-yellow-400">DEL</button>
          <button onClick={evaluate} className="col-span-2 py-3 rounded-lg bg-primary text-white">=</button>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={copyResult} className="px-3 py-2 rounded-lg border">Copy</button>
          <button onClick={() => { setHistory([]); localStorage.removeItem('calculator-basic-history'); }} className="px-3 py-2 rounded-lg border">Clear History</button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">History</h4>
        <div className="space-y-2 max-h-48 overflow-auto">
          {history.length === 0 ? <div className="text-muted-foreground">No history yet.</div> : history.map((h, idx) => (
            <div key={idx} className="p-2 rounded-md bg-background/60 border">{h}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
