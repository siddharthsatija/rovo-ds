import { cx } from '../../utils';
import './LoadingIndicator.css';

/* ------------------------------------------------------------------ Thinking dots */
export interface ThinkingDotsProps {
  /** `rovo` uses the mosaic colors (generative state). `neutral` for secondary or dense UI. */
  appearance?: 'rovo' | 'neutral';
  label?: string;
  className?: string;
}

/** Rovo is working before any output exists. Swap for streamed content as soon as tokens arrive. */
export function ThinkingDots({ appearance = 'rovo', label = 'Rovo is thinking', className }: ThinkingDotsProps) {
  return (
    <span role="status" className={cx('rds-dots', className)} data-appearance={appearance}>
      <span className="rds-dots__dot" />
      <span className="rds-dots__dot" />
      <span className="rds-dots__dot" />
      <span className="rds-dots__dot" />
      <span className="rds-visually-hidden">{label}</span>
    </span>
  );
}

/* --------------------------------------------------------------- Mosaic spinner */
export interface MosaicSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

/** Four flat tiles lighting in clockwise order. For a whole Rovo surface loading (e.g. agent startup). */
export function MosaicSpinner({ size = 'medium', label = 'Loading Rovo', className }: MosaicSpinnerProps) {
  return (
    <span role="status" className={cx('rds-mosaic', `rds-mosaic--${size}`, className)}>
      <span className="rds-mosaic__tile" />
      <span className="rds-mosaic__tile" />
      <span className="rds-mosaic__tile" />
      <span className="rds-mosaic__tile" />
      <span className="rds-visually-hidden">{label}</span>
    </span>
  );
}

/* --------------------------------------------------------------- Skeleton text */
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  label?: string;
}

/** Placeholder for content whose shape is known (suggestion cards, summaries). Neutral by design. */
export function SkeletonText({ lines = 3, className, label = 'Generating content' }: SkeletonTextProps) {
  return (
    <span role="status" className={cx('rds-skeleton', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="rds-skeleton__line"
          style={{ width: i === lines - 1 && lines > 1 ? '60%' : `${100 - (i % 2) * 8}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
      <span className="rds-visually-hidden">{label}</span>
    </span>
  );
}

/* --------------------------------------------------------------- Streaming caret */
/** Appended to streaming text so people can see where Rovo is writing. Decorative. */
export function StreamingCaret({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx('rds-caret', className)} />;
}

/* --------------------------------------------------------------- Unified API */
export type LoadingIndicatorProps =
  | ({ variant: 'dots' } & ThinkingDotsProps)
  | ({ variant: 'mosaic' } & MosaicSpinnerProps)
  | ({ variant: 'skeleton' } & SkeletonTextProps);

/**
 * Pick by what you know about the wait:
 *  - dots: reply is coming, shape unknown (chat)
 *  - skeleton: shape known (card, summary) — pair with GenerativeBorder on the container
 *  - mosaic: a whole Rovo surface is starting up
 */
export function LoadingIndicator(props: LoadingIndicatorProps) {
  switch (props.variant) {
    case 'dots': { const { variant: _v, ...p } = props; return <ThinkingDots {...p} />; }
    case 'mosaic': { const { variant: _v, ...p } = props; return <MosaicSpinner {...p} />; }
    case 'skeleton': { const { variant: _v, ...p } = props; return <SkeletonText {...p} />; }
  }
}
