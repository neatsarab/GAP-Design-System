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
                                    <v-btn icon="fas fa-file-lines" variant="text" color="el-staff" size="small" />
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
                            <v-data-table :headers="resultHeadersDetailGap" :items="resultItemsGap"
                                density="comfortable" class="border rounded-lg custom-result-table" hide-default-footer>
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
                            <v-data-table :headers="resultHeadersDetailReview" :items="resultItemsDetail"
                                density="compact" class="border rounded-lg result-table">
                                <template v-slot:item.view="{ item }">
                                    <v-btn icon="fas fa-pen-to-square" variant="text" color="el-staff" size="small"
                                        @click="goToCreatePage('farmer')" />
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
                    <v-card-text class="pa-5">
                        <!-- 1. ข้อมูลโรงคัดบรรจุ -->
                        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                            <v-row dense class="pa-5">
                                <v-col cols="12" md="6">
                                    <div class="align-center mb-2">
                                        <div class="field-label-fixed">ประเภท</div>
                                        <v-select v-model="appInfo.type" :items="['ตรวจขึ้นทะเบียนใหม่']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </div>
                                    <div class="align-center">
                                        <div class="field-label-fixed">ชนิดพืช</div>
                                        <v-select v-model="appInfo.crop" :items="['พริกขี้หนู']" variant="outlined"
                                            rounded="lg" density="compact" hide-details />
                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="align-center mb-2">
                                        <div class="field-label-fixed">สถานะ</div>
                                        <v-select v-model="appInfo.status" :items="['ปิดงาน']" variant="outlined"
                                            rounded="lg" density="compact" hide-details />
                                    </div>
                                    <div class="align-center">
                                        <div class="field-label-fixed">รหัสคำขอ</div>
                                        <v-text-field v-model="appInfo.appCode" variant="outlined" rounded="lg"
                                            density="compact" hide-details />
                                    </div>
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
                                        <v-text-field v-model="establishmentInfo.certCode" variant="outlined"
                                            rounded="lg" density="comfortable" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <div class="field-label mb-1">วันที่ออก</div>
                                        <v-text-field v-model="establishmentInfo.issueDate" type="date"
                                            variant="outlined" rounded="lg" density="comfortable" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <div class="field-label mb-1">วันที่หมดอายุ</div>
                                        <v-text-field v-model="establishmentInfo.expireDate" type="date"
                                            variant="outlined" rounded="lg" density="comfortable" hide-details />
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
                                        <v-text-field v-model="establishmentInfo.address" variant="outlined"
                                            rounded="lg" density="comfortable" hide-details />
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
                                        <v-text-field v-model="establishmentInfo.zipcode" variant="outlined"
                                            rounded="lg" density="comfortable" hide-details />
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
                                        <v-text-field v-model="establishmentInfo.approveDate" type="date"
                                            variant="outlined" rounded="lg" density="comfortable" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">สถานะ</div>
                                        <v-text-field v-model="establishmentInfo.status" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                        <!-- 2. ข้อมูลแปลงเกษตร -->
                        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                            <v-card-title class="pa-5 pb-0 section-title font-weight-bold">2.
                                ข้อมูลแปลงเกษตร</v-card-title>
                            <v-card-text class="pa-5">
                                <v-col cols="12" class="mt-n5">
                                    <v-card variant="outlined" class="pa-6 rounded-xl">
                                        <v-row dense>
                                            <v-col cols="12" md="6">
                                                <div class="align-center mb-2">
                                                    <div class="field-label mb-1">ชื่อเกษตรกร</div>
                                                    <v-select v-model="tempData.farmerName"
                                                        :items="['นาง จันทร์จิรา เครือพลับ']" variant="outlined"
                                                        rounded="lg" density="compact" hide-details bg-color="white"
                                                        readonly />
                                                </div>
                                                <div class="align-center mb-2">
                                                    <div class="field-label mb-1">ชนิดพืช</div>
                                                    <v-select v-model="tempData.cropName" :items="['ถั่วฝักยาว']"
                                                        variant="outlined" rounded="lg" density="compact" hide-details
                                                        bg-color="white" readonly />
                                                </div>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="align-center mb-2">
                                                    <div class="field-label mb-1">ประเภทการรับรอง</div>
                                                    <v-select v-model="tempData.certType" :items="['GAP']"
                                                        variant="outlined" rounded="lg" density="compact" hide-details
                                                        bg-color="white" readonly />
                                                </div>
                                                <div class="align-center mb-2">
                                                    <div class="field-label mb-1">รหัสใบรับรอง</div>
                                                    <v-text-field v-model="tempData.certNo" variant="outlined"
                                                        rounded="lg" density="compact" hide-details bg-color="white"
                                                        readonly />
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" class="mt-n5">
                                    <div class="field-label mb-1 font-weight-bold text-el-staff">แผนการเพาะปลูก</div>
                                    <v-divider class="mb-4" />
                                    <v-table density="comfortable" class="border rounded-lg planting-table mb-8">
                                        <thead>
                                            <tr class="bg-grey-lighten-3">
                                                <th class="text-center border-right font-weight-bold">แผนการเพาะปลูก
                                                </th>
                                                <th class="text-center border-right font-weight-bold">ระยะเวลาเก็บเกี่ยว
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(plan, index) in tempData.plantingPlans" :key="index"
                                                class="text-center">

                                                <td class="pa-2 border-right">
                                                    {{ plan.name }}
                                                </td>
                                                <td class="pa-2 border-right">
                                                    {{ plan.period }}
                                                </td>

                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>

                                <v-col cols="12" class="mt-n5">
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ขนาดพื้นที่ปลูก (ไร่) </div>
                                            <v-text-field v-model="tempData.areaSize" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ผลผลิต/พื้นที่(กก./ไร่) </div>
                                            <v-text-field v-model="tempData.yieldPerArea" variant="outlined"
                                                rounded="lg" density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ผลผลิต/รอบการผลิต(กก./รอบ) </div>
                                            <v-text-field v-model="tempData.yieldPerCycle" variant="outlined"
                                                rounded="lg" density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">หมายเหตุ </div>
                                            <v-text-field v-model="tempData.remark" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12">
                                            <div class="field-label mb-1">รหัสแปลง (ของกรมวิชาการเกษตร)</div>
                                            <div class="d-flex align-center">
                                                <v-text-field v-model="tempData.farmCode" variant="outlined"
                                                    rounded="lg" density="comfortable" readonly hide-details />
                                            </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <div class="field-label mb-1">ที่ตั้งแปลง </div>
                                            <v-text-field v-model="tempData.location" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">จังหวัด </div>
                                            <v-select v-model="tempData.province" :items="['กรุงเทพมหานคร']"
                                                variant="outlined" rounded="lg" density="comfortable" readonly
                                                hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">พิกัด X </div>
                                            <v-text-field v-model="tempData.coordX" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">อำเภอ/เขต :</div>
                                            <v-select v-model="tempData.district" :items="['ลาดพร้าว']"
                                                variant="outlined" rounded="lg" density="comfortable" readonly
                                                hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">พิกัด Y </div>
                                            <v-text-field v-model="tempData.coordZ" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ตำบล/แขวง </div>
                                            <v-select v-model="tempData.subdistrict" :items="['ลาดพร้าว']"
                                                variant="outlined" rounded="lg" density="comfortable" readonly
                                                hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">พิกัด Z :</div>
                                            <v-text-field v-model="tempData.coordY" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-card-text>
                        </v-card>

                        <!-- 4. ข้อมูลแปลงเกษตรที่ขอใบรับรอง GAP-->
                        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                            <v-card-title class="pa-5 pb-0 section-title font-weight-bold">3. ผลการตรวจ</v-card-title>
                            <v-card-text class="pa-5">
                                <v-row dense align="center" class="mb-4">
                                    <v-col cols="12" md="3" class="text-md-right pr-4">ผลการตรวจโรงคัดบรรจุ :</v-col>
                                    <v-col cols="12" md="3">
                                        <v-select v-model="evalData.factoryResult" :items="['ผ่าน', 'ไม่ผ่าน']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6" class="d-flex ga-2">
                                        <v-btn color="grey-lighten-3" variant="flat" rounded="lg"
                                            prepend-icon="fas fa-search" @click="page = 'view-doa'">รายละเอียด</v-btn>
                                        <v-btn color="grey-lighten-3" variant="flat" rounded="lg">ผลตรวจเอกสาร</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="3" class="text-md-right pr-4 mt-2">หมายเหตุ :</v-col>
                                    <v-col cols="12" md="9" class="mt-2">
                                        <v-textarea v-model="evalData.factoryRemark" variant="outlined" rounded="lg"
                                            density="compact" rows="2" hide-details />
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4" />

                                <v-row dense align="center">
                                    <v-col cols="12" md="3" class="text-md-right pr-4">ผลการตรวจแปลงเกษตรกร :</v-col>
                                    <v-col cols="12" md="3">
                                        <v-select v-model="evalData.farmResult" :items="['ผ่าน', 'ไม่ผ่าน']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6" class="d-flex ga-2">
                                        <v-btn color="grey-lighten-3" variant="flat" rounded="lg"
                                            prepend-icon="fas fa-search" @click="page = 'view-gap'">รายละเอียด</v-btn>
                                        <v-btn color="grey-lighten-3" variant="flat" rounded="lg">ผลตรวจเอกสาร</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="3" class="text-md-right pr-4 mt-2">หมายเหตุ :</v-col>
                                    <v-col cols="12" md="9" class="mt-2">
                                        <v-textarea v-model="evalData.farmRemark" variant="outlined" rounded="lg"
                                            density="compact" rows="2" hide-details />
                                    </v-col>
                                </v-row>
                            </v-card-text>

                        </v-card>

                        <!-- 5. ข้อมูลใบรับรอง GMP -->
                        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                            <v-card-title class="pa-5 pb-0 section-title font-weight-bold">4.ผลการพิจารณาโดยคณะกรรมการ
                                EL</v-card-title>
                            <v-card-text class="pa-5">
                                <!-- แถวที่ 1: ผลการพิจารณา -->
                                <v-row dense align="center" class="mb-4">
                                    <v-col cols="12" md="3" class="text-md-right pr-4 font-weight-bold">
                                        ผลการพิจารณา :
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-select v-model="tempData.committeeResult"
                                            :items="['เห็นชอบ', 'ไม่เห็นชอบ', 'ขอข้อมูลเพิ่มเติม']" variant="outlined"
                                            rounded="lg" density="compact" hide-details
                                            placeholder="เลือกผลการพิจารณา" />
                                    </v-col>
                                </v-row>

                                <!-- แถวที่ 2: หมายเหตุ -->
                                <v-row dense align="start" class="mb-4">
                                    <v-col cols="12" md="3" class="text-md-right pr-4 font-weight-bold pt-2">
                                        หมายเหตุ :
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <v-textarea v-model="tempData.committeeRemark" variant="outlined" rounded="lg"
                                            density="compact" rows="3" hide-details
                                            placeholder="ระบุรายละเอียดหรือหมายเหตุประกอบการพิจารณา" />
                                    </v-col>
                                </v-row>

                                <!-- แถวที่ 3: ข้อมูลเพิ่มเติม / แนบไฟล์ -->
                                <v-row dense align="center" class="mb-4">
                                    <v-col cols="12" md="3" class="text-md-right pr-4 font-weight-bold">
                                        ข้อมูลเพิ่มเติม :
                                    </v-col>
                                    <v-col cols="12" md="5">
                                        <v-file-input v-model="tempData.committeeFiles" variant="outlined" rounded="lg"
                                            density="compact" hide-details prepend-icon=""
                                            append-inner-icon="fas fa-paperclip" label="แนบเอกสารเพิ่มเติม (ถ้ามี)"
                                            multiple />
                                    </v-col>
                                </v-row>

                                <!-- แถวที่ 4: ผู้บันทึกผล และ วันที่บันทึก -->
                                <v-row dense align="center">
                                    <v-col cols="12" md="3" class="text-md-right pr-4 font-weight-bold">
                                        ผู้บันทึกผล :
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field v-model="tempData.committeeRecorder" variant="outlined"
                                            rounded="lg" density="compact" hide-details readonly
                                            bg-color="grey-lighten-4" />
                                    </v-col>

                                    <v-col cols="12" md="2" class="text-md-right pr-4 font-weight-bold">
                                        วันที่บันทึกผล :
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <v-text-field v-model="tempData.committeeRecordDate" type="date"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                </v-row>
                            </v-card-text>

                        </v-card>
                    </v-card-text>
                    <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                        <v-card-text class="pa-4 d-flex justify-end ga-3">
                            <v-btn variant="tonal" color="grey" rounded="lg" @click="page = 'main'">ยกเลิก</v-btn>
                            <v-btn color="el-staff" rounded="lg" prepend-icon="fas fa-save"
                                @click="saveData">บันทึกข้อมูล</v-btn>
                        </v-card-text>
                    </v-card>
                </v-card>
            </v-window-item>

            <!-- PAGE: VIEW DOA (ฝั่งโรงคัดบรรจุ) -->
            <v-window-item value="view-doa">
                <v-card rounded="xl" elevation="0" class="border pa-6">
                    <v-row dense>
                        <!-- ส่วนข้อมูลเกษตรกร (Read Only) -->
                        <v-col cols="12">
                            <v-card variant="outlined" class="pa-6 rounded-xl mb-6">
                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <div class="mb-2">
                                            <div class="field-label mb-1">ประเภท</div>
                                            <v-select v-model="tempData.appType" :items="['ตรวจขึ้นทะเบียนใหม่']"
                                                variant="outlined" rounded="lg" density="compact" hide-details
                                                bg-color="white" readonly />
                                        </div>
                                        <div class="mb-2">
                                            <div class="field-label mb-1">จำนวนครั้งที่ตรวจ</div>
                                            <v-text-field v-model="tempData.checkCount" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="mb-2">
                                            <div class="field-label mb-1">สถานะ</div>
                                            <v-select v-model="tempData.status" :items="['รอตรวจ']" variant="outlined"
                                                rounded="lg" density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                        <div class="mb-2">
                                            <div class="field-label mb-1">ชนิดพืช</div>
                                            <v-text-field v-model="tempData.cropName" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-card-title class="pa-5 pb-0 section-title font-weight-bold ml-n5 mb-5">1.
                                    ข้อมูลโรงคัดบรรจุ</v-card-title>

                                <v-row dense>
                                    <!-- รหัสรับรอง / วันที่ออก / วันหมดอายุ -->
                                    <v-col cols="12" md="4">
                                        <div class="field-label mb-1">รหัสรับรองโรงคัดบรรจุ</div>
                                        <v-text-field v-model="establishmentInfo.certCode" variant="outlined"
                                            rounded="lg" density="comfortable" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <div class="field-label mb-1">วันที่ออก</div>
                                        <v-text-field v-model="establishmentInfo.issueDate" type="date"
                                            variant="outlined" rounded="lg" density="comfortable" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <div class="field-label mb-1">วันที่หมดอายุ</div>
                                        <v-text-field v-model="establishmentInfo.expireDate" type="date"
                                            variant="outlined" rounded="lg" density="comfortable" hide-details />
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
                                        <v-text-field v-model="establishmentInfo.address" variant="outlined"
                                            rounded="lg" density="comfortable" hide-details />
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
                                        <v-text-field v-model="establishmentInfo.zipcode" variant="outlined"
                                            rounded="lg" density="comfortable" hide-details />
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
                                        <v-text-field v-model="establishmentInfo.approveDate" type="date"
                                            variant="outlined" rounded="lg" density="comfortable" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">สถานะ</div>
                                        <v-text-field v-model="establishmentInfo.status" variant="outlined" rounded="lg"
                                            density="comfortable" readonly hide-details />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">วันที่สร้างข้อมูล</div>
                                        <v-select v-model="tempData.createDate" :items="[tempData.createDate]"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">ผู้แก้ไขข้อมูล</div>
                                        <v-select v-model="tempData.editor" :items="[tempData.editor]"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">วันที่แก้ไขข้อมูล</div>
                                        <v-select v-model="tempData.editDate" :items="[tempData.editDate]"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">สวพ. เขต</div>
                                        <v-select v-model="tempData.swpArea" :items="[tempData.swpArea]"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">ศวพ. จังหวัด</div>
                                        <v-select v-model="tempData.swpProvince" :items="[tempData.swpProvince]"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1 mt-2">ผู้ตรวจล่าสุด</div>
                                        <v-select v-model="tempData.lastChecker" :items="[tempData.lastChecker]"
                                            variant="outlined" rounded="lg" density="comfortable" readonly
                                            hide-details />
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>

                        <!-- แผนการเพาะปลูก -->
                        <!-- <v-col cols="12" class="mt-n5">
                                    <div class="field-label mb-1 font-weight-bold text-success">แผนการเพาะปลูก</div>
                                    <v-divider class="mb-4" />
                                    <v-table density="comfortable" class="border rounded-lg planting-table mb-8">
                                        <thead>
                                            <tr class="bg-grey-lighten-3">
                                                <th class="text-center border-right" style="width: 50px;">
                                                    <v-checkbox density="compact" hide-details
                                                        @update:model-value="toggleAllPlanting" />
                                                </th>
                                                <th class="text-center border-right font-weight-bold">แผนการเพาะปลูก
                                                </th>
                                                <th class="text-center border-right font-weight-bold">ระยะเวลาเก็บเกี่ยว
                                                </th>
                                                <th class="text-center font-weight-bold" style="width: 80px;">เพิ่ม</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(plan, index) in tempData.plantingPlans" :key="index">
                                                <td class="text-center border-right">
                                                    <v-checkbox v-model="plan.selected" density="compact"
                                                        hide-details />
                                                </td>
                                                <td class="pa-2 border-right">
                                                    <v-text-field v-model="plan.name" variant="outlined" rounded="lg"
                                                        density="compact" hide-details />
                                                </td>
                                                <td class="pa-2 border-right">
                                                    <v-text-field v-model="plan.period" variant="outlined" rounded="lg"
                                                        density="compact" hide-details />
                                                </td>
                                                <td class="text-center">
                                                    <v-btn v-if="index === tempData.plantingPlans.length - 1"
                                                        icon="fas fa-plus-circle" color="success" variant="text"
                                                        @click="addPlantingRow" />
                                                    <v-btn v-else icon="fas fa-minus-circle" color="error"
                                                        variant="text"
                                                        @click="tempData.plantingPlans.splice(index, 1)" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col> -->

                        <!-- รายละเอียดที่ตั้ง (Read Only) -->
                        <!-- <v-col cols="12">
                                    <v-row dense>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ขนาดพื้นที่ปลูก (ไร่)</div>
                                            <v-text-field v-model="tempData.areaSize" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ผลผลิต/พื้นที่(กก./ไร่)</div>
                                            <v-text-field v-model="tempData.yieldPerArea" variant="outlined"
                                                rounded="lg" density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">ผลผลิต/รอบการผลิต(กก./รอบ)</div>
                                            <v-text-field v-model="tempData.yieldPerCycle" variant="outlined"
                                                rounded="lg" density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                            <div class="field-label mb-1">หมายเหตุ</div>
                                            <v-text-field v-model="tempData.remark" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12">
                                            <div class="field-label mb-1">รหัสแปลง (กรมวิชาการเกษตร)</div>
                                            <v-text-field v-model="tempData.farmCode" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12">
                                            <div class="field-label mb-1">ที่ตั้งแปลง</div>
                                            <v-text-field v-model="tempData.location" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label mb-1">จังหวัด</div><v-text-field
                                                v-model="tempData.province" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label mb-1">อำเภอ/เขต</div><v-text-field
                                                v-model="tempData.district" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label mb-1">ตำบล/แขวง</div><v-text-field
                                                v-model="tempData.subdistrict" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label mb-1">พิกัด X</div><v-text-field
                                                v-model="tempData.coordX" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label mb-1">พิกัด Y</div><v-text-field
                                                v-model="tempData.coordY" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label mb-1">พิกัด Z</div><v-text-field
                                                v-model="tempData.coordZ" variant="outlined" rounded="lg"
                                                density="comfortable" readonly hide-details />
                                        </v-col>
                                    </v-row>
                                </v-col> -->



                        <!-- ตารางประวัติ CL-02 -->
                        <v-col cols="12">
                            <v-card rounded="lg" elevation="0" class="mb-5 border overflow-hidden">
                                <!-- ส่วนหัว Tab Navigation -->
                                <v-tabs v-model="activeStep2Tab" bg-color="grey-lighten-4" color="el-staff"
                                    align-tabs="start">
                                    <v-tab value="GMP/HACCP">GMP/HACCP</v-tab>
                                    <v-tab value="ผลตรวจวิเคราะห์">ผลตรวจวิเคราะห์</v-tab>
                                    <v-tab value="ผลสอบ">ผลสอบ</v-tab>
                                </v-tabs>

                                <v-divider></v-divider>

                                <!-- ส่วนเนื้อหาภายใน Tab -->
                                <v-window v-model="activeStep2Tab">
                                    <!-- TAB 1: GMP/HACCP -->
                                    <v-window-item value="GMP/HACCP">
                                        <v-container fluid class="pa-4">
                                            <v-row dense>
                                                <v-col cols="12">
                                                    <h3 class="text-success font-weight-bold mb-3 ml-1 text-body-1">
                                                        GMP</h3>
                                                    <v-table density="compact" class="border custom-summary-table mb-6">
                                                        <thead class="bg-grey-lighten-3">
                                                            <tr>
                                                                <th class="text-center border-right"
                                                                    style="width: 80px">ดู /
                                                                    แก้ไข</th>
                                                                <th class="text-center border-right">
                                                                    ครั้งที่ตรวจ</th>
                                                                <th class="text-center border-right">กำหนดตรวจ
                                                                </th>
                                                                <th class="text-center border-right">วันที่ตรวจ
                                                                </th>
                                                                <th class="text-center border-right">ผู้ตรวจ
                                                                </th>
                                                                <th class="text-center border-right">ผลการตรวจ
                                                                </th>
                                                                <th class="text-center">หมายเหตุ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-if="cl02History.length === 0">
                                                                <td colspan="7"
                                                                    class="text-center pa-4 italic text-grey">
                                                                    ไม่มีข้อมูล</td>
                                                            </tr>
                                                            <tr v-for="item in cl02History" :key="item.id">
                                                                <td class="text-center border-right">
                                                                    <v-btn icon="fas fa-edit" size="x-small"
                                                                        variant="text" color="primary"
                                                                        @click="page = 'cl02-form'" />
                                                                </td>
                                                                <td class="text-center border-right">{{
                                                                    item.count }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.schedule }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.date }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.inspector }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.result }}</td>
                                                                <td class="pa-2 text-body-2">{{ item.remark }}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </v-table>

                                                    <h3 class="text-success font-weight-bold mb-3 ml-1 text-body-1">
                                                        HACCP</h3>
                                                    <v-table density="compact" class="border custom-summary-table mb-6">
                                                        <thead class="bg-grey-lighten-3">
                                                            <tr>
                                                                <th class="text-center border-right"
                                                                    style="width: 80px">ดู /
                                                                    แก้ไข</th>
                                                                <th class="text-center border-right">
                                                                    ครั้งที่ตรวจ</th>
                                                                <th class="text-center border-right">กำหนดตรวจ
                                                                </th>
                                                                <th class="text-center border-right">วันที่ตรวจ
                                                                </th>
                                                                <th class="text-center border-right">ผู้ตรวจ
                                                                </th>
                                                                <th class="text-center border-right">ผลการตรวจ
                                                                </th>
                                                                <th class="text-center">หมายเหตุ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-if="cl02History.length === 0">
                                                                <td colspan="7"
                                                                    class="text-center pa-4 italic text-grey">
                                                                    ไม่มีข้อมูล</td>
                                                            </tr>
                                                            <tr v-for="item in cl02History" :key="item.id">
                                                                <td class="text-center border-right">
                                                                    <v-btn icon="fas fa-edit" size="x-small"
                                                                        variant="text" color="primary"
                                                                        @click="page = 'cl02-form'" />
                                                                </td>
                                                                <td class="text-center border-right">{{
                                                                    item.count }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.schedule }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.date }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.inspector }}</td>
                                                                <td class="text-center border-right">{{
                                                                    item.result }}</td>
                                                                <td class="pa-2 text-body-2">{{ item.remark }}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </v-table>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-window-item>

                                    <!-- TAB 2: ผลตรวจวิเคราะห์ -->
                                    <v-window-item value="ผลตรวจวิเคราะห์">
                                        <v-container fluid class="pa-4">
                                            <p class="text-center text-grey pa-10">เนื้อหาผลตรวจวิเคราะห์</p>
                                        </v-container>
                                    </v-window-item>

                                    <!-- TAB 3: ผลสอบ -->
                                    <v-window-item value="ผลสอบ">
                                        <v-container fluid class="pa-4">
                                            <p class="text-center text-grey pa-10">เนื้อหาผลสอบการวัดความรู้</p>
                                        </v-container>
                                    </v-window-item>
                                </v-window>
                            </v-card>
                        </v-col>

                        <!-- ผลการพิจารณาโดย สวพ.เขต -->
                        <v-col cols="12">
                            <v-card rounded="lg" elevation="0" class="pa-6 border mb-8 mt-4">
                                <v-row dense>
                                    <v-col cols="12" md="2"
                                        class="text-md-right pt-2 font-weight-bold">ผลการพิจารณาจากคณะกรรมการกลั่นกรอง
                                        :</v-col>
                                    <v-col cols="12" md="4">
                                        <v-select v-model="tempData.zoneResult" :items="['ผ่าน', 'ไม่ผ่าน', 'ปรับปรุง']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6" />

                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold mt-2">เอกสารอื่น
                                        ๆ
                                        :</v-col>
                                    <v-col cols="12" md="4" class="pt-2 text-medium-emphasis">
                                        <v-file-input variant="outlined" rounded="lg" density="compact" hide-details
                                            append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                    </v-col>
                                    <v-col cols="12" md="6" />

                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold mt-2">หมายเหตุ
                                        :</v-col>
                                    <v-col cols="12" md="10" class="mt-2">
                                        <v-textarea v-model="tempData.zoneRemark" variant="outlined" rounded="lg"
                                            density="compact" rows="3" hide-details />
                                    </v-col>



                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold mt-2">ผู้บันทึกผล
                                        :</v-col>
                                    <v-col cols="12" md="4" class="mt-2">
                                        <v-select v-model="tempData.zoneRecorder" :items="['เจ้าหน้าที่ตรวจประเมิน']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="2"
                                        class="text-md-right pt-2 font-weight-bold mt-2">วันที่บันทึกผล
                                        :</v-col>
                                    <v-col cols="12" md="4" class="mt-2">
                                        <v-text-field v-model="tempData.zoneDate" type="date" variant="outlined"
                                            rounded="lg" density="compact" hide-details />
                                    </v-col>
                                </v-row>

                                <div class="d-flex justify-center ga-3 mt-8">
                                    <v-btn variant="outlined" rounded="lg" class="px-8 border bg-grey-lighten-4"
                                        @click="saveData">
                                        <v-icon icon="fas fa-save" class="mr-2" /> บันทึกผลพิจารณา
                                    </v-btn>
                                    <v-btn variant="outlined" rounded="lg" color="success"
                                        class="px-8 border bg-grey-lighten-4" @click="BackMain">
                                        <v-icon icon="fas fa-arrow-left" class="mr-2" /> ย้อนกลับ
                                    </v-btn>
                                </div>
                            </v-card>
                        </v-col>

                    </v-row>
                    <v-btn block color="success" class="mt-6" rounded="lg"
                        @click="page = 'main'">กลับหน้าพิจารณา</v-btn>
                </v-card>
            </v-window-item>

            <!-- PAGE: VIEW GAP (ฝั่งแปลงเกษตร) -->
            <v-window-item value="view-gap">
                <v-card rounded="xl" elevation="0" class="border pa-6">
                    <v-row dense>
                        <!-- ส่วนข้อมูลเกษตรกร (Read Only) -->
                        <v-col cols="12">
                            <v-card variant="outlined" class="pa-6 rounded-xl mb-6">
                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <div class="mb-2">
                                            <div class="field-label mb-1">ประเภท</div>
                                            <v-select v-model="tempData.appType" :items="['ตรวจขึ้นทะเบียนใหม่']"
                                                variant="outlined" rounded="lg" density="compact" hide-details
                                                bg-color="white" readonly />
                                        </div>
                                        <div class="mb-2">
                                            <div class="field-label mb-1">จำนวนครั้งที่ตรวจ</div>
                                            <v-text-field v-model="tempData.checkCount" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="mb-2">
                                            <div class="field-label mb-1">สถานะ</div>
                                            <v-select v-model="tempData.status" :items="['รอตรวจ']" variant="outlined"
                                                rounded="lg" density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                        <div class="mb-2">
                                            <div class="field-label mb-1">รหัสแจ้งเตือน</div>
                                            <v-text-field v-model="tempData.alertCode" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <div class="mb-2">
                                            <div class="field-label mb-1">ชื่อเกษตรกร</div>
                                            <v-text-field v-model="tempData.farmerName" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                        <div class="mb-2">
                                            <div class="field-label mb-1">ชนิดพืช</div>
                                            <v-text-field v-model="tempData.cropName" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="mb-2">
                                            <div class="field-label mb-1">ประเภทการรับรอง</div>
                                            <v-text-field v-model="tempData.certType" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                        <div class="mb-2">
                                            <div class="field-label mb-1">รหัสใบรับรอง</div>
                                            <v-text-field v-model="tempData.certNo" variant="outlined" rounded="lg"
                                                density="compact" hide-details bg-color="white" readonly />
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>

                        <!-- แผนการเพาะปลูก -->
                        <v-col cols="12" class="mt-n5">
                            <div class="field-label mb-1 font-weight-bold text-el-staff">แผนการเพาะปลูก</div>
                            <v-divider class="mb-4" />
                            <v-table density="comfortable" class="border rounded-lg planting-table mb-8">
                                <thead>
                                    <tr class="bg-grey-lighten-3">
                                        <!-- <th class="text-center border-right" style="width: 50px;">
                                                    <v-checkbox density="compact" hide-details
                                                        @update:model-value="toggleAllPlanting" />
                                                </th> -->
                                        <th class="text-center border-right font-weight-bold">แผนการเพาะปลูก
                                        </th>
                                        <th class="text-center border-right font-weight-bold">ระยะเวลาเก็บเกี่ยว
                                        </th>
                                        <!-- <th class="text-center font-weight-bold" style="width: 80px;">เพิ่ม</th> -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(plan, index) in tempData.plantingPlans" :key="index">
                                        <!-- <td class="text-center border-right">
                                                    <v-checkbox v-model="plan.selected" density="compact"
                                                        hide-details />
                                                </td> -->
                                        <td class="pa-2 border-right">
                                            <!-- <v-text-field v-model="plan.name" variant="outlined" rounded="lg"
                                                        density="compact" hide-details /> -->
                                            <div class="text-center">{{ plan.name }}</div>
                                            <!-- Read Only ตามข้อมูลเดิม -->
                                        </td>
                                        <td class="pa-2 border-right">
                                            <!-- <v-text-field v-model="plan.period" variant="outlined" rounded="lg"
                                                        density="compact" hide-details /> -->
                                            <div class="text-center">{{ plan.period }}</div>
                                            <!-- Read Only ตามข้อมูลเดิม -->
                                        </td>
                                        <!-- <td class="text-center">
                                                    <v-btn v-if="index === tempData.plantingPlans.length - 1"
                                                        icon="fas fa-plus-circle" color="success" variant="text"
                                                        @click="addPlantingRow" />
                                                    <v-btn v-else icon="fas fa-minus-circle" color="error"
                                                        variant="text"
                                                        @click="tempData.plantingPlans.splice(index, 1)" />
                                                </td> -->
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>

                        <!-- รายละเอียดที่ตั้ง (Read Only) -->
                        <v-col cols="12">
                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ขนาดพื้นที่ปลูก (ไร่)</div>
                                    <v-text-field v-model="tempData.areaSize" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ผลผลิต/พื้นที่(กก./ไร่)</div>
                                    <v-text-field v-model="tempData.yieldPerArea" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ผลผลิต/รอบการผลิต(กก./รอบ)</div>
                                    <v-text-field v-model="tempData.yieldPerCycle" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">หมายเหตุ</div>
                                    <v-text-field v-model="tempData.remark" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12">
                                    <div class="field-label mb-1">รหัสแปลง (กรมวิชาการเกษตร)</div>
                                    <v-text-field v-model="tempData.farmCode" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12">
                                    <div class="field-label mb-1">ที่ตั้งแปลง</div>
                                    <v-text-field v-model="tempData.location" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">จังหวัด</div><v-text-field v-model="tempData.province"
                                        variant="outlined" rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">รหัสไปรษณีย์ </div>
                                    <v-text-field v-model="tempData.zipcode" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label mb-1">พิกัด X </div>
                                    <v-text-field v-model="tempData.coordX" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label mb-1">พิกัด Y </div>
                                    <v-text-field v-model="tempData.coordZ" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label mb-1">พิกัด Z </div>
                                    <v-text-field v-model="tempData.coordY" variant="outlined" rounded="lg"
                                        density="comfortable" readonly hide-details />
                                </v-col>
                                <v-divider class="my-6 mx-8" />
                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ผู้สร้างข้อมูล</div>
                                    <v-select v-model="tempData.creator" :items="[tempData.creator]" variant="outlined"
                                        rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">วันที่สร้างข้อมูล</div>
                                    <v-select v-model="tempData.createDate" :items="[tempData.createDate]"
                                        variant="outlined" rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ผู้แก้ไขข้อมูล</div>
                                    <v-select v-model="tempData.editor" :items="[tempData.editor]" variant="outlined"
                                        rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">วันที่แก้ไขข้อมูล</div>
                                    <v-select v-model="tempData.editDate" :items="[tempData.editDate]"
                                        variant="outlined" rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">สวพ. เขต</div>
                                    <v-select v-model="tempData.swpArea" :items="[tempData.swpArea]" variant="outlined"
                                        rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ศวพ. จังหวัด</div>
                                    <v-select v-model="tempData.swpProvince" :items="[tempData.swpProvince]"
                                        variant="outlined" rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <div class="field-label mb-1">ผู้ตรวจล่าสุด</div>
                                    <v-select v-model="tempData.lastChecker" :items="[tempData.lastChecker]"
                                        variant="outlined" rounded="lg" density="comfortable" readonly hide-details />
                                </v-col>
                            </v-row>
                            <div class="d-flex justify-start">
                                <v-col cols="12" md="12" class="d-flex field-label mb-1">
                                    <div class="mt-5">เปลี่ยน ศวพ.</div>
                                    <v-col cols="12" md="9"><v-select v-model="tempData.changeswp" :items="[]"
                                            variant="outlined" rounded="lg" density="compact" hide-details /></v-col>
                                    <v-btn class="mt-3" color="el-staff" prepend-icon="fas fa-gear" rounded="lg">
                                        เปลี่ยน</v-btn>
                                </v-col>
                            </div>
                        </v-col>


                        <!-- ตารางประวัติ CL-02 -->
                        <v-col cols="12" class="mt-6">
                            <v-card rounded="lg" elevation="0" class="overflow-hidden border pa-5">
                                <v-card-title class="pa-0  d-flex align-center bg-white">
                                    <!-- <v-btn color="el-staff" class="rounded-0 elevation-0 px-4 mb-3" height="48"
                                                @click="page = 'cl02-form'">
                                                <v-icon icon="fas fa-plus-circle" class="mr-2" /> สร้าง CL-02 ใหม่
                                            </v-btn> -->
                                </v-card-title>
                                <v-table density="compact" class="cl02-history-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center border-right">แก้ไข</th>
                                            <th class="text-center border-right">ครั้งที่</th>
                                            <th class="text-center border-right">กำหนดตรวจ</th>
                                            <th class="text-center border-right">วันที่ตรวจ</th>
                                            <th class="text-center border-right">ผู้ตรวจ</th>
                                            <th class="text-center border-right">ผลตรวจ</th>
                                            <th class="text-center">หมายเหตุ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-if="cl02History.length === 0">
                                            <td colspan="7" class="text-center pa-10 text-medium-emphasis italic">
                                                ไม่มีข้อมูลการตรวจประเมิน</td>
                                        </tr>
                                        <tr v-for="item in cl02History" :key="item.id">
                                            <td class="text-center border-right">
                                                <v-btn icon="fas fa-edit" size="x-small" variant="text"
                                                    color="el-staff" />
                                            </td>
                                            <td class="text-center border-right">{{ item.count }}</td>
                                            <td class="text-center border-right">{{ item.schedule }}</td>
                                            <td class="text-center border-right">{{ item.date }}</td>
                                            <td class="text-center border-right">{{ item.inspector }}</td>
                                            <td class="text-center border-right">{{ item.result }}</td>
                                            <td class="text-center">{{ item.remark }}</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card>
                        </v-col>

                        <!-- ผลการพิจารณาโดย สวพ.เขต -->
                        <v-col cols="12">
                            <v-card rounded="lg" elevation="0" class="pa-6 border mb-8 mt-4">
                                <h3 class="text-el-staff mb-4 font-weight-bold">ผลการพิจารณาโดย สวพ.เขต</h3>
                                <v-row dense>
                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold">ผลการพิจารณา
                                        :</v-col>
                                    <v-col cols="12" md="4">
                                        <v-select v-model="tempData.zoneResult" :items="['ผ่าน', 'ไม่ผ่าน', 'ปรับปรุง']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6" />

                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold mt-2">หมายเหตุ
                                        :</v-col>
                                    <v-col cols="12" md="10" class="mt-2">
                                        <v-textarea v-model="tempData.zoneRemark" variant="outlined" rounded="lg"
                                            density="compact" rows="3" hide-details />
                                    </v-col>

                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold mt-2">แนบไฟล์
                                        :</v-col>
                                    <v-col cols="12" md="10" class="pt-2 text-medium-emphasis mt-2">ไม่มีไฟล์แนบ</v-col>

                                    <v-col cols="12" md="2" class="text-md-right pt-2 font-weight-bold mt-2">ผู้บันทึกผล
                                        :</v-col>
                                    <v-col cols="12" md="4" class="mt-2">
                                        <v-select v-model="tempData.zoneRecorder" :items="['เจ้าหน้าที่ตรวจประเมิน']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="2"
                                        class="text-md-right pt-2 font-weight-bold mt-2">วันที่บันทึก
                                        :</v-col>
                                    <v-col cols="12" md="4" class="mt-2">
                                        <v-text-field v-model="tempData.zoneDate" type="date" variant="outlined"
                                            rounded="lg" density="compact" hide-details />
                                    </v-col>
                                </v-row>

                                <div class="d-flex justify-center ga-3 mt-8">
                                    <v-btn variant="outlined" rounded="lg" class="px-8 border bg-grey-lighten-4"
                                        @click="saveData">
                                        <v-icon icon="fas fa-save" class="mr-2" color="el-staff" />
                                        บันทึกผลพิจารณา
                                    </v-btn>
                                    <v-btn variant="outlined" rounded="lg" class="px-8 border bg-grey-lighten-4"
                                        @click="BackMain">
                                        <v-icon icon="fas fa-arrow-left" class="mr-2" color="el-staff" />
                                        ย้อนกลับ
                                    </v-btn>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-btn block color="success" class="mt-6" rounded="lg"
                        @click="page = 'main'">กลับหน้าพิจารณา</v-btn>
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
    ],
     creator: 'บริษัท เอ็น ที ฟู้ด อินเตอร์เทรด',
    createDate: '20/05/2025',
    editor: 'นายเงิน อิทธิโรจน์',
    editDate: '06/03/2026',
    swpArea: 'สำนักวิจัยและพัฒนาการเกษตรเขตที่ 5', // แก้จาก 'เขต 1'
    swpProvince: 'ศูนย์วิจัยและพัฒนาการเกษตรราชบุรี', // ในภาพคือราชบุรี (ส่วนในโค้ดเดิมคุณเป็นนครปฐม)
    lastChecker: 'นางสาวฤทัยรัตน์ กัณหาจันทร์',
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

