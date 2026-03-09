import { createVuetify, type IconSet, type IconProps } from 'vuetify'
import { h } from 'vue'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import 'vuetify/styles'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// ══════════════════════════════════════════════════════════
// DESIGN TOKENS — ตัวกำหนดค่าทั้งหมดไว้ที่นี่ที่เดียว
// ══════════════════════════════════════════════════════════

/** Light theme palette tokens */
const light = {
  primary:   '#4CAF6E',    // Figma primary green
  secondary: '#FF8F00',    // Amber darken-3 — เข้ากับ dark mode amber
  accent:    '#00ACC1',

  success:   '#43A047',
  warning:   '#FB8C00',
  error:     '#FF5252',    // Figma error/required color
  info:      '#1E88E5',

  background:       '#F5F5F5',
  surface:          '#FFFFFF',
  surfaceVariant:   '#E9F7EF',   // Figma green tint bg
  onSurface:        '#121212',   // explicit — ใช้กำหนด hover/opacity overlay
  onSurfaceVariant: '#424242',

  onPrimary:   '#FFFFFF',
  onSecondary: '#FFFFFF',

  border:  '#E0E0E0',
  divider: '#EEEEEE',
} as const

/** Dark theme palette tokens (เทาดำ ไม่ใช่สีกรม) */
const dark = {
  // Brand colors — สว่างขึ้นเพื่อใช้บน dark bg
  primary:   colors.green.lighten2,    // #A5D6A7
  secondary: colors.amber.darken1,     // #FFB300
  accent:    colors.cyan.lighten2,     // #80DEEA

  // Semantic status
  success:   colors.green.lighten2,    // #A5D6A7
  warning:   colors.orange.lighten2,   // #FFCC80
  error:     colors.red.lighten2,      // #EF9A9A
  info:      colors.blue.lighten2,     // #90CAF9

  // Layout surfaces — pure gray-black (ไม่มีโทนสีกรม/navy)
  background:       '#111111',         // near-black page bg
  surface:          '#1c1c1c',         // card / panel bg
  surfaceVariant:   '#2a2a2a',         // chip, tag, code bg
  onSurface:        '#F5F5F5',         // explicit — สีขาวชัดเจนสำหรับ hover/overlay บน dark bg
  onSurfaceVariant: colors.grey.lighten3, // #EEEEEE

  // On-colors
  onPrimary:   colors.shades.black,
  onSecondary: colors.shades.black,

  // Border / divider tokens (เส้นอ่อน บน dark bg)
  border:  '#333333',                  // border ทั่วไป
  divider: '#2a2a2a',                  // เส้น divider
} as const

// ── Custom Font Awesome iconset for Vuetify ──────────────
const fa: IconSet = {
  component: (props: IconProps) => {
    const icon = props.icon
    if (Array.isArray(icon)) {
      return h(FontAwesomeIcon as any, { icon })
    }
    const str = (icon as string).trim()
    const parts = str.split(/\s+/)
    if (parts.length === 2) {
      return h(FontAwesomeIcon as any, {
        icon: [parts[0], parts[1].replace('fa-', '')],
      })
    }
    return h(FontAwesomeIcon as any, { icon: ['fas', str.replace('fa-', '')] })
  },
}

// ── Vuetify internal icon aliases (FA replacements) ──────
const faAliases: Record<string, string> = {
  complete:              'fas fa-check',
  cancel:                'fas fa-circle-xmark',
  close:                 'fas fa-xmark',
  delete:                'fas fa-circle-xmark',
  clear:                 'fas fa-xmark',
  success:               'fas fa-circle-check',
  info:                  'fas fa-circle-info',
  warning:               'fas fa-triangle-exclamation',
  error:                 'fas fa-circle-exclamation',
  prev:                  'fas fa-chevron-left',
  next:                  'fas fa-chevron-right',
  checkboxOn:            'fas fa-square-check',
  checkboxOff:           'far fa-square',
  checkboxIndeterminate: 'fas fa-square-minus',
  delimiter:             'fas fa-circle',
  sortAsc:               'fas fa-arrow-up',
  sortDesc:              'fas fa-arrow-down',
  expand:                'fas fa-chevron-down',
  menu:                  'fas fa-bars',
  subgroup:              'fas fa-caret-down',
  dropdown:              'fas fa-caret-down',
  radioOn:               'fas fa-circle-dot',
  radioOff:              'far fa-circle',
  edit:                  'fas fa-pencil',
  ratingEmpty:           'far fa-star',
  ratingFull:            'fas fa-star',
  ratingHalf:            'fas fa-star-half-stroke',
  loading:               'fas fa-spinner',
  first:                 'fas fa-angles-left',
  last:                  'fas fa-angles-right',
  unfold:                'fas fa-arrows-up-down',
  file:                  'fas fa-paperclip',
  plus:                  'fas fa-plus',
  minus:                 'fas fa-minus',
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases: faAliases,
    sets: { fa },
  },
  theme: {
    defaultTheme: 'gapLight',
    themes: {

      // ── Light Theme ────────────────────────────────────
      gapLight: {
        dark: false,
        colors: {
          primary:              light.primary,
          secondary:            light.secondary,
          accent:               light.accent,
          success:              light.success,
          warning:              light.warning,
          error:                light.error,
          info:                 light.info,
          background:           light.background,
          surface:              light.surface,
          'on-primary':         light.onPrimary,
          'on-secondary':       light.onSecondary,
          'surface-variant':    light.surfaceVariant,
          'on-surface':         light.onSurface,
          'on-surface-variant': light.onSurfaceVariant,
          // custom tokens — เรียกใช้ได้ผ่าน rgb(var(--v-theme-border))
          'border':             light.border,
          'divider':            light.divider,
        },
      },

      // ── Dark Theme (pure gray-black) ───────────────────
      gapDark: {
        dark: true,
        colors: {
          primary:              dark.primary,
          secondary:            dark.secondary,
          accent:               dark.accent,
          success:              dark.success,
          warning:              dark.warning,
          error:                dark.error,
          info:                 dark.info,
          background:           dark.background,
          surface:              dark.surface,
          'on-primary':         dark.onPrimary,
          'on-secondary':       dark.onSecondary,
          'surface-variant':    dark.surfaceVariant,
          'on-surface':         dark.onSurface,
          'on-surface-variant': dark.onSurfaceVariant,
          // custom tokens
          'border':             dark.border,
          'divider':            dark.divider,
        },
      },

    },
  },
  defaults: {
    VBtn:          { rounded: 'lg' },
    VCard:         { rounded: 'xl', elevation: 0 },
    VTextField:    { variant: 'outlined', density: 'default', rounded: 'lg' },
    VSelect:       { variant: 'outlined', density: 'default', rounded: 'lg' },
    VTextarea:     { variant: 'outlined', density: 'default', rounded: 'lg' },
    VAutocomplete: { variant: 'outlined', density: 'default', rounded: 'lg' },
    VCombobox:     { variant: 'outlined', density: 'default', rounded: 'lg' },
    VFileInput:    { variant: 'outlined', density: 'default', rounded: 'lg' },
  },
})
