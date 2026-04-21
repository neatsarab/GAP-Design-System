<template>
    <div style="--v-theme-primary: var(--v-theme-gap-staff)">
        <div class="d-flex align-center ga-3 mb-5 flex-wrap">
            <v-btn variant="text" prepend-icon="fas fa-arrow-left" size="small"
                @click="viewPage === 'cl02-form' ? viewPage = 'main' : goToApplicationList()">
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

        <div v-if="viewPage === 'main'">
            <v-card rounded="xl" elevation="0" class="mb-6 section-card">
                <v-card-text class="pa-5">
                    <div class="d-flex align-center">
                        <template v-for="(step, i) in steps" :key="step.value">
                            <div class="step-item d-flex flex-column align-center" style="min-width: 80px">
                                <div class="step-circle mb-1" :class="stepClass(step.value)">
                                    <v-icon v-if="currentStep > step.value" icon="fas fa-check" size="14"
                                        color="white" />
                                    <span v-else class="text-caption font-weight-bold">{{
                                        step.value + 1
                                    }}</span>
                                </div>
                                <div class="text-caption text-center" :class="currentStep >= step.value
                                    ? 'text-gap-staff font-weight-bold'
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
                <v-window-item :value="0">
                </v-window-item>

                <v-window-item :value="1">
                    <v-card elevation="0" rounded="xl">
                        <div class="section-header">
                            <v-icon size="15" color="gap-staff">fas fa-users</v-icon>
                            <span class="text-subtitle-2">ข้อมูลรายละเอียด</span>
                            <v-spacer />
                        </div>
                        <v-card-text class="pa-4">
                            <v-card rounded="lg" elevation="0" class="pa-6 mb-6 bg-white">
                                <h3 class="text-body-1 font-weight-bold mb-4">6. เอกสารประกอบคำขอ</h3>
                                <h4 class="text-body-1 mb-4">ทั้งนี้ข้าพเจ้าได้แนบ/แสดงเอกสารประกอบคำขอประกอบด้วย</h4>
                                <v-card variant="flat" class="pa-1 rounded-lg">
                                    <v-checkbox
                                        label="ใบอนุญาต/หนังสือสำคัญ กรณีการผลิตพืชสมุนไพรที่ต้องได้รับอนุญาตผลิต(ปลูก) ตามกฎหมายที่เกี่ยวข้อง เช่น กัญชาและกัญชง และอื่นๆ"
                                        density="compact" hide-details></v-checkbox>
                                    <div class="d-flex align-center ">
                                        <v-checkbox label="บันทึกเอกสารเพิ่มเติม (ถ้ามี)" density="compact" hide-details
                                            class="flex-shrink-0"></v-checkbox>
                                        <v-text-field variant="underlined" density="compact" hide-details
                                            class="ml-2 mt-n2"></v-text-field>
                                    </div>
                                    <v-checkbox label="โฉนดที่ดิน" density="compact" hide-details></v-checkbox>
                                    <v-checkbox label="หนังสืออนุญาตใช้ประโยชน์ที่ดิน" density="compact"
                                        hide-details></v-checkbox>
                                </v-card>
                                <v-row dense class="mt-2">
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">กรรมสิทธิ์ :</div>
                                        <v-select :items="['เจ้าของกรรมสิทธิ์', 'เช่า ระบุเจ้าของ', 'ได้สิทธิ์ทำกิน']"
                                            variant="outlined" rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <div class="field-label mb-1">เอกสารการถือครองที่ดิน :</div>
                                        <v-select :items="['โฉนดที่ดิน', 'น.ส.3', 'ส.ป.ก.4-01']" variant="outlined"
                                            rounded="lg" density="compact" hide-details />
                                    </v-col>
                                    <v-col cols="12" class="mt-2">
                                        <div class="field-label mb-1">เลขที่เอกสารการถือครองที่ดิน :</div>
                                        <v-text-field placeholder="กรอกเลขที่โฉนด/เลขที่เอกสาร" variant="outlined"
                                            rounded="lg" density="compact" hide-details />
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-card-text>
                    </v-card>
                </v-window-item>

                <v-window-item :value="2">
                    <v-card elevation="0" border rounded="xl" class="mb-4">
                        <div class="section-header border-b">
                            <v-icon size="15" color="gap-staff">fas fa-location-dot</v-icon>
                            <span class="text-subtitle-2">ข้อมูลแปลง</span>
                        </div>
                        <v-card-text class="pt-5">
                            <div class="field-section-label mb-2">ที่ตั้งฟาร์ม</div>
                            <v-row dense>
                                <v-col cols="12" md="4">
                                    <div class="field-label">ชื่อหมู่บ้าน</div>
                                    <v-text-field v-model="form.village" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">Village</div>
                                    <v-text-field v-model="form.villageEn" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
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
                                    <v-text-field v-model="form.roadEn" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">ตรอก/ซอย</div>
                                    <v-text-field v-model="form.soi" rounded="lg" variant="outlined" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">Lane/Alley</div>
                                    <v-text-field v-model="form.soiEn" rounded="lg" variant="outlined" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">แขวง/ตำบล <span class="text-red">*</span></div>
                                    <v-select v-model="form.subDistrict" :items="[]" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-select>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">เขต/อำเภอ <span class="text-red">*</span></div>
                                    <v-select v-model="form.district" :items="[]" rounded="lg" variant="outlined"
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
                                            @click="viewPage = 'cl02-form'">
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
                                                <th class="text-center font-weight-bold border" style="width: 120px">
                                                    ผู้ตรวจ
                                                </th>
                                                <th class="text-center font-weight-bold border">ผลการตรวจ</th>
                                                <th class="text-center font-weight-bold border">หมายเหตุ</th>
                                                <th class="text-center font-weight-bold border">แก้ไขข้อมูล</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in activeStandardData.crops" :key="index">
                                                <td class="border pa-1 text-center text-body-2">{{ index + 1 }}</td>
                                                <td class="border pa-1"><v-text-field v-model="item.planDate"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field v-model="item.actualDate"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field v-model="item.inspector"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field v-model="item.result"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg"></v-text-field></td>
                                                <td class="border pa-1"><v-text-field v-model="item.remark"
                                                        variant="outlined" density="compact" hide-details
                                                        rounded="lg"></v-text-field></td>
                                                <td class="border pa-1 text-center">
                                                    <v-btn icon size="x-small" variant="text" color="primary">
                                                        <v-icon icon="fas fa-edit" size="14" />
                                                    </v-btn>
                                                </td>
                                            </tr>
                                            <tr v-if="activeStandardData.crops.length === 0">
                                                <td colspan="7" class="pa-10 text-center text-grey italic">
                                                    ไม่มีข้อมูล</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>

                                <v-card-text class="pa-5">
                                    <div class="field-label mb-1">
                                        <span class="text-subtitle-2 font-weight-bold">ผลการตรวจสอบ</span>
                                    </div>
                                    <v-radio-group v-model="step1Review.result" color="gap-staff" inline>
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

                <v-window-item :value="3">
                    <v-card elevation="0" border rounded="xl">
                        <div class="section-header border-b">
                            <v-icon size="15" color="gap-staff">fas fa-paperclip</v-icon>
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
                                    <v-file-input v-model="form.groupDocs" accept=".pdf,.doc,.docx" multiple show-size
                                        chips hint="รองรับ PDF, DOC" persistent-hint />
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

                <v-window-item :value="4">
                    <v-card elevation="0" border rounded="xl">
                        <div class="section-header border-b">
                            <v-icon size="15" color="success">fas fa-clipboard-check</v-icon>
                            <span class="text-subtitle-2">ตรวจสอบข้อมูลก่อนยื่น</span>
                        </div>
                        <v-card-text class="pa-5">
                            <v-row dense>
                                <v-col cols="12" sm="6">
                                    <v-list density="compact" lines="two">
                                        <v-list-item subtitle="ชื่อกลุ่ม"><v-list-item-title>{{
                                            form.groupName || "-"
                                                }}</v-list-item-title></v-list-item>
                                        <v-list-item subtitle="ประเภทกลุ่ม"><v-list-item-title>{{
                                            form.groupType || "-"
                                                }}</v-list-item-title></v-list-item>
                                        <v-list-item subtitle="ผู้แทนกลุ่ม"><v-list-item-title>{{ form.repPrefix }} {{
                                            form.repFirstName }}
                                                {{ form.repLastName }}</v-list-item-title></v-list-item>
                                        <v-list-item subtitle="จำนวนสมาชิก"><v-list-item-title>{{ members.length }} คน
                                                (กรอกแล้ว) /
                                                {{ form.memberCount }} คน (ระบุ)</v-list-item-title></v-list-item>
                                    </v-list>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-list density="compact" lines="two">
                                        <v-list-item subtitle="ชนิดพืชหลัก"><v-list-item-title>{{
                                            form.cropTypes.join(", ") || "-"
                                                }}</v-list-item-title></v-list-item>
                                        <v-list-item subtitle="พื้นที่รวม"><v-list-item-title>{{ form.totalArea }}
                                                ไร่</v-list-item-title></v-list-item>
                                        <v-list-item subtitle="จังหวัด"><v-list-item-title>{{
                                            form.province || "-"
                                                }}</v-list-item-title></v-list-item>
                                        <v-list-item
                                            subtitle="ประเภทคำขอ"><v-list-item-title>รายกลุ่ม</v-list-item-title></v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                            <v-alert type="info" variant="tonal" class="mt-4" prepend-icon="fas fa-circle-info">
                                กรุณาตรวจสอบข้อมูลให้ถูกต้อง
                                โดยเฉพาะรายชื่อสมาชิกและพื้นที่แปลงก่อนยื่น
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-window-item>
            </v-window>

            <div class="d-flex justify-space-between align-center mt-6">
                <div class="d-flex ga-2">
                    <v-btn variant="tonal" color="grey" @click="goToApplicationList">ยกเลิก</v-btn>
                    <v-btn v-if="currentStep > 0" variant="tonal" color="grey" prepend-icon="fas fa-arrow-left"
                        @click="prevStep">ย้อนกลับ</v-btn>
                </div>
                <div class="d-flex ga-2">
                    <v-btn variant="tonal" color="gap-staff" prepend-icon="fas fa-floppy-disk"
                        @click="saveDraft">บันทึกแบบร่าง</v-btn>
                    <v-btn v-if="currentStep < steps.length - 1" color="gap-staff" append-icon="fas fa-arrow-right"
                        @click="nextStep">ถัดไป</v-btn>
                    <v-btn v-else color="gap-staff" prepend-icon="fas fa-paper-plane"
                        @click="openSuccessDialog">ยื่นคำขอ</v-btn>
                </div>
            </div>
        </div>

        <div v-else-if="viewPage === 'cl02-form'">
            <v-card elevation="0" border rounded="xl">
                <div class="section-header border-b">
                    <v-icon size="15" color="gap-staff">fas fa-clipboard-list</v-icon>
                    <span class="text-subtitle-2">บันทึกผลการตรวจประเมิน</span>
                    <v-spacer />
                    <v-btn variant="outlined" color="grey" size="small" @click="viewPage = 'main'">ย้อนกลับ</v-btn>
                </div>
                <v-card-text class="pa-6">
                    <div class="field-section-label mb-2">ข้อมูลแปลงเกษตร</div>
                    <v-row>
                        <v-col cols="12" sm="12">
                            <div class="field-label mt-4 mb-n3">ช่วงวันที่นัดตรวจประเมิน</div>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="ccForm.inspectionDate" placeholder="จากวันที่" variant="outlined"
                                rounded="lg" hide-details type="date" density="compact" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="ccForm.inspectionDate" placeholder="ถึงวันที่" variant="outlined"
                                rounded="lg" hide-details type="date" density="compact" />
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="field-label">รหัสแปลง</div>
                            <v-text-field v-model="ccForm.plotId" placeholder="กรุณาระบุรหัสแปลง" variant="outlined"
                                rounded="lg" hide-details density="compact" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="field-label">พื้นที่ปลูก</div>
                            <v-text-field v-model="ccForm.plantingArea" placeholder="กรุณาระบุพื้นที่ปลูก"
                                variant="outlined" rounded="lg" hide-details density="compact">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="field-label">ปริมาณการผลิต(กิโลกรัม)</div>
                            <v-text-field v-model="ccForm.totalProduction" placeholder="กรุณาระบุปริมาณการผลิต"
                                variant="outlined" rounded="lg" hide-details density="compact">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <div class="field-label">ปีงบประมาณ</div>
                            <v-autocomplete v-model="ccForm.budgetYear" :items="['2567', '2568', '2569']"
                                placeholder="กรุณาระบุปีงบประมาณ" variant="outlined" rounded="lg" hide-details
                                density="compact">
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                    <div class="field-section-label mb-2 mt-4">พิกัดแปลงพืช</div>
                    <v-row>
                        <v-col cols="12" sm="4">
                            <div class="field-label">Latitude</div>
                            <v-text-field v-model="ccForm.plotId" placeholder="กรุณาระบุรหัสแปลง" variant="outlined"
                                rounded="lg" hide-details density="compact" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <div class="field-label">Longitude</div>
                            <v-text-field v-model="ccForm.plotId" placeholder="กรุณาระบุรหัสแปลง" variant="outlined"
                                rounded="lg" hide-details density="compact" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-btn color="success" rounded="lg" class="mt-6 w-50">เพิ่มพิกัดแปลงพืช</v-btn>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <div class="field-label">Latitude</div>
                            <v-text-field v-model="ccForm.plotId" placeholder="กรุณาระบุรหัสแปลง" variant="outlined"
                                rounded="lg" hide-details density="compact" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <div class="field-label">Longitude</div>
                            <v-text-field v-model="ccForm.plotId" placeholder="กรุณาระบุรหัสแปลง" variant="outlined"
                                rounded="lg" hide-details density="compact" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4">
                            <v-btn color="error" rounded="lg" class="mt-6 w-50">ลบพิกัดแปลงพืช</v-btn>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="field-label mb-1 mt-4">จำนวน(ต้น)</div>
                            <v-text-field v-model="ccForm.treeAmount" placeholder="กรุณาระบุจำนวนต้น" variant="outlined"
                                rounded="lg" hide-details density="compact">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="field-label mb-1 mt-4">อายุแปลง(ปี)</div>
                            <v-text-field v-model="ccForm.plotAge" placeholder="กรุณาระบุอายุแปลง" variant="outlined"
                                rounded="lg" hide-details density="compact">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="field-label mb-1 mt-4">ช่วงที่ให้ผลผลิต (ตั้งแต่)</div>
                            <v-select v-model="ccForm.harvestPeriodStart" :items="['มกราคม', 'กุมภาพันธ์', 'มีนาคม']"
                                placeholder="กรุณาระบุช่วงเวลา" variant="outlined" rounded="lg" hide-details
                                density="compact">
                            </v-select>
                        </v-col>

                        <v-col cols="12" sm="3">
                            <div class="field-label mb-1 mt-4">ช่วงที่ให้ผลผลิต (ถึง)</div>
                            <v-select v-model="ccForm.harvestPeriodEnd" :items="['เมษายน', 'พฤษภาคม', 'มิถุนายน']"
                                placeholder="กรุณาระบุช่วงเวลา" variant="outlined" rounded="lg" hide-details
                                density="compact">
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                            <div class="field-label mb-1">ประเภทแปลง</div>
                            <v-radio-group v-model="ccForm.plotType" inline hide-details density="compact">
                                <v-radio label="แปลงใหญ่" value="แปลงใหญ่" color="success" class="mr-15 mt-4"></v-radio>
                                <v-radio label="แปลงทั่วไป" value="แปลงทั่วไป" color="success" class="mt-4"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <template v-if="ccForm.plotType === 'แปลงใหญ่'">
                            <v-col cols="12" sm="6">
                                <div class="field-label mb-1">ชื่อแปลงของใหญ่</div>
                                <v-text-field v-model="ccForm.largePlotName" placeholder="ระบุชื่อแปลง"
                                    variant="outlined" rounded="lg" hide-details density="compact">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="field-label mb-1">ปีงบประมาณของแปลงใหญ่</div>
                                <v-select v-model="ccForm.largePlotFiscalYear" :items="fiscalYears"
                                    placeholder="เลือกปีงบประมาณ" variant="outlined" rounded="lg" hide-details
                                    density="compact">
                                </v-select>
                            </v-col>
                        </template>
                        <v-col cols="12" sm="12">
                            <div class="field-label mb-1 mt-4">ชนิดของแปลง</div>
                            <v-radio-group v-model="ccForm.plotCategory" inline hide-details density="compact">
                                <v-radio label="MOU" value="MOU" color="primary" class="mr-15 mt-4"></v-radio>
                                <v-radio label="DOA" value="DOA" color="primary" class="mt-4"></v-radio>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="field-label mb-1 mt-4">ปีงบประมาณ</div>
                            <v-select v-model="ccForm.budgetYear" :items="['2567', '2568', '2569']"
                                placeholder="กรุณาระบุปีงบประมาณ" variant="outlined" rounded="lg" hide-details
                                density="compact">
                            </v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="field-label mb-1 mt-4">งบประมาณ</div>
                            <v-select v-model="ccForm.budgetYear" :items="['2567', '2568', '2569']"
                                placeholder="กรุณาระบุงบประมาณ" variant="outlined" rounded="lg" hide-details
                                density="compact">
                            </v-select>
                        </v-col>



                    </v-row>

                    <v-divider class="my-6"></v-divider>
                    <div class="field-section-label mb-2 mt-5">บันทึกผลการตรวจ</div>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <div class="field-label">วันที่เข้าตรวจ</div>
                            <v-text-field v-model="ccForm.inspectionDate" placeholder="ถึงวันที่" variant="outlined"
                                rounded="lg" hide-details type="date" density="compact" />
                        </v-col>
                        <v-col cols="12" sm="6">
                            <div class="field-label">หัวหน้าทีม ผู้ทำการตรวจรับรอง</div>
                            <v-text-field v-model="ccForm.inspectionDate" placeholder="ถึงวันที่" variant="outlined"
                                rounded="lg" hide-details type="date" density="compact" />
                        </v-col>

                        <v-container>
                            <v-card variant="outlined" class="pa-6">
                                <v-row align="center" class="mb-10">
                                    <v-col cols="12" md="3">
                                        <div class="text-subtitle-1 font-weight-bold">ผู้ทำการตรวจรับรอง</div>
                                        <div class="text-subtitle-1 font-weight-bold"> (หัวหน้าทีม)</div>
                                    </v-col>
                                    <v-col cols="12" md="9">
                                        <v-row no-gutters align="center">
                                            <v-col>
                                                <v-text-field v-model="searchLead" placeholder="ค้นหา..."
                                                    variant="outlined" density="compact" hide-details
                                                    class="mb-1"></v-text-field>
                                                <v-list border height="250" class="overflow-y-auto rounded">
                                                    <v-list-item v-for="item in filteredLeads" :key="item.id"
                                                        @click="moveLead(item, 'select')">
                                                        {{ item.name }}
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>

                                            <v-col cols="auto" class="px-4 d-flex flex-column gap-2">
                                                <v-btn icon="fas fa-angle-double-right" variant="text" color="gap-staff"
                                                    @click="moveAllLeads('select')" title="ย้ายไปขวาทั้งหมด"></v-btn>

                                                <v-btn icon="fas fa-angles-left" variant="text" color="gap-staff"
                                                    @click="moveAllLeads('remove')" title="ย้ายไปซ้ายทั้งหมด"></v-btn>
                                            </v-col>

                                            <v-col>
                                                <v-text-field readonly variant="outlined" density="compact" hide-details
                                                    class="mb-1" placeholder="ค้นหา..."></v-text-field>
                                                <v-list border height="250"
                                                    class="overflow-y-auto rounded bg-grey-lighten-4">
                                                    <v-list-item v-for="item in leadSelectedList" :key="item.id"
                                                        @click="moveLead(item, 'remove')">
                                                        {{ item.name }}
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>

                                <v-divider class="mb-10"></v-divider>

                                <v-row align="center">
                                    <v-col cols="12" md="3">
                                        <div class="text-subtitle-1 font-weight-bold">ผู้ทำการตรวจรับรอง</div>
                                        <div class="text-subtitle-1 font-weight-bold">
                                            (ลูกทีม)</div>
                                    </v-col>

                                    <v-col cols="12" md="9">
                                        <v-row no-gutters align="center">
                                            <v-col>
                                                <v-text-field v-model="searchMember" placeholder="ค้นหา..."
                                                    variant="outlined" density="compact" hide-details
                                                    class="mb-1"></v-text-field>
                                                <v-list border height="250" class="overflow-y-auto rounded">
                                                    <v-list-item v-for="item in filteredMembers" :key="item.id"
                                                        @click="moveMember(item, 'select')">
                                                        {{ item.name }}
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>

                                            <v-col cols="auto" class="px-4 d-flex flex-column gap-2">
                                                <v-btn icon="fas fa-angle-double-right" variant="text" color="gap-staff"
                                                    @click="moveAllMembers('select')"></v-btn>

                                                <v-btn icon="fas fa-angle-double-left" variant="text" color="gap-staff"
                                                    @click="moveAllMembers('remove')"></v-btn>
                                            </v-col>

                                            <v-col>
                                                <v-text-field readonly variant="outlined" density="compact" hide-details
                                                    class="mb-1" placeholder="ค้นหา..."></v-text-field>
                                                <v-list border height="250"
                                                    class="overflow-y-auto rounded bg-grey-lighten-4">
                                                    <v-list-item v-for="item in memberSelectedList" :key="item.id"
                                                        @click="moveMember(item, 'remove')">
                                                        {{ item.name }}
                                                    </v-list-item>
                                                </v-list>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-container>

                    </v-row>
                    <v-row>

                        <v-col cols="12">
                            <v-checkbox v-model="isSampling" label="สุ่มตัวอย่าง" hide-details density="compact"
                                color="primary"></v-checkbox>
                        </v-col>

                        <v-col cols="12" v-if="isSampling">

                            <v-row dense>
                                <v-col cols="12" sm="4">
                                    <div class="field-label mb-1">วันที่ส่งวิเคราะห์</div>
                                    <v-text-field type="date" variant="outlined" rounded="lg" density="compact"
                                        hide-details bg-color="white"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="field-label mb-1">วันที่รายงานผลวิเคราะห์</div>
                                    <v-text-field type="date" variant="outlined" rounded="lg" density="compact"
                                        hide-details bg-color="white"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="field-label mb-1">ห้องปฏิบัติการ</div>
                                    <v-select :items="labOptions" placeholder="กรุณาระบุห้องปฏิบัติการ"
                                        variant="outlined" rounded="lg" density="compact" hide-details
                                        bg-color="white"></v-select>
                                </v-col>
                            </v-row>

                            <div class="field-label mt-4 mb-2">การสุ่มตัวอย่างที่พบ</div>

                            <v-checkbox v-model="isSoilSampling" label="วัสดุปลูก/น้ำ" hide-details density="compact"
                                color="primary"></v-checkbox>

                            <v-table v-if="isSoilSampling" density="compact" class="border rounded-lg mt-2 mb-4">
                                <thead>
                                    <tr class="bg-grey-lighten-3">
                                        <th class="text-center" style="width: 80px">ลำดับ</th>
                                        <th class="text-center">สุ่มตรวจ</th>
                                        <th class="text-center">สารตกค้าง/เชื้อปนเปื้อน</th>
                                        <th class="text-center" style="width: 150px">ค่าที่ตรวจพบ</th>
                                        <th class="text-center" style="width: 100px">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in samplingRows" :key="idx">
                                        <td class="text-center">{{ idx + 1 }}</td>
                                        <td class="pa-1">
                                            <v-select v-model="row.type" :items="['วัสดุปลูก', 'น้ำ']"
                                                variant="outlined" density="compact" hide-details rounded="lg"
                                                bg-color="white"></v-select>
                                        </td>
                                        <td class="pa-1">
                                            <v-select v-model="row.chemical" :items="chemicalOptions" variant="outlined"
                                                density="compact" hide-details rounded="lg" bg-color="white"></v-select>
                                        </td>
                                        <td class="pa-1">
                                            <v-text-field v-model="row.value" variant="outlined" density="compact"
                                                hide-details rounded="lg" bg-color="white"
                                                placeholder="0.00"></v-text-field>
                                        </td>
                                        <td class="text-center">
                                            <v-btn v-if="idx === 0" icon="fas fa-plus" size="x-small" color="success"
                                                variant="tonal" @click="addSamplingRow"></v-btn>
                                            <v-btn v-else icon="fas fa-minus" size="x-small" color="error"
                                                variant="tonal" @click="removeSamplingRow(idx)"></v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>

                            <v-checkbox label="น้ำ" hide-details density="compact" color="primary"></v-checkbox>
                            <v-checkbox label="พืช" hide-details density="compact" color="primary"></v-checkbox>

                        </v-col>


                        <v-col cols="12">
                            <v-table density="compact">
                                <tbody>
                                    <tr v-for="n in 8" :key="n">
                                        <td style="width: 40%">{{ n }}. {{ getLabel(n) }}</td>
                                        <td>
                                            <v-radio-group inline hide-details density="compact" color="success">
                                                <v-radio label="ผ่าน" value="pass" class="mr-4"></v-radio>
                                                <v-radio label="ไม่ผ่าน" value="fail" color="error"></v-radio>
                                            </v-radio-group>
                                        </td>
                                        <td>
                                            <v-text-field placeholder="หมายเหตุ" variant="outlined" density="compact"
                                                hide-details rounded="lg" class="my-1"></v-text-field>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row>
                    <v-divider class="my-6"></v-divider>
                    <v-row dense v-for="type in ['ข้อกำหนดหลัก', 'ข้อกำหนดรอง', 'ข้อแนะนำ']" :key="type" class="mb-4"
                        align="center">
                        <v-col cols="12" sm="3" class="text-sm-left pr-4">
                            <div class="field-label font-weight-bold">{{ type }}</div>
                        </v-col>
                        <v-col cols="12" sm="9">
                            <v-row dense>
                                <v-col cols="12" sm="3">
                                    <div class="text-caption">ใช่ (ข้อ)</div>
                                    <v-text-field variant="outlined" rounded="lg" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <div class="text-caption">ไม่ใช่ (ข้อ)</div>
                                    <v-text-field variant="outlined" rounded="lg" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <div class="text-caption">NA (ข้อ)</div>
                                    <v-text-field variant="outlined" rounded="lg" density="compact"
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3" v-if="type !== 'ข้อกำหนดหลัก'">
                                    <div class="text-caption">คิดเป็น (%)</div>
                                    <v-text-field variant="outlined" rounded="lg" density="compact" hide-details
                                        suffix="%"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-card rounded="xl" elevation="0" class="section-card mb-4">
                        <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                            <span class="text-subtitle-2 font-weight-bold">เอกสารแนบ</span>
                        </div>
                        <v-card-text class="pa-4">
                            <div v-for="doc in application.attachments" :key="doc.label"
                                class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between">
                                <div class="text-body-2">{{ doc.label }}</div>
                                <v-btn size="x-small" variant="tonal" color="gap-staff" rounded="lg"
                                    prepend-icon="fas fa-download">
                                    ดาวน์โหลด
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card rounded="xl" elevation="0" class="section-card">
                        <v-card-text class="pa-5">
                            <!-- ผลการตรวจสอบ -->
                            <div class="field-label mb-1">
                                <span class="text-subtitle-2 font-weight-bold">ผลการตรวจสอบ</span>
                            </div>
                            <v-radio-group v-model="step1Review.result" color="gap-staff" inline>
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
                                 <v-radio value="improve" class="mr-6">
                                    <template #label>
                                        <div class="d-flex align-center ga-2">
                                            <v-icon icon="fas fa-circle-exclamation" color="warning" size="18" />
                                            <span class="font-weight-medium">นัดตรวจใหม่</span>
                                        </div>
                                    </template>
                                </v-radio>
                                <v-radio value="adddoc" class="mr-6">
                                    <template #label>
                                        <div class="d-flex align-center ga-2">
                                            <v-icon icon="fas fa-circle-exclamation" color="warning" size="18" />
                                            <span class="font-weight-medium">ขอเอกสารเพิ่มเติม</span>
                                        </div>
                                    </template>
                                </v-radio>
                                <v-radio value="cancel">
                                    <template #label>
                                        <div class="d-flex align-center ga-2">
                                            <v-icon icon="fas fa-circle-xmark" color="error" size="18" />
                                            <span class="font-weight-medium">ยกเลิกแปลง</span>
                                        </div>
                                    </template>
                                </v-radio>
                            </v-radio-group>

                            <!-- หมายเหตุ -->
                            <div class="field-label mb-1">
                                <span class="text-subtitle-2 font-weight-bold">หมายเหตุ</span>
                            </div>
                            <v-textarea v-model="step1Review.remark" variant="outlined" density="compact" rounded="lg"
                                hide-details rows="4" placeholder="ระบุเหตุผลหรือข้อสังเกต..." class="mb-5" />
                        </v-card-text>
                    </v-card>
                    <div class="text-center ">
                        <v-row class="d-flex justify-center ga-4 mb-2 mr-2">
                            <v-spacer></v-spacer>
                            <v-btn color="grey" rounded="lg" class="mt-4" @click="viewPage = 'main'">กลับ</v-btn>
                            <v-btn color="gap-staff" rounded="lg" class="mt-4" @click="viewPage = 'main'">บันทึก</v-btn>
                        </v-row>

                    </div>
                </v-card-text>
            </v-card>
        </div>

        <v-dialog v-model="successDialog" max-width="440" persistent>
            <v-card rounded="xl">
                <v-card-text class="pa-8 text-center">
                    <v-icon icon="fas fa-circle-check" color="success" size="64" class="mb-4" />
                    <h2 class="text-h6 font-weight-bold mb-2">ยื่นคำขอสำเร็จ!</h2>
                    <p class="text-body-2 text-medium-emphasis mb-5">
                        เลขที่คำขอ: <strong class="text-gap-staff">GAP-2569-012</strong><br />
                        ประเภท: <strong>รายกลุ่ม</strong> · สมาชิก
                        {{ members.length }} คน<br />
                        เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
                    </p>
                    <v-btn color="gap-staff" block @click="goToApplicationList">ดูรายการคำขอ</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="draftSnackbar" color="success" rounded="lg" timeout="2500" location="top right">
            <v-icon icon="fas fa-floppy-disk" class="mr-2" />
            บันทึกแบบร่างแล้ว
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineComponent, computed, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ── New State for Page Navigation ──
const viewPage = ref('main'); // 'main' หรือ 'cl02-form'

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
    village: "",
    villageEn: "",
    moo: "",
    road: "",
    roadEn: "",
    soi: "",
    soiEn: "",
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

