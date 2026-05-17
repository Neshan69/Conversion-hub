export function toRoman(num: number): string {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) {
    throw new Error('Number must be an integer between 1 and 3999');
  }

  const romanNumerals: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ];

  let result = '';
  let remainder = num;

  for (const [value, symbol] of romanNumerals) {
    while (remainder >= value) {
      result += symbol;
      remainder -= value;
    }
  }

  return result;
}

export function fromRoman(str: string): number {
  if (!str || !/^[IVXLCDM]+$/.test(str)) {
    throw new Error('Invalid Roman numeral');
  }

  const romanValues: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  };

  let total = 0;
  let prevValue = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    const currentValue = romanValues[str[i]];
    if (currentValue < prevValue) {
      total -= currentValue;
    } else {
      total += currentValue;
    }
    prevValue = currentValue;
  }

  // Validate by converting back
  if (toRoman(total) !== str.toUpperCase()) {
    throw new Error('Invalid Roman numeral');
  }

  return total;
}

export function isValidRoman(str: string): boolean {
  try {
    fromRoman(str);
    return true;
  } catch (e) {
    return false;
  }
}

export function getRomanNumeralMeaning(num: number): string {
  const values: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ];

  let remainder = num;
  const parts: string[] = [];

  for (const [value, symbol] of values) {
    const count = Math.floor(remainder / value);
    if (count > 0) {
      parts.push(`${symbol} (${value})${count > 1 ? ` × ${count}` : ''}`);
      remainder -= value * count;
    }
  }

  return parts.join(' + ');
}