# Ninaero

An optimistic, nostalgic theme for a friendlier web.

Built with shadcn/ui, Base UI, and Tailwind CSS v4.

## Run locally

Use Node.js 22 or newer and the pnpm version pinned in `package.json`.

1. Run `pnpm install`.
2. Run `pnpm dev`.
3. Open [localhost:3000](http://localhost:3000).

Browse `/docs` for installation and component guides, `/examples` for composed interfaces, and `/workshop` to test component states.

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

## Edit the theme

- Tokens and shared CSS: `registry/ninaero/theme.mjs`
- Accent presets: `registry/ninaero/accents.mjs`
- Installable components and hooks: `registry/ninaero/ui/` and `registry/ninaero/hooks/`
- Shared Mage icons: `lib/icons.tsx`
- Preview-only examples: `components/examples/`

Run `pnpm registry:build` after source changes. Do not edit `app/globals.css`, `registry.json`, `generated/component-docs.json`, or `public/r/` directly.

See [DESIGN.md](DESIGN.md) for visual guidelines. Check light and dark modes, keyboard focus, hover, pressed, disabled, and invalid states.

## Checks

```sh
pnpm check
```

Runs the production build, lint, formatting checks, typecheck, and tests.

## Publish

Set `REGISTRY_URL` to your public registry directory ending in `/r`:

```sh
REGISTRY_URL=https://your-domain.example/r pnpm build
pnpm start
```

The build embeds this URL in registry dependencies. Do not publish with the localhost default. Set the variable in the shell or deployment environment, not `.env.local`.
