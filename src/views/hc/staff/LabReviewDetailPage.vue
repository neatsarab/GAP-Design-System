<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="goToList"
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
        prepend-icon="fas fa-download"
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
                style="line-height: 1.3; font-size: 11px"
              >
                {{ step.title }}
              </div>
            </div>
            <div
              v-if="i < timelineSteps.length - 1"
              class="step-line flex-grow-1"
              :class="currentStep > step.value ? 'step-line--done' : ''"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <!-- Main content -->
      <v-col cols="12" md="8">
        <!-- Tabs -->
        <v-tabs v-model="activeTab" color="hc-staff" class="mb-4">
          <v-tab value="info">
            <v-icon icon="fas fa-file-lines" size="14" class="mr-2" />
            ข้อมูลคำขอ
          </v-tab>
          <v-tab value="lab">
            <v-icon icon="fas fa-flask" size="14" class="mr-2" />
            ผลการตรวจ Lab
          </v-tab>
          <v-tab value="review">
            <v-icon icon="fas fa-clipboard-check" size="14" class="mr-2" />
            บันทึกผลการพิจารณา
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
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
                <v-icon icon="fas fa-file-export" color="hc-staff" size="15" />
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
                    <td class="text-body-2 font-weight-bold text-export-staff">
                      {{ d.exporterRegNo }}
                    </td>
                    <td class="text-body-2">{{ d.exporterName }}</td>
                    <td class="text-body-2">{{ d.weight.toLocaleString() }}</td>
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
                              <v-icon icon="fas fa-file-pdf" size="14" />
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
                    >ดาวน์โหลด</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Tab: ผลการตรวจ Lab -->
          <v-window-item value="lab">
            <!-- Tab action bar -->
            <div class="d-flex justify-end mb-3">
              <template v-if="!labEditMode">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="hc-staff"
                  rounded="lg"
                  prepend-icon="fas fa-pen"
                  @click="enterLabEdit"
                >
                  แก้ไขผล Lab
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  size="small"
                  variant="text"
                  color="grey"
                  rounded="lg"
                  class="mr-2"
                  @click="cancelLabEdit"
                >
                  ยกเลิก
                </v-btn>
                <v-btn
                  size="small"
                  variant="flat"
                  color="hc-staff"
                  rounded="lg"
                  prepend-icon="fas fa-floppy-disk"
                  @click="confirmSaveLab"
                >
                  บันทึกผล
                </v-btn>
              </template>
            </div>

            <!-- Overall result (view mode) -->
            <v-card
              v-if="!labEditMode"
              rounded="xl"
              elevation="0"
              class="mb-4"
              :style="{
                background:
                  displayLabOverall === 'pass'
                    ? 'rgba(var(--v-theme-success), 0.06)'
                    : 'rgba(var(--v-theme-error), 0.06)',
                border:
                  displayLabOverall === 'pass'
                    ? '1px solid rgba(var(--v-theme-success), 0.2)'
                    : '1px solid rgba(var(--v-theme-error), 0.2)',
              }"
            >
              <v-card-text class="pa-4 d-flex align-center ga-3">
                <div
                  class="rounded-circle d-flex align-center justify-center flex-shrink-0"
                  style="width: 44px; height: 44px"
                  :style="{
                    background:
                      displayLabOverall === 'pass'
                        ? 'rgba(var(--v-theme-success), 0.15)'
                        : 'rgba(var(--v-theme-error), 0.15)',
                  }"
                >
                  <v-icon
                    :icon="
                      displayLabOverall === 'pass'
                        ? 'fas fa-circle-check'
                        : 'fas fa-circle-xmark'
                    "
                    :color="displayLabOverall === 'pass' ? 'success' : 'error'"
                    size="22"
                  />
                </div>
                <div>
                  <div class="text-body-2 font-weight-bold">
                    ผลการตรวจ Lab โดยรวม
                    <span v-if="displayLabOverall === 'fail'" class="text-error"
                      >: ไม่ผ่าน</span
                    >
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    วันที่บันทึกผล: {{ app.labResultDate }}
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Overall result (edit mode) -->
            <v-card
              v-else
              rounded="xl"
              elevation="0"
              class="mb-4 section-card"
            >
              <v-card-text class="pa-4">
                <div class="text-body-2 font-weight-bold mb-3">
                  ผลการตรวจ Lab โดยรวม
                </div>
                <v-radio-group
                  v-model="editLabOverall"
                  color="hc-staff"
                  inline
                  hide-details
                >
                  <v-radio value="pass" class="mr-6">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon icon="fas fa-circle-check" color="success" size="16" />
                        <span class="font-weight-medium">ผ่าน (Pass)</span>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio value="fail">
                    <template #label>
                      <div class="d-flex align-center ga-2">
                        <v-icon icon="fas fa-circle-xmark" color="error" size="16" />
                        <span class="font-weight-medium">ไม่ผ่าน (Fail)</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>
              </v-card-text>
            </v-card>

            <!-- Lab sections summary -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon icon="fas fa-list-check" color="hc-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >สรุปผลการตรวจรายหัวข้อ</span
                >
              </div>
              <v-table density="compact" class="pa-2">
                <thead>
                  <tr>
                    <th class="text-body-2" style="width: 36px"></th>
                    <th class="text-body-2">หัวข้อการตรวจ</th>
                    <th class="text-body-2 text-center" style="width: 130px">
                      ผลรวม
                    </th>
                    <th class="text-body-2">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="section in activeSections" :key="section.key">
                    <!-- แถวหลัก -->
                    <tr
                      class="section-row"
                      :class="{
                        'section-row--expanded': expandedSections.has(
                          section.key,
                        ),
                      }"
                      style="cursor: pointer"
                      @click="toggleSection(section.key)"
                    >
                      <td class="text-center">
                        <v-icon
                          :icon="
                            expandedSections.has(section.key)
                              ? 'fas fa-chevron-down'
                              : 'fas fa-chevron-right'
                          "
                          size="11"
                          :color="
                            expandedSections.has(section.key)
                              ? 'hc-staff'
                              : 'medium-emphasis'
                          "
                        />
                      </td>
                      <td class="text-body-2 font-weight-medium">
                        {{ section.label }}
                      </td>
                      <td class="text-center py-2" @click.stop>
                        <v-select
                          v-if="labEditMode"
                          v-model="section.result"
                          :items="resultOptions"
                          item-title="title"
                          item-value="value"
                          density="compact"
                          variant="outlined"
                          rounded="lg"
                          hide-details
                          style="min-width: 140px"
                          :color="section.result === 'detected' ? 'error' : 'success'"
                        />
                        <v-chip
                          v-else
                          :color="
                            section.result === 'detected' ? 'error' : 'success'
                          "
                          size="x-small"
                          variant="tonal"
                        >
                          {{
                            section.result === "detected"
                              ? "Detected"
                              : "Not Detected"
                          }}
                        </v-chip>
                      </td>
                      <td class="text-caption text-medium-emphasis" @click.stop>
                        <v-text-field
                          v-if="labEditMode"
                          v-model="section.detail"
                          density="compact"
                          variant="outlined"
                          rounded="lg"
                          hide-details
                          placeholder="รายละเอียด..."
                        />
                        <span v-else>{{ section.detail || "—" }}</span>
                      </td>
                    </tr>
                    <!-- แถวย่อย -->
                    <template v-if="expandedSections.has(section.key)">
                      <tr
                        v-for="item in section.items"
                        :key="item.name"
                        class="subitem-row"
                      >
                        <td></td>
                        <td class="text-body-2 text-medium-emphasis ps-4">
                          <v-icon
                            icon="fas fa-circle"
                            size="5"
                            class="mr-2 mb-1"
                            color="medium-emphasis"
                          />
                          {{ item.name }}
                        </td>
                        <td class="text-center py-1" @click.stop>
                          <v-select
                            v-if="labEditMode"
                            v-model="item.result"
                            :items="resultOptions"
                            item-title="title"
                            item-value="value"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            hide-details
                            style="min-width: 140px"
                            :color="item.result === 'detected' ? 'error' : 'success'"
                          />
                          <v-chip
                            v-else
                            :color="
                              item.result === 'detected' ? 'error' : 'success'
                            "
                            size="x-small"
                            variant="tonal"
                          >
                            {{
                              item.result === "detected"
                                ? "Detected"
                                : "Not Detected"
                            }}
                          </v-chip>
                        </td>
                        <td class="text-caption text-medium-emphasis" @click.stop>
                          <v-text-field
                            v-if="labEditMode"
                            v-model="item.value"
                            density="compact"
                            variant="outlined"
                            rounded="lg"
                            hide-details
                            :placeholder="item.unit"
                            :suffix="item.unit"
                          />
                          <span v-else>{{ item.value }} {{ item.unit }}</span>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </v-table>
            </v-card>

            <!-- เอกสารเพิ่มเติม -->
            <v-card rounded="xl" elevation="0" class="section-card mb-4">
              <div class="section-header px-4 py-3 d-flex align-center ga-2">
                <v-icon icon="fas fa-paperclip" color="hc-staff" size="15" />
                <span class="text-subtitle-2 font-weight-bold"
                  >เอกสารประกอบผล Lab</span
                >
              </div>
              <v-card-text class="pa-4">
                <div
                  v-for="doc in app.labDocs"
                  :key="doc.label"
                  class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between"
                >
                  <div class="d-flex align-center ga-2">
                    <v-icon icon="fas fa-file" size="13" color="hc-staff" />
                    <div>
                      <div class="text-body-2">{{ doc.label }}</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ doc.type }}
                      </div>
                    </div>
                  </div>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="hc-staff"
                    rounded="lg"
                    prepend-icon="fas fa-download"
                    >ดาวน์โหลด</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Tab: บันทึกผลการพิจารณา -->
          <v-window-item value="review">
            <v-card rounded="xl" elevation="0" class="section-card">
              <v-card-text class="pa-5">
                <!-- ผลการพิจารณา -->
                <div class="field-label mb-1">
                  <div>ผลการพิจารณา</div>
                  <div class="field-label-en">Review Result</div>
                </div>
                <v-radio-group
                  v-model="reviewResult.result"
                  color="hc-staff"
                  inline
                >
                  <v-radio
                    v-if="app.labOverall === 'pass'"
                    value="approve"
                    class="mr-6"
                  >
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
                  <v-radio value="reject">
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
                <div class="field-label mb-1 mt-4">
                  <div>หมายเหตุ</div>
                  <div class="field-label-en">Remarks</div>
                </div>
                <v-textarea
                  v-model="reviewResult.remark"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="4"
                  placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                  class="mb-5"
                />

                <!-- แก้ไขภายในวันที่ (เฉพาะ ปรับปรุง) -->
                <template v-if="reviewResult.result === 'improve'">
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
                      v-model="reviewResult.deadline"
                      hide-header
                      locale="th"
                      @update:model-value="deadlineMenu = false"
                    />
                  </v-menu>
                  <div
                    v-if="reviewResult.deadline"
                    class="text-caption text-medium-emphasis mb-4"
                  >
                    จำนวน {{ deadlineDays }} วัน นับจากวันนี้
                  </div>
                </template>

                <!-- Action buttons -->
                <v-row no-gutters class="ga-2">
                  <v-col v-if="reviewResult.result === 'reject'">
                    <v-btn
                      color="error"
                      variant="tonal"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-circle-xmark"
                      @click="rejectDialog = true"
                    >
                      ไม่อนุมัติ
                    </v-btn>
                  </v-col>
                  <v-col v-if="reviewResult.result === 'improve'">
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
                  <v-col v-if="reviewResult.result === 'approve'">
                    <v-btn
                      color="hc-staff"
                      variant="flat"
                      block
                      rounded="lg"
                      prepend-icon="fas fa-paper-plane"
                      @click="approveDialog = true"
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
                        v-if="!!eventLabel(event.type)"
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
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- Confirm Dialog: บันทึกผล Lab -->
    <v-dialog v-model="labSaveDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-hc-staff), 0.1)"
          >
            <v-icon icon="fas fa-flask" size="28" color="hc-staff" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">บันทึกผล Lab</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการบันทึกผลการตรวจ Lab ที่แก้ไขใช่หรือไม่?
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
                @click="labSaveDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="hc-staff" block rounded="lg" @click="submitSaveLab"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ส่งต่อพิจารณา -->
    <v-dialog v-model="approveDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-hc-staff), 0.1)"
          >
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
                @click="approveDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="hc-staff" block rounded="lg" @click="submitApprove"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Back Dialog -->
    <v-dialog v-model="sendBackDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-warning), 0.1)"
          >
            <v-icon icon="fas fa-rotate-left" color="warning" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งกลับแก้ไข</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการส่งคำขอกลับให้ผู้ยื่นแก้ไข
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                block
                @click="sendBackDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="warning" rounded="lg" block @click="submitSendBack"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog: ไม่อนุมัติ -->
    <v-dialog v-model="rejectDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div
            class="confirm-ring mx-auto mb-4"
            style="background: rgba(var(--v-theme-error), 0.1)"
          >
            <v-icon icon="fas fa-circle-xmark" size="28" color="error" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ไม่อนุมัติ</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการไม่อนุมัติคำขอนี้ใช่หรือไม่?
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
                >ยกเลิก</v-btn
              >
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

    <!-- Export Detail Dialog -->
    <v-dialog v-model="exportDetailDialog" max-width="680">
      <v-card rounded="xl">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-3 mb-4">
            <div
              class="rounded-lg d-flex align-center justify-center flex-shrink-0"
              style="
                width: 40px;
                height: 40px;
                background: rgba(var(--v-theme-hc-staff), 0.12);
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
            v-if="successIsLabSave"
            color="hc-staff"
            rounded="lg"
            block
            @click="successDialog = false"
          >
            ปิด
          </v-btn>
          <v-btn v-else color="hc-staff" rounded="lg" block @click="goToList">
            กลับรายการรอพิจารณาผล Lab
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

