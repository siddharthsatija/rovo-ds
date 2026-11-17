import { useLayoutEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import './GenerativeBorder.css';

export interface GenerativeBorderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Only true while AI is actively generating this content. Never use as decoration,
   * and don't combine with another eye-catching indicator (dots, spinners) on the same element.
   */
  isGenerating: boolean;
  /** Show a quiet 1px border while idle (true), or nothing (false). */
  showIdleBorder?: boolean;
  radius?: 'medium' | 'large' | 'xlarge' | 'xxlarge';
  /** Hold the mosaic still (documentation and diagrams). */
  isStatic?: boolean;
  children: ReactNode;
}

/**
 * Rovo mosaic border. Flat, hard-stopped blue → purple → saffron → lime (clockwise)
 * rotating slowly. Never gradients, blurs or tints. Static mosaic under reduced motion.
 */
export function GenerativeBorder({
  isGenerating,
  showIdleBorder = true,
  radius = 'large',
  isStatic,
  className,
  children,
  ...rest
}: GenerativeBorderProps) {
  // Colour boundaries run through the corners, so each side carries one colour
  // (left blue, top purple, right saffron, bottom lime) whatever the aspect ratio.
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const set = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width && height) el.style.setProperty('--rds-gb-corner', `${(Math.atan2(width, height) * 180) / Math.PI}deg`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cx('rds-genborder', `rds-genborder--${radius}`, className)}
      data-generating={isGenerating || undefined}
      data-idle-border={showIdleBorder || undefined}
      data-static={isStatic || undefined}
      {...rest}
    >
      <div className="rds-genborder__content" aria-busy={isGenerating || undefined}>
        {children}
      </div>
    </div>
  );
}
