---
name: EA.AI
description: Rental AI Expert Advisors for MT5, shown with dated forward-test and backtest numbers.
colors:
  cobalt: "#3549d1"
  cobalt-deep: "#2b3bb0"
  cobalt-wash: "#f0f3fe"
  cobalt-selection: "#c5d0fa"
  profit: "#127a50"
  profit-wash: "#ecf8f2"
  loss: "#b8382b"
  loss-wash: "#fdf1f0"
  caution: "#b98010"
  ink: "#151a23"
  ink-strong: "#353c48"
  ink-muted: "#5b6574"
  ink-faint: "#6f7988"
  stroke: "#cdd4dd"
  rule: "#e3e8ee"
  fill-subtle: "#eef1f5"
  ground: "#f6f8fa"
  surface: "#ffffff"
  scrim: "#0c1018"
typography:
  display:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 6vw, 56px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\" 1, \"cv11\" 1"
  lead:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
  figure:
    fontFamily: "Geist, Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\" 1"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "36px"
  button-ink-hover:
    backgroundColor: "#232933"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.md}"
    padding: "0 20px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.ground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.fill-subtle}"
    textColor: "{colors.ink}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "20px"
  tag:
    backgroundColor: "{colors.fill-subtle}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-item-active:
    backgroundColor: "{colors.fill-subtle}"
    textColor: "{colors.ink}"
  header:
    backgroundColor: "{colors.surface}"
    height: "56px"
    padding: "0 24px"
---

# Design System: EA.AI

## Overview

**Creative North Star: "The Quiet Ledger"**

EA.AI is a financial tool, and it looks like one. Everything sits on white sheets over a cool grey-blue ground, with hairline rules where other products use boxes. The content is mostly figures: win rate, drawdown, net profit, balance. The visual system steps back so those figures can be read and compared at a glance. It works the way a well-kept statement does. Nothing in it tries to excite; it tries to be exact.

The tone is restrained and almost monochrome. Ink and a grey ramp carry nearly every surface. Cobalt appears only where the user can act or where focus lands. Green and red appear only to show which way the money moved. Type is Geist for Latin text and Anuphan for Thai, both in one sans stack, so mixed Thai and English lines keep one voice. Every numeral is tabular. Depth comes from soft, low shadows and 1px rules, never from color or glow.

The density is moderate. The landing page breathes (80px section rhythm, a 56px display line). App pages are working surfaces: 36px controls, 14px body text, tables with a ground-colored header row. Both share one header height (56px), one wordmark, and one radius family.

**Key Characteristics:**
- White surface on a cool #f6f8fa ground; 1px #e3e8ee hairlines separate things.
- One cobalt accent, used for actions and focus only.
- Green and red mean profit and loss, nothing else.
- Geist and Anuphan in one stack; weights 400, 500 and 600 only; tabular numerals everywhere.
- Small radii (4, 6, 8px) and soft, short, neutral shadows.

## Colors

A cool neutral ramp tinted slightly toward blue, plus one cobalt and a reserved profit/loss pair. Tailwind's slate, gray, blue, indigo, violet, purple, emerald, green, rose, red and amber scales are remapped in `globals.css` onto this palette, so any utility class resolves to a system color. Ant Design reads the same values through `AntdProvider`.

