<template>
  <div style="--v-theme-primary: var(--v-theme-doa-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-doa-user font-weight-medium">{{
            route.params.id ?? "EXP-0005"
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip :color="statusColor(application.status)" variant="tonal">
        <v-icon :icon="statusIcon(application.status)" size="13" class="mr-1" />
        {{ statusLabel(application.status) }}
      </v-chip>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-4 section-card">
      <v-card-text class="pa-4">
        <div class="d-flex align-center">
          <template v-for="(step, i) in timelineSteps" :key="step.value">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 72px"
            >
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon
                  v-if="application.currentStep > step.value"
                  icon="fas fa-check"
                  size="12"
                  color="white"
                />
                <span v-else class="text-caption font-weight-bold">{{
                  step.value + 1
                }}</span>
              </div>
              <div
                class="text-caption text-center"
                :class="
                  application.currentStep >= step.value
                    ? 'text-doa-user font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < timelineSteps.length - 1"
              class="step-line flex-grow-1"
              :class="{
                'step-line--done': application.currentStep > step.value,
              }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- 2-column layout -->
    <v-row>
      <!-- ── Left: data sections ── -->
      <v-col cols="12" md="8">
        <!-- ข้อมูลคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 border-b">
            <v-icon
              icon="fas fa-list-check"
              color="doa-user"
              size="15"
              class="mr-2"
            />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="6" md="4">
                <div class="info-label">เลขคำขอ</div>
                <div class="info-value text-doa-user font-weight-bold">
                  {{ application.requestNo }}
                </div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">ประเภทคำขอ</div>
                <div class="info-value">
                  <v-chip size="x-small" color="doa-user" variant="tonal">{{
                    application.requestType
                  }}</v-chip>
                </div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">วันที่ยื่นคำขอ</div>
                <div class="info-value">{{ application.submittedDate }}</div>
              </v-col>
              <v-col cols="12">
                <div class="info-label">ประเภททะเบียน</div>
                <div class="info-value">{{ application.typecert }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-user" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อ-นามสกุล / Full Name</div>
                <div class="info-value">{{ application.applicantNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่อยู่ / Address</div>
                <div class="info-value">{{ applicantAddress }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ application.applicantPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ application.applicantFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ application.applicantEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลสถานประกอบการ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-building" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลสถานประกอบการ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อสถานประกอบการ (ไทย)</div>
                <div class="info-value">{{ application.companyNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Company Name (English)</div>
                <div class="info-value">{{ application.companyNameEn }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                <div class="info-value">{{ companyAddressTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Address (English)</div>
                <div class="info-value">{{ companyAddressEn }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ application.companyPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ application.companyFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ application.companyEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ขอบข่ายประเทศ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-earth-asia" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ขอบข่ายประเทศ</span>
          </div>
          <v-card-text class="pa-4 pb-3">
            <div class="info-label mb-2">Scope of countries</div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="c in application.countries"
                :key="c"
                size="small"
                variant="tonal"
                color="doa-user"
                >{{ c }}</v-chip
              >
            </div>
          </v-card-text>
        </v-card>
        <!-- โรงงาน -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-industry" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลโรงงานผลิตสินค้าพืช</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th>เลขทะเบียน DOA</th>
                <th>ชื่อโรงงาน</th>
                <th>วันหมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="factory in application.factories" :key="factory.doaNo">
                <td class="text-body-2 font-weight-bold text-doa-user">
                  {{ factory.doaNo }}
                </td>
                <td class="text-body-2">{{ factory.factoryName }}</td>
                <td class="text-body-2">{{ factory.expiryDate }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <!-- GAP -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-seedling" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >แหล่งผลิตพืชที่ได้การรับรอง GAP</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th>เลขใบรับรอง GAP</th>
                <th>ชื่อแหล่งผลิต</th>
                <th>หน่วยงานรับรอง</th>
                <th>วันหมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gap in application.gaps" :key="gap.gapNo">
                <td class="text-body-2 font-weight-bold text-doa-user">
                  {{ gap.gapNo }}
                </td>
                <td class="text-body-2">{{ gap.siteName }}</td>
                <td class="text-body-2">{{ gap.certBody }}</td>
                <td class="text-body-2">{{ gap.expiryDate }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-paperclip" color="doa-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-card-text class="pa-4">
            <div
              v-for="doc in application.attachments"
              :key="doc.label"
              class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
            >
              <div class="text-body-2">{{ doc.label }}</div>
              <v-btn
                size="x-small"
                variant="tonal"
                color="doa-user"
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลด
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: activity timeline (sticky) ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="doa-user"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ความคืบหน้าคำขอ</span
              >
            </div>
            <v-card-text class="pa-4">
              <div class="activity-timeline">
                <div
                  v-for="(event, i) in application.activityLog"
                  :key="i"
                  class="activity-item"
                >
                  <div class="activity-dot-wrap">
                    <div
                      class="activity-dot"
                      :class="`activity-dot--${event.type}`"
                    >
                      <v-icon
                        :icon="eventIcon(event.type)"
                        size="11"
                        color="white"
                      />
                    </div>
                    <div
                      v-if="i < application.activityLog.length - 1"
                      class="activity-line"
                    />
                  </div>
                  <div class="activity-content pb-4">
                    <div class="d-flex align-center flex-wrap ga-1 mb-1">
                      <span class="text-body-2 font-weight-medium">{{
                        event.action
                      }}</span>
                      <v-chip
                        size="x-small"
                        :color="eventColor(event.type)"
                        variant="tonal"
                        >{{ eventLabel(event.type) }}</v-chip
                      >
                    </div>
                    <div
                      v-if="event.remark"
                      class="text-caption text-medium-emphasis mb-1"
                    >
                      {{ event.remark }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{
                        event.actor
                      }}
                    </div>
                    <div class="text-caption text-medium-emphasis mt-1">
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />{{
                        event.timestamp
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const application = {
  requestNo: "EXP-0005",
  requestType: "ขึ้นทะเบียน",
  submittedDate: "15/03/2569",
  typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนโรงงานผลิตสินค้าพืช",
  status: "pending",
  currentStep: 1,

  applicantNameTh: "นายสมชาย ใจดี",
  applicantHouseNo: "123",
  applicantMoo: "3",
  applicantAlley: "-",
  applicantRoad: "พหลโยธิน",
  applicantTambol: "ลาดยาว",
  applicantDistrict: "จตุจักร",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10900",
  applicantPhone: "02-123-4567",
  applicantFax: "-",
  applicantEmail: "somchai@example.com",

  companyNameTh: "บริษัท ไทย เอ็กซ์พอร์ต จำกัด",
  companyNameEn: "Thai Export Co., Ltd.",
  houseNo: "88/1",
  alley: "-",
  road: "สุขุมวิท",
  tambol: "บางปะกง",
  district: "บางปะกง",
  province: "ฉะเชิงเทรา",
  zipcode: "24130",
  houseNoEn: "88/1",
  alleyEn: "-",
  roadEn: "Sukhumvit",
  tambolEn: "Bang Pakong",
  districtEn: "Bang Pakong",
  provinceEn: "Chachoengsao",
  zipcodeEn: "24130",
  companyPhone: "038-123-456",
  companyFax: "038-123-457",
  companyEmail: "info@thaiexport.co.th",

  countries: ["สหภาพยุโรป", "ญี่ปุ่น", "สิงคโปร์"],

  factories: [
    {
      doaNo: "DOA-12345",
      factoryName: "โรงบรรจุสินค้าไทยเอ็กซ์พอร์ต 1",
      expiryDate: "01/01/2570",
    },
    {
      doaNo: "DOA-12346",
      factoryName: "โรงรมทรีทเม้นต์ไทยเอ็กซ์พอร์ต",
      expiryDate: "01/06/2570",
    },
  ],

  gaps: [
    {
      gapNo: "GAP-00123",
      siteName: "สวนมะม่วงไทยเอ็กซ์พอร์ต",
      certBody: "กรมวิชาการเกษตร (DOA)",
      expiryDate: "01/03/2570",
    },
    {
      gapNo: "GAP-00456",
      siteName: "สวนมะละกอไทยเอ็กซ์พอร์ต",
      certBody: "สำนักงานเกษตรจังหวัด",
      expiryDate: "15/06/2570",
    },
  ],

  attachments: [
    { label: "หนังสือรับรองบริษัท" },
    { label: "สำเนาบัตรประชาชนกรรมการ" },
    { label: "หนังสือสำคัญขึ้นทะเบียนโรงงาน (DOA)" },
    { label: "หนังสือรับรอง GAP" },
  ],

  activityLog: [
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "15/03/2569 09:12",
      remark: "",
    },
    {
      type: "receive",
      action: "รับคำขอเข้าสู่ระบบ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่รับเรื่อง)",
      timestamp: "15/03/2569 10:45",
      remark: "ตรวจสอบเอกสารเบื้องต้นครบถ้วน",
    },
    {
      type: "forward",
      action: "ส่งต่อเพื่อพิจารณา",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่รับเรื่อง)",
      timestamp: "16/03/2569 08:30",
      remark: "",
    },
    {
      type: "pending",
      action: "อยู่ระหว่างพิจารณา",
      actor: "นายประเสริฐ มีสุข (ผู้พิจารณา)",
      timestamp: "17/03/2569 13:00",
      remark: "",
    },
  ],
};

const applicantAddress = computed(() => {
  const a = application;
  return `${a.applicantHouseNo} หมู่ ${a.applicantMoo} ถ.${a.applicantRoad} ต.${a.applicantTambol} อ.${a.applicantDistrict} จ.${a.applicantProvince} ${a.applicantZipcode}`;
});

const companyAddressTh = computed(() => {
  const a = application;
  return `${a.houseNo} ถ.${a.road} ต.${a.tambol} อ.${a.district} จ.${a.province} ${a.zipcode}`;
});

const companyAddressEn = computed(() => {
  const a = application;
  return `${a.houseNoEn} ${a.roadEn} Rd., ${a.tambolEn}, ${a.districtEn}, ${a.provinceEn} ${a.zipcodeEn}`;
});

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "รอพิจารณา" },
  { value: 2, title: "ผลการพิจารณา" },
];

function stepClass(v) {
  if (application.currentStep > v) return "step-done";
  if (application.currentStep === v) return "step-active";
  return "step-pending";
}

function statusColor(s) {
  return (
    {
      draft: "grey",
      pending: "warning",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}

function statusIcon(s) {
  return (
    {
      draft: "fas fa-pen",
      pending: "fas fa-clock",
      approved: "fas fa-circle-check",
      rejected: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function statusLabel(s) {
  return (
    {
      draft: "แบบร่าง",
      pending: "รอพิจารณา",
      approved: "อนุมัติ",
      rejected: "ไม่อนุมัติ",
    }[s] ?? s
  );
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      forward: "fas fa-share",
      review: "fas fa-magnifying-glass",
      pending: "fas fa-clock",
      approve: "fas fa-circle-check",
      reject: "fas fa-circle-xmark",
      sendback: "fas fa-rotate-left",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "doa-user",
      receive: "info",
      forward: "doa-user",
      review: "warning",
      pending: "warning",
      approve: "success",
      reject: "error",
      sendback: "orange",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      receive: "รับเรื่อง",
      forward: "ส่งต่อ",
      review: "กำลังพิจารณา",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ส่งกลับ",
    }[type] ?? type
  );
}
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-doa-user));
  --step-color-tint: rgba(var(--v-theme-doa-user), 0.2);
}

.sticky-col {
  position: sticky;
  top: 80px;
}
.info-label {
  font-size: 0.72rem;
  color: rgba(var(--v-theme-on-surface), 0.55);
  margin-bottom: 2px;
}
.info-value {
  font-size: 0.875rem;
  margin-bottom: 8px;
}
.item-row {
  background: rgba(var(--v-theme-on-surface), 0.03);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}
.step-line {
  height: 2px;
  background: rgba(var(--v-theme-on-surface), 0.15);
  margin: 0 4px;
  margin-bottom: 20px;
}
.step-pending {
  background: rgba(var(--v-theme-on-surface), 0.12);
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.step-done,
.step-active {
  background: rgb(var(--v-theme-doa-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-doa-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-doa-user)) !important;
}

/* Activity timeline */
.activity-timeline {
  padding-left: 4px;
}
.activity-item {
  display: flex;
  gap: 16px;
}
.activity-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.activity-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}
.activity-dot--submit {
  background: rgb(var(--v-theme-doa-user));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-doa-user));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--pending {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--approve {
  background: rgb(var(--v-theme-success));
}
.activity-dot--reject {
  background: rgb(var(--v-theme-error));
}
.activity-dot--sendback {
  background: #fb8c00;
}

.activity-line {
  width: 2px;
  flex-grow: 1;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin-top: 4px;
  margin-bottom: 0;
  min-height: 20px;
}
.activity-content {
  flex: 1;
  min-width: 0;
}
</style>
