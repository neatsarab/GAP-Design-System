<template>
  <div style="--v-theme-primary: var(--v-theme-gap-staff)">
    <!-- Back + Header -->
    <div class="d-flex align-center ga-3 mb-5 flex-wrap">
      <v-btn
        variant="text"
        prepend-icon="fas fa-arrow-left"
        size="small"
        @click="goToApplicationList"
      >
        กลับ
      </v-btn>
      <v-divider vertical style="height: 24px" />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 flex-wrap">
          <h1 class="text-h6 font-weight-bold">{{ app.requestNo }}</h1>
          <v-chip
            size="small"
            :color="statusColor"
            variant="tonal"
            :prepend-icon="statusIcon"
          >
            {{ statusLabel }}
          </v-chip>
        </div>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          ยื่นเมื่อ {{ app.submittedAt }} · {{ app.certType }} ·
          {{ app.province }}
        </p>
      </div>
    </div>

    <!-- Workflow Stepper -->
    <v-card rounded="xl" elevation="0" class="mb-6 section-card">
      <v-card-text class="pa-5">
        <div class="d-flex align-center">
          <template v-for="(step, i) in steps" :key="step.value">
            <div class="step-item d-flex flex-column align-center" style="min-width: 80px">
              <div class="step-circle mb-1" :class="stepClass(step.value)">
                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                <span v-else class="text-caption font-weight-bold">{{ step.value + 1 }}</span>
              </div>
              <div class="text-caption text-center" :class="currentStep >= step.value ? 'text-gap-staff font-weight-bold' : 'text-medium-emphasis'">
                {{ step.title }}
              </div>
            </div>
            <div v-if="i < steps.length - 1" class="step-line flex-grow-1" :class="{ 'step-line--done': currentStep > step.value }" />
          </template>
        </div>
      </v-card-text>
    </v-card>

    <!-- Step Content -->
    <v-card>
      <!-- Step Tabs -->
      <v-tabs
        v-model="viewStep"
        color="gap-staff"
        density="compact"
        class="border-b"
      >
        <v-tab
          v-for="step in workflowSteps"
          :key="step.id"
          :value="step.id"
          :disabled="app.currentStep < step.id"
        >
          <v-icon :icon="step.icon" size="14" class="mr-2" />
          <span class="d-none d-sm-inline">{{ step.label }}</span>
          <span class="d-sm-none">{{ step.id }}</span>
        </v-tab>
      </v-tabs>

      <v-window v-model="viewStep">
        <!-- ══ Step 1: ข้อมูลคำขอ ══ -->
        <v-window-item :value="1">
          <v-card-text class="pa-5">
            <div class="step-title mb-5">
              <v-icon
                icon="fas fa-user-circle"
                color="gap-staff"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >ข้อมูลผู้ยื่นคำขอ</span
              >
            </div>

            <v-row class="mb-5">
              <v-col cols="12" sm="6" md="3"
                ><info-field label="ชื่อ-นามสกุล" :value="app.farmer.name"
              /></v-col>
              <v-col cols="12" sm="6" md="3"
                ><info-field label="เลขบัตรประชาชน" :value="app.farmer.idCard"
              /></v-col>
              <v-col cols="12" sm="6" md="3"
                ><info-field label="โทรศัพท์" :value="app.farmer.phone"
              /></v-col>
              <v-col cols="12" sm="6" md="3"
                ><info-field label="Email" :value="app.farmer.email"
              /></v-col>
              <v-col cols="12"
                ><info-field label="ที่อยู่" :value="app.farmer.address"
              /></v-col>
            </v-row>

            <div class="step-title mb-4">
              <v-icon
                icon="fas fa-map"
                color="success"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >ข้อมูลแปลงเพาะปลูก</span
              >
            </div>

            <v-table class="mb-5">
              <thead>
                <tr>
                  <th>ชนิดพืช / พันธุ์</th>
                  <th>พื้นที่ (ไร่)</th>
                  <th>จังหวัด</th>
                  <th>อายุพืช</th>
                  <th>เลขประจำแปลง</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plot in app.plots" :key="plot.plotId">
                  <td>{{ plot.crop }} · {{ plot.variety }}</td>
                  <td>{{ plot.area }}</td>
                  <td>{{ plot.province }}</td>
                  <td>{{ plot.age }}</td>
                  <td class="text-caption text-medium-emphasis">
                    {{ plot.plotId }}
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div class="step-title mb-4">
              <v-icon
                icon="fas fa-paperclip"
                color="warning"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold">เอกสารแนบ</span>
            </div>

            <div class="d-flex flex-wrap ga-2 mb-6">
              <v-chip
                v-for="doc in app.documents"
                :key="doc.name"
                :prepend-icon="
                  doc.uploaded ? 'fas fa-file-check' : 'fas fa-file-xmark'
                "
                :color="doc.uploaded ? 'success' : 'error'"
                variant="tonal"
                size="small"
              >
                {{ doc.name }}
              </v-chip>
            </div>

            <!-- Actions (only if current step) -->
            <v-divider class="mb-4" />
            <div v-if="app.currentStep === 1" class="d-flex ga-3 flex-wrap">
              <v-btn
                color="success"
                prepend-icon="fas fa-circle-check"
                @click="approveStep1"
              >
                ผ่านการตรวจสอบ — นัดตรวจแปลง
              </v-btn>
              <v-btn
                color="error"
                variant="tonal"
                prepend-icon="fas fa-circle-xmark"
                @click="openRejectDialog"
              >
                ไม่ผ่าน — ส่งกลับแก้ไข
              </v-btn>
            </div>
            <v-alert
              v-else-if="app.currentStep > 1"
              type="success"
              variant="tonal"
              density="compact"
              icon="fas fa-circle-check"
            >
              ผ่านการตรวจสอบเอกสารแล้ว
            </v-alert>
          </v-card-text>
        </v-window-item>

        <!-- ══ Step 2: นัดตรวจแปลง ══ -->
        <v-window-item :value="2">
          <v-card-text class="pa-5">
            <div class="step-title mb-5">
              <v-icon
                icon="fas fa-calendar-check"
                color="info"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >กำหนดวันตรวจประเมินพื้นที่</span
              >
            </div>

            <v-row v-if="app.currentStep === 2">
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  <div>จากวันที่</div>
                  <div class="field-label-en">Date From</div>
                </div>
                <v-text-field v-model="scheduleForm.dateFrom" type="date" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  <div>ถึงวันที่</div>
                  <div class="field-label-en">Date To</div>
                </div>
                <v-text-field v-model="scheduleForm.dateTo" type="date" />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  <div>ผู้รับผิดชอบตรวจ</div>
                  <div class="field-label-en">Inspector Name</div>
                </div>
                <v-text-field
                  v-model="scheduleForm.inspector"
                  prepend-inner-icon="fas fa-user-check"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>หมายเหตุ / คำแนะนำ</div>
                  <div class="field-label-en">Remarks/Notes</div>
                </div>
                <v-textarea v-model="scheduleForm.note" rows="3" />
              </v-col>
            </v-row>

            <div v-else-if="app.inspection" class="schedule-summary mb-4">
              <v-row>
                <v-col cols="12" sm="4"
                  ><info-field
                    label="ช่วงวันตรวจประเมิน"
                    :value="`${app.inspection.dateFrom} – ${app.inspection.dateTo}`"
                /></v-col>
                <v-col cols="12" sm="4"
                  ><info-field
                    label="ผู้รับผิดชอบตรวจ"
                    :value="app.inspection.inspector ?? '-'"
                /></v-col>
              </v-row>
            </div>

            <v-divider class="mb-4" />
            <div v-if="app.currentStep === 2" class="d-flex ga-3">
              <v-btn
                color="info"
                prepend-icon="fas fa-calendar-check"
                @click="saveSchedule"
              >
                บันทึกนัดตรวจแปลง
              </v-btn>
              <v-btn variant="tonal" color="grey" @click="goToViewStep1"
                >ย้อนกลับ</v-btn
              >
            </div>
            <v-alert
              v-else-if="app.currentStep > 2"
              type="info"
              variant="tonal"
              density="compact"
              icon="fas fa-calendar-check"
            >
              นัดตรวจแปลงแล้ว: {{ app.inspection?.dateFrom }} –
              {{ app.inspection?.dateTo }}
            </v-alert>
          </v-card-text>
        </v-window-item>

        <!-- ══ Step 3: ผลตรวจแปลง ══ -->
        <v-window-item :value="3">
          <v-card-text class="pa-5">
            <div class="step-title mb-5">
              <v-icon
                icon="fas fa-clipboard-check"
                color="secondary"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >บันทึกผลการตรวจประเมิน</span
              >
            </div>

            <v-row v-if="app.currentStep === 3">
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>ผลการตรวจพื้นที่</div>
                  <div class="field-label-en">Inspection Result</div>
                </div>
                <v-radio-group v-model="inspectionForm.result" inline>
                  <v-radio label="ผ่าน" value="pass" color="success" />
                  <v-radio label="ไม่ผ่าน" value="fail" color="error" />
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>ชื่อผู้ตรวจประเมิน</div>
                  <div class="field-label-en">Inspector Name</div>
                </div>
                <v-text-field
                  v-model="inspectionForm.inspectorName"
                  prepend-inner-icon="fas fa-user-check"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>ข้อบกพร่องที่พบ</div>
                  <div class="field-label-en">Defects Found</div>
                </div>
                <v-textarea
                  v-model="inspectionForm.defects"
                  rows="3"
                  placeholder="ระบุรายการข้อบกพร่อง แต่ละรายการขึ้นบรรทัดใหม่"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>ผลวิเคราะห์ตัวอย่างจาก Lab</div>
                  <div class="field-label-en">Lab Result</div>
                </div>
                <v-textarea
                  v-model="inspectionForm.labResult"
                  rows="3"
                  placeholder="ผลตรวจสารตกค้าง, คุณภาพดิน/น้ำ ฯลฯ"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>วันที่ตรวจ</div>
                  <div class="field-label-en">Inspection Date</div>
                </div>
                <v-text-field
                  v-model="inspectionForm.inspectedDate"
                  type="date"
                />
              </v-col>
            </v-row>

            <div v-else-if="app.inspection?.result">
              <v-alert
                :type="app.inspection.result === 'pass' ? 'success' : 'error'"
                variant="tonal"
                density="compact"
                :icon="
                  app.inspection.result === 'pass'
                    ? 'fas fa-circle-check'
                    : 'fas fa-circle-xmark'
                "
                class="mb-4"
              >
                ผลการตรวจ:
                {{ app.inspection.result === "pass" ? "ผ่าน" : "ไม่ผ่าน" }}
              </v-alert>
              <v-row>
                <v-col cols="12" sm="6">
                  <info-field
                    label="ข้อบกพร่องที่พบ"
                    :value="app.inspection.defects ?? '-'"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <info-field
                    label="ผลวิเคราะห์ Lab"
                    :value="app.inspection.labResult ?? '-'"
                  />
                </v-col>
              </v-row>
            </div>

            <v-divider class="mb-4" />
            <div v-if="app.currentStep === 3" class="d-flex ga-3">
              <v-btn
                color="secondary"
                prepend-icon="fas fa-floppy-disk"
                @click="saveInspection"
              >
                บันทึกผลตรวจแปลง
              </v-btn>
              <v-btn variant="tonal" color="grey" @click="goToViewStep2"
                >ย้อนกลับ</v-btn
              >
            </div>
          </v-card-text>
        </v-window-item>

        <!-- ══ Step 4: เสนอแปลงต่อ CC ══ -->
        <v-window-item :value="4">
          <v-card-text class="pa-5">
            <div class="step-title mb-5">
              <v-icon
                icon="fas fa-paper-plane"
                color="gap-staff"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >เสนอแปลงต่อคณะกรรมการพิจารณา (CC)</span
              >
            </div>

            <!-- Summary -->
            <v-alert
              variant="tonal"
              color="info"
              class="mb-5"
              icon="fas fa-circle-info"
            >
              <strong>สรุปผลการตรวจประเมิน:</strong>
              ผลการตรวจ{{
                app.inspection?.result === "pass" ? "ผ่าน" : "ไม่ผ่าน"
              }}
              · ผู้ตรวจ: {{ app.inspection?.inspector ?? "-" }} · วันที่ตรวจ:
              {{ app.inspection?.dateFrom ?? "-" }}
            </v-alert>

            <v-row v-if="app.currentStep === 4">
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  <div>ครั้งที่เสนอ CC</div>
                  <div class="field-label-en">CC Round</div>
                </div>
                <v-text-field
                  v-model="ccProposeForm.round"
                  type="number"
                  min="1"
                  prepend-inner-icon="fas fa-hashtag"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  <div>วันที่นัดประชุม CC</div>
                  <div class="field-label-en">CC Meeting Date</div>
                </div>
                <v-text-field v-model="ccProposeForm.meetingDate" type="date" />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>บทสรุปสำหรับคณะกรรมการ</div>
                  <div class="field-label-en">Summary</div>
                </div>
                <v-textarea v-model="ccProposeForm.summary" rows="4" />
              </v-col>
            </v-row>

            <div v-else-if="app.committee">
              <info-field
                label="ครั้งที่เสนอ CC"
                :value="String(app.committee.round ?? 1)"
              />
            </div>

            <v-divider class="mb-4" />
            <div v-if="app.currentStep === 4" class="d-flex ga-3">
              <v-btn
                color="gap-staff"
                prepend-icon="fas fa-paper-plane"
                @click="proposeCC"
              >
                เสนอแปลงต่อ CC
              </v-btn>
              <v-btn variant="tonal" color="grey" @click="goToViewStep3"
                >ย้อนกลับ</v-btn
              >
            </div>
            <v-alert
              v-else-if="app.currentStep > 4"
              type="success"
              variant="tonal"
              density="compact"
              icon="fas fa-circle-check"
            >
              เสนอ CC แล้ว (ครั้งที่ {{ app.committee?.round ?? 1 }})
            </v-alert>
          </v-card-text>
        </v-window-item>

        <!-- ══ Step 5: บันทึกผล CC ══ -->
        <v-window-item :value="5">
          <v-card-text class="pa-5">
            <div class="step-title mb-5">
              <v-icon
                icon="fas fa-gavel"
                color="error"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >บันทึกผลการพิจารณาจากคณะกรรมการ (CC)</span
              >
            </div>

            <v-row v-if="app.currentStep === 5">
              <v-col cols="12" sm="4">
                <div class="field-label mb-1">
                  <div>วันที่ประชุม CC</div>
                  <div class="field-label-en">CC Meeting Date</div>
                </div>
                <v-text-field v-model="ccResultForm.meetingDate" type="date" />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label mb-1">
                  <div>ผลการพิจารณา</div>
                  <div class="field-label-en">Decision</div>
                </div>
                <v-autocomplete
                  v-model="ccResultForm.decision"
                  :items="ccDecisionOptions"
                  item-title="label"
                  item-value="value"
                  prepend-inner-icon="fas fa-gavel"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mb-1">
                  <div>หมายเหตุ / เงื่อนไข</div>
                  <div class="field-label-en">Remarks/Conditions</div>
                </div>
                <v-textarea v-model="ccResultForm.notes" rows="3" />
              </v-col>
            </v-row>

            <div v-else-if="app.committee?.decision">
              <v-row>
                <v-col cols="12" sm="4">
                  <info-field
                    label="วันที่ประชุม"
                    :value="app.committee.meetingDate ?? '-'"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <info-field
                    label="ผลการพิจารณา"
                    :value="getCCDecisionLabel(app.committee.decision)"
                  />
                </v-col>
                <v-col v-if="app.committee.notes" cols="12" sm="4">
                  <info-field label="หมายเหตุ" :value="app.committee.notes" />
                </v-col>
              </v-row>
            </div>

            <v-divider class="mb-4" />
            <div v-if="app.currentStep === 5" class="d-flex ga-3">
              <v-btn
                color="gap-staff"
                prepend-icon="fas fa-floppy-disk"
                @click="saveCCResult"
              >
                บันทึกผลการประชุม CC
              </v-btn>
              <v-btn variant="tonal" color="grey" @click="goToViewStep4"
                >ย้อนกลับ</v-btn
              >
            </div>
          </v-card-text>
        </v-window-item>

        <!-- ══ Step 6: ลงนาม ══ -->
        <v-window-item :value="6">
          <v-card-text class="pa-5">
            <div class="step-title mb-5">
              <v-icon
                icon="fas fa-signature"
                color="success"
                size="20"
                class="mr-2"
              />
              <span class="text-body-1 font-weight-bold"
                >ลงนามและออกใบรับรอง GAP</span
              >
            </div>

            <!-- Certificate preview -->
            <v-card variant="outlined" class="cert-preview mb-5">
              <v-card-text class="pa-5">
                <div class="d-flex align-center ga-3 mb-4">
                  <v-icon icon="fas fa-certificate" color="success" size="32" />
                  <div>
                    <div class="text-body-1 font-weight-bold">
                      ใบรับรองมาตรฐาน GAP
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ app.certType }}
                    </div>
                  </div>
                </div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="field-label mb-1">
                      <div>เลขที่ใบรับรอง</div>
                      <div class="field-label-en">Cert No.</div>
                    </div>
                    <v-text-field
                      v-model="certForm.certNo"
                      prepend-inner-icon="fas fa-hashtag"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label mb-1">
                      <div>วันที่ออกใบรับรอง</div>
                      <div class="field-label-en">Issue Date</div>
                    </div>
                    <v-text-field v-model="certForm.issuedDate" type="date" />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label mb-1">
                      <div>วันหมดอายุ</div>
                      <div class="field-label-en">Expiry Date</div>
                    </div>
                    <v-text-field v-model="certForm.expiryDate" type="date" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-label mb-1">
                      <div>ผู้มีอำนาจลงนาม</div>
                      <div class="field-label-en">Authorized Signer</div>
                    </div>
                    <v-autocomplete
                      v-model="certForm.signedBy"
                      :items="signerOptions"
                      prepend-inner-icon="fas fa-pen-nib"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-label mb-1">
                      <div>ตำแหน่ง</div>
                      <div class="field-label-en">Position</div>
                    </div>
                    <v-text-field
                      v-model="certForm.position"
                      prepend-inner-icon="fas fa-user-shield"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-divider class="mb-4" />
            <div v-if="app.currentStep === 6" class="d-flex ga-3 flex-wrap">
              <v-btn
                color="success"
                prepend-icon="fas fa-certificate"
                size="large"
                @click="issueCert"
              >
                ออกใบรับรอง GAP
              </v-btn>
              <v-btn
                variant="tonal"
                color="gap-staff"
                prepend-icon="fas fa-print"
                @click="openPrintPreview"
              >
                พรีวิวใบรับรอง
              </v-btn>
              <v-btn variant="tonal" color="grey" @click="goToViewStep5"
                >ย้อนกลับ</v-btn
              >
            </div>
            <v-alert
              v-else-if="app.status === 'cert_issued'"
              type="success"
              variant="tonal"
              icon="fas fa-certificate"
            >
              ออกใบรับรองแล้ว · เลขที่: {{ app.certificate?.certNo }} · หมดอายุ:
              {{ app.certificate?.expiryDate }}
            </v-alert>
          </v-card-text>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Reject Dialog -->
    <v-dialog v-model="rejectDialog" max-width="480">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-circle-xmark" color="error" size="20" />
          ส่งกลับแก้ไข
        </v-card-title>
        <v-card-text class="px-5 pb-3">
          <div class="field-label mb-1">
            <div>ระบุเหตุผล / ข้อมูลที่ต้องแก้ไข</div>
            <div class="field-label-en">Return Reason</div>
          </div>
          <v-textarea v-model="rejectNote" rows="4" />
          <p class="text-caption text-medium-emphasis">
            * ผู้ยื่นคำขอสามารถแก้ไขได้ไม่เกิน 3 ครั้ง
          </p>
        </v-card-text>
        <v-card-actions class="px-5 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                block
                @click="closeRejectDialog"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="error" block @click="confirmReject"
                >ยืนยันส่งกลับแก้ไข</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Print Preview Dialog -->
    <v-dialog v-model="printPreview" max-width="640">
      <v-card rounded="xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center ga-2">
          <v-icon icon="fas fa-certificate" color="success" size="20" />
          พรีวิวใบรับรอง GAP
        </v-card-title>
        <v-card-text class="px-5">
          <div class="cert-paper pa-6">
            <div class="text-center mb-4">
              <v-icon icon="fas fa-seedling" color="gap-staff" size="36" />
              <div class="text-h6 font-weight-bold mt-2">
                ใบรับรองมาตรฐาน GAP
              </div>
              <div class="text-body-2 text-medium-emphasis">
                กรมวิชาการเกษตร · {{ app.certType }}
              </div>
            </div>
            <v-divider class="my-3" />
            <v-row dense>
              <v-col cols="6"
                ><info-field
                  label="เลขที่ใบรับรอง"
                  :value="certForm.certNo || '-'"
              /></v-col>
              <v-col cols="6"
                ><info-field
                  label="วันที่ออก"
                  :value="certForm.issuedDate || '-'"
              /></v-col>
              <v-col cols="6"
                ><info-field label="ชื่อเกษตรกร" :value="app.farmer.name"
              /></v-col>
              <v-col cols="6"
                ><info-field label="เลขบัตรประชาชน" :value="app.farmer.idCard"
              /></v-col>
              <v-col cols="6"
                ><info-field label="ชนิดพืช" :value="app.plots[0]?.crop ?? '-'"
              /></v-col>
              <v-col cols="6"
                ><info-field label="พื้นที่รวม" :value="`${totalArea} ไร่`"
              /></v-col>
              <v-col cols="12"
                ><info-field label="จังหวัด" :value="app.province"
              /></v-col>
              <v-col cols="6"
                ><info-field
                  label="วันหมดอายุ"
                  :value="certForm.expiryDate || '-'"
              /></v-col>
              <v-col cols="6"
                ><info-field label="ผู้ลงนาม" :value="certForm.signedBy || '-'"
              /></v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions class="pa-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            block
            @click="closePrintPreview"
            >ปิด</v-btn
          >
          <v-btn color="gap-staff" block prepend-icon="fas fa-download"
            >ดาวน์โหลด PDF</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="top right"
    >
      <v-icon :icon="snackbar.icon" class="mr-2" />
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
  router.push({ name: "staffApplicationList" });
}
const route = useRoute();

