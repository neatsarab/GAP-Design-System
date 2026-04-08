<template>
    <div style="--v-theme-primary: var(--v-theme-org-user)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
            <div>
                <div class="d-flex align-center ga-2 mb-1">
                    <v-chip size="x-small" color="org-user" variant="tonal"
                        prepend-icon="fas fa-users">รายเดี่ยว</v-chip>
                </div>
                <h1 class="page-title mb-0">แบบคำขอใบรับรองมาตรฐาน ORG</h1>
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
                                ? 'text-org-user font-weight-bold'
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
                        <v-icon size="15" color="org-user">fas fa-users</v-icon>
                        <span class="text-subtitle-2">ข้อมูลรายละเอียด</span>
                    </div>
                    <v-card-text class="pa-5">
                        <div class="text-subtitle-1 font-weight-bold mb-4 ml-5">1. ข้าพเจ้ามีความประสงค์ขอยกเลิก</div>
                        <v-row dense class="ml-5">
                            <v-col cols="12">
                                <v-checkbox v-model="form.cancelType" value="application" density="compact"
                                    hide-details>
                                    <template v-slot:label>
                                        <div>
                                            แบบคำขอใบรับรอง
                                        </div>
                                    </template>
                                </v-checkbox>

                                <div class="d-flex align-center">
                                    <v-checkbox v-model="form.cancelType" value="certificate" label="ใบรับรอง"
                                        density="compact" hide-details></v-checkbox>
                                    <span class="text-body-2 ml-4">(ตามแนบ)</span>
                                    <v-checkbox v-model="form.isLost" label="สูญหาย" density="compact" hide-details
                                        class="ml-6"></v-checkbox>
                                </div>
                            </v-col>
                        </v-row>

                        <v-card variant="flat" class="pa-6 mb-6 rounded-xl">
                            <div class="text-subtitle-1 font-weight-bold mb-4">2. ชื่อผู้ยื่นคำขอ (บุคคล/ กลุ่มบุคคล/
                                นิติบุคคล)
                            </div>
                            <v-row dense>
                                <v-col cols="12">
                                    <div class="field-label">เลขที่บัตรประชาชน / เลขทะเบียนนิติบุคคล *</div>
                                    <v-text-field v-model="form.idNumber" placeholder="x-xxxx-xxxxx-xx-x"
                                        variant="outlined" rounded="lg" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ที่อยู่/สำนักงาน เลขที่</div>
                                    <v-text-field v-model="form.addressNo" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ชื่อหมู่บ้าน</div>
                                    <v-text-field v-model="form.village" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">ตำบล/แขวง</div>
                                    <v-text-field v-model="form.subDistrict" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">อำเภอ/เขต</div>
                                    <v-text-field v-model="form.district" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">จังหวัด</div>
                                    <v-select :items="provinces" v-model="form.province" variant="outlined" rounded="lg"
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
                                    <div class="field-label">โทรศัพท์มือถือ</div>
                                    <v-text-field v-model="form.mobile" variant="outlined" rounded="lg"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>

                        <v-card variant="flat" class="pa-6 mb-6 rounded-xl mt-n5">
                            <v-table density="compact" class="border rounded-lg mt-5">
                                <thead class="bg-grey-lighten-3">
                                    <tr>
                                        <th class="border text-center">ชนิดพืช/พันธุ์/ผลิตภัณฑ์</th>
                                        <th class="border text-center">รหัสแปลง</th>
                                        <th class="border text-center">รหัสรับรอง</th>
                                        <th class="border text-center">ที่ตั้งแหล่งผลิต/สถานที่ประกอบการ</th>
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
                            <div class="text-caption text-grey-darken-1 mt-2">หมายเหตุ :
                                กรณีมีชนิดพืชมากกว่าตารางที่กำหนด
                                โปรดแนบข้อมูลเพิ่มเติม</div>
                        </v-card>

                        <v-card variant="outlined" color="blue" class="pa-6 mb-6 mt-n10">
                            <div class="text-subtitle-1 font-weight-bold mb-4 text-black">3. เหตุผลในการขอยกเลิก</div>
                            <v-textarea v-model="form.cancelReason" placeholder="ระบุเหตุผลในการขอยกเลิกการรับรอง..."
                                variant="outlined" rounded="lg" density="compact" hide-details rows="5"
                                bg-color="white"></v-textarea>
                            <div class="text-body-2 font-weight-bold mt-4 text-black">
                                ข้าพเจ้าขอรับรองว่าเอกสาร หลักฐาน และข้อความข้างต้นเป็นความจริงทุกประการ
                            </div>
                        </v-card>

                        <v-card variant="flat" class="pa-6 rounded-xl mt-n10">
                            <div class="text-subtitle-1 font-weight-bold mb-2">แนบไฟล์ (ถ้ามี)</div>
                            <v-file-input label="เลือกไฟล์เอกสารแนบ" variant="outlined" rounded="lg" density="compact"
                                hide-details prepend-icon="mdi-paperclip" bg-color="white" multiple></v-file-input>
                        </v-card>

                    </v-card-text>
                </v-card>

            </v-window-item>

            <!-- Step 2: รายชื่อสมาชิก -->
            <v-window-item :value="1">
                <v-card elevation="0" rounded="xl">
                    <div class="section-header">
                        <v-icon size="15" color="org-user">fas fa-users</v-icon>
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

            <!-- Step 3: ที่อยู่ + แปลง (รวม) -->
            <v-window-item :value="2">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-user">fas fa-location-dot</v-icon>
                        <span class="text-subtitle-2">ที่อยู่สำนักงานกลุ่ม / แหล่งผลิตหลัก</span>
                    </div>
                    <v-card-text class="pt-5">
                        <v-row dense>
                            <v-col cols="12" sm="9">
                                <div class="field-label">
                                    <div>ที่อยู่ <span class="req">*</span></div>
                                    <div class="field-label-en">Address</div>
                                </div>
                                <v-textarea variant="outlined" density="compact" rounded="lg" v-model="form.address"
                                    placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน" prepend-inner-icon="fas fa-house"
                                    rows="2" auto-grow :rules="[rules.required]" hide-details="auto" />
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div class="field-label">
                                    <div>รหัสไปรษณีย์</div>
                                    <div class="field-label-en">Postal Code</div>
                                </div>
                                <v-text-field variant="outlined" density="compact" rounded="lg"
                                    v-model="form.postalCode" maxlength="5" prepend-inner-icon="fas fa-map-pin"
                                    hide-details="auto" />
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="field-label">
                                    <div>จังหวัด <span class="req">*</span></div>
                                    <div class="field-label-en">Province</div>
                                </div>
                                <v-autocomplete variant="outlined" density="compact" rounded="lg"
                                    v-model="form.province" :items="provinces" prepend-inner-icon="fas fa-map"
                                    :rules="[rules.required]" hide-details="auto" />
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="field-label">
                                    <div>อำเภอ / เขต</div>
                                    <div class="field-label-en">District</div>
                                </div>
                                <v-autocomplete variant="outlined" density="compact" rounded="lg"
                                    v-model="form.district" :items="['อำเภอเมือง', 'อำเภอปากช่อง']"
                                    prepend-inner-icon="fas fa-city" hide-details="auto" />
                            </v-col>
                            <v-col cols="12" sm="4">
                                <div class="field-label">
                                    <div>ตำบล / แขวง</div>
                                    <div class="field-label-en">Sub-district</div>
                                </div>
                                <v-autocomplete variant="outlined" density="compact" rounded="lg"
                                    v-model="form.subDistrict" :items="['ตำบลในเมือง', 'ตำบลโพธิ์กลาง']"
                                    prepend-inner-icon="fas fa-map-pin" hide-details="auto" />
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <v-card elevation="0" border rounded="xl">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-user">fas fa-seedling</v-icon>
                        <span class="text-subtitle-2">ข้อมูลการผลิตรวมกลุ่ม</span>
                    </div>
                    <v-card-text class="pt-5">
                        <div class="field-section-label mb-3">ข้อมูลการผลิต</div>
                        <v-row dense>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    ชนิดพืชหลัก (รวมกลุ่ม) <span class="req">*</span>
                                    <div class="field-label-en">Main Crop Type (Group)</div>
                                </div>
                                <v-autocomplete variant="outlined" density="compact" rounded="lg"
                                    v-model="form.cropTypes" :items="cropTypes" prepend-inner-icon="fas fa-seedling"
                                    multiple chips closable-chips :rules="[rules.required]" hide-details="auto" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    <div>ผู้ตรวจประเมิน</div>
                                    <div class="field-label-en">Inspector</div>
                                </div>
                                <v-autocomplete variant="outlined" density="compact" rounded="lg"
                                    v-model="form.inspector" :items="inspectors" prepend-inner-icon="fas fa-user-check"
                                    clearable hide-details="auto" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    พื้นที่รวมทั้งกลุ่ม (ไร่)
                                    <div></div>
                                    <div class="field-label-en">Total Group Area (Rai)</div>
                                </div>
                                <v-text-field variant="outlined" density="compact" rounded="lg"
                                    v-model.number="form.totalArea" type="number" suffix="ไร่"
                                    prepend-inner-icon="fas fa-ruler-combined" hide-details="auto" :min="0" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <div class="field-label">
                                    ข้อกำหนด GAP
                                    <div></div>
                                    <div class="field-label-en">GAP Requirements</div>
                                </div>
                                <div class="rounded-lg pa-3 bg-surface-variant">
                                    <v-checkbox v-model="form.water" label="มีแหล่งน้ำในพื้นที่" color="org-user"
                                        density="compact" hide-details class="mb-1" />
                                    <v-checkbox v-model="form.record" label="มีการบันทึกการผลิต" color="org-user"
                                        density="compact" hide-details class="mb-1" />
                                    <v-checkbox v-model="form.chemical" label="บันทึกการใช้สารเคมี" color="warning"
                                        density="compact" hide-details />
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-window-item>

            <!-- Step 4: เอกสาร -->
            <v-window-item :value="3">
                <v-card elevation="0" border rounded="xl">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-user">fas fa-paperclip</v-icon>
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

        <!-- Navigation Buttons -->
        <div class="d-flex justify-space-between align-center mt-6">
            <div class="d-flex ga-2">
                <v-btn variant="tonal" color="grey" @click="goToApplicationList">ยกเลิก</v-btn>
                <v-btn v-if="currentStep > 0" variant="tonal" color="grey" prepend-icon="fas fa-arrow-left"
                    @click="prevStep">ย้อนกลับ</v-btn>
            </div>
            <div class="d-flex ga-2">
                <v-btn variant="tonal" color="org-user" prepend-icon="fas fa-floppy-disk"
                    @click="saveDraft">บันทึกแบบร่าง</v-btn>
                <v-btn v-if="currentStep < steps.length - 1" color="org-user" append-icon="fas fa-arrow-right"
                    @click="nextStep">ถัดไป</v-btn>
                <v-btn v-else color="org-user" prepend-icon="fas fa-paper-plane"
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
                        เลขที่คำขอ: <strong class="text-org-user">GAP-2569-012</strong><br />
                        ประเภท: <strong>รายกลุ่ม</strong> · สมาชิก
                        {{ members.length }} คน<br />
                        เจ้าหน้าที่จะติดต่อกลับภายใน 3–5 วันทำการ
                    </p>
                    <v-btn color="org-user" block @click="goToApplicationList">ดูรายการคำขอ</v-btn>
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
    router.push({ name: "ORGUserApplicationList" });
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
    { value: 0, title: "ข้อมูลกลุ่ม" }
];

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
    --step-color: rgb(var(--v-theme-org-user));
    --step-color-tint: rgba(var(--v-theme-org-user), 0.2);
}

.member-row {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgba(var(--v-theme-surface-variant), 0.5);
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

.field-section-label {
    color: rgb(var(--v-theme-org-user)) !important;
}

:deep(.radio-farm .v-selection-control-group) {
    grid-area: control;
    display: flex;
    justify-content: center;
}
</style>
