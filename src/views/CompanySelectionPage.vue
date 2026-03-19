<template>
  <div class="select-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- Top bar -->
    <div class="select-topbar">
      <div class="select-topbar-inner">
        <div class="d-flex align-center ga-3">
          <div class="topbar-logo">
            <v-icon icon="fas fa-leaf" size="18" color="white" />
          </div>
          <div>
            <div
              class="text-body-2 font-weight-bold text-white lh-tight"
              
            >
              กรมวิชาการเกษตร
            </div>
            <div
              class="text-caption"
              style="color: rgba(255, 255, 255, 0.6); line-height: 1.2"
            >
              Department of Agriculture
            </div>
          </div>
        </div>
        <v-spacer />
        <div class="d-flex align-center ga-2">
          <v-btn
            icon
            variant="text"
            size="small"
            style="color: rgba(255, 255, 255, 0.8)"
            @click="themeStore.toggle()"
          >
            <v-icon
              :icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
              size="16"
            />
          </v-btn>
          <div class="user-pill d-flex align-center ga-2">
            <div class="user-avatar-sm">
              <span class="text-caption font-weight-bold">นส</span>
            </div>
            <div class="d-none d-sm-block">
              <div
                class="text-caption font-weight-semibold text-white lh-tight"
                
              >
                นิธิพร เทิบจันทึก
              </div>
              <div
                class="text-caption"
                style="
                  color: rgba(255, 255, 255, 0.55);
                  line-height: 1.2;
                  font-size: 10px;
                "
              >
                ผู้ประกอบการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="select-body">
      <div class="select-body-inner">
        <!-- Heading -->
        <div class="text-center mb-7">
          <div class="heading-icon-ring mx-auto mb-4">
            <v-icon icon="fas fa-layer-group" size="28" color="primary" />
          </div>
          <h1 class="page-title mb-2">
            เลือกบัญชีที่ต้องการดำเนินการ
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            กรุณาเลือกประเภทบัญชีที่ต้องการใช้งาน
          </p>
        </div>

        <!-- ── ส่วนที่ 1: บุคคล ── -->
        <div class="section-header mb-3">
          <div class="section-label">
            <div class="section-dot section-dot--personal"></div>
            <span class="text-body-2 font-weight-bold">ในฐานะบุคคล</span>
          </div>
          <v-btn
            color="success"
            size="default"
            rounded="lg"
            prepend-icon="fas fa-user-plus"
            @click="enterPersonal"
          >
            ขอใช้บริการในฐานะบุคคล
          </v-btn>
        </div>

        <v-card rounded="xl" elevation="0" class="list-card mb-7">
          <div class="entity-row entity-row--last">
            <!-- Icon -->
            <div
              class="entity-icon-box entity-icon-box--personal flex-shrink-0"
            >
              <v-icon icon="fas fa-user" size="18" color="success" />
            </div>

            <!-- Name + meta -->
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex align-center ga-2 flex-wrap">
                <span class="text-body-2 font-weight-bold"
                  >นิธิพร เทิบจันทึก</span
                >
                <v-chip size="x-small" color="success" variant="tonal"
                  >บุคคลธรรมดา</v-chip
                >
              </div>
              <div class="text-caption text-medium-emphasis">
                เลขบัตรประชาชน: 3 1001 00123 45 6
              </div>
            </div>

            <!-- Right -->
            <div
              class="d-none d-md-flex flex-column align-end ga-1 flex-shrink-0"
              style="min-width: 160px"
            >
              <div class="d-flex flex-wrap ga-1 mt-1">
                <v-chip
                  v-for="sys in personalSystems"
                  :key="sys"
                  size="x-small"
                  variant="tonal"
                  color="success"
                  >{{ sys }}</v-chip
                >
              </div>
            </div>

            <!-- Action -->
            <v-btn
              color="success"
              rounded="lg"
              size="small"
              append-icon="fas fa-arrow-right"
              class="flex-shrink-0"
              @click="router.push({ path: '/portal', query: { mode: 'user', entityType: 'personal' } })"
            >
              เข้าใช้งาน
            </v-btn>
          </div>
        </v-card>

        <!-- ── ส่วนที่ 2: บริษัท ── -->
        <div class="section-header mb-3">
          <div class="section-label">
            <div class="section-dot section-dot--company"></div>
            <span class="text-body-2 font-weight-bold"
              >ในฐานะบริษัท / นิติบุคคล</span
            >
            <v-chip size="x-small" color="info" variant="tonal" class="ml-1"
              >{{ companies.length }} บริษัท</v-chip
            >
          </div>
          <v-btn
            color="info"
            size="default"
            rounded="lg"
            prepend-icon="fas fa-building-circle-arrow-right"
            @click="enterPortal"
          >
            ขอใช้ในนามนิติบุคคล
          </v-btn>
        </div>

        <v-card rounded="xl" elevation="0" class="list-card list-card--company">
          <div
            v-for="(company, index) in companies"
            :key="company.id"
            class="entity-row entity-row--company"
            :class="{ 'entity-row--last': index === companies.length - 1 }"
          >
            <!-- Icon -->
            <div class="entity-icon-box entity-icon-box--company flex-shrink-0">
              <v-icon icon="fas fa-building" size="18" color="info" />
            </div>

            <!-- Name + meta -->
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex align-center ga-2 flex-wrap">
                <span class="text-body-2 font-weight-bold">{{
                  company.nameTh
                }}</span>
                <v-chip
                  v-if="company.isOwner"
                  size="x-small"
                  color="info"
                  variant="tonal"
                  prepend-icon="fas fa-crown"
                >
                  เจ้าของ
                </v-chip>
                <!-- <v-chip
                  v-else-if="company.expireSoon"
                  size="x-small"
                  color="warning"
                  variant="tonal"
                  prepend-icon="fas fa-triangle-exclamation"
                >
                  มอบอำนาจใกล้หมดอายุ
                </v-chip> -->
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ company.nameEn }}
              </div>
              <div class="d-flex align-center ga-2 mt-1 flex-wrap">
                <span class="detail-pill"
                  >เลขผู้เสียภาษี: {{ company.taxId }}</span
                >
                <!-- <span v-if="!company.isOwner" class="detail-pill"
                  >มอบอำนาจถึง
                  <span
                    :class="
                      company.expireSoon
                        ? 'text-warning font-weight-medium'
                        : 'font-weight-medium'
                    "
                  >
                    {{ company.poaExpiry }}
                  </span>
                </span> -->
              </div>
              <!-- Systems chips (mobile) -->
              <div class="d-flex d-md-none flex-wrap ga-1 mt-1">
                <v-chip
                  v-for="sys in company.systems"
                  :key="sys"
                  size="x-small"
                  variant="tonal"
                  color="info"
                  >{{ sys }}</v-chip
                >
              </div>
            </div>

            <!-- Systems (desktop) -->
            <div
              class="row-right flex-shrink-0 d-none d-md-flex flex-column align-end ga-1"
            >
              <div class="d-flex flex-wrap ga-1 justify-end">
                <v-chip
                  v-for="sys in company.systems"
                  :key="sys"
                  size="x-small"
                  variant="tonal"
                  color="info"
                  >{{ sys }}</v-chip
                >
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex flex-column ga-2 flex-shrink-0 align-end">
              <v-btn
                color="info"
                rounded="lg"
                size="small"
                append-icon="fas fa-arrow-right"
                style="min-width: 110px"
                @click="router.push({ path: '/portal', query: { mode: 'user', entityType: 'juristic', companyName: company.nameTh } })"
              >
                เข้าใช้งาน
              </v-btn>
              <v-btn
                v-if="company.isOwner"
                variant="tonal"
                color="info"
                rounded="lg"
                size="small"
                prepend-icon="fas fa-user-group"
                style="min-width: 110px"
                @click="
                  router.push({
                    path: '/poa-management',
                    query: { companyId: company.id },
                  })
                "
              >
                จัดการมอบอำนาจ
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Bottom action -->
        <div class="d-flex justify-start align-center mt-6">
          <v-btn
            variant="text"
            color="grey"
            rounded="lg"
            prepend-icon="fas fa-right-from-bracket"
            @click="router.push('/login')"
          >
            ออกจากระบบ
          </v-btn>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Dialog: ขอใช้งานในนามบุคคล ── -->
  <v-dialog v-model="personalDialog" max-width="520" persistent>
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-4 d-flex align-center ga-3">
        <div class="dialog-icon dialog-icon--personal">
          <v-icon icon="fas fa-user-plus" size="18" color="success" />
        </div>
        <div class="flex-grow-1">
          <div class="text-body-1 font-weight-bold">ขอใช้บริการในฐานะบุคคล</div>
          <div class="text-caption text-medium-emphasis">
            {{ personalStep === 1 ? 'ระบุรายละเอียดและเลือกระบบที่ต้องการ' : 'แนบเอกสารประกอบคำขอ' }}
          </div>
        </div>
      </v-card-title>

      <!-- Step indicator -->
      <div class="dialog-step-bar px-6 pb-4">
        <div class="dialog-step-item" :class="personalStep >= 1 ? 'dialog-step-item--active' : ''">
          <div class="dialog-step-node" :class="personalStep > 1 ? 'dialog-step-node--done' : 'dialog-step-node--active'">
            <v-icon v-if="personalStep > 1" icon="fas fa-check" size="11" />
            <span v-else>1</span>
          </div>
          <span class="dialog-step-label">ข้อมูลและระบบ</span>
        </div>
        <div class="dialog-step-line" :class="personalStep >= 2 ? 'dialog-step-line--active' : ''" />
        <div class="dialog-step-item" :class="personalStep >= 2 ? 'dialog-step-item--active' : ''">
          <div class="dialog-step-node" :class="personalStep === 2 ? 'dialog-step-node--active' : ''">
            <span>2</span>
          </div>
          <span class="dialog-step-label">เอกสารแนบ</span>
        </div>
      </div>

      <v-divider />
      <v-card-text class="pa-6">
        <!-- ── Step 1 ── -->
        <div v-if="personalStep === 1">
        <!-- ข้อมูลส่วนตัว (auto-fill) -->
        <v-alert
          color="success"
          variant="tonal"
          density="compact"
          rounded="lg"
          prepend-icon="fas fa-circle-check"
          class="mb-5"
        >
          <span class="text-body-2">ข้อมูลดึงจาก ThaiD อัตโนมัติ</span>
        </v-alert>

        <v-row dense>
          <v-col cols="12" sm="7">
            <div class="field-label">ชื่อ-นามสกุล <span class="field-label-en">Full Name</span></div>
            <v-text-field
              model-value="นิธิพร เทิบจันทึก"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              readonly
              class="autofill-field"
            />
          </v-col>
          <v-col cols="12" sm="5">
            <div class="field-label">เลขบัตรประชาชน <span class="field-label-en">National ID No.</span></div>
            <v-text-field
              model-value="3 1001 00123 45 6"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              readonly
              class="autofill-field"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="field-label mt-3">อีเมล <span class="field-label-en">Email</span> <span class="req">*</span></div>
            <v-text-field
              v-model="personalForm.email"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              placeholder="example@email.com"
              prepend-inner-icon="fas fa-envelope"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="field-label mt-3">
              เบอร์โทรศัพท์ <span class="field-label-en">Phone Number</span> <span class="req">*</span>
            </div>
            <v-text-field
              v-model="personalForm.phone"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              placeholder="0XX-XXX-XXXX"
              prepend-inner-icon="fas fa-phone"
            />
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <!-- เลือกระบบ -->
        <div class="field-label mb-2">
          ระบบที่ต้องการขอใช้งาน <span class="field-label-en">Requested Systems</span> <span class="req">*</span>
        </div>
        <div class="sys-checkbox-list">
          <v-checkbox
            v-for="sys in availableSystems"
            :key="sys.value"
            v-model="personalForm.systems"
            :value="sys.value"
            color="success"
            density="compact"
            hide-details
            class="sys-checkbox-item"
          >
            <template #label>
              <div class="d-flex align-center ga-2">
                <span class="text-body-2">{{ sys.label }}</span>
              </div>
            </template>
          </v-checkbox>
        </div>
        <div v-if="personalSystemError" class="text-caption text-error mt-1">
          <v-icon icon="fas fa-circle-xmark" size="11" class="mr-1" />กรุณาเลือกอย่างน้อย 1 ระบบ
        </div>
        </div><!-- end step 1 -->

        <!-- ── Step 2: เอกสารแนบ ── -->
        <div v-if="personalStep === 2">
          <v-alert
            color="info"
            variant="tonal"
            density="compact"
            rounded="lg"
            prepend-icon="fas fa-circle-info"
            class="mb-5"
          >
            <span class="text-body-2">แนบเอกสารประกอบการขอใช้บริการ (ไฟล์ PDF หรือรูปภาพ ขนาดไม่เกิน 5 MB)</span>
          </v-alert>

          <div v-for="doc in personalRequiredDocs" :key="doc.id" class="doc-item mb-4">
            <div class="d-flex align-center ga-2 mb-1">
              <span class="field-label mb-0">{{ doc.label }}</span>
              <v-chip v-if="doc.required" size="x-small" color="error" variant="tonal">จำเป็น</v-chip>
              <v-chip v-else size="x-small" color="grey" variant="tonal">ไม่บังคับ</v-chip>
            </div>
            <div v-if="doc.note" class="text-caption text-medium-emphasis mb-2">{{ doc.note }}</div>
            <v-file-input
              v-model="personalDocs[doc.id]"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              accept=".pdf,.jpg,.jpeg,.png"
              prepend-icon=""
              prepend-inner-icon="fas fa-paperclip"
              :placeholder="doc.required ? 'เลือกไฟล์ (จำเป็น)' : 'เลือกไฟล์ (ถ้ามี)'"
            />
          </div>

          <div v-if="personalDocError" class="text-caption text-error mt-1">
            <v-icon icon="fas fa-circle-xmark" size="11" class="mr-1" />กรุณาแนบเอกสารที่จำเป็นให้ครบ
          </div>
        </div><!-- end step 2 -->
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-5 ga-2">
        <v-btn
          v-if="personalStep === 2"
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="personalStep = 1"
        >ย้อนกลับ</v-btn>
        <v-spacer />
        <v-btn variant="tonal" color="grey" rounded="lg" @click="personalDialog = false">ยกเลิก</v-btn>
        <v-btn
          v-if="personalStep === 1"
          color="success"
          rounded="lg"
          append-icon="fas fa-arrow-right"
          @click="nextPersonalStep"
        >ถัดไป</v-btn>
        <v-btn
          v-else
          color="success"
          rounded="lg"
          prepend-icon="fas fa-paper-plane"
          :disabled="!personalDocsComplete"
          @click="submitPersonal"
        >ส่งคำขอ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ── Dialog: ขอใช้งานในนามนิติบุคคล ── -->
  <v-dialog v-model="juristicDialog" max-width="560" persistent>
    <v-card rounded="xl">
      <v-card-title class="pa-6 pb-4 d-flex align-center ga-3">
        <div class="dialog-icon dialog-icon--company">
          <v-icon
            icon="fas fa-building-circle-arrow-right"
            size="18"
            color="info"
          />
        </div>
        <div class="flex-grow-1">
          <div class="text-body-1 font-weight-bold">ขอใช้งานในนามนิติบุคคล</div>
          <div class="text-caption text-medium-emphasis">
            {{ juristicStep === 1 ? 'ตรวจสอบข้อมูลจากกรมพัฒนาธุรกิจการค้า (DBD)' : 'แนบเอกสารประกอบคำขอ' }}
          </div>
        </div>
      </v-card-title>

      <!-- Step indicator -->
      <div class="dialog-step-bar px-6 pb-4">
        <div class="dialog-step-item" :class="juristicStep >= 1 ? 'dialog-step-item--active' : ''">
          <div class="dialog-step-node" :class="juristicStep > 1 ? 'dialog-step-node--done' : 'dialog-step-node--active'">
            <v-icon v-if="juristicStep > 1" icon="fas fa-check" size="11" />
            <span v-else>1</span>
          </div>
          <span class="dialog-step-label">ข้อมูลและระบบ</span>
        </div>
        <div class="dialog-step-line" :class="juristicStep >= 2 ? 'dialog-step-line--active' : ''" />
        <div class="dialog-step-item" :class="juristicStep >= 2 ? 'dialog-step-item--active' : ''">
          <div class="dialog-step-node" :class="juristicStep === 2 ? 'dialog-step-node--active' : ''">
            <span>2</span>
          </div>
          <span class="dialog-step-label">เอกสารแนบ</span>
        </div>
      </div>

      <v-divider />
      <v-card-text class="pa-6">
        <!-- ── Step 1 ── -->
        <div v-if="juristicStep === 1">
        <!-- ค้นหา DBD -->
        <div class="field-label mb-2">
          เลขทะเบียนนิติบุคคล <span class="field-label-en">Registration No.</span> <span class="req">*</span>
        </div>
        <div class="d-flex ga-2 mb-4">
          <v-text-field
            v-model="juristicForm.regNo"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details
            placeholder="เช่น 0105565012345"
            prepend-inner-icon="fas fa-hashtag"
            style="flex: 1"
            @keyup.enter="searchDBD"
          />
          <v-btn
            color="info"
            rounded="lg"
            size="default"
            prepend-icon="fas fa-magnifying-glass"
            :loading="dbdLoading"
            @click="searchDBD"
          >
            ค้นหา DBD
          </v-btn>
        </div>

        <!-- DBD Result -->
        <v-expand-transition>
          <div v-if="dbdResult">
            <v-alert
              color="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-circle-check"
              class="mb-4"
            >
              <span class="text-body-2"
                >พบข้อมูลจาก DBD — ข้อมูลที่มีสีเทาถูกเติมอัตโนมัติ</span
              >
            </v-alert>

            <v-row dense>
              <v-col cols="12">
                <div class="field-label">ชื่อนิติบุคคล (ไทย) <span class="field-label-en">Company Name (Thai)</span></div>
                <v-text-field
                  :model-value="juristicForm.nameTh"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  readonly
                  class="autofill-field mb-1"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">ชื่อนิติบุคคล (อังกฤษ) <span class="field-label-en">Company Name (English)</span></div>
                <v-text-field
                  :model-value="juristicForm.nameEn"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  readonly
                  class="autofill-field mb-1"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">ประเภทนิติบุคคล <span class="field-label-en">Juristic Type</span></div>
                <v-text-field
                  :model-value="juristicForm.type"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  readonly
                  class="autofill-field"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">สถานะบริษัท <span class="field-label-en">Company Status</span></div>
                <v-text-field
                  :model-value="juristicForm.status"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  readonly
                  class="autofill-field"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">ผู้มีอำนาจลงนาม <span class="field-label-en">Authorized Signatory</span></div>
                <v-text-field
                  :model-value="juristicForm.authorized"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  readonly
                  class="autofill-field"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- ข้อมูลติดต่อ -->
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  อีเมลติดต่อ <span class="field-label-en">Contact Email</span> <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="juristicForm.email"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="example@company.com"
                  prepend-inner-icon="fas fa-envelope"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  เบอร์โทรศัพท์ <span class="field-label-en">Phone Number</span> <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="juristicForm.phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="0X-XXXX-XXXX"
                  prepend-inner-icon="fas fa-phone"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- เลือกระบบ -->
            <div class="field-label mb-2">
              ระบบที่ต้องการขอใช้งาน <span class="field-label-en">Requested Systems</span> <span class="req">*</span>
            </div>
            <div class="sys-checkbox-list">
              <v-checkbox
                v-for="sys in availableSystems"
                :key="sys.value"
                v-model="juristicForm.systems"
                :value="sys.value"
                color="info"
                density="compact"
                hide-details
                class="sys-checkbox-item"
              >
                <template #label>
                  <div class="d-flex align-center ga-2">
                    <span class="text-body-2">{{ sys.label }}</span>
                  </div>
                </template>
              </v-checkbox>
            </div>
            <div
              v-if="juristicSystemError"
              class="text-caption text-error mt-1"
            >
              <v-icon
                icon="fas fa-circle-xmark"
                size="11"
                class="mr-1"
              />กรุณาเลือกอย่างน้อย 1 ระบบ
            </div>
          </div>
        </v-expand-transition>

        <!-- DBD not found -->
        <v-alert
          v-if="dbdNotFound"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          prepend-icon="fas fa-circle-xmark"
        >
          ไม่พบข้อมูลนิติบุคคลในระบบ DBD กรุณาตรวจสอบเลขทะเบียนอีกครั้ง
        </v-alert>
        </div><!-- end step 1 -->

        <!-- ── Step 2: เอกสารแนบ ── -->
        <div v-if="juristicStep === 2">
          <v-alert
            color="warning"
            variant="tonal"
            density="compact"
            rounded="lg"
            prepend-icon="fas fa-triangle-exclamation"
            class="mb-5"
          >
            <span class="text-body-2">เอกสารข้อ 1 (หนังสือรับรองนิติบุคคล) ต้องอัปโหลดผ่านระบบ SSO เท่านั้น</span>
          </v-alert>

          <div v-for="doc in juristicRequiredDocs" :key="doc.id" class="doc-item mb-4">
            <div class="d-flex align-center ga-2 mb-1">
              <span class="field-label mb-0">{{ doc.label }}</span>
              <v-chip v-if="doc.required" size="x-small" color="error" variant="tonal">จำเป็น</v-chip>
              <v-chip v-else size="x-small" color="grey" variant="tonal">ไม่บังคับ</v-chip>
              <v-chip v-if="doc.fromSSO" size="x-small" color="warning" variant="tonal" prepend-icon="fas fa-shield-halved">SSO</v-chip>
            </div>
            <div v-if="doc.note" class="text-caption text-medium-emphasis mb-2">{{ doc.note }}</div>
            <v-alert
              v-if="doc.fromSSO"
              color="warning"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="mb-0"
            >
              <span class="text-caption">ไฟล์นี้ถูกดึงอัตโนมัติจากระบบ SSO — ไม่ต้องอัปโหลดด้วยตนเอง</span>
            </v-alert>
            <v-file-input
              v-else
              v-model="juristicDocs[doc.id]"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              accept=".pdf,.jpg,.jpeg,.png"
              prepend-icon=""
              prepend-inner-icon="fas fa-paperclip"
              :placeholder="doc.required ? 'เลือกไฟล์ (จำเป็น)' : 'เลือกไฟล์ (ถ้ามี)'"
            />
          </div>

          <div v-if="juristicDocError" class="text-caption text-error mt-1">
            <v-icon icon="fas fa-circle-xmark" size="11" class="mr-1" />กรุณาแนบเอกสารที่จำเป็นให้ครบ
          </div>
        </div><!-- end step 2 -->
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-5 ga-2">
        <v-btn
          v-if="juristicStep === 2"
          variant="tonal"
          color="grey"
          rounded="lg"
          prepend-icon="fas fa-arrow-left"
          @click="juristicStep = 1"
        >ย้อนกลับ</v-btn>
        <v-spacer />
        <v-btn variant="tonal" color="grey" rounded="lg" @click="closeJuristicDialog">ยกเลิก</v-btn>
        <v-btn
          v-if="juristicStep === 1 && dbdResult"
          color="info"
          rounded="lg"
          append-icon="fas fa-arrow-right"
          @click="nextJuristicStep"
        >ถัดไป</v-btn>
        <v-btn
          v-else-if="juristicStep === 2"
          color="info"
          rounded="lg"
          prepend-icon="fas fa-paper-plane"
          :disabled="!juristicDocsComplete"
          @click="submitJuristic"
        >ส่งคำขอ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- ── Success Dialog ── -->
  <v-dialog v-model="successDialog" max-width="400">
    <v-card rounded="xl">
      <v-card-text class="pa-8 text-center">
        <div class="success-ring mx-auto mb-4">
          <v-icon icon="fas fa-paper-plane" size="32" color="primary" />
        </div>
        <h3 class="text-h6 font-weight-bold mb-2">ส่งคำขอสำเร็จ</h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          ระบบได้รับคำขอของคุณแล้ว
          เจ้าหน้าที่จะดำเนินการตรวจสอบและแจ้งผลทางอีเมล
        </p>
      </v-card-text>
      <v-card-actions class="px-6 pb-6">
        <v-btn color="primary" block rounded="lg" @click="successDialog = false"
          >รับทราบ</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const themeStore = useThemeStore();
