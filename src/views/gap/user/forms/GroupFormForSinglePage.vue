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
        </v-card>

        <v-window v-model="currentStep">
            <!-- Step 1: ข้อมูลกลุ่ม -->
            <v-window-item :value="0">
                <v-card elevation="0" border rounded="xl" class="mb-4">
                    <div class="section-header border-b">
                        <v-icon size="15" color="gap-user">fas fa-users</v-icon>
                        <span class="text-subtitle-2">ข้อมูลรายละเอียด</span>
                    </div>
                    <v-card-text class="pa-5">
                        <v-row justify="center" class="radio-farm d-flex justify-center mb-4 mt-4">
                            <v-radio-group inline hide-details v-model="form.requestType">
                                <v-radio label="คำขอใหม่" value="new" class="mr-10"></v-radio>
                                <v-radio label="ต่ออายุ" value="renew"></v-radio>
                            </v-radio-group>
                        </v-row>

                        <v-card variant="flat" class="pa-4  rounded-lg">
                            <v-checkbox label="มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชอาหาร (มกษ. 9001)"
                                density="compact" hide-details></v-checkbox>
                            <v-checkbox label="มาตรฐานการปฏิบัติทางการเกษตรที่ดีสำหรับพืชสมุนไพร (มกษ. 3502)"
                                density="compact" hide-details></v-checkbox>
                            <div class="d-flex align-center ">
                                <v-checkbox label="มาตรฐานอื่นๆ (ระบุ)" density="compact" hide-details
                                    class="flex-shrink-0"></v-checkbox>
                                <v-text-field variant="underlined" density="compact" hide-details
                                    class="ml-2 mt-n2"></v-text-field>
                            </div>
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

                        <v-container class="pa-6">
                            <div class="text-subtitle-1 font-weight-bold mb-4">ข้อมูลชนิดและพันธุ์พืชที่ขอรับการรับรอง
                            </div>

                            <div v-for="(item, index) in standards" :key="index">
                                <v-card variant="outlined" class="pa-4 mb-4 rounded-xl transition-all border-md"
                                    :class="item.isCompleted ? 'bg-green-lighten-5' : 'border-grey-lighten-2 bg-white'">
                                    <v-row align="center" no-gutters>
                                        <v-col cols="auto">
                                            <v-avatar :color="item.isCompleted ? 'success' : 'transparent'" size="44"
                                                class="mr-4">
                                                <v-icon :icon="item.isCompleted ? 'fas fa-check' : ''"
                                                    :color="item.isCompleted ? 'white' : 'grey-darken-1'"
                                                    size="20"></v-icon>
                                            </v-avatar>
                                        </v-col>

                                        <v-col>
                                            <div class="font-weight-bold"
                                                :class="item.isCompleted ? 'text-blue-darken-4' : 'text-black'">
                                                {{ item.title }}
                                            </div>
                                            <div v-if="item.isCompleted"
                                                class="text-caption text-success font-weight-bold">
                                                <v-icon icon="mdi-check-all" size="14" class="mr-1"></v-icon>
                                                ชนิดและพันธุ์พืชเรียบร้อยแล้ว
                                            </div>
                                        </v-col>

                                        <v-col cols="12" md="auto" class="text-right pt-2 pt-md-0">
                                            <v-btn :color="item.isCompleted ? 'white' : 'grey-lighten-2'" variant="flat"
                                                class="text-none font-weight-bold px-6 border" rounded="lg"
                                                @click="openCropDialog(index)">
                                                <v-icon :icon="item.isCompleted ? 'mdi-pencil' : 'mdi-plus'" start
                                                    size="18"></v-icon>
                                                {{ item.isCompleted ? 'แก้ไขข้อมูลพืช' : 'เพิ่มข้อมูลพืช' }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </div>

                            <v-dialog v-model="dialogVisible" max-width="1300px" persistent scrollable>
                                <v-card class="rounded-xl overflow-hidden">
                                    <v-card-title
                                        class="pa-6 d-flex justify-space-between align-center bg-grey-lighten-4">
                                        <div class="d-flex align-center">
                                            <v-icon icon="mdi-leaf" color="success" class="mr-2"></v-icon>
                                            <span class="text-h6 font-weight-bold">จัดการข้อมูลพืช: {{
                                                activeStandard?.title
                                                }}</span>
                                        </div>
                                        <v-btn icon="mdi-close" variant="text" @click="dialogVisible = false"></v-btn>
                                    </v-card-title>

                                    <v-divider></v-divider>

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
                                            <v-btn color="success" prepend-icon="mdi-plus" size="small" rounded="lg"
                                                @click="addCropRow">
                                                เพิ่มแถวรายการ
                                            </v-btn>
                                        </div>

                                        <v-table density="compact"
                                            class="border rounded-lg mb-2 crop-table custom-table">
                                            <thead class="bg-grey-lighten-3">
                                                <tr>
                                                    <th class="text-center font-weight-bold border"
                                                        style="min-width: 220px">
                                                        ชนิดพืช / พันธุ์พืช
                                                    </th>
                                                    <th class="text-center font-weight-bold border"
                                                        style="width: 100px">พื้นที่
                                                        (ไร่)</th>
                                                    <th class="text-center font-weight-bold border"
                                                        style="width: 120px">อายุพืช
                                                        (วัน/ปี)</th>
                                                    <th class="text-center font-weight-bold border"
                                                        style="width: 120px">
                                                        กรณีไม้ผล (ต้น)</th>
                                                    <th class="text-center font-weight-bold border">ระยะเวลาผลิต</th>
                                                    <th class="text-center font-weight-bold border">คาดว่าจะเก็บเกี่ยว
                                                    </th>
                                                    <th class="text-center font-weight-bold border">ผลผลิต/ปี (กก.)</th>
                                                    <th class="text-center font-weight-bold border text-red"
                                                        style="width: 180px">
                                                        เลขประจำแปลง <br /> <small
                                                            class="text-grey">(เจ้าหน้าที่กรอก)</small>
                                                    </th>
                                                    <th class="text-center border" style="width: 50px"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(item, index) in activeStandardData.crops" :key="index">
                                                    <td class="border pa-1">
                                                        <v-autocomplete v-model="item.name"
                                                            :items="['มะม่วงน้ำดอกไม้', 'มะม่วงอกร่อง', 'ทุเรียนหมอนทอง', 'มังคุด']"
                                                            variant="outlined" density="compact" hide-details
                                                            rounded="lg" placeholder="ค้นหาพืช..."></v-autocomplete>
                                                    </td>
                                                    <td class="border pa-1"><v-text-field v-model="item.area"
                                                            variant="outlined" density="compact" hide-details
                                                            rounded="lg"></v-text-field></td>
                                                    <td class="border pa-1"><v-text-field v-model="item.age"
                                                            variant="outlined" density="compact" hide-details
                                                            rounded="lg"></v-text-field></td>
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
                                                            bg-color="grey-lighten-4" variant="outlined"
                                                            density="compact" hide-details rounded="lg"></v-text-field>
                                                    </td>
                                                    <td class="border text-center pa-0">
                                                        <v-btn icon="fas fa-trash" variant="text" color="red"
                                                            size="small" @click="removeCropRow(index)"></v-btn>
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

                                    <v-card-actions class="pa-6 bg-grey-lighten-4">
                                        <v-spacer></v-spacer>
                                        <v-btn variant="flat" color="grey-darken-1" class="px-6"
                                            @click="dialogVisible = false">ยกเลิก</v-btn>
                                        <v-btn color="primary" class="px-10" rounded="lg" elevation="1"
                                            @click="saveCropData">
                                            บันทึกข้อมูลพืช
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <v-snackbar v-model="snackbar" color="success" timeout="2000" rounded="lg">
                                บันทึกข้อมูล {{ activeStandard?.title }} สำเร็จ
                            </v-snackbar>
                        </v-container>

                        <v-card variant="flat" class="pa-6 rounded-xl bg-white mt-n5">
                            <div class="text-subtitle-1 font-weight-bold mb-4">5. แผนผังที่ตั้งแปลง แสดงเส้นทางคมนาคม และสถานที่สำคัญในบริเวณใกล้เคียง เพื่ออำนวยความสะดวกในการเดินทางไปยังแปลง</div>

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
                    </v-card-text>
                </v-card>

            </v-window-item>

            <!-- Step 2: รายชื่อสมาชิก -->
            <v-window-item :value="1">
                <v-card elevation="0" rounded="xl">
                    <div class="section-header">
                        <v-icon size="15" color="gap-user">fas fa-users</v-icon>
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
                        <v-icon size="15" color="gap-user">fas fa-location-dot</v-icon>
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
                        <v-icon size="15" color="gap-user">fas fa-seedling</v-icon>
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
                                    <v-checkbox v-model="form.water" label="มีแหล่งน้ำในพื้นที่" color="gap-user"
                                        density="compact" hide-details class="mb-1" />
                                    <v-checkbox v-model="form.record" label="มีการบันทึกการผลิต" color="gap-user"
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
                        <v-icon size="15" color="gap-user">fas fa-paperclip</v-icon>
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


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
const dialogVisible = ref(false)
const snackbar = ref(false)
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

onMounted(() => {
    initLeafletMap();
});
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
