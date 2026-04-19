# System Flow: ระบบตรวจสอบ รับรองมาตรฐาน และบริการอิเล็กทรอนิกส์ (ผ่าน NSW)

## 1. ผู้ใช้งานระบบ (Users)

ผู้ใช้งานสามารถเข้าถึงระบบผ่าน **Web UI** โดยแบ่งเป็น 3 กลุ่มหลัก

- **เกษตรกร / ผู้ประกอบการ / ผู้ส่งออก**
- **เจ้าหน้าที่ผู้ใช้งานระบบ**
- **ผู้ดูแลระบบ (Admin)**

ผู้ใช้ทั้งหมดจะใช้งานผ่านหน้า **Web UI**

---

# 2. การยืนยันตัวตน (Authentication)

1. ผู้ใช้งานเข้าใช้งานผ่าน **SSO (Single Sign-On)**
2. ระบบ SSO ทำหน้าที่
   - ยืนยันตัวตนผู้ใช้
   - กำหนดสิทธิ์การเข้าถึง
3. เมื่อยืนยันตัวตนสำเร็จ จะถูก Redirect เข้าสู่ **Web UI ของระบบ**

---

# 3. ชั้น Web Application

## 3.1 Web UI

ทำหน้าที่เป็นส่วนติดต่อผู้ใช้งาน (Frontend)

หน้าที่หลัก

- แสดงหน้าจอการใช้งาน
- รับข้อมูลจากผู้ใช้
- ส่ง request ไปยัง **Web API**
- แสดงผลลัพธ์จากระบบ

---

## 3.2 Web API

ทำหน้าที่เป็น Backend ของระบบ

หน้าที่หลัก

- ประมวลผลข้อมูลจาก Web UI
- ติดต่อกับ Database
- เชื่อมต่อกับหน่วยงานภายนอก
- เชื่อมต่อระบบ SSO
- จัดการ Business Logic ของระบบ

---

# 4. Database

ฐานข้อมูลของระบบ ใช้เก็บข้อมูลทั้งหมด เช่น

- ข้อมูลเกษตรกร
- ข้อมูลผู้ประกอบการ
- ข้อมูลคำขอ
- ข้อมูลการรับรองมาตรฐาน
- ข้อมูลการตรวจสอบ
- ข้อมูลเอกสารแนบ

Web API จะเป็นตัวกลางในการอ่านและเขียนข้อมูลจาก Database

---

# 5. โมดูลระบบภายใน

ระบบประกอบด้วยโมดูลหลักดังนี้

- ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช
  Good Agricultural Practices Certification System for Plants (GAP)
- ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช
  Organic Agriculture Certification System
- ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)
  Plant Product Processing Factory Registration System, Department of Agriculture
- ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB)
  Certification Body Registration System for Plant Product Processing Factories
- ระบบจดทะเบียนผู้ส่งออก
  Plant Product Exporter Registration System
- ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ
  Health Certificate Issuance System for Controlled Plants
- ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช
  Health Certificate Issuance System for Processed Plant Products
- ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)
  Establishment List System for Plant Packing Houses

โมดูลทั้งหมดทำงานผ่าน **Web API**

---

# 6. การเชื่อมต่อหน่วยงานภายนอก

ระบบสามารถเชื่อมต่อกับหน่วยงานภายนอกเพื่อแลกเปลี่ยนข้อมูล เช่น

- **กรมพัฒนาธุรกิจการค้า**
- **กรมการปกครอง**
- **สมาคมหรือมูลนิธิ / วิสาหกิจชุมชน**

การเชื่อมต่อใช้ผ่าน **Web API**

---

# 7. การเชื่อมต่อหน่วยงานรัฐอื่น

ระบบสามารถเชื่อมต่อกับระบบของหน่วยงานอื่น เช่น

- **กสก.**
- **มกอช.**
- **ส.ป.ก.**

เพื่อใช้ข้อมูลร่วมกันในการตรวจสอบหรือออกใบรับรอง

---

# 8. ระบบชำระเงิน (e-Payment)

ระบบรองรับการชำระเงินผ่าน

- ธนาคาร
- Mobile Payment

Flow การทำงาน

1. ผู้ใช้ทำรายการชำระเงิน
2. ระบบส่งข้อมูลไปยัง Payment Gateway
3. เมื่อชำระเงินสำเร็จ ระบบจะบันทึกสถานะใน Database

---

# 9. สรุป Flow การทำงานหลัก

User
↓
SSO Login
↓
Web UI
↓
Web API
↓
Database
↓
Internal Modules (GAP / ORG / HC / etc.)
↓
External Systems

- หน่วยงานรัฐ
- หน่วยงานภายนอก
- e-Payment

---

# 10. ภาพรวม Architecture

ระบบใช้โครงสร้างแบบ

**Web-based Architecture**

ประกอบด้วย

- Frontend → Web UI
- Backend → Web API
- Authentication → SSO
- Data Layer → Database
- Integration → External Systems / ePayment / Government Agencies
