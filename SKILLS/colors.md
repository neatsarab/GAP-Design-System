# Vuetify 3 — Material Design Color Reference

> **กฎ:** ทั้งโปรเจกต์ GAP ห้ามใช้ค่า Hex โดยตรง ให้อ้างอิงสีผ่านชื่อตัวแปร Vuetify เท่านั้น

---

## วิธีใช้สีใน Vuetify 3

### 1. Component Prop
```vue
<v-btn color="green-darken-3">ยื่นคำขอ</v-btn>
<v-chip color="amber-darken-3">รอดำเนินการ</v-chip>
<v-card color="green-lighten-5">...</v-card>
```

### 2. CSS Utility Class
```vue
<!-- พื้นหลัง -->
<div class="bg-green-darken-3">...</div>

<!-- สีตัวอักษร -->
<span class="text-red-darken-1">ข้อผิดพลาด</span>
<span class="text-green-darken-1">สำเร็จ</span>
```

### 3. TypeScript / Vuetify Theme
```typescript
import colors from 'vuetify/util/colors'

createVuetify({
  theme: {
    themes: {
      gapTheme: {
        colors: {
          primary:    colors.green.darken3,      // #2E7D32
          secondary:  colors.amber.darken3,      // #FF8F00
          accent:     colors.cyan.darken1,       // #00ACC1
          success:    colors.green.darken1,      // #43A047
          warning:    colors.orange.darken1,     // #FB8C00
          error:      colors.red.darken1,        // #E53935
          info:       colors.blue.darken1,       // #1E88E5
          background: colors.grey.lighten4,      // #F5F5F5
          surface:    colors.shades.white,       // #FFFFFF
        }
      }
    }
  }
})
```

---

## GAP Project — Theme Color Mapping

| Theme Key | Vuetify Color Name | JS Property | Hex | ใช้สำหรับ |
|-----------|-------------------|-------------|-----|----------|
| `primary` | `green-darken-3` | `colors.green.darken3` | `#2E7D32` | ปุ่มหลัก, AppBar, Sidebar |
| `secondary` | `amber-darken-3` | `colors.amber.darken3` | `#FF8F00` | ปุ่มรอง, Accent |
| `accent` | `cyan-darken-1` | `colors.cyan.darken1` | `#00ACC1` | Highlight |
| `success` | `green-darken-1` | `colors.green.darken1` | `#43A047` | สถานะสำเร็จ |
| `warning` | `orange-darken-1` | `colors.orange.darken1` | `#FB8C00` | คำเตือน |
| `error` | `red-darken-1` | `colors.red.darken1` | `#E53935` | ข้อผิดพลาด |
| `info` | `blue-darken-1` | `colors.blue.darken1` | `#1E88E5` | ข้อมูล |
| `background` | `grey-lighten-4` | `colors.grey.lighten4` | `#F5F5F5` | พื้นหลังหน้า |
| `surface` | `white` | `colors.shades.white` | `#FFFFFF` | พื้นหลัง Card |

---

## Application Status Colors

| Status | Vuetify Color Name | JS Property | Hex | ความหมาย |
|--------|--------------------|-------------|-----|----------|
| `DRAFT` | `grey` | `colors.grey.base` | `#9E9E9E` | ร่าง |
| `SUBMITTED` | `blue` | `colors.blue.base` | `#2196F3` | ยื่นแล้ว |
| `DOC_REVIEW` | `orange` | `colors.orange.base` | `#FF9800` | ตรวจเอกสาร |
| `INSPECTION_SCHEDULED` | `purple` | `colors.purple.base` | `#9C27B0` | นัดตรวจ |
| `INSPECTING` | `indigo` | `colors.indigo.base` | `#3F51B5` | กำลังตรวจ |
| `APPROVED` | `green` | `colors.green.base` | `#4CAF50` | อนุมัติ |
| `REJECTED` | `red` | `colors.red.base` | `#F44336` | ไม่ผ่าน |
| `CANCELLED` | `grey` | `colors.grey.base` | `#9E9E9E` | ยกเลิก |
| `CERT_ISSUED` | `teal` | `colors.teal.base` | `#009688` | ออกใบรับรอง |
| `CERT_EXPIRED` | `brown` | `colors.brown.base` | `#795548` | หมดอายุ |

---

## สรุป Shade Naming

