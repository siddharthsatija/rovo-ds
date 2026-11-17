import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils';
import { Icon, type IconName } from '../../icons/Icon';
import { Button, IconButton } from '../Button/Button';
import { ThinkingDots, StreamingCaret } from '../LoadingIndicator/LoadingIndicator';
import './AIResponse.css';

/**
 * The lifecycle of one Rovo answer.
 *  thinking  → no output yet; show what Rovo is doing ("Searching Confluence…")
 *  streaming → tokens arriving; caret + Stop
 *  complete  → full answer; toolbar, sources, disclaimer
 *  stopped   → user stopped it; keep partial output, offer Regenerate
 *  error     → couldn't finish; say so plainly, offer Retry
 *  limited   → answered with caveats (low confidence, missing access, no results)
 */
export type AIResponseStatus = 'thinking' | 'streaming' | 'complete' | 'stopped' | 'error' | 'limited';

export type ThinkingStepStatus = 'done' | 'active' | 'pending';
export interface ThinkingStep {
  id: string;
  label: string;
  status: ThinkingStepStatus;
  detail?: string;
}

export interface AISource {
  id: string;
  title: string;
  /** App/product the source lives in, e.g. "Confluence". */
  product?: string;
  href?: string;
  icon?: IconName;
}

export type Feedback = 'up' | 'down' | null;

export interface AIResponseProps {
  status: AIResponseStatus;
  children?: ReactNode;
  /** Present-tense description of the current step, e.g. "Searching Jira". */
  thinkingLabel?: string;
  /** "Pop the hood": the steps Rovo took. Collapsed by default once complete. */
  steps?: ThinkingStep[];
  sources?: AISource[];
  /** Shown for status="error". Keep it human: what happened, what to do next. */
  errorMessage?: ReactNode;
  /** Shown for status="limited". State the limit honestly, then the next step. */
  limitedMessage?: ReactNode;
  feedback?: Feedback;
  onFeedback?: (value: Feedback) => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onStop?: () => void;
  onRetry?: () => void;
  /** Hide "Uses AI. Verify results." (only when the surface shows it once already). */
  hideDisclaimer?: boolean;
  className?: string;
}

export function AIResponse({
  status,
  children,
  thinkingLabel = 'Thinking',
  steps,
  sources,
  errorMessage = "Rovo couldn't finish this response. Your request wasn't lost — try again.",
  limitedMessage,
  feedback = null,
  onFeedback,
  onCopy,
  onRegenerate,
  onStop,
  onRetry,
  hideDisclaimer,
  className,
}: AIResponseProps) {
  const busy = status === 'thinking' || status === 'streaming';
  const settled = status === 'complete' || status === 'limited' || status === 'stopped';

  return (
    <div className={cx('rds-response', `rds-response--${status}`, className)} aria-busy={busy || undefined}>
      {steps && steps.length > 0 && <ThinkingSteps steps={steps} defaultOpen={status === 'thinking'} />}

      {status === 'thinking' && (
        <div className="rds-response__thinking">
          <ThinkingDots label={thinkingLabel} />
          <span className="rds-response__thinking-label" aria-hidden="true">{thinkingLabel}…</span>
        </div>
      )}

      {status === 'limited' && limitedMessage && (
        <InlineMessage appearance="information" icon="info">{limitedMessage}</InlineMessage>
      )}

      {children != null && status !== 'thinking' && (
        <div className="rds-response__content">
          {/* Plain text gets an inline caret; rich content gets it via CSS on the last text block. */}
          {children}
          {status === 'streaming' && (typeof children === 'string' || typeof children === 'number') && <StreamingCaret />}
        </div>
      )}

      {status === 'streaming' && onStop && (
        <div className="rds-response__row">
          <Button appearance="subtle" spacing="compact" iconBefore={<Icon name="stop" />} onClick={onStop}>
            Stop generating
          </Button>
        </div>
      )}

      {status === 'stopped' && (
        <div className="rds-response__row rds-response__note">
          <span>You stopped this response.</span>
          {onRegenerate && (
            <Button appearance="subtle" spacing="compact" iconBefore={<Icon name="refresh" />} onClick={onRegenerate}>
              Regenerate
            </Button>
          )}
        </div>
      )}

      {status === 'error' && (
        <InlineMessage
          appearance="danger"
          icon="error"
          action={onRetry && <Button spacing="compact" iconBefore={<Icon name="refresh" />} onClick={onRetry}>Try again</Button>}
        >
          {errorMessage}
        </InlineMessage>
      )}

      {settled && sources && sources.length > 0 && <SourceList sources={sources} />}

      {settled && (onCopy || onFeedback || onRegenerate) && status !== 'stopped' && (
        <ResponseToolbar feedback={feedback} onFeedback={onFeedback} onCopy={onCopy} onRegenerate={onRegenerate} />
      )}

      {settled && !hideDisclaimer && <AIDisclaimer />}
    </div>
  );
}

