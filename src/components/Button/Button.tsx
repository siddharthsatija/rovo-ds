import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils';
import { Spinner } from '../Spinner/Spinner';
import './Button.css';

export type ButtonAppearance = 'default' | 'primary' | 'subtle' | 'warning' | 'danger' | 'rovo';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /**
   * `rovo` marks the single most important Rovo action in a region (e.g. prompt submit, Accept).
   * Never use it for non-AI actions, and never on more than one button per region.
   */
  appearance?: ButtonAppearance;
  spacing?: 'default' | 'compact';
  iconBefore?: ReactNode;
  iconAfter?: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  isSelected?: boolean;
  shouldFitContainer?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    appearance = 'default',
    spacing = 'default',
    iconBefore,
    iconAfter,
    isLoading,
    isDisabled,
    isSelected,
    shouldFitContainer,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'rds-button',
        `rds-button--${appearance}`,
        spacing === 'compact' && 'rds-button--compact',
        shouldFitContainer && 'rds-button--fit',
        isLoading && 'rds-button--loading',
        className,
      )}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-busy={isLoading || undefined}
      data-selected={isSelected || undefined}
      {...rest}
    >
      {iconBefore && <span className="rds-button__icon">{iconBefore}</span>}
      {children != null && <span className="rds-button__label">{children}</span>}
      {iconAfter && <span className="rds-button__icon">{iconAfter}</span>}
      {isLoading && (
        <span className="rds-button__spinner">
          <Spinner size="small" label="Loading" />
        </span>
      )}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, 'iconBefore' | 'iconAfter' | 'children' | 'shouldFitContainer'> {
  icon: ReactNode;
  /** Required: becomes aria-label and tooltip text. */
  label: string;
  shape?: 'default' | 'circle';
  size?: 'small' | 'medium' | 'large';
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, shape = 'default', size = 'medium', className, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      aria-label={label}
      title={label}
      className={cx(
        'rds-icon-button',
        `rds-icon-button--${size}`,
        shape === 'circle' && 'rds-icon-button--circle',
        className,
      )}
      iconBefore={icon}
      {...rest}
    />
  );
});