// ── InfoField helper component ──
const InfoField = defineComponent({
  props: { label: String, value: String },
  setup(props) {
    return () =>
      h("div", { class: "info-field" }, [
        h(
          "div",
          { class: "text-caption text-medium-emphasis mb-1" },
          props.label,
        ),
        h(
          "div",
          { class: "text-body-2 font-weight-medium" },
          props.value ?? "-",
        ),
      ]);
  },
});

// ── Mock application data ──
const appId = route.params.id;

const mockApps = {
  "APP-001": {
    id: "APP-001",
    requestNo: "GAP-2569-00041",
    submittedAt: "15 ม.ค. 2569",
    certType: "มกษ. 9001",
    province: "เชียงใหม่",
    status: "reviewing",
    currentStep: 1,
    farmer: {
      name: "นายสมชาย ใจดี",
      idCard: "1-1020-34567-89-0",
      phone: "081-234-5678",
      email: "somchai@email.com",
      address: "12 หมู่ 5 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่ 50180",
    },
    plots: [
      {
        crop: "มะม่วง",
        variety: "น้ำดอกไม้เบอร์ 4",
        area: 8,
        province: "เชียงใหม่",
        age: "5 ปี",
        plotId: "CM-1234-5678",
      },
      {
        crop: "มะม่วง",
        variety: "มหาชนก",
        area: 4,
        province: "เชียงใหม่",
        age: "3 ปี",
        plotId: "CM-1234-5679",
      },
    ],
    documents: [
      { name: "สำเนาบัตรประชาชน", uploaded: true },
      { name: "สำเนาทะเบียนบ้าน", uploaded: true },
      { name: "แผนที่แปลง", uploaded: true },
      { name: "หนังสือมอบอำนาจ", uploaded: false },
    ],
  },
  "APP-002": {
    id: "APP-002",
    requestNo: "GAP-2569-00039",
    submittedAt: "13 ม.ค. 2569",
    certType: "มกษ. 9001",
    province: "เพชรบูรณ์",
    status: "scheduling",
    currentStep: 2,
    farmer: {
      name: "น.ส.วิไล สุขใส",
      idCard: "1-6703-12345-67-8",
      phone: "089-876-5432",
      email: "wilai@email.com",
      address: "88 ม.3 ต.บ้านโตก อ.เมือง จ.เพชรบูรณ์ 67000",
    },
    plots: [
      {
        crop: "ข้าวโพดหวาน",
        variety: "ซูเปอร์สวีท",
        area: 8,
        province: "เพชรบูรณ์",
        age: "90 วัน",
        plotId: "PB-2341-8765",
      },
    ],
    documents: [
      { name: "สำเนาบัตรประชาชน", uploaded: true },
      { name: "สำเนาทะเบียนบ้าน", uploaded: true },
      { name: "แผนที่แปลง", uploaded: true },
    ],
  },
  "APP-003": {
    id: "APP-003",
    requestNo: "GAP-2569-00036",
    submittedAt: "10 ม.ค. 2569",
    certType: "มกษ. 9001",
    province: "นครปฐม",
    status: "pending_cc",
    currentStep: 4,
    farmer: {
      name: "นายประสิทธิ์ มั่นคง",
      idCard: "1-7302-54321-23-4",
      phone: "082-345-6789",
      email: "prasit@email.com",
      address: "5/2 ม.7 ต.ทุ่งลูกนก อ.กำแพงแสน จ.นครปฐม 73140",
    },
    plots: [
      {
        crop: "กล้วยหอม",
        variety: "กล้วยหอมทอง",
        area: 20,
        province: "นครปฐม",
        age: "10 เดือน",
        plotId: "NP-3456-2109",
      },
    ],
    documents: [
      { name: "สำเนาบัตรประชาชน", uploaded: true },
      { name: "สำเนาทะเบียนบ้าน", uploaded: true },
      { name: "แผนที่แปลง", uploaded: true },
    ],
    inspection: {
      dateFrom: "20 ม.ค. 68",
      dateTo: "21 ม.ค. 68",
      inspector: "นายวิโรจน์ ตรวจแปลง",
      result: "pass",
      defects: "พบการใช้สารเคมีเกินกว่าค่ามาตรฐานเล็กน้อย (แก้ไขแล้ว)",
      labResult: "ผลวิเคราะห์สารตกค้าง: ผ่านมาตรฐาน",
    },
  },
  "APP-004": {
    id: "APP-004",
    requestNo: "GAP-2569-00034",
    submittedAt: "8 ม.ค. 2569",
    certType: "มกษ. 3502",
    province: "เชียงราย",
    status: "cc_reviewing",
    currentStep: 5,
    farmer: {
      name: "น.ส.มาลี รุ่งเรือง",
      idCard: "1-5702-09876-54-3",
      phone: "086-543-2109",
      email: "malee@email.com",
      address: "123 ม.2 ต.เวียง อ.เมือง จ.เชียงราย 57000",
    },
    plots: [
      {
        crop: "ลำไย",
        variety: "อีดอ",
        area: 30,
        province: "เชียงราย",
        age: "8 ปี",
        plotId: "CR-5678-3456",
      },
    ],
    documents: [
      { name: "สำเนาบัตรประชาชน", uploaded: true },
      { name: "สำเนาทะเบียนบ้าน", uploaded: true },
      { name: "แผนที่แปลง", uploaded: true },
    ],
    inspection: {
      dateFrom: "18 ม.ค. 68",
      dateTo: "18 ม.ค. 68",
      inspector: "น.ส.สมหญิง ตรวจแปลง",
      result: "pass",
      labResult: "ผ่านทุกรายการ",
    },
    committee: { round: 1, meetingDate: "25 ม.ค. 68" },
  },
};