| Vuetify Prop/Class | JS Property | Material # | ตัวอย่าง (Green) |
|-------------------|-------------|-----------|-----------------|
| `green` (no suffix) | `.base` | 500 | `#4CAF50` |
| `green-lighten-5` | `.lighten5` | 50 | `#E8F5E9` |
| `green-lighten-4` | `.lighten4` | 100 | `#C8E6C9` |
| `green-lighten-3` | `.lighten3` | 200 | `#A5D6A7` |
| `green-lighten-2` | `.lighten2` | 300 | `#81C784` |
| `green-lighten-1` | `.lighten1` | 400 | `#66BB6A` |
| `green-darken-1` | `.darken1` | 600 | `#43A047` |
| `green-darken-2` | `.darken2` | 700 | `#388E3C` |
| `green-darken-3` | `.darken3` | 800 | `#2E7D32` |
| `green-darken-4` | `.darken4` | 900 | `#1B5E20` |
| `green-accent-1` | `.accent1` | A100 | `#B9F6CA` |
| `green-accent-2` | `.accent2` | A200 | `#69F0AE` |
| `green-accent-3` | `.accent3` | A400 | `#00E676` |
| `green-accent-4` | `.accent4` | A700 | `#00C853` |

---

## Color Families ทั้งหมด (19 ตระกูล)

### 🔴 Red `red`
| Shade | Hex |
|-------|-----|
| `red-lighten-5` | `#FFEBEE` |
| `red-lighten-4` | `#FFCDD2` |
| `red-lighten-3` | `#EF9A9A` |
| `red-lighten-2` | `#E57373` |
| `red-lighten-1` | `#EF5350` |
| `red` | `#F44336` |
| `red-darken-1` | `#E53935` |
| `red-darken-2` | `#D32F2F` |
| `red-darken-3` | `#C62828` |
| `red-darken-4` | `#B71C1C` |
| `red-accent-1` | `#FF8A80` |
| `red-accent-2` | `#FF5252` |
| `red-accent-3` | `#FF1744` |
| `red-accent-4` | `#D50000` |

### 🩷 Pink `pink`
| Shade | Hex |
|-------|-----|
| `pink-lighten-5` | `#FCE4EC` |
| `pink-lighten-4` | `#F8BBD0` |
| `pink-lighten-3` | `#F48FB1` |
| `pink-lighten-2` | `#F06292` |
| `pink-lighten-1` | `#EC407A` |
| `pink` | `#E91E63` |
| `pink-darken-1` | `#D81B60` |
| `pink-darken-2` | `#C2185B` |
| `pink-darken-3` | `#AD1457` |
| `pink-darken-4` | `#880E4F` |
| `pink-accent-1` | `#FF80AB` |
| `pink-accent-2` | `#FF4081` |
| `pink-accent-3` | `#F50057` |
| `pink-accent-4` | `#C51162` |

### 🟣 Purple `purple`
| Shade | Hex |
|-------|-----|
| `purple-lighten-5` | `#F3E5F5` |
| `purple-lighten-4` | `#E1BEE7` |
| `purple-lighten-3` | `#CE93D8` |
| `purple-lighten-2` | `#BA68C8` |
| `purple-lighten-1` | `#AB47BC` |
| `purple` | `#9C27B0` |
| `purple-darken-1` | `#8E24AA` |
| `purple-darken-2` | `#7B1FA2` |
| `purple-darken-3` | `#6A1B9A` |
| `purple-darken-4` | `#4A148C` |
| `purple-accent-1` | `#EA80FC` |
| `purple-accent-2` | `#E040FB` |
| `purple-accent-3` | `#D500F9` |
| `purple-accent-4` | `#AA00FF` |

### 🟣 Deep Purple `deep-purple`
| Shade | Hex |
|-------|-----|
| `deep-purple-lighten-5` | `#EDE7F6` |
| `deep-purple-lighten-4` | `#D1C4E9` |
| `deep-purple-lighten-3` | `#B39DDB` |
| `deep-purple-lighten-2` | `#9575CD` |
| `deep-purple-lighten-1` | `#7E57C2` |
| `deep-purple` | `#673AB7` |
| `deep-purple-darken-1` | `#5E35B1` |
| `deep-purple-darken-2` | `#512DA8` |
| `deep-purple-darken-3` | `#4527A0` |
| `deep-purple-darken-4` | `#311B92` |
| `deep-purple-accent-1` | `#B388FF` |
| `deep-purple-accent-2` | `#7C4DFF` |
| `deep-purple-accent-3` | `#651FFF` |
| `deep-purple-accent-4` | `#6200EA` |