const router = useRouter();
const route = useRoute();
const staffSessionStore = useStaffSessionStore();

const exportDetailDialog = ref(false);
const selectedExportDetail = ref(null);
function openExportDetail(detail) {
  selectedExportDetail.value = detail;
  exportDetailDialog.value = true;
}

function goToList() {
  router.push({ name: "HCstaffLabReviewList" });
}

const expandedSections = ref(new Set());
function toggleSection(key) {
  const s = new Set(expandedSections.value);
  if (s.has(key)) s.delete(key);
  else s.add(key);
  expandedSections.value = s;
}

const currentStep = ref(2);
const activeTab = ref("info");

// Lab edit mode
const labEditMode = ref(false);
const editLabOverall = ref("");
const editableSections = ref([]);
const labSaveDialog = ref(false);
const displayLabOverall = ref(null); // set after labSections defined

const resultOptions = [
  { title: "Not Detected", value: "not_detected" },
  { title: "Detected", value: "detected" },
];

const activeSections = computed(() =>
  labEditMode.value ? editableSections.value : labSections,
);

function enterLabEdit() {
  editLabOverall.value = displayLabOverall.value;
  editableSections.value = labSections.map((s) => ({
    ...s,
    items: s.items.map((i) => ({ ...i })),
  }));
  labEditMode.value = true;
}
function cancelLabEdit() {
  labEditMode.value = false;
}
function confirmSaveLab() {
  labSaveDialog.value = true;
}
function submitSaveLab() {
  labSaveDialog.value = false;
  displayLabOverall.value = editLabOverall.value;
  // editableSections already mutated in-place via v-model; sync back to labSections
  editableSections.value.forEach((s, i) => {
    Object.assign(labSections[i], s);
    s.items.forEach((item, j) => Object.assign(labSections[i].items[j], item));
  });
  labEditMode.value = false;
  successMessage.value = "บันทึกผล Lab เรียบร้อยแล้ว";
  successIsLabSave.value = true;
  successDialog.value = true;
}

