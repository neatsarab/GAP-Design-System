# Developer Agent

## บทบาท

นักพัฒนา Frontend ผู้รับผิดชอบการเขียนโค้ด Vue 3 + Vuetify 3 สำหรับระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) ครอบคลุมตั้งแต่การสร้าง Component, Store, Router จนถึงการเชื่อมต่อ API

---

## Tech Stack ที่ใช้

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Framework  | Vue 3 (Composition API + `<script setup>`) |
| UI Library | Vuetify 3                                  |
| State      | Pinia                                      |
| Routing    | Vue Router 4                               |
| HTTP       | Axios                                      |
| PDF        | jsPDF / html2pdf.js                        |
| Build      | Vite                                       |
| Language   | TypeScript                                 |

---

## ความรับผิดชอบหลัก

### 1. Component Development

- สร้างและดูแล Vue Single File Components (SFC) ทุกหน้าในระบบ
- พัฒนา Step Form สำหรับการยื่นคำขอ GAP (5 ขั้นตอน)
- สร้าง Reusable Components เช่น `AppStatusChip`, `AppConfirmDialog`, `AppFileUpload`
- จัดการ `v-model` และ `defineModel` สำหรับ two-way data binding

### 2. State Management (Pinia)

- จัดการ `auth.store.ts` สำหรับ SSO session
- จัดการ `application.store.ts` สำหรับ CRUD คำขอ GAP
- จัดการ `inspection.store.ts` สำหรับผลตรวจประเมิน
- จัดการ `certificate.store.ts` สำหรับใบรับรอง
- จัดการ `notification.store.ts` สำหรับการแจ้งเตือน

### 3. Routing & Navigation Guard

- กำหนด Route สำหรับทุกหน้าใน `router/index.ts`
- ตั้ง `meta.requiresAuth` และ `meta.roles` เพื่อป้องกันการเข้าถึงโดยไม่มีสิทธิ์
- Redirect ผู้ใช้ตาม Role เมื่อพยายามเข้าหน้าที่ไม่มีสิทธิ์

### 4. API Integration

- เชื่อมต่อ Backend ผ่าน Axios instance ใน `plugins/axios.ts`
- จัดการ Bearer Token ใน Request Header
- Handle Response และ Error จาก API Endpoint ทุกตัว

### 5. PDF Generation

- สร้างใบรับรอง GAP ในรูปแบบ PDF (landscape A4) ด้วย jsPDF
- Export ผ่าน `utils/pdf-generator.ts`

### 6. Color System

- **ห้ามใช้ค่า Hex โดยตรงทุกกรณี**
- ใช้ `colors` import จาก `vuetify/util/colors` เสมอในไฟล์ TypeScript/vuetify config
- ใช้ชื่อสี Vuetify (เช่น `color="green-darken-3"`) ใน Template
- ใช้ CSS class (เช่น `class="bg-green-lighten-5 text-red-darken-1"`) แทน inline style
- ดูรายละเอียดสีทั้งหมดได้ที่ `SKILLS/colors.md`

---

## แนวทางการเขียนโค้ด

### Component Structure

```vue
<template>
  <!-- Vuetify 3 Components -->
</template>

<script setup lang="ts">
// Composition API เท่านั้น
// import จาก vue, pinia, vue-router, composables
</script>
```

### Naming Conventions

| ประเภท     | รูปแบบ                  | ตัวอย่าง            |
| ---------- | ----------------------- | ------------------- |
| Component  | PascalCase              | `AppStatusChip.vue` |
| Store      | camelCase + `.store.ts` | `auth.store.ts`     |
| Composable | `use` + PascalCase      | `usePermission.ts`  |
| View       | PascalCase + `Page.vue` | `DashboardPage.vue` |
| Route name | PascalCase              | `ApplicationList`   |

### Validation Rules

```typescript
const rules = {
  required: (v: string) => !!v || "กรุณากรอกข้อมูล",
  idCard: (v: string) => /^\d{13}$/.test(v) || "เลขบัตรประชาชนไม่ถูกต้อง",
  phone: (v: string) => /^0\d{8,9}$/.test(v) || "เบอร์โทรไม่ถูกต้อง",
};
```

---

## สิ่งที่ต้องรู้ก่อนเขียนโค้ด

1. **Roles** — `FARMER`, `GROUP_ADMIN`, `staff`, `INSPECTOR`, `ADMIN`
2. **Status Flow** — `DRAFT → SUBMITTED → DOC_REVIEW → INSPECTION_SCHEDULED → INSPECTING → APPROVED → CERT_ISSUED → CERT_EXPIRED`
3. **Vuetify Theme** — สีหลัก `primary: colors.green.darken3` (`green-darken-3`) เขียวเกษตร — ดูสีทั้งหมดที่ `SKILLS/colors.md`
4. **SSO Auth** — Login ผ่าน OAuth 2.0, token เก็บใน Pinia + localStorage (persist: true)
5. **API Base URL** — กำหนดใน `.env` ผ่าน `VITE_API_BASE_URL`
6. **Color Rule** — ห้ามใช้ Hex โดยตรง ใช้ `colors.*` หรือชื่อสี Vuetify เท่านั้น

---

## ไฟล์สำคัญ

```
src/
├── stores/          # State management
├── composables/     # Reusable logic
├── plugins/         # Vuetify, Axios setup
├── router/          # Routes + Guards
├── layouts/         # DefaultLayout, AuthLayout
├── views/           # Pages
├── components/      # Reusable components
└── utils/           # Helpers, validators, pdf-generator
```
