import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../utils';
import { Icon } from '../../icons/Icon';
import { IconButton } from '../Button/Button';
import './PromptInput.css';

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  /** While true the submit button becomes Stop. Input stays editable so people can draft the next prompt. */
  isGenerating?: boolean;
  onStop?: () => void;
  placeholder?: string;
  /** Attached skills / context, e.g. <SkillsTag onRemove …/>. */
  context?: ReactNode;
  /** Left-side tools (attach, add skill). Keep to two. */
  tools?: ReactNode;
  maxRows?: number;
  isDisabled?: boolean;
  label?: string;
  className?: string;
}

export interface PromptInputHandle {
  focus: () => void;
}

/**
 * Prompt box. Enter sends, Shift+Enter adds a line. The submit/stop control is the region's
 * single Rovo-appearance button.
 */
export const PromptInput = forwardRef<PromptInputHandle, PromptInputProps>(function PromptInput(
  {
    value,
    onChange,
    onSubmit,
    isGenerating,
    onStop,
    placeholder = 'Ask, @mention, or / for skills',
    context,
    tools,
    maxRows = 8,
    isDisabled,
    label = 'Message Rovo',
    className,
  },
  ref,
) {
  const ta = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => ({ focus: () => ta.current?.focus() }));

  useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = 'auto';
    const line = parseFloat(getComputedStyle(el).lineHeight) || 20;
    el.style.height = `${Math.min(el.scrollHeight, line * maxRows)}px`;
  }, [value, maxRows]);

  const canSend = value.trim().length > 0 && !isDisabled && !isGenerating;
  const submit = () => canSend && onSubmit(value.trim());

  return (
    <div className={cx('rds-prompt-input', isDisabled && 'rds-prompt-input--disabled', className)}>
      {context && <div className="rds-prompt-input__context">{context}</div>}
      <textarea
        ref={ta}
        className="rds-prompt-input__field"
        rows={1}
        value={value}
        placeholder={placeholder}
        aria-label={label}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <div className="rds-prompt-input__bar">
        <div className="rds-prompt-input__tools">{tools}</div>
        {isGenerating ? (
          <IconButton appearance="rovo" shape="circle" label="Stop generating" icon={<Icon name="stop" />} onClick={onStop} />
        ) : (
          <IconButton
            appearance="rovo"
            shape="circle"
            label="Send"
            icon={<Icon name="arrowUp" />}
            isDisabled={!canSend}
            onClick={submit}
          />
        )}
      </div>
    </div>
  );
});