const ccActionType = ref('propose'); // ค่าเริ่มต้น
const ccForm = reactive({
    result: null,               // ผลการตรวจแปลง
    personInCharge: null,       // ผู้ที่ทำการรับรอง
    fiscalYear: null,           // ปีงบประมาณ
    inspectionDate: '',         // วันที่เข้าตรวจ
    plotCode: '',               // รหัสแปลง
    plantingArea: '',           // พื้นที่ปลูก
    productionQuantity: '',     // ปริมาณการผลิต (รวม)
    latitude: '',               // พิกัด Lat
    longitude: '',              // พิกัด Long
    treeCount: '',              // จำนวน(ต้น)
    plotAge: '',                // อายุแปลง(ปี)
    harvestMonthStart: null,    // ช่วงผลผลิต (เริ่ม)
    harvestMonthEnd: null,      // ช่วงผลผลิต (จบ)
    productionPerPeriod: '',    // ปริมาณการผลิต (ช่วงเวลา)
    inspectionCount: '',        // ครั้งที่ทำการตรวจ

    plotType: 'แปลงทั่วไป', // แปลงใหญ่, แปลงทั่วไป
    largePlotName: '',
    largePlotFiscalYear: null,
    plotCategory: 'DOA', // MOU, DOA
    fiscalYear: null,
    budget: null,

    // ส่วนสุ่มตัวอย่าง
    isSampling: false,
    analysisDate: '',
    reportDate: '',
    laboratory: '',
    samplingFound: []           // สำหรับเก็บ [ 'วัสดุปลูก', 'น้ำ', 'พืช' ]
});
const provinces = [
    "กรุงเทพมหานคร", "เชียงใหม่", "ขอนแก่น", "นครราชสีมา", "สุพรรณบุรี", "เพชรบูรณ์",
];
// ฟังก์ชันสำหรับคืนค่าชื่อหัวข้อ 1-8 ตามรูปภาพ
const getLabel = (n) => {
    const labels = {
        1: "น้ำ",
        2: "พื้นที่ปลูก",
        3: "วัตถุอันตรายทางการเกษตร",
        4: "การจัดการกระบวนการผลิตก่อนการเก็บเกี่ยว",
        5: "การเก็บเกี่ยวและการปฏิบัติหลังการเก็บเกี่ยว",
        6: "การพักผลิตผล การขนย้าย และการเก็บเกี่ยว", // ตาม text ในรูป
        7: "บุคลากร",
        8: "เอกสาร บันทึกข้อมูล และการตามสอบ"
    };
    return labels[n] || "";
};
const isSampling = ref(false); // Checkbox สุ่มตัวอย่างหลัก
const isSoilSampling = ref(false); // Checkbox วัสดุปลูก/น้ำ
const labOptions = ['ห้องปฏิบัติการกรมวิชาการเกษตร', 'ห้องปฏิบัติการเอกชน A'];
const chemicalOptions = ['สารพิษ/ Abamactin', 'โลหะหนัก/ แคดเมียม'];

