<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.push('/cb/staff/applications')" />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-3 flex-wrap">
          <h1 class="page-title mb-0">{{ app.requestNo }}</h1>
          <v-chip :color="statusColor(app.status)" size="small" variant="tonal">{{ statusLabel(app.status) }}</v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">{{ app.applicant }} · ยื่นเมื่อ {{ app.submittedDate }}</p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-0">
          <div v-for="(step, idx) in workflowSteps" :key="step" class="d-flex align-center flex-grow-1">
            <div class="d-flex flex-column align-center">
              <div class="step-circle" :class="{
                'step-circle--active': currentStep === idx,
                'step-circle--done': currentStep > idx,
              }">
                <v-icon v-if="currentStep > idx" icon="fas fa-check" size="14" />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <span class="text-caption mt-1 text-center" :class="currentStep >= idx ? 'text-cb-staff font-weight-medium' : 'text-medium-emphasis'" style="max-width:80px;line-height:1.3">{{ step }}</span>
            </div>
            <div v-if="idx < workflowSteps.length - 1" class="step-line flex-grow-1" :class="{ 'step-line--done': currentStep > idx }" />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 1: ข้อมูลคำขอ ─── -->
    <template v-if="currentStep === 0">
      <v-row>
        <v-col cols="12" md="8">
          <!-- ข้อมูลผู้ยื่นคำขอ -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon icon="fas fa-user" color="cb-staff" class="mr-2" size="18" />ข้อมูลผู้ยื่นคำขอ
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12" sm="6"><div class="info-label">ชื่อ – นามสกุล</div><div class="info-value">{{ app.applicant }}</div></v-col>
                <v-col cols="12" sm="6"><div class="info-label">เลขบัตรประชาชน</div><div class="info-value">1-2345-67890-12-3</div></v-col>
                <v-col cols="12" sm="6"><div class="info-label">โทรศัพท์</div><div class="info-value">02-123-4567</div></v-col>
                <v-col cols="12" sm="6"><div class="info-label">E-mail</div><div class="info-value">contact@example.com</div></v-col>
                <v-col cols="12"><div class="info-label">ที่อยู่</div><div class="info-value">123 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900</div></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ข้อมูลสำนักงาน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon icon="fas fa-location-dot" color="cb-staff" class="mr-2" size="18" />ที่ตั้งสำนักงาน
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12"><div class="info-label">ที่อยู่สำนักงาน</div><div class="info-value">456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110</div></v-col>
                <v-col cols="12" sm="6"><div class="info-label">โทรศัพท์</div><div class="info-value">02-987-6543</div></v-col>
                <v-col cols="12" sm="6"><div class="info-label">โทรสาร</div><div class="info-value">02-987-6544</div></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- มาตรฐาน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon icon="fas fa-certificate" color="cb-staff" class="mr-2" size="18" />มาตรฐานที่ขอขึ้นทะเบียน
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-chip v-for="std in app.standards" :key="std" color="cb-staff" variant="tonal" size="small" class="mr-2 mb-2">{{ std }}</v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="0" class="section-card">
            <v-card-title class="pa-5 pb-3 section-title">การดำเนินการ</v-card-title>
            <v-divider />
            <v-card-text class="pa-5 d-flex flex-column ga-3">
              <div class="info-label mb-1">ประเภทคำขอ</div>
              <v-chip color="cb-staff" variant="tonal" size="small" class="mb-2">{{ typeLabel(app.type) }}</v-chip>
              <v-btn color="cb-staff" rounded="lg" block prepend-icon="fas fa-arrow-right" @click="currentStep = 1">
                เริ่มพิจารณา
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- ─── STEP 2: พิจารณาทะเบียน ─── -->
    <template v-if="currentStep === 1">
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-magnifying-glass" color="cb-staff" class="mr-2" size="18" />ผลการพิจารณา
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="review.decision" color="cb-staff" class="mb-4">
            <v-radio value="approved" class="mb-2">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-check" color="success" size="18" />
                  <span>ผ่าน</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="improve" class="mb-2">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-exclamation" color="warning" size="18" />
                  <span>ปรับปรุง</span>
                </div>
              </template>
            </v-radio>
            <v-radio value="rejected">
              <template #label>
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                  <span>ไม่ผ่าน</span>
                </div>
              </template>
            </v-radio>
          </v-radio-group>

          <div class="field-label mb-1"><div>หมายเหตุ / เหตุผล</div><div class="field-label-en">Remarks / Review Reason</div></div>
          <v-textarea
            v-model="review.remark"
            variant="outlined"
            density="compact"
            rounded="lg"
            rows="4"
            placeholder="บันทึกความคิดเห็นของเจ้าหน้าที่..."
          />
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="currentStep = 0">ย้อนกลับ</v-btn>
        <v-btn color="cb-staff" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="currentStep = 2">บันทึก</v-btn>
      </div>
    </template>

    <!-- ─── STEP 3: ลงนาม ─── -->
    <template v-if="currentStep === 2">
      <v-row>
        <v-col cols="12" md="7">
          <!-- สถานะการดำเนินการ -->
          <v-card rounded="xl" elevation="0" class="section-card mb-5">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon icon="fas fa-pen-nib" color="cb-staff" class="mr-2" size="18" />ลงนาม / อนุมัติ
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <!-- ผลพิจารณาจาก Step 2 -->
              <v-alert
                :color="review.decision === 'approved' ? 'success' : review.decision === 'improve' ? 'warning' : 'error'"
                variant="tonal"
                rounded="lg"
                density="compact"
                class="mb-5"
                :prepend-icon="review.decision === 'approved' ? 'fas fa-circle-check' : review.decision === 'improve' ? 'fas fa-circle-exclamation' : 'fas fa-circle-xmark'"
              >
                ผลการพิจารณา: <strong>{{ { approved: 'ผ่าน', improve: 'ปรับปรุง', rejected: 'ไม่ผ่าน' }[review.decision] ?? '—' }}</strong>
              </v-alert>

              <div class="field-label mb-1"><div>สถานะการดำเนินการ</div><div class="field-label-en">Action Status</div></div>
              <v-radio-group v-model="sign.actionStatus" color="cb-staff" class="mb-4">
                <v-radio value="suspend" label="ระงับ" class="mb-1" />
                <v-radio value="pause" label="พักใช้" class="mb-1" />
                <v-radio value="revoke" label="เพิกถอน" />
              </v-radio-group>

              <v-row dense>
                <v-col cols="12">
                  <div class="field-label mb-1"><div>ประเทศ</div><div class="field-label-en">Country</div> <span class="text-caption text-medium-emphasis">(เลือกได้หลายประเทศ)</span></div>
                  <v-autocomplete
                    v-model="sign.countries"
                    :items="countryOptions"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    multiple
                    chips
                    closable-chips
                    hide-details
                  />
                </v-col>
                <v-col cols="12" class="mt-3">
                  <div class="field-label mb-1"><div>พืช</div><div class="field-label-en">Crop</div></div>
                  <v-autocomplete
                    v-model="sign.cropType"
                    :items="cropOptions"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" class="mt-3">
                  <div class="field-label mb-1"><div>หมายเหตุ / เหตุผล</div><div class="field-label-en">Remarks / Reason</div></div>
                  <v-textarea v-model="sign.remark" variant="outlined" density="compact" rounded="lg" rows="3" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <!-- สถานะการใช้งาน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-5">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon icon="fas fa-toggle-on" color="cb-staff" class="mr-2" size="18" />สถานะการใช้งาน
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-body-2 font-weight-medium">{{ sign.active ? "Active" : "Inactive" }}</div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    {{ sign.active ? "ใบรับรองมีผลบังคับใช้" : "ใบรับรองถูกระงับการใช้งาน" }}
                  </div>
                </div>
                <v-switch
                  v-model="sign.active"
                  color="cb-staff"
                  hide-details
                  inset
                />
              </div>
            </v-card-text>
          </v-card>

          <!-- สรุปคำขอ -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <v-card-title class="pa-5 pb-3 section-title">สรุปคำขอ</v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12"><div class="info-label">เลขคำขอ</div><div class="info-value">{{ app.requestNo }}</div></v-col>
                <v-col cols="12"><div class="info-label">ผู้ยื่นคำขอ</div><div class="info-value">{{ app.applicant }}</div></v-col>
                <v-col cols="12"><div class="info-label">ประเภทคำขอ</div><div class="info-value">{{ typeLabel(app.type) }}</div></v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex justify-space-between mt-2">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="currentStep = 1">ย้อนกลับ</v-btn>
        <v-btn color="cb-staff" rounded="lg" prepend-icon="fas fa-pen-nib" @click="confirmDialog = true">บันทึก</v-btn>
      </div>
    </template>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-pen-nib" color="cb-staff" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการลงนาม</h3>
          <p class="text-body-2 text-medium-emphasis">ยืนยันการดำเนินการและบันทึกผลการพิจารณาใช่หรือไม่?</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn variant="tonal" color="grey" rounded="lg" block @click="confirmDialog = false">ยกเลิก</v-btn>
          <v-btn color="cb-staff" rounded="lg" block @click="doSave">ยืนยัน</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">บันทึกสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">ดำเนินการเสร็จสมบูรณ์แล้ว</p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="cb-staff" rounded="lg" block @click="router.push('/cb/staff/applications')">กลับรายการคำขอ</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const currentStep = ref(0);
