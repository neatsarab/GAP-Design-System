<template>
    <div style="--v-theme-primary: var(--v-theme-gap-user)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
            <div>
                <div class="d-flex align-center ga-2 mb-1">
                    <v-chip size="x-small" color="gap-user" variant="tonal"
                        prepend-icon="fas fa-users">รายเดี่ยว</v-chip>
                </div>
                <h1 class="page-title mb-0">คำขอรับรองแหล่งผลิต GAP พืช (รายเดี่ยว)</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    สำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน / สหกรณ์
                </p>
            </div>
        </div>

        <!-- Stepper -->
        <!-- <v-card rounded="xl" elevation="0" class="mb-6 section-card">
            <v-card-text class="pa-5">
                <div class="d-flex align-center">
                    <template v-for="(step, i) in steps" :key="step.value">
                        <div class="step-item d-flex flex-column align-center" style="min-width: 80px">
                            <div class="step-circle mb-1" :class="stepClass(step.value)">
                                <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14" color="white" />
                                <span v-else class="text-caption font-weight-bold">{{
                                    step.value + 1
                                }}</span>
                            </div>
                            <div class="text-caption text-center" :class="currentStep >= step.value
                                ? 'text-gap-user font-weight-bold'
                                : 'text-medium-emphasis'
                                ">
                                {{ step.title }}
                            </div>
                        </div>
                        <div v-if="i < steps.length - 1" class="step-line flex-grow-1"
                            :class="{ 'step-line--done': currentStep > step.value }" />
                    </template>
                </div>
            </v-card-text>
        </v-card> -->

        <v-window v-model="currentStep">
            <!-- Step 1: ข้อมูลกลุ่ม -->
            <v-window-item :value="0">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="gap-user">fas fa-users</v-icon>
                        <span class="text-subtitle-2">ข้อมูลรายละเอียด</span>
                    </div>
                    <v-card-text class="pa-5">
                        <v-row dense align="center">
                            <v-col cols="12" md="3">
                                <div class="field-label font-weight-bold">รหัสรับรองแหล่งผลิตพืช :</div>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="form.certId" :items="certList"
                                    placeholder="เลือกเลขที่ใบรับรองที่ต้องการแก้ไข" variant="outlined" rounded="lg"
                                    density="compact" hide-details bg-color="white"></v-select>
                            </v-col>
                        </v-row>

                        <v-divider class="my-6"></v-divider>

                        <div class="text-subtitle-1 font-weight-bold mb-4 ml-5">1. ข้าพเจ้ามีความประสงค์ขอรับบริการ
                            ดังนี้
                        </div>
                        <v-row dense class="ml-5">
                            <v-col cols="12">
                                <v-checkbox v-model="form.requestTypes"
                                    label="ขอหนังสือรับรอง (กรณีหน่วยรับรองอยู่ระหว่างดำเนินการออกใบรับรอง)"
                                    value="cert_pending" density="compact" hide-details></v-checkbox>
                                <v-checkbox v-model="form.requestTypes"
                                    label="ขอใบรับรองฉบับใหม่ เนื่องจากใบรับรองฉบับเดิมสูญหายหรือเสียหาย"
                                    value="cert_replace" density="compact" hide-details></v-checkbox>

                                <div class="d-flex align-start mt-2">
                                    <v-checkbox v-model="form.isEditData" label="ขอแก้ไขข้อมูล" density="compact"
                                        hide-details class="flex-shrink-0"></v-checkbox>
                                    <v-radio-group v-model="form.editTarget" inline hide-details class="ml-4 "
                                        :disabled="!form.isEditData">
                                        <v-radio label="แบบคำขอใบรับรอง" value="app"></v-radio>
                                        <v-radio label="ใบรับรอง" value="cert"></v-radio>
                                    </v-radio-group>
                                </div>

                            </v-col>
                        </v-row>

                        <v-card variant="flat" class="pa-6 mb-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4">2. ชื่อผู้ยื่นคำขอ (บุคคล/ กลุ่มบุคคล/
                                นิติบุคคล)
                            </div>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-text-field v-model="form.applicantName" placeholder="ชื่อ-นามสกุล"
                                        variant="outlined" rounded="lg" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">ที่อยู่/สำนักงาน เลขที่</div>
                                    <v-text-field v-model="form.address" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">ตรอก/ซอย</div>
                                    <v-text-field v-model="form.moo" variant="outlined" rounded="lg" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">ถนน</div>
                                    <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">หมู่ที่</div>
                                    <v-text-field v-model="form.moo" variant="outlined" rounded="lg" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                    <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                    <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">จังหวัด <span class="text-red">*</span></div>
                                    <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-select>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">รหัสไปรษณีย์ <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">โทรศัพท์ <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">โทรสาร <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">โทรศัพท์มือถือ</div>
                                    <v-text-field v-model="form.mobile" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">Email <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>

                            </v-row>
                        </v-card>

                        <v-row dense>
                            <v-col cols="12">
                                <v-card variant="flat" class="pa-6 mb-6 rounded-xl border bg-grey-lighten-5">
                                    <div class="text-subtitle-1 font-weight-bold mb-4 text-grey-darken-2">ข้อมูลเดิม
                                        (ในใบรับรองเดิม)
                                    </div>
                                    <v-row dense>
                                        <v-col cols="12">
                                            <v-text-field v-model="form.applicantName" placeholder="ชื่อ-นามสกุล"
                                                variant="outlined" rounded="lg" density="compact"
                                                hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">ที่อยู่/สำนักงาน เลขที่</div>
                                            <v-text-field v-model="form.address" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">ตรอก/ซอย</div>
                                            <v-text-field v-model="form.moo" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <div class="field-label">ถนน</div>
                                            <v-text-field v-model="form.road" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">หมู่ที่</div>
                                            <v-text-field v-model="form.moo" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                            <v-select v-model="form.province" :items="provinces" rounded="lg"
                                                variant="outlined" density="compact" hide-details></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                            <v-select v-model="form.province" :items="provinces" rounded="lg"
                                                variant="outlined" density="compact" hide-details></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">จังหวัด <span class="text-red">*</span></div>
                                            <v-select v-model="form.province" :items="provinces" rounded="lg"
                                                variant="outlined" density="compact" hide-details></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">รหัสไปรษณีย์ <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">โทรศัพท์ <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">โทรสาร <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">โทรศัพท์มือถือ</div>
                                            <v-text-field v-model="form.mobile" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">Email <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>

                                    </v-row>
                                    <v-table density="compact" class="border rounded-lg mt-5">
                                        <thead class="bg-grey-lighten-3">
                                            <tr>
                                                <th class="border text-center">ชนิดพืช/ผลิตภัณฑ์</th>
                                                <th class="border text-center">รหัสแปลง</th>
                                                <th class="border text-center">รหัสรับรอง</th>
                                                <th class="border text-center">พื้นที่ (ไร่)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="n in 3" :key="n">
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-card>
                            </v-col>

                            <v-col cols="12">
                                <v-card variant="flat" class="pa-6 mb-6 rounded-xl ">
                                    <div class="text-subtitle-1 font-weight-bold mb-2 ">ข้อมูลใหม่
                                        (ส่วนที่ต้องการแก้ไข)</div>
                                    <v-row dense>
                                        <v-col cols="12">
                                            <v-text-field v-model="form.applicantName" placeholder="ชื่อ-นามสกุล"
                                                variant="outlined" rounded="lg" density="compact"
                                                hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">ที่อยู่/สำนักงาน เลขที่</div>
                                            <v-text-field v-model="form.address" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">ตรอก/ซอย</div>
                                            <v-text-field v-model="form.moo" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <div class="field-label">ถนน</div>
                                            <v-text-field v-model="form.road" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">หมู่ที่</div>
                                            <v-text-field v-model="form.moo" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                            <v-select v-model="form.province" :items="provinces" rounded="lg"
                                                variant="outlined" density="compact" hide-details></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                            <v-select v-model="form.province" :items="provinces" rounded="lg"
                                                variant="outlined" density="compact" hide-details></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">จังหวัด <span class="text-red">*</span></div>
                                            <v-select v-model="form.province" :items="provinces" rounded="lg"
                                                variant="outlined" density="compact" hide-details></v-select>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">รหัสไปรษณีย์ <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">โทรศัพท์ <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">โทรสาร <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">โทรศัพท์มือถือ</div>
                                            <v-text-field v-model="form.mobile" variant="outlined" rounded="lg"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <div class="field-label">Email <span class="text-red">*</span></div>
                                            <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                                density="compact" hide-details></v-text-field>
                                        </v-col>

                                    </v-row>
                                    <v-table density="compact" class="border rounded-lg mt-5">
                                        <thead class="bg-grey-lighten-3">
                                            <tr>
                                                <th class="border text-center">ชนิดพืช/ผลิตภัณฑ์</th>
                                                <th class="border text-center">รหัสแปลง</th>
                                                <th class="border text-center">รหัสรับรอง</th>
                                                <th class="border text-center">พื้นที่ (ไร่)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="n in 3" :key="n">
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field readonly variant="outlined"
                                                        density="compact" hide-details rounded="lg"></v-text-field></td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-card>
                            </v-col>
                        </v-row>

                        <v-card variant="flat" class="pa-6 rounded-xl mt-n10">
                            <v-checkbox v-model="form.isOther" label="อื่นๆ ระบุ" density="compact"
                                hide-details></v-checkbox>
                            <v-textarea v-model="form.otherDetail" placeholder="โปรดระบุรายละเอียดเพิ่มเติม..."
                                variant="outlined" rounded="lg" density="compact" hide-details rows="2"
                                class="mt-2"></v-textarea>
                        </v-card>
                    </v-card-text>
                </v-card>
            </v-window-item>
        </v-window>

        <!-- Navigation Buttons -->
        <div class="d-flex justify-space-between align-center mt-6">
            <div class="d-flex ga-2">
                <v-btn variant="tonal" color="grey" @click="goToApplicationList">ยกเลิก</v-btn>
                <v-btn v-if="currentStep > 0" variant="tonal" color="grey" prepend-icon="fas fa-arrow-left"
                    @click="prevStep">ย้อนกลับ</v-btn>
            </div>
            <div class="d-flex ga-2">
                <v-btn variant="tonal" color="gap-user" prepend-icon="fas fa-floppy-disk"
                    @click="saveDraft">บันทึกแบบร่าง</v-btn>
                <v-btn v-if="currentStep < steps.length - 1" color="gap-user" append-icon="fas fa-arrow-right"
                    @click="nextStep">ถัดไป</v-btn>
                <v-btn v-else color="gap-user" prepend-icon="fas fa-paper-plane"
                    @click="openSuccessDialog">ยื่นคำขอ</v-btn>
            </div>
        </div>

        <!-- Success Dialog -->
        <v-dialog v-model="successDialog" max-width="440" persistent>
            <v-card rounded="xl">
                <v-card-text class="pa-8 text-center">
                    <v-icon icon="fas fa-circle-check" color="success" size="64" class="mb-4" />
                    <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h2>
                    <p class="text-body-2 text-medium-emphasis mb-5">
                        เลขที่คำขอ: <strong class="text-gap-user">GAP-2569-012</strong><br />
                        ประเภท: <strong>รายกลุ่ม</strong> · สมาชิก
                        {{ members.length }} คน<br />
                        เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
                    </p>
                    <v-btn color="gap-user" block @click="goToApplicationList">ดูรายการคำขอ</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Draft Snackbar -->
        <v-snackbar v-model="draftSnackbar" color="success" rounded="lg" timeout="2500" location="top right">
            <v-icon icon="fas fa-floppy-disk" class="mr-2" />
            บันทึกแบบร่างแล้ว
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);

