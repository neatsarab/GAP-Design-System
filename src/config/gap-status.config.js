/**
 * gap-status.config.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Status Mapping Table + Business Rules สำหรับระบบ GAP
 *
 * ใช้ร่วมกับ:
 *   - AppStatusChip.vue    (แสดงสถานะ)
 *   - AppStatusBadge.vue   (แสดงใน sidebar / dashboard)
 *   - useGapStatus()       (composable)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ══════════════════════════════════════════════════════════════════════════════
// 2. STATUS MAPPING TABLE
// ══════════════════════════════════════════════════════════════════════════════

/** Role shorthand สำหรับความกระชับ */
const ALL_ROLES = ['FARMER', 'staff', 'INSPECTOR', 'SUPERVISOR', 'ADMIN']
const STAFF_ROLES = ['staff', 'INSPECTOR', 'SUPERVISOR', 'ADMIN']

/**
 * GAP_STATUS_MAP — ตาราง mapping สมบูรณ์ทุกสถานะ
 *
 * หมายเหตุ color tokens:
 *   - ตรงกับ semantic color ที่กำหนดใน vuetify.js (gapLight / gapDark)
 *   - info, success, warning, error — ใช้ Vuetify semantic token โดยตรง
 *   - neutral/muted — ใช้ 'default' (surface-variant) ของ Vuetify chip
 */
