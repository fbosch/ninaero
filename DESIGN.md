# Ninaero design direction

## Handheld paper with glass accents

Ninaero combines a Nintendo handheld-inspired layout with paper details and restrained glass highlights. The everyday UI uses neutral white and gray backgrounds, clear ink, squircle action buttons and dialog frames, restrained rounded fields and content panels, and small cyan accents.

Paper is the main material. Wii-style framing gives the controls their shape and shallow depth. Glass marks primary actions, selection, and floating layers. Flipnote-inspired illustration and dithering remain optional artwork.

This document records the agreed visual direction. Button is the first fully styled component. Tidepool is the default accent, with Aurora, Lavender, Slate, Lagoon, Sky, Blossom, Lime, Anemone, and Sunflower alternatives. Primary, selection, and focus roles follow the chosen preset; structural borders stay grayscale. Paper, panels, and ordinary controls use achromatic fills and ink. Status colors remain independent of the accent, and destructive states keep semantic red.

## Reference hierarchy

| Role                       | Reference traits                                                      | Application                                             | Boundary                                                                                                                                                                                                                                     |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core                       | DS-like organization, ruled, dotted, and grid paper, compact layouts  | Page backgrounds and content structure                  | Use one quiet paper pattern at a time. Keep dense content on plain backgrounds.                                                                                                                                                              |
| Supporting controls        | Wii framing and shallow shading                                       | Controls, navigation, and panel frames                  | Keep ordinary edges neutral; reserve accent edges for selected states and focus. Use native squircle corners on action buttons and Dialog/AlertDialog frames. Fields, selection controls, and other panels use conventional rounded corners. |
| Signature accent           | Glass rims, soft highlights, localized glow                           | Primary actions, selected elements, and floating layers | Keep most controls matte. Glass must clarify importance or layering.                                                                                                                                                                         |
| Optional artwork           | Flipnote outlines, sparse color, discrete dithered shading            | Empty states and occasional header illustrations        | Use original artwork. Do not pixelate routine text, icons, or controls.                                                                                                                                                                      |
| Outside the everyday theme | Dense ASCII/ANSI patterns, perspective-grid orbs, geometric spectacle | Occasional standalone artwork                           | Keep these out of forms, tables, and navigation.                                                                                                                                                                                             |

The lined announcement-bar reference is the clearest bridge between paper and lightly raised controls. The DS reference itself has square controls and pixel edges. Ninaero deliberately combines handheld organization with squircle geometry on action buttons.

## Materials and layout

- Use faint dots on the homepage and grid in catalogue previews. Reserve ruling for line-aligned prose and code. Choose one pattern per region; never layer different paper variants. Keep the existing page color when selecting a pattern.
- Keep forms, inputs, and tables on opaque, plain backgrounds. Ordinary code blocks keep an opaque neutral fill with faint horizontal rules aligned to their code lines; the texture must not interfere with syntax or focus. The homepage install command alone may use the site-only translucent glass treatment.
- Use squircle corners for action buttons, standalone icon buttons, and Dialog/AlertDialog frames. Fields, selection controls, and other panels keep conventional rounded corners. Preserve straight alignment in lists, tables, and compact forms.
- Keep cards and ordinary controls mostly matte. Avoid heavy bevels, console bezels, and large glossy gradients.
- Put glass on a small number of important elements. Readable content stays opaque even when its rim or backdrop is translucent.
- Keep crisp dithering and smooth blur on separate objects. They describe different materials and should not compete within one control.

### Homepage waves

Layer original PSP-inspired ribbons behind the bubbles. Derive their gradients from the selected accent, with translucent bodies and narrow highlights. Keep the neutral page fill and fade the waves near the top so the heading stays clear. Continuously deform shallow wavefronts so crests travel, flatten, and pass through one another. Keep the waves in the lower part of the page rather than rotating broad, rigid strips. The shared pause control stops both waves and bubbles. Pause the waves while the page is hidden, freeze them under reduced motion, and remove them in forced-colors mode. These effects are site-only, not part of the installable theme.

### Backdrop glass

Use Josh W. Comeau's [Next-level frosted glass with backdrop-filter](https://www.joshwcomeau.com/css/backdrop-filter/) as the reference for backdrop sampling, masking, and readability. The homepage adapts these principles to a soft blur of the bubbles behind its content, rather than a framed glass card.

