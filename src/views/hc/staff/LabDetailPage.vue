<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToLabList"
      />
      <div>
        <h1 class="page-title mb-0">บันทึกผล Lab</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hc-staff font-weight-medium">{{
            app.requestNo
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-btn
        v-if="app.labStatus === 'pass'"
        variant="tonal"
        color="success"
        size="small"
        rounded="lg"
        prepend-icon="fas fa-file-lines"
        @click="labResultDialog = true"
      >
        รายละเอียด
      </v-btn>
      <v-chip :color="labStatusColor(app.labStatus)" variant="tonal">
        <v-icon :icon="labStatusIcon(app.labStatus)" size="13" class="mr-1" />
        {{ labStatusLabel(app.labStatus) }}
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
                    ? 'text-hc-staff font-weight-bold'
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

    <!-- Main content -->
    <v-row>
      <v-col cols="12" md="8">
        <v-tabs v-model="labTab" color="hc-staff" class="mb-4">
          <v-tab value="info" prepend-icon="fas fa-file-lines"
            >ข้อมูลคำขอ</v-tab
          >
          <v-tab value="lab" prepend-icon="fas fa-flask">บันทึกผล Lab</v-tab>
        </v-tabs>

        <v-window v-model="labTab">
          <!-- Tab: ข้อมูลคำขอ -->
          <v-window-item value="info">
            <!-- ข้อมูลคำขอ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon icon="fas fa-list-check" color="hc-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ข้อมูลคำขอ</span>
              </div>
              <v-card-text class="pa-4">
                <v-row dense>
                  <v-col cols="6" md="4">
                    <div class="info-label">เลขคำขอ</div>
                    <div class="info-value text-hc-staff font-weight-bold">
                      {{ app.requestNo }}
                    </div>
                  </v-col>
                  <v-col cols="6" md="4">
                    <div class="info-label">ประเภทคำขอ</div>
                    <div class="info-value">
                      <v-chip size="x-small" color="hc-staff" variant="tonal">{{
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
                          app.registryType === 'has_doa_gap'
                            ? 'success'
                            : 'warning'
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

            <!-- ข้อมูลผู้ส่งออก -->
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
                  <tr v-for="(exp, i) in app.exporters" :key="i">
                    <td class="text-body-2 text-medium-emphasis">
                      {{ i + 1 }}
                    </td>
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
                        <span v-if="!exp.gaps?.length" class="text-body-2"
                          >—</span
                        >
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
                      <v-chip size="x-small" color="hc-staff" variant="tonal"
                        >ส่ง Lab</v-chip
                      >
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">ห้องปฏิบัติการ / Laboratory</div>
                    <div class="info-value">{{ app.labName }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">สินค้า / Product</div>
                    <div class="info-value">{{ app.labProduct }}</div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="info-label">วันที่ส่งตรวจ</div>
                    <div class="info-value">{{ app.sentDate }}</div>
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
                  <tr v-for="(factory, i) in app.factories" :key="i">
                    <td class="text-body-2 text-medium-emphasis">
                      {{ i + 1 }}
                    </td>
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

            <!-- รายการสิ่งที่ต้องระบุในใบรับรอง -->
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
                  <tr v-for="(d, i) in app.exportDetails" :key="i">
                    <td class="text-body-2 text-medium-emphasis">
                      {{ i + 1 }}
                    </td>
                    <td class="text-body-2">{{ d.certType }}</td>
                    <td class="text-body-2 font-weight-bold text-export-staff">
                      {{ d.exporterRegNo }}
                    </td>
                    <td class="text-body-2">{{ d.exporterName }}</td>
                    <td class="text-body-2">{{ d.weight.toLocaleString() }}</td>
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
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon icon="fas fa-paperclip" color="hc-staff" size="15" />
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
                    color="hc-staff"
                    rounded="lg"
                    prepend-icon="fas fa-download"
                  >
                    ดาวน์โหลด
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Tab: บันทึกผล Lab -->
          <v-window-item value="lab">
            <!-- ผลการตรวจ -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon icon="fas fa-flask" color="hc-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold">ผลการตรวจ</span>
              </div>
              <v-card-text class="pa-0">
                <v-expansion-panels
                  v-model="labPanels"
                  multiple
                  variant="accordion"
                >
                  <!-- สารตกค้าง -->
                  <v-expansion-panel value="pesticides" :elevation="0">
                    <v-expansion-panel-title
                      v-slot="{ expanded }"
                      class="py-3"
                      hide-actions
                    >
                      <div class="d-flex align-center ga-2 w-100">
                        <v-checkbox
                          v-model="labResults.pesticides.enabled"
                          density="compact"
                          hide-details
                          color="hc-staff"
                          @click.stop
                        />
                        <span class="text-body-2 font-weight-medium"
                          >สารตกค้าง</span
                        >
                        <v-spacer />
                        <v-chip
                          v-if="
                            labResults.pesticides.enabled && pesticideSummary
                          "
                          :color="
                            pesticideSummary === 'detected'
                              ? 'error'
                              : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{
                            pesticideSummary === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                        <v-icon
                          :icon="
                            expanded
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down'
                          "
                          size="12"
                          class="text-medium-emphasis"
                        />
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="labResults.pesticides.enabled">
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-body-2">รายการ</th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 110px"
                              >
                                Detected
                              </th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 120px"
                              >
                                Not Detected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <template
                              v-for="item in pesticideList"
                              :key="item.id"
                            >
                              <tr>
                                <td>
                                  <div class="d-flex align-center ga-2">
                                    <v-checkbox
                                      v-model="
                                        labResults.pesticides.itemResults[
                                          item.id
                                        ].selected
                                      "
                                      density="compact"
                                      hide-details
                                      color="hc-staff"
                                    />
                                    <span class="text-body-2">{{
                                      item.name
                                    }}</span>
                                  </div>
                                </td>
                                <td class="text-center">
                                  <v-radio-group
                                    v-model="
                                      labResults.pesticides.itemResults[item.id]
                                        .result
                                    "
                                    :disabled="
                                      !labResults.pesticides.itemResults[
                                        item.id
                                      ].selected
                                    "
                                    hide-details
                                    density="compact"
                                    inline
                                    class="d-flex justify-center"
                                  >
                                    <v-radio
                                      value="detected"
                                      color="error"
                                      hide-details
                                    />
                                  </v-radio-group>
                                </td>
                                <td class="text-center">
                                  <v-radio-group
                                    v-model="
                                      labResults.pesticides.itemResults[item.id]
                                        .result
                                    "
                                    :disabled="
                                      !labResults.pesticides.itemResults[
                                        item.id
                                      ].selected
                                    "
                                    hide-details
                                    density="compact"
                                    inline
                                    class="d-flex justify-center"
                                  >
                                    <v-radio
                                      value="not_detected"
                                      color="success"
                                      hide-details
                                    />
                                  </v-radio-group>
                                </td>
                              </tr>
                              <!-- Sub-row: กรณี Detected -->
                              <tr
                                v-if="
                                  labResults.pesticides.itemResults[item.id]
                                    .result === 'detected'
                                "
                              >
                                <td
                                  colspan="4"
                                  class="pa-3"
                                  style="
                                    background: rgba(
                                      var(--v-theme-error),
                                      0.04
                                    );
                                  "
                                >
                                  <div
                                    class="text-body-2 font-weight-medium mb-2 text-error"
                                  >
                                    กรณีที่ตรวจพบ — ระบุชื่อสารและระดับที่ตรวจพบ
                                  </div>
                                  <div
                                    v-for="(chem, idx) in labResults.pesticides
                                      .itemResults[item.id].chemicals"
                                    :key="idx"
                                    class="d-flex ga-2 mb-2 align-center"
                                  >
                                    <v-text-field
                                      v-model="chem.chemical"
                                      variant="outlined"
                                      density="compact"
                                      rounded="lg"
                                      hide-details
                                      placeholder="ชื่อสาร"
                                      style="flex: 2"
                                    />
                                    <v-text-field
                                      v-model="chem.level"
                                      variant="outlined"
                                      density="compact"
                                      rounded="lg"
                                      hide-details
                                      placeholder="ระดับที่ตรวจพบ"
                                      style="flex: 2"
                                    />
                                    <span
                                      class="text-body-2 text-medium-emphasis"
                                      style="width: 48px; flex-shrink: 0"
                                      >mg/kg</span
                                    >
                                    <v-btn
                                      icon="fas fa-trash"
                                      variant="text"
                                      color="error"
                                      size="small"
                                      :disabled="
                                        labResults.pesticides.itemResults[
                                          item.id
                                        ].chemicals.length <= 1
                                      "
                                      @click="
                                        removePesticideChemical(item.id, idx)
                                      "
                                    />
                                  </div>
                                  <v-btn
                                    variant="tonal"
                                    color="hc-staff"
                                    size="small"
                                    rounded="lg"
                                    prepend-icon="fas fa-plus"
                                    @click="addPesticideChemical(item.id)"
                                    >เพิ่ม</v-btn
                                  >
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </v-table>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- จุลินทรีย์ -->
                  <v-expansion-panel value="microbes" :elevation="0">
                    <v-expansion-panel-title
                      v-slot="{ expanded }"
                      class="py-3"
                      hide-actions
                    >
                      <div class="d-flex align-center ga-2 w-100">
                        <v-checkbox
                          v-model="labResults.microbes.enabled"
                          density="compact"
                          hide-details
                          color="hc-staff"
                          @click.stop
                        />
                        <span class="text-body-2 font-weight-medium"
                          >จุลินทรีย์</span
                        >
                        <v-spacer />
                        <v-chip
                          v-if="labResults.microbes.enabled && microbeSummary"
                          :color="
                            microbeSummary === 'detected' ? 'error' : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{
                            microbeSummary === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                        <v-icon
                          :icon="
                            expanded
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down'
                          "
                          size="12"
                          class="text-medium-emphasis"
                        />
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="labResults.microbes.enabled">
                        <div class="d-flex ga-2 mb-2">
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="error"
                            @click="setAllMicrobes('detected')"
                            >Detected ทั้งหมด</v-btn
                          >
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="success"
                            @click="setAllMicrobes('not_detected')"
                            >Not Detected ทั้งหมด</v-btn
                          >
                        </div>
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-body-2">รายการ</th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 110px"
                              >
                                Detected
                              </th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 120px"
                              >
                                Not Detected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <!-- SAL -->
                            <tr>
                              <td class="text-body-2">SAL</td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.microbes.sal"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="detected"
                                    color="error"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.microbes.sal"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="not_detected"
                                    color="success"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                            </tr>
                            <!-- SAL Detected sub-row -->
                            <tr v-if="labResults.microbes.sal === 'detected'">
                              <td
                                colspan="3"
                                class="pa-3"
                                style="
                                  background: rgba(var(--v-theme-error), 0.04);
                                "
                              >
                                <div
                                  class="text-body-2 font-weight-medium mb-2 text-error"
                                >
                                  กรณีที่ตรวจพบ — ระบุระดับที่ตรวจพบ
                                </div>
                                <div class="d-flex ga-2 align-center">
                                  <v-text-field
                                    v-model="labResults.microbes.salLevel"
                                    variant="outlined"
                                    density="compact"
                                    rounded="lg"
                                    hide-details
                                    placeholder="ระดับที่ตรวจพบ"
                                    style="max-width: 200px"
                                  />
                                  <span class="text-body-2 text-medium-emphasis"
                                    >cfu/g</span
                                  >
                                </div>
                              </td>
                            </tr>
                            <!-- E.COLI -->
                            <tr>
                              <td class="text-body-2">E.COLI</td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.microbes.ecoli"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="detected"
                                    color="error"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.microbes.ecoli"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="not_detected"
                                    color="success"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                            </tr>
                            <!-- E.COLI Detected sub-row -->
                            <tr v-if="labResults.microbes.ecoli === 'detected'">
                              <td
                                colspan="3"
                                class="pa-3"
                                style="
                                  background: rgba(var(--v-theme-error), 0.04);
                                "
                              >
                                <div
                                  class="text-body-2 font-weight-medium mb-2 text-error"
                                >
                                  กรณีที่ตรวจพบ — ระบุระดับที่ตรวจพบ
                                </div>
                                <div class="d-flex ga-2 align-center">
                                  <v-text-field
                                    v-model="labResults.microbes.ecoliLevel"
                                    variant="outlined"
                                    density="compact"
                                    rounded="lg"
                                    hide-details
                                    placeholder="ระดับที่ตรวจพบ"
                                    style="max-width: 200px"
                                  />
                                  <span class="text-body-2 text-medium-emphasis"
                                    >cfu/g</span
                                  >
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- GMO -->
                  <v-expansion-panel value="gmo" :elevation="0">
                    <v-expansion-panel-title
                      v-slot="{ expanded }"
                      class="py-3"
                      hide-actions
                    >
                      <div class="d-flex align-center ga-2 w-100">
                        <v-checkbox
                          v-model="labResults.gmo.enabled"
                          density="compact"
                          hide-details
                          color="hc-staff"
                          @click.stop
                        />
                        <span class="text-body-2 font-weight-medium">GMO</span>
                        <v-spacer />
                        <v-chip
                          v-if="labResults.gmo.enabled && gmoSummary"
                          :color="
                            gmoSummary === 'detected' ? 'error' : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{
                            gmoSummary === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                        <v-icon
                          :icon="
                            expanded
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down'
                          "
                          size="12"
                          class="text-medium-emphasis"
                        />
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="labResults.gmo.enabled">
                        <div class="d-flex ga-2 mb-2">
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="error"
                            @click="setAllGMO('detected')"
                            >Detected ทั้งหมด</v-btn
                          >
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="success"
                            @click="setAllGMO('not_detected')"
                            >Not Detected ทั้งหมด</v-btn
                          >
                        </div>
                        <v-alert
                          v-if="gmoSummary === 'detected'"
                          type="warning"
                          variant="tonal"
                          density="compact"
                          rounded="lg"
                          class="mb-3 text-body-2"
                        >
                          สามารถออกใบรับรองได้เฉพาะกรณีเลือก Not Detected
                          เท่านั้น
                        </v-alert>
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-body-2">รายการ</th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 110px"
                              >
                                Detected
                              </th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 120px"
                              >
                                Not Detected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in gmoList" :key="item.id">
                              <td class="text-body-2">{{ item.name }}</td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.gmo.itemResults[item.id]"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="detected"
                                    color="error"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.gmo.itemResults[item.id]"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="not_detected"
                                    color="success"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- ซัลเฟอร์ไดออกไซด์ -->
                  <v-expansion-panel value="sulfur" :elevation="0">
                    <v-expansion-panel-title
                      v-slot="{ expanded }"
                      class="py-3"
                      hide-actions
                    >
                      <div class="d-flex align-center ga-2 w-100">
                        <v-checkbox
                          v-model="labResults.sulfurDioxide.enabled"
                          density="compact"
                          hide-details
                          color="hc-staff"
                          @click.stop
                        />
                        <span class="text-body-2 font-weight-medium"
                          >ซัลเฟอร์ไดออกไซด์</span
                        >
                        <v-spacer />
                        <v-chip
                          v-if="
                            labResults.sulfurDioxide.enabled &&
                            labResults.sulfurDioxide.result
                          "
                          :color="
                            labResults.sulfurDioxide.result === 'detected'
                              ? 'error'
                              : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{
                            labResults.sulfurDioxide.result === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                        <v-icon
                          :icon="
                            expanded
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down'
                          "
                          size="12"
                          class="text-medium-emphasis"
                        />
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="labResults.sulfurDioxide.enabled">
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-body-2">รายการ</th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 110px"
                              >
                                Detected
                              </th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 120px"
                              >
                                Not Detected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td class="text-body-2">ซัลเฟอร์ไดออกไซด์</td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.sulfurDioxide.result"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="detected"
                                    color="error"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                              <td class="text-center">
                                <v-radio-group
                                  v-model="labResults.sulfurDioxide.result"
                                  hide-details
                                  density="compact"
                                  inline
                                  class="d-flex justify-center"
                                >
                                  <v-radio
                                    value="not_detected"
                                    color="success"
                                    hide-details
                                  />
                                </v-radio-group>
                              </td>
                            </tr>
                            <!-- Sub-row: กรณี Detected -->
                            <tr
                              v-if="
                                labResults.sulfurDioxide.result === 'detected'
                              "
                            >
                              <td
                                colspan="3"
                                class="pa-3"
                                style="
                                  background: rgba(var(--v-theme-error), 0.04);
                                "
                              >
                                <div
                                  class="text-body-2 font-weight-medium mb-2 text-error"
                                >
                                  กรณีที่ตรวจพบ — ระบุระดับที่ตรวจพบ
                                </div>
                                <div class="d-flex ga-2 align-center">
                                  <v-text-field
                                    v-model="labResults.sulfurDioxide.level"
                                    variant="outlined"
                                    density="compact"
                                    rounded="lg"
                                    hide-details
                                    placeholder="ระดับที่ตรวจพบ"
                                    style="max-width: 200px"
                                  />
                                  <span class="text-body-2 text-medium-emphasis"
                                    >mg/kg</span
                                  >
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- อัลฟาท็อกซิน -->
                  <v-expansion-panel value="aflatoxin" :elevation="0">
                    <v-expansion-panel-title
                      v-slot="{ expanded }"
                      class="py-3"
                      hide-actions
                    >
                      <div class="d-flex align-center ga-2 w-100">
                        <v-checkbox
                          v-model="labResults.aflatoxin.enabled"
                          density="compact"
                          hide-details
                          color="hc-staff"
                          @click.stop
                        />
                        <span class="text-body-2 font-weight-medium"
                          >อัลฟาท็อกซิน</span
                        >
                        <v-spacer />
                        <v-chip
                          v-if="
                            labResults.aflatoxin.enabled && aflatoxinSummary
                          "
                          :color="
                            aflatoxinSummary === 'detected'
                              ? 'error'
                              : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{
                            aflatoxinSummary === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                        <v-icon
                          :icon="
                            expanded
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down'
                          "
                          size="12"
                          class="text-medium-emphasis"
                        />
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="labResults.aflatoxin.enabled">
                        <div class="d-flex ga-2 mb-2">
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="error"
                            @click="setAllAflatoxin('detected')"
                            >Detected ทั้งหมด</v-btn
                          >
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="success"
                            @click="setAllAflatoxin('not_detected')"
                            >Not Detected ทั้งหมด</v-btn
                          >
                        </div>
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-body-2">ชนิด</th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 110px"
                              >
                                Detected
                              </th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 120px"
                              >
                                Not Detected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <template
                              v-for="type in aflatoxinTypeList"
                              :key="type.id"
                            >
                              <tr>
                                <td class="text-body-2">{{ type.name }}</td>
                                <td class="text-center">
                                  <v-radio-group
                                    v-model="
                                      labResults.aflatoxin.typeResults[type.id]
                                        .result
                                    "
                                    hide-details
                                    density="compact"
                                    inline
                                    class="d-flex justify-center"
                                  >
                                    <v-radio
                                      value="detected"
                                      color="error"
                                      hide-details
                                    />
                                  </v-radio-group>
                                </td>
                                <td class="text-center">
                                  <v-radio-group
                                    v-model="
                                      labResults.aflatoxin.typeResults[type.id]
                                        .result
                                    "
                                    hide-details
                                    density="compact"
                                    inline
                                    class="d-flex justify-center"
                                  >
                                    <v-radio
                                      value="not_detected"
                                      color="success"
                                      hide-details
                                    />
                                  </v-radio-group>
                                </td>
                              </tr>
                              <!-- Sub-row: กรณี Detected -->
                              <tr
                                v-if="
                                  labResults.aflatoxin.typeResults[type.id]
                                    .result === 'detected'
                                "
                              >
                                <td
                                  colspan="3"
                                  class="pa-3"
                                  style="
                                    background: rgba(
                                      var(--v-theme-error),
                                      0.04
                                    );
                                  "
                                >
                                  <div
                                    class="text-body-2 font-weight-medium mb-2 text-error"
                                  >
                                    กรณีที่ตรวจพบ — ระบุระดับที่ตรวจพบ
                                  </div>
                                  <div class="d-flex ga-2 align-center">
                                    <v-text-field
                                      v-model="
                                        labResults.aflatoxin.typeResults[
                                          type.id
                                        ].level
                                      "
                                      variant="outlined"
                                      density="compact"
                                      rounded="lg"
                                      hide-details
                                      placeholder="ระดับที่ตรวจพบ"
                                      style="max-width: 200px"
                                    />
                                    <span
                                      class="text-body-2 text-medium-emphasis"
                                      >µg/kg</span
                                    >
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </v-table>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>

                  <!-- สารพิษตกค้าง -->
                  <v-expansion-panel value="toxins" :elevation="0">
                    <v-expansion-panel-title
                      v-slot="{ expanded }"
                      class="py-3"
                      hide-actions
                    >
                      <div class="d-flex align-center ga-2 w-100">
                        <v-checkbox
                          v-model="labResults.toxins.enabled"
                          density="compact"
                          hide-details
                          color="hc-staff"
                          @click.stop
                        />
                        <span class="text-body-2 font-weight-medium"
                          >สารพิษตกค้าง</span
                        >
                        <v-spacer />
                        <v-chip
                          v-if="labResults.toxins.enabled && toxinSummary"
                          :color="
                            toxinSummary === 'detected' ? 'error' : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                          class="mr-2"
                        >
                          {{
                            toxinSummary === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                        <v-icon
                          :icon="
                            expanded
                              ? 'fas fa-chevron-up'
                              : 'fas fa-chevron-down'
                          "
                          size="12"
                          class="text-medium-emphasis"
                        />
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div v-if="labResults.toxins.enabled">
                        <div class="d-flex ga-2 mb-2">
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="error"
                            @click="setAllToxins('detected')"
                            >Detected ทั้งหมด</v-btn
                          >
                          <v-btn
                            size="x-small"
                            variant="tonal"
                            color="success"
                            @click="setAllToxins('not_detected')"
                            >Not Detected ทั้งหมด</v-btn
                          >
                        </div>
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-body-2">สาร</th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 110px"
                              >
                                Detected
                              </th>
                              <th
                                class="text-body-2 text-center"
                                style="width: 120px"
                              >
                                Not Detected
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <template v-for="item in toxinList" :key="item.id">
                              <tr>
                                <td class="text-body-2">{{ item.name }}</td>
                                <td class="text-center">
                                  <v-radio-group
                                    v-model="
                                      labResults.toxins.itemResults[item.id]
                                        .result
                                    "
                                    hide-details
                                    density="compact"
                                    inline
                                    class="d-flex justify-center"
                                  >
                                    <v-radio
                                      value="detected"
                                      color="error"
                                      hide-details
                                    />
                                  </v-radio-group>
                                </td>
                                <td class="text-center">
                                  <v-radio-group
                                    v-model="
                                      labResults.toxins.itemResults[item.id]
                                        .result
                                    "
                                    hide-details
                                    density="compact"
                                    inline
                                    class="d-flex justify-center"
                                  >
                                    <v-radio
                                      value="not_detected"
                                      color="success"
                                      hide-details
                                    />
                                  </v-radio-group>
                                </td>
                              </tr>
                              <!-- Sub-row: กรณี Detected -->
                              <tr
                                v-if="
                                  labResults.toxins.itemResults[item.id]
                                    .result === 'detected'
                                "
                              >
                                <td
                                  colspan="3"
                                  class="pa-3"
                                  style="
                                    background: rgba(
                                      var(--v-theme-error),
                                      0.04
                                    );
                                  "
                                >
                                  <div
                                    class="text-body-2 font-weight-medium mb-2 text-error"
                                  >
                                    กรณีที่ตรวจพบ — ระบุระดับที่ตรวจพบ
                                  </div>
                                  <div class="d-flex ga-2 align-center">
                                    <v-text-field
                                      v-model="
                                        labResults.toxins.itemResults[item.id]
                                          .level
                                      "
                                      variant="outlined"
                                      density="compact"
                                      rounded="lg"
                                      hide-details
                                      placeholder="ระดับที่ตรวจพบ"
                                      style="max-width: 200px"
                                    />
                                    <span
                                      class="text-body-2 text-medium-emphasis"
                                      >mg/kg</span
                                    >
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </tbody>
                        </v-table>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>

            <!-- เอกสารเพิ่มเติม -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon icon="fas fa-paperclip" color="hc-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >เอกสารเพิ่มเติม</span
                >
                <span class="text-caption text-error ml-1"
                  >*ต้องแนบอย่างน้อย 1 ไฟล์</span
                >
              </div>
              <v-card-text class="pa-4">
                <div class="d-flex ga-2 mb-3 align-center flex-wrap">
                  <v-select
                    v-model="newDocType"
                    :items="docTypeOptions"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    style="min-width: 200px; max-width: 240px"
                  />
                  <v-file-input
                    v-model="newDocFile"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    placeholder="เลือกไฟล์"
                    accept=".pdf,.jpg,.jpeg,.png"
                    prepend-icon=""
                    prepend-inner-icon="fas fa-paperclip"
                    style="flex: 1; min-width: 160px"
                  />
                  <v-btn
                    color="hc-staff"
                    variant="tonal"
                    rounded="lg"
                    size="small"
                    prepend-icon="fas fa-plus"
                    :disabled="!newDocFile"
                    @click="addDocument"
                    >แนบ</v-btn
                  >
                </div>
                <div v-if="additionalDocs.length">
                  <div
                    v-for="(doc, idx) in additionalDocs"
                    :key="idx"
                    class="d-flex align-center ga-2 py-2"
                    style="border-bottom: 1px solid rgba(0, 0, 0, 0.06)"
                  >
                    <v-icon icon="fas fa-file" size="14" color="hc-staff" />
                    <span class="text-body-2 flex-grow-1 text-truncate">{{
                      doc.name
                    }}</span>
                    <v-chip size="x-small" variant="tonal" color="hc-staff">{{
                      doc.type
                    }}</v-chip>
                    <v-btn
                      icon="fas fa-trash"
                      variant="text"
                      color="error"
                      size="x-small"
                      @click="removeDocument(idx)"
                    />
                  </div>
                </div>
                <div
                  v-else
                  class="text-body-2 text-medium-emphasis text-center py-3"
                >
                  ยังไม่มีเอกสารที่แนบ
                </div>
              </v-card-text>
            </v-card>

            <!-- Action buttons -->
            <v-row class="ga-2" no-gutters>
              <v-col cols="auto">
                <v-btn
                  variant="tonal"
                  color="grey"
                  rounded="lg"
                  prepend-icon="fas fa-arrow-left"
                  @click="goToLabList"
                  >ย้อนกลับ</v-btn
                >
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <v-btn
                  :color="overallLabColor"
                  variant="flat"
                  rounded="lg"
                  prepend-icon="fas fa-floppy-disk"
                  @click="confirmDialog = true"
                  >บันทึกผล</v-btn
                >
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-col>

      <!-- Right sidebar -->
      <v-col cols="12" md="4">
        <div class="sticky-col">
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <div class="section-header px-4 py-3 d-flex align-center ga-2">
              <v-icon
                icon="fas fa-clock-rotate-left"
                color="hc-staff"
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
                      >
                        {{ eventLabel(event.type) }}
                      </v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      <v-icon icon="fas fa-user" size="9" class="mr-1" />{{
                        event.actor
                      }}
                    </div>
                    <div
                      v-if="event.timestamp"
                      class="text-caption text-medium-emphasis mt-1"
                    >
                      <v-icon icon="fas fa-calendar" size="9" class="mr-1" />{{
                        event.timestamp
                      }}
                    </div>
                    <v-btn
                      v-if="
                        event.type !== 'submit' && event.type !== 'lab_pending'
                      "
                      size="x-small"
                      variant="text"
                      color="hc-staff"
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

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            :style="{
              background: `rgba(var(--v-theme-${overallLabColor}), 0.1)`,
            }"
          >
            <v-icon
              :icon="
                overallLabResult === 'pass'
                  ? 'fas fa-floppy-disk'
                  : 'fas fa-circle-xmark'
              "
              :color="overallLabColor"
              size="28"
            />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันบันทึกผล Lab</h3>
          <p class="text-body-2 text-medium-emphasis">
            <strong
              v-if="overallLabResult === 'fail'"
              class="text-error d-block mb-1"
            >
              ผลการตรวจ: ไม่ผ่าน
            </strong>
            ยืนยันการส่งคำขอนี้ไปยังขั้นตอนพิจารณาใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                rounded="lg"
                @click="confirmDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                :color="overallLabColor"
                block
                rounded="lg"
                @click="submitLabResult"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Lab Result Detail Dialog -->
    <v-dialog v-model="labResultDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-3 mb-4">
            <div
              class="rounded-lg d-flex align-center justify-center"
              style="
                width: 40px;
                height: 40px;
                background: rgba(var(--v-theme-success), 0.12);
                flex-shrink: 0;
              "
            >
              <v-icon icon="fas fa-flask" color="success" size="18" />
            </div>
            <div>
              <div class="text-subtitle-2 font-weight-bold">
                รายละเอียดผลการตรวจ Lab
              </div>
              <div class="text-caption text-medium-emphasis">
                Lab Result Details
              </div>
            </div>
          </div>
          <v-divider class="mb-4" />
          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ห้องปฏิบัติการ / Laboratory
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ app.labName }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                สินค้าที่ส่งตรวจ / Product
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ app.labProduct }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                วันที่ส่งตรวจ / Sent Date
              </div>
              <div class="text-body-2 font-weight-medium">
                {{ app.sentDate }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผลการตรวจ / Result
              </div>
              <v-chip color="success" variant="tonal" size="small">ผ่าน</v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 pt-0">
          <v-btn
            color="hc-staff"
            variant="tonal"
            rounded="lg"
            block
            @click="labResultDialog = false"
            >ปิด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ดำเนินการสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ส่งคำขอเพื่อพิจารณาร้อยแล้ว
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="hc-staff" rounded="lg" block @click="goToLabList">
            กลับรายการรอตรวจ Lab
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                >{{ eventLabel(selectedEvent.type) }}</v-chip
              >
            </div>
          </div>
          <v-divider class="mb-4" />
          <div class="d-flex flex-column ga-3">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผู้ดำเนินการ
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-user" size="12" class="mr-1" />{{
                  selectedEvent?.actor
                }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                วันที่ / เวลา
              </div>
              <div class="text-body-2">
                <v-icon icon="fas fa-calendar" size="12" class="mr-1" />{{
                  selectedEvent?.timestamp
                }}
              </div>
            </div>
            <div>
              <div class="text-caption text-medium-emphasis mb-1">
                ผลการพิจารณา
              </div>
              <v-chip
                v-if="selectedEvent"
                size="small"
                :color="eventColor(selectedEvent.type)"
                variant="tonal"
              >
                {{ eventLabel(selectedEvent.type) }}
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
            color="hc-staff"
            variant="tonal"
            rounded="lg"
            block
            @click="activityDetailDialog = false"
            >ปิด</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStaffSessionStore } from "@/stores/staff-session.store";

const router = useRouter();
const route = useRoute();
const staffSessionStore = useStaffSessionStore();

function goToLabList() {
  router.push({ name: "HCstaffLabList" });
}

const labTab = ref("info");
const confirmDialog = ref(false);
const successDialog = ref(false);
const labResultDialog = ref(false);
const activityDetailDialog = ref(false);
const selectedEvent = ref(null);
const exportDetailDialog = ref(false);
const selectedExportDetail = ref(null);
const resultDateMenu = ref(false);

const labForm = reactive({
  result: "pass",
  resultDate: null,
  reportNo: "",
  remark: "",
  files: [],
});

const resultDateBE = computed(() => {
  if (!labForm.resultDate) return "";
  const d = labForm.resultDate;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
});

// --- Lab Results Detail ---
const labPanels = ref([]);

const pesticideList = [
  { id: 1, name: "สารตกค้างลำดับที่ 1" },
  { id: 2, name: "สารตกค้างลำดับที่ 2" },
  { id: 3, name: "สารตกค้างลำดับที่ 3" },
  { id: 4, name: "สารตกค้างลำดับที่ 4" },
  { id: 5, name: "สารตกค้างลำดับที่ 5" },
];

const gmoList = [
  { id: 1, name: "รายการที่ 1" },
  { id: 2, name: "รายการที่ 2" },
];

const aflatoxinTypeList = [
  { id: 1, name: "ชนิดที่ 1" },
  { id: 2, name: "ชนิดที่ 2" },
  { id: 3, name: "ชนิดที่ 3" },
  { id: 4, name: "ชนิดที่ 4" },
  { id: 5, name: "ชนิดที่ 5" },
];

const toxinList = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `สารที่ ${i + 1}`,
}));

const pesticideItemResults = reactive(
  Object.fromEntries(
    pesticideList.map((item) => [
      item.id,
      {
        selected: false,
        result: null,
        chemicals: [{ chemical: "", level: "" }],
      },
    ]),
  ),
);
const gmoItemResults = reactive(
  Object.fromEntries(gmoList.map((item) => [item.id, null])),
);
const aflatoxinTypeResults = reactive(
  Object.fromEntries(
    aflatoxinTypeList.map((t) => [t.id, { result: null, level: "" }]),
  ),
);
const toxinItemResults = reactive(
  Object.fromEntries(
    toxinList.map((item) => [item.id, { result: null, level: "" }]),
  ),
);

const labResults = reactive({
  pesticides: {
    enabled: false,
    itemResults: pesticideItemResults,
  },
  microbes: {
    enabled: false,
    sal: null,
    salLevel: "",
    ecoli: null,
    ecoliLevel: "",
  },
  gmo: {
    enabled: false,
    itemResults: gmoItemResults,
  },
  sulfurDioxide: {
    enabled: false,
    result: null,
    level: "",
  },
  aflatoxin: {
    enabled: false,
    typeResults: aflatoxinTypeResults,
  },
  toxins: {
    enabled: false,
    itemResults: toxinItemResults,
  },
});

// Sync expansion panels with checkbox state
const panelEnabledMap = {
  pesticides: () => labResults.pesticides.enabled,
  microbes: () => labResults.microbes.enabled,
  gmo: () => labResults.gmo.enabled,
  sulfur: () => labResults.sulfurDioxide.enabled,
  aflatoxin: () => labResults.aflatoxin.enabled,
  toxins: () => labResults.toxins.enabled,
};

Object.entries(panelEnabledMap).forEach(([panel, getter]) => {
  watch(getter, (val) => {
    if (val) {
      if (!labPanels.value.includes(panel)) labPanels.value.push(panel);
    } else {
      labPanels.value = labPanels.value.filter((p) => p !== panel);
    }
  });
});

const pesticideSummary = computed(() => {
  const selected = pesticideList.filter(
    (item) => labResults.pesticides.itemResults[item.id].selected,
  );
  if (!selected.length) return null;
  return selected.some(
    (item) => labResults.pesticides.itemResults[item.id].result === "detected",
  )
    ? "detected"
    : "not_detected";
});

const microbeSummary = computed(() => {
  if (labResults.microbes.sal === null && labResults.microbes.ecoli === null)
    return null;
  return labResults.microbes.sal === "detected" ||
    labResults.microbes.ecoli === "detected"
    ? "detected"
    : "not_detected";
});

const gmoSummary = computed(() => {
  const results = gmoList
    .map((item) => labResults.gmo.itemResults[item.id])
    .filter((r) => r !== null);
  if (!results.length) return null;
  return results.some((r) => r === "detected") ? "detected" : "not_detected";
});

const aflatoxinSummary = computed(() => {
  const results = aflatoxinTypeList
    .map((t) => labResults.aflatoxin.typeResults[t.id].result)
    .filter((r) => r !== null);
  if (!results.length) return null;
  return results.some((r) => r === "detected") ? "detected" : "not_detected";
});

const toxinSummary = computed(() => {
  const results = toxinList
    .map((item) => labResults.toxins.itemResults[item.id].result)
    .filter((r) => r !== null);
  if (!results.length) return null;
  return results.some((r) => r === "detected") ? "detected" : "not_detected";
});

const overallLabResult = computed(() => {
  if (labResults.gmo.enabled && gmoSummary.value === "detected") return "fail";
  return "pass";
});

const overallLabColor = computed(() =>
  overallLabResult.value === "pass" ? "hc-staff" : "error",
);

// เอกสารเพิ่มเติม
const docTypeOptions = [
  "ผลทดสอบ",
  "ใบสุ่มตัวอย่าง",
  "คำผลิบ",
  "รูปภาพการปฏิบัติงานเฉพาะสำหรับลำไย",
  "อื่น ๆ",
];
const newDocType = ref("ผลทดสอบ");
const newDocFile = ref(null);
const additionalDocs = ref([]);

function setAllMicrobes(result) {
  labResults.microbes.sal = result;
  labResults.microbes.ecoli = result;
}

function setAllGMO(result) {
  gmoList.forEach((item) => {
    labResults.gmo.itemResults[item.id] = result;
  });
}

function setAllAflatoxin(result) {
  aflatoxinTypeList.forEach((t) => {
    labResults.aflatoxin.typeResults[t.id].result = result;
  });
}

function setAllToxins(result) {
  toxinList.forEach((item) => {
    labResults.toxins.itemResults[item.id].result = result;
  });
}

function addDocument() {
  if (!newDocFile.value) return;
  const file = Array.isArray(newDocFile.value)
    ? newDocFile.value[0]
    : newDocFile.value;
  if (!file) return;
  additionalDocs.value.push({ file, type: newDocType.value, name: file.name });
  newDocFile.value = null;
}

function removeDocument(idx) {
  additionalDocs.value.splice(idx, 1);
}

function addPesticideChemical(itemId) {
  labResults.pesticides.itemResults[itemId].chemicals.push({
    chemical: "",
    level: "",
  });
}

function removePesticideChemical(itemId, idx) {
  const chemicals = labResults.pesticides.itemResults[itemId].chemicals;
  if (chemicals.length > 1) {
    chemicals.splice(idx, 1);
  }
}

function openExportDetail(detail) {
  selectedExportDetail.value = detail;
  exportDetailDialog.value = true;
}

function openActivityDetail(event) {
  selectedEvent.value = event;
  activityDetailDialog.value = true;
}

function submitLabResult() {
  confirmDialog.value = false;
  successDialog.value = true;
}

const timelineSteps = [
  { value: 0, title: "ตรวจคำขอ" },
  { value: 1, title: "ตรวจ Lab" },
  { value: 2, title: "พิจารณา Lab" },
  { value: 3, title: "พิจารณา" },
  { value: 4, title: "ลงนาม" },
];

const mockApps = {
  "HC-013": {
    id: "HC-013",
    requestNo: "HC-013",
    requestType: "ขอใบรับรอง",
    labStatus: "pending",
    submittedAt: "10/03/2569",
    agency: "สำนักงานเกษตรจังหวัดกรุงเทพมหานคร",
    registryType: "has_doa_gap",
    exportDuration: "7 วัน",
    dateStart: "10/03/2569",
    dateEnd: "17/03/2569",
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
        regNo: "EXP-2568-00123",
        companyName: "บริษัท ไทยฟรุ๊ต จำกัด",
        factories: ["DOA-2568-11111"],
        gaps: ["GAP-CM-2569-001"],
        countries: ["จีน", "ญี่ปุ่น"],
        expDate: "14/01/2570",
      },
    ],
    factories: [
      {
        doaNo: "DOA-2568-11111",
        factoryName: "โรงคัดบรรจุเชียงใหม่ฟาร์ม",
        plantType: "มะม่วง",
        province: "กรุงเทพมหานคร",
        expDate: "01/06/2570",
      },
    ],
    pathogens: ["Salmonella spp.", "E.coli"],
    exportDetails: [
      {
        certType: "คลุมทั้งการส่งออก (All)",
        exporterRegNo: "EXP-2568-00123",
        exporterName: "บริษัท ไทยฟรุ๊ต จำกัด",
        weight: 3000,
        vehicleType: "เรือ",
        vehicleName: "THAI STAR 002",
        shipments: [
          {
            consignee: "Beijing Fresh Import Co., Ltd.",
            address: "No.12 Chaoyang Rd., Beijing, China",
            country: "จีน",
            checkpoint: "ด่านท่าเรือแหลมฉบัง",
            lotNo: "LOT-2569-013",
            weight: 3000,
            exportDate: "10/03/2569",
          },
        ],
      },
    ],
    totalWeight: 3000,
    totalValue: 180000,
    labTest: "yes",
    labName: "ห้องปฏิบัติการกลางกรมวิชาการเกษตร",
    labProduct: "มะม่วง",
    sentDate: "25/03/2569",
    attachments: [{ label: "เอกสารอื่นๆ" }],
    activityLog: [
      {
        type: "lab_pending",
        action: "กำลังตรวจ Lab",
        actor: staffSessionStore.displayName || "เจ้าหน้าที่",
        timestamp: "25/03/2569 09:15",
        remark: "",
      },
      {
        type: "checking",
        action: "ผ่านการตรวจ",
        actor: staffSessionStore.displayName || "เจ้าหน้าที่",
        timestamp: "12/03/2569 14:00",
        remark: "",
      },
      {
        type: "submit",
        action: "ยื่นคำขอ",
        actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
        timestamp: "10/03/2569 10:30",
        remark: "",
      },
    ],
  },
};

const appId = route.params.id;
const app = ref(mockApps[appId] ?? mockApps["HC-013"]);

const currentStep = computed(() => 1);

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      forward: "fas fa-share",
      review: "fas fa-magnifying-glass",
      checking: "fas fa-share",
      pending: "fas fa-clock",
      lab_pending: "fas fa-flask",
      approve: "fas fa-circle-check",
      reject: "fas fa-circle-xmark",
      sendback: "fas fa-rotate-left",
    }[type] ?? "fas fa-circle"
  );
}

