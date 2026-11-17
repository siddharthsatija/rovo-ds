import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  AIResponse,
  ChatMessage,
  ChatThread,
  Icon,
  IconButton,
  PromptInput,
  RovoAvatar,
  RovoIconTile,
  SkillsTag,
  SuggestionPrompts,
  type AIResponseStatus,
  type AISource,
  type Feedback,
  type ThinkingStep,
} from '../src';
import { demoSources, prompts } from './data';

type Msg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'rovo'; status: AIResponseStatus; full: string; shown: number; steps: ThinkingStep[]; sources: AISource[]; label: string; feedback: Feedback };

const ANSWERS: [RegExp, string][] = [
  [/blocker/i, 'I found 3 blockers for Atlas. Here they are in priority order:\n- SSO migration — waiting on security review (ATLAS-412).\n- Billing API — rate limits not yet raised for launch traffic.\n- Docs — 4 of 11 pages are still in draft.\nThe SSO review is the critical path; it has no assignee yet.'],
  [/status|update/i, 'Here’s a draft status update for your team:\nThis week we closed 14 issues and shipped the onboarding checklist. The SSO migration is still blocked on security review, which puts the 12 March date at risk. Next week we’ll focus on billing rate limits and finishing the docs.'],
  [/own|billing/i, 'The billing API is owned by the Payments Platform team. Priya Raman is the tech lead, and this week’s on-call is Dev Patel. Their runbook lives in the Payments space.'],
  [/./, 'Here’s what changed this week:\n- Atlas launch plan: launch date confirmed for 12 March.\n- 14 issues closed in ATLAS, 3 new blockers opened.\n- Mobile offline mode was added as a stretch goal.\nThe biggest risk is the unassigned SSO security review.'],
];

const STEP_PLAN = ['Understood your question', 'Searched Jira', 'Searched Confluence', 'Writing the answer'];

