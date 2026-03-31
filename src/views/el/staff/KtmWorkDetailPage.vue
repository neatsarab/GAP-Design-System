<template>
    <div style="--v-theme-primary: var(--v-theme-el-staff)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <div>
                <h1 class="page-title mb-0 font-weight-bold">ตรวจเอกสารโรงคัดบรรจุ</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">ระบบจัดการโรงคัดบรรจุ (Establishment List)</p>
            </div>
        </div>

        <v-window v-model="page" :touch="false">
            <!-- PAGE: MAIN DASHBOARD -->
            <v-window-item value="main">

                <!-- 1. ข้อมูลโรงคัดบรรจุ -->
                <v-card rounded="xl" elevation="0" class="mb-5 section-card border">
                    <v-card-title class="pa-4 pb-0 text-el-staff font-weight-bold">ข้อมูลโรงคัดบรรจุ</v-card-title>
                    <v-divider class="mx-4 mt-2" />
                    <v-card-text class="pa-5">
                        <v-row dense>
                            <v-col cols="12" md="6">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed">รหัสรับรองโรงคัดบรรจุ :</div>
                                    <v-text-field v-model="establishmentInfo.certCode" variant="outlined" rounded="lg"
                                        density="compact" hide-details />
                                </div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed-sm">วันที่ออก :</div>
                                    <v-text-field v-model="establishmentInfo.issueDate" type="date" variant="outlined"
                                        rounded="lg" density="compact" hide-details />
                                </div>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed-sm">วันที่หมดอายุ :</div>
                                    <v-text-field v-model="establishmentInfo.expireDate" type="date" variant="outlined"
                                        rounded="lg" density="compact" hide-details />
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed">ชื่อโรงคัดบรรจุ :</div>
                                    <v-text-field v-model="establishmentInfo.name" variant="outlined" rounded="lg"
                                        density="compact" hide-details />
                                </div>
                            </v-col>

                            <v-col cols="12" md="6">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed">ชื่อผู้ติดต่อ :</div>
                                    <v-text-field v-model="establishmentInfo.contactFirstName" variant="outlined"
                                        rounded="lg" density="compact" hide-details />
                                </div>
                            </v-col>
                            <v-col cols="12" md="6">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed-sm">นามสกุล :</div>
                                    <v-text-field v-model="establishmentInfo.contactLastName" variant="outlined"
                                        rounded="lg" density="compact" hide-details />
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed">ที่ตั้งโรงคัดบรรจุ :</div>
                                    <v-text-field v-model="establishmentInfo.address" variant="outlined" rounded="lg"
                                        density="compact" hide-details />
                                </div>
                            </v-col>

                            <v-col cols="12" md="6">
                                <div class="d-flex align-center mb-2 pl-md-10">
                                    <div class="field-label-fixed-sm">จังหวัด :</div>
                                    <v-select v-model="establishmentInfo.province" :items="['กรุงเทพมหานคร']"
                                        variant="outlined" rounded="lg" density="compact" hide-details />
                                </div>
                                <div class="d-flex align-center mb-2 pl-md-10">
                                    <div class="field-label-fixed-sm">อำเภอ/เขต :</div>
                                    <v-select v-model="establishmentInfo.district" :items="['เขตลาดพร้าว']"
                                        variant="outlined" rounded="lg" density="compact" hide-details />
                                </div>
                                <div class="d-flex align-center mb-2 pl-md-10">
                                    <div class="field-label-fixed-sm">ตำบล/แขวง :</div>
                                    <v-select v-model="establishmentInfo.subdistrict" :items="['ลาดพร้าว']"
                                        variant="outlined" rounded="lg" density="compact" hide-details />
                                </div>
                                <div class="d-flex align-center mb-2 pl-md-10">
                                    <div class="field-label-fixed-sm">รหัสไปรษณีย์ :</div>
                                    <v-text-field v-model="establishmentInfo.zipcode" variant="outlined" rounded="lg"
                                        density="compact" hide-details />
                                </div>
                            </v-col>

                            <v-col cols="12" md="6">
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed-sm">โทรศัพท์ :</div>
                                    <v-text-field v-model="establishmentInfo.phone" variant="outlined" rounded="lg"
                                        density="compact" hide-details />
                                </div>
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed-sm">โทรสาร (FAX) :</div>
                                    <v-text-field v-model="establishmentInfo.fax" variant="outlined" rounded="lg"
                                        density="compact" hide-details />
                                </div>
                                <div class="d-flex align-center mb-2">
                                    <div class="field-label-fixed-sm">วันที่อนุมัติ :</div>
                                    <v-text-field v-model="establishmentInfo.approveDate" type="date" variant="outlined"
                                        rounded="lg" density="compact" hide-details />
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <!-- 2. ระบบจัดการโรงคัดบรรจุ -->
                <v-card rounded="xl" elevation="0" class="mb-5 section-card border">
                    <v-card-title class="pa-4 pb-0 text-el-staff font-weight-bold">ระบบจัดการโรงคัดบรรจุ</v-card-title>
                    <v-divider class="mx-4 mt-2" />

                    <v-card-text class="pa-5">
                        <div class="d-flex align-center mb-4 pl-10">
                            <span class="field-label font-weight-bold mr-4">ชนิดพืช :</span>
                            <v-select v-model="tempData.cropName" :items="['พริกขี้หนู', 'ทุเรียน', 'มังคุด']"
                                variant="outlined" rounded="lg" density="compact" hide-details
                                style="max-width: 300px;" />
                        </div>

                        <v-table density="compact" class="border rounded-lg doc-check-table">
                            <thead>
                                <tr class="bg-grey-lighten-4">
                                    <th class="text-center font-weight-bold" style="width: 50%;">รายการ</th>
                                    <th class="text-center font-weight-bold" style="width: 10%;">เอกสารแนบ</th>
                                    <th class="text-center font-weight-bold" style="width: 15%;">ผลการตรวจเอกสาร</th>
                                    <th class="text-center font-weight-bold">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- 1. สำเนาใบรับรอง GMP/HACCP -->
                                <tr>
                                    <td class="pa-0" colspan="4">
                                        <div class="bg-white pa-2 font-weight-bold border-bottom">1. สำเนาใบรับรอง GMP
                                            และ/หรือ HACCP :</div>
                                        <!-- Sub-items for GMP -->
                                        <div class="pa-4 border-bottom">
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <div class="d-flex align-center mb-1">
                                                        <div class="label-sub">หมายเลข GMP :</div><v-text-field
                                                            variant="outlined" density="compact" hide-details
                                                            rounded="lg" />
                                                    </div>
                                                    <div class="d-flex align-center mb-1">
                                                        <div class="label-sub">วันที่ออกใบรับรอง :</div><v-text-field
                                                            type="date" variant="outlined" density="compact"
                                                            hide-details rounded="lg" />
                                                    </div>
                                                    <div class="d-flex align-center">
                                                        <div class="label-sub">วันที่หมดอายุ :</div><v-text-field
                                                            type="date" variant="outlined" density="compact"
                                                            hide-details rounded="lg" />
                                                    </div>
                                                </v-col>
                                                <v-col cols="1" class="text-center"><v-btn icon="fas fa-file-pdf"
                                                        variant="text" color="primary" /></v-col>
                                                <v-col cols="1.5"><v-select :items="['ผ่าน', 'ไม่ผ่าน']"
                                                        v-model="tempData.checkResults.gmp" variant="outlined"
                                                        density="compact" hide-details rounded="lg" /></v-col>
                                                <v-col cols="2"><v-text-field v-model="tempData.checkRemarks.gmp"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg" /></v-col>
                                            </v-row>
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <div class="d-flex align-center mb-1">
                                                        <div class="label-sub">หมายเลข GMP :</div><v-text-field
                                                            variant="outlined" density="compact" hide-details
                                                            rounded="lg" />
                                                    </div>
                                                    <div class="d-flex align-center mb-1">
                                                        <div class="label-sub">วันที่ออกใบรับรอง :</div><v-text-field
                                                            type="date" variant="outlined" density="compact"
                                                            hide-details rounded="lg" />
                                                    </div>
                                                    <div class="d-flex align-center">
                                                        <div class="label-sub">วันที่หมดอายุ :</div><v-text-field
                                                            type="date" variant="outlined" density="compact"
                                                            hide-details rounded="lg" />
                                                    </div>
                                                </v-col>
                                                <v-col cols="1" class="text-center"><v-btn icon="fas fa-file-pdf"
                                                        variant="text" color="primary" /></v-col>
                                                <v-col cols="1.5"><v-select :items="['ผ่าน', 'ไม่ผ่าน']"
                                                        v-model="tempData.checkResults.gmp" variant="outlined"
                                                        density="compact" hide-details rounded="lg" /></v-col>
                                                <v-col cols="2"><v-text-field v-model="tempData.checkRemarks.gmp"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg" /></v-col>
                                            </v-row>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Loop other items -->
                                <tr v-for="(item, idx) in mainDocList" :key="idx">
                                    <td class="pa-4 text-body-2">{{ item.label }}</td>
                                    <td class="text-center"><v-btn icon="fas fa-file-pdf" variant="text"
                                            color="primary" /></td>
                                    <td class="pa-2">
                                        <v-select :items="['ผ่าน', 'ไม่ผ่าน']" v-model="tempData.checkResults[item.key]"
                                            variant="outlined" density="compact" hide-details rounded="lg" />
                                    </td>
                                    <td class="pa-2">
                                        <v-text-field v-model="tempData.checkRemarks[item.key]" variant="outlined"
                                            density="compact" hide-details rounded="lg" />
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>

                        <div class="d-flex justify-end mt-4">
                            <v-btn color="success" prepend-icon="fas fa-check-double" variant="flat" rounded="lg"
                                @click="passAllDocuments">ผ่านทั้งหมด</v-btn>
                        </div>
                    </v-card-text>
                </v-card>

                <!-- Result Footer -->
                <v-card rounded="xl" elevation="0" class="section-card border pa-6 mt-5">
                    <!-- ส่วนข้อมูลวันที่และสถานะ (Row บน) -->
                    <v-row dense class="mb-4">
                        <v-col cols="12" md="6">
                            <div class="d-flex align-center mb-2">
                                <div class="field-label-fixed">วันที่ส่งคำขอ :</div>
                                <v-text-field v-model="establishmentInfo.appDate" type="date" variant="outlined"
                                    rounded="lg" density="compact" hide-details readonly bg-color="grey-lighten-4" />
                            </div>
                            <div class="d-flex align-center mb-2">
                                <div class="field-label-fixed">ผู้สร้างข้อมูล :</div>
                                <v-text-field v-model="establishmentInfo.creator" variant="outlined" rounded="lg"
                                    density="compact" hide-details readonly bg-color="grey-lighten-4" />
                            </div>
                            <div class="d-flex align-center">
                                <div class="field-label-fixed">ผู้แก้ไขข้อมูล :</div>
                                <v-text-field v-model="establishmentInfo.updater" variant="outlined" rounded="lg"
                                    density="compact" hide-details readonly bg-color="grey-lighten-4" />
                            </div>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="d-flex align-center mb-2">
                                <div class="field-label-fixed">สถานะ :</div>
                                <v-select v-model="establishmentInfo.appStatus" :items="['รอตรวจเอกสาร']"
                                    variant="outlined" rounded="lg" density="compact" hide-details readonly
                                    bg-color="grey-lighten-4" />
                            </div>
                            <div class="d-flex align-center mb-2">
                                <div class="field-label-fixed">วันที่สร้างข้อมูล :</div>
                                <v-text-field v-model="establishmentInfo.createdDate" type="date" variant="outlined"
                                    rounded="lg" density="compact" hide-details readonly bg-color="grey-lighten-4" />
                            </div>
                            <div class="d-flex align-center">
                                <div class="field-label-fixed">วันที่แก้ไขข้อมูล :</div>
                                <v-text-field v-model="establishmentInfo.updatedDate" type="date" variant="outlined"
                                    rounded="lg" density="compact" hide-details readonly bg-color="grey-lighten-4" />
                            </div>
                        </v-col>
                    </v-row>

                    <v-divider class="mb-6" />

                    <!-- ส่วนบันทึกผลการตรวจ (Row ล่าง) -->
                    <v-row dense>
                        <v-col cols="12" md="12">
                            <div class="d-flex align-center mb-4">
                                <div class="field-label-fixed font-weight-bold">ผลการตรวจเอกสาร :</div>
                                <v-select v-model="tempData.overallResult" :items="['ผ่าน', 'ปรับปรุง', 'ไม่ผ่าน']"
                                    variant="outlined" rounded="lg" density="compact" hide-details
                                    class="result-select-text" />
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <div class="d-flex align-start mb-4">
                                <div class="field-label-fixed font-weight-bold pt-2">หมายเหตุ :</div>
                                <v-textarea v-model="tempData.overallRemark" variant="outlined" rounded="lg"
                                    density="compact" rows="3" hide-details placeholder="กรอกหมายเหตุเพิ่มเติม..." />
                            </div>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="d-flex align-center">
                                <div class="field-label-fixed font-weight-bold">ผู้ตรวจ :</div>
                                <v-text-field v-model="tempData.inspectorName" variant="outlined" rounded="lg"
                                    density="compact" hide-details class="inspector-text" />
                            </div>
                        </v-col>

                        <v-col cols="12" md="6">
                            <div class="d-flex align-center">
                                <div class="field-label-fixed font-weight-bold">วันที่ตรวจล่าสุด :</div>
                                <v-text-field v-model="tempData.inspectDate" type="date" variant="outlined" rounded="lg"
                                    density="compact" hide-details />
                            </div>
                        </v-col>
                    </v-row>
                    <!-- Final Action -->
                    <div class="d-flex justify-center ga-4 mt-10">
                        <v-btn color="el-staff" min-width="150" rounded="lg" size="large"
                            @click="saveData">บันทึกข้อมูล</v-btn>
                        <v-btn variant="outlined" min-width="150" rounded="lg" size="large">ยกเลิก</v-btn>
                    </div>
                </v-card>
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const page = ref('main');

