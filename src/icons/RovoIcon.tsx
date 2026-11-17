import { Icon, type IconSize } from './Icon';
import { cx } from '../utils';

export interface RovoIconProps {
  label?: string;
  size?: IconSize;
  /** "mono" inherits text color (toolbars, menus). "mosaic" uses Rovo icon colors (AI suggestion cards). */
  appearance?: 'mono' | 'mosaic';
  className?: string;
}

/** The AI sparkle. Always pair with a visible text label unless the meaning is unmistakable. */
export function RovoIcon({ label, size = 'small', appearance = 'mono', className }: RovoIconProps) {
  return (
    <span className={cx('rds-rovo-icon', className)} data-appearance={appearance}>
      <Icon name="aiSparkle" size={size} label={label} />
    </span>
  );
}

export interface IconTileProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

/** Sparkle on a Rovo brand tile — for AI actions that need more prominence. Pair with text. */
export function RovoIconTile({ size = 'small', label, className }: IconTileProps) {
  return (
    <span className={cx('rds-icon-tile', size !== 'small' && `rds-icon-tile--${size}`, className)}>
      <Icon name="aiSparkle" size={size === 'large' ? 'medium' : 'small'} label={label} />
    </span>
  );
}
