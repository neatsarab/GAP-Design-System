# การออกใบรับรองสุขอนามัย (Health Certificate) สินค้าแปรรูปด้านพืช

## คำขอขึ้นทะเบียนใบรับรองสุขอนามัย ทั้ง 4 ประเภท

> ผู้ใช้ต้องเลือก Test Report ที่ผ่านการพิจารณาแล้วก่อนเริ่มกรอกคำขอ

รองรับแบบฟอร์ม 4 ประเภท

- กมพ.1
- กมพ.1-1
- กมพ.1-2
- กมพ.1-3

---

# ขั้นตอนการดำเนินการ

1. ข้อมูลรายละเอียด
2. ไฟล์แนบ

---

# เงื่อนไขก่อนเริ่มคำขอ

- ต้องเลือก Test Report ที่ได้รับการพิจารณาแล้ว
- 1 คำขอ รองรับสินค้า 1 รายการ
- ข้อมูลบางส่วนดึงจากผล Lab และทะเบียนประวัติอัตโนมัติ
- ข้อมูลทั้งหมดในใบรับรองต้องกรอกเป็นภาษาอังกฤษตัวพิมพ์ใหญ่ (UPPERCASE)

---

# ประเภทที่ 1 : กมพ.1

> ใช้สำหรับการออกใบรับรองสุขอนามัยทั่วไปสำหรับสินค้าแปรรูปด้านพืช

## ข้อมูลทั่วไป

| รายการ                  | ประเภทข้อมูล  | หมายเหตุ          |
| ----------------------- | ------------- | ----------------- |
| เลขที่คำขอ              | auto generate | เฉพาะเจ้าหน้าที่  |
| วันที่ยื่นคำขอ          | auto fill     | วันที่ปัจจุบัน    |
| ผู้ยื่นคำขอ             | auto fill     | จากบัญชีผู้ใช้งาน |
| จำนวนใบรับรองที่ต้องการ | number input  | ต้องมากกว่า 0     |

---

## ข้อมูลผู้ส่งออก / ผู้นำเข้า

| รายการ                                       | ประเภทข้อมูล |
| -------------------------------------------- | ------------ |
| Exporter Name and Address                    | text area    |
| Consignee Name and Address Including Country | text area    |

> ต้องกรอกเป็นภาษาอังกฤษตัวพิมพ์ใหญ่

---

## ข้อมูลการขนส่ง

| รายการ                 | ประเภทข้อมูล       |
| ---------------------- | ------------------ |
| Date of Shipment       | date picker        |
| Mode of Transport      | checkbox           |
| Country of Destination | select             |
| Place of Departure     | select master data |
| Vessel / Vehicle       | text input         |

ตัวเลือก Mode of Transport

- SEA
- ROAD
- AIR

---

## ข้อมูลสินค้า

| รายการ               | ประเภทข้อมูล | ที่มา                  |
| -------------------- | ------------ | ---------------------- |
| Manufacturer         | auto fill    | จากทะเบียนประวัติ      |
| Analysis Report No.  | auto fill    | จาก Test Report        |
| Date                 | auto fill    | วันที่รับผล Lab        |
| Shipping Mark        | text input   | ผู้ใช้กรอก             |
| Description of Goods | text area    | ดึงจาก Lab และแก้ไขได้ |
| Quantity (CTNS.)     | number input | ผู้ใช้กรอก             |
| Weight N.W./G.W.     | number input | ผู้ใช้กรอก             |
| Total Amount (USD)   | number input | ผู้ใช้กรอก             |

หมายเหตุ

- Description of Goods สามารถแก้ไขเพิ่มเติมได้
- จำนวนสินค้าและน้ำหนักต้องมากกว่า 0

---

## Special Remark

- กรอกได้เฉพาะภาษาอังกฤษ
- สามารถเลือก “FIT FOR HUMAN CONSUMPTION” ได้

---

# ประเภทที่ 2 : กมพ.1-1

> ใช้สำหรับการออกใบรับรองสุขอนามัยสำหรับประเทศในกลุ่มอ่าว

## ข้อมูลผู้ส่งออก / ผู้นำเข้า

| รายการ                                       | ประเภทข้อมูล |
| -------------------------------------------- | ------------ |
| Exporter Name and Address                    | text area    |
| Consignee Name and Address Including Country | text area    |
| Producer Name and Address                    | text area    |
| Packing Establishment Name and Address       | text area    |

---

## ข้อมูลการขนส่ง

