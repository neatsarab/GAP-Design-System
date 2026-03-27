<template>
  <div class="pa-6 grey-lighten-4 min-h-screen">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold text-doa-user">ระบบบัญชีรายชื่อโรงคัดบรรจุ</h1>
        <p class="text-body-2 text-medium-emphasis">จัดการข้อมูลเกษตรกร แปลงปลูก และมาตรฐานโรงงาน</p>
      </div>
      <div class="d-flex ga-2">
        <v-btn variant="outlined" color="doa-user" prepend-icon="fas fa-file-export">ส่งออก PDF</v-btn>
      </div>
    </div>

    <!-- ส่วนที่ 1: ข้อมูลเกษตรกร -->
    <v-card rounded="xl" elevation="0" class="mb-6 border">
      <v-toolbar color="transparent" density="comfortable">
        <v-toolbar-title class="text-subtitle-1 font-weight-bold">
          1. ข้อมูลเกษตรกรที่ขอใบรับรอง GAP
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="px-4 d-flex ga-2">
          <v-btn color="primary" prepend-icon="fas fa-plus" size="small" rounded="lg" @click="addFarmer">สร้างใหม่</v-btn>
          <v-btn color="error" variant="tonal" prepend-icon="fas fa-trash" size="small" rounded="lg">ลบ</v-btn>
        </div>
      </v-toolbar>
      <v-divider></v-divider>
      <v-data-table
        :headers="farmerHeaders"
        :items="farmers"
        density="comfortable"
        hover
        class="rounded-b-xl"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon="fas fa-pen" variant="text" size="x-small" color="doa-user"></v-btn>
        </template>
        <template v-slot:no-data>
          <div class="pa-8 text-center text-medium-emphasis">ไม่มีข้อมูลเกษตรกร - กรุณากดปุ่มสร้างใหม่</div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ส่วนที่ 2: ข้อมูลแปลงเกษตรกร -->
    <v-card rounded="xl" elevation="0" class="mb-6 border">
      <v-toolbar color="transparent" density="comfortable">
        <v-toolbar-title class="text-subtitle-1 font-weight-bold">
          2. ข้อมูลแปลงเกษตรกรที่ขอใบรับรอง GAP
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="px-4 d-flex ga-2">
          <v-btn color="primary" prepend-icon="fas fa-plus" size="small" rounded="lg">สร้างใหม่</v-btn>
          <v-btn color="error" variant="tonal" prepend-icon="fas fa-trash" size="small" rounded="lg">ลบ</v-btn>
        </div>
      </v-toolbar>
      <v-divider></v-divider>
      <v-data-table
        :headers="farmHeaders"
        :items="farms"
        density="comfortable"
        class="rounded-b-xl"
      ></v-data-table>
    </v-card>

    <!-- ส่วนที่ 3: ข้อมูลใบรับรอง GMP -->
    <v-card rounded="xl" elevation="0" class="mb-10 border">
      <v-toolbar color="transparent" density="comfortable">
        <v-toolbar-title class="text-subtitle-1 font-weight-bold">
          3. ข้อมูลใบรับรอง GMP ของโรงคัดบรรจุ
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="px-4 d-flex ga-2">
          <v-btn color="primary" prepend-icon="fas fa-plus" size="small" rounded="lg">สร้างใหม่</v-btn>
          <v-btn color="error" variant="tonal" prepend-icon="fas fa-trash" size="small" rounded="lg">ลบ</v-btn>
        </div>
      </v-toolbar>
      <v-divider></v-divider>
      <v-data-table
        :headers="factoryHeaders"
        :items="factories"
        density="comfortable"
        class="rounded-b-xl"
      ></v-data-table>
    </v-card>

    <!-- Footer Actions -->
    <v-footer app color="white" class="border-t pa-4 justify-space-between">
      <v-btn variant="tonal" color="grey" prepend-icon="fas fa-arrow-left">ย้อนกลับ</v-btn>
      <div class="d-flex ga-3">
        <v-btn variant="tonal" color="doa-user" prepend-icon="fas fa-floppy-disk">บันทึกร่าง</v-btn>
        <v-btn color="doa-user" append-icon="fas fa-paper-plane" px-8>ยื่นคำขอ</v-btn>
      </div>
    </v-footer>
  </div>
</template>