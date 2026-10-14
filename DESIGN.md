# Ninaero design direction

## Handheld paper with glass accents

Ninaero combines a Nintendo handheld-inspired layout with paper details and restrained glass highlights. The everyday UI uses neutral white and gray backgrounds, clear ink, squircle-cornered controls, and small cyan accents.

Paper is the main material. Wii-style framing gives the controls their shape and shallow depth. Glass marks primary actions, selection, and floating layers. Flipnote-inspired illustration and dithering remain optional artwork.

This document records the agreed visual direction. Button is the first fully styled component. Cyan is the default accent, with Indigo, Lavender, and Slate alternatives. Primary, selection, and focus roles follow the chosen preset; structural borders stay grayscale. Paper, panels, and ordinary controls use achromatic fills and ink. Destructive states keep semantic red. Green, yellow, orange, and red remain reserved for status colors.

## Reference hierarchy

| Role                       | Reference traits                                                       | Application                                             | Boundary                                                                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core                       | DS-like organization, ruled, dotted, and grid paper, compact layouts   | Page backgrounds and content structure                  | Use one quiet paper pattern at a time. Keep dense content on plain backgrounds.                                                                                                                         |
| Supporting controls        | Wii framing, shallow shading, and the moodboard's squircle requirement | Controls, navigation, and panel frames                  | Keep ordinary edges neutral; reserve accent edges for selected states and focus. Use squircle corner curves on rectangular controls. Ordinary circular-arc corners and pill shapes are not substitutes. |
| Signature accent           | Glass rims, soft highlights, localized glow                            | Primary actions, selected elements, and floating layers | Keep most controls matte. Glass must clarify importance or layering.                                                                                                                                    |
| Optional artwork           | Flipnote outlines, sparse color, discrete dithered shading             | Empty states and occasional header illustrations        | Use original artwork. Do not pixelate routine text, icons, or controls.                                                                                                                                 |
| Outside the everyday theme | Dense ASCII/ANSI patterns, perspective-grid orbs, geometric spectacle  | Occasional standalone artwork                           | Keep these out of forms, tables, and navigation.                                                                                                                                                        |

The lined announcement-bar reference is the clearest bridge between paper and lightly raised controls. The DS reference itself has square controls and pixel edges. Ninaero deliberately combines handheld organization with the squircle geometry called for in the moodboard annotations.

## Materials and layout

- Use faint dots on the homepage, with ruling and grid in the preview contexts below. Choose one pattern per region; never layer different paper variants. Keep the existing page color when selecting a pattern.
- Keep inputs, tables, and long text on opaque, plain backgrounds. Paper texture must not interfere with their content.
- Use squircle corner curves with fine edges and shallow depth. Rectangular buttons can still have squircle corners; icon buttons should make the squircle silhouette especially clear. Preserve straight alignment in lists, tables, and compact forms.
- Keep cards and ordinary controls mostly matte. Avoid heavy bevels, console bezels, and large glossy gradients.
- Put glass on a small number of important elements. Readable content stays opaque even when its rim or backdrop is translucent.
- Keep crisp dithering and smooth blur on separate objects. They describe different materials and should not compete within one control.

### Spacing and density

Borrow Wii U's repeated rows, aligned content edges, and separate navigation bands. The [menu references](https://www.nintendoworldreport.com/news/32404/wii-u-boot-screen-officially-revealed-for-television-and-gamepad) show a compact GamePad grid; the [operations manual, page 19](https://www.nintendo.com/eu/media/downloads/support_1/wii_u_3/WiiU_OperationsManual_EN.pdf) pairs a padded settings category with a denser list. WaraWara Plaza is a scene-based TV layout, not a form-spacing reference. These resized images support the hierarchy, not exact Nintendo pixel values.

The values below are Ninaero's spacing rules. Use the existing 4px Tailwind step, with different roles for internal padding and space between controls.

| Role                                      | Space                                        |
| ----------------------------------------- | -------------------------------------------- |
| Label, control, and help within one field | 8px                                          |
| Separate fields                           | 16px                                         |
| Separate field groups                     | 24px                                         |
| Panel content inset                       | 24px                                         |
| Neighboring actions                       | 8px                                          |
| Compact select-menu inset                 | 8px                                          |
| Page gutter                               | 20px on narrow layouts, 32px on wide layouts |
| Major page sections                       | 32px on narrow layouts, 48px on wide layouts |

