import type { SVGProps } from 'react';
import { cx } from '../utils';
import './Icon.css';

/**
 * 16px-grid line icons, drawn for this system (placeholders until wired to @atlaskit/icon).
 * All use currentColor so the parent's color token (color.icon.*) drives them.
 */
export type IconSize = 'small' | 'medium' | 'large';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Accessible label. Omit for decorative icons next to visible text. */
  label?: string;
  size?: IconSize;
}

const star = (cx: number, cy: number, r: number) => {
  const k = r * 0.28;
  return `M${cx} ${cy - r}L${cx + k} ${cy - k}L${cx + r} ${cy}L${cx + k} ${cy + k}L${cx} ${cy + r}L${cx - k} ${cy + k}L${cx - r} ${cy}L${cx - k} ${cy - k}Z`;
};
const Spark = ({ cx, cy, r = 2.25 }: { cx: number; cy: number; r?: number }) => (
  <path d={star(cx, cy, r)} fill="currentColor" stroke="none" />
);

const paths = {
  aiSparkle: (
    <>
      <path d="M7 1.75 8.35 5.4a2 2 0 0 0 1.25 1.25L13.25 8 9.6 9.35A2 2 0 0 0 8.35 10.6L7 14.25 5.65 10.6A2 2 0 0 0 4.4 9.35L.75 8 4.4 6.65A2 2 0 0 0 5.65 5.4z" fill="currentColor" stroke="none" />
      <path d="M13 .75 13.5 2.5 15.25 3 13.5 3.5 13 5.25 12.5 3.5 10.75 3 12.5 2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  aiChat: (
    <>
      <path d="M2.75 3.75a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5H7l-3 2.75v-2.75h0a1.25 1.25 0 0 1-1.25-1.25z" />
      <path d="M8 4.5 8.6 6.1 10.25 6.75 8.6 7.4 8 9 7.4 7.4 5.75 6.75 7.4 6.1z" fill="currentColor" stroke="none" />
    </>
  ),
  arrowUp: <path d="M8 13V3.5M3.75 7.5 8 3.25l4.25 4.25" />,
  stop: <rect x="4" y="4" width="8" height="8" rx="1.5" fill="currentColor" stroke="none" />,
  check: <path d="m3 8.5 3.25 3.25L13 5" />,
  cross: <path d="M4 4l8 8M12 4l-8 8" />,
  edit: <path d="M10.5 2.75a1.77 1.77 0 0 1 2.5 2.5L5.5 12.75 2.5 13.5l.75-3z M9.25 4l2.75 2.75" />,
  copy: (
    <>
      <rect x="5.25" y="5.25" width="8" height="8" rx="1.5" />
      <path d="M10.75 5.25V3.75a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1.5" />
    </>
  ),
  thumbsUp: <path d="M5 7.25v6.25M5 7.25 7.5 2.5a1.5 1.5 0 0 1 1.75 1.75L8.75 6.5h3.5a1.25 1.25 0 0 1 1.23 1.47l-.9 4.5a1.25 1.25 0 0 1-1.23 1.03H2.75v-6.25z" />,
  thumbsDown: <path d="M11 8.75V2.5m0 6.25L8.5 13.5a1.5 1.5 0 0 1-1.75-1.75l.5-2.25h-3.5a1.25 1.25 0 0 1-1.23-1.47l.9-4.5A1.25 1.25 0 0 1 4.65 2.5h8.6v6.25z" />,
  refresh: <path d="M13 8a5 5 0 1 1-1.46-3.54M13 2.75v2.5h-2.5" />,
  chevronDown: <path d="m4 6 4 4 4-4" />,
  chevronRight: <path d="m6 4 4 4-4 4" />,
  info: (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 7.25V11" />
      <circle cx="8" cy="5" r=".25" fill="currentColor" />
    </>
  ),
  warning: (
    <>
      <path d="M7.13 2.5a1 1 0 0 1 1.74 0l5.2 9.25A1 1 0 0 1 13.2 13.25H2.8a1 1 0 0 1-.87-1.5z" />
      <path d="M8 6.25V9" />
      <circle cx="8" cy="11" r=".25" fill="currentColor" />
    </>
  ),
  error: (
    <>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 5v3.5" />
      <circle cx="8" cy="11" r=".25" fill="currentColor" />
    </>
  ),
  link: <path d="M6.75 9.25a2.5 2.5 0 0 0 3.54 0l2-2a2.5 2.5 0 0 0-3.54-3.54l-.5.5M9.25 6.75a2.5 2.5 0 0 0-3.54 0l-2 2a2.5 2.5 0 0 0 3.54 3.54l.5-.5" />,
  add: <path d="M8 3v10M3 8h10" />,
  page: (
    <>
      <path d="M4.25 1.75h5l3 3v8.5a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-10.5a1 1 0 0 1 1-1z" />
      <path d="M9 1.75v3.25h3.25M5.75 8.25h4.5M5.75 10.75h3" />
    </>
  ),
  undo: <path d="M5.5 6.5H10a3 3 0 0 1 0 6H7M5.5 6.5 3 4M5.5 6.5 3 9" />,
  more: (
    <>
      <circle cx="3.5" cy="8" r=".75" fill="currentColor" />
      <circle cx="8" cy="8" r=".75" fill="currentColor" />
      <circle cx="12.5" cy="8" r=".75" fill="currentColor" />
    </>
  ),
  search: <path d="M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM13.5 13.5 10.6 10.6" />,
  attach: <path d="M13 7.5 8 12.5a3.18 3.18 0 0 1-4.5-4.5l5.25-5.25a2.12 2.12 0 0 1 3 3L6.5 11a1.06 1.06 0 0 1-1.5-1.5L10 4.5" />,
  sources: <path d="M2.75 3.25h4a1.5 1.5 0 0 1 1.25.67 1.5 1.5 0 0 1 1.25-.67h4V12h-4a1.5 1.5 0 0 0-1.25.67A1.5 1.5 0 0 0 6.75 12h-4zM8 3.92V12.7" />,
  minimize: <path d="M3.5 8h9" />,
  aiEdit: (
    <>
      <path d="M8.5 4.25 10.75 6.5 4.75 12.5 2.25 13.25 3 10.75z" />
      <Spark cx={12.25} cy={10.75} />
    </>
  ),
  aiSearch: (
    <>
      <path d="M6.75 11.75a4.5 4.5 0 1 1 3.5-1.7M10.25 10.25l3.25 3.25" />
      <Spark cx={6.75} cy={7.25} r={1.75} />
    </>
  ),
  aiSummarize: (
    <>
      <path d="M2.5 4h11M2.5 7.5h11M2.5 11h5" />
      <Spark cx={11.75} cy={11.75} />
    </>
  ),
  aiRemix: <path d="M2.5 4.5h2.25c1.5 0 2.5.75 3.25 2l1 1.5c.75 1.25 1.75 2 3.25 2h1.25M12 8.5l1.5 1.5-1.5 1.5M2.5 11.5h2.25c1 0 1.75-.35 2.35-1M9.25 6.25c.6-.6 1.35-1 2.25-1h2M12 3.75l1.5 1.5-1.5 1.5" />,
  aiWand: (
    <>
      <path d="m2.75 13.25 7.5-7.5M9 4.5l2.5 2.5" />
      <Spark cx={12.25} cy={3.25} r={1.75} />
      <Spark cx={5} cy={3.5} r={1.25} />
    </>
  ),
  aiPresent: (
    <>
      <path d="M2.25 3.25h8M2.25 3.25v6.5a1 1 0 0 0 1 1h9.5a1 1 0 0 0 1-1V7.5M8 10.75v2.5M5.5 13.25h5" />
      <Spark cx={12.5} cy={3.5} />
    </>
  ),
  workItem: (
    <>
      <rect x="2.25" y="2.25" width="11.5" height="11.5" rx="2" />
      <path d="m5.25 8.25 2 2 3.75-4.25" />
    </>
  ),
  listBullet: (
    <>
      <path d="M6 4.25h7.5M6 8h7.5M6 11.75h7.5" />
      <circle cx="3" cy="4.25" r=".6" fill="currentColor" />
      <circle cx="3" cy="8" r=".6" fill="currentColor" />
      <circle cx="3" cy="11.75" r=".6" fill="currentColor" />
    </>
  ),
  expand: <path d="M9.5 2.75h3.75V6.5M6.5 13.25H2.75V9.5M13.25 2.75 9 7M2.75 13.25 7 9" />,
} as const;

export type IconName = keyof typeof paths;
export const iconNames = Object.keys(paths) as IconName[];

export function Icon({ name, label, size = 'small', className, ...rest }: IconProps & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('rds-icon', `rds-icon--${size}`, className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
