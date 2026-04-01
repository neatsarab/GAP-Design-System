<template>
    <div style="--v-theme-el-staff: var(--v-theme-el-staff)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <div>
                <h1 class="page-title mb-0">รายการตรวจเอกสาร EL</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    คำขอขึ้นทะเบียนโรงคัดบรรจุ (Establishment List)
                </p>
            </div>
        </div>

        <!-- Step Indicator -->
        <!-- <v-card v-if="page === 'main'" rounded="xl" elevation="0" class="mb-6 section-card">
            <v-card-text class="pa-5">
                <div class="d-flex align-center">
                    <template v-for="(step, i) in steps" :key="step.value">
                        <div class="step-item d-flex flex-column align-center" style="min-width: 80px">
                            <div class="step-circle mb-1" :class="stepClass(step.value)">
                                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                                <span v-else class="text-caption font-weight-bold">{{ step.value + 1 }}</span>
                            </div>
                            <div class="text-caption text-center"
                                :class="currentStep >= step.value ? 'text-el-staff font-weight-bold' : 'text-medium-emphasis'">
                                {{ step.title }}
                            </div>
                        </div>
                        <div v-if="i < steps.length - 1" class="step-line flex-grow-1"
                            :class="{ 'step-line--done': currentStep > step.value }" />
                    </template>
