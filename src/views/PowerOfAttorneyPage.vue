<template>
  <div class="poa-root" :class="{ 'is-dark': themeStore.isDark }">
    <!-- Top bar -->
    <div class="poa-topbar">
      <div class="poa-topbar-inner">
        <div class="d-flex align-center ga-3">
          <div class="topbar-logo">
            <v-icon icon="fas fa-leaf" size="18" color="white" />
          </div>
          <div>
            <div class="text-body-2 font-weight-bold text-white lh-tight">
              กรมวิชาการเกษตร
            </div>
            <div
              class="text-caption"
              style="color: rgba(255, 255, 255, 0.6); line-height: 1.2"
            >
              Department of Agriculture
            </div>
          </div>
        </div>
        <v-spacer />
        <div class="d-flex align-center ga-2">
          <v-btn
            variant="text"
            size="small"
            style="color: rgba(255, 255, 255, 0.8)"
            :prepend-icon="themeStore.isDark ? 'fas fa-sun' : 'fas fa-moon'"
            @click="themeStore.toggle()"
          >
            {{ themeStore.isDark ? "โหมดสว่าง" : "โหมดมืด" }}
          </v-btn>
          <div class="user-pill d-flex align-center ga-2">
            <div class="d-none d-sm-block">
              <div
                class="text-caption font-weight-semibold text-white lh-tight"
              >
                นิธิพร เทิบจันทึก
              </div>
              <div
                class="text-caption"
                style="
                  color: rgba(255, 255, 255, 0.55);
                  line-height: 1.2;
                  font-size: 10px;
                "
              >
                ผู้ประกอบการ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="poa-body">
      <div class="poa-body-inner">
        <!-- Back + heading -->
        <div class="d-flex align-center ga-3 mb-6">
          <v-btn
            icon="fas fa-arrow-left"
            variant="tonal"
            size="small"
            rounded="lg"
            @click="goToSelectCompany"
          />
          <div>
            <h1 class="page-title mb-0">จัดการนิติบุคคล</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              จัดการข้อมูลนิติบุคคล สาขา และมอบอำนาจ
            </p>
          </div>
        </div>

        <!-- Company info -->
        <v-card rounded="xl" elevation="0" class="mb-5 section-card">
          <v-card-text class="pa-4">
            <div class="d-flex align-center ga-3">
              <div
                class="company-icon-box flex-shrink-0"
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 10px;
                  background: rgba(var(--v-theme-info), 0.12);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <v-icon icon="fas fa-building" size="18" color="info" />
              </div>
              <div>
                <div class="text-body-1 font-weight-bold">
                  {{ currentCompany.nameTh }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ currentCompany.nameEn }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Tabs -->
        <v-tabs v-model="activeTab" color="info" class="mb-5">
          <v-tab value="info">
            <v-icon start icon="fas fa-building-columns" size="14" />
            ข้อมูลนิติบุคคล
          </v-tab>
          <v-tab value="branches">
            <v-icon start icon="fas fa-code-branch" size="14" />
            สาขา
            <v-chip size="x-small" color="info" variant="tonal" class="ml-2">{{
              filteredBranches.length
            }}</v-chip>
          </v-tab>
          <v-tab value="grant">
            <v-icon start icon="fas fa-user-check" size="14" />
            มอบอำนาจ
            <v-chip size="x-small" color="info" variant="tonal" class="ml-2">{{
              filteredDelegates.length
            }}</v-chip>
          </v-tab>
          <v-tab value="requests">
            <v-icon start icon="fas fa-inbox" size="14" />
            คำขอรับมอบอำนาจ
            <v-chip
              v-if="
                filteredRequests.filter((r) => r.status === 'pending').length
              "
              size="x-small"
              color="warning"
              variant="tonal"
              class="ml-2"
            >
              {{
                filteredRequests.filter((r) => r.status === "pending").length
              }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <!-- ── Tab: ข้อมูลนิติบุคคล ── -->
        <template v-if="activeTab === 'info'">
          <!-- DBD data card -->
          <v-card rounded="xl" elevation="0" class="section-card mb-4">
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center ga-2">
                  <v-icon icon="fas fa-database" color="info" size="15" />
                  <span class="text-body-2 font-weight-bold"
                    >ข้อมูลจากกรมพัฒนาธุรกิจการค้า (DBD)</span
                  >
                </div>
                <div class="d-flex align-center ga-2">
                  <span class="text-caption text-medium-emphasis">
                    อัปเดตล่าสุด: {{ currentDbdInfo.updatedAt }}
                  </span>
                  <v-chip
                    size="x-small"
                    color="success"
                    variant="tonal"
                    prepend-icon="fas fa-circle-check"
                  >
                    ยืนยันแล้ว
                  </v-chip>
                </div>
              </div>

              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="dbd-label">เลขทะเบียนนิติบุคคล</div>
                  <div class="dbd-value">{{ currentDbdInfo.regNo }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label">ประเภทนิติบุคคล</div>
                  <div class="dbd-value">{{ currentDbdInfo.type }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="dbd-label mt-3">ชื่อนิติบุคคล (ภาษาไทย)</div>
                  <div class="dbd-value">{{ currentDbdInfo.nameTh }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="dbd-label mt-3">ชื่อนิติบุคคล (ภาษาอังกฤษ)</div>
                  <div class="dbd-value">{{ currentDbdInfo.nameEn }}</div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label mt-3">สถานะบริษัท</div>
                  <div class="dbd-value d-flex align-center ga-1">
                    <v-icon icon="fas fa-circle" size="8" color="success" />
                    {{ currentDbdInfo.status }}
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="dbd-label mt-3">ทุนจดทะเบียน</div>
                  <div class="dbd-value">{{ currentDbdInfo.capital }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="dbd-label mt-3">ผู้มีอำนาจลงนาม</div>
                  <div class="dbd-value">{{ currentDbdInfo.authorized }}</div>
                </v-col>
                <v-col cols="12">
                  <div class="dbd-label mt-3">ที่อยู่จดทะเบียน</div>
                  <div class="dbd-value">{{ currentDbdInfo.address }}</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- DBD refresh request section -->
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <span class="text-body-1 font-weight-bold"
                >คำขออัปเดตข้อมูลจาก DBD</span
              >
              <div class="text-caption text-medium-emphasis mt-0-5">
                หากมีการแก้ไขข้อมูลที่ DBD แล้วต้องการให้ระบบอัปเดตตาม
              </div>
            </div>
            <v-btn
              color="info"
              rounded="lg"
              prepend-icon="fas fa-rotate"
              :disabled="hasPendingDbdRequest"
              @click="dbdRefreshConfirmDialog = true"
            >
              ยื่นขอดึงข้อมูลจาก DBD ใหม่
            </v-btn>
          </div>

          <v-alert
            v-if="hasPendingDbdRequest"
            type="warning"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mb-4"
            prepend-icon="fas fa-clock"
          >
            <span class="text-body-2"
              >มีคำขออัปเดต DBD ที่รอการตรวจสอบจากเจ้าหน้าที่อยู่ —
              ไม่สามารถยื่นคำขอใหม่ได้จนกว่าจะได้รับการตรวจสอบ</span
            >
          </v-alert>

          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              v-if="filteredDbdRequests.length === 0"
              class="pa-10 text-center"
            >
              <v-icon
                icon="fas fa-rotate"
                size="40"
                color="medium-emphasis"
                style="opacity: 0.3"
              />
              <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
                ยังไม่มีประวัติคำขออัปเดตข้อมูลจาก DBD
              </p>
            </div>

            <template v-else>
              <div
                v-for="(req, idx) in filteredDbdRequests"
                :key="req.id"
                class="branch-row"
                :class="{
                  'branch-row--last': idx === filteredDbdRequests.length - 1,
                }"
              >
                <div class="branch-icon-box flex-shrink-0">
                  <v-icon icon="fas fa-rotate" color="info" size="15" />
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-body-2 font-weight-medium"
                      >คำขออัปเดตข้อมูล DBD</span
                    >
                    <v-chip
                      size="x-small"
                      :color="
                        req.status === 'pending'
                          ? 'warning'
                          : req.status === 'approved'
                            ? 'success'
                            : 'error'
                      "
                      variant="tonal"
                      :prepend-icon="
                        req.status === 'pending'
                          ? 'fas fa-clock'
                          : req.status === 'approved'
                            ? 'fas fa-circle-check'
                            : 'fas fa-circle-xmark'
                      "
                    >
                      {{
                        req.status === "pending"
                          ? "รอตรวจสอบ"
                          : req.status === "approved"
                            ? "อนุมัติแล้ว"
                            : "ปฏิเสธแล้ว"
                      }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    ยื่นเมื่อ {{ req.submittedAt }}
                    <template v-if="req.reviewedAt">
                      · ตรวจสอบเมื่อ {{ req.reviewedAt }}</template
                    >
                  </div>
                  <div
                    v-if="req.changedFields"
                    class="text-caption text-medium-emphasis mt-0-5"
                  >
                    รายการที่เปลี่ยน: {{ req.changedFields }}
                  </div>
                  <div
                    v-if="req.note"
                    class="text-caption text-medium-emphasis mt-0-5"
                  >
                    หมายเหตุ: {{ req.note }}
                  </div>
                </div>
              </div>
            </template>
          </v-card>
        </template>

        <!-- ── Tab: สาขา ── -->
        <template v-if="activeTab === 'branches'">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <span class="text-body-1 font-weight-bold">รายการสาขา</span>
              <v-chip size="x-small" color="info" variant="tonal" class="ml-2"
                >{{ filteredBranches.length }} สาขา</v-chip
              >
            </div>
            <v-btn
              color="info"
              rounded="lg"
              prepend-icon="fas fa-plus"
              @click="openAddBranch"
              >เพิ่มสาขา</v-btn
            >
          </div>

          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              v-for="(branch, idx) in filteredBranches"
              :key="branch.id"
              class="branch-row"
              :class="{
                'branch-row--last': idx === filteredBranches.length - 1,
              }"
            >
              <!-- Icon -->
              <div class="branch-icon-box flex-shrink-0">
                <v-icon
                  :icon="
                    branch.branchType === 'head'
                      ? 'fas fa-building'
                      : 'fas fa-code-branch'
                  "
                  color="info"
                  size="15"
                />
              </div>

              <!-- Info -->
              <div class="flex-grow-1 overflow-hidden">
                <div class="d-flex align-center ga-2 flex-wrap">
                  <span class="text-body-2 font-weight-bold">
                    {{
                      branch.branchType === "head"
                        ? "สำนักงานใหญ่"
                        : `สาขา ${branch.branchNo} — ${branch.branchName}`
                    }}
                  </span>
                  <v-chip
                    v-if="branch.id === primaryBranchId"
                    size="x-small"
                    color="success"
                    variant="tonal"
                    prepend-icon="fas fa-star"
                  >
                    สาขาหลัก
                  </v-chip>
                  <v-chip
                    v-if="branch.branchType === 'head'"
                    size="x-small"
                    color="info"
                    variant="tonal"
                    prepend-icon="fas fa-database"
                  >
                    ดึงจาก DBD
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mt-0-5">
                  {{
                    branch.branchType === "head"
                      ? currentDbdInfo.address
                      : branchAddress(branch)
                  }}
                </div>
                <div
                  v-if="branch.branchType === 'head'"
                  class="text-caption text-medium-emphasis"
                >
                  ผู้มีอำนาจลงนาม: {{ currentDbdInfo.authorized }} · อัปเดตจาก
                  DBD เมื่อ {{ currentDbdInfo.updatedAt }}
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex ga-1 flex-shrink-0 align-center">
                <v-btn
                  v-if="branch.id !== primaryBranchId"
                  size="x-small"
                  variant="tonal"
                  color="success"
                  rounded="lg"
                  prepend-icon="fas fa-star"
                  @click="setPrimaryBranch(branch.id)"
                >
                  ตั้งเป็นหลัก
                </v-btn>

                <!-- Head office: ไม่แก้ไขได้ → ยื่นขอผ่าน DBD -->
                <v-tooltip
                  v-if="branch.branchType === 'head'"
                  location="top"
                  text="ข้อมูลสำนักงานใหญ่ดึงจาก DBD — ต้องยื่นขอดึงข้อมูลใหม่เพื่อแก้ไข"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="x-small"
                      variant="tonal"
                      color="info"
                      rounded="lg"
                      prepend-icon="fas fa-rotate"
                      @click="goToDbdRefresh"
                    >
                      ยื่นขอแก้ไขผ่าน DBD
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Non-head office: แก้ไข/ลบได้ -->
                <template v-if="branch.branchType !== 'head'">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="warning"
                    rounded="lg"
                    icon="fas fa-pen"
                    @click="openEditBranch(branch)"
                  />
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="error"
                    rounded="lg"
                    icon="fas fa-trash"
                    @click="openDeleteBranch(branch)"
                  />
                </template>
              </div>
            </div>
          </v-card>

          <div class="d-flex flex-column ga-2 mt-4">
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-database"
            >
              <span class="text-body-2">
                <strong>สำนักงานใหญ่</strong> ดึงข้อมูลจาก DBD โดยอัตโนมัติ —
                หากต้องการแก้ไข ต้องยื่นขอดึงข้อมูลจาก DBD ใหม่
                และรอเจ้าหน้าที่อนุมัติ ที่แถบ
                <v-btn
                  variant="text"
                  color="info"
                  density="compact"
                  size="x-small"
                  prepend-icon="fas fa-building-columns"
                  class="px-1"
                  @click="activeTab = 'info'"
                  >ข้อมูลนิติบุคคล</v-btn
                >
              </span>
            </v-alert>
            <v-alert
              type="success"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-circle-info"
            >
              <span class="text-body-2">
                <strong>สาขาหลัก</strong>
                คือสาขาที่ใช้เป็นที่อยู่อ้างอิงหลักในการออกใบทะเบียนและใบรับรอง
              </span>
            </v-alert>
          </div>
        </template>

        <!-- ── Tab: มอบอำนาจ ── -->
        <template v-if="activeTab === 'grant'">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <span class="text-body-1 font-weight-bold">ผู้รับมอบอำนาจ</span>
              <v-chip size="x-small" color="info" variant="tonal" class="ml-2"
                >{{ filteredDelegates.length }} คน</v-chip
              >
            </div>
            <v-btn
              color="info"
              rounded="lg"
              prepend-icon="fas fa-plus"
              @click="openAdd"
              >เพิ่มผู้รับมอบอำนาจ</v-btn
            >
          </div>

          <v-card rounded="xl" elevation="0" class="section-card">
            <div
              v-if="filteredDelegates.length === 0"
              class="pa-12 text-center"
            >
              <v-icon
                icon="fas fa-user-plus"
                size="48"
                color="medium-emphasis"
                style="opacity: 0.3"
              />
              <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
                ยังไม่มีผู้รับมอบอำนาจสำหรับบริษัทนี้
              </p>
            </div>

            <template v-else>
              <div
                v-for="(d, idx) in filteredDelegates"
                :key="d.id"
                class="delegate-row"
                :class="{
                  'delegate-row--last': idx === filteredDelegates.length - 1,
                }"
              >
                <div class="delegate-icon-box flex-shrink-0">
                  <v-icon icon="fas fa-user" color="info" size="16" />
                </div>
                <div class="flex-grow-1 overflow-hidden">
                  <div class="d-flex align-center ga-2 flex-wrap">
                    <span class="text-body-2 font-weight-bold">{{
                      d.name
                    }}</span>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ d.idCard }} · {{ d.email }}
                  </div>
                  <div class="d-flex flex-wrap ga-1 mt-1">
                    <v-chip
                      v-for="sys in d.systems"
                      :key="sys"
                      size="x-small"
                      variant="tonal"
                      color="info"
                      >{{ sys }}</v-chip
                    >
                  </div>
                </div>
                <div class="d-flex ga-1 flex-shrink-0">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="warning"
                    rounded="lg"
                    icon="fas fa-pen"
                    @click="openEdit(d)"
                  />
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="error"
                    rounded="lg"
                    icon="fas fa-trash"
                    @click="openDelete(d)"
                  />
                </div>
              </div>
            </template>
          </v-card>
        </template>

        <!-- ── Tab: คำขอรับมอบอำนาจ ── -->
        <template v-else-if="activeTab === 'requests'">
          <v-card class="mb-4">
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="" sm="6">
                  <v-text-field
                    v-model="requestSearch"
                    placeholder="ค้นหาชื่อ / เลขบัตร / อีเมล"
                    prepend-inner-icon="fas fa-magnifying-glass"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details
                    clearable
                    style="max-width: 280px; min-width: 180px"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-chip
              v-for="f in statusFilters"
              :key="f.value"
              :color="f.color"
              :variant="requestStatusFilter === f.value ? 'tonal' : 'outlined'"
              size="small"
              class="filter-chip"
              @click="setRequestStatusFilter(f.value)"
            >
              <v-icon v-if="f.icon" :icon="f.icon" start size="11" />
              {{ f.label }}
              <span class="ml-1 text-caption"
                >({{ countByStatus(f.value) }})</span
              >
            </v-chip>
          </div>

          <v-card rounded="xl" elevation="0" class="section-card">
            <v-data-table
              :headers="requestHeaders"
              :items="tableRequests"
              :search="requestSearch"
              density="comfortable"
              hover
              class="request-table"
            >
              <template #item.name="{ item }">
                <div class="d-flex align-center ga-3 py-1">
                  <div class="delegate-icon-box flex-shrink-0">
                    <v-icon icon="fas fa-user" color="info" size="16" />
                  </div>
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      {{ item.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ item.idCard }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ item.email }}
                    </div>
                  </div>
                </div>
              </template>

              <template #item.requestedSystems="{ item }">
                <div class="d-flex flex-wrap ga-1 py-1">
                  <template v-if="item.status === 'pending'">
                    <v-chip
                      v-for="sys in item.requestedSystems"
                      :key="sys"
                      size="x-small"
                      variant="tonal"
                      color="info"
                      >{{ sys }}</v-chip
                    >
                  </template>
                  <template v-else>
                    <v-chip
                      v-for="sys in item.requestedSystems"
                      :key="sys"
                      size="x-small"
                      variant="tonal"
                      :color="
                        (item.approvedSystems ?? []).includes(sys)
                          ? 'success'
                          : 'error'
                      "
                      :prepend-icon="
                        (item.approvedSystems ?? []).includes(sys)
                          ? 'fas fa-check'
                          : 'fas fa-xmark'
                      "
                      >{{ sys }}</v-chip
                    >
                  </template>
                </div>
              </template>

              <template #item.status="{ item }">
                <v-chip size="small" :color="statusColor(item)" variant="tonal">
                  <v-icon start :icon="statusIcon(item)" size="11" />
                  {{ statusLabel(item) }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <div v-if="item.status === 'pending'">
                  <v-btn
                    size="x-small"
                    color="info"
                    rounded="lg"
                    variant="tonal"
                    prepend-icon="fas fa-clipboard-check"
                    @click="openReview(item)"
                    >ตรวจสอบ</v-btn
                  >
                </div>
                <span v-else class="text-caption text-medium-emphasis">—</span>
              </template>

              <template #no-data>
                <div class="pa-10 text-center">
                  <v-icon
                    icon="fas fa-inbox"
                    size="40"
                    color="medium-emphasis"
                    style="opacity: 0.3"
                  />
                  <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
                    ไม่พบคำขอรับมอบอำนาจ
                  </p>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </template>
      </div>
    </div>

    <!-- ── Branch Add/Edit Dialog ── -->
    <v-dialog v-model="branchDialog" max-width="600" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="branchEditingItem ? 'fas fa-pen' : 'fas fa-plus'"
            color="info"
            size="18"
          />
          {{ branchEditingItem ? "แก้ไขสาขา" : "เพิ่มสาขา" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12" sm="4">
              <div class="field-label">
                เลขสาขา <span class="req">*</span>
                <span class="field-label-en">Branch No.</span>
              </div>
              <v-text-field
                v-model="branchForm.branchNo"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="00001"
                maxlength="5"
              />
            </v-col>
            <v-col cols="12" sm="8">
              <div class="field-label">
                ชื่อสาขา <span class="req">*</span>
                <span class="field-label-en">Branch Name</span>
              </div>
              <v-text-field
                v-model="branchForm.branchName"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น สาขาเชียงใหม่"
              />
            </v-col>

            <v-col cols="12">
              <v-divider class="my-3" />
              <div class="field-label mb-1">
                ที่อยู่สาขา
                <span class="field-label-en">Branch Address</span>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="field-label">
                บ้านเลขที่ / อาคาร <span class="req">*</span>
                <span class="field-label-en">House No. / Building</span>
              </div>
              <v-text-field
                v-model="branchForm.houseNo"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น 99/1 อาคารสยามทาวเวอร์"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                ถนน
                <span class="field-label-en">Road</span>
              </div>
              <v-text-field
                v-model="branchForm.road"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น ถนนพระราม 9"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <div class="field-label mt-2">
                จังหวัด <span class="req">*</span>
                <span class="field-label-en">Province</span>
              </div>
              <v-autocomplete
                v-model="branchForm.province"
                :items="provinces"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เลือกจังหวัด"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-2">
                เขต / อำเภอ <span class="req">*</span>
                <span class="field-label-en">District</span>
              </div>
              <v-autocomplete
                v-model="branchForm.district"
                :items="formDistricts"
                :disabled="!branchForm.province"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เลือกเขต / อำเภอ"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-2">
                แขวง / ตำบล <span class="req">*</span>
                <span class="field-label-en">Sub-district</span>
              </div>
              <v-autocomplete
                v-model="branchForm.subdistrict"
                :items="formSubdistricts"
                :disabled="!branchForm.district"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เลือกแขวง / ตำบล"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-2">
                รหัสไปรษณีย์ <span class="req">*</span>
                <span class="field-label-en">Postal Code</span>
              </div>
              <v-text-field
                v-model="branchForm.zipCode"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="10XXX"
                maxlength="5"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="closeBranchDialog"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="info"
            rounded="lg"
            :prepend-icon="
              branchEditingItem ? 'fas fa-floppy-disk' : 'fas fa-plus'
            "
            @click="saveBranch"
          >
            {{ branchEditingItem ? "บันทึกการแก้ไข" : "เพิ่มสาขา" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Branch Delete Confirm ── -->
    <v-dialog v-model="branchDeleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring confirm-ring--error mx-auto mb-4">
            <v-icon icon="fas fa-code-branch" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลบสาขา</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการลบสาขา
            <strong>{{ deletingBranch?.branchName }}</strong> ใช่หรือไม่?
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
                @click="branchDeleteDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="error"
                rounded="lg"
                block
                @click="confirmDeleteBranch"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Set Primary Confirm ── -->
    <v-dialog v-model="setPrimaryDialog" max-width="400">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring confirm-ring--success mx-auto mb-4">
            <v-icon icon="fas fa-star" color="success" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ตั้งเป็นสาขาหลัก</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการตั้ง
            <strong>{{ setPrimaryTarget?.branchName }}</strong>
            เป็นสาขาหลักในการออกใบทะเบียน / ใบรับรอง ใช่หรือไม่?
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
                @click="setPrimaryDialog = false"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="success"
                rounded="lg"
                block
                prepend-icon="fas fa-star"
                @click="confirmSetPrimary"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Add / Edit Delegate Dialog ── -->
    <v-dialog v-model="formDialog" max-width="580" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-pen' : 'fas fa-user-plus'"
            color="info"
            size="18"
          />
          {{ editingItem ? "แก้ไขผู้รับมอบอำนาจ" : "เพิ่มผู้รับมอบอำนาจ" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12" sm="7">
              <div class="field-label">
                ชื่อ-นามสกุล <span class="req">*</span>
                <span class="field-label-en">Full Name</span>
              </div>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อเต็ม"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <div class="field-label">
                เลขบัตรประชาชน <span class="req">*</span>
                <span class="field-label-en">National ID No.</span>
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
            <v-col cols="12" sm="7">
              <div class="field-label mt-3">
                อีเมล <span class="req">*</span>
                <span class="field-label-en">Email</span>
              </div>
              <v-text-field
                v-model="form.email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="example@email.com"
                prepend-inner-icon="fas fa-envelope"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <div class="field-label mt-3">
                สถานะ <span class="field-label-en">Status</span>
              </div>
              <v-autocomplete
                v-model="form.status"
                :items="[
                  { title: 'ใช้งาน', value: 'active' },
                  { title: 'ระงับ', value: 'inactive' },
                ]"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                ระบบที่อนุญาตให้เข้าใช้งาน <span class="req">*</span>
                <span class="field-label-en">Authorized Systems</span>
              </div>
              <div class="system-checkbox-grid mt-1">
                <v-checkbox
                  v-for="sys in availableSystems"
                  :key="sys.value"
                  v-model="form.systems"
                  :value="sys.value"
                  :label="sys.label"
                  color="info"
                  density="compact"
                  hide-details
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="closeFormDialog"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="info"
            rounded="lg"
            :prepend-icon="
              editingItem ? 'fas fa-floppy-disk' : 'fas fa-user-plus'
            "
            @click="saveForm"
          >
            {{ editingItem ? "บันทึกการแก้ไข" : "เพิ่มผู้รับมอบอำนาจ" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── Delete Delegate Confirm ── -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="confirm-ring confirm-ring--error mx-auto mb-4">
            <v-icon icon="fas fa-user-minus" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ยกเลิกมอบอำนาจ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการยกเลิกการมอบอำนาจของ
            <strong>{{ deletingItem?.name }}</strong> ใช่หรือไม่?
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
                @click="closeDeleteDialog"
                >ยกเลิก</v-btn
              >
            </v-col>
            <v-col>
              <v-btn color="error" rounded="lg" block @click="confirmDelete"
                >ยืนยัน</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ── DBD Refresh Dialog ── -->
    <v-dialog v-model="dbdRefreshConfirmDialog" max-width="640" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-rotate" color="info" size="18" />
          ยื่นขอดึงข้อมูลจาก DBD ใหม่
        </v-card-title>
        <v-divider />

        <!-- Step: Loading -->
        <v-card-text v-if="dbdFetchLoading" class="pa-10 text-center">
          <v-progress-circular
            indeterminate
            color="info"
            size="48"
            class="mb-4"
          />
          <div class="text-body-2 font-weight-medium">
            กำลังดึงข้อมูลล่าสุดจาก DBD...
          </div>
          <div class="text-caption text-medium-emphasis mt-1">
            โปรดรอสักครู่
          </div>
        </v-card-text>

        <!-- Step: Compare -->
        <template v-else>
          <v-card-text class="pa-5">
            <!-- Summary banner -->
            <v-alert
              v-if="dbdChangedFields.length === 0"
              type="success"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-circle-check"
              class="mb-4"
            >
              ข้อมูลใน DBD ตรงกับข้อมูลปัจจุบันในระบบ — ไม่มีการเปลี่ยนแปลง
            </v-alert>
            <v-alert
              v-else
              type="warning"
              variant="tonal"
              density="compact"
              rounded="lg"
              prepend-icon="fas fa-triangle-exclamation"
              class="mb-4"
            >
              พบข้อมูลที่เปลี่ยนแปลง
              <strong>{{ dbdChangedFields.length }} รายการ</strong> —
              แถวที่มีสีเหลืองคือข้อมูลที่แตกต่างจากปัจจุบัน
            </v-alert>

            <!-- Comparison table -->
            <v-table
              density="compact"
              class="dbd-compare-table rounded-lg mb-4"
            >
              <thead>
                <tr>
                  <th class="text-left" style="width: 160px">รายการ</th>
                  <th class="text-left">ข้อมูลปัจจุบันในระบบ</th>
                  <th class="text-left">ข้อมูลใหม่จาก DBD</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="f in dbdCompareFields"
                  :key="f.key"
                  :class="{ 'dbd-row-changed': f.changed }"
                >
                  <td class="text-caption font-weight-medium">
                    <div class="d-flex align-center ga-1">
                      <v-icon
                        v-if="f.changed"
                        icon="fas fa-circle-exclamation"
                        color="warning"
                        size="11"
                      />
                      {{ f.label }}
                    </div>
                  </td>
                  <td
                    class="text-body-2"
                    :class="{ 'text-medium-emphasis': f.changed }"
                  >
                    {{ f.current }}
                  </td>
                  <td
                    class="text-body-2"
                    :class="{
                      'font-weight-medium': f.changed,
                      'text-warning': f.changed,
                    }"
                  >
                    {{ f.newVal }}
                  </td>
                </tr>
              </tbody>
            </v-table>

            <v-divider class="mb-4" />

            <div class="field-label mb-1">
              หมายเหตุ / เหตุผลที่ขอดึงข้อมูลใหม่
              <span class="field-label-en">Note</span>
            </div>
            <v-textarea
              v-model="dbdRefreshNote"
              variant="outlined"
              density="compact"
              rounded="lg"
              rows="2"
              hide-details
              placeholder="เช่น เปลี่ยนผู้มีอำนาจลงนาม / เปลี่ยนที่อยู่จดทะเบียน"
            />

            <div class="text-caption text-medium-emphasis mt-3">
              <v-icon icon="fas fa-circle-info" size="11" class="mr-1" />
              ข้อมูลจะถูกอัปเดตในระบบหลังจากเจ้าหน้าที่กรมวิชาการเกษตรตรวจสอบและอนุมัติแล้วเท่านั้น
            </div>
          </v-card-text>

          <v-divider />
          <v-card-actions class="pa-5 ga-2">
            <v-spacer />
            <v-btn
              variant="tonal"
              color="grey"
              rounded="lg"
              @click="dbdRefreshConfirmDialog = false"
              >ยกเลิก</v-btn
            >
            <v-btn
              color="info"
              rounded="lg"
              prepend-icon="fas fa-paper-plane"
              @click="submitDbdRefresh"
            >
              ยื่นคำขออัปเดต
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>

    <!-- ── Review Request Dialog ── -->
    <v-dialog v-model="reviewDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-clipboard-check" color="info" size="18" />
          ตรวจสอบคำขอรับมอบอำนาจ
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <!-- Requestor info -->
          <div class="d-flex align-center ga-3 mb-4">
            <div class="delegate-icon-box flex-shrink-0">
              <v-icon icon="fas fa-user" color="info" size="16" />
            </div>
            <div>
              <div class="text-body-2 font-weight-bold">
                {{ reviewRequest?.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ reviewRequest?.idCard }} · {{ reviewRequest?.email }}
              </div>
            </div>
          </div>

          <v-divider class="mb-4" />

          <!-- Per-system decision -->
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="field-label mb-0">
              เลือกการดำเนินการสำหรับแต่ละระบบ
              <span class="field-label-en">Decision per System</span>
            </div>
            <div class="d-flex ga-1">
              <v-btn
                size="x-small"
                rounded="lg"
                color="success"
                variant="tonal"
                prepend-icon="fas fa-check"
                @click="
                  reviewRequest?.requestedSystems.forEach(
                    (s) => (systemDecisions[s] = 'approved'),
                  )
                "
              >
                อนุมัติทั้งหมด
              </v-btn>
              <v-btn
                size="x-small"
                rounded="lg"
                color="error"
                variant="tonal"
                prepend-icon="fas fa-xmark"
                @click="
                  reviewRequest?.requestedSystems.forEach(
                    (s) => (systemDecisions[s] = 'rejected'),
                  )
                "
              >
                ปฏิเสธทั้งหมด
              </v-btn>
            </div>
          </div>

          <div
            v-for="sys in reviewRequest?.requestedSystems"
            :key="sys"
            class="sys-review-row mb-2"
          >
            <div class="d-flex align-center justify-space-between">
              <span class="text-body-2 font-weight-medium">{{ sys }}</span>
              <div class="d-flex ga-1">
                <v-btn
                  size="x-small"
                  rounded="lg"
                  :color="
                    systemDecisions[sys] === 'approved' ? 'success' : 'grey'
                  "
                  :variant="
                    systemDecisions[sys] === 'approved' ? 'tonal' : 'outlined'
                  "
                  prepend-icon="fas fa-check"
                  @click="systemDecisions[sys] = 'approved'"
                >
                  อนุมัติ
                </v-btn>
                <v-btn
                  size="x-small"
                  rounded="lg"
                  :color="
                    systemDecisions[sys] === 'rejected' ? 'error' : 'grey'
                  "
                  :variant="
                    systemDecisions[sys] === 'rejected' ? 'tonal' : 'outlined'
                  "
                  prepend-icon="fas fa-xmark"
                  @click="systemDecisions[sys] = 'rejected'"
                >
                  ปฏิเสธ
                </v-btn>
              </div>
            </div>
          </div>

          <v-alert
            v-if="reviewDecisionError"
            type="error"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mt-3"
            prepend-icon="fas fa-circle-xmark"
          >
            กรุณาเลือกการดำเนินการให้ครบทุกระบบ
          </v-alert>

          <v-divider class="my-4" />

          <div class="field-label mb-1">
            หมายเหตุ (ถ้ามี)
            <span class="field-label-en">Note (if any)</span>
          </div>
          <v-textarea
            v-model="reviewNote"
            variant="outlined"
            density="compact"
            rounded="lg"
            rows="2"
            hide-details
            placeholder="ระบุหมายเหตุ..."
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="reviewDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="info"
            rounded="lg"
            prepend-icon="fas fa-floppy-disk"
            @click="submitReview"
          >
            บันทึกผลการตรวจสอบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();

const companies = [
  {
    id: "co1",
    nameTh: "บริษัท ไทยเกษตรอินเตอร์ จำกัด",
    nameEn: "Thai Kaset International Co., Ltd.",
  },
  {
    id: "co2",
    nameTh: "ห้างหุ้นส่วนจำกัด สยามฟาร์มโปรดักส์",
    nameEn: "Siam Farm Products Ltd. Part.",
  },
  {
    id: "co3",
    nameTh: "บริษัท กรีนเซอร์ติฟาย (ประเทศไทย) จำกัด",
    nameEn: "Green Certify (Thailand) Co., Ltd.",
  },
];

const availableSystems = [
  {
    label: "ระบบการรับรองมาตรฐาน GAP (Good Agricultural Practices) พืช",
    value: "GAP",
  },
  { label: "ระบบการขึ้นทะเบียนโรงงานผลิตสินค้าพืช (DOA)", value: "DOA" },
  {
    label:
      "ระบบการขึ้นทะเบียนหน่วยรับรองโรงงานผลิตสินค้าพืช (Certification Body : CB)",
    value: "CB",
  },
  {
    label: "ระบบการรับรองมาตรฐาน ORG (Organic Agriculture) พืช",
    value: "ORG",
  },
  { label: "ระบบจดทะเบียนผู้ส่งออก", value: "ส่งออก" },
  { label: "ระบบ Health Certificate ตามประกาศพืชควบคุมเฉพาะ", value: "HC" },
  {
    label: "ระบบ Health Certificate สินค้าเกษตรแปรรูปด้านพืชEX)",
    value: "HCEX",
  },
  {
    label:
      "ระบบบัญชีรายชื่อโรงคัดบรรจุตามมาตรการควบคุมพิเศษ (Establishment List: EL)",
    value: "EL",
  },
];

// ── Address data ──
const addressData = {
  กรุงเทพมหานคร: {
    ห้วยขวาง: {
      zipCode: "10310",
      subdistricts: ["ห้วยขวาง", "บางกะปิ", "สามเสนนอก"],
    },
    บางรัก: {
      zipCode: "10500",
      subdistricts: ["บางรัก", "มหาพฤฒาราม", "สีลม", "สุริยวงศ์"],
    },
    ลาดพร้าว: { zipCode: "10230", subdistricts: ["ลาดพร้าว", "จรเข้บัว"] },
    จตุจักร: {
      zipCode: "10900",
      subdistricts: ["จตุจักร", "จอมพล", "เสนานิคม", "ลาดยาว", "จันทรเกษม"],
    },
    บึงกุ่ม: {
      zipCode: "10230",
      subdistricts: ["คลองกุ่ม", "นวมินทร์", "นวลจันทร์"],
    },
  },
  เชียงใหม่: {
    เมืองเชียงใหม่: {
      zipCode: "50000",
      subdistricts: ["ศรีภูมิ", "พระสิงห์", "หายยา", "ช้างมอย", "ช้างคลาน"],
    },
    สันทราย: {
      zipCode: "50210",
      subdistricts: ["สันทรายหลวง", "สันทรายน้อย", "สันพระเนตร"],
    },
    หางดง: {
      zipCode: "50230",
      subdistricts: ["หางดง", "หนองควาย", "บ้านแหวน"],
    },
  },
  เชียงราย: {
    เมืองเชียงราย: {
      zipCode: "57000",
      subdistricts: ["เวียง", "รอบเวียง", "บ้านดู่", "นางแล"],
    },
    แม่จัน: {
      zipCode: "57110",
      subdistricts: ["แม่จัน", "จันจว้า", "แม่คำ", "ป่าซาง"],
    },
  },
  ขอนแก่น: {
    เมืองขอนแก่น: {
      zipCode: "40000",
      subdistricts: ["พระลับ", "สาวะถี", "บ้านทุ่ม", "เมืองเก่า"],
    },
    บ้านฝาง: {
      zipCode: "40270",
      subdistricts: ["บ้านฝาง", "ป่าหวายนั่ง", "โนนฆ้อง"],
    },
  },
  นครราชสีมา: {
    เมืองนครราชสีมา: {
      zipCode: "30000",
      subdistricts: ["ในเมือง", "โพธิ์กลาง", "หัวทะเล", "จอหอ"],
    },
    โชคชัย: { zipCode: "30190", subdistricts: ["โชคชัย", "กระโทก", "พลับพลา"] },
  },
  สงขลา: {
    เมืองสงขลา: {
      zipCode: "90000",
      subdistricts: ["บ่อยาง", "เขารูปช้าง", "เกาะแต้ว", "พะวง"],
    },
    หาดใหญ่: {
      zipCode: "90110",
      subdistricts: ["หาดใหญ่", "คลองแห", "คูเต่า", "คลองอู่ตะเภา"],
    },
  },
  ภูเก็ต: {
    เมืองภูเก็ต: {
      zipCode: "83000",
      subdistricts: ["ตลาดใหญ่", "ตลาดเหนือ", "เกาะแก้ว", "รัษฎา"],
    },
    กะทู้: { zipCode: "83120", subdistricts: ["กะทู้", "กมลา", "ป่าตอง"] },
    ถลาง: {
      zipCode: "83110",
      subdistricts: ["เทพกษัตรี", "ศรีสุนทร", "เชิงทะเล"],
    },
  },
  อุบลราชธานี: {
    เมืองอุบลราชธานี: {
      zipCode: "34000",
      subdistricts: ["ในเมือง", "ขามใหญ่", "แจระแม", "หัวเรือ"],
    },
    วารินชำราบ: {
      zipCode: "34190",
      subdistricts: ["วารินชำราบ", "ธาตุน้อย", "บุ่งหวาย"],
    },
  },
  นครปฐม: {
    เมืองนครปฐม: {
      zipCode: "73000",
      subdistricts: ["พระปฐมเจดีย์", "บางแขม", "พระประโทน", "สามควายเนียม"],
    },
    สามพราน: {
      zipCode: "73110",
      subdistricts: ["สามพราน", "ท่าข้าม", "หอมเกร็ด", "บางกระทึก"],
    },
  },
  ระยอง: {
    เมืองระยอง: {
      zipCode: "21000",
      subdistricts: ["ท่าประดู่", "เชิงเนิน", "ตะพง", "ปากน้ำ"],
    },
    มาบตาพุด: {
      zipCode: "21150",
      subdistricts: ["มาบตาพุด", "เนินพระ", "ทับมา"],
    },
  },
  ชลบุรี: {
    เมืองชลบุรี: {
      zipCode: "20000",
      subdistricts: ["บางปลาสร้อย", "มะขามหย่ง", "บ้านโขด"],
    },
    พัทยา: {
      zipCode: "20150",
      subdistricts: ["หนองปรือ", "หนองปลาไหล", "นาเกลือ"],
    },
    ศรีราชา: {
      zipCode: "20110",
      subdistricts: ["ศรีราชา", "สุรศักดิ์", "บึง", "หนองขาม"],
    },
  },
  สมุทรปราการ: {
    เมืองสมุทรปราการ: {
      zipCode: "10270",
      subdistricts: ["ปากน้ำ", "สำโรงเหนือ", "บางเมือง", "ท้ายบ้าน"],
    },
    บางพลี: {
      zipCode: "10540",
      subdistricts: ["บางพลีใหญ่", "บางแก้ว", "บางปลา", "บางโฉลง"],
    },
  },
  นนทบุรี: {
    เมืองนนทบุรี: {
      zipCode: "11000",
      subdistricts: ["สวนใหญ่", "ตลาดขวัญ", "บางเขน", "บางกระสอ"],
    },
    ปากเกร็ด: {
      zipCode: "11120",
      subdistricts: ["ปากเกร็ด", "บางตลาด", "บ้านใหม่", "บางพูด"],
    },
  },
  ปทุมธานี: {
    เมืองปทุมธานี: {
      zipCode: "12000",
      subdistricts: ["บางปรอก", "บ้านกลาง", "บ้านฉาง", "บ้านกระแชง"],
    },
    ธัญบุรี: {
      zipCode: "12110",
      subdistricts: ["ประชาธิปัตย์", "บึงยี่โถ", "รังสิต", "ลาดสวาย"],
    },
  },
  อยุธยา: {
    พระนครศรีอยุธยา: {
      zipCode: "13000",
      subdistricts: ["ประตูชัย", "กะมัง", "หอรัตนไชย", "หัวรอ"],
    },
    บางปะอิน: {
      zipCode: "13160",
      subdistricts: ["บางปะอิน", "บ้านเลน", "บางประแดง", "คุ้งลาน"],
    },
  },
};

const provinces = Object.keys(addressData);

const activeTab = ref("info");

// ── DBD Info ──
const dbdInfoMap = {
  co1: {
    regNo: "0105565012345",
    nameTh: "บริษัท ไทยเกษตรอินเตอร์ จำกัด",
    nameEn: "Thai Kaset International Co., Ltd.",
    type: "บริษัทจำกัด",
    status: "ยังดำเนินกิจการอยู่",
    capital: "10,000,000 บาท",
    authorized: "นายสมชาย ใจดี",
    address: "88/1 ถนนลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230",
    updatedAt: "01/04/2569",
  },
  co2: {
    regNo: "0303560098765",
    nameTh: "ห้างหุ้นส่วนจำกัด สยามฟาร์มโปรดักส์",
    nameEn: "Siam Farm Products Ltd. Part.",
    type: "ห้างหุ้นส่วนจำกัด",
    status: "ยังดำเนินกิจการอยู่",
    capital: "5,000,000 บาท",
    authorized: "นายวิชิต เกษตรกรรม",
    address:
      "45 ถนนพหลโยธิน ตำบลบ้านดู่ อำเภอเมืองเชียงราย จังหวัดเชียงราย 57000",
    updatedAt: "15/03/2569",
  },
  co3: {
    regNo: "0105568054321",
    nameTh: "บริษัท กรีนเซอร์ติฟาย (ประเทศไทย) จำกัด",
    nameEn: "Green Certify (Thailand) Co., Ltd.",
    type: "บริษัทจำกัด",
    status: "ยังดำเนินกิจการอยู่",
    capital: "20,000,000 บาท",
    authorized: "นางสาวพิมพ์ใจ รักษ์สิ่งแวดล้อม",
    address:
      "200 อาคารเจริญนคร ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพมหานคร 10600",
    updatedAt: "20/03/2569",
  },
};

const currentDbdInfo = computed(
  () => dbdInfoMap[selectedCompany.value] ?? dbdInfoMap.co1,
);

// ── DBD Refresh Requests ──
const dbdRefreshRequests = ref([
  {
    id: 1,
    companyId: "co1",
    submittedAt: "10/03/2569",
    reviewedAt: "12/03/2569",
    status: "approved",
    note: "เปลี่ยนผู้มีอำนาจลงนาม",
  },
]);
let nextDbdReqId = 2;

// Mock "new" DBD data (simulates what DBD would return today)
const newDbdInfoMap = {
  co1: {
    regNo: "0105565012345",
    nameTh: "บริษัท ไทยเกษตรอินเตอร์ จำกัด",
    nameEn: "Thai Kaset International Co., Ltd.",
    type: "บริษัทจำกัด",
    status: "ยังดำเนินกิจการอยู่",
    capital: "15,000,000 บาท", // เปลี่ยน
    authorized: "นางสาวพรทิพย์ มีชัย", // เปลี่ยน
    address: "88/1 ถนนลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230",
  },
  co2: {
    regNo: "0303560098765",
    nameTh: "ห้างหุ้นส่วนจำกัด สยามฟาร์มโปรดักส์",
    nameEn: "Siam Farm Products Ltd. Part.",
    type: "ห้างหุ้นส่วนจำกัด",
    status: "ยังดำเนินกิจการอยู่",
    capital: "5,000,000 บาท",
    authorized: "นายวิชิต เกษตรกรรม",
    address:
      "99/9 ถนนเชียงราย-พะเยา ตำบลเวียง อำเภอเมืองเชียงราย จังหวัดเชียงราย 57000", // เปลี่ยน
  },
  co3: {
    regNo: "0105568054321",
    nameTh: "บริษัท กรีนเซอร์ติฟาย (ประเทศไทย) จำกัด",
    nameEn: "Green Certify (Thailand) Co., Ltd.",
    type: "บริษัทจำกัด",
    status: "ยังดำเนินกิจการอยู่",
    capital: "20,000,000 บาท",
    authorized: "นางสาวพิมพ์ใจ รักษ์สิ่งแวดล้อม",
    address:
      "200 อาคารเจริญนคร ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพมหานคร 10600",
  },
};

const dbdCompareFieldDefs = [
  { key: "regNo", label: "เลขทะเบียน" },
  { key: "nameTh", label: "ชื่อ (ไทย)" },
  { key: "nameEn", label: "ชื่อ (อังกฤษ)" },
  { key: "type", label: "ประเภท" },
  { key: "status", label: "สถานะ" },
  { key: "capital", label: "ทุนจดทะเบียน" },
  { key: "authorized", label: "ผู้มีอำนาจลงนาม" },
  { key: "address", label: "ที่อยู่จดทะเบียน" },
];

const dbdCompareFields = computed(() => {
  const cur = currentDbdInfo.value;
  const nw = newDbdInfoMap[selectedCompany.value] ?? {};
  return dbdCompareFieldDefs.map((f) => ({
    key: f.key,
    label: f.label,
    current: cur[f.key] ?? "—",
    newVal: nw[f.key] ?? "—",
    changed: (cur[f.key] ?? "") !== (nw[f.key] ?? ""),
  }));
});

const dbdChangedFields = computed(() =>
  dbdCompareFields.value.filter((f) => f.changed),
);

const dbdRefreshConfirmDialog = ref(false);
const dbdFetchLoading = ref(false);
const dbdRefreshNote = ref("");

watch(dbdRefreshConfirmDialog, (val) => {
  if (val) {
    dbdFetchLoading.value = true;
    dbdRefreshNote.value = "";
    setTimeout(() => {
      dbdFetchLoading.value = false;
    }, 1400);
  }
});

const filteredDbdRequests = computed(() =>
  dbdRefreshRequests.value
    .filter((r) => r.companyId === selectedCompany.value)
    .sort((a, b) => b.id - a.id),
);

const hasPendingDbdRequest = computed(() =>
  filteredDbdRequests.value.some((r) => r.status === "pending"),
);

function goToDbdRefresh() {
  activeTab.value = "info";
  // เปิด dialog หลังจาก tab switch แล้ว
  setTimeout(() => {
    dbdRefreshConfirmDialog.value = true;
  }, 150);
}

function submitDbdRefresh() {
  const changedLabels = dbdChangedFields.value.map((f) => f.label).join(", ");
  dbdRefreshRequests.value.push({
    id: nextDbdReqId++,
    companyId: selectedCompany.value,
    submittedAt: new Date().toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    reviewedAt: null,
    status: "pending",
    changedFields: changedLabels || "ไม่มีการเปลี่ยนแปลง",
    note: dbdRefreshNote.value,
  });
  dbdRefreshNote.value = "";
  dbdRefreshConfirmDialog.value = false;
}
const selectedCompany = computed(() => route.query.companyId || "co1");
const currentCompany = computed(
  () => companies.find((c) => c.id === selectedCompany.value) ?? companies[0],
);

// ── Branches ──
const branches = ref([
  {
    id: 1,
    companyId: "co1",
    branchType: "head",
    branchNo: "00000",
    branchName: "สำนักงานใหญ่",
    houseNo: "88/1",
    road: "ถนนลาดพร้าว",
    subdistrict: "ลาดพร้าว",
    district: "ลาดพร้าว",
    province: "กรุงเทพมหานคร",
    zipCode: "10230",
  },
  {
    id: 2,
    companyId: "co1",
    branchType: "branch",
    branchNo: "00001",
    branchName: "สาขาเชียงใหม่",
    houseNo: "55/2",
    road: "ถนนนิมมานเหมินท์",
    subdistrict: "สุเทพ",
    district: "เมืองเชียงใหม่",
    province: "เชียงใหม่",
    zipCode: "50000",
  },
]);
let nextBranchId = 3;

const primaryBranchId = ref(1);

const filteredBranches = computed(() =>
  branches.value.filter((b) => b.companyId === selectedCompany.value),
);

function branchAddress(branch) {
  const parts = [
    branch.houseNo,
    branch.road,
    branch.subdistrict,
    branch.district,
    branch.province,
    branch.zipCode,
  ];
  return parts.filter(Boolean).join(" ");
}

// ── Branch Dialog ──
const branchDialog = ref(false);
const branchEditingItem = ref(null);
const branchForm = reactive({
  branchNo: "",
  branchName: "",
  houseNo: "",
  road: "",
  province: "",
  district: "",
  subdistrict: "",
  zipCode: "",
});

const formDistricts = computed(() =>
  branchForm.province
    ? Object.keys(addressData[branchForm.province] ?? {})
    : [],
);

const formSubdistricts = computed(() =>
  branchForm.province && branchForm.district
    ? (addressData[branchForm.province]?.[branchForm.district]?.subdistricts ??
      [])
    : [],
);

watch(
  () => branchForm.province,
  () => {
    branchForm.district = "";
    branchForm.subdistrict = "";
    branchForm.zipCode = "";
  },
);

watch(
  () => branchForm.district,
  (newDistrict) => {
    branchForm.subdistrict = "";
    branchForm.zipCode =
      addressData[branchForm.province]?.[newDistrict]?.zipCode ?? "";
  },
);

function openAddBranch() {
  branchEditingItem.value = null;
  branchForm.branchNo = "";
  branchForm.branchName = "";
  branchForm.houseNo = "";
  branchForm.road = "";
  branchForm.province = "";
  branchForm.district = "";
  branchForm.subdistrict = "";
  branchForm.zipCode = "";
  branchDialog.value = true;
}

function openEditBranch(branch) {
  branchEditingItem.value = branch;
  branchForm.branchNo = branch.branchNo;
  branchForm.branchName = branch.branchName;
  branchForm.houseNo = branch.houseNo;
  branchForm.road = branch.road;
  branchForm.province = branch.province;
  branchForm.district = branch.district;
  branchForm.subdistrict = branch.subdistrict;
  branchForm.zipCode = branch.zipCode;
  branchDialog.value = true;
}

function closeBranchDialog() {
  branchDialog.value = false;
}

function saveBranch() {
  if (branchEditingItem.value) {
    const idx = branches.value.findIndex(
      (b) => b.id === branchEditingItem.value.id,
    );
    if (idx !== -1) {
      branches.value[idx] = {
        ...branches.value[idx],
        branchNo: branchForm.branchNo,
        branchName: branchForm.branchName,
        houseNo: branchForm.houseNo,
        road: branchForm.road,
        province: branchForm.province,
        district: branchForm.district,
        subdistrict: branchForm.subdistrict,
        zipCode: branchForm.zipCode,
      };
    }
  } else {
    branches.value.push({
      id: nextBranchId++,
      companyId: selectedCompany.value,
      branchType: "branch",
      branchNo: branchForm.branchNo,
      branchName: branchForm.branchName,
      houseNo: branchForm.houseNo,
      road: branchForm.road,
      province: branchForm.province,
      district: branchForm.district,
      subdistrict: branchForm.subdistrict,
      zipCode: branchForm.zipCode,
    });
  }
  branchDialog.value = false;
}

// ── Branch Delete ──
const branchDeleteDialog = ref(false);
const deletingBranch = ref(null);

function openDeleteBranch(branch) {
  deletingBranch.value = branch;
  branchDeleteDialog.value = true;
}

function confirmDeleteBranch() {
  branches.value = branches.value.filter(
    (b) => b.id !== deletingBranch.value?.id,
  );
  if (primaryBranchId.value === deletingBranch.value?.id) {
    const head = branches.value.find((b) => b.branchType === "head");
    if (head) primaryBranchId.value = head.id;
  }
  branchDeleteDialog.value = false;
}

// ── Set Primary ──
const setPrimaryDialog = ref(false);
const setPrimaryTarget = ref(null);

function setPrimaryBranch(id) {
  setPrimaryTarget.value = branches.value.find((b) => b.id === id) ?? null;
  setPrimaryDialog.value = true;
}

function confirmSetPrimary() {
  if (setPrimaryTarget.value) primaryBranchId.value = setPrimaryTarget.value.id;
  setPrimaryDialog.value = false;
}

// ── Delegates ──
const delegates = ref([
  {
    id: 1,
    companyId: "co1",
    name: "นายสมชาย ใจดี",
    idCard: "1 1002 00123 45 6",
    email: "somchai@example.com",
    expiry: "2025-12-31",
    status: "active",
    systems: ["GAP", "DOA"],
  },
  {
    id: 2,
    companyId: "co1",
    name: "นางสาวสุดา พัฒนา",
    idCard: "1 3701 00456 78 9",
    email: "suda@example.com",
    expiry: "2025-04-01",
    status: "active",
    systems: ["DOA", "ส่งออก", "HCEX"],
  },
  {
    id: 3,
    companyId: "co2",
    name: "นายวิชิต เกษตรกรรม",
    idCard: "1 4501 00789 01 2",
    email: "wichit@example.com",
    expiry: "2025-12-31",
    status: "inactive",
    systems: ["GAP"],
  },
]);
let nextId = 4;

const filteredDelegates = computed(() =>
  delegates.value.filter((d) => d.companyId === selectedCompany.value),
);

// ── POA Requests ──
const poaRequests = ref([
  {
    id: 1,
    companyId: "co1",
    name: "นายประสิทธิ์ มีสุข",
    idCard: "1 2101 00321 11 3",
    email: "prasit@example.com",
    requestedExpiry: "2026-12-31",
    requestedSystems: ["GAP", "ส่งออก"],
    requestedAt: "15/03/2569",
    status: "pending",
  },
  {
    id: 2,
    companyId: "co1",
    name: "นางสาวอรทัย ลำดับดี",
    idCard: "1 5601 00654 22 8",
    email: "orathai@example.com",
    requestedExpiry: "2026-06-30",
    requestedSystems: ["DOA", "CB", "HC แปรรูป"],
    requestedAt: "10/03/2569",
    status: "pending",
  },
  {
    id: 3,
    companyId: "co1",
    name: "นายกิตติพงษ์ สุขสวัสดิ์",
    idCard: "1 1001 00987 33 5",
    email: "kitti@example.com",
    requestedExpiry: "2025-12-31",
    requestedSystems: ["GAP"],
    approvedSystems: ["GAP"],
    requestedAt: "01/03/2569",
    status: "approved",
  },
  {
    id: 4,
    companyId: "co2",
    name: "นางวิมล ทองดี",
    idCard: "1 6701 00111 44 7",
    email: "wimon@example.com",
    requestedExpiry: "2026-03-31",
    requestedSystems: ["GAP", "DOA"],
    requestedAt: "08/03/2569",
    status: "pending",
  },
  {
    id: 5,
    companyId: "co1",
    name: "นายธนพล รักษาดี",
    idCard: "1 3301 00555 66 1",
    email: "thanaphon@example.com",
    requestedExpiry: "2026-09-30",
    requestedSystems: ["HC ควบคุมเฉพาะ", "HC แปรรูป"],
    requestedAt: "12/03/2569",
    status: "rejected",
  },
]);

const filteredRequests = computed(() =>
  poaRequests.value.filter((r) => r.companyId === selectedCompany.value),
);

const requestSearch = ref("");
const requestStatusFilter = ref("all");

function setRequestStatusFilter(value) {
  requestStatusFilter.value = value;
}

const statusFilters = [
  { value: "all", label: "ทั้งหมด", color: "info", icon: "" },
  {
    value: "pending",
    label: "รอดำเนินการ",
    color: "warning",
    icon: "fas fa-clock",
  },
  {
    value: "approved",
    label: "อนุมัติแล้ว",
    color: "success",
    icon: "fas fa-circle-check",
  },
  {
    value: "rejected",
    label: "ปฏิเสธแล้ว",
    color: "error",
    icon: "fas fa-circle-xmark",
  },
];

const requestHeaders = [
  { title: "ผู้ขอรับมอบอำนาจ", key: "name", sortable: true, width: "260px" },
  { title: "ระบบที่ขอ", key: "requestedSystems", sortable: false },
  {
    title: "วันที่ยื่นคำขอ",
    key: "requestedAt",
    sortable: true,
    width: "130px",
  },
  { title: "สถานะ", key: "status", sortable: true, width: "150px" },
  { title: "การดำเนินการ", key: "actions", sortable: false, width: "160px" },
];

const tableRequests = computed(() => {
  const base = filteredRequests.value;
  if (requestStatusFilter.value === "all") return base;
  return base.filter((r) => r.status === requestStatusFilter.value);
});

function countByStatus(status) {
  const base = filteredRequests.value;
  if (status === "all") return base.length;
  return base.filter((r) => r.status === status).length;
}

function goToSelectCompany() {
  router.push({ name: "CompanySelection" });
}

// ── Delegate Form ──
const formDialog = ref(false);
const editingItem = ref(null);
const form = reactive({
  name: "",
  idCard: "",
  email: "",
  expiry: "",
  status: "active",
  systems: [],
});

function openAdd() {
  editingItem.value = null;
  form.name = "";
  form.idCard = "";
  form.email = "";
  form.expiry = "";
  form.status = "active";
  form.systems = [];
  formDialog.value = true;
}

function openEdit(item) {
  editingItem.value = item;
  form.name = item.name;
  form.idCard = item.idCard;
  form.email = item.email;
  form.expiry = item.expiry;
  form.status = item.status;
  form.systems = [...item.systems];
  formDialog.value = true;
}

function saveForm() {
  if (editingItem.value) {
    const idx = delegates.value.findIndex((d) => d.id === editingItem.value.id);
    if (idx !== -1) {
      delegates.value[idx] = {
        ...editingItem.value,
        name: form.name,
        idCard: form.idCard,
        email: form.email,
        expiry: form.expiry,
        status: form.status,
        systems: [...form.systems],
      };
    }
  } else {
    delegates.value.push({
      id: nextId++,
      companyId: selectedCompany.value,
      name: form.name,
      idCard: form.idCard,
      email: form.email,
      expiry: form.expiry,
      status: form.status,
      systems: [...form.systems],
    });
  }
  formDialog.value = false;
}

function closeFormDialog() {
  formDialog.value = false;
}

// ── Delegate Delete ──
const deleteDialog = ref(false);
const deletingItem = ref(null);
function openDelete(item) {
  deletingItem.value = item;
  deleteDialog.value = true;
}
function confirmDelete() {
  delegates.value = delegates.value.filter(
    (d) => d.id !== deletingItem.value?.id,
  );
  deleteDialog.value = false;
}
function closeDeleteDialog() {
  deleteDialog.value = false;
}

// ── Review Request ──
const reviewDialog = ref(false);
const reviewRequest = ref(null);
const systemDecisions = reactive({});
const reviewNote = ref("");
const reviewDecisionError = ref(false);

function openReview(req) {
  reviewRequest.value = req;
  reviewNote.value = "";
  reviewDecisionError.value = false;
  req.requestedSystems.forEach((sys) => {
    systemDecisions[sys] = null;
  });
  reviewDialog.value = true;
}

function submitReview() {
  const systems = reviewRequest.value?.requestedSystems ?? [];
  const allDecided = systems.every((sys) => systemDecisions[sys] !== null);
  if (!allDecided) {
    reviewDecisionError.value = true;
    return;
  }
  reviewDecisionError.value = false;

  const approvedSystems = systems.filter(
    (sys) => systemDecisions[sys] === "approved",
  );
  const finalStatus =
    approvedSystems.length === 0
      ? "rejected"
      : approvedSystems.length === systems.length
        ? "approved"
        : "partial";

  const idx = poaRequests.value.findIndex(
    (r) => r.id === reviewRequest.value?.id,
  );
  if (idx !== -1) {
    poaRequests.value[idx].status = finalStatus;
    poaRequests.value[idx].approvedSystems = approvedSystems;
    poaRequests.value[idx].reviewNote = reviewNote.value;
  }
  reviewDialog.value = false;
}

// ── Status helpers ──
function statusColor(item) {
  if (item.status === "pending") return "warning";
  if (item.status === "rejected") return "error";
  if (item.status === "partial") return "warning";
  return "success";
}

function statusIcon(item) {
  if (item.status === "pending") return "fas fa-clock";
  if (item.status === "rejected") return "fas fa-circle-xmark";
  if (item.status === "partial") return "fas fa-circle-half-stroke";
  return "fas fa-circle-check";
}

function statusLabel(item) {
  if (item.status === "pending") return "รอดำเนินการ";
  if (item.status === "rejected") return "ปฏิเสธทั้งหมด";
  if (item.status === "partial") return "อนุมัติบางส่วน";
  return "อนุมัติทั้งหมด";
}
</script>

<style scoped>
.poa-root {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.poa-topbar {
  background: rgb(var(--v-theme-primary));
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}
.is-dark .poa-topbar {
  background: rgba(var(--v-theme-primary), 0.18);
}
.poa-topbar-inner {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.poa-body {
  padding: 40px 20px;
}
.poa-body-inner {
  max-width: 860px;
  margin: 0 auto;
}

.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
}

/* ── Branch rows ── */
.branch-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.15s;
}
.branch-row:hover {
  background: rgba(var(--v-theme-primary), 0.03);
}
.branch-row--last {
  border-bottom: none;
}
.branch-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(var(--v-border-color), 0.06);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Delegate rows ── */
.delegate-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.15s;
}
.delegate-row:hover {
  background: rgba(var(--v-theme-primary), 0.03);
}
.delegate-row--last {
  border-bottom: none;
}
.delegate-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(var(--v-border-color), 0.06);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  align-items: center;
  justify-content: center;
}

.system-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 4px;
  padding: 10px 12px;
  background: rgba(var(--v-border-color), 0.04);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
}

.filter-chip {
  cursor: pointer;
  transition: all 0.15s;
}

.confirm-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-ring--error {
  background: rgba(var(--v-theme-error), 0.1);
  border: 2px solid rgba(var(--v-theme-error), 0.2);
}
.confirm-ring--success {
  background: rgba(var(--v-theme-success), 0.1);
  border: 2px solid rgba(var(--v-theme-success), 0.2);
}

.request-table :deep(thead th) {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
  background: rgba(var(--v-border-color), 0.04) !important;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.75);
  margin-bottom: 4px;
}
.field-label-en {
  font-size: 11px;
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.4);
  margin-left: 4px;
}
.req {
  color: rgb(var(--v-theme-error));
}

.sys-review-row {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(var(--v-border-color), 0.04);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.confirm-ring--info {
  background: rgba(var(--v-theme-info), 0.1);
  border: 2px solid rgba(var(--v-theme-info), 0.2);
}

.dbd-label {
  font-size: 11px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.45);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.dbd-value {
  font-size: 14px;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.85);
  margin-top: 2px;
}

.dbd-compare-table {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  overflow: hidden;
}
.dbd-compare-table thead th {
  font-size: 12px !important;
  font-weight: 600 !important;
  background: rgba(var(--v-border-color), 0.05) !important;
  color: rgba(var(--v-theme-on-surface), 0.55) !important;
  padding: 10px 14px !important;
}
.dbd-compare-table tbody td {
  padding: 9px 14px !important;
  font-size: 13px;
  vertical-align: top;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.dbd-compare-table tbody tr:last-child td {
  border-bottom: none;
}
.dbd-row-changed {
  background: rgba(var(--v-theme-warning), 0.06) !important;
}
.text-warning {
  color: rgb(var(--v-theme-warning)) !important;
}
</style>
