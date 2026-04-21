<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToApplicationList"
      />
      <div>
        <h1 class="page-title mb-0">รายละเอียดคำขอ</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hc-staff font-weight-medium">{{
            app.requestNo
          }}</span>
        </p>
      </div>
      <v-spacer />
      <v-btn
        variant="tonal"
        color="info"
        rounded="lg"
        size="small"
        prepend-icon="fas fa-file-pdf"
      >
        พิมพ์ PDF
      </v-btn>
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

    <!-- ── Step 0: ตรวจคำขอ ── -->
    <template v-if="currentStep === 0">
      <v-row>
        <v-col cols="12" md="8">
          <v-tabs v-model="reviewTab" color="hc-staff" class="mb-4">
            <v-tab value="info" prepend-icon="fas fa-file-lines"
              >ข้อมูลคำขอ</v-tab
            >
            <v-tab value="review" prepend-icon="fas fa-clipboard-check"
              >บันทึกผลการตรวจ</v-tab
            >
          </v-tabs>

          <v-window v-model="reviewTab">
            <!-- Tab: ข้อมูลคำขอ -->
            <v-window-item value="info">
              <!-- ข้อมูลคำขอ -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon icon="fas fa-list-check" color="hc-staff" size="15" />
                  <span class="text-subtitle-2 font-weight-bold"
                    >ข้อมูลคำขอ</span
                  >
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
                        <v-chip
                          size="x-small"
                          color="hc-staff"
                          variant="tonal"
                          >{{ app.requestType }}</v-chip
                        >
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
                          <span
                            v-if="!exp.factories?.length"
                            class="text-body-2"
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
                        <v-chip
                          size="x-small"
                          :color="app.labTest === 'yes' ? 'hc-staff' : 'grey'"
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

              <!-- รายละเอียดการส่งออกสินค้า (พก.11.1) -->
              <v-card rounded="xl" elevation="0" class="section-card mb-4">
                <div class="section-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon
                    icon="fas fa-file-export"
                    color="hc-staff"
                    size="15"
                  />
                  <span class="text-subtitle-2 font-weight-bold"
                    >รายละเอียดการส่งออกสินค้า (พก.11.1)</span
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
                      <td
                        class="text-body-2 font-weight-bold text-export-staff"
                      >
                        {{ d.exporterRegNo }}
                      </td>
                      <td class="text-body-2">{{ d.exporterName }}</td>
                      <td class="text-body-2">
                        {{ d.weight.toLocaleString() }}
                      </td>
                      <td>
                        <div class="d-flex ga-1 justify-end">
                          <v-tooltip text="ดูข้อมูล" location="top">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="x-small"
                                variant="text"
                                color="hc-staff"
                                @click="openExportDetail(d)"
                              >
                                <v-icon icon="fas fa-eye" size="14" />
                              </v-btn>
                            </template>
                          </v-tooltip>
                          <v-tooltip text="ดาวน์โหลด" location="top">
                            <template #activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="x-small"
                                variant="text"
                                color="hc-staff"
                              >
                                <v-icon icon="fas fa-download" size="14" />
                              </v-btn>
                            </template>
                          </v-tooltip>
                        </div>
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
                  <span class="text-subtitle-2 font-weight-bold"
                    >เอกสารแนบ</span
                  >
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

            <!-- Tab: ผลการตรวจ -->
            <v-window-item value="review">
              <v-card rounded="xl" elevation="0" class="section-card">
                <v-card-text class="pa-5">
                  <!-- ผลการตรวจ -->
                  <div class="field-label mb-1">
                    <div>ผลการตรวจ</div>
                    <div class="field-label-en">Review Result</div>
                  </div>
                  <v-radio-group
                    v-model="review.decision"
                    color="hc-staff"
                    inline
                  >
                    <v-radio value="pass" class="mr-6">
                      <template #label>
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-circle-check"
                            color="success"
                            size="18"
                          />
                          <span class="font-weight-medium">อนุมัติ</span>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio value="improve" class="mr-6">
                      <template #label>
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-circle-exclamation"
                            color="warning"
                            size="18"
                          />
                          <span class="font-weight-medium">ปรับปรุง</span>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio value="fail">
                      <template #label>
                        <div class="d-flex align-center ga-2">
                          <v-icon
                            icon="fas fa-circle-xmark"
                            color="error"
                            size="18"
                          />
                          <span class="font-weight-medium">ไม่อนุมัติ</span>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>

                  <!-- หมายเหตุ -->
                  <div class="field-label mb-1">
                    <div>หมายเหตุ</div>
                    <div class="field-label-en">Remarks</div>
                  </div>
                  <v-textarea
                    v-model="review.remark"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    rows="4"
                    placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                    class="mb-5"
                  />

                  <!-- แก้ไขภายในวันที่ (เฉพาะ ปรับปรุง) -->
                  <template v-if="review.decision === 'improve'">
                    <div class="field-label mb-1">
                      <div>แก้ไขภายในวันที่</div>
                      <div class="field-label-en">Deadline</div>
                    </div>
                    <v-menu
                      v-model="deadlineMenu"
                      :close-on-content-click="false"
                      min-width="0"
                    >
                      <template #activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          :model-value="deadlineBE"
                          variant="outlined"
                          density="compact"
                          rounded="lg"
                          hide-details
                          readonly
                          placeholder="วว/ดด/ปปปป"
                          prepend-inner-icon="fas fa-calendar"
                          class="mb-1"
                        />
                      </template>
                      <v-date-picker
                        v-model="review.deadline"
                        hide-header
                        locale="th"
                        @update:model-value="deadlineMenu = false"
                      />
                    </v-menu>
                    <div
                      v-if="review.deadline"
                      class="text-caption text-medium-emphasis mb-4"
                    >
                      จำนวน {{ deadlineDays }} วัน นับจากวันนี้
                    </div>
                  </template>

                  <!-- Action buttons -->
                  <v-row class="ga-2" no-gutters>
                    <v-col v-if="review.decision === 'improve'">
                      <v-btn
                        color="warning"
                        variant="tonal"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-rotate-left"
                        @click="sendBackDialog = true"
                      >
                        ส่งกลับแก้ไข
                      </v-btn>
                    </v-col>
                    <v-col v-if="review.decision === 'fail'">
                      <v-btn
                        color="error"
                        variant="tonal"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-circle-xmark"
                        @click="rejectDialog = true"
                      >
                        ส่งผลไม่ผ่าน
                      </v-btn>
                    </v-col>
                    <v-col
                      v-if="review.decision === 'pass' && app.labTest === 'yes'"
                    >
                      <v-btn
                        color="info"
                        variant="flat"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-flask"
                        @click="sendToLabDialog = true"
                      >
                        ส่งไปตรวจ Lab
                      </v-btn>
                    </v-col>
                    <v-col
                      v-if="review.decision === 'pass' && app.labTest !== 'yes'"
                    >
                      <v-btn
                        color="hc-staff"
                        variant="flat"
                        block
                        rounded="lg"
                        prepend-icon="fas fa-paper-plane"
                        @click="saveReviewDialog = true"
                      >
                        ส่งต่อพิจารณา
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <!-- Right sidebar -->
        <v-col cols="12" md="4">
          <div class="sticky-col">
            <!-- ความคืบหน้าคำขอ -->
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
                        <v-icon
                          icon="fas fa-calendar"
                          size="9"
                          class="mr-1"
                        />{{ event.timestamp }}
                      </div>
                      <v-btn
                        v-if="
                          event.type !== 'submit' && event.type !== 'checking'
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
    </template>

    <!-- Confirm Dialog: ส่งไปตรวจ Lab -->
    <v-dialog v-model="sendToLabDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-info), 0.1)"
          >
            <v-icon icon="fas fa-flask" size="28" color="hc-staff" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งไปตรวจ Lab</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้ไปยังห้องปฏิบัติการ
            <span class="font-weight-medium text-on-surface">{{
              app.labName
            }}</span>
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
                @click="sendToLabDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="hc-staff"
                block
                rounded="lg"
                @click="submitSendToLab"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
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
                รายละเอียดการส่งออกสินค้า (พก.11.1)
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

    <!-- Confirm Dialog: ส่งต่อพิจารณา (ผ่าน) -->
    <v-dialog v-model="saveReviewDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" size="28" color="hc-staff" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งต่อพิจารณา</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอนี้ไปยังเจ้าหน้าที่พิจารณา
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
                @click="saveReviewDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="hc-staff"
                block
                rounded="lg"
                @click="submitSaveReview"
              >
                ยืนยัน
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ส่งกลับแก้ไข (ปรับปรุง) -->
    <v-dialog v-model="sendBackDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-rotate-left" size="28" color="warning" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งกลับแก้ไข</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอกลับให้ผู้ยื่นแก้ไข
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
                @click="sendBackDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="warning" block rounded="lg" @click="submitSendBack"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ส่งผลไม่ผ่าน (ไม่ผ่าน) -->
    <v-dialog v-model="rejectDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-circle-xmark" size="28" color="error" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งผลไม่ผ่าน</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งผลการตรวจ "ไม่ผ่าน" กลับให้ผู้ยื่นคำขอ
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
                @click="rejectDialog = false"
              >
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="error" block rounded="lg" @click="submitReject"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
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
            {{ successMessage }}
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="hc-staff"
            rounded="lg"
            block
            @click="goToApplicationList"
          >
            กลับรายการคำขอ
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
          >
            ปิด
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStaffSessionStore } from "@/stores/staff-session.store";
import { mockApps } from "@/mock/hcStaffMock.js";

