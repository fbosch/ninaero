# Ninaero

An optimistic, nostalgic theme for a comfier world wide web.

Built with shadcn/ui, Base UI, and Tailwind CSS v4.

## Run locally

Use Node.js 22 or newer and the pnpm version pinned in `package.json`.

1. Run `pnpm install`.
2. Run `pnpm dev`.
3. Open [localhost:3000](http://localhost:3000).

Browse `/docs` for installation, component guides, and live examples. Use `/workshop` to test component states.

## Install in another project

Keep the local dev server running to serve the registry.

For a new project, install the complete preset:

```sh
pnpm dlx shadcn@latest init http://localhost:3000/r/ninaero.json
```

For an existing shadcn/ui project, add the theme or a component:

```sh
pnpm dlx shadcn@latest add http://localhost:3000/r/theme.json
pnpm dlx shadcn@latest add http://localhost:3000/r/button.json
```

Components include the shared theme and their dependencies.

The homepage's bubbles and waves belong to the presentation website. Installing Ninaero does not include their animation code, styles, or assets.

## Edit the theme

- Tokens and shared CSS: `registry/ninaero/theme.mjs`
- Accent presets: `registry/ninaero/accents.mjs`
- Installable components and hooks: `registry/ninaero/ui/` and `registry/ninaero/hooks/`
- Shared Mage icons: `lib/icons.tsx`
- Preview-only examples: `components/examples/`
- Homepage bubbles, waves, and their tests: `components/home-background/` (website-only)

`pnpm dev` rebuilds the theme CSS, component docs, and installable registry when their sources change. Next.js refreshes the app without a server restart. If generation fails, fix the source and save again to retry.

Run `pnpm registry:build` for a one-off rebuild outside the dev server. Do not edit `app/globals.css`, `registry.json`, `generated/component-docs.json`, or `public/r/` directly.

See [DESIGN.md](DESIGN.md) for visual guidelines. Check light and dark modes, keyboard focus, hover, pressed, disabled, and invalid states.

## Checks

```sh
pnpm check
```

Runs the production build, lint, formatting checks, typecheck, and tests.

### shadcn contracts

Run `pnpm check:shadcn` independently, or as part of `pnpm check`. It validates the registry with the installed shadcn CLI, checks installable-source boundaries and dependencies, then builds and installs all registry items in a temporary consumer with custom aliases. TypeScript compiles the installed code and representative Base UI compositions.

The committed consumer fixture covers Button, Dialog, AlertDialog, Select, Accordion, ToggleGroup, Slider, and Tooltip. The CLI version comes from `registry/ninaero/catalog.json`; upgrading it requires reviewing these contracts. This is a bounded API check, not proof of complete upstream parity.

The check uses installed packages and a pinned neutral-palette fixture instead of downloading dependencies or consulting live upstream data. It does not modify the app's generated artifacts. Browser interaction tests, visual review, and scheduled upstream drift detection remain separate work.

Before publishing, run `REGISTRY_URL=https://your-domain.example/r pnpm check:shadcn:release`. Release mode also rejects missing URLs, non-HTTPS URLs, obvious local/private hosts, and paths not ending in `/r`. It does not verify DNS or deployment reachability.

## Publish

Set `REGISTRY_URL` to your public registry directory ending in `/r`, then build:

```sh
REGISTRY_URL=https://your-domain.example/r pnpm build
```

The build embeds this URL in registry dependencies. Do not publish with the localhost default. Set the variable in the shell or deployment environment, not `.env.local`.

With `output: "export"` in `next.config.ts`, `pnpm build` writes the static site to `out/` and removes the `/workshop` pages. `pnpm dev` keeps the workshop available locally. For Cloudflare Pages, use `pnpm build` as the build command and `out` as the build directory.
