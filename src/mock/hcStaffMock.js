export const mockApps = {
  "HC-001": {
    id: "HC-001",
    requestNo: "HC-00041",
    requestType: "ขอใบรับรอง",
    status: "submitted",
    submittedAt: "15/01/2569",
    agency: "สำนักงานเกษตรจังหวัดเชียงใหม่",
    registryType: "has_doa_gap",
    exportDuration: "7 วัน",
    dateStart: "15/01/2569",
    dateEnd: "22/01/2569",
    applicantNameTh: "นายสมชาย ใจดี",
    applicantAddress:
      "123 หมู่ 1 ถ.พระราม 9 ต.ลาดยาว อ.จตุจักร จ.กรุงเทพมหานคร 10900",
    applicantPhone: "02-123-4567",
    applicantFax: "-",
    applicantEmail: "somchai@thaifruits.co.th",
    companyNameTh: "บริษัท ไทยฟรุ๊ต จำกัด",
    companyNameEn: "Thai Fruits Co., Ltd.",
    companyAddressTh:
      "123 ถ.พระราม 9 ต.ห้วยขวาง อ.ห้วยขวาง จ.กรุงเทพมหานคร 10310",
    companyAddressEn: "123 Rama 9 Rd., Huai Khwang, Huai Khwang, Bangkok 10310",
    companyPhone: "02-123-4567",
    companyFax: "02-123-4568",
    companyEmail: "info@thaifruits.co.th",
    exporters: [
      {
        regNo: "EXP-2568-00123",
        companyName: "บริษัท ไทยฟรุ๊ต จำกัด",
        factories: ["DOA-2568-11111"],
        gaps: ["GAP-CM-2569-001"],
        countries: ["จีน", "ญี่ปุ่น"],
        expDate: "14/01/2570",
      },
    ],
    factories: [
      {
        doaNo: "DOA-2568-11111",
        factoryName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
        plantType: "ทุเรียน",
        province: "เชียงใหม่",
        expDate: "01/06/2570",
      },
    ],
    pathogens: ["Salmonella spp.", "E.coli"],
    exportDetails: [
      {
        certType: "คลุมทั้งการส่งออก (All)",
        exporterRegNo: "EXP-2568-00123",
        exporterName: "บริษัท ไทยฟรุ๊ต จำกัด",
        weight: 5000,
        vehicleType: "เรือ",
        vehicleName: "THAI STAR 001",
        shipments: [
          {
            consignee: "Guangzhou Fresh Import Co., Ltd.",
            address: "No.88 Tianhe Rd., Guangzhou, China",
            country: "จีน",
            checkpoint: "ด่านท่าเรือแหลมฉบัง",
            lotNo: "LOT-2569-001",
            weight: 5000,
            exportDate: "15/01/2569",
          },
        ],
      },
    ],
    totalWeight: 5000,
    totalValue: 250000,
    labTest: "yes",
    labName: "ห้องปฏิบัติการกรมวิชาการเกษตร",
    labProduct: "ทุเรียน",
    attachments: [{ label: "เอกสารอื่นๆ" }],
    activityLog: [
      {
        type: "checking",
        action: "กำลังตรวจคำขอ",
        actor: "เจ้าหน้าที่",
        timestamp: "",
        remark: "",
      },
      {
        type: "submit",
        action: "ยื่นคำขอ",
        actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
        timestamp: "15/01/2569 10:30",
        remark: "",
      },
    ],
    // cert-specific fields
    certNo: "THHC-2569-00041",
    certIssueDate: "20/01/2569",
    certExpireDate: "20/01/2570",
    certStatus: "active",
    certActivityLog: [
      {
        type: "issue",
        action: "ออกใบรับรอง",
        actor: "ระบบ",
        timestamp: "20/01/2569 10:00",
        remark: "เลขทะเบียน THHC-2569-00041",
      },
      {
        type: "forward",
        action: "ผ่านการลงนาม",
        actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
        timestamp: "20/01/2569 09:45",
      },
      {
        type: "forward",
        action: "ผ่านการพิจารณา",
        actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
        timestamp: "18/01/2569 14:20",
      },
      {
        type: "lab_review",
        action: "ผ่านการพิจารณาผล Lab",
        actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
        timestamp: "17/01/2569 16:00",
      },
      {
        type: "lab_record",
        action: "บันทึกผล Lab",
        actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
        timestamp: "17/01/2569 11:30",
      },
      {
        type: "forward",
        action: "ผ่านการตรวจ",
        actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
        timestamp: "16/01/2569 11:00",
      },
      {
        type: "submit",
        action: "ยื่นคำขอ",
        actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
        timestamp: "15/01/2569 09:12",
        remark: "",
      },
    ],
  },
};

mockApps["HC-010"] = {
  ...mockApps["HC-001"],
  id: "HC-010",
  requestNo: "HC-00042",
  status: "submitted",
  applicantNameTh: "นายวิชัย ผลดี",
  companyNameTh: "บริษัท กรีนเฟรช จำกัด",
  companyNameEn: "Green Fresh Co., Ltd.",
  labTest: "yes",
  labName: "ห้องปฏิบัติการกรมวิชาการเกษตร",
  labProduct: "ลิ้นจี่",
  activityLog: [
    {
      type: "checking",
      action: "กำลังตรวจคำขอ",
      actor: "เจ้าหน้าที่",
      timestamp: "",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายวิชัย ผลดี (ผู้ยื่นคำขอ)",
      timestamp: "16/01/2569 14:20",
      remark: "",
    },
  ],
};

mockApps["HC-013"] = {
  ...mockApps["HC-001"],
  id: "HC-013",
  requestNo: "HC-00043",
  status: "submitted",
  applicantNameTh: "นางสาวมาลี รักไทย",
  companyNameTh: "บริษัท สยามเอ็กซ์พอร์ต จำกัด",
  companyNameEn: "Siam Export Co., Ltd.",
  labTest: "no",
  labName: "",
  activityLog: [
    {
      type: "checking",
      action: "กำลังตรวจคำขอ",
      actor: "เจ้าหน้าที่",
      timestamp: "",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นางสาวมาลี รักไทย (ผู้ยื่นคำขอ)",
      timestamp: "17/01/2569 09:15",
      remark: "",
    },
  ],
};

// mapping: certNo → appId
export const certToApp = {
  "THHC-2569-00041": "HC-001",
};