const router = useRouter();

interface Company {
  id: string;
  nameTh: string;
  nameEn: string;
  taxId: string;
  businessType: string;
  poaExpiry: string;
  expireSoon: boolean;
  isOwner: boolean;
  systems: string[];
}

const personalSystems = ["GAP", "DOA"];

const companies: Company[] = [
  {
    id: "co1",
    nameTh: "บริษัท ไทยเกษตรอินเตอร์ จำกัด",
    nameEn: "Thai Kaset International Co., Ltd.",
    taxId: "0105565012345",
    businessType: "ส่งออกสินค้าพืช",
    poaExpiry: "31/12/2568",
    expireSoon: false,
    isOwner: true,
    systems: ["GAP", "DOA", "CB", "ส่งออก"],
  },
  {
    id: "co2",
    nameTh: "ห้างหุ้นส่วนจำกัด สยามฟาร์มโปรดักส์",
    nameEn: "Siam Farm Products Ltd. Part.",
    taxId: "0303560098765",
    businessType: "โรงงานแปรรูปสินค้าพืช",
    poaExpiry: "01/04/2568",
    expireSoon: true,
    isOwner: false,
    systems: ["DOA", "GAP"],
  },
  {
    id: "co3",
    nameTh: "บริษัท กรีนเซอร์ติฟาย (ประเทศไทย) จำกัด",
    nameEn: "Green Certify (Thailand) Co., Ltd.",
    taxId: "0105568054321",
    businessType: "หน่วยรับรอง (Certification Body)",
    poaExpiry: "30/06/2569",
    expireSoon: false,
    isOwner: true,
    systems: ["CB"],
  },
];

