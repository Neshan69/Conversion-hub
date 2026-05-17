"use client";

import { useState, useEffect } from 'react';
import { toRoman, fromRoman, isValidRoman, getRomanNumeralMeaning } from '@/lib/roman-numeral';
import { motion } from 'framer-motion';
import { Input, Button } from '@/components/ui/components';
import { Copy, Share2, Clock, Info } from 'lucide-react';

interface RomanNumeralConverterProps {
  initialValue?: string;
}

export default function RomanNumeralConverter({ initialValue }: RomanNumeralConverterProps) {
  const [number, setNumber] = useState('');
  const [roman, setRoman] = useState('');
  const [error, setError] = useState('');
  const [meaning, setMeaning] = useState('');

  // Initialize from initialValue prop
  useEffect(() => {
    if (initialValue) {
      const value = initialValue.trim();
      if (value) {
        // Check if it's a number
        if (!isNaN(Number(value))) {
          const num = Number(value);
          if (Number.isInteger(num) && num >= 1 && num <= 3999) {
            setNumber(num.toString());
            try {
              const romanResult = toRoman(num);
              setRoman(romanResult);
              setMeaning(getRomanNumeralMeaning(num));
            } catch (err) {
              setError('Conversion error');
            }
          } else {
            setError('Please enter a valid integer between 1 and 3999');
          }
        } 
        // Check if it's a Roman numeral
        else if (isValidRoman(value.toUpperCase())) {
          const num = fromRoman(value.toUpperCase());
          setRoman(value.toUpperCase());
          setNumber(num.toString());
          setMeaning(getRomanNumeralMeaning(num));
        } else {
          setError('Invalid input. Please enter a number (1-3999) or valid Roman numeral');
        }
      }
    }
  }, [initialValue]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumber(value);
    setError('');
    setMeaning('');
    
    if (value === '') {
      setRoman('');
      return;
    }
    
    const num = parseInt(value);
    if (isNaN(num) || num <= 0 || num > 3999 || !Number.isInteger(num)) {
      setRoman('');
      setError('Please enter a valid integer between 1 and 3999');
      return;
    }
    
    try {
      const romanResult = toRoman(num);
      setRoman(romanResult);
      setMeaning(getRomanNumeralMeaning(num));
    } catch (err) {
      setRoman('');
      setError('Conversion error');
    }
  };

  const handleRomanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setRoman(value);
    setError('');
    setMeaning('');
    
    if (value === '') {
      setNumber('');
      return;
    }
    
    if (!isValidRoman(value)) {
      setNumber('');
      setError('Invalid Roman numeral');
      return;
    }
    
    try {
      const numResult = fromRoman(value);
      setNumber(numResult.toString());
      setMeaning(getRomanNumeralMeaning(numResult));
    } catch (err) {
      setNumber('');
      setError('Conversion error');
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
        await navigator.share({ title: 'Roman Numeral Conversion', text });
      } catch (err) {
        // Fallback to copy
        await navigator.clipboard.writeText(text);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/70 backdrop-blur-xl border border-border/70 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" /> Roman Numeral Converter
        </h2>
        <p className="text-muted-foreground">
          Convert between numbers and Roman numerals instantly. Supports numbers 1-3999.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Number to Roman */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">Number</label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={number}
              onChange={handleNumberChange}
              placeholder="Enter a number (1-3999)"
              className="flex-1 min-w-0"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyNumber} 
              disabled={!number}
              className="h-10 w-10 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {number && !error && (
            <div className="mt-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-muted-foreground">In Roman numerals:</p>
              <p className="text-2xl font-bold text-primary mb-2">{roman}</p>
              {meaning && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <p className="mb-1">Breakdown:</p>
                  <p className="whitespace-pre-wrap">{meaning}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Roman to Number */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">Roman Numeral</label>
          <div className="flex items-center gap-3">
            <Input
              type="text"
              value={roman}
              onChange={handleRomanChange}
              placeholder="Enter Roman numerals (e.g., XIV)"
              className="flex-1 min-w-0"
              spellCheck={false}
              autoCapitalize="characters"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyRoman} 
              disabled={!roman}
              className="h-10 w-10 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {roman && !error && (
            <div className="mt-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-muted-foreground">As a number:</p>
              <p className="text-2xl font-bold text-primary">{number}</p>
              {meaning && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <p className="mb-1">Breakdown:</p>
                  <p className="whitespace-pre-wrap">{meaning}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="md" 
          onClick={handleShare}
          className="w-full"
        >
          <Share2 className="mr-2 w-4 h-4" /> Share Conversion
        </Button>
      </div>

      {/* Educational Content */}
      <div className="mt-8 pt-6 border-t border-border/50">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" /> About Roman Numerals
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Basic Symbols</h4>
            <p className="text-sm text-muted-foreground">
              I = 1&nbsp;&bull;&nbsp; V = 5&nbsp;&bull;&nbsp; X = 10&nbsp;&bull;&nbsp; L = 50&nbsp;&bull;&nbsp; C = 100&nbsp;&bull;&nbsp; D = 500&nbsp;&bull;&nbsp; M = 1000
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Key Rules</h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Symbols are added together when placed in descending order (e.g., XVI = 10+5+1 = 16)</li>
              <li>When a smaller symbol precedes a larger symbol, it is subtracted (e.g., IV = 5-1 = 4)</li>
              <li>Only I, X, and C can be used for subtraction</li>
              <li>The same symbol cannot be repeated more than three times in a row</li>
              <li>V, L, and D are never subtracted</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Examples</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>4 = IV</p>
                <p>9 = IX</p>
                <p>40 = XL</p>
                <p>90 = XC</p>
                <p>400 = CD</p>
                <p>900 = CM</p>
              </div>
              <div>
                <p>2025 = MMXXV</p>
                <p>1999 = MCMXCIX</p>
                <p>3999 = MMMCMXCIX</p>
                <p>16 = XVI</p>
                <p>29 = XXIX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}