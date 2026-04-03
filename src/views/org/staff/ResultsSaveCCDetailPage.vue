<template>
    <div style="--v-theme-primary: var(--v-theme-org-staff)">
        <!-- Back + Header -->
        <div class="d-flex align-center ga-3 mb-5 flex-wrap">
            <v-btn variant="text" prepend-icon="fas fa-arrow-left" size="small" @click="goToApplicationList">
                กลับ
            </v-btn>
            <v-divider vertical style="height: 24px" />
            <div class="flex-grow-1">
                <div class="d-flex align-center ga-2 flex-wrap">
                    <h1 class="text-h6 font-weight-bold">{{ app.requestNo }}</h1>
                    <v-chip size="small" :color="statusColor" variant="tonal" :prepend-icon="statusIcon">
                        {{ statusLabel }}
                    </v-chip>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
                    ยื่นเมื่อ {{ app.submittedAt }} · {{ app.certType }} ·
                    {{ app.province }}
                </p>
            </div>
        </div>

        <!-- Stepper -->
        <v-card rounded="xl" elevation="0" class="mb-6 section-card">
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
                                ? 'text-org-staff font-weight-bold'
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
        </v-card>

        <v-window v-model="currentStep">
            <!-- Step 1: ข้อมูลกลุ่ม -->
            <v-window-item :value="0">


            </v-window-item>

            <!-- Step 2: รายชื่อสมาชิก -->
            <v-window-item :value="1">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-staff">fas fa-location-dot</v-icon>
                        <span class="text-subtitle-2">ข้อมูลแปลง</span>
                    </div>
                    <v-card-text class="pt-5">
                        <div class="field-section-label mb-2">ที่ตั้งฟาร์ม</div>
                        <v-row dense>
                            <v-col cols="12" md="4">
                                <div class="field-label">ชื่อหมู่บ้าน</div>
                                <v-text-field v-model="form.village" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label">Village</div>
                                <v-text-field v-model="form.village" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label">หมู่ที่</div>
                                <v-text-field v-model="form.moo" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">ถนน</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">Road</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">ตรอก/ซอย</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">Lane/Alley</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">จังหวัด <span class="text-red">*</span></div>
                                <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">พื้นที่ขอรับรอง (ไร่)</div>
                                <v-text-field v-model="form.totalArea" type="number" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-text-field>
                            </v-col>

                            <div class="field-section-label mb-2 mt-5">ชนิดและพันธุ์พืชที่ขอรับการรับรอง</div>
                            <v-col cols="12" md="12">
                                <v-card-title class="pa-0 border-bottom d-flex align-center bg-white">
                                    <v-btn color="success" variant="flat" rounded="lg"
                                        class="border-right rounded-0 elevation-0 px-2 py-2 mb-5" height="auto"
                                        @click="page = 'cl02-form'">
                                        <v-icon icon="fas fa-plus-circle" color="white" class="mr-2" />
                                        <div class="text-white">บันทึกผลตรวจ</div>
                                    </v-btn>
                                </v-card-title>
                                <v-table density="compact" class="border rounded-lg mb-2 crop-table custom-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center font-weight-bold border" style="min-width: 80px">
                                                ครั้งที่ตรวจ
                                            </th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                กำหนดตรวจ</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                วันที่ตรวจ</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">ผู้ตรวจ
                                            </th>
                                            <th class="text-center font-weight-bold border">ผลการตรวจ</th>
                                            <th class="text-center font-weight-bold border">หมายเหตุ</th>
                                            <th class="text-center font-weight-bold border">แก้ไขข้อมูล</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in activeStandardData.crops" :key="index">
                                            <td class="border pa-1">
                                                <v-autocomplete v-model="item.name"
                                                    :items="['มะม่วงน้ำดอกไม้', 'มะม่วงอกร่อง', 'ทุเรียนหมอนทอง', 'มังคุด']"
                                                    variant="outlined" density="compact" hide-details rounded="lg"
                                                    placeholder="ค้นหาพืช..."></v-autocomplete>
                                            </td>
                                            <td class="border pa-1"><v-text-field v-model="item.area" variant="outlined"
                                                    density="compact" hide-details rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.age" variant="outlined"
                                                    density="compact" hide-details rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.quantity"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.period"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.harvest"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.yield"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1">
                                                <v-text-field v-model="item.farmId" placeholder="" readonly
                                                    bg-color="grey-lighten-4" variant="outlined" density="compact"
                                                    hide-details rounded="lg"></v-text-field>
                                            </td>
                                        </tr>
                                        <tr v-if="activeStandardData.crops.length === 0">
                                            <td colspan="9" class="pa-10 text-center text-grey italic">
                                                ไม่มีข้อมูล</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>

                            <v-card-text class="pa-5">
                                <!-- ผลการตรวจสอบ -->
                                <div class="field-label mb-1">
                                    <span class="text-subtitle-2 font-weight-bold">ผลการตรวจสอบ</span>
                                </div>
                                <v-radio-group v-model="step1Review.result" color="doa-staff" inline>
                                    <v-radio value="pass" class="mr-6">
                                        <template #label>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon icon="fas fa-circle-check" color="success" size="18" />
                                                <span class="font-weight-medium">ผ่าน</span>
                                            </div>
                                        </template>
                                    </v-radio>
                                    <v-radio value="fail">
                                        <template #label>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                                                <span class="font-weight-medium">ไม่ผ่าน</span>
                                            </div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>

                                <!-- หมายเหตุ -->
                                <div class="field-label mb-1">
                                    <span class="text-subtitle-2 font-weight-bold">หมายเหตุ</span>
                                </div>
                                <v-textarea v-model="step1Review.remark" variant="outlined" density="compact"
                                    rounded="lg" hide-details rows="4" placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                                    class="mb-5" />


                            </v-card-text>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- Step 3: ที่อยู่ + แปลง (รวม) -->
            <v-window-item :value="2">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-staff">fas fa-location-dot</v-icon>
                        <span class="text-subtitle-2">ข้อมูลแปลง</span>
                    </div>
                    <v-card-text class="pt-5">
                        <div class="field-section-label mb-2">ที่ตั้งฟาร์ม</div>
                        <v-row dense>
                            <v-col cols="12" md="4">
                                <div class="field-label">ชื่อหมู่บ้าน</div>
                                <v-text-field v-model="form.village" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label">Village</div>
                                <v-text-field v-model="form.village" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <div class="field-label">หมู่ที่</div>
                                <v-text-field v-model="form.moo" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">ถนน</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">Road</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">ตรอก/ซอย</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">Lane/Alley</div>
                                <v-text-field v-model="form.road" rounded="lg" variant="outlined" density="compact"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">จังหวัด <span class="text-red">*</span></div>
                                <v-select v-model="form.province" :items="provinces" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <div class="field-label">พื้นที่ขอรับรอง (ไร่)</div>
                                <v-text-field v-model="form.totalArea" type="number" rounded="lg" variant="outlined"
                                    density="compact" hide-details></v-text-field>
                            </v-col>

                            <div class="field-section-label mb-2 mt-5">ชนิดและพันธุ์พืชที่ขอรับการรับรอง</div>
                            <v-col cols="12" md="12">
                                <v-card-title class="pa-0 border-bottom d-flex align-center bg-white">
                                    <v-btn color="success" variant="flat" rounded="lg"
                                        class="border-right rounded-0 elevation-0 px-2 py-2 mb-5" height="auto"
                                        @click="page = 'cl02-form'">
                                        <v-icon icon="fas fa-plus-circle" color="white" class="mr-2" />
                                        <div class="text-white">บันทึกผลตรวจ</div>
                                    </v-btn>
                                </v-card-title>
                                <v-table density="compact" class="border rounded-lg mb-2 crop-table custom-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center font-weight-bold border" style="min-width: 80px">
                                                ครั้งที่ตรวจ
                                            </th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                กำหนดตรวจ</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                วันที่ตรวจ</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">ผู้ตรวจ
                                            </th>
                                            <th class="text-center font-weight-bold border">ผลการตรวจ</th>
                                            <th class="text-center font-weight-bold border">หมายเหตุ</th>
                                            <th class="text-center font-weight-bold border">แก้ไขข้อมูล</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in activeStandardData.crops" :key="index">
                                            <td class="border pa-1">
                                                <v-autocomplete v-model="item.name"
                                                    :items="['มะม่วงน้ำดอกไม้', 'มะม่วงอกร่อง', 'ทุเรียนหมอนทอง', 'มังคุด']"
                                                    variant="outlined" density="compact" hide-details rounded="lg"
                                                    placeholder="ค้นหาพืช..."></v-autocomplete>
                                            </td>
                                            <td class="border pa-1"><v-text-field v-model="item.area" variant="outlined"
                                                    density="compact" hide-details rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.age" variant="outlined"
                                                    density="compact" hide-details rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.quantity"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.period"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.harvest"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.yield"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1">
                                                <v-text-field v-model="item.farmId" placeholder="" readonly
                                                    bg-color="grey-lighten-4" variant="outlined" density="compact"
                                                    hide-details rounded="lg"></v-text-field>
                                            </td>
                                        </tr>
                                        <tr v-if="activeStandardData.crops.length === 0">
                                            <td colspan="9" class="pa-10 text-center text-grey italic">
                                                ไม่มีข้อมูล</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>

                            <v-card-text class="pa-5">
                                <!-- ผลการตรวจสอบ -->
                                <div class="field-label mb-1">
                                    <span class="text-subtitle-2 font-weight-bold">ผลการตรวจสอบ</span>
                                </div>
                                <v-radio-group v-model="step1Review.result" color="doa-staff" inline>
                                    <v-radio value="pass" class="mr-6">
                                        <template #label>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon icon="fas fa-circle-check" color="success" size="18" />
                                                <span class="font-weight-medium">ผ่าน</span>
                                            </div>
                                        </template>
                                    </v-radio>
                                    <v-radio value="fail">
                                        <template #label>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                                                <span class="font-weight-medium">ไม่ผ่าน</span>
                                            </div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>

                                <!-- หมายเหตุ -->
                                <div class="field-label mb-1">
                                    <span class="text-subtitle-2 font-weight-bold">หมายเหตุ</span>
                                </div>
                                <v-textarea v-model="step1Review.remark" variant="outlined" density="compact"
                                    rounded="lg" hide-details rows="4" placeholder="ระบุเหตุผลหรือข้อสังเกต..."
                                    class="mb-5" />


                            </v-card-text>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- Step 4: เอกสาร -->
            <v-window-item :value="3">
                <v-card elevation="0" border rounded="xl">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-staff">fas fa-paperclip</v-icon>
                        <span class="text-subtitle-2">เอกสารและหลักฐาน</span>
                        <v-spacer />
                        <v-chip size="x-small" variant="tonal" color="warning">ไม่เกินไฟล์ละ 10 MB</v-chip>
                    </div>
                    <v-card-text class="pt-5">
                        <v-row dense>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    เอกสารกลุ่ม (ทะเบียนกลุ่ม, รายชื่อสมาชิก)
                                    <div></div>
                                    <div class="field-label-en">Group Documents</div>
                                </div>
                                <v-file-input v-model="form.groupDocs" accept=".pdf,.doc,.docx" multiple show-size chips
                                    hint="รองรับ PDF, DOC" persistent-hint />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    เอกสารแปลง (สำเนาโฉนด, ผลวิเคราะห์น้ำ)
                                    <div></div>
                                    <div class="field-label-en">Plot Documents</div>
                                </div>
                                <v-file-input v-model="form.docs" accept=".pdf,.doc,.docx" multiple show-size chips
                                    hint="รองรับ PDF, DOC" persistent-hint />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    <div>รูปภาพแปลงปลูก</div>
                                    <div class="field-label-en">Plot Photos</div>
                                </div>
                                <v-file-input v-model="form.photos" prepend-icon="fas fa-camera" accept="image/*"
                                    multiple show-size chips hint="JPG, PNG" persistent-hint />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- Step 5: ตรวจสอบ -->
            <v-window-item :value="4">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-staff">fas fa-users</v-icon>
                        <span class="text-subtitle-2">ข้อมูลแปลง</span>
                    </div>
                    <v-card-text class="pa-5">

                        <v-card variant="flat" class="pa-6 rounded-xl bg-white mt-n5">
                            <div class="text-subtitle-1 font-weight-bold mb-4">แผนการผลิตพืชอินทรีย์
                            </div>
                            <v-row dense>
                                <v-table density="compact" class="border rounded-lg mb-2 crop-table custom-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center font-weight-bold border" style="min-width: 220px">
                                                ชนิดพืช
                                            </th>
                                            <th class="text-center font-weight-bold border" style="width: 100px">
                                                ขนาดพื้นที่
                                                (ไร่)</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                จำนวนต้น
                                                (เฉพาะไม้ผล)</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                จำนวนรอบการผลิต/ปี</th>
                                            <th class="text-center font-weight-bold border">ช่วงเวลาผลิต(ระบุเดือน)</th>
                                            <th class="text-center font-weight-bold border">วันที่คาดว่าจะเก็บเกี่ยว
                                            </th>
                                            <th class="text-center font-weight-bold border">ปริมาณผลผลิตที่คาดว่าจะได้
                                                (กก.)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in activeStandardData.crops" :key="index">
                                            <td class="border pa-1">
                                                <v-autocomplete v-model="item.name"
                                                    :items="['มะม่วงน้ำดอกไม้', 'มะม่วงอกร่อง', 'ทุเรียนหมอนทอง', 'มังคุด']"
                                                    variant="outlined" density="compact" hide-details rounded="lg"
                                                    placeholder="ค้นหาพืช..."></v-autocomplete>
                                            </td>
                                            <td class="border pa-1"><v-text-field v-model="item.area" variant="outlined"
                                                    density="compact" hide-details rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.age" variant="outlined"
                                                    density="compact" hide-details rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.quantity"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.period"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.harvest"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>
                                            <td class="border pa-1"><v-text-field v-model="item.yield"
                                                    variant="outlined" density="compact" hide-details
                                                    rounded="lg"></v-text-field></td>

                                        </tr>
                                        <tr v-if="activeStandardData.crops.length === 0">
                                            <td colspan="9" class="pa-10 text-center text-grey italic">
                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-row>
                        </v-card>

                        <v-card rounded="xl" elevation="0" class="section-card ">
                            <v-card-text class="pa-5">
                                <v-radio-group v-model="step1Review.result" color="success" inline hide-details
                                    class="mb-5">
                                    <v-radio value="conversion" label="ระยะปรับเปลี่ยน" class="mr-4"></v-radio>
                                    <v-radio value="certify" label="จัดทำใบรับรอง" class="mr-4"></v-radio>
                                    <v-radio value="re-inspect" label="นัดตรวจแปลงใหม่" class="mr-4"></v-radio>
                                    <v-radio value="re-document" label="ตรวจสอบเอกสารใหม่" class="mr-4"></v-radio>
                                    <v-radio value="revoke" label="เพิกถอน" class="mr-4"></v-radio>
                                    <v-radio value="cancel" label="ยกเลิกแปลง" class="mr-4"></v-radio>
                                    <v-radio value="fail"label="ไม่ผ่าน" class="mr-4">
                                    </v-radio>
                                </v-radio-group>
                                <v-row align="center" class="mb-5" no-gutters>
                                    <v-col cols="12" md="1" class="text-subtitle-2 font-weight-bold">ระยะเวลา</v-col>
                                    <v-col cols="12" md="3" class="px-2">
                                        <v-menu v-model="dateMenu" :close-on-content-click="false">
                                            <template #activator="{ props }">
                                                <v-text-field v-bind="props" v-model="formattedDate"
                                                    placeholder="เลือกวันที่" readonly variant="outlined" density="compact"
                                                    hide-details bg-color="white"
                                                    prepend-inner-icon="fas fa-calendar"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="step1Review.date"
                                                @update:model-value="dateMenu = false"></v-date-picker>
                                        </v-menu>
                                    </v-col>
                                    <v-col cols="12" md="2" class="px-2">
                                        <v-text-field v-model.number="step1Review.days" type="number"
                                            placeholder="จำนวนวัน" variant="outlined" density="compact" hide-details
                                            bg-color="white"></v-text-field>
                                    </v-col>
                                    <v-col cols="auto" class="text-subtitle-2 ml-2">วัน</v-col>
                                </v-row>

                                <v-row no-gutters>
                                    <v-col cols="12" md="1"
                                        class="text-subtitle-2 font-weight-bold pt-2">หมายเหตุ/เหตุผล</v-col>
                                    <v-col cols="12" md="11" class="pl-2">
                                        <v-textarea v-model="step1Review.remark" variant="outlined" density="compact"
                                            hide-details rows="3" bg-color="white"
                                            placeholder="ระบุเหตุผลหรือข้อสังเกต..."></v-textarea>
                                    </v-col>
                                </v-row>
                            </v-card-text>
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
                <v-btn variant="tonal" color="org-staff" prepend-icon="fas fa-floppy-disk"
                    @click="saveDraft">บันทึกแบบร่าง</v-btn>
                <v-btn v-if="currentStep < steps.length - 1" color="org-staff" append-icon="fas fa-arrow-right"
                    @click="nextStep">ถัดไป</v-btn>
                <v-btn v-else color="org-staff" prepend-icon="fas fa-paper-plane"
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
                        เลขที่คำขอ: <strong class="text-org-staff">GAP-2569-012</strong><br />
                        ประเภท: <strong>รายกลุ่ม</strong> · สมาชิก
                        {{ members.length }} คน<br />
                        เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
                    </p>
                    <v-btn color="org-staff" block @click="goToApplicationList">ดูรายการคำขอ</v-btn>
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
import { ref, reactive, onMounted, defineComponent, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const router = useRouter();
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
const dialogVisible = ref(false)
const activeIndex = ref(null)
const activeStandard = ref(null)

// ข้อมูลสถานะหน้าหลัก
const standards = ref([
    { title: 'มาตรฐาน 1', isCompleted: true },
    { title: 'มาตรฐาน n', isCompleted: false }
])

// ข้อมูลชั่วคราวสำหรับตัวอย่างการบันทึก (ในระบบจริงควรดึงจาก DB ตาม ID มาตรฐาน)
const activeStandardData = reactive({
    plantCategory: null,
    crops: []
})

const openCropDialog = (index) => {
    activeIndex.value = index
    activeStandard.value = standards.value[index]

    // จำลองการดึงข้อมูลเดิม (ถ้ามี)
    if (activeStandard.value.isCompleted) {
        activeStandardData.plantCategory = 'พืชอาหาร'
        activeStandardData.crops = [
            { name: 'มะม่วงน้ำดอกไม้', area: '10', age: '5 ปี', quantity: '400', period: '4 เดือน', harvest: 'มิ.ย.', yield: '5000', farmId: '7301-2569-001' }
        ]
    } else {
        activeStandardData.plantCategory = null
        activeStandardData.crops = []
        addCropRow() // เพิ่มแถวเปล่ารอไว้
    }

    dialogVisible.value = true
}

const addCropRow = () => {
    activeStandardData.crops.push({
        name: null, area: '', age: '', quantity: '', period: '', harvest: '', yield: '', farmId: ''
    })
}

const removeCropRow = (idx) => {
    activeStandardData.crops.splice(idx, 1)
}

const saveCropData = () => {
    // Update UI หน้าหลัก
    standards.value[activeIndex.value].isCompleted = true
    dialogVisible.value = false
    snackbar.value = true
}

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
        requestNo: "ORG-2569-00041",
        submittedAt: "15 ม.ค. 2569",
        certType: "มกษ. 9001",
        province: "เชียงใหม่",
        status: "reviewing",
        currentStep: 5,
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
        color: "org-staff",
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

const application = {
    requestNo: "EXP-0001",
    requestType: "ขึ้นทะเบียน",
    submittedDate: "01/01/2569",
    typecert: "คำขอหนังสือสำคัญแสดงการขึ้นทะเบียนโรงงานผลิตสินค้าพืช",
    status: "pending",
    currentStep: 1,

    applicantNameTh: "นายสมชาย ใจดี",
    applicantHouseNo: "123",
    applicantMoo: "3",
    applicantRoad: "พหลโยธิน",
    applicantTambol: "ลาดยาว",
    applicantDistrict: "จตุจักร",
    applicantProvince: "กรุงเทพมหานคร",
    applicantZipcode: "10900",
    applicantPhone: "02-123-4567",
    applicantFax: "-",
    applicantEmail: "somchai@example.com",

    companyNameTh: "บริษัท ไทย เอ็กซ์พอร์ต จำกัด",
    companyNameEn: "Thai Export Co., Ltd.",
    houseNo: "88/1",
    road: "สุขุมวิท",
    tambol: "บางปะกง",
    district: "บางปะกง",
    province: "ฉะเชิงเทรา",
    zipcode: "24130",
    houseNoEn: "88/1",
    roadEn: "Sukhumvit",
    tambolEn: "Bang Pakong",
    districtEn: "Bang Pakong",
    provinceEn: "Chachoengsao",
    zipcodeEn: "24130",
    companyPhone: "038-123-456",
    companyFax: "038-123-457",
    companyEmail: "info@thaiexport.co.th",

    countries: ["สหภาพยุโรป", "ญี่ปุ่น", "สิงคโปร์"],

    factories: [
        {
            doaNo: "DOA-12345",
            factoryName: "โรงบรรจุสินค้าไทยเอ็กซ์พอร์ต 1",
            expiryDate: "01/01/2570",
        },
        {
            doaNo: "DOA-12346",
            factoryName: "โรงรมทรีทเม้นต์ไทยเอ็กซ์พอร์ต",
            expiryDate: "01/06/2570",
        },
    ],

    gaps: [
        {
            gapNo: "GAP-00123",
            siteName: "สวนมะม่วงไทยเอ็กซ์พอร์ต",
            certBody: "กรมวิชาการเกษตร (DOA)",
            expiryDate: "01/03/2570",
        },
        {
            gapNo: "GAP-00456",
            siteName: "สวนมะละกอไทยเอ็กซ์พอร์ต",
            certBody: "สำนักงานเกษตรจังหวัด",
            expiryDate: "15/06/2570",
        },
    ],

    attachments: [
        { label: "หนังสือรับรองบริษัท" },
        { label: "สำเนาบัตรประชาชนกรรมการ" },
        { label: "หนังสือสำคัญขึ้นทะเบียนโรงงาน (DOA)" },
        { label: "หนังสือรับรอง GAP" },
    ],

    activityLog: [
        {
            type: "submit",
            action: "ยื่นคำขอ",
            actor: "นายสมชาย ใจดี (ผู้ยื่นคำขอ)",
            timestamp: "01/01/2569 09:12",
            remark: "",
        },
        {
            type: "receive",
            action: "รับคำขอเข้าสู่ระบบ",
            actor: "น.ส.วรรณา จันทร์ดี (เจ้าหน้าที่รับเรื่อง)",
            timestamp: "01/01/2569 10:45",
            remark: "ตรวจสอบเอกสารเบื้องต้นครบถ้วน",
        },
    ],
};

const step1Review = reactive({ result: "pass", remark: "", deadline: null });
const deadlineMenu = ref(false);
const deadlineBE = computed(() => {
    if (!step1Review.deadline) return "";
    const d = step1Review.deadline;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear() + 543}`;
});
onMounted(() => {
});
</script>

<style scoped>
div {
    --step-color: rgb(var(--v-theme-org-staff));
    --step-color-tint: rgba(var(--v-theme-org-staff), 0.2);
}

.member-row {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-theme-surface-variant), 0.5);
}

.step-done,
.step-active {
    background: rgb(var(--v-theme-org-staff)) !important;
    color: white !important;
}

.step-active {
    box-shadow: 0 0 0 4px rgba(var(--v-theme-org-staff), 0.2) !important;
}

.step-line--done {
    background: rgb(var(--v-theme-org-staff)) !important;
}

.field-section-label {
    color: rgb(var(--v-theme-org-staff)) !important;
}

:deep(.radio-farm .v-selection-control-group) {
    grid-area: control;
    display: flex;
    justify-content: center;
}
</style>