const samplingRows = ref([
    { type: 'วัสดุปลูก', chemical: 'สารพิษ/ Abamactin', value: '0.00' }
]);

const addSamplingRow = () => {
    samplingRows.value.push({ type: null, chemical: null, value: '' });
};

const removeSamplingRow = (index) => {
    samplingRows.value.splice(index, 1);
};

const activeStandardData = reactive({
    plantCategory: null,
    crops: [

    ]
});

function goToApplicationList() {
    router.push({ name: "staffApplicationList" });
}

const route = useRoute();
const appId = route.params.id;

const mockApps = {
    "APP-001": {
        id: "APP-001",
        requestNo: "GAP-2569-00041",
        submittedAt: "15 ม.ค. 2569",
        certType: "มกษ. 9001",
        province: "เชียงใหม่",
        status: "reviewing",
        currentStep: 3,
        plots: [{ area: 8 }, { area: 4 }]
    }
};

const app = ref(mockApps[appId] ?? mockApps["APP-001"]);
const currentStep = computed({
    get: () => app.value.currentStep - 1,
    set: (val) => app.value.currentStep = val + 1
});

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

const statusMap = {
    reviewing: { color: "warning", icon: "fas fa-magnifying-glass", label: "รอตรวจคำขอ" }
};
const statusColor = computed(() => statusMap[app.value.status]?.color ?? "grey");
const statusIcon = computed(() => statusMap[app.value.status]?.icon ?? "fas fa-circle");
const statusLabel = computed(() => statusMap[app.value.status]?.label ?? app.value.status);

