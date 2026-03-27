<template>
  <div style="--v-theme-primary: var(--v-theme-export-staff)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดใบทะเบียน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขทะเบียน:
          <span class="text-export-staff font-weight-medium">{{
            route.params.id ?? cert.certNo
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip :color="certStatusColor(cert.status)" variant="tonal">
        <v-icon :icon="certStatusIcon(cert.status)" size="13" class="mr-1" />
        {{ certStatusLabel(cert.status) }}
      </v-chip>
    </div>

    <v-row>
      <!-- ── Left: data sections ── -->
      <v-col cols="12" md="8">
        <!-- สถานะใบทะเบียน -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-certificate" color="export-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบทะเบียน</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบทะเบียน / Certificate No.</div>
                <div class="info-value text-export-staff font-weight-bold">
                  {{ cert.certNo }}
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">เลขคำขออ้างอิง / Request No.</div>
                <div class="info-value">{{ cert.requestNo }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">สถานะ / Status</div>
                <div class="info-value">
                  <v-chip
                    :color="certStatusColor(cert.status)"
                    size="small"
                    variant="tonal"
                    :prepend-icon="certStatusIcon(cert.status)"
                  >
                    {{ certStatusLabel(cert.status) }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="info-label">ประเภททะเบียน / Certificate Type</div>
                <div class="info-value">{{ cert.typecert }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">วันที่ออกใบทะเบียน / Issue Date</div>
                <div class="info-value">{{ cert.issueDate }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">วันหมดอายุ / Expire Date</div>
                <div
                  class="info-value"
                  :class="
                    cert.status === 'expiring'
                      ? 'text-warning font-weight-medium'
                      : cert.status === 'expired'
                        ? 'text-error'
                        : ''
                  "
                >
                  {{ cert.expireDate }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-user" color="export-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อ-นามสกุล / Full Name</div>
                <div class="info-value">{{ cert.applicantNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่อยู่ / Address</div>
                <div class="info-value">{{ applicantAddress }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ cert.applicantPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ cert.applicantFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ cert.applicantEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลสถานประกอบการ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-building" color="export-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลสถานประกอบการ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อสถานประกอบการ (ไทย)</div>
                <div class="info-value">{{ cert.companyNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Company Name (English)</div>
                <div class="info-value">{{ cert.companyNameEn }}</div>
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
                <div class="info-value">{{ cert.companyPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ cert.companyFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ cert.companyEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ขอบข่ายประเทศ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-earth-asia" color="export-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ขอบข่ายประเทศ</span>
          </div>
          <v-card-text class="pa-4 pb-3">
            <div class="info-label mb-2">Scope of countries</div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="c in cert.countries"
                :key="c"
                size="small"
                variant="tonal"
                color="export-staff"
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
            <v-icon icon="fas fa-industry" color="export-staff" size="15" />
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
              <tr v-for="factory in cert.factories" :key="factory.doaNo">
                <td class="text-body-2 font-weight-bold text-export-staff">
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
            <v-icon icon="fas fa-seedling" color="export-staff" size="15" />
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
              <tr v-for="gap in cert.gaps" :key="gap.gapNo">
                <td class="text-body-2 font-weight-bold text-export-staff">
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
            <v-icon icon="fas fa-paperclip" color="export-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-card-text class="pa-4">
            <div
              v-for="doc in cert.attachments"
              :key="doc.label"
              class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
            >
              <div class="text-body-2">{{ doc.label }}</div>
              <v-btn
                size="x-small"
                variant="tonal"
                color="export-staff"
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลด
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: actions + activity log ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลดใบทะเบียน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4">
              <v-btn
                color="export-staff"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลดใบทะเบียน (PDF)
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- ประวัติใบทะเบียน -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="export-staff"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ประวัติใบทะเบียน</span
              >
            </div>
            <v-card-text
              class="pa-4"
              style="max-height: 420px; overflow-y: auto"
            >
              <div class="activity-timeline">
                <div
                  v-for="(event, i) in cert.activityLog"
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
                      v-if="i < cert.activityLog.length - 1"
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

const cert = {
  certNo: "EXP-2569-005",
  requestNo: "EXP-0005",
  typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนเป็นผู้ส่งออกผักและผลไม้",
  issueDate: "15/03/2569",
  expireDate: "14/03/2571",
  status: "active",

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
      type: "issue",
      action: "ออกใบทะเบียน",
      actor: "ระบบ",
      timestamp: "08/01/2569 11:23",
      remark: "เลขทะเบียน EXP-2569-005",
    },
    {
      type: "forward",
      action: "ผ่านการลงนาม",
      actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
      timestamp: "08/01/2569 11:23",
    },
    {
      type: "forward",
      action: "ผ่านการพิจารณา",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "06/01/2569 14:20",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจสอบ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "05/01/2569 11:00",
    },
    {
      type: "sendback",
      action: "ส่งกลับแก้ไข",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "03/01/2569 10:30",
      remark:
        "เอกสารสำเนาหนังสือรับรองนิติบุคคลไม่ครบถ้วน กรุณาแนบเอกสารฉบับที่ออกโดยกรมพัฒนาธุรกิจการค้าซึ่งออกไม่เกิน 3 เดือน และแก้ไขพิกัดที่ตั้งโรงงานให้ถูกต้องตามทะเบียนโรงงาน",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
      timestamp: "01/01/2569 09:12",
      remark: "",
    },
  ],
};

const applicantAddress = computed(() => {
  const a = cert;
  return `${a.applicantHouseNo} หมู่ ${a.applicantMoo} ถ.${a.applicantRoad} ต.${a.applicantTambol} อ.${a.applicantDistrict} จ.${a.applicantProvince} ${a.applicantZipcode}`;
});

const companyAddressTh = computed(() => {
  const a = cert;
  return `${a.houseNo} ถ.${a.road} ต.${a.tambol} อ.${a.district} จ.${a.province} ${a.zipcode}`;
});

const companyAddressEn = computed(() => {
  const a = cert;
  return `${a.houseNoEn} ${a.roadEn} Rd., ${a.tambolEn}, ${a.districtEn}, ${a.provinceEn} ${a.zipcodeEn}`;
});

function certStatusColor(s) {
  return (
    { active: "success", expiring: "warning", expired: "error" }[s] ?? "grey"
  );
}

function certStatusIcon(s) {
  return (
    {
      active: "fas fa-circle-check",
      expiring: "fas fa-clock",
      expired: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}

function certStatusLabel(s) {
  return (
    { active: "มีผล", expiring: "ใกล้หมดอายุ", expired: "หมดอายุ" }[s] ?? s
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
      issue: "fas fa-certificate",
      renew: "fas fa-rotate",
      revoke: "fas fa-ban",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "export-staff",
      receive: "info",
      forward: "success",
      review: "warning",
      pending: "info",
      approve: "success",
      reject: "error",
      sendback: "warning",
      issue: "export-staff",
      renew: "info",
      revoke: "error",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      receive: "รับเรื่อง",
      forward: "ผ่าน",
      review: "กำลังพิจารณา",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
      issue: "ออกใบทะเบียน",
      renew: "ต่ออายุ",
      revoke: "เพิกถอน",
    }[type] ?? type
  );
}
</script>

<style scoped>
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
  background: rgb(var(--v-theme-export-staff));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-success));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--pending {
  background: rgb(var(--v-theme-info));
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
.activity-dot--issue {
  background: rgb(var(--v-theme-export-staff));
}
.activity-dot--renew {
  background: rgb(var(--v-theme-info));
}
.activity-dot--revoke {
  background: rgb(var(--v-theme-error));
}
.activity-line {
  width: 2px;
  flex-grow: 1;
  background: rgba(var(--v-theme-on-surface), 0.12);
  margin-top: 4px;
  min-height: 20px;
}
.activity-content {
  flex: 1;
  min-width: 0;
}
</style>