const router = useRouter();
const route = useRoute();
const staffSessionStore = useStaffSessionStore();

function goToApplicationList() {
  router.push({ name: "HCstaffApplicationList" });
}

const reviewTab = ref("info");
const saveReviewDialog = ref(false);
const sendBackDialog = ref(false);
const rejectDialog = ref(false);
const sendToLabDialog = ref(false);
const successDialog = ref(false);
const successMessage = ref("");
const activityDetailDialog = ref(false);
const selectedEvent = ref(null);
const exportDetailDialog = ref(false);
const selectedExportDetail = ref(null);

function openExportDetail(detail) {
  selectedExportDetail.value = detail;
  exportDetailDialog.value = true;
}

function openActivityDetail(event) {
  selectedEvent.value = event;
  activityDetailDialog.value = true;
}

function submitSaveReview() {
  saveReviewDialog.value = false;
  successMessage.value = "ส่งต่อคำขอเพื่อพิจารณาเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitSendToLab() {
  sendToLabDialog.value = false;
  successMessage.value = "ส่งคำขอไปยังห้องปฏิบัติการเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitSendBack() {
  sendBackDialog.value = false;
  successMessage.value = "ส่งคำขอกลับให้ผู้ยื่นแก้ไขเรียบร้อยแล้ว";
  successDialog.value = true;
}

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "ส่งผลการตรวจ 'ไม่ผ่าน' เรียบร้อยแล้ว";
  successDialog.value = true;
}

