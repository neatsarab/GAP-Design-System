<template>
    <div style="--v-theme-primary: var(--v-theme-el-staff)">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6">
            <div>
                <h1 class="page-title mb-0">
                    {{
                        page === 'gmp-form' ? 'บันทึกการตรวจประเมิน GMP' :
                            page === 'haccp-form' ? 'บันทึกการตรวจประเมิน HACCP' :
                                page === 'analysis-form' ? 'สร้างข้อมูลผลตรวจวิเคราะห์' :
                                    page === 'exam-form' ? 'ผลสอบการวัดความรู้การจำแนกศัตรูพืช' :
                                        'รายการตรวจ GAP'
                    }}
                </h1>
                <p class="text-body-2 text-medium-emphasis mb-0">คำขอขึ้นทะเบียนโรงคัดบรรจุ (Establishment List)</p>
            </div>
            <div v-if="['gmp-form', 'haccp-form', 'analysis-form', 'exam-form'].includes(page)" class="text-right">
                <div class="text-caption font-weight-bold">เลขหมายเอกสาร : {{ docNumber }}</div>
            </div>
        </div>

        <v-window v-model="page" :touch="false">
            <!-- ─── PAGE: MAIN DASHBOARD ─── -->
            <v-window-item value="main">
                <!-- Step Indicator -->
                <v-card rounded="xl" elevation="0" class="mb-6 border section-card">
                    <v-card-text class="pa-5">
                        <div class="d-flex align-center">
                            <template v-for="(step, i) in steps" :key="step.value">
                                <div class="step-item d-flex flex-column align-center" style="min-width: 80px">
                                    <div class="step-circle mb-1" :class="stepClass(step.value)">
                                        <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14"
                                            color="white" />
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
                </v-card>

                <template v-if="currentStep === 0">
                    <!-- 1. ข้อมูลโรงคัดบรรจุ -->
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-0 section-title font-weight-bold">1.
                            ข้อมูลโรงคัดบรรจุ</v-card-title>
                        <v-card-text class="pa-5">
                            <v-row dense>
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
                            <div class="field-label mb-2 font-weight-bold text-success">ผลการพิจารณา</div>
                            <v-data-table :headers="resultHeadersDetail" :items="resultItems" density="comfortable"
                                class="border rounded-lg custom-result-table" hide-default-footer>
                                <!-- Slot สำหรับปุ่ม View ข้อมูล -->
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-file-lines" variant="text" color="primary" size="small"
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
                            <div class="field-label mb-2 font-weight-bold text-success">ผลการพิจารณา</div>
                            <v-data-table :headers="resultHeadersDetail" :items="resultItems" density="comfortable"
                                class="border rounded-lg custom-result-table" hide-default-footer>
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-file-lines" variant="text" color="primary" size="small"
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
                                    <v-btn icon="fas fa-file-lines" variant="text" size="small" color="primary"
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
                            <v-data-table :headers="resultHeadersDetail" :items="resultItemsDetail" density="compact"
                                class="border rounded-lg result-table">
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-file-lines" variant="text" size="small" color="primary"
                                        @click="viewResultDetail(item)" />
                                </template>

                                <template v-slot:item.farmerName="{ item }">
                                    <div class="text-caption py-1" style="line-height: 1.2">
                                        {{ item.farmerName }}
                                    </div>
                                </template>

                                <template v-slot:item.status="{ item }">
                                    <v-chip size="small" color="orange-darken-1" variant="flat" rounded="lg">
                                        {{ item.status }}
                                    </v-chip>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </template>

                <!-- STEP 2 Content -->
                <template v-if="currentStep === 1">
                    <div class="step-2-container mt-4">
                        <div class="d-flex justify-space-between align-end mb-4">
                            <div class="custom-tabs-wrapper d-flex border-bottom flex-grow-1">
                                <div v-for="tab in step2Tabs" :key="tab"
                                    class="custom-tab-item px-6 py-2 border-top border-left border-right"
                                    :class="{ 'active-tab bg-white': activeStep2Tab === tab, 'bg-grey-lighten-3': activeStep2Tab !== tab }"
                                    @click="activeStep2Tab = tab">
                                    {{ tab }}
                                </div>
                            </div>
                            <!-- ปุ่มบันทึกข้อมูล (แสดงเฉพาะใน Tab GMP/HACCP และยังไม่ได้กด) -->
                            <v-btn v-if="activeStep2Tab === 'GMP/HACCP' && !isStep2Saved" color="grey-lighten-2"
                                elevation="0" class="text-none border rounded-0" height="40" @click="handleStep2Save">
                                <span class="text-black font-weight-medium">บันทึกข้อมูล</span>
                                <div class="red-bar"></div>
                            </v-btn>
                        </div>

                        <!-- ─── TAB: GMP/HACCP ─── -->
                        <div v-if="activeStep2Tab === 'GMP/HACCP'">
                            <div v-if="!isStep2Saved" class="table-container border">
                                <v-table density="compact" class="custom-step2-table">
                                    <thead class="bg-grey-darken-3 text-white">
                                        <tr>
                                            <th class="text-center border-right" style="width: 50px;"><v-checkbox-btn
                                                    color="white" density="compact" hide-details /></th>
                                            <th v-for="n in 7" :key="n" class="text-center border-right text-none">
                                                Column</th>
                                            <th class="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-grey-lighten-3">
                                        <tr v-for="i in 3" :key="i">
                                            <td class="text-center border-right border-bottom"><v-checkbox-btn
                                                    density="compact" hide-details /></td>
                                            <td class="pa-4 border-right border-bottom text-center text-body-2">
                                                รายการคำขอ</td>
                                            <td v-for="n in 7" :key="n" class="border-right border-bottom"></td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </div>
                            <div v-else class="ghp-haccp-container animate-fade">
                                <div class="d-flex align-center mb-2"><span
                                        class="text-error font-weight-bold mr-2">GHP</span><v-btn variant="outlined"
                                        rounded="0" density="compact" class="bg-white border text-none"
                                        @click="page = 'gmp-form'"><v-icon icon="fas fa-plus-circle" color="success"
                                            size="small" class="mr-1" /> สร้างใหม่</v-btn><span
                                        class="ml-4 text-error font-weight-bold"
                                        style="font-size: 12px;">สร้างได้มากกว่า 1</span></div>
                                <v-table density="compact" class="border mb-6 custom-ghp-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center border-right">ดู-แก้ไข</th>
                                            <th class="text-center border-right">ครั้งที่ตรวจ</th>
                                            <th class="text-center border-right">กำหนดตรวจ</th>
                                            <th class="text-center border-right">วันที่ตรวจ</th>
                                            <th class="text-center border-right">ผู้ตรวจ</th>
                                            <th class="text-center border-right">ผลการตรวจ</th>
                                            <th class="text-center">หมายเหตุ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="text-center text-body-2">
                                            <td class="border-right"><v-btn icon="fas fa-edit" size="x-small"
                                                    variant="text" color="orange" @click="page = 'gmp-form'" /></td>
                                            <td class="border-right">1</td>
                                            <td class="border-right"></td>
                                            <td class="border-right">22/01/2014</td>
                                            <td class="border-right">เจ้าหน้าที่ กตม. 1</td>
                                            <td class="border-right">ผ่าน</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </v-table>
                                <div class="d-flex align-center mb-2"><span
                                        class="text-success font-weight-bold mr-2">HACCP</span><v-btn variant="outlined"
                                        rounded="0" density="compact" class="bg-white border text-none"
                                        @click="page = 'haccp-form'"><v-icon icon="fas fa-plus-circle" color="success"
                                            size="small" class="mr-1" /> สร้างใหม่</v-btn><span
                                        class="ml-4 text-error font-weight-bold"
                                        style="font-size: 12px;">สร้างได้มากกว่า 1</span></div>
                                <v-table density="compact" class="border custom-ghp-table">
                                    <tbody>
                                        <tr>
                                            <td colspan="7" class="text-center pa-4 text-grey italic">ไม่มีข้อมูล</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </div>
                        </div>

                        <!-- ─── TAB: ผลตรวจวิเคราะห์ ─── -->
                        <div v-if="activeStep2Tab === 'ผลตรวจวิเคราะห์'">
                            <v-btn color="white" class="border elevation-0 rounded-0 text-none mb-4"
                                @click="page = 'analysis-form'">
                                <v-icon icon="fas fa-plus-circle" color="success" class="mr-2" />
                                สร้างข้อมูลผลตรวจวิเคราะห์
                            </v-btn>
                            <div v-for="section in analysisDashboardSections" :key="section.title" class="mb-6">
                                <h3 class="text-success font-weight-bold mb-2 text-body-1">{{ section.title }}</h3>
                                <v-table density="compact" class="border custom-ghp-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center border-right">ดู / แก้ไข</th>
                                            <th class="text-center border-right">วันที่ตรวจ</th>
                                            <th class="text-center border-right">พืช</th>
                                            <th class="text-center border-right">ผู้ตรวจ</th>
                                            <th class="text-center border-right">{{ section.colName }}</th>
                                            <th class="text-center border-right">ผลตรวจ</th>
                                            <th class="text-center">ผ่าน/ไม่ผ่าน</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in section.data" :key="row.item" class="text-center text-body-2">
                                            <td class="border-right"><v-btn icon="fas fa-edit" size="x-small"
                                                    variant="text" color="orange" @click="page = 'analysis-form'" />
                                            </td>
                                            <td class="border-right">{{ row.date }}</td>
                                            <td class="border-right">{{ row.crop }}</td>
                                            <td class="border-right">{{ row.inspector }}</td>
                                            <td class="border-right">{{ row.item }}</td>
                                            <td class="border-right">{{ row.result }}</td>
                                            <td>{{ row.status }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </div>
                        </div>

                        <!-- ─── TAB: ผลสอบ ─── -->
                        <div v-if="activeStep2Tab === 'ผลสอบ'">
                            <h3 class="text-success font-weight-bold mb-2 text-body-1">
                                ผลสอบการวัดความรู้การจำแนกศัตรูพืชของพนักงาน</h3>
                            <v-btn color="white" class="border elevation-0 rounded-0 text-none mb-4"
                                @click="page = 'exam-form'">
                                <v-icon icon="fas fa-plus-circle" color="success" class="mr-2" /> สร้างข้อมูลผลสอบ
                            </v-btn>
                            <v-table density="compact" class="border custom-ghp-table mb-4">
                                <thead class="bg-grey-lighten-3">
                                    <tr>
                                        <th class="text-center border-right">ดู / แก้ไข</th>
                                        <th class="text-center border-right">วันที่สอบ</th>
                                        <th class="text-center border-right">จำนวนผู้เข้าสอบ</th>
                                        <th class="text-center border-right">ผู้สอบผ่าน</th>
                                        <th class="text-center border-right">ผู้สอบไม่ผ่าน</th>
                                        <th class="text-center">หมายเหตุ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="text-center text-body-2">
                                        <td class="border-right"><v-btn icon="fas fa-edit" size="x-small" variant="text"
                                                color="orange" @click="page = 'exam-form'" /></td>
                                        <td class="border-right">27/04/2023</td>
                                        <td class="border-right">3</td>
                                        <td class="border-right">3</td>
                                        <td class="border-right">0</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </v-table>
                            <div class="d-flex align-center mt-4"><span class="font-weight-bold mr-4">สรุปผลการสอบ
                                    :</span><v-select :items="['ผ่าน', 'ไม่ผ่าน']" variant="outlined" rounded="0"
                                    density="compact" hide-details style="max-width: 150px" model-value="ผ่าน" /></div>
                        </div>
                    </div>
                </template>

                <!-- Navigation Buttons -->
                <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                    <v-card-text class="pa-4 d-flex justify-space-between align-center">
                        <v-btn variant="tonal" color="grey" rounded="lg" @click="prevStepAction">{{ currentStep === 0 ?
                            'ยกเลิก'
                            : 'ย้อนกลับ' }}</v-btn>
                        <div class="d-flex ga-3">
                            <v-btn variant="tonal" color="el-staff" rounded="lg" prepend-icon="fas fa-floppy-disk"
                                @click="saveDraft">บันทึกแบบร่าง</v-btn>
                            <v-btn v-if="currentStep < steps.length - 1" color="el-staff" rounded="lg"
                                append-icon="fas fa-arrow-right" @click="currentStep++">ถัดไป</v-btn>
                            <v-btn v-else color="el-staff" rounded="lg" prepend-icon="fas fa-paper-plane"
                                @click="submitApplication">ยืนยันส่งคำขอ</v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- ─── PAGE: GMP FORM ─── -->
            <v-window-item value="gmp-form">
                <v-card elevation="0" class="border pa-8 bg-white mx-auto mb-10" max-width="1100">
                    <v-row dense class="mb-6">
                        <v-col cols="12" md="6">
                            <div class="d-flex align-center mb-1"><span class="label-fixed">ชื่อเกษตรกร
                                    :</span><v-text-field v-model="gmpForm.farmerName" variant="outlined" rounded="0"
                                    density="compact" hide-details readonly /></div>
                            <div class="d-flex align-center mb-1"><span class="label-fixed">ประเภทการตรวจ
                                    :</span><v-select :items="['ตรวจขึ้นทะเบียนใหม่']" variant="outlined" rounded="0"
                                    density="compact" hide-details /></div>
                            <div class="d-flex align-center mb-1"><span class="label-fixed">ชนิดพืช :</span><v-select
                                    :items="['มะระขี้นก']" variant="outlined" rounded="0" density="compact"
                                    hide-details /></div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="d-flex align-center mb-1"><span class="label-fixed">ครั้งที่
                                    :</span><v-text-field variant="outlined" rounded="0" density="compact"
                                    hide-details /></div>
                            <div class="d-flex align-start mb-1"><span class="label-fixed">อ้างอิงผลตรวจ GMP
                                    :</span><v-select :items="['GMP-20140424032']" variant="outlined" rounded="0"
                                    density="compact" hide-details bg-color="blue-lighten-5" /></div>
                        </v-col>
                    </v-row>
                    <v-table class="border checklist-table mb-6" density="compact">
                        <thead>
                            <tr class="bg-grey-lighten-4">
                                <th class="text-center border-right font-weight-bold" style="width: 50%">รายการลงตรวจ
                                </th>
                                <th class="text-center border-right font-weight-bold" style="width: 15%">คะแนน</th>
                                <th class="text-center font-weight-bold">ผลการประเมิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in gmpChecklist" :key="idx">
                                <td class="pa-3 border-right text-body-2">{{ idx + 1 }}. {{ item }}</td>
                                <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                        density="compact" hide-details bg-color="white" /></td>
                                <td class="text-center"><v-radio-group inline hide-details
                                        class="d-inline-flex"><v-radio label="ผ่าน" value="pass" color="success"
                                            class="mr-4" /><v-radio label="ไม่ผ่าน" value="fail"
                                            color="error" /></v-radio-group></td>
                            </tr>
                            <tr class="bg-grey-lighten-5 font-weight-bold">
                                <td class="text-center border-right">คะแนนรวม</td>
                                <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                        density="compact" hide-details bg-color="white" /></td>
                                <td class="text-center"><v-btn variant="text" color="error" size="small"
                                        class="text-none font-weight-bold" @click="passAllGmp">เพิ่มผ่านทั้งหมด</v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="pa-6 border bg-grey-lighten-5 mb-8">
                        <div class="d-flex align-center mb-4"><span class="font-weight-bold mr-6">ผลการประเมิน GMP
                                :</span><v-radio-group inline hide-details><v-radio label="ผ่าน" value="pass"
                                    color="success" class="mr-6" /><v-radio label="ไม่ผ่าน" value="fail"
                                    color="error" /></v-radio-group></div>
                        <div class="font-weight-bold mb-1 text-body-2">หมายเหตุ</div><v-textarea variant="outlined"
                            rounded="0" density="compact" rows="3" hide-details bg-color="white" />
                    </div>
                    <div class="d-flex justify-center ga-3"><v-btn variant="tonal" rounded="0" class="border px-8"
                            color="grey-lighten-3" @click="page = 'main'"><v-icon icon="fas fa-arrow-left" class="mr-2"
                                color="success" /> ย้อนกลับ</v-btn><v-btn variant="tonal" rounded="0"
                            class="border px-8" color="grey-lighten-3" @click="page = 'main'"><v-icon icon="fas fa-save"
                                class="mr-2" color="grey-darken-3" /> บันทึก</v-btn></div>
                </v-card>
            </v-window-item>

            <!-- ─── PAGE: HACCP FORM ─── -->
            <v-window-item value="haccp-form">
                <v-card elevation="0" class="border pa-8 bg-white mx-auto mb-10" max-width="1100">
                    <v-table class="border checklist-table mb-4" density="compact">
                        <thead>
                            <tr class="bg-grey-lighten-4">
                                <th class="text-center border-right font-weight-bold" style="width: 60%">รายการตรวจ</th>
                                <th class="text-center font-weight-bold" style="width: 40%">หมายเหตุ / หลักฐาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, idx) in haccpChecklistItems" :key="idx">
                                <td class="pa-3 border-right text-body-2 align-start">
                                    <div :class="item.isSub ? 'ml-6' : 'font-weight-bold'">{{ item.label }}</div>
                                </td>
                                <td class="pa-1"><v-textarea variant="outlined" rounded="0" density="compact"
                                        hide-details rows="2" auto-grow bg-color="white" /></td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="pa-4 border-top mt-6 d-flex align-center justify-space-between"><span
                            class="text-body-2 font-weight-bold">คะแนนเต็ม 51 คะแนน</span>
                        <div class="d-flex ga-4">
                            <div class="d-flex align-center"><span class="mr-2">คะแนนรวม :</span><v-text-field
                                    variant="outlined" rounded="0" density="compact" hide-details style="width: 80px" />
                            </div>
                            <div class="d-flex align-center"><span class="mr-2">คิดเป็นร้อยละ :</span><v-text-field
                                    variant="outlined" rounded="0" density="compact" hide-details style="width: 80px" />
                            </div>
                        </div>
                    </div>
                    <div class="pa-6 border mt-6 bg-grey-lighten-5"><v-radio-group inline hide-details
                            class="d-flex justify-center mb-4"><v-radio label="ผ่าน" value="pass" color="success"
                                class="mr-15 font-weight-bold" /><v-radio label="ไม่ผ่าน" value="fail" color="error"
                                class="font-weight-bold" /></v-radio-group>
                        <div class="font-weight-bold mb-1">หมายเหตุ</div><v-textarea variant="outlined" rounded="0"
                            density="compact" rows="3" hide-details bg-color="white" />
                    </div>
                    <div class="d-flex justify-center ga-3 mt-10"><v-btn variant="tonal" rounded="0" class="border px-8"
                            color="grey-lighten-3" @click="page = 'main'"><v-icon icon="fas fa-arrow-left" class="mr-2"
                                color="success" /> ย้อนกลับ</v-btn><v-btn variant="tonal" rounded="0"
                            class="border px-8" color="grey-lighten-3" @click="page = 'main'"><v-icon icon="fas fa-save"
                                class="mr-2" color="grey-darken-3" /> บันทึก</v-btn></div>
                </v-card>
            </v-window-item>

            <!-- ─── PAGE: ANALYSIS FORM ─── -->
            <v-window-item value="analysis-form">
                <v-card elevation="0" class="border pa-8 bg-white mx-auto mb-10" max-width="1100">
                    <h2 class="text-h6 font-weight-bold mb-6">ผลตรวจวิเคราะห์</h2>
                    <v-row dense class="mb-6"><v-col cols="12" md="6" class="d-flex align-center"><span
                                class="label-fixed">พืช
                                :</span><v-select :items="['ขึ้นฉ่าย', 'กะเพรา']" variant="outlined" rounded="0"
                                density="compact" hide-details /></v-col><v-col cols="12" md="6"
                            class="d-flex align-center"><span class="label-fixed"><span class="text-error">*</span>
                                วันที่ตรวจ :</span><v-text-field type="date" variant="outlined" rounded="0"
                                density="compact" hide-details /></v-col></v-row>
                    <div v-for="section in analysisInputSections" :key="section.title" class="mb-8">
                        <div class="d-flex align-center justify-space-between mb-2">
                            <h3 class="text-success font-weight-bold">{{ section.title }}</h3><v-btn color="error"
                                variant="flat" size="x-small" class="rounded-0"><v-icon icon="fas fa-times"
                                    class="mr-1" />ลบ</v-btn>
                        </div>
                        <v-table density="compact" class="border checklist-table">
                            <thead class="bg-grey-lighten-3">
                                <tr>
                                    <th style="width: 40px" class="border-right"><v-checkbox-btn density="compact"
                                            hide-details />
                                    </th>
                                    <th class="text-center border-right">{{ section.colName }}</th>
                                    <th class="text-center border-right">ผลตรวจ</th>
                                    <th class="text-center border-right">ผ่าน/ไม่ผ่าน</th>
                                    <th class="text-center border-right">หมายเหตุ</th>
                                    <th class="text-center" style="width: 80px">เพิ่ม/แก้ไข</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, idx) in analysisForm[section.key]" :key="idx">
                                    <td class="border-right text-center"><v-checkbox-btn density="compact"
                                            hide-details /></td>
                                    <td class="pa-1 border-right"><v-select placeholder="มี master data"
                                            variant="outlined" rounded="0" density="compact" hide-details /></td>
                                    <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                            density="compact" hide-details /></td>
                                    <td class="pa-1 border-right"><v-select :items="['ผ่าน', 'ไม่ผ่าน']"
                                            variant="outlined" rounded="0" density="compact" hide-details /></td>
                                    <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                            density="compact" hide-details /></td>
                                    <td class="text-center"><v-btn icon="fas fa-plus-circle" size="x-small"
                                            color="success" variant="text"
                                            @click="analysisForm[section.key].push({})" /></td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                    <div class="d-flex justify-center ga-3"><v-btn variant="tonal" rounded="0" class="border px-8"
                            color="grey-lighten-3" @click="page = 'main'"><v-icon icon="fas fa-arrow-left" class="mr-2"
                                color="success" /> ย้อนกลับ</v-btn><v-btn variant="tonal" rounded="0"
                            class="border px-8" color="grey-lighten-3" @click="page = 'main'"><v-icon icon="fas fa-save"
                                class="mr-2" color="grey-darken-3" /> บันทึก</v-btn></div>
                </v-card>
            </v-window-item>

            <!-- ─── PAGE: EXAM FORM ─── -->
            <v-window-item value="exam-form">
                <v-card elevation="0" class="border pa-8 bg-white mx-auto mb-10" max-width="1000">
                    <h2 class="text-h6 font-weight-bold mb-6">ผลสอบการวัดความรู้การจำแนกศัตรูพืชของพนักงาน</h2>

                    <!-- ส่วนหัวฟอร์ม: วันที่และจำนวนสถิติ -->
                    <v-row dense class="mb-4">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <span class="label-fixed">วันที่สอบ :</span>
                            <v-text-field type="date" variant="outlined" rounded="0" density="compact" hide-details />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <span class="label-fixed"><span class="text-error">*</span> จำนวนผู้สอบทั้งหมด :</span>
                            <v-text-field variant="outlined" rounded="0" density="compact" hide-details />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <span class="label-fixed"><span class="text-error">*</span> ผู้สอบผ่าน :</span>
                            <v-text-field variant="outlined" rounded="0" density="compact" hide-details />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <span class="label-fixed"><span class="text-error">*</span> ผู้สอบไม่ผ่าน :</span>
                            <v-text-field variant="outlined" rounded="0" density="compact" hide-details />
                        </v-col>
                    </v-row>

                    <h3 class="text-body-1 font-weight-bold mb-2">รายชื่อผู้สอบ</h3>

                    <!-- ตารางรายชื่อผู้สอบ -->
                    <v-table density="compact" class="border custom-analysis-table mb-4">
                        <thead class="bg-grey-lighten-3">
                            <tr>
                                <th style="width: 40px" class="border-right"><v-checkbox-btn density="compact"
                                        hide-details /></th>
                                <th class="text-center border-right">คำนำหน้า</th>
                                <th class="text-center border-right">ชื่อ</th>
                                <th class="text-center border-right">นามสกุล</th>
                                <th class="text-center border-right">ผลสอบ</th>
                                <th class="text-center border-right">หมายเหตุ</th>
                                <th class="text-center" style="width: 80px">เพิ่ม/แก้ไข</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(row, idx) in examForm.students" :key="idx">
                                <td class="border-right text-center"><v-checkbox-btn density="compact" hide-details />
                                </td>
                                <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                        density="compact" hide-details /></td>
                                <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                        density="compact" hide-details /></td>
                                <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                        density="compact" hide-details /></td>
                                <td class="pa-1 border-right">
                                    <v-select :items="['ผ่าน', 'ไม่ผ่าน']" placeholder="ผ่าน/ไม่ผ่าน" variant="outlined"
                                        rounded="0" density="compact" hide-details />
                                </td>
                                <td class="pa-1 border-right"><v-text-field variant="outlined" rounded="0"
                                        density="compact" hide-details /></td>
                                <td class="text-center">
                                    <v-btn icon="fas fa-plus-circle" size="x-small" color="success" variant="text"
                                        @click="examForm.students.push({})" />
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- หมายเหตุรวม -->
                    <div class="d-flex mb-6">
                        <span class="label-fixed pt-2">หมายเหตุ :</span>
                        <v-textarea variant="outlined" rounded="0" density="compact" rows="3" hide-details
                            class="flex-grow-1" />
                    </div>

                    <!-- ส่วนบันทึกข้อมูลเจ้าหน้าที่ -->
                    <v-row dense class="bg-grey-lighten-5 pa-4 border mb-8">
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <span class="label-fixed">ผู้สร้างข้อมูล :</span>
                            <v-select variant="outlined" rounded="0" density="compact" hide-details bg-color="white" />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <span class="label-fixed">วันที่สร้างข้อมูล :</span>
                            <v-text-field variant="outlined" rounded="0" density="compact" hide-details
                                bg-color="white" />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center mt-2">
                            <span class="label-fixed">ผู้แก้ไขข้อมูล :</span>
                            <v-select variant="outlined" rounded="0" density="compact" hide-details bg-color="white" />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center mt-2">
                            <span class="label-fixed">วันที่แก้ไขข้อมูล :</span>
                            <v-text-field variant="outlined" rounded="0" density="compact" hide-details
                                bg-color="white" />
                        </v-col>
                    </v-row>

                    <!-- ปุ่ม Action -->
                    <div class="d-flex justify-center ga-3">
                        <v-btn variant="tonal" rounded="0" class="border px-8" color="grey-lighten-3">
                            <v-icon icon="fas fa-save" class="mr-2" color="grey-darken-3" />บันทึก
                        </v-btn>
                        <v-btn variant="tonal" rounded="0" class="border px-8" color="grey-lighten-3"
                            @click="page = 'main'">
                            <v-icon icon="fas fa-arrow-left" class="mr-2" color="success" />ย้อนกลับ
                        </v-btn>
                    </div>
                </v-card>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const page = ref('main');