Keep one owner for each gap. A field's 8px label gap sits inside the 16px field stack; it is not extra field separation. Panel padding and page gutters have different jobs. Use compact menu padding rather than putting a 24px panel inset around every option list.

#### Control geometry

Keep the existing compact heights. Match default Button, Input, and Select rows at 32px, and align field text at a 12px horizontal inset.

| Control             | Height        | Horizontal inset | Internal spacing                     |
| ------------------- | ------------- | ---------------- | ------------------------------------ |
| Button xs / sm      | 24px / 28px   | 8px              | 4px icon-to-label gap                |
| Button default / lg | 32px / 36px   | 12px / 16px      | 8px icon-to-label gap                |
| Input               | 32px          | 12px             | 4px vertical inset, 20px line height |
| Select default      | 32px          | 12px             | 4px vertical inset, 8px content gaps |
| Select sm           | 28px          | 8px              | 4px vertical inset and content gaps  |
| Textarea            | At least 64px | 12px             | 8px vertical inset                   |

Icon-only buttons stay square and center their glyphs. Default and large icon-bearing buttons may reduce the icon-side inset by 4px; compact buttons keep their 8px inset. Use a 20px line height for ordinary control labels and 16px for compact labels. Textareas keep the existing responsive text sizing and 24px / 20px line heights on narrow / wider layouts.

Compound fields use a 12px outside inset and 8px between inline adornments and input content. Let the group own the border and row height. Embedded buttons reuse Button's actual size variants, and block adornments own the adjacent vertical inset instead of doubling the textarea's padding.

Select options keep an even minimum 32px row with 12px on the label side. Reserve room for the trailing checkmark and an 8px gap so text cannot run beneath it. Group labels share the option text edge.

Preserve squircle corners, material depth, responsive text sizes, and native multiline sizing. Leave focus outlines and shadows unclipped; do not inflate every control to account for their painted extent. These defaults are compact web controls, not measurements of Nintendo touch targets. Use larger targets where the interaction requires them.

### Paper patterns

Use the Paper Details group in the moodboard as the source for all three variants. These are CSS textures, not image assets to copy into the theme.

| Pattern | Current use                                     | Shared class           |
| ------- | ----------------------------------------------- | ---------------------- |
| Ruled   | Input workshop specimen                         | `ninaero-paper-ruled`  |
| Dotted  | Homepage and composed settings example backdrop | `ninaero-paper-dotted` |
| Grid    | Component catalogue thumbnails                  | `ninaero-paper-grid`   |

The homepage uses `bg-background` to keep the neutral page fill beneath its dots. Changing the texture must not introduce a blue-tinted page background. Its preview frame uses a near-white mix of 60% `card` and 40% `muted` in light mode, and the unchanged `muted` fill in dark mode. Keep the `border` edge neutral; do not use Button material tokens.

Keep patterns on page backgrounds and preview backdrops. Forms, tables, code blocks, and long text keep opaque, plain fills. A grid is one pattern made from horizontal and vertical rules; do not add dots or ruling over it. Separate sections with space instead of adding decorative divider lines.

Define pattern fills, ink, and CSS recipes in `registry/ninaero/theme.mjs` so consumers can use the same opt-in classes. Paper fills and pattern ink stay grayscale and independent of the Cyan, Indigo, Lavender, and Slate accents. Tune the pattern ink separately in light and dark modes, and remove decorative textures in forced-colors mode. The initial spacing is 24px for ruling and grid, and 16px for dots. Spacing and ink strength still need visual review.

## Color and typography

Ninaero is neutral-first in both color modes. Page backgrounds, cards, popovers, menus, dialogs, field fills, ordinary borders, paper patterns, and cast shadows use grayscale values. Dark panels are charcoal or gray, not blue-black. A token named neutral must actually be achromatic, not merely unchanged across accent presets.

Reserve the chosen accent for primary actions, links, selected controls, active states, and keyboard focus. Secondary and Outline controls keep neutral materials. Feedback colors retain their semantic meaning. Syntax highlighting and data marks may use color to distinguish content, while their containers stay neutral. Popover and menu containers use the neutral card palette independently of Button material tokens; their selected items and controls may use the accent.