| รายการ                                   | ประเภทข้อมูล     |
| ---------------------------------------- | ---------------- |
| Date of Shipment                         | date picker      |
| Mode of Transport                        | checkbox         |
| Vessel / Vehicle Identification          | text input       |
| Border of Loading / Country of Dispatch  | select           |
| Country of Origin                        | fixed = THAILAND |
| ISO Code                                 | fixed = 764      |
| Border of Entry / Country of Destination | select           |

ตัวเลือก Mode of Transport

- SEA
- ROAD
- AIR

---

## ข้อมูลอุณหภูมิสินค้า

เลือกได้ 1 รายการ

- [ ] Ambient
- [ ] Chilled
- [ ] Frozen

---

## ข้อมูลเอกสารและสินค้า

| รายการ                     | ประเภทข้อมูล              |
| -------------------------- | ------------------------- |
| Halal Certificate No.      | text input                |
| Analysis Report No.        | auto fill จาก Test Report |
| Date                       | auto fill                 |
| Name & Description of Food | text area                 |
| HS Code                    | text input                |
| Treatment Type             | text input                |
| Brand Name                 | text input                |
| Production Date            | date picker               |
| Expiry Date                | date picker               |
| No. Packages (CTN/BAG/BOX) | number input              |
| Batch / Lot No.            | text input                |
| Total Weight (KGS.)        | number input              |
| Total Amount (USD)         | number input              |

---

## Commodities Certified For

เลือกได้ 1 รายการหรือมากกว่า

- [ ] OTHER
- [ ] AFTER FURTHER PROCESS
- [ ] HUMAN CONSUMPTION DIRECTLY

---

# ประเภทที่ 3 : กมพ.1-2

> ใช้สำหรับการออกใบรับรองสุขอนามัยสำหรับประเทศในสหภาพยุโรป (EU)

## ข้อมูลอ้างอิงใบรับรอง

| รายการ                      | ประเภทข้อมูล  |
| --------------------------- | ------------- |
| Certificate Reference       | auto generate |
| IMSOC Reference / QR Code   | auto generate |
| Central Competent Authority | fixed         |
| Local Competent Authority   | fixed         |

---

## ข้อมูลผู้ส่งออก / ผู้นำเข้า

| รายการ                                   | ประเภทข้อมูล |
| ---------------------------------------- | ------------ |
| Consignor / Exporter                     | text area    |
| Consignee / Importer                     | text area    |
| Operator Responsible for the Consignment | text area    |

---

## ข้อมูลประเทศและสถานที่

| รายการ                    | ประเภทข้อมูล       |
| ------------------------- | ------------------ |
| Country of Origin         | fixed = THAILAND   |
| Region of Origin          | select             |
| Country of Destination    | select             |
| Region of Destination     | select             |
| Place of Dispatch         | text area          |
| Place of Destination      | text area          |
| Place of Loading          | text input         |
| Entry Border Control Post | select master data |

---

## ข้อมูลการขนส่ง

Mode of Transport

- [ ] Aircraft
- [ ] Vessel
- [ ] Railway
- [ ] Road Vehicle

Transport Conditions

- [ ] Ambient
- [ ] Chilled
- [ ] Frozen

ฟิลด์เพิ่มเติม

| รายการ                     | ประเภทข้อมูล    |
| -------------------------- | --------------- |
| Container Number           | text input      |
| Seal Number                | text input      |
| Date and Time of Departure | datetime picker |
| Accompanying Documents     | text area       |

---

## Certified As Or For

เลือกได้หลายรายการ

- [ ] Products for Human Consumption
- [ ] Further Processing
- [ ] Other

ตัวเลือกเพิ่มเติม

- For Transit
- For Internal Market
- For Re-entry

---

## ข้อมูลสินค้า

| รายการ                          | ประเภทข้อมูล |
| ------------------------------- | ------------ |
| Total Number of Packages        | number input |
| Total Quantity                  | number input |
| Total Net Weight (Kg)           | number input |
| Gross Weight (Kg)               | number input |
| Total Amount USD                | number input |
| Description of Consignment      | text area    |
| CN Code                         | text input   |
| Category                        | text input   |
| Identification Mark             | text input   |
| Type of Packaging               | text input   |
| Net Weight                      | number input |
| Nature of Commodity             | text input   |
| Number of Packages              | number input |
| Batch No.                       | text input   |
| Date of Collection / Production | date picker  |
| Manufacturing Plant             | auto fill    |
| Approval / Registration Number  | auto fill    |

