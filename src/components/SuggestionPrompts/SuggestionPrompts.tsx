import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../utils';
import { Icon } from '../../icons/Icon';
import './SuggestionPrompts.css';

export interface SuggestedPrompt {
  id: string;
  /** What gets sent. Write it as the user would type it, in the first person. */
  label: string;
  /** Cards layout only: one line on why/what it does. */
  description?: string;
  icon?: ReactNode;
}

export interface SuggestionPromptsProps {
  prompts: SuggestedPrompt[];
  onSelect: (prompt: SuggestedPrompt) => void;
  /**
   * chips — follow-ups after a response (2–4, short)
   * cards — empty-state / landing starters (3–6, with descriptions)
   * list  — narrow panels
   */
  layout?: 'chips' | 'cards' | 'list';
  heading?: string;
  /** Staggered entrance. Turn off when the list re-renders often. */
  animate?: boolean;
  className?: string;
}

/** Prompt starters: suggest a next step that opens or continues a chat. */
export function SuggestionPrompts({ prompts, onSelect, layout = 'chips', heading, animate = true, className }: SuggestionPromptsProps) {
  return (
    <section className={cx('rds-prompts', `rds-prompts--${layout}`, className)} aria-label={heading ?? 'Suggested prompts'}>
      {heading && <h3 className="rds-prompts__heading">{heading}</h3>}
      <ul className={cx('rds-prompts__list', animate && 'rds-stagger')}>
        {prompts.map((p, i) => (
          <li key={p.id} style={{ '--rds-i': i } as CSSProperties}>
            <button type="button" className="rds-prompt" onClick={() => onSelect(p)}>
              <span className="rds-prompt__icon">{p.icon ?? <Icon name="aiChat" />}</span>
              <span className="rds-prompt__text">
                <span className="rds-prompt__label">{p.label}</span>
                {layout === 'cards' && p.description && <span className="rds-prompt__description">{p.description}</span>}
              </span>
              {layout === 'list' && <Icon name="arrowUp" className="rds-prompt__go" />}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