/* ------------------------------------------------------------- Toolbar */
export interface ResponseToolbarProps {
  feedback?: Feedback;
  onFeedback?: (value: Feedback) => void;
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export function ResponseToolbar({ feedback = null, onFeedback, onCopy, onRegenerate }: ResponseToolbarProps) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rds-response__toolbar" role="toolbar" aria-label="Response actions">
      {onCopy && (
        <IconButton
          appearance="subtle"
          size="small"
          label={copied ? 'Copied' : 'Copy'}
          icon={<Icon name={copied ? 'check' : 'copy'} />}
          onClick={() => {
            onCopy();
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}
        />
      )}
      {onFeedback && (
        <>
          <IconButton
            appearance="subtle"
            size="small"
            label="Good response"
            isSelected={feedback === 'up'}
            icon={<Icon name="thumbsUp" />}
            onClick={() => onFeedback(feedback === 'up' ? null : 'up')}
          />
          <IconButton
            appearance="subtle"
            size="small"
            label="Bad response"
            isSelected={feedback === 'down'}
            icon={<Icon name="thumbsDown" />}
            onClick={() => onFeedback(feedback === 'down' ? null : 'down')}
          />
        </>
      )}
      {onRegenerate && (
        <IconButton appearance="subtle" size="small" label="Regenerate" icon={<Icon name="refresh" />} onClick={onRegenerate} />
      )}
      <span className="rds-visually-hidden" aria-live="polite">{feedback ? 'Thanks for the feedback' : ''}</span>
    </div>
  );
}

/* ------------------------------------------------------------- Steps ("pop the hood") */
export function ThinkingSteps({ steps, defaultOpen = false }: { steps: ThinkingStep[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const done = steps.filter((s) => s.status === 'done').length;
  const active = steps.find((s) => s.status === 'active');
  const summary = active ? active.label : `Rovo used ${done} step${done === 1 ? '' : 's'}`;
  return (
    <div className="rds-steps">
      <button type="button" className="rds-steps__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? 'chevronDown' : 'chevronRight'} />
        <span>{summary}</span>
      </button>
      {open && (
        <ol id={id} className="rds-steps__list">
          {steps.map((s) => (
            <li key={s.id} className="rds-steps__item" data-status={s.status}>
              <span className="rds-steps__marker" aria-hidden="true">
                {s.status === 'done' ? <Icon name="check" /> : s.status === 'active' ? <span className="rds-steps__pulse" /> : null}
              </span>
              <span>
                <span className="rds-steps__label">{s.label}</span>
                {s.detail && <span className="rds-steps__detail">{s.detail}</span>}
                <span className="rds-visually-hidden">{` (${s.status})`}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Sources */
export function SourceList({ sources }: { sources: AISource[] }) {
  return (
    <div className="rds-sources">
      <span className="rds-sources__heading">
        <Icon name="sources" /> Sources
      </span>
      <ol className="rds-sources__list">
        {sources.map((s, i) => (
          <li key={s.id}>
            <a className="rds-source" href={s.href ?? '#'} target={s.href ? '_blank' : undefined} rel="noreferrer">
              <span className="rds-source__index">{i + 1}</span>
              <Icon name={s.icon ?? 'page'} />
              <span className="rds-source__title">{s.title}</span>
              {s.product && <span className="rds-source__product">{s.product}</span>}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------- Inline message */
export function InlineMessage({
  appearance,
  icon,
  action,
  children,
}: {
  appearance: 'information' | 'warning' | 'danger' | 'success';
  icon: IconName;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rds-inline-message" data-appearance={appearance} role={appearance === 'danger' ? 'alert' : undefined}>
      <span className="rds-inline-message__icon"><Icon name={icon} /></span>
      <div className="rds-inline-message__body">{children}</div>
      {action && <div className="rds-inline-message__action">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------- Disclaimer */
export function AIDisclaimer({ children = 'Uses AI. Verify results.', href }: { children?: ReactNode; href?: string }) {
  return (
    <p className="rds-disclaimer">
      {children}
      {href && (
        <>
          {' '}
          <a href={href} target="_blank" rel="noreferrer">Learn more</a>
        </>
      )}
    </p>
  );
}
