import type { ReactNode } from 'react';
import { cx } from '../../utils';
import { Icon } from '../../icons/Icon';
import { IconButton } from '../Button/Button';
import './RovoFab.css';

export interface RovoFabProps {
  onClick: () => void;
  isOpen?: boolean;
  label?: string;
  /** Contextual suggestion shown beside the button. Proactive — keep it rare, specific and dismissible. */
  nudge?: { message: ReactNode; actionLabel?: string; onAction?: () => void; onDismiss: () => void };
  /**
   * Placement is fixed (bottom-right) on purpose — do not reposition per app.
   * `contained` exists only for docs/demos, pinning to the nearest positioned ancestor.
   */
  contained?: boolean;
  className?: string;
}

/** Persistent / proactive entry point to Rovo. */
export function RovoFab({ onClick, isOpen, label = 'Ask Rovo', nudge, contained, className }: RovoFabProps) {
  return (
    <div className={cx('rds-fab', contained && 'rds-fab--contained', className)}>
      {nudge && !isOpen && (
        <div className="rds-nudge" role="status">
          <div className="rds-nudge__message">{nudge.message}</div>
          <div className="rds-nudge__actions">
            {nudge.actionLabel && nudge.onAction && (
              <button type="button" className="rds-nudge__action" onClick={nudge.onAction}>
                {nudge.actionLabel}
              </button>
            )}
            <IconButton appearance="subtle" size="small" label="Dismiss suggestion" icon={<Icon name="cross" />} onClick={nudge.onDismiss} />
          </div>
        </div>
      )}
      <IconButton
        appearance="rovo"
        shape="circle"
        size="large"
        className="rds-fab__button"
        label={isOpen ? 'Close Rovo' : label}
        aria-expanded={isOpen}
        icon={<Icon name={isOpen ? 'cross' : 'aiSparkle'} size="medium" />}
        onClick={onClick}
      />
    </div>
  );
}
