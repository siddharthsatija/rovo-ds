import type { ReactNode } from 'react';
import { cx } from '../../utils';
import { Icon } from '../../icons/Icon';
import './SkillsTag.css';

/** Collection → color: Teamwork blue, Software lime, Strategy orange, Service yellow, Product purple. */
export type SkillCollection = 'teamwork' | 'software' | 'strategy' | 'service' | 'product';

export interface SkillsTagProps {
  /** Skill name, lowercase and hyphenated: "create-work-item". */
  label: string;
  /** Omit for 2P/3P, platform, generic or custom skills → neutral gray. */
  collection?: SkillCollection;
  /** App logo (keeps its own colors) or a neutral icon for what the skill does. Defaults to the AI sparkle. */
  iconBefore?: ReactNode;
  /** Makes the tag a button (e.g. pick a skill in the prompt box). */
  onClick?: () => void;
  /** Shows a remove control (e.g. a skill already attached to a prompt). */
  onRemove?: () => void;
  isSelected?: boolean;
  className?: string;
}

/** The primary visual identifier for a Rovo skill: collection-colored slash, icon, label. */
export function SkillsTag({ label, collection, iconBefore, onClick, onRemove, isSelected, className }: SkillsTagProps) {
  const body = (
    <>
      <span className="rds-skills-tag__icon">{iconBefore ?? <Icon name="aiSparkle" />}</span>
      <span className="rds-skills-tag__label" title={label.length > 28 ? label : undefined}>{label}</span>
    </>
  );
  return (
    <span
      className={cx('rds-skills-tag', onClick && 'rds-skills-tag--interactive', className)}
      data-collection={collection ?? 'neutral'}
      data-selected={isSelected || undefined}
    >
      {onClick ? (
        <button type="button" className="rds-skills-tag__main" onClick={onClick} aria-pressed={isSelected}>
          {body}
        </button>
      ) : (
        <span className="rds-skills-tag__main">{body}</span>
      )}
      {onRemove && (
        <button type="button" className="rds-skills-tag__remove" onClick={onRemove} aria-label={`Remove ${label}`}>
          <Icon name="cross" />
        </button>
      )}
    </span>
  );
}
