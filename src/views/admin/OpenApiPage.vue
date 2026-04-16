<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="page-title mb-1">Open API Management</h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          บริหารจัดการ API สำหรับเชื่อมต่อกับหน่วยงานภายนอก
        </p>
      </div>
      <div class="d-flex ga-2">
        <v-btn
          v-if="activeTab === 'access'"
          color="admin"
          variant="tonal"
          rounded="lg"
          prepend-icon="fas fa-file-signature"
          @click="openRequest"
          >ขอใช้บริการ</v-btn
        >
        <v-btn
          v-if="activeTab === 'apis'"
          color="admin"
          rounded="lg"
          prepend-icon="fas fa-plus"
          @click="openAdd"
          >เพิ่ม API</v-btn
        >
        <v-btn
          v-if="activeTab === 'logs'"
          color="admin"
          variant="tonal"
          rounded="lg"
          prepend-icon="fas fa-download"
          >Export Log</v-btn
        >
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs v-model="activeTab" color="admin" class="mb-5">
      <v-tab value="apis" prepend-icon="fas fa-code">รายการ API</v-tab>
      <v-tab value="access" prepend-icon="fas fa-key">การจัดการสิทธิ์</v-tab>
      <v-tab value="logs" prepend-icon="fas fa-clipboard-list"
        >Log การใช้งาน</v-tab
      >
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- ==================== Tab 1: API List ==================== -->
      <v-window-item value="apis">
        <div class="d-flex ga-2 flex-wrap mb-4">
          <v-chip color="success" variant="tonal" prepend-icon="fas fa-circle"
            >Active:
            {{ items.filter((i) => i.status === "Active").length }}</v-chip
          >
          <v-chip color="default" variant="tonal" prepend-icon="fas fa-circle"
            >Inactive:
            {{ items.filter((i) => i.status === "Inactive").length }}</v-chip
          >
        </div>

        <v-card rounded="xl" elevation="0">
          <v-data-table :headers="headers" :items="items" rounded="xl" hover>
            <template #item.method="{ item }">
              <v-chip
                size="x-small"
                :color="methodColor(item.method)"
                variant="tonal"
                class="font-weight-bold"
              >
                {{ item.method }}
              </v-chip>
            </template>
            <template #item.status="{ item }">
              <v-switch
                v-model="item.active"
                color="success"
                density="compact"
                hide-details
                @update:model-value="
                  item.status = item.active ? 'Active' : 'Inactive'
                "
              />
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex ga-1 justify-end">
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="warning"
                  rounded="lg"
                  icon="fas fa-pen"
                  @click="openEdit(item)"
                />
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="error"
                  rounded="lg"
                  icon="fas fa-trash"
                  @click="openDelete(item)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- ==================== Tab 2: Access Control ==================== -->
      <v-window-item value="access">
        <!-- Stats -->
        <div class="d-flex ga-3 flex-wrap mb-4">
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">
              Account ทั้งหมด
            </div>
            <div class="text-h6 font-weight-bold">{{ accounts.length }}</div>
          </v-card>
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">เปิดใช้งาน</div>
            <div class="text-h6 font-weight-bold text-success">
              {{ accounts.filter((a) => a.enabled).length }}
            </div>
          </v-card>
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">ปิดใช้งาน</div>
            <div class="text-h6 font-weight-bold text-error">
              {{ accounts.filter((a) => !a.enabled).length }}
            </div>
          </v-card>
        </div>

        <!-- Filter -->
        <v-card rounded="xl" elevation="0" class="pa-4 mb-4">
          <v-row dense align="end">
            <v-col cols="12" sm="4">
              <div class="filter-label">
                <div>ค้นหา</div>
                <div class="filter-label-en">Search</div>
              </div>
              <v-text-field
                v-model="accountSearch"
                placeholder="ชื่อ / หน่วยงาน"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                prepend-inner-icon="fas fa-magnifying-glass"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="3">
              <div class="filter-label">
                <div>สถานะ</div>
                <div class="filter-label-en">Status</div>
              </div>
              <v-autocomplete
                v-model="accountStatusFilter"
                :items="['ทั้งหมด', 'เปิดใช้งาน', 'ปิดใช้งาน']"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="3">
              <div class="filter-label">
                <div>API</div>
                <div class="filter-label-en">API Name</div>
              </div>
              <v-autocomplete
                v-model="accountApiFilter"
                :items="['ทั้งหมด', ...items.map((i) => i.name)]"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- Account Table -->
        <v-card rounded="xl" elevation="0">
          <v-data-table
            :headers="accountHeaders"
            :items="filteredAccounts"
            :items-per-page="10"
            rounded="xl"
            hover
          >
            <template #item.fullName="{ item }">
              <div class="d-flex align-center ga-2 py-1">
                <v-avatar color="admin" size="32" variant="tonal">
                  <v-icon icon="fas fa-user" size="14" color="admin" />
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ item.fullName }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ item.email }}
                  </div>
                </div>
              </div>
            </template>
            <template #item.allowedApis="{ item }">
              <div class="d-flex flex-wrap ga-1 py-1">
                <v-chip
                  v-for="api in item.allowedApis"
                  :key="api"
                  size="x-small"
                  color="admin"
                  variant="tonal"
                >
                  {{ api }}
                </v-chip>
              </div>
            </template>
            <template #item.enabled="{ item }">
              <v-switch
                v-model="item.enabled"
                :color="item.enabled ? 'success' : 'grey'"
                density="compact"
                hide-details
                :label="item.enabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'"
                @update:model-value="onToggleAccount(item)"
              />
            </template>
            <template #item.actions="{ item }">
              <div class="d-flex ga-1 justify-end">
                <v-tooltip text="แก้ไขสิทธิ์" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="x-small"
                      variant="tonal"
                      color="admin"
                      rounded="lg"
                      icon="fas fa-key"
                      @click="openEditAccess(item)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip
                  :text="item.enabled ? 'ปิดใช้งาน' : 'เปิดใช้งาน'"
                  location="top"
                >
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      size="x-small"
                      :variant="item.enabled ? 'tonal' : 'flat'"
                      :color="item.enabled ? 'error' : 'success'"
                      rounded="lg"
                      :icon="
                        item.enabled ? 'fas fa-ban' : 'fas fa-circle-check'
                      "
                      @click="
                        item.enabled = !item.enabled;
                        onToggleAccount(item);
                      "
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>

      <!-- ==================== Tab 3: Usage Log ==================== -->
      <v-window-item value="logs">
        <!-- Log Stats -->
        <div class="d-flex ga-3 flex-wrap mb-4">
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">
              คำขอทั้งหมด
            </div>
            <div class="text-h6 font-weight-bold">
              {{ logStats.total.toLocaleString() }}
            </div>
          </v-card>
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">
              สำเร็จ (2xx)
            </div>
            <div class="text-h6 font-weight-bold text-success">
              {{ logStats.success.toLocaleString() }}
            </div>
          </v-card>
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">
              ข้อผิดพลาด (4xx/5xx)
            </div>
            <div class="text-h6 font-weight-bold text-error">
              {{ logStats.error.toLocaleString() }}
            </div>
          </v-card>
          <v-card rounded="xl" elevation="0" class="px-4 py-3 flex-grow-1">
            <div class="text-caption text-medium-emphasis mb-1">
              เวลาตอบสนองเฉลี่ย
            </div>
            <div class="text-h6 font-weight-bold">
              {{ logStats.avgResponse }} ms
            </div>
          </v-card>
        </div>

        <!-- Log Filter -->
        <v-card rounded="xl" elevation="0" class="pa-4 mb-4">
          <v-row dense align="end">
            <v-col cols="12" sm="3">
              <div class="filter-label">
                <div>API</div>
                <div class="filter-label-en">API Name</div>
              </div>
              <v-autocomplete
                v-model="logFilter.api"
                :items="['ทั้งหมด', ...items.map((i) => i.name)]"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="3">
              <div class="filter-label">
                <div>สถานะการตอบสนอง</div>
                <div class="filter-label-en">Status Code</div>
              </div>
              <v-autocomplete
                v-model="logFilter.status"
                :items="['ทั้งหมด', '200', '400', '401', '403', '500']"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="3">
              <div class="filter-label">
                <div>วันที่เริ่มต้น</div>
                <div class="filter-label-en">Start Date</div>
              </div>
              <v-text-field
                v-model="logFilter.dateFrom"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12" sm="3">
              <div class="filter-label">
                <div>วันที่สิ้นสุด</div>
                <div class="filter-label-en">End Date</div>
              </div>
              <v-text-field
                v-model="logFilter.dateTo"
                type="date"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card>

        <!-- Log Table -->
        <v-card rounded="xl" elevation="0">
          <v-data-table
            :headers="logHeaders"
            :items="filteredLogs"
            :items-per-page="10"
            rounded="xl"
            hover
          >
            <template #item.method="{ item }">
              <v-chip
                size="x-small"
                :color="methodColor(item.method)"
                variant="tonal"
                class="font-weight-bold"
              >
                {{ item.method }}
              </v-chip>
            </template>
            <template #item.statusCode="{ item }">
              <v-chip
                size="x-small"
                :color="statusCodeColor(item.statusCode)"
                variant="tonal"
                class="font-weight-bold"
              >
                {{ item.statusCode }}
              </v-chip>
            </template>
            <template #item.responseTime="{ item }">
              <span
                :class="
                  item.responseTime > 1000
                    ? 'text-warning font-weight-bold'
                    : ''
                "
              >
                {{ item.responseTime }} ms
              </span>
            </template>
          </v-data-table>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- ==================== Dialogs ==================== -->

    <!-- Add / Edit API Dialog -->
    <v-dialog v-model="formDialog" max-width="520" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon
            :icon="editingItem ? 'fas fa-pen' : 'fas fa-plus'"
            color="admin"
            size="18"
          />
          {{ editingItem ? "แก้ไข API" : "เพิ่ม API" }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">
                <div>ชื่อ API <span class="req">*</span></div>
                <div class="field-label-en">API Name</div>
              </div>
              <v-text-field
                v-model="form.name"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อ API"
              />
            </v-col>
            <v-col cols="12" sm="8">
              <div class="field-label mt-3">
                <div>ปลายทาง <span class="req">*</span></div>
                <div class="field-label-en">Endpoint</div>
              </div>
              <v-text-field
                v-model="form.endpoint"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="/api/..."
              />
            </v-col>
            <v-col cols="12" sm="4">
              <div class="field-label mt-3">
                <div>วิธีการ <span class="req">*</span></div>
                <div class="field-label-en">Method</div>
              </div>
              <v-autocomplete
                v-model="form.method"
                :items="['GET', 'POST', 'PUT', 'DELETE']"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                <div>รายละเอียด</div>
                <div class="field-label-en">Description</div>
              </div>
              <v-textarea
                v-model="form.description"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                rows="2"
                placeholder="รายละเอียด API..."
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                <div>สถานะ</div>
                <div class="field-label-en">Status</div>
              </div>
              <v-switch
                v-model="form.isActive"
                color="admin"
                :label="form.isActive ? 'Active' : 'Inactive'"
                hide-details
                density="compact"
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
            @click="closeFormDialog"
            >ยกเลิก</v-btn
          >
          <v-btn color="admin" rounded="lg" @click="saveForm">{{
            editingItem ? "บันทึก" : "เพิ่ม API"
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Access Dialog -->
    <v-dialog v-model="editAccessDialog" max-width="540" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-key" color="admin" size="18" />
          แก้ไขสิทธิ์การเข้าถึง API
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <div
            class="d-flex align-center ga-3 mb-4 pa-3 rounded-lg"
            style="background: rgba(var(--v-theme-admin), 0.06)"
          >
            <v-avatar color="admin" size="40" variant="tonal">
              <v-icon icon="fas fa-user" size="18" color="admin" />
            </v-avatar>
            <div>
              <div class="font-weight-medium">
                {{ editingAccount?.fullName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ editingAccount?.organization }} · {{ editingAccount?.email }}
              </div>
            </div>
          </div>

          <div class="field-label mb-2">
            <div>API ที่อนุญาตให้เข้าถึง</div>
            <div class="field-label-en">Allowed APIs</div>
          </div>
          <div class="d-flex flex-column ga-2">
            <v-card
              v-for="api in items"
              :key="api.id"
              rounded="lg"
              elevation="0"
              class="pa-3 d-flex align-center justify-space-between"
              style="
                border: 1px solid
                  rgba(var(--v-border-color), var(--v-border-opacity));
              "
            >
              <div class="d-flex align-center ga-2">
                <v-chip
                  size="x-small"
                  :color="methodColor(api.method)"
                  variant="tonal"
                  class="font-weight-bold"
                  >{{ api.method }}</v-chip
                >
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ api.name }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ api.endpoint }}
                  </div>
                </div>
              </div>
              <v-checkbox
                v-model="accessFormApis"
                :value="api.name"
                color="admin"
                hide-details
                density="compact"
              />
            </v-card>
          </div>

          <div class="field-label mt-4 mb-2">
            <div>สถานะ Account</div>
            <div class="field-label-en">Account Status</div>
          </div>
          <v-switch
            v-model="accessFormEnabled"
            :color="accessFormEnabled ? 'success' : 'error'"
            :label="accessFormEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'"
            hide-details
            density="compact"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 ga-2">
          <v-spacer />
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            @click="editAccessDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="admin"
            rounded="lg"
            prepend-icon="fas fa-floppy-disk"
            @click="saveAccess"
            >บันทึก</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Request Dialog -->
    <v-dialog v-model="requestDialog" max-width="640" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-6 pb-4 d-flex align-center ga-2">
          <v-icon icon="fas fa-file-signature" color="admin" size="18" />
          ขอใช้บริการ Open API
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <div
            class="text-subtitle-2 font-weight-bold mb-3 text-medium-emphasis"
          >
            ข้อมูลผู้ขอใช้บริการ
          </div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>ชื่อ-นามสกุล <span class="req">*</span></div>
                <div class="field-label-en">Full Name</div>
              </div>
              <v-text-field
                v-model="reqForm.fullName"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อ-นามสกุล"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label">
                <div>หน่วยงาน/องค์กร <span class="req">*</span></div>
                <div class="field-label-en">Organization</div>
              </div>
              <v-text-field
                v-model="reqForm.organization"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="ชื่อหน่วยงาน"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>เบอร์ติดต่อ <span class="req">*</span></div>
                <div class="field-label-en">Phone Number</div>
              </div>
              <v-text-field
                v-model="reqForm.phone"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="0xx-xxx-xxxx"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>อีเมล <span class="req">*</span></div>
                <div class="field-label-en">Email</div>
              </div>
              <v-text-field
                v-model="reqForm.email"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="email@example.com"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div
            class="text-subtitle-2 font-weight-bold mb-3 text-medium-emphasis"
          >
            รายละเอียดการขอใช้บริการ
          </div>
          <v-row dense>
            <v-col cols="12">
              <div class="field-label">
                <div>API ที่ต้องการใช้งาน <span class="req">*</span></div>
                <div class="field-label-en">Requested APIs</div>
              </div>
              <v-autocomplete
                v-model="reqForm.selectedApis"
                :items="items.map((i) => i.name)"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                multiple
                chips
                closable-chips
                placeholder="เลือก API ที่ต้องการ"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>ระยะเวลาที่ต้องการใช้</div>
                <div class="field-label-en">Duration</div>
              </div>
              <v-text-field
                v-model="reqForm.duration"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                placeholder="เช่น 1 ปี, 6 เดือน"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <div class="field-label mt-3">
                <div>ประเภทการเชื่อมต่อ</div>
                <div class="field-label-en">Connection Type</div>
              </div>
              <v-autocomplete
                v-model="reqForm.connType"
                :items="['REST API', 'SOAP', 'WebSocket', 'อื่นๆ']"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                <div>วัตถุประสงค์การใช้งาน <span class="req">*</span></div>
                <div class="field-label-en">Purpose of Use</div>
              </div>
              <v-textarea
                v-model="reqForm.purpose"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                rows="3"
                placeholder="อธิบายวัตถุประสงค์และการนำไปใช้งาน..."
              />
            </v-col>
            <v-col cols="12">
              <div class="field-label mt-3">
                <div>เอกสารประกอบ (ถ้ามี)</div>
                <div class="field-label-en">Attachments (Optional)</div>
              </div>
              <v-file-input
                v-model="reqForm.attachments"
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                multiple
                prepend-icon=""
                prepend-inner-icon="fas fa-paperclip"
                placeholder="แนบเอกสารที่เกี่ยวข้อง"
                accept=".pdf,.doc,.docx"
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
            @click="closeRequestDialog"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="admin"
            rounded="lg"
            prepend-icon="fas fa-paper-plane"
            @click="submitRequest"
            >ส่งคำขอ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Request Success Dialog -->
    <v-dialog v-model="requestSuccessDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-8 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" color="success" size="28" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ส่งคำขอสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            คำขอใช้บริการของคุณถูกส่งเรียบร้อยแล้ว<br />เจ้าหน้าที่จะติดต่อกลับตามข้อมูลที่ให้ไว้
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            color="admin"
            rounded="lg"
            block
            @click="requestSuccessDialog = false"
            >ตกลง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl">
        <v-card-text class="pa-7 text-center">
          <div class="delete-ring mx-auto mb-4">
            <v-icon icon="fas fa-trash" color="error" size="26" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ลบ API</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            ต้องการลบ <strong>{{ deletingItem?.name }}</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            block
            @click="closeDeleteDialog"
            >ยกเลิก</v-btn
          >
          <v-btn color="error" rounded="lg" block @click="confirmDelete"
            >ลบ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="toggleSnackbar"
      :color="toggleSnackbarColor"
      rounded="lg"
      location="bottom end"
      :timeout="2500"
    >
      <v-icon
        :icon="
          toggleSnackbarColor === 'success'
            ? 'fas fa-circle-check'
            : 'fas fa-ban'
        "
        class="mr-2"
      />
      {{ toggleSnackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";

const activeTab = ref("apis");

// ==================== API List ====================
const items = ref([
  {
    id: 1,
    name: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    description: "ดึงข้อมูลโรงงาน",
    status: "Active",
    active: true,
  },
  {
    id: 2,
    name: "Submit Request",
    endpoint: "/api/request",
    method: "POST",
    description: "ยื่นคำขอ",
    status: "Active",
    active: true,
  },
  {
    id: 3,
    name: "Update Certificate",
    endpoint: "/api/certificate",
    method: "PUT",
    description: "อัปเดตใบรับรอง",
    status: "Inactive",
    active: false,
  },
]);

let nextId = 4;

const headers = [
  { title: "API Name", key: "name", sortable: true },
  { title: "Endpoint", key: "endpoint" },
  { title: "Method", key: "method", sortable: true },
  { title: "Description", key: "description" },
  { title: "สถานะ", key: "status", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

function methodColor(m) {
  return m === "GET"
    ? "success"
    : m === "POST"
      ? "info"
      : m === "PUT"
        ? "warning"
        : "error";
}

// Form (Add/Edit API)
const formDialog = ref(false);
const editingItem = ref(null);
const form = reactive({
  name: "",
  endpoint: "",
  method: "GET",
  description: "",
  isActive: true,
});

function openAdd() {
  editingItem.value = null;
  Object.assign(form, {
    name: "",
    endpoint: "",
    method: "GET",
    description: "",
    isActive: true,
  });
  formDialog.value = true;
}
function openEdit(item) {
  editingItem.value = item;
  Object.assign(form, {
    name: item.name,
    endpoint: item.endpoint,
    method: item.method,
    description: item.description,
    isActive: item.active,
  });
  formDialog.value = true;
}
function saveForm() {
  const status = form.isActive ? "Active" : "Inactive";
  if (editingItem.value) {
    const idx = items.value.findIndex((i) => i.id === editingItem.value.id);
    if (idx !== -1)
      items.value[idx] = {
        ...editingItem.value,
        name: form.name,
        endpoint: form.endpoint,
        method: form.method,
        description: form.description,
        status,
        active: form.isActive,
      };
  } else {
    items.value.push({
      id: nextId++,
      name: form.name,
      endpoint: form.endpoint,
      method: form.method,
      description: form.description,
      status,
      active: form.isActive,
    });
  }
  formDialog.value = false;
}
function closeFormDialog() {
  formDialog.value = false;
}

// Delete
const deleteDialog = ref(false);
const deletingItem = ref(null);
function openDelete(item) {
  deletingItem.value = item;
  deleteDialog.value = true;
}
function closeDeleteDialog() {
  deleteDialog.value = false;
}
function confirmDelete() {
  items.value = items.value.filter((i) => i.id !== deletingItem.value?.id);
  deleteDialog.value = false;
}

// ==================== Access Control ====================
const accountSearch = ref("");
const accountStatusFilter = ref("ทั้งหมด");
const accountApiFilter = ref("ทั้งหมด");

const accountHeaders = [
  { title: "ผู้ใช้งาน", key: "fullName" },
  { title: "หน่วยงาน", key: "organization" },
  { title: "API ที่อนุญาต", key: "allowedApis", sortable: false },
  { title: "วันที่อนุมัติ", key: "approvedAt", sortable: true },
  { title: "สถานะ", key: "enabled", sortable: true },
  { title: "", key: "actions", sortable: false, align: "end" },
];

const accounts = ref([
  {
    id: 1,
    fullName: "นายสมชาย ใจดี",
    email: "somchai@customs.go.th",
    organization: "กรมศุลกากร",
    allowedApis: ["Get Factory Data", "Submit Request"],
    approvedAt: "2026-01-15",
    enabled: true,
  },
  {
    id: 2,
    fullName: "นางสาวมาลี รักไทย",
    email: "malee@dft.go.th",
    organization: "กรมการค้าต่างประเทศ",
    allowedApis: ["Get Factory Data"],
    approvedAt: "2026-02-03",
    enabled: true,
  },
  {
    id: 3,
    fullName: "นายวิชัย เพชรดี",
    email: "wichai@acfs.go.th",
    organization: "สำนักงานมาตรฐานสินค้าเกษตร",
    allowedApis: ["Update Certificate"],
    approvedAt: "2026-02-20",
    enabled: false,
  },
  {
    id: 4,
    fullName: "นางสุดา ทองแดง",
    email: "suda@kasetglobal.co.th",
    organization: "บริษัท เกษตรโกลบอล จำกัด",
    allowedApis: ["Submit Request", "Get Factory Data"],
    approvedAt: "2026-03-01",
    enabled: true,
  },
  {
    id: 5,
    fullName: "นายประสิทธิ์ เจริญ",
    email: "prasit@moc.go.th",
    organization: "กระทรวงพาณิชย์",
    allowedApis: ["Get Factory Data", "Submit Request", "Update Certificate"],
    approvedAt: "2026-03-10",
    enabled: true,
  },
  {
    id: 6,
    fullName: "นางสาวกัญญา ศรีสวัสดิ์",
    email: "kanya@ttc.co.th",
    organization: "บริษัท ไทยเทรด จำกัด",
    allowedApis: ["Get Factory Data"],
    approvedAt: "2026-03-22",
    enabled: false,
  },
]);

const filteredAccounts = computed(() =>
  accounts.value.filter((a) => {
    const s = accountSearch.value?.toLowerCase() ?? "";
    if (
      s &&
      !a.fullName.toLowerCase().includes(s) &&
      !a.organization.toLowerCase().includes(s)
    )
      return false;
    if (accountStatusFilter.value === "เปิดใช้งาน" && !a.enabled) return false;
    if (accountStatusFilter.value === "ปิดใช้งาน" && a.enabled) return false;
    if (
      accountApiFilter.value !== "ทั้งหมด" &&
      !a.allowedApis.includes(accountApiFilter.value)
    )
      return false;
    return true;
  }),
);

const editAccessDialog = ref(false);
const editingAccount = ref(null);
const accessFormApis = ref([]);
const accessFormEnabled = ref(true);

const toggleSnackbar = ref(false);
const toggleSnackbarColor = ref("success");
const toggleSnackbarText = ref("");

function openEditAccess(account) {
  editingAccount.value = account;
  accessFormApis.value = [...account.allowedApis];
  accessFormEnabled.value = account.enabled;
  editAccessDialog.value = true;
}
function saveAccess() {
  const idx = accounts.value.findIndex((a) => a.id === editingAccount.value.id);
  if (idx !== -1) {
    accounts.value[idx].allowedApis = [...accessFormApis.value];
    accounts.value[idx].enabled = accessFormEnabled.value;
  }
  editAccessDialog.value = false;
  showSnackbar("success", "บันทึกสิทธิ์เรียบร้อยแล้ว");
}
function onToggleAccount(account) {
  showSnackbar(
    account.enabled ? "success" : "error",
    account.enabled
      ? `เปิดใช้งาน ${account.fullName} เรียบร้อยแล้ว`
      : `ปิดใช้งาน ${account.fullName} เรียบร้อยแล้ว`,
  );
}
function showSnackbar(color, text) {
  toggleSnackbarColor.value = color;
  toggleSnackbarText.value = text;
  toggleSnackbar.value = true;
}

// ==================== Usage Logs ====================
const logFilter = reactive({
  api: "ทั้งหมด",
  status: "ทั้งหมด",
  dateFrom: "",
  dateTo: "",
});

const logHeaders = [
  { title: "เวลา", key: "timestamp", sortable: true },
  { title: "API Name", key: "apiName", sortable: true },
  { title: "Endpoint", key: "endpoint" },
  { title: "Method", key: "method", sortable: true },
  { title: "หน่วยงาน", key: "organization" },
  { title: "IP Address", key: "ip" },
  { title: "Status", key: "statusCode", sortable: true },
  { title: "Response Time", key: "responseTime", sortable: true },
];

const usageLogs = ref([
  {
    id: 1,
    timestamp: "2026-04-09 09:12:34",
    apiName: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    organization: "กรมวิชาการเกษตร",
    ip: "203.151.10.5",
    statusCode: 200,
    responseTime: 142,
  },
  {
    id: 2,
    timestamp: "2026-04-09 09:15:02",
    apiName: "Submit Request",
    endpoint: "/api/request",
    method: "POST",
    organization: "กรมการค้าต่างประเทศ",
    ip: "101.108.22.14",
    statusCode: 201,
    responseTime: 385,
  },
  {
    id: 3,
    timestamp: "2026-04-09 09:18:47",
    apiName: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    organization: "กรมวิชาการเกษตร",
    ip: "203.151.10.5",
    statusCode: 200,
    responseTime: 98,
  },
  {
    id: 4,
    timestamp: "2026-04-09 09:22:11",
    apiName: "Update Certificate",
    endpoint: "/api/certificate",
    method: "PUT",
    organization: "สำนักงานมาตรฐานสินค้าเกษตร",
    ip: "61.19.205.33",
    statusCode: 401,
    responseTime: 55,
  },
  {
    id: 5,
    timestamp: "2026-04-09 09:30:59",
    apiName: "Submit Request",
    endpoint: "/api/request",
    method: "POST",
    organization: "บริษัท เกษตรไทย จำกัด",
    ip: "171.100.45.22",
    statusCode: 400,
    responseTime: 210,
  },
  {
    id: 6,
    timestamp: "2026-04-09 09:45:03",
    apiName: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    organization: "กรมการค้าต่างประเทศ",
    ip: "101.108.22.14",
    statusCode: 200,
    responseTime: 115,
  },
  {
    id: 7,
    timestamp: "2026-04-09 10:02:28",
    apiName: "Update Certificate",
    endpoint: "/api/certificate",
    method: "PUT",
    organization: "สำนักงานมาตรฐานสินค้าเกษตร",
    ip: "61.19.205.33",
    statusCode: 200,
    responseTime: 276,
  },
  {
    id: 8,
    timestamp: "2026-04-09 10:15:44",
    apiName: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    organization: "กรมวิชาการเกษตร",
    ip: "203.151.10.5",
    statusCode: 500,
    responseTime: 1832,
  },
  {
    id: 9,
    timestamp: "2026-04-09 10:33:17",
    apiName: "Submit Request",
    endpoint: "/api/request",
    method: "POST",
    organization: "บริษัท เกษตรไทย จำกัด",
    ip: "171.100.45.22",
    statusCode: 201,
    responseTime: 402,
  },
  {
    id: 10,
    timestamp: "2026-04-09 10:50:05",
    apiName: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    organization: "กรมการค้าต่างประเทศ",
    ip: "101.108.22.14",
    statusCode: 200,
    responseTime: 133,
  },
  {
    id: 11,
    timestamp: "2026-04-09 11:05:39",
    apiName: "Update Certificate",
    endpoint: "/api/certificate",
    method: "PUT",
    organization: "สำนักงานมาตรฐานสินค้าเกษตร",
    ip: "61.19.205.33",
    statusCode: 403,
    responseTime: 67,
  },
  {
    id: 12,
    timestamp: "2026-04-09 11:22:51",
    apiName: "Submit Request",
    endpoint: "/api/request",
    method: "POST",
    organization: "กรมวิชาการเกษตร",
    ip: "203.151.10.6",
    statusCode: 201,
    responseTime: 318,
  },
  {
    id: 13,
    timestamp: "2026-04-09 11:40:00",
    apiName: "Get Factory Data",
    endpoint: "/api/factory",
    method: "GET",
    organization: "บริษัท เกษตรไทย จำกัด",
    ip: "171.100.45.23",
    statusCode: 200,
    responseTime: 89,
  },
  {
    id: 14,
    timestamp: "2026-04-09 11:55:12",
    apiName: "Update Certificate",
    endpoint: "/api/certificate",
    method: "PUT",
    organization: "กรมวิชาการเกษตร",
    ip: "203.151.10.5",
    statusCode: 200,
    responseTime: 244,
  },
  {
    id: 15,
    timestamp: "2026-04-09 12:10:33",
    apiName: "Submit Request",
    endpoint: "/api/request",
    method: "POST",
    organization: "กรมการค้าต่างประเทศ",
    ip: "101.108.22.14",
    statusCode: 500,
    responseTime: 2145,
  },
]);

const filteredLogs = computed(() =>
  usageLogs.value.filter((log) => {
    if (logFilter.api !== "ทั้งหมด" && log.apiName !== logFilter.api)
      return false;
    if (
      logFilter.status !== "ทั้งหมด" &&
      String(log.statusCode) !== logFilter.status
    )
      return false;
    if (logFilter.dateFrom && log.timestamp.split(" ")[0] < logFilter.dateFrom)
      return false;
    if (logFilter.dateTo && log.timestamp.split(" ")[0] > logFilter.dateTo)
      return false;
    return true;
  }),
);

const logStats = computed(() => {
  const logs = filteredLogs.value;
  return {
    total: logs.length,
    success: logs.filter((l) => l.statusCode >= 200 && l.statusCode < 300)
      .length,
    error: logs.filter((l) => l.statusCode >= 400).length,
    avgResponse: logs.length
      ? Math.round(logs.reduce((s, l) => s + l.responseTime, 0) / logs.length)
      : 0,
  };
});

function statusCodeColor(code) {
  if (code >= 200 && code < 300) return "success";
  if (code === 400) return "warning";
  if (code === 401 || code === 403) return "orange";
  return "error";
}

// ==================== Request Service ====================
const requestDialog = ref(false);
const requestSuccessDialog = ref(false);
const reqForm = reactive({
  fullName: "",
  organization: "",
  phone: "",
  email: "",
  selectedApis: [],
  duration: "",
  connType: "REST API",
  purpose: "",
  attachments: [],
});

function openRequest() {
  Object.assign(reqForm, {
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    selectedApis: [],
    duration: "",
    connType: "REST API",
    purpose: "",
    attachments: [],
  });
  requestDialog.value = true;
}
function closeRequestDialog() {
  requestDialog.value = false;
}
function submitRequest() {
  requestDialog.value = false;
  requestSuccessDialog.value = true;
}
</script>

<style scoped>
.delete-ring,
.success-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-ring {
  background: rgba(var(--v-theme-error), 0.1);
}
.success-ring {
  background: rgba(var(--v-theme-success), 0.1);
}
.field-label,
.filter-label {
  font-size: 0.8125rem;
  font-weight: 500;
  margin-bottom: 4px;
}
.field-label-en,
.filter-label-en {
  font-size: 0.7rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.6;
  font-weight: 400;
}
.req {
  color: rgb(var(--v-theme-error));
}
</style>