const currentStep = ref(0);
const isStep2Saved = ref(false); // ควบคุมการเปลี่ยน Content ใน Tab GMP
const activeStep2Tab = ref('GMP/HACCP');

const steps = [{ value: 0, title: "ข้อมูลคำขอ" }, { value: 1, title: "ผลตรวจประเมิน" }];
const step2Tabs = ['GMP/HACCP', 'ผลตรวจวิเคราะห์', 'ผลสอบ'];

const docNumber = computed(() => {
    if (page.value === 'gmp-form') return 'GMP-20140502008';
    if (page.value === 'haccp-form') return 'HACCP-20140502001';
    return '-';
});

const establishmentInfo = reactive({ appCode: 'EL-2569-00003', name: 'บริษัท ฟลอร่า แคปปิทอล จำกัด' });
const gmpForm = reactive({ farmerName: 'นาง จันทร์จิรา เครือพลับ' });
const gmpChecklist = ['สถานประกอบการ', 'เครื่องมือเครื่องจักรและอุปกรณ์การผลิต', 'การควบคุมกระบวนการผลิต', 'การบำรุงรักษาและการสุขาภิบาล', 'บุคลากรและการสุขาภิบาล', 'การเก็บรักษาการขนส่ง', 'การจัดทำบันทึก'];
const gmpData = reactive({ scores: {}, results: {}, overall: 'pass' });

