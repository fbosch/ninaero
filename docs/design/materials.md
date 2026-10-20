# Materials and patterns

Part of the [Ninaero design direction](../../DESIGN.md).

## Materials and layout

- Use faint dots on the homepage and grid in catalogue previews. Reserve ruling for line-aligned prose and code. Choose one pattern per region; never layer different paper variants. Keep the existing page color when selecting a pattern.
- Keep forms, inputs, and tables on opaque, plain backgrounds. Ordinary code blocks keep an opaque neutral fill with faint horizontal rules aligned to their code lines; the texture must not interfere with syntax or focus. The homepage install command alone may use the site-only translucent glass treatment.
- Use squircle corners for action buttons, standalone icon buttons, and Dialog/AlertDialog frames. Fields, selection controls, and other panels keep conventional rounded corners. Preserve straight alignment in lists, tables, and compact forms.
- Keep cards and ordinary controls mostly matte. Avoid heavy bevels, console bezels, and large glossy gradients.
- Put glass on a small number of important elements. Readable content stays opaque even when its rim or backdrop is translucent.
- Keep crisp dithering and smooth blur on separate objects. They describe different materials and should not compete within one control.

## Homepage waves

Layer original PSP-inspired ribbons behind the bubbles. Derive their gradients from the selected accent, with translucent bodies and narrow highlights. Keep the neutral page fill and fade the waves near the top so the heading stays clear. Continuously deform shallow wavefronts so crests travel, flatten, and pass through one another. Keep the waves in the lower part of the page rather than rotating broad, rigid strips. The shared pause control stops both waves and bubbles. Pause the waves while the page is hidden, freeze them under reduced motion, and remove them in forced-colors mode. These effects are site-only, not part of the installable theme.

## Backdrop glass

Use Josh W. Comeau's [Next-level frosted glass with backdrop-filter](https://www.joshwcomeau.com/css/backdrop-filter/) as the reference for backdrop sampling, masking, and readability. The homepage adapts these principles to a soft blur of the bubbles behind its content, rather than a framed glass card.

- Keep the blur on a decorative child or pseudo-element, separate from text and controls. Use `pointer-events: none` and leave keyboard-focus outlines unclipped.
- Make the sampling area larger than the visible glass. Nearby objects should contribute to the blur before they cross its visible edge. Mask the oversized layer to control what gets painted. The article reports that overflow clipping also works in Chrome 142 and newer; retain the mask unless clipping alone has been visually verified to preserve the same sampling and visible edges.
- Treat blur radius, visible shape, and edge feathering as separate choices. Use a rounded mask with a broad, smooth falloff for the homepage. Intersecting horizontal and vertical fades can leave boxy corners. Its blur continues beneath the header without a top fade; only the sides and bottom blend into the page. The site-only mask lives in `public/home-glass-mask.svg`.
- Keep fill opacity independent of blur strength. Use the actual page background for a neutral tint, rather than a lighter card gradient that reveals a rectangular panel. For the homepage, use an untinted, moderate blur that keeps bubble silhouettes visible rather than hiding them. Use less blur in light mode so faint bubble edges remain visible. Form controls and ordinary code blocks keep their opaque fills. The homepage install command is the only code-block exception.
- Extending a backdrop does not recover pixels outside the viewport. If scrolling produces flicker at a viewport edge, conceal that edge with a page-colored gradient, as the article demonstrates. Do not weaken the blur with a transparency fade over the heading.
- On the homepage, paint the sky and accent waves first, then bubbles, hero glass, dotted paper, and content. Keep the dots above the hero glass so they stay sharp. Sky and waves behind a bubble can refract; the dotted paper remains an unfiltered overlay. Keep dots transparent between marks and use the shared paper utility without duplicating its pattern recipe. Unsupported SVG backdrop filters retain the plain glass bubble appearance.
- A separate, lower-radius blur strip can create a glass rim. Reserve it for deliberately framed glass; the homepage's readability layer has no rim.

