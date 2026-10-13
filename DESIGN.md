# Ninaero design direction

## Handheld paper with glass accents

Ninaero combines a Nintendo handheld-inspired layout with paper details and restrained glass highlights. The everyday UI uses cool off-white backgrounds, clear ink, squircle-cornered controls, and small cyan accents.

Paper is the main material. Wii-style framing gives the controls their shape and shallow depth. Glass marks primary actions, selection, and floating layers. Flipnote-inspired illustration and dithering remain optional artwork.

This document records the agreed visual direction. Button is the first fully styled component. Cyan is the default accent, with Indigo, Lavender, and Slate alternatives. Primary, selection, focus, and structural border tokens follow the chosen preset; paper, ink, and destructive colors keep their neutral or semantic roles. Green, yellow, orange, and red remain reserved for status colors.

## Reference hierarchy

| Role                       | Reference traits                                                                    | Application                                             | Boundary                                                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Core                       | DS-like organization, fine paper lines, compact layouts                             | Page backgrounds and content structure                  | Use one quiet paper pattern at a time. Keep dense content on plain backgrounds.                                        |
| Supporting controls        | Wii framing, shallow shading, cyan edging, and the moodboard's squircle requirement | Controls, navigation, and panel frames                  | Use squircle corner curves on rectangular controls. Ordinary circular-arc corners and pill shapes are not substitutes. |
| Signature accent           | Glass rims, soft highlights, localized glow                                         | Primary actions, selected elements, and floating layers | Keep most controls matte. Glass must clarify importance or layering.                                                   |
| Optional artwork           | Flipnote outlines, sparse color, discrete dithered shading                          | Empty states and occasional header illustrations        | Use original artwork. Do not pixelate routine text, icons, or controls.                                                |
| Outside the everyday theme | Dense ASCII/ANSI patterns, perspective-grid orbs, geometric spectacle               | Occasional standalone artwork                           | Keep these out of forms, tables, and navigation.                                                                       |

The lined announcement-bar reference is the clearest bridge between paper and lightly raised controls. The DS reference itself has square controls and pixel edges. Ninaero deliberately combines handheld organization with the squircle geometry called for in the moodboard annotations.

## Materials and layout

- Start with faint horizontal ruling as the main paper pattern. Grid and dotted patterns are alternatives for specific contexts, not additional textures to stack over the ruling.
- Keep inputs, tables, and long text on opaque, plain backgrounds. Paper texture must not interfere with their content.
- Use squircle corner curves with fine edges and shallow depth. Rectangular buttons can still have squircle corners; icon buttons should make the squircle silhouette especially clear. Preserve straight alignment in lists, tables, and compact forms.
- Keep cards and ordinary controls mostly matte. Avoid heavy bevels, console bezels, and large glossy gradients.
- Put glass on a small number of important elements. Readable content stays opaque even when its rim or backdrop is translucent.
- Keep crisp dithering and smooth blur on separate objects. They describe different materials and should not compete within one control.

## Color and typography

| Role                  | Direction                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| Light background      | Cool off-white paper                                                      |
| Content panels        | Paper-white, opaque fills                                                 |
| Text and strong edges | Clear, dark ink                                                           |
| Main accent           | Cyan-blue                                                                 |
| Selection             | Pale cyan fill with a defined edge                                        |
| Feedback colors       | Additional colors communicate meaning rather than decorate each component |
| Dark background       | Deep ink-blue with lighter framed panels                                  |

Use Nunito Sans for interface text and headings. Its open, softly shaped letterforms suit the paper surfaces and shallow controls without copying Nintendo lettering. Keep existing component weights and sizes; refine the type scale in the specimens. Pixel lettering belongs in optional artwork, not labels, paragraphs, or error messages.

Dark mode keeps the same framing, hierarchy, and restrained cyan accent. It should not become a separate neon dashboard. Adjust texture, fills, and highlights for readability instead of mechanically inverting the light theme.

## Component recipes

| Component            | Treatment                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons              | Squircle corner curves, a fine edge, and shallow depth. Give the primary action a restrained cyan highlight. Reduce the depth on press. |
| Inputs and tables    | Plain opaque fills, clear ink, fine dividers, and an explicit focus outline. No texture or blur behind their content.                   |
| Tabs and selection   | Pale cyan fill with a defined edge. Keep selection recognizable without glow.                                                           |
| Cards                | Paper-white panels with quiet framing. Reserve stronger depth for elements that need to stand apart.                                    |
| Popovers and dialogs | Opaque readable interiors, with an optional translucent rim or restrained backdrop blur.                                                |
| Empty states         | Optional original Flipnote-inspired illustration or localized dithering, separate from the working controls.                            |

A cyan highlight is not a reason to add blur. Prefer a fill, edge, or small highlight first. Use translucency only where the element's position over another layer matters.

## Shadows and elevation

