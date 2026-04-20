<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-6">
      <div>
        <h1 class="page-title mb-1">ข้อมูลเกษตรกร (กสก.)</h1>
      </div>
    </div>

    <v-card rounded="xl" elevation="0" class="data-card">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :custom-key-sort="customKeySort"
        rounded="xl"
        hover
       
      >
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-btn icon size="x-small" color="teal-lighten-1" variant="flat" class="rounded-sm">
              <v-icon icon="fas fa-plus" size="10" color="white" />
            </v-btn>
            <v-btn icon size="x-small" color="blue-darken-1" variant="flat" class="rounded-sm" @click="goToApplicationDetail(item.id)">
              <v-icon icon="fas fa-edit" size="10" color="white" />
            </v-btn>
            <v-btn icon size="x-small" color="red-darken-1" variant="flat" class="rounded-sm">
              <v-icon icon="fas fa-trash-can" size="10" color="white" />
            </v-btn>
          </div>
        </template>

        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useLocale } from "vuetify";

const { current: vuetifyLocale } = useLocale();
vuetifyLocale.value = "th";

const router = useRouter();
const search = ref("");

const headers = [
  { title: "Opt", key: "actions", sortable: false, width: "120px" },
  { title: "ลำดับ", key: "index", sortable: false, width: "70px" },
  { title: "รหัสบัตรประชาชน", key: "idCard", sortable: true, width: "180px" },
  { title: "ชื่อ-นามสกุล", key: "fullName", sortable: true, width: "200px" },
  { title: "เบอร์โทร", key: "phone", sortable: false, width: "130px" },
  { title: "อีเมล", key: "email", sortable: false, width: "150px" },
  { title: "ที่อยู่", key: "address", sortable: false },
];

const allItems = ref([
  {
    id: 1,
    idCard: "3410600807682",
    fullName: "นางคำนาง แสนสิทธิ์",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 105 ช.- ถ.- ม.6 ต.หนองเม็ก อ.หนองหาน จ.อุดรธานี 41130",
  },
  {
    id: 2,
    idCard: "3410600809499",
    fullName: "นางสาวกาแล พรมโสภา",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 47 ช.- ถ.- ม.9 ต.หนองเม็ก อ.หนองหาน จ.อุดรธานี 41130",
  },
  {
    id: 3,
    idCard: "3410600806767",
    fullName: "นางราตรี บุญลอด",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 9 ช.- ถ.- ม.6 ต.หนองเม็ก อ.หนองหาน จ.อุดรธานี 41130",
  },
  {
    id: 4,
    idCard: "3461200081791",
    fullName: "นางสิรินันท์ มาดรา",
    phone: "0925201256",
    email: "-",
    address: "บ้านเลขที่ 111 ม.5 ต.หนองกุงศรี อ.หนองกุงศรี จ.กาฬสินธุ์ 46220",
  },
  {
    id: 5,
    idCard: "8501101002639",
    fullName: "นางสาวอาหล่า ยิง มูเซอ",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 105 ช.- ถ.- ม.7 ต.โหลงขอด อ.พร้าว จ.เชียงใหม่ 50190",
  },
  {
    id: 6,
    idCard: "8571576099092",
    fullName: "นายนิติธร สิริสลอง",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 105 ช.- ถ.- ม.7 ต.โหลงขอด อ.พร้าว จ.เชียงใหม่ 50190",
  },
  {
    id: 7,
    idCard: "8571576099092",
    fullName: "นายนิติธร สิริสลอง",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 105 ช.- ถ.- ม.7 ต.โหลงขอด อ.พร้าว จ.เชียงใหม่ 50190",
  },
  {
    id: 8,
    idCard: "8571576099092",
    fullName: "นายนิติธร สิริสลอง",
    phone: "-",
    email: "-",
    address: "บ้านเลขที่ 105 ช.- ถ.- ม.7 ต.โหลงขอด อ.พร้าว จ.เชียงใหม่ 50190",
  },
]);

const filteredItems = computed(() => {
  if (!search.value) return allItems.value;
  const q = search.value.toLowerCase();
  return allItems.value.filter(
    (i) =>
      i.idCard.includes(q) ||
      i.fullName.toLowerCase().includes(q) ||
      i.address.toLowerCase().includes(q)
  );
});

const customKeySort = {};

function goToApplicationDetail(id) {
  router.push({ name: "staffApplicationDetail", params: { id } });
}
</script>

<style scoped>
.farmer-table :deep(thead th) {
  background-color: #f8f9fa !important;
  font-weight: bold !important;
  color: #333 !important;
  border-bottom: 1px solid #e0e0e0 !important;
}

.farmer-table :deep(tbody td) {
  font-size: 13px !important;
  color: #555 !important;
}

/* ปุ่ม Action สี่เหลี่ยมตามรูป */
.rounded-sm {
  border-radius: 4px !important;
}
</style>