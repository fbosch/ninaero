# Lighting: gradients and shadows

Part of the [Ninaero design direction](../../DESIGN.md).

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

Define shared recipes in `registry/ninaero/theme.mjs` and accent-specific colors in `registry/ninaero/accents.mjs`. Verify interpolation and its fallback in the browser versions recorded for visual review. When interpolation is unavailable, use precomputed stops or a readable solid fill. Do not add runtime JavaScript to calculate decorative gradients.

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
