# AGENTS

Ninaero is an installable shadcn/ui theme with a local workshop and component documentation.

## Source boundaries

- Use pnpm, with the version pinned in `package.json`, and Node.js 22 or newer.
- Keep shared tokens and genuinely shared material, typography, and focus rules in `registry/ninaero/theme.mjs`, and accent presets in `registry/ninaero/accents.mjs`. Keep item-specific recipes and state styling in `registry/ninaero/ui/styles/` and supporting-hook styling in `registry/ninaero/hooks/styles/` alongside their installable modules; do not centralize unrelated item rules in the shared theme.
- Keep installable components in `registry/ninaero/ui/` and supporting hooks in `registry/ninaero/hooks/`, not `components/ui/`. Keep preview-only code and workshop styling separate; installed components must not depend on them.
- Use the same installable styling sources for the site and consumer registry. The local preview may assemble all items; do not maintain preview-only versions of installable recipes.
- Keep optional patterns, overlays, and accent CSS in `registry/ninaero/patterns.mjs`, `registry/ninaero/overlays.mjs`, and `registry/ninaero/accent-styles.mjs`, and list their registry items in `registry/ninaero/optional-styles.mjs`. Keep the default accent in the shared theme. Component recipes must not rely on optional artwork styles.
- Keep homepage bubbles, waves, and their animation helpers, styles, and tests in `components/home-background/`. They are presentation-only; do not include them in theme tokens, installable components, or registry items.
- Use existing controls from `registry/ninaero/ui/` throughout the site, including the homepage, header, settings, examples, previews, workshops, and docs. Compose library controls rather than recreating them with native elements; use native controls only when explicitly demonstrating native behavior.
- Preserve the library controls' themed appearance and interaction behavior. Prefer existing variants and sizes; use local styling for layout, not to turn a library control into a bespoke widget. For selectors such as the accent picker, start with an existing Select, ToggleGroup, or RadioGroup. If none fits, ask before introducing a custom control.
- Do not hand-edit `app/globals.css`, `registry.json`, `generated/component-docs.json`, or `public/r/`. Regenerate them with `pnpm registry:build` after changing their source. The dev command generates before starting Next.js and watches theme, registry, preview, and generator sources for live rebuilds.
- When adding a component, update `registry/ninaero/catalog.json` and its preview/documentation mappings. The generator derives dependencies from source imports and rejects missing preview mappings.

## Registry styling

- Use shadcn's documented `cssVars`, `css`, and `registryDependencies` mechanisms rather than adding a parallel styling runtime.
- `theme.json` installs shared foundations and the default accent. Individual items add their own styling and required dependencies. Patterns, overlays, and additional accents are opt-in; `ninaero.json` and the local preview include them all. Read [styling ownership and installation](DESIGN.md#styling-ownership-and-installation) before changing packaging, and update consumer documentation alongside packaging changes.

## Component behavior

- Build interactive components on `@base-ui/react` primitives, using shadcn-style wrappers and Ninaero's shared theme. Preserve Base UI's accessibility and interaction behavior rather than reimplementing it.
- Prefer shadcn/ui's documented Base UI component APIs, composition, variants, and semantic theme tokens. Consult the [official docs](https://ui.shadcn.com/docs) before introducing alternatives. Apply Ninaero's materials within those conventions.
- Follow [the shadow guidance](docs/design/lighting.md#shadows-and-elevation) for all UI cast shadows. Use shared layered elevation and background-aware color; establish a receiving-background context when a surface changes. Do not substitute fixed black or the control's accent for the receiving color. Keep cast shadows separate from bevels, focus, and invalid styling.
- Keep `destructive` for destructive actions and error/invalid emphasis. Add custom semantic tokens or variants only for concrete component needs, and document them as Ninaero extensions. Status palettes such as `success`, `warning`, and `info` are not baseline shadcn theme tokens.
- Keep Dialog and AlertDialog in separate shadcn source files backed by their own Base UI primitives. Reuse installed theme CSS and tokens for visual consistency; do not replace them with a shared React modal wrapper or import one implementation into the other.
- Preserve primitive-specific roles, dismissal, and focus behavior when restyling. AlertDialog blocks outside-click dismissal and uses explicit actions. Keep Cancel backed by its Close primitive and leave Action completion and closure to the caller. Do not add Dialog's corner close button or make every alert destructive.

## Tests

- Test observable Ninaero behavior and consumer-facing contracts through real production code. Prefer meaningful input/output and failure cases over implementation details.
- Do not assert source text, class names, selectors, exact CSS/markup, internal component structure, or generated artifacts merely matching their source. Do not emulate React hooks or stub UI components to inspect implementation details.
- Keep behavioral coverage for validation, dependency resolution, contrast calculations, and consumer compilation or installation. Verify interactions with real components and styling visually, not with string assertions.
- When changing registry styling or dependency ownership, extend consumer checks to install a representative item in isolation and compile its stylesheet with Tailwind. Retain whole-baseline installation and typechecking coverage; TypeScript compilation alone does not establish CSS correctness.

## Checks and deployment

- For code changes, use `pnpm check` for the full build, lint, typecheck, and test sequence. The build generates registry and documentation data first. See [README.md](README.md#checks) for individual checks.
- For visual changes, inspect light and dark modes, accent presets, keyboard focus, hover, pressed, disabled, and invalid states. Automated checks do not establish visual correctness.
- Before generating deployment artifacts, set `REGISTRY_URL` in the shell or deployment environment to the public registry directory ending in `/r`. It is embedded in dependencies; do not publish artifacts built with the localhost default. The generator does not load `.env.local` automatically.

## References

- Before changing visual styling or interactions, read [DESIGN.md](DESIGN.md) for the agreed direction and shared constraints, then the `docs/design/` references its index lists for the area you are changing. Accessibility requirements are in [motion.md](docs/design/motion.md); the native squircle browser-support constraint is in [layout.md](docs/design/layout.md#rendering-squircles).
- Before adding registry items, changing generation, or testing consumer installation, read [README.md](README.md) for the source layout and registry workflow.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