const appInfo = reactive({
    type: 'ตรวจขึ้นทะเบียนใหม่',
    crop: 'พริกขี้หนู',
    status: 'ปิดงาน',
    appCode: 'EL-20250520005'
});

const evalData = reactive({
    factoryResult: 'ผ่าน',
    factoryRemark: '',
    farmResult: 'ผ่าน',
    farmRemark: ''
});
// Master Data / List Data
const cl02History = ref([
    { id: 1, count: 1, schedule: '2026-03-31', date: '2026-03-31', inspector: 'นายสมชาย ตรวจดี', result: 'ผ่าน', remark: '-' }
]);

const cl02Items = [
    { label: '1. มีบันทึกการตรวจติดตาม/การตรวจเยี่ยมแปลงพืช' },
    { label: '2. ผู้ประกอบการเข้าตรวจประเมินความเสี่ยงของพื้นที่เพาะปลูกและแหล่งน้ำ' },
    { label: '3. มีการสุ่มตัวอย่างผลผลิต และน้ำวิเคราะห์สารเคมีตกค้างและเชื้อจุลินทรีย์' },
    { label: '4. ผู้ประกอบการได้มีการทบทวนการขึ้นทะเบียนแปลง (AVL) ของเกษตรกรที่สมัครเข้าเป็นสมาชิกเครือข่าย' },
    {
        label: '5. การฝึกอบรมเกษตรกรผู้ปลูก',
        sub: ['5.1 ด้านการใช้สารเคมี', '5.2 ด้านการปนเปื้อนของสารเคมีและจุลินทรีย์', '5.3 โรคแมลงศัตรูพืชที่ติดกับผลผลิต', '5.4 ด้านการจัดการหลังเก็บเกี่ยว']
    },
    {
        label: '6. อื่นๆ',
        sub: [
            '- พบแมลงศัตรูพืชในผลผลิตหลังการคัดแยกพร้อมส่งบริษัท',
            '- สถานที่คัดแยกผลผลิตเสี่ยงต่อการปนเปื้อนเชื้อจุลินทรีย์',
            '- สารเคมีนอกเหนือคำแนะนำของกรมวิชาการเกษตร',
            '- ใช้สารเคมีที่ประเทศ EU ห้ามใช้',
            '- ไม่จดบันทึก การใช้ปัจจัยการผลิตทางการเกษตร',
            '- ไม่จดบันทึก ปริมาณผลผลิตและการจำหน่าย',
            '- ไม่จดบันทึก การสำรวจโรคและแมลงในการปลูก'
        ]
    }
];
// ข้อมูลสำหรับฟอร์ม CL-02
const cl02Form = reactive({
    evalType: 'ตรวจขึ้นทะเบียนใหม่',
    evalCount: '1',
    farmCode: '73012100-9352-0002-0313',
    certNo: 'กษ 03-9001-73-352-000041',
    areaSize: '0.25',
    address: 'หมู่ 5 ต.สวนปาน อ.เมืองนครปฐม',
    province: 'นครปฐม',
    district: 'เมืองนครปฐม',
    subdistrict: 'สวนปาน',
    zipcode: '73000',
    establishmentName: 'บริษัท ฟลอร่า แคปปิทอล จำกัด (1)',
    coordX: '', coordY: '', coordZ: '',
    answers: {},
    remarks: {},
    overall: 'pass',
    overallRemark: '',
    inspector: 'นายสมชาย ตรวจดี',
    status: 'สมบูรณ์',
    creator: 'admin_staff',
    editor: 'admin_staff'
});

// Methods
function saveCL02() {
    alert('บันทึกแบบ CL-02 เรียบร้อยแล้ว');
    page.value = 'form';
}

function saveMainData() {
    alert('บันทึกผลการพิจารณา สวพ.เขต เรียบร้อย');
}
// ข้อมูลโรงคัดบรรจุ (Mockup ค่าเริ่มต้น)
const establishmentInfo = reactive({
    type: 'ตรวจขึ้นทะเบียนใหม่',
    countcheck: '2',
    codealert: '1234',
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


const activeStep2Tab = ref(null)





// ─── METHODS ───









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