Use [Josh W. Comeau's Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/) as the reference for cast shadows. His article connects consistent lighting, layered shadows, and background-matched color. The following choices adapt those principles to Ninaero's shallow handheld controls and paper surfaces.

### Shared lighting and materials

- Use one overhead light, with highlights at the top and cast shadows below. Keep horizontal offsets at zero across the elevation scale. This is Ninaero's choice of light direction; the article's above-left example is not a required angle.
- Separate the border, inset highlight, lower bevel, and cast shadow. Borders define the squircle silhouette. Insets and a crisp lower edge describe the control's material and thickness. A soft outer shadow describes its distance from the surface beneath it.
- Keep Primary, Secondary, and Destructive on the same shallow elevation. Their fills communicate hierarchy and meaning; a destructive action does not need a taller shadow. Outline, Ghost, and Link should not acquire the same raised material by default.
- Soften control cast shadows by broadening blur relative to the downward offset and tapering each layer's opacity. Keep enough shadow strength to show shallow elevation. A subtle fade should not make the shadow nearly invisible. The rim and bevel still define the Button; avoid a hard-edged dark silhouette beneath it.
- Do not turn shadows into accent-colored glow. Match the shadow hue to the receiving paper or panel, then reduce lightness and tune saturation. A red button on neutral paper should not automatically cast a red shadow.

### Layered elevation

Use a compact elevation scale rather than tuning every component independently.

| Level    | Use                                                | Shadow treatment                                                                                |
| -------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Flat     | Page content, tables, and ordinary paper panels    | No cast shadow. Use spacing and borders for separation.                                         |
| Control  | Raised Primary, Secondary, and Destructive buttons | A tight contact shadow plus a small, softer outer layer. Keep the bevel separate.               |
| Floating | Popovers and menus                                 | Increase downward offset and blur together; reduce each layer's opacity as the object rises.    |
| Dialog   | A modal above the working content                  | The broadest layered shadow, with lower per-layer opacity. Keep the scrim a separate treatment. |

Build each cast shadow from a few layers with progressively larger offsets and blur radii. Avoid one large, uniform blur that reads as a fuzzy border. Layer opacity accumulates, so judge the combined shadow rather than copying the same opacity across elevation levels.

On press, reduce the control's apparent distance from the paper. Collapse its outer shadow and use a small top inset shade with a lower inset highlight. Pair that change with the pressed fill and brief movement; under reduced motion, the static fill and inset lighting must still communicate the press. Disabled controls lose raised shadows.

### Color inside pressed controls

Cast shadows take their color from the receiving paper or panel. Recessed shading takes its color from the control's own pressed fill. Use a darker, lower-chroma tone for the inset shade and a lighter, lower-chroma tone for the inset highlight. A red Button can have red-tinted internal shading while casting a neutral paper shadow. Primary follows its selected accent; Secondary and Outline use paper tones; Destructive keeps its semantic red material.

Reverse the depth cue, not the hue or the light source. Under the same overhead light, a pressed control has shade along its upper interior and a fine highlight along its lower interior. Keep both horizontal offsets at zero and remove the outer cast shadow. Outline remains flat at rest but can use this paper recess on press. Ghost and Link do not acquire recessed framing.

The shared `buttonRecessShadow` recipe lives in `registry/ninaero/theme.mjs`. Each recessed Button sets `--button-recess-fill` to its material's pressed fill. Local `color-mix(in oklab, ...)` expressions derive the shade and highlight so accent changes cannot leave stale inset colors. The current black mix weights are 4% in light mode and 6% in dark mode; white mix weights are 6% and 8%. These are shallow lighting cues, not black cavities or white glow. Tune them against the actual material and verify label contrast across both inset tones.

Keep this lighting separate from keyboard-focus outlines, invalid borders, and disabled styling. Reduced motion removes movement but retains the static recessed cue. Forced-colors mode removes decorative inset lighting and preserves system-color boundaries.

### Theme tokens and validation

Keep elevation geometry separate from shadow color. Define the shared recipes in `registry/ninaero/theme.mjs`; use an inherited receiving-surface shadow color so the same elevation can work on paper or a dark panel. Accent presets may change edges and highlights without recoloring the neutral surface's cast shadow.

In dark mode, tune the shadow against the actual panel instead of increasing black opacity until it disappears. Use a visible rim and inset highlight for separation where a cast shadow alone cannot provide it. Keep glow, focus outlines, and invalid-state borders separate from elevation.

Compare all raised Button variants together in light and dark modes, on both paper and plain panels. Check resting, hover, pressed, disabled, and keyboard-focus states. When floating components are styled, check that their elevation remains above controls and that shadows are not clipped. Verify contrast against the highlighted and shaded fills, not just the base color. In forced-colors mode, remove decorative shadows and retain system-color boundaries.

The shared recipes now live in `registry/ninaero/theme.mjs` as control, floating, and dialog elevations. Raised Button variants combine their own inset bevels with the same control cast shadow.

The `shadow-sm` utility uses control elevation; `shadow-md` and `shadow-lg` use floating elevation; `shadow-xl` and `shadow-2xl` use dialog elevation. Dialog, Alert Dialog, and Sheet use the dialog level; the chart tooltip uses the floating level.

Shadow color inherits from `--shadow-color`. The `ninaero-surface-paper` class selects the light/dark paper shadow color for its descendants. Exact offsets, blur radii, colors, and opacity still need browser review.

## Interaction and accessibility

- Respond to presses immediately. Do not delay an action or state update until a decorative animation finishes.
- Keep motion brief and tied to the action. Respect reduced-motion preferences and retain clear static states.
- Give keyboard focus a visible outline. Glow alone is not a focus indicator.
- Distinguish selected, invalid, loading, and disabled states without relying on color, glow, or motion alone.
- Keep existing keyboard behavior, focus management, and semantic state indications when restyling components.
- Test text and control contrast against the actual backgrounds, including any texture or translucency.

These are design requirements. They have not yet been verified in a themed interactive prototype.

## Shared theme constraints

The homepage at `/` has a concise introduction and one composed interface example. `/examples` lists composed interfaces; each example has its own preview and code page. `/components` remains the catalogue and `/docs` remains documentation. `/workshop` links to separate Button, Input, Dialog, and token specimens rather than collecting every state on one page. All routes use the same theme and independent color-mode and accent controls.

Keep navigation and example pages minimal: no empty categories, duplicate catalogue, token wall, or state matrix on the homepage. Appearance controls use progressive disclosure. Workshop navigation is secondary. Examples are preview compositions, not installable registry blocks unless explicitly added to the registry.

- Keep shared tokens and theme rules in `registry/ninaero/theme.mjs`.
- Keep installable component styling in `registry/ninaero/ui/`.
- Do not make workshop-only styling a substitute for the installable theme.
- Treat `app/globals.css` and `registry.json` as generated outputs, not design source files.

The visual direction does not require changing component APIs or interaction behavior.

### Squircle rendering

Button uses native CSS `corner-shape: squircle` with a nonzero `border-radius` to define the corner extent. This produces superellipse curves without a clipping mask, extra DOM, or JavaScript measurement. Shadows and focus outlines remain outside the button.

True squircle rendering requires browser support for `corner-shape`. Unsupported browsers display ordinary rounded corners, which do not fulfill the intended geometry. The workshop identifies that limitation. No polyfill is included.

Accent presets live in `registry/ninaero/accents.mjs` and feed the same theme source and registry output as the Button rules. The root `data-accent` attribute selects a preset independently of light/dark mode. The workshop provides an Accent selector and side-by-side Button comparisons. Accent roles and structural borders change globally; neutral paper, ink, and destructive colors do not.

Secondary uses a paper-material edge; Outline uses a neutral ink/paper edge. Both borders have separate light/dark tokens and stay unchanged when the accent changes. Invalid Buttons keep their variant material and use a single restrained semantic-red border, without an always-on ring. The outer outline appears only for keyboard focus and follows the accent, or the system highlight color in forced-colors mode.

## First design specimen

1. Mock up one compact form with tabs, an input, a primary button, and a popover. Begin with paper backgrounds and matte controls.
2. Add restrained glass accents to the same composition. Compare the versions in light and dark modes.
3. Keep glass where it clarifies an action, selection, or layer. Remove effects that obscure content or compete with the paper structure.
4. Check keyboard focus, selected, invalid, loading, disabled, and reduced-motion states before defining the final tokens.

A successful specimen has a clear hierarchy with the decorative effects removed. Adding glass should improve the distinction between important elements without reducing readability.

## Decisions still open

- Exact light and dark palette values.
- Type scale.
- Final squircle corner extent, border weights, and shadow values.
- Paper-pattern spacing and opacity.
- Where translucency is useful, and its strength.
- Motion timing and the original illustration style.

Refine these from the specimen rather than treating moodboard images as ready-made tokens. A Button specimen is available in the workshop; broader themed components still need their own browser and interaction checks.

## Moodboard sources

The source moodboard is in the Obsidian vault at `Projects/Ninaero/Moodboard.canvas`. The intent note is `Projects/Ninaero/Define a Nintendo and Frutiger Aero theme direction.md`.

Image filenames below are relative to `Projects/Ninaero/attachments/`. Canvas node IDs identify the selected references.

| Reference                         | Filename                          | Canvas node ID     |
| --------------------------------- | --------------------------------- | ------------------ |
| Handheld structure                | `nintendo ds.png`                 | `c83010f550fe1ca8` |
| Rounded framing and cyan edging   | `nintendo wii.png`                | `bb171bd7f0580645` |
| Paper and raised framing together | `Pasted image 20261012153817.png` | `a24694601a4c40ef` |
| Ruled paper                       | `lined paper.png`                 | `1327a50e3e61200e` |
| Glass pill rim                    | `Pasted image 20261012154402.png` | `efaad4b8934b154a` |
| Flipnote outlines                 | `Pasted image 20261012154930.png` | `6262b605c14756c0` |
| Dithered shading                  | `Pasted image 20261012154220.png` | `0662d08130f07c9f` |

These are research references, not assets to ship. Borrow their visual traits rather than copying Nintendo branding, character art, or complete screens.