- Keep the blur on a decorative child or pseudo-element, separate from text and controls. Use `pointer-events: none` and leave keyboard-focus outlines unclipped.
- Make the sampling area larger than the visible glass. Nearby objects should contribute to the blur before they cross its visible edge. Mask the oversized layer to control what gets painted. The article reports that overflow clipping also works in Chrome 142 and newer; check the target browsers before relying on clipping alone.
- Treat blur radius, visible shape, and edge feathering as separate choices. Use a rounded mask with a broad, smooth falloff for the homepage. Intersecting horizontal and vertical fades can leave boxy corners. Its blur continues beneath the header without a top fade; only the sides and bottom blend into the page. The site-only mask lives in `public/home-glass-mask.svg`.
- Keep fill opacity independent of blur strength. Use the actual page background for a neutral tint, rather than a lighter card gradient that reveals a rectangular panel. For the homepage, use an untinted, moderate blur that keeps bubble silhouettes visible rather than hiding them. Use less blur in light mode so faint bubble edges remain visible. Form controls and ordinary code blocks keep their opaque fills. The homepage install command is the only code-block exception.
- Extending a backdrop does not recover pixels outside the viewport. If scrolling produces flicker at a viewport edge, conceal that edge with a page-colored gradient, as the article demonstrates. Do not weaken the blur with a transparency fade over the heading.
- On the homepage, paint the sky and accent waves first, then bubbles, hero glass, dotted paper, and content. Keep the dots above the hero glass so they stay sharp. Sky and waves behind a bubble can refract; the dotted paper remains an unfiltered overlay. Keep dots transparent between marks and use the shared paper utility without duplicating its pattern recipe. Unsupported SVG backdrop filters retain the plain glass bubble appearance.
- A separate, lower-radius blur strip can create a glass rim. Reserve it for deliberately framed glass; the homepage's readability layer has no rim.

Provide a readable neutral fill when backdrop filtering is unavailable, and remove decorative glass in forced-colors mode. Review moving objects crossing the sides, bottom corners, and top boundary in light and dark modes, across accent presets and narrow layouts. Check focus and pointer interactions with the oversized layer present. Automated checks do not establish smooth compositing or text contrast over moving backdrops.

### Spacing and density

Borrow Wii U's repeated rows, aligned content edges, and separate navigation bands. The [menu references](https://www.nintendoworldreport.com/news/32404/wii-u-boot-screen-officially-revealed-for-television-and-gamepad) show a compact GamePad grid; the [operations manual, page 19](https://www.nintendo.com/eu/media/downloads/support_1/wii_u_3/WiiU_OperationsManual_EN.pdf) pairs a padded settings category with a denser list. WaraWara Plaza is a scene-based TV layout, not a form-spacing reference. These resized images support the hierarchy, not exact Nintendo pixel values.

The values below describe Ninaero's baseline at a 16px browser default font size, not a requirement to use pixel units throughout. Tailwind's spacing step is `0.25rem`, equivalent to 4px at that baseline. Give internal padding and space between controls separate roles.

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

Default fields use shared `field-height` and `field-padding-inline` tokens, currently 36px and 16px. Define them once in `registry/ninaero/theme.mjs`, independently of Tailwind's global spacing step. Button keeps its own size scale; use its 36px `lg` size alongside default fields when rows need to align. Small Select triggers remain compact.

| Control             | Height        | Horizontal inset | Internal spacing                     |
| ------------------- | ------------- | ---------------- | ------------------------------------ |
| Button xs / sm      | 24px / 28px   | 8px              | 4px icon-to-label gap                |
| Button default / lg | 32px / 36px   | 12px / 16px      | 8px icon-to-label gap                |
| Input               | 36px          | 16px             | 4px vertical inset, 20px line height |
| Select default      | 36px          | 16px             | 4px vertical inset, 8px content gaps |
| Select sm           | 28px          | 8px              | 4px vertical inset and content gaps  |
| Textarea            | At least 64px | 16px             | 8px vertical inset                   |

Icon-only buttons stay square and center their glyphs. Default and large icon-bearing buttons may reduce the icon-side inset by 4px; compact buttons keep their 8px inset. Use a 20px line height for ordinary control labels and 16px for compact labels. Textareas keep the existing responsive text sizing and 24px / 20px line heights on narrow / wider layouts.

Compound fields use a 16px outside inset and 8px between inline adornments and input content. Let the group own the border and row height. Embedded buttons reuse Button's actual size variants, and block adornments own the adjacent vertical inset instead of doubling the textarea's padding.

Select options keep an even minimum 32px row with 12px on the label side. Reserve room for the trailing checkmark and an 8px gap so text cannot run beneath it. Group labels share the option text edge.

Preserve each component's role-based corners, material depth, responsive text sizes, and native multiline sizing. Leave focus outlines and shadows unclipped; do not inflate every control to account for their painted extent. These defaults are compact web controls, not measurements of Nintendo touch targets. Use larger targets where the interaction requires them.

### Paper patterns

Use the Paper Details group in the moodboard for the ruled, dotted, and grid variants; use the supplied Nintendo DS notebook image for the notebook variant. Ruled, dotted, and grid use CSS gradients. Notebook uses an original repeating SVG mask generated by the theme. Do not copy reference image assets into the theme.

| Pattern      | Use                               | Shared class             |
| ------------ | --------------------------------- | ------------------------ |
| Ruled        | Line-aligned prose only           | `ninaero-paper-ruled`    |
| Dotted       | Homepage background               | `ninaero-paper-dotted`   |
| Grid         | Component catalogue thumbnails    | `ninaero-paper-grid`     |
| Notebook     | Decorative page and preview areas | `ninaero-paper-notebook` |
| Dither       | Transparent decorative overlays   | `ninaero-dither`         |
| Checker      | Transparent decorative checks     | `ninaero-checker`        |
| Wide checker | Transparent 2:1 decorative checks | `ninaero-checker-wide`   |