// Fallback for unknown IDs
const app = ref(mockApps[appId] ?? mockApps["APP-001"]);

const viewStep = ref(app.value.currentStep);

// Step indicator (0-indexed for reference pattern)
const currentStep = computed(() => app.value.currentStep - 1);
const steps = [
  { value: 0, title: "ข้อมูลคำขอ" },
  { value: 1, title: "นัดตรวจแปลง" },
  { value: 2, title: "ผลตรวจแปลง" },
  { value: 3, title: "เสนอ CC" },
  { value: 4, title: "ผล CC" },
  { value: 5, title: "ลงนาม" },
];
function stepClass(v) {
  if (currentStep.value > v) return "step-done";
  if (currentStep.value === v) return "step-active";
  return "step-pending";
}

// Workflow steps
const workflowSteps = [
  {
    id: 1,
    label: "ข้อมูลคำขอ",
    shortLabel: "ข้อมูลคำขอ",
    icon: "fas fa-file-alt",
  },
  {
    id: 2,
    label: "นัดตรวจแปลง",
    shortLabel: "นัดตรวจ",
    icon: "fas fa-calendar-check",
  },
  {
    id: 3,
    label: "ผลตรวจแปลง",
    shortLabel: "ผลตรวจ",
    icon: "fas fa-clipboard-check",
  },
  {
    id: 4,
    label: "เสนอแปลงต่อ CC",
    shortLabel: "เสนอ CC",
    icon: "fas fa-paper-plane",
  },
  { id: 5, label: "บันทึกผล CC", shortLabel: "ผล CC", icon: "fas fa-gavel" },
  { id: 6, label: "ลงนาม", shortLabel: "ลงนาม", icon: "fas fa-signature" },
];

