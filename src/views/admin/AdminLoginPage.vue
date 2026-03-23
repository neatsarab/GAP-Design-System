<template>
  <div class="admin-login-root" :class="{ 'is-dark': themeStore.isDark }">

    <!-- Background pattern -->
    <div class="admin-bg-pattern" />

    <!-- Card -->
    <div class="admin-login-card">
      <!-- Header bar -->
      <div class="admin-card-header">
        <div class="admin-header-icon">
          <v-icon icon="fas fa-user-shield" size="28" color="white" />
        </div>
        <div>
          <div class="text-body-1 font-weight-bold text-white">Administrator Login</div>
          <div class="text-caption" style="color: rgba(255,255,255,0.65)">ระบบบริหารจัดการ กรมวิชาการเกษตร</div>
        </div>
        <v-spacer />
        <v-btn
          variant="tonal"
          size="small"
          :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
          style="color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2)"
          @click="themeStore.toggle()"
        >
          {{ themeStore.isDark ? 'โหมดสว่าง' : 'โหมดมืด' }}
        </v-btn>
      </div>

      <!-- Form body -->
      <div class="admin-card-body">
        <div class="mb-6">
          <h2 class="text-h6 font-weight-bold mb-1">เข้าสู่ระบบ Admin</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">กรุณากรอก Username และ Password ของผู้ดูแลระบบ</p>
        </div>

        <v-alert
          color="warning"
          variant="tonal"
          rounded="lg"
          density="compact"
          prepend-icon="fas fa-triangle-exclamation"
          class="mb-5"
        >
          <span class="text-body-2">สำหรับผู้ดูแลระบบเท่านั้น การเข้าถึงโดยไม่ได้รับอนุญาตถือเป็นความผิด</span>
        </v-alert>

        <v-form ref="formRef" @submit.prevent="doLogin">
          <div class="field-label"><div>Username <span class="req">*</span></div><div class="field-label-en">Username</div></div>
          <v-text-field
            v-model="username"
            placeholder="Admin username"
            prepend-inner-icon="fas fa-user-shield"
            :rules="[rules.required]"
            hide-details="auto"
            class="mb-4"
            autofocus
          />

          <div class="field-label"><div>Password <span class="req">*</span></div><div class="field-label-en">Password</div></div>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Admin password"
            prepend-inner-icon="fas fa-lock"
            :append-inner-icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
            :rules="[rules.required]"
            hide-details="auto"
            class="mb-5"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-alert v-if="error" type="error" variant="tonal" class="mb-4" density="compact" prepend-icon="fas fa-circle-xmark">
            {{ error }}
          </v-alert>

          <v-btn
            type="submit"
            color="admin"
            size="large"
            block
            rounded="lg"
            :loading="loading"
            prepend-icon="fas fa-right-to-bracket"
          >
            เข้าสู่ระบบ Admin
          </v-btn>
        </v-form>

        <div class="d-flex justify-center mt-5">
          <v-btn
            variant="text"
            size="small"
            prepend-icon="fas fa-arrow-left"
            color="medium-emphasis"
            @click="router.push('/login')"
          >
            กลับหน้าเข้าสู่ระบบ
          </v-btn>
        </div>
      </div>

      <!-- Footer -->
      <div class="admin-card-footer">
        <v-icon icon="fas fa-shield-halved" size="12" class="mr-1" />
        <span class="text-caption" style="color: rgba(var(--v-theme-on-surface), 0.4)">Secure connection · © 2568 กรมวิชาการเกษตร</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";
import { useAdminStore } from "@/stores/admin.store";

const router = useRouter();
const themeStore = useThemeStore();
const adminStore = useAdminStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");
const formRef = ref();

const rules = {
  required: (v) => !!v || "กรุณากรอกข้อมูล",
};

async function doLogin() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  error.value = "";

  await new Promise((r) => setTimeout(r, 900));

  if (password.value === "admin") {
    if (username.value === "admin") {
      adminStore.setRole("sysadmin");
      adminStore.setUsername("admin");
      router.push("/admin/dashboard");
    } else if (username.value === "adminsso") {
      adminStore.setRole("adminsso");
      adminStore.setUsername("adminsso");
      router.push("/admin/access-requests");
    } else if (username.value === "adminsso01") {
      adminStore.setRole("adminsso");
      adminStore.setUsername("adminsso01");
      router.push("/admin/access-requests");
    } else if (username.value === "adminsso02") {
      adminStore.setRole("adminsso");
      adminStore.setUsername("adminsso02");
      router.push("/admin/access-requests");
    } else {
      error.value = "Username หรือ Password ไม่ถูกต้อง";
    }
  } else {
    error.value = "Username หรือ Password ไม่ถูกต้อง";
  }

  loading.value = false;
}
</script>

<style scoped>
.admin-login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(var(--v-theme-background));
  position: relative;
  padding: 24px;
}

.admin-bg-pattern {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(var(--v-theme-admin), 0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 70%, rgba(var(--v-theme-admin), 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.admin-login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  background: rgb(var(--v-theme-surface));
}

.admin-card-header {
  background: rgb(var(--v-theme-admin));
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.admin-card-body {
  padding: 32px 28px 24px;
}

.admin-card-footer {
  padding: 14px 28px;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface-variant), 0.4);
}

</style>