Provide a readable neutral fill when backdrop filtering is unavailable, and remove decorative glass in forced-colors mode. Review moving objects crossing the sides, bottom corners, and top boundary in light and dark modes, across accent presets and narrow layouts. Check focus and pointer interactions with the oversized layer present. Automated checks do not establish smooth compositing or text contrast over moving backdrops.

## Paper patterns

Use the Paper Details group in the moodboard for the ruled, dotted, and grid variants; use the supplied Nintendo DS notebook image for the notebook variant. Ruled, dotted, and grid use CSS gradients. Notebook uses an original repeating SVG mask generated by the theme. Do not copy reference image assets into the theme.

| Pattern         | Use                                   | Shared class             |
| --------------- | ------------------------------------- | ------------------------ |
| Ruled           | Line-aligned prose; tooltip scanlines | `ninaero-paper-ruled`    |
| Dotted          | Homepage background                   | `ninaero-paper-dotted`   |
| Grid            | Component catalogue thumbnails        | `ninaero-paper-grid`     |
| Notebook        | Decorative page and preview areas     | `ninaero-paper-notebook` |
| Dither          | Transparent decorative overlays       | `ninaero-dither`         |
| Checker         | Transparent decorative checks         | `ninaero-checker`        |
| Wide checker    | Transparent 2:1 decorative checks     | `ninaero-checker-wide`   |
| Ordered dots    | Transparent decorative dot grid       | `ninaero-ordered-dots`   |
| Diagonal lines  | Transparent decorative hatching       | `ninaero-diagonal-lines` |
| Flipnote dither | Transparent sparse stipple            | `ninaero-flipnote`       |

The homepage uses `bg-background` to keep the neutral page fill beneath its dots. Changing the texture must not introduce a blue-tinted background.

As a writing surface, use ruled paper only for paragraphs and other continuous text. Match the rule interval to the text's line height and offset the background so each text line sits between the rules on a consistent baseline. The default interval is `1.5rem`; pair `ninaero-paper-ruled` with `leading-(--ninaero-paper-step)` so both grow with the browser's default font size. Keep vertical padding and paragraph spacing in whole line-height increments and rule thickness at 1px. Override `--ninaero-paper-step` with another relative length when needed; numeric pattern suffixes remain pixel intervals. Check alignment after wrapping, responsive type changes, and text resizing. If alignment cannot be maintained, use a plain background.

The ruled pattern also serves as a faint CRT scanline texture on small dark floating surfaces. Tooltips use a fixed pixel interval (`ninaero-paper-ruled-4`) that does not align with their text; that is intended, since the lines describe the screen-like material rather than a writing surface. Keep scanlines static, transparent between lines, and tinted with the surface's own ink through a dedicated token such as `tooltip-scanline-ink`, so they stay below the label's contrast. Paint them on a decorative pseudo-element behind the content, and remove them in forced-colors mode, as the paper utilities already do. Do not use scanlines on paper, panels, forms, or long text, and do not combine them with another texture on the same surface.

Code Block content uses faint bottom borders on each rendered line rather than a repeating background image. Borders follow wrapped and highlighted lines; headers and footers remain unruled, with a fine divider above the footer. Keep the frame shallow, with a lit upper inset edge, a faint lower inset shade, and slight neutral tonal separation in the header. Do not add a floating cast shadow.

The default Code Block copy button is a Ninaero-specific exception to flat Ghost buttons. Keep it flat at rest, raise it 1px on hover with shared control lighting, and recess it while pressed. Reduced motion keeps the static lighting without movement. Other Ghost and Link buttons retain their flat treatment.

Ordinary code blocks keep their neutral fill opaque. The homepage install command reuses the registry Code Block with a site-only glass layer matching the header's 75% neutral fill, 12px backdrop blur, and slight saturation. Keep that layer separate from fully opaque text and controls, overscan its sampling area, and preserve keyboard-focus outlines. Without backdrop-filter support, retain the ordinary opaque fill. Remove the glass in forced-colors mode and print.

