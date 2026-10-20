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

Components include the shared theme and their dependencies. Keep the local server running during installation.

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

## Checks

```sh
pnpm check
```

Runs the production build, registry contract checks, lint, formatting checks, typecheck, and tests.

## Credits

- [shadcn/ui](https://ui.shadcn.com/) for component conventions and the registry.
- [Base UI](https://base-ui.com/) for accessible interactions.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Mage Icons](https://mageicons.com/) for icons.
- [Foley](https://github.com/eakbulut/foley) for optional sound effects.
- [TWiLight Menu++](https://github.com/DS-Homebrew/TWiLightMenu/tree/master/romsel_dsimenutheme/resources/sound/3dsmenu) for the DSi/3DS sound references. Ninaero synthesizes its own cues and does not include the recordings.

## License

MIT. See [`LICENSE`](LICENSE).
