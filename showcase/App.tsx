import { useEffect, useState, type ReactNode } from 'react';
import {
  AIDisclaimer,
  AIResponse,
  Avatar,
  Button,
  ChatMessage,
  ChatThread,
  GenerativeBorder,
  Icon,
  IconButton,
  MosaicSpinner,
  PromptInput,
  RovoAvatar,
  RovoFab,
  RovoIcon,
  RovoIconTile,
  SkeletonText,
  SkillsTag,
  Spinner,
  StreamingCaret,
  SuggestionActions,
  SuggestionCard,
  SuggestionPrompts,
  ThinkingDots,
  type AIResponseStatus,
  type Feedback,
  type SuggestionStatus,
  type SkillCollection,
  type IconName,
} from '../src';
import { Foundations } from './Foundations';
import { Naming } from './Naming';
import { ChatDemo } from './ChatDemo';
import { Callout, GroupHeader, H3, Section, Specimen, TokenName } from './doc';
import { Annotated, BlendedBorder, VisualDoDont } from './visuals';
import { demoSources, demoSteps, prompts } from './data';
import { tokens } from './tokens';
import rovoMark from './assets/rovo-mark.png';

const NAV: { group: string; id: string; items: [string, string, string][] }[] = [
  { group: 'Foundations', id: 'foundations', items: [['naming', '1.1', 'Token naming'], ['color', '1.2', 'Color'], ['typography', '1.3', 'Typography'], ['space', '1.4', 'Space'], ['shape', '1.5', 'Radius and border'], ['elevation', '1.6', 'Elevation']] },
  { group: 'Components', id: 'components', items: [['button', '2.1', 'Button'], ['identity', '2.2', 'Icon and avatar'], ['skills', '2.3', 'Skills tag'], ['generative', '2.4', 'Generative border'], ['loading', '2.5', 'Loading indicators']] },
  { group: 'AI patterns', id: 'patterns', items: [['messages', '3.1', 'Chat messages'], ['states', '3.2', 'Response states'], ['prompts', '3.3', 'Suggestion prompts'], ['suggestions', '3.4', 'Accept, edit, dismiss'], ['input', '3.5', 'Prompt input'], ['fab', '3.6', 'Floating button and nudge'], ['demo', '3.7', 'Full conversation']] },
];

