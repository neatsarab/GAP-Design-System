<template>
  <div style="--v-theme-primary: var(--v-theme-gap-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <div class="d-flex align-center ga-2 mb-1">
          <v-chip
            size="x-small"
            color="gap-user"
            variant="tonal"
            prepend-icon="fas fa-file-pen"
            >แก้ไข / ยกเลิก</v-chip
          >
        </div>
        <h1 class="page-title mb-0">
          ใบคำขอแก้ไขและยกเลิกใบรับรอง GAP พืช
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          สำหรับแก้ไขข้อมูลหรือยกเลิกใบรับรองที่ออกแล้ว
        </p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card class="mb-5">
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
                  step.value
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  currentStep >= step.value
                    ? 'text-gap-user font-weight-bold'
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

    <v-window v-model="currentStep">
      <!-- Step 1: ระบุใบรับรองที่ต้องการแก้ไข/ยกเลิก -->
      <v-window-item :value="1">
        <v-card elevation="0" border rounded="xl" class="mb-4">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-certificate</v-icon>
            <span class="text-subtitle-2">ระบุใบรับรองที่ต้องการดำเนินการ</span>
          </div>
          <v-card-text class="pt-5">
            <div class="field-section-label mb-3">เลขที่ใบรับรอง</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เลขที่ใบรับรอง GAP <span class="req">*</span>
                  <div class="field-label-en">GAP Certificate No.</div>
                </div>
                <v-text-field
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  v-model="form.certNo"
                  placeholder="เช่น GAP-C-2567-0089"
                  prepend-inner-icon="fas fa-certificate"
                  :rules="[rules.required]"
                  hide-details="auto"
                />
              </v-col>
              <!-- <v-col cols="12" sm="6">
                <div class="field-label">เลขที่คำขอเดิม <span class="req">*</span></div>
                <v-text-field v-model="form.originalAppNo" placeholder="เช่น GAP-2567-001"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  prepend-inner-icon="fas fa-file-lines" :rules="[rules.required]" hide-details="auto" />
              </v-col> -->

              <v-col cols="12">
                <v-divider class="my-2" />
                <div class="field-section-label mt-3 mb-2">ประเภทคำขอ</div>
              </v-col>
              <v-col cols="12">
                <v-radio-group
                  v-model="form.requestType"
                  color="gap-user"
                  inline
                  :rules="[rules.required]"
                  hide-details="auto"
                >
                  <v-radio value="amend" class="mr-6">
                    <template #label>
                      <div>
                        <div class="text-body-2 font-weight-medium">
                          ขอแก้ไขใบรับรอง
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          แก้ไขข้อมูล เช่น ชื่อ-สกุล, พื้นที่, ชนิดพืช
                        </div>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="cancel">
                    <template #label>
                      <div>
                        <div class="text-body-2 font-weight-medium">
                          ขอยกเลิกใบรับรอง
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          ยกเลิกใบรับรองก่อนวันหมดอายุ
                        </div>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-col>

              <!-- ข้อมูลผู้ยื่น -->
              <!-- <v-col cols="12" class="mt-2"><v-divider /><div class="text-caption text-medium-emphasis mt-3 mb-2">ข้อมูลผู้ยื่นคำขอ</div></v-col>
              <v-col cols="12" sm="2">
                <div class="field-label">คำนำหน้า</div>
                <v-autocomplete v-model="form.namePrefix" :items="['นาย','นาง','นางสาว']" hide-details="auto" />
                  variant="outlined"
                  density="compact"
                  rounded="lg"
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">ชื่อ <span class="req">*</span></div>
                <v-text-field v-model="form.firstName" :rules="[rules.required]" hide-details="auto" />
                  variant="outlined"
                  density="compact"
                  rounded="lg"
              </v-col>
              <v-col cols="12" sm="5">
                <div class="field-label">นามสกุล <span class="req">*</span></div>
                <v-text-field v-model="form.lastName" :rules="[rules.required]" hide-details="auto" />
                  variant="outlined"
                  density="compact"
                  rounded="lg"
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เลขบัตรประชาชน <span class="req">*</span></div>
                <v-text-field v-model="form.idCard" placeholder="X-XXXX-XXXXX-XX-X"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  prepend-inner-icon="fas fa-id-card" :rules="[rules.required, rules.idCard]"
                  maxlength="13" counter hint="13 หลัก" persistent-hint />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">เบอร์โทรศัพท์ <span class="req">*</span></div>
                <v-text-field v-model="form.phone" prepend-inner-icon="fas fa-phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  :rules="[rules.required, rules.phone]" hide-details="auto" />
              </v-col> -->
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 2: รายละเอียดการแก้ไข / เหตุผลการยกเลิก -->
      <v-window-item :value="2">
        <!-- แก้ไข -->
        <template v-if="form.requestType === 'amend'">
          <v-card elevation="0" border rounded="xl" class="mb-4">
            <div class="section-header border-b">
              <v-icon size="15" color="gap-user">fas fa-pencil</v-icon>
              <span class="text-subtitle-2">รายละเอียดที่ต้องการแก้ไข</span>
            </div>
            <v-card-text class="pt-5">
              <v-row dense>
                <v-col cols="12">
                  <div class="field-label">
                    รายการที่ต้องการแก้ไข <span class="req">*</span>
                    <div class="field-label-en">Items to Amend</div>
                  </div>
                  <div class="amend-list">
                    <div
                      v-for="item in amendItems"
                      :key="item.value"
                      class="amend-item"
                      :class="{
                        'amend-item--active': form.amendFields.includes(
                          item.value,
                        ),
                      }"
                    >
                      <v-checkbox
                        v-model="form.amendFields"
                        :value="item.value"
                        :label="item.label"
                        color="gap-user"
                        density="compact"
                        hide-details
                      />
                      <v-expand-transition>
                        <div
                          v-if="form.amendFields.includes(item.value)"
                          class="amend-detail-field"
                        >
                          <div class="field-label mb-1">
                            {{ item.detailLabel }} <span class="req">*</span>
                            <span class="field-label-en">{{
                              item.detailLabelEn
                            }}</span>
                          </div>
                          <v-textarea
                            v-if="item.inputType === 'textarea'"
                            v-model="form.amendDetails[item.value]"
                            :placeholder="item.placeholder"
                            rows="2"
                            auto-grow
                            variant="outlined"
                            density="compact"
                            rounded="lg"
                            hide-details="auto"
                          />
                          <v-text-field
                            v-else
                            v-model="form.amendDetails[item.value]"
                            :placeholder="item.placeholder"
                            variant="outlined"
                            density="compact"
                            rounded="lg"
                            hide-details="auto"
                          />
                        </div>
                      </v-expand-transition>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>

        <!-- ยกเลิก -->
        <template v-else>
          <v-card elevation="0" border rounded="xl" class="mb-4">
            <div class="section-header border-b">
              <v-icon size="15" color="error">fas fa-ban</v-icon>
              <span class="text-subtitle-2">เหตุผลการยกเลิกใบรับรอง</span>
            </div>
            <v-card-text class="pt-5">
              <v-row dense>
                <v-col cols="12">
                  <div class="field-label">
                    สาเหตุการยกเลิก <span class="req">*</span>
                    <div class="field-label-en">Cancellation Reason</div>
                  </div>
                  <v-autocomplete
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="form.cancelReason"
                    :items="cancelReasons"
                    item-title="label"
                    item-value="value"
                    prepend-inner-icon="fas fa-circle-question"
                    :rules="[rules.required]"
                    hide-details="auto"
                  />
                </v-col>
                <v-col cols="12" class="mt-2">
                  <div class="field-label">
                    รายละเอียดเพิ่มเติม
                    <div></div>
                    <div class="field-label-en">Additional Details</div>
                  </div>
                  <v-textarea
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    v-model="form.cancelDetail"
                    placeholder="อธิบายเหตุผลการยกเลิกเพิ่มเติม (ถ้ามี)"
                    rows="3"
                    auto-grow
                    hide-details="auto"
                  />
                </v-col>

                <v-col cols="12" class="mt-2">
                  <v-alert
                    type="error"
                    variant="tonal"
                    prepend-icon="fas fa-triangle-exclamation"
                  >
                    <strong>คำเตือน:</strong>
                    การยกเลิกใบรับรองจะมีผลทันทีและไม่สามารถย้อนกลับได้
                    หากต้องการขอรับรองใหม่ จะต้องยื่นคำขอใหม่ทั้งหมด
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-window-item>

      <!-- Step 3: เอกสาร -->
      <v-window-item :value="3">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="gap-user">fas fa-paperclip</v-icon>
            <span class="text-subtitle-2">เอกสารประกอบคำขอ</span>
            <v-spacer />
            <v-chip size="x-small" variant="tonal" color="gap-user"
              >ไม่เกินไฟล์ละ 10 MB</v-chip
            >
          </div>
          <v-card-text class="pt-5">
            <div class="field-section-label mb-3">เอกสารแนบ</div>
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  สำเนาใบรับรอง GAP เดิม <span class="req">*</span>
                  <span class="field-label-en"
                    >Copy of Previous GAP Certificate</span
                  >
                </div>
                <v-file-input
                  v-model="form.certCopy"
                  accept=".pdf"
                  show-size
                  chips
                  hint="ไฟล์ PDF ของใบรับรองเดิม"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เอกสารประกอบ (ถ้ามี)
                  <span class="field-label-en"
                    >Supporting Documents (if any)</span
                  >
                </div>
                <v-file-input
                  v-model="form.docs"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  multiple
                  show-size
                  chips
                  hint="เอกสารสนับสนุนคำขอ"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-window-item>

      <!-- Step 4: ตรวจสอบ -->
      <v-window-item :value="4">
        <v-card elevation="0" border rounded="xl">
          <div class="section-header border-b">
            <v-icon size="15" color="success">fas fa-clipboard-check</v-icon>
            <span class="text-subtitle-2">ตรวจสอบคำขอก่อนยื่น</span>
          </div>
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="เลขที่ใบรับรองเดิม"
                    ><v-list-item-title
                      class="text-gap-user font-weight-bold"
                      >{{ form.certNo || "-" }}</v-list-item-title
                    ></v-list-item
                  >
                  <!-- <v-list-item subtitle="เลขที่คำขอเดิม"><v-list-item-title>{{ form.originalAppNo || '-' }}</v-list-item-title></v-list-item> -->
                  <v-list-item subtitle="ประเภทคำขอ">
                    <v-list-item-title>
                      <v-chip
                        size="small"
                        :color="
                          form.requestType === 'amend' ? 'gap-user' : 'error'
                        "
                        variant="tonal"
                      >
                        {{
                          form.requestType === "amend"
                            ? "ขอแก้ไขใบรับรอง"
                            : "ขอยกเลิกใบรับรอง"
                        }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6">
                <v-list density="compact" lines="two">
                  <v-list-item subtitle="ผู้ยื่น"
                    ><v-list-item-title
                      >{{ form.namePrefix }} {{ form.firstName }}
                      {{ form.lastName }}</v-list-item-title
                    ></v-list-item
                  >
                  <v-list-item
                    v-if="form.requestType === 'amend'"
                    subtitle="รายการแก้ไข"
                  >
                    <v-list-item-title>{{
                      form.amendFields.join(", ") || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-else subtitle="สาเหตุยกเลิก">
                    <v-list-item-title>{{
                      form.cancelReason || "-"
                    }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
            <v-alert
              :type="form.requestType === 'amend' ? 'info' : 'error'"
              variant="tonal"
              class="mt-4"
              prepend-icon="fas fa-triangle-exclamation"
            >
              <span v-if="form.requestType === 'amend'">
                การแก้ไขใบรับรองจะต้องผ่านการตรวจสอบของเจ้าหน้าที่อีกครั้ง
              </span>
              <span v-else>
                <strong>ยืนยันการยกเลิก</strong> —
                ใบรับรองจะถูกยกเลิกทันทีหลังเจ้าหน้าที่อนุมัติ
              </span>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Nav buttons -->
    <div class="d-flex align-center ga-3 mt-5">
      <v-btn
        v-if="currentStep > 1"
        variant="outlined"
        color="grey-darken-1"
        prepend-icon="fas fa-arrow-left"
        @click="currentStep--"
        >ย้อนกลับ</v-btn
      >
      <v-spacer />
      <v-btn
        v-if="currentStep < steps.length"
        color="gap-user"
        append-icon="fas fa-arrow-right"
        @click="currentStep++"
        >ถัดไป</v-btn
      >
      <v-btn
        v-else
        :color="form.requestType === 'cancel' ? 'error' : 'gap-user'"
        prepend-icon="fas fa-paper-plane"
        size="large"
        @click="successDialog = true"
      >
        {{
          form.requestType === "cancel"
            ? "ยืนยันยกเลิกใบรับรอง"
            : "ยื่นคำขอแก้ไข"
        }}
      </v-btn>
    </div>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="440" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <v-icon
            :icon="
              form.requestType === 'cancel'
                ? 'fas fa-ban'
                : 'fas fa-circle-check'
            "
            :color="form.requestType === 'cancel' ? 'error' : 'success'"
            size="64"
            class="mb-4"
          />
          <h2 class="text-h6 font-weight-bold mb-2">
            {{
              form.requestType === "cancel"
                ? "ยื่นคำขอยกเลิกสำเร็จ"
                : "ยื่นคำขอแก้ไขสำเร็จ"
            }}
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-5">
            เลขที่คำขอ: <strong class="text-gap-user">GAP-AMD-2567-001</strong
            ><br />
            อ้างอิงใบรับรอง: <strong>{{ form.certNo }}</strong
            ><br />
            เจ้าหน้าที่จะดำเนินการภายใน 3–7 วันทำการ
          </p>
          <v-btn
            color="gap-user"
            block
            @click="router.push('/gap/user/applications')"
            >ดูรายการคำขอ</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(1);
const successDialog = ref(false);

const steps = [
  { value: 1, title: "ระบุใบรับรอง" },
  { value: 2, title: "รายละเอียด" },
  { value: 3, title: "เอกสารแนบ" },
  { value: 4, title: "ตรวจสอบ & ยื่น" },
];

function stepClass(v: number) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

const amendItems = [
  {
    value: "name",
    label: "ชื่อ-นามสกุล",
    detailLabel: "ชื่อ-นามสกุลใหม่",
    detailLabelEn: "New Full Name",
    inputType: "text",
    placeholder: "ชื่อ-นามสกุลที่ถูกต้อง",
  },
  {
    value: "idcard",
    label: "เลขบัตรประชาชน",
    detailLabel: "เลขบัตรประชาชนใหม่",
    detailLabelEn: "New National ID No.",
    inputType: "text",
    placeholder: "X-XXXX-XXXXX-XX-X",
  },
  {
    value: "address",
    label: "ที่อยู่",
    detailLabel: "ที่อยู่ใหม่",
    detailLabelEn: "New Address",
    inputType: "textarea",
    placeholder: "บ้านเลขที่ / หมู่ / ตำบล / อำเภอ / จังหวัด",
  },
  {
    value: "area",
    label: "พื้นที่แปลงปลูก",
    detailLabel: "พื้นที่ใหม่ (ไร่)",
    detailLabelEn: "New Plot Area (Rai)",
    inputType: "text",
    placeholder: "เช่น 3.5",
  },
  {
    value: "crop",
    label: "ชนิดพืช",
    detailLabel: "ชนิดพืชใหม่",
    detailLabelEn: "New Crop Type",
    inputType: "text",
    placeholder: "เช่น มะเขือเทศ, ข้าวโพด",
  },
  {
    value: "location",
    label: "ที่ตั้งแปลง (ตำบล/อำเภอ/จังหวัด)",
    detailLabel: "ที่ตั้งแปลงใหม่",
    detailLabelEn: "New Plot Location",
    inputType: "textarea",
    placeholder: "ตำบล / อำเภอ / จังหวัด ที่ถูกต้อง",
  },
  {
    value: "other",
    label: "อื่นๆ (ระบุในรายละเอียด)",
    detailLabel: "รายละเอียดที่ต้องการแก้ไข",
    detailLabelEn: "Other Amendment Details",
    inputType: "textarea",
    placeholder: "อธิบายรายละเอียดที่ต้องการแก้ไข",
  },
];

const cancelReasons = [
  { value: "stop_farming", label: "เลิกประกอบอาชีพเกษตรกรรม" },
  { value: "land_sold", label: "ขายหรือโอนที่ดิน" },
  { value: "natural_disaster", label: "ภัยธรรมชาติ / เหตุสุดวิสัย" },
  { value: "disease", label: "โรคพืชระบาดในพื้นที่" },
  { value: "change_crop", label: "เปลี่ยนชนิดพืชหลัก" },
  { value: "other", label: "อื่นๆ" },
];

const form = ref({
  certNo: "",
  originalAppNo: "",
  requestType: "amend" as "amend" | "cancel",
  namePrefix: "นาย",
  firstName: "",
  lastName: "",
  idCard: "",
  phone: "",
  amendFields: [] as string[],
  amendDetails: {} as Record<string, string>,
  cancelReason: null as string | null,
  cancelDetail: "",
  certCopy: null as File | null,
  docs: [] as File[],
});

const rules = {
  required: (v: string) => !!v || "กรุณากรอกข้อมูล",
  idCard: (v: string) => /^\d{13}$/.test(v) || "เลขบัตรประชาชน 13 หลัก",
  phone: (v: string) => /^0\d{8,9}$/.test(v) || "รูปแบบเบอร์โทรไม่ถูกต้อง",
};
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-gap-user));
  --step-color-tint: rgba(var(--v-theme-gap-user), 0.2);
}

/* Amendment item list */
.amend-list {
  /* border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); */
  /* border-radius: 12px; */
  overflow: hidden;
}
.amend-item {
  /* border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); */
  padding: 4px 12px 8px 12px;
  transition: background 0.15s;
}
.amend-item:last-child {
  border-bottom: none;
}
.amend-item--active {
  background: rgba(var(--v-theme-gap-user), 0.04);
}
.amend-detail-field {
  padding: 8px 4px 4px 32px;
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-gap-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-gap-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-gap-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-gap-user)) !important;
}
</style>
