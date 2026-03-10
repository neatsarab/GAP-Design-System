<template>
  <div>
    <div class="mb-6">
      <h1 class="text-h5 font-weight-bold mb-1">ตั้งค่าระบบ</h1>
      <p class="text-body-2 text-medium-emphasis mb-0">จัดการผู้ใช้ สิทธิ์การเข้าถึง และการตั้งค่าทั่วไป</p>
    </div>

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-user-circle" color="primary" size="15" />
            <span class="text-subtitle-2 font-weight-bold">โปรไฟล์ผู้ใช้</span>
          </div>
          <v-card-text class="pa-5 text-center">
            <v-avatar color="primary" size="72" class="mb-3">
              <v-icon icon="fas fa-user" size="36" color="white" />
            </v-avatar>
            <div class="text-body-1 font-weight-bold">Admin GAP</div>
            <div class="text-caption text-medium-emphasis mb-4">เลขทะเบียน : 19903004</div>
            <v-chip size="small" color="primary" variant="tonal" prepend-icon="fas fa-shield-halved">ผู้ดูแลระบบ</v-chip>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <div class="d-flex align-center ga-2 px-4 py-3 border-b">
            <v-icon icon="fas fa-gear" color="primary" size="15" />
            <span class="text-subtitle-2 font-weight-bold">การตั้งค่าทั่วไป</span>
          </div>
          <v-list>
            <v-list-item prepend-icon="fas fa-palette" title="ธีม" subtitle="สลับโหมดสว่าง / มืด">
              <template #append>
                <v-switch :model-value="isDark" color="primary" hide-details inset density="compact" @change="toggleTheme" />
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="fas fa-bell" title="การแจ้งเตือน" subtitle="รับการแจ้งเตือนผ่านอีเมล">
              <template #append>
                <v-switch v-model="notifEmail" color="primary" hide-details inset density="compact" />
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="fas fa-language" title="ภาษา" subtitle="ภาษาของระบบ">
              <template #append>
                <v-chip size="small" color="primary" variant="tonal">ภาษาไทย</v-chip>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="fas fa-shield-halved" title="ความปลอดภัย" subtitle="เปลี่ยนรหัสผ่าน / 2FA">
              <template #append>
                <v-btn size="small" variant="tonal" color="primary">จัดการ</v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()
const isDark     = computed(() => themeStore.isDark)
function toggleTheme() { themeStore.toggle() }

const notifEmail = ref(true)
</script>
