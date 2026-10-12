# Ninaero design direction

## Handheld paper with glass accents

Ninaero combines a Nintendo handheld-inspired layout with paper details and restrained glass highlights. The everyday UI uses cool off-white backgrounds, clear ink, rounded controls, and small cyan accents.

Paper is the main material. Wii-style framing gives the controls their shape and shallow depth. Glass marks primary actions, selection, and floating layers. Flipnote-inspired illustration and dithering remain optional artwork.

This is the agreed visual direction, not a description of the current implementation. The repository still starts from a neutral shadcn/ui Base UI baseline. Exact tokens, fonts, and interaction details need a design specimen before implementation.

## Reference hierarchy

| Role | Reference traits | Application | Boundary |
| --- | --- | --- | --- |
| Core | DS-like organization, fine paper lines, compact layouts | Page backgrounds and content structure | Use one quiet paper pattern at a time. Keep dense content on plain backgrounds. |
| Supporting controls | Wii rounded framing, shallow shading, cyan edging | Controls, navigation, and panel frames | Prefer rounded rectangles. Do not turn every control into a pill. |
| Signature accent | Glass rims, soft highlights, localized glow | Primary actions, selected elements, and floating layers | Keep most controls matte. Glass must clarify importance or layering. |
| Optional artwork | Flipnote outlines, sparse color, discrete dithered shading | Empty states and occasional header illustrations | Use original artwork. Do not pixelate routine text, icons, or controls. |
| Outside the everyday theme | Dense ASCII/ANSI patterns, perspective-grid orbs, geometric spectacle | Occasional standalone artwork | Keep these out of forms, tables, and navigation. |

The lined announcement-bar reference is the clearest bridge between paper and rounded, lightly raised controls. The DS reference itself has square controls and pixel edges. Rounded framing is a deliberate adaptation for Ninaero, not a literal DS trait.

## Materials and layout

- Start with faint horizontal ruling as the main paper pattern. Grid and dotted patterns are alternatives for specific contexts, not additional textures to stack over the ruling.
- Keep inputs, tables, and long text on opaque, plain backgrounds. Paper texture must not interfere with their content.
- Use rounded rectangles with fine edges and shallow depth. Preserve straight alignment in lists, tables, and compact forms.
- Keep cards and ordinary controls mostly matte. Avoid heavy bevels, console bezels, and large glossy gradients.
- Put glass on a small number of important elements. Readable content stays opaque even when its rim or backdrop is translucent.
- Keep crisp dithering and smooth blur on separate objects. They describe different materials and should not compete within one control.

## Color and typography

| Role | Direction |
| --- | --- |
| Light background | Cool off-white paper |
| Content panels | Paper-white, opaque fills |
| Text and strong edges | Clear, dark ink |
| Main accent | Cyan-blue |
| Selection | Pale cyan fill with a defined edge |
| Feedback colors | Additional colors communicate meaning rather than decorate each component |
| Dark background | Deep ink-blue with lighter framed panels |

Use a readable sans serif for interface text. Pixel lettering belongs in optional artwork, not labels, paragraphs, or error messages. Choose the font family after comparing it in the first specimen.

Dark mode keeps the same framing, hierarchy, and restrained cyan accent. It should not become a separate neon dashboard. Adjust texture, fills, and highlights for readability instead of mechanically inverting the light theme.

## Component recipes

| Component | Treatment |
| --- | --- |
| Buttons | Rounded rectangles, a fine edge, and shallow depth. Give the primary action a restrained cyan highlight. Reduce the depth on press. |
| Inputs and tables | Plain opaque fills, clear ink, fine dividers, and an explicit focus outline. No texture or blur behind their content. |
| Tabs and selection | Pale cyan fill with a defined edge. Keep selection recognizable without glow. |
| Cards | Paper-white panels with quiet framing. Reserve stronger depth for elements that need to stand apart. |
| Popovers and dialogs | Opaque readable interiors, with an optional translucent rim or restrained backdrop blur. |
| Empty states | Optional original Flipnote-inspired illustration or localized dithering, separate from the working controls. |

A cyan highlight is not a reason to add blur. Prefer a fill, edge, or small highlight first. Use translucency only where the element's position over another layer matters.

## Interaction and accessibility

- Respond to presses immediately. Do not delay an action or state update until a decorative animation finishes.
- Keep motion brief and tied to the action. Respect reduced-motion preferences and retain clear static states.
- Give keyboard focus a visible outline. Glow alone is not a focus indicator.
- Distinguish selected, invalid, loading, and disabled states without relying on color, glow, or motion alone.
- Keep existing keyboard behavior, focus management, and semantic state indications when restyling components.
- Test text and control contrast against the actual backgrounds, including any texture or translucency.

These are design requirements. They have not yet been verified in a themed interactive prototype.

## Shared theme constraints

The workshop at `/`, overview at `/components`, documentation at `/docs`, and installed registry components should express the same direction in light and dark modes.

- Keep shared tokens and theme rules in `registry/ninaero/theme.mjs`.
- Keep installable component styling in `registry/ninaero/ui/`.
- Do not make workshop-only styling a substitute for the installable theme.
- Treat `app/globals.css` and `registry.json` as generated outputs, not design source files.

The visual direction does not require changing component APIs or interaction behavior.

## First design specimen

1. Mock up one compact form with tabs, an input, a primary button, and a popover. Begin with paper backgrounds and matte controls.
2. Add restrained glass accents to the same composition. Compare the versions in light and dark modes.
3. Keep glass where it clarifies an action, selection, or layer. Remove effects that obscure content or compete with the paper structure.
4. Check keyboard focus, selected, invalid, loading, disabled, and reduced-motion states before defining the final tokens.

A successful specimen has a clear hierarchy with the decorative effects removed. Adding glass should improve the distinction between important elements without reducing readability.

## Decisions still open

- Exact light and dark palette values.
- Font family and type scale.
- Corner radii, border weights, and shadow values.
- Paper-pattern spacing and opacity.
- Where translucency is useful, and its strength.
- Motion timing and the original illustration style.

Set these from the specimen rather than treating moodboard images as ready-made tokens. Browser and interaction validation remain future work.

## Moodboard sources

The source moodboard is in the Obsidian vault at `Projects/Ninaero/Moodboard.canvas`. The intent note is `Projects/Ninaero/Define a Nintendo and Frutiger Aero theme direction.md`.

Image filenames below are relative to `Projects/Ninaero/attachments/`. Canvas node IDs identify the selected references.

| Reference | Filename | Canvas node ID |
| --- | --- | --- |
| Handheld structure | `nintendo ds.png` | `c83010f550fe1ca8` |
| Rounded framing and cyan edging | `nintendo wii.png` | `bb171bd7f0580645` |
| Paper and raised framing together | `Pasted image 20261012153817.png` | `a24694601a4c40ef` |
| Ruled paper | `lined paper.png` | `1327a50e3e61200e` |
| Glass pill rim | `Pasted image 20261012154402.png` | `efaad4b8934b154a` |
| Flipnote outlines | `Pasted image 20261012154930.png` | `6262b605c14756c0` |
| Dithered shading | `Pasted image 20261012154220.png` | `0662d08130f07c9f` |

These are research references, not assets to ship. Borrow their visual traits rather than copying Nintendo branding, character art, or complete screens.