---

# ประเภทที่ 4 : กมพ.1-3

> ใช้สำหรับการออกใบรับรองสุขอนามัยสำหรับประเทศสาธารณรัฐเกาหลี

## ข้อมูลผู้ประกอบการ

| รายการ                                                 | ประเภทข้อมูล |
| ------------------------------------------------------ | ------------ |
| Exporter Name, Full Address, Country                   | text area    |
| Registration / Declaration / Accreditation of Exporter | text area    |
| Producer Name, Full Address, Country                   | text area    |
| Registration / Declaration / Accreditation of Producer | text area    |
| Consignee / Importer                                   | text area    |

> ต้องกรอกเป็นภาษาอังกฤษตัวพิมพ์ใหญ่

---

## ข้อมูลการขนส่ง

| รายการ                 | ประเภทข้อมูล     |
| ---------------------- | ---------------- |
| Date of Shipment       | date picker      |
| Sample Submitted By    | auto fill        |
| Analysis Report Number | auto fill        |
| Received Date          | auto fill        |
| Country of Origin      | fixed = THAILAND |
| Country of Destination | fixed = KOREA    |
| Loading Place          | text input       |
| Declared Entry Point   | text input       |
| Bill Number            | text input       |

Mode of Transport

- [ ] SEA
- [ ] ROAD
- [ ] AIR

Temperature of Food Product

- [ ] Ambient
- [ ] Chilled
- [ ] Frozen

---

## ข้อมูลสินค้า

| รายการ                      | ประเภทข้อมูล         |
| --------------------------- | -------------------- |
| Description of Products     | text area            |
| Name of Product             | auto fill / editable |
| Date of Production          | date picker          |
| Expiry Date                 | date picker          |
| State or Type of Processing | checkbox             |

ตัวเลือก State or Type of Processing

- [ ] AFTER FURTHER PROCESS
- [ ] HUMAN CONSUMPTION DIRECTLY
- [ ] OTHER

---

## ปริมาณและบรรจุภัณฑ์

| รายการ                             | ประเภทข้อมูล |
| ---------------------------------- | ------------ |
| Gross Mass or Volume (Kgs.)        | number input |
| Net Mass or Volume (Kgs.)          | number input |
| Number and Nature of Packages      | text input   |
| Batch Number or Document Reference | text input   |
| Total Amount                       | number input |

---

# ขั้นตอนที่ 2 : ไฟล์แนบ

เอกสารที่ต้องแนบ

- สำเนา Test Report ที่ได้รับการพิจารณาแล้ว
- เอกสารประกอบอื่น ๆ (ถ้ามี)

รองรับไฟล์

- PDF
- JPG
- JPEG
- PNG

ขนาดไฟล์ไม่เกิน 10 MB ต่อไฟล์

---

# Validation / เงื่อนไขระบบ

## เงื่อนไขทั่วไป

- ต้องเลือก Test Report ที่ผ่านการพิจารณาแล้ว
- ต้องกรอกข้อมูลเป็นภาษาอังกฤษตัวพิมพ์ใหญ่
- ต้องมีประเทศปลายทางอย่างน้อย 1 ประเทศ
- ต้องระบุวันส่งออก
- จำนวนสินค้า น้ำหนัก และมูลค่าต้องมากกว่า 0

## กมพ.1

- ต้องมี Description of Goods อย่างน้อย 1 รายการ
- ต้องเลือกวิธีการขนส่งอย่างน้อย 1 รายการ

## กมพ.1-1

- ต้องเลือกอุณหภูมิสินค้าอย่างน้อย 1 รายการ
- หากระบุ Halal Certificate ต้องแนบเอกสารประกอบ

## กมพ.1-2

- ต้องเลือก Means of Transport อย่างน้อย 1 รายการ
- หากเลือก For Transit ต้องระบุประเทศที่ผ่าน

## กมพ.1-3

- ต้องเลือก State or Type of Processing อย่างน้อย 1 รายการ
- Country of Destination ต้องเป็น KOREA เท่านั้น

---

# ปุ่มการทำงาน

| ปุ่ม     | การทำงาน           |
| -------- | ------------------ |
| ย้อนกลับ | กลับหน้าก่อนหน้า   |
| แบบร่าง  | บันทึกเป็นแบบร่าง  |
| ถัดไป    | ไปขั้นตอนแนบไฟล์   |
| ยื่นคำขอ | ส่งคำขอออกใบรับรอง |
