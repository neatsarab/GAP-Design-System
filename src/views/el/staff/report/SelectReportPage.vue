<template>
    <div>
        <!-- Header -->
        <div class="d-flex align-center justify-space-between mb-6 flex-wrap ga-3">
            <div>
                <h1 class="page-title mb-1">รายงาน</h1>
            </div>
        </div>

        <!-- Type Cards -->
        <v-row>
            <v-col v-for="type in appTypes" :key="type.route" cols="12">
                <v-card class="type-card" hover elevation="0" rounded="xl" @click="goToAppType(type)">
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
                                <v-btn icon variant="flat" color="el-staff" size="small" class="node-dot">
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

function goToAppType(type) {
    router.push({ 
        name: "ELStaffListReport", 
        params: { id: type.id } 
    });
}

const appTypes = [
    {
        id: "assessment-doa",
        title: "รายงานการตรวจประเมินแปลงเกษตรและโรงงานผลิตสินค้าพืช (DOA)",
        description: "รายละเอียดการตรวจประเมินตามมาตรฐาน DOA ทั้งระบบ",
        icon: "fas fa-clipboard-check",
        iconColor: "el-staff",
    },
    {
        id: "registration-summary",
        title: "รายงานสรุปการขึ้นทะเบียนพืชของแปลงเกษตรกรและโรงงานผลิตสินค้าพืช (DOA)",
        description: "สรุปภาพรวมจำนวนการขึ้นทะเบียนพืชแยกตามประเภท",
        icon: "fas fa-file-invoice",
        iconColor: "el-staff",
    },
    {
        id: "inspection-summary",
        title: "รายงานสรุปการตรวจแปลงเกษตรกรและโรงงานผลิตสินค้าพืช (DOA)",
        description: "สรุปผลการตรวจประเมินแปลงและโรงงานในภาพรวม",
        icon: "fas fa-chart-pie",
        iconColor: "el-staff",
    },
    {
        id: "crop-inspection",
        title: "รายงานการตรวจแปลงเกษตรกรและโรงงานผลิตสินค้าพืช (DOA) แสดงเป็นรายพืช",
        description: "รายละเอียดการตรวจประเมินจำแนกตามชนิดพืช",
        icon: "fas fa-leaf",
        iconColor: "el-staff",
    },
    {
        id: "el-registration-summary",
        title: "รายงานสรุปข้อมูลการขึ้นทะเบียน EL ของแปลงเกษตรกรและโรงงานผลิตสินค้าพืช (DOA)",
        description: "สรุปสถิติการขึ้นทะเบียนในระบบ Establishment List",
        icon: "fas fa-list-check",
        iconColor: "el-staff",
    },
    {
        id: "duplicate-farmers",
        title: "รายงานโรงงานผลิตสินค้าพืช (DOA) ที่เกษตรกรซ้ำกัน",
        description: "ตรวจสอบความซ้ำซ้อนของข้อมูลเกษตรกรในแต่ละโรงงาน",
        icon: "fas fa-users-slash",
        iconColor: "el-staff",
    },
    {
        id: "cancel-plots",
        title: "รายงานยกเลิกแปลงเกษตรกร",
        description: "รายการแปลงที่แจ้งยกเลิกการรับรอง",
        icon: "fas fa-map-location-dot",
        iconColor: "el-staff",
    },
    {
        id: "cancel-factories",
        title: "รายงานการยกเลิกโรงงานผลิตสินค้าพืช (DOA)",
        description: "รายการโรงงานที่แจ้งยกเลิกการขึ้นทะเบียน",
        icon: "fas fa-industry",
        iconColor: "el-staff",
    },
    {
        id: "el-assessment-results",
        title: "รายงานสรุปผลการประเมินการขึ้นทะเบียน EL ของแปลงเกษตรกร",
        description: "สรุปคะแนนและผลการประเมิน EL รายแปลง",
        icon: "fas fa-star",
        iconColor: "el-staff",
    },
    {
        id: "cl02-inspection",
        title: "รายงานสรุปการตรวจแปลงเกษตรกร (CL-02)",
        description: "สรุปข้อมูลแบบตรวจประเมินแปลงเบื้องต้น (CL-02)",
        icon: "fas fa-file-lines",
        iconColor: "el-staff",
    },
    {
        id: "plot-count-summary",
        title: "รายงานสรุปจำนวนแปลงเกษตรกร",
        description: "สรุปสถิติจำนวนแปลงทั้งหมดในระบบแยกตามพื้นที่",
        icon: "fas fa-calculator",
        iconColor: "el-staff",
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
    box-shadow: 0 12px 32px rgba(var(--v-theme-el-staff), 0.12) !important;
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