const analysisDashboardSections = [
    { title: 'ผลตรวจเชื้อจุลินทรีย์', colName: 'เชื้อ', data: [{ date: '27/04/2023', crop: 'กะเพรา', inspector: 'น.ส.วรัญญา ปานเกตุ', item: 'Salmonella', result: 'Not detected', status: 'ผ่าน' }] },
    { title: 'ผลตรวจสารตกค้าง', colName: 'สาร', data: [{ date: '27/04/2023', crop: 'กะเพรา', inspector: 'น.ส.วรัญญา ปานเกตุ', item: 'สารทั้งหมด', result: 'Not detected', status: 'ผ่าน' }] },
    { title: 'ผลตรวจแมลง', colName: 'แมลง', data: [{ date: '27/04/2023', crop: 'กะเพรา', inspector: 'น.ส.วรัญญา ปานเกตุ', item: 'แมลงทั้งหมด', result: 'ไม่พบ', status: 'ผ่าน' }] }
];

const analysisForm = reactive({ microbe: [{}], chemical: [{}], insect: [{}] });
const analysisInputSections = [{ title: 'ผลตรวจเชื้อจุลินทรีย์', colName: 'เชื้อ', key: 'microbe' }, { title: 'ผลตรวจสารตกค้าง', colName: 'สาร', key: 'chemical' }, { title: 'ผลตรวจแมลง', colName: 'แมลง', key: 'insect' }];
const examForm = reactive({ students: [{}] });

