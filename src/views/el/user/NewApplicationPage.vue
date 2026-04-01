<template>
    <div style="--v-theme-primary: var(--v-theme-el-user)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="handleBackNavigation" />
            <div>
                <h1 class="page-title mb-0">ยื่นคำขอ EL ใหม่</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    คำขอขึ้นทะเบียนโรงคัดบรรจุ (Establishment List)
                </p>
            </div>
        </div>

        <!-- Step Indicator -->
        <v-card v-if="page === 'main'" rounded="xl" elevation="0" class="mb-6 section-card">
            <v-card-text class="pa-5">
                <div class="d-flex align-center">
                    <template v-for="(step, i) in steps" :key="step.value">
                        <div class="step-item d-flex flex-column align-center" style="min-width: 80px">
                            <div class="step-circle mb-1" :class="stepClass(step.value)">
                                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                                <span v-else class="text-caption font-weight-bold">{{ step.value + 1 }}</span>
                            </div>
                            <div class="text-caption text-center"
                                :class="currentStep >= step.value ? 'text-el-user font-weight-bold' : 'text-medium-emphasis'">
                                {{ step.title }}
                            </div>
                        </div>
                        <div v-if="i < steps.length - 1" class="step-line flex-grow-1"
                            :class="{ 'step-line--done': currentStep > step.value }" />
                    </template>
                </div>
            </v-card-text>
        </v-card>

        <!-- ─── PAGE ROUTING ─── -->
        <v-window v-model="page" :touch="false">

            <!-- PAGE: MAIN DASHBOARD -->
            <v-window-item value="main">
                <template v-if="currentStep === 0">
                    <!-- 1. ข้อมูลเกษตรกร -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">1. ข้อมูลเกษตรกรที่ขอใบรับรอง
                            GAP</v-card-title>
                        <v-card-text class="pa-5">
                            <div class="d-flex align-center ga-3 mb-4 flex-wrap">
                                <div style="width: 300px">
                                    <v-autocomplete v-model="selectedMasterFarmer" :items="masterFarmers"
                                        item-title="name" item-value="name" placeholder="เลือกจากฐานข้อมูลเดิม"
                                        variant="outlined" density="compact" hide-details rounded="lg" />
                                </div>
                                <v-btn color="success" variant="flat" prepend-icon="fas fa-check" rounded="lg"
                                    @click="addFarmerFromMaster">เพิ่ม</v-btn>
                                <v-spacer />
                                <v-btn color="el-user" prepend-icon="fas fa-plus" rounded="lg"
                                    @click="goToCreatePage('farmer')">สร้างใหม่</v-btn>
                                <v-btn color="error" variant="tonal" prepend-icon="fas fa-xmark" rounded="lg"
                                    :disabled="!selectedFarmerRows.length" @click="removeItems('farmer')">ลบ</v-btn>
                            </div>
                            <v-data-table v-model="selectedFarmerRows" :headers="farmerHeaders" :items="farmers"
                                show-select item-value="id" density="compact" class="border rounded-lg custom-table">
                                <template v-slot:item.actions="{ item }"><v-btn icon="fas fa-pen-to-square"
                                        variant="text" size="small" color="warning"
                                        @click="goToEditPage(item, 'farmer')" /></template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>

                    <!-- 2. ข้อมูลแปลงเกษตรกร -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">2. ข้อมูลแปลงเกษตรกรที่ขอใบรับรอง
                            GAP</v-card-title>
                        <v-card-text class="pa-5">
                            <div class="d-flex align-center ga-3 mb-4 flex-wrap">
                                <v-spacer />
                                <v-btn color="el-user" prepend-icon="fas fa-plus" rounded="lg"
                                    @click="goToCreatePage('farm')">สร้างใหม่</v-btn>
                                <v-btn color="error" variant="tonal" prepend-icon="fas fa-xmark" rounded="lg"
                                    :disabled="!selectedFarmRows.length" @click="removeItems('farm')">ลบ</v-btn>
                            </div>
                            <v-data-table v-model="selectedFarmRows" :headers="farmHeaders" :items="farms" show-select
                                item-value="id" density="compact" class="border rounded-lg custom-table">
                                <template v-slot:item.actions="{ item }"><v-btn icon="fas fa-pen-to-square"
                                        variant="text" size="small" color="warning"
                                        @click="goToEditPage(item, 'farm')" /></template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>

                    <!-- 3. ข้อมูลใบรับรอง GMP ของโรงคัดบรรจุ -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">3. ข้อมูลใบรับรอง GMP
                            ของโรงคัดบรรจุ</v-card-title>
                        <v-card-text class="pa-5">
                            <div class="d-flex align-center ga-3 mb-4 flex-wrap">
                                <div style="width: 300px">
                                    <!-- แก้ไข: ผูก v-model และใส่ไอเทมตัวอย่าง -->
                                    <v-autocomplete v-model="selectedMasterFactory" :items="masterFactories"
                                        item-title="cropName" item-value="id" placeholder="เลือกข้อมูลโรงคัดบรรจุ"
                                        variant="outlined" density="compact" hide-details rounded="lg" />
                                </div>
                                <!-- แก้ไข: เพิ่ม function @click -->
                                <v-btn color="success" variant="flat" prepend-icon="fas fa-check" rounded="lg"
                                    @click="addFactoryFromMaster">เพิ่ม</v-btn>

                                <v-spacer />
                                <v-btn color="el-user" prepend-icon="fas fa-plus" rounded="lg"
                                    @click="goToCreatePage('factory')">สร้างใหม่</v-btn>
                                <v-btn color="error" variant="tonal" prepend-icon="fas fa-xmark" rounded="lg"
                                    :disabled="!selectedFactoryRows.length" @click="removeItems('factory')">ลบ</v-btn>
                            </div>

                            <v-data-table v-model="selectedFactoryRows" :headers="factoryHeaders" :items="factories"
                                show-select item-value="id" density="compact" class="border rounded-lg custom-table">
                                <template v-slot:item.actions="{ item }"><v-btn icon="fas fa-pen-to-square"
                                        variant="text" size="small" color="warning"
                                        @click="goToEditPage(item, 'factory')" /></template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </template>

                <!-- STEP 2: ไฟล์แนบ -->
                <template v-else-if="currentStep === 1">
                    <v-row>
                        <v-col v-for="section in uploadSections" :key="section.title" cols="12" md="6">
                            <v-card rounded="xl" elevation="0" class="section-card h-100">
                                <v-card-title class="pa-5 pb-3 section-title"><v-icon icon="fas fa-folder-open"
                                        color="el-user" class="mr-2" size="18" />{{ section.title }}</v-card-title>
                                <v-divider /><v-card-text class="pa-5">
                                    <p class="text-body-2 text-medium-emphasis mb-4">{{ section.desc }}</p>
                                    <div v-for="file in section.files" :key="file"
                                        class="upload-area rounded-xl mb-3 d-flex flex-column align-center justify-center pa-4">
                                        <v-icon icon="fas fa-cloud-arrow-up" color="el-user" size="28" class="mb-2" />
                                        <div class="text-body-2 font-weight-medium mb-1">{{ file }}</div>
                                        <div class="text-caption text-medium-emphasis">
                                            คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวางที่นี่</div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </template>

                <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                    <v-card-text class="pa-4 d-flex justify-space-between align-center">
                        <v-btn variant="tonal" color="grey" rounded="lg" @click="prevStepAction">{{ currentStep === 0 ?
                            'ยกเลิก'
                            : 'ย้อนกลับ' }}</v-btn>
                        <div class="d-flex ga-3">
                            <v-btn variant="tonal" color="el-user" rounded="lg" prepend-icon="fas fa-floppy-disk"
                                @click="saveDraft">บันทึกแบบร่าง</v-btn>
                            <v-btn v-if="currentStep < steps.length - 1" color="el-user" rounded="lg"
                                append-icon="fas fa-arrow-right" @click="currentStep++">ถัดไป</v-btn>
                            <v-btn v-else color="el-user" rounded="lg" prepend-icon="fas fa-paper-plane"
                                @click="submitApplication">ยืนยันส่งคำขอ</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- PAGE: CREATE/EDIT FORM -->
            <v-window-item value="form">
                <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                    <v-card-title class="pa-5 pb-3 section-title font-weight-bold d-flex align-center">
                        <v-icon icon="fas fa-user-pen" class="mr-2" color="el-user" size="20" />
                        {{ editType === 'farmer' ? 'ข้อมูลเกษตรกร' : editType === 'farm' ? 'ข้อมูลแปลงเกษตร' :
                            'ข้อมูลใบรับรองโรงคัดบรรจุ' }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text class="pa-8">
                        <v-row dense v-if="editType === 'farmer'">
                            <!-- ประเภทเกษตรกร -->
                            <v-col cols="12">
                                <div class="field-label">ประเภท <span class="req">*</span></div>
                                <v-radio-group v-model="tempData.farmerType" inline color="el-user" density="compact">
                                    <v-radio label="บุคคลธรรมดา" value="บุคคลธรรมดา" class="mr-2"></v-radio>
                                    <v-radio label="นิติบุคคล" value="นิติบุคคล" class="mr-2"></v-radio>
                                    <v-radio label="กลุ่มเกษตรกร" value="กลุ่มเกษตรกร" class="mr-2"></v-radio>
                                </v-radio-group>
                            </v-col>

                            <!-- เลขประจำตัว -->
                            <v-col cols="12" md="6">
                                <div class="field-label">เลขที่ (บัตรประชาชน / นิติบุคคล) <span class="req">*</span>
                                </div>
                                <v-text-field v-model="tempData.idNo" variant="outlined" rounded="lg"
                                    density="comfortable" placeholder="ระบุเลข 13 หลัก" maxlength="13" />
                            </v-col>
                            <v-col cols="12" md="6"></v-col>

                            <!-- ชื่อ-นามสกุล -->
                            <v-col cols="12" md="3">
                                <div class="field-label mb-1">คำนำหน้าชื่อ <span class="req">*</span></div>
                                <v-select v-model="tempData.title" :items="['นาย', 'นาง', 'นางสาว']" variant="outlined"
                                    rounded="lg" density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="9">
                                <div class="field-label mb-1">ชื่อ <span class="req">*</span></div>
                                <v-text-field v-model="tempData.name" variant="outlined" rounded="lg"
                                    density="comfortable" placeholder="ชื่อ - นามสกุล" />
                            </v-col>

                            <!-- ที่อยู่แถวที่ 1 -->
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">บ้านเลขที่ <span class="req">*</span></div>
                                <v-text-field v-model="tempData.addressNo" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">หมู่</div>
                                <v-text-field v-model="tempData.moo" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>

                            <!-- ที่อยู่แถวที่ 2 -->
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">หมู่บ้าน</div>
                                <v-text-field v-model="tempData.village" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">ซอย</div>
                                <v-text-field v-model="tempData.soi" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>

                            <!-- ที่อยู่แถวที่ 3 -->
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">ถนน</div>
                                <v-text-field v-model="tempData.road" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6"></v-col>

                            <!-- จังหวัด/อำเภอ/ตำบล -->
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">จังหวัด <span class="req">*</span></div>
                                <v-autocomplete v-model="tempData.province"
                                    :items="['กรุงเทพฯ', 'ปทุมธานี', 'สุพรรณบุรี', 'เชียงใหม่']" variant="outlined"
                                    rounded="lg" density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">อำเภอ/เขต <span class="req">*</span></div>
                                <v-autocomplete v-model="tempData.district" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">ตำบล/แขวง <span class="req">*</span></div>
                                <v-autocomplete v-model="tempData.subdistrict" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>

                            <!-- รหัสไปรษณีย์ -->
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">รหัสไปรษณีย์</div>
                                <v-text-field v-model="tempData.zipcode" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="8"></v-col>

                            <!-- ข้อมูลติดต่อ -->
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">โทรศัพท์</div>
                                <v-text-field v-model="tempData.phone" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">โทรศัพท์มือถือ</div>
                                <v-text-field v-model="tempData.mobile" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">โทรสาร</div>
                                <v-text-field v-model="tempData.fax" variant="outlined" rounded="lg"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">อีเมล</div>
                                <v-text-field v-model="tempData.email" variant="outlined" rounded="lg"
                                    density="comfortable" type="email" />
                            </v-col>
                        </v-row>
                        <v-row v-else-if="editType === 'farm'">
                            <!-- 1. ส่วนเลือก GAP / NON-GAP -->
                            <v-col cols="12" class="radio-farm d-flex justify-center">
                                <v-radio-group v-model="tempData.certType" inline color="el-user" density="compact"
                                    hide-details>
                                    <v-radio label="GAP" value="GAP" class="mr-10"></v-radio>
                                    <v-radio label="NON-GAP" value="NON-GAP"></v-radio>
                                </v-radio-group>
                            </v-col>

                            <!-- 2. ส่วนฟิลด์ข้อมูลในกรอบน้ำเงิน (สไตล์ rounded="lg") -->
                            <v-col cols="12" class="mt-n5">
                                <v-card variant="outlined" class="pa-6 rounded-xl">
                                    <v-row dense>
                                        <!-- ชื่อเกษตรกร -->
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ชื่อเกษตรกร <span class="req">*</span></div>
                                            <v-autocomplete v-model="tempData.farmerName" :items="masterFarmers"
                                                item-title="name" variant="outlined" rounded="lg" density="comfortable"
                                                hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6"></v-col>

                                        <!-- แสดงผลตามประเภทที่เลือก -->
                                        <template v-if="tempData.certType === 'GAP'">
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1">ชนิดพืช <span class="req">*</span></div>
                                                <v-text-field v-model="tempData.cropName"
                                                    placeholder="ดึงมาจาก GAP master data ราย item" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details
                                                    class="hint-placeholder" />
                                            </v-col>
                                            <v-col cols="12" md="6"></v-col>

                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1">รหัสใบรับรอง <span class="req">*</span>
                                                </div>
                                                <v-text-field v-model="tempData.certNo" placeholder="ดึงมาจาก GAP"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1">วันหมดอายุ GAP</div>
                                                <div class="d-flex align-center ga-2">
                                                    <v-select v-model="tempData.expireDate" :items="[]"
                                                        placeholder="ดึงมาจาก GAP" variant="outlined" rounded="lg"
                                                        density="comfortable" hide-details style="max-width: 250px;" />
                                                    <span class="text-error text-caption">ตัวอย่าง : 31/12/2014</span>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1">รหัสแปลง</div>
                                                <div class="d-flex align-center ga-2">
                                                    <v-text-field v-model="tempData.farmCode" variant="outlined"
                                                        rounded="lg" density="comfortable" hide-details />
                                                    <span
                                                        class="text-caption text-medium-emphasis">(ของกรมวิชาการเกษตร)</span>
                                                </div>
                                            </v-col>
                                            <v-col cols="12" class="pa-4">
                                                <!-- ส่วนที่ 1: แผนการเพาะปลูก -->
                                                <div class="mb-6">
                                                    <div class="field-label mb-2 font-weight-bold">แผนการเพาะปลูก</div>
                                                    <v-divider class="mb-4" />

                                                    <div class="d-flex align-center mb-3">
                                                        <v-btn color="error" variant="tonal" size="small" rounded="lg"
                                                            prepend-icon="fas fa-trash-can" class="text-none">
                                                            ลบรายการ
                                                        </v-btn>
                                                        <span class="text-error text-caption ml-4">*
                                                            สามารถระบุได้มากกว่า 1 รายการ</span>
                                                    </div>

                                                    <v-table density="comfortable"
                                                        class="border rounded-lg custom-main-table">
                                                        <thead>
                                                            <tr>
                                                                <th class="text-center" style="width: 50px;"><v-checkbox
                                                                        density="compact" hide-details /></th>
                                                                <th class="text-left">แผนการเพาะปลูก</th>
                                                                <th class="text-left">ระยะเวลาเก็บเกี่ยว</th>
                                                                <th class="text-center" style="width: 100px;">จัดการ
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td class="text-center"><v-checkbox density="compact"
                                                                        hide-details /></td>
                                                                <td class="pa-2">
                                                                    <v-text-field placeholder="ระบุแผนการเพาะปลูก"
                                                                        variant="outlined" rounded="lg"
                                                                        density="compact" hide-details />
                                                                </td>
                                                                <td class="pa-2">
                                                                    <v-text-field placeholder="ระบุระยะเวลา"
                                                                        variant="outlined" rounded="lg"
                                                                        density="compact" hide-details />
                                                                </td>
                                                                <td class="text-center">
                                                                    <v-btn icon="fas fa-circle-plus" color="success"
                                                                        variant="text" />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </v-table>
                                                </div>

                                                <!-- ส่วนที่ 2: รายละเอียดพื้นที่ (กรอบสีแดง) -->
                                                <v-card variant="outlined" class="pa-6 rounded-xl">
                                                    <v-row dense>
                                                        <!-- ขนาดพื้นที่ และ ผลผลิต -->
                                                        <v-col cols="12" md="6">
                                                            <div class="field-label mb-1">ขนาดพื้นที่ปลูก (ไร่) <span
                                                                    class="req">*</span></div>
                                                            <v-text-field placeholder="ระบุจำนวนไร่" variant="outlined"
                                                                rounded="lg" density="comfortable" hide-details />
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <div class="field-label mb-1">ผลผลิต/พื้นที่ (กก./ไร่) <span
                                                                    class="req">*</span></div>
                                                            <v-text-field placeholder="ระบุผลผลิตต่อไร่"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>

                                                        <v-col cols="12" md="6">
                                                            <div class="field-label mb-1">ผลผลิต/รอบการผลิต (กก./รอบ)
                                                                <span class="req">*</span>
                                                            </div>
                                                            <v-text-field placeholder="ระบุผลผลิตต่อรอบ"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>
                                                        <v-col cols="12" md="6">
                                                            <div class="field-label mb-1">หมายเหตุ</div>
                                                            <v-text-field placeholder="ระบุหมายเหตุ (ถ้ามี)"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>

                                                        <!-- ที่ตั้งแปลง -->
                                                        <v-col cols="12">
                                                            <div class="field-label mb-1">ที่ตั้งแปลง <span
                                                                    class="req">*</span></div>
                                                            <v-text-field placeholder="ระบุที่อยู่ตั้งแปลง"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>

                                                        <!-- จังหวัด/อำเภอ/ตำบล -->
                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">จังหวัด <span
                                                                    class="req">*</span></div>
                                                            <v-select :items="[]" placeholder="เลือกจังหวัด"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">อำเภอ/เขต <span
                                                                    class="req">*</span></div>
                                                            <v-select :items="[]" placeholder="เลือกอำเภอ"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">ตำบล/แขวง <span
                                                                    class="req">*</span></div>
                                                            <v-select :items="[]" placeholder="เลือกตำบล"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>

                                                        <!-- พิกัด X, Y, Z -->
                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">พิกัด X</div>
                                                            <v-text-field placeholder="0.0000" variant="outlined"
                                                                rounded="lg" density="comfortable" hide-details />
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">พิกัด Y</div>
                                                            <v-text-field placeholder="0.0000" variant="outlined"
                                                                rounded="lg" density="comfortable" hide-details />
                                                        </v-col>
                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">พิกัด Z</div>
                                                            <v-text-field placeholder="0.0000" variant="outlined"
                                                                rounded="lg" density="comfortable" hide-details />
                                                        </v-col>

                                                        <v-col cols="12" md="4">
                                                            <div class="field-label mb-1">รหัสไปรษณีย์</div>
                                                            <v-text-field placeholder="ระบุรหัสไปรษณีย์"
                                                                variant="outlined" rounded="lg" density="comfortable"
                                                                hide-details />
                                                        </v-col>
                                                    </v-row>
                                                </v-card>
                                            </v-col>

                                            <v-col cols="12" class="pa-4">
                                                <div class="field-label mb-2 font-weight-bold">รายการเอกสารแนบ</div>
                                                <v-divider class="mb-4" />

                                                <v-table density="comfortable"
                                                    class="border rounded-lg attachment-table">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left font-weight-bold" style="width: 30%;">
                                                                รายการเอกสาร</th>
                                                            <th class="text-left font-weight-bold" style="width: 30%;">
                                                                เอกสารแนบ</th>
                                                            <th class="text-left font-weight-bold" style="width: 20%;">
                                                                ผลการตรวจเอกสาร</th>
                                                            <th class="text-left font-weight-bold" style="width: 50%;">
                                                                หมายเหตุ</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!-- แถวที่ 1-4 เป็นเอกสารหลัก -->
                                                        <tr v-for="(doc, index) in attachmentList" :key="index">
                                                            <td class="pa-4">
                                                                <div class="d-flex align-start">
                                                                    <span v-if="doc.required"
                                                                        class="text-error mr-1">*</span>
                                                                    <span class="text-body-2">{{ doc.label }}</span>
                                                                </div>
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-file-input v-model="tempData.attachments[doc.key]"
                                                                    label="เลือกไฟล์ (PDF, JPG, PNG)" variant="outlined"
                                                                    rounded="lg" density="compact" hide-details
                                                                    prepend-icon=""
                                                                    append-inner-icon="fas fa-paperclip" />
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-select v-model="tempData.attachmentCheckDoc[doc.key]"
                                                                    placeholder="ผลการตรวจเอกสาร..." variant="outlined"
                                                                    rounded="lg" density="compact" hide-details />
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-textarea
                                                                    v-model="tempData.attachmentRemarks[doc.key]"
                                                                    placeholder="ระบุหมายเหตุ..." variant="outlined"
                                                                    rounded="lg" density="compact" hide-details rows="1"
                                                                    auto-grow />
                                                            </td>
                                                        </tr>

                                                        <!-- ส่วนที่ 5: หัวข้อใหญ่ แผนการควบคุม -->
                                                        <tr class="bg-grey-lighten-4">
                                                            <td colspan="4" class="pa-3 font-weight-bold text-body-2">
                                                                5. แผนการควบคุมในแปลงปลูก เอกสารและบันทึกต่างๆ
                                                                ที่เกี่ยวข้อง
                                                            </td>
                                                        </tr>

                                                        <!-- รายการย่อยของข้อ 5 -->
                                                        <tr v-for="(sub, sIdx) in controlPlanList" :key="'sub-' + sIdx">
                                                            <td class="pa-4 pl-8">
                                                                <div class="d-flex align-start">
                                                                    <span v-if="sub.required"
                                                                        class="text-error mr-1">*</span>
                                                                    <span class="text-body-2">- {{ sub.label }}</span>
                                                                </div>
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-file-input v-model="tempData.attachments[sub.key]"
                                                                    variant="outlined" rounded="lg" density="compact"
                                                                    hide-details prepend-icon=""
                                                                    append-inner-icon="fas fa-paperclip" />
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-select v-model="tempData.attachmentCheckDoc[sub.key]"
                                                                    placeholder="ผลการตรวจเอกสาร..." variant="outlined"
                                                                    rounded="lg" density="compact" hide-details />
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-textarea
                                                                    v-model="tempData.attachmentRemarks[sub.key]"
                                                                    placeholder="ระบุหมายเหตุ..." variant="outlined"
                                                                    rounded="lg" density="compact" hide-details rows="1"
                                                                    auto-grow />
                                                            </td>
                                                        </tr>

                                                        <!-- ข้อ 6 -->
                                                        <tr>
                                                            <td class="pa-4">
                                                                <div class="d-flex align-start">
                                                                    <span class="text-error mr-1">*</span>
                                                                    <span class="text-body-2">6.
                                                                        หลักฐานการให้ความรู้ความเข้าใจกับเกษตรกรเครือข่าย
                                                                        :</span>
                                                                    <div class="text-caption text-grey ml-2">
                                                                        (ด้านสารเคมีที่ EU ห้ามใช้,
                                                                        จุลินทรีย์ที่เป็นอันตราย,
                                                                        ศัตรูพืชที่ติดไปกับผลผลิต)
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-file-input
                                                                    v-model="tempData.attachments['edu_evidence']"
                                                                    variant="outlined" rounded="lg" density="compact"
                                                                    hide-details prepend-icon=""
                                                                    append-inner-icon="fas fa-paperclip" />
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-select
                                                                    v-model="tempData.attachmentCheckDoc['edu_evidence']"
                                                                    placeholder="ผลการตรวจเอกสาร..." variant="outlined"
                                                                    rounded="lg" density="compact" hide-details rows="1"
                                                                    auto-grow />
                                                            </td>
                                                            <td class="pa-2">
                                                                <v-textarea
                                                                    v-model="tempData.attachmentRemarks['edu_evidence']"
                                                                    placeholder="ระบุหมายเหตุ..." variant="outlined"
                                                                    rounded="lg" density="compact" hide-details rows="1"
                                                                    auto-grow />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </v-table>
                                            </v-col>

                                        </template>

                                        <!-- กรณีเลือก NON-GAP -->
                                        <template v-else>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1">ชนิดพืช <span class="req">*</span></div>
                                                <v-select v-model="tempData.cropName" :items="[]"
                                                    placeholder="Check GAP" variant="outlined" rounded="lg"
                                                    density="comfortable" hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1">ประเภทการรับรอง <span class="req">*</span>
                                                </div>
                                                <v-select v-model="tempData.nonGapType" :items="['GAP', 'อื่นๆ']"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>
                                            <v-col cols="12" class="text-center mt-4">
                                                <v-chip color="error" variant="tonal" size="small"
                                                    class="font-weight-bold">
                                                    กรณี Non GAP
                                                </v-chip>
                                            </v-col>
                                        </template>
                                    </v-row>
                                </v-card>
                            </v-col>
                        </v-row>
                        <v-row v-else-if="editType === 'factory'">
                            <!-- ชนิดพืช (Master Data) -->
                            <v-col cols="12" md="6">
                                <div class="field-label mb-1">ชนิดพืช <span class="req">*</span></div>
                                <v-autocomplete v-model="tempData.cropName" :items="['มังคุด', 'ลำไย', 'ทุเรียน']"
                                    placeholder="เลือกชนิดพืช (Master Data)" variant="outlined" rounded="lg"
                                    density="comfortable" hide-details />
                            </v-col>
                            <v-col cols="12" md="6"></v-col>

                            <v-col cols="12">
                                <v-table density="comfortable" class="border rounded-lg attachment-table">
                                    <thead>
                                        <tr>
                                            <th class="text-left font-weight-bold" style="width: 40%;">รายการเอกสาร</th>
                                            <th class="text-left font-weight-bold" style="width: 20%;">เอกสารแนบ</th>
                                            <th class="text-left font-weight-bold" style="width: 20%;">ผลการตรวจเอกสาร
                                            </th>
                                            <th class="text-left font-weight-bold" style="width: 25%;">หมายเหตุ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- หัวข้อที่ 1: GMP และ HACCP -->
                                        <tr class="bg-grey-lighten-4">
                                            <td colspan="4" class="pa-3 font-weight-bold text-body-2">
                                                1. สำเนาใบรับรอง GMP และ/หรือ HACCP :
                                            </td>
                                        </tr>

                                        <!-- ส่วนกรอกหมายเลข GMP -->
                                        <tr>
                                            <td class="pa-4">
                                                <div class="field-label mb-2"><span class="req">*</span> หมายเลข GMP :
                                                </div>
                                                <v-text-field v-model="tempData.gmpNo" variant="outlined" rounded="lg"
                                                    density="compact" class="mb-2" hide-details />
                                                <v-row dense>
                                                    <v-col cols="6">
                                                        <div class="text-caption font-weight-bold">วันที่ออกใบรับรอง:
                                                        </div>
                                                        <v-text-field v-model="tempData.gmpIssueDate" type="date"
                                                            variant="outlined" rounded="lg" density="compact"
                                                            hide-details />
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <div class="text-caption font-weight-bold">วันที่หมดอายุ:</div>
                                                        <v-text-field v-model="tempData.gmpExpireDate" type="date"
                                                            variant="outlined" rounded="lg" density="compact"
                                                            hide-details />
                                                    </v-col>
                                                </v-row>
                                            </td>
                                            <td class="pa-2 vertical-top">
                                                <v-file-input v-model="tempData.attachments['gmp_cert']"
                                                    variant="outlined" rounded="lg" density="compact" hide-details
                                                    append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                            </td>
                                            <td class="pa-2 vertical-top">
                                                <v-select v-model="tempData.attachmentCheckDoc['gmp_cert']"
                                                    placeholder="ผลการตรวจเอกสาร..." variant="outlined" rounded="lg"
                                                    density="compact" hide-details />
                                            </td>
                                            <td class="pa-2 vertical-top">
                                                <v-textarea v-model="tempData.attachmentRemarks['gmp_cert']"
                                                     placeholder="ระบุหมายเหตุ..." variant="outlined" rounded="lg" density="compact" hide-details
                                                    rows="1" auto-grow />
                                            </td>
                                        </tr>

                                        <!-- ส่วนกรอกหมายเลข HACCP -->
                                        <tr>
                                            <td class="pa-4 border-top">
                                                <div class="field-label mb-2">หมายเลข HACCP :</div>
                                                <v-text-field v-model="tempData.haccpNo" variant="outlined" rounded="lg"
                                                    density="compact" class="mb-2" hide-details />
                                                <v-row dense>
                                                    <v-col cols="6">
                                                        <div class="text-caption font-weight-bold">วันที่ออกใบรับรอง:
                                                        </div>
                                                        <v-text-field v-model="tempData.haccpIssueDate" type="date"
                                                            variant="outlined" rounded="lg" density="compact"
                                                            hide-details />
                                                    </v-col>
                                                    <v-col cols="6">
                                                        <div class="text-caption font-weight-bold">วันที่หมดอายุ:</div>
                                                        <v-text-field v-model="tempData.haccpExpireDate" type="date"
                                                            variant="outlined" rounded="lg" density="compact"
                                                            hide-details />
                                                    </v-col>
                                                </v-row>
                                            </td>
                                            <td class="pa-2 vertical-top border-top">
                                                <v-file-input v-model="tempData.attachments['haccp_cert']"
                                                    variant="outlined" rounded="lg" density="compact" hide-details
                                                    append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                            </td>
                                            <td class="pa-2 vertical-top">
                                                <v-select v-model="tempData.attachmentCheckDoc['haccp_cert']"
                                                    placeholder="ผลการตรวจเอกสาร..." variant="outlined" rounded="lg"
                                                    density="compact" hide-details />
                                            </td>
                                            <td class="pa-2 vertical-top border-top">
                                                <v-textarea v-model="tempData.attachmentRemarks['haccp_cert']"
                                                     placeholder="ระบุหมายเหตุ..." variant="outlined" rounded="lg" density="compact" hide-details
                                                    rows="1" auto-grow />
                                            </td>
                                        </tr>

                                        <!-- รายการเอกสารข้อ 2-5 (วนลูปจาก List) -->
                                        <tr v-for="(doc, idx) in factoryDocList" :key="idx">
                                            <td class="pa-4">
                                                <span class="text-body-2">{{ doc.label }}</span>
                                            </td>
                                            <td class="pa-2">
                                                <v-file-input v-model="tempData.attachments[doc.key]" variant="outlined"
                                                    rounded="lg" density="compact" hide-details
                                                    append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                            </td>
                                            <td class="pa-2 vertical-top">
                                                <v-select v-model="tempData.attachmentCheckDoc[doc.key]"
                                                    placeholder="ผลการตรวจเอกสาร..." variant="outlined" rounded="lg"
                                                    density="compact" hide-details />
                                            </td>
                                            <td class="pa-2">
                                                <v-textarea v-model="tempData.attachmentRemarks[doc.key]"
                                                     placeholder="ระบุหมายเหตุ..." variant="outlined" rounded="lg" density="compact" hide-details
                                                    rows="1" auto-grow />
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                    <v-card-text class="pa-4 d-flex justify-end ga-3">
                        <v-btn variant="tonal" color="grey" rounded="lg" @click="page = 'main'">ยกเลิก</v-btn>
                        <v-btn color="el-user" rounded="lg" prepend-icon="fas fa-save"
                            @click="saveData">บันทึกข้อมูล</v-btn>
                    </v-card-text>
                </v-card>
            </v-window-item>
        </v-window>

        <!-- Success Dialog -->
        <v-dialog v-model="successDialog" max-width="440" persistent>
            <v-card rounded="xl">
                <v-card-text class="pa-8 text-center">
                    <div class="success-ring mx-auto mb-4"><v-icon icon="fas fa-check" color="success" size="36" />
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h3>
                    <v-chip color="el-user" size="large" variant="tonal" class="mb-4">EL-2569-00003</v-chip>
                    <p class="text-body-2 text-medium-emphasis">ระบบได้รับคำขอของท่านแล้ว</p>
                </v-card-text>
                <v-card-actions class="px-6 pb-5"><v-btn color="el-user" rounded="lg" block
                        @click="goToApplicationList">ดูรายการคำขอ</v-btn></v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="draftSnackbar" color="success" rounded="lg" timeout="2500" location="top right"><v-icon
                icon="fas fa-floppy-disk" class="mr-2" />บักทึกแบบร่างแล้ว</v-snackbar>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const page = ref('main');
const currentStep = ref(0);
const editType = ref(''); // farmer, farm, factory
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [{ value: 0, title: "ข้อมูลรายละเอียด" }, { value: 1, title: "ไฟล์แนบ" }];

// ─── DATA LISTS ───
const farmers = ref([{ id: 1, name: "นายเกษตร มั่นคง", idNo: "1-1001-00223-34-4", addressNo: "1/2", province: "กรุงเทพฯ" }]);
const farms = ref([{ id: 1, farmerName: "นายเกษตร มั่นคง", cropName: "ทุเรียน", certNo: "GAP-12345", location: "แปลง 1" }]);
const factories = ref([{ id: 1, cropName: "ทุเรียน", gmpNo: "GMP-999", haccpNo: "H-88", status: "ปกติ" }]);

const selectedFarmerRows = ref([]);
const selectedFarmRows = ref([]);
const selectedFactoryRows = ref([]);

// ─── HEADERS ───
const farmerHeaders = [
    { title: 'ชื่อเกษตรกร', key: 'name' }, { title: 'เลขบัตรประชาชน', key: 'idNo' }, { title: 'บ้านเลขที่', key: 'addressNo' }, { title: 'จังหวัด', key: 'province' }, { title: 'แก้ไข', key: 'actions', sortable: false, align: 'center' }
];
const farmHeaders = [
    { title: 'ชื่อเกษตรกร', key: 'farmerName' }, { title: 'ชื่อพืช', key: 'cropName' }, { title: 'รหัสใบรับรอง', key: 'certNo' }, { title: 'แก้ไข', key: 'actions', sortable: false, align: 'center' }
];
const factoryHeaders = [
    { title: 'ชื่อพืช', key: 'cropName' }, { title: 'หมายเลข GMP', key: 'gmpNo' }, { title: 'สถานะ', key: 'status' }, { title: 'แก้ไข', key: 'actions', sortable: false, align: 'center' }
];

// ─── FORM LOGIC ───
const tempData = reactive({
    id: null,
    farmerType: 'บุคคลธรรมดา',
    attachments: {}, // ต้องมีอันนี้
    attachmentCheckDoc: {},
    attachmentRemarks: {}, // ต้องมีอันนี้
    plantingPlans: [{ selected: false, name: '', period: '' }], // สำหรับตารางแผน
    farmDetails: [{ selected: false, areaSize: '', yieldPerArea: '', yieldPerCycle: '', location: '', coordX: '', coordY: '', coordZ: '' }] // สำหรับตารางแดง
});
const masterFarmers = [{ name: "นายสมชาย เข็มกลัด", idNo: "1-1099-00123-45-6", addressNo: "10/1", province: "กรุงเทพฯ" }];
const selectedMasterFarmer = ref(null);
const selectedMasterFactory = ref(null);

function goToCreatePage(type) {
    editType.value = type;

    // ล้างค่าเก่าทั้งหมด
    Object.keys(tempData).forEach(key => {
        if (key === 'attachments' || key === 'attachmentRemarks' || key === 'attachmentCheckDoc') {
            tempData[key] = {}; // ล้างไฟล์แนบเป็น Object ว่าง
        } else if (key === 'plantingPlans') {
            tempData[key] = [{ selected: false, name: '', period: '' }];
        } else if (key === 'farmDetails') {
            tempData[key] = [{ selected: false, areaSize: '', yieldPerArea: '', yieldPerCycle: '', location: '', coordX: '', coordY: '', coordZ: '' }];
        } else {
            tempData[key] = null;
        }
    });

    // กำหนดค่า Default ตามประเภท
    if (type === 'farmer') {
        tempData.farmerType = 'บุคคลธรรมดา';
    } else if (type === 'farm') {
        tempData.certType = 'GAP';
    }

    page.value = 'form';
}

function goToEditPage(item, type) {
    editType.value = type;

    // คัดลอกข้อมูลจากตารางมาลง tempData
    const clone = JSON.parse(JSON.stringify(item));

    // ตรวจสอบโครงสร้างไฟล์แนบ (เผื่อข้อมูลเก่าไม่มี)
    if (!clone.attachments) clone.attachments = {};
    if (!clone.attachmentCheckDoc) clone.attachmentCheckDoc = {};
    if (!clone.attachmentRemarks) clone.attachmentRemarks = {};

    Object.assign(tempData, clone);
    page.value = 'form';
}

function saveData() {
    let targetList = editType.value === 'farmer' ? farmers : editType.value === 'farm' ? farms : factories;
    if (tempData.id) {
        const idx = targetList.value.findIndex(f => f.id === tempData.id);
        targetList.value[idx] = { ...tempData };
    } else {
        targetList.value.push({ ...tempData, id: Date.now() });
    }
    page.value = 'main';
}

function removeItems(type) {
    if (type === 'farmer') {
        farmers.value = farmers.value.filter(f => !selectedFarmerRows.value.includes(f.id));
        selectedFarmerRows.value = [];
    } else if (type === 'farm') {
        farms.value = farms.value.filter(f => !selectedFarmRows.value.includes(f.id));
        selectedFarmRows.value = [];
    } else {
        factories.value = factories.value.filter(f => !selectedFactoryRows.value.includes(f.id));
        selectedFactoryRows.value = [];
    }
}

function addFarmerFromMaster() {
    if (selectedMasterFarmer.value) {
        const masterData = masterFarmers.find(f => f.name === selectedMasterFarmer.value);
        if (masterData) farmers.value.push({ id: Date.now(), ...JSON.parse(JSON.stringify(masterData)) });
        selectedMasterFarmer.value = null;
    }
}

// --- DATA MASTER สำหรับโรงคัดบรรจุ ---
const masterFactories = [
    { id: 101, cropName: "มังคุด", gmpNo: "GMP-69001", haccpNo: "H-7701", status: "ปกติ" },
    { id: 102, cropName: "ลำไย", gmpNo: "GMP-69002", haccpNo: "H-7702", status: "ปกติ" }
];
// --- ฟังก์ชันเพิ่มจาก Master ---
function addFactoryFromMaster() {
    if (selectedMasterFactory.value) {
        // 1. ค้นหาข้อมูลจาก Master
        const masterData = masterFactories.find(f => f.id === selectedMasterFactory.value);

        if (masterData) {
            // 2. ตรวจสอบข้อมูลซ้ำในตารางปัจจุบัน
            const isExist = factories.value.some(f => f.gmpNo === masterData.gmpNo);
            if (isExist) {
                alert("ข้อมูลใบรับรองนี้มีอยู่ในรายการแล้ว");
                return;
            }

            // 3. เพิ่มเข้าตาราง (จำลอง ID ใหม่เพื่อป้องกันการแก้ไขทับ Master)
            factories.value.push({
                ...JSON.parse(JSON.stringify(masterData)),
                id: Date.now()
            });
        }
        // 4. ล้างค่าที่เลือก
        selectedMasterFactory.value = null;
    } else {
        alert("กรุณาเลือกข้อมูลโรงคัดบรรจุก่อนกดเพิ่ม");
    }
}

// ─── STEP 2 CONFIG ───
const uploadSections = [
    { title: "เอกสารแปลงเกษตร", desc: "เอกสารเกี่ยวกับแปลงเกษตรและสัญญาเกษตรกร", files: ["แผนที่แปลง", "สำเนาใบรับรอง GAP"] },
    { title: "เอกสารความปลอดภัยอาหาร", desc: "เอกสารด้านความปลอดภัยและการตรวจสอบย้อนกลับ", files: ["ควบคุมสารตกค้าง", "ตรวจสอบย้อนกลับ"] },
];

function stepClass(v) { return currentStep.value > v ? "step-done" : currentStep.value === v ? "step-active" : "step-pending"; }
function handleBackNavigation() { page.value === 'form' ? page.value = 'main' : currentStep.value > 0 ? currentStep.value-- : router.back(); }
function prevStepAction() { currentStep.value === 0 ? router.push({ name: "ELUserApplicationList" }) : currentStep.value--; }
function saveDraft() { draftSnackbar.value = true; }
function submitApplication() { successDialog.value = true; }
function goToApplicationList() { router.push({ name: "ELUserApplicationList" }); }

const attachmentList = [
    { key: 'farmer_list', label: '1. ตารางสรุปรายชื่อเกษตรกร :', required: true },
    { key: 'gap_cert', label: '2. สำเนาใบรับรอง GAP (ถ้ามี) :', required: false },
    { key: 'farm_contract', label: '3. สัญญาประทุษเกษตรและโรงคัดบรรจุ (Farm Contract) :', required: true },
    { key: 'chemical_list', label: '4. บัญชีรายชื่อสารเคมีที่ใช้ในการปลูกพืชแต่ละชนิด :', required: true },
];

const controlPlanList = [
    { key: 'visit_plan', label: 'แผนการบันทึกการตรวจเยี่ยม/ตรวจติดตามแปลงเกษตรกร', required: true },
    { key: 'control_record', label: 'แผนการควบคุม/บันทึกการตรวจเยี่ยม/บันทึกเกษตรกร', required: true },
    { key: 'chemical_use', label: 'สารเคมี/ปุ๋ย/ฮอร์โมน ที่ใช้ในแปลงปลูก', required: true },
    { key: 'tools_organic', label: 'เครื่องมือ/วัสดุอุปกรณ์การเกษตร (กรณีการผลิตพืชอินทรีย์)', required: false },
    { key: 'harvest_manage', label: 'การเก็บเกี่ยวและการจัดการหลังเก็บเกี่ยว', required: true },
    { key: 'lab_result', label: 'ผลวิเคราะห์สารตกค้าง/เชื้อจุลินทรีย์', required: true },
    { key: 'pest_control', label: 'การกำจัดศัตรูพืช', required: true },
];
const factoryDocList = [
    { key: 'prod_plan', label: '2. แผนการผลิตพืช และกำลังการผลิตพืชต่อวัน/สัปดาห์/เดือน :' },
    { key: 'vendor_list', label: '3. แผนการควบคุมกระบวนการผลิต (Approve Vendor List : AVL) :' },
    { key: 'safety_plan', label: ' - แผนการควบคุมระบบความปลอดภัยของพืช (สารเคมี/จุลินทรีย์) :' },
    { key: 'wash_process', label: ' - ขั้นตอนการล้าง และแบบฟอร์มการบันทึกการล้าง :' },
    { key: 'recall_plan', label: ' - การชี้บ่งและการตรวจสอบย้อนกลับ (Mock recall) :' },
    { key: 'haccp_team', label: '4. เอกสาร HACCP Team :' },
    { key: 'haccp_flow', label: ' - ขั้นตอนการผลิต (Flow Chart) :' },
    { key: 'haccp_plan', label: ' - HACCP Plan :' },
    { key: 'other_docs', label: '5. เอกสารอื่นๆ :' },
];
</script>

<style scoped>
.custom-table :deep(thead) {
    background-color: #EEEEEE !important;
}

.custom-table :deep(th) {
    font-weight: bold !important;
    border-right: 1px solid #E0E0E0 !important;
    color: #333 !important;
}

.upload-area {
    border: 2px dashed rgba(var(--v-theme-primary), 0.35);
    background: rgba(var(--v-theme-primary), 0.03);
    cursor: pointer;
    transition: background 0.15s;
    min-height: 100px;
}

.upload-area:hover {
    background: rgba(var(--v-theme-primary), 0.07);
}

.step-done,
.step-active {
    background: rgb(var(--v-theme-el-user)) !important;
    color: white !important;
}

.step-active {
    box-shadow: 0 0 0 4px rgba(var(--v-theme-el-user), 0.2) !important;
}

.step-line--done {
    background: rgb(var(--v-theme-el-user)) !important;
}

.req {
    color: red;
}

.field-label {
    font-weight: 500;
    font-size: 14px;
}

.success-ring {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 4px solid #4caf50;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.radio-farm .v-selection-control-group) {
    grid-area: control;
    display: flex;
    justify-content: center;
}
</style>