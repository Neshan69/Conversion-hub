"use client";

import { useState } from "react";

function computeLoveScore(a: string, b: string) {
  const seed = a.trim().toLowerCase() + '|' + b.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const score = Math.abs(hash) % 101; // 0-100
  return score;
}

export function LoveCalculator() {
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const calculate = () => {
    if (!nameA.trim() || !nameB.trim()) return;
    setScore(computeLoveScore(nameA, nameB));
  };

  const message = (s: number) => {
    if (s > 90) return "A legendary match! 💖";
    if (s > 75) return "A very strong bond! 💕";
    if (s > 50) return "There's potential — take it slow. 🌱";
    if (s > 30) return "You might need to work on compatibility. 🤝";
    return "Interesting mix — opposite attracts sometimes! ✨";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-muted-foreground">Name A</label>
            <input value={nameA} onChange={(e) => setNameA(e.target.value)} className="w-full mt-1 p-2 rounded-md border bg-background" placeholder="Alice" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Name B</label>
            <input value={nameB} onChange={(e) => setNameB(e.target.value)} className="w-full mt-1 p-2 rounded-md border bg-background" placeholder="Bob" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={calculate} className="px-3 py-2 rounded-lg bg-primary text-white">Check</button>
          <button onClick={() => { setNameA(''); setNameB(''); setScore(null); }} className="px-3 py-2 rounded-lg border">Reset</button>
        </div>

        <div className="mt-4">
          {score === null ? (
            <p className="text-muted-foreground">Enter two names and press Check.</p>
          ) : (
            <div>
              <p className="text-2xl font-bold">{score}%</p>
              <p className="mt-2 text-sm text-muted-foreground">{message(score)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