// Status display
const statusMap = {
  reviewing: {
    color: "warning",
    icon: "fas fa-magnifying-glass",
    label: "รอตรวจคำขอ",
  },
  scheduling: {
    color: "info",
    icon: "fas fa-calendar-clock",
    label: "รอนัดตรวจแปลง",
  },
  inspecting: {
    color: "secondary",
    icon: "fas fa-person-walking",
    label: "อยู่ระหว่างตรวจแปลง",
  },
  inspected: {
    color: "secondary",
    icon: "fas fa-clipboard-check",
    label: "ตรวจแปลงแล้ว",
  },
  pending_cc: {
    color: "gap-staff",
    icon: "fas fa-paper-plane",
    label: "รอเสนอ CC",
  },
  cc_reviewing: {
    color: "error",
    icon: "fas fa-gavel",
    label: "อยู่ระหว่าง CC",
  },
  approved: {
    color: "success",
    icon: "fas fa-circle-check",
    label: "อนุมัติแล้ว",
  },
  cert_issued: {
    color: "success",
    icon: "fas fa-certificate",
    label: "ออกใบรับรองแล้ว",
  },
  rejected: {
    color: "error",
    icon: "fas fa-circle-xmark",
    label: "ไม่อนุมัติ",
  },
};
const statusColor = computed(
  () => statusMap[app.value.status]?.color ?? "grey",
);
const statusIcon = computed(
  () => statusMap[app.value.status]?.icon ?? "fas fa-circle",
);
const statusLabel = computed(
  () => statusMap[app.value.status]?.label ?? app.value.status,
);

