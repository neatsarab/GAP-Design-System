/**
 * gap-status.types.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Type definitions สำหรับสถานะทั้งหมดในระบบรับรองแหล่งผลิต GAP พืช
 * กรมวิชาการเกษตร (Department of Agriculture)
 *
 * Application State Flow (Happy Path):
 *   DRAFT → SUBMITTED → DOC_REVIEW → INSPECTION_SCHEDULED
 *         → INSPECTING → APPROVED → CERT_ISSUED → CERT_EXPIRED
 *
 * Special States:
 *   REJECTED  — ปฏิเสธคำขอ (ออกจาก flow ได้หลาย step)
 *   CANCELLED — ยกเลิกโดยเกษตรกร/เจ้าหน้าที่
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ══════════════════════════════════════════════════════════════════════════════
// 1. UNION TYPE — สถานะทั้งหมดในระบบ
// ══════════════════════════════════════════════════════════════════════════════

/** สถานะทั้งหมดของใบคำขอ GAP (ลำดับตาม Application State Flow) */
export type GapStatus =
  // ── Happy Path ────────────────────────────────────────────────────────────
  | 'DRAFT'                // ร่างคำขอ (ยังไม่ยื่น)
  | 'SUBMITTED'            // ยื่นคำขอแล้ว (รอตรวจเอกสาร)
  | 'DOC_REVIEW'           // อยู่ระหว่างตรวจสอบเอกสาร
  | 'INSPECTION_SCHEDULED' // นัดหมายตรวจประเมินแล้ว
  | 'INSPECTING'           // อยู่ระหว่างตรวจประเมิน ณ แปลง
  | 'APPROVED'             // ผ่านการรับรอง (รอออกใบรับรอง)
  | 'CERT_ISSUED'          // ออกใบรับรองแล้ว (มีผล)
  | 'CERT_EXPIRED'         // ใบรับรองหมดอายุ
  // ── Special States ────────────────────────────────────────────────────────
  | 'REJECTED'             // ไม่ผ่าน / ปฏิเสธคำขอ
  | 'CANCELLED'            // ยกเลิกคำขอ

// ── Role ──────────────────────────────────────────────────────────────────

/** บทบาทผู้ใช้งานในระบบ */
export type GapRole =
  | 'FARMER'       // เกษตรกรผู้ยื่นคำขอ
  | 'OFFICER'      // เจ้าหน้าที่กรมวิชาการเกษตร (ตรวจเอกสาร)
  | 'INSPECTOR'    // ผู้ตรวจประเมิน (ลงพื้นที่)
  | 'SUPERVISOR'   // หัวหน้า / ผู้อนุมัติ
  | 'ADMIN'        // ผู้ดูแลระบบ (เห็นทุกสถานะ)

// ── Semantic Group ─────────────────────────────────────────────────────────

/**
 * กลุ่มความหมายสำหรับ UI styling
 * - maps ตรงกับ Vuetify color tokens ใน vuetify.ts
 */
export type GapStatusSemantic =
  | 'neutral'   // ยังไม่เริ่ม / ร่าง
  | 'info'      // กำลังดำเนินการ / รอ
  | 'warning'   // ต้องการการดำเนินการ / มีการนัดหมาย
  | 'success'   // สำเร็จ / ผ่าน
  | 'error'     // ล้มเหลว / ปฏิเสธ
  | 'muted'     // สิ้นสุด / ยกเลิก / หมดอายุ

// ── Status Definition (Full Record) ───────────────────────────────────────

/** โครงสร้างข้อมูลสมบูรณ์ของแต่ละสถานะ */
export interface GapStatusDefinition {
  /** Status code (ใช้ใน API / database) */
  code: GapStatus

  /** ชื่อสถานะภาษาไทยอย่างเป็นทางการ */
  labelTh: string

  /** ชื่อสถานะภาษาอังกฤษ (สำหรับ tooltip / export) */
  labelEn: string

  /** คำอธิบายสถานะ (ภาษาไทย) สำหรับแสดงใน help text */
  descriptionTh: string

  /** Semantic group — ใช้กำหนดสีของ chip */
  semantic: GapStatusSemantic

  /** Vuetify color prop ที่ตรงกับ semantic (ใช้ใน v-chip :color) */
  color: string

  /** Font Awesome icon string (format: "fas fa-icon-name") */
  icon: string

  /** บทบาทที่สามารถมองเห็นสถานะนี้ได้ */
  visibleTo: GapRole[]

  /** ลำดับใน State Flow (ใช้สำหรับ progress indicator) */
  order: number

  /** เป็น terminal state หรือไม่ (ไม่สามารถเปลี่ยนสถานะต่อได้) */
  isTerminal: boolean

  /** สถานะที่สามารถเปลี่ยนไปได้ (valid transitions) */
  canTransitionTo: GapStatus[]

  /** บทบาทที่มีสิทธิ์เปลี่ยนสถานะนี้ */
  transitionBy: GapRole[]
}
