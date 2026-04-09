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
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="org-staff">fas fa-users</v-icon>
                        <span class="text-subtitle-2">ข้อมูลรายละเอียด</span>
                    </div>
                    <v-card-text class="pa-5">

                        <v-card variant="flat" class="pa-4  rounded-lg">
                            <v-checkbox label="มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร (มกษ. 9001)"
                                density="compact" hide-details></v-checkbox>
                        </v-card>
                        <v-card variant="outlined" class="pa-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4 text-black">1. เกษตรกรเจ้าของฟาร์ม</div>
                            <v-row dense>
                                <v-col cols="12" md="4">
                                    <div class="field-label">ชื่อ (TH) <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.firstNameTh" placeholder="ชื่อ" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">นามสกุล (TH) <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.lastNameTh" placeholder="นามสกุล" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">Firstname (EN) <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.firstNameEn" placeholder="Firstname" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">Middlename</div>
                                    <v-text-field v-model="form.middleNameEn" placeholder="Middle Name" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">Lastname (EN)</div>
                                    <v-text-field v-model="form.lastNameEn" placeholder="Lastname" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">เลขที่บัตรประชาชน <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.idCard" placeholder="x-xxxx-xxxxx-xx-x" rounded="lg"
                                        variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <div class="field-label">รหัสทะเบียนบ้าน <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.houseRegId" placeholder="รหัสทะเบียนบ้าน 11 หลัก"
                                        rounded="lg" variant="outlined" density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">บ้านเลขที่ <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.addressNo" rounded="lg" variant="outlined"
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
                                <v-col cols="12" md="3">
                                    <div class="field-label">โทรศัพท์มือถือ(Mobile) <span class="text-red">*</span>
                                    </div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <div class="field-label">Email <span class="text-red">*</span></div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>

                        <v-card variant="outlined" class="pa-6  rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4 text-black">2. นิติบุคคลเจ้าของฟาร์ม/
                                ชื่อนิติบุคคล
                            </div>
                            <v-row dense>
                                <v-col cols="12">
                                    <div class="field-label">ชื่อนิติบุคคล</div>
                                    <v-text-field v-model="form.juristicName" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <div class="field-label">Juristic Person</div>
                                    <v-text-field v-model="form.juristicName" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ชื่อผู้มีอำนาจลงนามของนิติบุคคล</div>
                                    <v-text-field v-model="form.authorizedPerson" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">นามสกุล</div>
                                    <v-text-field v-model="form.authorizedPerson" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">เลขที่ทะเบียนนิติบุคคล</div>
                                    <v-text-field v-model="form.juristicId" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">เลขจดทะเบียนนิติบุคคล/เลขทะเบียนผู้เสียภาษี</div>
                                    <v-text-field v-model="form.juristicId" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">ที่อยู่ของนิติบุคคล บ้านเลขที่ <span
                                            class="text-red">*</span>
                                    </div>
                                    <v-text-field v-model="form.addressNo" rounded="lg" variant="outlined"
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
                                <v-col cols="12" md="6">
                                    <div class="field-label">
                                        กรณีที่นิติบุคคลไม่ได้ดำเนินการผลิตพืชให้ระบุชื่อ-นามสกุลผู้ผลิต
                                    </div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <div class="field-label">เลขบัตรประจำตัวประชาชนผู้ผลิต <span
                                            class="text-red">*</span>
                                    </div>
                                    <v-text-field v-model="form.zipcode" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>

                        <v-card variant="flat" class="pa-6 rounded-xl bg-white">
                            <div class="text-subtitle-1 font-weight-bold mb-4">3. ที่ตั้งฟาร์ม</div>
                            <v-row dense>
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
                                <v-col cols="12" md="4">
                                    <div class="field-label">พื้นที่ขอรับรอง (ไร่)</div>
                                    <v-text-field v-model="form.totalArea" type="number" rounded="lg" variant="outlined"
                                        density="compact" hide-details></v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>

                        <v-card class="rounded-xl overflow-hidden">

                            <v-card-text class="pa-6 bg-white">
                                <v-row dense class="mb-8 align-center">
                                    <v-col cols="12" md="4">
                                        <div class="field-label font-weight-bold mb-1">ขอบข่ายพืช (Category)
                                        </div>
                                        <v-select v-model="activeStandardData.plantCategory"
                                            :items="['พืชอาหาร', 'พืชสมุนไพร', 'พืชประดับ']"
                                            placeholder="กรุณาเลือกขอบข่ายพืช" variant="outlined" rounded="lg"
                                            density="compact" hide-details bg-color="white"></v-select>
                                    </v-col>

                                </v-row>

                                <div class="d-flex justify-space-between align-center mb-4">
                                    <div class="text-subtitle-1 font-weight-bold">4.
                                        ชนิดและพันธุ์พืชที่ขอรับการรับรอง
                                    </div>
                                </div>

                                <v-table density="compact" class="border rounded-lg mb-2 crop-table custom-table">
                                    <thead class="bg-grey-lighten-3">
                                        <tr>
                                            <th class="text-center font-weight-bold border" style="min-width: 220px">
                                                ชนิดพืช / พันธุ์พืช
                                            </th>
                                            <th class="text-center font-weight-bold border" style="width: 100px">พื้นที่
                                                (ไร่)</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">อายุพืช
                                                (วัน/ปี)</th>
                                            <th class="text-center font-weight-bold border" style="width: 120px">
                                                กรณีไม้ผล (ต้น)</th>
                                            <th class="text-center font-weight-bold border">ระยะเวลาผลิต</th>
                                            <th class="text-center font-weight-bold border">คาดว่าจะเก็บเกี่ยว
                                            </th>
                                            <th class="text-center font-weight-bold border">ผลผลิต/ปี (กก.)</th>
                                            <th class="text-center font-weight-bold border text-red"
                                                style="width: 180px">
                                                เลขประจำแปลง <br /> <small class="text-grey">(เจ้าหน้าที่กรอก)</small>
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
                                            <td class="border pa-1">
                                                <v-text-field v-model="item.farmId" placeholder="" readonly
                                                    bg-color="grey-lighten-4" variant="outlined" density="compact"
                                                    hide-details rounded="lg"></v-text-field>
                                            </td>
                                        </tr>
                                        <tr v-if="activeStandardData.crops.length === 0">
                                            <td colspan="9" class="pa-10 text-center text-grey italic">
                                                กรุณากดปุ่มเพิ่มรายการพืช</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-card-text>

                            <v-divider></v-divider>

                        </v-card>

                        <v-card variant="flat" class="pa-6 rounded-xl bg-white mt-n5">
                            <div class="text-subtitle-1 font-weight-bold mb-4">5. แผนผังที่ตั้งแปลง แสดงเส้นทางคมนาคม
                                และสถานที่สำคัญในบริเวณใกล้เคียง เพื่ออำนวยความสะดวกในการเดินทางไปยังแปลง</div>

                            <div class="rounded-lg bg-grey-lighten-5 overflow-hidden"
                                style="height: 400px; border: 1px solid #ddd">
                                <div id="leaflet-map" style="height: 100%; width: 100%; z-index: 1;"></div>
                            </div>

                            <!-- <v-row class="mt-4" dense>
                                <v-col cols="12" md="4">
                                    <v-text-field label="พิกัด Latitude (X)" v-model="form.lat" variant="outlined"
                                        density="compact" hide-details rounded="lg" readonly></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field label="พิกัด Longitude (Y)" v-model="form.lng" variant="outlined"
                                        density="compact" hide-details rounded="lg" readonly></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field label="ความสูง (Z)" v-model="form.alt" variant="outlined"
                                        density="compact" hide-details rounded="lg"></v-text-field>
                                </v-col>
                            </v-row> -->
                        </v-card>

                        <!-- เอกสารแนบ -->
                        <v-card rounded="xl" elevation="0" class="section-card mb-4">
                            <div class="section-header px-4 py-3 border-b d-flex align-center ga-2">
                                <span class="text-subtitle-2 font-weight-bold">6.เอกสารแนบ</span>
                            </div>
                            <v-card-text class="pa-4">
                                <div v-for="doc in application.attachments" :key="doc.label"
                                    class="item-row rounded-lg px-3 py-2 mb-2 d-flex align-center justify-space-between">
                                    <div class="text-body-2">{{ doc.label }}</div>
                                    <v-btn size="x-small" variant="tonal" color="doa-staff" rounded="lg"
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
                                <v-radio-group v-model="step1Review.result" color="doa-staff" inline>
                                    <v-radio value="pass" class="mr-6">
                                        <template #label>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon icon="fas fa-circle-check" color="success" size="18" />
                                                <span class="font-weight-medium">ผ่าน</span>
                                            </div>
                                        </template>
                                    </v-radio>
                                    <v-radio value="improve" class="mr-6">
                                        <template #label>
                                            <div class="d-flex align-center ga-2">
                                                <v-icon icon="fas fa-circle-exclamation" color="warning" size="18" />
                                                <span class="font-weight-medium">ปรับปรุง</span>
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

                                <!-- แก้ไขภายในระยะเวลา (เฉพาะ ปรับปรุง) -->
                                <template v-if="step1Review.result === 'improve'">
                                    <div class="field-label mb-1">
                                        <div>แก้ไขภายในระยะเวลา</div>
                                        <div class="field-label-en">Deadline</div>
                                    </div>
                                    <v-menu v-model="deadlineMenu" :close-on-content-click="false" min-width="0">
                                        <template #activator="{ props }">
                                            <v-text-field v-bind="props" :model-value="deadlineBE" variant="outlined"
                                                density="compact" rounded="lg" hide-details readonly
                                                placeholder="วว/ดด/ปปปป" prepend-inner-icon="fas fa-calendar"
                                                class="mb-4" />
                                        </template>
                                        <v-date-picker v-model="step1Review.deadline" hide-header locale="th"
                                            @update:model-value="deadlineMenu = false" />
                                    </v-menu>
                                </template>

                                <!-- Action buttons inline -->
                                <v-row class="ga-2" no-gutters>
                                    <v-col v-if="step1Review.result !== 'pass'">
                                        <v-btn color="warning" variant="tonal" block rounded="lg"
                                            prepend-icon="fas fa-rotate-left" @click="sendBackDialog = true">
                                            ส่งกลับแก้ไข
                                        </v-btn>
                                    </v-col>
                                    <!-- <v-col v-if="step1Review.result === 'pass'">
                                        <v-btn color="doa-staff" variant="flat" block rounded="lg"
                                            prepend-icon="fas fa-paper-plane" @click="forwardDialog = true">
                                            ส่งต่อพิจารณา
                                        </v-btn>
                                    </v-col> -->
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>

            </v-window-item>

            <!-- Step 2: รายชื่อสมาชิก -->
            <v-window-item :value="1">
                <v-card elevation="0" rounded="xl">
                    <div class="section-header">
                        <v-icon size="15" color="org-staff">fas fa-users</v-icon>
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
                        <v-icon size="15" color="org-staff">fas fa-location-dot</v-icon>
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
                        <v-icon size="15" color="org-staff">fas fa-seedling</v-icon>
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
                                    ข้อกำหนด ORG
                                    <div></div>
                                    <div class="field-label-en">ORG Requirements</div>
                                </div>
                                <div class="rounded-lg pa-3 bg-surface-variant">
                                    <v-checkbox v-model="form.water" label="มีแหล่งน้ำในพื้นที่" color="org-staff"
                                        density="compact" hide-details class="mb-1" />
                                    <v-checkbox v-model="form.record" label="มีการบันทึกการผลิต" color="org-staff"
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
                        เลขที่คำขอ: <strong class="text-org-staff">ORG-2569-012</strong><br />
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
const mapform = reactive({
    lat: 13.782674,
    lng: 100.54628,
    alt: ''
});