// Dialogs
const rejectDialog = ref(false);
const printPreview = ref(false);
const rejectNote = ref("");

function openRejectDialog() {
  rejectDialog.value = true;
}

function closeRejectDialog() {
  rejectDialog.value = false;
}

function openPrintPreview() {
  printPreview.value = true;
}

function closePrintPreview() {
  printPreview.value = false;
}

function goToViewStep1() {
  viewStep.value = 1;
}

function goToViewStep2() {
  viewStep.value = 2;
}

function goToViewStep3() {
  viewStep.value = 3;
}

function goToViewStep4() {
  viewStep.value = 4;
}

function goToViewStep5() {
  viewStep.value = 5;
}

// Snackbar
const snackbar = ref({
  show: false,
  message: "",
  color: "success",
  icon: "fas fa-check",
});
function showSnack(message, color = "success", icon = "fas fa-circle-check") {
  snackbar.value = { show: true, message, color, icon };
}

// Step 2 form
const scheduleForm = ref({ dateFrom: "", dateTo: "", inspector: "", note: "" });

// Step 3 form
const inspectionForm = ref({
  result: "pass",
  inspectorName: "",
  defects: "",
  labResult: "",
  inspectedDate: "",
});

// Step 4 form
const ccProposeForm = ref({ round: 1, meetingDate: "", summary: "" });

