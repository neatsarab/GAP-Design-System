<template>
    <div style="--v-theme-primary: var(--v-theme-org-user)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-4">
            <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
            <div>
                <h1 class="page-title mb-0">แก้ไขรายละเอียดคำขอ</h1>
                <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
                    เลขคำขอ:
                    <span class="text-org-user font-weight-medium">{{
                        route.params.id ?? "CB-0001"
                    }}</span>
                </p>
            </div>
            <v-spacer />
        </div>

        <!-- Stepper -->
        <v-card rounded="xl" elevation="0" class="mb-4 section-card">
            <v-card-text class="pa-4">
                <div class="d-flex align-center">
                    <template v-for="(step, i) in timelineSteps" :key="step.value">
                        <div class="step-item d-flex flex-column align-center" style="min-width: 72px">
                            <div class="step-circle mb-1" :class="stepClass(step.value)">
                                <v-icon v-if="application.currentStep > step.value" icon="fas fa-check" size="12"
                                    color="white" />
                                <span v-else class="text-caption font-weight-bold">{{
                                    step.value + 1
                                }}</span>
                            </div>
                            <div class="text-caption text-center" :class="application.currentStep >= step.value
                                ? 'text-org-user font-weight-bold'
                                : 'text-medium-emphasis'
                                ">
                                {{ step.title }}
                            </div>
                        </div>
                        <div v-if="i < timelineSteps.length - 1" class="step-line flex-grow-1" :class="{
                            'step-line--done': application.currentStep > step.value,
                        }" />
                    </template>
                </div>
            </v-card-text>
        </v-card>

        <!-- 2-column layout -->
        <v-window v-model="step">

            <v-window-item :value="1">
                <v-row>
                    <!-- ── Left: data sections ── -->
                    <v-col cols="12" md="12">
                        <!-- ข้อมูลแปลง -->
                        <v-card rounded="xl" elevation="0" class="section-card mb-4">
                            <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                                <v-icon icon="fas fa-list-check" color="org-user" size="15" />
                                <span class="text-subtitle-2 font-weight-bold">ข้อมูลแปลง</span>
                            </div>
                            <v-card-text class="pa-4">
                                <div class="text-subtitle-1 font-weight-bold mb-4">ที่ตั้งฟาร์ม</div>
                                <v-row dense>
                                    <v-col cols="12" md="6">
                                        <div class="field-label">ชื่อหมู่บ้าน</div>
                                        <v-text-field v-model="application.village_th" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label">Village</div>
                                        <v-text-field v-model="application.village_en" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">หมู่ที่</div>
                                        <v-text-field v-model="application.moo" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">ถนน</div>
                                        <v-text-field v-model="application.road" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">Road</div>
                                        <v-text-field v-model="application.road_en" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">ตรอก/ซอย</div>
                                        <v-text-field v-model="application.soi" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">Lane/Alley</div>
                                        <v-text-field v-model="application.lane" rounded="lg" variant="outlined"
                                            density="compact" hide-details></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                        <v-select v-model="application.subDistrict" :items="districts" rounded="lg"
                                            variant="outlined" density="compact" hide-details></v-select>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                        <v-select v-model="application.district" :items="amphoes" rounded="lg"
                                            variant="outlined" density="compact" hide-details></v-select>
                                    </v-col>
                                    <v-col cols="12" md="3">
                                        <div class="field-label">จังหวัด <span class="text-red">*</span></div>
                                        <v-select v-model="application.province" :items="provinces" rounded="lg"
                                            variant="outlined" density="compact" hide-details></v-select>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <div class="field-label">พื้นที่ขอรับรอง (ไร่)</div>
                                        <v-text-field v-model="application.totalArea" type="number" rounded="lg"
                                            variant="outlined" density="compact" hide-details></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-text class="pa-6 bg-white">
                                <div class="d-flex justify-space-between align-center mb-4">
                                    <div class="text-subtitle-1 font-weight-bold">
                                        ชนิดและพันธุ์พืชที่ขอรับการรับรอง
                                    </div>
                                </div>

                                <v-table density="compact" class="border rounded-lg mb-2 ">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-left font-weight-bold" style="min-width: 150px">
                                                ชนิดพืช / พันธุ์พืช
                                            </th>
                                            <th class="text-left font-weight-bold" style="width: 100px">พื้นที่
                                                (ไร่)</th>
                                            <th class="text-left font-weight-bold" style="width: 150px">อายุพืช
                                                (วัน/ปี)</th>
                                            <th class="text-left font-weight-bold" style="width: 150px">
                                                กรณีไม้ผล (ต้น)</th>
                                            <th class="text-left font-weight-bold " style="width: 150px">ระยะเวลาผลิต</th>
                                            <th class="text-left font-weight-bold " style="width: 170px">คาดว่าจะเก็บเกี่ยว
                                            </th>
                                            <th class="text-left font-weight-bold "  style="width: 150px">ผลผลิต/ปี (กก.)</th>
                                            <th class="text-left font-weight-bold  "
                                                style="width: 180px">
                                                เลขประจำแปลง <br /> <small class="text-grey">(เจ้าหน้าที่กรอก)</small>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in activeStandardData.crops" :key="index">
                                            <td>{{ item.name }}</td>
                                            <td>{{ item.area }}</td>
                                            <td>{{ item.age }}</td>
                                            <td>{{ item.quantity }}</td>
                                            <td>{{ item.period }}</td>
                                            <td>{{ item.harvest }}</td>
                                            <td>{{ item.yield }}</td>
                                            <td>{{ item.farmId }}</td>
                                        </tr>
                                        <tr v-if="activeStandardData.crops.length === 0">
                                            <td colspan="9" class="pa-10 text-center text-grey italic">
                                                ไม่มีข้อมูลพืช</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card-text>
                        </v-card>

                        <v-card rounded="xl" elevation="0" class="section-card mb-4">

                            <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                                <v-icon icon="fas fa-list-check" color="org-user" size="15" />
                                <span class="text-subtitle-2 font-weight-bold">รายการผลตรวจแปลง</span>
                            </div>
                            <v-card-text class="pa-0">
                                <v-table density="compact" class="inspection-table">
                                    <thead>
                                        <tr>
                                            <th class="text-center">ครั้งที่ตรวจ</th>
                                            <th class="text-center">กำหนดตรวจ</th>
                                            <th class="text-center">วันที่ตรวจ</th>
                                            <th class="text-center">ผลการตรวจ</th>
                                            <th class="text-center" style="width: 100px;">action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in application.inspections" :key="index">
                                            <td class="text-center">{{ item.count }}</td>
                                            <td class="text-center">{{ item.scheduleDate }}</td>
                                            <td class="text-center">{{ item.actualDate }}</td>
                                            <td class="text-center">
                                                <span :class="getResultClass(item.status)">{{ item.resultText }}</span>
                                            </td>
                                            <td class="text-center">
                                                <v-btn color="org-user" variant="tonal" size="small" rounded="lg"
                                                    @click="goToEdit(item)">
                                                    แก้ไข
                                                </v-btn>
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-window-item>
            <v-window-item :value="2">

                <v-row>
                    <v-col cols="12" md="12">
                        <v-card rounded="xl" elevation="0" class="section-card mb-4">
                            <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                                <v-btn icon="fas fa-chevron-left" variant="text" size="x-small" @click="step = 1" />
                                <span class="text-subtitle-2 font-weight-bold">แก้ไขข้อบกพร่อง (ครั้งที่ {{
                                    selectedInspection?.count }})</span>
                            </div>

                            <v-card-text class="pa-6">
                                <div class="mb-6">
                                    <div class="text-caption font-weight-bold mb-2 ml-1">
                                        รายละเอียดที่ต้องแก้ไขจากเจ้าหน้าที่</div>
                                    <v-textarea v-model="application.officerComment" variant="outlined" rounded="xl"
                                        rows="3" readonly hide-details></v-textarea>
                                </div>

                                <div class="mb-6">
                                    <div class="text-caption font-weight-bold mb-2 ml-1">
                                        ระบุรายละเอียด/หมายเหตุเพิ่มเติม</div>
                                    <v-textarea v-model="editForm.detail" variant="outlined" rounded="xl" rows="3"
                                        placeholder="อธิบายการแก้ไขของคุณ..." hide-details></v-textarea>
                                </div>

                                <div class="mb-8">
                                    <div class="text-caption font-weight-bold mb-2 ml-1">แนบไฟล์หลักฐาน (Attach File)
                                    </div>
                                    <v-file-input v-model="editForm.file" prepend-icon=""
                                        prepend-inner-icon="fas fa-paperclip" variant="outlined" rounded="xl"
                                        density="comfortable" hide-details></v-file-input>
                                </div>


                                <div class="d-flex justify-end ga-3">
                                    <v-btn variant="flat" color="grey-lighten-3" rounded="xl" style="min-width: 120px;"
                                        @click="step = 1">
                                        ยกเลิก
                                    </v-btn>

                                    <v-btn color="org-user" elevation="0" rounded="xl" class="text-white"
                                        style="min-width: 120px;" @click="saveChange">
                                        บันทึกข้อมูล
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>
            </v-window-item>
        </v-window>

        <!-- Activity Detail Dialog -->
        <v-dialog v-model="activityDetailDialog" max-width="420">
            <v-card rounded="xl">
                <v-card-text class="pa-6">
                    <div class="d-flex align-center ga-3 mb-4">
                        <div class="activity-dot flex-shrink-0" :class="selectedEvent ? `activity-dot--${selectedEvent.type}` : ''
                            " style="width: 36px; height: 36px">
                            <v-icon v-if="selectedEvent" :icon="eventIcon(selectedEvent.type)" size="14"
                                color="white" />
                        </div>
                        <div>
                            <div class="text-subtitle-2 font-weight-bold">
                                {{ selectedEvent?.action }}
                            </div>
                            <v-chip v-if="selectedEvent" size="x-small" :color="eventColor(selectedEvent.type)"
                                variant="tonal" class="mt-1">
                                {{ eventLabel(selectedEvent.type) }}
                            </v-chip>
                        </div>
                    </div>
                    <v-divider class="mb-4" />
                    <div class="d-flex flex-column ga-3">
                        <div>
                            <div class="text-caption text-medium-emphasis mb-1">
                                ผู้ดำเนินการ
                            </div>
                            <div class="text-body-2">
                                <v-icon icon="fas fa-user" size="12" class="mr-1" />
                                {{ selectedEvent?.actor }}
                            </div>
                        </div>
                        <div>
                            <div class="text-caption text-medium-emphasis mb-1">
                                วันที่ / เวลา
                            </div>
                            <div class="text-body-2">
                                <v-icon icon="fas fa-calendar" size="12" class="mr-1" />
                                {{ selectedEvent?.timestamp }}
                            </div>
                        </div>
                        <div>
                            <div class="text-caption text-medium-emphasis mb-1">
                                ผลการพิจารณา
                            </div>
                            <v-chip size="small" :color="eventColor(selectedEvent?.type)" variant="tonal">
                                {{ eventLabel(selectedEvent?.type) }}
                            </v-chip>
                        </div>
                        <div>
                            <div class="text-caption text-medium-emphasis mb-1">หมายเหตุ</div>
                            <div v-if="selectedEvent?.remark" class="text-body-2 pa-3 rounded-lg"
                                style="background: rgba(var(--v-theme-on-surface), 0.05)">
                                {{ selectedEvent.remark }}
                            </div>
                            <div v-else class="text-body-2 text-medium-emphasis">-</div>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions class="px-6 pb-5 pt-0">
                    <v-btn color="org-user" variant="tonal" rounded="lg" block @click="activityDetailDialog = false">
                        ปิด
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activityDetailDialog = ref(false);
const selectedEvent = ref(null);

