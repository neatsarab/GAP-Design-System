<template>
    <div style="--v-theme-primary: var(--v-theme-el-staff)">
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <div>
                <h1 class="page-title mb-0">พิจารณาผลการตรวจ</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    คำขอขึ้นทะเบียนโรงคัดบรรจุ (Establishment List)
                </p>
            </div>
        </div>

        <!-- ─── PAGE ROUTING ─── -->
        <v-window v-model="page" :touch="false">
            <!-- PAGE: MAIN DASHBOARD -->
            <v-window-item value="main">
                <template v-if="currentStep === 0">
                    <v-card rounded="xl" elevation="0" class="mb-5 section-card">
                        <v-card-title class="pa-5 pb-3 section-title font-weight-bold d-flex align-center">
                            <v-icon icon="fas fa-user-pen" class="mr-2" color="el-staff" size="20" />
                            {{ editLabel }}
                        </v-card-title>
                        <v-divider />

                        <v-card-text class="pa-8">
                            <v-row dense v-if="editType === 'farmer'">
                                <!-- ส่วนข้อมูลเกษตรกร (Read Only) -->
                                <v-col cols="12">
                                    <v-card variant="outlined" class="pa-6 rounded-xl mb-6">
                                        <v-row dense>
                                            <v-col cols="12" md="6">
                                                <div class="mb-2">
                                                    <div class="field-label mb-1">ประเภท</div>
                                                    <v-select v-model="tempData.appType"
                                                        :items="['ตรวจขึ้นทะเบียนใหม่']" variant="outlined" rounded="lg"
                                                        density="compact" hide-details bg-color="white" readonly />
                                                </div>
                                                <div class="mb-2">
                                                    <div class="field-label mb-1">จำนวนครั้งที่ตรวจ</div>
                                                    <v-text-field v-model="tempData.checkCount" variant="outlined"
                                                        rounded="lg" density="compact" hide-details bg-color="white"
                                                        readonly />
                                                </div>
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="mb-2">
                                                    <div class="field-label mb-1">สถานะ</div>
                                                    <v-select v-model="tempData.status" :items="['รอตรวจ']"
                                                        variant="outlined" rounded="lg" density="compact" hide-details
                                                        bg-color="white" readonly />
                                                </div>
                                                <div class="mb-2">
                                                    <div class="field-label mb-1">ชนิดพืช</div>
                                                    <v-text-field v-model="tempData.cropName" variant="outlined"
                                                        rounded="lg" density="compact" hide-details bg-color="white"
                                                        readonly />
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
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <div class="field-label mb-1">วันที่หมดอายุ</div>
                                                <v-text-field v-model="establishmentInfo.expireDate" type="date"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>

                                            <!-- ชื่อโรงคัดบรรจุ -->
                                            <v-col cols="12">
                                                <div class="field-label mb-1 mt-2">ชื่อโรงคัดบรรจุ</div>
                                                <v-text-field v-model="establishmentInfo.name" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details />
                                            </v-col>

                                            <!-- ชื่อผู้ติดต่อ / นามสกุล -->
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">ชื่อผู้ติดต่อ</div>
                                                <v-text-field v-model="establishmentInfo.contactFirstName"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">นามสกุล</div>
                                                <v-text-field v-model="establishmentInfo.contactLastName"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
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
                                                <v-select v-model="establishmentInfo.province"
                                                    :items="['กรุงเทพมหานคร']" variant="outlined" rounded="lg"
                                                    density="comfortable" hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">อำเภอ/เขต</div>
                                                <v-select v-model="establishmentInfo.district" :items="['เขตลาดพร้าว']"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>

                                            <!-- ตำบล / รหัสไปรษณีย์ -->
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">ตำบล/แขวง</div>
                                                <v-select v-model="establishmentInfo.subdistrict" :items="['ลาดพร้าว']"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">รหัสไปรษณีย์</div>
                                                <v-text-field v-model="establishmentInfo.zipcode" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details />
                                            </v-col>

                                            <!-- โทรศัพท์ / มือถือ -->
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">โทรศัพท์</div>
                                                <v-text-field v-model="establishmentInfo.phone" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">โทรศัพท์มือถือ</div>
                                                <v-text-field v-model="establishmentInfo.mobile" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details />
                                            </v-col>

                                            <!-- โทรสาร / อีเมล -->
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">โทรสาร (FAX)</div>
                                                <v-text-field v-model="establishmentInfo.fax" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">อีเมล (E-mail)</div>
                                                <v-text-field v-model="establishmentInfo.email" variant="outlined"
                                                    rounded="lg" density="comfortable" hide-details />
                                            </v-col>

                                            <!-- วันที่อนุมัติ / สถานะโรงงาน -->
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">วันที่อนุมัติ</div>
                                                <v-text-field v-model="establishmentInfo.approveDate" type="date"
                                                    variant="outlined" rounded="lg" density="comfortable"
                                                    hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6">
                                                <div class="field-label mb-1 mt-2">สถานะ</div>
                                                <v-text-field v-model="establishmentInfo.status" variant="outlined"
                                                    rounded="lg" density="comfortable" readonly hide-details />
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
                                                            <h3
                                                                class="text-success font-weight-bold mb-3 ml-1 text-body-1">
                                                                GMP</h3>
                                                            <v-table density="compact"
                                                                class="border custom-summary-table mb-6">
                                                                <thead class="bg-grey-lighten-3">
                                                                    <tr>
                                                                        <th class="text-center border-right"
                                                                            style="width: 80px">ดู / แก้ไข</th>
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

                                                            <h3
                                                                class="text-success font-weight-bold mb-3 ml-1 text-body-1">
                                                                HACCP</h3>
                                                            <v-table density="compact"
                                                                class="border custom-summary-table mb-6">
                                                                <thead class="bg-grey-lighten-3">
                                                                    <tr>
                                                                        <th class="text-center border-right"
                                                                            style="width: 80px">ดู / แก้ไข</th>
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
                                                class="text-md-right pt-2 font-weight-bold">ผลการพิจารณาจากคณะกรรมการกลั่นกรอง :</v-col>
                                            <v-col cols="12" md="4">
                                                <v-select v-model="tempData.zoneResult"
                                                    :items="['ผ่าน', 'ไม่ผ่าน', 'ปรับปรุง']" variant="outlined"
                                                    rounded="lg" density="compact" hide-details />
                                            </v-col>
                                            <v-col cols="12" md="6" />

                                              <v-col cols="12" md="2"
                                                class="text-md-right pt-2 font-weight-bold mt-2">เอกสารอื่น ๆ :</v-col>
                                            <v-col cols="12" md="4"
                                                class="pt-2 text-medium-emphasis">
                                                <v-file-input variant="outlined" rounded="lg" density="compact" hide-details
                                                append-inner-icon="fas fa-paperclip" prepend-icon="" />
                                            </v-col>
                                            <v-col cols="12" md="6" />

                                            <v-col cols="12" md="2"
                                                class="text-md-right pt-2 font-weight-bold mt-2">หมายเหตุ :</v-col>
                                            <v-col cols="12" md="10" class="mt-2">
                                                <v-textarea v-model="tempData.zoneRemark" variant="outlined"
                                                    rounded="lg" density="compact" rows="3" hide-details />
                                            </v-col>

                                          

                                            <v-col cols="12" md="2"
                                                class="text-md-right pt-2 font-weight-bold mt-2">ผู้บันทึกผล :</v-col>
                                            <v-col cols="12" md="4" class="mt-2">
                                                <v-select v-model="tempData.zoneRecorder"
                                                    :items="['เจ้าหน้าที่ตรวจประเมิน']" variant="outlined" rounded="lg"
                                                    density="compact" hide-details />
                                            </v-col>
                                            <v-col cols="12" md="2"
                                                class="text-md-right pt-2 font-weight-bold mt-2">วันที่บันทึกผล :</v-col>
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

                            <!-- Placeholder สำหรับ Factory -->
                            <v-row v-else-if="editType === 'factory'">
                                <v-col cols="12" class="text-center py-10">
                                    <h2 class="text-grey">ส่วนแสดงข้อมูลใบรับรองโรงคัดบรรจุ</h2>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- Footer Action -->
                    <!-- <v-card rounded="xl" elevation="0" class="mt-6 section-card">
                        <v-card-text class="pa-4 d-flex justify-end ga-3">
                            <v-btn variant="tonal" color="grey" rounded="lg" @click="page = 'main'">ยกเลิก</v-btn>
                            <v-btn color="el-staff" rounded="lg" prepend-icon="fas fa-save"
                                @click="saveData">บันทึกข้อมูลทั้งหมด</v-btn>
                        </v-card-text>
                    </v-card> -->
                </template>
            </v-window-item>
        </v-window>

        <!-- Success Dialog -->
        <v-dialog v-model="successDialog" max-width="440" persistent>
            <v-card rounded="xl">
                <v-card-text class="pa-8 text-center">
                    <div class="success-ring mx-auto mb-4"><v-icon icon="fas fa-check" color="success" size="36" />
                    </div>
                    <h3 class="text-h6 font-weight-bold mb-2">บันทึกข้อมูลสำเร็จ!</h3>
                    <v-chip color="el-staff" size="large" variant="tonal" class="mb-4">{{ establishmentInfo.appCode
                        }}</v-chip>
                    <p class="text-body-2 text-medium-emphasis">ระบบได้ทำการอัปเดตข้อมูลของท่านเรียบร้อยแล้ว</p>
                </v-card-text>
                <v-card-actions class="px-6 pb-5">
                    <v-btn color="el-staff" rounded="lg" block @click="successDialog = false">ตกลon</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// ─── STATE MANAGEMENT ───
