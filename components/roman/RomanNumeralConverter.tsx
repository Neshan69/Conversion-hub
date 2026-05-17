"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Share2, Clock, Info, Star, History, Keyboard, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui/components";
import { fromRoman, getRomanNumeralMeaning, isValidRoman, toRoman } from "@/lib/roman-numeral";

interface HistoryItem {
  id: string;
  number: string;
  roman: string;
  timestamp: number;
  favorite: boolean;
}

interface RomanNumeralConverterProps {
  initialValue?: string;
}

const HISTORY_KEY = "conversion-hub-roman-history";
const FAVORITES_KEY = "conversion-hub-roman-favorites";

function normalizeRoman(value: string) {
  return value.toUpperCase().replace(/[^IVXLCDM]/g, "");
}

function createHistoryItem(number: string, roman: string): HistoryItem {
  return {
    id: `${number}-${roman}-${Date.now()}`,
    number,
    roman,
    timestamp: Date.now(),
    favorite: false,
  };
}

function formatTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export default function RomanNumeralConverter({ initialValue }: RomanNumeralConverterProps) {
  const numberRef = useRef<HTMLInputElement | null>(null);
  const romanRef = useRef<HTMLInputElement | null>(null);
  const [number, setNumber] = useState("");
  const [roman, setRoman] = useState("");
  const [error, setError] = useState("");
  const [meaning, setMeaning] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showClockGuides, setShowClockGuides] = useState(false);

  useEffect(() => {
    const storedHistory = typeof window !== "undefined" ? window.localStorage.getItem(HISTORY_KEY) : null;
    const storedFavorites = typeof window !== "undefined" ? window.localStorage.getItem(FAVORITES_KEY) : null;

    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        setHistory([]);
      }
    }

    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    if (initialValue) {
      const value = initialValue.trim();
      if (value) {
        if (!isNaN(Number(value))) {
          const num = Number(value);
          if (Number.isInteger(num) && num >= 1 && num <= 3999) {
            setNumber(num.toString());
            const romanResult = toRoman(num);
            setRoman(romanResult);
            setMeaning(getRomanNumeralMeaning(num));
          } else {
            setError("Please enter a valid integer between 1 and 3999");
          }
        } else if (isValidRoman(normalizeRoman(value))) {
          const normalized = normalizeRoman(value);
          const num = fromRoman(normalized);
          setRoman(normalized);
          setNumber(num.toString());
          setMeaning(getRomanNumeralMeaning(num));
        } else {
          setError("Invalid input. Please enter a number (1-3999) or valid Roman numeral");
        }
      }
    }
  }, [initialValue]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      switch (event.key.toLowerCase()) {
        case "1":
          event.preventDefault();
          numberRef.current?.focus();
          break;
        case "2":
          event.preventDefault();
          romanRef.current?.focus();
          break;
        case "h":
          event.preventDefault();
          setHistory([]);
          break;
        case "f":
          event.preventDefault();
          handleToggleFavorite();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [number, roman, favorites]);

  const currentFavorite = useMemo(() => favorites.includes(roman), [favorites, roman]);

  const updateHistory = (newNumber: string, newRoman: string) => {
    const item = createHistoryItem(newNumber, newRoman);
    setHistory((prev) => [item, ...prev.filter((entry) => entry.roman !== newRoman || entry.number !== newNumber)]);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumber(value);
    setError("");
    setMeaning("");

    if (value === "") {
      setRoman("");
      return;
    }

    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0 || num > 3999) {
      setRoman("");
      setError("Please enter a valid integer between 1 and 3999");
      return;
    }

    try {
      const romanResult = toRoman(num);
      setRoman(romanResult);
      setMeaning(getRomanNumeralMeaning(num));
      updateHistory(value, romanResult);
    } catch {
      setRoman("");
      setError("Conversion error");
    }
  };

  const handleRomanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeRoman(e.target.value);
    setRoman(value);
    setError("");
    setMeaning("");

    if (value === "") {
      setNumber("");
      return;
    }

    if (!isValidRoman(value)) {
      setNumber("");
      setError("Invalid Roman numeral");
      return;
    }

    try {
      const numResult = fromRoman(value);
      setNumber(numResult.toString());
      setMeaning(getRomanNumeralMeaning(numResult));
      updateHistory(numResult.toString(), value);
    } catch {
      setNumber("");
      setError("Conversion error");
    }
  };

  const handleCopyNumber = async () => {
    if (number) {
      await navigator.clipboard.writeText(number);
    }
  };

  const handleCopyRoman = async () => {
    if (roman) {
      await navigator.clipboard.writeText(roman);
    }
  };

  const handleShare = async () => {
    if (number && roman) {
      const text = `${number} = ${roman}`;
      try {
        await navigator.share({ title: "Roman Numeral Conversion", text });
      } catch {
        await navigator.clipboard.writeText(text);
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!roman || !number) return;
    setFavorites((prev) =>
      prev.includes(roman) ? prev.filter((value) => value !== roman) : [...prev, roman]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/70 backdrop-blur-xl border border-border/70 rounded-[2rem] p-6 md:p-8 shadow-2xl"
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-3xl tracking-tight font-semibold text-foreground flex items-center gap-3">
              <Info className="w-6 h-6 text-primary" /> Roman Numeral Converter
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Instant two-way conversion for Roman numerals and numbers. Includes history, favorites, live validation, and keyboard shortcuts.
            </p>
          </div>
          <div className="inline-flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={handleToggleFavorite} disabled={!roman || !number}>
              <Star className="w-4 h-4" /> {currentFavorite ? "Unfavorite" : "Favorite"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowClockGuides((prev) => !prev)}>
              <Sparkles className="w-4 h-4" /> {showClockGuides ? "Hide Clock Mode" : "Show Clock Mode"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Number</label>
              <Input
                ref={numberRef}
                type="number"
                min={1}
                max={3999}
                value={number}
                onChange={handleNumberChange}
                placeholder="Enter a number between 1 and 3999"
                className="w-full"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyNumber} disabled={!number}>
              <Copy className="w-4 h-4" /> Copy
            </Button>
          </div>

          {number && !error && (
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground">Roman result</p>
              <p className="mt-2 text-4xl font-semibold text-primary tracking-wide">{roman}</p>
              {meaning && (
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  {meaning}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Roman Numeral</label>
              <Input
                ref={romanRef}
                type="text"
                inputMode="text"
                value={roman}
                onChange={handleRomanChange}
                placeholder="Enter Roman numerals (e.g. XIV)"
                className="w-full uppercase"
                spellCheck={false}
                autoCapitalize="characters"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={handleCopyRoman} disabled={!roman}>
              <Copy className="w-4 h-4" /> Copy
            </Button>
          </div>

          {roman && !error && (
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground">Numeric result</p>
              <p className="mt-2 text-4xl font-semibold text-primary tracking-wide">{number}</p>
              <div className="mt-4 rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Roman rules summary</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000</li>
                  <li>Subtraction is only allowed with I, X, and C before larger symbols.</li>
                  <li>Do not repeat V, L, or D consecutively.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-border/80 bg-background/80 p-5 shadow-inner shadow-slate-900/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Live Tools</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use keyboard shortcuts: Ctrl/Cmd+1 focus number, Ctrl/Cmd+2 focus roman, Ctrl/Cmd+F favorite, Ctrl/Cmd+H clear history.
                </p>
              </div>
              <Keyboard className="w-5 h-5 text-primary" />
            </div>

            <div className="mt-5 rounded-3xl border border-border/60 bg-card/80 p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-amber-400" />
                <span>{currentFavorite ? "Added to favorites" : "Add your current conversion to favorites"}</span>
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-3xl bg-background/80 p-4 border border-border/50">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">History</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{history.length}</p>
                </div>
                <div className="rounded-3xl bg-background/80 p-4 border border-border/50">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Favorites</p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{favorites.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Roman Clock Preview</p>
                <p className="mt-1 text-xs text-muted-foreground">A modern analog dial with Roman numerals and second-hand animation.</p>
              </div>
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <RomanClock />
          </div>

          {showClockGuides && (
            <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Roman Clock Mode</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This clock uses Roman numerals I through XII on an analog dial. It is ideal for tattoo design previews and historical-style time displays.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-border/70 bg-card/80 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Share your conversion</p>
            <p className="text-sm text-muted-foreground mt-1">Share instantly or copy the result for notes and tattoo ideas.</p>
          </div>
          <Button variant="default" size="md" onClick={handleShare} disabled={!number || !roman}>
            <Share2 className="w-4 h-4" /> Share Conversion
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Conversion History</h3>
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your recent Roman conversions will appear here.</p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 6).map((entry) => (
                <div key={entry.id} className="rounded-3xl border border-border/60 bg-background/70 p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.number} → {entry.roman}</p>
                    <p className="text-xs text-muted-foreground">{formatTimestamp(entry.timestamp)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {favorites.includes(entry.roman) && <Star className="w-4 h-4 text-amber-400" />}
                    <Button variant="ghost" size="sm" onClick={() => {
                      setNumber(entry.number);
                      setRoman(entry.roman);
                      setMeaning(getRomanNumeralMeaning(Number(entry.number)));
                    }}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">Favorite Numerals</h3>
          </div>
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground">Mark a conversion as favorite to pin it here.</p>
          ) : (
            <div className="grid gap-3">
              {favorites.map((item) => (
                <div key={item} className="rounded-3xl border border-border/50 bg-background/60 p-4 flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground font-medium">{item}</span>
                  <Button variant="ghost" size="sm" onClick={() => setFavorites((prev) => prev.filter((value) => value !== item))}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RomanClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handle = requestAnimationFrame(function tick() {
      setTime(new Date());
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;
  const secondRotation = seconds * 6;
  const minuteRotation = minutes * 6 + seconds * 0.1;
  const hourRotation = hours * 30 + minutes * 0.5;
  const romanHours = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

  return (
    <div className="relative mx-auto mt-6 h-80 w-80 max-w-full rounded-[2rem] border border-border/50 bg-background/90 p-6 shadow-xl shadow-primary/10 sm:h-64 sm:w-64">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-full w-full rounded-full border border-border/60 bg-card/80">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_35%)]" />
          {romanHours.map((label, index) => {
            const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
            return (
              <div
                key={label}
                className="absolute left-1/2 top-1/2 text-xs font-semibold text-muted-foreground"
                style={{
                  transform: `translate(-50%, -50%) translate(${Math.cos(angle) * 37}%, ${Math.sin(angle) * 37}%)`,
                }}
              >
                {label}
              </div>
            );
          })}
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/30" />
          <div className="absolute left-1/2 top-1/2 h-[2px] w-24 -translate-x-1/2 rounded-full bg-foreground/80" style={{ transform: `rotate(${hourRotation}deg)` }} />
          <div className="absolute left-1/2 top-1/2 h-[2px] w-28 -translate-x-1/2 rounded-full bg-secondary/90" style={{ transform: `rotate(${minuteRotation}deg)` }} />
          <div className="absolute left-1/2 top-1/2 h-[1px] w-32 -translate-x-1/2 rounded-full bg-accent/80" style={{ transform: `rotate(${secondRotation}deg)` }} />
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-background/95 px-4 py-2 text-center text-xs text-muted-foreground shadow-lg shadow-slate-950/10">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
    </div>
  );
}
