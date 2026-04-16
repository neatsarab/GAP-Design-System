<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-5">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div class="flex-grow-1">
        <h1 class="page-title mb-1">รายละเอียดทะเบียนประวัติ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          เลขทะเบียน:
          <span class="font-weight-bold text-hcex-staff">{{
            history.registrationNo
          }}</span>
        </p>
      </div>
      <v-btn
        variant="tonal"
        color="success"
        prepend-icon="fas fa-download"
        rounded="lg"
      >
        ดาวน์โหลดทะเบียน
      </v-btn>
    </div>

    <!-- Status banner -->
    <v-alert
      :color="statusColor(history.status)"
      variant="tonal"
      rounded="xl"
      class="mb-5"
      :prepend-icon="statusIcon(history.status)"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <div>
          <div class="text-body-2 font-weight-bold mb-1">
            สถานะทะเบียนประวัติ: {{ statusLabel(history.status) }}
          </div>
          <div class="text-body-2">
            เลขที่ทะเบียน: {{ history.registrationNo }} · ยื่นเมื่อ
            {{ history.submittedDate }}
          </div>
        </div>
        <v-chip
          :color="statusColor(history.status)"
          variant="flat"
          size="small"
        >
          {{ statusLabel(history.status) }}
        </v-chip>
      </div>
    </v-alert>

    <!-- 1. ข้อมูลผู้ยื่นคำขอ -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-user" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
      </div>
      <v-card-text class="pt-4">
        <div class="info-section-label mb-2">ข้อมูลส่วนตัว</div>
        <v-row dense>
          <v-col cols="12" sm="6" md="4">
            <div class="info-label">ชื่อ-นามสกุล</div>
            <div class="info-value">{{ history.applicant.contactName }}</div>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <div class="info-label">ตำแหน่ง</div>
            <div class="info-value">
              {{ history.applicant.contactPosition }}
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <div class="info-label">เลขบัตรประชาชน</div>
            <div class="info-value">{{ history.applicant.contactId }}</div>
          </v-col>
        </v-row>
        <div class="info-section-label mt-3 mb-2">ข้อมูลติดต่อ</div>
        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรศัพท์</div>
            <div class="info-value">{{ history.applicant.contactPhone }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรสาร</div>
            <div class="info-value">
              {{ history.applicant.contactFax || "-" }}
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">อีเมล</div>
            <div class="info-value">{{ history.applicant.contactEmail }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 2. ข้อมูลสถานประกอบการ -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-building" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold"
          >ข้อมูลสถานประกอบการ</span
        >
      </div>
      <v-card-text class="pt-4">
        <div class="info-section-label mb-2">ชื่อสถานประกอบการ</div>
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="info-label">ชื่อ (ภาษาไทย)</div>
            <div class="info-value">{{ history.company.companyNameTh }}</div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="info-label">ชื่อ (ภาษาอังกฤษ)</div>
            <div class="info-value">{{ history.company.companyNameEn }}</div>
          </v-col>
        </v-row>
        <div class="info-section-label mt-3 mb-2">ที่ตั้ง (ภาษาไทย)</div>
        <v-row dense>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">บ้านเลขที่</div>
            <div class="info-value">{{ history.company.houseNo }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">ซอย / ตรอก</div>
            <div class="info-value">{{ history.company.alley || "-" }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">ถนน</div>
            <div class="info-value">{{ history.company.road }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">ตำบล / แขวง</div>
            <div class="info-value">{{ history.company.tambol }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">อำเภอ / เขต</div>
            <div class="info-value">{{ history.company.district }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">จังหวัด</div>
            <div class="info-value">{{ history.company.province }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">รหัสไปรษณีย์</div>
            <div class="info-value">{{ history.company.zipcode }}</div>
          </v-col>
        </v-row>
        <div class="info-section-label mt-3 mb-2">ข้อมูลการติดต่อ</div>
        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรศัพท์</div>
            <div class="info-value">{{ history.company.phone }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรสาร</div>
            <div class="info-value">{{ history.company.fax || "-" }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">อีเมล</div>
            <div class="info-value">{{ history.company.email }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 3. หนังสือสำคัญ DOA -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-file-lines" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold">หนังสือสำคัญ DOA</span>
      </div>
      <v-card-text class="pt-4">
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="info-label">เลขที่ทะเบียน DOA</div>
            <div class="info-value font-weight-bold text-hcex-staff">
              {{ history.doa.regNo }}
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="info-label">วันที่หมดอายุ</div>
            <div class="info-value">{{ history.doa.expiryDate }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 4. ข้อมูลบริษัทผู้ผลิต -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-industry" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold"
          >ข้อมูลบริษัทผู้ผลิต</span
        >
      </div>
      <v-card-text class="pt-4">
        <div class="info-section-label mb-2">ชื่อบริษัทผู้ผลิต</div>
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="info-label">ชื่อ (ภาษาไทย)</div>
            <div class="info-value">{{ history.factory.nameTh }}</div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="info-label">ชื่อ (ภาษาอังกฤษ)</div>
            <div class="info-value">{{ history.factory.nameEn }}</div>
          </v-col>
        </v-row>
        <div class="info-section-label mt-3 mb-2">ที่ตั้ง (ภาษาไทย)</div>
        <v-row dense>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">บ้านเลขที่</div>
            <div class="info-value">{{ history.factory.houseNo }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">ซอย / ตรอก</div>
            <div class="info-value">{{ history.factory.alley || "-" }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">ถนน</div>
            <div class="info-value">{{ history.factory.road }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">ตำบล / แขวง</div>
            <div class="info-value">{{ history.factory.tambol }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">อำเภอ / เขต</div>
            <div class="info-value">{{ history.factory.district }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">จังหวัด</div>
            <div class="info-value">{{ history.factory.province }}</div>
          </v-col>
          <v-col cols="6" sm="4" md="2">
            <div class="info-label">รหัสไปรษณีย์</div>
            <div class="info-value">{{ history.factory.zipcode }}</div>
          </v-col>
        </v-row>
        <div class="info-section-label mt-3 mb-2">ข้อมูลการติดต่อ</div>
        <v-row dense>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรศัพท์</div>
            <div class="info-value">{{ history.factory.phone }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรสาร</div>
            <div class="info-value">{{ history.factory.fax || "-" }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">อีเมล</div>
            <div class="info-value">{{ history.factory.email }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 5. ข้อมูลตัวแทนผู้ประสานงานผลิต -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-user-tie" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold"
          >ข้อมูลตัวแทนผู้ประสานงานผลิต</span
        >
      </div>
      <v-card-text class="pt-4">
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="info-label">ชื่อ-นามสกุล</div>
            <div class="info-value">{{ history.producerContact.name }}</div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="info-label">ตำแหน่ง</div>
            <div class="info-value">
              {{ history.producerContact.position || "-" }}
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรศัพท์</div>
            <div class="info-value">{{ history.producerContact.phone }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">โทรสาร</div>
            <div class="info-value">
              {{ history.producerContact.fax || "-" }}
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">อีเมล</div>
            <div class="info-value">
              {{ history.producerContact.email || "-" }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 6. มาตรฐานการผลิต -->
    <v-card rounded="xl" elevation="0" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon icon="fas fa-award" color="hcex-staff" size="15" />
        <span class="text-subtitle-2 font-weight-bold">มาตรฐานการผลิต</span>
      </div>
      <v-card-text class="pt-4">
        <!-- GMP -->
        <div class="info-section-label mb-2">4.1 มาตรฐาน GMP</div>
        <v-row dense class="mb-3">
          <v-col cols="12" sm="4">
            <div class="info-label">หน่วยงานที่รับรอง</div>
            <div class="info-value">{{ history.standards.gmp.certBody }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">หมายเลขการรับรอง</div>
            <div class="info-value">{{ history.standards.gmp.certNo }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">วันที่หมดอายุ</div>
            <div class="info-value">{{ history.standards.gmp.expiry }}</div>
          </v-col>
        </v-row>
        <!-- HACCP -->
        <div class="info-section-label mb-2">4.2 มาตรฐาน HACCP</div>
        <v-row dense class="mb-3">
          <v-col cols="12" sm="4">
            <div class="info-label">หน่วยงานที่รับรอง</div>
            <div class="info-value">{{ history.standards.haccp.certBody }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">หมายเลขการรับรอง</div>
            <div class="info-value">{{ history.standards.haccp.certNo }}</div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="info-label">วันที่หมดอายุ</div>
            <div class="info-value">{{ history.standards.haccp.expiry }}</div>
          </v-col>
        </v-row>
        <!-- Extra standards -->
        <div class="info-section-label mb-2">4.3 มาตรฐานเพิ่มเติม</div>
        <template v-if="history.standards.extra.length > 0">
          <v-table density="compact" class="rounded-lg border">
            <thead>
              <tr>
                <th>ชื่อมาตรฐาน</th>
                <th>หน่วยงานที่รับรอง</th>
                <th>หมายเลขการรับรอง</th>
                <th>วันที่หมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="std in history.standards.extra" :key="std.certNo">
                <td>{{ std.name }}</td>
                <td>{{ std.certBody }}</td>
                <td>{{ std.certNo }}</td>
                <td>{{ std.expiry }}</td>
              </tr>
            </tbody>
          </v-table>
        </template>
        <p v-else class="text-body-2 text-medium-emphasis mb-0">
          ไม่มีมาตรฐานเพิ่มเติม
        </p>
      </v-card-text>
    </v-card>

    <!-- 7. รายละเอียดสินค้า -->
    <v-card rounded="xl" elevation="0">
      <div class="d-flex align-center justify-space-between px-4 py-3 border-b">
        <div class="d-flex align-center ga-2">
          <v-icon icon="fas fa-boxes-stacked" color="hcex-staff" size="15" />
          <span class="text-subtitle-2 font-weight-bold">รายละเอียดสินค้า</span>
          <v-chip size="x-small" color="hcex-staff" variant="tonal">
            {{ history.products.length }} รายการ
          </v-chip>
        </div>
      </div>
      <v-card-text class="pa-0">
        <v-table density="compact">
          <thead>
            <tr>
              <th style="width: 40px">#</th>
              <th>ชื่อผลิตภัณฑ์</th>
              <th>ประเทศปลายทาง</th>
              <th>มาตรฐานสินค้า</th>
              <th>รายการทดสอบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i) in history.products" :key="i">
              <td>
                <v-chip size="x-small" color="hcex-staff" variant="flat">
                  {{ i + 1 }}
                </v-chip>
              </td>
              <td class="font-weight-medium">{{ product.productName }}</td>
              <td>
                <div class="d-flex flex-wrap ga-1 py-1">
                  <v-chip
                    v-for="c in product.countries"
                    :key="c"
                    size="x-small"
                    variant="tonal"
                    color="hcex-staff"
                    >{{ c }}</v-chip
                  >
                  <span
                    v-if="!product.countries?.length"
                    class="text-medium-emphasis"
                    >-</span
                  >
                </div>
              </td>
              <td>
                <v-chip
                  size="x-small"
                  :color="product.standardType === 'doa' ? 'success' : 'grey'"
                  variant="tonal"
                  class="mb-1"
                >
                  {{
                    product.standardType === "doa"
                      ? "มาตรฐานที่กรมวิชาการเกษตรกำหนด"
                      : "มาตรฐานอื่นๆ"
                  }}
                </v-chip>
                <div
                  v-if="
                    product.standardType === 'other' &&
                    product.standards?.length
                  "
                  class="d-flex flex-wrap ga-1 mt-1"
                >
                  <v-chip
                    v-for="s in product.standards"
                    :key="s"
                    size="x-small"
                    variant="tonal"
                    color="grey"
                    >{{ s }}</v-chip
                  >
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap ga-1 py-1">
                  <v-chip
                    v-for="t in product.tests"
                    :key="t"
                    size="x-small"
                    variant="outlined"
                    color="hcex-staff"
                    >{{ t }}</v-chip
                  >
                  <span
                    v-if="!product.tests?.length"
                    class="text-medium-emphasis"
                    >-</span
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// mock data — จะดึงจาก API โดยใช้ route.params.id จริง
const history = {
  registrationNo: "HIST-2568-00001",
  submittedDate: "10 ม.ค. 2568",
  status: "approved",

  applicant: {
    contactName: "นายสมชาย ใจดี",
    contactPosition: "ผู้จัดการโรงงาน",
    contactId: "1-2345-67890-12-3",
    contactPhone: "02-123-4567",
    contactFax: "02-123-4568",
    contactEmail: "somchai.j@example.co.th",
  },

  company: {
    companyNameTh: "บริษัท ไทยเฟรช เอ็กซ์พอร์ต จำกัด",
    companyNameEn: "THAI FRESH EXPORT CO., LTD.",
    houseNo: "88",
    alley: "ซอยลาดพร้าว 101",
    road: "ถนนลาดพร้าว",
    tambol: "คลองจั่น",
    district: "บางกะปิ",
    province: "กรุงเทพมหานคร",
    zipcode: "10240",
    phone: "02-987-6543",
    fax: "",
    email: "info@thaifreshexport.co.th",
  },

  doa: {
    regNo: "DOA-2568-12345",
    expiryDate: "31/12/2570",
  },

  factory: {
    nameTh: "บริษัท สยามเฟรชฟู้ด จำกัด",
    nameEn: "SIAM FRESH FOOD CO., LTD.",
    houseNo: "88",
    alley: "ซอยลาดพร้าว 101",
    road: "ถนนลาดพร้าว",
    tambol: "คลองจั่น",
    district: "บางกะปิ",
    province: "กรุงเทพมหานคร",
    zipcode: "10240",
    phone: "02-000-0001",
    fax: "02-000-0002",
    email: "factory@siamfresh.com",
  },

  standards: {
    gmp: {
      certBody: "กรมวิชาการเกษตร",
      certNo: "GMP-2568-001",
      expiry: "31/12/2570",
    },
    haccp: {
      certBody: "กรมวิชาการเกษตร",
      certNo: "HACCP-2568-001",
      expiry: "31/12/2570",
    },
    extra: [
      {
        name: "BRC",
        certBody: "Bureau Veritas",
        certNo: "BRC-2568-009",
        expiry: "31/12/2569",
      },
    ],
  },

  producerContact: {
    name: "นางสาวมาลี รักษ์ดี",
    position: "ผู้ประสานงานฝ่ายผลิต",
    phone: "081-234-5678",
    fax: "",
    email: "malee.r@siamfresh.com",
  },

  products: [
    {
      productName: "มะม่วงแปรรูป",
      countries: ["JAPAN", "EU"],
      standardType: "doa",
      standards: [],
      tests: [
        "Sulfites",
        "Total Plate Count",
        "Total Mold Count",
        "Escherichia coli",
        "Staphylococcus aureus",
        "Salmonella spp.",
        "Clostridium perfringens",
        "Bacillus cereus",
      ],
    },
    {
      productName: "สับปะรดกระป๋อง",
      countries: ["USA", "CANADA"],
      standardType: "other",
      standards: ["BRC", "IFS"],
      tests: ["Total Plate Count", "Salmonella spp."],
    },
  ],
};

function statusColor(status) {
  const map = {
    draft: "grey",
    pending: "info",
    reviewing: "info",
    approved: "success",
    rejected: "error",
    need_edit: "warning",
  };
  return map[status] ?? "grey";
}

function statusIcon(status) {
  const map = {
    draft: "fas fa-pen",
    pending: "fas fa-hourglass-half",
    reviewing: "fas fa-magnifying-glass",
    approved: "fas fa-circle-check",
    rejected: "fas fa-circle-xmark",
    need_edit: "fas fa-triangle-exclamation",
  };
  return map[status] ?? "fas fa-circle-info";
}

function statusLabel(status) {
  const map = {
    draft: "แบบร่าง",
    pending: "รอตรวจสอบ",
    reviewing: "อยู่ระหว่างตรวจสอบ",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
    need_edit: "รอแก้ไข",
  };
  return map[status] ?? status;
}
</script>

<style scoped>
.info-label {
  font-size: 0.75rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 2px;
}
.info-value {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 12px;
}
.info-section-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