export function ChatDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [value, setValue] = useState('');
  const [skill, setSkill] = useState(true);
  const timer = useRef<number | undefined>(undefined);
  const scroller = useRef<HTMLDivElement>(null);
  const active = msgs.find((m): m is Extract<Msg, { role: 'rovo' }> => m.role === 'rovo' && (m.status === 'thinking' || m.status === 'streaming'));

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [msgs]);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const patch = (id: string, fn: (m: Extract<Msg, { role: 'rovo' }>) => Partial<Extract<Msg, { role: 'rovo' }>>) =>
    setMsgs((all) => all.map((m) => (m.id === id && m.role === 'rovo' ? { ...m, ...fn(m) } : m)));

  const ask = (text: string) => {
    window.clearInterval(timer.current);
    const id = `r${Date.now()}`;
    const full = ANSWERS.find(([re]) => re.test(text))![1];
    const steps: ThinkingStep[] = STEP_PLAN.map((label, i) => ({ id: String(i), label, status: i === 0 ? 'active' : 'pending' }));
    setMsgs((m) => [
      ...m,
      { id: `u${Date.now()}`, role: 'user', text },
      { id, role: 'rovo', status: 'thinking', full, shown: 0, steps, sources: demoSources, label: 'Understanding your question', feedback: null },
    ]);
    setValue('');

    let tick = 0;
    timer.current = window.setInterval(() => {
      tick++;
      if (tick <= 3) {
        patch(id, (m) => ({
          label: STEP_PLAN[tick],
          steps: m.steps.map((s, i) => ({ ...s, status: i < tick ? 'done' : i === tick ? 'active' : 'pending' })),
        }));
        return;
      }
      window.clearInterval(timer.current);
      const words = full.split(/(\s+)/);
      let n = 0;
      timer.current = window.setInterval(() => {
        n += 2;
        patch(id, () => ({ status: 'streaming', shown: Math.min(n, words.length) }));
        if (n >= words.length) {
          window.clearInterval(timer.current);
          patch(id, (m) => ({ status: 'complete', shown: words.length, steps: m.steps.map((s) => ({ ...s, status: 'done' as const })) }));
        }
      }, 35);
    }, 650);
  };

  const stop = () => {
    window.clearInterval(timer.current);
    if (active) patch(active.id, (m) => ({ status: m.shown > 0 ? 'stopped' : 'error' }));
  };

  const last = msgs[msgs.length - 1];
  const showFollowups = last?.role === 'rovo' && last.status === 'complete';

  return (
    <div className="sc-chat">
      <header className="sc-chat__header">
        <RovoAvatar size="small" />
        <strong>Rovo</strong>
        <span className="sc-chat__spacer" />
        <IconButton appearance="subtle" size="small" label="New chat" icon={<Icon name="add" />} onClick={() => { window.clearInterval(timer.current); setMsgs([]); }} />
        <IconButton appearance="subtle" size="small" label="Expand" icon={<Icon name="expand" />} />
        <IconButton appearance="subtle" size="small" label="More actions" icon={<Icon name="more" />} />
      </header>

      <div className="sc-chat__body" ref={scroller}>
        {msgs.length === 0 ? (
          <Landing onPick={(p) => ask(p)} />
        ) : (
          <ChatThread>
            {msgs.map((m) =>
              m.role === 'user' ? (
                <ChatMessage key={m.id} role="user">{m.text}</ChatMessage>
              ) : (
                <ChatMessage key={m.id} role="rovo" timestamp="Just now">
                  <AIResponse
                    status={m.status}
                    thinkingLabel={m.label}
                    steps={m.steps}
                    sources={m.sources}
                    feedback={m.feedback}
                    onFeedback={(f) => patch(m.id, () => ({ feedback: f }))}
                    onCopy={() => navigator.clipboard?.writeText(m.full).catch(() => {})}
                    onRegenerate={() => ask('regenerate ' + m.full.slice(0, 20))}
                    onStop={stop}
                    onRetry={() => ask('retry')}
                  >
                    {m.status === 'thinking' ? null : <Rich text={m.full.split(/(\s+)/).slice(0, m.shown).join('')} />}
                  </AIResponse>
                </ChatMessage>
              ),
            )}
            {showFollowups && (
              <SuggestionPrompts key={last.id} prompts={prompts.filter((p) => !msgs.some((x) => x.role === 'user' && x.text === p.label)).slice(0, 3)} onSelect={(p) => ask(p.label)} />
            )}
          </ChatThread>
        )}
      </div>

      <footer className="sc-chat__footer">
        <PromptInput
          value={value}
          onChange={setValue}
          onSubmit={ask}
          isGenerating={Boolean(active)}
          onStop={stop}
          context={skill ? <SkillsTag label="Atlas space" collection="teamwork" iconBefore={<Icon name="page" />} onRemove={() => setSkill(false)} /> : undefined}
          tools={<IconButton appearance="subtle" label="Add context" icon={<Icon name="add" />} />}
        />
      </footer>
    </div>
  );
}

function Landing({ onPick }: { onPick: (p: string) => void }) {
  // Page choreography: illustration → title → prompt cards (staggered entrance primitive).
  return (
    <div className="sc-landing rds-stagger">
      <div style={{ '--rds-i': 0 } as CSSProperties}><RovoIconTile size="large" /></div>
      <h3 className="sc-landing__title" style={{ '--rds-i': 1 } as CSSProperties}>How can I help, Mia?</h3>
      <p className="sc-landing__sub" style={{ '--rds-i': 2 } as CSSProperties}>I can search, summarize and act across your Atlassian apps.</p>
      <div style={{ '--rds-i': 3, width: '100%' } as CSSProperties}>
        <SuggestionPrompts layout="cards" prompts={prompts} onSelect={(p) => onPick(p.label)} animate={false} />
      </div>
    </div>
  );
}

/** Tiny line renderer: lines starting with "- " become list items. */
function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) out.push(<ul key={out.length}>{list.map((l, i) => <li key={i}>{l}</li>)}</ul>);
    list = [];
  };
  text.split('\n').forEach((line) => {
    if (line.startsWith('- ')) list.push(line.slice(2));
    else { flush(); if (line.trim()) out.push(<p key={out.length}>{line}</p>); }
  });
  flush();
  return <>{out}</>;
}