watch(activityDetailDialog, (val) => {
    if (val) {
        const scrollY = window.scrollY;
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.height = "100%";
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
    } else {
        const scrollY = document.body.style.top;
        document.documentElement.style.overflow = "";
        document.documentElement.style.height = "";
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
});

function openActivityDetail(event) {
    selectedEvent.value = event;
    activityDetailDialog.value = true;
}

const application = {
    requestNo: "ORG-0001",
    requestType: "ขึ้นทะเบียน",
    submittedDate: "15/01/2569",
    typecert: "คำขอขึ้นทะเบียนหน่วยรับรองมาตรฐานสินค้าเกษตร",
    status: "pending",
    currentStep: 1,

    applicantNameTh: "นายวิชัย รับรองดี",
    applicantHouseNo: "999",
    applicantMoo: "-",
    applicantAlley: "-",
    applicantRoad: "เจริญนคร",
    applicantTambol: "คลองสาน",
    applicantDistrict: "คลองสาน",
    applicantProvince: "กรุงเทพมหานคร",
    applicantZipcode: "10600",
    applicantPhone: "02-345-6789",
    applicantFax: "-",
    applicantEmail: "wichai@cbcert.co.th",

    companyNameTh: "บริษัท ไทยเซิร์ทแล็บ จำกัด",
    companyNameEn: "Thai CertLab Co., Ltd.",
    houseNo: "999",
    alley: "-",
    road: "เจริญนคร",
    tambol: "คลองสาน",
    district: "คลองสาน",
    province: "กรุงเทพมหานคร",
    zipcode: "10600",
    houseNoEn: "999",
    alleyEn: "-",
    roadEn: "Charoen Nakhon",
    tambolEn: "Khlong San",
    districtEn: "Khlong San",
    provinceEn: "Bangkok",
    zipcodeEn: "10600",
    companyPhone: "02-345-6789",
    companyFax: "02-345-6790",
    companyEmail: "info@thaicertlab.co.th",

    standards: [
        { scope: "มกษ. 9001-2564 การปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร", certNo: "NAC-2024-0001" },
        { scope: "มกษ. 9000-2564 เกษตรอินทรีย์ เล่ม 1 การผลิต แปรรูป แสดงฉลาก และจำหน่ายผลิตผลและผลิตภัณฑ์เกษตรอินทรีย์", certNo: "NAC-2024-0002" },
        { scope: "มกษ. 4403-2554 การปฏิบัติทางการเกษตรที่ดีสำหรับข้าว", certNo: "NAC-2024-0003" },
    ],

    attachments: [
        { label: "แผนที่ตั้งสำนักงานใหญ่และสำนักงานสาขาในประเทศไทยที่ขอการรับรองโดยละเอียด" },
        { label: "ใบรับรองระบบงาน (Accreditation Certificate) จากสำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)" },
        { label: "สำเนาหลักฐานการอนุญาตเป็นผู้ประกอบการตรวจสอบมาตรฐาน" },
        { label: "ทะเบียนรายชื่อผู้ตรวจประเมินของหน่วยรับรองโรงงานผลิตสินค้าพืช พร้อมประวัติการตรวจประเมินโรงงานผลิตสินค้าพืช" },
        { label: "ที่อยู่และรายชื่อสาขาที่อยู่ในประเทศไทย" },
    ],

    activityLog: [
        {
            type: "pending",
            action: "กำลังรอพิจารณา",
            actor: "นายอนันต์ วิชาการ (ผู้พิจารณา)",
            timestamp: "20/01/2569 14:00",
            remark: "",
        },
        {
            type: "forward",
            action: "ผ่านการตรวจสอบ",
            actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่ตรวจสอบ)",
            timestamp: "18/01/2569 11:00",
        },
        {
            type: "submit",
            action: "ยื่นคำขอ",
            actor: "นายวิชัย รับรองดี (ผู้ยื่นคำขอ)",
            timestamp: "15/01/2569 09:12",
            remark: "",
        },
    ],
    village_th: "บ้านสวน",
    village_en: "Baan Suan",
    moo: "5",
    road: "เจริญนคร",
    road_en: "Charoen Nakhon",
    soi: "เจริญนคร 17",
    lane: "ซอยเจริญนคร 17 แยก 2",
    subDistrict: "คลองสาน",
    district: "คลองสาน",
    province: "กรุงเทพมหานคร",
    totalArea: 12.5,
    inspections: [
        {
            count: 1,
            scheduleDate: '01/04/2569',
            actualDate: '02/04/2569',
            inspector: 'นายสมชาย ตรวจดี',
            status: 'pass', // pass, fail, pending
            resultText: 'ผ่าน'
        },
        {
            count: 2,
            scheduleDate: '01/05/2569',
            actualDate: '02/05/2569',
            inspector: 'นางสาวสุดา พิจารณา',
            status: 'fail', // pass, fail, pending
            resultText: 'แก้ไขข้อบกพร่อง'
        },
        {
            count: 3,
            scheduleDate: '01/06/2569',
            actualDate: '02/06/2569',
            inspector: 'นายสมนึก รอผล',
            status: 'pending', // pass, fail, pending
            resultText: 'รอตรวจสอบ'
        },
    ],
    officerComment: "กรุณาแนบไฟล์ผลตรวจวิเคราะห์เพิ่มเติมเพื่อประกอบการพิจารณา"

};
// เพิ่มตัวแปรเหล่านี้ในส่วน script setup
const step = ref(1); // ควบคุมหน้า v-window
const selectedInspection = ref(null);
const editForm = ref({
    detail: '',
    file: null
});
function goToEdit(item) {
    selectedInspection.value = item;
    step.value = 2; // สลับไปหน้าแก้ไข
}

