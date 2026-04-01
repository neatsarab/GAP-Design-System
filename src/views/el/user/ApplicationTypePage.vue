<template>
    <div>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
            <div>
                <h1 class="page-title mb-1">การยื่นคำขอ</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    เลือกประเภทคำขอที่ต้องการดำเนินการ
                </p>
            </div>
        </div>

        <!-- Type Cards -->
        <v-row>
            <v-col v-for="type in appTypes" :key="type.route" cols="12">
                <v-card class="type-card" hover elevation="0" rounded="xl" @click="goToAppType(type.route)">
                    <div class="d-flex align-center pa-6">
                        <!-- Icon Box -->
                        <div class="icon-box mr-6">
                            <v-icon :icon="type.icon" :color="type.iconColor" size="28" />
                        </div>

                        <!-- Content -->
                        <div class="flex-grow-1">
                            <h2 class="text-h6 font-weight-bold mb-1">{{ type.title }}</h2>
                            <p class="text-body-2 text-medium-emphasis mb-0">{{ type.description }}</p>
                        </div>

                        <!-- Status/Action Decorator -->
                        <div class="d-flex align-center">
                            <div class="node-line-container">
                                <div class="vertical-line"></div>
                                <v-btn icon variant="flat" color="el-user" size="small" class="node-dot">
                                    <v-icon icon="fas fa-arrow-right" size="14" color="white" />
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToApplicationList() {
    router.push({ name: "ELUserApplicationList" });
}

function goToAppType(route) {
    router.push(route);
}

const appTypes = [
    {
        route: "/el/user/applications/new/register",
        title: "แบบคำขอขึ้นทะเบียนโรงคัดบรรจุสินค้าพืช",
        description: "ยื่นขอรับการรับรองใหม่สำหรับหน่วยรับรอง",
        icon: "fas fa-file-signature",
        iconColor: "blue-darken-2",
        bgColor: "#E3F2FD",
        disabled: false,
    },
    {
        route: "/el/user/applications/new/scope",
        title: "แบบคำขอเพิ่ม - ลดขอบข่ายมาตรฐาน",
        description: "ปรับปรุงขอบข่ายการรับรองมาตรฐานสินค้าเกษตร",
        icon: "fas fa-layer-group",
        iconColor: "purple-darken-2",
        bgColor: "#F3E5F5",
        disabled: false,
    },
    {
        route: "/el/user/applications/new/amendment",
        title: "แบบคำขอเปลี่ยนแปลงข้อมูลใบรับรอง",
        description: "แก้ไขข้อมูลชื่อ ที่อยู่ หรือรายละเอียดปลีกย่อยในใบรับรอง",
        icon: "fas fa-edit",
        iconColor: "orange-darken-2",
        bgColor: "#FFF3E0",
        disabled: false,
    },
    {
        route: "/el/user/applications/new/cancel",
        title: "แบบคำขอยกเลิกใบรับรอง",
        description: "แจ้งความประสงค์ขอยกเลิกการรับรองมาตรฐาน",
        icon: "fas fa-file-circle-xmark",
        iconColor: "red-darken-2",
        bgColor: "#FFEBEE",
        disabled: false,
    },
];
</script>

<style scoped>
.type-card {
    border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 20px !important;
    cursor: pointer;
    transition:
        border-color 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.type-card:hover:not(.v-card--disabled) {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(var(--v-theme-el-user), 0.12) !important;
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
