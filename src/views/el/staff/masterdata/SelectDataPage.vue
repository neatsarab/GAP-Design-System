<template>
    <div class="pa-6">
        <div class="d-flex align-center justify-space-between mb-8 flex-wrap ga-3">
            <div>
                <h1 class="page-title mb-1 font-weight-bold">ข้อมูลระบบ</h1>
                <p class="text-body-2 text-medium-emphasis mb-0">
                    จัดการข้อมูลพื้นฐานและข้อมูลอ้างอิงเพื่อใช้ในระบบ Establishment List (EL)
                </p>
            </div>
        </div>

        <v-row>
            <v-col v-for="type in appTypes" :key="type.route" cols="12" sm="6" md="3">
                <v-card class="type-card h-100 d-flex flex-column" hover elevation="0" rounded="xl"
                    @click="goToAppType(type)">
                    <v-card-text class="pa-6 text-center flex-grow-1">
                        <div class="d-flex justify-center mb-4">
                            <!-- <div class="icon-box-center" :style="`background-color: ${type.bgColor || '#f5f5f5'}`">
                                <v-icon :icon="type.icon" :color="type.iconColor" size="32" />
                            </div> -->
                        </div>

                        <div>
                            <h2 class="text-body-1 font-weight-bold mb-1" style="line-height: 1.4">
                                {{ type.title }}
                            </h2>
                            <!-- <p class="text-caption text-medium-emphasis mb-0">
                {{ type.description }}
              </p> -->
                        </div>
                    </v-card-text>

                    <v-divider />

                    <div class="pa-2 d-flex justify-center bg-el-staff rounded-b-xl">
                        <v-icon icon="fas fa-chevron-right" size="12" color="white" />
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToAppType(type) {
    router.push({ 
        name: "ELStaffActionData", 
        params: { id: type.id } 
    });
}

// ชุดข้อมูล Master Data ตามภาพตัวอย่างและรายการ List
const appTypes = [
    { id: "el-reports", title: "รายงานพืช EL", icon: "fas fa-file-chart-line", iconColor: "blue-darken-2", bgColor: "#E3F2FD" },
    { id: "doa-factories", title: "ข้อมูลการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)", icon: "fas fa-industry", iconColor: "red-darken-2", bgColor: "#FFEBEE" },
    { id: "plots", title: "ข้อมูลแปลงเกษตรกร", icon: "fas fa-map-location-dot", iconColor: "orange-darken-3", bgColor: "#FFF3E0" },
    { id: "farmers", title: "ข้อมูลเกษตรกร", icon: "fas fa-user-gear", iconColor: "teal-darken-2", bgColor: "#E0F2F1" },
    { id: "inspect-unit-factory", title: "ข้อมูลหน่วยงานพื้นที่การตรวจโรงงาน", icon: "fas fa-building-shield", iconColor: "grey-darken-2", bgColor: "#F5F5F5" },
    { id: "inspect-unit-plot", title: "ข้อมูลหน่วยงานพื้นที่การตรวจแปลง", icon: "fas fa-building-shield", iconColor: "grey-darken-2", bgColor: "#F5F5F5" },
    { id: "pathogens", title: "ข้อมูลเชื้อจุลินทรีย์", icon: "fas fa-microscope", iconColor: "green-darken-2", bgColor: "#E8F5E9" },
    { id: "pests", title: "ข้อมูลศัตรูพืช", icon: "fas fa-bug", iconColor: "green-darken-2", bgColor: "#E8F5E9" },
    { id: "chemicals", title: "ข้อมูลสารเคมี", icon: "fas fa-flask-vial", iconColor: "indigo-darken-2", bgColor: "#E8EAF6" },
    { id: "country-groups", title: "ข้อมูลกลุ่มประเทศ", icon: "fas fa-globe-asia", iconColor: "cyan-darken-2", bgColor: "#E0F7FA" },
    { id: "countries", title: "ข้อมูลประเทศ", icon: "fas fa-globe-asia", iconColor: "cyan-darken-2", bgColor: "#E0F7FA" },
    { id: "rasff", title: "ข้อมูลผลิตภัณฑ์ RASFF", icon: "fas fa-shield-virus", iconColor: "deep-orange-darken-2", bgColor: "#FBE9E7" }
];
</script>

<style scoped>
.page-title {
    font-size: 1.75rem;
    color: #2c3e50;
}

.type-card {
    border: 1px solid #e0e0e0 !important;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.type-card:hover {
    transform: translateY(-5px);
    border-color: rgb(var(--v-theme-el-staff)) !important;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
}

.icon-box-center {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
}

.type-card:hover .icon-box-center {
    transform: scale(1.1);
}

/* Custom background colors for the bottom bar */
.bg-grey-lighten-5 {
    background-color: #f8f9fa !important;
}

:deep(.v-card-text) {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>