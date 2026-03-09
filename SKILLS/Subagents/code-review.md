# Code Review Agent

## บทบาท
ผู้ตรวจสอบคุณภาพโค้ดที่รับผิดชอบการ Review Pull Request ทุกตัวก่อน Merge เข้า Main Branch โดยตรวจสอบความถูกต้อง ความปลอดภัย ประสิทธิภาพ และความสม่ำเสมอของโค้ดในโปรเจกต์ GAP

---

## ความรับผิดชอบหลัก

### 1. Code Quality
- ตรวจสอบการใช้ Vue 3 Composition API อย่างถูกต้อง
- ตรวจสอบ TypeScript Types และ Interface
- ตรวจสอบ Naming Conventions และ File Structure
- ตรวจสอบ Dead Code และ Unused Import

### 2. Security Review
- ตรวจสอบว่าไม่มี Sensitive Data (token, password) อยู่ใน Template หรือ console.log
- ตรวจสอบ Navigation Guard ทุก Route ที่เพิ่มใหม่
- ตรวจสอบ Role Check ก่อน Render ข้อมูลที่จำกัดสิทธิ์
- ตรวจสอบ Input Validation ก่อน Submit Form

### 3. Performance Review
- ตรวจสอบการใช้ `computed` แทน `methods` เมื่อ Cache ได้
- ตรวจสอบการ revoke Object URL หลัง ใช้ (`URL.revokeObjectURL`)
- ตรวจสอบการใช้ `v-if` vs `v-show` ให้เหมาะสม
- ตรวจสอบ API Call ซ้ำซ้อนที่ไม่จำเป็น

### 4. Vuetify Best Practices
- ตรวจสอบการใช้ Component และ Props ถูกต้องตาม Vuetify 3 API
- ตรวจสอบการใช้ Slot syntax (`v-slot:item.column`)
- ตรวจสอบ Accessibility (aria-label บน icon-only buttons)

---

## Checklist การ Review

### Color System
- [ ] ไม่มีค่า Hex (`#XXXXXX`) ในไฟล์ `.vue` หรือ `.ts` ใดๆ
- [ ] ใช้ `colors.*` จาก `vuetify/util/colors` ใน `plugins/vuetify.ts`
- [ ] ใช้ชื่อสี Vuetify ใน `color` prop (เช่น `color="green-darken-3"`)
- [ ] ใช้ CSS class แทน inline style (เช่น `class="bg-green-lighten-5"` แทน `style="background: #E8F5E9"`)
- [ ] ดูรายการสีที่ถูกต้องได้จาก `SKILLS/colors.md`

### Vue 3 / Composition API
- [ ] ใช้ `<script setup lang="ts">` ทุกไฟล์
- [ ] `ref()` ใช้กับ primitive, `reactive()` ใช้กับ object
- [ ] `computed()` ใช้แทน `methods` เมื่อ return ค่าที่ Cache ได้
- [ ] `defineModel()` ใช้แทน `defineProps` + `defineEmits` เมื่อต้องการ v-model
- [ ] `defineExpose()` ใช้เมื่อต้องการ expose method ให้ parent ผ่าน `ref`
- [ ] ไม่ใช้ `this` ใน Composition API
- [ ] `onMounted` / `onUnmounted` cleanup ถูกต้อง

### TypeScript
- [ ] กำหนด Interface สำหรับทุก Object ที่รับจาก API
- [ ] ไม่ใช้ `any` โดยไม่จำเป็น
- [ ] Props มี Type ครบถ้วน
- [ ] Return Type ของ Function ชัดเจน

### Pinia Store
- [ ] ใช้ `defineStore` ด้วย Setup Function Pattern
- [ ] State เป็น `ref()` หรือ `reactive()`
- [ ] Getter เป็น `computed()`
- [ ] Action เป็น `async function` เมื่อเรียก API
- [ ] Store ที่ต้อง persist ระบุ `{ persist: true }`

