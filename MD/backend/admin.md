# ระบบบริหารจัดการผู้ดูแลระบบ (Backend)

ระบบสำหรับผู้ดูแลระบบ (Administrator) ใช้ในการตรวจสอบสถานะของระบบ บริหารจัดการทรัพยากร และควบคุมการเชื่อมต่อกับระบบภายนอก

---

# เมนูระบบ

- Service Status
- API Status
- Storage Status
- Login Logs
- Certificate Expiration
- System Resources
- Data Backup
- Open API Management

---

# 1. Service Status

แสดงสถานะการทำงานของ **Service ต่าง ๆ ของระบบ**

## รายละเอียด

ใช้สำหรับตรวจสอบว่า Service ภายในระบบยังทำงานปกติหรือไม่

### ข้อมูลที่แสดง

| Service Name         | Status  | Last Check | Description     |
| -------------------- | ------- | ---------- | --------------- |
| Auth Service         | Running | 10:30      | ระบบยืนยันตัวตน |
| Database Service     | Running | 10:30      | ระบบฐานข้อมูล   |
| File Service         | Running | 10:30      | ระบบจัดเก็บไฟล์ |
| Notification Service | Running | 10:30      | ระบบแจ้งเตือน   |

### สถานะที่เป็นไปได้

- Running
- Stopped
- Error
- Maintenance

---

# 2. API Status

แสดงสถานะการทำงานของ **API ที่เชื่อมต่อกับหน่วยงานภายนอก**

## รายละเอียด

ใช้สำหรับตรวจสอบการเชื่อมต่อ API ระหว่างระบบกับหน่วยงานภายนอก

### ข้อมูลที่แสดง

| API Name          | Endpoint  | Status    | Response Time |
| ----------------- | --------- | --------- | ------------- |
| DOA API           | /api/doa  | Connected | 120 ms        |
| GAP API           | /api/gap  | Connected | 140 ms        |
| External Auth API | /api/auth | Connected | 90 ms         |

### สถานะ

- Connected
- Timeout
- Error
- Disconnected

---

# 3. Storage Status

แสดงสถานะพื้นที่จัดเก็บข้อมูลของระบบ

## รายละเอียด

ใช้ตรวจสอบพื้นที่จัดเก็บข้อมูลที่ใช้งานและพื้นที่คงเหลือ

### ข้อมูลที่แสดง

| Storage Type     | Used Space | Available Space | Total Space |
| ---------------- | ---------- | --------------- | ----------- |
| Database Storage | 120 GB     | 380 GB          | 500 GB      |
| File Storage     | 80 GB      | 220 GB          | 300 GB      |

### การแสดงผล

- Storage Usage Chart
- Storage Warning เมื่อพื้นที่ใกล้เต็ม

---

# 4. Login Logs

ตรวจสอบ **Log การเข้าใช้งานระบบ**

## รายละเอียด

ใช้สำหรับตรวจสอบการ Login ของผู้ใช้งานระบบ

### ข้อมูลที่แสดง

| Username | Role          | IP Address   | Login Time | Status  |
| -------- | ------------- | ------------ | ---------- | ------- |
| admin    | Administrator | 192.168.1.10 | 10:30      | Success |
| user01   | Staff         | 192.168.1.20 | 09:45      | Success |
| user02   | Staff         | 192.168.1.25 | 09:30      | Failed  |

### ฟังก์ชัน

- ค้นหาประวัติ Login
- กรองข้อมูลตามวันที่
- Export Log

---

# 5. Certificate Expiration

แจ้งเตือน **Certificate ที่กำลังจะหมดอายุ**

## รายละเอียด

ระบบจะตรวจสอบ Certificate ของระบบและแจ้งเตือนเมื่อใกล้หมดอายุ

### ข้อมูลที่แสดง

| Certificate Name | Domain          | Expiration Date | Status        |
| ---------------- | --------------- | --------------- | ------------- |
| SSL Certificate  | example.com     | 30/12/2026      | Valid         |
| API Certificate  | api.example.com | 15/11/2026      | Expiring Soon |

### การแจ้งเตือน

- แจ้งเตือนล่วงหน้า 30 วัน
- แจ้งเตือนล่วงหน้า 7 วัน
- แจ้งเตือนเมื่อหมดอายุ

---

# 6. System Resources

แสดงทรัพยากรของระบบ

## รายละเอียด

ใช้สำหรับตรวจสอบการใช้งานทรัพยากรของ Server

### ข้อมูลที่แสดง

| Resource      | Usage    |
| ------------- | -------- |
| CPU Usage     | 45%      |
| Memory Usage  | 60%      |
| Disk Usage    | 40%      |
| Network Usage | 120 Mbps |

### การแสดงผล

- Resource Monitoring Dashboard
- Real-time Monitoring Graph

---

# 7. Data Backup

ระบบสำรองข้อมูล

## รายละเอียด

สามารถสำรองข้อมูลของแต่ละระบบแยกกันได้

### ตัวเลือกการสำรองข้อมูล

- Backup Database
- Backup Files
- Backup Configuration

### รูปแบบการสำรองข้อมูล

- Full Backup
- Incremental Backup

### ข้อมูลที่แสดง

| Backup Name       | System     | Date       | Size | Status    |
| ----------------- | ---------- | ---------- | ---- | --------- |
| Backup_2026_01_01 | DOA System | 01/01/2026 | 2 GB | Completed |

---

# 8. Open API Management

ระบบบริหารจัดการ **Open API**

## รายละเอียด

ใช้สำหรับบริหารจัดการ API ที่ใช้เชื่อมต่อกับหน่วยงานภายนอก

### ฟังก์ชัน

- เพิ่ม API
- แก้ไข API
- ลบ API
- เปิด / ปิดการใช้งาน API

---

## การกำหนด API

### ข้อมูลที่กำหนด

| Field       | Description               |
| ----------- | ------------------------- |
| API Name    | ชื่อ API                  |
| Endpoint    | URL ของ API               |
| Method      | GET / POST / PUT / DELETE |
| Description | รายละเอียด API            |
| Status      | Active / Inactive         |

---

## ตัวอย่าง API

| API Name         | Endpoint     | Method | Status |
| ---------------- | ------------ | ------ | ------ |
| Get Factory Data | /api/factory | GET    | Active |
| Submit Request   | /api/request | POST   | Active |

---

> ระบบ Open API สามารถกำหนด Endpoint จากข้อมูลในตารางฐานข้อมูล และสามารถใช้เพื่อเชื่อมต่อกับหน่วยงานภายนอกได้