### 🔵 Indigo `indigo`
| Shade | Hex |
|-------|-----|
| `indigo-lighten-5` | `#E8EAF6` |
| `indigo-lighten-4` | `#C5CAE9` |
| `indigo-lighten-3` | `#9FA8DA` |
| `indigo-lighten-2` | `#7986CB` |
| `indigo-lighten-1` | `#5C6BC0` |
| `indigo` | `#3F51B5` |
| `indigo-darken-1` | `#3949AB` |
| `indigo-darken-2` | `#303F9F` |
| `indigo-darken-3` | `#283593` |
| `indigo-darken-4` | `#1A237E` |
| `indigo-accent-1` | `#8C9EFF` |
| `indigo-accent-2` | `#536DFE` |
| `indigo-accent-3` | `#3D5AFE` |
| `indigo-accent-4` | `#304FFE` |

### 🔵 Blue `blue`
| Shade | Hex |
|-------|-----|
| `blue-lighten-5` | `#E3F2FD` |
| `blue-lighten-4` | `#BBDEFB` |
| `blue-lighten-3` | `#90CAF9` |
| `blue-lighten-2` | `#64B5F6` |
| `blue-lighten-1` | `#42A5F5` |
| `blue` | `#2196F3` |
| `blue-darken-1` | `#1E88E5` |
| `blue-darken-2` | `#1976D2` |
| `blue-darken-3` | `#1565C0` |
| `blue-darken-4` | `#0D47A1` |
| `blue-accent-1` | `#82B1FF` |
| `blue-accent-2` | `#448AFF` |
| `blue-accent-3` | `#2979FF` |
| `blue-accent-4` | `#2962FF` |

### 🩵 Light Blue `light-blue`
| Shade | Hex |
|-------|-----|
| `light-blue-lighten-5` | `#E1F5FE` |
| `light-blue-lighten-4` | `#B3E5FC` |
| `light-blue-lighten-3` | `#81D4FA` |
| `light-blue-lighten-2` | `#4FC3F7` |
| `light-blue-lighten-1` | `#29B6F6` |
| `light-blue` | `#03A9F4` |
| `light-blue-darken-1` | `#039BE5` |
| `light-blue-darken-2` | `#0288D1` |
| `light-blue-darken-3` | `#0277BD` |
| `light-blue-darken-4` | `#01579B` |
| `light-blue-accent-1` | `#80D8FF` |
| `light-blue-accent-2` | `#40C4FF` |
| `light-blue-accent-3` | `#00B0FF` |
| `light-blue-accent-4` | `#0091EA` |

### 🩵 Cyan `cyan`
| Shade | Hex |
|-------|-----|
| `cyan-lighten-5` | `#E0F7FA` |
| `cyan-lighten-4` | `#B2EBF2` |
| `cyan-lighten-3` | `#80DEEA` |
| `cyan-lighten-2` | `#4DD0E1` |
| `cyan-lighten-1` | `#26C6DA` |
| `cyan` | `#00BCD4` |
| `cyan-darken-1` | `#00ACC1` |
| `cyan-darken-2` | `#0097A7` |
| `cyan-darken-3` | `#00838F` |
| `cyan-darken-4` | `#006064` |
| `cyan-accent-1` | `#84FFFF` |
| `cyan-accent-2` | `#18FFFF` |
| `cyan-accent-3` | `#00E5FF` |
| `cyan-accent-4` | `#00B8D4` |

### 🩵 Teal `teal`
| Shade | Hex |
|-------|-----|
| `teal-lighten-5` | `#E0F2F1` |
| `teal-lighten-4` | `#B2DFDB` |
| `teal-lighten-3` | `#80CBC4` |
| `teal-lighten-2` | `#4DB6AC` |
| `teal-lighten-1` | `#26A69A` |
| `teal` | `#009688` |
| `teal-darken-1` | `#00897B` |
| `teal-darken-2` | `#00796B` |
| `teal-darken-3` | `#00695C` |
| `teal-darken-4` | `#004D40` |
| `teal-accent-1` | `#A7FFEB` |
| `teal-accent-2` | `#64FFDA` |
| `teal-accent-3` | `#1DE9B6` |
| `teal-accent-4` | `#00BFA5` |