</div>
</v-card-text>
</v-card> -->

        <!-- ─── PAGE ROUTING ─── -->
        <v-window v-model="page" :touch="false">

            <!-- PAGE: MAIN DASHBOARD -->
            <v-window-item value="main">
                <template v-if="currentStep === 0">
                    <!-- 1. ข้อมูลโรงคัดบรรจุ -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-row dense class="pa-5">
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">รหัสคำขอ</div>
                                <v-text-field v-model="establishmentInfo.appCode" variant="outlined" rounded="lg"
                                    density="comfortable" readonly hide-details />
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">วันที่ยื่นคำขอ</div>
                                <v-text-field v-model="establishmentInfo.appDate" type="date" variant="outlined"
                                    rounded="lg" density="comfortable" readonly hide-details />
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label mb-1">สถานะ</div>
                                <v-select v-model="establishmentInfo.appStatus" :items="['รอตรวจเอกสาร']"
                                    variant="outlined" rounded="lg" density="comfortable" readonly hide-details />
                            </v-col>
                        </v-row>
                        <v-divider class="mx-8"></v-divider>
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">1.
                            ข้อมูลโรงคัดบรรจุ</v-card-title>
                        <v-card-text class="pa-5">


                            <v-row dense>
                                <!-- รหัสรับรอง / วันที่ออก / วันหมดอายุ -->
                                <v-col cols="12" md="4">
                                    <div class="field-label mb-1">รหัสรับรองโรงคัดบรรจุ</div>
                                    <v-text-field v-model="establishmentInfo.certCode" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label mb-1">วันที่ออก</div>
                                    <v-text-field v-model="establishmentInfo.issueDate" type="date" variant="outlined"
                                        rounded="lg" density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label mb-1">วันที่หมดอายุ</div>
                                    <v-text-field v-model="establishmentInfo.expireDate" type="date" variant="outlined"
                                        rounded="lg" density="comfortable" hide-details />
                                </v-col>

                                <!-- ชื่อโรงคัดบรรจุ -->
                                <v-col cols="12">
                                    <div class="field-label mb-1 mt-2">ชื่อโรงคัดบรรจุ</div>
                                    <v-text-field v-model="establishmentInfo.name" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>

                                <!-- ชื่อผู้ติดต่อ / นามสกุล -->
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">ชื่อผู้ติดต่อ</div>
                                    <v-text-field v-model="establishmentInfo.contactFirstName" variant="outlined"
                                        rounded="lg" density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">นามสกุล</div>
                                    <v-text-field v-model="establishmentInfo.contactLastName" variant="outlined"
                                        rounded="lg" density="comfortable" hide-details />
                                </v-col>

                                <!-- ที่ตั้งโรงคัดบรรจุ -->
                                <v-col cols="12">
                                    <div class="field-label mb-1 mt-2">ที่ตั้งโรงคัดบรรจุ</div>
                                    <v-text-field v-model="establishmentInfo.address" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>

                                <!-- จังหวัด / อำเภอ -->
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">จังหวัด</div>
                                    <v-select v-model="establishmentInfo.province" :items="['กรุงเทพมหานคร']"
                                        variant="outlined" rounded="lg" density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">อำเภอ/เขต</div>
                                    <v-select v-model="establishmentInfo.district" :items="['เขตลาดพร้าว']"
                                        variant="outlined" rounded="lg" density="comfortable" hide-details />
                                </v-col>

                                <!-- ตำบล / รหัสไปรษณีย์ -->
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">ตำบล/แขวง</div>
                                    <v-select v-model="establishmentInfo.subdistrict" :items="['ลาดพร้าว']"
                                        variant="outlined" rounded="lg" density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">รหัสไปรษณีย์</div>
                                    <v-text-field v-model="establishmentInfo.zipcode" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>

                                <!-- โทรศัพท์ / มือถือ -->
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">โทรศัพท์</div>
                                    <v-text-field v-model="establishmentInfo.phone" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">โทรศัพท์มือถือ</div>
                                    <v-text-field v-model="establishmentInfo.mobile" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>

                                <!-- โทรสาร / อีเมล -->
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">โทรสาร (FAX)</div>
                                    <v-text-field v-model="establishmentInfo.fax" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">อีเมล (E-mail)</div>
                                    <v-text-field v-model="establishmentInfo.email" variant="outlined" rounded="lg"
                                        density="comfortable" hide-details />
                                </v-col>

                                <!-- วันที่อนุมัติ / สถานะโรงงาน -->
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">วันที่อนุมัติ</div>
                                    <v-text-field v-model="establishmentInfo.approveDate" type="date" variant="outlined"
                                        rounded="lg" density="comfortable" hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1 mt-2">สถานะ</div>
                                    <v-text-field v-model="establishmentInfo.status" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- 2. รายการเอกสาร-->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">2. รายการเอกสาร</v-card-title>
                        <v-card-text class="pa-5">
                            <!-- รายการเอกสารแสดงความประสงค์ (ส่วนบนสุดของฟอร์ม) -->
                            <div class="field-label mb-2 font-weight-bold">เอกสารประกอบคำขอขึ้นทะเบียน
                                (Establishment List)</div>
                            <v-table density="comfortable" class="border rounded-lg mb-8">
                                <thead>
                                    <tr class="bg-grey-lighten-4">
                                        <th class="text-left font-weight-bold" style="width: 35%;">รายการเอกสาร</th>
                                        <th class="text-left font-weight-bold" style="width: 25%;">เอกสารแนบ</th>
                                        <th class="text-left font-weight-bold" style="width: 20%;">ผลการตรวจเอกสาร</th>
                                        <th class="text-left font-weight-bold" style="width: 30%;">หมายเหตุ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="pa-4">
                                            <div class="text-body-2 mb-1">1.
                                                หนังสือแสดงความประสงค์การเข้าร่วมการจัดทำบัญชี Establishment List
                                                ลงนามโดยผู้มีอำนาจของบริษัท</div>
                                        </td>
                                        <td class="pa-2">
                                            <v-file-input variant="outlined" rounded="lg" density="compact" hide-details
                                                append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                        </td>
                                        <td class="pa-2">
                                            <v-select variant="outlined" rounded="lg" density="compact" hide-details
                                                :items="['ผ่าน', 'ไม่ผ่าน']" />
                                        </td>
                                        <td class="pa-2">
                                            <v-textarea variant="outlined" rounded="lg" density="compact" hide-details
                                                rows="1" auto-grow />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="pa-4">
                                            <div class="text-body-2 mb-1">2.
                                                เอกสารการมอบอำนาจให้เจ้าหน้าที่บริษัทดำเนินการจัดทำบัญชี
                                                Establishment List ในกรณีที่หนังสือไม่ได้ลงนามโดยผู้มีอำนาจของบริษัท
                                            </div>
                                        </td>
                                        <td class="pa-2">
                                            <v-file-input variant="outlined" rounded="lg" density="compact" hide-details
                                                append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                        </td>
                                        <td class="pa-2">
                                            <v-select variant="outlined" rounded="lg" density="compact" hide-details
                                                :items="['ผ่าน', 'ไม่ผ่าน']" />
                                        </td>
                                        <td class="pa-2">
                                            <v-textarea variant="outlined" rounded="lg" density="compact" hide-details
                                                rows="1" auto-grow />
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>

                    <!-- 3. ข้อมูลแปลงเกษตร -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">3. ข้อมูลแปลงเกษตร</v-card-title>
                        <v-card-text class="pa-5">
                            <v-data-table :headers="resultHeadersDetail" :items="resultItems" density="comfortable"
                                class="border rounded-lg custom-result-table" hide-default-footer>
                                <!-- Slot สำหรับปุ่ม View ข้อมูล -->
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-pen-to-square" variant="text" color="el-staff" size="small"
                                        @click="goToCreatePage('farmer')" />
                                </template>

                                <!-- Slot สำหรับสถานะ (Status Chip) -->
                                <template v-slot:item.status="{ item }">
                                    <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
                                        {{ item.status }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>

                    <!-- 4. ข้อมูลแปลงเกษตรที่ขอใบรับรอง GAP-->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">4. ข้อมูลแปลงเกษตรที่ขอใบรับรอง
                            GAP</v-card-title>
                        <v-card-text class="pa-5">
                            <v-data-table :headers="resultHeadersDetailGap" :items="resultItemsGap" density="comfortable"
                                class="border rounded-lg custom-result-table" hide-default-footer>
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-file-lines" variant="text" color="el-staff" size="small"
                                        @click="viewDetails(item)" />
                                </template>

                                <template v-slot:item.status="{ item }">
                                    <v-chip :color="getStatusColor(item.status)" size="small" variant="tonal">
                                        {{ item.status }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>

                    <!-- 5. ข้อมูลใบรับรอง GMP -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">5.ข้อมูลใบรับรอง GMP
                            ของโรงคัดบรรจุ</v-card-title>
                        <v-card-text class="pa-5">
                            <v-data-table :headers="factoryHeadersDetail" :items="factories" density="compact"
                                class="border rounded-lg custom-table" hide-default-footer>
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-file-lines" variant="text" size="small" color="el-staff"
                                        @click="goToCreatePage('factory')" />
                                </template>

                                <template v-slot:item.status="{ item }">
                                    <v-chip size="small" color="orange" variant="tonal">{{ item.status }}</v-chip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>

                    <!-- 6. ผลการพิจารณา-->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">6. ผลการพิจารณา</v-card-title>
                        <v-card-text class="pa-5">
                            <v-data-table :headers="resultHeadersDetailReview" :items="resultItemsDetail" density="compact"
                                class="border rounded-lg result-table">
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-file-lines" variant="text" size="small" color="el-staff"
                                        @click="viewResultDetail(item)" />
                                </template>

                                <template v-slot:item.farmerName="{ item }">
                                    <div class="text-caption py-1" style="line-height: 1.2">
                                        {{ item.farmerName }}
                                    </div>
                                </template>

                                <template v-slot:item.status="{ item }">
                                    <v-chip size="small" color="orange-darken-1" variant="tonal" rounded="lg">
                                        {{ item.status }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </template>

                <!-- STEP 2-4: Placeholder for other steps -->
                <template v-else>
                    <v-card rounded="xl" class="pa-10 text-center">
                        <v-icon icon="fas fa-hammer" size="64" color="grey" class="mb-4" />
                        <h2 class="text-h5 text-grey">อยู่ระหว่างการพัฒนาเนื้อหา Step {{ currentStep + 1 }}</h2>
                    </v-card>
                </template>

                <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                    <v-card-text class="pa-4 d-flex justify-space-between align-center">
                        <v-btn variant="tonal" color="grey" rounded="lg" @click="prevStepAction">{{ currentStep === 0 ?
                            'ยกเลิก'
                            : 'ย้อนกลับ' }}</v-btn>
                        <div class="d-flex ga-3">
                            <!-- <v-btn variant="tonal" color="el-staff" rounded="lg" prepend-icon="fas fa-floppy-disk"
                                @click="saveDraft">บันทึกแบบร่าง</v-btn> -->
                            <v-btn v-if="currentStep < steps.length - 1" color="el-staff" rounded="lg"
                                append-icon="fas fa-arrow-right" @click="currentStep++">ถัดไป</v-btn>
                            <v-btn v-else color="el-staff" rounded="lg" prepend-icon="fas fa-paper-plane"
                                @click="submitApplication">ยืนยันส่งคำขอ</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- PAGE: CREATE/EDIT FORM -->
            <v-window-item value="form">
                <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                    <v-card-title class="pa-5 pb-3 section-title font-weight-bold d-flex align-center">
                        <v-icon icon="fas fa-user-pen" class="mr-2" color="el-staff" size="20" />
                        {{ editType === 'farmer' ? 'ข้อมูลแปลงเกษตรกร' : editType === 'farm' ? 'ข้อมูลแปลงเกษตร' :
                            'ข้อมูลใบรับรองโรงคัดบรรจุ' }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text class="pa-8">
                        <v-row dense v-if="editType === 'farmer'">
                            <v-col cols="12">
                                <v-card variant="outlined" class="pa-6 rounded-xl mb-6">
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ชื่อเกษตรกร :</div>
                                            <v-text-field v-model="tempData.farmerName" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ประเภทการรับรอง :</div>
                                            <v-text-field v-model="tempData.certType" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ชนิดพืช :</div>
                                            <v-text-field v-model="tempData.cropName" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">รหัสใบรับรอง :</div>
                                            <v-text-field v-model="tempData.certNo" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>

                            <v-col cols="12" class="mt-n5">
                                <div class="field-label mb-1 font-weight-bold text-success">แผนการเพาะปลูก</div>
                                <v-divider class="mb-4" />
                                <v-table density="comfortable" class="border rounded-lg planting-table mb-8">
                                    <thead>
                                        <tr class="bg-grey-lighten-3">
                                            <th class="text-center border-right" style="width: 50px;"><v-checkbox
                                                    density="compact" hide-details
                                                    @update:model-value="selectAllPlanting" />
                                            </th>
                                            <th class="text-center border-right font-weight-bold">แผนการเพาะปลูก</th>
                                            <th class="text-center border-right font-weight-bold">ระยะเวลาเก็บเกี่ยว
                                            </th>
                                            <th class="text-center font-weight-bold" style="width: 80px;">เพิ่ม</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(plan, index) in tempData.plantingPlans" :key="index">
                                            <td class="text-center border-right"><v-checkbox v-model="plan.selected"
                                                    density="compact" hide-details /></td>
                                            <td class="pa-2 border-right"><v-text-field v-model="plan.name"
                                                    variant="outlined" rounded="0" density="compact" hide-details />
                                            </td>
                                            <td class="pa-2 border-right"><v-text-field v-model="plan.period"
                                                    variant="outlined" rounded="0" density="compact" hide-details />
                                            </td>
                                            <td class="text-center"><v-btn
                                                    v-if="index === tempData.plantingPlans.length - 1"
                                                    icon="fas fa-plus-circle" color="success" variant="text"
                                                    @click="addPlantingRow" /></td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>

                            <v-col cols="12">
                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">ขนาดพื้นที่ปลูก (ไร่) :</div>
                                        <v-text-field v-model="tempData.areaSize" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">ผลผลิต/พื้นที่(กก./ไร่) :</div>
                                        <v-text-field v-model="tempData.yieldPerArea" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">ผลผลิต/รอบการผลิต(กก./รอบ) :</div>
                                        <v-text-field v-model="tempData.yieldPerCycle" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">หมายเหตุ :</div>
                                        <v-text-field v-model="tempData.remark" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="field-label mb-1">รหัสแปลง :</div>
                                        <div class="d-flex align-center">
                                            <v-text-field v-model="tempData.farmCode" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                            <span
                                                class="ml-2 text-caption text-medium-emphasis">(ของกรมวิชาการเกษตร)</span>
                                        </div>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="field-label mb-1">ที่ตั้งแปลง :</div>
                                        <v-text-field v-model="tempData.location" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">จังหวัด :</div>
                                        <v-select v-model="tempData.province" :items="['กรุงเทพมหานคร']"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">พิกัด X :</div>
                                        <v-text-field v-model="tempData.coordX" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">อำเภอ/เขต :</div>
                                        <v-select v-model="tempData.district" :items="['เขตลาดพร้าว']"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">พิกัด Y :</div>
                                        <v-text-field v-model="tempData.coordY" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                </v-row>
                            </v-col>

                            <!-- ตารางตรวจสอบเอกสารรายแปลง -->
                            <v-col cols="12" class="mt-6">
                                <div class="field-label mb-2 font-weight-bold">ตรวจสอบเอกสารประกอบแปลงเกษตร</div>
                                <v-table density="comfortable" class="border rounded-lg check-document-table">
                                    <thead>
                                        <tr>
                                            <th class="text-left font-weight-bold" style="width: 40%;">รายการเอกสาร</th>
                                            <th class="text-center font-weight-bold" style="width: 10%;">ไฟล์</th>
                                            <th class="text-left font-weight-bold" style="width: 20%;">ผลการตรวจ</th>
                                            <th class="text-left font-weight-bold" style="width: 30%;">หมายเหตุ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(doc, index) in farmDocCheckList" :key="index"
                                            :class="{ 'bg-grey-lighten-4': doc.isHeader }">
                                            <td class="pa-4" :class="{ 'pl-10': doc.isSub }">
                                                <div class="text-body-2">
                                                    <span v-if="doc.required" class="text-error mr-1">*</span>
                                                    {{ doc.label }}
                                                </div>
                                            </td>
                                            <td class="text-center pa-2">
                                                <v-btn v-if="!doc.isHeader" icon="fas fa-file-pdf" variant="text"
                                                    color="el-staff" size="small" />
                                            </td>
                                            <td class="pa-2">
                                                <v-select v-if="!doc.isHeader" v-model="tempData.checkResults[doc.key]"
                                                    :items="['ผ่าน', 'ไม่ผ่าน']" variant="outlined" rounded="lg"
                                                    density="compact" hide-details />
                                            </td>
                                            <td class="pa-2">
                                                <v-textarea v-if="!doc.isHeader"
                                                    v-model="tempData.checkRemarks[doc.key]" variant="outlined"
                                                    rounded="lg" density="compact" hide-details rows="1" auto-grow />
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                                <div class="d-flex justify-center mt-6">
                                    <v-btn color="el-staff" prepend-icon="fas fa-check-double" rounded="lg"
                                        @click="passAllDocuments">ผ่านทั้งหมด</v-btn>
                                </div>
                            </v-col>

                            <!-- ส่วนมอบหมายงาน -->
                            <v-col cols="12">
                                <v-card rounded="xl" elevation="0"
                                    class="mt-8 section-card bg-grey-lighten-4 pa-6 border">
                                    <v-row dense align="center">
                                        <v-col cols="12" md="4">
                                            <v-checkbox v-model="tempData.isAssignToProvince"
                                                label="มอบหมายงานให้ ศวพ. จังหวัด" color="el-staff" hide-details
                                                density="comfortable" />
                                        </v-col>
                                        <template v-if="tempData.isAssignToProvince">
                                            <v-col cols="12" md="4" class="d-flex align-center">
                                                <span class="field-label mr-2">สวพ. เขต :</span>
                                                <v-text-field v-model="tempData.swpArea" variant="outlined" rounded="lg"
                                                    density="compact" hide-details readonly bg-color="white" />
                                            </v-col>
                                            <v-col cols="12" md="4" class="d-flex align-center">
                                                <span class="field-label mr-2">ศวพ. จังหวัด :</span>
                                                <v-select v-model="tempData.swpProvince" :items="masterSwpProvinces"
                                                    variant="outlined" rounded="lg" density="compact" hide-details
                                                    bg-color="white" />
                                            </v-col>
                                        </template>
                                    </v-row>
                                    <v-row justify="center" class="mt-8">
                                        <v-radio-group v-model="tempData.overallResult" inline hide-details>
                                            <v-radio label="ผ่าน" value="ผ่าน" color="success" class="mx-4" />
                                            <v-radio label="ปรับปรุง" value="ปรับปรุง" color="warning" class="mx-4" />
                                            <v-radio label="ไม่ผ่าน" value="ไม่ผ่าน" color="error" class="mx-4" />
                                        </v-radio-group>
                                    </v-row>
                                    <v-row class="mt-4">
                                        <v-col cols="12">
                                            <div class="field-label mb-2">หมายเหตุ/เหตุผล :</div>
                                            <v-textarea v-model="tempData.overallRemark" variant="outlined" rounded="xl"
                                                bg-color="white" rows="3" hide-details placeholder="ระบุเหตุผล..." />
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </v-col>

                            <v-col cols="12">
                                <!-- === Log Rejection History Table === -->
                                <div
                                    class="field-label mt-8 mb-3 font-weight-bold text-center text-h6 text-grey-darken-2">
                                    Log rejection history table
                                </div>

                                <v-card rounded="xl" elevation="0"
                                    class="mb-8 section-card pa-4">
                                    <v-table density="comfortable" class="bg-transparent custom-log-table">
                                        <thead>
                                            <tr class="bg-el-staff">
                                                <th class="text-center text-white"
                                                    style="border-radius: 12px 0 0 0; width: 100px;">
                                                    ครั้งที่</th>
                                                <th class="text-center text-white" style="width: 100px;">ลำดับ</th>
                                                <th class="text-center text-white" style="width: 150px;">วันที่</th>
                                                <th class="text-left text-white" style="border-radius: 0 12px 0 0">
                                                    หมายเหตุ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(log, index) in tempData.rejectionLog" :key="index">
                                                <td class="text-center font-weight-bold">{{ log.count }}</td>
                                                <td class="text-center">{{ log.seq }}</td>
                                                <td class="text-center">{{ log.date }}</td>
                                                <td class="text-left text-body-2">{{ log.remark }}</td>
                                            </tr>
                                            <!-- กรณีไม่มีข้อมูล -->
                                            <tr v-if="!tempData.rejectionLog || tempData.rejectionLog.length === 0">
                                                <td colspan="4" class="text-center text-medium-emphasis pa-6 italic">
                                                    <v-icon icon="fas fa-info-circle" class="mr-2" size="small" />
                                                    ไม่มีประวัติการตีกลับสำหรับรายการนี้
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-card>
                            </v-col>

                        </v-row>

                        <!-- Layout สำหรับ Farm และ Factory จะคล้ายกัน (ข้ามเพื่อความกระชับของ Code) -->
                        <v-row v-else-if="editType === 'factory'">
                            <v-col cols="12" class="text-center py-10">
                                <h2 class="text-grey">ส่วนแสดงข้อมูลใบรับรองโรงคัดบรรจุ (Read Only / Edit Mode)</h2>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                    <v-card-text class="pa-4 d-flex justify-end ga-3">
                        <v-btn variant="tonal" color="grey" rounded="lg" @click="page = 'main'">ยกเลิก</v-btn>
                        <v-btn color="el-staff" rounded="lg" prepend-icon="fas fa-save"
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
                    <v-chip color="el-staff" size="large" variant="tonal" class="mb-4">{{ establishmentInfo.appCode
                        }}</v-chip>
                    <p class="text-body-2 text-medium-emphasis">ระบบได้รับคำขอของท่านแล้ว</p>
                </v-card-text>
                <v-card-actions class="px-6 pb-5"><v-btn color="el-staff" rounded="lg" block
                        @click="page = 'main'; successDialog = false">ตกลง</v-btn></v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";

// ─── INITIAL STATES (ค่าเริ่มต้น) ───

const page = ref('main');
const currentStep = ref(0);
const editType = ref('');
const successDialog = ref(false);
const draftSnackbar = ref(false);

const steps = [
    { value: 0, title: "ข้อมูลคำขอ" },
    // { value: 1, title: "นัดตรวจแปลง" },
    // { value: 2, title: "ผลตรวจแปลง" },
    // { value: 3, title: "รายงานผล" }
];

// ข้อมูลโรงคัดบรรจุ (Mockup ค่าเริ่มต้น)
const establishmentInfo = reactive({
    appCode: 'EL-2569-00003',
    appDate: '2026-03-31',
    appStatus: 'รอตรวจเอกสาร',
    certCode: 'L-001/2569',
    issueDate: '2026-01-10',
    expireDate: '2029-01-09',
    name: 'บริษัท ไทยฟรุต พรีเมียม จำกัด',
    contactFirstName: 'ธนพล',
    contactLastName: 'ทรัพย์เจริญ',
    address: '99/1 หมู่ 5 แขวงลาดพร้าว',
    province: 'กรุงเทพมหานคร',
    district: 'เขตลาดพร้าว',
    subdistrict: 'ลาดพร้าว',
    zipcode: '10230',
    phone: '02-555-1234',
    mobile: '081-222-3333',
    fax: '02-555-1235',
    email: 'contact@thaifruit.com',
    approveDate: '2026-02-15',
    status: 'คงอยู่'
});

// ข้อมูลสำหรับ Form (Mockup ค่าเริ่มต้น)
const tempData = reactive({
    id: null,
    farmerName: 'นางสาว พลอย จินดามณี',
    certType: 'GAP',
    cropName: 'ผักชีไทย',
    certNo: 'กษ-1235-2556-1484',
    farmCode: 'F-12345-001',
    areaSize: '15.5',
    yieldPerArea: '1200',
    yieldPerCycle: '18600',
    remark: 'รอบการผลิตปกติ',
    location: 'ต.ลาดพร้าว อ.เขตลาดพร้าว จ.กรุงเทพฯ',
    province: 'กรุงเทพมหานคร',
    district: 'เขตลาดพร้าว',
    subdistrict: 'ลาดพร้าว',
    zipcode: '10230',
    coordX: '13.8045',
    coordY: '100.6030',
    coordZ: '0.0',
    plantingPlans: [
        { selected: false, name: 'มิถุนายน - สิงหาคม', period: '90 วัน' }
    ],
    checkResults: {},
    checkRemarks: {},
    isAssignToProvince: false,
    swpArea: 'เขต 1',
    swpProvince: null,
    overallResult: 'ผ่าน',
    overallRemark: '',
    rejectionLog: [
        {
            count: 1,
            seq: 1,
            date: '2026-03-25',
            remark: 'เอกสารแนบข้อ 4 (บัญชีรายชื่อสารเคมี) ไฟล์ไม่ชัดเจน กรุณาแนบไฟล์ใหม่'
        },
        {
            count: 1,
            seq: 2,
            date: '2026-03-28',
            remark: 'พิกัดแปลง X, Y ไม่ตรงกับในใบรับรอง GAP'
        }
    ]
});

const factories = ref([{ id: 1, cropName: "ผักชีไทย", gmpNo: "GMP-999", status: "รออนุมัติผล" }]);

// Headers
const factoryHeadersDetail = [
    { title: '', key: 'view', align: 'start', width: '100px', sortable: false },
    { title: 'ชนิดพืช', key: 'cropName', align: 'start' },
    { title: 'สถานะ', key: 'status', align: 'center' },
];

const resultHeadersDetail = [
    { title: 'ตรวจเอกสาร', key: 'view', align: 'center', width: '80px', sortable: false },
    { title: 'ชื่อเกษตรกร', key: 'farmerName', align: 'start', width: '200px' },
    { title: 'ชนิดพืช', key: 'cropName', align: 'start' },
    { title: 'เลขที่ใบรับรอง', key: 'certNo', align: 'start' },
    { title: 'ที่ตั้งแปลง', key: 'farmCode', align: 'center' },
    { title: 'แขวง/ตำบล', key: 'subdistrict', align: 'center' },
];
const resultHeadersDetailGap = [
    { title: '', key: 'view', align: 'center', width: '80px', sortable: false },
    { title: 'ชนิดพืช', key: 'cropName', align: 'start' },
    { title: 'ชื่อเกษตรกร', key: 'farmerName', align: 'start', width: '200px' },
    { title: 'รหัสใบรับรอง', key: 'certNo', align: 'start' },
    { title: 'รหัสแปลง', key: 'farmCode', align: 'center' },
    { title: 'ผลตรวจเอกสาร', key: 'docResult', align: 'center' },
    { title: 'สถานะ', key: 'status', align: 'center' },
];
const resultHeadersDetailReview = [
    { title: '', key: 'view', align: 'center', width: '80px', sortable: false },
    { title: 'ชนิดพืช', key: 'cropName', align: 'start' },
    { title: 'ชื่อเกษตรกร', key: 'farmerName', align: 'start', width: '200px' },
    { title: 'รหัสใบรับรอง', key: 'certNo', align: 'start' },
    { title: 'รหัสแปลง', key: 'farmCode', align: 'center' },
    { title: 'ผลตรวจเอกสาร', key: 'docResult', align: 'center' },
    { title: 'สถานะ', key: 'status', align: 'center' },
];


const resultItems = ref([
    { cropName: 'ผักชีไทย', farmerName: 'พลอย จินดามณี', certNo: 'กษ-1484', farmCode: 'F-001', subdistrict: 'ลาดพร้าว' }
]);
const resultItemsGap = ref([
    { cropName: 'ผักชีไทย', farmerName: 'พลอย จินดามณี', certNo: 'กษ-1484', farmCode: 'F-001', docResult: 'รอพิจารณา', status: 'รอตรวจเอกสาร' }
]);
const resultItemsDetail = ref([
    { cropName: 'ผักชีไทย', farmerName: 'พลอย จินดามณี / โชติช่วง ชัชวาล', certNo: 'กษ-1484', farmCode: '-', docResult: 'รอพิจารณา', status: 'รอตรวจเอกสาร' }
]);

const farmDocCheckList = [
    { key: 'farmer_summary', label: '1. ตารางสรุปรายชื่อเกษตรกร :', required: true },
    { key: 'gap_copy', label: '2. สำเนาใบรับรอง GAP (ถ้ามี) :', required: false },
    { key: 'farm_contract', label: '3. สัญญา (Farm Contract) :', required: true },
    { key: 'chemical_record', label: '4. บัญชีรายชื่อสารเคมี :', required: true },
    { label: '5. แผนการควบคุมในแปลงปลูก :', isHeader: true },
    { key: 'visit_report', label: '- แผนการบันทึกการตรวจเยี่ยม :', isSub: true, required: true },
    { key: 'lab_analysis', label: '- ผลวิเคราะห์สารตกค้าง :', isSub: true, required: true },
    { key: 'education_evidence', label: '6. หลักฐานการให้ความรู้ :', required: true },
];

const masterSwpProvinces = ['ศวพ.เชียงใหม่', 'ศวพ.จันทบุรี', 'ศวพ.สุราษฎร์ธานี'];

// ─── METHODS ───

function stepClass(v) {
    return currentStep.value > v ? "step-done" : currentStep.value === v ? "step-active" : "step-pending";
}

function getStatusColor(status) {
    if (status === 'รอตรวจเอกสาร') return 'orange';
    return 'grey';
}

function goToCreatePage(type) {
    editType.value = type;
    page.value = 'form';
}

function addPlantingRow() {
    tempData.plantingPlans.push({ selected: false, name: '', period: '' });
}

function passAllDocuments() {
    farmDocCheckList.forEach(doc => {
        if (!doc.isHeader) tempData.checkResults[doc.key] = 'ผ่าน';
    });
}

function saveData() {
    page.value = 'main';
}

function prevStepAction() {
    if (currentStep.value > 0) currentStep.value--;
}

function saveDraft() {
    alert("บันทึกแบบร่างสำเร็จ");
}

function submitApplication() {
    successDialog.value = true;
}

function viewResultDetail(item) {
    alert("ดูรายละเอียดผลการพิจารณา: " + item.cropName);
}
</script>

<style scoped>
.page-title {
    font-size: 24px;
    color: #333;
}

.section-card {
    border: 1px solid #e0e0e0;
}

.step-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0e0e0;
    font-size: 12px;
}

.step-line {
    height: 2px;
    background: #e0e0e0;
    margin: 0 10px;
    margin-top: 12px;
}

.step-done,
.step-active {
    background: rgb(var(--v-theme-el-staff)) !important;
    color: white !important;
}

.step-line--done {
    background: rgb(var(--v-theme-el-staff)) !important;
}

.field-label {
    font-size: 14px;
    font-weight: 500;
    color: #555;
}

.text-el-staff {
    color: rgb(var(--v-theme-el-staff));
}

.success-ring {
    width: 60px;
    height: 60px;
    border: 4px solid #4caf50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.border-right {
    border-right: 1px solid #e0e0e0 !important;
}

.border-top {
    border-top: 1px solid #e0e0e0 !important;
}
</style>