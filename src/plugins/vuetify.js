import { createVuetify } from "vuetify";
import { h } from "vue";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/util/colors";
import "vuetify/styles";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { VDateInput } from "vuetify/labs/VDateInput";
import { th, en } from "vuetify/locale";

// ══════════════════════════════════════════════════════════
// DESIGN TOKENS — ตัวกำหนดค่าทั้งหมดไว้ที่นี่ที่เดียว
// ══════════════════════════════════════════════════════════

/** Light theme palette tokens */
const light = {
  primary: "#4CAF6E", // Figma primary green
  secondary: "#FF8F00", // Amber darken-3 — เข้ากับ dark mode amber
  accent: "#00ACC1",

  success: "#43A047",
  warning: "#FB8C00",
  error: "#FF5252", // Figma error/required color
  info: "#1E88E5",

  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceVariant: "#FCFCFC", // Figma green tint bg
  onSurface: "#121212", // explicit — ใช้กำหนด hover/opacity overlay
  onSurfaceVariant: "#424242",

  onPrimary: "#FFFFFF",
  onSecondary: "#FFFFFF",

  border: "#E0E0E0",
  divider: "#EEEEEE",

  // ── System-specific tokens ──────────────────────────
  "gap-user": colors.green.lighten1,
  "gap-staff": colors.brown.lighten1,
  "org-user": colors.teal.lighten1,
  "org-staff": colors.amber.darken4,
  "doa-user": colors.blue.lighten1,
  "doa-staff": colors.red.lighten1,
  "cb-user": colors.cyan.darken1,
  "cb-staff": colors.orange.darken3,
  "export-user": colors.deepPurple.lighten2,
  "export-staff": colors.pink.lighten1,
  "hc-user": colors.lightGreen.darken1,
  "hc-staff": colors.purple.lighten2,
  "hcex-user": colors.blueGrey.lighten1,
  "hcex-staff": colors.deepOrange.lighten1,
  "el-user": colors.indigo.lighten1,
  "el-staff": colors.lime.darken3,
  admin: colors.blueGrey.darken3,
};

/** Dark theme palette tokens (เทาดำ ไม่ใช่สีกรม) */
const dark = {
  // Brand colors — สว่างขึ้นเพื่อใช้บน dark bg
  primary: colors.green.lighten2, // #A5D6A7
  secondary: colors.amber.darken1, // #FFB300
  accent: colors.cyan.lighten2, // #80DEEA

  // Semantic status
  success: colors.green.lighten2, // #A5D6A7
  warning: colors.orange.lighten2, // #FFCC80
  error: colors.red.lighten2, // #EF9A9A
  info: colors.blue.lighten2, // #90CAF9

  // Layout surfaces — pure gray-black (ไม่มีโทนสีกรม/navy)
  background: "#111111", // near-black page bg
  surface: "#1c1c1c", // card / panel bg
  surfaceVariant: "#2a2a2a", // chip, tag, code bg
  onSurface: "#F5F5F5", // explicit — สีขาวชัดเจนสำหรับ hover/overlay บน dark bg
  onSurfaceVariant: colors.grey.lighten3, // #EEEEEE

  // On-colors
  onPrimary: colors.shades.black,
  onSecondary: colors.shades.black,

  // Border / divider tokens (เส้นอ่อน บน dark bg)
  border: "#333333", // border ทั่วไป
  divider: "#2a2a2a", // เส้น divider

  // ── System-specific tokens -- DARK ──────────────────────────
  "gap-user": colors.green.lighten3,
  "gap-staff": colors.brown.lighten3,
  "org-user": colors.teal.lighten3,
  "org-staff": colors.amber.lighten3,
  "doa-user": colors.blue.lighten3,
  "doa-staff": colors.red.lighten3,
  "cb-user": colors.cyan.lighten3,
  "cb-staff": colors.orange.lighten3,
  "export-user": colors.deepPurple.lighten4,
  "export-staff": colors.pink.lighten3,
  "hc-user": colors.lightGreen.lighten3,
  "hc-staff": colors.purple.lighten4,
  "hcex-user": colors.blueGrey.lighten3,
  "hcex-staff": colors.deepOrange.lighten3,
  "el-user": colors.indigo.lighten4,
  "el-staff": colors.lime.lighten3,
  admin: colors.blueGrey.lighten2,
};

// ── Custom Font Awesome iconset for Vuetify ──────────────
const fa = {
  component: (props) => {
    const icon = props.icon;
    if (Array.isArray(icon)) {
      return h(FontAwesomeIcon, { icon });
    }
    const str = String(icon).trim();
    const parts = str.split(/\s+/);
    if (parts.length === 2) {
      return h(FontAwesomeIcon, {
        icon: [parts[0], parts[1].replace("fa-", "")],
      });
    }
    return h(FontAwesomeIcon, { icon: ["fas", str.replace("fa-", "")] });
  },
};