function eventColor(type) {
  return (
    {
      submit: "hc-staff",
      receive: "info",
      forward: "hc-staff",
      review: "warning",
      checking: "success",
      pending: "warning",
      lab_pending: "hc-staff",
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
      forward: "ส่งต่อ",
      review: "กำลังพิจารณา",
      checking: "ผ่าน",
      pending: "รอพิจารณา",
      lab_pending: "กำลังตรวจ Lab",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
    }[type] ?? type
  );
}

function labStatusColor(s) {
  return { pending: "warning", pass: "success", fail: "error" }[s] ?? "grey";
}
function labStatusIcon(s) {
  return (
    {
      pending: "fas fa-clock",
      pass: "fas fa-circle-check",
      fail: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function labStatusLabel(s) {
  return { pending: "รอผล Lab", pass: "ผ่าน", fail: "ไม่ผ่าน" }[s] ?? s;
}
</script>

<style scoped>
.step-done,
.step-active {
  background: rgb(var(--v-theme-hc-staff)) !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-staff), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hc-staff)) !important;
}
.confirm-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: rgb(var(--v-theme-hc-staff));
}
.activity-dot--review {
  background: rgb(var(--v-theme-warning));
}
.activity-dot--checking {
  background: rgb(var(--v-theme-hc-staff));
}
.activity-dot--lab_pending {
  background: rgb(var(--v-theme-hc-staff));
  animation: pulse-lab 1.6s ease-in-out infinite;
}
@keyframes pulse-lab {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-hc-staff), 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(var(--v-theme-hc-staff), 0);
  }
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
.sticky-col {
  position: sticky;
  top: 80px;
}
.item-row {
  background: rgba(var(--v-theme-hc-staff), 0.03);
}
</style>
