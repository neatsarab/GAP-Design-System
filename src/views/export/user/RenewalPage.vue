<template>
  <div style="--v-theme-primary: var(--v-theme-export-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">คำขอต่ออายุทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          ต่ออายุได้มากกว่า 1 ทะเบียนในคราวเดียวกัน
        </p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="section-card mb-6">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 80px"
            >
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon
                  v-if="currentStep > step.value"
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
                  currentStep >= step.value
                    ? 'text-export-user font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > step.value }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 1 ─── -->
    <template v-if="currentStep === 0">
      <v-row>
        <!-- Left -->
        <v-col cols="12">
          <!-- ค้นหาทะเบียน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-magnifying-glass"
                color="export-user"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ค้นหาทะเบียนที่ต้องการต่ออายุ</span
              >
            </div>
            <v-card-text class="pa-4">
              <div class="field-label">
                <div>เลขที่ใบทะเบียนผู้ส่งออก</div>
                <div class="field-label-en">Certificate No.</div>
              </div>
              <div class="d-flex ga-2">
                <v-text-field
                  v-model="searchInput"
                  placeholder="เช่น EXP-2569-12345"
                  prepend-inner-icon="fas fa-search"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  clearable
                  class="flex-grow-1"
                  @keyup.enter="doSearch"
                />
                <v-btn
                  color="export-user"
                  rounded="lg"
                  :loading="searching"
                  @click="doSearch"
                  >ค้นหา</v-btn
                >
              </div>

              <!-- Search Results -->
              <div v-if="searchDone" class="mt-4">
                <div v-if="searchResults.length === 0" class="text-center py-5">
                  <v-icon
                    icon="fas fa-circle-xmark"
                    color="error"
                    size="28"
                    class="mb-2"
                  />
                  <div class="text-body-2 text-medium-emphasis">
                    ไม่พบทะเบียนที่ตรงกัน
                  </div>
                </div>
                <template v-else>
                  <div class="text-caption text-medium-emphasis mb-2">
                    พบ {{ searchResults.length }} รายการ
                  </div>
                  <div
                    v-for="cert in searchResults"
                    :key="cert.certNo"
                    class="result-row rounded-lg px-4 py-3 mb-2 d-flex align-center justify-space-between"
                    :class="{ 'result-row--selected': isSelected(cert.certNo) }"
                  >
                    <div class="flex-grow-1 mr-3">
                      <div class="d-flex align-center flex-wrap ga-2 mb-1">
                        <span
                          class="text-body-2 font-weight-bold text-export-user"
                          >{{ cert.certNo }}</span
                        >
                        <v-chip
                          :color="certStatusColor(cert.status)"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ certStatusLabel(cert.status) }}
                        </v-chip>
                      </div>
                      <div
                        class="text-caption text-medium-emphasis"
                        style="line-height: 1.4"
                      >
                        {{ cert.typecert }}
                      </div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        <v-icon
                          icon="fas fa-calendar"
                          size="10"
                          class="mr-1"
                        />หมดอายุ: {{ cert.expireDate }}
                      </div>
                    </div>
                    <div class="d-flex align-center ga-2 flex-shrink-0">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        color="grey"
                        @click.stop="viewCert(cert)"
                      >
                        <v-icon icon="fas fa-eye" size="14" />
                      </v-btn>
                      <v-btn
                        v-if="!isSelected(cert.certNo)"
                        size="small"
                        color="export-user"
                        variant="tonal"
                        rounded="lg"
                        prepend-icon="fas fa-plus"
                        :disabled="cert.status === 'expired'"
                        @click="addToSelection(cert)"
                        >เลือก</v-btn
                      >
                      <v-chip
                        v-else
                        color="success"
                        size="small"
                        variant="tonal"
                        prepend-icon="fas fa-circle-check"
                        >เลือกแล้ว</v-chip
                      >
                    </div>
                  </div>
                </template>
              </div>
            </v-card-text>
          </v-card>

          <!-- ทะเบียนที่เลือก -->
          <v-card
            v-if="selected.length > 0"
            rounded="xl"
            elevation="0"
            class="section-card mb-4"
          >
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-list-check" color="export-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ทะเบียนที่เลือก</span
              >
              <v-spacer />
              <v-chip color="export-user" size="small" variant="tonal">
                {{ selected.length }} รายการ
              </v-chip>
            </div>
            <v-card-text class="pa-4">
              <div
                v-for="cert in selected"
                :key="cert.certNo"
                class="selected-item rounded-lg px-4 py-3 mb-2 d-flex align-center justify-space-between"
              >
                <div class="flex-grow-1 mr-3">
                  <div class="d-flex align-center flex-wrap ga-2 mb-1">
                    <span class="text-body-2 font-weight-bold text-export-user">{{
                      cert.certNo
                    }}</span>
                    <v-chip
                      :color="certStatusColor(cert.status)"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ certStatusLabel(cert.status) }}
                    </v-chip>
                  </div>
                  <div
                    class="text-caption text-medium-emphasis"
                    style="line-height: 1.4"
                  >
                    {{ cert.typecert }}
                  </div>
                  <div class="text-caption text-medium-emphasis mt-1">
                    <v-icon icon="fas fa-calendar" size="10" class="mr-1" />หมดอายุ:
                    {{ cert.expireDate }}
                  </div>
                </div>
                <div class="d-flex align-center ga-1 flex-shrink-0">
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="grey"
                    @click="viewCert(cert)"
                  >
                    <v-icon icon="fas fa-eye" size="14" />
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="removeFromSelection(cert.certNo)"
                  >
                    <v-icon icon="fas fa-xmark" size="14" />
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Action Bar -->
          <div class="d-flex justify-space-between align-center mt-2">
            <div class="d-flex ga-2">
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                @click="cancelRequest"
                >ยกเลิก</v-btn
              >
            </div>
            <div class="d-flex ga-2">
              <v-btn
                variant="tonal"
                color="export-user"
                rounded="lg"
                prepend-icon="fas fa-floppy-disk"
                @click="saveDraft"
                >บันทึกแบบร่าง</v-btn
              >
              <v-btn
                color="export-user"
                rounded="lg"
                append-icon="fas fa-arrow-right"
                :disabled="selected.length === 0"
                @click="currentStep = 1"
                >ถัดไป</v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- ─── STEP 2 ─── -->
    <template v-else-if="currentStep === 1">
      <v-row>
        <v-col cols="12">
          <!-- ทะเบียนที่เลือก -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-list-check" color="export-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold">ทะเบียนที่ขอต่ออายุ</span>
              <v-spacer />
              <v-chip color="export-user" size="small" variant="tonal">
                {{ selected.length }} รายการ
              </v-chip>
            </div>
            <v-card-text class="pa-4">
              <div class="d-flex flex-wrap ga-2">
                <div
                  v-for="cert in selected"
                  :key="cert.certNo"
                  class="summary-item rounded-lg px-3 py-2 d-flex align-center ga-2"
                  style="min-width: 260px; flex: 1 1 260px"
                >
                  <v-icon icon="fas fa-certificate" color="export-user" size="13" class="flex-shrink-0" />
                  <div class="overflow-hidden">
                    <div class="text-body-2 font-weight-bold text-export-user text-truncate">
                      {{ cert.certNo }}
                    </div>
                    <div class="text-caption text-medium-emphasis" style="line-height: 1.4">
                      {{ cert.typecert }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />หมดอายุ: {{ cert.expireDate }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- เอกสารแนบ -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-paperclip" color="export-user" size="15" />
              <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
            </div>
            <v-card-text class="pt-5">
              <div
                v-if="attachedFiles.length === 0"
                class="item-row rounded-lg pa-3 mb-2 d-flex align-center ga-2"
              >
                <v-icon icon="fas fa-file-circle-plus" color="grey" size="18" />
                <span class="text-body-2 text-medium-emphasis flex-grow-1"
                  >ยังไม่มีเอกสารแนบ</span
                >
                <v-chip size="x-small" color="grey" variant="tonal"
                  >ไม่บังคับ</v-chip
                >
              </div>
              <div
                v-for="(file, i) in attachedFiles"
                :key="i"
                class="item-row rounded-lg pa-3 mb-2"
              >
                <v-row align="center" no-gutters>
                  <v-col class="d-flex align-center ga-2 overflow-hidden">
                    <v-icon
                      :icon="fileIcon(file.name)"
                      :color="fileColor(file.name)"
                      size="18"
                      class="flex-shrink-0"
                    />
                    <div class="overflow-hidden">
                      <div class="text-body-2 font-weight-medium text-truncate">
                        {{ file.name }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ formatSize(file.size) }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="auto" class="pl-3">
                    <v-btn
                      icon="fas fa-xmark"
                      color="error"
                      variant="text"
                      size="small"
                      @click="removeFile(i)"
                    />
                  </v-col>
                </v-row>
              </div>
              <div class="mt-3 d-flex align-center ga-3">
                <v-btn
                  variant="tonal"
                  color="export-user"
                  size="small"
                  rounded="lg"
                  prepend-icon="fas fa-upload"
                  @click="triggerFileInput"
                >
                  เพิ่มเอกสาร
                </v-btn>
                <span class="text-caption text-medium-emphasis"
                  >รองรับ PDF, JPG, PNG ไม่เกิน 10 MB</span
                >
              </div>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                style="display: none"
                @change="onFileChange"
              />
            </v-card-text>
          </v-card>

          <!-- Action Bar -->
          <div class="d-flex justify-space-between align-center mt-2">
            <div class="d-flex ga-2">
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                @click="cancelRequest"
                >ยกเลิก</v-btn
              >
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                prepend-icon="fas fa-arrow-left"
                @click="currentStep = 0"
                >ย้อนกลับ</v-btn
              >
            </div>
            <div class="d-flex ga-2">
              <v-btn
                variant="tonal"
                color="export-user"
                rounded="lg"
                prepend-icon="fas fa-floppy-disk"
                @click="saveDraft"
                >บันทึกแบบร่าง</v-btn
              >
              <v-btn
                color="export-user"
                rounded="lg"
                prepend-icon="fas fa-rotate"
                @click="openConfirm"
                >ยื่นคำขอต่ออายุ</v-btn
              >
            </div>
          </div>
        </v-col>
      </v-row>
    </template>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="460" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="renew-ring mx-auto mb-4">
            <v-icon icon="fas fa-rotate" color="export-user" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold text-center mb-1">
            ยืนยันคำขอต่ออายุทะเบียน
          </h3>
          <p class="text-body-2 text-medium-emphasis text-center mb-4">
            คุณต้องการยื่นคำขอต่ออายุทะเบียน
            <strong>{{ selected.length }} รายการ</strong> ใช่หรือไม่?
          </p>
          <v-divider class="mb-4" />
          <div
            v-for="cert in selected"
            :key="cert.certNo"
            class="confirm-item rounded-lg px-3 py-2 mb-2 d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-certificate" color="export-user" size="14" />
            <span class="text-body-2 font-weight-medium text-export-user">{{
              cert.certNo
            }}</span>
            <span
              class="text-caption text-medium-emphasis flex-grow-1 text-truncate"
              >— {{ cert.typecert }}</span
            >
          </div>
          <div
            v-if="attachedFiles.length > 0"
            class="mt-3 d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-paperclip" size="13" color="grey" />
            <span class="text-caption text-medium-emphasis"
              >เอกสารแนบ {{ attachedFiles.length }} ไฟล์</span
            >
          </div>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="confirmDialog = false"
            >ย้อนกลับ</v-btn
          >
          <v-btn
            color="export-user"
            rounded="lg"
            block
            :loading="submitting"
            @click="doSubmit"
            >ยืนยันต่ออายุ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-check" color="success" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-1">
            ส่งคำขอต่ออายุทะเบียน {{ submittedCount }} รายการเรียบร้อยแล้ว
          </p>
          <p class="text-caption text-medium-emphasis">
            เจ้าหน้าที่จะดำเนินการตรวจสอบและแจ้งผลให้ทราบ
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-btn
            color="export-user"
            block
            rounded="lg"
            @click="router.push({ name: 'ExportUserApplicationList' })"
          >
            ไปยังรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Cert Dialog -->
    <v-dialog v-model="viewCertDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
          <v-icon icon="fas fa-certificate" color="export-user" size="18" />
          ใบทะเบียนผู้ส่งออก
          <v-spacer />
          <v-btn
            icon="fas fa-xmark"
            size="small"
            variant="text"
            color="grey"
            @click="viewCertDialog = false"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <template v-if="viewingCert">
            <v-list density="compact" lines="two">
              <v-list-item subtitle="เลขที่ใบทะเบียน">
                <v-list-item-title class="text-export-user font-weight-bold">{{
                  viewingCert.certNo
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="ประเภทคำขอ">
                <v-list-item-title>{{
                  viewingCert.typecert
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="วันที่ออกใบทะเบียน">
                <v-list-item-title>{{
                  viewingCert.issuedDate
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="วันหมดอายุ">
                <v-list-item-title>{{
                  viewingCert.expireDate
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item subtitle="สถานะ">
                <v-list-item-title>
                  <v-chip
                    size="x-small"
                    :color="certStatusColor(viewingCert.status)"
                    variant="tonal"
                  >
                    {{ certStatusLabel(viewingCert.status) }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </v-card-text>
        <v-card-actions class="px-5 pb-4">
          <v-btn
            color="export-user"
            variant="tonal"
            prepend-icon="fas fa-download"
            block
            rounded="lg"
          >
            ดาวน์โหลด PDF
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Draft Dialog -->
    <v-dialog v-model="draftDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="draft-ring mx-auto mb-4">
            <v-icon icon="fas fa-floppy-disk" color="grey" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">บันทึกแบบร่างสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis">
            บันทึกคำขอต่ออายุไว้ในแบบร่างแล้ว
            สามารถกลับมาแก้ไขและยื่นได้ในภายหลัง
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="draftDialog = false"
            >แก้ไขต่อ</v-btn
          >
          <v-btn
            color="export-user"
            rounded="lg"
            block
            @click="router.push({ name: 'ExportUserApplicationList' })"
          >
            ไปยังรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "แนบเอกสาร" },
];
const currentStep = ref(0);

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

// ── Mock certificate data ───────────────────────────
const allCerts = [
  {
    certNo: "EXP-2569-10001",
    typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
    issuedDate: "14/03/2567",
    expireDate: "14/03/2569",
    status: "active",
  },
  {
    certNo: "EXP-2569-10002",
    typecert: "คำขอขึ้นทะเบียนเป็นผู้ส่งออกกล้วยสดไปประเทศญี่ปุ่น",
    issuedDate: "01/06/2567",
    expireDate: "01/06/2569",
    status: "active",
  },
  {
    certNo: "EXP-2569-10003",
    typecert: "คำร้องขึ้นทะเบียนเป็นผู้ส่งออกพืชควบคุม",
    issuedDate: "01/01/2567",
    expireDate: "15/04/2569",
    status: "expiring",
  },
  {
    certNo: "EXP-2569-10004",
    typecert:
      "คำขอหนังสือสำคัญแสดงการจดทะเบียนเป็นผู้ส่งผลทุเรียนสดออกไปนอกราชอาณาจักร",
    issuedDate: "19/02/2565",
    expireDate: "19/02/2567",
    status: "expired",
  },
  {
    certNo: "EXP-2569-10005",
    typecert:
      "คำขอขึ้นทะเบียนเป็นผู้ส่งออกลูกเดือย เมล็ดแมงลัก และพริกแห้ง ไปนอกราชอาณาจักร",
    issuedDate: "10/08/2567",
    expireDate: "10/08/2569",
    status: "active",
  },
];

function certStatusColor(status) {
  if (status === "active") return "success";
  if (status === "expiring") return "warning";
  return "error";
}

function certStatusLabel(status) {
  if (status === "active") return "ปกติ";
  if (status === "expiring") return "ใกล้หมดอายุ";
  return "หมดอายุ";
}

// ── Search ──────────────────────────────────────────
const searchInput = ref("");
const searching = ref(false);
const searchDone = ref(false);
const searchResults = ref([]);

function doSearch() {
  if (!searchInput.value?.trim()) return;
  searching.value = true;
  searchDone.value = false;
  setTimeout(() => {
    const q = searchInput.value.trim().toUpperCase();
    searchResults.value = allCerts.filter(
      (c) =>
        c.certNo.toUpperCase().includes(q) ||
        c.typecert.includes(searchInput.value.trim()),
    );
    searchDone.value = true;
    searching.value = false;
  }, 600);
}

// ── Selection ───────────────────────────────────────
const selected = ref([]);

function isSelected(certNo) {
  return selected.value.some((c) => c.certNo === certNo);
}

function addToSelection(cert) {
  if (!isSelected(cert.certNo)) selected.value.push(cert);
}

function removeFromSelection(certNo) {
  selected.value = selected.value.filter((c) => c.certNo !== certNo);
}

// ── View cert ───────────────────────────────────────
const viewCertDialog = ref(false);
const viewingCert = ref(null);

function viewCert(cert) {
  viewingCert.value = cert;
  viewCertDialog.value = true;
}

// ── File attachment ─────────────────────────────────
const attachedFiles = ref([]);
const fileInputRef = ref(null);

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFileChange(e) {
  const files = Array.from(e.target.files ?? []);
  attachedFiles.value.push(...files);
  e.target.value = "";
}

function removeFile(i) {
  attachedFiles.value.splice(i, 1);
}

function fileIcon(name) {
  if (name.endsWith(".pdf")) return "fas fa-file-pdf";
  if (name.match(/\.(jpg|jpeg|png)$/i)) return "fas fa-file-image";
  return "fas fa-file";
}

function fileColor(name) {
  if (name.endsWith(".pdf")) return "error";
  if (name.match(/\.(jpg|jpeg|png)$/i)) return "info";
  return "grey";
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Submit ──────────────────────────────────────────
const confirmDialog = ref(false);
const successDialog = ref(false);
const submitting = ref(false);
const submittedCount = ref(0);
const draftDialog = ref(false);

function openConfirm() {
  confirmDialog.value = true;
}

async function doSubmit() {
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1000));
  submittedCount.value = selected.value.length;
  submitting.value = false;
  confirmDialog.value = false;
  successDialog.value = true;
}

function saveDraft() {
  draftDialog.value = true;
}

function cancelRequest() {
  router.back();
}
</script>

<style scoped>
.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.section-header {
  background: rgba(var(--v-theme-export-user), 0.04);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-export-user)) !important;
  color: white !important;
}

.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-export-user), 0.2) !important;
}

.step-line--done {
  background: rgb(var(--v-theme-export-user)) !important;
}

.sticky-col {
  position: sticky;
  top: 80px;
}

.result-row {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgb(var(--v-theme-surface));
  transition:
    border-color 0.15s,
    background 0.15s;
}

.result-row--selected {
  border-color: rgba(var(--v-theme-export-user), 0.4);
  background: rgba(var(--v-theme-export-user), 0.04);
}

.selected-item {
  background: rgba(var(--v-theme-export-user), 0.06);
  border: 1px solid rgba(var(--v-theme-export-user), 0.15);
}

.summary-item {
  background: rgba(var(--v-theme-export-user), 0.06);
  border: 1px solid rgba(var(--v-theme-export-user), 0.15);
}

.confirm-item {
  background: rgba(var(--v-theme-export-user), 0.06);
  border: 1px solid rgba(var(--v-theme-export-user), 0.12);
}

.item-row {
  background: rgba(var(--v-theme-export-user), 0.03);
}

.renew-ring,
.success-ring,
.draft-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.renew-ring {
  background: rgba(var(--v-theme-export-user), 0.1);
  border: 2px solid rgba(var(--v-theme-export-user), 0.25);
}

.success-ring {
  background: rgba(var(--v-theme-success), 0.1);
  border: 2px solid rgba(var(--v-theme-success), 0.25);
}

.draft-ring {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border: 2px solid rgba(var(--v-theme-on-surface), 0.12);
}

.border-table {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.field-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.field-label-en {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
</style>