const availableSystems = [
  { label: "ระบบรับรองมาตรฐาน GAP พืช", value: "GAP", icon: "fas fa-seedling" },
  { label: "ระบบโรงงานผลิตพืช (DOA)", value: "DOA", icon: "fas fa-industry" },
  { label: "ระบบหน่วยรับรอง (CB)", value: "CB", icon: "fas fa-certificate" },
  { label: "ระบบเกษตรอินทรีย์ (ORG)", value: "ORG", icon: "fas fa-leaf" },
  { label: "ระบบจดทะเบียนผู้ส่งออก", value: "ส่งออก", icon: "fas fa-ship" },
  { label: "ระบบสุขอนามัยพืช (HC)", value: "HC", icon: "fas fa-shield-halved" },
  {
    label: "ระบบใบรับรองสินค้าแปรรูป (HC)",
    value: "HCEX",
    icon: "fas fa-box-open",
  },
  {
    label: "ระบบ Establishment List (EL)",
    value: "EL",
    icon: "fas fa-list-check",
  },
];

// ── Document definitions ──
interface DocDef {
  id: string;
  label: string;
  note?: string;
  required: boolean;
  fromSSO?: boolean;
}

const personalDocDefs: DocDef[] = [
  { id: "id_card", label: "บัตรประจำตัวประชาชน", note: "ของผู้ยื่นคำขอ", required: true },
];

