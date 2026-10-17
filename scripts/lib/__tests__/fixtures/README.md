# shadcn contract fixtures

`shadcn-consumer.tsx.txt` is a reviewed, committed API baseline for the catalog's Base UI style and CLI version. It covers representative public compositions, not every upstream export. The text extension keeps custom consumer aliases out of the app's TypeScript compilation. The check copies it into the temporary consumer as TypeScript.

Reference the official Base UI component docs when updating it:

- https://ui.shadcn.com/docs/components/base/button
- https://ui.shadcn.com/docs/components/base/dialog
- https://ui.shadcn.com/docs/components/base/alert-dialog
- https://ui.shadcn.com/docs/components/base/select
- https://ui.shadcn.com/docs/components/base/accordion
- https://ui.shadcn.com/docs/components/base/toggle-group
- https://ui.shadcn.com/docs/components/base/slider

`shadcn-neutral.json` pins https://ui.shadcn.com/r/colors/neutral.json as retrieved on 2026-10-17 with CLI 4.21.4. The real installer requests this palette even for local registry files. The check serves it over loopback and rejects unpinned routes. This fixture is installer input, not Ninaero's theme.

Review CLI upgrades and fixture updates together. Keep intentional catalog exclusions documented in `registry/ninaero/catalog.json`. Do not regenerate the expected API examples from Ninaero source, since that would hide regressions. Browser interactions and visual parity are outside this fixture's coverage.
