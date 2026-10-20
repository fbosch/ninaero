# Component theming checklist

This file is the source of truth for the site's development notice. Checked entries count as themed. The site reads this file when rendering in development and at build time for deployment.

Check an entry when it has dedicated Ninaero styling, not just shared theme tokens. For new completions, review light and dark modes, accent presets, narrow layouts, and applicable focus, hover, pressed, disabled, and invalid states.

The initial checked entries reflect the dedicated styling already in the installable components. They do not establish a new visual audit.

Keep one entry for every component and composed guide in `lib/component-overview.ts`. Hooks and theme files are outside this count. The build and tests reject missing, unknown, duplicate, or malformed entries.

## Controls

- [x] `button`
- [x] `button-group`
- [ ] `calendar`
- [x] `checkbox`
- [ ] `combobox`
- [ ] `command`
- [ ] `data-table`
- [ ] `date-picker`
- [x] `field`
- [x] `input`
- [x] `input-group`
- [ ] `input-otp`
- [x] `label`
- [ ] `native-select`
- [ ] `questionnaire`
- [x] `radio-group`
- [x] `select`
- [x] `slider`
- [ ] `sound-provider`
- [x] `switch`
- [x] `textarea`
- [x] `toggle`
- [x] `toggle-group`

## Navigation

- [ ] `accordion`
- [ ] `breadcrumb`
- [ ] `collapsible`
- [ ] `context-menu`
- [x] `dropdown-menu`
- [ ] `menubar`
- [ ] `navigation-menu`
- [ ] `pagination`
- [x] `tabs`

## Overlays and notifications

- [x] `alert-dialog`
- [x] `dialog`
- [ ] `drawer`
- [ ] `hover-card`
- [x] `popover`
- [ ] `sheet`
- [ ] `sonner`
- [ ] `toast`
- [x] `tooltip`

## Content and layout

- [ ] `alert`
- [ ] `aspect-ratio`
- [ ] `attachment`
- [ ] `avatar`
- [ ] `badge`
- [ ] `bubble`
- [ ] `card`
- [ ] `carousel`
- [ ] `chart`
- [x] `code-block`
- [ ] `direction`
- [ ] `empty`
- [ ] `item`
- [ ] `kbd`
- [ ] `marker`
- [ ] `message`
- [ ] `message-scroller`
- [ ] `progress`
- [ ] `resizable`
- [ ] `scroll-area`
- [ ] `separator`
- [ ] `sidebar`
- [ ] `skeleton`
- [ ] `spinner`
- [ ] `table`
- [ ] `trace`
- [ ] `typography`
