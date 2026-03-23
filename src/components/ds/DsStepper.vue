<template>
  <v-card>
    <v-card-text class="pa-6">
      <AppStepper
        v-model="step"
        :steps="steps"
        @submit="handleSubmit"
      >
        <!-- Step 1 -->
        <template #step-1>
          <v-row dense>
            <v-col cols="12" sm="4">
              <v-autocomplete label="คำนำหน้า" :items="['นาย','นาง','นางสาว']" v-model="form.prefix" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="ชื่อ" v-model="form.firstName" :rules="[v => !!v || 'กรุณากรอก']" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="นามสกุล" v-model="form.lastName" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="เลขบัตรประชาชน" v-model="form.idCard" counter="13" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field label="เบอร์โทรศัพท์" v-model="form.phone" />
            </v-col>
          </v-row>
        </template>

        <!-- Step 2 -->
        <template #step-2>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field label="ชื่อแปลง" v-model="form.plotName" />
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field label="พื้นที่ (ไร่)" v-model="form.area" type="number" />
            </v-col>
            <v-col cols="12" sm="3">
              <v-autocomplete label="จังหวัด" :items="provinces" v-model="form.province" />
            </v-col>
          </v-row>
        </template>

        <!-- Step 3 -->
        <template #step-3>
          <v-file-input
            v-model="form.docs"
            label="เอกสารประกอบ"
            accept=".pdf,.doc,.docx"
            multiple show-size chips
            hint="สำเนาโฉนด, ผลวิเคราะห์น้ำ"
            persistent-hint
          />
        </template>

        <!-- Step 4 -->
        <template #step-4>
          <div class="text-center py-6">
            <v-icon icon="fas fa-circle-check" color="success" size="56" class="mb-4" />
            <div class="text-h6 font-weight-bold mb-2">ตรวจสอบข้อมูลแล้ว</div>
            <div class="text-body-2 text-medium-emphasis">
              {{ form.prefix }}{{ form.firstName }} {{ form.lastName }} — แปลง: {{ form.plotName || '-' }}
            </div>
          </div>
        </template>
      </AppStepper>
    </v-card-text>

    <v-snackbar v-model="submitted" color="success" location="bottom end" timeout="3000">
      <v-icon icon="fas fa-paper-plane" class="mr-2" />ยื่นคำขอสำเร็จ!
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import AppStepper from '@/components/common/AppStepper.vue'

const step      = ref(1)
const submitted = ref(false)

const steps = [
  { title: 'ข้อมูลผู้ขอ',    subtitle: 'ชื่อ-นามสกุล, บัตรประชาชน', icon: 'fas fa-user' },
  { title: 'ข้อมูลแปลง',     subtitle: 'ชื่อแปลง, พื้นที่, จังหวัด',  icon: 'fas fa-map-location-dot' },
  { title: 'เอกสารแนบ',      subtitle: 'PDF, DOC',                    icon: 'fas fa-paperclip' },
  { title: 'ตรวจสอบ & ยื่น', subtitle: 'ยืนยันและส่งคำขอ',             icon: 'fas fa-paper-plane' },
]

const form = ref({
  prefix: 'นาย', firstName: '', lastName: '', idCard: '', phone: '',
  plotName: '', area: '', province: '', docs: [],
})

const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ขอนแก่น', 'นครราชสีมา', 'สุพรรณบุรี']

function handleSubmit() {
  submitted.value = true
  step.value = 1
}
</script>