### Primary
- **Cobalt** (#3549d1): Primary buttons, links, focus outlines (2px, 2px offset), Ant Design `colorPrimary`, and the admin entry in the account menu. Indigo, violet and purple all collapse into this one hue.
- **Deep Cobalt** (#2b3bb0): Hover and pressed state for cobalt controls.
- **Cobalt Wash** (#f0f3fe): Hover fill behind cobalt text items, such as the admin menu link.
- **Selection Cobalt** (#c5d0fa): Text selection background only.

### Secondary
- **Ledger Green** (#127a50): Profit. Positive net profit, win counts, success and buy tags, up candles. The wash (#ecf8f2) is used only behind a profit figure, as on the dashboard Profit tile.
- **Ledger Red** (#b8382b): Loss. Max drawdown, loss counts, error and sell tags, down candles, sell markers, destructive actions. The wash (#fdf1f0) is used only behind a loss figure.

### Tertiary
- **Ochre** (#b98010): Ant Design `colorWarning`, used for pending and due states. It is never decorative.

### Neutral
- **Ink** (#151a23): Primary text, the wordmark, and the dark "ink" button.
- **Strong Ink** (#353c48): Secondary-button text and emphasized body text.
- **Muted Ink** (#5b6574): Supporting text, stat and count labels, table header text, chart axis text, Ant Design `colorTextSecondary`.
- **Faint Ink** (#6f7988): The ".AI" half of the wordmark, the second line of the hero, placeholders and divider captions. It is the lightest grey allowed for readable text.
- **Stroke** (#cdd4dd): Input and secondary-button borders, Ant Design `colorBorder`, scrollbar thumb.
- **Rule** (#e3e8ee): Hairlines, card and empty-state borders, header and sidebar edges, table row dividers, chart grid border.
- **Subtle Fill** (#eef1f5): Active nav item, hover fills, default tag background.
- **Ground** (#f6f8fa): Page background, table header rows, alternate landing sections.
- **Surface** (#ffffff): Cards, header, sidebar, modals, inputs.
- **Scrim** (#0c1018): Image-preview overlay at 85% opacity.

### Named Rules
**The One Accent Rule.** Cobalt marks what can be clicked or what has focus. In charts it is also the one data-series color: the price line and the buy marker. Outside a chart, a label, heading, icon tile or figure is never cobalt.

**The Money Colors Rule.** Green and red appear only on profit/loss figures, P&L, buy/sell and active/expired status, chart candles, and destructive actions. A tinted tile pairs its wash with the deep text step: Profit Wash with green #0f6342, Loss Wash with red #962d23. They are never decoration or a brand tint.

## Typography

**Display Font:** Geist (with Anuphan for Thai, then ui-sans-serif, system-ui)
**Body Font:** Same stack
**Label/Mono Font:** Geist Mono, used only for code and API values

**Character:** One sans family for both scripts. Geist gives the figures a crisp, engineered look. Anuphan matches its x-height and stroke so Thai sentences sit in the same line without a change in color. Hierarchy comes from size and a 400/500/600 weight step, never from heavy or black weights.

### Hierarchy
- **Display** (600, 40px mobile to 56px desktop, line-height 1.05, -0.03em): The landing H1 only. Two lines, with the second line in Faint Ink.
- **Headline** (600, 28px to 32px, tight tracking): Landing section headings.
- **Page Title** (600, 22px, tight tracking): The H1 of every app page, above a 1px rule with the user's email underneath in 14px Muted Ink.
- **Title** (600, 15 to 17px): Card headers (15px via Ant Design), modal titles (17px), the wordmark (17px). Model symbols on result sheets go up to 24px.
- **Body** (400, 14px, Ant Design base): App text, table cells and forms. The landing page uses 16px body text and an 18px lead with relaxed leading, capped near 28rem.
- **Label** (500, 13px, sentence case): Stat labels above a figure (Balance, Equity, Profit), form labels, and table headers (Muted Ink on Ground). Placeholders are also sentence case. Captions and meta lines use 12 to 13px.

### Named Rules
**The Tabular Figures Rule.** The body sets `font-feature-settings: "tnum" 1, "cv11" 1` globally. Figures that line up in tables or stat lists also take the `.num` class (tabular-nums, -0.01em). Every money figure, percentage, count and date range uses it, and numbers in tables are right-aligned.

**The Count Label Rule.** Page and section counts read as a Muted Ink label followed by the number in Ink, weight 600, with `.num` ("Total EA 4", "Total bills 12", "Total accounts 2").

**The Three Weights Rule.** Use 400 for reading, 500 for labels and controls, and 600 for headings and key figures. Bold (700) and black (900) are not part of the system.

## Layout

The landing page is a single column of full-width bands inside a centered 72rem (1152px) container, with 16px gutters on mobile and 24px from md up. Sections alternate between Surface and Ground, are divided by 1px rules, and use 64px vertical padding (80px from md). The hero is a two-column grid (1fr / 1.15fr) from lg, with copy on the left and an 8px-framed demo video on the right. Below the hero is a full-width figures table. Below sm it becomes a stacked list of definition rows, one bordered block per model.

App pages share a fixed shell. The 56px white header sits on top. Under it, a 256px white sidebar with a right-hand rule can collapse to 0. The main area is on Ground, scrolls independently, and has 16px padding (32px from md). Content is capped at 80rem (1280px) with 32px between blocks. Each page opens with a title row that sits on a bottom rule: the page title on the left, and the count label, meta and actions on the right. Every authenticated page uses this shell, the document page included.

The spacing rhythm is built on 4px: 8 and 12px inside controls, 16 to 24px inside cards (20px on model sheets), 20 to 32px between cards, and 64 to 80px between landing sections. Controls are 36px tall in the app (Ant Design `controlHeight`), 40px in modals and forms, and 44px for the hero call to action.

## Elevation & Depth

The system is mostly flat, with soft shadows used sparingly. Rules and the surface-on-ground contrast carry the structure. Shadows are short, neutral (tinted toward rgb 16 24 40), and low in opacity. They tell you which things float, not which things matter. Buttons have no shadow (Ant Design `primaryShadow`, `defaultShadow` and `dangerShadow` are all `none`).

### Shadow Vocabulary
- **Hairline lift** (`box-shadow: 0 1px 2px rgb(16 24 40 / 0.05)`): Cards and model sheets resting on Ground.
- **Base** (`box-shadow: 0 1px 3px rgb(16 24 40 / 0.07), 0 1px 2px rgb(16 24 40 / 0.04)`): Ant Design's default `boxShadow`.
- **Popover** (`box-shadow: 0 12px 28px -8px rgb(16 24 40 / 0.14), 0 2px 6px rgb(16 24 40 / 0.05)`): Account dropdown, Ant Design popups, and the landing demo-video frame.
- **Overlay** (`box-shadow: 0 20px 40px -12px rgb(16 24 40 / 0.18)`): Large modal panels only.

### Named Rules
**The Float-Only Shadow Rule.** A resting card gets at most the hairline lift. Larger shadows are for things that float above the page (menus, popovers, modals). Shadows are never colored, and they never grow on hover.

## Shapes

Corners are small and consistent. Use 4px for tags, small badges and the image-hover chip; 6px for buttons, inputs, nav items and menu rows (Ant Design `borderRadius`); and 8px for cards, tables, modals, the dropdown and the video frame (Ant Design `borderRadiusLG`). Full circles are only for the avatar, numbered step markers in the docs, and 6px status dots. Borders are 1px: Rule (#e3e8ee) on cards and dividers, Stroke (#cdd4dd) on inputs and secondary buttons. Empty states sit in a solid 1px Rule box. Images (equity curves, screenshots) are clipped inside a 6px bordered frame on a Ground fill.

**The Small Corner Rule.** No surface gets a corner larger than 8px. Cards, tiles, empty states and modals on every page use 8px. `globals.css` still clamps `rounded-xl`, `rounded-2xl` and `rounded-3xl` to 10, 12 and 14px as a safety net, but they are not part of the system.

## Components

### Buttons
Quiet, flat and exact.
- **Shape:** Gently squared (6px).
- **Primary:** Cobalt fill, white text, weight 500. 40px tall in forms, 44px for the hero CTA with 24px side padding. Hover goes to Deep Cobalt, with a color transition only. Disabled drops to 60% opacity.
- **Ink:** Ink fill, white text. Used in the landing nav "Log in", the pricing CTA and the document step markers. It is the second strong action when cobalt is already taken on the screen. Hover goes to #232933.
- **Secondary:** White with a 1px Stroke border and Strong Ink text. Hover fills with Ground and darkens the border to Faint Ink. Used for "ดูผลทดสอบ" and "Continue with Google".
- **Ghost:** Transparent with Muted Ink text, 36px tall. Hover fills with Subtle Fill and moves the text to Ink. Used for nav links, the sidebar toggle, "Log out" and the preview close button.
- **Focus:** Global 2px Cobalt outline with a 2px offset.

### Chips / Tags
- **Style:** Ant Design Tag at its default 4px radius on a Subtle Fill default, weight 500 to 600, with text in its natural case. Semantic colors are `success` (profit, buy, active), `error` (loss, sell, expired), and warning (Ochre, for pending).
- **Meta badge:** 12px Muted Ink text in a 1px Rule-bordered 4px box, such as "MT5" on a model sheet.

### Cards / Containers
- **Corner Style:** 8px.
- **Background:** Surface on Ground.
- **Shadow Strategy:** Hairline lift at most (see Elevation).
- **Border:** 1px Rule.
- **Internal Padding:** 20px, or 24px from md for form cards.
- Cards do not nest. Inside a card, separate groups with rules or with a Ground band, not with another bordered card.

### Inputs / Fields
- **Style:** 40px tall, 1px Stroke border, 6px radius, white fill, Faint Ink placeholder. The label sits above in 13 to 14px weight 500, Strong Ink.
- **Focus:** The border turns Cobalt and a 2px Cobalt Wash ring (#e1e7fd) appears, with a shadow-only transition.
- **OTP:** A 56px tall field with 30px tabular digits tracked wide and centered.

### Tables
- Wrapped in an 8px Rule-bordered frame. The header row is Ground with weight 500 Muted Ink text, and rows are separated by Rule hairlines. Hovering a row fills it with Ground (Ant Design `Table.rowHoverBg`). Numeric columns are right-aligned and use `.num`, with net profit in Ledger Green and drawdown in Ledger Red. The landing figures table orders its columns Model, Win rate, Max drawdown, Net profit, Profit factor, so the risk figure sits right after the win rate. Below sm it becomes a stacked list: the model name at weight 500, then label/value rows with Muted Ink labels and tabular values, in the same order.

### Navigation
- **Header:** White, 56px tall, with a bottom Rule. On the left are a ghost hamburger and the wordmark ("EA" in Ink, ".AI" in Faint Ink, 17px weight 600). On the right are a 32px avatar (hover ring in Rule) and a ghost "Log out" that hides its label below sm.
- **Account menu:** A 224px white panel with an 8px radius, Rule border and Popover shadow. Rows are 14px, 6px radius, with a Subtle Fill hover. The admin link sits below a rule in Cobalt with a Cobalt Wash hover. It opens with the 240ms fade-and-rise.
- **Sidebar:** 256px white column with a right-hand Rule. Items are 14px with 8 / 12px padding, a 6px radius and 12px side inset. Inactive items are Muted Ink with a Ground hover. The active item is Ink, weight 500, on Subtle Fill, with `aria-current="page"`. The column collapses its width over 300ms.

### Empty States
- A white 8px box with a solid 1px Rule border and 40 to 48px padding, holding Ant Design's simple Empty illustration (`Empty.PRESENTED_IMAGE_SIMPLE`). The description is next-step copy that names the action ("select an account, symbol, timeframe and model above, then press Add"). It never says only "No data".

### Stat Tiles
- A white 8px tile with a 1px Rule border and 16px padding. A 13px weight-500 Muted Ink label sits above a 24px weight-600 figure with line-height 1. The Profit tile switches to Profit Wash or Loss Wash with deep green or red text.

### Mini Chart
- A Lightweight Charts surface on a transparent background with Muted Ink axis text (#5b6574) and a Rule grid border (#e3e8ee). Candles are up in Ledger Green and down in Ledger Red. The line series and buy markers are Cobalt, and sell markers are Ledger Red. The line's area fill fades from the series color to transparent, and this is the only gradient in the system.

### Model Result Sheet (signature)
A white 8px card with a hairline lift. The 24px symbol title has a 13px Muted Ink meta line underneath and an "MT5" badge on the right. Next comes a 208px equity-curve image in a 6px bordered frame that zooms on click, with a "ดูภาพขยาย" chip that appears on hover and focus. Last are two stat blocks (Forward test, Backtest). Each has a 13px title and its date range on a bottom rule, followed by a two-column definition list: 13px Muted Ink labels on the left, 14px weight 500 tabular values on the right, and Ledger Green or Ledger Red on money rows. The date range always sits next to the figures, and drawdown always appears beside win rate.

### Image Preview
A full-screen Scrim at 85% opacity that fades in. The image is limited to 85vh with a 6px radius and a white backing. A ghost close button in white sits at the top right. The animation is disabled under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** put every surface on the Ground (#f6f8fa) / Surface (#ffffff) pair and separate it with 1px Rule (#e3e8ee) lines.
- **Do** keep Cobalt (#3549d1) for buttons, links, focus and the chart series. Use the Ink button for the second strong action.
- **Do** set every figure with tabular numerals (`.num`) and right-align numeric table columns.
- **Do** show a test's date range next to its figures, and put drawdown in Ledger Red right after the win rate.
- **Do** keep corners at 4, 6 or 8px and shadows at the hairline lift for resting cards.
- **Do** use page titles at 22px weight 600 with a bottom rule. Use labels, placeholders and tags in sentence case at 13px weight 500 in Muted Ink.
- **Do** give every empty state next-step copy inside a solid Rule box.

### Don't:
- **Don't** use gradient backgrounds, glass or backdrop blur, or colored shadows on surfaces or controls. The chart area fade is the one exception.
- **Don't** color a text figure, label or badge Cobalt outside a chart. Cobalt means "you can act here."
- **Don't** set status in uppercase pills. Use an Ant Design Tag at 4px in natural case.
- **Don't** put a card inside a card, or use corners above 8px.
- **Don't** use weights above 600.