Do not use ruling behind forms, control specimens, tables, navigation, or mixed component layouts. Dotted and grid patterns may appear on page backgrounds and preview backdrops. Use the notebook pattern only as a decorative background or preview backdrop, not behind forms, text, or controls. Keep forms and tables on opaque, plain fills. A grid is one pattern made from horizontal and vertical rules; do not add dots or ruling over it. Separate sections with space instead of adding decorative divider lines.

Use the diamond-dither SVG mesh on plain decorative surfaces, not behind dense text or controls. Its default ink is neutral and it paints without changing the existing fill. Its default tile is 8px; numeric `ninaero-dither-*` utilities change the tile size. Keep one texture per region.

The separate `ninaero-overlay-dither` utility adds a static texture across the viewport when applied to `body`. The demo site enables Checker by default; installed themes keep it opt-in. Keep it above the page fill but behind page content and controls by wrapping the content in a positioned `z-index: 1` layer; portaled menus and dialogs remain above the texture. The base class uses Checker with a 2px tile. The `ninaero-overlay-dots` and `ninaero-overlay-lines` modifiers choose ordered dots or diagonal lines. Use multiply blending in light mode and screen blending in dark mode. While a Dialog or AlertDialog backdrop is mounted, use normal blending so its blur includes the texture. Keep the 6% ink opacity subtle enough for text and focus states to remain clear. The header's Overlay menu previews each texture or turns it off; navigation retains the choice and reload restores Checker. The layer ignores pointer input and is removed in forced-colors mode and print. The homepage and header reuse the finish on their opaque backgrounds so the texture remains visible behind their content and controls; the body layer is suppressed on the homepage. The scene finish sits above its sky and glass but below the dotted paper and content. Consumers can tune `--ninaero-overlay-opacity`, `--ninaero-overlay-size`, and `--ninaero-overlay-blend-mode`, or remove the base class to disable it.

The Nintendo-inspired Flipnote dither overlay uses `ninaero-overlay-flipnote` for an original 8px sparse pixel-stipple tile. Choose one overlay modifier at a time. Keep the texture static, faint, and behind opaque controls; do not add viewport-wide CRT scanlines, RGB fringing, or animated noise. Local tooltip scanlines follow the ruled-pattern rules above.

The header overlay's textures are also ordinary element patterns: `ninaero-ordered-dots` (4px tiles), `ninaero-diagonal-lines` (4px), and `ninaero-flipnote` (8px), with Checker covered by `ninaero-checker-2`. Like dither, they paint a mask on a decorative `::before` layer without changing the element's fill, take their ink from `ninaero-pattern-ink-*`, accept numeric `-*` tile sizes in CSS pixels, and are removed in forced-colors mode. They share their mask tokens with the viewport overlay, so both stay in step. Use them on plain decorative surfaces and over images, not behind dense text or controls.

Use checkerboards as decorative overlays, not behind dense text or controls. The default square is 12px wide and tall; numeric `ninaero-checker-*` utilities set one square's size in CSS pixels. The repeating tile contains two ink squares and two transparent squares, leaving the fill visible beneath them. Checkerboards use a CSS conic gradient and share the pattern-ink color utilities.

The wide checker variant keeps a 2:1 width-to-height ratio. Use `ninaero-checker-wide` for 24 × 12px checks, or `ninaero-checker-wide-*` to set the height in CSS pixels; width is always twice that value. It shares the square checker's transparent fill, ink utilities, and forced-colors behavior.

Define pattern fills, ink, and CSS recipes in `registry/ninaero/theme.mjs` so consumers can use the same opt-in classes. Default paper fills and ink stay grayscale and independent of accent presets. Explicit `ninaero-pattern-ink-*` utilities opt decorative patterns into Tailwind colors and opacity modifiers without changing the fill. Tune the pattern ink separately in light and dark modes, and remove decorative textures in forced-colors mode. The initial spacing is `1.5rem` for ruling, 24px for grid, 16px for dots, and 6px for notebook lines with square 120px cells and marked intersections. Each notebook cell contains 20 whole fine-line intervals, keeping the ruling aligned across tile boundaries. Spacing and ink strength still need visual review.
