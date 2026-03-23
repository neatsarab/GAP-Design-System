<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn variant="text" prepend-icon="fas fa-arrow-left" size="small" @click="router.push('/gap/staff/applications')">กลับ</v-btn>
      <v-divider vertical style="height:24px" />
      <div>
        <h1 class="text-h6 font-weight-bold">ยื่นคำขอรับรอง GAP (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">บันทึกคำขอรับรองแทนเกษตรกรโดยเจ้าหน้าที่</p>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="gap-staff" class="mb-5">
      <v-tab value="individual" prepend-icon="fas fa-user">คำขอแบบเดี่ยว</v-tab>
      <v-tab value="group" prepend-icon="fas fa-users">คำขอแบบกลุ่ม</v-tab>
      <v-tab value="correction" prepend-icon="fas fa-pen-to-square">แก้ไขใบรับรอง</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab">

      <!-- ── Tab: แบบเดี่ยว ── -->
      <v-tabs-window-item value="individual">
        <v-form ref="formIndividual" @submit.prevent="submitIndividual">
          <v-row>
            <!-- ข้อมูลเกษตรกร -->
            <v-col cols="12">
              <v-card rounded="xl" elevation="0" class="mb-4">
                <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
                  <v-icon icon="fas fa-user" color="gap-staff" size="16" class="mr-2" />ข้อมูลเกษตรกร
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                  <v-row dense>
                    <v-col cols="12" sm="6" md="3">
                      <div class="field-label"><div>คำนำหน้า</div><div class="field-label-en">Title</div></div>
                      <v-autocomplete v-model="ind.title" :items="titleOptions" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ชื่อ</div><div class="field-label-en">First Name</div></div>
                      <v-text-field v-model="ind.firstName" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="5">
                      <div class="field-label"><div>นามสกุล</div><div class="field-label-en">Last Name</div></div>
                      <v-text-field v-model="ind.lastName" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>เลขบัตรประชาชน</div><div class="field-label-en">ID Card</div></div>
                      <v-text-field v-model="ind.idCard" variant="outlined" density="compact" rounded="lg" hide-details maxlength="13" :rules="[required, idCardRule]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>เบอร์โทรศัพท์</div><div class="field-label-en">Phone</div></div>
                      <v-text-field v-model="ind.phone" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>อีเมล</div><div class="field-label-en">Email</div></div>
                      <v-text-field v-model="ind.email" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="12">
                      <div class="field-label"><div>ที่อยู่</div><div class="field-label-en">Address</div></div>
                      <v-text-field v-model="ind.address" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="6" sm="4">
                      <div class="field-label"><div>จังหวัด</div><div class="field-label-en">Province</div></div>
                      <v-autocomplete v-model="ind.province" :items="provinces" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- ข้อมูลแปลง -->
            <v-col cols="12">
              <v-card rounded="xl" elevation="0" class="mb-4">
                <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
                  <v-icon icon="fas fa-map-location-dot" color="gap-staff" size="16" class="mr-2" />ข้อมูลแปลงเกษตร
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ชนิดพืช</div><div class="field-label-en">Crop Type</div></div>
                      <v-combobox v-model="ind.cropType" :items="cropTypes" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>พื้นที่ (ไร่)</div><div class="field-label-en">Area (Rai)</div></div>
                      <v-text-field v-model="ind.area" type="number" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>จำนวนแปลง</div><div class="field-label-en">Plots</div></div>
                      <v-text-field v-model="ind.plotCount" type="number" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>จังหวัดที่ตั้งแปลง</div><div class="field-label-en">Plot Province</div></div>
                      <v-autocomplete v-model="ind.plotProvince" :items="provinces" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ตำบล / อำเภอ</div><div class="field-label-en">Subdistrict / District</div></div>
                      <v-text-field v-model="ind.subDistrict" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>Lat</div><div class="field-label-en">Latitude</div></div>
                      <v-text-field v-model="ind.lat" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>Long</div><div class="field-label-en">Longitude</div></div>
                      <v-text-field v-model="ind.lng" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- ข้อมูลคำขอ -->
            <v-col cols="12">
              <v-card rounded="xl" elevation="0" class="mb-4">
                <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
                  <v-icon icon="fas fa-certificate" color="gap-staff" size="16" class="mr-2" />ข้อมูลคำขอรับรอง
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ประเภทการขอรับรอง</div><div class="field-label-en">Request Type</div></div>
                      <v-autocomplete v-model="ind.requestType" :items="indRequestTypes" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>มาตรฐานที่ขอรับรอง</div><div class="field-label-en">Standard</div></div>
                      <v-autocomplete v-model="ind.standard" :items="standards" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ปีการผลิต</div><div class="field-label-en">Production Year</div></div>
                      <v-text-field v-model="ind.productionYear" variant="outlined" density="compact" rounded="lg" hide-details placeholder="เช่น 2568" />
                    </v-col>
                    <v-col cols="12">
                      <div class="field-label"><div>หมายเหตุ</div><div class="field-label-en">Note</div></div>
                      <v-textarea v-model="ind.note" variant="outlined" rounded="lg" hide-details rows="2" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex justify-end ga-3 mt-2">
            <v-btn variant="tonal" color="grey" @click="resetIndividual">ล้างข้อมูล</v-btn>
            <v-btn color="gap-staff" prepend-icon="fas fa-floppy-disk" type="submit">บันทึกคำขอ</v-btn>
          </div>
        </v-form>
      </v-tabs-window-item>

      <!-- ── Tab: แบบกลุ่ม ── -->
      <v-tabs-window-item value="group">
        <v-form ref="formGroup" @submit.prevent="submitGroup">
          <v-row>
            <!-- ข้อมูลกลุ่ม -->
            <v-col cols="12">
              <v-card rounded="xl" elevation="0" class="mb-4">
                <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
                  <v-icon icon="fas fa-users" color="gap-staff" size="16" class="mr-2" />ข้อมูลกลุ่มเกษตรกร
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                  <v-row dense>
                    <v-col cols="12" sm="8">
                      <div class="field-label"><div>ชื่อกลุ่ม / สหกรณ์</div><div class="field-label-en">Group / Cooperative Name</div></div>
                      <v-text-field v-model="grp.groupName" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="field-label"><div>ทะเบียนกลุ่ม</div><div class="field-label-en">Group Registration No.</div></div>
                      <v-text-field v-model="grp.groupRegNo" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ชื่อประธานกลุ่ม</div><div class="field-label-en">Group Leader</div></div>
                      <v-text-field v-model="grp.leader" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>เบอร์โทรศัพท์ประธาน</div><div class="field-label-en">Leader Phone</div></div>
                      <v-text-field v-model="grp.leaderPhone" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>จังหวัด</div><div class="field-label-en">Province</div></div>
                      <v-autocomplete v-model="grp.province" :items="provinces" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12">
                      <div class="field-label"><div>ที่อยู่กลุ่ม</div><div class="field-label-en">Group Address</div></div>
                      <v-text-field v-model="grp.address" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- ข้อมูลคำขอกลุ่ม -->
            <v-col cols="12">
              <v-card rounded="xl" elevation="0" class="mb-4">
                <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
                  <v-icon icon="fas fa-certificate" color="gap-staff" size="16" class="mr-2" />ข้อมูลคำขอรับรอง
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ประเภทการขอรับรอง</div><div class="field-label-en">Request Type</div></div>
                      <v-autocomplete v-model="grp.requestType" :items="indRequestTypes" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>มาตรฐานที่ขอรับรอง</div><div class="field-label-en">Standard</div></div>
                      <v-autocomplete v-model="grp.standard" :items="standards" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>จำนวนสมาชิก</div><div class="field-label-en">Members</div></div>
                      <v-text-field v-model="grp.memberCount" type="number" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>จำนวนแปลงรวม</div><div class="field-label-en">Total Plots</div></div>
                      <v-text-field v-model="grp.totalPlots" type="number" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ชนิดพืชหลัก</div><div class="field-label-en">Main Crop</div></div>
                      <v-combobox v-model="grp.cropType" :items="cropTypes" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="6" sm="3" md="2">
                      <div class="field-label"><div>พื้นที่รวม (ไร่)</div><div class="field-label-en">Total Area</div></div>
                      <v-text-field v-model="grp.totalArea" type="number" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="12">
                      <div class="field-label"><div>หมายเหตุ</div><div class="field-label-en">Note</div></div>
                      <v-textarea v-model="grp.note" variant="outlined" rounded="lg" hide-details rows="2" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex justify-end ga-3 mt-2">
            <v-btn variant="tonal" color="grey" @click="resetGroup">ล้างข้อมูล</v-btn>
            <v-btn color="gap-staff" prepend-icon="fas fa-floppy-disk" type="submit">บันทึกคำขอ</v-btn>
          </div>
        </v-form>
      </v-tabs-window-item>

      <!-- ── Tab: แก้ไขใบรับรอง ── -->
      <v-tabs-window-item value="correction">
        <v-form ref="formCorrection" @submit.prevent="submitCorrection">
          <v-row>
            <v-col cols="12">
              <v-card rounded="xl" elevation="0" class="mb-4">
                <v-card-title class="pa-5 pb-3 text-body-1 font-weight-bold">
                  <v-icon icon="fas fa-pen-to-square" color="gap-staff" size="16" class="mr-2" />ข้อมูลการแก้ไขใบรับรอง
                </v-card-title>
                <v-divider />
                <v-card-text class="pa-5">
                  <v-row dense>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>เลขที่ใบรับรองเดิม</div><div class="field-label-en">Original Certificate No.</div></div>
                      <v-text-field v-model="cor.certNo" variant="outlined" density="compact" rounded="lg" hide-details placeholder="GAP-CERT-2568-XXXXX" :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ชื่อเกษตรกร / กลุ่ม</div><div class="field-label-en">Farmer / Group Name</div></div>
                      <v-text-field v-model="cor.farmerName" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>เบอร์โทรศัพท์</div><div class="field-label-en">Phone</div></div>
                      <v-text-field v-model="cor.phone" variant="outlined" density="compact" rounded="lg" hide-details />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>ประเภทการแก้ไข</div><div class="field-label-en">Correction Type</div></div>
                      <v-autocomplete v-model="cor.correctionType" :items="correctionTypes" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <div class="field-label"><div>มาตรฐาน</div><div class="field-label-en">Standard</div></div>
                      <v-autocomplete v-model="cor.standard" :items="standards" item-title="label" item-value="value" variant="outlined" density="compact" rounded="lg" hide-details :rules="[required]" />
                    </v-col>
                    <v-col cols="12">
                      <div class="field-label"><div>รายการที่ต้องการแก้ไข</div><div class="field-label-en">Items to Correct</div></div>
                      <v-textarea v-model="cor.correctionDetail" variant="outlined" rounded="lg" hide-details rows="3" placeholder="ระบุรายการที่ต้องการแก้ไข เช่น แก้ไขชื่อเกษตรกร / เพิ่มพื้นที่แปลง" :rules="[required]" />
                    </v-col>
                    <v-col cols="12">
                      <div class="field-label"><div>หมายเหตุเพิ่มเติม</div><div class="field-label-en">Additional Note</div></div>
                      <v-textarea v-model="cor.note" variant="outlined" rounded="lg" hide-details rows="2" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div class="d-flex justify-end ga-3 mt-2">
            <v-btn variant="tonal" color="grey" @click="resetCorrection">ล้างข้อมูล</v-btn>
            <v-btn color="gap-staff" prepend-icon="fas fa-floppy-disk" type="submit">บันทึกคำขอแก้ไข</v-btn>
          </div>
        </v-form>
      </v-tabs-window-item>

    </v-tabs-window>

    <!-- Success snackbar -->
    <v-snackbar v-model="snackbar" color="success" location="top" timeout="3000">
      <v-icon icon="fas fa-circle-check" class="mr-2" />
      บันทึกคำขอเรียบร้อยแล้ว
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref("individual");
const snackbar = ref(false);

// ── Validation ──
const required = (v) => !!v || "จำเป็นต้องกรอก";
const idCardRule = (v) => /^\d{13}$/.test(v) || "เลขบัตรต้องมี 13 หลัก";

// ── Options ──
const titleOptions = ["นาย", "นาง", "น.ส.", "ด.ช.", "ด.ญ.", "อื่น ๆ"];
const provinces = [
  "กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี","ฉะเชิงเทรา",
  "ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก",
  "นครปฐม","นครพนม","นครราชสีมา","นครศรีธรรมราช","นครสวรรค์","นนทบุรี","นราธิวาส","น่าน",
  "บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา",
  "พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่","ภูเก็ต",
  "มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี",
  "ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ",
  "สมุทรสงคราม","สมุทรสาคร","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี",
  "สุรินทร์","หนองคาย","หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี",
];
const cropTypes = ["ทุเรียน","มังคุด","ลำไย","ลิ้นจี่","มะม่วง","มะนาว","ฝรั่ง","ส้มโอ","กล้วยหอม","สตรอว์เบอร์รี","ข้าว","ข้าวโพด","กระเทียม","หอมแดง","พริก","มันสำปะหลัง","สับปะรด","อื่น ๆ"];
const standards = [
  { label: "มกษ. 9001 (GAP พืช)", value: "มกษ. 9001" },
  { label: "มกษ. 3502 (ข้าวอินทรีย์)", value: "มกษ. 3502" },
  { label: "มกษ. 6401 (GAP ข้าว)", value: "มกษ. 6401" },
];
const indRequestTypes = [
  { label: "ขอรับรองครั้งแรก",    value: "new" },
  { label: "ต่ออายุใบรับรอง",     value: "renew" },
  { label: "เพิ่มพื้นที่/พืช",    value: "expand" },
  { label: "ลดพื้นที่/พืช",      value: "reduce" },
];
const correctionTypes = [
  { label: "แก้ไขข้อมูลเกษตรกร",   value: "farmer_info" },
  { label: "แก้ไขข้อมูลแปลง",      value: "plot_info" },
  { label: "แก้ไขชนิดพืช",         value: "crop_type" },
  { label: "แก้ไขพื้นที่",          value: "area" },
  { label: "แก้ไขที่อยู่",          value: "address" },
  { label: "อื่น ๆ",               value: "other" },
];

// ── Form data: Individual ──
const ind = reactive({
  title: "", firstName: "", lastName: "", idCard: "", phone: "", email: "",
  address: "", province: "",
  cropType: "", area: "", plotCount: "", plotProvince: "", subDistrict: "", lat: "", lng: "",
  requestType: "", standard: "", productionYear: "", note: "",
});

function resetIndividual() {
  Object.keys(ind).forEach(k => { (ind)[k] = ""; });
}
function submitIndividual() {
  snackbar.value = true;
  setTimeout(() => router.push("/gap/staff/applications"), 1500);
}

// ── Form data: Group ──
const grp = reactive({
  groupName: "", groupRegNo: "", leader: "", leaderPhone: "", province: "", address: "",
  requestType: "", standard: "", memberCount: "", totalPlots: "", cropType: "", totalArea: "", note: "",
});

function resetGroup() {
  Object.keys(grp).forEach(k => { (grp)[k] = ""; });
}
function submitGroup() {
  snackbar.value = true;
  setTimeout(() => router.push("/gap/staff/applications"), 1500);
}

// ── Form data: Correction ──
const cor = reactive({
  certNo: "", farmerName: "", phone: "", correctionType: "", standard: "", correctionDetail: "", note: "",
});

function resetCorrection() {
  Object.keys(cor).forEach(k => { (cor)[k] = ""; });
}
function submitCorrection() {
  snackbar.value = true;
  setTimeout(() => router.push("/gap/staff/applications"), 1500);
}
</script>