### 🟢 Green `green`
| Shade | Hex |
|-------|-----|
| `green-lighten-5` | `#E8F5E9` |
| `green-lighten-4` | `#C8E6C9` |
| `green-lighten-3` | `#A5D6A7` |
| `green-lighten-2` | `#81C784` |
| `green-lighten-1` | `#66BB6A` |
| `green` | `#4CAF50` |
| `green-darken-1` | `#43A047` |
| `green-darken-2` | `#388E3C` |
| `green-darken-3` | `#2E7D32` |
| `green-darken-4` | `#1B5E20` |
| `green-accent-1` | `#B9F6CA` |
| `green-accent-2` | `#69F0AE` |
| `green-accent-3` | `#00E676` |
| `green-accent-4` | `#00C853` |

### 🟢 Light Green `light-green`
| Shade | Hex |
|-------|-----|
| `light-green-lighten-5` | `#F1F8E9` |
| `light-green-lighten-4` | `#DCEDC8` |
| `light-green-lighten-3` | `#C5E1A5` |
| `light-green-lighten-2` | `#AED581` |
| `light-green-lighten-1` | `#9CCC65` |
| `light-green` | `#8BC34A` |
| `light-green-darken-1` | `#7CB342` |
| `light-green-darken-2` | `#689F38` |
| `light-green-darken-3` | `#558B2F` |
| `light-green-darken-4` | `#33691E` |
| `light-green-accent-1` | `#CCFF90` |
| `light-green-accent-2` | `#B2FF59` |
| `light-green-accent-3` | `#76FF03` |
| `light-green-accent-4` | `#64DD17` |

### 🟡 Lime `lime`
| Shade | Hex |
|-------|-----|
| `lime-lighten-5` | `#F9FBE7` |
| `lime-lighten-4` | `#F0F4C3` |
| `lime-lighten-3` | `#E6EE9C` |
| `lime-lighten-2` | `#DCE775` |
| `lime-lighten-1` | `#D4E157` |
| `lime` | `#CDDC39` |
| `lime-darken-1` | `#C0CA33` |
| `lime-darken-2` | `#AFB42B` |
| `lime-darken-3` | `#9E9D24` |
| `lime-darken-4` | `#827717` |
| `lime-accent-1` | `#F4FF81` |
| `lime-accent-2` | `#EEFF41` |
| `lime-accent-3` | `#C6FF00` |
| `lime-accent-4` | `#AEEA00` |

### 🟡 Yellow `yellow`
| Shade | Hex |
|-------|-----|
| `yellow-lighten-5` | `#FFFDE7` |
| `yellow-lighten-4` | `#FFF9C4` |
| `yellow-lighten-3` | `#FFF59D` |
| `yellow-lighten-2` | `#FFF176` |
| `yellow-lighten-1` | `#FFEE58` |
| `yellow` | `#FFEB3B` |
| `yellow-darken-1` | `#FDD835` |
| `yellow-darken-2` | `#FBC02D` |
| `yellow-darken-3` | `#F9A825` |
| `yellow-darken-4` | `#F57F17` |
| `yellow-accent-1` | `#FFFF8D` |
| `yellow-accent-2` | `#FFFF00` |
| `yellow-accent-3` | `#FFEA00` |
| `yellow-accent-4` | `#FFD600` |

### 🟠 Amber `amber`
| Shade | Hex |
|-------|-----|
| `amber-lighten-5` | `#FFF8E1` |
| `amber-lighten-4` | `#FFECB3` |
| `amber-lighten-3` | `#FFE082` |
| `amber-lighten-2` | `#FFD54F` |
| `amber-lighten-1` | `#FFCA28` |
| `amber` | `#FFC107` |
| `amber-darken-1` | `#FFB300` |
| `amber-darken-2` | `#FFA000` |
| `amber-darken-3` | `#FF8F00` |
| `amber-darken-4` | `#FF6F00` |
| `amber-accent-1` | `#FFE57F` |
| `amber-accent-2` | `#FFD740` |
| `amber-accent-3` | `#FFC400` |
| `amber-accent-4` | `#FFAB00` |

### 🟠 Orange `orange`
| Shade | Hex |
|-------|-----|
| `orange-lighten-5` | `#FFF3E0` |
| `orange-lighten-4` | `#FFE0B2` |
| `orange-lighten-3` | `#FFCC80` |
| `orange-lighten-2` | `#FFB74D` |
| `orange-lighten-1` | `#FFA726` |
| `orange` | `#FF9800` |
| `orange-darken-1` | `#FB8C00` |
| `orange-darken-2` | `#F57C00` |
| `orange-darken-3` | `#EF6C00` |
| `orange-darken-4` | `#E65100` |
| `orange-accent-1` | `#FFD180` |
| `orange-accent-2` | `#FFAB40` |
| `orange-accent-3` | `#FF9100` |
| `orange-accent-4` | `#FF6D00` |

