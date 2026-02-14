import { commonWords } from './wordlist.en';

export function getRhymeSuggestions(word: string, maxResults: number = 15): string[] {
  const normalized = word.toLowerCase().trim();
  if (normalized.length < 2) return [];

  const ending = normalized.slice(-2);
  const longerEnding = normalized.length >= 3 ? normalized.slice(-3) : '';

  const matches = commonWords.filter((w) => {
    if (w === normalized) return false;
    const wLower = w.toLowerCase();
    if (longerEnding && wLower.endsWith(longerEnding)) return true;
    return wLower.endsWith(ending);
  });

  return matches.slice(0, maxResults);
}