The homepage uses `bg-background` to keep the neutral page fill beneath its dots. Changing the texture must not introduce a blue-tinted background.

Use ruled paper only for paragraphs and other continuous text. Match the rule interval to the text's line height and offset the background so each text line sits between the rules on a consistent baseline. The default interval is `1.5rem`; pair `ninaero-paper-ruled` with `leading-(--ninaero-paper-step)` so both grow with the browser's default font size. Keep vertical padding and paragraph spacing in whole line-height increments and rule thickness at 1px. Override `--ninaero-paper-step` with another relative length when needed; numeric pattern suffixes remain pixel intervals. Check alignment after wrapping, responsive type changes, and text resizing. If alignment cannot be maintained, use a plain background.

Code Block content uses faint bottom borders on each rendered line rather than a repeating background image. Borders follow wrapped and highlighted lines; headers and footers remain unruled, with a fine divider above the footer. Keep the frame shallow, with a lit upper inset edge, a faint lower inset shade, and slight neutral tonal separation in the header. Do not add a floating cast shadow.

Ordinary code blocks keep their neutral fill opaque. The homepage install command reuses the registry Code Block with a site-only glass layer matching the header's 75% neutral fill, 12px backdrop blur, and slight saturation. Keep that layer separate from fully opaque text and controls, overscan its sampling area, and preserve keyboard-focus outlines. Without backdrop-filter support, retain the ordinary opaque fill. Remove the glass in forced-colors mode and print.

Do not use ruling behind forms, control specimens, tables, navigation, or mixed component layouts. Dotted and grid patterns may appear on page backgrounds and preview backdrops. Use the notebook pattern only as a decorative background or preview backdrop, not behind forms, text, or controls. Keep forms and tables on opaque, plain fills. A grid is one pattern made from horizontal and vertical rules; do not add dots or ruling over it. Separate sections with space instead of adding decorative divider lines.

Use the diamond-dither SVG mesh on plain decorative surfaces, not behind dense text or controls. Its default ink is neutral and it paints without changing the existing fill. Its default tile is 8px; numeric `ninaero-dither-*` utilities change the tile size. Keep one texture per region.

The separate `ninaero-overlay-dither` utility adds a static texture across the viewport when applied to `body`. The demo site enables Checker by default; installed themes keep it opt-in. Keep it above the page fill but behind page content and controls by wrapping the content in a positioned `z-index: 1` layer; portaled menus and dialogs remain above the texture. The base class uses Checker with a 2px tile. The `ninaero-overlay-dots` and `ninaero-overlay-lines` modifiers choose ordered dots or diagonal lines. Use multiply blending in light mode and screen blending in dark mode. While a Dialog or AlertDialog backdrop is mounted, use normal blending so its blur includes the texture. Keep the 6% ink opacity subtle enough for text and focus states to remain clear. The header's Overlay menu previews each texture or turns it off; navigation retains the choice and reload restores Checker. The layer ignores pointer input and is removed in forced-colors mode and print. The homepage and header reuse the finish on their opaque backgrounds so the texture remains visible behind their content and controls; the body layer is suppressed on the homepage. The scene finish sits above its sky and glass but below the dotted paper and content. Consumers can tune `--ninaero-overlay-opacity`, `--ninaero-overlay-size`, and `--ninaero-overlay-blend-mode`, or remove the base class to disable it.

The Nintendo-inspired Flipnote dither overlay uses `ninaero-overlay-flipnote` for an original 8px sparse pixel-stipple tile. Choose one overlay modifier at a time. Keep the texture static, faint, and behind opaque controls; do not add CRT scanlines, RGB fringing, or animated noise.

Use checkerboards as decorative overlays, not behind dense text or controls. The default square is 12px wide and tall; numeric `ninaero-checker-*` utilities set one square's size in CSS pixels. The repeating tile contains two ink squares and two transparent squares, leaving the fill visible beneath them. Checkerboards use a CSS conic gradient and share the pattern-ink color utilities.

The wide checker variant keeps a 2:1 width-to-height ratio. Use `ninaero-checker-wide` for 24 × 12px checks, or `ninaero-checker-wide-*` to set the height in CSS pixels; width is always twice that value. It shares the square checker's transparent fill, ink utilities, and forced-colors behavior.

Define pattern fills, ink, and CSS recipes in `registry/ninaero/theme.mjs` so consumers can use the same opt-in classes. Default paper fills and ink stay grayscale and independent of accent presets. Explicit `ninaero-pattern-ink-*` utilities opt decorative patterns into Tailwind colors and opacity modifiers without changing the fill. Tune the pattern ink separately in light and dark modes, and remove decorative textures in forced-colors mode. The initial spacing is `1.5rem` for ruling, 24px for grid, 16px for dots, and 6px for notebook lines with square 120px cells and marked intersections. Each notebook cell contains 20 whole fine-line intervals, keeping the ruling aligned across tile boundaries. Spacing and ink strength still need visual review.

## Color and typography