export const GAP_STATUS_MAP = {

  // ────────────────────────────────────────────────────────────────────────────
  // DRAFT — ร่างคำขอ
  // ────────────────────────────────────────────────────────────────────────────
  DRAFT: {
    code:          'DRAFT',
    labelTh:       'ร่างคำขอ',
    labelEn:       'Draft',
    descriptionTh: 'คำขอที่เกษตรกรสร้างไว้ แต่ยังไม่ได้ยื่นต่อกรมวิชาการเกษตร',
    semantic:      'neutral',
    color:         'default',
    icon:          'fas fa-file-pen',
    visibleTo:     ALL_ROLES,
    order:         1,
    isTerminal:    false,
    canTransitionTo: ['SUBMITTED', 'CANCELLED'],
    transitionBy:  ['FARMER', 'ADMIN'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // SUBMITTED — ยื่นคำขอแล้ว
  // ────────────────────────────────────────────────────────────────────────────
  SUBMITTED: {
    code:          'SUBMITTED',
    labelTh:       'ยื่นคำขอแล้ว',
    labelEn:       'Submitted',
    descriptionTh: 'คำขอถูกส่งถึงกรมวิชาการเกษตรแล้ว อยู่ระหว่างรอการตรวจสอบเอกสาร',
    semantic:      'info',
    color:         'info',
    icon:          'fas fa-paper-plane',
    visibleTo:     ALL_ROLES,
    order:         2,
    isTerminal:    false,
    canTransitionTo: ['DOC_REVIEW', 'REJECTED', 'CANCELLED'],
    transitionBy:  ['staff', 'ADMIN'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // DOC_REVIEW — ตรวจสอบเอกสาร
  // ────────────────────────────────────────────────────────────────────────────
  DOC_REVIEW: {
    code:          'DOC_REVIEW',
    labelTh:       'ตรวจสอบเอกสาร',
    labelEn:       'Document Review',
    descriptionTh: 'เจ้าหน้าที่กำลังตรวจสอบความถูกต้องและครบถ้วนของเอกสารประกอบคำขอ',
    semantic:      'warning',
    color:         'warning',
    icon:          'fas fa-file-magnifying-glass',
    visibleTo:     ALL_ROLES,
    order:         3,
    isTerminal:    false,
    canTransitionTo: ['INSPECTION_SCHEDULED', 'REJECTED', 'CANCELLED'],
    transitionBy:  ['staff', 'SUPERVISOR', 'ADMIN'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // INSPECTION_SCHEDULED — นัดหมายตรวจประเมิน
  // ────────────────────────────────────────────────────────────────────────────
  INSPECTION_SCHEDULED: {
    code:          'INSPECTION_SCHEDULED',
    labelTh:       'นัดหมายตรวจประเมิน',
    labelEn:       'Inspection Scheduled',
    descriptionTh: 'เอกสารผ่านการตรวจสอบ นัดหมายผู้ตรวจประเมินลงพื้นที่แปลงเรียบร้อยแล้ว',
    semantic:      'warning',
    color:         'warning',
    icon:          'fas fa-calendar-check',
    visibleTo:     ALL_ROLES,
    order:         4,
    isTerminal:    false,
    canTransitionTo: ['INSPECTING', 'REJECTED', 'CANCELLED'],
    transitionBy:  ['INSPECTOR', 'staff', 'ADMIN'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // INSPECTING — ตรวจประเมิน ณ แปลง
  // ────────────────────────────────────────────────────────────────────────────
  INSPECTING: {
    code:          'INSPECTING',
    labelTh:       'ตรวจประเมิน ณ แปลง',
    labelEn:       'Inspecting',
    descriptionTh: 'ผู้ตรวจประเมินกำลังดำเนินการตรวจประเมินแปลงผลิตตามมาตรฐาน GAP',
    semantic:      'info',
    color:         'info',
    icon:          'fas fa-magnifying-glass-location',
    visibleTo:     ALL_ROLES,
    order:         5,
    isTerminal:    false,
    canTransitionTo: ['APPROVED', 'REJECTED'],
    transitionBy:  ['INSPECTOR', 'SUPERVISOR', 'ADMIN'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // APPROVED — ผ่านการรับรอง
  // ────────────────────────────────────────────────────────────────────────────
  APPROVED: {
    code:          'APPROVED',
    labelTh:       'ผ่านการรับรอง',
    labelEn:       'Approved',
    descriptionTh: 'แปลงผลิตผ่านการตรวจประเมินตามมาตรฐาน GAP แล้ว อยู่ระหว่างดำเนินการออกใบรับรอง',
    semantic:      'success',
    color:         'success',
    icon:          'fas fa-circle-check',
    visibleTo:     ALL_ROLES,
    order:         6,
    isTerminal:    false,
    canTransitionTo: ['CERT_ISSUED'],
    transitionBy:  ['SUPERVISOR', 'ADMIN'],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CERT_ISSUED — ออกใบรับรองแล้ว
  // ────────────────────────────────────────────────────────────────────────────
  CERT_ISSUED: {
    code:          'CERT_ISSUED',
    labelTh:       'ออกใบรับรองแล้ว',
    labelEn:       'Certificate Issued',
    descriptionTh: 'ใบรับรองแหล่งผลิตพืช GAP ออกแล้วและมีผลบังคับใช้',
    semantic:      'success',
    color:         'success',
    icon:          'fas fa-certificate',
    visibleTo:     ALL_ROLES,
    order:         7,
    isTerminal:    false,
    canTransitionTo: ['CERT_EXPIRED'],
    transitionBy:  ['ADMIN'],                  // ระบบเปลี่ยนอัตโนมัติเมื่อหมดอายุ
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CERT_EXPIRED — ใบรับรองหมดอายุ
  // ────────────────────────────────────────────────────────────────────────────
  CERT_EXPIRED: {
    code:          'CERT_EXPIRED',
    labelTh:       'ใบรับรองหมดอายุ',
    labelEn:       'Certificate Expired',
    descriptionTh: 'ใบรับรอง GAP ครบกำหนดอายุแล้ว เกษตรกรต้องยื่นคำขอต่ออายุใหม่',
    semantic:      'muted',
    color:         'default',
    icon:          'fas fa-hourglass-end',
    visibleTo:     ALL_ROLES,
    order:         8,
    isTerminal:    true,
    canTransitionTo: [],                       // ต้องยื่นใบคำขอใหม่ (application ใหม่)
    transitionBy:  [],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // REJECTED — ปฏิเสธคำขอ (Special State)
  // ────────────────────────────────────────────────────────────────────────────
  REJECTED: {
    code:          'REJECTED',
    labelTh:       'ไม่ผ่านการพิจารณา',
    labelEn:       'Rejected',
    descriptionTh: 'คำขอถูกปฏิเสธโดยเจ้าหน้าที่ เนื่องจากเอกสารไม่ครบ / ไม่ผ่านมาตรฐาน GAP',
    semantic:      'error',
    color:         'error',
    icon:          'fas fa-circle-xmark',
    visibleTo:     ALL_ROLES,
    order:         90,                         // ไม่ใช่ linear step — แยก order ไว้สูง
    isTerminal:    true,
    canTransitionTo: [],                       // ต้องยื่นใบคำขอใหม่
    transitionBy:  [],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // CANCELLED — ยกเลิกคำขอ (Special State)
  // ────────────────────────────────────────────────────────────────────────────
  CANCELLED: {
    code:          'CANCELLED',
    labelTh:       'ยกเลิกคำขอ',
    labelEn:       'Cancelled',
    descriptionTh: 'คำขอถูกยกเลิก โดยเกษตรกรหรือเจ้าหน้าที่ผู้มีสิทธิ์',
    semantic:      'muted',
    color:         'default',
    icon:          'fas fa-ban',
    visibleTo:     ALL_ROLES,
    order:         91,
    isTerminal:    true,
    canTransitionTo: [],
    transitionBy:  [],
  },
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. BUSINESS RULES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * TRANSITION_RULES — เงื่อนไขการเปลี่ยนสถานะ (Business Rules)
 */
export const TRANSITION_RULES = [

  // ── DRAFT → SUBMITTED ──────────────────────────────────────────────────────
  {
    from: 'DRAFT',
    to:   'SUBMITTED',
    by:   ['FARMER', 'ADMIN'],
    conditions: [
      'ข้อมูลเกษตรกรและแปลงผลิตครบถ้วน',
      'แนบเอกสารประกอบครบตามที่ระบบกำหนด',
      'เกษตรกรยืนยันความถูกต้องของข้อมูล',
    ],
    notes: 'หลังยื่น ระบบส่ง notification ถึง staff ที่รับผิดชอบ',
  },

  // ── DRAFT → CANCELLED ──────────────────────────────────────────────────────
  {
    from: 'DRAFT',
    to:   'CANCELLED',
    by:   ['FARMER', 'ADMIN'],
    conditions: [
      'เกษตรกรหรือ Admin ยืนยันการยกเลิก',
    ],
    notes: 'ยกเลิก Draft ทำได้ตลอดเวลา ไม่มีผลกระทบ',
  },

  // ── SUBMITTED → DOC_REVIEW ─────────────────────────────────────────────────
  {
    from: 'SUBMITTED',
    to:   'DOC_REVIEW',
    by:   ['staff', 'ADMIN'],
    conditions: [
      'เจ้าหน้าที่รับคำขอเข้าสู่คิวตรวจสอบแล้ว',
      'ระบบบันทึกวันที่รับคำขอ (received_date)',
    ],
    notes: 'SLA: ต้องรับคำขอเข้า review ภายใน 3 วันทำการ',
  },

  // ── SUBMITTED → REJECTED ───────────────────────────────────────────────────
  {
    from: 'SUBMITTED',
    to:   'REJECTED',
    by:   ['staff', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'เอกสารไม่ครบหรือไม่ถูกต้องอย่างชัดเจน',
      'ระบุเหตุผลการปฏิเสธ (rejection_reason)',
    ],
    notes: 'ต้องบันทึกเหตุผลเสมอ — แสดงให้เกษตรกรเห็น',
  },

  // ── SUBMITTED → CANCELLED ──────────────────────────────────────────────────
  {
    from: 'SUBMITTED',
    to:   'CANCELLED',
    by:   ['FARMER', 'staff', 'ADMIN'],
    conditions: [
      'ยืนยันการยกเลิก',
      'บันทึกเหตุผลการยกเลิก',
    ],
  },

  // ── DOC_REVIEW → INSPECTION_SCHEDULED ─────────────────────────────────────
  {
    from: 'DOC_REVIEW',
    to:   'INSPECTION_SCHEDULED',
    by:   ['staff', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'เอกสารทุกรายการครบถ้วนและถูกต้อง',
      'กำหนดวัน-เวลานัดหมายตรวจประเมิน (inspection_date)',
      'มอบหมายผู้ตรวจประเมิน (inspector_id) แล้ว',
      'ระบบส่งแจ้งเตือนนัดหมายถึงเกษตรกรและผู้ตรวจ',
    ],
    notes: 'SLA: นัดหมายภายใน 15 วันทำการหลังจากเอกสารผ่าน',
  },

  // ── DOC_REVIEW → REJECTED ──────────────────────────────────────────────────
  {
    from: 'DOC_REVIEW',
    to:   'REJECTED',
    by:   ['staff', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'เอกสารไม่ผ่านการตรวจสอบ',
      'ระบุรายการเอกสารที่ไม่ถูกต้อง / ขาดหาย',
      'บันทึกเหตุผลการปฏิเสธ (rejection_reason)',
    ],
  },

  // ── DOC_REVIEW → CANCELLED ─────────────────────────────────────────────────
  {
    from: 'DOC_REVIEW',
    to:   'CANCELLED',
    by:   ['staff', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'ยืนยันการยกเลิก',
      'บันทึกเหตุผล',
    ],
  },

  // ── INSPECTION_SCHEDULED → INSPECTING ─────────────────────────────────────
  {
    from: 'INSPECTION_SCHEDULED',
    to:   'INSPECTING',
    by:   ['INSPECTOR', 'staff', 'ADMIN'],
    conditions: [
      'ถึงวันที่นัดหมายตรวจประเมินแล้ว',
      'ผู้ตรวจประเมินเช็กอิน / ยืนยันการเริ่มตรวจ',
    ],
    notes: 'อาจ trigger อัตโนมัติเมื่อถึงวัน inspection_date',
  },

  // ── INSPECTION_SCHEDULED → REJECTED ───────────────────────────────────────
  {
    from: 'INSPECTION_SCHEDULED',
    to:   'REJECTED',
    by:   ['staff', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'เกษตรกรไม่มาตามนัดโดยไม่แจ้ง (เกิน 2 ครั้ง)',
      'บันทึกเหตุผล',
    ],
  },

  // ── INSPECTION_SCHEDULED → CANCELLED ──────────────────────────────────────
  {
    from: 'INSPECTION_SCHEDULED',
    to:   'CANCELLED',
    by:   ['FARMER', 'staff', 'ADMIN'],
    conditions: [
      'ยืนยันการยกเลิก',
      'บันทึกเหตุผลและวันที่',
    ],
    notes: 'ถ้า FARMER ยกเลิก ต้องแจ้ง INSPECTOR อัตโนมัติ',
  },

  // ── INSPECTING → APPROVED ──────────────────────────────────────────────────
  {
    from: 'INSPECTING',
    to:   'APPROVED',
    by:   ['INSPECTOR', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'แปลงผลิตผ่านเกณฑ์ประเมินทุกข้อตามมาตรฐาน GAP',
      'บันทึกผลการตรวจประเมิน (inspection_result)',
      'ผู้ตรวจประเมินลงนามรับรองผลการตรวจ',
      'Supervisor หรือผู้มีอำนาจอนุมัติผล',
    ],
    notes: 'คะแนนต้องผ่านเกณฑ์ขั้นต่ำตามระเบียบกรมวิชาการเกษตร',
  },

  // ── INSPECTING → REJECTED ──────────────────────────────────────────────────
  {
    from: 'INSPECTING',
    to:   'REJECTED',
    by:   ['INSPECTOR', 'SUPERVISOR', 'ADMIN'],
    conditions: [
      'แปลงผลิตไม่ผ่านเกณฑ์ประเมินตามมาตรฐาน GAP',
      'บันทึกรายการข้อบกพร่องที่พบ (non_conformances)',
      'ผู้ตรวจประเมินลงนามรับรองผลการตรวจ',
    ],
    notes: 'เกษตรกรมีสิทธิ์อุทธรณ์ภายใน 30 วัน',
  },

  // ── APPROVED → CERT_ISSUED ─────────────────────────────────────────────────
  {
    from: 'APPROVED',
    to:   'CERT_ISSUED',
    by:   ['SUPERVISOR', 'ADMIN'],
    conditions: [
      'ผู้มีอำนาจลงนามในใบรับรอง',
      'ออกเลขที่ใบรับรอง (certificate_no)',
      'กำหนดวันหมดอายุใบรับรอง (cert_expired_date)',
      'ระบบ generate PDF ใบรับรองสำเร็จ',
    ],
    notes: 'ใบรับรอง GAP มีอายุ 3 ปี นับจากวันออก',
  },

  // ── CERT_ISSUED → CERT_EXPIRED ─────────────────────────────────────────────
  {
    from: 'CERT_ISSUED',
    to:   'CERT_EXPIRED',
    by:   ['ADMIN'],
    conditions: [
      'วันปัจจุบัน >= cert_expired_date',
    ],
    notes: 'Trigger อัตโนมัติโดย Scheduled Job ทุกวันเวลา 00:01',
  },
]

// ══════════════════════════════════════════════════════════════════════════════
// HELPER UTILITIES
// ══════════════════════════════════════════════════════════════════════════════

/**
 * ดึง StatusDefinition จาก status code
 * ส่ง fallback กลับถ้า code ไม่รู้จัก (ป้องกัน runtime crash)
 */
export function getStatusDef(status) {
  const def = GAP_STATUS_MAP[status]
  if (def) return def

  // Fallback — สำหรับ status ที่ไม่รู้จัก (เช่นมาจาก API version เก่า)
  return {
    code:            status,
    labelTh:         status,
    labelEn:         status,
    descriptionTh:   'ไม่ทราบสถานะ',
    semantic:        'neutral',
    color:           'default',
    icon:            'fas fa-circle-question',
    visibleTo:       ['ADMIN'],
    order:           99,
    isTerminal:      false,
    canTransitionTo: [],
    transitionBy:    [],
  }
}

/**
 * กรองสถานะที่บทบาทนั้นมองเห็นได้
 */
export function getStatusesForRole(role) {
  return Object.values(GAP_STATUS_MAP).filter(def =>
    def.visibleTo.includes(role)
  )
}

/**
 * ดึงสถานะที่สามารถเปลี่ยนจาก current status ได้ โดย role ที่ระบุ
 */
export function getValidTransitions(currentStatus, role) {
  const currentDef = GAP_STATUS_MAP[currentStatus]
  if (!currentDef) return []

  return currentDef.canTransitionTo
    .filter(targetStatus => {
      const rule = TRANSITION_RULES.find(
        r => r.from === currentStatus && r.to === targetStatus
      )
      return rule?.by.includes(role) ?? false
    })
    .map(status => GAP_STATUS_MAP[status])
}

/**
 * ตรวจสอบว่า role มีสิทธิ์เปลี่ยน status นี้ไปยัง target หรือไม่
 */
export function canTransition(from, to, role) {
  const rule = TRANSITION_RULES.find(r => r.from === from && r.to === to)
  return rule?.by.includes(role) ?? false
}

/**
 * ดึงสถานะ Happy Path (ไม่รวม terminal special states)
 * เรียงตาม order สำหรับ Progress Stepper
 */
export const HAPPY_PATH_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'DOC_REVIEW',
  'INSPECTION_SCHEDULED',
  'INSPECTING',
  'APPROVED',
  'CERT_ISSUED',
  'CERT_EXPIRED',
]

/**
 * สถานะพิเศษ (ออกนอก Happy Path)
 */
export const SPECIAL_STATUSES = ['REJECTED', 'CANCELLED']