### 🟠 Deep Orange `deep-orange`
| Shade | Hex |
|-------|-----|
| `deep-orange-lighten-5` | `#FBE9E7` |
| `deep-orange-lighten-4` | `#FFCCBC` |
| `deep-orange-lighten-3` | `#FFAB91` |
| `deep-orange-lighten-2` | `#FF8A65` |
| `deep-orange-lighten-1` | `#FF7043` |
| `deep-orange` | `#FF5722` |
| `deep-orange-darken-1` | `#F4511E` |
| `deep-orange-darken-2` | `#E64A19` |
| `deep-orange-darken-3` | `#D84315` |
| `deep-orange-darken-4` | `#BF360C` |
| `deep-orange-accent-1` | `#FF9E80` |
| `deep-orange-accent-2` | `#FF6E40` |
| `deep-orange-accent-3` | `#FF3D00` |
| `deep-orange-accent-4` | `#DD2C00` |

### 🟤 Brown `brown` _(ไม่มี accent)_
| Shade | Hex |
|-------|-----|
| `brown-lighten-5` | `#EFEBE9` |
| `brown-lighten-4` | `#D7CCC8` |
| `brown-lighten-3` | `#BCAAA4` |
| `brown-lighten-2` | `#A1887F` |
| `brown-lighten-1` | `#8D6E63` |
| `brown` | `#795548` |
| `brown-darken-1` | `#6D4C41` |
| `brown-darken-2` | `#5D4037` |
| `brown-darken-3` | `#4E342E` |
| `brown-darken-4` | `#3E2723` |

### ⚫ Grey `grey` _(ไม่มี accent)_
| Shade | Hex |
|-------|-----|
| `grey-lighten-5` | `#FAFAFA` |
| `grey-lighten-4` | `#F5F5F5` |
| `grey-lighten-3` | `#EEEEEE` |
| `grey-lighten-2` | `#E0E0E0` |
| `grey-lighten-1` | `#BDBDBD` |
| `grey` | `#9E9E9E` |
| `grey-darken-1` | `#757575` |
| `grey-darken-2` | `#616161` |
| `grey-darken-3` | `#424242` |
| `grey-darken-4` | `#212121` |

### 🔵 Blue Grey `blue-grey` _(ไม่มี accent)_
| Shade | Hex |
|-------|-----|
| `blue-grey-lighten-5` | `#ECEFF1` |
| `blue-grey-lighten-4` | `#CFD8DC` |
| `blue-grey-lighten-3` | `#B0BEC5` |
| `blue-grey-lighten-2` | `#90A4AE` |
| `blue-grey-lighten-1` | `#78909C` |
| `blue-grey` | `#607D8B` |
| `blue-grey-darken-1` | `#546E7A` |
| `blue-grey-darken-2` | `#455A64` |
| `blue-grey-darken-3` | `#37474F` |
| `blue-grey-darken-4` | `#263238` |

### ⬛ Shades
| Name | Prop/Class | Hex |
|------|-----------|-----|
| Black | `black` / `colors.shades.black` | `#000000` |
| White | `white` / `colors.shades.white` | `#FFFFFF` |
| Transparent | `transparent` / `colors.shades.transparent` | `#FFFFFF00` |

---

## ตัวอย่างการใช้งานในโปรเจกต์ GAP

```vue
<!-- ✅ ถูกต้อง — ใช้ชื่อสี Vuetify -->
<v-btn color="green-darken-3">ยื่นคำขอ</v-btn>
<v-chip color="orange" size="small">รอดำเนินการ</v-chip>
<span class="text-red-darken-1">เกิดข้อผิดพลาด</span>
<div class="bg-green-lighten-5 pa-4">พื้นที่เนื้อหา</div>

<!-- ❌ ห้ามใช้ Hex โดยตรง -->
<v-btn color="#2E7D32">ยื่นคำขอ</v-btn>
<span style="color: #E53935">เกิดข้อผิดพลาด</span>
```

```typescript
// ✅ ถูกต้อง — ใช้ colors import ใน theme
import colors from 'vuetify/util/colors'
colors.green.darken3   // primary  → #2E7D32
colors.red.darken1     // error    → #E53935

// ❌ ห้ามใช้ Hex โดยตรง
primary: '#2E7D32'
```
