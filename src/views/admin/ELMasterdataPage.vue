<template>
  <div>
    <!-- Page header -->
    <div class="d-flex align-center justify-space-between mb-4 flex-wrap ga-3">
      <div>
        <h1 class="text-h6 font-weight-bold mb-1">Masterdata</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          สำหรับระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment
          List: EL)
        </p>
      </div>
    </div>

    <!-- Tab navigation -->
    <v-tabs v-model="activeTab" color="admin" class="mb-5" show-arrows>
      <v-tab v-for="cat in categories" :key="cat.key" :value="cat.key">
        <v-icon start :icon="cat.icon" size="13" />
        {{ cat.label }}
      </v-tab>
    </v-tabs>

    <!-- ── รายชื่อพืช ── -->
    <template v-if="activeTab === 'plants'">
      <MasterdataTable
        title="รายชื่อพืช (EL)"
        subtitle="Plant List"
        icon="fas fa-seedling"
        color="success"
        :headers="plantsHeaders"
        :items="plants"
        @add="openDialog('plants')"
        @edit="(item) => openDialog('plants', item)"
        @delete="(item) => openDeleteDialog(item, 'plants')"
      />
    </template>

    <!-- ── ข้อมูลแปลงเกษตรกร ── -->
    <template v-if="activeTab === 'plots'">
      <MasterdataTable
        title="ข้อมูลแปลงเกษตรกร"
        subtitle="Farmer Plot Data"
        icon="fas fa-map"
        color="success"
        :headers="plotsHeaders"
        :items="plots"
        @add="openDialog('plots')"
        @edit="(item) => openDialog('plots', item)"
        @delete="(item) => openDeleteDialog(item, 'plots')"
      />
    </template>

    <!-- ── ข้อมูลเกษตรกร ── -->
    <template v-if="activeTab === 'farmers'">
      <MasterdataTable
        title="ข้อมูลเกษตรกร"
        subtitle="Farmer Data"
        icon="fas fa-user-tie"
        color="success"
        :headers="farmersHeaders"
        :items="farmers"
        @add="openDialog('farmers')"
        @edit="(item) => openDialog('farmers', item)"
        @delete="(item) => openDeleteDialog(item, 'farmers')"
      />
    </template>

    <!-- ── หน่วยงานตรวจโรงงาน ── -->
    <template v-if="activeTab === 'agencyFactory'">
      <MasterdataTable
        title="หน่วยงานพื้นที่การตรวจโรงงาน"
        subtitle="Factory Inspection Agency"
        icon="fas fa-industry"
        color="admin"
        :headers="agencyHeaders"
        :items="agenciesFactory"
        @add="openDialog('agencyFactory')"
        @edit="(item) => openDialog('agencyFactory', item)"
        @delete="(item) => openDeleteDialog(item, 'agencyFactory')"
      />
    </template>

    <!-- ── หน่วยงานตรวจแปลง ── -->
    <template v-if="activeTab === 'agencyPlot'">
      <MasterdataTable
        title="หน่วยงานพื้นที่การตรวจแปลง"
        subtitle="Plot Inspection Agency"
        icon="fas fa-map-pin"
        color="admin"
        :headers="agencyHeaders"
        :items="agenciesPlot"
        @add="openDialog('agencyPlot')"
        @edit="(item) => openDialog('agencyPlot', item)"
        @delete="(item) => openDeleteDialog(item, 'agencyPlot')"
      />
    </template>

    <!-- ── เชื้อจุลินทรีย์ ── -->
    <template v-if="activeTab === 'microbes'">
      <MasterdataTable
        title="ข้อมูลเชื้อจุลินทรีย์"
        subtitle="Microorganism Data"
        icon="fas fa-biohazard"
        color="warning"
        :headers="microbesHeaders"
        :items="microbes"
        @add="openDialog('microbes')"
        @edit="(item) => openDialog('microbes', item)"
        @delete="(item) => openDeleteDialog(item, 'microbes')"
      />
    </template>

    <!-- ── ศัตรูพืช ── -->
    <template v-if="activeTab === 'pests'">
      <MasterdataTable
        title="ข้อมูลศัตรูพืช"
        subtitle="Plant Pest Data"
        icon="fas fa-bug"
        color="warning"
        :headers="pestsHeaders"
        :items="pests"
        @add="openDialog('pests')"
        @edit="(item) => openDialog('pests', item)"
        @delete="(item) => openDeleteDialog(item, 'pests')"
      />
    </template>

    <!-- ── สารเคมี ── -->
    <template v-if="activeTab === 'chemicals'">
      <MasterdataTable
        title="ข้อมูลสารเคมี"
        subtitle="Chemical Data"
        icon="fas fa-flask"
        color="error"
        :headers="chemicalsHeaders"
        :items="chemicals"
        @add="openDialog('chemicals')"
        @edit="(item) => openDialog('chemicals', item)"
        @delete="(item) => openDeleteDialog(item, 'chemicals')"
      />
    </template>

    <!-- ── กลุ่มประเทศ ── -->
    <template v-if="activeTab === 'countryGroups'">
      <MasterdataTable
        title="ข้อมูลกลุ่มประเทศ"
        subtitle="Country Group Data"
        icon="fas fa-earth-asia"
        color="info"
        :headers="countryGroupsHeaders"
        :items="countryGroups"
        @add="openDialog('countryGroups')"
        @edit="(item) => openDialog('countryGroups', item)"
        @delete="(item) => openDeleteDialog(item, 'countryGroups')"
      />
    </template>

    <!-- ── ประเทศ ── -->
    <template v-if="activeTab === 'countries'">
      <MasterdataTable
        title="ข้อมูลประเทศ"
        subtitle="Country Data"
        icon="fas fa-flag"
        color="info"
        :headers="countriesHeaders"
        :items="countries"
        @add="openDialog('countries')"
        @edit="(item) => openDialog('countries', item)"
        @delete="(item) => openDeleteDialog(item, 'countries')"
      />
    </template>

    <!-- ── ผลิตภัณฑ์ RASFF ── -->
    <template v-if="activeTab === 'rasff'">
      <MasterdataTable
        title="ข้อมูลผลิตภัณฑ์ RASFF"
        subtitle="RASFF Product Data"
        icon="fas fa-triangle-exclamation"
        color="error"
        :headers="rasffHeaders"
        :items="rasffProducts"
        @add="openDialog('rasff')"
        @edit="(item) => openDialog('rasff', item)"
        @delete="(item) => openDeleteDialog(item, 'rasff')"
      />
    </template>

    <!-- ── Add/Edit Dialog ── -->
    <v-dialog v-model="formDialog" max-width="560" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-pen' : 'fas fa-plus'"
            color="admin"
            size="18"
          />
          {{ editingItem ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล" }} —
          {{ currentCategoryLabel }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <!-- รายชื่อพืช -->
            <template v-if="activeTab === 'plants'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสพืช <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="PLT001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อพืช (ภาษาไทย) <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.nameTh"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เช่น ข้าว"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">
                  ชื่อพืช (ภาษาอังกฤษ) <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.nameEn"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="e.g. Rice"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">สถานะ</div>
                <v-select
                  v-model="form.status"
                  :items="['ใช้งาน', 'ไม่ใช้งาน']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </template>

            <!-- ข้อมูลแปลง -->
            <template v-else-if="activeTab === 'plots'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสแปลง <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="PLT-001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อแปลง <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="แปลงที่ 1"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  เกษตรกร <span class="req">*</span>
                </div>
                <v-autocomplete
                  v-model="form.farmer"
                  :items="farmers.map((f) => f.name)"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกเกษตรกร"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ประเภทพืช <span class="req">*</span>
                </div>
                <v-autocomplete
                  v-model="form.plantType"
                  :items="plants.map((p) => p.nameTh)"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกประเภทพืช"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ขนาดพื้นที่ (ไร่) <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.area"
                  type="number"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="0.00"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  จังหวัด <span class="req">*</span>
                </div>
                <v-autocomplete
                  v-model="form.province"
                  :items="provinceList"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกจังหวัด"
                />
              </v-col>
            </template>

            <!-- ข้อมูลเกษตรกร -->
            <template v-else-if="activeTab === 'farmers'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสเกษตรกร <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="FRM001"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">ชื่อ <span class="req">*</span></div>
                <v-text-field
                  v-model="form.firstName"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อ"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <div class="field-label">
                  นามสกุล <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.lastName"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="นามสกุล"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  เลขบัตรประชาชน <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.idCard"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="1 xxxx xxxxx xx x"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">เบอร์โทร</div>
                <v-text-field
                  v-model="form.phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="0XX-XXX-XXXX"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">ที่อยู่</div>
                <v-textarea
                  v-model="form.address"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="2"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  จังหวัด <span class="req">*</span>
                </div>
                <v-autocomplete
                  v-model="form.province"
                  :items="provinceList"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกจังหวัด"
                />
              </v-col>
            </template>

            <!-- หน่วยงาน (ใช้กับทั้งโรงงาน/แปลง) -->
            <template
              v-else-if="
                activeTab === 'agencyFactory' || activeTab === 'agencyPlot'
              "
            >
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสหน่วยงาน <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="AGN001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อหน่วยงาน <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อหน่วยงาน"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  จังหวัดที่รับผิดชอบ <span class="req">*</span>
                </div>
                <v-autocomplete
                  v-model="form.province"
                  :items="provinceList"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกจังหวัด"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">เบอร์โทรศัพท์</div>
                <v-text-field
                  v-model="form.phone"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="0X-XXXX-XXXX"
                />
              </v-col>
            </template>

            <!-- เชื้อจุลินทรีย์ -->
            <template v-else-if="activeTab === 'microbes'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสเชื้อ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="MCB001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อเชื้อ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อเชื้อ"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ประเภท <span class="req">*</span>
                </div>
                <v-select
                  v-model="form.type"
                  :items="['แบคทีเรีย', 'รา', 'ไวรัส', 'อื่นๆ']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">รายละเอียด</div>
                <v-textarea
                  v-model="form.detail"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="2"
                />
              </v-col>
            </template>

            <!-- ศัตรูพืช -->
            <template v-else-if="activeTab === 'pests'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสศัตรูพืช <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="PST001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อศัตรูพืช <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อศัตรูพืช"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ประเภท <span class="req">*</span>
                </div>
                <v-select
                  v-model="form.type"
                  :items="[
                    'แมลง',
                    'โรคพืช',
                    'วัชพืช',
                    'สัตว์ศัตรูพืช',
                    'อื่นๆ',
                  ]"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">พืชที่เกี่ยวข้อง</div>
                <v-autocomplete
                  v-model="form.relatedPlant"
                  :items="plants.map((p) => p.nameTh)"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกพืช"
                />
              </v-col>
            </template>

            <!-- สารเคมี -->
            <template v-else-if="activeTab === 'chemicals'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสสารเคมี <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="CHM001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อสารเคมี <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อสารเคมี"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ประเภท <span class="req">*</span>
                </div>
                <v-select
                  v-model="form.type"
                  :items="[
                    'ยาฆ่าแมลง',
                    'ยาฆ่าเชื้อรา',
                    'ยาฆ่าวัชพืช',
                    'ปุ๋ยเคมี',
                    'อื่นๆ',
                  ]"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ระดับความอันตราย <span class="req">*</span>
                </div>
                <v-select
                  v-model="form.hazardLevel"
                  :items="['ต่ำ', 'ปานกลาง', 'สูง', 'สูงมาก']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">รายละเอียดเพิ่มเติม</div>
                <v-textarea
                  v-model="form.detail"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="2"
                />
              </v-col>
            </template>

            <!-- กลุ่มประเทศ -->
            <template v-else-if="activeTab === 'countryGroups'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสกลุ่ม <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="GRP001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อกลุ่มประเทศ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เช่น อาเซียน"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">รายชื่อประเทศ</div>
                <v-autocomplete
                  v-model="form.memberCountries"
                  :items="countries.map((c) => c.name)"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกประเทศ"
                />
              </v-col>
            </template>

            <!-- ประเทศ -->
            <template v-else-if="activeTab === 'countries'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสประเทศ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="TH"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อประเทศ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อประเทศ"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">กลุ่มประเทศ</div>
                <v-autocomplete
                  v-model="form.group"
                  :items="countryGroups.map((g) => g.name)"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกกลุ่ม"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">สถานะ</div>
                <v-select
                  v-model="form.status"
                  :items="['ใช้งาน', 'ไม่ใช้งาน']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
            </template>

            <!-- ผลิตภัณฑ์ RASFF -->
            <template v-else-if="activeTab === 'rasff'">
              <v-col cols="12" sm="4">
                <div class="field-label">
                  รหัสผลิตภัณฑ์ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.code"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="RSF001"
                />
              </v-col>
              <v-col cols="12" sm="8">
                <div class="field-label">
                  ชื่อผลิตภัณฑ์ <span class="req">*</span>
                </div>
                <v-text-field
                  v-model="form.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="ชื่อผลิตภัณฑ์"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">
                  ประเภทสินค้า <span class="req">*</span>
                </div>
                <v-select
                  v-model="form.productType"
                  :items="['ผลสด', 'แปรรูป', 'ธัญพืช', 'อื่นๆ']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label mt-2">สถานะ</div>
                <v-select
                  v-model="form.status"
                  :items="['ใช้งาน', 'ไม่ใช้งาน']"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">ประเทศที่เกี่ยวข้อง</div>
                <v-autocomplete
                  v-model="form.relatedCountries"
                  :items="countries.map((c) => c.name)"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  placeholder="เลือกประเทศ"
                />
              </v-col>
              <v-col cols="12">
                <div class="field-label mt-2">รายละเอียด</div>
                <v-textarea
                  v-model="form.detail"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  rows="2"
                />
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="formDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="admin"
            rounded="lg"
            :prepend-icon="editingItem ? 'fas fa-floppy-disk' : 'fas fa-plus'"
            @click="saveItem"
          >
            {{ editingItem ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Delete Confirm Dialog ── -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="confirm-ring confirm-ring--error mx-auto mb-4">
            <v-icon icon="fas fa-trash" color="error" size="24" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลบข้อมูล</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการลบรายการนี้ใช่หรือไม่?<br />
            การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-row no-gutters class="ga-2 w-100">
            <v-col>
              <v-btn
                variant="tonal"
                color="grey"
                rounded="lg"
                block
                @click="deleteDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="error" rounded="lg" block @click="confirmDelete"
                >ยืนยันลบ</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

// ── Tab categories ──
const categories = [
  { key: "plants", label: "รายชื่อพืช", icon: "fas fa-seedling" },
  { key: "plots", label: "แปลงเกษตรกร", icon: "fas fa-map" },
  { key: "farmers", label: "เกษตรกร", icon: "fas fa-user-tie" },
  {
    key: "agencyFactory",
    label: "หน่วยงานตรวจโรงงาน",
    icon: "fas fa-industry",
  },
  { key: "agencyPlot", label: "หน่วยงานตรวจแปลง", icon: "fas fa-map-pin" },
  { key: "microbes", label: "เชื้อจุลินทรีย์", icon: "fas fa-biohazard" },
  { key: "pests", label: "ศัตรูพืช", icon: "fas fa-bug" },
  { key: "chemicals", label: "สารเคมี", icon: "fas fa-flask" },
  { key: "countryGroups", label: "กลุ่มประเทศ", icon: "fas fa-earth-asia" },
  { key: "countries", label: "ประเทศ", icon: "fas fa-flag" },
  {
    key: "rasff",
    label: "ผลิตภัณฑ์ RASFF",
    icon: "fas fa-triangle-exclamation",
  },
];

const activeTab = ref("plants");

const currentCategoryLabel = computed(
  () => categories.find((c) => c.key === activeTab.value)?.label ?? "",
);

// ── Province list ──
const provinceList = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "เชียงราย",
  "ขอนแก่น",
  "นครราชสีมา",
  "สงขลา",
  "ภูเก็ต",
  "อุบลราชธานี",
  "นครปฐม",
  "ระยอง",
  "ชลบุรี",
  "สมุทรปราการ",
  "นนทบุรี",
  "ปทุมธานี",
  "อยุธยา",
  "สุราษฎร์ธานี",
  "นครศรีธรรมราช",
  "อุดรธานี",
  "เพชรบุรี",
  "กาญจนบุรี",
];

// ── Table headers ──
const plantsHeaders = [
  { title: "รหัสพืช", key: "code", width: 100 },
  { title: "ชื่อพืช (ไทย)", key: "nameTh" },
  { title: "ชื่อพืช (อังกฤษ)", key: "nameEn" },
  { title: "สถานะ", key: "status", width: 110 },
  { title: "แก้ไขล่าสุด", key: "updatedAt", width: 130 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const plotsHeaders = [
  { title: "รหัสแปลง", key: "code", width: 110 },
  { title: "ชื่อแปลง", key: "name" },
  { title: "ชื่อเกษตรกร", key: "farmer" },
  { title: "ประเภทพืช", key: "plantType" },
  { title: "พื้นที่ (ไร่)", key: "area", width: 100 },
  { title: "จังหวัด", key: "province", width: 130 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const farmersHeaders = [
  { title: "รหัส", key: "code", width: 90 },
  { title: "ชื่อ-นามสกุล", key: "name" },
  { title: "เลขบัตรประชาชน", key: "idCard", width: 160 },
  { title: "เบอร์โทร", key: "phone", width: 130 },
  { title: "จังหวัด", key: "province", width: 130 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const agencyHeaders = [
  { title: "รหัสหน่วยงาน", key: "code", width: 130 },
  { title: "ชื่อหน่วยงาน", key: "name" },
  { title: "จังหวัดที่รับผิดชอบ", key: "province" },
  { title: "เบอร์ติดต่อ", key: "phone", width: 130 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const microbesHeaders = [
  { title: "รหัสเชื้อ", key: "code", width: 110 },
  { title: "ชื่อเชื้อ", key: "name" },
  { title: "ประเภท", key: "type", width: 120 },
  { title: "รายละเอียด", key: "detail" },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const pestsHeaders = [
  { title: "รหัสศัตรูพืช", key: "code", width: 130 },
  { title: "ชื่อศัตรูพืช", key: "name" },
  { title: "ประเภท", key: "type", width: 130 },
  { title: "พืชที่เกี่ยวข้อง", key: "relatedPlant" },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const chemicalsHeaders = [
  { title: "รหัสสารเคมี", key: "code", width: 120 },
  { title: "ชื่อสารเคมี", key: "name" },
  { title: "ประเภท", key: "type", width: 130 },
  { title: "ระดับอันตราย", key: "hazardLevel", width: 130 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const countryGroupsHeaders = [
  { title: "รหัสกลุ่ม", key: "code", width: 110 },
  { title: "ชื่อกลุ่มประเทศ", key: "name" },
  { title: "จำนวนประเทศ", key: "memberCount", width: 130 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const countriesHeaders = [
  { title: "รหัสประเทศ", key: "code", width: 110 },
  { title: "ชื่อประเทศ", key: "name" },
  { title: "กลุ่มประเทศ", key: "group" },
  { title: "สถานะ", key: "status", width: 110 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

const rasffHeaders = [
  { title: "รหัสผลิตภัณฑ์", key: "code", width: 130 },
  { title: "ชื่อผลิตภัณฑ์", key: "name" },
  { title: "ประเภทสินค้า", key: "productType", width: 130 },
  { title: "ประเทศที่เกี่ยวข้อง", key: "relatedCountriesText" },
  { title: "สถานะ", key: "status", width: 110 },
  { title: "", key: "actions", sortable: false, width: 90, align: "end" },
];

// ── Mock Data ──
const plants = ref([
  {
    id: 1,
    code: "PLT001",
    nameTh: "ข้าว",
    nameEn: "Rice",
    status: "ใช้งาน",
    updatedAt: "01/04/2569",
  },
  {
    id: 2,
    code: "PLT002",
    nameTh: "ข้าวโพด",
    nameEn: "Corn",
    status: "ใช้งาน",
    updatedAt: "01/04/2569",
  },
  {
    id: 3,
    code: "PLT003",
    nameTh: "มันสำปะหลัง",
    nameEn: "Cassava",
    status: "ใช้งาน",
    updatedAt: "15/03/2569",
  },
  {
    id: 4,
    code: "PLT004",
    nameTh: "อ้อย",
    nameEn: "Sugarcane",
    status: "ใช้งาน",
    updatedAt: "15/03/2569",
  },
  {
    id: 5,
    code: "PLT005",
    nameTh: "ยางพารา",
    nameEn: "Para Rubber",
    status: "ไม่ใช้งาน",
    updatedAt: "01/03/2569",
  },
]);

const farmers = ref([
  {
    id: 1,
    code: "FRM001",
    name: "นายสมชาย ใจดี",
    firstName: "สมชาย",
    lastName: "ใจดี",
    idCard: "3 1001 00123 45 6",
    phone: "081-234-5678",
    address: "123 หมู่ 1",
    province: "เชียงใหม่",
  },
  {
    id: 2,
    code: "FRM002",
    name: "นางสาวมาลี รักไทย",
    firstName: "มาลี",
    lastName: "รักไทย",
    idCard: "3 2001 00234 56 7",
    phone: "086-345-6789",
    address: "456 หมู่ 2",
    province: "ขอนแก่น",
  },
  {
    id: 3,
    code: "FRM003",
    name: "นายวิชัย เกษตรกร",
    firstName: "วิชัย",
    lastName: "เกษตรกร",
    idCard: "3 3001 00345 67 8",
    phone: "089-456-7890",
    address: "789 หมู่ 3",
    province: "นครราชสีมา",
  },
]);

const plots = ref([
  {
    id: 1,
    code: "PLT-001",
    name: "แปลงที่ 1 บ้านใหม่",
    farmer: "นายสมชาย ใจดี",
    plantType: "ข้าว",
    area: "5.5",
    province: "เชียงใหม่",
  },
  {
    id: 2,
    code: "PLT-002",
    name: "แปลงที่ 2 ท่งนา",
    farmer: "นางสาวมาลี รักไทย",
    plantType: "ข้าวโพด",
    area: "12.0",
    province: "ขอนแก่น",
  },
  {
    id: 3,
    code: "PLT-003",
    name: "แปลงมันสำปะหลัง A",
    farmer: "นายวิชัย เกษตรกร",
    plantType: "มันสำปะหลัง",
    area: "20.0",
    province: "นครราชสีมา",
  },
]);

const agenciesFactory = ref([
  {
    id: 1,
    code: "AGF001",
    name: "สำนักงานเกษตรจังหวัดเชียงใหม่",
    province: "เชียงใหม่",
    phone: "053-112-233",
  },
  {
    id: 2,
    code: "AGF002",
    name: "สำนักงานเกษตรจังหวัดขอนแก่น",
    province: "ขอนแก่น",
    phone: "043-221-122",
  },
  {
    id: 3,
    code: "AGF003",
    name: "สำนักงานเกษตรจังหวัดสงขลา",
    province: "สงขลา",
    phone: "074-331-233",
  },
]);

const agenciesPlot = ref([
  {
    id: 1,
    code: "AGP001",
    name: "สำนักงานวิชาการเกษตรเขตที่ 1",
    province: "เชียงใหม่",
    phone: "053-114-566",
  },
  {
    id: 2,
    code: "AGP002",
    name: "สำนักงานวิชาการเกษตรเขตที่ 3",
    province: "ขอนแก่น",
    phone: "043-203-476",
  },
  {
    id: 3,
    code: "AGP003",
    name: "สำนักงานวิชาการเกษตรเขตที่ 8",
    province: "สงขลา",
    phone: "074-446-882",
  },
]);

const microbes = ref([
  {
    id: 1,
    code: "MCB001",
    name: "Xanthomonas oryzae",
    type: "แบคทีเรีย",
    detail: "ก่อโรคใบไหม้ในข้าว",
  },
  {
    id: 2,
    code: "MCB002",
    name: "Pyricularia oryzae",
    type: "รา",
    detail: "ก่อโรคไหม้ในข้าว",
  },
  {
    id: 3,
    code: "MCB003",
    name: "Sugarcane Mosaic Virus",
    type: "ไวรัส",
    detail: "ก่อโรคในอ้อย",
  },
]);

const pests = ref([
  {
    id: 1,
    code: "PST001",
    name: "เพลี้ยกระโดดสีน้ำตาล",
    type: "แมลง",
    relatedPlant: "ข้าว",
  },
  {
    id: 2,
    code: "PST002",
    name: "หนอนกออ้อย",
    type: "แมลง",
    relatedPlant: "อ้อย",
  },
  {
    id: 3,
    code: "PST003",
    name: "ไส้เดือนฝอยรากปม",
    type: "สัตว์ศัตรูพืช",
    relatedPlant: "มันสำปะหลัง",
  },
]);

const chemicals = ref([
  {
    id: 1,
    code: "CHM001",
    name: "คาร์โบฟูราน",
    type: "ยาฆ่าแมลง",
    hazardLevel: "สูงมาก",
    detail: "ห้ามใช้ในพืชอาหาร",
  },
  {
    id: 2,
    code: "CHM002",
    name: "โพรพิโคนาโซล",
    type: "ยาฆ่าเชื้อรา",
    hazardLevel: "ปานกลาง",
    detail: "",
  },
  {
    id: 3,
    code: "CHM003",
    name: "ไกลโฟเซต",
    type: "ยาฆ่าวัชพืช",
    hazardLevel: "ต่ำ",
    detail: "",
  },
]);

const countryGroups = ref([
  {
    id: 1,
    code: "GRP001",
    name: "อาเซียน",
    memberCountries: [
      "ไทย",
      "เวียดนาม",
      "มาเลเซีย",
      "สิงคโปร์",
      "อินโดนีเซีย",
      "ฟิลิปปินส์",
      "กัมพูชา",
      "ลาว",
      "เมียนมา",
      "บรูไน",
    ],
    memberCount: 10,
  },
  {
    id: 2,
    code: "GRP002",
    name: "สหภาพยุโรป",
    memberCountries: ["เยอรมนี", "ฝรั่งเศส", "อิตาลี"],
    memberCount: 27,
  },
  {
    id: 3,
    code: "GRP003",
    name: "เอเชียตะวันออก",
    memberCountries: ["จีน", "ญี่ปุ่น", "เกาหลีใต้"],
    memberCount: 3,
  },
]);

const countries = ref([
  { id: 1, code: "TH", name: "ไทย", group: "อาเซียน", status: "ใช้งาน" },
  { id: 2, code: "VN", name: "เวียดนาม", group: "อาเซียน", status: "ใช้งาน" },
  { id: 3, code: "MY", name: "มาเลเซีย", group: "อาเซียน", status: "ใช้งาน" },
  {
    id: 4,
    code: "JP",
    name: "ญี่ปุ่น",
    group: "เอเชียตะวันออก",
    status: "ใช้งาน",
  },
  { id: 5, code: "CN", name: "จีน", group: "เอเชียตะวันออก", status: "ใช้งาน" },
  { id: 6, code: "DE", name: "เยอรมนี", group: "สหภาพยุโรป", status: "ใช้งาน" },
]);

const rasffProducts = ref([
  {
    id: 1,
    code: "RSF001",
    name: "ข้าวสาร",
    productType: "ผลสด",
    relatedCountries: ["ญี่ปุ่น", "จีน"],
    relatedCountriesText: "ญี่ปุ่น, จีน",
    status: "ใช้งาน",
    detail: "",
  },
  {
    id: 2,
    code: "RSF002",
    name: "มันฝรั่งแช่แข็ง",
    productType: "แปรรูป",
    relatedCountries: ["เยอรมนี"],
    relatedCountriesText: "เยอรมนี",
    status: "ใช้งาน",
    detail: "",
  },
  {
    id: 3,
    code: "RSF003",
    name: "ข้าวโพดหวานกระป๋อง",
    productType: "แปรรูป",
    relatedCountries: ["ญี่ปุ่น", "มาเลเซีย"],
    relatedCountriesText: "ญี่ปุ่น, มาเลเซีย",
    status: "ใช้งาน",
    detail: "",
  },
]);

// ── CRUD helpers ──
const formDialog = ref(false);
const deleteDialog = ref(false);
const editingItem = ref(null);
const deletingItem = ref(null);
const deletingTab = ref("");

const form = reactive({
  code: "",
  name: "",
  nameTh: "",
  nameEn: "",
  status: "ใช้งาน",
  firstName: "",
  lastName: "",
  idCard: "",
  phone: "",
  address: "",
  province: "",
  farmer: "",
  plantType: "",
  area: "",
  type: "",
  detail: "",
  hazardLevel: "",
  group: "",
  memberCountries: [],
  productType: "",
  relatedCountries: [],
  relatedPlant: "",
});

function resetForm() {
  Object.assign(form, {
    code: "",
    name: "",
    nameTh: "",
    nameEn: "",
    status: "ใช้งาน",
    firstName: "",
    lastName: "",
    idCard: "",
    phone: "",
    address: "",
    province: "",
    farmer: "",
    plantType: "",
    area: "",
    type: "",
    detail: "",
    hazardLevel: "",
    group: "",
    memberCountries: [],
    productType: "",
    relatedCountries: [],
    relatedPlant: "",
  });
}

function openDialog(tab, item = null) {
  editingItem.value = item;
  resetForm();
  if (item) Object.assign(form, item);
  formDialog.value = true;
}

function openDeleteDialog(item, tab) {
  deletingItem.value = item;
  deletingTab.value = tab;
  deleteDialog.value = true;
}

const dataMap = {
  plants,
  plots,
  farmers,
  agencyFactory: agenciesFactory,
  agencyPlot: agenciesPlot,
  microbes,
  pests,
  chemicals,
  countryGroups,
  countries,
  rasff: rasffProducts,
};

let nextId = 100;

function saveItem() {
  const list = dataMap[activeTab.value];
  const now = new Date().toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (activeTab.value === "plants") {
    const payload = {
      code: form.code,
      nameTh: form.nameTh,
      nameEn: form.nameEn,
      status: form.status,
      updatedAt: now,
    };
    if (editingItem.value) {
      const idx = list.value.findIndex((i) => i.id === editingItem.value.id);
      if (idx !== -1) Object.assign(list.value[idx], payload);
    } else {
      list.value.push({ id: nextId++, ...payload });
    }
  } else if (activeTab.value === "farmers") {
    const payload = {
      code: form.code,
      firstName: form.firstName,
      lastName: form.lastName,
      name: `${form.firstName} ${form.lastName}`.trim(),
      idCard: form.idCard,
      phone: form.phone,
      address: form.address,
      province: form.province,
    };
    if (editingItem.value) {
      const idx = list.value.findIndex((i) => i.id === editingItem.value.id);
      if (idx !== -1) Object.assign(list.value[idx], payload);
    } else {
      list.value.push({ id: nextId++, ...payload });
    }
  } else if (activeTab.value === "countryGroups") {
    const payload = {
      code: form.code,
      name: form.name,
      memberCountries: form.memberCountries,
      memberCount: form.memberCountries.length,
    };
    if (editingItem.value) {
      const idx = list.value.findIndex((i) => i.id === editingItem.value.id);
      if (idx !== -1) Object.assign(list.value[idx], payload);
    } else {
      list.value.push({ id: nextId++, ...payload });
    }
  } else if (activeTab.value === "rasff") {
    const payload = {
      code: form.code,
      name: form.name,
      productType: form.productType,
      relatedCountries: form.relatedCountries,
      relatedCountriesText: form.relatedCountries.join(", "),
      status: form.status,
      detail: form.detail,
    };
    if (editingItem.value) {
      const idx = list.value.findIndex((i) => i.id === editingItem.value.id);
      if (idx !== -1) Object.assign(list.value[idx], payload);
    } else {
      list.value.push({ id: nextId++, ...payload });
    }
  } else {
    const payload = { ...form };
    delete payload.id;
    if (editingItem.value) {
      const idx = list.value.findIndex((i) => i.id === editingItem.value.id);
      if (idx !== -1) Object.assign(list.value[idx], payload);
    } else {
      list.value.push({ id: nextId++, ...payload });
    }
  }
  formDialog.value = false;
}

function confirmDelete() {
  const list = dataMap[deletingTab.value];
  const idx = list.value.findIndex((i) => i.id === deletingItem.value.id);
  if (idx !== -1) list.value.splice(idx, 1);
  deleteDialog.value = false;
}
</script>

<script>
// ── MasterdataTable inline component ──
import { h, resolveComponent } from "vue";

const MasterdataTable = {
  name: "MasterdataTable",
  props: {
    title: String,
    subtitle: String,
    icon: String,
    color: { type: String, default: "admin" },
    headers: Array,
    items: Array,
  },
  emits: ["add", "edit", "delete"],
  setup(props, { emit }) {
    return () => {
      const VCard = resolveComponent("v-card");
      const VBtn = resolveComponent("v-btn");
      const VDataTable = resolveComponent("v-data-table");
      const VChip = resolveComponent("v-chip");

      return h("div", [
        h(
          "div",
          {
            class:
              "d-flex align-center justify-space-between mb-4 flex-wrap ga-2",
          },
          [
            h("div", [
              h("div", { class: "text-body-1 font-weight-bold" }, props.title),
              h(
                "div",
                { class: "text-caption text-medium-emphasis" },
                props.subtitle,
              ),
            ]),
            h(
              VBtn,
              {
                color: "admin",
                variant: "flat",
                rounded: "lg",
                size: "small",
                prependIcon: "fas fa-plus",
                onClick: () => emit("add"),
              },
              () => "เพิ่มข้อมูล",
            ),
          ],
        ),
        h(VCard, { rounded: "xl", elevation: 0, class: "table-card" }, () =>
          h(
            VDataTable,
            {
              headers: props.headers,
              items: props.items,
              itemsPerPage: 10,
              class: "el-master-table",
            },
            {
              [`item.status`]: ({ item }) =>
                h(
                  VChip,
                  {
                    size: "x-small",
                    color: item.status === "ใช้งาน" ? "success" : "grey",
                    variant: "tonal",
                  },
                  () => item.status ?? "-",
                ),
              [`item.actions`]: ({ item }) =>
                h("div", { class: "d-flex ga-1 justify-end" }, [
                  h(VBtn, {
                    icon: "fas fa-pen",
                    size: "x-small",
                    variant: "tonal",
                    color: "info",
                    rounded: "lg",
                    onClick: () => emit("edit", item),
                  }),
                  h(VBtn, {
                    icon: "fas fa-trash",
                    size: "x-small",
                    variant: "tonal",
                    color: "error",
                    rounded: "lg",
                    onClick: () => emit("delete", item),
                  }),
                ]),
            },
          ),
        ),
      ]);
    };
  },
};

export default { components: { MasterdataTable } };
</script>

<style scoped>
.table-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.field-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 4px;
}
.req {
  color: rgb(var(--v-theme-error));
}
.confirm-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-ring--error {
  background: rgba(var(--v-theme-error), 0.1);
  border: 2px solid rgba(var(--v-theme-error), 0.25);
}
.el-master-table :deep(.v-data-table__th) {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
}
</style>
