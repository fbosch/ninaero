# Layout and geometry

Part of the [Ninaero design direction](../../DESIGN.md).

## Spacing and density

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

### Control geometry

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

## CSS units and font scaling

Use [Josh W. Comeau's pixels and accessibility article](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/) as the reference for unit selection. Ask whether a value should grow when the user increases their browser's default font size. Choose units for that behavior rather than converting everything to pixels or rems.

- Use `rem` or `em` for font sizes. Leave the root font size at the browser default; do not pin it to 16px or shrink it with the 62.5% trick.
- Let text-bearing controls, icons, and text-dependent widths grow with their labels. Prefer content-driven sizing or relative minimum dimensions over pixel heights that can clip enlarged text. Keep prose line heights unitless and vertical paragraph spacing relative, except where ruled prose shares an explicit relative interval.
- Use pixels for thin borders, focus-outline thickness, shallow material details, and decorative texture geometry that should not grow with text. Keep the site's outer gutters at 20px on narrow layouts and 32px on wide layouts so larger text does not also lose reading space to larger gutters. Control padding can remain relative where it preserves useful proportions.
- Use relative media queries for text-dependent layout changes. A compact layout is a response to available space, not a device category. Keep JavaScript and CSS breakpoints aligned; the Sidebar hook uses the same `48rem` threshold as Tailwind's `md` variant and reads `MediaQueryList.matches` instead of comparing `innerWidth` with a pixel constant.

For sizing and layout changes, test actual browser default font sizes of 16px, 32px, and 48px separately from page zoom at 200% and 400%. Changing only the page's root font size does not test relative media-query behavior. Check narrow and wide viewports, light and dark modes, accent presets, keyboard focus, hover, pressed, disabled, and invalid states. Navigation and dialog actions must remain reachable; labels, descriptions, and errors must not clip or overlap. Check for unexpected page-level horizontal scrolling and confirm that ruled text still aligns with its background. Automated build and compilation checks do not establish these visual outcomes.

## Corner geometry

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

### Rendering squircles

Button, Dialog, AlertDialog, and Slider thumbs use native CSS `corner-shape: squircle` with a nonzero `border-radius` to define the corner extent. This produces superellipse curves without a clipping mask, extra DOM, or JavaScript measurement. Shadows and focus outlines remain outside the component.

True squircle rendering requires browser support for `corner-shape`. Unsupported browsers display ordinary rounded action buttons and dialog frames without a browser-support notice. No polyfill is included. Conventional rounded fields and other panels do not depend on squircle support.

Accent presets live in `registry/ninaero/accents.mjs` and feed the same theme source and registry output as the Button rules. The root `data-accent` attribute selects a preset independently of light/dark mode. The workshop provides an Accent selector and side-by-side Button comparisons. Accent fills, selection, and focus follow the chosen preset; structural borders stay neutral.

Secondary uses a paper-material edge; Outline uses a neutral ink/paper edge. Both borders have separate light/dark tokens and stay unchanged when the accent changes. Invalid Buttons keep their variant material and use a single restrained semantic-red border, without an always-on ring. The outer outline appears only for keyboard focus and follows the accent, or the system highlight color in forced-colors mode.
