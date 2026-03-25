<template>
    <div>
        <!-- Header -->
        <div class="d-flex align-center ga-3 mb-6">
            <v-btn icon="fas fa-arrow-left" variant="text" size="small" @click="goToApplicationList" />
            <div>
                <h1 class="page-title mb-0">ยื่นคำขอขึ้นทะเบียนโรงงานผลิตสินค้าพืช</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">เลือกประเภทคำขอที่ต้องการยื่น</p>
            </div>
        </div>

        <!-- Type Cards -->
        <v-row justify="start">
            <v-col v-for="type in appTypes" :key="type.route" cols="12" md="4">
                <v-card class="type-card h-100 d-flex flex-column" hover :ripple="false"
                    @click="goToAppType(type.route)" min-height="450">
                    <v-card-text class="pa-8 d-flex flex-column align-center text-center">
                        <div class="type-icon-box mb-5" :style="`background:rgba(var(--v-theme-${type.color}),0.1)`">
                            <v-icon :icon="type.icon" :color="type.color" size="40" />
                        </div>

                        <div class="d-flex align-center ga-2 mb-2">
                            <h2 class="text-h6 font-weight-bold">{{ type.title }}</h2>
                            <v-chip v-if="type.badge" size="x-small" :color="type.color" variant="tonal">
                                {{ type.badge }}
                            </v-chip>
                        </div>

                        <p class="text-body-2 text-medium-emphasis mb-5">{{ type.description }}</p>

                        <v-list density="compact" class="w-100 text-left bg-transparent pa-0">
                            <v-list-item v-for="f in type.features" :key="f" prepend-icon="fas fa-circle-check"
                                :title="f" :base-color="type.color" class="px-0" density="compact" />
                        </v-list>
                    </v-card-text>

                    <v-spacer></v-spacer>

                    <v-card-actions class="pa-8 pt-0">
                        <v-btn :color="type.color" block rounded="lg" append-icon="fas fa-arrow-right" variant="flat"
                            size="large">
                            สร้างคำขอ
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Info -->
        <v-alert type="info" variant="tonal" class="mt-6" prepend-icon="fas fa-circle-info" rounded="xl">
            <strong>หมายเหตุ:</strong> เอกสารที่ใช้ประกอบการยื่นคำขอต้องรับรองสำเนาถูกต้อง
            ผู้ยื่นคำขอต้องเป็นผู้มีอำนาจลงนาม หากยื่นด้วยตนเองต้องแสดง<strong>บัตรประชาชนตัวจริง</strong>
        </v-alert>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
    router.push({ name: "DOAUserApplicationList" });
}

function goToAppType(route) {
    router.push(route);
}

const appTypes = [
    {
        route: "/doa/user/applications/new/register",
        title: "ขึ้นทะเบียน / ต่ออายุทะเบียน",
        badge: null,
        icon: "fas fa-industry",
        color: "info",
        description: null,
        features: null,
    },
    {
        route: "/doa/user/applications/new/amendment",
        title: "คำขอแก้ไขข้อมูลทะเบียน",
        badge: null,
        icon: "fas fa-file-pen",
        color: "warning",
        description: null,
        features: null,
    },
    {
        route: "/doa/user/applications/new/scope",
        title: "คำขอเพิ่ม / ลดขอบข่ายมาตรฐาน",
        badge: null,
        icon: "fas fa-sliders",
        color: "info",
        description: null,
        features: null,
    },
];
</script>

<style scoped>
.type-card {
    border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 20px !important;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.type-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(var(--v-theme-doa-user), 0.12) !important;
}

.type-icon-box {
    width: 88px;
    height: 88px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