const page = ref('main');
const currentStep = ref(0);
const editType = ref('farmer'); // Default สำหรับ Test Layout
const successDialog = ref(false);
const cl02History = ref([
    { id: 1, count: 1, schedule: '2026-03-31', date: '2026-03-31', inspector: 'นายสมชาย ตรวจดี', result: 'ผ่าน', remark: '-' }
]);

// จัดการ Label ตามประเภทการแก้ไข
const editLabel = computed(() => {
    const labels = {
        farmer: 'ข้อมูลโรงคัดบรรจุ',
        farm: 'ข้อมูลโรงคัดบรรจุ',
        factory: 'ข้อมูลใบรับรองโรงคัดบรรจุ'
    };
    return labels[editType.value] || 'ข้อมูลรายละเอียด';
});

// ข้อมูลหลักของ Establishment
const establishmentInfo = reactive({
    appCode: 'EL-2569-00003',
    appDate: '2026-03-31',
    // ... data อื่นๆ (คงไว้ตามเดิม)
});

// ข้อมูลสำหรับฟอร์ม (Refactored & Fixed Duplicates)
const tempData = reactive({
    appType: 'ตรวจขึ้นทะเบียนใหม่',
    status: 'รอตรวจ',
    checkCount: '1',
    alertCode: '-',
    farmerName: 'นาง จันทร์จิรา เครือพลับ',
    cropName: 'ถั่วฝักยาว',
    certType: 'GAP',
    certNo: 'กษ 03-9001-73-352-000041',
    farmCode: 'F-12345-001',
    areaSize: '15.5',
    yieldPerArea: '1200',
    yieldPerCycle: '18600',
    remark: 'รอบการผลิตปกติ',
    location: 'ต.ลาดพร้าว อ.เขตลาดพร้าว จ.กรุงเทพฯ',
    province: 'กรุงเทพมหานคร',
    district: 'ลาดพร้าว',
    subdistrict: 'ลาดพร้าว',
    coordX: '13.8045',
    coordY: '100.6030',
    coordZ: '0.0',
    plantingPlans: [
        { selected: false, name: 'มกราคม - มีนาคม', period: '90 วัน' },
        { selected: false, name: 'มิถุนายน - สิงหาคม', period: '90 วัน' }
    ],
    checkResults: {},
    checkRemarks: {},
    zoneResult: 'ผ่าน',
    zoneRemark: '',
    zoneRecorder: 'เจ้าหน้าที่ตรวจประเมิน',
    zoneDate: new Date().toISOString().substr(0, 10),
     creator: 'บริษัท เอ็น ที ฟู้ด อินเตอร์เทรด',
    createDate: '20/05/2025',
    editor: 'นายเงิน อิทธิโรจน์',
    editDate: '06/03/2026',
    swpArea: 'สำนักวิจัยและพัฒนาการเกษตรเขตที่ 5', // แก้จาก 'เขต 1'
    swpProvince: 'ศูนย์วิจัยและพัฒนาการเกษตรราชบุรี', // ในภาพคือราชบุรี (ส่วนในโค้ดเดิมคุณเป็นนครปฐม)
    lastChecker: 'นางสาวฤทัยรัตน์ กัณหาจันทร์',
});

// รายการตรวจสอบเอกสาร
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

// ─── METHODS ───

const addPlantingRow = () => {
    tempData.plantingPlans.push({ selected: false, name: '', period: '' });
};

const toggleAllPlanting = (val) => {
    tempData.plantingPlans.forEach(plan => plan.selected = val);
};

const passAllDocuments = () => {
    farmDocCheckList.forEach(doc => {
        if (doc.key) tempData.checkResults[doc.key] = 'ผ่าน';
    });
};

const saveData = () => {
    // Logic สำหรับการส่งข้อมูลไปยัง API
    successDialog.value = true;
};
const BackMain = () => {
    router.push({ name: "ELStaffAreaReview" });
}
const activeStep2Tab = ref(null)
</script>

<style scoped>
/* คง Style เดิมไว้ทั้งหมดเพื่อรักษา UI */
.page-title {
    font-size: 24px;
    color: #333;
}

.section-card {
    border: 1px solid #e0e0e0;
}

.field-label {
    font-size: 14px;
    font-weight: 500;
    color: #555;
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

.border-bottom {
    border-bottom: 1px solid #e0e0e0 !important;
}

.planting-table :deep(th) {
    font-size: 14px !important;
}
</style>