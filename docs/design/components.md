# Component details

Part of the [Ninaero design direction](../../DESIGN.md).

## Input fields

Use the shared field dimensions in [Control geometry](layout.md#control-geometry) and the role-based radii in [Corner geometry](layout.md#corner-geometry).

Use an opaque neutral `input-fill` slightly darker than the surrounding panel and a fine neutral edge. Its dedicated `input-edge` token is quieter than the shared control border in both modes. Strengthen the neutral edge on hover without overriding invalid or disabled states.

Give fields the shared soft paper recess described above, using `input-fill` for both lighting tones. Keep the center flat and opaque. Placeholder ink must retain contrast against both inset tones.

Invalid fields retain this material and use a semantic-red border. Their upper inset shade keeps the neutral shade's lightness but takes a faint destructive tint (`input-invalid-shade`), so text and placeholders keep their contrast. Keyboard focus adds a separate accent outline, including on invalid and read-only fields. Disabled fields remain opaque and lose the inset lighting; their dark fill must not become brighter than an enabled field. Forced-colors mode removes decorative inset lighting and preserves system boundaries. Do not add raised Button bevels, cast shadows, glossy gradients, glass, movement, or paper texture inside a field.

Textarea retains native resizing and content-based sizing. Inside InputGroup, suppress its inner border, inset lighting, and focus outline so the group owns the frame.

Select preserves Base UI's positioning and keyboard behavior. Its menu uses the shared neutral floating frame. Selected options have a pale accent fill, a defined edge, and a check mark. Highlighted options use an inset outline that stays inside the menu. Disabled options remain opaque with muted ink. Keep their highlight visible when Base UI focuses them for inspection; they cannot be selected. Reduced motion removes popup and chevron transitions; forced-colors mode preserves selection and highlights with system colors.

The [Wii Internet Channel text-entry reference](https://www.nintendo.com/eu/media/images/06_screenshots/systems_4/wii_10/wii_channels/internet_channel/Internet_Channel_Wii_Channel_04_EN_CMM_big.jpg) shows a long rectangular field with restrained corners, distinct from its rounder action buttons. It does not establish mathematical squircle curves. Ninaero keeps these fields conventionally rounded, distinct from squircle action buttons and dialog frames.

## Field and Label

Field, FieldSet, and Label are structural: they arrange library controls and their text without a framed silhouette of their own. Follow the roles in [Spacing and density](layout.md#spacing-and-density), with one owner for each gap. A Field stacks its label, control, description, and error 8px apart, including a FieldContent's label and description; descriptions do not pull themselves closer with negative margins. A legend keeps 8px below it. FieldGroup separates fields by 16px and widens to 24px when it holds FieldSets; checkbox and radio option lists keep their tighter 12px.

Labels and legends use `type-label`; descriptions and errors use `type-body` and wrap freely. Descriptions use muted ink, and their links use the accent link ink with a thicker underline on hover. Invalid fields keep the label and description neutral: the control's red boundary or fill and the destructive `FieldError` text carry the state. Disabled labels and titles switch to muted ink at full opacity, matching disabled fields, rather than fading.

A FieldLabel that wraps a Field is a choice card and follows the selection recipe: a neutral `--border` edge with `radius-lg` corners at rest, a faint muted fill on hover, and the pale accent fill with a `--ring` edge when its control is checked. The card stays flat in every state: its checked Checkbox or Radio is convex glass, and one depth cue per choice keeps the card from contradicting it. Descriptions inside a checked card mix 15% foreground into their muted ink to keep 4.5:1 on the accent fill. Forced-colors mode uses a system-color edge that switches to `Highlight` when checked. FieldSeparator places its label between two flanking rules rather than on a page-colored patch, so it works on any surface; prefer space alone where no alternative needs naming.

## Card

Cards are flat paper panels at the [flat elevation level](lighting.md#layered-elevation): an opaque `--card` fill, a real 1px neutral `--border` edge, and `radius-xl` corners, with no cast shadow. Draw the edge as a border, not a box-shadow ring, so it survives forced-colors mode and keyboard focus. The card is its children's receiving background for shadows.

Use the 24px panel inset by default and 16px for `size="sm"`. Header, content, and footer share that inset and the card's gap; the footer is part of one continuous panel, with no tinted band or divider, matching Dialog. Do not clip the card's contents, so child focus outlines and control shadows stay visible; a first or last image rounds its own corners to sit flush with the frame.

Keep cards plain. Their content is usually text, forms, or controls, which stay on opaque, plain fills. A card may carry one paper pattern only where [Paper patterns](materials.md#paper-patterns) already allows it: ruled paper for continuous prose, framed as its own sheet with a neutral `--border` edge, `radius-lg` corners, and a 16px side inset so the rules end at the frame rather than floating in the card, or a decorative pattern on a media or illustration region that holds no text or controls. Any pattern may also sit over an image as a transparent overlay: a paper pattern with `--paper-fill` cleared, or any other pattern from [Paper patterns](materials.md#paper-patterns), including the overlay textures `ninaero-ordered-dots`, `ninaero-diagonal-lines`, and `ninaero-flipnote`. Tint it with a `ninaero-pattern-ink-*` utility, keep it `aria-hidden` and pointer-transparent, and confine it to the image. Never layer a card pattern over a patterned page region.

## Sliders

Keep the 10px recessed channel neutral. Use the chosen accent's glass gradient colors for the convex selected range, with a lit upper rim and a shaded lower edge. Give neutral horizontal native-squircle grabbers secondary Button's fill, border, highlight, shade, and control shadow. Use short grip marks with softened ends. Light-mode marks have etched shading; dark-mode marks match the neutral border. Do not add an inset outline. Keep the overhead lighting consistent on vertical sliders. Hover uses Button's neutral hover fill. Pressing or dragging replaces the lighting and cast shadow with Button's shallow recess, without changing the grabber's size or delaying position updates. Squircle grabbers have the same native browser-support requirement as Button.

Keep the pointer target at least 32px and leave the thumb's shadow and keyboard-focus outline unclipped. Disabled sliders keep their values and lose decorative lighting. Invalid states use a semantic-red track border and grip marks, and the selected range swaps the accent glass for the destructive material with the same shading. Invalid Switches, Checkboxes, and Radio Group items do the same: a red border, and a destructive checked fill with darkened destructive ink for marks. This is a deliberate exception to fields and buttons, which keep their material and show only a red boundary; empty or unchecked parts keep just the border. Keep invalid separate from the accent focus outline, and use a dashed boundary in forced-colors mode. Reduced motion removes material transitions. Forced-colors mode uses system colors without gradients or shadows.

## Progress

Use `<Progress variant="circular" value={62} />` for compact progress icons. This is a Ninaero extension; the default remains `linear`. Both variants keep Base UI's accessible value, minimum, and maximum.

The circular variant uses a neutral track and an accent arc, starting at the top. Null values show a partial ring that rotates unless reduced motion is enabled. Keep determinate rings still, and use system colors in forced-colors mode.

## Tabs

Segmented tabs use conventional rounded corners and a compact 32px horizontal track. Keep the track neutral and shallowly recessed. Give the selected tab a brighter neutral face with soft top-to-bottom shading, a localized upper glass reflection, a crisp top rim, a narrow lower edge, and a small contact shadow. Keep its depth below Button so navigation does not compete with primary actions.

Underline tabs keep their labels unboxed and use a 4px accent strip with 2px rounded corners. Use a contrast-safe tone from the primary-action palette for the whole strip, with a faint upper sheen and one soft contact shadow, without a separate lower edge. Keep the body and shaded face at least 3:1 against the surrounding panel. Place the horizontal marker below the label and the vertical marker at the trailing edge. Hover changes label emphasis; press flattens the marker's lighting while retaining its accent color.

Keyboard focus has a separate accent outline on tabs and panels; leave it unclipped. Feedback stays immediate without moving labels or animating panels. Reduced motion removes material transitions. Forced-colors mode removes decorative rail lighting and uses system selection, boundary, and focus colors.

## Dialogs

Dialog and AlertDialog use the same installed theme classes for their frame and scrim. Keep their Base UI primitives and behavior separate.

Use native squircle corners at `3rem` (48px). This is Ninaero's chosen geometry, not a measurement of Nintendo's original UI. Give the frame a shallow paper/plastic finish with an opaque neutral fill, faint top-to-bottom shading, a fine grayscale edge, an upper inset highlight, and a lower inset shade. Combine these with the shared dialog cast shadow. Keep the panel matte; reserve accent and glass treatment for primary actions and focus.

Use one continuous panel without a contrasting footer band or divider. The outer frame owns the 24px inset; group content and actions with 24px of space, and keep 8px between actions. Dialog titles use 20px type with a 24px line height. Give actions a useful minimum width, using Button's large size for short prompt actions. Center short system prompts and keep forms left-aligned. Inset the corner close button by 16px and reserve header space for it only when present. Preserve existing focus management and do not clip shadows or keyboard outlines. Forced-colors mode removes decorative lighting and retains a system-color boundary.
Dialog opens from 92% scale and 8px below its resting position, with a 260ms elastic transform transition and a 140ms fade. The easing supplies one small overshoot before settling. Closing uses a 140ms shrink to 96% scale and a 4px downward shift with a fade. The scrim fades in over 160ms and out over 140ms without bouncing. CSS transitions let interrupted opening and closing continue from the current position. Under reduced motion, both layers change immediately.

The opening bounce uses fixed-duration CSS easing, not a physics-based spring. When sound is enabled, align its `rise` cue using [Animation and audio alignment](motion.md#animation-and-audio-alignment).
