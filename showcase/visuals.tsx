import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../src';
import { find } from './tokens';

/* ================================================================== Annotated
 * Pins token chips (or numbered markers) to points on a live example with leader lines,
 * the way ADS documents anatomy. Positions are percentages of the example's box.
 */
export type Callout = {
  /** A token name (rendered with its swatch) or a short label / number. */
  label: string;
  side: 'top' | 'bottom' | 'left' | 'right';
  /** Position along that side, e.g. '30%'. */
  at: string;
  /** Leader length. */
  length?: number;
  /** How far inside the edge the leader ends (to point at something inside the element). */
  inset?: number;
};

function Chip({ label }: { label: string }) {
  const t = find(label);
  if (/^\d+$/.test(label)) return <span className="v-num">{label}</span>;
  return (
    <span className="v-chip">
      {t && t.type === 'color' && <span className="v-chip__swatch" style={{ background: `var(${t.cssVar})` }} />}
      <code>{label}</code>
    </span>
  );
}

export function Annotated({ callouts, children, zoom = 1 }: { callouts: Callout[]; children: ReactNode; zoom?: number }) {
  return (
    <div className="v-annotated">
      <div className="v-annotated__target" style={{ zoom } as CSSProperties}>
        {children}
      </div>
      <div className="v-annotated__layer" aria-hidden="true">
        {callouts.map((c, i) => {
          const len = c.length ?? 40;
          const inset = c.inset ?? 0;
          const style: CSSProperties =
            c.side === 'top' ? { left: c.at, bottom: `calc(100% - ${inset}px)` }
            : c.side === 'bottom' ? { left: c.at, top: `calc(100% - ${inset}px)` }
            : c.side === 'left' ? { top: c.at, right: `calc(100% - ${inset}px)` }
            : { top: c.at, left: `calc(100% - ${inset}px)` };
          return (
            <span key={i} className="v-callout" data-side={c.side} style={{ ...style, '--len': `${len + inset}px` } as CSSProperties}>
              <span className="v-callout__line" />
              <span className="v-callout__dot" />
              <Chip label={c.label} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== Visual do / don't */
export type Guidance = { kind: 'do' | 'dont'; example: ReactNode; text: string };

export function VisualDoDont({ items }: { items: Guidance[] }) {
  return (
    <div className="v-dd">
      {items.map((g, i) => (
        <figure key={i} className="v-dd__card" data-kind={g.kind}>
          <div className="v-dd__canvas">{g.example}</div>
          <figcaption className="v-dd__caption">
            <span className="v-dd__title">
              <span className="v-dd__badge"><Icon name={g.kind === 'do' ? 'check' : 'cross'} /></span>
              {g.kind === 'do' ? 'Do' : 'Don’t'}
            </span>
            <span className="v-dd__text">{g.text}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ================================================================== Wrong-on-purpose examples */
/** A blended gradient border — the thing ADS says not to do. */
export function BlendedBorder({ children }: { children?: ReactNode }) {
  return <div className="v-blended">{children}</div>;
}