// Step 5 form
const ccResultForm = ref({ meetingDate: "", decision: "", notes: "" });
const ccDecisionOptions = [
  { label: "ให้การรับรอง", value: "approve" },
  { label: "นัดตรวจเพิ่มเติม", value: "reinspect" },
  { label: "ตรวจสอบเอกสารใหม่", value: "re-document" },
  { label: "ไม่ให้การรับรอง", value: "reject" },
  { label: "ยกเลิกคำขอ", value: "cancel" },
  { label: "เสนอแก้ไขข้อมูล", value: "revise" },
];
function getCCDecisionLabel(val) {
  return ccDecisionOptions.find((o) => o.value === val)?.label ?? val;
}

// Step 6 form
const certForm = ref({
  certNo: `GAP-CERT-2569-${Math.floor(Math.random() * 9000 + 1000)}`,
  issuedDate: "",
  expiryDate: "",
  signedBy: "",
  position: "",
});
const signerOptions = [
  "นายอรรถพล วงศ์ประเสริฐ (ผู้อำนวยการกอง)",
  "น.ส.สุนันทา ไชยวงค์ (รองผู้อำนวยการ)",
  "นายพิทักษ์ อนุรักษ์ (ผู้เชี่ยวชาญ)",
];

const totalArea = computed(() =>
  app.value.plots.reduce((s, p) => s + p.area, 0),
);