function saveChange() {
    // Logic บันทึกข้อมูล
    console.log("Saving...", editForm.value);
    step.value = 1; // บันทึกเสร็จกลับไปหน้าตาราง
}
function getResultClass(status) {
    return {
        'text-success': status === 'pass',
        'text-error': status === 'fail',
        'text-warning': status === 'pending',
        'font-weight-bold': true
    };
}

function editInspection(item) {
    console.log("แก้ไขข้อมูลการตรวจ:", item);
    // ใส่ logic เปิด dialog หรือไปหน้าแก้ไขที่นี่
}

const applicantAddress = computed(() => {
    const a = application;
    return `${a.applicantHouseNo} ถ.${a.applicantRoad} ต.${a.applicantTambol} อ.${a.applicantDistrict} จ.${a.applicantProvince} ${a.applicantZipcode}`;
});

const companyAddressTh = computed(() => {
    const a = application;
    return `${a.houseNo} ถ.${a.road} ต.${a.tambol} อ.${a.district} จ.${a.province} ${a.zipcode}`;
});

const companyAddressEn = computed(() => {
    const a = application;
    return `${a.houseNoEn} ${a.roadEn} Rd., ${a.tambolEn}, ${a.districtEn}, ${a.provinceEn} ${a.zipcodeEn}`;
});