const initialPos = [mapform.lat, mapform.lng];
let map = null;
let marker = null;

const redIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const setMarker = (lat, lng) => {
    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
    }
    mapform.lat = lat.toFixed(6);
    mapform.lng = lng.toFixed(6);
};

const initLeafletMap = () => {
    // สร้างแผนที่
    map = L.map("leaflet-map").setView(initialPos, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // ปักหมุดเริ่มต้น
    setMarker(initialPos[0], initialPos[1]);

    // คลิกเพื่อเปลี่ยนพิกัด
    map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setMarker(lat, lng);
    });

    // สำคัญ: สั่งให้แผนที่วาดใหม่ในกรณีที่ขนาด container เปลี่ยน
    setTimeout(() => {
        map.invalidateSize();
    }, 400);
};

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
        currentStep: 1,
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
        requestNo: "ORG-2569-00039",
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
        requestNo: "ORG-2569-00036",
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
        requestNo: "ORG-2569-00034",
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
    certNo: `ORG-CERT-2569-${Math.floor(Math.random() * 9000 + 1000)}`,
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
    showSnack("ออกใบรับรอง ORG เรียบร้อยแล้ว 🎉", "success");
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
            gapNo: "ORG-00123",
            siteName: "สวนมะม่วงไทยเอ็กซ์พอร์ต",
            certBody: "กรมวิชาการเกษตร (DOA)",
            expiryDate: "01/03/2570",
        },
        {
            gapNo: "ORG-00456",
            siteName: "สวนมะละกอไทยเอ็กซ์พอร์ต",
            certBody: "สำนักงานเกษตรจังหวัด",
            expiryDate: "15/06/2570",
        },
    ],

    attachments: [
        { label: "หนังสือรับรองบริษัท" },
        { label: "สำเนาบัตรประชาชนกรรมการ" },
        { label: "หนังสือสำคัญขึ้นทะเบียนโรงงาน (DOA)" },
        { label: "หนังสือรับรอง ORG" },
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
    initLeafletMap();
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