// Actions
function approveStep1() {
  app.value.status = "scheduling";
  app.value.currentStep = 2;
  viewStep.value = 2;
  showSnack("ผ่านการตรวจสอบเอกสาร — รอนัดตรวจแปลง");
}

function confirmReject() {
  rejectDialog.value = false;
  app.value.status = "reviewing";
  showSnack("ส่งกลับแก้ไขแล้ว", "warning", "fas fa-arrow-rotate-left");
}

function saveSchedule() {
  if (!scheduleForm.value.dateFrom || !scheduleForm.value.dateTo) {
    showSnack("กรุณาระบุวันที่ตรวจ", "error", "fas fa-triangle-exclamation");
    return;
  }
  if (!app.value.inspection)
    app.value.inspection = { dateFrom: "", dateTo: "" };
  app.value.inspection.dateFrom = scheduleForm.value.dateFrom;
  app.value.inspection.dateTo = scheduleForm.value.dateTo;
  app.value.inspection.inspector = scheduleForm.value.inspector;
  app.value.status = "inspecting";
  app.value.currentStep = 3;
  viewStep.value = 3;
  showSnack("บันทึกนัดตรวจแปลงแล้ว");
}

function saveInspection() {
  if (!app.value.inspection)
    app.value.inspection = { dateFrom: "", dateTo: "" };
  app.value.inspection.result = inspectionForm.value.result;
  app.value.inspection.defects = inspectionForm.value.defects;
  app.value.inspection.labResult = inspectionForm.value.labResult;
  app.value.status = "inspected";
  app.value.currentStep = 4;
  viewStep.value = 4;
  showSnack("บันทึกผลตรวจแปลงแล้ว");
}

