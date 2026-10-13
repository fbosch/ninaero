# AGENTS

Ninaero is an installable shadcn/ui theme with a local workshop and component documentation.

## Source boundaries

- Use pnpm, with the version pinned in `package.json`, and Node.js 22 or newer.
- Edit shared tokens and CSS rules in `registry/ninaero/theme.mjs`, and accent presets in `registry/ninaero/accents.mjs`.
- Keep installable components in `registry/ninaero/ui/` and supporting hooks in `registry/ninaero/hooks/`, not `components/ui/`. Keep preview-only code and workshop styling separate; installed components must not depend on them.
- In examples, component previews, workshops, docs, and showcase UI, use matching components from `registry/ninaero/ui/` instead of recreating library controls; use native elements only when explicitly demonstrating native behavior.
- Do not hand-edit `app/globals.css`, `registry.json`, `generated/component-docs.json`, or `public/r/`. Regenerate them with `pnpm registry:build` after changing their source. The dev command generates once before starting Next.js; rerun generation when editing theme source during development.
- When adding a component, update `registry/ninaero/catalog.json` and its preview/documentation mappings. The generator derives dependencies from source imports and rejects missing preview mappings.

## Checks and deployment

- For code changes, use `pnpm check` for the full build, lint, typecheck, and test sequence. The build generates registry and documentation data first. See [README.md](README.md#checks) for individual checks.
- For visual changes, inspect light and dark modes, accent presets, keyboard focus, hover, pressed, disabled, and invalid states. Automated checks do not establish visual correctness.
- Before generating deployment artifacts, set `REGISTRY_URL` in the shell or deployment environment to the public registry directory ending in `/r`. It is embedded in dependencies; do not publish artifacts built with the localhost default. The generator does not load `.env.local` automatically.

## References

- Before changing visual styling or interactions, read [DESIGN.md](DESIGN.md) for the agreed direction, accessibility requirements, and native squircle browser-support constraint.
- Before adding registry items, changing generation, or testing consumer installation, read [README.md](README.md) for the source layout and registry workflow.