const confirmDialog = ref(false);
const successDialog = ref(false);

const workflowSteps = ["ข้อมูลคำขอ", "พิจารณาทะเบียน", "ลงนาม"];

const app = {
  requestNo: `CB-${route.params.id ?? "0001"}`,
  applicant: "บ.ไทยเซอร์ติฟาย จก.",
  submittedDate: "01/01/2568",
  type: "register",
  status: "pending",
  standards: ["GMP ทั่วไป", "HACCP", "การปฏิบัติที่ดีสำหรับโรงงานบรรจุและผลิต"],
};

const review = reactive({ decision: "approved", remark: "" });
const sign = reactive({ actionStatus: "", countries: [] as string[], cropType: "", remark: "", active: true });

const countryOptions = ["ไทย", "จีน", "ญี่ปุ่น", "เกาหลีใต้", "สหรัฐอเมริกา", "สหภาพยุโรป", "ออสเตรเลีย", "อาเซียน"];
const cropOptions = ["ทุเรียน", "มังคุด", "ลำไย", "ลิ้นจี่", "มะม่วง", "กล้วย", "สับปะรด"];

function typeLabel(t: string) {
  return { register: "ขึ้นทะเบียน", renew: "ต่ออายุ", scope: "เพิ่ม/ลดขอบข่าย", other: "อื่น ๆ" }[t] ?? t;
}
function statusColor(s: string) {
  return { pending: "warning", reviewing: "info", approved: "success", improve: "orange", rejected: "error" }[s] ?? "grey";
}
function statusLabel(s: string) {
  return { pending: "รอพิจารณา", reviewing: "อยู่ระหว่างพิจารณา", approved: "ผ่าน", improve: "ปรับปรุง", rejected: "ไม่ผ่าน" }[s] ?? s;
}

function doSave() { confirmDialog.value = false; successDialog.value = true; }
</script>

<style scoped>
div { --step-color: rgb(var(--v-theme-cb-staff)); --step-color-tint: rgba(var(--v-theme-cb-staff), 0.2); }
.step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity)); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: rgba(var(--v-theme-on-surface), 0.45); flex-shrink: 0; }
.step-circle--active { border-color: rgb(var(--v-theme-cb-staff)); color: rgb(var(--v-theme-cb-staff)); background: rgba(var(--v-theme-cb-staff), 0.08); }
.step-circle--done { border-color: rgb(var(--v-theme-cb-staff)); background: rgb(var(--v-theme-cb-staff)); color: white; }
.confirm-ring { width: 72px; height: 72px; border-radius: 50%; background: rgba(var(--v-theme-cb-staff), 0.1); display: flex; align-items: center; justify-content: center; }
</style>
