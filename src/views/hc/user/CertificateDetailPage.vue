<template>
  <div style="--v-theme-primary: var(--v-theme-hc-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดใบรับรองสุขอนามัยพืช</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขใบรับรอง:
          <span class="text-hc-user font-weight-medium">{{
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
            <v-icon icon="fas fa-file-shield" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">สถานะใบรับรอง</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">เลขที่ใบรับรอง / Certificate No.</div>
                <div class="info-value text-hc-user font-weight-bold">
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
              <v-col cols="12" md="4">
                <div class="info-label">
                  สถานที่รับใบรับรอง / Collection Location
                </div>
                <div class="info-value">{{ cert.agency }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ยื่นคำขอ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-user" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลผู้ยื่นคำขอ</span
            >
            <v-chip size="x-small" color="hc-user" variant="tonal"
              >Auto-fill จาก SSO</v-chip
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">
                  ชื่อ-นามสกุล (ภาษาไทย) / Full Name (Thai)
                </div>
                <div class="info-value">{{ cert.applicantNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่อยู่ / Address</div>
                <div class="info-value">{{ cert.applicantAddress }}</div>
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
            <v-icon icon="fas fa-building" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ข้อมูลสถานประกอบการ</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">ชื่อสถานประกอบการ (ภาษาไทย)</div>
                <div class="info-value">{{ cert.companyNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Company Name (English)</div>
                <div class="info-value">{{ cert.companyNameEn }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                <div class="info-value">{{ cert.companyAddressTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Address (English)</div>
                <div class="info-value">{{ cert.companyAddressEn }}</div>
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

        <!-- ข้อมูลผู้ส่งออก -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-table-list" color="hc-user" size="15" />
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
              <tr v-for="(exp, i) in cert.exporters" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td>
                  <div class="text-body-2 font-weight-bold text-export-user">
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
                      color="doa-user"
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
                      color="gap-user"
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
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-flask" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">การส่งตรวจ Lab</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="4">
                <div class="info-label">การส่ง Lab</div>
                <div class="info-value">
                  <v-chip
                    size="x-small"
                    :color="cert.labTest === 'yes' ? 'hc-user' : 'grey'"
                    variant="tonal"
                  >
                    {{ cert.labTest === "yes" ? "ส่ง Lab" : "ไม่ส่ง Lab" }}
                  </v-chip>
                </div>
              </v-col>
              <v-col v-if="cert.labTest === 'yes'" cols="12" md="4">
                <div class="info-label">ห้องปฏิบัติการ / Laboratory</div>
                <div class="info-value">{{ cert.labName }}</div>
              </v-col>
              <v-col v-if="cert.labTest === 'yes'" cols="12" md="4">
                <div class="info-label">สินค้า / Product</div>
                <div class="info-value">{{ cert.labProduct }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ประกอบการโรงคัดบรรจุ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-warehouse" color="hc-user" size="15" />
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
              <tr v-for="(factory, i) in cert.factories" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td class="text-body-2 font-weight-bold text-doa-user">
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

        <!-- รายการสิ่งที่ระบุในใบรับรอง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-bacterium" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >รายการสิ่งที่ระบุในใบรับรอง</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="info-label mb-2">
              ชื่อเชื้อจุลินทรีย์หรือสิ่งอื่นใดที่เป็นอันตรายต่อมนุษย์ /
              Pathogen / Hazard
            </div>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="p in cert.pathogens"
                :key="p"
                size="small"
                variant="tonal"
                color="error"
                >{{ p }}</v-chip
              >
              <span
                v-if="!cert.pathogens?.length"
                class="text-body-2 text-medium-emphasis"
                >—</span
              >
            </div>
          </v-card-text>
        </v-card>

        <!-- รายละเอียดการส่งออกสินค้า -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-file-export" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >รายละเอียดการส่งออกสินค้า</span
            >
          </div>
          <v-card-text class="pa-4">
            <div
              class="item-row rounded-lg px-4 py-3 d-flex align-center justify-space-between"
            >
              <div>
                <div class="text-body-2 font-weight-medium text-export-user">
                  {{ cert.exportDetails[0]?.exporterRegNo }}
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  {{ cert.exportDetails[0]?.exporterName }}
                </div>
                <div class="d-flex align-center ga-2 mt-2">
                  <v-chip size="x-small" color="hc-user" variant="tonal">
                    {{ cert.exportDetails[0]?.certType }}
                  </v-chip>
                  <span class="text-caption text-medium-emphasis">
                    น้ำหนัก:
                    <span class="font-weight-medium">{{
                      cert.exportDetails[0]?.weight?.toLocaleString()
                    }}</span>
                    กก.
                  </span>
                </div>
              </div>
              <v-btn
                size="small"
                variant="tonal"
                color="hc-user"
                rounded="lg"
                prepend-icon="fas fa-circle-info"
                @click="exportDetailDialog = true"
              >
                รายละเอียด
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- เอกสารแนบ -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-paperclip" color="hc-user" size="15" />
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
                color="hc-user"
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลด
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: cert actions + activity log ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- ปุ่มดาวน์โหลดใบรับรอง -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-4">
              <v-btn
                color="hc-user"
                variant="flat"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
                :disabled="cert.status === 'expired'"
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
                color="hc-user"
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
                      color="hc-user"
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
                background: rgba(var(--v-theme-hc-user), 0.12);
                flex-shrink: 0;
              "
            >
              <v-icon icon="fas fa-file-export" color="hc-user" size="18" />
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
            <!-- ข้อมูลผู้ส่งออก -->
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis mb-1">
                  ประเภทใบรับรอง / Certificate Type
                </div>
                <v-chip size="small" color="hc-user" variant="tonal">
                  {{ cert.exportDetails[0]?.certType }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis mb-1">
                  เลขทะเบียนผู้ส่งออก / Exporter Reg. No.
                </div>
                <div class="text-body-2 font-weight-bold text-export-user">
                  {{ cert.exportDetails[0]?.exporterRegNo }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ cert.exportDetails[0]?.exporterName }}
                </div>
              </v-col>
            </v-row>

            <v-divider />

            <!-- ข้อมูลพาหนะ -->
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
                    {{ cert.exportDetails[0]?.vehicleType || "—" }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis mb-1">
                    ชื่อพาหนะ / Conveyance Name
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ cert.exportDetails[0]?.vehicleName || "—" }}
                  </div>
                </v-col>
              </v-row>
            </div>

            <v-divider />

            <!-- น้ำหนักและมูลค่า -->
            <!-- <v-row dense>
              <v-col cols="4">
                <div class="text-caption text-medium-emphasis mb-1">
                  น้ำหนักรวม (กก.) / Total Weight
                </div>
                <div class="text-body-2 font-weight-bold">
                  {{ cert.totalWeight?.toLocaleString() }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="text-caption text-medium-emphasis mb-1">
                  มูลค่ารวม (บาท) / Total Value
                </div>
                <div class="text-body-2 font-weight-bold">
                  {{ cert.totalValue?.toLocaleString() }}
                </div>
              </v-col>
            </v-row> -->

            <v-divider />

            <!-- ตารางข้อมูลการส่งออก -->
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
                    v-for="(s, i) in cert.exportDetails[0]?.shipments"
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
                  <tr v-if="!cert.exportDetails[0]?.shipments?.length">
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
            color="hc-user"
            variant="tonal"
            rounded="lg"
            block
            @click="exportDetailDialog = false"
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            color="hc-user"
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activityDetailDialog = ref(false);
const selectedEvent = ref(null);
const exportDetailDialog = ref(false);

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
  certNo: "THHC-2569-00025",
  requestNo: "HC-00025",
  issueDate: "10/01/2569",
  expireDate: "10/01/2570",
  status: "active",
  agency: "สำนักงานเกษตรจังหวัดเชียงใหม่",

  applicantNameTh: "นายสมชาย ใจดี",
  applicantAddress:
    "123 หมู่ 1 ถ.พระราม 9 ต.ลาดยาว อ.จตุจักร จ.กรุงเทพมหานคร 10900",
  applicantPhone: "02-123-4567",
  applicantFax: "-",
  applicantEmail: "somchai@thaifruits.co.th",

  companyNameTh: "บริษัท ไทยฟรุ๊ต จำกัด",
  companyNameEn: "Thai Fruits Co., Ltd.",
  companyAddressTh:
    "123 ถ.พระราม 9 ต.ห้วยขวาง อ.ห้วยขวาง จ.กรุงเทพมหานคร 10310",
  companyAddressEn: "123 Rama 9 Rd., Huai Khwang, Huai Khwang, Bangkok 10310",
  companyPhone: "02-123-4567",
  companyFax: "02-123-4568",
  companyEmail: "info@thaifruits.co.th",

  exporters: [
    {
      regNo: "EXP-2568-00456",
      companyName: "บริษัท ไทยฟรุ๊ต จำกัด",
      factories: ["DOA-2568-22222"],
      gaps: ["GAP-CM-2569-010"],
      countries: ["จีน"],
      expDate: "01/07/2569",
    },
  ],

  factories: [
    {
      doaNo: "DOA-2568-22222",
      factoryName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
      plantType: "มังคุด",
      province: "เชียงใหม่",
      expDate: "01/12/2569",
    },
  ],

  pathogens: ["Salmonella spp."],

  exportDetails: [
    {
      certType: "คลุมทั้งการส่งออก (All)",
      exporterRegNo: "EXP-2568-00456",
      exporterName: "บริษัท ไทยฟรุ๊ต จำกัด",
      weight: 3000,
      vehicleType: "เรือ",
      vehicleName: "THAI STAR 001",
      shipments: [
        {
          consignee: "Guangzhou Fresh Import Co., Ltd.",
          address: "No.88 Tianhe Rd., Guangzhou, China",
          country: "จีน",
          checkpoint: "ด่านท่าเรือแหลมฉบัง",
          lotNo: "LOT-2569-001",
          weight: 1500,
          exportDate: "10/01/2569",
        },
        {
          consignee: "Guangzhou Fresh Import Co., Ltd.",
          address: "No.88 Tianhe Rd., Guangzhou, China",
          country: "จีน",
          checkpoint: "ด่านท่าเรือแหลมฉบัง",
          lotNo: "LOT-2569-002",
          weight: 1500,
          exportDate: "10/01/2569",
        },
      ],
    },
  ],
  totalWeight: 3000,
  totalValue: 180000,

  labTest: "no",
  labName: null,
  labProduct: null,

  attachments: [{ label: "เอกสารอื่นๆ" }],

  activityLog: [
    {
      type: "approve",
      action: "ออกใบรับรองแล้ว",
      actor: "นายอนันต์ วิชาการ (ผู้อำนวยการ)",
      timestamp: "10/01/2569 14:00",
      remark: "เลขใบรับรอง THHC-2569-00025",
    },
    {
      type: "forward",
      action: "อนุมัติคำขอ",
      actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
      timestamp: "08/01/2569 11:00",
      remark: "",
    },
    {
      type: "forward",
      action: "ผ่านการตรวจสอบเอกสาร",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
      timestamp: "04/01/2569 10:00",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "นายสมชาย ใจดี",
      timestamp: "02/01/2569 09:00",
      remark: "",
    },
  ],
};

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
      review: "fas fa-flask",
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
      submit: "hc-user",
      receive: "info",
      forward: "success",
      review: "secondary",
      pending: "info",
      approve: "hc-user",
      reject: "error",
      sendback: "warning",
    }[type] ?? "grey"
  );
}

function eventLabel(type) {
  return (
    {
      submit: "ยื่นคำขอ",
      receive: "รับเรื่อง",
      forward: "ผ่าน",
      review: "ตรวจ Lab",
      pending: "รอดำเนินการ",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ส่งแก้ไข",
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
  background: rgb(var(--v-theme-hc-user));
}
.activity-dot--receive {
  background: rgb(var(--v-theme-info));
}
.activity-dot--forward {
  background: rgb(var(--v-theme-success));
}
.activity-dot--review {
  background: rgb(var(--v-theme-secondary));
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
  background: rgb(var(--v-theme-hc-user));
}
.activity-dot--reject {
  background: rgb(var(--v-theme-error));
}
.activity-dot--sendback {
  background: rgb(var(--v-theme-warning));
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
