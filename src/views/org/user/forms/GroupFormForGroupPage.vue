<template>
    <div style="--v-theme-primary: var(--v-theme-org-user)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="router.back()" />
            <div>
                <div class="d-flex align-center ga-2 mb-1">
                    <v-chip size="x-small" color="org-user" variant="tonal"
                        prepend-icon="fas fa-users">รายกลุ่ม</v-chip>
                </div>
                <h1 class="page-title mb-0">แบบคำขอใบรับรองมาตรฐาน ORG (รายกลุ่ม)</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    สำหรับกลุ่มเกษตรกร / วิสาหกิจชุมชน / สหกรณ์
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
        </v-card>

        <v-window v-model="currentStep">
            <!-- Step 1: ข้อมูลกลุ่ม -->
            <v-window-item :value="0">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-user">fas fa-users</v-icon>
                        <span class="text-subtitle-2">ข้อมูลรายละเอียด</span>
                    </div>
                    <v-card-text class="pa-5">
                        <v-row justify="center" class="radio-farm d-flex justify-center mb-4 mt-4">
                            <v-radio-group inline hide-details v-model="form.requestType">
                                <v-radio label="คำขอใหม่" value="new" class="mr-10"></v-radio>
                                <v-radio label="ต่ออายุ" value="renew"></v-radio>
                            </v-radio-group>
                        </v-row>
                        <v-card variant="outlined" class="pa-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4">1.
                                ข้อมูลทั่วไปเกี่ยวกับกลุ่มที่ขอรับการรับรอง
                            </div>
                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ชื่อกลุ่มที่ยื่นคำขอ (TH) *</div>
                                    <v-text-field v-model="groupForm.nameTh" placeholder="ภาษาไทย" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">Name of Group (EN) *</div>
                                    <v-text-field v-model="groupForm.nameEn"
                                        placeholder="English (Capital/Small letters as required)" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <div class="field-label">สำนักงานใหญ่/สำนักงาน ตั้งอยู่บ้านเลขที่ *</div>
                                    <v-text-field v-model="groupForm.addressNo" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ชื่อหมู่บ้าน</div>
                                    <v-text-field v-model="form.village" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">Village</div>
                                    <v-text-field v-model="form.village" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
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
                                    <div class="field-label">รหัสไปรษณีย์ <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">โทรศัพท์(Tel) <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">โทรศัพท์มือถือ(Mobile) <span class="text-red">*</span>
                                    </div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">Email <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                            </v-row>

                            <v-divider class="my-6"></v-divider>
                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ชื่อ-นามสกุล ประธานกลุ่มหรือผู้มีอำนาจลงนามของกลุ่ม</div>
                                    <v-text-field v-model="groupForm.leaderName" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">เลขที่บัตรประชาชนของผู้มีอำนาจลงสนามของกลุ่ม</div>
                                    <v-text-field v-model="groupForm.leaderId" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">เลขทะเบียนนิติบุคคล</div>
                                    <v-text-field v-model="groupForm.leaderId" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">บ้านเลขที่</div>
                                    <v-text-field v-model="form.village" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ชื่อหมู่บ้าน</div>
                                    <v-text-field v-model="form.village" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
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
                                    <div class="field-label">ตรอก/ซอย</div>
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
                                    <div class="field-label">รหัสไปรษณีย์ <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">โทรศัพท์ <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">โทรศัพท์มือถือ <span class="text-red">*</span>
                                    </div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">โทรสาร <span class="text-red">*</span>
                                    </div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">Email <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>


                        <v-card variant="flat" class="pa-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-2">2. บุคคลที่สามารถติดต่อได้ (อย่างน้อย 1
                                คน)</div>
                            <div class="text-caption text-grey-darken-1 mb-4">ควรเป็นบุคคลที่เข้าใจระบบของกลุ่ม/องค์กร
                            </div>
                            <v-row v-for="n in 2" :key="n" class="mb-4">
                                <v-col cols="12">
                                    <div class="text-body-2 font-weight-bold text-blue">คนที่ {{ n }}</div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ-นามสกุล" v-model="groupForm.contacts[n - 1].name"
                                        variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ตำแหน่ง" v-model="groupForm.contacts[n - 1].position"
                                        variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field label="โทรศัพท์" v-model="groupForm.contacts[n - 1].mobile"
                                        variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field label="โทรศัพท์สาร" v-model="groupForm.contacts[n - 1].mobile"
                                        variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field label="โทรศัพท์มือถือ" v-model="groupForm.contacts[n - 1].mobile"
                                        variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6" class="mt-2">
                                    <v-text-field label="E-mail" v-model="groupForm.contacts[n - 1].email"
                                        variant="outlined" density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>

                        <v-card variant="outlined" class="rounded-xl pa-6 bg-surface">
                            <div class="text-subtitle-1 font-weight-bold mb-4 ">
                                3. ระบบการควบคุมภายในที่มี
                            </div>

                            <v-table density="compact" class="internal-control-table">
                                <thead>
                                    <tr>
                                        <th class="text-left" style="border-bottom: none;">รายการ</th>
                                        <th class="text-center" style="width: 100px; border-bottom: none;">มี</th>
                                        <th class="text-center" style="width: 100px; border-bottom: none;">ไม่มี</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in internalControls" :key="index">
                                        <td class="py-2">
                                            <div class="d-flex align-start">
                                                <span class="mr-2">{{ index + 1 }}</span>
                                                <span>{{ item.label }}</span>
                                            </div>
                                            <v-text-field v-if="index === 6" v-model="form.otherDetail"
                                                placeholder="โปรดระบุรายละเอียด..." density="compact"
                                                variant="underlined" hide-details class="mt-1 ml-6"
                                                color="org-user"></v-text-field>
                                        </td>
                                        <td class="text-center">
                                            <v-checkbox v-model="item.value" :value="true" color="org-user" hide-details
                                                center-affix></v-checkbox>
                                        </td>
                                        <td class="text-center">
                                            <v-checkbox v-model="item.value" :value="false" color="error" hide-details
                                                center-affix></v-checkbox>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card>

                        <v-card variant="flat" class="pa-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4">4. รายละเอียดการผลิตของกลุ่ม</div>

                            <v-row>
                                <v-col cols="12">
                                    <div class="field-label mb-1">4.1 จำนวนเกษตรกรราย</div>
                                    <v-text-field v-model="form.farmerCount" rounded="lg" variant="outlined"
                                        density="compact" placeholder="ระบุจำนวน" hide-details></v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <div class="field-label mb-1">4.2 จำนวนพื้นที่ที่ขอรับรองทั้งหมด (ไร่)</div>
                                    <v-text-field v-model="form.totalArea" rounded="lg" variant="outlined"
                                        density="compact" placeholder="ระบุจำนวนไร่" hide-details></v-text-field>
                                    <div class="text-caption text-grey-darken-1 mt-1">
                                        (ระบุชื่อ พื้นที่ และชนิดพืชของผู้ผลิตแต่ละราย ตามภาคผนวก)
                                    </div>
                                </v-col>

                                <v-col cols="12">
                                    <div class="field-label mb-1">4.3 ขอบข่ายการผลิตที่ต้องการขอรับรอง</div>
                                    <v-textarea v-model="form.certificationScope" rounded="lg" variant="outlined"
                                        density="compact"
                                        placeholder="ระบุชนิดพืช (กรณีผลิตแบบคู่ขนาน ให้ระบุให้ชัดเจน)" rows="3"
                                        hide-details></v-textarea>
                                </v-col>

                                <v-col cols="12">
                                    <div class="field-label mb-1">
                                        4.4 สรุปรายละเอียดของพื้นที่การผลิตและวิธีการผลิตโดยทั่วไป
                                    </div>
                                    <div class="text-caption text-grey-darken-1 mb-2">
                                        (เช่น วิธีการปลูกพืช, การปรับปรุงบำรุงดิน, การป้องกันกำจัดศัตรูพืช, แหล่งน้ำ,
                                        ระบบนิเวศ
                                        เป็นต้น)
                                    </div>
                                    <v-file-input v-model="form.productionDetailFile" label="แนบไฟล์รายละเอียดการผลิต"
                                        prepend-icon="mdi-paperclip" variant="outlined" rounded="lg" density="compact"
                                        show-size hide-details></v-file-input>
                                </v-col>
                            </v-row>
                        </v-card>

                        <v-card variant="flat" class="pa-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4">5. เอกสารประกอบแบบคำขอใบรับรองแหล่งผลิตพืชอินทรีย์ สำหรับกลุ่ม</div>

                            <v-table density="compact" class="border rounded-lg mt-5">
                                <thead class="bg-grey-lighten-3">
                                    <tr>
                                        <th class="border text-center" style="min-width: 50px;">ลำดับ</th>
                                        <th class="border text-center" style="min-width: 150px;">ชื่อ-สกุล</th>
                                        <th class="border text-center" style="min-width: 150px;">เลขบัตรประจำตัวประชาชน
                                        </th>
                                        <th class="border text-center" style="min-width: 200px;">ที่อยู่</th>
                                        <th class="border text-center" style="min-width: 150px;">ที่ตั้งแปลง</th>
                                        <th class="border text-center" style="min-width: 120px;">ชนิดพืช/พันธุ์</th>
                                        <th class="border text-center" style="min-width: 180px;">
                                            ช่วงระยะเวลาการผลิต<br>(เฉพาะพืชผัก สมุนไพร พืชไร่ โดยระบุเดือน)</th>
                                        <th class="border text-center" style="min-width: 120px;">
                                            คาดว่าจะเก็บเกี่ยวผลผลิต<br>(ระบุเดือน)</th>
                                        <th class="border text-center" style="min-width: 120px;">
                                            ผลผลิตรวมที่คาดว่าจะได้รับต่อปี
                                        </th>
                                        <th class="border text-center"
                                            style="min-width: 150px; background-color: #f5f5f5;">
                                            เลขประจำแปลง<br>(สำหรับเจ้าหน้าที่)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in 5" :key="index">
                                        <td class="border text-center">{{ index + 1 }}</td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1">
                                            <v-text-field variant="outlined" density="compact" hide-details
                                                rounded="lg"></v-text-field>
                                        </td>
                                        <td class="border pa-1 bg-grey-lighten-4">
                                            <v-text-field readonly placeholder="เฉพาะเจ้าหน้าที่" variant="outlined"
                                                density="compact" hide-details rounded="lg"></v-text-field>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
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
                            <div class="text-subtitle-1 font-weight-bold mb-4">6.
                                พร้อมคำขอนี้ได้แนบหลักฐานและเอกสารต่างๆ ดังนี้
                            </div>
                            <v-checkbox v-for="(doc, i) in docChecklist" :key="i" v-model="groupForm.docs"
                                :label="doc.label" :value="doc.id" density="compact" hide-details></v-checkbox>
                            <div class="d-flex align-center mt-2 px-3 ml-n3">
                                <v-checkbox label="บันทึกเอกสารเพิ่มเติม (ถ้ามี):" density="compact" hide-details
                                    class="flex-shrink-0"></v-checkbox>
                                <v-text-field variant="underlined" density="compact" hide-details
                                    class="ml-2 mt-n2"></v-text-field>
                            </div>
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
import { ref, reactive } from "vue";
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
    { value: 0, title: "ข้อมูลกลุ่ม" },
    { value: 1, title: "แนบไฟล์" },
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
const groupForm = reactive({
    nameTh: '',
    nameEn: '',
    addressNo: '',
    subDistrict: '',
    district: '',
    province: null,
    zipcode: '',
    mobile: '',
    email: '',
    leaderName: '',
    leaderId: '',
    memberCount: 0,
    totalPlots: 0,
    totalArea: 0,
    members: [
        { name: '', idCard: '', address: '', crop: '', area: '' }
    ],
    ics: {},
    icsOther: '',
    contacts: [
        { name: '', position: '', mobile: '', email: '' },
        { name: '', position: '', mobile: '', email: '' }
    ],
    docs: [],
    otherDetail: '',
    producerCount: null,
    plotCount: null,
    totalAreaSize: null
})


