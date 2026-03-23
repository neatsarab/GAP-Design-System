<template>
  <div>
    <div class="d-flex align-center ga-3 mb-6">
      <v-btn variant="text" prepend-icon="fas fa-arrow-left" size="small" @click="router.push('/gap/staff/applications')">
        กลับ
      </v-btn>
      <v-divider vertical style="height:24px" />
      <div>
        <h1 class="text-h6 font-weight-bold">ยื่นคำขอรับรอง GAP (เจ้าหน้าที่)</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">บันทึกคำขอรับรองแทนเกษตรกร</p>
      </div>
    </div>

    <!-- Application type selection -->
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-text class="pa-6">
            <div class="text-center mb-6">
              <v-icon icon="fas fa-file-pen" color="gap-staff" size="40" />
              <h2 class="text-h6 font-weight-bold mt-3 mb-2">เลือกประเภทคำขอ</h2>
              <p class="text-body-2 text-medium-emphasis">เลือกประเภทการยื่นขอรับรองมาตรฐาน GAP</p>
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <v-card
                  class="type-card"
                  variant="outlined"
                  @click="router.push('/gap/user/applications/new/individual')"
                >
                  <v-card-text class="pa-6 text-center">
                    <v-icon icon="fas fa-user" color="gap-staff" size="32" class="mb-3" />
                    <div class="text-body-1 font-weight-bold mb-2">คำขอแบบเดี่ยว</div>
                    <p class="text-caption text-medium-emphasis mb-0">
                      สำหรับเกษตรกรรายบุคคล หรือนิติบุคคล ยื่นขอรับรองแปลงของตนเอง
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card
                  class="type-card"
                  variant="outlined"
                  @click="router.push('/gap/user/applications/new/group')"
                >
                  <v-card-text class="pa-6 text-center">
                    <v-icon icon="fas fa-users" color="secondary" size="32" class="mb-3" />
                    <div class="text-body-1 font-weight-bold mb-2">คำขอแบบกลุ่ม</div>
                    <p class="text-caption text-medium-emphasis mb-0">
                      สำหรับกลุ่มเกษตรกรที่รวมกลุ่มขอรับรองพร้อมกัน มีระบบ ICS
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-alert type="info" variant="tonal" icon="fas fa-circle-info">
          <strong>หมายเหตุ:</strong> เจ้าหน้าที่สามารถบันทึกคำขอแทนเกษตรกรได้ โดยต้องมีหนังสือมอบอำนาจประกอบ
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.type-card {
  cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
}
.type-card:hover {
  border-color: rgb(var(--v-theme-gap-staff)) !important;
  box-shadow: 0 4px 16px rgba(var(--v-theme-gap-staff), 0.15) !important;
}
</style>