const juristicDocDefs: DocDef[] = [
  { id: "cert", label: "หนังสือรับรองนิติบุคคล", note: "ออกโดยกรมพัฒนาธุรกิจการค้า ไม่เกิน 6 เดือน มีวัตถุประสงค์เกี่ยวกับการส่งออกผักและผลไม้", required: true, fromSSO: true },
  { id: "id_card", label: "บัตรประจำตัวประชาชนกรรมการ", note: "ของกรรมการผู้มีอำนาจลงนามแทนนิติบุคคล", required: true },
  { id: "passport", label: "หนังสือเดินทาง", note: "กรณีผู้มีอำนาจลงนามเป็นชาวต่างชาติ", required: false },
  { id: "poa", label: "หนังสือมอบอำนาจ", note: "พร้อมสำเนาบัตรประชาชนของผู้มอบอำนาจ กรณีมอบอำนาจให้ผู้อื่นดำเนินการแทน", required: false },
];

// ── Personal dialog ──
const personalDialog = ref(false);
const personalStep = ref(1);
const personalSystemError = ref(false);
const personalDocError = ref(false);
const personalForm = reactive({
  email: "",
  phone: "",
  systems: [] as string[],
});
const personalDocs = reactive<Record<string, File | null>>({
  id_card: null,
});