const timelineSteps = [
    { value: 0, title: "ข้อมูลคำขอ" },
    { value: 1, title: "พิจารณาทะเบียน" },
    { value: 2, title: "ลงนาม" },
];

function stepClass(v) {
    if (application.currentStep > v) return "step-done";
    if (application.currentStep === v) return "step-active";
    return "step-pending";
}

function statusColor(s) {
    return (
        {
            draft: "grey",
            pending: "info",
            approved: "success",
            rejected: "error",
        }[s] ?? "grey"
    );
}

function statusIcon(s) {
    return (
        {
            draft: "fas fa-pen",
            pending: "fas fa-clock",
            approved: "fas fa-circle-check",
            rejected: "fas fa-circle-xmark",
        }[s] ?? "fas fa-circle"
    );
}

function statusLabel(s) {
    return (
        {
            draft: "แบบร่าง",
            pending: "รอพิจารณา",
            approved: "อนุมัติ",
            rejected: "ไม่อนุมัติ",
        }[s] ?? s
    );
}

function eventIcon(type) {
    return (
        {
            submit: "fas fa-paper-plane",
            receive: "fas fa-inbox",
            forward: "fas fa-share",
            review: "fas fa-magnifying-glass",
            pending: "fas fa-clock",
            approve: "fas fa-circle-check",
            reject: "fas fa-circle-xmark",
            sendback: "fas fa-rotate-left",
        }[type] ?? "fas fa-circle"
    );
}

