import type { ReactNode } from 'react';
import { Icon } from '../src';
import { parseToken, type Tok } from './tokens';

/* ------------------------------------------------------------- headings */
export function GroupHeader({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <header id={id} className="d-group">
      <span className="d-group__index">{index}</span>
      <h1 className="d-group__title">{title}</h1>
      <p className="d-group__lead">{children}</p>
    </header>
  );
}

export function Section({
  id,
  index,
  title,
  lead,
  meta,
  children,
}: {
  id: string;
  index: string;
  title: string;
  lead?: ReactNode;
  meta?: [string, ReactNode][];
  children: ReactNode;
}) {
  return (
    <section id={id} className="d-section" aria-labelledby={`${id}-h`}>
      <header className="d-section__header">
        <h2 id={`${id}-h`} className="d-h2">
          <span className="d-h2__index">{index}</span>
          {title}
        </h2>
        {lead && <p className="d-lead">{lead}</p>}
        {meta && (
          <dl className="d-meta">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>
      {children}
    </section>
  );
}

export function H3({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="d-h3wrap">
      <h3 className="d-h3">{children}</h3>
      {note && <p className="d-body d-subtle">{note}</p>}
    </div>
  );
}

/* ------------------------------------------------------------- specimen */
/** A live example on a neutral canvas with the code that produced it. */
export function Specimen({
  children,
  code,
  layout = 'row',
  surface = 'default',
  minHeight,
}: {
  children: ReactNode;
  code?: string;
  layout?: 'row' | 'column' | 'center';
  surface?: 'default' | 'sunken';
  minHeight?: string;
}) {
  return (
    <figure className="d-specimen">
      <div className={`d-specimen__canvas d-specimen__canvas--${layout}`} data-surface={surface} style={{ minHeight }}>
        {children}
      </div>
      {code && (
        <figcaption className="d-specimen__code">
          <code>{code}</code>
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------- token name */
export function TokenName({ name, size = 'small' }: { name: string; size?: 'small' | 'large' }) {
  const parts = parseToken(name);
  return (
    <code className={`d-tname d-tname--${size}`} aria-label={name}>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="d-tname__dot">.</span>}
          <span data-part={p.kind}>{p.text}</span>
        </span>
      ))}
    </code>
  );
}

/* ------------------------------------------------------------- token table */
export type Preview = 'color' | 'shadow' | 'space' | 'radius' | 'font' | 'none';

function PreviewCell({ t, preview }: { t: Tok; preview: Preview }) {
  switch (preview) {
    case 'color':
      return <span className="d-chip" style={{ background: `var(${t.cssVar})` }} />;
    case 'shadow':
      return <span className="d-chip d-chip--shadow" style={{ boxShadow: `var(${t.cssVar})` }} />;
    case 'space':
      return <span className="d-bar" style={{ width: `var(${t.cssVar})` }} />;
    case 'radius':
      return <span className="d-chip d-chip--radius" style={{ borderRadius: `var(${t.cssVar})` }} />;
    case 'font':
      return <span style={{ font: `var(${t.cssVar})` }}>Aa</span>;
    default:
      return null;
  }
}

const short = (v: unknown) => {
  const s = String(v);
  return s.length > 28 ? s.slice(0, 26) + '…' : s;
};

export function TokenTable({ tokens, preview = 'none', modes = false }: { tokens: Tok[]; preview?: Preview; modes?: boolean }) {
  return (
    <div className="d-tablewrap">
      <table className="d-table d-table--tokens">
        <thead>
          <tr>
            {preview !== 'none' && <th className="d-col-preview" aria-label="Preview" />}
            <th>Token</th>
            <th>CSS variable</th>
            {modes ? (
              <>
                <th>Light</th>
                <th>Dark</th>
              </>
            ) : (
              <th>Value</th>
            )}
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.name}>
              {preview !== 'none' && (
                <td className="d-col-preview">
                  <PreviewCell t={t} preview={preview} />
                </td>
              )}
              <td>
                <TokenName name={t.name} />
                {t.extension && <span className="d-ext" title="Added by Rovo DS, not part of ADS">extension</span>}
              </td>
              <td><code className="d-var">{t.cssVar}</code></td>
              {modes ? (
                <>
                  <td className="d-val">{short(t.light)}</td>
                  <td className="d-val">{short(t.dark)}</td>
                </>
              ) : (
                <td className="d-val" title={String(t.light)}>{short(t.light)}</td>
              )}
              <td className="d-desc">{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------- guidance */
export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="d-dodont">
      <div data-kind="do">
        <p className="d-dodont__title"><Icon name="check" /> Do</p>
        <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div data-kind="dont">
        <p className="d-dodont__title"><Icon name="cross" /> Don’t</p>
        <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="d-callout">{children}</div>;
}
