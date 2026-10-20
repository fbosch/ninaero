# Ninaero design direction

## Handheld paper with glass accents

Ninaero combines a Nintendo handheld-inspired layout with paper details and restrained glass highlights. The everyday UI uses neutral white and gray backgrounds, clear ink, squircle action buttons and dialog frames, restrained rounded fields and content panels, and small cyan accents.

Paper is the main material. Wii-style framing gives the controls their shape and shallow depth. Glass marks primary actions, selection, and floating layers. Flipnote-inspired illustration and dithering remain optional artwork.

This document records the agreed visual direction. Tidepool is the default accent, with Aurora, Lavender, Slate, Lagoon, Sky, Blossom, Lime, Anemone, and Sunflower alternatives. Primary, selection, and focus roles follow the chosen preset; structural borders stay grayscale. Paper, panels, and ordinary controls use achromatic fills and ink. Status colors remain independent of the accent, and destructive states keep semantic red.

## Reference hierarchy

| Role                       | Reference traits                                                      | Application                                             | Boundary                                                                                                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core                       | DS-like organization, ruled, dotted, and grid paper, compact layouts  | Page backgrounds and content structure                  | Use one quiet paper pattern at a time. Keep dense content on plain backgrounds.                                                                                                                                                              |
| Supporting controls        | Wii framing and shallow shading                                       | Controls, navigation, and panel frames                  | Keep ordinary edges neutral; reserve accent edges for selected states and focus. Use native squircle corners on action buttons and Dialog/AlertDialog frames. Fields, selection controls, and other panels use conventional rounded corners. |
| Signature accent           | Glass rims, soft highlights, localized glow                           | Primary actions, selected elements, and floating layers | Keep most controls matte. Glass must clarify importance or layering.                                                                                                                                                                         |
| Optional artwork           | Flipnote outlines, sparse color, discrete dithered shading            | Empty states and occasional header illustrations        | Use original artwork. Do not pixelate routine text, icons, or controls.                                                                                                                                                                      |
| Outside the everyday theme | Dense ASCII/ANSI patterns, perspective-grid orbs, geometric spectacle | Occasional standalone artwork                           | Keep these out of forms, tables, and navigation.                                                                                                                                                                                             |

The lined announcement-bar reference is the clearest bridge between paper and lightly raised controls. The DS reference itself has square controls and pixel edges. Ninaero deliberately combines handheld organization with squircle geometry on action buttons.

## Design references

This file holds the direction and shared constraints. Detailed rules live in one reference each; read the ones that cover the area you are changing.

| Reference                                                       | Read before changing                                                                                       |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [Materials and patterns](docs/design/materials.md)              | Page and panel materials, homepage waves, backdrop glass, paper patterns, overlays, or tooltip scanlines   |
| [Layout and geometry](docs/design/layout.md)                    | Spacing, control heights and insets, corner radii and squircles, CSS units, or font scaling                |
| [Color and typography](docs/design/color-and-typography.md)     | Palette roles, contrast targets, syntax colors, `type-*` utilities, or display ink                         |
| [Lighting: gradients and shadows](docs/design/lighting.md)      | Gradients, bevels, cast shadows, elevation levels, receiving-background color, or pressed recesses         |
| [Interaction, motion, and accessibility](docs/design/motion.md) | Motion timing, easing, reduced motion, focus and state cues, or animation and audio alignment              |
| [Component details](docs/design/components.md)                  | Input fields, Select, Sliders, Progress, Tabs, Dialogs, or invalid-state treatments for selection controls |
| [Specimens and moodboard](docs/design/moodboard.md)             | Design specimens or moodboard references                                                                   |

## Component recipes

| Component            | Treatment                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons              | Squircle corner curves, a fine edge, and shallow depth. Give the primary action a restrained cyan highlight. Reduce the depth on press. |
| Inputs and tables    | Plain opaque fills, clear ink, fine dividers, and an explicit focus outline. No texture or blur behind their content.                   |
| Tabs                 | Neutral segmented selection; accent-glass underline. Keep both shallower than Button and keyboard focus separate from selection.        |
| Other selection      | Pale accent fill with a defined edge. Keep selection recognizable without glow.                                                         |
| Cards                | Paper-white panels with quiet framing. Reserve stronger depth for elements that need to stand apart.                                    |
| Popovers and dialogs | Opaque grayscale interiors and neutral frames in both modes. Optional rims or backdrop blur must not tint the panel blue.               |
| Empty states         | Optional original Flipnote-inspired illustration or localized dithering, separate from the working controls.                            |

A cyan highlight is not a reason to add blur. Prefer a fill, edge, or small highlight first. Use translucency only where the element's position over another layer matters.

## Shared theme constraints

The homepage at `/` follows Afterglow's structure: a prominent heading, concise introduction, and an install command. It does not feature a composed interface example. `/docs` contains component documentation and a searchable component list in its sidebar. The standalone `/components` and `/examples` pages and their example routes are removed. `/workshop` links to separate Button, Input, Dialog, and token specimens rather than collecting every state on one page. All routes use the same theme and independent color-mode and accent controls.

Keep catalogues, token swatches, and state matrices off the homepage. Keep the accent picker in the header only. The header also has a compact, icon-only System, Dark, Light Button Group. Workshop pages remain available by URL without a detached footer link. Example compositions are not registry blocks unless explicitly registered. Keep UI text action-led and remove captions that repeat nearby labels; retain necessary preview and persistence qualifications.

- Keep shared tokens and theme rules in `registry/ninaero/theme.mjs`.
- Keep installable component styling in `registry/ninaero/ui/`.
- Do not make workshop-only styling a substitute for the installable theme.
- Treat `app/globals.css` and `registry.json` as generated outputs, not design source files.

The visual direction does not require changing component APIs or interaction behavior.

## Decisions still open

- Exact light and dark palette values.
- Type scale.
- Final Button squircle corner extent, border weights, and shadow values.
- Paper-pattern spacing and opacity.
- Where translucency is useful, and its strength.
- Motion timing for remaining components and the original illustration style.
- Browser/version support baseline for interpolation and backdrop sampling. Until it is agreed, record the browser versions used for visual review and verify the documented fallbacks.

Refine these from the specimen rather than treating moodboard images as ready-made tokens. A Button specimen is available in the workshop; broader themed components still need their own browser and interaction checks.