const personalRequiredDocs = computed<DocDef[]>(() => personalDocDefs);

const personalDocsComplete = computed(() =>
  personalRequiredDocs.value
    .filter((d) => d.required && !d.fromSSO)
    .every((d) => !!personalDocs[d.id])
);

function enterPersonal() {
  personalForm.email = "";
  personalForm.phone = "";
  personalForm.systems = [];
  personalSystemError.value = false;
  personalDocError.value = false;
  personalStep.value = 1;
  personalDocs.id_card = null;
  personalDialog.value = true;
}

function nextPersonalStep() {
  if (personalForm.systems.length === 0) {
    personalSystemError.value = true;
    return;
  }
  personalSystemError.value = false;
  personalStep.value = 2;
}

function submitPersonal() {
  if (!personalDocsComplete.value) {
    personalDocError.value = true;
    return;
  }
  personalDialog.value = false;
  successDialog.value = true;
}

// ── Juristic dialog ──
const juristicDialog = ref(false);
const juristicStep = ref(1);
const dbdLoading = ref(false);
const dbdResult = ref(false);
const dbdNotFound = ref(false);
const juristicSystemError = ref(false);
const juristicDocError = ref(false);
const juristicForm = reactive({
  regNo: "",
  nameTh: "",
  nameEn: "",
  type: "",
  status: "",
  authorized: "",
  email: "",
  phone: "",
  systems: [] as string[],
});
const juristicDocs = reactive<Record<string, File | null>>({
  id_card: null,
  passport: null,
  poa: null,
});

