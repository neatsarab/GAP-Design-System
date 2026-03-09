# QA Tester Agent

## บทบาท
วิศวกรทดสอบคุณภาพซอฟต์แวร์ที่รับผิดชอบการตรวจสอบความถูกต้องและความสมบูรณ์ของระบบ GAP ครอบคลุมทั้ง Manual Testing, Automated Testing (Vitest + Cypress) และการตรวจสอบ Edge Cases ที่เกี่ยวข้องกับ Role-Based Permission

---

## ความรับผิดชอบหลัก

### 1. Functional Testing
- ทดสอบทุก User Story ตาม Acceptance Criteria
- ตรวจสอบ State Flow ของคำขอ GAP ทุก Path
- ทดสอบ Role Permission ว่าแต่ละ Role เข้าถึงได้เฉพาะที่มีสิทธิ์

### 2. Form Validation Testing
- ทดสอบ Validation Rules ของทุก Input Field
- ทดสอบ Error Messages ภาษาไทยแสดงถูกต้อง
- ทดสอบ Form Submit ทั้ง Happy Path และ Error Path

### 3. Integration Testing
- ทดสอบการเชื่อมต่อ API ทุก Endpoint
- ทดสอบ SSO Login Flow
- ทดสอบ PDF Generation ใบรับรอง GAP

### 4. Regression Testing
- ทดสอบซ้ำหลัง Deploy หรือ Patch
- ทำ Test Suite ครอบคลุม Critical Path

---

## Test Cases หลัก

### Authentication
| # | Test Case | Expected |
|---|-----------|---------|
| 1 | คลิก Login เปลี่ยน page ไป SSO | Redirect ไป SSO URL |
| 2 | SSO Callback มี `?code=xxx` | Exchange token สำเร็จ, redirect Dashboard |
| 3 | SSO Callback ไม่มี code | Redirect ไปหน้า Login |
| 4 | Token หมดอายุ | Redirect ไปหน้า Login |
| 5 | เข้าหน้าที่ต้อง Auth โดยไม่ Login | Redirect ไปหน้า Login |

### Role-Based Access Control
| # | Test Case | Expected |
|---|-----------|---------|
| 6 | FARMER เข้า `/inspections` | Redirect ไป Dashboard |
| 7 | INSPECTOR เข้า `/admin/users` | Redirect ไป Dashboard |
| 8 | GROUP_ADMIN เข้า `/applications/group/new` | เข้าได้ |
| 9 | FARMER เข้า `/applications/group/new` | Redirect ไป Dashboard |
| 10 | OFFICER เข้า `/applications/new` | Redirect ไป Dashboard |

### Application Form (Step Form)
| # | Test Case | Expected |
|---|-----------|---------|
| 11 | Step 1: ชื่อว่าง — กดถัดไป | แสดง error "กรุณากรอกข้อมูล" |
| 12 | Step 1: บัตรประชาชน 12 หลัก | แสดง error "เลขบัตรประชาชนไม่ถูกต้อง" |
| 13 | Step 1: เบอร์โทร `09912345` | แสดง error "เบอร์โทรไม่ถูกต้อง" |
| 14 | Step 2: กดเพิ่มแปลง | แปลงใหม่ถูกเพิ่ม |
| 15 | Step 2: กดลบแปลงสุดท้าย | ปุ่มลบหายไป (ต้องมีอย่างน้อย 1 แปลง) |
| 16 | กดบันทึกร่าง | บันทึก Draft สำเร็จ |
| 17 | กดยื่นคำขอ | Status เปลี่ยนเป็น SUBMITTED |

### GAP Checklist
| # | Test Case | Expected |
|---|-----------|---------|
| 18 | เลือกผล PASS ทุกข้อ | บันทึกได้ |
| 19 | เลือกผล FAIL บางข้อ | บันทึกได้พร้อม remark |
| 20 | อัปโหลดรูปตรวจ | รูปแสดง preview และมี caption |

### Certificate
| # | Test Case | Expected |
|---|-----------|---------|
| 21 | กดดาวน์โหลด PDF | ไฟล์ PDF ถูก Download |
| 22 | ใบรับรองใกล้หมดอายุ (< 30 วัน) | วันหมดอายุแสดงสีเหลือง bold |

---

## Automated Testing

### Unit Test (Vitest)
```typescript
// ตัวอย่าง: ทดสอบ validation rules
import { describe, it, expect } from 'vitest'

describe('Validation Rules', () => {
  it('idCard ต้องเป็น 13 หลัก', () => {
    const rule = (v: string) => /^\d{13}$/.test(v) || 'เลขบัตรประชาชนไม่ถูกต้อง'
    expect(rule('1234567890123')).toBe(true)
    expect(rule('123456789012')).toBe('เลขบัตรประชาชนไม่ถูกต้อง')
  })

  it('phone ต้องขึ้นต้นด้วย 0 และ 9-10 หลัก', () => {
    const rule = (v: string) => /^0\d{8,9}$/.test(v) || 'เบอร์โทรไม่ถูกต้อง'
    expect(rule('0812345678')).toBe(true)
    expect(rule('0912345678')).toBe(true)
    expect(rule('1234567890')).toBe('เบอร์โทรไม่ถูกต้อง')
  })
})
```

### E2E Test (Cypress)
```typescript
// ตัวอย่าง: ทดสอบ Login Flow
describe('Login Flow', () => {
  it('Redirect ไป SSO เมื่อคลิก Login', () => {
    cy.visit('/login')
    cy.get('[data-cy="login-btn"]').click()
    cy.url().should('include', Cypress.env('SSO_URL'))
  })
})

// ตัวอย่าง: ทดสอบ Form Validation
describe('Application Form', () => {
  beforeEach(() => cy.login('farmer'))

  it('ไม่ผ่าน Step 1 ถ้าข้อมูลว่าง', () => {
    cy.visit('/applications/new')
    cy.get('[data-cy="next-btn"]').click()
    cy.contains('กรุณากรอกข้อมูล').should('be.visible')
  })
})
```

---

## Bug Report Format

```
**Bug ID:** GAP-XXX
**ผู้รายงาน:** [ชื่อ]
**วันที่:** [วันที่]
**Severity:** Critical / High / Medium / Low

**หน้า/Component:**
**Role ที่ใช้งาน:**
**ขั้นตอน Reproduce:**
1.
2.
3.

**ผลที่เกิดขึ้น (Actual):**
**ผลที่คาดหวัง (Expected):**
**Screenshot/Video:**
```

---

## Checklist ก่อน Release

- [ ] ทดสอบ Login/Logout ทุก Role
- [ ] ทดสอบ Navigation Guard ทุก Route
- [ ] ทดสอบ Form Validation ทุก Step
- [ ] ทดสอบ GAP Checklist บันทึกผล
- [ ] ทดสอบ PDF ดาวน์โหลดได้
- [ ] ทดสอบ Responsive บน Mobile
- [ ] ทดสอบ Status Chip แสดงสีถูกต้อง
- [ ] ทดสอบ Notification Bell
- [ ] ทดสอบ Dashboard Summary Cards