function proposeCC() {
  if (!app.value.committee) app.value.committee = {};
  app.value.committee.round = ccProposeForm.value.round;
  app.value.committee.meetingDate = ccProposeForm.value.meetingDate;
  app.value.status = "cc_reviewing";
  app.value.currentStep = 5;
  viewStep.value = 5;
  showSnack("เสนอแปลงต่อ CC แล้ว");
}

function saveCCResult() {
  if (!ccResultForm.value.decision) {
    showSnack("กรุณาเลือกผลการพิจารณา", "error", "fas fa-triangle-exclamation");
    return;
  }
  if (!app.value.committee) app.value.committee = {};
  app.value.committee.decision = ccResultForm.value.decision;
  app.value.committee.meetingDate = ccResultForm.value.meetingDate;
  app.value.committee.notes = ccResultForm.value.notes;
  if (ccResultForm.value.decision === "approve") {
    app.value.status = "approved";
    app.value.currentStep = 6;
    viewStep.value = 6;
    showSnack("บันทึกผล CC แล้ว — อนุมัติ รอลงนาม", "success");
  } else if (
    ccResultForm.value.decision === "reject" ||
    ccResultForm.value.decision === "cancel"
  ) {
    app.value.status = "rejected";
    showSnack("บันทึกผล CC แล้ว — ไม่อนุมัติ", "error", "fas fa-circle-xmark");
  } else {
    showSnack(
      "บันทึกผล CC แล้ว — รอดำเนินการต่อ",
      "warning",
      "fas fa-arrow-rotate-right",
    );
  }
}

function issueCert() {
  if (
    !certForm.value.certNo ||
    !certForm.value.issuedDate ||
    !certForm.value.signedBy
  ) {
    showSnack(
      "กรุณากรอกข้อมูลใบรับรองให้ครบ",
      "error",
      "fas fa-triangle-exclamation",
    );
    return;
  }
  app.value.certificate = {
    certNo: certForm.value.certNo,
    issuedDate: certForm.value.issuedDate,
    expiryDate: certForm.value.expiryDate,
    signedBy: certForm.value.signedBy,
  };
  app.value.status = "cert_issued";
  showSnack("ออกใบรับรอง GAP เรียบร้อยแล้ว 🎉", "success");
}
</script>

<style scoped>
.step-done,
.step-active {
  background: rgb(var(--v-theme-gap-staff)) !important;
  color: white !important;
}
.step-active {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-gap-staff), 0.2) !important;
}
.step-line--done {
  background: rgb(var(--v-theme-gap-staff)) !important;
}

/* ─── Step content ─── */
.step-title {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-bottom: 20px;
}
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.info-field {
  padding: 8px 0;
}
.cert-preview {
  border: 2px dashed rgba(var(--v-theme-success), 0.4);
  background: rgba(var(--v-theme-success), 0.03);
}
.cert-paper {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
}
</style>