const internalControls = ref([
    { label: 'สัญญา/ใบสมัคร/คำรับรอง และหลักเกณฑ์และเงื่อนไขของกลุ่ม', value: null },
    { label: 'การตรวจติดตามคุณภาพภายใน และการปฏิบัติการแก้ไข', value: null },
    { label: 'การจัดการข้อร้องเรียน', value: null },
    { label: 'การควบคุมเอกสาร และบันทึก', value: null },
    { label: 'การฝึกอบรม', value: null },
    { label: 'ระบบการตามสอบผลิตผล (Traceability of Produce)', value: null },
    { label: 'อื่นๆ โปรดระบุ', value: null },
]);
const docChecklist = [
    {
        id: 'id_card',
        label: 'แสดงบัตรประชาชน หรือทะเบียนบ้านของ ประธานกลุ่ม หรือผู้มีอำนาจลงนามของกลุ่ม'
    },
    {
        id: 'juristic_reg',
        label: 'แนบหลักฐานการจดทะเบียนนิติบุคคล (กรณีเป็นนิติบุคคล)'
    },
    {
        id: 'power_of_attorney',
        label: 'แนบหนังสือมอบอำนาจ พร้อมสำเนาบัตรประชาชนของผู้มอบอำนาจ'
    },
];

const dialogVisible = ref(false)
const snackbar = ref(false)
const activeIndex = ref(null)
const activeStandard = ref(null)

// ข้อมูลสถานะหน้าหลัก
const standards = ref([
    { title: 'มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร (มกษ. 9001)', isCompleted: true },
    { title: 'มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชสมุนไพร (มกษ. 3502)', isCompleted: false }
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