const establishmentInfo = reactive({
    certCode: 'DOA 12700 99 000001',
    issueDate: '2017-04-24',
    expireDate: '2018-04-23',
    name: 'บริษัท กรมวิชาการเกษตร จำกัด',
    contactFirstName: 'สุรเดช',
    contactLastName: 'ขจรไชยพฤกษ์',
    address: '50 ถ.พหลโยธิน',
    province: 'กรุงเทพมหานคร',
    district: 'เขตลาดพร้าว',
    subdistrict: 'ลาดพร้าว',
    zipcode: '10900',
    phone: '02-5796133',
    fax: '02-5796134',
    approveDate: '2017-04-24',
    appStatus: 'รอตรวจเอกสาร'
});

const tempData = reactive({
    cropName: 'พริกขี้หนู',
    checkResults: {},
    checkRemarks: {},
    overallResult: 'ผ่าน',
    overallRemark: '',
    inspectorName: 'คกก. สามารถที่จะแก้ไขชื่อผู้ตรวจได้',
    inspectDate: ''
});

const mainDocList = [
    { key: 'plan_yield', label: '2. แผนการผลิตพืช และกำลังการผลิตพืชต่อวัน/สัปดาห์/เดือน :' },
    { key: 'control_plan', label: '3. แผนการควบคุมกระบวนการผลิตในโรงคัดบรรจุ เอกสารและบันทึกต่างๆ ที่เกี่ยวข้อง :' },
    { key: 'avl_list', label: '   - หลักเกณฑ์การขึ้นทะเบียนเกษตรกร / ผู้ส่งมอบ (Approve Vendor List : AVL) :' },
    { key: 'safety_system', label: '   - แผนการควบคุมระบบความปลอดภัยของพืช (จัดการสารเคมี/เชื้อจุลินทรีย์) :' },
    { key: 'haccp_plan', label: '4. เอกสาร HACCP Plan เพื่อแสดงถึงการประยุกต์ใช้ระบบ HACCP :' },
    { key: 'other', label: '5. เอกสารอื่น ๆ :' }
];

function passAllDocuments() {
    // Pass sub-gmp
    tempData.checkResults.gmp = 'ผ่าน';
    // Pass all in list
    mainDocList.forEach(item => {
        tempData.checkResults[item.key] = 'ผ่าน';
    });
}

function saveData() {
    alert("บันทึกข้อมูลการตรวจเอกสารเรียบร้อยแล้ว");
}
</script>

<style scoped>
.field-label-fixed {
    width: 160px;
    font-size: 14px;
    color: #333;
}

.field-label-fixed-sm {
    width: 100px;
    font-size: 14px;
    color: #333;
}

.label-sub {
    width: 140px;
    font-size: 13px;
    color: #666;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}

.doc-check-table :deep(th) {
    background-color: #f5f5f5 !important;
}

.section-card {
    background-color: #fdfdfd;
}
</style>