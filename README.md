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

## Optional sound effects

The standard registry includes Foley support. Sound is off by default; Foley loads in the browser only when a `SoundProvider` is enabled.

```tsx
import { SoundProvider } from "@/components/ui/sound-provider";

<SoundProvider enabled={soundsEnabled} theme="glass" volume={0.35}>
  {children}
</SoundProvider>;
```

Keep `soundsEnabled` in application state and provide an accessible mute control. Ninaero does not persist this setting. Without a provider, controls stay silent.

Button plays `tap` on activation. Switch, Checkbox, and Toggle play distinct `on` and `off` cues. Dropdown Menu, Select, Combobox, Command, Tabs, Radio Group, and Toggle Group use `tap` when a user chooses an option. Menu, select, combobox, and command navigation use quiet `tick` cues with pitch following position. Slider ticks follow the value and play `tap` on commit. Typing stays silent.

Interactive controls play a quiet `hover` cue on mouse or pen entry. Dropdown options and search results keep their position-pitched navigation ticks instead. Hover feedback respects disabled states, local `sound={false}` settings, and provider scopes; touch entry and typing do not play hover cues.

With the default `glass` theme, Ninaero's active cues use short, dry sounds tuned against the [DSi/3DS system sounds in TWiLight Menu++](https://github.com/DS-Homebrew/TWiLightMenu/tree/master/romsel_dsimenutheme/resources/sound/3dsmenu). The registry synthesizes these approximations and does not include the reference recordings.

| Cues                  | Reference and adaptation                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `hover`, `tick`       | Cursor stop/select clicks. Hover is lower and softer; navigation keeps its position-based pitch.                    |
| `tap`                 | A single, shortened note from the rising page-change cue.                                                           |
| `on`, `off`           | The back cue's open fifth, ordered upward or downward to distinguish state changes.                                 |
| `ping`                | A brief, quiet version of that open fifth.                                                                          |
| `success`, `complete` | The page-change and launch pitches, adapted into short rising figures. Completion resolves higher and lasts longer. |
| `warning`, `error`    | The boundary beep, transposed down. Warning repeats; error falls.                                                   |
| `loading`             | A quieter, lower page-change figure that plays once, not a loop.                                                    |

Other Foley cues and the explicit `soft`, `default`, and `mechanical` themes retain their original sound.

Toast uses `ping`, `success`, `warning`, `error`, or `loading` for a new notification or a change of type. Progress plays `complete` only when its value reaches its maximum, not when it mounts already complete. Trigger application-specific async feedback through `useSound()` when work actually starts or finishes.

Set `sound={false}` on a control or selection root to opt out. Dropdown Menu Radio Group can also opt out as a group, and `Toaster sound={false}` silences notification cues without muting its child controls. Cancelled actions, form resets, initial selections, and ordinary rerenders stay silent.

Use `const { play } = useSound()` for application feedback such as `play("success")` or `play("tick", { pitch: 4, volume: 0.25 })`. Per-cue pitch is in semitones; volume is a multiplier from 0 to 1. Sound supplements visible feedback. The newest cue replaces the previous cue from that provider; disabling or unmounting stops playback. Browsers require a user interaction before audio can play, and cues are not queued while Foley loads.

The site enables sound for the header on every route and for the homepage. Docs content stays silent unless an individual preview explicitly enables its own provider.

SoundProvider supports Foley's `glass` (default), `soft`, `default`, and `mechanical` themes and a volume from 0 to 1. Sound failures call `onError` when supplied, or log an error. This is a Ninaero extension backed by [Foley](https://github.com/eakbulut/foley), not a shadcn theme token or a separate registry.

## Simple slider

Use `<Slider variant="simple" aria-label="Volume" defaultValue={35} />` for compact, monochrome controls such as volume bars. This Ninaero extension uses a thin neutral track and a small round thumb, without the default Slider's accent fill or raised grip. Keyboard, touch, disabled, and invalid behavior stay the same.

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

### Overlay compensation

The opt-in body texture compensates neutral page backgrounds for its estimated average color shift. The site also uses the compensated colors for the header gradient and the homepage's neutral underlay. Semantic tokens, text, controls, modal scrims, and homepage artwork keep their original colors.

This Ninaero extension uses relative CSS colors, typed arithmetic, and CSS `if()`. It follows light/dark mode, opacity, pattern density, and multiply, screen, or normal blending without JavaScript. Browsers without those features retain the original fill. Compensation is disabled in forced-colors mode and print.

Set `--ninaero-overlay-compensation: 0` to compare with the original finish; the default is `1`. Custom masks need a `--ninaero-overlay-coverage` value between 0 and 1. The built-in estimates are 0.5 for Checker, 0.25 for lines, 0.125 for Flipnote, and circle area divided by tile area for dots.

The calculation targets average sRGB color, not perceived brightness or individual texture marks. It supports opaque neutral fills and neutral ink, not colored artwork or arbitrary translucent backdrops. The original texture opacity is preserved. Corrective background colors clip at black and white, so those extremes retain an unavoidable average shift rather than fading the pattern.

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