// ── Vuetify internal icon aliases (FA replacements) ──────
const faAliases = {
  complete: "fas fa-check",
  cancel: "fas fa-circle-xmark",
  close: "fas fa-xmark",
  delete: "fas fa-circle-xmark",
  clear: "fas fa-xmark",
  success: "fas fa-circle-check",
  info: "fas fa-circle-info",
  warning: "fas fa-triangle-exclamation",
  error: "fas fa-circle-exclamation",
  prev: "fas fa-chevron-left",
  next: "fas fa-chevron-right",
  checkboxOn: "fas fa-square-check",
  checkboxOff: "far fa-square",
  checkboxIndeterminate: "fas fa-square-minus",
  delimiter: "fas fa-circle",
  sortAsc: "fas fa-arrow-up",
  sortDesc: "fas fa-arrow-down",
  expand: "fas fa-chevron-down",
  menu: "fas fa-bars",
  subgroup: "fas fa-caret-down",
  dropdown: "fas fa-caret-down",
  radioOn: "fas fa-circle-dot",
  radioOff: "far fa-circle",
  edit: "fas fa-pencil",
  ratingEmpty: "far fa-star",
  ratingFull: "fas fa-star",
  ratingHalf: "fas fa-star-half-stroke",
  loading: "fas fa-spinner",
  first: "fas fa-angles-left",
  last: "fas fa-angles-right",
  unfold: "fas fa-arrows-up-down",
  file: "fas fa-paperclip",
  plus: "fas fa-plus",
  minus: "fas fa-minus",
};

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "fa",
    aliases: faAliases,
    sets: { fa },
  },
  theme: {
    defaultTheme: "gapLight",
    locale: {
      locale: "en",
      fallback: "en",
      messages: { en, th },
    },
    components: {
      VDateInput,
    },
    date: {
      locale: {
        th: "th-TH",
        en: "en-US",
      },
    },

    themes: {
      // ── Light Theme ────────────────────────────────────
      gapLight: {
        dark: false,
        colors: {
          primary: light.primary,
          secondary: light.secondary,
          accent: light.accent,
          success: light.success,
          warning: light.warning,
          error: light.error,
          info: light.info,
          background: light.background,
          surface: light.surface,
          "on-primary": light.onPrimary,
          "on-secondary": light.onSecondary,
          "surface-variant": light.surfaceVariant,
          "on-surface": light.onSurface,
          "on-surface-variant": light.onSurfaceVariant,
          // custom tokens — เรียกใช้ได้ผ่าน rgb(var(--v-theme-border))
          border: light.border,
          divider: light.divider,
          // system tokens
          "gap-user": light["gap-user"],
          "gap-staff": light["gap-staff"],
          "org-user": light["org-user"],
          "org-staff": light["org-staff"],
          "doa-user": light["doa-user"],
          "doa-staff": light["doa-staff"],
          "cb-user": light["cb-user"],
          "cb-staff": light["cb-staff"],
          "export-user": light["export-user"],
          "export-staff": light["export-staff"],
          "hc-user": light["hc-user"],
          "hc-staff": light["hc-staff"],
          "hcex-user": light["hcex-user"],
          "hcex-staff": light["hcex-staff"],
          "el-user": light["el-user"],
          "el-staff": light["el-staff"],
          admin: light["admin"],
        },
      },

      // ── Dark Theme (pure gray-black) ───────────────────
      gapDark: {
        dark: true,
        colors: {
          primary: dark.primary,
          secondary: dark.secondary,
          accent: dark.accent,
          success: dark.success,
          warning: dark.warning,
          error: dark.error,
          info: dark.info,
          background: dark.background,
          surface: dark.surface,
          "on-primary": dark.onPrimary,
          "on-secondary": dark.onSecondary,
          "surface-variant": dark.surfaceVariant,
          "on-surface": dark.onSurface,
          "on-surface-variant": dark.onSurfaceVariant,
          // custom tokens
          border: dark.border,
          divider: dark.divider,
          // system tokens
          "gap-user": dark["gap-user"],
          "gap-staff": dark["gap-staff"],
          "org-user": dark["org-user"],
          "org-staff": dark["org-staff"],
          "doa-user": dark["doa-user"],
          "doa-staff": dark["doa-staff"],
          "cb-user": dark["cb-user"],
          "cb-staff": dark["cb-staff"],
          "export-user": dark["export-user"],
          "export-staff": dark["export-staff"],
          "hc-user": dark["hc-user"],
          "hc-staff": dark["hc-staff"],
          "hcex-user": dark["hcex-user"],
          "hcex-staff": dark["hcex-staff"],
          "el-user": dark["el-user"],
          "el-staff": dark["el-staff"],
          admin: dark["admin"],
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: "lg" },
    VCard: { rounded: "xl", elevation: 0 },
    VTextField: { variant: "outlined", density: "default", rounded: "lg" },
    VSelect: { variant: "outlined", density: "default", rounded: "lg" },
    VTextarea: { variant: "outlined", density: "default", rounded: "lg" },
    VAutocomplete: { variant: "outlined", density: "default", rounded: "lg" },
    VCombobox: { variant: "outlined", density: "default", rounded: "lg" },
    VFileInput: { variant: "outlined", density: "default", rounded: "lg" },
  },
});