const juristicRequiredDocs = computed<DocDef[]>(() => juristicDocDefs);

const juristicDocsComplete = computed(() =>
  juristicRequiredDocs.value
    .filter((d) => d.required && !d.fromSSO)
    .every((d) => !!juristicDocs[d.id])
);

function enterPortal() {
  juristicForm.regNo = "";
  juristicForm.nameTh = "";
  juristicForm.nameEn = "";
  juristicForm.type = "";
  juristicForm.status = "";
  juristicForm.authorized = "";
  juristicForm.email = "";
  juristicForm.phone = "";
  juristicForm.systems = [];
  dbdResult.value = false;
  dbdNotFound.value = false;
  juristicSystemError.value = false;
  juristicDocError.value = false;
  juristicStep.value = 1;
  juristicDocs.id_card = null;
  juristicDocs.passport = null;
  juristicDocs.poa = null;
  juristicDialog.value = true;
}

function closeJuristicDialog() {
  juristicDialog.value = false;
  juristicStep.value = 1;
  dbdResult.value = false;
  dbdNotFound.value = false;
}

function searchDBD() {
  if (!juristicForm.regNo) return;
  dbdLoading.value = true;
  dbdResult.value = false;
  dbdNotFound.value = false;
  setTimeout(() => {
    dbdLoading.value = false;
    if (juristicForm.regNo === "0000000000000") {
      dbdNotFound.value = true;
    } else {
      juristicForm.nameTh = "บริษัท ไทยเกษตรอินเตอร์ จำกัด";
      juristicForm.nameEn = "Thai Kaset International Co., Ltd.";
      juristicForm.type = "บริษัทจำกัด";
      juristicForm.status = "ยังดำเนินกิจการอยู่";
      juristicForm.authorized = "นายสมชาย ใจดี";
      dbdResult.value = true;
    }
  }, 1000);
}