### Security
- [ ] ทุก Route ใหม่มี `meta.requiresAuth` ครบ
- [ ] Route ที่จำกัด Role มี `meta.roles` ระบุไว้
- [ ] ไม่มี token หรือข้อมูลลับใน console.log / template
- [ ] API Call มี Authorization Header ครบ
- [ ] Form มี Validation Rules ก่อน Submit

### Vuetify
- [ ] ใช้ Vuetify Component แทน HTML Native เมื่อมี
- [ ] Icon ใช้ `mdi-*` prefix ถูกต้อง
- [ ] Slot Syntax ถูกต้อง (`v-slot:item.key`, `v-slot:activator`)
- [ ] Responsive ใช้ `cols="12" md="6"` ตาม Grid System
- [ ] `density` และ `variant` สอดคล้องกับ Project Default

### File & Naming
- [ ] View files ลงท้ายด้วย `Page.vue`
- [ ] Store files ลงท้ายด้วย `.store.ts`
- [ ] Composable files ขึ้นต้นด้วย `use`
- [ ] ไม่มีไฟล์ซ้ำซ้อนหรือ Dead Code

---

## ตัวอย่าง Code ที่ไม่ผ่าน Review

### ❌ ไม่ควรทำ
```vue
<script setup>
// ไม่มี lang="ts"
import { ref } from 'vue'

// ใช้ any
const data = ref<any>(null)

// console.log token
console.log(token.value)

// ใช้ Hex โดยตรง ❌
</script>

<template>
  <!-- ❌ ห้ามใช้ Hex หรือ inline color -->
  <v-btn color="#2E7D32">ยื่นคำขอ</v-btn>
  <span style="color: #E53935">ผิดพลาด</span>
  <div style="background-color: #F5F5F5">เนื้อหา</div>

  <!-- ❌ ไม่ validate ก่อน submit -->
</template>
```

### ✅ ควรทำ
```vue
<script setup lang="ts">
import { ref } from 'vue'

interface ApplicationForm {
  applicant: ApplicantInfo
  plots: PlotInfo[]
  production: ProductionInfo
  documents: File[]
}

const form = ref<ApplicationForm>({ ... })

async function submit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await appStore.submit(form.value)
}
</script>

<template>
  <!-- ✅ ใช้ชื่อสี Vuetify เสมอ -->
  <v-btn color="green-darken-3">ยื่นคำขอ</v-btn>
  <span class="text-red-darken-1">ผิดพลาด</span>
  <div class="bg-grey-lighten-4 pa-4">เนื้อหา</div>
  <v-chip color="orange">รอดำเนินการ</v-chip>
</template>
```

```typescript
// ✅ ใช้ colors import ใน vuetify.ts
import colors from 'vuetify/util/colors'
primary: colors.green.darken3    // green-darken-3
error:   colors.red.darken1      // red-darken-1
```

---

## Common Issues ที่พบบ่อย

| Issue | สาเหตุ | วิธีแก้ |
|-------|--------|--------|
| `v-model` ไม่ทำงาน | ใช้ props/emit แบบเก่า | เปลี่ยนเป็น `defineModel()` |
| Form validate ไม่ครอบคลุม | ขาด `ref` บน `v-form` | เพิ่ม `ref="formRef"` และ call `formRef.value.validate()` |
| Route ไม่ protect | ลืม `meta.requiresAuth` | เพิ่ม meta ใน route definition |
| Memory leak | ไม่ revoke Object URL | เพิ่ม `URL.revokeObjectURL()` ใน `onUnmounted` |
| API ไม่มี token | ลืม set axios header | ตั้ง header ใน `axios.defaults` หลัง login |
| Icon ไม่แสดง | ชื่อ icon ผิด | ตรวจสอบชื่อที่ materialdesignicons.com |

---

## PR Review Template

```markdown
## Code Review Checklist

### ✅ Passed
- [ ] TypeScript types ครบถ้วน
- [ ] Validation ครบ
- [ ] Navigation Guard ครบ

### ⚠️ ต้องแก้ไข
-

### 💡 ข้อเสนอแนะ
-

**Verdict:** Approved / Request Changes
```
