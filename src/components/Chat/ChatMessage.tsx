import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils';
import { Avatar, RovoAvatar } from '../Avatar/Avatar';
import './Chat.css';

/* ------------------------------------------------------------------ Thread */
export interface ChatThreadProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name, e.g. "Conversation with Rovo". */
  label?: string;
  density?: 'comfortable' | 'compact';
  children: ReactNode;
}

/**
 * Scrollable conversation log. role="log" + aria-live="polite" lets screen readers hear new
 * messages without interrupting. Turns are separated by space.300 (comfortable) / space.200 (compact).
 */
export function ChatThread({ label = 'Conversation with Rovo', density = 'comfortable', className, children, ...rest }: ChatThreadProps) {
  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={label}
      className={cx('rds-thread', `rds-thread--${density}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ Message */
export type ChatRole = 'user' | 'rovo' | 'system';

export interface ChatMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  role: ChatRole;
  /** Display name. Defaults to "Rovo" for rovo messages. Users usually don't see their own name. */
  author?: string;
  /** Show the author row for user messages (multi-player threads). */
  showUserAuthor?: boolean;
  timestamp?: string;
  avatarSrc?: string;
  /** Message body. For Rovo, usually an <AIResponse>. */
  children: ReactNode;
  /** Consecutive messages from the same author hide the header. */
  isGrouped?: boolean;
  /** Skip the entrance animation (e.g. history loaded on open). */
  isStatic?: boolean;
}

/**
 * Message container.
 *  - user: right-aligned neutral bubble (Rovo color is a signal, never a surface)
 *  - rovo: full-width, no bubble — long answers, tables and code read better on the surface
 *  - system: centered, quiet meta line ("Rovo used 3 sources", "Jane joined")
 */
export function ChatMessage({
  role,
  author,
  showUserAuthor,
  timestamp,
  avatarSrc,
  isGrouped,
  isStatic,
  className,
  children,
  ...rest
}: ChatMessageProps) {
  if (role === 'system') {
    return (
      <div className={cx('rds-message', 'rds-message--system', className)} {...rest}>
        <span>{children}</span>
        {timestamp && <time className="rds-message__time">{timestamp}</time>}
      </div>
    );
  }

  const name = author ?? (role === 'rovo' ? 'Rovo' : 'You');
  const showHeader = !isGrouped && (role === 'rovo' || showUserAuthor);

  return (
    <article
      aria-label={`${name}${timestamp ? `, ${timestamp}` : ''}`}
      className={cx('rds-message', `rds-message--${role}`, isGrouped && 'rds-message--grouped', isStatic && 'rds-message--static', className)}
      {...rest}
    >
      {showHeader && (
        <header className="rds-message__header">
          {role === 'rovo' ? <RovoAvatar size="small" name={name} /> : <Avatar size="small" name={name} src={avatarSrc} />}
          <span className="rds-message__author">{name}</span>
          {timestamp && <time className="rds-message__time">{timestamp}</time>}
        </header>
      )}
      <div className="rds-message__body">{children}</div>
    </article>
  );
}