const timelineSteps = computed(() => {
  if (app.value.labTest === "yes") {
    return [
      { value: 0, title: "ตรวจคำขอ" },
      { value: 1, title: "ตรวจ Lab" },
      { value: 2, title: "พิจารณา Lab" },
      { value: 3, title: "พิจารณา" },
      { value: 4, title: "ลงนาม" },
      { value: 5, title: "ชำระเงิน" },
    ];
  }
  return [
    { value: 0, title: "ตรวจคำขอ" },
    { value: 1, title: "พิจารณา" },
    { value: 2, title: "ลงนาม" },
    { value: 3, title: "ชำระเงิน" },
  ];
});

const appId = route.params.id;
const app = ref(mockApps[appId] ?? mockApps["HC-001"]);

const statusStepMap = computed(() => {
  if (app.value.labTest === "yes") {
    return {
      submitted: 0,
      under_review: 0,
      correction_required: 0,
      testing: 1,
      pending_approval: 2,
      approved: 2,
      completed: 3,
      rejected: 3,
    };
  }
  return {
    submitted: 0,
    under_review: 0,
    correction_required: 0,
    testing: 0,
    pending_approval: 1,
    approved: 1,
    completed: 2,
    rejected: 2,
  };
});

const currentStep = computed(() => statusStepMap.value[app.value.status] ?? 0);

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

const review = reactive({ decision: "pass", remark: "", deadline: null });
const deadlineMenu = ref(false);
const deadlineBE = computed(() => {
  if (!review.deadline) return "";
  const d = review.deadline;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
});
const deadlineDays = computed(() => {
  if (!review.deadline) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(review.deadline);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
});

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      forward: "fas fa-share",
      review: "fas fa-magnifying-glass",
      checking: "fas fa-magnifying-glass",
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
      submit: "hc-staff",
      receive: "info",
      forward: "hc-staff",
      review: "warning",
      checking: "hc-staff",
      pending: "warning",
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
      checking: "ตรวจคำขอ",
      pending: "รอพิจารณา",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      sendback: "ปรับปรุง",
    }[type] ?? type
  );
}

function statusColor(s) {
  return (
    {
      submitted: "warning",
      pending: "warning",
      reviewing: "info",
      signing: "info",
      need_edit: "error",
      approved: "success",
      rejected: "error",
    }[s] ?? "grey"
  );
}
function statusIcon(s) {
  return (
    {
      submitted: "fas fa-clock",
      pending: "fas fa-clock",
      reviewing: "fas fa-magnifying-glass",
      signing: "fas fa-pen-nib",
      need_edit: "fas fa-rotate-left",
      approved: "fas fa-circle-check",
      rejected: "fas fa-circle-xmark",
    }[s] ?? "fas fa-circle"
  );
}
function statusLabel(s) {
  return (
    {
      submitted: "รอตรวจ",
      pending: "รอตรวจ",
      reviewing: "อยู่ระหว่างตรวจ",
      signing: "รอลงนาม",
      need_edit: "รอแก้ไข",
      approved: "อนุมัติ",
      rejected: "ไม่อนุมัติ",
    }[s] ?? s
  );
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
  background: rgba(var(--v-theme-hc-staff), 0.1) !important;
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
  animation: pulse-checking 1.6s ease-in-out infinite;
}
@keyframes pulse-checking {
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
