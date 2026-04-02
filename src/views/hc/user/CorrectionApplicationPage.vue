<template>
  <div style="--v-theme-primary: var(--v-theme-hc-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">คำขอแก้ไขใบรับรอง</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          กรอกข้อมูลให้ครบถ้วนแล้วยืนยันคำขอ
        </p>
      </div>
    </div>

    <!-- Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div
              class="step-item d-flex flex-column align-center"
              style="min-width: 80px"
            >
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon
                  v-if="currentStep > step.value"
                  icon="fas fa-check"
                  size="14"
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
              v-if="i < steps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentStep > step.value }"
            />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 0: ข้อมูลรายละเอียด ─── -->
    <template v-if="currentStep === 0">
      <!-- Card 1: ค้นหาใบรับรอง -->
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-certificate" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >ระบุใบรับรองที่ต้องการแก้ไข</span
          >
        </div>
        <v-card-text class="pt-5">
          <div class="field-label mb-2">
            เลขที่ใบรับรองสุขอนามัยพืช <span class="req">*</span>
            <div class="field-label-en">Haelth Certificate No.</div>
          </div>
          <v-row dense align="center">
            <v-col cols="12" sm="6">
              <v-text-field
                density="compact"
                variant="outlined"
                rounded="lg"
                v-model="certSearchNo"
                placeholder="เช่น HC-2568-00123"
                prepend-inner-icon="fas fa-certificate"
                hide-details
                @keyup.enter="searchCert"
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="hc-user"
                variant="tonal"
                prepend-icon="fas fa-magnifying-glass"
                :loading="certSearchLoading"
                @click="searchCert"
              >
                ค้นหา
              </v-btn>
            </v-col>
          </v-row>

          <!-- Not found -->
          <v-alert
            v-if="certSearchNotFound"
            type="error"
            variant="tonal"
            density="compact"
            class="mt-3"
            prepend-icon="fas fa-circle-xmark"
          >
            ไม่พบใบรับรองเลขที่ "{{ certSearchNo }}" กรุณาตรวจสอบอีกครั้ง
          </v-alert>

          <!-- Result card -->
          <v-card
            v-if="certSearchResult && !certSelected"
            elevation="0"
            rounded="lg"
            class="mt-4"
            :style="
              certSearchResult.isExpired
                ? 'background: rgba(var(--v-theme-error), 0.1); border: 1px solid rgba(var(--v-theme-error), 0.25)'
                : 'background: rgba(var(--v-theme-success), 0.08); border: 1px solid rgba(var(--v-theme-success), 0.2)'
            "
          >
            <v-card-text class="pa-4">
              <v-row align="center" no-gutters>
                <v-col>
                  <div class="text-caption text-medium-emphasis mb-1">
                    เลขที่ใบรับรอง
                  </div>
                  <div class="text-body-1 font-weight-bold text-hc-user">
                    {{ certSearchResult.certNo }}
                  </div>
                  <div class="text-body-2 mt-1">
                    {{ certSearchResult.exporterName }}
                  </div>
                  <div class="d-flex align-center ga-2 mt-2">
                    <v-chip
                      size="x-small"
                      :color="certSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ certSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                    <span class="text-caption text-medium-emphasis">
                      วันที่ออก: {{ certSearchResult.issuedDate }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="auto" class="d-flex flex-column ga-2 pl-4">
                  <v-btn
                    size="small"
                    variant="flat"
                    color="hc-user"
                    prepend-icon="fas fa-eye"
                    @click="viewCertDialog = true"
                  >
                    ดูใบรับรอง
                  </v-btn>
                  <v-btn
                    size="small"
                    color="hc-user"
                    variant="flat"
                    prepend-icon="fas fa-check"
                    :disabled="certSearchResult.isExpired"
                    @click="selectCert"
                  >
                    เลือกใบรับรองนี้
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Selected cert chip -->
          <div v-if="certSelected" class="mt-4 d-flex align-center ga-2">
            <v-icon icon="fas fa-circle-check" color="success" size="16" />
            <span class="text-body-2 font-weight-medium text-success">
              เลือกใบรับรอง:
            </span>
            <v-chip color="hc-user" variant="tonal" size="small">
              {{ certSelected.certNo }} — {{ certSelected.exporterName }}
            </v-chip>
            <v-btn
              icon="fas fa-xmark"
              size="x-small"
              variant="text"
              color="grey"
              @click="
                certSelected = null;
                amendFields = [];
              "
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- Card 2: เลือกรายการที่ต้องการแก้ไข -->
      <v-card
        v-if="certSelected"
        elevation="0"
        border
        rounded="xl"
        class="mb-5"
      >
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-pencil" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold"
            >เลือกรายการที่ต้องการแก้ไข</span
          >
        </div>
        <v-card-text class="pt-4">
          <div class="amend-list">
            <template v-for="item in amendItems" :key="item.value">
              <div
                class="amend-item"
                :class="{
                  'amend-item--active': amendFields.includes(item.value),
                }"
              >
                <!-- Checkbox header -->
                <div class="d-flex align-center justify-space-between">
                  <v-checkbox
                    v-model="amendFields"
                    :value="item.value"
                    color="hc-user"
                    density="compact"
                    hide-details
                    class="checkbox-spacious"
                  >
                    <template #label>
                      <div>
                        <div class="text-body-2 font-weight-medium">
                          {{ item.label }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                          {{ item.labelEn }}
                        </div>
                      </div>
                    </template>
                  </v-checkbox>
                </div>

                <!-- Expanded detail -->
                <v-expand-transition>
                  <div
                    v-if="amendFields.includes(item.value)"
                    class="amend-detail-field"
                  >
                    <!-- ชื่อพาหนะ -->
                    <template v-if="item.inputType === 'vehicle_name'">
                      <div class="field-section-label mb-2">
                        ข้อมูลปัจจุบัน (บนใบรับรอง)
                      </div>
                      <v-row dense class="mb-3">
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อพาหนะ</div>
                            <div class="field-label-en">
                              Means of Conveyance
                            </div>
                          </div>
                          <v-text-field
                            density="compact"
                            :model-value="certSelected?.vehicleName"
                            readonly
                            class="field-readonly"
                            hide-details
                          />
                        </v-col>
                      </v-row>
                      <div class="field-section-label mb-2">
                        ข้อมูลใหม่ <span class="req">*</span>
                      </div>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="field-label">
                            <div>ชื่อพาหนะใหม่</div>
                            <div class="field-label-en">
                              New Means of Conveyance
                            </div>
                          </div>
                          <v-text-field
                            density="compact"
                            v-model="amendNewValues.vehicleName"
                            hide-details="auto"
                            placeholder="ระบุชื่อพาหนะ"
                          />
                        </v-col>
                      </v-row>
                    </template>

                    <!-- รายการข้อมูลการส่งออก -->
                    <template v-else-if="item.inputType === 'export_items'">
                      <div class="field-section-label mb-2">
                        ข้อมูลปัจจุบัน (บนใบรับรอง)
                      </div>
                      <div class="rounded-lg overflow-hidden border mb-4">
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-center" style="width: 48px">
                                ลำดับ
                              </th>
                              <th>ผู้รับสินค้า</th>
                              <th>ประเทศ</th>
                              <th>ด่าน</th>
                              <th>หมายเลข Lot</th>
                              <th class="text-right">น้ำหนัก (กก.)</th>
                              <th>วันที่ส่งออก</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(row, i) in certSelected?.exportItems"
                              :key="i"
                            >
                              <td class="text-center">{{ i + 1 }}</td>
                              <td>{{ row.consignee }}</td>
                              <td>{{ row.country }}</td>
                              <td>{{ row.checkpoint }}</td>
                              <td>{{ row.lotNo }}</td>
                              <td class="text-right">
                                {{ Number(row.weight).toLocaleString() }}
                              </td>
                              <td>{{ row.exportDate }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>

                      <div
                        class="d-flex align-center justify-space-between mb-2"
                      >
                        <div class="field-section-label mb-0">
                          ข้อมูลใหม่ <span class="req">*</span>
                        </div>
                        <v-btn
                          size="small"
                          color="hc-user"
                          variant="tonal"
                          prepend-icon="fas fa-plus"
                          @click="openShipmentItemDialog()"
                          >เพิ่มรายการ</v-btn
                        >
                      </div>
                      <div
                        v-if="amendNewValues.exportItems.length > 0"
                        class="rounded-lg overflow-hidden border mb-2"
                      >
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <th class="text-center" style="width: 48px">
                                ลำดับ
                              </th>
                              <th>ผู้รับสินค้า</th>
                              <th>ประเทศ</th>
                              <th>ด่าน</th>
                              <th>หมายเลข Lot</th>
                              <th class="text-right">น้ำหนัก (กก.)</th>
                              <th>วันที่ส่งออก</th>
                              <th style="width: 80px"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(row, idx) in amendNewValues.exportItems"
                              :key="idx"
                            >
                              <td class="text-center">{{ idx + 1 }}</td>
                              <td>{{ row.consignee }}</td>
                              <td>{{ row.country }}</td>
                              <td>{{ row.checkpoint }}</td>
                              <td>{{ row.lotNo }}</td>
                              <td class="text-right">
                                {{ Number(row.weight).toLocaleString() }}
                              </td>
                              <td>{{ row.exportDate }}</td>
                              <td>
                                <div class="d-flex align-center">
                                  <v-btn
                                    icon
                                    size="x-small"
                                    variant="text"
                                    color="warning"
                                    @click="openShipmentItemDialog(idx)"
                                  >
                                    <v-icon icon="fas fa-pen" size="12" />
                                  </v-btn>
                                  <v-btn
                                    icon
                                    size="x-small"
                                    variant="text"
                                    color="error"
                                    @click="
                                      amendNewValues.exportItems.splice(idx, 1)
                                    "
                                  >
                                    <v-icon icon="fas fa-trash" size="12" />
                                  </v-btn>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                      <div
                        v-else
                        class="text-center text-body-2 text-medium-emphasis py-5 rounded-lg border border-dashed mb-2"
                      >
                        ยังไม่มีรายการ กดปุ่ม "เพิ่มรายการ" เพื่อเพิ่ม
                      </div>
                    </template>
                  </div>
                </v-expand-transition>
              </div>
            </template>
          </div>
        </v-card-text>
      </v-card>

      <!-- View Cert Dialog -->
      <v-dialog v-model="viewCertDialog" max-width="480">
        <v-card rounded="xl">
          <v-card-title class="d-flex align-center ga-2 pa-5 pb-3">
            <v-icon icon="fas fa-certificate" color="hc-user" size="18" />
            ใบรับรองสุขอนามัยพืช
            <v-spacer />
            <v-btn
              icon="fas fa-xmark"
              size="small"
              variant="text"
              color="grey"
              @click="viewCertDialog = false"
            />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <template v-if="certSearchResult">
              <v-list density="compact" lines="two">
                <v-list-item subtitle="เลขที่ใบรับรอง">
                  <v-list-item-title class="text-hc-user font-weight-bold">
                    {{ certSearchResult.certNo }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="ชื่อผู้ส่งออก">
                  <v-list-item-title>{{
                    certSearchResult.exporterName
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันที่ออกใบรับรอง">
                  <v-list-item-title>{{
                    certSearchResult.issuedDate
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="วันหมดอายุ">
                  <v-list-item-title>{{
                    certSearchResult.expiryDate
                  }}</v-list-item-title>
                </v-list-item>
                <v-list-item subtitle="สถานะ">
                  <v-list-item-title>
                    <v-chip
                      size="x-small"
                      :color="certSearchResult.isExpired ? 'error' : 'success'"
                      variant="tonal"
                    >
                      {{ certSearchResult.isExpired ? "หมดอายุ" : "ใช้งานได้" }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </template>
          </v-card-text>
          <v-card-actions class="px-5 pb-4 d-flex flex-column ga-2">
            <v-btn
              color="hc-user"
              variant="tonal"
              prepend-icon="fas fa-download"
              block
              rounded="lg"
            >
              ดาวน์โหลด PDF
            </v-btn>
            <v-btn
              color="hc-user"
              variant="flat"
              prepend-icon="fas fa-check"
              block
              rounded="lg"
              :disabled="certSearchResult?.isExpired"
              @click="selectCert()"
            >
              เลือกใบรับรองนี้
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- ─── STEP 1: ไฟล์แนบ ─── -->
    <template v-if="currentStep === 1">
      <v-card elevation="0" border rounded="xl" class="mb-5">
        <div class="d-flex align-center ga-2 px-4 py-3 border-b">
          <v-icon icon="fas fa-paperclip" color="hc-user" size="15" />
          <span class="text-subtitle-2 font-weight-bold">เอกสารประกอบ</span>
        </div>
        <v-card-text class="pt-5">
          <v-row dense>
            <v-col v-for="doc in docDefs" :key="doc.key" cols="12">
              <div class="item-row rounded-lg pa-3 mb-2">
                <v-row align="center" no-gutters>
                  <v-col>
                    <div class="text-body-2 font-weight-medium">
                      {{ doc.label }}
                      <v-chip
                        v-if="doc.optional"
                        size="x-small"
                        color="grey"
                        variant="tonal"
                        class="ml-2"
                        >ไม่บังคับ</v-chip
                      >
                      <span v-else class="req ml-1">*</span>
                    </div>
                    <!-- Description field for other docs -->
                    <v-text-field
                      v-if="doc.hasDescription"
                      density="compact"
                      v-model="otherDocDescription"
                      placeholder="ระบุรายละเอียดเอกสารอื่นๆ"
                      hide-details
                      class="mt-2"
                      style="max-width: 400px"
                    />
                  </v-col>
                  <v-col cols="auto" class="d-flex align-center ga-2 pl-3">
                    <v-chip
                      v-if="uploadedFiles[doc.key]"
                      color="success"
                      size="x-small"
                      variant="tonal"
                      prepend-icon="fas fa-check"
                      >{{ uploadedFiles[doc.key] }}</v-chip
                    >
                    <v-btn
                      v-if="uploadedFiles[doc.key]"
                      icon="fas fa-xmark"
                      color="error"
                      variant="text"
                      size="small"
                      @click="removeFile(doc.key)"
                    />
                    <v-btn
                      :color="uploadedFiles[doc.key] ? 'warning' : 'hc-user'"
                      variant="tonal"
                      size="small"
                      prepend-icon="fas fa-upload"
                      @click="triggerFileInput(doc.key)"
                    >
                      {{ uploadedFiles[doc.key] ? "เปลี่ยนไฟล์" : "แนบไฟล์" }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>

    <!-- Navigation Buttons -->
    <div class="d-flex justify-space-between align-center mt-6">
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="grey" @click="goToApplicationList"
          >ยกเลิก</v-btn
        >
        <v-btn
          v-if="currentStep > 0"
          variant="tonal"
          color="grey"
          prepend-icon="fas fa-arrow-left"
          @click="prevStep"
          >ย้อนกลับ</v-btn
        >
      </div>
      <div class="d-flex ga-2">
        <v-btn
          variant="tonal"
          color="hc-user"
          prepend-icon="fas fa-floppy-disk"
          @click="saveDraft"
          >บันทึกแบบร่าง</v-btn
        >
        <v-btn
          v-if="currentStep < steps.length - 1"
          color="hc-user"
          append-icon="fas fa-arrow-right"
          @click="nextStep"
          >ถัดไป</v-btn
        >
        <v-btn
          v-else
          color="hc-user"
          prepend-icon="fas fa-paper-plane"
          @click="openConfirmDialog"
          >ยื่นคำขอ</v-btn
        >
      </div>
    </div>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="360">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="hc-user" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-1">ยืนยันการยื่นคำขอ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ตรวจสอบข้อมูลให้ครบถ้วนก่อนยืนยัน เมื่อยืนยันแล้วจะไม่สามารถแก้ไขได้
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
                color="hc-user"
                block
                rounded="lg"
                @click="submitApplication"
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
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ระบบได้รับคำขอแก้ไขของท่านแล้ว เจ้าหน้าที่จะตรวจสอบและติดต่อกลับ
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn color="hc-user" block @click="goToApplicationList"
            >ดูรายการคำขอ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Shipment Item Dialog -->
    <v-dialog v-model="shipmentItemDialog" max-width="560" scrollable>
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-subtitle-1 font-weight-bold">
          {{
            editShipmentItemIdx === null
              ? "เพิ่มรายการส่งออก"
              : "แก้ไขรายการส่งออก"
          }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">
                <div>ผู้รับสินค้า <span class="req">*</span></div>
                <div class="field-label-en">Consignee</div>
              </div>
              <v-text-field
                v-model="shipmentItemForm.consignee"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อผู้รับสินค้า"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ประเทศ <span class="req">*</span></div>
                <div class="field-label-en">Country of Destination</div>
              </div>
              <v-autocomplete
                v-model="shipmentItemForm.country"
                :items="countries"
                variant="outlined"
                density="compact"
                rounded="lg"
                placeholder="เลือกประเทศ"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ด่าน <span class="req">*</span></div>
                <div class="field-label-en">Port of Entry / Checkpoint</div>
              </div>
              <v-text-field
                v-model="shipmentItemForm.checkpoint"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อด่าน"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>หมายเลข Lot</div>
                <div class="field-label-en">Lot Number</div>
              </div>
              <v-text-field
                v-model="shipmentItemForm.lotNo"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="LOT-XXXX"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>น้ำหนัก (กก.) <span class="req">*</span></div>
                <div class="field-label-en">Net Weight (kg.)</div>
              </div>
              <v-text-field
                v-model="shipmentItemForm.weight"
                type="number"
                min="0"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="0"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label">
                <div>ที่อยู่ผู้รับสินค้า</div>
                <div class="field-label-en">Consignee Address</div>
              </div>
              <v-text-field
                v-model="shipmentItemForm.address"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ระบุที่อยู่ผู้รับสินค้า"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>วันที่ส่งออก</div>
                <div class="field-label-en">Export Date</div>
              </div>
              <v-menu
                v-model="shipmentItemExportDateMenu"
                :close-on-content-click="false"
                location="bottom start"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    :model-value="shipmentItemForm.exportDate"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    readonly
                    placeholder="วว/ดด/ปปปป"
                    append-inner-icon="fas fa-calendar-days"
                  />
                </template>
                <v-date-picker
                  v-model="shipmentItemExportDateObj"
                  color="hc-user"
                  hide-header
                  show-adjacent-months
                  locale="th"
                  @update:model-value="shipmentItemExportDateMenu = false"
                />
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4 ga-2 justify-end">
          <v-btn
            variant="tonal"
            color="grey"
            @click="shipmentItemDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="hc-user" @click="saveShipmentItem">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Draft Snackbar -->
    <v-snackbar
      v-model="draftSnackbar"
      color="success"
      rounded="lg"
      timeout="2500"
      location="top right"
    >
      <v-icon icon="fas fa-floppy-disk" class="mr-2" />
      บันทึกแบบร่างแล้ว
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const router = useRouter();

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

// ── Navigation ────────────────────────────────────────
function goToApplicationList() {
  router.push({ name: "HCUserApplicationList" });
}
function prevStep() {
  currentStep.value--;
}
function nextStep() {
  currentStep.value++;
}

// ── Steps ─────────────────────────────────────────────
const currentStep = ref(0);
const steps = [
  { value: 0, title: "ข้อมูลรายละเอียด" },
  { value: 1, title: "ไฟล์แนบ" },
];

function stepClass(value) {
  if (currentStep.value > value) return "step-done";
  if (currentStep.value === value) return "step-active";
  return "step-pending";
}

// ── Dialogs / Snackbar ────────────────────────────────
const confirmDialog = ref(false);
const successDialog = ref(false);
const draftSnackbar = ref(false);

function openConfirmDialog() {
  confirmDialog.value = true;
}
function saveDraft() {
  draftSnackbar.value = true;
}
function submitApplication() {
  confirmDialog.value = false;
  successDialog.value = true;
}

// ── HC Certificate Search ─────────────────────────────
const certSearchNo = ref("");
const certSearchLoading = ref(false);
const certSearchResult = ref(null);
const certSearchNotFound = ref(false);
const certSelected = ref(null);
const viewCertDialog = ref(false);

const hcCertMockDB = {
  "HC-2568-00123": {
    certNo: "HC-2568-00123",
    issuedDate: "15/01/2568",
    expiryDate: "14/01/2570",
    isExpired: false,
    exporterName: "บริษัท ไทยเฟรช เอ็กซ์พอร์ต จำกัด",
    vehicleName: "THAI FRESH VESSEL 1",
    exportItems: [
      {
        consignee: "FRESH ASIA IMPORT CO., LTD.",
        country: "สิงคโปร์",
        checkpoint: "ด่านศุลกากรท่าเรือกรุงเทพ",
        lotNo: "LOT-001",
        weight: "5000",
        address: "1234 ORCHARD ROAD, SINGAPORE 238863",
        exportDate: "20/01/2568",
      },
    ],
  },
  "HC-2568-00456": {
    certNo: "HC-2568-00456",
    issuedDate: "10/03/2568",
    expiryDate: "09/03/2570",
    isExpired: false,
    exporterName: "ห้างหุ้นส่วนจำกัด ไทยเกษตรผล",
    vehicleName: "THAI AGRI CARRIER 3",
    exportItems: [
      {
        consignee: "JAPAN FRESH TRADING CO., LTD.",
        country: "ญี่ปุ่น",
        checkpoint: "ด่านศุลกากรสุวรรณภูมิ",
        lotNo: "LOT-002",
        weight: "2500",
        address: "5-1-1 SHIMBASHI MINATO-KU TOKYO 105-0004 JAPAN",
        exportDate: "15/03/2568",
      },
    ],
  },
  "HC-2567-00789": {
    certNo: "HC-2567-00789",
    issuedDate: "01/07/2567",
    expiryDate: "30/06/2568",
    isExpired: true,
    exporterName: "บริษัท กรีนพืชผล จำกัด",
    vehicleName: "GREEN CARGO EXPRESS",
    exportItems: [
      {
        consignee: "GREEN FOOD INTERNATIONAL CO., LTD.",
        country: "ฮ่องกง",
        checkpoint: "ด่านศุลกากรแหลมฉบัง",
        lotNo: "LOT-003",
        weight: "8000",
        address: "8/F GOLDEN PLAZA HONG KONG",
        exportDate: "05/07/2567",
      },
    ],
  },
};

function searchCert() {
  if (!certSearchNo.value.trim()) return;
  certSearchLoading.value = true;
  certSearchResult.value = null;
  certSearchNotFound.value = false;
  certSelected.value = null;
  setTimeout(() => {
    const found = hcCertMockDB[certSearchNo.value.trim().toUpperCase()];
    if (found) {
      certSearchResult.value = found;
    } else {
      certSearchNotFound.value = true;
    }
    certSearchLoading.value = false;
  }, 600);
}

function selectCert() {
  if (!certSearchResult.value) return;
  viewCertDialog.value = false;
  certSelected.value = { ...certSearchResult.value };
  certSearchResult.value = null;
  amendFields.value = [];
  amendNewValues.vehicleName = certSelected.value.vehicleName || "";
  amendNewValues.exportItems = (certSelected.value.exportItems || []).map(
    (r) => ({ ...r }),
  );
}

// ── Amendment ─────────────────────────────────────────
const amendFields = ref([]);

const amendItems = [
  {
    value: "vehicleName",
    label: "ชื่อพาหนะ",
    labelEn: "Means of Conveyance",
    inputType: "vehicle_name",
  },
  {
    value: "exportItems",
    label: "รายการข้อมูลการส่งออก",
    labelEn: "Export Items",
    inputType: "export_items",
  },
];

const amendNewValues = reactive({
  vehicleName: "",
  exportItems: [],
});

// ── Shipment Item Dialog ──────────────────────────────
const shipmentItemDialog = ref(false);
const editShipmentItemIdx = ref(null);
const shipmentItemForm = reactive({
  consignee: "",
  country: "",
  checkpoint: "",
  lotNo: "",
  weight: "",
  address: "",
  exportDate: "",
});
const shipmentItemExportDateMenu = ref(false);
const shipmentItemExportDateObj = ref(null);

watch(shipmentItemExportDateObj, (d) => {
  if (!d) {
    shipmentItemForm.exportDate = "";
    return;
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear() + 543;
  shipmentItemForm.exportDate = `${dd}/${mm}/${yyyy}`;
  shipmentItemExportDateMenu.value = false;
});

function openShipmentItemDialog(idx = null) {
  editShipmentItemIdx.value = idx;
  if (idx !== null) {
    Object.assign(shipmentItemForm, amendNewValues.exportItems[idx]);
  } else {
    Object.assign(shipmentItemForm, {
      consignee: "",
      country: "",
      checkpoint: "",
      lotNo: "",
      weight: "",
      address: "",
      exportDate: "",
    });
    shipmentItemExportDateObj.value = null;
  }
  shipmentItemDialog.value = true;
}

function saveShipmentItem() {
  if (
    !shipmentItemForm.consignee ||
    !shipmentItemForm.country ||
    !shipmentItemForm.checkpoint ||
    !shipmentItemForm.weight
  )
    return;
  const data = { ...shipmentItemForm };
  if (editShipmentItemIdx.value !== null) {
    amendNewValues.exportItems[editShipmentItemIdx.value] = data;
  } else {
    amendNewValues.exportItems.push(data);
  }
  shipmentItemDialog.value = false;
}

// ── Countries ─────────────────────────────────────────
const countries = [
  "สหภาพยุโรป",
  "นอร์เวย์",
  "สมาพันธรัฐสวิส",
  "ญี่ปุ่น",
  "สาธารณะรัฐประชาชนจีน",
  "ไต้หวัน",
  "ฮ่องกง",
  "เกาหลีใต้",
  "สิงคโปร์",
  "มาเลเซีย",
  "อินโดนีเซีย",
  "เวียดนาม",
  "ฟิลิปปินส์",
  "เมียนมา",
  "กัมพูชา",
  "ลาว",
  "อินเดีย",
  "ออสเตรเลีย",
  "นิวซีแลนด์",
  "สหรัฐอเมริกา",
  "แคนาดา",
  "สหราชอาณาจักร",
  "สหรัฐอาหรับเอมิเรตส์",
  "ซาอุดีอาระเบีย",
  "อื่นๆ",
];

// ── File Upload ────────────────────────────────────────
const uploadedFiles = reactive({});
const otherDocDescription = ref("");

function triggerFileInput(key) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,.jpg,.jpeg,.png";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) uploadedFiles[key] = file.name;
  };
  input.click();
}

function removeFile(key) {
  delete uploadedFiles[key];
}

const docDefs = [
  // {
  //   key: "original_cert",
  //   label: "สำเนาใบรับรองสุขอนามัยพืชเดิม",
  //   optional: false,
  // },
  // {
  //   key: "id_card",
  //   label: "สำเนาบัตรประชาชนผู้ยื่นคำขอ",
  //   optional: true,
  // },
  {
    key: "other_docs",
    label: "เอกสารอื่นๆ",
    optional: true,
    // hasDescription: true,
  },
];
</script>

<style scoped>
.item-row {
  background: rgba(var(--v-theme-hc-user), 0.03);
}

.step-done,
.step-active {
  background: rgb(var(--v-theme-hc-user)) !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-hc-user), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-hc-user)) !important;
}
.field-section-label {
  color: rgb(var(--v-theme-hc-user)) !important;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.amend-item--active {
  background: rgba(var(--v-theme-hc-user), 0.04);
  border-radius: 8px;
}
.export-table {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  border-radius: 8px;
  overflow: hidden;
}
.export-table thead th {
  background: rgba(var(--v-theme-hc-user), 0.06);
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-hc-user));
}
.export-table tbody td {
  font-size: 0.8rem;
}
.confirm-ring {
  background: rgba(var(--v-theme-hc-user), 0.1);
}
</style>
