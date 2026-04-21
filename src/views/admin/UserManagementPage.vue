<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="page-title mb-1">User Management</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          จัดการบทบาทสำหรับเจ้าหน้าที่
        </p>
      </div>
      <v-btn
        color="admin"
        rounded="lg"
        prepend-icon="fas fa-user-plus"
        @click="openAdd"
      >
        เพิ่มเจ้าหน้าที่
      </v-btn>
    </div>

    <!-- Stats -->
    <div class="d-flex ga-3 flex-wrap mb-5">
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">คำขอทั้งหมด</div>
        <div class="text-h6 font-weight-bold">{{ requests.length }}</div>
      </v-card>
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">รอดำเนินการ</div>
        <div class="text-h6 font-weight-bold text-warning">
          {{ requests.filter((r) => r.status === "pending").length }}
        </div>
      </v-card>
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">อนุมัติแล้ว</div>
        <div class="text-h6 font-weight-bold text-success">
          {{ requests.filter((r) => r.status === "approved").length }}
        </div>
      </v-card>
      <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
        <div class="text-caption text-medium-emphasis mb-1">ปฏิเสธ</div>
        <div class="text-h6 font-weight-bold text-error">
          {{ requests.filter((r) => r.status === "rejected").length }}
        </div>
      </v-card>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="admin" class="mb-4">
      <v-tab value="pending">
        รอดำเนินการ
        <v-chip
          v-if="pendingCount > 0"
          size="x-small"
          color="warning"
          variant="flat"
          class="ml-2"
          >{{ pendingCount }}</v-chip
        >
      </v-tab>
      <v-tab value="history">ประวัติ</v-tab>
    </v-tabs>

    <!-- Filters -->
    <v-card rounded="xl" elevation="0" class="pa-4 mb-4">
      <v-row dense align="end">
        <v-col cols="12" sm="5">
          <div class="filter-label">
            <div>ค้นหา</div>
            <div class="filter-label-en">Search</div>
          </div>
          <v-text-field
            v-model="search"
            placeholder="ชื่อ / อีเมล / เลขบัตรประชาชน"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            prepend-inner-icon="fas fa-magnifying-glass"
            clearable
          />
        </v-col>
        <v-col cols="12" sm="4">
          <div class="filter-label">
            <div>ระบบที่ขอ</div>
            <div class="filter-label-en">Requested System</div>
          </div>
          <v-autocomplete
            v-model="filterSystem"
            :items="[
              { title: 'ทั้งหมด', value: 'all' },
              ...systemOptions.map((s) => ({ title: s.label, value: s.code })),
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
          />
        </v-col>
        <v-col v-if="activeTab === 'history'" cols="12" sm="3">
          <div class="filter-label">
            <div>สถานะ</div>
            <div class="filter-label-en">Status</div>
          </div>
          <v-autocomplete
            v-model="filterStatus"
            :items="[
              { title: 'ทั้งหมด', value: 'all' },
              { title: 'อนุมัติแล้ว', value: 'approved' },
              { title: 'ปฏิเสธ', value: 'rejected' },
            ]"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Table -->
    <v-card rounded="xl" elevation="0">
      <v-data-table
        :headers="activeTab === 'pending' ? pendingHeaders : historyHeaders"
        :items="filteredRequests"
        :items-per-page="10"
        rounded="xl"
        hover
      >
        <!-- ชื่อ -->
        <template #item.fullName="{ item }">
          <div class="d-flex align-center ga-2 py-1">
            <v-avatar color="admin" size="34" variant="tonal">
              <v-icon icon="fas fa-user-tie" size="15" color="admin" />
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ item.fullName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <!-- เลขบัตร -->
        <template #item.idCard="{ item }">
          <span class="text-body-2 font-mono">{{ maskId(item.idCard) }}</span>
        </template>

        <!-- ระบบที่ขอ -->
        <template #item.requestedSystems="{ item }">
          <div class="d-flex flex-wrap ga-1 py-1">
            <v-chip
              v-for="sys in item.requestedSystems"
              :key="sys"
              size="x-small"
              :color="systemColor(sys)"
              variant="tonal"
              class="font-weight-bold"
              >{{ sys }}</v-chip
            >
          </div>
        </template>

        <!-- สถานะ -->
        <template #item.status="{ item }">
          <v-chip
            :color="statusColor(item.status)"
            size="small"
            variant="tonal"
            :prepend-icon="statusIcon(item.status)"
          >
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>

        <!-- วันที่ยื่น -->
        <template #item.requestedAt="{ item }">
          <span class="text-body-2">{{ item.requestedAt }}</span>
        </template>

        <!-- วันที่พิจารณา -->
        <template #item.reviewedAt="{ item }">
          <span class="text-body-2">{{ item.reviewedAt || "—" }}</span>
        </template>

        <!-- Actions (pending) -->
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            color="admin"
            variant="tonal"
            rounded="lg"
            prepend-icon="fas fa-clipboard-check"
            @click="openReview(item)"
          >
            พิจารณา
          </v-btn>
        </template>

        <!-- Actions (history) -->
        <template #item.historyActions="{ item }">
          <v-btn
            size="x-small"
            color="grey"
            variant="tonal"
            rounded="lg"
            icon="fas fa-eye"
            @click="openReview(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Review Dialog ── -->
    <v-dialog v-model="reviewDialog" max-width="640" persistent scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-clipboard-check" color="admin" size="18" />
          พิจารณาคำขอลงทะเบียน
          <v-spacer />
          <v-chip
            v-if="reviewItem"
            :color="statusColor(reviewItem.status)"
            size="small"
            variant="tonal"
            :prepend-icon="statusIcon(reviewItem.status)"
            >{{ statusLabel(reviewItem.status) }}</v-chip
          >
        </v-card-title>
        <v-divider />

        <v-card-text class="pa-6" v-if="reviewItem">
          <!-- ข้อมูลผู้ยื่น -->
          <div class="section-label mb-3">ข้อมูลผู้ยื่นคำขอ</div>
          <v-card rounded="lg" elevation="0" class="info-card pa-4 mb-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="info-label">ชื่อ-นามสกุล</div>
                <div class="info-value">{{ reviewItem.fullName }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-label">เลขบัตรประชาชน</div>
                <div class="info-value font-mono">
                  {{ maskId(reviewItem.idCard) }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-label mt-3">อีเมล</div>
                <div class="info-value">{{ reviewItem.email }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="info-label mt-3">เบอร์โทรศัพท์</div>
                <div class="info-value">{{ reviewItem.phone || "—" }}</div>
              </v-col>
              <v-col cols="12">
                <div class="info-label mt-3">วันที่ยื่นคำขอ</div>
                <div class="info-value">{{ reviewItem.requestedAt }}</div>
              </v-col>
            </v-row>
          </v-card>

          <!-- ระบบที่ต้องการใช้งาน -->
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="section-label">ระบบที่ต้องการใช้งาน</div>
            <div
              v-if="reviewItem.status === 'pending'"
              class="text-caption text-medium-emphasis"
            >
              ปรับเปลี่ยนได้ก่อนอนุมัติ
            </div>
          </div>
          <v-row dense>
            <v-col
              v-for="sys in systemOptions"
              :key="sys.code"
              cols="12"
              sm="12"
            >
              <v-card
                rounded="lg"
                elevation="0"
                class="pa-3 d-flex align-center ga-2 system-card"
                :class="{
                  'cursor-pointer': reviewItem.status === 'pending',
                  'system-card--active': approvedSystems.includes(sys.code),
                }"
                @click="
                  reviewItem.status === 'pending' &&
                  toggleApprovedSystem(sys.code)
                "
              >
                <v-checkbox
                  :model-value="approvedSystems.includes(sys.code)"
                  hide-details
                  density="compact"
                  :readonly="reviewItem.status !== 'pending'"
                />
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ sys.code }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ sys.label }}
                  </div>
                </div>
                <v-chip
                  v-if="
                    reviewItem.requestedSystems.includes(sys.code) &&
                    !approvedSystems.includes(sys.code) &&
                    reviewItem.status === 'pending'
                  "
                  size="x-small"
                  color="warning"
                  variant="tonal"
                  >ถูกนำออก</v-chip
                >
              </v-card>
            </v-col>
          </v-row>

          <!-- หมายเหตุ (ปฏิเสธ) -->
          <div
            v-if="reviewItem.status === 'rejected' && reviewItem.rejectNote"
            class="mt-4"
          >
            <div class="section-label mb-2">หมายเหตุ</div>
            <v-alert
              color="error"
              variant="tonal"
              rounded="lg"
              density="compact"
              prepend-icon="fas fa-circle-xmark"
            >
              {{ reviewItem.rejectNote }}
            </v-alert>
          </div>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="reviewDialog = false"
            >ปิด</v-btn
          >
          <v-spacer />
          <template v-if="reviewItem?.status === 'pending'">
            <v-btn
              variant="tonal"
              color="error"
              rounded="lg"
              prepend-icon="fas fa-circle-xmark"
              @click="openRejectConfirm"
              >ปฏิเสธ</v-btn
            >
            <v-btn
              color="success"
              rounded="lg"
              prepend-icon="fas fa-circle-check"
              @click="openApproveConfirm"
              >อนุมัติ</v-btn
            >
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Approve Confirm Dialog ── -->
    <v-dialog v-model="approveConfirmDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="action-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-success), 0.1)"
          >
            <v-icon icon="fas fa-circle-check" color="success" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการอนุมัติ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            อนุมัติคำขอของ <strong>{{ reviewItem?.fullName }}</strong
            ><br />
            สิทธิ์เข้าถึง <strong>{{ approvedSystems.length }}</strong> ระบบ
            ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="approveConfirmDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="success" rounded="lg" block @click="doApprove"
            >ยืนยันอนุมัติ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Reject Dialog ── -->
    <v-dialog v-model="rejectDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-7">
          <div class="d-flex align-center ga-3 mb-4">
            <div
              class="action-ring"
              style="background: rgba(var(--v-theme-error), 0.1)"
            >
              <v-icon icon="fas fa-circle-xmark" color="error" size="22" />
            </div>
            <div>
              <div class="text-body-1 font-weight-bold">ปฏิเสธคำขอ</div>
              <div class="text-caption text-medium-emphasis">
                {{ reviewItem?.fullName }}
              </div>
            </div>
          </div>
          <div class="field-label mb-1">หมายเหตุ (ไม่บังคับ)</div>
          <v-textarea
            v-model="rejectNote"
            variant="outlined"
            density="compact"
            rounded="lg"
            rows="3"
            placeholder="ระบุเหตุผลในการปฏิเสธ..."
            hide-details
          />
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="rejectDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" block @click="doReject"
            >ยืนยันปฏิเสธ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Approve Success Dialog ── -->
    <v-dialog v-model="approveSuccessDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon
              icon="fas fa-envelope-circle-check"
              size="36"
              color="admin"
            />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">อนุมัติเรียบร้อยแล้ว!</h3>
          <p class="text-body-2 text-medium-emphasis mb-5">
            อนุมัติคำขอของ <strong>{{ approvedName }}</strong> เรียบร้อยแล้ว
          </p>
          <v-alert
            color="info"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-envelope"
            class="text-left mb-3"
          >
            <span class="text-body-2">
              ระบบจะส่งอีเมลยืนยันและ<strong>รหัสสำหรับเข้าสู่ระบบ</strong>ไปที่<br />
              <strong>{{ approvedEmail }}</strong>
            </span>
          </v-alert>
          <v-alert
            color="warning"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-clock"
            class="text-left"
          >
            <span class="text-body-2"
              >เจ้าหน้าที่สามารถเข้าสู่ระบบได้ทันทีหลังรับอีเมล</span
            >
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="admin"
            block
            rounded="lg"
            @click="approveSuccessDialog = false"
            >รับทราบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Add Staff Dialog ── -->
    <v-dialog v-model="addDialog" max-width="620" persistent scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-user-plus" color="admin" size="18" />
          เพิ่มเจ้าหน้าที่
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <div class="section-label mb-3">ข้อมูลส่วนตัว</div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ชื่อ-นามสกุล <span class="req">*</span></div>
                <div class="field-label-en">Full Name</div>
              </div>
              <v-text-field
                v-model="addForm.fullName"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อ นามสกุล"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>รหัสพนักงาน <span class="req">*</span></div>
                <div class="field-label-en">Employee ID</div>
              </div>
              <v-text-field
                v-model="addForm.code"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="DOA-XXXXX"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>อีเมล <span class="req">*</span></div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="addForm.email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="email@doa.go.th"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>เบอร์โทรศัพท์</div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                v-model="addForm.phone"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="0xx-xxx-xxxx"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="section-label mb-1">
            ระบบที่สามารถใช้งานได้ <span class="req">*</span>
          </div>
          <div class="text-caption text-medium-emphasis mb-3">
            เลือกได้มากกว่า 1 ระบบ
          </div>
          <v-row dense>
            <v-col
              v-for="sys in systemOptions"
              :key="sys.code"
              cols="12"
              sm="12"
            >
              <v-card
                rounded="lg"
                elevation="0"
                class="pa-3 d-flex align-center ga-2 cursor-pointer system-card"
                :style="
                  addForm.systems.includes(sys.code)
                    ? `border: 1.5px solid rgb(var(--v-theme-${systemColor(sys.code)})); background: rgba(var(--v-theme-${systemColor(sys.code)}), 0.06)`
                    : 'border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity))'
                "
                @click="toggleAddSystem(sys.code)"
              >
                <v-checkbox
                  :model-value="addForm.systems.includes(sys.code)"
                  hide-details
                  density="compact"
                  readonly
                />
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-medium">
                    {{ sys.code }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ sys.label }}
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="addDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="admin"
            rounded="lg"
            prepend-icon="fas fa-user-plus"
            @click="doAdd"
          >
            เพิ่มเจ้าหน้าที่
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Add Staff Success Dialog ── -->
    <v-dialog v-model="addSuccessDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon
              icon="fas fa-envelope-circle-check"
              size="36"
              color="admin"
            />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">เพิ่มเจ้าหน้าที่สำเร็จ!</h3>
          <p class="text-body-2 text-medium-emphasis mb-5">
            เพิ่มบัญชีเจ้าหน้าที่ <strong>{{ addedName }}</strong> เรียบร้อยแล้ว
          </p>
          <v-alert
            color="info"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-envelope"
            class="text-left mb-3"
          >
            <span class="text-body-2">
              ระบบจะส่งอีเมลยืนยันและ<strong>รหัสสำหรับเข้าสู่ระบบ</strong>ไปที่<br />
              <strong>{{ addedEmail }}</strong>
            </span>
          </v-alert>
          <v-alert
            color="warning"
            variant="tonal"
            rounded="lg"
            density="compact"
            prepend-icon="fas fa-clock"
            class="text-left"
          >
            <span class="text-body-2"
              >เจ้าหน้าที่สามารถเข้าสู่ระบบได้ทันทีหลังรับอีเมล</span
            >
          </v-alert>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="admin"
            block
            rounded="lg"
            @click="addSuccessDialog = false"
            >รับทราบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      rounded="lg"
      location="bottom end"
      :timeout="2500"
    >
      <v-icon
        :icon="
          snackbarColor === 'success'
            ? 'fas fa-circle-check'
            : 'fas fa-circle-xmark'
        "
        class="mr-2"
      />
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";