Ninaero is neutral-first in both color modes. Page backgrounds, cards, popovers, menus, dialogs, field fills, ordinary borders, default paper patterns, and cast shadows use grayscale values. Dark panels are charcoal or gray, not blue-black. A token named neutral must actually be achromatic, not merely unchanged across accent presets.

Reserve the chosen accent for primary actions, links, selected controls, active states, and keyboard focus. Secondary and Outline controls keep neutral materials. Feedback colors retain their semantic meaning. Syntax highlighting and data marks may use color to distinguish content, while their containers stay neutral. Popover and menu containers use the neutral card palette independently of Button material tokens; their selected items and controls may use the accent.

Code syntax tokens use bundled Shiki themes chosen for each accent in light and dark mode. Only token colors are applied; theme italics and other font treatments are ignored. Colors that fall below 4.5:1 are adjusted toward neutral ink while retaining their hue. Uncolored code text and the containing surface remain neutral.

Keep resting neutral borders close to their surrounding fills, using pale gray in light mode and charcoal in dark mode. Resting borders have no 3:1 contrast minimum. Preserve the existing contrast targets for text, keyboard focus, selected states, and errors.

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

Large hero headings may opt into `ninaero-display-ink`, a two-stop neutral ink gradient with a faint downward glyph shadow. Keep the top lighter than the bottom in both modes, with no colored glow or pronounced bevel. The homepage uses this treatment only on its neutral heading text; its muted accent tagline stays solid. Section headings, card and dialog titles, and control text remain solid. In forced-colors mode, remove the gradient and shadow and use system text colors.

Use tighter tracking only for headings and titles. Keep control text, body copy, and small supporting text at normal spacing. Compact controls override the label line height to `1rem`. Dialog and AlertDialog titles keep their `1.5rem` line height, and textareas keep their responsive `1.5rem` / `1.25rem` line heights. Ruled prose shares its line height with `--ninaero-paper-step`. Allow labels, descriptions, and errors to wrap without clipping. Use semibold emphasis within body copy without changing its line height.

Dark mode keeps the same framing, hierarchy, and restrained cyan accent. It should not become a separate neon dashboard. Adjust texture, fills, and highlights for readability instead of mechanically inverting the light theme.

### CSS units and font scaling

