import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cx, diffWords } from '../../utils';
import { Icon } from '../../icons/Icon';
import { RovoIcon } from '../../icons/RovoIcon';
import { Button, IconButton } from '../Button/Button';
import { GenerativeBorder } from '../GenerativeBorder/GenerativeBorder';
import { SkeletonText } from '../LoadingIndicator/LoadingIndicator';
import './Suggestion.css';

/* ================================================================ Actions */
export interface SuggestionActionsProps {
  onAccept: () => void;
  onEdit?: () => void;
  onDismiss: () => void;
  onRegenerate?: () => void;
  acceptLabel?: string;
  isDisabled?: boolean;
  /** compact for inline/toolbar use. */
  spacing?: 'default' | 'compact';
  className?: string;
}

/**
 * Accept · Edit · Dismiss (+ Regenerate). Order is fixed so muscle memory transfers between apps.
 * Accept is the region's single Rovo-appearance button; Dismiss is always the quietest.
 */
export function SuggestionActions({
  onAccept,
  onEdit,
  onDismiss,
  onRegenerate,
  acceptLabel = 'Accept',
  isDisabled,
  spacing = 'default',
  className,
}: SuggestionActionsProps) {
  return (
    <div className={cx('rds-suggestion-actions', className)} role="group" aria-label="Suggestion actions">
      <Button appearance="rovo" spacing={spacing} iconBefore={<Icon name="check" />} onClick={onAccept} isDisabled={isDisabled}>
        {acceptLabel}
      </Button>
      {onEdit && (
        <Button spacing={spacing} iconBefore={<Icon name="edit" />} onClick={onEdit} isDisabled={isDisabled}>
          Edit
        </Button>
      )}
      <Button appearance="subtle" spacing={spacing} onClick={onDismiss} isDisabled={isDisabled}>
        Dismiss
      </Button>
      {onRegenerate && (
        <IconButton
          className="rds-suggestion-actions__regen"
          appearance="subtle"
          size={spacing === 'compact' ? 'small' : 'medium'}
          label="Try another suggestion"
          icon={<Icon name="refresh" />}
          onClick={onRegenerate}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
}

/* ================================================================ Card */
export type SuggestionStatus = 'generating' | 'ready' | 'editing' | 'accepted' | 'dismissed';

export interface SuggestionCardProps {
  status: SuggestionStatus;
  /** e.g. "Improve writing", "Summarize", "Suggested reply". */
  title: string;
  /** Skill or context shown in the header (e.g. a <SkillsTag>). */
  meta?: ReactNode;
  /** Original text — enables "Show changes" diff view. */
  original?: string;
  suggestion: string;
  onAccept: (finalText: string) => void;
  onDismiss: () => void;
  onRegenerate?: () => void;
  onStatusChange?: (status: SuggestionStatus) => void;
  onUndo?: () => void;
  className?: string;
}

/**
 * AI-generated suggestion awaiting a decision. People stay in control: nothing is applied until
 * Accept, Edit keeps the AI draft as a starting point, and Accept/Dismiss are always undoable.
 */
export function SuggestionCard({
  status,
  title,
  meta,
  original,
  suggestion,
  onAccept,
  onDismiss,
  onRegenerate,
  onStatusChange,
  onUndo,
  className,
}: SuggestionCardProps) {
  const [draft, setDraft] = useState(suggestion);
  const [showDiff, setShowDiff] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const diff = useMemo(() => (original ? diffWords(original, suggestion) : null), [original, suggestion]);

  useEffect(() => setDraft(suggestion), [suggestion]);
  useEffect(() => {
    if (status === 'editing') editRef.current?.focus();
  }, [status]);

  if (status === 'accepted' || status === 'dismissed') {
    return (
      <div className={cx('rds-suggestion-receipt', className)} role="status">
        <Icon name={status === 'accepted' ? 'check' : 'cross'} />
        <span>{status === 'accepted' ? 'Suggestion applied.' : 'Suggestion dismissed.'}</span>
        {onUndo && (
          <Button appearance="subtle" spacing="compact" iconBefore={<Icon name="undo" />} onClick={onUndo}>
            Undo
          </Button>
        )}
      </div>
    );
  }

  const generating = status === 'generating';

  return (
    <GenerativeBorder isGenerating={generating} radius="large" className={cx('rds-suggestion', className)}>
      <section className="rds-suggestion__inner" aria-label={title}>
        <header className="rds-suggestion__header">
          <RovoIcon appearance="mosaic" />
          <h4 className="rds-suggestion__title">{title}</h4>
          {meta && <span className="rds-suggestion__meta">{meta}</span>}
          {diff && status === 'ready' && (
            <Button
              className="rds-suggestion__diff-toggle"
              appearance="subtle"
              spacing="compact"
              isSelected={showDiff}
              onClick={() => setShowDiff((v) => !v)}
            >
              Show changes
            </Button>
          )}
        </header>

        <div className="rds-suggestion__body">
          {generating && <SkeletonText lines={3} label={`Generating: ${title}`} />}
          {status === 'ready' &&
            (showDiff && diff ? (
              <p className="rds-suggestion__text">
                {diff.map((d, i) =>
                  d.type === 'same' ? (
                    <span key={i}>{d.text}</span>
                  ) : d.type === 'added' ? (
                    <ins key={i} className="rds-diff rds-diff--added">{d.text}</ins>
                  ) : (
                    <del key={i} className="rds-diff rds-diff--removed">{d.text}</del>
                  ),
                )}
              </p>
            ) : (
              <p className="rds-suggestion__text">{suggestion}</p>
            ))}
          {status === 'editing' && (
            <textarea
              ref={editRef}
              className="rds-suggestion__editor"
              value={draft}
              aria-label="Edit suggestion"
              rows={Math.min(8, Math.max(3, Math.ceil(draft.length / 60)))}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onStatusChange?.('ready');
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onAccept(draft);
              }}
            />
          )}
        </div>

        <footer className="rds-suggestion__footer">
          {status === 'editing' ? (
            <div className="rds-suggestion-actions">
              <Button appearance="rovo" iconBefore={<Icon name="check" />} onClick={() => onAccept(draft)} isDisabled={!draft.trim()}>
                Save and apply
              </Button>
              <Button appearance="subtle" onClick={() => { setDraft(suggestion); onStatusChange?.('ready'); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <SuggestionActions
              isDisabled={generating}
              onAccept={() => onAccept(suggestion)}
              onEdit={() => onStatusChange?.('editing')}
              onDismiss={onDismiss}
              onRegenerate={onRegenerate}
            />
          )}
        </footer>
      </section>
    </GenerativeBorder>
  );
}