const haccpChecklistItems = [
    { label: '9.1 มีการกำหนดการตรวจเฝ้าระวังที่รวดเร็ว เหมาะสม ครบทุก CCP', isSub: false },
    { label: '10. กำหนดการปฏิบัติการแก้ไข (หลักการที่ 5)', isSub: false },
    { label: '10.1 มีการกำหนดการแก้ไขในแต่ละ CCP', isSub: true },
    { label: '11. กำหนดวิธีการทวนสอบ (หลักการที่ 6)', isSub: false },
    { label: '12. การกำหนดวิธีการจัดทำเอกสารและการจัดเก็บบันทึกข้อมูล (หลักการที่ 7)', isSub: false },
];

const refGmpList = ['GMP-20140502002', 'GMP-20140502008', 'GMP-20140424032'];

function handleStep2Save() { isStep2Saved.value = true; }
function passAllGmp() { gmpChecklist.forEach((_, i) => gmpData.results[i] = 'pass'); }
function stepClass(v) { return currentStep.value >= v ? "step-active" : "step-pending"; }
function prevStepAction() { if (currentStep.value > 0) currentStep.value--; }
function saveDraft() { alert("บันทึกแบบร่างสำเร็จ"); }

// ─── INITIAL STATES (ค่าเริ่มต้น) ───