const step1Review = reactive({ result: "pass", remark: "" });

const rawData = [
    { id: 1, name: 'กัลยา ธรรมเรือน' },
    { id: 2, name: 'ชญานันท์ โค้วอินทร์' },
    { id: 3, name: 'ชญานันท์ โค้วอินทร์ (2)' },
    { id: 4, name: 'ชูรีพร ปันดอย' },
    { id: 5, name: 'ณิชาภรณ์ โกศล' },
    { id: 6, name: 'ทิพย์วิมล แก้วพรัตน์' },
];
// --- Logic หัวหน้าทีม ---
const searchLead = ref('')
const leadAvailableList = ref([...rawData])
const leadSelectedList = ref([])

const filteredLeads = computed(() =>
    leadAvailableList.value.filter(item => item.name.includes(searchLead.value))
)

const moveLead = (item, type) => {
    if (type === 'select') {
        leadSelectedList.value.push(item)
        leadAvailableList.value = leadAvailableList.value.filter(i => i.id !== item.id)
    } else {
        leadAvailableList.value.push(item)
        leadSelectedList.value = leadSelectedList.value.filter(i => i.id !== item.id)
    }
}

const moveAllLeads = (type) => {
    if (type === 'select') {
        leadSelectedList.value.push(...leadAvailableList.value)
        leadAvailableList.value = []
    } else {
        leadAvailableList.value.push(...leadSelectedList.value)
        leadSelectedList.value = []
    }
}

