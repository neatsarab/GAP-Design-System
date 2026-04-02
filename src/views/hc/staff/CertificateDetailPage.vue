<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขทะเบียน:
          <span class="text-hc-staff font-weight-medium">{{
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
        <!-- สถานะใบรับรอง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-certificate" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบรับรอง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบรับรอง / Certificate No.</div>
                <div class="info-value text-hc-staff font-weight-bold">
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
                <div class="info-label">วันที่ออกใบรับรอง / Issue Date</div>
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
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-user" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">
                  ชื่อ-นามสกุล (ภาษาไทย) / Full Name (Thai)
                </div>
                <div class="info-value">{{ appData.applicantNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่อยู่ / Address</div>
                <div class="info-value">{{ appData.applicantAddress }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ appData.applicantPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ appData.applicantFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ appData.applicantEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลสถานประกอบการ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-building" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลสถานประกอบการ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อสถานประกอบการ (ภาษาไทย)</div>
                <div class="info-value">{{ appData.companyNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Company Name (English)</div>
                <div class="info-value">{{ appData.companyNameEn }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                <div class="info-value">{{ appData.companyAddressTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Address (English)</div>
                <div class="info-value">{{ appData.companyAddressEn }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ appData.companyPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ appData.companyFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ appData.companyEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ส่งออก (ตาราง) -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-table-list" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ส่งออก</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th>#</th>
                <th>เลขทะเบียนผู้ส่งออก</th>
                <th>เลขทะเบียน DOA</th>
                <th>เลขใบรับรอง GAP</th>
                <th>ประเทศขอบข่าย</th>
                <th>วันหมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(exp, i) in appData.exporters" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td>
                  <div
                    class="text-body-2 font-weight-bold text-export-staff"
                  >
                    {{ exp.regNo }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ exp.companyName }}
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column align-start ga-1 py-1">
                    <v-chip
                      v-for="f in exp.factories"
                      :key="f"
                      size="x-small"
                      variant="tonal"
                      color="doa-staff"
                      label
                      >{{ f }}</v-chip
                    >
                    <span v-if="!exp.factories?.length" class="text-body-2"
                      >—</span
                    >
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column align-start ga-1 py-1">
                    <v-chip
                      v-for="g in exp.gaps"
                      :key="g"
                      size="x-small"
                      variant="tonal"
                      color="gap-staff"
                      label
                      >{{ g }}</v-chip
                    >
                    <span v-if="!exp.gaps?.length" class="text-body-2">—</span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-wrap ga-1 py-1">
                    <v-chip
                      v-for="c in exp.countries"
                      :key="c"
                      size="x-small"
                      variant="tonal"
                      color="blue-grey"
                      label
                      >{{ c }}</v-chip
                    >
                  </div>
                </td>
                <td class="text-body-2">{{ exp.expDate }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- การส่งตรวจ Lab -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-flask" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >การส่งตรวจ Lab</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">การส่ง Lab</div>
                <div class="info-value">
                  <v-chip
                    size="x-small"
                    :color="appData.labTest === 'yes' ? 'hc-staff' : 'grey'"
                    variant="tonal"
                  >
                    {{
                      appData.labTest === "yes" ? "ส่ง Lab" : "ไม่ส่ง Lab"
                    }}
                  </v-chip>
                </div>
              </v-col>
              <v-col v-if="appData.labTest === 'yes'" cols="12" md="4">
                <div class="info-label">ห้องปฏิบัติการ / Laboratory</div>
                <div class="info-value">{{ appData.labName }}</div>
              </v-col>
              <v-col v-if="appData.labTest === 'yes'" cols="12" md="4">
                <div class="info-label">สินค้า / Product</div>
                <div class="info-value">{{ appData.labProduct }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ประกอบการโรงคัดบรรจุ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-warehouse" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ประกอบการโรงคัดบรรจุ</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th>#</th>
                <th>เลขทะเบียน DOA</th>
                <th>ชื่อโรงงาน</th>
                <th>ประเภทพืช</th>
                <th>จังหวัด</th>
                <th>วันหมดอายุ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(factory, i) in appData.factories" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td class="text-body-2 font-weight-bold text-doa-staff">
                  {{ factory.doaNo }}
                </td>
                <td class="text-body-2">{{ factory.factoryName }}</td>
                <td>
                  <v-chip
                    size="x-small"
                    color="success"
                    variant="tonal"
                    label
                    >{{ factory.plantType }}</v-chip
                  >
                </td>
                <td class="text-body-2">{{ factory.province }}</td>
                <td class="text-body-2">{{ factory.expDate }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- รายการสิ่งที่ต้องการให้ระบุในใบรับรอง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-bacterium" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >รายการสิ่งที่ต้องการให้ระบุในใบรับรอง</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-label mb-2">
              ชื่อเชื้อจุลินทรีย์หรือสิ่งอื่นใดที่เป็นอันตรายต่อมนุษย์ /
              Pathogen / Hazard
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="p in appData.pathogens"
                :key="p"
                size="small"
                variant="tonal"
                color="error"
                >{{ p }}</v-chip
              >
              <span
                v-if="!appData.pathogens?.length"
                class="text-body-2 text-medium-emphasis"
                >—</span
              >
            </div>
          </v-card-text>
        </v-card>

        <!-- รายละเอียดการส่งออกสินค้า -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-file-export" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >รายละเอียดการส่งออกสินค้า</span
            >
          </div>
          <v-table density="compact" class="pa-2">
            <thead>
              <tr>
                <th>#</th>
                <th>ประเภทใบรับรอง</th>
                <th>เลขทะเบียนผู้ส่งออก</th>
                <th>ชื่อผู้ส่งออก</th>
                <th>น้ำหนัก (กก.)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(d, i) in appData.exportDetails" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td class="text-body-2">{{ d.certType }}</td>
                <td class="text-body-2 font-weight-bold text-export-staff">
                  {{ d.exporterRegNo }}
                </td>
                <td class="text-body-2">{{ d.exporterName }}</td>
                <td class="text-body-2">
                  {{ d.weight.toLocaleString() }}
                </td>
                <td>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="hc-staff"
                    rounded="lg"
                    prepend-icon="fas fa-circle-info"
                    @click="openExportDetail(d)"
                  >
                    รายละเอียด
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-card-text class="pa-4 pt-3">
            <v-row dense>
              <v-col cols="6">
                <div class="info-label">
                  น้ำหนักรวม (กก.) / Total Net Weight
                </div>
                <div class="info-value font-weight-bold">
                  {{ appData.totalWeight?.toLocaleString() }}
                </div>
              </v-col>
              <v-col cols="6">
                <div class="info-label">
                  มูลค่ารวม (บาท) / Total Value (THB)
                </div>
                <div class="info-value font-weight-bold">
                  {{ appData.totalValue?.toLocaleString() }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-paperclip" color="hc-staff" size="15" />
            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
          </div>
          <v-card-text class="pa-4">
            <div
              v-for="doc in appData.attachments"
              :key="doc.label"
              class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
            >
              <div class="text-body-2">{{ doc.label }}</div>
              <v-btn
                size="x-small"
                variant="tonal"
                color="hc-staff"
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
          <!-- ปุ่มดาวน์โหลด -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4 d-flex flex-column ga-2">
              <v-btn
                color="hc-staff"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลดใบรับรอง (PDF)
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- ประวัติใบรับรอง -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="hc-staff"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ประวัติใบรับรอง</span
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
                      >
                        {{ eventLabel(event.type) }}
                      </v-chip>
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

    <!-- Export Detail Dialog -->
    <v-dialog v-model="exportDetailDialog" max-width="680">
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-3 mb-4">
            <div
              class="rounded-lg d-flex align-center justify-center"
              style="
                width: 40px;
                height: 40px;
                background: rgba(var(--v-theme-hc-staff), 0.12);
                flex-shrink: 0;
              "
            >
              <v-icon icon="fas fa-file-export" color="hc-staff" size="18" />
            </div>
            <div>
              <div class="text-subtitle-2 font-weight-bold">
                รายละเอียดการส่งออกสินค้า
              </div>
              <div class="text-caption text-medium-emphasis">
                Export Details
              </div>
            </div>
          </div>
          <v-divider class="mb-4" />
          <div class="d-flex flex-column ga-3">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis mb-1">
                  ประเภทใบรับรอง / Certificate Type
                </div>
                <v-chip size="small" color="hc-staff" variant="tonal">{{
                  selectedExportDetail?.certType
                }}</v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis mb-1">
                  เลขทะเบียนผู้ส่งออก / Exporter Reg. No.
                </div>
                <div class="text-body-2 font-weight-bold text-export-staff">
                  {{ selectedExportDetail?.exporterRegNo }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ selectedExportDetail?.exporterName }}
                </div>
              </v-col>
            </v-row>
            <v-divider />
            <div>
              <div
                class="text-caption text-medium-emphasis mb-2 d-flex align-center ga-1"
              >
                <v-icon icon="fas fa-ship" size="11" />
                ข้อมูลพาหนะ / Mode of Transport
              </div>
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis mb-1">
                    ประเภทพาหนะ / Vehicle Type
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedExportDetail?.vehicleType || "—" }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis mb-1">
                    ชื่อพาหนะ / Conveyance Name
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedExportDetail?.vehicleName || "—" }}
                  </div>
                </v-col>
              </v-row>
            </div>
            <v-divider />
            <div>
              <div
                class="text-caption text-medium-emphasis mb-2 d-flex align-center ga-1"
              >
                <v-icon icon="fas fa-table-list" size="11" />
                ตารางข้อมูลการส่งออก / Shipment Details
              </div>
              <v-table
                density="compact"
                class="rounded-lg"
                style="border: 1px solid rgba(var(--v-theme-on-surface), 0.08)"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ผู้รับสินค้า</th>
                    <th>ประเทศ / ด่าน</th>
                    <th>หมายเลข Lot</th>
                    <th class="text-right">น้ำหนัก (กก.)</th>
                    <th>วันที่ส่งออก</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(s, i) in selectedExportDetail?.shipments"
                    :key="i"
                  >
                    <td class="text-body-2 text-medium-emphasis">
                      {{ i + 1 }}
                    </td>
                    <td>
                      <div class="text-body-2">{{ s.consignee }}</div>
                      <div
                        v-if="s.address"
                        class="text-caption text-medium-emphasis"
                      >
                        {{ s.address }}
                      </div>
                    </td>
                    <td>
                      <div class="text-body-2">{{ s.country }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ s.checkpoint }}
                      </div>
                    </td>
                    <td class="text-body-2">{{ s.lotNo }}</td>
                    <td class="text-body-2 text-right">
                      {{ Number(s.weight).toLocaleString() }}
                    </td>
                    <td class="text-body-2">{{ s.exportDate }}</td>
                  </tr>
                  <tr v-if="!selectedExportDetail?.shipments?.length">
                    <td
                      colspan="6"
                      class="text-center text-caption text-medium-emphasis py-3"
                    >
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 pt-0">
          <v-btn
            color="hc-staff"
            variant="tonal"
            rounded="lg"
            block
            @click="exportDetailDialog = false"
            >ปิด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mockApps, certToApp } from "@/mock/hcStaffMock.js";

const route = useRoute();
const router = useRouter();

const certId = route.params.id;
const appId = certToApp[certId] ?? "HC-001";
const appData = ref(mockApps[appId]);

const cert = computed(() => {
  const a = appData.value;
  return {
    certNo: a.certNo,
    requestNo: a.requestNo,
    issueDate: a.certIssueDate,
    expireDate: a.certExpireDate,
    status: a.certStatus,
    activityLog: a.certActivityLog,
  };
});

const exportDetailDialog = ref(false);
const selectedExportDetail = ref(null);

function openExportDetail(detail) {
  selectedExportDetail.value = detail;
  exportDetailDialog.value = true;
}

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
      approve: "fas fa-circle-check",
      reject: "fas fa-circle-xmark",
      sendback: "fas fa-rotate-left",
      issue: "fas fa-certificate",
      revoke: "fas fa-ban",
      lab_record: "fas fa-flask",
      lab_review: "fas fa-share",
    }[type] ?? "fas fa-circle"
  );
}
function eventColor(type) {
  return (
    {
      submit: "hc-staff",
      receive: "info",
      forward: "success",
      review: "warning",
      approve: "success",
      reject: "error",
      sendback: "warning",
      issue: "hc-staff",
      revoke: "error",
      lab_record: "info",
      lab_review: "success",
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
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
      issue: "ออกใบรับรอง",
      revoke: "เพิกถอน",
      lab_record: "บันทึกผล Lab",
      lab_review: "พิจารณาผล Lab",
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
.section-header {
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
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
  background: rgb(var(--v-theme-hc-staff));
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
.activity-dot--approve {
  background: rgb(var(--v-theme-success));
}
.activity-dot--reject {
  background: rgb(var(--v-theme-error));
}
.activity-dot--sendback {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--issue {
  background: rgb(var(--v-theme-hc-staff));
}
.activity-dot--revoke {
  background: rgb(var(--v-theme-error));
}
.activity-dot--lab_record {
  background: rgb(var(--v-theme-info));
}
.activity-dot--lab_review {
  background: rgb(var(--v-theme-success));
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
