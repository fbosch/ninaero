<div align="center">
  <img src="public/dolphin.svg" alt="Ninaero dolphin logo" width="110">
  <h1>Ninaero</h1>
  <p>
    <a href="https://main.ninaero.pages.dev">Preview</a> ·
    <a href="https://main.ninaero.pages.dev/docs">Documentation</a>
  </p>
</div>

An optimistic, nostalgic shadcn/ui theme for a comfier world wide web.

Ninaero is in development.

## Requirements

To run this repository:

- Node.js 22 or newer
- The pnpm version pinned in [`package.json`](package.json)

## Install

Start the [local server](#run), then install the complete preset in a new project:

```sh
pnpm dlx shadcn@latest init http://localhost:3000/r/ninaero.json
```

Or add the theme or a component to an existing shadcn/ui project:

```sh
pnpm dlx shadcn@latest add http://localhost:3000/r/theme.json
pnpm dlx shadcn@latest add http://localhost:3000/r/button.json
```

`theme.json` installs shared tokens, fonts, materials, typography, focus and accessibility rules, and the default Tidepool accent. Each component adds its own styling and required components or hooks. `ninaero.json` installs the complete baseline, including patterns, overlays, and every accent preset. Keep the local server running during installation.

Optional styles install independently and include the shared theme:

| Styles                                 | Registry item        |
| -------------------------------------- | -------------------- |
| Paper backgrounds and element textures | `patterns.json`      |
| Page-wide textures                     | `overlays.json`      |
| An additional accent preset            | `accent-<name>.json` |

For example, install Aurora:

```sh
pnpm dlx shadcn@latest add http://localhost:3000/r/accent-aurora.json
```

Select an installed preset with `data-accent="aurora"` on the root element or a subtree. Additional accent names are `aurora`, `lavender`, `slate`, `lagoon`, `sky`, `blossom`, `lime`, `anemone`, and `sunflower`. Tidepool is included in the shared theme.

Highlighted code loads only the active accent's light/dark Shiki pair and caches it for reuse. Other pairs stay lazy-loaded. Accent changes keep the current highlighting visible until the new pair is ready; light/dark switches reuse the loaded pair through CSS.

## Run

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start the development server:

   ```sh
   pnpm dev
   ```

3. Open [localhost:3000](http://localhost:3000). Browse [the docs](http://localhost:3000/docs) for component guides or [the workshop](http://localhost:3000/workshop) to test component states.

The dev server regenerates theme CSS, component docs, and registry files when their sources change. See [DESIGN.md](DESIGN.md) for visual guidelines and its index of detailed references in `docs/design/`.

Shared foundations live in `registry/ninaero/theme.mjs`. Component recipes live in `registry/ninaero/ui/styles/`, and supporting-hook recipes live in `registry/ninaero/hooks/styles/`. Optional styles live in `registry/ninaero/patterns.mjs`, `registry/ninaero/overlays.mjs`, and `registry/ninaero/accent-styles.mjs`, with their published items listed in `registry/ninaero/optional-styles.mjs`. Registry entries carry recipes in shadcn's `css` field. The local preview assembles those same sources for all items. Do not edit the generated `app/globals.css`, `registry.json`, or `public/r/` files.

## Checks

```sh
pnpm check
```

Runs the production build, registry contract checks, lint, formatting checks, typecheck, and tests. The registry check installs the shared foundations, optional styles, representative individual components, and the complete baseline into isolated consumers, then compiles their TypeScript and Tailwind CSS using only their declared dependencies.

Run `pnpm check:shadcn` for the registry checks alone. It scans each consumer's installed TypeScript and TSX sources and reports compiled, minified, and gzipped CSS sizes in bytes. Gzip applies to the minified stylesheet. Sizes exclude JavaScript and font assets. Compare runs with the same fixtures and tool versions; the reports do not enforce size budgets.

## Credits

- [shadcn/ui](https://ui.shadcn.com/) for component conventions and the registry.
- [Base UI](https://base-ui.com/) for accessible interactions.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Mage Icons](https://mageicons.com/) for icons.
- [Foley](https://github.com/eakbulut/foley) for optional sound effects.
- [TWiLight Menu++](https://github.com/DS-Homebrew/TWiLightMenu/tree/master/romsel_dsimenutheme/resources/sound/3dsmenu) for the DSi/3DS sound references. Ninaero synthesizes its own cues and does not include the recordings.

## License

MIT. See [`LICENSE`](LICENSE).
