export type Segment = { text: string; flagIndex: number | null };

// Splits a message into plain and flagged segments using exact substrings.
export function highlightSegments(message: string, phrases: string[]): Segment[] {
  const ranges: { start: number; end: number; idx: number }[] = [];
  phrases.forEach((p, idx) => {
    if (!p) return;
    const start = message.indexOf(p);
    if (start === -1) return;
    const end = start + p.length;
    if (ranges.some((r) => start < r.end && end > r.start)) return;
    ranges.push({ start, end, idx });
  });
  ranges.sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start > pos) out.push({ text: message.slice(pos, r.start), flagIndex: null });
    out.push({ text: message.slice(r.start, r.end), flagIndex: r.idx });
    pos = r.end;
  }
  if (pos < message.length) out.push({ text: message.slice(pos), flagIndex: null });
  return out;
}