function nextJuristicStep() {
  if (juristicForm.systems.length === 0) {
    juristicSystemError.value = true;
    return;
  }
  juristicSystemError.value = false;
  juristicStep.value = 2;
}

function submitJuristic() {
  if (!juristicDocsComplete.value) {
    juristicDocError.value = true;
    return;
  }
  juristicDialog.value = false;
  successDialog.value = true;
}

// ── Shared ──
const successDialog = ref(false);

</script>

<style scoped>
.select-root {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

/* Top bar */
.select-topbar {
  background: rgb(var(--v-theme-primary));
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}
.is-dark .select-topbar {
  background: rgba(var(--v-theme-primary), 0.18);
}
.select-topbar-inner {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.topbar-logo {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-pill {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 6px 12px 6px 6px;
  cursor: default;
}
.user-avatar-sm {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* Body */
.select-body {
  padding: 48px 20px;
}
.select-body-inner {
  max-width: 860px;
  margin: 0 auto;
}

/* Heading icon */
.heading-icon-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Section header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}
.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.section-dot--personal {
  background: rgb(var(--v-theme-success));
}
.section-dot--company {
  background: rgb(var(--v-theme-info));
}

/* List card */
.list-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
}

/* Entity row */
.entity-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.15s;
}
.entity-row:hover {
  background: rgba(var(--v-theme-primary), 0.02);
}
.entity-row--last {
  border-bottom: none;
}

/* Entity icon */
.entity-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(var(--v-border-color), 0.06);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
}
.entity-icon-box--personal {
  background: rgba(var(--v-theme-success), 0.08);
  border-color: rgba(var(--v-theme-success), 0.2);
}
.entity-icon-box--company {
  background: rgba(var(--v-theme-info), 0.08);
  border-color: rgba(var(--v-theme-info), 0.2);
}

