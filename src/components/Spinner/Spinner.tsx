import { cx } from '../../utils';
import './Spinner.css';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

/** Neutral, non-AI loading (page data, saving). For AI generation, use the Rovo loading indicators. */
export function Spinner({ size = 'medium', label = 'Loading', className }: SpinnerProps) {
  return (
    <span role="status" className={cx('rds-spinner', `rds-spinner--${size}`, className)}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28 100" />
      </svg>
      <span className="rds-visually-hidden">{label}</span>
    </span>
  );
}