function useActiveSection() {
  const [active, setActive] = useState('overview');
  useEffect(() => {
    const ids = ['overview', ...NAV.flatMap((g) => g.items.map((i) => i[0]))];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '-64px 0px -70% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const active = useActiveSection();
  useEffect(() => {
    document.documentElement.dataset.colorMode = mode;
  }, [mode]);

  return (
    <>
      <header className="d-topbar">
        <a className="d-wordmark" href="#overview">
          <img className="d-wordmark__mark" src={rovoMark} alt="" width={26} height={29} />
          <span>Rovo DS</span>
        </a>
        <span className="d-topbar__spacer" />
        <div className="d-segmented" role="group" aria-label="Color mode">
          {(['light', 'dark'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
      </header>

      <div className="d-layout">
        <nav className="d-nav" aria-label="Sections">
          <a href="#overview" aria-current={active === 'overview' ? 'true' : undefined} className="d-nav__link">Overview</a>
          {NAV.map((g, gi) => (
            <div key={g.group} className="d-nav__group">
              <a href={`#${g.id}`} className="d-nav__group-title">{gi + 1}. {g.group}</a>
              {g.items.map(([id, n, label]) => (
                <a key={id} href={`#${id}`} className="d-nav__link" aria-current={active === id ? 'true' : undefined}>
                  <span className="d-nav__num">{n}</span>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <main className="d-main">
          <Overview />

          <GroupHeader id="foundations" index="1" title="Foundations">
            Tokens are the single source of truth for every visual decision. Start with how they're named. Everything after it uses the same structure.
          </GroupHeader>
          <Naming />
          <Foundations />

          <GroupHeader id="components" index="2" title="Components">
            ADS components with Rovo additions. Each one consumes semantic tokens only, so modes and variants restyle it without code changes.
          </GroupHeader>
          <ButtonSection />
          <IdentitySection />
          <SkillsSection />
          <GenerativeSection />
          <LoadingSection />

          <GroupHeader id="patterns" index="3" title="AI patterns">
            Patterns for conversational AI. They're built to keep people in control, show how answers were produced, and say plainly when Rovo is limited or wrong.
          </GroupHeader>
          <MessagesSection />
          <StatesSection />
          <PromptsSection />
          <SuggestionSection />
          <InputSection />
          <FabSection />
          <Section id="demo" index="3.7" title="Full conversation" lead="All patterns together in a 480px side panel. Pick a starter or type anything, then try Stop, feedback and follow-ups.">
            <Specimen layout="center" surface="sunken" minHeight="48rem">
              <ChatDemo />
            </Specimen>
          </Section>

          <footer className="d-footer">
            <p>Rovo DS is an independent exploration built from the Atlassian Design System’s public tokens and Rovo UI guidance. It isn’t affiliated with or endorsed by Atlassian.</p>
          </footer>
        </main>
      </div>
    </>
  );
}

/* ================================================================ overview */
function Overview() {
  const ext = tokens.filter((t) => t.extension).length;
  return (
    <section id="overview" className="d-overview">
      <h1 className="d-display">Rovo DS</h1>
      <p className="d-overview__lead">
        Tokens, components and conversational patterns for AI moments, written as a dialect of the Atlassian Design System.
        Design tokens are authored in JSON, compiled to CSS custom properties, and consumed by React components.
      </p>
      <dl className="d-stats">
        <div><dt>Tokens</dt><dd>{tokens.length}</dd></div>
        <div><dt>ADS extensions</dt><dd>{ext}</dd></div>
        <div><dt>Color modes</dt><dd>2</dd></div>
        <div><dt>Components</dt><dd>9</dd></div>
        <div><dt>AI patterns</dt><dd>7</dd></div>
      </dl>

      <div className="d-overview__grid">
        <div>
          <h2 className="d-h3">Principles</h2>
          <ol className="d-principles">
            <li><span><strong>Integrated, not segregated.</strong> Rovo sits inside existing work. Most of any Rovo screen is plain ADS.</span></li>
            <li><span><strong>Earned expression.</strong> Quiet by default. Expressive only when AI is the main event.</span></li>
            <li><span><strong>Color is a signal.</strong> Rovo hues mark generation and AI actions, never surfaces.</span></li>
            <li><span><strong>Motion reports state.</strong> Thinking, writing, done. Off when reduced motion is on.</span></li>
            <li><span><strong>People decide.</strong> Nothing applies without Accept. Everything can be stopped or undone.</span></li>
            <li><span><strong>Show the work.</strong> Steps and sources are one click away. Limits are stated plainly.</span></li>
          </ol>
        </div>
        <div>
          <h2 className="d-h3">Start here</h2>
          <pre className="d-code">{`npm install
npm run tokens   # JSON → dist/css/tokens.css
npm run dev      # this site`}</pre>
          <pre className="d-code">{`import '@rovo-ds/core/styles';
import { Button, token } from '@rovo-ds/core';

<html data-color-mode="dark">

<Button appearance="rovo">Ask Rovo</Button>
<div style={{ padding: token('space.200') }} />`}</pre>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ components */
function ButtonSection() {
  return (
    <Section id="button" index="2.1" title="Button" lead="The Rovo appearance draws attention to the most important Rovo action in an experience. Its most common use is the submit icon button in a prompt box. Apply it to one button per region at most."
      meta={[['Token', <TokenName key="t" name="color.rovo.background.brand.bold" />], ['Import', <code key="i">{'{ Button, IconButton }'}</code>]]}>
      <H3>Anatomy</H3>
      <Specimen layout="center">
        <Annotated
          zoom={2}
          callouts={[
            { label: 'color.rovo.background.brand.bold', side: 'top', at: '22%', length: 28 },
            { label: 'color.text.inverse', side: 'bottom', at: '22%', length: 28, inset: 12 },
            { label: 'radius.full', side: 'bottom', at: '86%', length: 28 },
          ]}
        >
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Button appearance="rovo">Rovo</Button>
            <IconButton appearance="rovo" shape="circle" label="Send" icon={<Icon name="arrowUp" />} />
          </div>
        </Annotated>
      </Specimen>

      <H3>Appearances</H3>
      <Specimen code={`<Button appearance="rovo">Rovo</Button>`}>
        <Button appearance="rovo">Rovo</Button>
        <Button appearance="primary">Primary</Button>
        <Button>Default</Button>
        <Button appearance="subtle">Subtle</Button>
        <Button appearance="warning">Warning</Button>
        <Button appearance="danger">Danger</Button>
      </Specimen>

      <H3 note="Three entry points that sit inside product UI. None of them uses the Rovo appearance, so the prompt box keeps the one Rovo button.">Rovo cues and prompt starters</H3>
      <Specimen layout="center" minHeight="16rem">
        <div className="m-cues">
          <Button iconBefore={<img className="m-mark" src={rovoMark} alt="" />}>Ask Rovo</Button>
          <SuggestionPrompts animate={false} prompts={[{ id: 'a', label: 'What changed in Atlas this week?' }]} onSelect={() => {}} />
          <SuggestionPrompts animate={false} prompts={[{ id: 'b', label: 'Summarize page', icon: <Icon name="aiSummarize" /> }]} onSelect={() => {}} />
        </div>
      </Specimen>
      <div className="d-tablewrap">
        <table className="d-table">
          <thead><tr><th>Entry point</th><th>What it does</th><th>Built with</th></tr></thead>
          <tbody>
            <tr><td>Ask Rovo</td><td>Opens Rovo with the current context.</td><td><code>Button</code> + Rovo logo</td></tr>
            <tr><td>Prompt starter</td><td>Suggests a next step that opens a chat.</td><td><code>SuggestionPrompts</code>, chat icon</td></tr>
            <tr><td>Rovo cue</td><td>A quick AI action that happens outside chat.</td><td><code>SuggestionPrompts</code>, action icon</td></tr>
          </tbody>
        </table>
      </div>

      <H3>Guidelines</H3>
      <VisualDoDont items={[
        { kind: 'do', text: 'Use the Rovo appearance for the primary action in a Rovo experience.', example: (
          <div style={{ width: '100%', maxWidth: '20rem' }}><PromptInput value="Summarize this page" onChange={() => {}} onSubmit={() => {}} /></div>
        ) },
        { kind: 'dont', text: 'Don’t use the Rovo appearance on more than one button in the same region.', example: (
          <div style={{ display: 'flex', gap: 8 }}><Button appearance="rovo">Summarize</Button><Button appearance="rovo">Rewrite</Button><Button appearance="rovo">Translate</Button></div>
        ) },
        { kind: 'do', text: 'Use a default button with the Rovo logo for “Ask Rovo” beside other actions.', example: (
          <div style={{ display: 'flex', gap: 8 }}><Button appearance="primary">Publish</Button><Button iconBefore={<img className="m-mark" src={rovoMark} alt="" />}>Ask Rovo</Button></div>
        ) },
        { kind: 'dont', text: 'Don’t apply the Rovo appearance to actions that aren’t powered by Rovo.', example: (
          <div style={{ display: 'flex', gap: 8 }}><Button appearance="rovo">Publish</Button><Button>Cancel</Button></div>
        ) },
      ]} />
    </Section>
  );
}

const AI_ICONS: [IconName, string][] = [
  ['aiChat', 'Chat'], ['aiEdit', 'Improve writing'], ['aiSearch', 'Search'], ['aiWand', 'Generate'], ['aiRemix', 'Remix'], ['aiPresent', 'Presentation'],
  ['aiSummarize', 'Summarize'], ['aiSparkle', 'AI'],
];

function IdentitySection() {
  return (
    <Section id="identity" index="2.2" title="Icon and avatar" lead="Rovo icons mark AI-powered features and generative actions. Most combine a familiar action with a small sparkle. Add a text label wherever the meaning might not be obvious.">
      <Specimen layout="center" minHeight="14rem">
        <div className="d-aiicons">
          {AI_ICONS.map(([n, l]) => (
            <span key={n} className="d-aiicons__cell" title={l}><Icon name={n} size="large" /><span>{l}</span></span>
          ))}
        </div>
      </Specimen>

      <H3 note="Rovo icons sit with everyday actions in toolbars and menus, always next to a label.">In context</H3>
      <Specimen layout="center" surface="sunken" minHeight="20rem">
        <div className="m-editor">
          <p><mark>We source medical supplies from 40 countries so that every clinic can get what it needs, when it needs it.</mark></p>
          <Annotated callouts={[{ label: 'aiEdit', side: 'bottom', at: '34%', length: 36, inset: 10 }]}>
            <div className="m-toolbar" role="toolbar" aria-label="Formatting">
              <span className="m-toolbar__btn"><img src={rovoMark} alt="" />Ask Rovo<Icon name="chevronDown" /></span>
              <span className="m-toolbar__btn"><Icon name="aiEdit" />Improve writing</span>
              <span className="m-toolbar__btn"><Icon name="aiRemix" />Remix</span>
              <span className="m-toolbar__sep" />
              <span className="m-toolbar__btn m-toolbar__glyph">Tt</span>
              <span className="m-toolbar__btn m-toolbar__glyph">B</span>
              <span className="m-toolbar__btn"><Icon name="listBullet" /></span>
            </div>
          </Annotated>
        </div>
      </Specimen>

      <H3>Icon tiles and avatars</H3>
      <Specimen code={`<RovoIcon />  <RovoIconTile />  <RovoAvatar />  <Avatar name="Mia Chen" />`}>
        <span className="d-inline"><RovoIcon /> Mono</span>
        <span className="d-inline"><RovoIcon appearance="mosaic" /> Mosaic</span>
        <span className="d-inline"><RovoIconTile /> Tile</span>
        <span className="d-divider" />
        <RovoAvatar size="small" /><RovoAvatar /><RovoAvatar size="large" />
        <span className="d-divider" />
        <Avatar size="small" name="Mia Chen" /><Avatar name="Mia Chen" /><Avatar size="large" name="Mia Chen" />
      </Specimen>

      <H3>Guidelines</H3>
      <VisualDoDont items={[
        { kind: 'do', text: 'Pair a Rovo icon with a clear label.', example: (
          <div className="m-toolbar"><span className="m-toolbar__btn"><Icon name="aiEdit" />Improve writing</span><span className="m-toolbar__btn"><Icon name="aiSummarize" />Summarize</span></div>
        ) },
        { kind: 'dont', text: 'Don’t use a Rovo icon on its own when its meaning isn’t obvious.', example: (
          <div className="m-toolbar"><span className="m-toolbar__btn"><Icon name="aiEdit" /></span><span className="m-toolbar__btn"><Icon name="aiSummarize" /></span><span className="m-toolbar__btn"><Icon name="aiWand" /></span></div>
        ) },
      ]} />
    </Section>
  );
}

const COLLECTIONS: { key?: SkillCollection; name: string; skill: string; icon: IconName; token: string }[] = [
  { key: 'teamwork', name: 'Teamwork', skill: 'summarize-page', icon: 'page', token: 'blue' },
  { key: 'software', name: 'Software', skill: 'create-work-item', icon: 'workItem', token: 'lime' },
  { key: 'strategy', name: 'Strategy', skill: 'draft-okrs', icon: 'edit', token: 'orange' },
  { key: 'service', name: 'Service', skill: 'triage-requests', icon: 'search', token: 'yellow' },
  { key: 'product', name: 'Product', skill: 'write-prd', icon: 'sources', token: 'purple' },
  { name: 'None', skill: 'review-pull-request', icon: 'link', token: 'gray' },
];

function SkillsSection() {
  const [picked, setPicked] = useState<string | null>('summarize-page');
  const [attached, setAttached] = useState(true);
  return (
    <Section id="skills" index="2.3" title="Skills tag" lead="The primary visual identifier for a Rovo skill. Skills let people pick the exact action they want instead of leaving it to Rovo. The slash at the start shows which collection the skill belongs to."
      meta={[
        ['Slash', <TokenName key="b" name="color.border.accent.*" />],
        ['Fill', <TokenName key="f" name="color.background.neutral" />],
        ['Icon', <TokenName key="i" name="color.icon.subtle" />],
      ]}>
      <H3>Parts</H3>
      <Specimen layout="center" minHeight="16rem">
        <Annotated zoom={2.5} callouts={[
          { label: '1', side: 'top', at: '24%', length: 26, inset: 8 },
          { label: '2', side: 'left', at: '50%', length: 22, inset: 2 },
          { label: '3', side: 'bottom', at: '62%', length: 26, inset: 8 },
        ]}>
          <SkillsTag label="create-work-item" collection="teamwork" iconBefore={<Icon name="workItem" />} />
        </Annotated>
      </Specimen>
      <ol className="sk-legend">
        <li><strong>iconBefore.</strong> The icon or app logo for the skill. App logos keep their own colors. Generic icons use <TokenName name="color.icon.subtle" />.</li>
        <li><strong>Slash.</strong> Its color tells people which collection the skill belongs to. Gray means no collection.</li>
        <li><strong>Label.</strong> The skill name, lowercase and hyphenated, as people type it after “/”.</li>
      </ol>

      <H3 note="Five collections have a slash color. 2P and 3P apps, platform apps, and generic or custom skills are neutral.">Collections</H3>
      <div className="d-tablewrap">
        <table className="d-table sk-table">
          <thead><tr><th>Collection</th><th>Example</th><th>Slash token</th><th>Light</th><th>Dark</th></tr></thead>
          <tbody>
            {COLLECTIONS.map((c) => {
              const t = tokens.find((x) => x.name === `color.border.accent.${c.token}`)!;
              return (
                <tr key={c.name}>
                  <td><strong>{c.name}</strong>{!c.key && <span className="sk-sub">2P, 3P, platform, custom</span>}</td>
                  <td><SkillsTag label={c.skill} collection={c.key} iconBefore={<Icon name={c.icon} />} /></td>
                  <td><TokenName name={t.name} /></td>
                  <td className="d-val"><span className="sk-swatch" style={{ background: String(t.light) }} />{String(t.light)}</td>
                  <td className="d-val"><span className="sk-swatch" style={{ background: String(t.dark) }} />{String(t.dark)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Callout>
        <strong>Color is never the only cue.</strong> Strategy (orange) and Service (yellow) are close in hue, especially in dark mode. Where the collection matters, group skills under a collection heading, as the skill picker below does.
      </Callout>

      <H3 note="Typing “/” in the prompt box opens the skill picker. A chosen skill attaches to the prompt.">In context</H3>
      <Specimen layout="center" surface="sunken" minHeight="22rem">
        <div className="m-picker">
          <div className="m-menu" role="listbox" aria-label="Skills">
            <div className="m-menu__group">Teamwork</div>
            <div className="m-menu__item" aria-selected="true"><SkillsTag label="summarize-page" collection="teamwork" iconBefore={<Icon name="page" />} /><span>Summarize this page</span></div>
            <div className="m-menu__group">Software</div>
            <div className="m-menu__item"><SkillsTag label="create-work-item" collection="software" iconBefore={<Icon name="workItem" />} /><span>Create a Jira work item</span></div>
            <div className="m-menu__group">Other</div>
            <div className="m-menu__item"><SkillsTag label="review-pull-request" iconBefore={<Icon name="link" />} /><span>GitHub</span></div>
          </div>
          <PromptInput value="/sum" onChange={() => {}} onSubmit={() => {}} />
        </div>
      </Specimen>

      <H3>States</H3>
      <Specimen layout="column" code={`<SkillsTag label="summarize-page" collection="teamwork" onClick={pick} isSelected />\n<SkillsTag label="create-work-item" collection="software" onRemove={remove} />`}>
        <div className="sk-states">
          <div><p className="d-label">Static</p><SkillsTag label="summarize-page" collection="teamwork" iconBefore={<Icon name="page" />} /></div>
          <div>
            <p className="d-label">Selectable</p>
            <div className="sk-row">
              {['summarize-page', 'draft-okrs'].map((l) => (
                <SkillsTag key={l} label={l} collection={l === 'draft-okrs' ? 'strategy' : 'teamwork'} iconBefore={<Icon name={l === 'draft-okrs' ? 'edit' : 'page'} />} isSelected={picked === l} onClick={() => setPicked(picked === l ? null : l)} />
              ))}
            </div>
          </div>
          <div>
            <p className="d-label">Removable</p>
            {attached
              ? <SkillsTag label="create-work-item" collection="software" iconBefore={<Icon name="workItem" />} onRemove={() => setAttached(false)} />
              : <Button spacing="compact" appearance="subtle" onClick={() => setAttached(true)}>Attach again</Button>}
          </div>
          <div><p className="d-label">Truncated</p><SkillsTag label="summarize-unresolved-comments-on-this-page" collection="teamwork" iconBefore={<Icon name="page" />} /></div>
        </div>
      </Specimen>

      <H3>Guidelines</H3>
      <VisualDoDont items={[
        { kind: 'do', text: 'Use a colored slash only for skills that belong to a collection.', example: (
          <div className="sk-row"><SkillsTag label="create-work-item" collection="software" iconBefore={<Icon name="workItem" />} /><SkillsTag label="review-pull-request" iconBefore={<Icon name="link" />} /></div>
        ) },
        { kind: 'dont', text: 'Don’t fill the tag or color the label with the collection color.', example: (
          <span className="sk-wrong"><Icon name="workItem" />create-work-item</span>
        ) },
        { kind: 'do', text: 'Name skills as short, lowercase, hyphenated verbs.', example: (
          <SkillsTag label="summarize-page" collection="teamwork" iconBefore={<Icon name="page" />} />
        ) },
        { kind: 'dont', text: 'Don’t invent new collection colors or write labels as sentences.', example: (
          <span className="rds-skills-tag" style={{ ['--rds-tag-slash' as string]: 'var(--ds-border-danger)' }}><span className="rds-skills-tag__main"><span className="rds-skills-tag__icon"><Icon name="page" /></span><span className="rds-skills-tag__label">Please summarize this page for me</span></span></span>
        ) },
      ]} />
    </Section>
  );
}

function GenerativeSection() {
  const [on, setOn] = useState(true);
  return (
    <Section id="generative" index="2.4" title="Generative border" lead="An animated border that uses the Rovo mosaic to draw attention to content while AI is generating it. It’s reserved for generation that is in progress right now."
      meta={[['Tokens', <TokenName key="t" name="color.rovo.border.*" />], ['Loop', <TokenName key="m" name="motion.rovo.duration.generative" />]]}>
      <Specimen layout="center" surface="sunken" minHeight="20rem" code={`<GenerativeBorder isGenerating={${on}}>…</GenerativeBorder>`}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--ds-space-200)', width: '100%' }}>
          <GenerativeBorder isGenerating={on} radius="xlarge" className="m-answer">
            <div className="m-answer__inner">
              <div className="m-answer__tabs" role="tablist">
                <span className="m-answer__tab" role="tab" aria-selected="true"><Icon name="aiChat" />Answer</span>
                <span className="m-answer__tab" role="tab" aria-selected="false"><Icon name="link" />Sources</span>
              </div>
              {on ? <SkeletonText lines={3} /> : <p className="m-answer__body">The Atlas launch is on track for 12 March. Two risks remain: the SSO security review and billing rate limits.</p>}
              <div className="m-answer__foot">
                <AIDisclaimer />
                <span style={{ display: 'flex' }}>
                  <IconButton appearance="subtle" size="small" label="Good response" icon={<Icon name="thumbsUp" />} />
                  <IconButton appearance="subtle" size="small" label="Bad response" icon={<Icon name="thumbsDown" />} />
                  <IconButton appearance="subtle" size="small" label="Copy" icon={<Icon name="copy" />} />
                </span>
              </div>
            </div>
          </GenerativeBorder>
          <Button spacing="compact" onClick={() => setOn((v) => !v)} iconBefore={<Icon name={on ? 'stop' : 'aiSparkle'} />}>
            {on ? 'Finish generating' : 'Generate again'}
          </Button>
        </div>
      </Specimen>

      <H3 note="Rovo color tokens, clockwise: blue, purple, saffron, lime. Flat colors with hard edges where they meet.">Colors</H3>
      <Specimen layout="center" minHeight="18rem">
        <Annotated callouts={[
          { label: 'color.rovo.border.purple', side: 'top', at: '50%', length: 40 },
          { label: 'color.rovo.border.saffron', side: 'right', at: '50%', length: 40 },
          { label: 'color.rovo.border.lime', side: 'bottom', at: '50%', length: 40 },
          { label: 'color.rovo.border.blue', side: 'left', at: '50%', length: 40 },
        ]}>
          <GenerativeBorder isGenerating isStatic radius="xlarge" className="m-diagram-box"><span /></GenerativeBorder>
        </Annotated>
      </Specimen>

      <H3>Guidelines</H3>
      <VisualDoDont items={[
        { kind: 'do', text: 'Use flat Rovo colors with hard-edged color stops.', example: (
          <GenerativeBorder isGenerating isStatic radius="large" className="m-diagram-box"><span /></GenerativeBorder>
        ) },
        { kind: 'dont', text: 'Don’t use blended gradients, blurs or tinted colors.', example: (
          <BlendedBorder><div className="m-diagram-box" /></BlendedBorder>
        ) },
        { kind: 'do', text: 'Use the generative border to show generation in progress.', example: (
          <GenerativeBorder isGenerating radius="large" style={{ width: '100%', maxWidth: '18rem' }}>
            <div style={{ padding: 'var(--ds-space-150)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-100)' }}>
              <span className="d-inline"><img className="m-mark" src={rovoMark} alt="" />Rovo is thinking…</span>
              <SkeletonText lines={2} />
            </div>
          </GenerativeBorder>
        ) },
        { kind: 'dont', text: 'Don’t use it as decoration or to make a feature look more prominent.', example: (
          <div className="m-toolbar">
            <span className="m-toolbar__btn"><Icon name="aiEdit" />Improve writing</span>
            <GenerativeBorder isGenerating radius="medium"><span className="m-toolbar__btn"><Icon name="aiRemix" />Remix</span></GenerativeBorder>
            <span className="m-toolbar__btn m-toolbar__glyph">B</span>
          </div>
        ) },
      ]} />
    </Section>
  );
}

function LoadingSection() {
  return (
    <Section id="loading" index="2.5" title="Loading indicators" lead="Choose by what you know about the wait. Don’t stack two attention-grabbing indicators on one element.">
      <div className="d-tablewrap">
        <table className="d-table d-table--specimens">
          <thead><tr><th>Indicator</th><th>Use when</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td><code>ThinkingDots</code></td><td>A reply is coming and its shape is unknown (chat).</td><td><ThinkingDots /> <ThinkingDots appearance="neutral" /></td></tr>
            <tr><td><code>SkeletonText</code></td><td>The shape is known (card, summary). Pair with the generative border.</td><td><div style={{ width: '12rem' }}><SkeletonText lines={2} /></div></td></tr>
            <tr><td><code>MosaicSpinner</code></td><td>A whole Rovo surface is starting up.</td><td><MosaicSpinner size="small" /> <MosaicSpinner /></td></tr>
            <tr><td><code>StreamingCaret</code></td><td>Marks where Rovo is writing right now.</td><td>Drafting the notes<StreamingCaret /></td></tr>
            <tr><td><code>Spinner</code></td><td>Non-AI loading: fetching data, saving.</td><td><Spinner size="small" /> <Spinner /></td></tr>
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* ================================================================ patterns */
function MessagesSection() {
  return (
    <Section id="messages" index="3.1" title="Chat messages" lead="User messages are right-aligned neutral bubbles. Rovo replies run full width with no bubble, because long answers, lists and tables read better on the surface. System lines are small and centered."
      meta={[['Tokens', <TokenName key="t" name="color.rovo.background.message.user" />]]}>
      <Specimen layout="column" code={`<ChatThread>\n  <ChatMessage role="user">…</ChatMessage>\n  <ChatMessage role="rovo"><AIResponse status="complete">…</AIResponse></ChatMessage>\n</ChatThread>`}>
        <div style={{ width: '100%', maxWidth: '40rem' }}>
          <ChatThread label="Example conversation">
            <ChatMessage role="system" isStatic>Today</ChatMessage>
            <ChatMessage role="user" isStatic>What changed in the Q3 roadmap since last week?</ChatMessage>
            <ChatMessage role="rovo" timestamp="2:14 PM" isStatic>
              <AIResponse status="complete" sources={demoSources.slice(0, 2)} onCopy={() => {}} onFeedback={() => {}} onRegenerate={() => {}}>
                <p>Two changes since Monday:</p>
                <ul>
                  <li><span><strong>Search relevance</strong> moved from Q3 to Q4. It’s blocked on the indexing migration.</span></li>
                  <li><span><strong>Mobile offline mode</strong> was added as a stretch goal.</span></li>
                </ul>
              </AIResponse>
            </ChatMessage>
            <ChatMessage role="user" author="Mia Chen" showUserAuthor isStatic>Can you flag this to the mobile team?</ChatMessage>
            <ChatMessage role="user" isGrouped isStatic>And cc Dev.</ChatMessage>
            <ChatMessage role="system" isStatic>Dev Patel joined the conversation</ChatMessage>
          </ChatThread>
        </div>
      </Specimen>
    </Section>
  );
}

function StatesSection() {
  const states: AIResponseStatus[] = ['thinking', 'streaming', 'complete', 'stopped', 'error', 'limited'];
  const [s, setS] = useState<AIResponseStatus>('complete');
  const [fb, setFb] = useState<Feedback>(null);
  const body: Record<AIResponseStatus, ReactNode> = {
    thinking: null,
    streaming: <p>I found 3 blockers for the Atlas launch. Here they are in priority order: the SSO migration is waiting on</p>,
    complete: (
      <>
        <p>I found 3 blockers for the Atlas launch. Here they are in priority order:</p>
        <ol>
          <li><span><strong>SSO migration:</strong> waiting on security review (ATLAS-412).</span></li>
          <li><span><strong>Billing API:</strong> rate limits not yet raised for launch traffic.</span></li>
          <li><span><strong>Docs:</strong> 4 of 11 pages still in draft.</span></li>
        </ol>
      </>
    ),
    stopped: <p>I found 3 blockers for the Atlas launch. Here they are in priority order: the SSO migration is</p>,
    error: null,
    limited: <p>Based on the 2 pages I can see, the launch date is <strong>12 March</strong>.</p>,
  };
  return (
    <Section id="states" index="3.2" title="Response states" lead="One answer moves through up to six states. Each state tells people what Rovo is doing and what they can do next.">
      <div className="d-segmented d-segmented--tabs" role="tablist" aria-label="Response state">
        {states.map((x) => (
          <button key={x} type="button" role="tab" aria-selected={s === x} aria-pressed={s === x} onClick={() => setS(x)}>{x}</button>
        ))}
      </div>
      <Specimen layout="column" code={`<AIResponse status="${s}" … />`}>
        <div style={{ width: '100%', maxWidth: '40rem' }}>
          <ChatMessage role="rovo" timestamp="Just now" key={s}>
            <AIResponse
              status={s}
              thinkingLabel="Searching Jira and Confluence"
              steps={s === 'thinking' ? demoSteps.map((st, i) => ({ ...st, status: i === 0 ? 'done' : i === 1 ? 'active' : 'pending' })) : s === 'complete' ? demoSteps : undefined}
              sources={s === 'complete' || s === 'limited' ? demoSources : undefined}
              limitedMessage="I couldn't access 3 restricted pages in the Atlas space, so this may be incomplete."
              feedback={fb}
              onFeedback={setFb}
              onCopy={() => {}}
              onRegenerate={() => setS('streaming')}
              onStop={() => setS('stopped')}
              onRetry={() => setS('thinking')}
            >
              {body[s]}
            </AIResponse>
          </ChatMessage>
        </div>
      </Specimen>
      <div className="d-tablewrap">
        <table className="d-table">
          <thead><tr><th>State</th><th>Shows</th><th>Actions</th><th>Copy</th></tr></thead>
          <tbody>
            <tr><td><code>thinking</code></td><td>Dots, present-tense step, optional steps list</td><td>None</td><td>“Searching Jira”</td></tr>
            <tr><td><code>streaming</code></td><td>Partial text with caret</td><td>Stop generating</td><td>None</td></tr>
            <tr><td><code>complete</code></td><td>Answer, sources, disclaimer</td><td>Copy, good, bad, regenerate</td><td>Lead with the answer</td></tr>
            <tr><td><code>stopped</code></td><td>Dimmed partial text and a note</td><td>Regenerate</td><td>“You stopped this response.”</td></tr>
            <tr><td><code>error</code></td><td>Danger message</td><td>Try again</td><td>What happened and what to do</td></tr>
            <tr><td><code>limited</code></td><td>Information message, then the answer</td><td>Copy, feedback</td><td>State the limit honestly</td></tr>
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function PromptsSection() {
  return (
    <Section id="prompts" index="3.3" title="Suggestion prompts" lead="Prompt starters suggest a next step. Write them the way the user would type them, specific to the current context.">
      <H3 note="2 to 4 short follow-ups after an answer.">Chips</H3>
      <Specimen code={`<SuggestionPrompts layout="chips" prompts={…} onSelect={…} />`}>
        <SuggestionPrompts prompts={prompts.slice(0, 3)} onSelect={() => {}} />
      </Specimen>
      <H3 note="3 to 6 starters with a one-line description, for landing and empty states.">Cards</H3>
      <Specimen code={`<SuggestionPrompts layout="cards" heading="Try asking" … />`}>
        <div style={{ width: '100%' }}><SuggestionPrompts layout="cards" heading="Try asking" prompts={prompts} onSelect={() => {}} /></div>
      </Specimen>
      <H3 note="For narrow side panels.">List</H3>
      <Specimen code={`<SuggestionPrompts layout="list" … />`}>
        <div style={{ width: '100%', maxWidth: '22rem' }}><SuggestionPrompts layout="list" prompts={prompts.slice(0, 3)} onSelect={() => {}} /></div>
      </Specimen>
    </Section>
  );
}

const ORIGINAL = 'we need to get the launch out soon so everyone please finish your tasks asap and let me know if theres problems';
const SUGGESTED = 'To keep the launch on track, please finish your open tasks by Thursday and flag any blockers in #atlas-launch.';

function SuggestionSection() {
  const [status, setStatus] = useState<SuggestionStatus>('ready');
  const [applied, setApplied] = useState<string | null>(null);
  const regen = () => {
    setStatus('generating');
    window.setTimeout(() => setStatus('ready'), 1800);
  };
  return (
    <Section id="suggestions" index="3.4" title="Accept, edit, dismiss" lead="Nothing is applied until Accept. Edit keeps the AI draft as a starting point. Both outcomes leave a confirmation with Undo. The action order never changes: Accept, Edit, Dismiss, Try another."
      meta={[['Tokens', <TokenName key="t" name="color.rovo.background.suggestion.inserted" />]]}>
      <div className="d-segmented d-segmented--tabs" aria-label="Suggestion state" role="group">
        {(['generating', 'ready', 'editing', 'accepted', 'dismissed'] as SuggestionStatus[]).map((x) => (
          <button key={x} type="button" aria-pressed={status === x} onClick={() => setStatus(x)}>{x}</button>
        ))}
      </div>
      <Specimen layout="column" code={`<SuggestionCard status="${status}" original={…} suggestion={…} onAccept onDismiss onRegenerate />`}>
        <div className="d-split">
          <SuggestionCard
            status={status}
            title="Improve writing"
            meta={<SkillsTag label="Tone: clear" collection="teamwork" />}
            original={ORIGINAL}
            suggestion={SUGGESTED}
            onAccept={(t) => { setApplied(t); setStatus('accepted'); }}
            onDismiss={() => setStatus('dismissed')}
            onRegenerate={regen}
            onStatusChange={setStatus}
            onUndo={() => { setApplied(null); setStatus('ready'); }}
          />
          <div className="d-docpreview">
            <p className="d-label">Document</p>
            <p className="d-body">{applied ?? ORIGINAL}</p>
          </div>
        </div>
      </Specimen>
      <H3 note="In edit mode, Cmd/Ctrl + Enter saves and applies. Esc cancels.">Actions on their own</H3>
      <Specimen layout="column" code={`<SuggestionActions onAccept onEdit onDismiss onRegenerate />`}>
        <SuggestionActions onAccept={() => {}} onEdit={() => {}} onDismiss={() => {}} onRegenerate={() => {}} />
        <SuggestionActions spacing="compact" acceptLabel="Insert" onAccept={() => {}} onDismiss={() => {}} />
      </Specimen>
    </Section>
  );
}

function InputSection() {
  const [v, setV] = useState('');
  const [gen, setGen] = useState(false);
  return (
    <Section id="input" index="3.5" title="Prompt input" lead="Enter sends and Shift + Enter adds a line. While Rovo is generating, Send becomes Stop and the field stays editable so people can draft their next message.">
      <Specimen layout="column" surface="sunken" code={`<PromptInput value onChange onSubmit isGenerating onStop context={<SkillsTag … />} />`}>
        <div style={{ width: '100%', maxWidth: '36rem' }}>
          <PromptInput
            value={v}
            onChange={setV}
            isGenerating={gen}
            onStop={() => setGen(false)}
            onSubmit={() => { setV(''); setGen(true); window.setTimeout(() => setGen(false), 2500); }}
            context={<SkillsTag label="Summarize page" collection="teamwork" onRemove={() => {}} />}
            tools={
              <>
                <IconButton appearance="subtle" label="Add context" icon={<Icon name="add" />} />
                <IconButton appearance="subtle" label="Attach file" icon={<Icon name="attach" />} />
              </>
            }
          />
        </div>
      </Specimen>
    </Section>
  );
}

function FabSection() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(true);
  return (
    <Section id="fab" index="3.6" title="Floating button and nudge" lead="A persistent entry point, always bottom right in every app. Nudges are specific, rare and dismissible. Show at most one at a time.">
      <Specimen surface="default" minHeight="20rem" code={`<RovoFab onClick isOpen nudge={{ message, actionLabel, onAction, onDismiss }} />`}>
        <div className="d-fabframe">
          <div className="d-fakepage">
            <span style={{ width: '40%', height: '1.25rem' }} />
            <span /><span /><span style={{ width: '70%' }} />
          </div>
          <RovoFab
            contained
            isOpen={open}
            onClick={() => setOpen((o) => !o)}
            nudge={nudge ? {
              message: <>This page has 14 unresolved comments. <strong>Summarize them?</strong></>,
              actionLabel: 'Summarize',
              onAction: () => { setNudge(false); setOpen(true); },
              onDismiss: () => setNudge(false),
            } : undefined}
          />
          {!nudge && !open && <Button className="d-fabreset" spacing="compact" onClick={() => setNudge(true)}>Show nudge again</Button>}
        </div>
      </Specimen>
    </Section>
  );
}
