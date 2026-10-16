# AGENTS

Ninaero is an installable shadcn/ui theme with a local workshop and component documentation.

## Source boundaries

- Use pnpm, with the version pinned in `package.json`, and Node.js 22 or newer.
- Edit shared tokens and CSS rules in `registry/ninaero/theme.mjs`, and accent presets in `registry/ninaero/accents.mjs`.
- Keep installable components in `registry/ninaero/ui/` and supporting hooks in `registry/ninaero/hooks/`, not `components/ui/`. Keep preview-only code and workshop styling separate; installed components must not depend on them.
- Keep homepage bubbles, waves, and their animation helpers, styles, and tests in `components/home-background/`. They are presentation-only; do not include them in theme tokens, installable components, or registry items.
- Use existing controls from `registry/ninaero/ui/` throughout the site, including the homepage, header, settings, examples, previews, workshops, and docs. Compose library controls rather than recreating them with native elements; use native controls only when explicitly demonstrating native behavior.
- Preserve the library controls' themed appearance and interaction behavior. Prefer existing variants and sizes; use local styling for layout, not to turn a library control into a bespoke widget. For selectors such as the accent picker, start with an existing Select, ToggleGroup, or RadioGroup. If none fits, ask before introducing a custom control.
- Do not hand-edit `app/globals.css`, `registry.json`, `generated/component-docs.json`, or `public/r/`. Regenerate them with `pnpm registry:build` after changing their source. The dev command generates before starting Next.js and watches theme, registry, preview, and generator sources for live rebuilds.
- When adding a component, update `registry/ninaero/catalog.json` and its preview/documentation mappings. The generator derives dependencies from source imports and rejects missing preview mappings.

## Component behavior

- Keep Dialog and AlertDialog in separate shadcn source files backed by their own Base UI primitives. Reuse installed theme CSS and tokens for visual consistency; do not replace them with a shared React modal wrapper or import one implementation into the other.
- Preserve primitive-specific roles, dismissal, and focus behavior when restyling. AlertDialog blocks outside-click dismissal and uses explicit actions. Keep Cancel backed by its Close primitive and leave Action completion and closure to the caller. Do not add Dialog's corner close button or make every alert destructive.

## Tests

- Test observable Ninaero behavior and consumer-facing contracts through real production code. Prefer meaningful input/output and failure cases over implementation details.
- Do not assert source text, class names, selectors, exact CSS/markup, internal component structure, or generated artifacts merely matching their source. Do not emulate React hooks or stub UI components to inspect implementation details.
- Keep behavioral coverage for validation, dependency resolution, contrast calculations, and consumer compilation or installation. Verify interactions with real components and styling visually, not with string assertions.

## Checks and deployment

- For code changes, use `pnpm check` for the full build, lint, typecheck, and test sequence. The build generates registry and documentation data first. See [README.md](README.md#checks) for individual checks.
- For visual changes, inspect light and dark modes, accent presets, keyboard focus, hover, pressed, disabled, and invalid states. Automated checks do not establish visual correctness.
- Before generating deployment artifacts, set `REGISTRY_URL` in the shell or deployment environment to the public registry directory ending in `/r`. It is embedded in dependencies; do not publish artifacts built with the localhost default. The generator does not load `.env.local` automatically.

## References

- Before changing visual styling or interactions, read [DESIGN.md](DESIGN.md) for the agreed direction, accessibility requirements, and native squircle browser-support constraint.
- Before adding registry items, changing generation, or testing consumer installation, read [README.md](README.md) for the source layout and registry workflow.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
