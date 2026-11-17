import { useEffect, useState } from 'react';

export type ClassValue = string | false | null | undefined;
export const cx = (...c: ClassValue[]) => c.filter(Boolean).join(' ');

/** Mirrors the OS "reduce motion" preference. Components use it to stop JS-driven loops. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Word-level diff (LCS) used by suggested edits. Fine for paragraph-sized text. */
export type DiffPart = { type: 'same' | 'added' | 'removed'; text: string };
export function diffWords(before: string, after: string): DiffPart[] {
  const a = before.split(/(\s+)/);
  const b = after.split(/(\s+)/);
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffPart[] = [];
  const push = (type: DiffPart['type'], text: string) => {
    const last = out[out.length - 1];
    if (last && last.type === type) last.text += text;
    else out.push({ type, text });
  };
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) { push('same', a[i]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) push('removed', a[i++]);
    else push('added', b[j++]);
  }
  while (i < m) push('removed', a[i++]);
  while (j < n) push('added', b[j++]);
  return groupChanges(out);
}

/** Merge interleaved edits ("-we +To -get +keep") into phrase-level blocks ("-we need to get +To keep"). */
function groupChanges(parts: DiffPart[]): DiffPart[] {
  const res: DiffPart[] = [];
  let k = 0;
  while (k < parts.length) {
    if (parts[k].type === 'same') { res.push(parts[k++]); continue; }
    let removed = '';
    let added = '';
    while (k < parts.length && (parts[k].type !== 'same' || (/^\s+$/.test(parts[k].text) && parts[k + 1] && parts[k + 1].type !== 'same'))) {
      const p = parts[k++];
      if (p.type === 'removed') removed += p.text;
      else if (p.type === 'added') added += p.text;
      else { removed += p.text; added += p.text; }
    }
    if (removed.trim()) res.push({ type: 'removed', text: removed.trimEnd() });
    if (removed.trim() && added.trim()) res.push({ type: 'same', text: ' ' });
    if (added.trim()) res.push({ type: 'added', text: added.trimEnd() });
    const tail = (removed.trim() ? removed : added).match(/\s+$/);
    if (tail) res.push({ type: 'same', text: tail[0] });
  }
  return res;
}
