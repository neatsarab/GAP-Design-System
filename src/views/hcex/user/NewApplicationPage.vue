<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">
          ยื่นคำขอใบรับรองสุขอนามัยสินค้าแปรรูปด้านพืช
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          กรอกข้อมูลตามขั้นตอนให้ครบถ้วน
        </p>
      </div>
    </div>

    <!-- Step 0: เลือกประเภทคำขอ -->
    <div v-if="!selectedType" class="mb-6">
      <div class="text-body-1 font-weight-bold mb-4">เลือกประเภทคำขอ</div>
      <v-row>
        <v-col v-for="t in certTypes" :key="t.value" cols="12" sm="6" md="4">
          <v-card class="type-card h-100" @click="selectedType = t.value">
            <div class="type-accent" :class="`bg-${t.color}`" />
            <v-card-text class="pa-5 text-center">
              <div
                class="type-icon mx-auto mb-3"
                :style="`background: rgba(var(--v-theme-${t.color}), 0.1)`"
              >
                <v-icon :icon="t.icon" :color="t.color" size="28" />
              </div>
              <h3 class="text-body-1 font-weight-bold mb-2">{{ t.label }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-3">
                {{ t.desc }}
              </p>
              <v-btn :color="t.color" block size="small">เลือก</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Step 0.5: ตรวจสอบว่ามีผล Lab แล้วหรือยัง -->
    <div v-else-if="selectedType && hasLab === null" class="mb-6">
      <div class="d-flex align-center ga-2 mb-5">
        <v-btn
          icon="fas fa-arrow-left"
          variant="text"
          size="small"
          @click="selectedType = null"
        />
        <div>
          <div class="text-body-1 font-weight-bold">ตรวจสอบผล Lab</div>
          <div class="text-body-2 text-medium-emphasis">
            ประเภทคำขอ: {{ selectedType }}
          </div>
        </div>
      </div>

      <v-card
        class="mb-5 pa-5"
        style="
          border: 2px solid rgba(var(--v-theme-hcex-user), 0.3);
          border-radius: 16px;
        "
      >
        <div class="text-center mb-6">
          <div class="lab-check-icon mx-auto mb-3">
            <v-icon icon="fas fa-flask-vial" color="hcex-user" size="32" />
          </div>
          <h2 class="text-h6 font-weight-bold mb-2">
            มีผล Lab ที่ผ่านการพิจารณาแล้วหรือยัง?
          </h2>
          <p class="text-body-2 text-medium-emphasis">
            การยื่นคำขอใบรับรองสุขอนามัยต้องมีผลการทดสอบห้องปฏิบัติการที่ผ่านการพิจารณาของเจ้าหน้าที่แล้ว
          </p>
        </div>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card
              class="lab-option-card h-100"
              style="
                border: 2px solid rgba(var(--v-theme-success), 0.3);
                cursor: pointer;
              "
              @click="hasLab = true"
            >
              <v-card-text class="pa-5 text-center">
                <div
                  class="lab-option-icon mx-auto mb-3"
                  style="background: rgba(var(--v-theme-success), 0.1)"
                >
                  <v-icon icon="fas fa-flask-vial" color="success" size="28" />
                </div>
                <h3 class="text-body-1 font-weight-bold mb-2">มีผล Lab แล้ว</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  มีผลการทดสอบห้องปฏิบัติการที่ผ่านการพิจารณาของเจ้าหน้าที่แล้ว
                </p>
                <v-btn color="success" block variant="tonal" size="small">
                  ดำเนินการต่อ
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card
              class="lab-option-card h-100"
              style="
                border: 2px solid rgba(var(--v-theme-hcex-user), 0.3);
                cursor: pointer;
              "
              @click="hasLab = false"
            >
              <v-card-text class="pa-5 text-center">
                <div
                  class="lab-option-icon mx-auto mb-3"
                  style="background: rgba(var(--v-theme-hcex-user), 0.1)"
                >
                  <v-icon icon="fas fa-vial" color="hcex-user" size="28" />
                </div>
                <h3 class="text-body-1 font-weight-bold mb-2">
                  ยังไม่มีผล Lab
                </h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  ต้องการยื่นขอผลการทดสอบห้องปฏิบัติการก่อน
                </p>
                <v-btn color="hcex-user" block variant="tonal" size="small">
                  ยื่นขอผล Lab
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </div>

    <!-- ยื่นขอผล Lab (hasLab === false) -->
    <div v-else-if="hasLab === false" class="mb-6">
      <div class="d-flex align-center ga-2 mb-5">
        <v-btn
          icon="fas fa-arrow-left"
          variant="text"
          size="small"
          @click="hasLab = null"
        />
        <div>
          <div class="text-body-1 font-weight-bold">ยื่นขอผลการทดสอบ Lab</div>
          <div class="text-body-2 text-medium-emphasis">
            กรอกรายละเอียดสินค้าที่ต้องการทดสอบ
          </div>
        </div>
      </div>

      <v-card class="mb-4">
        <v-card-title
          class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
        >
          <v-icon icon="fas fa-vial" color="hcex-user" size="16" />
          ยื่นขอผลการทดสอบ Lab
        </v-card-title>
        <v-card-text class="pa-4 pt-0">
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>ชนิดสินค้า <span class="req">*</span></div>
                <div class="field-label-en">Product Type</div>
              </div>
              <v-text-field
                v-model="labRequestForm.productType"
                placeholder="เช่น มันฝรั่งทอดกรอบ"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mb-2">
                <div>จำนวนตัวอย่าง <span class="req">*</span></div>
                <div class="field-label-en">Quantity</div>
              </div>
              <v-text-field
                v-model="labRequestForm.sampleCount"
                placeholder="เช่น 5 ตัวอย่าง"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mb-2">
                <div>คำอธิบายสินค้า</div>
                <div class="field-label-en">Description</div>
              </div>
              <v-textarea
                v-model="labRequestForm.productDesc"
                placeholder="อธิบายรายละเอียดสินค้าที่ต้องการทดสอบ"
                rows="2"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mb-2">
                <div>หมายเหตุ</div>
                <div class="field-label-en">Remarks</div>
              </div>
              <v-textarea
                v-model="labRequestForm.note"
                placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                rows="2"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <div class="d-flex ga-3 mt-4">
        <v-btn
          variant="tonal"
          color="grey"
          size="large"
          prepend-icon="fas fa-chevron-left"
          @click="hasLab = null"
        >
          ย้อนกลับ
        </v-btn>
        <v-spacer />
        <v-btn
          color="hcex-user"
          size="large"
          prepend-icon="fas fa-paper-plane"
          @click="labRequestDialog = true"
        >
          ยื่นขอผล Lab
        </v-btn>
      </div>
    </div>

    <!-- Form Steps (hasLab === true) -->
    <template v-else-if="hasLab === true">
      <!-- Step Indicator -->
      <v-card class="mb-5">
        <v-card-text class="pa-5">
          <div class="d-flex align-center">
            <template v-for="(step, idx) in formSteps" :key="step.key">
              <div
                class="step-item d-flex flex-column align-center"
                style="min-width: 80px"
              >
                <div class="step-circle mb-1" :class="stepClass(idx)">
                  <v-icon
                    v-if="currentStep > idx"
                    icon="fas fa-check"
                    size="14"
                    color="white"
                  />
                  <span v-else class="text-caption font-weight-bold">{{
                    idx + 1
                  }}</span>
                </div>
                <div
                  class="text-caption text-center"
                  :class="
                    currentStep >= idx
                      ? 'text-hcex-user font-weight-bold'
                      : 'text-medium-emphasis'
                  "
                >
                  {{ step.label }}
                </div>
              </div>
              <div
                v-if="idx < formSteps.length - 1"
                class="step-line flex-grow-1"
                :class="{ 'step-line--done': currentStep > idx }"
              />
            </template>
          </div>
        </v-card-text>
      </v-card>

      <v-form ref="formRef" @submit.prevent="handleNext">
        <!-- Step 1: ข้อมูลรายละเอียด -->
        <div v-if="currentStep === 0">
          <!-- ผู้ส่งออก -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-building" color="hcex-user" size="16" />
              ผู้ส่งออก (Exporter)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="field-section-label mb-3 mt-2">ข้อมูลบริษัท</div>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    <div>ชื่อบริษัท <span class="req">*</span></div>
                    <div class="field-label-en">Company Name</div>
                  </div>
                  <v-text-field
                    v-model="form.exporterName"
                    placeholder="ชื่อบริษัทผู้ส่งออก"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    <div>ที่อยู่ <span class="req">*</span></div>
                    <div class="field-label-en">Address</div>
                  </div>
                  <v-text-field
                    v-model="form.exporterAddress"
                    placeholder="ที่อยู่บริษัท"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>ประเทศ <span class="req">*</span></div>
                    <div class="field-label-en">Country</div>
                  </div>
                  <v-text-field
                    v-model="form.exporterCountry"
                    placeholder="ประเทศ"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ผู้รับสินค้า -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-user-tie" color="hcex-user" size="16" />
              ผู้รับสินค้า (Consignee)
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="field-section-label mb-3 mt-2">
                ข้อมูลผู้รับสินค้า
              </div>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    <div>ชื่อผู้รับสินค้า <span class="req">*</span></div>
                    <div class="field-label-en">Consignee Name</div>
                  </div>
                  <v-text-field
                    v-model="form.consigneeName"
                    placeholder="Consignee name"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label">
                    <div>ที่อยู่ <span class="req">*</span></div>
                    <div class="field-label-en">Address</div>
                  </div>
                  <v-text-field
                    v-model="form.consigneeAddress"
                    placeholder="Consignee address"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>ประเทศปลายทาง <span class="req">*</span></div>
                    <div class="field-label-en">Destination Country</div>
                  </div>
                  <v-autocomplete
                    v-model="form.destination"
                    :items="countries"
                    placeholder="เลือกประเทศ"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ข้อมูลการขนส่ง -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-ship" color="hcex-user" size="16" />
              ข้อมูลการขนส่ง
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <div class="field-section-label mb-3 mt-2">
                รายละเอียดการขนส่ง
              </div>
              <v-row dense>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>วันที่ส่งสินค้า <span class="req">*</span></div>
                    <div class="field-label-en">Shipping Date</div>
                  </div>
                  <v-text-field
                    v-model="form.shipDate"
                    type="date"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>วิธีการขนส่ง <span class="req">*</span></div>
                    <div class="field-label-en">Shipping Method</div>
                  </div>
                  <v-autocomplete
                    v-model="form.shipMethod"
                    :items="shipMethods"
                    placeholder="เลือกวิธีการขนส่ง"
                    hide-details="auto"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="field-label">
                    <div>ท่าเรือ/สนามบินต้นทาง</div>
                    <div class="field-label-en">Port/Airport of Loading</div>
                  </div>
                  <v-text-field
                    v-model="form.portOfLoading"
                    placeholder="เช่น ท่าเรือแหลมฉบัง"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- รายละเอียดสินค้า -->
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center justify-space-between"
            >
              <div class="d-flex align-center ga-2">
                <v-icon icon="fas fa-box" color="hcex-user" size="16" />
                รายละเอียดสินค้า
              </div>
              <v-btn
                color="hcex-user"
                size="small"
                variant="tonal"
                prepend-icon="fas fa-plus"
                @click="addProduct"
              >
                เพิ่มรายการ
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <v-table density="comfortable">
                <thead>
                  <tr>
                    <th>Shipping Mark</th>
                    <th>Description of Goods <span class="req">*</span></th>
                    <th style="width: 120px">
                      Quantity <span class="req">*</span>
                    </th>
                    <th style="width: 130px">Net Weight (kg)</th>
                    <th style="width: 130px">Total Amount</th>
                    <th style="width: 50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, idx) in form.products" :key="idx">
                    <td class="py-2">
                      <v-text-field
                        v-model="p.shippingMark"
                        density="compact"
                        hide-details
                        placeholder="Mark"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.description"
                        density="compact"
                        hide-details
                        placeholder="ชื่อสินค้า"
                        :rules="[rules.required]"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.quantity"
                        density="compact"
                        hide-details
                        placeholder="100 CTN"
                        :rules="[rules.required]"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.netWeight"
                        density="compact"
                        hide-details
                        placeholder="1,000"
                      />
                    </td>
                    <td class="py-2">
                      <v-text-field
                        v-model="p.totalAmount"
                        density="compact"
                        hide-details
                        placeholder="USD 5,000"
                      />
                    </td>
                    <td class="py-2">
                      <v-btn
                        icon="fas fa-trash"
                        size="small"
                        variant="text"
                        color="error"
                        :disabled="form.products.length === 1"
                        @click="removeProduct(idx)"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </div>

        <!-- Step 2: เลือกผล Lab -->
        <div v-if="currentStep === 1">
          <v-card class="mb-4">
            <v-card-title
              class="pa-4 pb-2 text-body-1 font-weight-bold d-flex align-center ga-2"
            >
              <v-icon icon="fas fa-flask-vial" color="hcex-user" size="16" />
              เลือกผล Lab ที่ผ่านการพิจารณาแล้ว
            </v-card-title>
            <v-card-text class="pa-4 pt-0">
              <p class="text-body-2 text-medium-emphasis mb-4">
                เลือกผลการทดสอบ Lab ที่เกี่ยวข้องกับคำขอนี้
                (สามารถเลือกได้หลายรายการ)
              </p>
              <v-table hover>
                <thead>
                  <tr>
                    <th style="width: 50px"></th>
                    <th>เลขที่ผล Lab</th>
                    <th>ชนิดสินค้า</th>
                    <th>วันที่ทดสอบ</th>
                    <th>ผลการทดสอบ</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="lab in labResults"
                    :key="lab.id"
                    :class="{ 'selected-row': selectedLabs.includes(lab.id) }"
                    style="cursor: pointer"
                    @click="toggleLab(lab.id)"
                  >
                    <td>
                      <v-checkbox
                        :model-value="selectedLabs.includes(lab.id)"
                        color="hcex-user"
                        hide-details
                        density="compact"
                        @click.stop="toggleLab(lab.id)"
                      />
                    </td>
                    <td class="text-body-2 font-weight-medium text-hcex-user">
                      {{ lab.labNo }}
                    </td>
                    <td>{{ lab.productType }}</td>
                    <td>{{ lab.testDate }}</td>
                    <td>
                      <v-chip size="x-small" color="success" variant="tonal">
                        <v-icon start icon="fas fa-circle-check" size="10" />
                        {{ lab.result }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip size="x-small" color="hcex-user" variant="tonal"
                        >ผ่านการพิจารณา</v-chip
                      >
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div v-if="selectedLabs.length === 0" class="mt-3">
                <v-alert
                  color="hcex-user"
                  variant="tonal"
                  density="compact"
                  prepend-icon="fas fa-triangle-exclamation"
                >
                  กรุณาเลือกผล Lab อย่างน้อย 1 รายการ
                </v-alert>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <!-- Nav Buttons -->
        <div class="d-flex ga-3 mt-6">
          <v-btn
            v-if="currentStep > 0"
            variant="tonal"
            color="grey"
            size="large"
            prepend-icon="fas fa-chevron-left"
            @click="currentStep--"
          >
            ย้อนกลับ
          </v-btn>
          <v-btn
            v-if="currentStep === 0"
            variant="tonal"
            color="grey"
            size="large"
            @click="hasLab = null"
          >
            ย้อนกลับ
          </v-btn>
          <v-spacer />
          <v-btn
            variant="tonal"
            color="secondary"
            size="large"
            prepend-icon="fas fa-floppy-disk"
          >
            บันทึกแบบร่าง
          </v-btn>
          <v-btn
            v-if="currentStep < formSteps.length - 1"
            color="hcex-user"
            size="large"
            append-icon="fas fa-chevron-right"
            type="submit"
          >
            ถัดไป
          </v-btn>
          <v-btn
            v-else
            color="hcex-user"
            size="large"
            prepend-icon="fas fa-paper-plane"
            :loading="submitting"
            :disabled="selectedLabs.length === 0"
            @click="handleSubmit"
          >
            ยืนยันคำขอ
          </v-btn>
        </div>
      </v-form>
    </template>

    <!-- Lab Request Dialog -->
    <v-dialog v-model="labRequestDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div
            class="success-ring mx-auto mb-5"
            style="background: rgba(var(--v-theme-hcex-user), 0.1)"
          >
            <v-icon icon="fas fa-circle-check" size="40" color="hcex-user" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งคำขอผล Lab สำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-hcex-user mb-1">
            LAB-REQ-2568-{{ Math.floor(Math.random() * 900 + 100) }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            เมื่อผล Lab ออกแล้ว ท่านสามารถกลับมายื่นคำขอใบรับรองสุขอนามัยได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6">
          <v-btn
            color="hcex-user"
            rounded="lg"
            block
            @click="router.push('/hcex/user/dashboard')"
          >
            กลับหน้าหลัก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="420" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-5">
            <v-icon icon="fas fa-circle-check" size="40" color="success" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h3>
          <p class="text-body-2 font-weight-bold text-hcex-user mb-1">
            {{ newRequestNo }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-0">
            เจ้าหน้าที่จะตรวจสอบคำขอของท่านและแจ้งผลทางอีเมล
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-6 d-flex ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="router.push('/hcex/user/applications')"
            >ดูรายการคำขอ</v-btn
          >
          <v-btn
            color="hcex-user"
            rounded="lg"
            block
            @click="router.push('/hcex/user/applications')"
            >ติดตามสถานะ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedType = ref<string | null>(null);
const hasLab = ref<boolean | null>(null);
const currentStep = ref(0);
const submitting = ref(false);
const successDialog = ref(false);
const labRequestDialog = ref(false);
const newRequestNo = ref("");
const formRef = ref();
const selectedLabs = ref<string[]>([]);

const certTypes = [
  {
    value: "kmp1",
    label: "กมพ.1",
    desc: "ใบรับรองสุขอนามัยสำหรับสินค้าแปรรูปด้านพืชทั่วไป",
    icon: "fas fa-file-circle-check",
    color: "hcex-user",
  },
  {
    value: "kmp1-1",
    label: "กมพ.1-1",
    desc: "ใบรับรองสุขอนามัยสำหรับผลิตภัณฑ์แป้งและธัญพืชแปรรูป",
    icon: "fas fa-wheat-awn",
    color: "warning",
  },
  {
    value: "kmp1-2",
    label: "กมพ.1-2",
    desc: "ใบรับรองสำหรับผลิตภัณฑ์ผักและผลไม้แปรรูป",
    icon: "fas fa-jar",
    color: "success",
  },
  {
    value: "kmp1-3",
    label: "กมพ.1-3",
    desc: "ใบรับรองสำหรับเครื่องเทศและสมุนไพรแปรรูป",
    icon: "fas fa-mortar-pestle",
    color: "hc-staff",
  },
  {
    value: "correction",
    label: "แก้ไขใบรับรอง",
    desc: "ยื่นคำขอแก้ไขข้อมูลในใบรับรองที่ออกแล้ว",
    icon: "fas fa-file-pen",
    color: "info",
  },
];

const formSteps = [
  { key: "details", label: "ข้อมูลรายละเอียด" },
  { key: "lab", label: "เลือกผล Lab" },
];

const form = reactive({
  exporterName: "",
  exporterAddress: "",
  exporterCountry: "ไทย",
  consigneeName: "",
  consigneeAddress: "",
  destination: "",
  shipDate: "",
  shipMethod: "",
  portOfLoading: "",
  products: [
    {
      shippingMark: "",
      description: "",
      quantity: "",
      netWeight: "",
      totalAmount: "",
    },
  ],
});

const labRequestForm = reactive({
  productType: "",
  productDesc: "",
  sampleCount: "",
  note: "",
});

const shipMethods = ["ทางเรือ", "ทางอากาศ", "ทางบก"];

const countries = [
  "จีน",
  "ญี่ปุ่น",
  "เกาหลีใต้",
  "สิงคโปร์",
  "ฮ่องกง",
  "เวียดนาม",
  "มาเลเซีย",
  "สหรัฐอเมริกา",
  "สหภาพยุโรป",
  "ออสเตรเลีย",
];

const labResults = [
  {
    id: "LAB-001",
    labNo: "LAB-2568-00089",
    productType: "มันฝรั่งทอดกรอบ",
    testDate: "5 ม.ค. 68",
    result: "ผ่าน",
  },
  {
    id: "LAB-002",
    labNo: "LAB-2568-00085",
    productType: "ข้าวกล้องบรรจุถุง",
    testDate: "3 ม.ค. 68",
    result: "ผ่าน",
  },
  {
    id: "LAB-003",
    labNo: "LAB-2568-00080",
    productType: "แป้งมันสำปะหลัง",
    testDate: "28 ธ.ค. 67",
    result: "ผ่าน",
  },
  {
    id: "LAB-004",
    labNo: "LAB-2568-00076",
    productType: "พริกแห้งบด",
    testDate: "20 ธ.ค. 67",
    result: "ผ่าน",
  },
];

function stepClass(idx: number) {
  if (currentStep.value > idx) return "step-done";
  if (currentStep.value === idx) return "step-active";
  return "step-pending";
}

function addProduct() {
  form.products.push({
    shippingMark: "",
    description: "",
    quantity: "",
    netWeight: "",
    totalAmount: "",
  });
}
function removeProduct(idx: number) {
  form.products.splice(idx, 1);
}
function toggleLab(id: string) {
  const idx = selectedLabs.value.indexOf(id);
  if (idx === -1) {
    selectedLabs.value.push(id);
  } else {
    selectedLabs.value.splice(idx, 1);
  }
}

const rules = {
  required: (v: unknown) =>
    !!v || (Array.isArray(v) && v.length > 0) || "กรุณากรอกข้อมูล",
};

async function handleNext() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  if (currentStep.value < formSteps.length - 1) {
    currentStep.value++;
  }
}

async function handleSubmit() {
  if (selectedLabs.value.length === 0) return;
  submitting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  submitting.value = false;
  newRequestNo.value = `HCEX-2568-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`;
  successDialog.value = true;
}
</script>

<style scoped>
div {
  --step-color: rgb(var(--v-theme-hcex-user));
  --step-color-tint: rgba(var(--v-theme-hcex-user), 0.2);
}

/* Lab Option Card */
.lab-option-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.lab-option-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1) !important;
}
.lab-option-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lab-check-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(var(--v-theme-hcex-user), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Selected row */
.selected-row {
  background: rgba(var(--v-theme-hcex-user), 0.06);
}

</style>
