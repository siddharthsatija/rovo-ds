import { DoDont, H3, Section, Specimen, TokenName, TokenTable } from './doc';
import { byPrefix, tokens } from './tokens';


export function Foundations() {
  const colorCount = tokens.filter((t) => t.type === 'color').length;
  return (
    <>
      <Section
        id="color"
        index="1.2"
        title="Color"
        lead="Color is grouped by the property it styles. Most of the interface uses plain ADS color. The four Rovo hues are reserved for generation and AI actions, so when they appear, they mean something."
        meta={[
          ['Tokens', `${colorCount} per mode`],
          ['Modes', 'light, dark, auto'],
          ['Files', <code key="f">tokens/themes/*/color.json</code>],
        ]}
      >
        <H3 note="Fixed clockwise order: blue, purple, saffron, lime. Flat blocks only, never blended.">Rovo mosaic</H3>
        <div className="f-mosaic">
          {(['blue', 'purple', 'saffron', 'lime'] as const).map((c, i) => (
            <div key={c} style={{ background: `var(--ds-rovo-border-${c})` }}>
              <span data-dark={i > 1 || undefined}>{i + 1} · {c}</span>
            </div>
          ))}
        </div>
        <TokenTable tokens={byPrefix('color.rovo')} preview="color" modes />

        <H3>Text and link</H3>
        <TokenTable tokens={[...byPrefix('color.text'), ...byPrefix('color.link')]} preview="color" modes />
        <H3>Icon</H3>
        <TokenTable tokens={byPrefix('color.icon')} preview="color" modes />
        <H3>Border</H3>
        <TokenTable tokens={byPrefix('color.border')} preview="color" modes />
        <H3>Background</H3>
        <TokenTable tokens={[...byPrefix('color.background'), ...byPrefix('color.skeleton'), ...byPrefix('color.blanket')]} preview="color" modes />

        <DoDont
          dos={['Use Rovo hues at full intensity for generative states', 'Keep the clockwise order', 'Balance them with rich black or pure white']}
          donts={['Use Rovo hues as gradients, tints or fades', 'Put Rovo color on whole surfaces or non-AI UI', 'Reference palette values in components']}
        />
      </Section>

      <Section
        id="typography"
        index="1.3"
        title="Typography"
        lead="Each font token is a complete style (weight, size, line height, family) applied with one CSS font shorthand. Pick by role: heading for structure, body for reading, metric for numbers, code for code."
        meta={[
          ['Family', 'Atlassian Sans, system fallback'],
          ['Scale', '12 to 32px'],
          ['File', <code key="f">tokens/semantic/font.json</code>],
        ]}
      >
        <div className="f-type">
          {[...byPrefix('font.heading'), ...byPrefix('font.body')].map((t) => (
            <div key={t.name} className="f-type__row">
              <span className="f-type__sample" style={{ font: `var(${t.cssVar})` }}>
                {t.name.startsWith('font.heading') ? 'Three blockers for Atlas' : 'Rovo found 3 blockers. The SSO review is the critical path.'}
              </span>
              <span className="f-type__spec">
                <TokenName name={t.name} />
                <span>{t.description.split(' — ')[0]}</span>
              </span>
            </div>
          ))}
        </div>
        <H3>Code, metric, weight and family</H3>
        <TokenTable tokens={[...byPrefix('font.code'), ...byPrefix('font.metric'), ...byPrefix('font.weight'), ...byPrefix('font.family')]} />
      </Section>

      <Section
        id="space"
        index="1.4"
        title="Space"
        lead="An 8px grid. The number in the name is the multiple of 8px times 100, so space.100 is 8px and space.050 is 4px. Negative tokens pull elements together."
        meta={[['Base', '8px'], ['Unit', 'rem'], ['File', <code key="f">tokens/semantic/space.json</code>]]}
      >
        <TokenTable tokens={byPrefix('space').filter((t) => !t.name.includes('negative'))} preview="space" />
      </Section>

      <Section
        id="shape"
        index="1.5"
        title="Radius and border"
        lead="People are circles, agents are tiles. Chat bubbles and the prompt box use radius.xlarge, cards use radius.large, controls use radius.medium."
        meta={[['File', <code key="f">tokens/semantic/shape.json</code>]]}
      >
        <TokenTable tokens={byPrefix('radius')} preview="radius" />
        <H3>Border width</H3>
        <TokenTable tokens={byPrefix('border.width')} />
      </Section>

      <Section
        id="elevation"
        index="1.6"
        title="Elevation"
        lead="A surface token sets the fill and a shadow token lifts it. Rovo adds one surface, elevation.rovo.surface.overlay, used only when Rovo opens on top of another app (create, remix, omnibar). Rovo menus use the standard overlay."
        meta={[['Files', <code key="f">themes/*/color.json, shadow.json</code>]]}
      >
        <Specimen layout="row" surface="sunken">
          {[
            ['elevation.surface.sunken', null],
            ['elevation.surface', null],
            ['elevation.surface.raised', 'raised'],
            ['elevation.surface.overlay', 'overlay'],
            ['elevation.rovo.surface.overlay', 'overlay'],
          ].map(([s, sh]) => {
            const t = tokens.find((x) => x.name === s)!;
            return (
              <div key={s} className="f-elev" style={{ background: `var(${t.cssVar})`, boxShadow: sh ? `var(--ds-shadow-${sh})` : undefined }}>
                <code>{s!.replace('elevation.', '')}</code>
                {sh && <span>+ shadow.{sh}</span>}
              </div>
            );
          })}
        </Specimen>
        <H3>Surfaces</H3>
        <TokenTable tokens={tokens.filter((t) => t.name.startsWith('elevation.') && t.type === 'color')} preview="color" modes />
        <H3>Shadows</H3>
        <TokenTable tokens={byPrefix('elevation.shadow')} preview="shadow" />
      </Section>

    </>
  );
}

