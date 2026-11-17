import { useMemo, useState } from 'react';
import { Callout, H3, Section, TokenName } from './doc';
import { FOUNDATION_ORDER, FOUNDATION_PURPOSE, FOUNDATIONS_WITH_PROPERTY, PART_LABEL, parseToken, tokens, type PartKind } from './tokens';

/* --------------------------------------------------------------- anatomy */
const PART_INFO: Record<PartKind, { question: string; required: string; values: string }> = {
  foundation: { question: 'What kind of style?', required: 'Always', values: 'color · elevation · font · space · radius · border · motion · opacity · layer · breakpoint' },
  namespace: { question: 'Which product dialect?', required: 'Optional', values: 'rovo, only for styling that exists in AI moments' },
  property: { question: 'Which part of the UI?', required: 'Only for color, elevation, font, border and motion', values: 'text · icon · border · background · surface · shadow · heading · body · duration · easing' },
  modifier: { question: 'Which use, how loud, which state?', required: 'Optional', values: 'role → emphasis → state, or a scale step' },
};

function Anatomy() {
  const name = 'color.background.danger.bold.hovered';
  const parts = parseToken(name);
  const kinds: PartKind[] = ['foundation', 'namespace', 'property', 'modifier'];
  return (
    <figure className="n-hero">
      <div className="n-hero__name" aria-label={name}>
        {parts.map((p, i) => (
          <span key={i}>
            {i > 0 && <span className="n-hero__dot">.</span>}
            <span className="n-hero__seg" data-part={p.kind}>{p.text}</span>
          </span>
        ))}
      </div>
      <div className="n-hero__parts">
        {kinds.map((k) => {
          const inExample = parts.find((p) => p.kind === k);
          return (
            <div key={k} className="n-card" data-part={k} data-absent={!inExample || undefined}>
              <p className="n-card__label">{PART_LABEL[k]}</p>
              <p className="n-card__question">{PART_INFO[k].question}</p>
              <p className="n-card__example"><code>{inExample ? inExample.text : 'not used here'}</code></p>
              <dl className="n-card__meta">
                <div><dt>Required</dt><dd>{PART_INFO[k].required}</dd></div>
                <div><dt>Values</dt><dd>{PART_INFO[k].values}</dd></div>
              </dl>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

const SHAPES: [string, string, string][] = [
  ['Full', 'color.background.danger.bold.hovered', 'Role, emphasis and state all apply.'],
  ['Default', 'color.text', 'No modifier means the default for that property.'],
  ['Scale', 'space.200', 'Scale foundations have no property.'],
  ['Namespaced', 'color.rovo.border.purple', 'Rovo-only tokens add rovo after the foundation.'],
];

function Shapes() {
  const kinds: PartKind[] = ['foundation', 'namespace', 'property', 'modifier'];
  return (
    <div className="d-tablewrap">
      <table className="d-table n-shapes">
        <thead>
          <tr>
            <th>Shape</th>
            {kinds.map((k) => <th key={k} data-part={k}>{PART_LABEL[k]}</th>)}
            <th>CSS variable</th>
          </tr>
        </thead>
        <tbody>
          {SHAPES.map(([shape, name, note]) => {
            const parts = parseToken(name);
            const t = tokens.find((x) => x.name === name);
            return (
              <tr key={name}>
                <td><strong>{shape}</strong><span className="n-shapes__note">{note}</span></td>
                {kinds.map((k) => {
                  const p = parts.find((x) => x.kind === k);
                  return <td key={k}>{p ? <code className="d-tname" data-part={k}>{p.text}</code> : <span className="n-shapes__empty">—</span>}</td>;
                })}
                <td><code className="d-var">{t?.cssVar}</code></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------------------------------------- reference */
function useFoundationRows() {
  return useMemo(
    () =>
      FOUNDATION_ORDER.map((f) => {
        const list = tokens.filter((t) => t.name.split('.')[0] === f);
        const props = new Set<string>();
        const mods = new Set<string>();
        let namespaced = false;
        for (const t of list) {
          for (const p of parseToken(t.name)) {
            if (p.kind === 'property') props.add(p.text);
            if (p.kind === 'modifier') p.text.split('.').forEach((m) => mods.add(m));
            if (p.kind === 'namespace') namespaced = true;
          }
        }
        const example =
          list.find((t) => parseToken(t.name).length >= (FOUNDATIONS_WITH_PROPERTY.has(f) ? 3 : 2) && !t.name.includes('rovo')) ?? list[0];
        return { f, count: list.length, props: [...props], mods: [...mods], namespaced, example };
      }),
    [],
  );
}

/* --------------------------------------------------------------- builder */
function Builder() {
  const [foundation, setFoundation] = useState('color');
  const [property, setProperty] = useState<string | null>('background');
  const [selected, setSelected] = useState('color.background.brand.bold.hovered');

  const inFoundation = tokens.filter((t) => t.name.split('.')[0] === foundation);
  const propOf = (n: string) => {
    const p = parseToken(n);
    const ns = p.find((x) => x.kind === 'namespace');
    const pr = p.find((x) => x.kind === 'property');
    return [ns?.text, pr?.text].filter(Boolean).join('.') || null;
  };
  const properties = [...new Set(inFoundation.map((t) => propOf(t.name)).filter(Boolean))] as string[];
  const hasProps = properties.length > 0;
  const list = inFoundation.filter((t) => !hasProps || propOf(t.name) === property);
  const tok = tokens.find((t) => t.name === selected) ?? list[0];

  const pickFoundation = (f: string) => {
    setFoundation(f);
    const first = tokens.filter((t) => t.name.split('.')[0] === f);
    const props = [...new Set(first.map((t) => propOf(t.name)).filter(Boolean))] as string[];
    const p = props[0] ?? null;
    setProperty(p);
    setSelected((first.find((t) => !p || propOf(t.name) === p) ?? first[0]).name);
  };
  const pickProperty = (p: string) => {
    setProperty(p);
    setSelected(inFoundation.find((t) => propOf(t.name) === p)!.name);
  };

  const isColor = tok?.type === 'color';
  const modifierOf = (n: string) => parseToken(n).find((x) => x.kind === 'modifier')?.text ?? '(base)';

  return (
    <div className="n-builder">
      <div className="n-builder__cols">
        <div className="n-col">
          <p className="n-col__head" data-part="foundation">1 · Foundation</p>
          {FOUNDATION_ORDER.map((f) => (
            <button key={f} type="button" aria-pressed={foundation === f} className="n-opt" onClick={() => pickFoundation(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="n-col">
          <p className="n-col__head" data-part="property">2 · Property</p>
          {hasProps ? (
            properties.map((p) => (
              <button key={p} type="button" aria-pressed={property === p} className="n-opt" onClick={() => pickProperty(p)}>
                {p.startsWith('rovo.') ? <><span data-part="namespace">rovo</span>.{p.slice(5)}</> : p}
              </button>
            ))
          ) : (
            <p className="n-col__empty">{foundation} has no property. The modifier follows the foundation directly.</p>
          )}
        </div>
        <div className="n-col n-col--wide">
          <p className="n-col__head" data-part="modifier">3 · Modifier</p>
          <div className="n-col__scroll">
            {list.map((t) => (
              <button key={t.name} type="button" aria-pressed={selected === t.name} className="n-opt" onClick={() => setSelected(t.name)}>
                {modifierOf(t.name)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tok && (
        <div className="n-result" aria-live="polite">
          <div className="n-result__name">
            <TokenName name={tok.name} size="large" />
            {tok.description && <p className="d-body d-subtle">{tok.description}</p>}
          </div>
          <dl className="n-result__grid">
            <div><dt>CSS</dt><dd><code>var({tok.cssVar})</code></dd></div>
            <div><dt>TypeScript</dt><dd><code>token('{tok.name}')</code></dd></div>
            <div>
              <dt>{isColor ? 'Light / Dark' : 'Value'}</dt>
              <dd className="n-result__val">
                {isColor && <span className="d-chip" style={{ background: `var(${tok.cssVar})` }} />}
                <code>{isColor ? `${tok.light} / ${tok.dark}` : String(tok.light)}</code>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- section */
export function Naming() {
  const rows = useFoundationRows();
  return (
    <Section
      id="naming"
      index="1.1"
      title="Token naming"
      lead="Every token name answers three questions, in order: what kind of style it is, which part of the UI it styles, and in what situation. Names describe purpose, never appearance. A token is called color.text.danger, not red-800."
      meta={[
        ['Pattern', <code key="p">foundation.property.modifier</code>],
        ['Source', 'Atlassian Design System'],
        ['Tokens', String(tokens.length)],
      ]}
    >
      <Anatomy />

      <H3 note="Every token takes one of four shapes. Read across a row to see which parts it uses.">Shapes</H3>
      <Shapes />

      <H3 note="Chained modifiers always read from most general to most specific. Leave out any step you don't need.">Modifier order</H3>
      <div className="n-order">
        {[
          ['Role', 'What it communicates', 'neutral · brand · danger · warning · success · discovery · information · selected · accent.blue'],
          ['Emphasis', 'How loud it is', 'subtlest · subtle · (default) · bold'],
          ['State', 'Interaction state', 'hovered · pressed · focused · disabled'],
          ['Scale', 'Size step, for scale foundations', '025 … 1000 · xxsmall … xxlarge'],
        ].map(([name, what, values], i) => (
          <div key={name} className="n-order__step">
            <span className="n-order__num">{i + 1}</span>
            <strong>{name}</strong>
            <span className="d-subtle">{what}</span>
            <code>{values}</code>
          </div>
        ))}
      </div>
      <p className="d-body">
        Read <TokenName name="color.background.danger.bold.hovered" /> as: a <em>color</em> for a <em>background</em>, communicating <em>danger</em>, at <em>bold</em> emphasis, while <em>hovered</em>.
      </p>

      <H3 note="Generated from the token files, so this table is always in sync with what ships.">Foundation reference</H3>
      <div className="d-tablewrap">
        <table className="d-table">
          <thead>
            <tr><th>Foundation</th><th>Styles</th><th>Namespace</th><th>Properties</th><th>Modifiers in use</th><th>Example</th><th className="d-num">Tokens</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.f}>
                <td><code data-part="foundation" className="d-tname">{r.f}</code></td>
                <td className="d-desc">{FOUNDATION_PURPOSE[r.f]}</td>
                <td>{r.namespaced ? <code data-part="namespace" className="d-tname">rovo</code> : <span className="d-subtle">none</span>}</td>
                <td className="n-pills">{r.props.length ? r.props.map((p) => <code key={p} data-part="property" className="d-tname">{p}</code>) : <span className="d-subtle">none</span>}</td>
                <td className="d-desc">{r.mods.filter((m) => m !== 'rovo').slice(0, 8).join(', ')}{r.mods.length > 8 ? ', …' : ''}</td>
                <td><TokenName name={r.example.name} /></td>
                <td className="d-num">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3 note="One name, three spellings. The JSON path is the source of truth; the build derives the other two.">From name to code</H3>
      <div className="n-flow">
        <div className="n-flow__step">
          <p className="n-flow__label">Source · tokens/themes/light/color.json</p>
          <pre className="d-code">{`"color": {
  "background": {
    "danger": {
      "bold": {
        "hovered": {
          "$type": "color",
          "$value": "{palette.red.800}"
        }`}</pre>
        </div>
        <div className="n-flow__step">
          <p className="n-flow__label">CSS custom property</p>
          <pre className="d-code">{`--ds-background-danger-bold-hovered

/* dots → hyphens, prefix --ds-,
   "color" and "elevation" dropped
   (matches @atlaskit/tokens) */`}</pre>
        </div>
        <div className="n-flow__step">
          <p className="n-flow__label">TypeScript</p>
          <pre className="d-code">{`import { token } from '@rovo-ds/core';

token('color.background.danger.bold.hovered')
// → "var(--ds-background-danger-bold-hovered, #ae2e24)"
//   name is type-checked`}</pre>
        </div>
      </div>

      <H3>Rules</H3>
      <ol className="n-rules">
        <li><strong>Name the purpose, not the value.</strong> <code>color.icon.success</code>, never <code>color.green</code>. Values change between modes and variants; purposes don't.</li>
        <li><strong>Components use semantic tokens only.</strong> <code>palette.*</code> exists to feed semantic tokens and is never emitted to CSS.</li>
        <li><strong>Use <code>[default]</code> for the base of a group.</strong> In JSON, <code>color.text.[default]</code> becomes <code>color.text</code> and <code>--ds-text</code>.</li>
        <li><strong>Add a modifier only to separate two real uses.</strong> If nothing would ever use the base token, the modifier isn't needed.</li>
        <li><strong>Reserve the <code>rovo</code> namespace for AI-only styling.</strong> A Rovo menu uses <code>elevation.surface.overlay</code>, not a rovo token.</li>
        <li><strong>Tag additions.</strong> Tokens that ADS doesn't define carry <code>$extensions["rovo-ds"]</code> and are labelled <span className="d-ext">extension</span> in these docs.</li>
      </ol>

      <H3 note="Pick a foundation, then a property, then a modifier, the same order you'd read the name in.">Token builder</H3>
      <Builder />

      <Callout>
        <strong>Legend used throughout these docs:</strong>{' '}
        <span data-part="foundation" className="d-tname">foundation</span> ·{' '}
        <span data-part="namespace" className="d-tname">namespace</span> ·{' '}
        <span data-part="property" className="d-tname">property</span> ·{' '}
        <span data-part="modifier" className="d-tname">modifier</span>
      </Callout>
    </Section>
  );
}
