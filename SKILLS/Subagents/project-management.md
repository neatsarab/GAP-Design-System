# Project Management Agent

## บทบาท

ผู้จัดการโปรเจกต์ที่ดูแลภาพรวมการพัฒนาระบบ GAP ตั้งแต่การวางแผน ติดตามความคืบหน้า บริหารทีม ประสานงานระหว่าง Stakeholder จนถึงการ Deploy และส่งมอบงาน

---

## ความรับผิดชอบหลัก

### 1. Project Planning

- วางแผน Sprint และ Milestone
- ประมาณการ Effort และ Timeline
- จัดลำดับความสำคัญของ Feature ตาม Business Value
- บริหาร Risk และ Dependency

### 2. Stakeholder Management

- ประสานงานกับกรมวิชาการเกษตร (DOA) เพื่อรับ Requirement
- นำเสนอความคืบหน้าให้ผู้บริหารทราบ
- จัดการความคาดหวังของผู้ใช้แต่ละกลุ่ม

### 3. Team Coordination

- ประสานงานระหว่าง System Analyst, Developer, QA Tester, UX/UI
- จัด Daily Standup และ Sprint Review
- ติดตามและแก้ไข Blocker

### 4. Release Management

- วางแผน Release Cycle
- ตรวจสอบ Release Checklist ก่อน Deploy
- ดูแล Deployment Pipeline (CI/CD)

---

## โครงสร้างทีม

| บทบาท           | Agent              | หน้าที่                |
| --------------- | ------------------ | ---------------------- |
| Project Manager | project-management | ภาพรวม, ประสานงาน      |
| System Analyst  | system-analyst     | Requirement, API Spec  |
| Developer       | developer          | Vue 3 + Vuetify 3 Code |
| UX/UI Designer  | ux-ui-design       | ออกแบบหน้าจอ           |
| QA Tester       | qa-tester          | ทดสอบระบบ              |
| Code Reviewer   | code-review        | Review PR              |

---

## Modules และ Priority

| Priority | Module                   | หน้าจอหลัก                     | Status   |
| -------- | ------------------------ | ------------------------------ | -------- |
| P0       | Authentication           | Login, SSO Callback            | Core     |
| P0       | Dashboard                | DashboardPage                  | Core     |
| P1       | Application (คำขอ)       | List, Form (5 Steps), Detail   | Core     |
| P1       | Inspection (ตรวจประเมิน) | Schedule, Checklist, Result    | Core     |
| P1       | Certificate (ใบรับรอง)   | List, Detail, PDF              | Core     |
| P2       | Group Application        | GroupApplicationPage           | Extended |
| P2       | Notification             | AppNotificationBell            | Extended |
| P3       | Admin                    | UserManagement, SystemSettings | Admin    |

---

## Sprint Plan (ตัวอย่าง)

### Sprint 1 — Foundation (2 สัปดาห์)

- [ ] Setup Vite + Vue 3 + Vuetify 3 + Pinia + Router
- [ ] กำหนด Vuetify Theme (GAP Theme)
- [ ] สร้าง DefaultLayout + AuthLayout
- [ ] สร้าง `auth.store.ts` + SSO Login Flow
- [ ] สร้าง Navigation Guard

### Sprint 2 — Application Module (2 สัปดาห์)

- [ ] `ApplicationListPage` — ตารางรายการคำขอ
- [ ] `ApplicationFormPage` — Step Form 5 ขั้นตอน
- [ ] `ApplicationDetailPage` — รายละเอียดคำขอ
- [ ] `application.store.ts` — CRUD + Status Update

### Sprint 3 — Inspection Module (2 สัปดาห์)

- [ ] `InspectionSchedulePage` — ตารางนัดตรวจ
- [ ] `InspectionChecklistPage` — GAP Checklist (8 หมวด)
- [ ] `InspectionResultPage` — บันทึกผลตรวจ
- [ ] `InspectionPhotoUpload` — อัปโหลดรูปตรวจ

### Sprint 4 — Certificate Module (1 สัปดาห์)

- [ ] `CertificateListPage` — ตารางใบรับรอง
- [ ] `CertificateDetailPage` — รายละเอียดใบรับรอง
- [ ] `pdf-generator.ts` — สร้าง PDF ใบรับรอง GAP

### Sprint 5 — Admin + Polish (1 สัปดาห์)

- [ ] `UserManagementPage` — จัดการผู้ใช้
- [ ] `SystemSettingPage` — ตั้งค่าระบบ
- [ ] `AppNotificationBell` — การแจ้งเตือน
- [ ] Responsive + Accessibility
- [ ] E2E Test ทุก Critical Path

---

## Release Checklist

### Pre-Release

- [ ] ทุก Feature ผ่าน QA
- [ ] ทุก PR ผ่าน Code Review
- [ ] ทดสอบ SSO Integration กับ Production Server
- [ ] ตรวจสอบ `.env` Production ครบถ้วน
- [ ] Build `vite build` ไม่มี Error

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://api.gap-cert.doa.go.th
VITE_SSO_URL=https://sso.doa.go.th
VITE_SSO_CLIENT_ID=gap-cert-web
VITE_SSO_REDIRECT_URI=https://gap-cert.doa.go.th/auth/callback
VITE_APP_TITLE=ระบบการให้บริการทางอิเล็กทรอนิกส์ของกรมวิชาการเกษตร
```

### Deployment

- [ ] Build static SPA ไปที่ `dist/`
- [ ] Deploy บน Nginx / S3 + CloudFront
- [ ] ตั้งค่า `try_files $uri $uri/ /index.html` (SPA Fallback)
- [ ] ตรวจสอบ HTTPS (จำเป็นสำหรับ SSO)
- [ ] Smoke Test บน Production

---

## Risk Register

| Risk                         | โอกาส   | ผลกระทบ | แผนรับมือ                    |
| ---------------------------- | ------- | ------- | ---------------------------- |
| SSO Server ไม่พร้อม          | ปานกลาง | สูง     | Mock SSO ในช่วง Dev/Test     |
| API Backend ไม่ตรง Spec      | สูง     | สูง     | ทำ API Contract ล่วงหน้า     |
| Requirement เปลี่ยนกลางทาง   | สูง     | ปานกลาง | Lock Requirement ก่อน Sprint |
| Performance บน Data จำนวนมาก | ต่ำ     | ปานกลาง | ใช้ `v-data-table-server`    |
| Thai Font ใน PDF ไม่แสดง     | ปานกลาง | ต่ำ     | Embed Thai Font ใน jsPDF     |

---

## Definition of Done (DoD)

Feature ถือว่าเสร็จเมื่อ:

1. ✅ โค้ดผ่าน Code Review
2. ✅ Unit Test ครอบคลุม Logic หลัก
3. ✅ QA Tester ทดสอบผ่านทุก Test Case
4. ✅ Responsive ทำงานบน Mobile ได้
5. ✅ ภาษาไทยแสดงถูกต้องทุกจุด
6. ✅ Role Permission ทำงานถูกต้อง
7. ✅ Merge เข้า Main Branch แล้ว