function goToApplicationList() {
    router.push({ name: "ApplicationList" });
}

function prevStep() {
    currentStep.value--;
}

function nextStep() {
    currentStep.value++;
}
const successDialog = ref(false);
function openSuccessDialog() {
    successDialog.value = true;
}
const draftSnackbar = ref(false);

const steps = [
    { value: 0, title: "ข้อมูลกลุ่ม" }]

function stepClass(v) {
    if (currentStep.value > v) return "step-done";
    if (currentStep.value === v) return "step-active";
    return "step-pending";
}

function saveDraft() {
    draftSnackbar.value = true;
}

const members = ref([]);
function addMember() {
    members.value.push({
        prefix: "นาย",
        firstName: "",
        lastName: "",
        idCard: "",
        crops: [],
        area: 0,
    });
}

const form = ref({
    groupName: "",
    groupRegNo: "",
    groupType: null,
    memberCount: 2,
    repPrefix: "นาย",
    repFirstName: "",
    repLastName: "",
    repIdCard: "",
    repPhone: "",
    repEmail: "",
    address: "",
    postalCode: "",
    province: null,
    district: null,
    subDistrict: null,
    cropTypes: [],
    inspector: null,
    totalArea: 0,
    water: true,
    record: false,
    chemical: false,
    docs: [],
    groupDocs: [],
    photos: [],
    crops: [
        {
            name: 'มะม่วงน้ำดอกไม้',
            area: '10.5',
            age: '5 ปี',
            quantity: '420',
            period: 'ม.ค. - พ.ค.',
            yield: '5,500',
            farmId: '73012100-9352-0001'
        }
    ]
});

