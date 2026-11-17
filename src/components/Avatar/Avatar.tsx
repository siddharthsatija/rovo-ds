import { cx } from '../../utils';
import { Icon } from '../../icons/Icon';
import './Avatar.css';

export type AvatarSize = 'small' | 'medium' | 'large';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

/** Person avatar. Falls back to initials on a neutral fill. */
export function Avatar({ name, src, size = 'medium', className }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span className={cx('rds-avatar', `rds-avatar--${size}`, className)} role="img" aria-label={name}>
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials}</span>}
    </span>
  );
}

export interface RovoAvatarProps {
  size?: AvatarSize;
  /** Agent name, e.g. "Rovo" or a custom agent. */
  name?: string;
  /** Agent avatars are square-ish tiles so AI is never mistaken for a person. */
  className?: string;
}

/** Placeholder agent avatar (sparkle on Rovo brand tile). Swap in the official Rovo logo asset. */
export function RovoAvatar({ size = 'medium', name = 'Rovo', className }: RovoAvatarProps) {
  return (
    <span className={cx('rds-avatar', 'rds-avatar--agent', `rds-avatar--${size}`, className)} role="img" aria-label={name}>
      <Icon name="aiSparkle" size={size === 'large' ? 'medium' : 'small'} />
    </span>
  );
}
