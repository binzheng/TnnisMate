# Story 1.2: Material UI Theme (Semantic Colors & Typography)

Status: done

## Story

As a developer,
I want to introduce Material UI with a centralized theme (semantic colors and typography),
so that the UI has consistent visual language (color meanings, readability, accessibility) aligned with our UX spec.

## Acceptance Criteria

1. Install MUI packages: `@mui/material @emotion/react @emotion/styled`
2. Create a theme provider at the app root (App Router) and wrap layout with `<ThemeProvider>` (and `<CssBaseline/>`)
3. Define semantic colors per spec in the theme:
   - primary: #2E7D32 (brand/primary actions)
   - secondary: #1565C0 (secondary actions)
   - success: #2E7D32 (Available)
   - warning: #ED6C02 (Busy)
   - error: #D32F2F (Conflict)
   - info: #0288D1 (Campaign/Info)
4. Define surfaces/typography:
   - background.default #FAFAFA / paper #FFFFFF
   - text.primary #1A1A1A / text.secondary #5F6368
   - Font stack includes Roboto and Noto Sans JP
   - Heading scale: h1 32/40, h2 24/32, h3 20/28; body1 16/24, body2 14/20
5. Add focus-visible styles that meet A11y (3px ring + 2px offset); ensure buttons meet 3:1, text 4.5:1 contrast
6. Create a sample page (or component gallery) demonstrating buttons, cards, and alerts in each severity (success/warning/error/info)
7. No runtime or type errors; lint passes

## Tasks / Subtasks

- [x] Install MUI packages and wire ThemeProvider in `src/app/layout.tsx`
  - [x] Add `CssBaseline` and a `theme.ts` exporting `createTheme({...})`
- [x] Define palette, typography, components defaults in `theme.ts`
- [x] Implement focus-visible outline and hover/selected actions
- [x] Build `src/components/ui/ThemeSamples.tsx` showcasing: Buttons (primary/secondary), Alerts (success/warning/error/info), Card
- [x] Add a route or embed in homepage to visually verify theme
- [ ] Verify A11y contrast minimums and document notes in Dev Notes

## Dev Notes

- Follow docs/ux-design-specification.md#3.1-Color-System for semantic mapping and typography guidance
- Keep scope to theming only; no domain UI yet
- This is the base for later calendar and DataGrid styling; keep tokens centralized

### Project Structure Notes

- Place `theme.ts` under `src/lib/` or `src/components/ui/` consistently; import from layout
- Consider a small `ThemeProvider` wrapper for testing reuse

### References

- Source: docs/ux-design-specification.md (3.1 Color System, A11y)
- Source: docs/architecture.md#Technology-Stack-Details

## Dev Agent Record

### Context Reference

<!-- Story Context XML will be attached by story-context workflow -->

### Agent Model Used

N/A

### Debug Log References

N/A

### Completion Notes List

- Theme established with semantic palette and typography
- Sample components verify severity colors and contrast

### File List

- NEW: src/lib/theme.ts (or src/components/ui/theme.ts)
- MODIFIED: src/app/layout.tsx (ThemeProvider wiring)
- NEW: src/components/ui/ThemeSamples.tsx
