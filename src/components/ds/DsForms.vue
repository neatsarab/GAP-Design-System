<template>
  <div>
    <!-- หมวด 1: ข้อมูลผู้ยื่นคำขอ -->
    <v-card elevation="0" border rounded="xl" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon size="15" color="primary">fas fa-user</v-icon>
        <span class="text-subtitle-2 font-weight-bold">ข้อมูลผู้ยื่นคำขอ</span>
      </div>
      <v-card-text class="pt-5">
        <v-row dense>
          <v-col cols="12" sm="2">
            <div class="field-label">คำนำหน้า <span class="req">*</span></div>
            <v-autocomplete
              v-model="form.namePrefix"
              :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="5">
            <div class="field-label">ชื่อ <span class="req">*</span></div>
            <v-text-field
              v-model="form.firstName"
              placeholder="ชื่อจริง"
              :rules="[rules.required]"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="5">
            <div class="field-label">นามสกุล <span class="req">*</span></div>
            <v-text-field
              v-model="form.lastName"
              placeholder="นามสกุล"
              :rules="[rules.required]"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">
              เลขบัตรประชาชน <span class="req">*</span>
            </div>
            <v-text-field
              v-model="form.idCard"
              placeholder="X-XXXX-XXXXX-XX-X"
              prepend-inner-icon="fas fa-id-card"
              :rules="[rules.required, rules.idCard]"
              maxlength="13"
              counter
              hint="ตัวเลข 13 หลัก ไม่ใส่ขีด"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">
              เบอร์โทรศัพท์ <span class="req">*</span>
            </div>
            <v-text-field
              v-model="form.phone"
              placeholder="0XX-XXX-XXXX"
              prepend-inner-icon="fas fa-phone"
              :rules="[rules.required, rules.phone]"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">อีเมล</div>
            <v-text-field
              v-model="form.email"
              placeholder="example@email.com"
              prepend-inner-icon="fas fa-envelope"
              hint="ถ้ามี — ใช้รับการแจ้งเตือน"
              persistent-hint
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- หมวด 2: ที่อยู่ -->
    <v-card elevation="0" border rounded="xl" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon size="15" color="primary">fas fa-location-dot</v-icon>
        <span class="text-subtitle-2 font-weight-bold">ที่อยู่ที่ติดต่อ</span>
      </div>
      <v-card-text class="pt-5">
        <v-row dense>
          <v-col cols="12" sm="9">
            <div class="field-label">ที่อยู่ <span class="req">*</span></div>
            <v-textarea
              v-model="form.address"
              placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน"
              prepend-inner-icon="fas fa-house"
              rows="2"
              auto-grow
              :rules="[rules.required]"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <div class="field-label">รหัสไปรษณีย์</div>
            <v-text-field
              v-model="form.postalCode"
              placeholder="XXXXX"
              prepend-inner-icon="fas fa-map-pin"
              maxlength="5"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">จังหวัด <span class="req">*</span></div>
            <v-autocomplete
              v-model="form.province"
              :items="provinces"
              prepend-inner-icon="fas fa-map"
              :rules="[rules.required]"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">
              อำเภอ / เขต <span class="req">*</span>
            </div>
            <v-autocomplete
              v-model="form.district"
              :items="[
                'อำเภอเมือง',
                'อำเภอปากช่อง',
                'อำเภอโชคชัย',
                'อำเภอสีคิ้ว',
              ]"
              prepend-inner-icon="fas fa-city"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">
              ตำบล / แขวง <span class="req">*</span>
            </div>
            <v-autocomplete
              v-model="form.subDistrict"
              :items="['ตำบลในเมือง', 'ตำบลโพธิ์กลาง', 'ตำบลหนองไข่น้ำ']"
              prepend-inner-icon="fas fa-map-pin"
              hide-details="auto"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- หมวด 3: ข้อมูลแปลงและการผลิต -->
    <v-card elevation="0" border rounded="xl" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon size="15" color="primary">fas fa-seedling</v-icon>
        <span class="text-subtitle-2 font-weight-bold"
          >ข้อมูลแปลงและการผลิต</span
        >
      </div>
      <v-card-text class="pt-5">
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="field-label">ชนิดพืช <span class="req">*</span></div>
            <v-autocomplete
              v-model="form.cropTypes"
              :items="cropTypes"
              prepend-inner-icon="fas fa-seedling"
              multiple
              chips
              closable-chips
              :rules="[rules.required]"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="field-label">ผู้ตรวจประเมิน</div>
            <v-autocomplete
              v-model="form.inspector"
              :items="inspectors"
              prepend-inner-icon="fas fa-user-check"
              clearable
              hide-details="auto"
            />
          </v-col>

          <v-col cols="12" sm="6" class="mt-2">
            <div class="d-flex align-center justify-space-between mb-1">
              <span class="text-caption text-medium-emphasis"
                >พื้นที่แปลงปลูก (ไร่)</span
              >
              <v-text-field
                v-model.number="form.area"
                density="compact"
                variant="outlined"
                style="max-width: 90px"
                type="number"
                suffix="ไร่"
                hide-details
                :min="0"
                :max="100"
              />
            </div>
            <v-slider
              v-model="form.area"
              color="primary"
              track-color="surface-variant"
              :min="0"
              :max="100"
              :step="0.5"
              thumb-label
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" class="mt-2">
            <div class="text-caption text-medium-emphasis mb-1">
              ระดับความสูง (เมตร) &nbsp;
              <strong>{{ form.elevRange[0] }}</strong> –
              <strong>{{ form.elevRange[1] }}</strong> ม.
            </div>
            <v-range-slider
              v-model="form.elevRange"
              color="info"
              track-color="surface-variant"
              :min="0"
              :max="2000"
              :step="50"
              thumb-label
              hide-details
              class="mt-2"
            />
          </v-col>

          <v-col cols="12"><v-divider class="my-2" /></v-col>

          <v-col cols="12" sm="4">
            <div class="field-label">ประเภทคำขอ</div>
            <div class="rounded-lg pa-3 bg-surface-variant">
              <v-radio-group
                v-model="form.appType"
                color="primary"
                density="compact"
                hide-details
              >
                <v-radio label="รายเดี่ยว" value="single" />
                <v-radio label="รายกลุ่ม" value="group" />
                <v-radio label="ต่ออายุ" value="renew" />
              </v-radio-group>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">สถานะการผลิต</div>
            <div class="rounded-lg pa-3 bg-surface-variant">
              <v-switch
                v-model="form.organic"
                label="เกษตรอินทรีย์"
                color="primary"
                base-color="grey-darken-1"
                inset
                density="compact"
                hide-details
                class="mb-2"
              />
              <v-switch
                v-model="form.group"
                label="ยื่นคำขอรายกลุ่ม"
                color="info"
                base-color="grey-darken-1"
                inset
                density="compact"
                hide-details
              />
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="field-label">ข้อกำหนด GAP</div>
            <div class="rounded-lg pa-3 bg-surface-variant">
              <v-checkbox
                v-model="form.water"
                label="มีแหล่งน้ำในพื้นที่"
                color="primary"
                density="compact"
                hide-details
                class="mb-1"
              />
              <v-checkbox
                v-model="form.record"
                label="มีการบันทึกการผลิต"
                color="primary"
                density="compact"
                hide-details
                class="mb-1"
              />
              <v-checkbox
                v-model="form.chemical"
                label="บันทึกการใช้สารเคมี"
                color="warning"
                density="compact"
                hide-details
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- หมวด 4: เอกสารและหลักฐาน -->
    <v-card elevation="0" border rounded="xl" class="mb-4">
      <div class="d-flex align-center ga-2 px-4 py-3 border-b">
        <v-icon size="15" color="primary">fas fa-paperclip</v-icon>
        <span class="text-subtitle-2 font-weight-bold">เอกสารและหลักฐาน</span>
        <v-spacer />
        <v-chip size="x-small" variant="tonal" color="warning"
          >ไม่เกินไฟล์ละ 10 MB</v-chip
        >
      </div>
      <v-card-text class="pt-5">
        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="field-label">เอกสารประกอบ</div>
            <v-file-input
              v-model="form.docs"
              accept=".pdf,.doc,.docx"
              multiple
              show-size
              chips
              hint="สำเนาโฉนด, ผลวิเคราะห์น้ำ · รองรับ PDF, DOC"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="field-label">รูปภาพแปลงปลูก</div>
            <v-file-input
              v-model="form.photos"
              prepend-icon="fas fa-camera"
              accept="image/*"
              multiple
              show-size
              chips
              hint="JPG, PNG · ความละเอียดไม่ต่ำกว่า 1 MB"
              persistent-hint
            />
            <div
              v-if="photoPreviewUrls.length"
              class="d-flex flex-wrap ga-2 mt-3"
            >
              <v-img
                v-for="(url, i) in photoPreviewUrls"
                :key="i"
                :src="url"
                :alt="`รูปแปลงปลูก ${i + 1}`"
                width="80"
                height="80"
                cover
                rounded="lg"
                class="border"
              />
            </div>
          </v-col>
          <v-col cols="12">
            <div class="field-label">แท็กเพิ่มเติม</div>
            <v-combobox
              v-model="form.tags"
              :items="suggestedTags"
              prepend-inner-icon="fas fa-tags"
              multiple
              chips
              closable-chips
              hint="พิมพ์แล้ว Enter เพื่อเพิ่มแท็กใหม่"
              persistent-hint
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const form = ref({
  namePrefix: "นาย",
  firstName: "",
  lastName: "",
  idCard: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  province: null,
  district: null,
  subDistrict: null,
  cropTypes: [],
  inspector: null,
  tags: [],
  water: true,
  record: false,
  chemical: false,
  organic: false,
  group: false,
  appType: "single",
  area: 12,
  elevRange: [100, 500],
  docs: [],
  photos: [],
});

const photoPreviewUrls = ref<string[]>([]);

watch(
  () => form.value.photos as File[],
  (files) => {
    photoPreviewUrls.value.forEach((url) => URL.revokeObjectURL(url));
    photoPreviewUrls.value = (files ?? []).map((f) => URL.createObjectURL(f));
  },
);

onUnmounted(() => {
  photoPreviewUrls.value.forEach((url) => URL.revokeObjectURL(url));
});

const rules = {
  required: (v: string) => !!v || "กรุณากรอกข้อมูล",
  idCard: (v: string) => /^\d{13}$/.test(v) || "เลขบัตรประชาชน 13 หลัก",
  phone: (v: string) => /^0\d{8,9}$/.test(v) || "รูปแบบเบอร์โทรไม่ถูกต้อง",
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
const suggestedTags = ["เกษตรอินทรีย์", "ปลอดสาร", "GAP", "พืชส่งออก"];
</script>

<style scoped>
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 6px;
}
.req {
  color: rgb(var(--v-theme-error));
}
</style>