const approveDialog = ref(false);
const sendBackDialog = ref(false);
const rejectDialog = ref(false);
const successDialog = ref(false);
const successMessage = ref("");
const successIsLabSave = ref(false);

function submitApprove() {
  approveDialog.value = false;
  successMessage.value = "ส่งคำขอเพื่อลงนามเรียบร้อยแล้ว";
  successIsLabSave.value = false;
  successDialog.value = true;
}

function submitSendBack() {
  sendBackDialog.value = false;
  successMessage.value = "ส่งคำขอกลับให้ผู้ยื่นแก้ไขเรียบร้อยแล้ว";
  successIsLabSave.value = false;
  successDialog.value = true;
}

function submitReject() {
  rejectDialog.value = false;
  successMessage.value = "บันทึกผลการไม่อนุมัติเรียบร้อยแล้ว";
  successIsLabSave.value = false;
  successDialog.value = true;
}

const reviewResult = reactive({
  result: "approve",
  remark: "",
  deadline: null,
});
const deadlineMenu = ref(false);
const deadlineBE = computed(() => {
  if (!reviewResult.deadline) return "";
  const d = reviewResult.deadline;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear() + 543}`;
});
const deadlineDays = computed(() => {
  if (!reviewResult.deadline) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(reviewResult.deadline);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
});

function generateCertNo() {
  const now = new Date();
  const year = now.getFullYear() + 543;
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `HC-${year}-${seq}`;
}
const certNo = ref(generateCertNo());

function previewCertPdf() {
  const no = certNo.value;
  const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>ตัวอย่างใบรับรอง ${no}</title>
  <style>
    @page { size: A4; margin: 20mm 25mm; }
    body { font-family: 'Sarabun', 'TH Sarabun New', sans-serif; font-size: 14pt; color: #1a1a1a; }
    .center { text-align: center; }
    .border-box { border: 2px solid #1565c0; border-radius: 8px; padding: 32px; margin: 16px 0; }
    .label { font-size: 11pt; color: #555; margin-bottom: 2px; }
    .value { font-size: 13pt; font-weight: 600; margin-bottom: 14px; }
    .cert-no { font-size: 18pt; font-weight: 700; color: #1565c0; border: 2px solid #1565c0;
      display: inline-block; padding: 6px 24px; border-radius: 6px; margin: 12px 0; }
    hr { border: none; border-top: 1px solid #ccc; margin: 16px 0; }
    .watermark { color: #e0e0e0; font-size: 36pt; font-weight: 700; text-align: center;
      opacity: 0.5; margin: 8px 0; }
    .footer { font-size: 10pt; color: #888; text-align: center; margin-top: 24px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
  </style>
</head>
<body>
  <div class="border-box">
    <div class="center">
      <div class="label">กรมวิชาการเกษตร • Department of Agriculture</div>
      <div style="font-size:16pt;font-weight:700;margin:8px 0">ใบรับรองสุขอนามัย สำหรับพืชควบคุมเฉพาะ</div>
      <div class="label">Health Certificate for Controlled Plants</div>
      <div class="watermark">ร่าง / DRAFT</div>
      <div class="cert-no">${no}</div>
    </div>
    <hr />
    <div class="grid">
      <div>
        <div class="label">ชื่อสถานประกอบการ (ไทย)</div>
        <div class="value">${app.companyNameTh}</div>
      </div>
      <div>
        <div class="label">Company Name (English)</div>
        <div class="value">${app.companyNameEn}</div>
      </div>
      <div>
        <div class="label">ชื่อผู้ยื่นคำขอ</div>
        <div class="value">${app.applicantNameTh}</div>
      </div>
      <div>
        <div class="label">ประเภทคำขอ</div>
        <div class="value">${app.requestType}</div>
      </div>
    </div>
    <hr />
    <div class="footer">ตัวอย่างเท่านั้น — เลขใบรับรองอาจเปลี่ยนแปลงได้ก่อนลงนาม</div>
  </div>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const timelineSteps = [
  { value: 0, title: "ตรวจคำขอ" },
  { value: 1, title: "ตรวจ Lab" },
  { value: 2, title: "พิจารณา Lab" },
  { value: 3, title: "พิจารณา" },
  { value: 4, title: "ลงนาม" },
];

function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

const labSections = reactive([
  {
    key: "pesticides",
    label: "สารตกค้าง",
    result: "not_detected",
    detail: "ไม่พบสารตกค้างในทุกรายการที่เลือก",
    items: [
      {
        name: "Chlorpyrifos",
        result: "not_detected",
        value: "< 0.01",
        unit: "mg/kg",
      },
      {
        name: "Cypermethrin",
        result: "not_detected",
        value: "< 0.01",
        unit: "mg/kg",
      },
      {
        name: "Dimethoate",
        result: "not_detected",
        value: "< 0.01",
        unit: "mg/kg",
      },
      {
        name: "Profenofos",
        result: "not_detected",
        value: "< 0.01",
        unit: "mg/kg",
      },
    ],
  },
  {
    key: "microbes",
    label: "จุลินทรีย์",
    result: "detected",
    detail: "พบ E. coli 50 cfu/g",
    items: [
      { name: "E. coli", result: "detected", value: "50", unit: "cfu/g" },
      {
        name: "Salmonella spp.",
        result: "not_detected",
        value: "Not Detected",
        unit: "",
      },
      {
        name: "Listeria monocytogenes",
        result: "not_detected",
        value: "Not Detected",
        unit: "",
      },
    ],
  },
  {
    key: "gmo",
    label: "GMO",
    result: "not_detected",
    detail: "",
    items: [
      {
        name: "CaMV 35S promoter",
        result: "not_detected",
        value: "Not Detected",
        unit: "",
      },
      {
        name: "NOS terminator",
        result: "not_detected",
        value: "Not Detected",
        unit: "",
      },
    ],
  },
  {
    key: "sulfur",
    label: "ซัลเฟอร์ไดออกไซด์",
    result: "not_detected",
    detail: "",
    items: [
      {
        name: "Sulfur Dioxide (SO₂)",
        result: "not_detected",
        value: "< 10",
        unit: "mg/kg",
      },
    ],
  },
  {
    key: "aflatoxin",
    label: "อัลฟาท็อกซิน",
    result: "not_detected",
    detail: "",
    items: [
      {
        name: "Aflatoxin B1",
        result: "not_detected",
        value: "< 2",
        unit: "μg/kg",
      },
      {
        name: "Aflatoxin B2",
        result: "not_detected",
        value: "< 2",
        unit: "μg/kg",
      },
      {
        name: "Aflatoxin G1",
        result: "not_detected",
        value: "< 2",
        unit: "μg/kg",
      },
      {
        name: "Aflatoxin G2",
        result: "not_detected",
        value: "< 2",
        unit: "μg/kg",
      },
    ],
  },
  {
    key: "toxins",
    label: "สารพิษตกค้าง",
    result: "not_detected",
    detail: "",
    items: [
      {
        name: "Ochratoxin A",
        result: "not_detected",
        value: "< 2",
        unit: "μg/kg",
      },
      {
        name: "Deoxynivalenol (DON)",
        result: "not_detected",
        value: "< 750",
        unit: "μg/kg",
      },
    ],
  },
]);

const mockApps = {
  "HC-2569-001": {
    requestNo: "HC-0001",
    requestType: "ขอใบรับรอง",
    submittedAt: "01/01/2569",
    status: "lab_reviewing",
    agency: "สำนักงานเกษตรจังหวัดเชียงใหม่",
    registryType: "has_doa_gap",
    exportDuration: "7 วัน",
    dateStart: "01/01/2569",
    dateEnd: "08/01/2569",
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
        plantType: "ทุเรียน",
        province: "เชียงใหม่",
        expDate: "01/06/2570",
      },
    ],
    pathogens: ["Salmonella spp.", "E.coli"],
    exportDetails: [
      {
        certType: "คลุมทั้งการส่งออก (All)",
        exporterRegNo: "EXP-2568-00123",
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
            exportDate: "01/01/2569",
          },
        ],
      },
    ],
    totalWeight: 5000,
    totalValue: 250000,
    labTest: "yes",
    labName: "ห้องปฏิบัติการกรมวิชาการเกษตร",
    labProduct: "ทุเรียน",
    labResultDate: "10/01/2569",
    labReportNo: "LAB-2569-0042",
    labOverall: "pass",
    attachments: [{ label: "เอกสารอื่นๆ" }],
    labDocs: [
      { label: "ผลทดสอบสารตกค้าง.pdf", type: "ผลทดสอบ" },
      { label: "ผลทดสอบจุลินทรีย์.pdf", type: "ผลทดสอบ" },
    ],
    activityLog: [
      {
        type: "reviewing",
        action: "กำลังพิจารณาผล Lab",
        actor: staffSessionStore.displayName,
        timestamp: "",
        remark: "",
      },
      {
        type: "forwardlab",
        action: "บันทึกผล Lab",
        actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ Lab)",
        timestamp: "10/01/2569 14:30",
        remark: "",
      },
      {
        type: "forward",
        action: "ผ่านการตรวจ",
        actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ)",
        timestamp: "05/01/2569 11:00",
        remark: "",
      },
      {
        type: "submit",
        action: "ยื่นคำขอ",
        actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
        timestamp: "01/01/2569 09:12",
        remark: "",
      },
    ],
  },
};

mockApps["HC-2569-002"] = {
  ...mockApps["HC-2569-001"],
  requestNo: "HC-0002",
  status: "lab_reviewing",
  applicantNameTh: "มาลี รักดี",
  applicantEmail: "malee@siamexport.co.th",
  companyNameTh: "บริษัท สยามเอ็กซ์พอร์ต จำกัด",
  companyNameEn: "Siam Export Co., Ltd.",
  labOverall: "fail",
  labResultDate: "26/03/2569",
  labReportNo: "LAB-2569-0087",
  activityLog: [
    {
      type: "reviewing",
      action: "กำลังพิจารณาผล Lab",
      actor: staffSessionStore.displayName,
      timestamp: "",
      remark: "",
    },
    {
      type: "forwardlab",
      action: "บันทึกผล Lab",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ Lab)",
      timestamp: "26/03/2569 10:00",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "มาลี รักดี (ผู้ยื่นคำขอ)",
      timestamp: "05/02/2569 09:00",
      remark: "",
    },
  ],
};

mockApps["HC-2569-003"] = {
  ...mockApps["HC-2569-001"],
  requestNo: "HC-0003",
  status: "approved",
  applicantNameTh: "วิไล สุขสม",
  applicantEmail: "wilai@greenfresh.co.th",
  companyNameTh: "บริษัท กรีนเฟรช จำกัด",
  companyNameEn: "Green Fresh Co., Ltd.",
  labOverall: "pass",
  activityLog: [
    {
      type: "approve",
      action: "อนุมัติแล้ว",
      actor: staffSessionStore.displayName,
      timestamp: "15/03/2569 14:00",
      remark: "",
    },
    {
      type: "forwardlab",
      action: "บันทึกผล Lab",
      actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจ Lab)",
      timestamp: "20/03/2569 11:00",
      remark: "",
    },
    {
      type: "submit",
      action: "ยื่นคำขอ",
      actor: "วิไล สุขสม (ผู้ยื่นคำขอ)",
      timestamp: "12/03/2569 08:30",
      remark: "",
    },
  ],
};

const appId = route.params.id;
const app = mockApps[appId] ?? mockApps["HC-2569-001"];
displayLabOverall.value = app.labOverall;

function eventIcon(type) {
  return (
    {
      submit: "fas fa-paper-plane",
      receive: "fas fa-inbox",
      forward: "fas fa-share",
      forwardlab: "fas fa-share",
      review: "fas fa-magnifying-glass",
      reviewing: "fas fa-clipboard-check",
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
      forward: "success",
      forwardlab: "success",
      review: "warning",
      reviewing: "hc-staff",
      pending: "warning",
      approve: "success",
      reject: "error",
      sendback: "warning",
    }[type] ?? "grey"
  );
}
function eventLabel(type) {
  const map = {
    submit: "ยื่นคำขอ",
    receive: "รับเรื่อง",
    forward: "ผ่าน",
    forwardlab: null,
    review: "กำลังพิจารณา",
    reviewing: "กำลังพิจารณา",
    pending: "รอพิจารณา",
    approve: "อนุมัติ",
    reject: "ไม่อนุมัติ",
    sendback: "ปรับปรุง",
  };
  return type in map ? map[type] : type;
}
function statusColor(s) {
  return (
    {
      pending: "warning",
      lab_reviewing: "warning",
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
      pending: "fas fa-clock",
      lab_reviewing: "fas fa-microscope",
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
      pending: "รอตรวจ",
      lab_reviewing: "รอพิจารณาผล Lab",
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
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
.activity-dot--reviewing {
  background: rgb(var(--v-theme-hc-staff));
  animation: pulse-reviewing 1.6s ease-in-out infinite;
}
@keyframes pulse-reviewing {
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
.activity-dot--forwardlab {
  background: rgb(var(--v-theme-hc-staff));
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
.item-row {
  background: rgba(var(--v-theme-hc-staff), 0.03);
}
.section-row {
  transition: background 0.15s;
}
.section-row:hover {
  background: rgba(var(--v-theme-hc-staff), 0.04);
}
.section-row--expanded {
  background: rgba(var(--v-theme-hc-staff), 0.06);
}
.subitem-row td {
  background: rgba(var(--v-theme-on-surface), 0.02);
}
</style>
