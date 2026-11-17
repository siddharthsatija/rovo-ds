# Rovo DS

A Rovo-flavoured dialect of the Atlassian Design System (ADS): **DTCG JSON tokens → CSS custom properties**, plus **React + TypeScript** components and conversational-AI patterns.

```bash
npm install
npm run tokens     # build tokens → dist/
npm run dev        # showcase at localhost:5173
npm run build      # tokens + typecheck + single-file showcase (showcase/dist/index.html)
```

## Deploy (Vercel)

1. Push this folder to a GitHub repository (`.gitignore` already excludes generated files).
2. In Vercel: **Add New → Project**, import the repository. `vercel.json` sets everything:
   install `npm ci`, build `npm run build`, output `showcase/dist`.
3. Every push to `main` redeploys. A token or type error fails the build instead of shipping.

> Unofficial concept. Rovo and the Rovo logo are trademarks of Atlassian; this project is not affiliated with or endorsed by Atlassian.

## Structure

```
tokens/
  primitive/palette.json        raw ADS palette (from @atlaskit/tokens) — never emitted to CSS
  semantic/                     mode-independent: font, space, shape (radius/border), motion, opacity, layer, breakpoint
  themes/light|dark/            mode-dependent: color.json (color.* + elevation.surface.*), shadow.json
  variants/<name>/              optional overrides (see “Variants”)
scripts/build-tokens.mjs        Style Dictionary v4 build
dist/                           generated: css/tokens.css, js/tokens.ts, json/tokens.json
src/
  styles/global.css             imports tokens, base styles, focus ring, entrance keyframes, reduced motion
  icons/                        16px line icons (currentColor) + RovoIcon / RovoIconTile
  components/                   one folder per component (tsx + css)
showcase/                       docs site rendered from the real tokens & components
```

## Token naming

ADS convention: **`foundation.[namespace].property.modifier`**

```
color . background . danger.bold.hovered      space . 200          color . rovo . border . purple
  │         │              │                    │      │              │      │       │       │
foundation property     modifier            foundation modifier   foundation ns  property modifier
```

| Part | Required | Values |
|---|---|---|
| **foundation** | always | `color`, `elevation`, `font`, `space`, `radius`, `border`, `motion`, `opacity`, `layer`, `breakpoint` |
| **namespace** | optional | `rovo` only — for styling that exists only in AI moments |
| **property** | only for `color`, `elevation`, `font`, `border`, `motion` | `text`, `icon`, `border`, `background`, `link`, `surface`, `shadow`, `heading`, `body`, `code`, `metric`, `weight`, `family`, `width`, `duration`, `easing` |
| **modifier** | optional | chained in a fixed order: **role → emphasis → state**, or a **scale** step |

Modifier order: role (`neutral`, `brand`, `danger`, `selected`, `accent.blue`…) → emphasis (`subtlest`, `subtle`, `bold`) → state (`hovered`, `pressed`). Scale foundations use a step instead (`space.200`, `radius.large`).

Rules:
1. Name the purpose, never the value (`color.icon.success`, not `color.green`).
2. Components consume semantic tokens only; `palette.*` is never emitted to CSS.
3. A group's base token uses a `[default]` key in JSON: `color.text.[default]` → `color.text` → `--ds-text`.
4. Add a modifier only to separate two real uses.
5. Use the `rovo` namespace only for AI-specific styling; Rovo menus use core tokens.
6. Tokens not defined by ADS carry `$extensions["rovo-ds"]`.

One name, three spellings — the JSON path is the source of truth:

| JSON path | CSS | TypeScript |
|---|---|---|
| `color.background.danger.bold.hovered` | `--ds-background-danger-bold-hovered` | `token('color.background.danger.bold.hovered')` |
| `elevation.shadow.raised` | `--ds-shadow-raised` | `token('elevation.shadow.raised')` |
| `space.200` | `--ds-space-200` | `token('space.200')` |

CSS names match `@atlaskit/tokens` exactly (dots → hyphens, `--ds-` prefix, `color`/`elevation` dropped), so components here also run on real ADS tokens. `token()` is type-checked and includes the light value as a fallback.

**Extensions** (not in ADS): `color.rovo.background.message.*`, `color.rovo.background.suggestion.*`, `color.rovo.text.suggestion.removed`, `border.width.rovo.generative`, `motion.rovo.*`, `layer.*`, `breakpoint.*`.

## Theming

```html
<html data-color-mode="light | dark | auto">
```

`auto` follows the OS. `prefers-reduced-motion` collapses every duration token to `0ms`, and looping components stop.

## Variants (for generating design-system versions)

Create `tokens/variants/<name>/{shared,light,dark}/*.json` and override any semantic token — e.g. `tokens/variants/expressive/shared/radius.json`:

```json
{ "radius": { "large": { "$value": "0.75rem" } } }
```

`npm run tokens` emits **only the diff** under `[data-rovo-variant="<name>"]`, with dark-mode rules that stop light overrides leaking into dark. Put `data-rovo-variant` on the same element as `data-color-mode`.

## Components

| Component | Notes |
|---|---|
| `Button`, `IconButton` | `default · primary · subtle · warning · danger · rovo`. One `rovo` per region, never on non-AI actions. |
| `GenerativeBorder` | Hard-stopped blue → purple → saffron → lime, rotating. Only while generating. |
| `SkillsTag` | Collection → border color (Teamwork blue, Software lime, Strategy orange, Service yellow, Product purple); neutral otherwise. |
| `Avatar`, `RovoAvatar` | People are circles; agents are tiles. |
| `RovoIcon`, `RovoIconTile`, `Icon` | Sparkle marks AI actions — always with a label. |
| `Spinner` | Non-AI loading only. |

## Conversational AI patterns

| Pattern | Notes |
|---|---|
| `ChatThread`, `ChatMessage` | `role="log"`, polite live region. User = neutral right bubble; Rovo = full width, no bubble; system = centered meta. Grouping, entrance motion. |
| `AIResponse` | `thinking · streaming · complete · stopped · error · limited`. Includes `ThinkingSteps` (“pop the hood”), `SourceList`, `ResponseToolbar` (copy, 👍/👎, regenerate), `InlineMessage`, `AIDisclaimer`. |
| `LoadingIndicator` | `ThinkingDots` (shape unknown), `SkeletonText` (shape known), `MosaicSpinner` (surface startup), `StreamingCaret`. |
| `SuggestionPrompts` | `chips` (follow-ups), `cards` (landing), `list` (narrow). Staggered entrance. |
| `SuggestionCard`, `SuggestionActions` | `generating · ready · editing · accepted · dismissed`. Fixed order Accept · Edit · Dismiss · Try another; word diff; undo receipts; ⌘/Ctrl+Enter / Esc. |
| `PromptInput` | Auto-grow, Enter/Shift+Enter, context tags, Send ↔ Stop. |
| `RovoFab` | Fixed bottom-right entry point with a dismissible nudge. |

## Notes

- Token values come from `@atlaskit/tokens` (light/dark themes, typography, shape, motion). Fonts fall back to the system stack if Atlassian Sans isn't loaded.
- Icons and the agent avatar are placeholders drawn for this system — swap in `@atlaskit/icon` and the official Rovo logo/spot illustrations (Atlassian-only assets).
- `SuggestionCard`'s diff is word-level LCS, suited to paragraph-sized text.
