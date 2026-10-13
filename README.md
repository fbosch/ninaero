# Ninaero

A neutral starting point for a Nintendo and Frutiger Aero-inspired shadcn/ui theme.

The baseline uses Next.js App Router, React, TypeScript, Tailwind CSS v4, Base UI, and pnpm. It follows [Afterglow](https://github.com/thebuilder/afterglow)'s separation of theme source, installable components, and preview code. It does not copy Afterglow's visual design or documentation platform.

## Run the workshop

1. Install dependencies with `pnpm install`. Use Node.js 22 or newer and the pnpm version in `package.json`.
2. Run `pnpm dev`.
3. Open `http://localhost:3000/workshop/buttons`. Open Appearance for color mode and Accent, or use the side-by-side Cyan, Indigo, Lavender, and Slate buttons to choose a palette. Compare Light and Dark modes, then try Test action and keyboard focus.

Accent and color mode are independent and persist separately when browser storage is available. Borders follow the accent; paper, ink, and destructive colors stay unchanged. To use a preset in another project, set `data-accent="cyan"`, `data-accent="indigo"`, `data-accent="lavender"`, or `data-accent="slate"` on `<html>`; add the `dark` class for dark mode.

The dev and production build commands generate the theme and registry before starting Next.js. If port 3000 is occupied, stop that server or explicitly use a matching registry URL and Next.js port.

## Edit the theme

1. Change semantic tokens, Tailwind mappings, or shared CSS rules in `registry/ninaero/theme.mjs`.
2. Run `pnpm registry:build`. Next.js reloads the generated CSS while the dev server is running.
3. Inspect the gallery in both light and dark modes, including hover, keyboard focus, disabled, and invalid states.

`app/globals.css` and `registry.json` are generated. Do not edit them directly. The same token source feeds the local preview and the installable theme.

Nunito Sans is the default interface and heading font. The site self-hosts it with `next/font/google`; theme installs include the `font-nunito-sans` registry item. Font metadata and the shared font stack live in `registry/ninaero/theme.mjs`.

| Path                             | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `registry/ninaero/theme.mjs`     | Theme source and light/dark tokens                                      |
| `registry/ninaero/accents.mjs`   | Cyan, Indigo, Lavender, and Slate preset source and generated selectors |
| `registry/ninaero/ui/`           | Installable component source                                            |
| `registry/ninaero/hooks/`        | Installable supporting hooks                                            |
| `registry/ninaero/catalog.json`  | Upstream catalogue snapshot and item descriptors                        |
| `components/examples/`           | Preview-only interactive examples                                       |
| `app/page.tsx`                   | Minimal homepage with one composed example                              |
| `app/examples/`                  | Composed example gallery, preview, and code pages                       |
| `app/workshop/`                  | Separate Button, Input, Dialog, and token specimens                     |
| `app/components/page.tsx`        | Component overview route                                                |
| `components/overview/`           | Catalogue thumbnails and interactive preview examples                   |
| `lib/component-overview.ts`      | Overview groups, descriptions, and search                               |
| `app/docs/`                      | Getting started, theme guide, and all component documentation routes    |
| `components/docs/`               | Searchable navigation, live examples, and copyable code                 |
| `scripts/lib/component-docs.mjs` | Extract consumer examples and API signatures from current source        |
| `generated/component-docs.json`  | Generated documentation data, ignored by Git                            |
| `app/site.css`                   | Workshop-only styling                                                   |
| `scripts/build-registry.mjs`     | Generate shared CSS and registry manifest                               |
| `public/r/`                      | Generated shadcn registry artifacts, ignored by Git                     |

Add components with `pnpm exec shadcn add <component>`. The configured aliases put UI files in `registry/ninaero/ui/` and hooks in `registry/ninaero/hooks/`. Add their descriptors to `registry/ninaero/catalog.json`; the registry build supplements package and item dependencies from the current source imports.

## Component catalogue

The snapshot in `registry/ninaero/catalog.json` contains all 62 concrete UI components from the upstream Base UI catalogue, including both Base UI Toast and Sonner, plus the mobile hook and utilities. It was resolved with shadcn CLI 4.21.4 using the `base-nova` style. The upstream `form` entry has no files or dependencies and is recorded under `excluded`. Field components are included for composing forms.

The homepage at `/` presents one settings example. `/examples` lists composed interfaces, with preview and code at `/examples/settings` and a preview-only page at `/examples/settings/preview`. The settings form saves only in React memory; it has no account API or persistence. `/workshop` links to separate Button, Input, Dialog, and token specimens. The `/components` overview groups all 62 components into preview cards, with search, interactive preview dialogs, and links to their documentation and registry JSON. Thumbnails are inert and hidden from assistive technology; use each card's Preview button to interact with its example.

Each component also has a page at `/docs/<component>`, with an interactive preview, copyable install command, standalone usage example, exported API signatures and defaults, and registry source. `/docs` covers installation; `/docs/theme` covers the shared tokens. The documentation sidebar searches component names and descriptions. Theme switching applies to every route.

Code examples, source files, API signatures, and commands use server-rendered Shiki syntax highlighting. Colors follow the light/dark theme selector; Copy uses the original plain-text code. The browser only receives highlighted markup, not the highlighter.

Documentation data is generated alongside the registry from the installed component files and live preview modules. The build fails on missing source or preview mappings; tests compile all 62 standalone examples with consumer aliases. API signatures are shown as written in the wrappers, not as expanded references for every inherited Base UI or native HTML prop.

The complete preset includes every catalogue entry and the shared theme. Individual installs include their package dependencies and other Ninaero components or hooks they import.

## Install into another project

Start the workshop first so its registry is available.

For a new project, initialize with the complete preset:

```sh
pnpm dlx shadcn@latest init http://localhost:3000/r/ninaero.json
```

In an existing, initialized shadcn/ui project, install the theme or a component:

```sh
pnpm dlx shadcn@latest add http://localhost:3000/r/theme.json
pnpm dlx shadcn@latest add http://localhost:3000/r/button.json
```

Each component declares the shared theme as a registry dependency. The dialog also declares the button. These are current Tailwind v4/Base UI components, not compatibility replacements for an older shadcn setup.

## Build and publish

Set `REGISTRY_URL` to the public registry directory before generating deployment artifacts:

```sh
REGISTRY_URL=https://your-domain.example/r pnpm build
pnpm start
```

The URL is embedded in component and preset dependencies. It defaults to `http://localhost:3000/r` for local development; do not publish artifacts generated with that local default. Pass it in the shell or deployment environment. `.env.example` documents the setting; the generator does not load `.env.local` automatically.

Deploy the Next.js app to serve the gallery and `/r/*.json`, or host the generated registry JSON files separately at the configured URL. No hosting provider, domain, or deployment automation is configured.

## Checks

- `pnpm registry:build`: generate CSS/manifest and build the registry with shadcn schema validation.
- `pnpm lint`: lint JavaScript and TypeScript with Oxlint.
- `pnpm format`: format supported files with Oxfmt.
- `pnpm format:check`: check Oxfmt formatting.
- Pre-commit: Lefthook formats staged files with Oxfmt and lints staged JavaScript/TypeScript files with Oxlint.
- `pnpm typecheck`: Next.js route types and TypeScript.
- `pnpm test`: catalogue and documentation coverage, compiled usage examples, source-derived dependencies, token consistency, and invalid configuration.
- `pnpm check`: production build, lint, formatting, typecheck, and tests.

Paper and ink tokens remain neutral. Primary, selection, and focus tokens follow the chosen accent preset. Button is the first fully styled component, with native CSS squircle corners and a paper-background specimen at `/`. See [DESIGN.md](DESIGN.md) for the direction and browser-support requirement. MDX documentation and analytics remain outside this baseline.

## References

- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui registry](https://ui.shadcn.com/docs/registry)
- [Base UI](https://base-ui.com/react/overview/quick-start)
- [Afterglow theme source](https://github.com/thebuilder/afterglow/blob/main/registry/terminal/theme.mjs)