// --- Logic ลูกทีม ---
const searchMember = ref('')
const memberAvailableList = ref([...rawData])
const memberSelectedList = ref([])

const filteredMembers = computed(() =>
    memberAvailableList.value.filter(item => item.name.includes(searchMember.value))
)

const moveMember = (item, type) => {
    if (type === 'select') {
        memberSelectedList.value.push(item)
        memberAvailableList.value = memberAvailableList.value.filter(i => i.id !== item.id)
    } else {
        memberAvailableList.value.push(item)
        memberSelectedList.value = memberSelectedList.value.filter(i => i.id !== item.id)
    }
}

const moveAllMembers = (type) => {
    if (type === 'select') {
        memberSelectedList.value.push(...memberAvailableList.value)
        memberAvailableList.value = []
    } else {
        memberAvailableList.value.push(...memberSelectedList.value)
        memberSelectedList.value = []
    }
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
onMounted(() => { });
</script>

<style scoped>
div {
    --step-color: rgb(var(--v-theme-gap-staff));
    --step-color-tint: rgba(var(--v-theme-gap-staff), 0.2);
}

.member-row {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-theme-surface-variant), 0.5);
}

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

.field-section-label {
    color: rgb(var(--v-theme-gap-staff)) !important;
}

:deep(.radio-farm .v-selection-control-group) {
    grid-area: control;
    display: flex;
    justify-content: center;
}
</style>
