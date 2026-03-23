<template>
  <div style="--v-theme-primary: var(--v-theme-el-staff)">
    <!-- Back + Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.push('/el/staff/applications')"
      />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-3 flex-wrap">
          <h1 class="page-title mb-0">
            {{ appDetail.requestNo }}
          </h1>
          <v-chip color="el-staff" size="small" variant="tonal"
            >อยู่ระหว่างตรวจประเมิน</v-chip
          >
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          {{ appDetail.establishmentName }} · ยื่นเมื่อ
          {{ appDetail.submittedDate }}
        </p>
      </div>
    </div>

    <!-- Workflow Step Indicator -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center ga-0">
          <div
            v-for="(step, idx) in workflowSteps"
            :key="step"
            class="d-flex align-center flex-grow-1"
          >
            <div class="d-flex flex-column align-center">
              <div
                class="step-circle"
                :class="{
                  'step-circle--active': currentWorkflowStep === idx,
                  'step-circle--done': currentWorkflowStep > idx,
                }"
              >
                <v-icon
                  v-if="currentWorkflowStep > idx"
                  icon="fas fa-check"
                  size="14"
                />
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <span
                class="text-caption mt-1 text-center"
                :class="
                  currentWorkflowStep >= idx
                    ? 'text-el-staff font-weight-medium'
                    : 'text-medium-emphasis'
                "
                style="max-width: 80px; line-height: 1.3"
              >
                {{ step }}
              </span>
            </div>
            <div
              v-if="idx < workflowSteps.length - 1"
              class="step-line flex-grow-1"
              :class="{ 'step-line--done': currentWorkflowStep > idx }"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- ─── STEP 1: ข้อมูลคำขอ ─── -->
    <template v-if="currentWorkflowStep === 0">
      <v-row>
        <v-col cols="12" md="8">
          <!-- ข้อมูลโรงคัดบรรจุ -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-warehouse"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              ข้อมูลโรงคัดบรรจุ
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="info-label">ชื่อโรงคัดบรรจุ</div>
                  <div class="info-value">
                    {{ appDetail.establishmentName }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-label">ที่อยู่</div>
                  <div class="info-value">{{ appDetail.address }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="info-label">ชนิดพืช</div>
                  <div class="info-value">{{ appDetail.cropType }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="info-label">ระบบมาตรฐาน</div>
                  <div class="info-value">{{ appDetail.qualitySystem }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="info-label">จังหวัด</div>
                  <div class="info-value">{{ appDetail.province }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- ข้อมูลเกษตรกร -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-users"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              ข้อมูลเกษตรกร ({{ appDetail.farmers.length }} ราย)
            </v-card-title>
            <v-divider />
            <v-table density="compact" class="pa-2">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>ชนิดพืช</th>
                  <th>รหัสใบรับรอง</th>
                  <th>จังหวัด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="farmer in appDetail.farmers" :key="farmer.name">
                  <td>{{ farmer.name }}</td>
                  <td>{{ farmer.cropType }}</td>
                  <td>{{ farmer.certNo }}</td>
                  <td>{{ farmer.province }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- ข้อมูลแปลง -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-seedling"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              ข้อมูลแปลงเกษตร ({{ appDetail.farms.length }} แปลง)
            </v-card-title>
            <v-divider />
            <v-table density="compact" class="pa-2">
              <thead>
                <tr>
                  <th>ชนิดพืช</th>
                  <th>พื้นที่ (ไร่)</th>
                  <th>ผลผลิต (กก./ปี)</th>
                  <th>จังหวัด</th>
                  <th>พิกัด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="farm in appDetail.farms" :key="farm.id">
                  <td>{{ farm.cropType }}</td>
                  <td>{{ farm.area }}</td>
                  <td>{{ farm.yield }}</td>
                  <td>{{ farm.province }}</td>
                  <td class="text-caption text-medium-emphasis">
                    {{ farm.coord }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <!-- Document Checklist -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-paperclip"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              ตรวจสอบเอกสาร
            </v-card-title>
            <v-divider />
            <v-list density="compact" class="pa-2">
              <v-list-item
                v-for="doc in documentChecklist"
                :key="doc.name"
                rounded="lg"
                class="mb-1"
              >
                <template #prepend>
                  <v-icon
                    :icon="
                      doc.present
                        ? 'fas fa-circle-check'
                        : 'fas fa-circle-xmark'
                    "
                    :color="doc.present ? 'success' : 'error'"
                    size="18"
                    class="mr-2"
                  />
                </template>
                <v-list-item-title class="text-body-2">{{
                  doc.name
                }}</v-list-item-title>
                <template #append>
                  <v-chip
                    :color="doc.present ? 'success' : 'error'"
                    size="x-small"
                    variant="tonal"
                  >
                    {{ doc.present ? "มีเอกสาร" : "ไม่มีเอกสาร" }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <!-- Action Card -->
          <v-card rounded="xl" elevation="0" class="section-card">
            <v-card-title class="pa-5 pb-3 section-title"
              >การดำเนินการ</v-card-title
            >
            <v-divider />
            <v-card-text class="pa-5 d-flex flex-column ga-3">
              <v-btn
                color="error"
                variant="tonal"
                rounded="lg"
                block
                prepend-icon="fas fa-rotate-left"
                @click="returnDialog = true"
              >
                ส่งกลับแก้ไข
              </v-btn>
              <v-btn
                color="el-staff"
                rounded="lg"
                block
                prepend-icon="fas fa-circle-check"
                @click="currentWorkflowStep++"
              >
                ผ่านการตรวจสอบ
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- ─── STEP 2: นัดตรวจแปลง ─── -->
    <template v-if="currentWorkflowStep === 1">
      <v-row>
        <v-col cols="12" md="7">
          <v-card rounded="xl" elevation="0" class="section-card">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-calendar-plus"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              กำหนดนัดหมาย
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1"><div>วันที่นัดตรวจ</div><div class="field-label-en">Inspection Date</div></div>
                  <v-text-field
                    v-model="schedule.date"
                    type="date"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="field-label mb-1"><div>เวลา</div><div class="field-label-en">Time</div></div>
                  <v-text-field
                    v-model="schedule.time"
                    type="time"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1"><div>ผู้ตรวจ</div><div class="field-label-en">Inspector Name</div></div>
                  <v-autocomplete
                    v-model="schedule.inspector"
                    :items="inspectorOptions"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12">
                  <div class="field-label mb-1"><div>หมายเหตุ</div><div class="field-label-en">Remarks</div></div>
                  <v-textarea
                    v-model="schedule.note"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="5">
          <v-card rounded="xl" elevation="0" class="section-card">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-map-location-dot"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              แปลงที่ต้องตรวจ
            </v-card-title>
            <v-divider />
            <v-list density="compact" class="pa-2">
              <v-list-item
                v-for="farm in appDetail.farms"
                :key="farm.id"
                rounded="lg"
                class="mb-1"
              >
                <template #prepend>
                  <v-avatar
                    color="el-staff"
                    variant="tonal"
                    size="30"
                    rounded="lg"
                    class="mr-2"
                  >
                    <v-icon icon="fas fa-seedling" size="12" />
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{
                  farm.cropType
                }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption"
                  >{{ farm.province }} ·
                  {{ farm.area }} ไร่</v-list-item-subtitle
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex justify-space-between mt-6">
        <v-btn
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="currentWorkflowStep--"
        >
          ย้อนกลับ
        </v-btn>
        <v-btn
          color="el-staff"
          rounded="lg"
          prepend-icon="fas fa-calendar-check"
          @click="currentWorkflowStep++"
        >
          บันทึกนัดหมาย
        </v-btn>
      </div>
    </template>

    <!-- ─── STEP 3: ผลตรวจแปลง ─── -->
    <template v-if="currentWorkflowStep === 2">
      <!-- ข้อมูลทั่วไปของการตรวจ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-circle-info" color="el-staff" class="mr-2" size="18" />
          ข้อมูลทั่วไปของการตรวจ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-row dense class="mb-4">
            <v-col cols="12" sm="6">
              <div class="info-label">ผู้ตรวจ</div>
              <div class="info-value">
                {{ inspectorOptions.find((i) => i.id === schedule.inspector)?.name ?? "—" }}
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-label">วันที่ตรวจ</div>
              <div class="info-value">{{ schedule.date || "—" }}</div>
            </v-col>
          </v-row>
          <div class="text-body-2 font-weight-medium mb-2">แปลงเกษตรกรที่ตรวจ</div>
          <v-table density="compact" class="rounded-lg">
            <thead>
              <tr>
                <th>ชื่อเกษตรกร</th>
                <th>รหัสใบรับรอง</th>
                <th>ที่ตั้ง</th>
                <th>จังหวัด</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="appDetail.farmers.length === 0">
                <td colspan="4" class="text-center text-medium-emphasis py-4 text-body-2">ไม่มีข้อมูล</td>
              </tr>
              <tr v-for="farmer in appDetail.farmers" :key="farmer.certNo">
                <td>{{ farmer.name }}</td>
                <td>{{ farmer.certNo }}</td>
                <td class="text-medium-emphasis">—</td>
                <td>{{ farmer.province }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- CL-02 -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">
          <v-icon icon="fas fa-clipboard-list" color="el-staff" class="mr-2" size="18" />
          แบบตรวจประเมิน CL-02
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div v-for="(item, idx) in inspectionChecklist" :key="idx" class="checklist-row rounded-lg pa-4 mb-3">
            <div class="d-flex align-center justify-space-between flex-wrap ga-3">
              <div class="flex-grow-1">
                <div class="text-caption text-medium-emphasis mb-1">{{ idx + 1 }}. {{ item.section }}</div>
                <div class="text-body-2 font-weight-medium">{{ item.question }}</div>
              </div>
              <v-radio-group v-model="item.answer" inline hide-details density="compact">
                <v-radio label="ใช่" value="yes" color="success" />
                <v-radio label="ไม่ใช่" value="no" color="error" />
              </v-radio-group>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- ผลตรวจเชื้อจุลินทรีย์ -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between section-title">
          <span>
            <v-icon icon="fas fa-microscope" color="el-staff" class="mr-2" size="18" />
            ผลตรวจเชื้อจุลินทรีย์
          </span>
          <v-btn color="el-staff" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-plus" @click="openAddTest('micro')">เพิ่ม</v-btn>
        </v-card-title>
        <v-divider />
        <v-table density="compact" class="pa-2">
          <thead>
            <tr>
              <th>เชื้อ</th>
              <th>ผลตรวจ</th>
              <th>ผ่าน/ไม่ผ่าน</th>
              <th>หมายเหตุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="microResults.length === 0">
              <td colspan="5" class="text-center text-medium-emphasis py-4 text-body-2">ไม่มีข้อมูล</td>
            </tr>
            <tr v-for="(row, idx) in microResults" :key="row.id">
              <td>{{ row.subject }}</td>
              <td>{{ row.value }}</td>
              <td>
                <v-chip :color="row.pass === 'pass' ? 'success' : 'error'" size="x-small" variant="tonal">
                  {{ row.pass === "pass" ? "ผ่าน" : "ไม่ผ่าน" }}
                </v-chip>
              </td>
              <td class="text-medium-emphasis">{{ row.remark || "—" }}</td>
              <td class="text-right" style="min-width:80px">
                <v-btn icon="fas fa-pen" variant="text" size="x-small" color="el-staff" @click="openEditTest('micro', idx)" />
                <v-btn icon="fas fa-trash" variant="text" size="x-small" color="error" @click="deleteTest('micro', idx)" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- ผลตรวจสารตกค้าง -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between section-title">
          <span>
            <v-icon icon="fas fa-flask" color="el-staff" class="mr-2" size="18" />
            ผลตรวจสารตกค้าง
          </span>
          <v-btn color="el-staff" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-plus" @click="openAddTest('residue')">เพิ่ม</v-btn>
        </v-card-title>
        <v-divider />
        <v-table density="compact" class="pa-2">
          <thead>
            <tr>
              <th>สาร</th>
              <th>ผลตรวจ</th>
              <th>ผ่าน/ไม่ผ่าน</th>
              <th>หมายเหตุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="residueResults.length === 0">
              <td colspan="5" class="text-center text-medium-emphasis py-4 text-body-2">ไม่มีข้อมูล</td>
            </tr>
            <tr v-for="(row, idx) in residueResults" :key="row.id">
              <td>{{ row.subject }}</td>
              <td>{{ row.value }}</td>
              <td>
                <v-chip :color="row.pass === 'pass' ? 'success' : 'error'" size="x-small" variant="tonal">
                  {{ row.pass === "pass" ? "ผ่าน" : "ไม่ผ่าน" }}
                </v-chip>
              </td>
              <td class="text-medium-emphasis">{{ row.remark || "—" }}</td>
              <td class="text-right" style="min-width:80px">
                <v-btn icon="fas fa-pen" variant="text" size="x-small" color="el-staff" @click="openEditTest('residue', idx)" />
                <v-btn icon="fas fa-trash" variant="text" size="x-small" color="error" @click="deleteTest('residue', idx)" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- ผลตรวจแมลง -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between section-title">
          <span>
            <v-icon icon="fas fa-bug" color="el-staff" class="mr-2" size="18" />
            ผลตรวจแมลง
          </span>
          <v-btn color="el-staff" variant="tonal" size="small" rounded="lg" prepend-icon="fas fa-plus" @click="openAddTest('insect')">เพิ่ม</v-btn>
        </v-card-title>
        <v-divider />
        <v-table density="compact" class="pa-2">
          <thead>
            <tr>
              <th>แมลง</th>
              <th>ผลตรวจ</th>
              <th>ผ่าน/ไม่ผ่าน</th>
              <th>หมายเหตุ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="insectResults.length === 0">
              <td colspan="5" class="text-center text-medium-emphasis py-4 text-body-2">ไม่มีข้อมูล</td>
            </tr>
            <tr v-for="(row, idx) in insectResults" :key="row.id">
              <td>{{ row.subject }}</td>
              <td>{{ row.value }}</td>
              <td>
                <v-chip :color="row.pass === 'pass' ? 'success' : 'error'" size="x-small" variant="tonal">
                  {{ row.pass === "pass" ? "ผ่าน" : "ไม่ผ่าน" }}
                </v-chip>
              </td>
              <td class="text-medium-emphasis">{{ row.remark || "—" }}</td>
              <td class="text-right" style="min-width:80px">
                <v-btn icon="fas fa-pen" variant="text" size="x-small" color="el-staff" @click="openEditTest('insect', idx)" />
                <v-btn icon="fas fa-trash" variant="text" size="x-small" color="error" @click="deleteTest('insect', idx)" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- Summary Decision -->
      <v-card rounded="xl" elevation="0" class="section-card mb-5">
        <v-card-title class="pa-5 pb-3 section-title">ผลการตรวจประเมินโดยรวม</v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-radio-group v-model="inspectionDecision" inline class="mb-4">
            <v-radio label="ผ่าน" value="pass" color="success" />
            <v-radio label="ปรับปรุง" value="improve" color="warning" />
            <v-radio label="ไม่ผ่าน" value="fail" color="error" />
          </v-radio-group>
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="field-label mb-1"><div>หมายเหตุ</div><div class="field-label-en">Remarks</div></div>
              <v-textarea v-model="inspectionNote" variant="outlined" density="compact" rounded="lg" rows="3" />
            </v-col>
            <v-col cols="12" md="6">
              <div class="field-label mb-1"><div>ข้อเสนอแนะ</div><div class="field-label-en">Suggestion</div></div>
              <v-textarea v-model="inspectionSuggestion" variant="outlined" density="compact" rounded="lg" rows="3" />
            </v-col>
          </v-row>
          <div class="upload-area rounded-xl mt-3 d-flex flex-column align-center justify-center pa-5">
            <v-icon icon="fas fa-cloud-arrow-up" color="el-staff" size="28" class="mb-2" />
            <div class="text-body-2 font-weight-medium mb-1">แนบภาพถ่ายการตรวจ</div>
            <div class="text-caption text-medium-emphasis">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</div>
            <div class="text-caption text-medium-emphasis mt-1">รองรับ JPG / PNG</div>
          </div>
        </v-card-text>
      </v-card>

      <div class="d-flex justify-space-between">
        <v-btn variant="tonal" color="grey" rounded="lg" prepend-icon="fas fa-arrow-left" @click="currentWorkflowStep--">ย้อนกลับ</v-btn>
        <v-btn color="el-staff" rounded="lg" prepend-icon="fas fa-floppy-disk" @click="currentWorkflowStep++">บันทึกผลการตรวจ</v-btn>
      </div>

      <!-- Test Result Dialog -->
      <v-dialog v-model="testDialog" max-width="500">
        <v-card rounded="xl">
          <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
            {{ testDialogMode === "add" ? "เพิ่มรายการ" : "แก้ไขรายการ" }} — {{ testDialogLabel }}
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-5">
            <v-row dense>
              <v-col cols="12">
                <div class="field-label mb-1"><div>{{ testDialogLabel }}</div><div class="field-label-en">Item</div></div>
                <v-autocomplete
                  v-model="testDialogItem.subject"
                  :items="testDialogOptions"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1"><div>ผลตรวจ</div><div class="field-label-en">Test Result</div></div>
                <v-text-field v-model="testDialogItem.value" variant="outlined" density="compact" rounded="lg" />
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1"><div>ผ่าน/ไม่ผ่าน</div><div class="field-label-en">Pass/Fail</div></div>
                <v-autocomplete
                  v-model="testDialogItem.pass"
                  :items="[{ title: 'ผ่าน', value: 'pass' }, { title: 'ไม่ผ่าน', value: 'fail' }]"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mb-1"><div>หมายเหตุ</div><div class="field-label-en">Remarks</div></div>
                <v-text-field v-model="testDialogItem.remark" variant="outlined" density="compact" rounded="lg" />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="px-5 pb-5 ga-2">
            <v-btn variant="tonal" color="grey" rounded="lg" @click="testDialog = false">ยกเลิก</v-btn>
            <v-btn color="el-staff" rounded="lg" @click="saveTest">บันทึก</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- ─── STEP 4: รายงานผล ─── -->
    <template v-if="currentWorkflowStep === 3">
      <v-row>
        <v-col cols="12" md="7">
          <!-- Summary Card -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title"
              >สรุปผลการตรวจประเมิน</v-card-title
            >
            <v-divider />
            <v-card-text class="pa-5">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="info-label">ผลการตรวจ</div>
                  <v-chip color="success" variant="tonal" size="small"
                    >ผ่านการตรวจประเมิน</v-chip
                  >
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-label">วันที่ตรวจ</div>
                  <div class="info-value">15 มี.ค. 2568</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-label">ผู้ตรวจ</div>
                  <div class="info-value">นิธิพร เทิบจันทึก</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="info-label">โรงคัดบรรจุ</div>
                  <div class="info-value">
                    {{ appDetail.establishmentName }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-alert
            color="success"
            variant="tonal"
            rounded="xl"
            class="mb-4"
            prepend-icon="fas fa-circle-check"
          >
            <div class="text-body-2 font-weight-medium">ผ่านการตรวจประเมิน</div>
            <div class="text-body-2">
              โรงคัดบรรจุผ่านเกณฑ์การตรวจประเมินทุกหัวข้อ พร้อมเสนอขึ้นทะเบียน
              EL
            </div>
          </v-alert>

          <!-- เสนอคณะกรรมการ -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-title class="pa-5 pb-3 section-title">
              <v-icon
                icon="fas fa-users-gear"
                color="el-staff"
                class="mr-2"
                size="18"
              />
              เสนอคณะกรรมการ EL
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-5">
              <div class="field-label mb-1"><div>เลือกคณะกรรมการ</div><div class="field-label-en">Committee Select</div></div>
              <v-autocomplete
                v-model="selectedCommittee"
                :items="committeeOptions"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                rounded="lg"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex justify-space-between mt-2">
        <v-btn
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="currentWorkflowStep--"
        >
          ย้อนกลับ
        </v-btn>
        <v-btn
          color="el-staff"
          rounded="lg"
          prepend-icon="fas fa-paper-plane"
          @click="confirmDialog = true"
        >
          ส่งให้คณะกรรมการพิจารณา
        </v-btn>
      </div>
    </template>

    <!-- Return Dialog -->
    <v-dialog v-model="returnDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
          <v-icon
            icon="fas fa-rotate-left"
            color="error"
            class="mr-2"
            size="18"
          />
          ส่งกลับแก้ไข
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div class="field-label mb-1"><div>เหตุผลในการส่งกลับ <span class="req">*</span></div><div class="field-label-en">Return Reason</div></div>
          <v-textarea
            v-model="returnReason"
            variant="outlined"
            density="compact"
            rounded="lg"
            rows="4"
            placeholder="ระบุรายการที่ต้องแก้ไข..."
          />
        </v-card-text>
        <v-card-actions class="px-5 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="returnDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" @click="returnDialog = false"
            >ยืนยันส่งกลับ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Dialog -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="confirm-ring mx-auto mb-4">
            <v-icon icon="fas fa-paper-plane" color="el-staff" size="32" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการส่ง</h3>
          <p class="text-body-2 text-medium-emphasis">
            ส่งรายงานผลการตรวจประเมินให้คณะกรรมการ EL พิจารณาใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="confirmDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="el-staff"
            rounded="lg"
            block
            @click="doSubmitToCommittee"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="400" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="36" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งรายงานสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            รอคณะกรรมการ EL พิจารณา
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="el-staff"
            rounded="lg"
            block
            @click="router.push('/el/staff/applications')"
          >
            กลับรายการคำขอ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentWorkflowStep = ref(0);
const returnDialog = ref(false);
const confirmDialog = ref(false);
const successDialog = ref(false);
const returnReason = ref("");
const inspectionDecision = ref("pass");
const inspectionNote = ref("");
const inspectionSuggestion = ref("");
const selectedCommittee = ref(null);

// Test result tables

const microResults = ref([]);
const residueResults = ref([]);
const insectResults = ref([]);

const testDialog = ref(false);
const testDialogMode = ref("add");
const testDialogType = ref("micro");
const testDialogItem = ref({ subject: "", value: "", pass: "pass", remark: "" });
const testDialogIndex = ref(-1);

const microOptions = ["E. coli", "Salmonella", "Listeria monocytogenes", "Coliform", "Staphylococcus aureus"];
const residueOptions = ["กลุ่ม Organophosphate", "กลุ่ม Pyrethroid", "กลุ่ม Carbamate", "กลุ่ม Organochlorine", "Dithiocarbamate"];
const insectOptions = ["เพลี้ยไฟ (Thrips)", "เพลี้ยแป้ง (Mealybug)", "เพลี้ยหอย (Scale)", "หนอน (Larva)", "ไรแดง (Spider mite)"];

const testDialogLabel = computed(() =>
  testDialogType.value === "micro" ? "เชื้อ" : testDialogType.value === "residue" ? "สาร" : "แมลง"
);
const testDialogOptions = computed(() =>
  testDialogType.value === "micro" ? microOptions : testDialogType.value === "residue" ? residueOptions : insectOptions
);

let testIdCounter = 1;

function getResultList(type) {
  if (type === "micro") return microResults.value;
  if (type === "residue") return residueResults.value;
  return insectResults.value;
}

function openAddTest(type) {
  testDialogType.value = type;
  testDialogMode.value = "add";
  testDialogItem.value = { subject: "", value: "", pass: "pass", remark: "" };
  testDialogIndex.value = -1;
  testDialog.value = true;
}

function openEditTest(type, index) {
  testDialogType.value = type;
  testDialogMode.value = "edit";
  const item = getResultList(type)[index];
  testDialogItem.value = { ...item };
  testDialogIndex.value = index;
  testDialog.value = true;
}

function saveTest() {
  const list = getResultList(testDialogType.value);
  if (testDialogMode.value === "add") {
    list.push({ id: testIdCounter++, ...testDialogItem.value });
  } else {
    Object.assign(list[testDialogIndex.value], testDialogItem.value);
  }
  testDialog.value = false;
}

function deleteTest(type, index) {
  getResultList(type).splice(index, 1);
}

const workflowSteps = ["ข้อมูลคำขอ", "นัดตรวจแปลง", "ผลตรวจแปลง", "บันทึกผล"];

const appDetail = {
  requestNo: "EL-2568-00002",
  establishmentName: "บ.ไทยฟรุ๊ตส์ เอ็กซ์พอร์ต จก.",
  address: "123 ถนนพหลโยธิน เขตลาดยาว กรุงเทพฯ",
  cropType: "ทุเรียน",
  qualitySystem: "GMP+HACCP",
  province: "กรุงเทพมหานคร",
  submittedDate: "10 ก.พ. 2568",
  farmers: [
    {
      name: "นายสมชาย ใจดี",
      cropType: "ทุเรียน",
      certNo: "GAP-2566-00123",
      province: "จันทบุรี",
    },
    {
      name: "นางสาวสมหญิง รักดี",
      cropType: "ทุเรียน",
      certNo: "GAP-2566-00145",
      province: "ระยอง",
    },
    {
      name: "นายประสิทธิ์ มีสุข",
      cropType: "ทุเรียน",
      certNo: "GAP-2566-00167",
      province: "ชลบุรี",
    },
  ],
  farms: [
    {
      id: 1,
      cropType: "ทุเรียน",
      area: "15",
      yield: "30,000",
      province: "จันทบุรี",
      coord: "13.0527, 102.0879",
    },
    {
      id: 2,
      cropType: "ทุเรียน",
      area: "10",
      yield: "20,000",
      province: "ระยอง",
      coord: "12.6819, 101.2800",
    },
    {
      id: 3,
      cropType: "ทุเรียน",
      area: "8",
      yield: "16,000",
      province: "ชลบุรี",
      coord: "13.3611, 100.9847",
    },
    {
      id: 4,
      cropType: "ทุเรียน",
      area: "20",
      yield: "40,000",
      province: "จันทบุรี",
      coord: "13.1066, 102.1235",
    },
    {
      id: 5,
      cropType: "ทุเรียน",
      area: "12",
      yield: "24,000",
      province: "ระยอง",
      coord: "12.7124, 101.3045",
    },
  ],
};

const documentChecklist = [
  { name: "แผนที่แปลง", present: true },
  { name: "สำเนาใบรับรอง GAP", present: true },
  { name: "Farm Contract", present: true },
  { name: "แผนตรวจติดตาม", present: true },
  { name: "แผนจัดการสารเคมี", present: true },
  { name: "แผนเก็บเกี่ยว", present: false },
  { name: "HACCP Plan", present: true },
  { name: "CCP Validation", present: false },
];

const inspectionChecklist = reactive([
  {
    section: "ระบบการตรวจติดตามแปลง",
    question: "มีการบันทึกการตรวจติดตามแปลงพืช",
    answer: "",
  },
  {
    section: "การประเมินความเสี่ยง",
    question: "มีการประเมินความเสี่ยงของพื้นที่เพาะปลูก",
    answer: "",
  },
  {
    section: "การตรวจสารตกค้าง",
    question: "มีการสุ่มตรวจสารเคมีตกค้างและจุลินทรีย์",
    answer: "",
  },
  {
    section: "ระบบทะเบียนเกษตรกร",
    question: "มีการควบคุมทะเบียนแปลง (AVL)",
    answer: "",
  },
  {
    section: "การฝึกอบรมเกษตรกร",
    question: "มีการฝึกอบรมเกษตรกรด้านการใช้สารเคมีและความปลอดภัย",
    answer: "",
  },
  {
    section: "การควบคุมอื่น ๆ",
    question: "มีระบบป้องกันการปนเปื้อนในสถานที่คัดแยก",
    answer: "",
  },
]);

const schedule = reactive({
  date: "",
  time: "",
  inspector: null,
  note: "",
});

const inspectorOptions = [
  { id: "1", name: "นิธิพร เทิบจันทึก" },
  { id: "2", name: "สมชาย วิชาการ" },
];

const committeeOptions = [
  { id: "1", name: "คณะกรรมการ EL ชุดที่ 1 (ประจำปี 2568)" },
  { id: "2", name: "คณะกรรมการ EL ชุดที่ 2 (ประจำปี 2568)" },
];

function doSubmitToCommittee() {
  confirmDialog.value = false;
  successDialog.value = true;
}
</script>

<style scoped>
div { --step-color: rgb(var(--v-theme-el-staff)); --step-color-tint: rgba(var(--v-theme-el-staff), 0.2); }
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.45);
  background: transparent;
  flex-shrink: 0;
}
.step-circle--active {
  border-color: rgb(var(--v-theme-el-staff));
  color: rgb(var(--v-theme-el-staff));
  background: rgba(var(--v-theme-el-staff), 0.08);
}
.step-circle--done {
  border-color: rgb(var(--v-theme-el-staff));
  background: rgb(var(--v-theme-el-staff));
  color: white;
}
.checklist-row {
  background: rgba(var(--v-theme-el-staff), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.upload-area {
  border: 2px dashed rgba(var(--v-theme-el-staff), 0.35);
  background: rgba(var(--v-theme-el-staff), 0.03);
  cursor: pointer;
  min-height: 100px;
}
.confirm-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-el-staff), 0.1);
}
</style>