function eventColor(type) {
    return (
        {
            submit: "org-user",
            receive: "info",
            forward: "success",
            review: "warning",
            pending: "info",
            approve: "success",
            reject: "error",
            sendback: "warning",
        }[type] ?? "grey"
    );
}

function eventLabel(type) {
    return (
        {
            submit: "ยื่นคำขอ",
            receive: "รับเรื่อง",
            forward: "ผ่าน",
            review: "กำลังพิจารณา",
            pending: "รอพิจารณา",
            approve: "อนุมัติ",
            reject: "ไม่อนุมัติ",
            sendback: "ปรับปรุง",
        }[type] ?? type
    );
}
const activeStandardData = reactive({
    plantCategory: null,
    crops: [
        { name: "มะม่วงน้ำดอกไม้", area: 5, age: 180, quantity: "-", period: "เม.ย.-ก.ย.", harvest: "ส.ค.", yield: 1500, farmId: "FARM-001" },
        { name: "ทุเรียนหมอนทอง", area: 7.5, age: 365, quantity: "-", period: "ม.ค.-ธ.ค.", harvest: "ธ.ค.", yield: 2000, farmId: "FARM-002" },
    ]
})

</script>

<style scoped>
div {
    --step-color: rgb(var(--v-theme-org-user));
    --step-color-tint: rgba(var(--v-theme-org-user), 0.2);
}

