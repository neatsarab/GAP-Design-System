<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6 flex-wrap">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div>
        <h1 class="page-title mb-1">
          รายละเอียดคำขอ {{ appDetail.requestNo }}
        </h1>
        <div class="d-flex align-center ga-2">
          <v-chip size="small" color="hcex-staff" variant="tonal">{{
            appDetail.certType
          }}</v-chip>
          <v-chip
            size="small"
            :color="getStatusColor(currentStatus)"
            variant="tonal"
            :prepend-icon="getStatusIcon(currentStatus)"
          >
            {{ getStatusLabel(currentStatus) }}
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Step Indicator -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 80px"
            >
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon
                  v-if="currentWorkflowStep > step.value"
                  icon="fas fa-check"
                  size="14"
                  color="white"
                />
                <span v-else class="text-caption font-weight-bold">{{
                  step.value + 1
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  currentWorkflowStep >= step.value
                    ? 'text-hcex-staff font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentWorkflowStep > step.value }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- Step 1: ตรวจสอบคำขอ -->
    <div v-if="currentWorkflowStep === 0">
      <v-row>
        <v-col cols="12" md="6">
          <!-- ผู้ส่งออก -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-building" color="hcex-staff" size="16" />
              ผู้ส่งออก (Exporter)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">ชื่อบริษัท</span>
                  <span class="info-value">{{ appDetail.exporterName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ที่อยู่</span>
                  <span class="info-value">{{
                    appDetail.exporterAddress
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ประเทศ</span>
                  <span class="info-value">ไทย</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- ผู้รับสินค้า -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-user-tie" color="hcex-staff" size="16" />
              ผู้รับสินค้า (Consignee)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">ชื่อ</span>
                  <span class="info-value">{{ appDetail.consigneeName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ที่อยู่</span>
                  <span class="info-value">{{
                    appDetail.consigneeAddress
                  }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ประเทศปลายทาง</span>
                  <span class="info-value text-warning font-weight-medium">{{
                    appDetail.destination
                  }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <!-- ข้อมูลการขนส่ง -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-ship" color="hcex-staff" size="16" />
              ข้อมูลการขนส่ง
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">วันที่ส่งสินค้า</span>
                  <span class="info-value">{{ appDetail.shipDate }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">วิธีการขนส่ง</span>
                  <span class="info-value">{{ appDetail.shipMethod }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ท่าเรือต้นทาง</span>
                  <span class="info-value">{{ appDetail.portOfLoading }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- ผล Lab ที่เลือก -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-flask-vial" color="hcex-staff" size="16" />
              ผล Lab ที่เลือก
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-chip
                v-for="lab in appDetail.selectedLabs"
                :key="lab"
                size="small"
                color="success"
                variant="tonal"
                class="mr-2 mb-2"
                prepend-icon="fas fa-circle-check"
              >
                {{ lab }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- รายละเอียดสินค้า -->
      <v-card class="mb-5">
        <v-card-title
          class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
        >
          <v-icon icon="fas fa-box" color="hcex-staff" size="16" />
          รายละเอียดสินค้า
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th>Shipping Mark</th>
                <th>Description of Goods</th>
                <th>Quantity</th>
                <th>Net Weight (kg)</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in appDetail.products" :key="p.description">
                <td>{{ p.shippingMark }}</td>
                <td>{{ p.description }}</td>
                <td>{{ p.quantity }}</td>
                <td>{{ p.netWeight }}</td>
                <td>{{ p.totalAmount }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <div class="d-flex ga-3">
        <v-btn
          variant="tonal"
          color="error"
          prepend-icon="fas fa-rotate-left"
          @click="openReturnDialog"
        >
          ส่งกลับแก้ไข
        </v-btn>
        <v-spacer />
        <v-btn
          color="hcex-staff"
          append-icon="fas fa-chevron-right"
          @click="currentWorkflowStep++"
        >
          ผ่านการตรวจสอบ
        </v-btn>
      </div>
    </div>

    <!-- Step 2: สร้าง Preview Certificate -->
    <div v-if="currentWorkflowStep === 1">
      <v-card class="mb-4">
        <v-card-title
          class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
        >
          <v-icon icon="fas fa-file-lines" color="hcex-staff" size="16" />
          สร้างแบบร่างใบรับรอง (Preview Certificate)
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>เลขที่ใบรับรอง (ร่าง)</div>
                <div class="field-label-en">Draft Cert No.</div>
              </div>
              <v-text-field
                model-value="DRAFT-THHCEX-2569-00012"
                readonly
                hide-details
                variant="outlined"
                density="comfortable"
              >
                <template #append-inner>
                  <v-chip size="x-small" color="hcex-staff" variant="tonal"
                    >ร่าง</v-chip
                  >
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>ผู้ส่งออก</div>
                <div class="field-label-en">Exporter Name</div>
              </div>
              <v-text-field
                :model-value="appDetail.exporterName"
                readonly
                hide-details
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>ผู้รับสินค้า</div>
                <div class="field-label-en">Consignee</div>
              </div>
              <v-text-field
                :model-value="appDetail.consigneeName"
                readonly
                hide-details
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>ประเทศปลายทาง</div>
                <div class="field-label-en">Destination Country</div>
              </div>
              <v-text-field
                :model-value="appDetail.destination"
                readonly
                hide-details
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>วันที่ออกใบรับรอง <span class="req">*</span></div>
                <div class="field-label-en">Issue Date</div>
              </div>
              <v-text-field
                v-model="previewIssueDate"
                type="date"
                hide-details
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mb-2">
                <div>หมายเหตุ</div>
                <div class="field-label-en">Remarks</div>
              </div>
              <v-textarea
                v-model="previewNote"
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                rows="3"
                hide-details
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="d-flex ga-3">
        <v-btn
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-chevron-left"
          @click="currentWorkflowStep--"
        >
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn
          color="hcex-staff"
          prepend-icon="fas fa-paper-plane"
          @click="currentWorkflowStep++"
        >
          ส่ง Preview ให้ผู้ประกอบการ
        </v-btn>
      </div>
    </div>

    <!-- Step 3: รอผู้ประกอบการยืนยัน -->
    <div v-if="currentWorkflowStep === 2">
      <v-card class="mb-4">
        <v-card-title
          class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
        >
          <v-icon icon="fas fa-hourglass-half" color="hcex-staff" size="16" />
          รอผู้ประกอบการยืนยัน Preview
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <!-- Waiting State -->
          <div class="text-center py-4 mb-4">
            <v-icon
              icon="fas fa-hourglass-half"
              color="hcex-staff"
              size="40"
              class="mb-3"
            />
            <div class="text-body-1 font-weight-bold mb-2">
              รอผู้ประกอบการยืนยัน Preview
            </div>
            <v-chip
              size="small"
              color="hcex-staff"
              variant="tonal"
              prepend-icon="fas fa-clock"
            >
              ส่ง Preview แล้ว เมื่อ 10 ม.ค. 68 10:30 น.
            </v-chip>
          </div>

          <!-- Preview Summary -->
          <div class="draft-cert-box mb-5">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon icon="fas fa-file-lines" color="hcex-staff" size="16" />
              <span class="text-body-2 font-weight-bold"
                >สรุป Preview ที่ส่งไป</span
              >
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">เลขที่ใบรับรอง (ร่าง)</span>
                <span class="info-value text-warning font-weight-medium"
                  >DRAFT-THHCEX-2569-00012</span
                >
              </div>
              <div class="info-item">
                <span class="info-label">ผู้ส่งออก</span>
                <span class="info-value">{{ appDetail.exporterName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ประเทศปลายทาง</span>
                <span class="info-value">{{ appDetail.destination }}</span>
              </div>
            </div>
          </div>

          <!-- Status Radio -->
          <div class="field-label mb-3">
            <div>สถานะการยืนยันจากผู้ประกอบการ <span class="req">*</span></div>
            <div class="field-label-en">Operator Confirmation Status</div>
          </div>
          <v-radio-group v-model="operatorConfirmStatus" class="mb-0">
            <v-radio value="confirmed" color="success">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">
                    ผู้ประกอบการยืนยันแล้ว
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ข้อมูลถูกต้อง พร้อมส่งลงนาม
                  </div>
                </div>
              </template>
            </v-radio>
            <v-radio value="edit_requested" color="hcex-staff">
              <template #label>
                <div>
                  <div class="text-body-2 font-weight-medium">
                    ผู้ประกอบการขอแก้ไข
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ต้องกลับไปแก้ไข Preview
                  </div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card-text>
      </v-card>

      <div class="d-flex ga-3">
        <v-btn
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-chevron-left"
          @click="currentWorkflowStep--"
        >
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn
          color="hcex-staff"
          append-icon="fas fa-chevron-right"
          @click="handleOperatorConfirm"
        >
          ดำเนินการต่อ
        </v-btn>
      </div>
    </div>

    <!-- Step 4: ส่งลงนาม -->
    <div v-if="currentWorkflowStep === 3">
      <v-card class="mb-4">
        <v-card-title
          class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
        >
          <v-icon icon="fas fa-signature" color="hcex-staff" size="16" />
          ส่งให้ผู้มีอำนาจลงนาม
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <!-- Cert Preview -->
          <div class="cert-preview mb-5">
            <div class="cert-preview-header">
              <v-icon
                icon="fas fa-industry"
                color="hcex-staff"
                size="24"
                class="mb-2"
              />
              <div class="text-body-1 font-weight-bold">
                ใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืช
              </div>
              <div class="text-caption text-medium-emphasis">
                Health Certificate for Processed Plant Products
              </div>
            </div>
            <div class="cert-preview-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">เลขที่ใบรับรอง</span>
                  <span class="info-value text-warning font-weight-bold"
                    >THHCEX-2569-00012</span
                  >
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้ส่งออก</span>
                  <span class="info-value">{{ appDetail.exporterName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ผู้รับสินค้า</span>
                  <span class="info-value">{{ appDetail.consigneeName }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ประเทศปลายทาง</span>
                  <span class="info-value">{{ appDetail.destination }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">วันที่ออก</span>
                  <span class="info-value">{{ today }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="field-label mb-2">
            <div>เลือกผู้มีอำนาจลงนาม <span class="req">*</span></div>
            <div class="field-label-en">Select Signer</div>
          </div>
          <v-autocomplete
            v-model="selectedSigner"
            :items="signers"
            item-title="name"
            item-value="id"
            placeholder="เลือกผู้มีอำนาจลงนาม"
            hide-details
            class="mb-2"
          />
          <p class="text-caption text-medium-emphasis mb-4">
            <v-icon icon="fas fa-circle-info" size="12" class="mr-1" />
            สามารถส่งให้ผู้มีอำนาจลงนามได้สูงสุด 3 คน
          </p>

          <v-alert
            color="hcex-staff"
            variant="tonal"
            density="compact"
            prepend-icon="fas fa-triangle-exclamation"
            class="mb-0"
          >
            <span class="text-body-2"
              >กรุณาตรวจสอบข้อมูลในใบรับรองให้ถูกต้องก่อนส่งลงนาม</span
            >
          </v-alert>
        </v-card-text>
      </v-card>

      <div class="d-flex ga-3">
        <v-btn
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-chevron-left"
          @click="currentWorkflowStep--"
        >
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn
          color="hcex-staff"
          prepend-icon="fas fa-paper-plane"
          @click="openSignDialog"
        >
          ส่งให้ลงนาม
        </v-btn>
      </div>
    </div>

    <!-- Return Dialog -->
    <v-dialog v-model="returnDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-rotate-left" color="error" size="18" />
          <span class="text-body-1 font-weight-bold">ส่งกลับแก้ไข</span>
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            variant="text"
            size="small"
            @click="closeReturnDialog"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="field-label mb-2">
            <div>เหตุผลที่ส่งกลับแก้ไข <span class="req">*</span></div>
            <div class="field-label-en">Return Reason</div>
          </div>
          <v-textarea
            v-model="returnReason"
            placeholder="ระบุเหตุผลหรือรายละเอียดที่ต้องแก้ไข"
            rows="4"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="closeReturnDialog"
          >
            ยกเลิก
          </v-btn>
          <v-spacer />
          <v-btn
            color="error"
            rounded="lg"
            prepend-icon="fas fa-rotate-left"
            @click="closeReturnDialog"
          >
            ยืนยันส่งกลับ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sign Confirm Dialog -->
    <v-dialog v-model="signDialog" max-width="380" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="sign-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" size="28" color="hcex-staff" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการส่งลงนาม</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ส่งใบรับรอง
            <strong class="text-warning">THHCEX-2569-00012</strong>
            ให้ผู้มีอำนาจลงนามใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="closeSignDialog"
          >
            ยกเลิก
          </v-btn>
          <v-btn color="hcex-staff" rounded="lg" block @click="completeSigning">
            ยืนยันส่งลงนาม
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งให้ลงนามสำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-warning mb-1">
            THHCEX-2569-00012
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            รอผู้มีอำนาจพิจารณาและลงนาม
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 d-flex ga-2">
          <v-btn
            color="hcex-staff"
            rounded="lg"
            block
            @click="goToApplicationList"
          >
            กลับรายการ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "HCEXstaffApplicationList" });
}

const currentWorkflowStep = ref(0);
const previewIssueDate = ref("");
const previewNote = ref("");
const operatorConfirmStatus = ref(null);
const selectedSigner = ref(null);
const signDialog = ref(false);
function openSignDialog() {
  signDialog.value = true;
}
function closeSignDialog() {
  signDialog.value = false;
}
function openReturnDialog() {
  returnDialog.value = true;
}
function closeReturnDialog() {
  returnDialog.value = false;
}
const successDialog = ref(false);
const returnDialog = ref(false);
const returnReason = ref("");

const steps = [
  { value: 0, title: "ตรวจสอบคำขอ" },
  { value: 1, title: "สร้าง Preview" },
  { value: 2, title: "รอยืนยัน" },
  { value: 3, title: "ส่งลงนาม" },
];

function stepClass(v) {
  if (currentWorkflowStep.value > v) return "step-done";
  if (currentWorkflowStep.value === v) return "step-active";
  return "step-pending";
}

const today = computed(() =>
  new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
);

const currentStatus = computed(() => {
  const statusMap = [
    "under_review",
    "preview_draft",
    "preview_sent",
    "pending_signing",
  ];
  return statusMap[currentWorkflowStep.value] ?? "under_review";
});

const appDetail = {
  requestNo: "HCEX-2569-00012",
  certType: "กมพ.1",
  exporterName: "บริษัท ไทยฟู้ดโปรเซส จำกัด",
  exporterAddress: "123 ถ.สุขุมวิท แขวงพระโขนง กทม.",
  consigneeName: "Nippon Foods Trading Co., Ltd.",
  consigneeAddress: "5-10, Shinjuku 1-chome, Shinjuku-ku, Tokyo",
  destination: "ญี่ปุ่น",
  shipDate: "20 ม.ค. 2569",
  shipMethod: "ทางเรือ",
  portOfLoading: "ท่าเรือแหลมฉบัง",
  selectedLabs: ["LAB-2569-00089", "LAB-2569-00085"],
  products: [
    {
      shippingMark: "TFP-JP-001",
      description: "มันฝรั่งทอดกรอบปรุงรส",
      quantity: "500 CTN",
      netWeight: "2,500",
      totalAmount: "USD 12,500",
    },
    {
      shippingMark: "TFP-JP-002",
      description: "ข้าวกล้องบรรจุสุญญากาศ",
      quantity: "200 BAG",
      netWeight: "1,000",
      totalAmount: "USD 4,000",
    },
  ],
};

const signers = [
  { id: "s1", name: "นางสาวสุมาลี วงศ์ไพร — ผู้อำนวยการกอง" },
  { id: "s2", name: "นายวิชัย ดาวเรือง — ผู้เชี่ยวชาญด้านการส่งออก" },
];

function handleOperatorConfirm() {
  if (operatorConfirmStatus.value === "edit_requested") {
    currentWorkflowStep.value = 1;
  } else {
    currentWorkflowStep.value++;
  }
}

function completeSigning() {
  signDialog.value = false;
  successDialog.value = true;
}

function getStatusColor(s) {
  const m = {
    submitted: "warning",
    under_review: "warning",
    preview_draft: "info",
    preview_sent: "secondary",
    pending_signing: "warning",
    completed: "success",
    rejected: "error",
  };
  return m[s] ?? "grey";
}
function getStatusIcon(s) {
  const m = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    preview_draft: "fas fa-file-pen",
    preview_sent: "fas fa-hourglass-half",
    pending_signing: "fas fa-signature",
    completed: "fas fa-industry",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}
function getStatusLabel(s) {
  const m = {
    submitted: "ยื่นแล้ว",
    under_review: "ตรวจสอบคำขอ",
    preview_draft: "สร้าง Preview",
    preview_sent: "รอผู้ประกอบการยืนยัน",
    pending_signing: "รอลงนาม",
    completed: "เสร็จสิ้น",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
}
</script>

<style scoped>
.step-done,
.step-active {
  background: rgb(var(--v-theme-hcex-staff)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hcex-staff), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hcex-staff)) !important;
}

/* Info Grid */
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.45);
}
.info-value {
  font-size: 13px;
  font-weight: 500;
}

/* Draft cert box */
.draft-cert-box {
  border: 1px dashed rgba(var(--v-theme-hcex-staff), 0.4);
  border-radius: 12px;
  padding: 16px;
  background: rgba(var(--v-theme-hcex-staff), 0.04);
}

/* Cert Preview */
.cert-preview {
  border: 2px solid rgba(var(--v-theme-hcex-staff), 0.3);
  border-radius: 12px;
  overflow: hidden;
}
.cert-preview-header {
  background: rgba(var(--v-theme-hcex-staff), 0.1);
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(var(--v-theme-hcex-staff), 0.2);
}
.cert-preview-body {
  padding: 20px;
}

/* Dialogs */
.sign-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--v-theme-hcex-staff), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