const editType = ref('');
const successDialog = ref(false);
const draftSnackbar = ref(false);
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
        { selected: false, name: 'มกราคม - มีนาคม', period: '90 วัน' },
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

const factories = ref([{ id: 1, cropName: "ทุเรียน", gmpNo: "GMP-999", status: "ปกติ" }]);

// Headers
const factoryHeadersDetail = [
    { title: 'ดูข้อมูล', key: 'view', align: 'center', width: '80px', sortable: false },
    { title: 'ชนิดพืช', key: 'cropName', align: 'start' },
    { title: 'สถานะ', key: 'status', align: 'center' },
];

const resultHeadersDetail = [
    { title: 'ดูข้อมูล', key: 'view', align: 'center', width: '80px', sortable: false },
    { title: 'ชนิดพืช', key: 'cropName', align: 'start' },
    { title: 'ชื่อเกษตรกร', key: 'farmerName', align: 'start', width: '200px' },
    { title: 'รหัสใบรับรอง', key: 'certNo', align: 'start' },
    { title: 'รหัสแปลง', key: 'farmCode', align: 'center' },
    { title: 'ผลตรวจเอกสาร', key: 'docResult', align: 'center' },
    { title: 'สถานะ', key: 'status', align: 'center' },
];

const resultItems = ref([
    { cropName: 'ผักชีไทย', farmerName: 'พลอย จินดามณี', certNo: 'กษ-1484', farmCode: 'F-001', docResult: 'รอตรวจ', status: 'รอตรวจเอกสาร' }
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


function submitApplication() {
    successDialog.value = true;
}

function viewResultDetail(item) {
    alert("ดูรายละเอียดผลการพิจารณา: " + item.cropName);
}
</script>

<style scoped>
.page-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.section-card {
    border: 1px solid #e0e0e0;
}

.step-active {
    background: rgb(var(--v-theme-el-staff)) !important;
    color: white !important;
}

.step-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0e0e0;
}

.step-line {
    height: 2px;
    background: #e0e0e0;
    margin: 0 10px;
    margin-top: 12px;
}

.step-line--done {
    background: rgb(var(--v-theme-el-staff)) !important;
}

.custom-tab-item {
    cursor: pointer;
    font-size: 14px;
    border-color: #ccc !important;
    border-radius: 4px 4px 0 0;
    margin-right: 2px;
}

.active-tab {
    border-bottom: 2px solid white !important;
    margin-bottom: -1px;
    font-weight: bold;
}

.red-bar {
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 15px;
    background-color: #ff5252;
}

.custom-ghp-table :deep(th),
.checklist-table :deep(th),
.custom-step2-table :deep(th) {
    font-size: 12px;
    font-weight: bold !important;
    height: 40px !important;
    color: #333 !important;
    border-right: 1px solid #e0e0e0;
}

.custom-ghp-table :deep(td),
.checklist-table :deep(td),
.custom-step2-table :deep(td) {
    height: 40px !important;
    font-size: 13px;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0 !important;
}

.label-fixed {
    width: 180px;
    font-size: 14px;
    font-weight: bold;
    text-align: right;
    margin-right: 12px;
}

:deep(.v-field--variant-outlined) {
    border-radius: 0 !important;
    background-color: white;
}

.text-error {
    color: #d32f2f !important;
}

.italic {
    font-style: italic;
}
</style>