const systemOptions = [
  {
    code: "GAP",
    label: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช",
  },
  { code: "ORG", label: "ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช" },
  { code: "DOA", label: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)" },
  {
    code: "CB",
    label:
      "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB)",
  },
  { code: "HC", label: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ" },
  { code: "HCEX", label: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืช" },
  {
    code: "EL",
    label:
      "ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)",
  },
];

function systemColor(sys) {
  const map = {
    GAP: "gap-staff",
    HC: "hc-staff",
    HCEX: "hcex-staff",
    ORG: "org-staff",
    EL: "el-staff",
    CB: "cb-staff",
    EXPORT: "export-staff",
    DOA: "doa-staff",
  };
  return map[sys] ?? "grey";
}
function statusColor(s) {
  return s === "pending" ? "warning" : s === "approved" ? "success" : "error";
}
function statusIcon(s) {
  return s === "pending"
    ? "fas fa-clock"
    : s === "approved"
      ? "fas fa-circle-check"
      : "fas fa-circle-xmark";
}
function statusLabel(s) {
  return s === "pending"
    ? "รอดำเนินการ"
    : s === "approved"
      ? "อนุมัติแล้ว"
      : "ปฏิเสธ";
}
function maskId(id) {
  return id
    ? id.slice(0, 1) + "xxxx" + id.slice(5, 10) + "xx" + id.slice(12)
    : "—";
}

// Requests data
const requests = ref([
  {
    id: 1,
    fullName: "นายสมพงษ์ วงศ์ดี",
    idCard: "1100400123456",
    email: "sompong@doa.go.th",
    phone: "081-234-5678",
    requestedSystems: ["GAP", "HC", "ORG"],
    status: "pending",
    requestedAt: "2026-04-18",
    reviewedAt: null,
    rejectNote: null,
  },
  {
    id: 2,
    fullName: "นางสาวกนกวรรณ สุขใจ",
    idCard: "3670100234567",
    email: "kanokwan@doa.go.th",
    phone: "082-345-6789",
    requestedSystems: ["HCEX", "EXPORT"],
    status: "pending",
    requestedAt: "2026-04-19",
    reviewedAt: null,
    rejectNote: null,
  },
  {
    id: 3,
    fullName: "นายธนกร ศิริวงศ์",
    idCard: "1909901345678",
    email: "thanakorn@doa.go.th",
    phone: "083-456-7890",
    requestedSystems: ["EL", "CB"],
    status: "pending",
    requestedAt: "2026-04-20",
    reviewedAt: null,
    rejectNote: null,
  },
  {
    id: 4,
    fullName: "นางพิมพ์ชนก รุ่งเรือง",
    idCard: "1409901456789",
    email: "pimchanok@doa.go.th",
    phone: "084-567-8901",
    requestedSystems: ["GAP", "HC", "HCEX", "ORG"],
    status: "approved",
    requestedAt: "2026-04-10",
    reviewedAt: "2026-04-11",
    rejectNote: null,
  },
  {
    id: 5,
    fullName: "นายอนันต์ ทรัพย์มาก",
    idCard: "2309901567890",
    email: "anan@doa.go.th",
    phone: "085-678-9012",
    requestedSystems: ["DOA"],
    status: "rejected",
    requestedAt: "2026-04-12",
    reviewedAt: "2026-04-13",
    rejectNote: "ข้อมูลไม่ครบถ้วน กรุณายื่นคำขอใหม่พร้อมแนบเอกสาร",
  },
]);

// Tabs & Filters
const activeTab = ref("pending");
const search = ref("");
const filterSystem = ref("all");
const filterStatus = ref("all");

const pendingCount = computed(
  () => requests.value.filter((r) => r.status === "pending").length,
);

const filteredRequests = computed(() => {
  const tab = activeTab.value;
  return requests.value.filter((r) => {
    if (tab === "pending" && r.status !== "pending") return false;
    if (tab === "history" && r.status === "pending") return false;
    const q = search.value?.toLowerCase() ?? "";
    if (
      q &&
      !r.fullName.toLowerCase().includes(q) &&
      !r.email.toLowerCase().includes(q) &&
      !r.idCard.includes(q)
    )
      return false;
    if (
      filterSystem.value !== "all" &&
      !r.requestedSystems.includes(filterSystem.value)
    )
      return false;
    if (
      tab === "history" &&
      filterStatus.value !== "all" &&
      r.status !== filterStatus.value
    )
      return false;
    return true;
  });
});

const pendingHeaders = [
  { title: "ผู้ยื่นคำขอ", key: "fullName" },
  { title: "เลขบัตรประชาชน", key: "idCard" },
  { title: "ระบบที่ขอ", key: "requestedSystems", sortable: false },
  { title: "วันที่ยื่น", key: "requestedAt", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const historyHeaders = [
  { title: "ผู้ยื่นคำขอ", key: "fullName" },
  { title: "เลขบัตรประชาชน", key: "idCard" },
  { title: "ระบบที่ขอ", key: "requestedSystems", sortable: false },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "วันที่ยื่น", key: "requestedAt", sortable: true },
  { title: "วันที่พิจารณา", key: "reviewedAt", sortable: true },
  { title: "", key: "historyActions", sortable: false, align: "end" },
];

// Review
const reviewDialog = ref(false);
const reviewItem = ref(null);
const approvedSystems = ref([]);

function openReview(item) {
  reviewItem.value = item;
  approvedSystems.value = [...item.requestedSystems];
  reviewDialog.value = true;
}
function toggleApprovedSystem(code) {
  const idx = approvedSystems.value.indexOf(code);
  if (idx === -1) approvedSystems.value.push(code);
  else approvedSystems.value.splice(idx, 1);
}

// Approve
const approveConfirmDialog = ref(false);
const approveSuccessDialog = ref(false);
const approvedName = ref("");
const approvedEmail = ref("");

function openApproveConfirm() {
  approveConfirmDialog.value = true;
}
function doApprove() {
  const idx = requests.value.findIndex((r) => r.id === reviewItem.value.id);
  if (idx !== -1) {
    requests.value[idx].status = "approved";
    requests.value[idx].requestedSystems = [...approvedSystems.value];
    requests.value[idx].reviewedAt = new Date().toISOString().split("T")[0];
  }
  approvedName.value = reviewItem.value.fullName;
  approvedEmail.value = reviewItem.value.email;
  approveConfirmDialog.value = false;
  reviewDialog.value = false;
  approveSuccessDialog.value = true;
}

// Reject
const rejectDialog = ref(false);
const rejectNote = ref("");

function openRejectConfirm() {
  rejectNote.value = "";
  rejectDialog.value = true;
}
function doReject() {
  const idx = requests.value.findIndex((r) => r.id === reviewItem.value.id);
  if (idx !== -1) {
    requests.value[idx].status = "rejected";
    requests.value[idx].reviewedAt = new Date().toISOString().split("T")[0];
    requests.value[idx].rejectNote = rejectNote.value || null;
  }
  rejectDialog.value = false;
  reviewDialog.value = false;
  showSnackbar("error", `ปฏิเสธคำขอของ ${reviewItem.value.fullName} แล้ว`);
}

// Add Staff
let nextId = requests.value.length + 1;
const addDialog = ref(false);
const addSuccessDialog = ref(false);
const addedName = ref("");
const addedEmail = ref("");
const addForm = reactive({
  fullName: "",
  code: "",
  email: "",
  phone: "",
  systems: [],
});

function openAdd() {
  Object.assign(addForm, {
    fullName: "",
    code: "",
    email: "",
    phone: "",
    systems: [],
  });
  addDialog.value = true;
}
function toggleAddSystem(code) {
  const idx = addForm.systems.indexOf(code);
  if (idx === -1) addForm.systems.push(code);
  else addForm.systems.splice(idx, 1);
}
function doAdd() {
  const today = new Date().toISOString().split("T")[0];
  requests.value.push({
    id: nextId++,
    fullName: addForm.fullName,
    idCard: "—",
    email: addForm.email,
    phone: addForm.phone,
    requestedSystems: [...addForm.systems],
    status: "approved",
    requestedAt: today,
    reviewedAt: today,
    rejectNote: null,
  });
  addedName.value = addForm.fullName;
  addedEmail.value = addForm.email;
  addDialog.value = false;
  addSuccessDialog.value = true;
}

// Snackbar
const snackbar = ref(false);
const snackbarColor = ref("success");
const snackbarText = ref("");
function showSnackbar(color, text) {
  snackbarColor.value = color;
  snackbarText.value = text;
  snackbar.value = true;
}
</script>

<style scoped>
.page-title {
  font-size: 1.375rem;
  font-weight: 700;
}
.section-label {
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.7;
}
.field-label,
.filter-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.req {
  color: rgb(var(--v-theme-error));
}
.field-label-en,
.filter-label-en {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.6;
}
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.info-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.65;
  font-weight: 500;
}
.info-value {
  font-size: 0.875rem;
  font-weight: 500;
}
.font-mono {
  font-family: monospace;
}
.action-ring,
.success-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-ring {
  width: 76px;
  height: 76px;
  background: rgba(var(--v-theme-admin), 0.1);
}
.system-card {
  transition: all 0.15s;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