.sticky-col {
    position: sticky;
    top: 80px;
}

.info-label {
    font-size: 0.72rem;
    color: rgba(var(--v-theme-on-surface), 0.55);
    margin-bottom: 2px;
}

.info-value {
    font-size: 0.875rem;
    margin-bottom: 8px;
}

.item-row {
    background: rgba(var(--v-theme-on-surface), 0.03);
    border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.step-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
}

.step-line {
    height: 2px;
    background: rgba(var(--v-theme-on-surface), 0.15);
    margin: 0 4px;
    margin-bottom: 20px;
}

.step-pending {
    background: rgba(var(--v-theme-on-surface), 0.12);
    color: rgba(var(--v-theme-on-surface), 0.5);
}

.step-done,
.step-active {
    background: rgb(var(--v-theme-org-user)) !important;
    color: white !important;
}

.step-active {
    box-shadow: 0 0 0 4px rgba(var(--v-theme-org-user), 0.2) !important;
}

.step-line--done {
    background: rgb(var(--v-theme-org-user)) !important;
}

/* Activity timeline */
.activity-timeline {
    padding-left: 4px;
}

.activity-item {
    display: flex;
    gap: 16px;
}

.activity-dot-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
}

.activity-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
}

.activity-dot--submit {
    background: rgb(var(--v-theme-org-user));
}

.activity-dot--receive {
    background: rgb(var(--v-theme-info));
}

.activity-dot--forward {
    background: rgb(var(--v-theme-org-user));
}

.activity-dot--review {
    background: rgb(var(--v-theme-warning));
}

.activity-dot--pending {
    background: rgb(var(--v-theme-info));
    animation: pulse-pending 1.6s ease-in-out infinite;
}

@keyframes pulse-pending {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(var(--v-theme-info), 0.5);
    }

    50% {
        box-shadow: 0 0 0 8px rgba(var(--v-theme-info), 0);
    }
}

.activity-dot--approve {
    background: rgb(var(--v-theme-success));
}

.activity-dot--reject {
    background: rgb(var(--v-theme-error));
}

.activity-dot--sendback {
    background: #fb8c00;
}

.activity-line {
    width: 2px;
    flex-grow: 1;
    background: rgba(var(--v-theme-on-surface), 0.12);
    margin-top: 4px;
    margin-bottom: 0;
    min-height: 20px;
}

.activity-content {
    flex: 1;
    min-width: 0;
}
</style>