const rules = {
    required: (v) => !!v || "กรุณากรอกข้อมูล",
    idCard: (v) => /^\d{13}$/.test(v) || "เลขบัตรประชาชน 13 หลัก",
    phone: (v) => /^0\d{8,9}$/.test(v) || "รูปแบบเบอร์โทรไม่ถูกต้อง",
};

const provinces = [
    "กรุงเทพมหานคร",
    "เชียงใหม่",
    "ขอนแก่น",
    "นครราชสีมา",
    "สุพรรณบุรี",
    "เพชรบูรณ์",
];
const cropTypes = [
    "ข้าวหอมมะลิ",
    "ข้าวโพด",
    "มันสำปะหลัง",
    "อ้อย",
    "ผักกาดขาว",
    "มะเขือเทศ",
];
const inspectors = [
    "นาย วิจัย ตรวจดี",
    "นาง สุดา ประเมิน",
    "นาย ชัยวัฒน์ ผลตรวจ",
];

const masterCrops = ['มะม่วงน้ำดอกไม้', 'มะม่วงอกร่อง', 'ทุเรียนหมอนทอง', 'มังคุด']

const addCrop = () => {
    form.crops.push({
        name: null,
        area: '',
        age: '',
        quantity: '',
        period: '',
        yield: '',
        farmId: ''
    })
}
</script>

<style scoped>
div {
    --step-color: rgb(var(--v-theme-gap-user));
    --step-color-tint: rgba(var(--v-theme-gap-user), 0.2);
}

.member-row {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-theme-surface-variant), 0.5);
}

.step-done,
.step-active {
    background: rgb(var(--v-theme-gap-user)) !important;
    color: white !important;
}

.step-active {
    box-shadow: 0 0 0 4px rgba(var(--v-theme-gap-user), 0.2) !important;
}

.step-line--done {
    background: rgb(var(--v-theme-gap-user)) !important;
}

.field-section-label {
    color: rgb(var(--v-theme-gap-user)) !important;
}

:deep(.radio-farm .v-selection-control-group) {
    grid-area: control;
    display: flex;
    justify-content: center;
}
</style>
