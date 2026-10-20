# Color and typography

Part of the [Ninaero design direction](../../DESIGN.md).

## Color and typography

Ninaero is neutral-first in both color modes. Page backgrounds, cards, popovers, menus, dialogs, field fills, ordinary borders, default paper patterns, and cast shadows use grayscale values. Dark panels are charcoal or gray, not blue-black. A token named neutral must actually be achromatic, not merely unchanged across accent presets.

Reserve the chosen accent for primary actions, links, selected controls, active states, and keyboard focus. Secondary and Outline controls keep neutral materials. Feedback colors retain their semantic meaning. Syntax highlighting and data marks may use color to distinguish content, while their containers stay neutral. Popover and menu containers use the neutral card palette independently of Button material tokens; their selected items and controls may use the accent.

Code syntax tokens use bundled Shiki themes chosen for each accent in light and dark mode. Only token colors are applied; theme italics and other font treatments are ignored. Colors that fall below 4.5:1 are adjusted toward neutral ink while retaining their hue. Uncolored code text and the containing surface remain neutral.

Keep resting neutral borders close to their surrounding fills, using pale gray in light mode and charcoal in dark mode. Resting borders have no 3:1 contrast minimum.

Require at least 4.5:1 contrast for text, links, placeholders, and error text against their backgrounds. Keyboard-focus outlines and selected or invalid boundaries need at least 3:1 against adjacent surfaces. Existing palette checks cover [accent text and focus](../../scripts/lib/__tests__/accent-theme.test.mjs), [field text and placeholders](../../scripts/lib/__tests__/input-theme.test.mjs), [selection and invalid boundaries](../../scripts/lib/__tests__/checkbox-theme.test.mjs), and [destructive text](../../scripts/lib/__tests__/destructive-theme.test.mjs).

| Role                  | Direction                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| Light background      | White or off-white grayscale paper                                        |
| Content panels        | Opaque white or gray fills                                                |
| Text and strong edges | Clear, dark ink                                                           |
| Main accent           | Cyan-blue                                                                 |
| Selection             | Pale cyan fill with a defined edge                                        |
| Feedback colors       | Additional colors communicate meaning rather than decorate each component |
| Dark background       | Charcoal with lighter neutral-gray panels                                 |

Use Google Sans Flex for interface text and headings, with its `ROND` axis set to `100` for rounded terminals. Self-host the full variable font in both the site and installed theme. Keep weight on the standard weight axis. Pixel lettering belongs in optional artwork, not labels, paragraphs, or error messages.

Typography roles live in `registry/ninaero/theme.mjs` as `type-*` utilities. Keep font sizes separate so existing component sizes and responsive field text remain intact.

| Utility        | Role                                        | Weight | Line height | Letter spacing |
| -------------- | ------------------------------------------- | ------ | ----------- | -------------- |
| `type-display` | Page and hero headings                      | 650    | 1.15        | -0.025em       |
| `type-heading` | Section headings                            | 650    | 1.25        | -0.015em       |
| `type-title`   | Card, dialog, and panel titles              | 650    | 1.375       | -0.01em        |
| `type-body`    | Interface text, descriptions, and errors    | 400    | 1.5         | Normal         |
| `type-prose`   | Continuous prose on plain backgrounds       | 400    | 1.625       | Normal         |
| `type-label`   | Buttons, tabs, navigation, and field labels | 550    | 1.25rem     | Normal         |
| `type-caption` | Small supporting text                       | 400    | 1rem        | Normal         |

Large hero headings may opt into `ninaero-display-ink`, a two-stop neutral ink gradient with a faint downward glyph shadow. Keep the top lighter than the bottom in both modes, with no colored glow or pronounced bevel. The homepage uses this treatment only on its neutral heading text; its accent tagline uses a more vivid color derived from the selected preset. Section headings, card and dialog titles, and control text remain solid. In forced-colors mode, remove the gradient and shadow and use system text colors.

Use tighter tracking only for headings and titles. Keep control text, body copy, and small supporting text at normal spacing. Compact controls override the label line height to `1rem`. Dialog and AlertDialog titles keep their `1.5rem` line height, and textareas keep their responsive `1.5rem` / `1.25rem` line heights. Ruled prose shares its line height with `--ninaero-paper-step`. Allow labels, descriptions, and errors to wrap without clipping. Use semibold emphasis within body copy without changing its line height.

Dark mode keeps the same framing, hierarchy, and restrained cyan accent. It should not become a separate neon dashboard. Adjust texture, fills, and highlights for readability instead of mechanically inverting the light theme.