Use [Josh W. Comeau's pixels and accessibility article](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/) as the reference for unit selection. Ask whether a value should grow when the user increases their browser's default font size. Choose units for that behavior rather than converting everything to pixels or rems.

- Use `rem` or `em` for font sizes. Leave the root font size at the browser default; do not pin it to 16px or shrink it with the 62.5% trick.
- Let text-bearing controls, icons, and text-dependent widths grow with their labels. Prefer content-driven sizing or relative minimum dimensions over pixel heights that can clip enlarged text. Keep prose line heights unitless and vertical paragraph spacing relative, except where ruled prose shares an explicit relative interval.
- Use pixels for thin borders, focus-outline thickness, shallow material details, and decorative texture geometry that should not grow with text. Keep the site's outer gutters at 20px on narrow layouts and 32px on wide layouts so larger text does not also lose reading space to larger gutters. Control padding can remain relative where it preserves useful proportions.
- Use relative media queries for text-dependent layout changes. A compact layout is a response to available space, not a device category. Keep JavaScript and CSS breakpoints aligned; the Sidebar hook uses the same `48rem` threshold as Tailwind's `md` variant and reads `MediaQueryList.matches` instead of comparing `innerWidth` with a pixel constant.

For sizing and layout changes, test actual browser default font sizes of 16px, 32px, and 48px separately from page zoom at 200% and 400%. Changing only the page's root font size does not test relative media-query behavior. Check narrow and wide viewports, light and dark modes, accent presets, keyboard focus, hover, pressed, disabled, and invalid states. Navigation and dialog actions must remain reachable; labels, descriptions, and errors must not clip or overlap. Check for unexpected page-level horizontal scrolling and confirm that ruled text still aligns with its background. Automated build and compilation checks do not establish these visual outcomes.

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

## Gradients and material shading

Use [Josh W. Comeau's Make Beautiful Gradients](https://www.joshwcomeau.com/css/make-beautiful-gradients/) as the reference for color interpolation. The article explains how RGB interpolation can produce a gray midpoint between saturated colors, and how a different color space or intermediate stops can change that path. Ninaero applies those principles to shallow material shading, not rainbow decoration.

### Color paths

- Keep neutral materials achromatic throughout the gradient. Gray is intentional on paper and Secondary controls, not a defect to correct with saturation. Primary shading follows the chosen accent; Destructive shading stays within semantic red. Do not blend unrelated accent presets or pass through status colors for decoration.
- Choose the interpolation space deliberately. Writing endpoints as HSL does not itself select HSL interpolation. For new material gradients, start with explicit `in oklab` interpolation and judge the rendered result. This is Ninaero's starting point, not the article's universal recommendation.
- Inspect the midpoint as well as the endpoints. For intentional hue changes in optional artwork, compare hue-based interpolation with perceptual alternatives. HSL can avoid a gray midpoint but produce uneven perceived brightness. Do not assume one color space suits every gradient.
- Use intermediate stops when the intended color path needs more control. Calculate them in the chosen space, then store the resulting stops in CSS. Closely spaced colors can approximate that path even when interpolation between stops uses RGB. Add only enough stops to improve the result; a subtle two-stop material gradient does not need a generated palette.

### Placement and review

Keep raised controls lighter at the top and darker below, consistent with the shared overhead light. Use stop positions or an eased distribution to soften the transition without creating a stripe. Keep crisp rims and bevels separate from the smooth face shading. Pressed controls follow the recessed-lighting rules below; gradients must not imply a second light source.

Gradients remain local to existing material treatments and restrained glass accents. Keep fields plain and opaque, ordinary panels matte, and text solid except for opt-in hero display ink. The article's [Gradient Generator](https://www.joshwcomeau.com/gradient-generator/) is an authoring aid, not a runtime dependency. Its color stops can also serve radial or conic gradients, but those shapes need a specific lighting or artwork purpose.

Define shared recipes in `registry/ninaero/theme.mjs` and accent-specific colors in `registry/ninaero/accents.mjs`. Check interpolation support in target browsers before relying on it; if a required browser lacks it, use precomputed stops or a readable solid fill. Do not add runtime JavaScript to calculate decorative gradients.

Review the full transition at actual component sizes in light and dark modes and across all accent presets. Check hover, pressed, disabled, invalid, and keyboard-focus states. Verify text and control contrast against the least favorable background beneath them, including intermediate colors and translucent layers. Remove decorative gradients in forced-colors mode and retain system-color boundaries. These rules guide future styling; adding them does not establish that existing gradients have been audited.

## Shadows and elevation

Use [Josh W. Comeau's Designing Beautiful Shadows in CSS](https://www.joshwcomeau.com/css/designing-shadows/) as the default approach for all UI cast shadows. Require consistent lighting, layered falloff, and color derived from the receiving background. Apply these rules to new components and when revising existing shadows, rather than tuning each shadow in isolation.

### Shared lighting and materials

- Use one overhead light, with highlights at the top and cast shadows below. Keep horizontal offsets at zero across the elevation scale. This is Ninaero's choice of light direction; the article's above-left example is not a required angle.
- Separate the border, inset highlight, lower bevel, and cast shadow. Borders define each component's edge. Insets and a crisp lower edge describe the control's material and thickness. A soft outer shadow describes its distance from the surface beneath it.
- Keep Primary, Secondary, and Destructive on the same shallow elevation. Their fills communicate hierarchy and meaning; a destructive action does not need a taller shadow. Outline keeps a background-matched face with a fine top inset highlight, a lower rim, and a tiny contact shadow. It stays shallower than Secondary, without its gradient fill. Ghost and Link remain flat.
- Soften control cast shadows by broadening blur relative to the downward offset and tapering each layer's opacity. Keep enough shadow strength to show shallow elevation. A subtle fade should not make the shadow nearly invisible. The rim and bevel still define the Button; avoid a hard-edged dark silhouette beneath it.
- Do not turn shadows into accent-colored glow. Keep cast shadows achromatic on neutral paper and panels, and tune their lightness to the receiving material. A red button on neutral paper should not automatically cast a red shadow.

### Receiving-background color

Cast shadows must respond to the background beneath the component. Derive the shadow's hue from that background, reduce its saturation and lightness, and control strength through each layer's alpha. Neutral backgrounds produce neutral shadows. A colored control on neutral paper still casts a neutral shadow; a control over a tinted panel can cast a muted shadow of the panel's hue.

`--shadow-surface` identifies the opaque receiving background. The shared recipe mixes 40% of that background with black in Oklab, reducing perceptual lightness and chroma while preserving hue. It exposes the resulting tone through `--shadow-color` for `hsl(var(--shadow-color) / alpha)`. Darkening before the HSL conversion avoids unstable saturation near white. Keep this recipe shared rather than adding per-accent shadow colors.

The page derives its context from `--background`. Mapped opaque backgrounds and built-in painted surfaces establish local contexts for their contents. Conditional Sidebar layouts, Bubble variants, table states and footers, and transparent Calendar compositions follow their active fill. Translucent fills are composited against the inherited underlay before shadow color is derived. Rebind color-dependent elevation tokens where they are used; an elevation computed at the page root cannot respond to a different inherited color later.

For a custom background, use `ninaero-shadow-surface` and declare the same color for its fill and receiving-background token:

```css
.example-panel {
  background-color: var(--example-panel-fill);
  --shadow-surface: var(--example-panel-fill);
}
```

Apply both `example-panel` and `ninaero-shadow-surface` to the background container. Its raised descendants then use that context. CSS cannot infer an arbitrary painted background from a class name or sample the pixels behind an element. Gradients and translucent backgrounds need a representative opaque or composited color.

Keep a panel's exterior and interior contexts separate. Its own cast shadow belongs to the background beneath the panel; controls inside it cast onto the panel's fill. Portals inherit from their DOM container, not their React trigger. If a portalled layer sits over a different colored region, provide its receiving-background context explicitly at the portal container.

Do not use a dark opaque lower rim to make a cast shadow stronger. A rim describes material thickness and must remain distinct from soft falloff. Highlighted menu rows sit closer to their popup surface than raised Buttons do, so use the lighter menu contact-shadow recipe and a fine upper highlight. Keep disabled rows flat and focus outlines independent.

### Layered elevation

Use the semantic `shadow-flat`, `shadow-control`, `shadow-floating`, and `shadow-dialog` utilities rather than tuning each component independently. These levels describe perceived distance from the receiving material. Keep `z-index` separate; stacking order does not determine shadow length.

| Level    | Use                                                | Shadow treatment                                                                                |
| -------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Flat     | Page content, tables, and ordinary paper panels    | No cast shadow. Use spacing and borders for separation.                                         |
| Control  | Raised Primary, Secondary, and Destructive buttons | A tight contact shadow plus a small, softer outer layer. Keep the bevel separate.               |
| Floating | Popovers and menus                                 | Increase downward offset and blur together; reduce each layer's opacity as the object rises.    |
| Dialog   | A modal above the working content                  | The broadest layered shadow, with lower per-layer opacity. Keep the scrim a separate treatment. |

Build each cast shadow from layers with progressively larger offsets and blur radii. Control elevation uses two short layers; floating and dialog levels retain broader, lower-opacity layers. Layer opacity accumulates, so judge the combined shadow rather than copying the same opacity across levels.

A Button Group made entirely of raised buttons owns one control cast shadow. Its buttons keep their inset bevels and local pressed states without adding overlapping outer shadows. Mixed field, Outline, Ghost, or Link groups retain their existing individual materials. All-disabled groups lose the cast shadow. Preserve outer corner geometry and leave focus outlines unclipped.

On press, reduce the control's apparent distance from the paper. Collapse its outer shadow and use a small top inset shade with a lower inset highlight. Pair that change with the pressed fill and brief movement; under reduced motion, the static fill and inset lighting must still communicate the press. Disabled controls lose raised shadows.

### Color inside pressed controls

Cast shadows take their color from the receiving paper or panel. Recessed shading takes its color from the control's own pressed fill. Use a darker, lower-chroma tone for the inset shade and a lighter, lower-chroma tone for the inset highlight. A red Button can have red-tinted internal shading while casting a neutral paper shadow. Primary follows its selected accent; Secondary and Outline use paper tones; Destructive keeps its semantic red material.

Reverse the depth cue, not the hue or the light source. Under the same overhead light, a pressed control has shade along its upper interior and a fine highlight along its lower interior. Keep both horizontal offsets at zero and remove the outer cast shadow. Outline's resting rim and contact shadow collapse into the same paper recess on press. Ghost and Link do not acquire recessed framing.

Use the shared `recessShadow(fill)` recipe in `registry/ninaero/theme.mjs` for fields, neutral Slider and Switch tracks, unchecked Checkboxes and Radio Group items, segmented tab trays, and recessed press states. It uses a 2px downward inset shade with 6px blur and a 1px upward inset highlight with 2px blur. Derive both tones from the local fill with `color-mix(in oklab, ...)`. The shared `recess-shade-weight` is 6% in light mode and 12% in dark mode; `recess-highlight-weight` is 35% and 7%. Buttons and selected controls retain their own pressed fills. An unchecked Checkbox darkens its neutral fill on press without changing the recess geometry. Verify text, marks, and selected boundaries against both inset tones.

Keep this lighting separate from keyboard-focus outlines, invalid borders, and disabled styling. Reduced motion removes movement but retains the static recessed cue. Forced-colors mode removes decorative inset lighting and preserves system-color boundaries.

### Theme tokens and validation

Keep elevation geometry separate from shadow color. Define the shared recipes in `registry/ninaero/theme.mjs`; use an inherited receiving-surface shadow color so the same elevation can work on paper or a dark panel. Accent presets may change primary-action edges and highlights; ordinary structural borders remain neutral.

In dark mode, tune the shadow against the actual panel instead of increasing black opacity until it disappears. Use a visible rim and inset highlight for separation where a cast shadow alone cannot provide it. Keep glow, focus outlines, and invalid-state borders separate from elevation.

Compare all raised Button variants together in light and dark modes, on both paper and plain panels. Check resting, hover, pressed, disabled, and keyboard-focus states. When floating components are styled, check that their elevation remains above controls and that shadows are not clipped. Verify contrast against the highlighted and shaded fills, not just the base color. In forced-colors mode, remove decorative shadows and retain system-color boundaries.

The shared recipes live in `registry/ninaero/theme.mjs`. The `--shadow-flat`, `--shadow-control`, `--shadow-floating`, and `--shadow-dialog` tokens expose them to CSS and Tailwind. Flat uses a transparent zero-size layer so it can compose with inset bevels; use `shadow-none` to remove an entire shadow treatment.

The standard `shadow-sm` utility also uses control elevation; `shadow-md` and `shadow-lg` use floating elevation; `shadow-xl` and `shadow-2xl` use dialog elevation. Dialog, Alert Dialog, and Sheet use the dialog level; the chart tooltip uses the floating level.

Shadow color inherits from `--shadow-color`. The `ninaero-surface-paper` class derives it from `--paper-fill`, including for the header's appearance controls. Use `ninaero-shadow-surface` with `--shadow-surface` for other custom receiving backgrounds. Installed components and standard elevation utilities resolve color-dependent shadow variables locally. Review the result on the actual background in both modes.

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

The homepage at `/` has a concise introduction and an install command; it does not feature a composed interface example. `/docs` contains component documentation and a searchable component list in its sidebar. The standalone `/components` and `/examples` pages and their example routes are removed. `/workshop` links to separate Button, Input, Dialog, and token specimens rather than collecting every state on one page. All routes use the same theme and independent color-mode and accent controls.

Borrow Afterglow's homepage structure: a prominent heading and an install command. Use faint dots on the neutral homepage background. Keep grid in catalogue previews and reserve ruling for line-aligned prose. Separate sections with space, not decorative divider lines. Retain borders for controls. Keep catalogues, token swatches, state matrices, and composed examples off the homepage. Keep the accent picker in the header only. Tint the hero tagline with a muted version of the selected accent; keep the main heading and page background neutral. The header also has a compact, icon-only System, Dark, Light Button Group. Workshop pages remain available by URL without a detached footer link. Example compositions are not registry blocks unless explicitly registered. Keep UI text action-led and remove captions that repeat nearby labels; retain necessary preview and persistence qualifications.

- Keep shared tokens and theme rules in `registry/ninaero/theme.mjs`.
- Keep installable component styling in `registry/ninaero/ui/`.
- Do not make workshop-only styling a substitute for the installable theme.
- Treat `app/globals.css` and `registry.json` as generated outputs, not design source files.

The visual direction does not require changing component APIs or interaction behavior.

### Corner geometry

Use squircle detailing for action buttons and Dialog/AlertDialog frames, not every clickable element. Typography, neutral materials, spacing, and accent states connect the rest of the interface.

| Treatment                                       | Components                                                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native squircle corners                         | Button variants, standalone icon buttons, toolbar and pagination actions, and Dialog/AlertDialog frames and action buttons                                                    |
| Squircle outer corners, straight internal seams | Button Group. Do not add a second squircle frame around its children                                                                                                          |
| Regular rounded field corners                   | Input, Textarea, Input Group, Input OTP, Select, Native Select, Combobox, and Date Picker triggers                                                                            |
| Regular rounded selection corners               | Toggle, Toggle Group, Tabs, Checkbox, Calendar day cells, and menu options                                                                                                    |
| Regular rounded overlay corners                 | Drawer, Sheet, Popover, Hover Card, Tooltip, Dropdown Menu, Context Menu, Command, Menubar, and Navigation Menu panels                                                        |
| Regular rounded content corners                 | Card, Alert, Empty, Toast, Sonner, Attachment, Bubble, Message, Item, Kbd, Code Block, Table and Data Table containers, Chart containers, Sidebar panels, and Carousel frames |

Avatar, Radio Group, Switch, Progress, Spinner, and pill-shaped Badges keep their conventional circles or pills. Structural components such as Field, Label, Separator, Breadcrumb, Typography, Trace, Accordion, and Collapsible need no independent framed silhouette. Skeletons match the shape they represent.

Choose corners by role rather than the underlying React component. A Date Picker trigger or Calendar day cell remains a field or selection control even when implemented with Button. Embedded input accessories use regular corners inside the field's frame. Genuine action buttons inside a panel keep squircles.

Use the existing radius scale for conventional corners. The shared field recipe uses 12px corners. Toggle and Select options use `radius-md`, currently 8px. The shared floating frame and preview frames use `radius-xl`, currently 14px. Dialog and AlertDialog frames use a `3rem` (48px) corner extent with native squircle curves. Calendar days retain their cell radius and joined range edges. Keep existing component-specific regular radii elsewhere.

The installed `ninaero-rounded-control` class gives a composed Button conventional control corners without changing its material or behavior. Apply it when Button represents a field trigger. Calendar days and buttons embedded in Input Group receive the same role-based treatment through shared theme rules.

#### Rendering squircles

Button, Dialog, AlertDialog, and Slider thumbs use native CSS `corner-shape: squircle` with a nonzero `border-radius` to define the corner extent. This produces superellipse curves without a clipping mask, extra DOM, or JavaScript measurement. Shadows and focus outlines remain outside the component.

True squircle rendering requires browser support for `corner-shape`. Unsupported browsers display ordinary rounded action buttons and dialog frames, which do not fulfill their intended squircle geometry. The Button workshop identifies that limitation. No polyfill is included. Conventional rounded fields and other panels do not depend on squircle support.

Accent presets live in `registry/ninaero/accents.mjs` and feed the same theme source and registry output as the Button rules. The root `data-accent` attribute selects a preset independently of light/dark mode. The workshop provides an Accent selector and side-by-side Button comparisons. Accent fills, selection, and focus follow the chosen preset; structural borders stay neutral.

Secondary uses a paper-material edge; Outline uses a neutral ink/paper edge. Both borders have separate light/dark tokens and stay unchanged when the accent changes. Invalid Buttons keep their variant material and use a single restrained semantic-red border, without an always-on ring. The outer outline appears only for keyboard focus and follows the accent, or the system highlight color in forced-colors mode.

### Input fields

Input, Textarea, and Select triggers use regular rounded corners with a 12px radius, distinct from Button's squircle proportions. Default fields share `field-height` and `field-padding-inline`, currently `2.25rem` and `1rem`. Textarea shares the horizontal inset but retains its multiline height. Compact Select triggers keep their 28px height and `0.5rem` horizontal inset. InputGroup shares the default row height and outside inset, including its adornments.

Use an opaque neutral `input-fill` slightly darker than the surrounding panel and a fine neutral edge. Its dedicated `input-edge` token is quieter than the shared control border in both modes. Strengthen the neutral edge on hover without overriding invalid or disabled states.

Give fields the shared soft paper recess described above, using `input-fill` for both lighting tones. Keep the center flat and opaque. Placeholder ink must retain contrast against both inset tones.

Invalid fields retain this material and use a semantic-red border. Keyboard focus adds a separate accent outline, including on invalid and read-only fields. Disabled fields remain opaque and lose the inset lighting; their dark fill must not become brighter than an enabled field. Forced-colors mode removes decorative inset lighting and preserves system boundaries. Do not add raised Button bevels, cast shadows, glossy gradients, glass, movement, or paper texture inside a field.

Textarea keeps its `4rem` minimum height, `0.5rem` vertical padding, native resizing, and content-based sizing. Inside InputGroup, suppress its inner border, inset lighting, and focus outline so the group owns the frame.

Select uses the shared default field height, retains its compact trigger size, and preserves Base UI's positioning and keyboard behavior. Its menu uses the shared neutral floating frame with regular rounded `radius-xl` corners, currently `0.875rem`. Selected options have a pale accent fill, a defined edge, and a check mark. Highlighted options use an inset outline that stays inside the menu. Disabled options remain opaque with muted ink. Keep their highlight visible when Base UI focuses them for inspection; they cannot be selected. Reduced motion removes popup and chevron transitions; forced-colors mode preserves selection and highlights with system colors.

The [Wii Internet Channel text-entry reference](https://www.nintendo.com/eu/media/images/06_screenshots/systems_4/wii_10/wii_channels/internet_channel/Internet_Channel_Wii_Channel_04_EN_CMM_big.jpg) shows a long rectangular field with restrained corners, distinct from its rounder action buttons. It does not establish mathematical squircle curves. Ninaero keeps these fields conventionally rounded, distinct from squircle action buttons and dialog frames. DS nickname-field geometry has not been independently verified.

### Sliders

Keep the 10px recessed channel neutral. Use the chosen accent's glass gradient colors for the convex selected range, with a lit upper rim and a shaded lower edge. Give neutral horizontal native-squircle grabbers secondary Button's fill, border, highlight, shade, and control shadow. Use short grip marks with softened ends. Light-mode marks have etched shading; dark-mode marks match the neutral border. Do not add an inset outline. Keep the overhead lighting consistent on vertical sliders. Hover uses Button's neutral hover fill. Pressing or dragging replaces the lighting and cast shadow with Button's shallow recess, without changing the grabber's size or delaying position updates. Squircle grabbers have the same native browser-support requirement as Button.

Keep the pointer target at least 32px and leave the thumb's shadow and keyboard-focus outline unclipped. Disabled sliders keep their values and lose decorative lighting. Invalid states use semantic-red grip marks, separate from the accent focus outline. Reduced motion removes material transitions. Forced-colors mode uses system colors without gradients or shadows.

### Tabs

Segmented tabs use conventional rounded corners and a compact 32px horizontal track. Keep the track neutral and shallowly recessed. Give the selected tab a brighter neutral face with soft top-to-bottom shading, a localized upper glass reflection, a crisp top rim, a narrow lower edge, and a small contact shadow. Keep its depth below Button so navigation does not compete with primary actions.

Underline tabs keep their labels unboxed and use a 4px accent strip with 2px rounded corners. Use a contrast-safe tone from the primary-action palette for the whole strip, with a faint upper sheen and one soft contact shadow, without a separate lower edge. Keep the body and shaded face at least 3:1 against the surrounding panel. Place the horizontal marker below the label and the vertical marker at the trailing edge. Hover changes label emphasis; press flattens the marker's lighting while retaining its accent color.

Keyboard focus has a separate accent outline on tabs and panels; leave it unclipped. Feedback stays immediate without moving labels or animating panels. Reduced motion removes material transitions. Forced-colors mode removes decorative rail lighting and uses system selection, boundary, and focus colors.

### Dialogs

Dialog and AlertDialog use the same installed theme classes for their frame and scrim. Keep their Base UI primitives and behavior separate.

Use native squircle corners at `3rem` (48px). This is Ninaero's chosen geometry, not a measurement of Nintendo's original UI. Give the frame a shallow paper/plastic finish with an opaque neutral fill, faint top-to-bottom shading, a fine grayscale edge, an upper inset highlight, and a lower inset shade. Combine these with the shared dialog cast shadow. Keep the panel matte; reserve accent and glass treatment for primary actions and focus.

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
- Final Button squircle corner extent, border weights, and shadow values.
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