| Role                  | Direction                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| Light background      | White or off-white grayscale paper                                        |
| Content panels        | Opaque white or gray fills                                                |
| Text and strong edges | Clear, dark ink                                                           |
| Main accent           | Cyan-blue                                                                 |
| Selection             | Pale cyan fill with a defined edge                                        |
| Feedback colors       | Additional colors communicate meaning rather than decorate each component |
| Dark background       | Charcoal with lighter neutral-gray panels                                 |

Use Google Sans Flex for interface text and headings, with its `ROND` axis set to `100` for rounded terminals. Keep existing component weights and sizes; set roundness without overriding the weight axis. Self-host the full variable font in both the site and installed theme. Pixel lettering belongs in optional artwork, not labels, paragraphs, or error messages.

Dark mode keeps the same framing, hierarchy, and restrained cyan accent. It should not become a separate neon dashboard. Adjust texture, fills, and highlights for readability instead of mechanically inverting the light theme.

## Component recipes

| Component            | Treatment                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons              | Squircle corner curves, a fine edge, and shallow depth. Give the primary action a restrained cyan highlight. Reduce the depth on press. |
| Inputs and tables    | Plain opaque fills, clear ink, fine dividers, and an explicit focus outline. No texture or blur behind their content.                   |
| Tabs and selection   | Pale cyan fill with a defined edge. Keep selection recognizable without glow.                                                           |
| Cards                | Paper-white panels with quiet framing. Reserve stronger depth for elements that need to stand apart.                                    |
| Popovers and dialogs | Opaque grayscale interiors and neutral frames in both modes. Optional rims or backdrop blur must not tint the panel blue.               |
| Empty states         | Optional original Flipnote-inspired illustration or localized dithering, separate from the working controls.                            |

A cyan highlight is not a reason to add blur. Prefer a fill, edge, or small highlight first. Use translucency only where the element's position over another layer matters.

## Shadows and elevation

