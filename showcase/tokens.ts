import tokenData from '../dist/json/tokens.json';

export type Tok = {
  name: string;
  cssVar: string;
  type: string;
  description: string;
  extension: boolean;
  light: unknown;
  dark: unknown;
};

export const tokens = tokenData.tokens as Tok[];
export const byPrefix = (prefix: string) => tokens.filter((t) => t.name === prefix || t.name.startsWith(prefix + '.'));
export const find = (name: string) => tokens.find((t) => t.name === name);

/* ------------------------------------------------------------------ naming */
export type PartKind = 'foundation' | 'namespace' | 'property' | 'modifier';
export type Part = { kind: PartKind; text: string };

/** Foundations whose second segment is a property. The others go straight to a modifier (space.200, radius.large). */
export const FOUNDATIONS_WITH_PROPERTY = new Set(['color', 'elevation', 'font', 'border', 'motion']);

export function parseToken(name: string): Part[] {
  const segs = name.split('.');
  const parts: Part[] = [{ kind: 'foundation', text: segs[0] }];
  let i = 1;
  if (segs[i] === 'rovo' && segs.length > 2) {
    parts.push({ kind: 'namespace', text: 'rovo' });
    i++;
  }
  if (FOUNDATIONS_WITH_PROPERTY.has(segs[0]) && i < segs.length) {
    parts.push({ kind: 'property', text: segs[i] });
    i++;
  }
  if (i < segs.length) parts.push({ kind: 'modifier', text: segs.slice(i).join('.') });
  return parts;
}

export const PART_LABEL: Record<PartKind, string> = {
  foundation: 'Foundation',
  namespace: 'Namespace',
  property: 'Property',
  modifier: 'Modifier',
};

export const FOUNDATION_ORDER = ['color', 'elevation', 'font', 'space', 'radius', 'border', 'motion', 'opacity', 'layer', 'breakpoint'];

export const FOUNDATION_PURPOSE: Record<string, string> = {
  color: 'Text, icon, border and background color',
  elevation: 'Surfaces and the shadows that lift them',
  font: 'Composite type styles, families and weights',
  space: 'Padding, gaps and margins on an 8px grid',
  radius: 'Corner rounding',
  border: 'Border widths',
  motion: 'Durations and easing curves',
  opacity: 'Disabled and loading transparency',
  layer: 'Stacking order (z-index)',
  breakpoint: 'Viewport widths for layout changes',
};