.entity-row--company:hover {
  background: rgba(var(--v-theme-info), 0.02);
}

/* Detail pill */
.detail-pill {
  font-size: 11px;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

/* Right column */
.row-right {
  min-width: 160px;
  max-width: 220px;
}

/* Dialog icon */
.dialog-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-icon--personal {
  background: rgba(var(--v-theme-success), 0.1);
  border: 1px solid rgba(var(--v-theme-success), 0.2);
}
.dialog-icon--company {
  background: rgba(var(--v-theme-info), 0.1);
  border: 1px solid rgba(var(--v-theme-info), 0.2);
}

/* System checkbox list */
.sys-checkbox-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  padding: 10px 12px;
  background: rgba(var(--v-border-color), 0.03);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
}
.sys-checkbox-item :deep(.v-label) {
  font-size: 13px !important;
  opacity: 1 !important;
}

/* Auto-fill field */
.autofill-field :deep(.v-field__input) {
  color: rgba(var(--v-theme-on-surface), 0.45) !important;
}
.autofill-field :deep(.v-field) {
  background: rgba(var(--v-border-color), 0.04) !important;
}

/* Field label */
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.7);
  margin-bottom: 5px;
}
.field-label-en { font-size: 11px; font-weight: 400; color: rgba(var(--v-theme-on-surface), 0.4); margin-left: 4px; }
.req {
  color: rgb(var(--v-theme-error));
}

/* Success ring */
.success-ring {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Dialog step bar */
.dialog-step-bar {
  display: flex;
  align-items: center;
  gap: 0;
}
.dialog-step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dialog-step-node {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.35);
  flex-shrink: 0;
  transition: all 0.2s;
}
.dialog-step-node--active {
  border-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}
.dialog-step-node--done {
  border-color: rgb(var(--v-theme-success));
  background: rgb(var(--v-theme-success));
  color: #fff;
}
.dialog-step-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.dialog-step-item--active .dialog-step-label {
  color: rgba(var(--v-theme-on-surface), 0.8);
}
.dialog-step-line {
  flex: 1;
  height: 2px;
  background: rgba(var(--v-border-color), var(--v-border-opacity));
  margin: 0 12px;
  transition: background 0.2s;
}
.dialog-step-line--active {
  background: rgb(var(--v-theme-primary));
}

/* Doc item */
.doc-item {
  padding: 12px 14px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgba(var(--v-border-color), 0.02);
}
</style>