Use [Josh W. Comeau's Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/) as the reference for cast shadows. His article connects consistent lighting, layered shadows, and background-matched color. The following choices adapt those principles to Ninaero's shallow handheld controls and paper surfaces.

### Shared lighting and materials

- Use one overhead light, with highlights at the top and cast shadows below. Keep horizontal offsets at zero across the elevation scale. This is Ninaero's choice of light direction; the article's above-left example is not a required angle.
- Separate the border, inset highlight, lower bevel, and cast shadow. Borders define the squircle silhouette. Insets and a crisp lower edge describe the control's material and thickness. A soft outer shadow describes its distance from the surface beneath it.
- Keep Primary, Secondary, and Destructive on the same shallow elevation. Their fills communicate hierarchy and meaning; a destructive action does not need a taller shadow. Outline, Ghost, and Link should not acquire the same raised material by default.
- Soften control cast shadows by broadening blur relative to the downward offset and tapering each layer's opacity. Keep enough shadow strength to show shallow elevation. A subtle fade should not make the shadow nearly invisible. The rim and bevel still define the Button; avoid a hard-edged dark silhouette beneath it.
- Do not turn shadows into accent-colored glow. Keep cast shadows achromatic on neutral paper and panels, and tune their lightness to the receiving material. A red button on neutral paper should not automatically cast a red shadow.

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

Keep elevation geometry separate from shadow color. Define the shared recipes in `registry/ninaero/theme.mjs`; use an inherited receiving-surface shadow color so the same elevation can work on paper or a dark panel. Accent presets may change primary-action edges and highlights; ordinary structural borders remain neutral.

In dark mode, tune the shadow against the actual panel instead of increasing black opacity until it disappears. Use a visible rim and inset highlight for separation where a cast shadow alone cannot provide it. Keep glow, focus outlines, and invalid-state borders separate from elevation.

Compare all raised Button variants together in light and dark modes, on both paper and plain panels. Check resting, hover, pressed, disabled, and keyboard-focus states. When floating components are styled, check that their elevation remains above controls and that shadows are not clipped. Verify contrast against the highlighted and shaded fills, not just the base color. In forced-colors mode, remove decorative shadows and retain system-color boundaries.

The shared recipes now live in `registry/ninaero/theme.mjs` as control, floating, and dialog elevations. Raised Button variants combine their own inset bevels with the same control cast shadow.

The `shadow-sm` utility uses control elevation; `shadow-md` and `shadow-lg` use floating elevation; `shadow-xl` and `shadow-2xl` use dialog elevation. Dialog, Alert Dialog, and Sheet use the dialog level; the chart tooltip uses the floating level.

Shadow color inherits from `--shadow-color`. The `ninaero-surface-paper` class selects the light/dark paper shadow color for its descendants. Exact offsets, blur radii, colors, and opacity still need browser review.

## Interaction and accessibility

Ninaero's motion is bubbly and playful. Opening layers expand with a small overshoot and settle into place. Use a single soft bounce rather than repeated wobbling, rotation, or continuous floating. Keep text entry, keyboard focus, and selection steady.

Begin feedback immediately. Larger layers may take 220 to 280ms to settle; dismissals should finish in 120 to 160ms. Animate transform and opacity instead of layout. Repeated actions must retarget from the current visual state without restarting a canned sequence. Reduced motion removes movement and decorative fades while preserving state changes and focus.

- Respond to presses immediately. Do not delay an action or state update until a decorative animation finishes.
- Keep motion brief and tied to the action. Respect reduced-motion preferences and retain clear static states.
- Give keyboard focus a visible outline. Glow alone is not a focus indicator.
- Distinguish selected, invalid, loading, and disabled states without relying on color, glow, or motion alone.
- Keep existing keyboard behavior, focus management, and semantic state indications when restyling components.
- Test text and control contrast against the actual backgrounds, including any texture or translucency.

These are design requirements. They have not yet been verified in a themed interactive prototype.

## Shared theme constraints

The homepage at `/` has a concise introduction and one composed interface example. `/examples` lists composed interfaces; each example has its own preview and code page. `/components` remains the catalogue and `/docs` remains documentation. `/workshop` links to separate Button, Input, Dialog, and token specimens rather than collecting every state on one page. All routes use the same theme and independent color-mode and accent controls.

Borrow Afterglow's homepage structure: a prominent heading, one framed example, visible accent choices, and an install command. Use faint dots on the neutral homepage background. Keep ruling and grid in the separate preview contexts listed above. Separate sections with space, not decorative divider lines. Retain borders for controls and the preview frame. Keep catalogues, token swatches, and state matrices off the homepage. Color mode stays under Appearance; accents are also available in the hero. Workshop pages remain available by URL without a detached footer link. Example compositions are not registry blocks unless explicitly registered. Keep UI text action-led and remove captions that repeat nearby labels; retain necessary preview and persistence qualifications.

- Keep shared tokens and theme rules in `registry/ninaero/theme.mjs`.
- Keep installable component styling in `registry/ninaero/ui/`.
- Do not make workshop-only styling a substitute for the installable theme.
- Treat `app/globals.css` and `registry.json` as generated outputs, not design source files.

The visual direction does not require changing component APIs or interaction behavior.

### Squircle rendering

Button uses native CSS `corner-shape: squircle` with a nonzero `border-radius` to define the corner extent. This produces superellipse curves without a clipping mask, extra DOM, or JavaScript measurement. Shadows and focus outlines remain outside the button.

True squircle rendering requires browser support for `corner-shape`. Unsupported browsers display ordinary rounded corners, which do not fulfill the intended geometry. The workshop identifies that limitation. No polyfill is included.

Accent presets live in `registry/ninaero/accents.mjs` and feed the same theme source and registry output as the Button rules. The root `data-accent` attribute selects a preset independently of light/dark mode. The workshop provides an Accent selector and side-by-side Button comparisons. Accent fills, selection, and focus follow the chosen preset; structural borders stay neutral.

Secondary uses a paper-material edge; Outline uses a neutral ink/paper edge. Both borders have separate light/dark tokens and stay unchanged when the accent changes. Invalid Buttons keep their variant material and use a single restrained semantic-red border, without an always-on ring. The outer outline appears only for keyboard focus and follows the accent, or the system highlight color in forced-colors mode.

### Input fields

Input, Textarea, and Select triggers use native squircle corner curves with a `0.875rem` corner extent, close to Button's proportions. Default fields use `0.75rem` horizontal padding; compact Select triggers use `0.5rem`. Keep the field rectangular, with an opaque neutral fill and a fine neutral edge. Its dedicated `input-edge` token is quieter than the shared control border in both modes; keep at least 3:1 contrast against the adjacent paper and field fills. A faint upper-interior shade and lower-interior highlight give it a shallow paper recess without raising it above the page. Derive both tones from the field fill, using black mixes of 4% in light mode and 6% in dark mode, and white mixes of 6% and 8%. Placeholder ink must retain contrast against both inset tones.

Invalid fields retain this material and use a semantic-red border. Keyboard focus adds a separate accent outline, including on invalid and read-only fields. Disabled fields remain opaque and lose the inset lighting; their dark fill must not become brighter than an enabled field. Forced-colors mode removes decorative inset lighting and preserves system boundaries. Do not add raised Button bevels, cast shadows, glossy gradients, glass, movement, or paper texture inside a field.

Textarea keeps its `4rem` minimum height, `0.5rem` vertical padding, native resizing, and content-based sizing. Inside InputGroup, suppress its inner border, inset lighting, and focus outline so the group owns the frame.

Select retains its default and small trigger heights and Base UI's positioning and keyboard behavior. Its menu uses the shared neutral floating frame with a `1.25rem` squircle corner extent. Selected options have a pale accent fill, a defined edge, and a check mark. Highlighted options use an inset outline that stays inside the menu. Disabled options remain opaque with muted ink. Keep their highlight visible when Base UI focuses them for inspection; they cannot be selected. Reduced motion removes popup and chevron transitions; forced-colors mode preserves selection and highlights with system colors.

The [Wii Internet Channel text-entry reference](https://www.nintendo.com/eu/media/images/06_screenshots/systems_4/wii_10/wii_channels/internet_channel/Internet_Channel_Wii_Channel_04_EN_CMM_big.jpg) shows a long rectangular field with restrained corners, distinct from its rounder action buttons. It does not establish mathematical squircle curves. Ninaero's squircle corners are a deliberate theme choice. DS nickname-field geometry has not been independently verified.

### Dialogs

Use broad, soft corners like the Wii Menu prompt reference, with a `3rem` native squircle corner extent. This is Ninaero's chosen geometry, not a measurement of Nintendo's original UI. Give the frame a shallow paper/plastic finish with an opaque neutral fill, faint top-to-bottom shading, a fine grayscale edge, an upper inset highlight, and a lower inset shade. Combine these with the shared dialog cast shadow. Keep the panel matte; reserve accent and glass treatment for primary actions and focus.

Use one continuous panel without a contrasting footer band or divider. The outer frame owns the 24px inset; group content and actions with 24px of space, and keep 8px between actions. Dialog titles use 20px type with a 24px line height. Give actions a useful minimum width, using Button's large size for short prompt actions. Center short system prompts and keep forms left-aligned. Inset the corner close button by 16px and reserve header space for it only when present. Preserve existing focus management and do not clip shadows or keyboard outlines. Forced-colors mode removes decorative lighting and retains a system-color boundary.

Dialog opens from 92% scale and 8px below its resting position, with a 260ms elastic transform transition and a 140ms fade. The easing supplies one small overshoot before settling. Closing uses a 140ms shrink to 96% scale and a 4px downward shift with a fade. The scrim fades in over 160ms and out over 140ms without bouncing. CSS transitions let interrupted opening and closing continue from the current position. Under reduced motion, both layers change immediately.

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
- Motion timing for remaining components and the original illustration style.

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
| Dotted paper                      | `dotted background.png`           | `59f7072feec62b4c` |
| Grid paper                        | `grid paper.png`                  | `a194a00493c888cc` |
| Glass pill rim                    | `Pasted image 20261012154402.png` | `efaad4b8934b154a` |
| Flipnote outlines                 | `Pasted image 20261012154930.png` | `6262b605c14756c0` |
| Dithered shading                  | `Pasted image 20261012154220.png` | `0662d08130f07c9f` |

These are research references, not assets to ship. Borrow their visual traits rather than copying Nintendo branding, character art, or complete screens.
