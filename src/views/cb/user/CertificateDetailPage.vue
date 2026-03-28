<template>
  <div style="--v-theme-primary: var(--v-theme-cb-user)">
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
          <span class="text-cb-user font-weight-medium">{{
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
            <v-icon icon="fas fa-certificate" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบทะเบียน</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบทะเบียน / Certificate No.</div>
                <div class="info-value text-cb-user font-weight-bold">
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
            <v-icon icon="fas fa-user" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
            <v-chip size="x-small" color="cb-user" variant="tonal"
              >Auto-fill จาก SSO</v-chip
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
            <v-icon icon="fas fa-building" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลสถานประกอบการ</span
            >
            <v-chip size="x-small" color="cb-user" variant="tonal"
              >Auto-fill บางส่วนจาก DBD</v-chip
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

        <!-- ขอบข่ายมาตรฐานที่ขึ้นทะเบียน -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-list-check" color="cb-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ขอบข่ายมาตรฐานที่ขึ้นทะเบียน</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th>#</th>
                <th>ขอบข่ายมาตรฐาน</th>
                <th>เลขที่ใบรับรองมาตรฐาน</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(std, i) in cert.standards" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td class="text-body-2">{{ std.scope }}</td>
                <td class="text-body-2 font-weight-medium text-cb-user">
                  {{ std.certNo }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-paperclip" color="cb-user" size="15" />
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
                color="cb-user"
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลด
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: actions + activity log (sticky) ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลดใบทะเบียน -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4">
              <v-btn
                color="cb-user"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
                :disabled="cert.status === 'expired'"
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
                color="cb-user"
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
                    <v-btn
                      v-if="event.type !== 'submit'"
                      size="x-small"
                      variant="text"
                      color="cb-user"
                      class="mt-1 px-0"
                      @click="openActivityDetail(event)"
                    >
                      ดูรายละเอียด
                      <v-icon
                        icon="fas fa-chevron-right"
                        size="10"
                        class="ml-1"
                      />
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Activity Detail Dialog -->
    <v-dialog v-model="activityDetailDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-3 mb-4">
            <div
              class="activity-dot flex-shrink-0"
              :class="
                selectedEvent ? `activity-dot--${selectedEvent.type}` : ''
              "
              style="width: 36px; height: 36px"
            >
              <v-icon
                v-if="selectedEvent"
                :icon="eventIcon(selectedEvent.type)"
                size="14"
                color="white"
              />
            </div>
            <div>
              <div class="text-subtitle-2 font-weight-bold">
                {{ selectedEvent?.action }}
              </div>
              <v-chip
                v-if="selectedEvent"
                size="x-small"
                :color="eventColor(selectedEvent.type)"
                variant="tonal"
                class="mt-1"
              >
                {{ eventLabel(selectedEvent.type) }}
              </v-chip>
            </div>
          </div>
          <v-divider class="mb-4" />
          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผู้ดำเนินการ
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-user" size="12" class="mr-1" />
                {{ selectedEvent?.actor }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                วันที่ / เวลา
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-calendar" size="12" class="mr-1" />
                {{ selectedEvent?.timestamp }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผลการดำเนินการ
              </div>
              <v-chip
                size="small"
                :color="eventColor(selectedEvent?.type)"
                variant="tonal"
              >
                {{ eventLabel(selectedEvent?.type) }}
              </v-chip>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">หมายเหตุ</div>
              <div
                v-if="selectedEvent?.remark"
                class="text-body-2 pa-3 rounded-lg"
                style="background: rgba(var(--v-theme-on-surface), 0.05)"
              >
                {{ selectedEvent.remark }}
              </div>
              <div v-else class="text-body-2 text-medium-emphasis">-</div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 pt-0">
          <v-btn
            color="cb-user"
            variant="tonal"
            rounded="lg"
            block
            @click="activityDetailDialog = false"
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activityDetailDialog = ref(false);
const selectedEvent = ref(null);

watch(activityDetailDialog, (val) => {
  if (val) {
    const scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  } else {
    const scrollY = document.body.style.top;
    document.documentElement.style.overflow = "";
    document.documentElement.style.height = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }
});

function openActivityDetail(event) {
  selectedEvent.value = event;
  activityDetailDialog.value = true;
}

const cert = {
  certNo: "CB-2569-001",
  requestNo: "CB-0001",
  typecert: "คำขอขึ้นทะเบียนหน่วยรับรองมาตรฐานสินค้าเกษตร",
  issueDate: "15/01/2569",
  expireDate: "14/01/2572",
  status: "active",

  applicantNameTh: "นายวิชัย รับรองดี",
  applicantHouseNo: "999",
  applicantMoo: "-",
  applicantAlley: "-",
  applicantRoad: "เจริญนคร",
  applicantTambol: "คลองสาน",
  applicantDistrict: "คลองสาน",
  applicantProvince: "กรุงเทพมหานคร",
  applicantZipcode: "10600",
  applicantPhone: "02-345-6789",
  applicantFax: "-",
  applicantEmail: "wichai@cbcert.co.th",

  companyNameTh: "บริษัท ไทยเซิร์ทแล็บ จำกัด",
  companyNameEn: "Thai CertLab Co., Ltd.",
  houseNo: "999",
  alley: "-",
  road: "เจริญนคร",
  tambol: "คลองสาน",
  district: "คลองสาน",
  province: "กรุงเทพมหานคร",
  zipcode: "10600",
  houseNoEn: "999",
  alleyEn: "-",
  roadEn: "Charoen Nakhon",
  tambolEn: "Khlong San",
  districtEn: "Khlong San",
  provinceEn: "Bangkok",
  zipcodeEn: "10600",
  companyPhone: "02-345-6789",
  companyFax: "02-345-6790",
  companyEmail: "info@thaicertlab.co.th",

  standards: [
    { scope: "มกษ. 9001-2564 การปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร", certNo: "NAC-2024-0001" },
    { scope: "มกษ. 9000-2564 เกษตรอินทรีย์ เล่ม 1 การผลิต แปรรูป แสดงฉลาก และจำหน่ายผลิตผลและผลิตภัณฑ์เกษตรอินทรีย์", certNo: "NAC-2024-0002" },
    { scope: "มกษ. 4403-2554 การปฏิบัติทางการเกษตรที่ดีสำหรับข้าว", certNo: "NAC-2024-0003" },
  ],

  attachments: [
    { label: "แผนที่ตั้งสำนักงานใหญ่และสำนักงานสาขาในประเทศไทยที่ขอการรับรองโดยละเอียด" },
    { label: "ใบรับรองระบบงาน (Accreditation Certificate) จากสำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)" },
    { label: "สำเนาหลักฐานการอนุญาตเป็นผู้ประกอบการตรวจสอบมาตรฐาน" },
    { label: "ทะเบียนรายชื่อผู้ตรวจประเมินของหน่วยรับรองโรงงานผลิตสินค้าพืช พร้อมประวัติการตรวจประเมินโรงงานผลิตสินค้าพืช" },
    { label: "ที่อยู่และรายชื่อสาขาที่อยู่ในประเทศไทย" },
  ],

  activityLog: [
    {
      type: "issue",
      action: "ออกใบทะเบียน",
      actor: "ระบบ",
      timestamp: "15/01/2569 10:00",
      remark: "เลขทะเบียน CB-2569-001",
    },
    {
      type: "forward",
      action: "ผ่านการลงนาม",
      actor: "นายศักดิ์ศรี นาดี (ผู้ลงนาม)",
      timestamp: "14/01/2569 15:30",
      remark: "",
    },
    {
      type: "forward",
      action: "ผ่านการพิจารณา",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "12/01/2569 14:00",
      remark: "",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจสอบ",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "18/01/2569 11:00",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายวิชัย รับรองดี (ผู้ยื่นคำขอ)",
      timestamp: "15/01/2569 09:12",
      remark: "",
    },
  ],
};

const applicantAddress = computed(() => {
  const a = cert;
  return `${a.applicantHouseNo} ถ.${a.applicantRoad} ต.${a.applicantTambol} อ.${a.applicantDistrict} จ.${a.applicantProvince} ${a.applicantZipcode}`;
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
      submit: "cb-user",
      receive: "info",
      forward: "success",
      review: "warning",
      pending: "info",
      approve: "success",
      reject: "error",
      sendback: "warning",
      issue: "cb-user",
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
  background: rgb(var(--v-theme-cb-user));
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
  animation: pulse-pending 1.6s ease-in-out infinite;
}
@keyframes pulse-pending {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-info), 0);
  }
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
  background: rgb(var(--v-theme-cb-user));
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
