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
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hc-user font-weight-medium">{{
            app.requestNo
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-chip :color="statusColor(app.status)" variant="tonal">
        <v-icon :icon="statusIcon(app.status)" size="13" class="mr-1" />
        {{ statusLabel(app.status) }}
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
                  v-if="currentStep > step.value"
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
                  currentStep >= step.value
                    ? 'text-hc-user font-weight-bold'
                    : 'text-medium-emphasis'
                "
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < timelineSteps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > step.value }"
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
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-list-check" color="hc-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="6" md="4">
                <div class="info-label">เลขคำขอ</div>
                <div class="info-value text-hc-user font-weight-bold">
                  {{ app.requestNo }}
                </div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">ประเภทคำขอ</div>
                <div class="info-value">
                  <v-chip size="x-small" color="hc-user" variant="tonal">{{
                    app.requestType
                  }}</v-chip>
                </div>
              </v-col>
              <v-col cols="6" md="4">
                <div class="info-label">วันที่ยื่นคำขอ</div>
                <div class="info-value">{{ app.submittedAt }}</div>
              </v-col>
              <v-col cols="12" md="8">
                <div class="info-label">
                  สถานที่รับใบรับรอง / Certificate collection location
                </div>
                <div class="info-value">{{ app.agency }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">
                  ประเภททะเบียนที่ใช้ส่งออก / Registry Type
                </div>
                <div class="info-value">
                  <v-chip
                    size="x-small"
                    :color="
                      app.registryType === 'has_doa_gap' ? 'success' : 'warning'
                    "
                    variant="tonal"
                  >
                    {{
                      app.registryType === "has_doa_gap"
                        ? "มี DOA และ GAP"
                        : "ไม่มี DOA และ/หรือ GAP"
                    }}
                  </v-chip>
                </div>
              </v-col>
              <v-col cols="4">
                <div class="info-label">
                  ระยะเวลาสำหรับส่งออก / Export Duration
                </div>
                <div class="info-value">{{ app.exportDuration }}</div>
              </v-col>
              <v-col cols="4">
                <div class="info-label">วันที่เริ่มต้น / Start Date</div>
                <div class="info-value">{{ app.dateStart }}</div>
              </v-col>
              <v-col cols="4">
                <div class="info-label">วันที่สิ้นสุด / End Date</div>
                <div class="info-value">{{ app.dateEnd }}</div>
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
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" md="6">
                <div class="info-label">
                  ชื่อ-นามสกุล (ภาษาไทย) / Full Name (Thai)
                </div>
                <div class="info-value">{{ app.applicantNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่อยู่ / Address</div>
                <div class="info-value">{{ app.applicantAddress }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ app.applicantPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ app.applicantFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ app.applicantEmail }}</div>
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
                <div class="info-value">{{ app.companyNameTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Company Name (English)</div>
                <div class="info-value">{{ app.companyNameEn }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">ที่ตั้ง (ภาษาไทย)</div>
                <div class="info-value">{{ app.companyAddressTh }}</div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="info-label">Address (English)</div>
                <div class="info-value">{{ app.companyAddressEn }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรศัพท์ / Phone</div>
                <div class="info-value">{{ app.companyPhone }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">โทรสาร / Fax</div>
                <div class="info-value">{{ app.companyFax }}</div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="info-label">อีเมล / Email</div>
                <div class="info-value">{{ app.companyEmail }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- ข้อมูลผู้ส่งออก (ตาราง) -->
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
              <tr v-for="(exp, i) in app.exporters" :key="i">
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
                    :color="app.labTest === 'yes' ? 'hc-user' : 'grey'"
                    variant="tonal"
                  >
                    {{ app.labTest === "yes" ? "ส่ง Lab" : "ไม่ส่ง Lab" }}
                  </v-chip>
                </div>
              </v-col>
              <v-col v-if="app.labTest === 'yes'" cols="12" md="4">
                <div class="info-label">ห้องปฏิบัติการ / Laboratory</div>
                <div class="info-value">{{ app.labName }}</div>
              </v-col>
              <v-col v-if="app.labTest === 'yes'" cols="12" md="4">
                <div class="info-label">สินค้า / Product</div>
                <div class="info-value">{{ app.labProduct }}</div>
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
              <tr v-for="(factory, i) in app.factories" :key="i">
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

        <!-- รายการสิ่งที่ต้องระบุในใบรับรอง -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div
            class="section-header px-4 py-3 border-b d-flex align-center ga-2"
          >
            <v-icon icon="fas fa-bacterium" color="hc-user" size="15" />
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
                v-for="p in app.pathogens"
                :key="p"
                size="small"
                variant="tonal"
                color="error"
                >{{ p }}</v-chip
              >
              <span
                v-if="!app.pathogens?.length"
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
              <tr v-for="(d, i) in app.exportDetails" :key="i">
                <td class="text-body-2 text-medium-emphasis">{{ i + 1 }}</td>
                <td class="text-body-2">{{ d.certType }}</td>
                <td class="text-body-2 font-weight-bold text-export-user">
                  {{ d.exporterRegNo }}
                </td>
                <td class="text-body-2">{{ d.exporterName }}</td>
                <td class="text-body-2">{{ d.weight.toLocaleString() }}</td>
                <td>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="hc-user"
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
                  {{ app.totalWeight?.toLocaleString() }}
                </div>
              </v-col>
              <v-col cols="6">
                <div class="info-label">
                  มูลค่ารวม (บาท) / Total Value (THB)
                </div>
                <div class="info-value font-weight-bold">
                  {{ app.totalValue?.toLocaleString() }}
                </div>
              </v-col>
            </v-row>
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
              v-for="doc in app.attachments"
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
                >ดาวน์โหลด</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: activity timeline (sticky) ── -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <!-- Action cards -->
          <v-card
            v-if="app.status === 'approved'"
            rounded="xl"
            elevation="0"
            class="section-card mb-4"
          >
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-coins" color="warning" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ชำระค่าธรรมเนียม</span
              >
            </div>
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-body-2 text-medium-emphasis"
                  >ค่าธรรมเนียมใบรับรอง</span
                >
                <span class="text-body-1 font-weight-bold">500 บาท</span>
              </div>
              <v-alert
                color="warning"
                variant="tonal"
                density="compact"
                class="mb-3"
                prepend-icon="fas fa-clock"
              >
                กรุณาชำระภายใน 7 วัน (ก่อน 22 ม.ค. 68)
              </v-alert>
              <v-btn
                color="warning"
                block
                rounded="lg"
                prepend-icon="fas fa-qrcode"
              >
                ชำระผ่าน QR Code
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card
            v-if="app.status === 'completed'"
            rounded="xl"
            elevation="0"
            class="section-card mb-4"
          >
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-file-shield" color="success" size="15" />
              <span class="text-subtitle-2 font-weight-bold"
                >ใบรับรองสุขอนามัยพืช</span
              >
            </div>
            <v-card-text class="pa-4">
              <v-row dense class="mb-3">
                <v-col cols="12">
                  <div class="info-label">เลขใบรับรอง</div>
                  <div class="info-value text-success font-weight-bold">
                    THHC-2569-00025
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="info-label">วันที่ออก</div>
                  <div class="info-value">10 มกราคม 2569</div>
                </v-col>
                <v-col cols="6">
                  <div class="info-label">วันหมดอายุ</div>
                  <div class="info-value">10 มกราคม 2569</div>
                </v-col>
              </v-row>
              <v-btn
                color="success"
                block
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลดใบรับรอง (PDF)
              </v-btn>
            </v-card-text>
          </v-card>

          <v-card
            v-if="app.status === 'correction_required'"
            rounded="xl"
            elevation="0"
            class="section-card mb-4"
          >
            <div
              class="section-header px-4 py-3 border-b d-flex align-center ga-2"
            >
              <v-icon
                icon="fas fa-triangle-exclamation"
                color="error"
                size="15"
              />
              <span class="text-subtitle-2 font-weight-bold"
                >ต้องดำเนินการ</span
              >
            </div>
            <v-card-text class="pa-4">
              <v-alert
                color="error"
                variant="tonal"
                density="compact"
                class="mb-3"
                prepend-icon="fas fa-triangle-exclamation"
              >
                เจ้าหน้าที่แจ้งให้แก้ไขข้อมูลในคำขอ
              </v-alert>
              <p class="text-body-2 text-medium-emphasis mb-3">
                {{ app.correctionNote }}
              </p>
              <v-btn
                color="warning"
                variant="tonal"
                block
                rounded="lg"
                prepend-icon="fas fa-pen-to-square"
              >
                แก้ไขและส่งใหม่
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Activity timeline -->
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
                >ความคืบหน้าคำขอ</span
              >
            </div>
            <v-card-text
              class="pa-4"
              style="max-height: 420px; overflow-y: auto"
            >
              <div class="activity-timeline">
                <div
                  v-for="(event, i) in app.activityLog"
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
                      v-if="i < app.activityLog.length - 1"
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
                      v-if="event.type !== 'pending'"
                      class="text-caption text-medium-emphasis"
                    >
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{
                        event.actor
                      }}
                    </div>
                    <div
                      v-if="event.type !== 'pending'"
                      class="text-caption text-medium-emphasis mt-1"
                    >
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />{{
                        event.timestamp
                      }}
                    </div>
                    <v-btn
                      v-if="event.type !== 'submit' && event.type !== 'pending'"
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
              <div class="text-caption text-medium-emphasis">Export Details</div>
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
                  {{ selectedExportDetail?.certType }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-medium-emphasis mb-1">
                  เลขทะเบียนผู้ส่งออก / Exporter Reg. No.
                </div>
                <div class="text-body-2 font-weight-bold text-export-user">
                  {{ selectedExportDetail?.exporterRegNo }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ selectedExportDetail?.exporterName }}
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
                style="
                  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
                "
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
                ผลการพิจารณา
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
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activityDetailDialog = ref(false);
const selectedEvent = ref(null);
const exportDetailDialog = ref(false);
const selectedExportDetail = ref(null);

function openExportDetail(detail) {
  selectedExportDetail.value = detail;
  exportDetailDialog.value = true;
}

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

const mockApps = {
  "HC-001": {
    id: "HC-001",
    requestNo: "HC-00041",
    requestType: "ขอใบรับรอง",
    status: "under_review",
    submittedAt: "15/01/2569",
    agency: "สำนักงานเกษตรจังหวัดเชียงใหม่",
    registryType: "has_doa_gap",
    exportDuration: "7 วัน",
    dateStart: "15/01/2569",
    dateEnd: "22/01/2569",
    // ผู้ยื่นคำขอ
    applicantNameTh: "นายสมชาย ใจดี",
    applicantAddress:
      "123 หมู่ 1 ถ.พระราม 9 ต.ลาดยาว อ.จตุจักร จ.กรุงเทพมหานคร 10900",
    applicantPhone: "02-123-4567",
    applicantFax: "-",
    applicantEmail: "somchai@thaifruits.co.th",
    // สถานประกอบการ
    companyNameTh: "บริษัท ไทยฟรุ๊ต จำกัด",
    companyNameEn: "Thai Fruits Co., Ltd.",
    companyAddressTh:
      "123 ถ.พระราม 9 ต.ห้วยขวาง อ.ห้วยขวาง จ.กรุงเทพมหานคร 10310",
    companyAddressEn: "123 Rama 9 Rd., Huai Khwang, Huai Khwang, Bangkok 10310",
    companyPhone: "02-123-4567",
    companyFax: "02-123-4568",
    companyEmail: "info@thaifruits.co.th",
    // ผู้ส่งออก
    exporters: [
      {
        regNo: "EXP-6701-00123",
        companyName: "บริษัท ไทยฟรุ๊ต จำกัด",
        factories: ["DOA-2568-11111"],
        gaps: ["GAP-CM-2569-001"],
        countries: ["จีน", "ญี่ปุ่น"],
        expDate: "14/01/2570",
      },
    ],
    // โรงคัดบรรจุ
    factories: [
      {
        doaNo: "DOA-2568-11111",
        factoryName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
        plantType: "ทุเรียน",
        province: "เชียงใหม่",
        expDate: "01/06/2570",
      },
    ],
    // รายการเชื้อจุลินทรีย์
    pathogens: ["Salmonella spp.", "E.coli"],
    // รายละเอียดการส่งออก
    exportDetails: [
      {
        certType: "คลุมทั้งการส่งออก (All)",
        exporterRegNo: "EXP-6701-00123",
        exporterName: "บริษัท ไทยฟรุ๊ต จำกัด",
        weight: 5000,
        vehicleType: "เรือ",
        vehicleName: "THAI STAR 001",
        shipments: [
          {
            consignee: "Guangzhou Fresh Import Co., Ltd.",
            address: "No.88 Tianhe Rd., Guangzhou, China",
            country: "จีน",
            checkpoint: "ด่านท่าเรือแหลมฉบัง",
            lotNo: "LOT-2569-001",
            weight: 5000,
            exportDate: "15/01/2569",
          },
        ],
      },
    ],
    totalWeight: 5000,
    totalValue: 250000,
    labTest: "yes",
    labName: "ห้องปฏิบัติการกรมวิชาการเกษตร",
    labProduct: "ทุเรียน",
    correctionNote: null,
    attachments: [
      { label: "หนังสือรับรองบริษัท (ออกไม่เกิน 6 เดือน)" },
      { label: "สำเนาบัตรประชาชนผู้มีอำนาจลงนาม" },
    ],
    activityLog: [
      {
        type: "pending",
        action: "กำลังตรวจสอบเอกสาร",
        actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
        timestamp: "16/01/2569 09:00",
        remark: "",
      },
      {
        type: "submit",
        action: "ยื่นคำขอ",
        actor: "นายสมชาย ใจดี",
        timestamp: "15/01/2569 10:30",
        remark: "",
      },
    ],
  },
  "HC-008": {
    id: "HC-008",
    requestNo: "HC-00025",
    requestType: "ขอใบรับรอง",
    status: "completed",
    submittedAt: "02/01/2569",
    agency: "สำนักงานเกษตรจังหวัดเชียงใหม่",
    registryType: "has_doa_gap",
    exportDuration: "14 วัน",
    dateStart: "02/01/2569",
    dateEnd: "16/01/2569",
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
        regNo: "EXP-6701-00456",
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
        exporterRegNo: "EXP-6701-00456",
        exporterName: "บริษัท ไทยฟรุ๊ต จำกัด",
        weight: 3000,
        vehicleType: "เรือ",
        vehicleName: "THAI STAR 002",
        shipments: [
          {
            consignee: "Shanghai Green Food Co., Ltd.",
            address: "No.12 Pudong Ave., Shanghai, China",
            country: "จีน",
            checkpoint: "ด่านท่าเรือแหลมฉบัง",
            lotNo: "LOT-2569-010",
            weight: 3000,
            exportDate: "02/01/2569",
          },
        ],
      },
    ],
    totalWeight: 3000,
    totalValue: 180000,
    labTest: "no",
    labName: null,
    labProduct: null,
    correctionNote: null,
    attachments: [
      { label: "หนังสือรับรองบริษัท (ออกไม่เกิน 6 เดือน)" },
      { label: "ใบรับรอง GAP" },
    ],
    activityLog: [
      {
        type: "approve",
        action: "ออกใบรับรองแล้ว",
        actor: "นายอนันต์ วิชาการ (ผู้อำนวยการ)",
        timestamp: "10/01/2569 14:00",
        remark: "",
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
  },
  "HC-015": {
    id: "HC-015",
    requestNo: "HC-00015",
    requestType: "แก้ไขใบรับรอง",
    status: "correction_required",
    submittedAt: "10/01/2569",
    agency: "สำนักงานเกษตรจังหวัดชลบุรี",
    registryType: "has_doa_gap",
    exportDuration: "14 วัน",
    dateStart: "10/01/2569",
    dateEnd: "09/01/2570",
    applicantNameTh: "นางสาวสมหญิง รักไทย",
    applicantAddress:
      "456 ถ.สุขุมวิท ต.บางปลาสร้อย อ.เมืองชลบุรี จ.ชลบุรี 20000",
    applicantPhone: "038-123-456",
    applicantFax: "-",
    applicantEmail: "somying@thaigardens.co.th",
    companyNameTh: "บริษัท สวนผลไม้ไทย จำกัด",
    companyNameEn: "Thai Gardens Co., Ltd.",
    companyAddressTh:
      "456 ถ.สุขุมวิท ต.บางปลาสร้อย อ.เมืองชลบุรี จ.ชลบุรี 20000",
    companyAddressEn:
      "456 Sukhumvit Rd., Bang Pla Soi, Mueang Chonburi, Chonburi 20000",
    companyPhone: "038-123-456",
    companyFax: "038-123-457",
    companyEmail: "info@thaigardens.co.th",
    exporters: [
      {
        regNo: "EXP-6701-00321",
        companyName: "บริษัท สวนผลไม้ไทย จำกัด",
        factories: ["DOA-2568-33333"],
        gaps: ["GAP-CB-2569-015"],
        countries: ["ฮ่องกง"],
        expDate: "09/01/2570",
      },
    ],
    factories: [
      {
        doaNo: "DOA-2568-33333",
        factoryName: "โรงคัดบรรจุชลบุรีฟาร์ม",
        plantType: "ลำไย",
        province: "ชลบุรี",
        expDate: "01/06/2570",
      },
    ],
    pathogens: [],
    exportDetails: [
      {
        certType: "แต่ละรายการส่งออก (Some)",
        exporterRegNo: "EXP-6701-00321",
        exporterName: "บริษัท สวนผลไม้ไทย จำกัด",
        weight: 2500,
        vehicleType: "เครื่องบิน",
        vehicleName: "TG 628",
        shipments: [
          {
            consignee: "Hong Kong Fruit Trading Ltd.",
            address: "Unit 5, 12/F, Tower A, Kowloon, Hong Kong",
            country: "ฮ่องกง",
            checkpoint: "ด่านท่าอากาศยานสุวรรณภูมิ",
            lotNo: "LOT-2569-015",
            weight: 2500,
            exportDate: "10/01/2569",
          },
        ],
      },
    ],
    totalWeight: 2500,
    totalValue: 120000,
    labTest: "yes",
    labName: "ห้องปฏิบัติการกรมวิชาการเกษตร",
    labProduct: "ลำไย",
    correctionNote:
      "กรุณาแนบเอกสาร GAP Code ที่ยังไม่หมดอายุ และระบุน้ำหนักสุทธิให้ถูกต้อง",
    attachments: [
      { label: "หนังสือรับรองบริษัท (ออกไม่เกิน 6 เดือน)" },
      { label: "ใบรับรอง GAP (หมดอายุ — รอแนบใหม่)" },
    ],
    activityLog: [
      {
        type: "sendback",
        action: "ส่งกลับแก้ไข",
        actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
        timestamp: "12/01/2569 10:30",
        remark:
          "กรุณาแนบเอกสาร GAP Code ที่ยังไม่หมดอายุ และระบุน้ำหนักสุทธิให้ถูกต้อง",
      },
      {
        type: "submit",
        action: "ยื่นคำขอ",
        actor: "นางสาวสมหญิง รักไทย",
        timestamp: "10/01/2569 09:15",
        remark: "",
      },
    ],
  },
};

const appId = route.params.id;
const app = ref(mockApps[appId] ?? mockApps["HC-001"]);

const statusStepMap = {
  submitted: 0,
  under_review: 1,
  correction_required: 1,
  testing: 1,
  pending_approval: 1,
  approved: 1,
  completed: 2,
  rejected: 2,
};

const currentStep = computed(() => statusStepMap[app.value.status] ?? 0);

const timelineSteps = [
  { value: 0, title: "ยื่นคำขอ" },
  { value: 1, title: "รอพิจารณา" },
  { value: 2, title: "ผลการพิจารณา" },
];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function statusColor(s) {
  const m = {
    submitted: "primary",
    under_review: "info",
    testing: "secondary",
    pending_approval: "primary",
    approved: "success",
    completed: "success",
    correction_required: "error",
    rejected: "error",
  };
  return m[s] ?? "grey";
}

function statusIcon(s) {
  const m = {
    submitted: "fas fa-paper-plane",
    under_review: "fas fa-magnifying-glass",
    testing: "fas fa-flask",
    pending_approval: "fas fa-gavel",
    approved: "fas fa-circle-check",
    completed: "fas fa-file-shield",
    correction_required: "fas fa-triangle-exclamation",
    rejected: "fas fa-circle-xmark",
  };
  return m[s] ?? "fas fa-circle";
}

function statusLabel(s) {
  const m = {
    submitted: "ยื่นแล้ว",
    under_review: "อยู่ระหว่างตรวจสอบ",
    testing: "ตรวจ Lab",
    pending_approval: "รอพิจารณา",
    approved: "อนุมัติ — รอชำระเงิน",
    completed: "รับใบรับรองแล้ว",
    correction_required: "ต้องแก้ไข",
    rejected: "ไม่อนุมัติ",
  };
  return m[s] ?? s;
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
      approve: "success",
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
div {
  --step-color: rgb(var(--v-theme-hc-user));
  --step-color-tint: rgba(var(--v-theme-hc-user), 0.2);
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
  background: rgb(var(--v-theme-hc-user)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hc-user)) !important;
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
  min-height: 20px;
}
.activity-content {
  flex: 1;
  min-width: 0;
}
</style>
