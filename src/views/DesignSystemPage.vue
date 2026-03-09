<template>
  <div>

    <!-- ════════════════════════════════
         SIDEBAR NAV
    ════════════════════════════════ -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      :color="isDark ? '#1e1e1e' : 'white'"
      :style="isDark ? 'border-right:1px solid #2a2a2a' : 'border-right:1px solid #E0E0E0'"
    >
      <!-- Brand / Logo -->
      <v-list-item nav class="py-4 px-4">
        <template v-slot:prepend>
          <div class="d-flex align-center justify-center rounded-lg mr-3"
               :style="`width:40px;height:44px;flex-shrink:0;background:${isDark ? 'rgba(76,175,110,0.15)' : '#E9F7EF'}`">
            <v-icon icon="fas fa-leaf" color="primary" size="20" />
          </div>
        </template>
        <v-list-item-title
          class="font-weight-medium"
          :style="`font-size:14px;line-height:1.4;color:${isDark ? '#EEEEEE' : '#424242'}`"
        >
          ระบบรับรองแหล่งผลิต GAP พืช
        </v-list-item-title>
        <v-list-item-subtitle :style="`font-size:10px;color:${isDark ? '#757575' : '#616161'}`">
          กรมวิชาการเกษตร
        </v-list-item-subtitle>
        <template v-slot:append>
          <v-btn
            :icon="rail ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"
            variant="text"
            :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'"
            size="small"
            @click="rail = !rail"
          />
        </template>
      </v-list-item>

      <!-- User Card -->
      <div v-if="!rail" class="px-4 mb-2">
        <div
          class="rounded-lg pa-3 d-flex align-center ga-2"
          :style="isDark
            ? 'background:rgba(76,175,110,0.1);border:1px solid rgba(76,175,110,0.35)'
            : 'background:#E9F7EF;border:1px solid #4CAF6E'"
        >
          <v-avatar color="primary" size="32">
            <v-icon icon="fas fa-user" size="16" color="white" />
          </v-avatar>
          <div class="flex-grow-1 overflow-hidden">
            <div
              class="text-truncate font-weight-medium"
              :style="`font-size:14px;color:${isDark ? '#4CAF6E' : '#357E4E'}`"
            >Admin GAP</div>
            <div :style="`font-size:11px;color:${isDark ? '#616161' : '#757575'}`">เลขทะเบียน : 19903004</div>
          </div>
          <v-icon icon="fas fa-chevron-down" size="12" color="primary" />
        </div>
      </div>

      <v-divider class="mx-3" :color="isDark ? '#2a2a2a' : '#E0E0E0'" />

      <v-list density="compact" nav class="mt-1 px-2">

        <!-- DESIGN TOKENS -->
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">Design Tokens</div>
        <v-list-item
          v-for="section in navSections.slice(0, 2)"
          :key="section.id"
          :prepend-icon="section.icon"
          :title="section.title"
          :value="section.id"
          :active="activeSection === section.id"
          :active-color="isDark ? '#4CAF6E' : '#357E4E'"
          :color="isDark ? '#9E9E9E' : '#616161'"
          rounded="lg"
          class="mb-1"
          :style="activeSection === section.id
            ? (isDark ? 'background:rgba(76,175,110,0.15)' : 'background:#E9F7EF')
            : ''"
          @click="scrollTo(section.id)"
        />

        <!-- COMPONENTS -->
        <v-divider class="mx-2 my-2" :color="isDark ? '#2a2a2a' : '#E0E0E0'" />
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">Components</div>
        <v-list-item
          v-for="section in navSections.slice(2, 9)"
          :key="section.id"
          :prepend-icon="section.icon"
          :title="section.title"
          :value="section.id"
          :active="activeSection === section.id"
          :active-color="isDark ? '#4CAF6E' : '#357E4E'"
          :color="isDark ? '#9E9E9E' : '#616161'"
          rounded="lg"
          class="mb-1"
          :style="activeSection === section.id
            ? (isDark ? 'background:rgba(76,175,110,0.15)' : 'background:#E9F7EF')
            : ''"
          @click="scrollTo(section.id)"
        />

        <!-- FEEDBACK & MORE -->
        <v-divider class="mx-2 my-2" :color="isDark ? '#2a2a2a' : '#E0E0E0'" />
        <div v-if="!rail" class="sidebar-group-label text-medium-emphasis">Feedback & More</div>
        <v-list-item
          v-for="section in navSections.slice(9)"
          :key="section.id"
          :prepend-icon="section.icon"
          :title="section.title"
          :value="section.id"
          :active="activeSection === section.id"
          :active-color="isDark ? '#4CAF6E' : '#357E4E'"
          :color="isDark ? '#9E9E9E' : '#616161'"
          rounded="lg"
          class="mb-1"
          :style="activeSection === section.id
            ? (isDark ? 'background:rgba(76,175,110,0.15)' : 'background:#E9F7EF')
            : ''"
          @click="scrollTo(section.id)"
        />

      </v-list>
    </v-navigation-drawer>

    <!-- ════════════════════════════════
         APP BAR
    ════════════════════════════════ -->
    <v-app-bar
      flat
      height="70"
      :style="appBarStyle"
    >
      <!-- Hamburger -->
      <v-btn
        icon="fas fa-bars"
        variant="text"
        size="small"
        class="ml-2"
        @click="rail = !rail"
      />

      <!-- Search -->
      <div class="d-none d-sm-block ml-3" style="width:210px">
        <v-text-field
          placeholder="ค้นหา..."
          prepend-inner-icon="fas fa-magnifying-glass"
          variant="solo-filled"
          density="compact"
          hide-details
          flat
          rounded="lg"
          bg-color="surface-variant"
        />
      </div>

      <v-spacer />

      <div class="d-flex align-center ga-1 mr-3">
        <!-- Theme toggle -->
        <v-tooltip :text="isDark ? 'Light Mode' : 'Dark Mode'" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="isDark ? 'fas fa-sun' : 'fas fa-moon'"
              variant="text"
              size="small"
              @click="toggleTheme"
            />
          </template>
        </v-tooltip>

        <!-- Notification bell -->
        <div class="position-relative mr-1">
          <v-btn variant="text" size="small" icon>
            <v-badge color="error" content="4" floating>
              <v-icon icon="fas fa-bell" size="20" color="primary" />
            </v-badge>
          </v-btn>
        </div>

        <!-- User chip (Figma style) -->
        <v-chip
          variant="outlined"
          color="primary"
          class="mr-3"
          :style="isDark ? '' : 'background:#E9F7EF;'"
          prepend-icon="fas fa-user"
        >
          นิธิพร เทิบจันทึก
          <v-icon icon="fas fa-chevron-down" size="12" class="ml-1" />
        </v-chip>
      </div>
    </v-app-bar>

    <!-- ════════════════════════════════
         MAIN CONTENT
    ════════════════════════════════ -->
    <v-main class="bg-background">
      <v-container fluid class="pa-5 pa-md-7" style="max-width: 1280px">

        <!-- Page Header -->
        <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6 page-header">
          <div>
            <!-- Breadcrumb -->
            <div class="d-flex align-center ga-1 mb-2">
              <span class="text-body-2 text-medium-emphasis">ระบบ GAP</span>
              <v-icon icon="fas fa-chevron-right" size="10" class="text-medium-emphasis mx-1" />
              <span class="text-body-2 font-weight-medium text-primary">Design System</span>
            </div>
            <h1 class="text-h4 font-weight-medium mb-1">GAP Design System</h1>
            <p class="text-body-1 text-medium-emphasis mb-0">คู่มือ UI components และ design tokens สำหรับระบบรับรองแหล่งผลิต GAP พืช</p>
          </div>
          <div class="d-flex flex-wrap ga-2">
            <v-chip size="small" color="primary" variant="tonal" prepend-icon="fab fa-vuejs">Vue 3</v-chip>
            <v-chip size="small" color="info" variant="tonal" prepend-icon="fas fa-puzzle-piece">Vuetify 3</v-chip>
            <v-chip size="small" color="secondary" variant="tonal" prepend-icon="fas fa-code">TypeScript</v-chip>
            <v-chip size="small" color="success" variant="tonal" prepend-icon="fas fa-database">Pinia</v-chip>
          </div>
        </div>

        <!-- Quick Stats -->
        <v-row class="mb-2">
          <v-col v-for="card in summaryCards" :key="card.title" cols="12" sm="6" md="3">
            <v-card>
              <v-card-text class="pa-5">
                <div class="d-flex align-start">
                  <div class="flex-grow-1">
                    <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">{{ card.title }}</div>
                    <div class="text-h5 font-weight-bold mb-2">{{ card.value }}</div>
                    <div class="d-flex align-center ga-1">
                      <v-chip
                        :color="card.trend >= 0 ? 'success' : 'error'"
                        size="x-small"
                        variant="tonal"
                        class="px-1"
                      >
                        <v-icon start :icon="card.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" size="9" />
                        {{ Math.abs(card.trend) }}%
                      </v-chip>
                      <span class="text-caption text-medium-emphasis">vs เดือนที่แล้ว</span>
                    </div>
                  </div>
                  <div
                    class="stat-icon-box ml-3"
                    :style="`background:rgba(var(--v-theme-${card.color}),0.12)`"
                  >
                    <v-icon :icon="card.icon" :color="card.color" size="22" />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- ─────────────────────────────────
             1. COLORS
        ───────────────────────────────── -->
        <section :id="navSections[0].id" class="mb-10">
          <DSectionTitle :icon="navSections[0].icon" :title="navSections[0].title" />

          <DSubTitle title="Theme Colors" />
          <v-row class="mb-5">
            <v-col v-for="c in themeColors" :key="c.key" cols="6" sm="4" md="3" lg="2">
              <v-card>
                <div :style="`height:60px;border-radius:12px 12px 0 0;background:rgb(var(--v-theme-${c.key}))`" />
                <v-card-text class="pa-3">
                  <div class="text-caption font-weight-bold text-capitalize">{{ c.label }}</div>
                  <code class="text-caption text-medium-emphasis" style="font-size:10px;background:transparent">{{ c.hex }}</code>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <DSubTitle title="Status Colors" />
          <v-row>
            <v-col v-for="s in statusColors" :key="s.status" cols="6" sm="4" md="3" lg="2">
              <v-card>
                <div :class="`bg-${s.vuetify}`" style="height:44px;border-radius:12px 12px 0 0" />
                <v-card-text class="pa-3">
                  <div class="text-caption font-weight-bold" style="font-size:10px">{{ s.label }}</div>
                  <div class="text-caption text-medium-emphasis" style="font-size:10px">{{ s.status }}</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             2. TYPOGRAPHY
        ───────────────────────────────── -->
        <section :id="navSections[1].id" class="mb-10">
          <DSectionTitle :icon="navSections[1].icon" :title="navSections[1].title" />
          <v-card>
            <v-card-text class="pa-0">
              <template v-for="(t, i) in typographyList" :key="t.class">
                <div class="d-flex align-center px-5 py-4 ga-4 flex-wrap">
                  <div style="min-width:280px;flex:1">
                    <div :class="t.class">{{ t.sample }}</div>
                  </div>
                  <div class="d-flex align-center ga-2 flex-shrink-0">
                    <code class="text-caption px-2 py-1 rounded-lg"
                          style="background:rgba(var(--v-theme-surface-variant),1);font-size:11px;font-family:monospace">
                      .{{ t.class }}
                    </code>
                    <span class="text-caption text-medium-emphasis">{{ t.desc }}</span>
                  </div>
                </div>
                <v-divider v-if="i < typographyList.length - 1" />
              </template>
            </v-card-text>
          </v-card>
        </section>

        <!-- ─────────────────────────────────
             3. BUTTONS
        ───────────────────────────────── -->
        <section :id="navSections[2].id" class="mb-10">
          <DSectionTitle :icon="navSections[2].icon" :title="navSections[2].title" />

          <!-- Variants -->
          <DSubTitle title="Variants" />
          <v-card class="mb-4">
            <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
              <v-btn color="primary" variant="elevated">elevated</v-btn>
              <v-btn color="primary" variant="tonal">tonal</v-btn>
              <v-btn color="primary" variant="outlined">outlined</v-btn>
              <v-btn color="primary" variant="text">text</v-btn>
              <v-btn color="primary" variant="plain">plain</v-btn>
              <v-btn color="primary" variant="flat">flat</v-btn>
            </v-card-text>
          </v-card>

          <!-- Semantic Colors -->
          <DSubTitle title="Semantic Colors" />
          <v-card class="mb-4">
            <v-card-text class="d-flex flex-wrap ga-3 align-center pa-5">
              <v-btn color="primary">primary</v-btn>
              <v-btn color="secondary">secondary</v-btn>
              <v-btn color="success">success</v-btn>
              <v-btn color="warning">warning</v-btn>
              <v-btn color="error">error</v-btn>
              <v-btn color="info">info</v-btn>
              <v-btn color="grey" variant="tonal">neutral</v-btn>
            </v-card-text>
          </v-card>

          <!-- Sizes & States -->
          <DSubTitle title="Sizes & States" />
          <v-card class="mb-4">
            <v-card-text>
              <div class="d-flex flex-wrap ga-3 align-center mb-3">
                <v-btn color="primary" size="x-small">xs</v-btn>
                <v-btn color="primary" size="small">small</v-btn>
                <v-btn color="primary" size="default">default</v-btn>
                <v-btn color="primary" size="large">large</v-btn>
                <v-btn color="primary" size="x-large">xl</v-btn>
              </div>
              <div class="d-flex flex-wrap ga-3 align-center">
                <v-btn color="primary" :loading="true">loading</v-btn>
                <v-btn color="primary" disabled>disabled</v-btn>
                <v-btn icon="fas fa-eye" color="info" variant="text" />
                <v-btn icon="fas fa-pencil" color="primary" variant="text" />
                <v-btn icon="fas fa-trash" color="error" variant="text" />
              </div>
            </v-card-text>
          </v-card>

          <!-- With Icons -->
          <DSubTitle title="With Icons" />
          <v-card>
            <v-card-text class="d-flex flex-wrap ga-3 align-center">
              <v-btn color="primary" prepend-icon="fas fa-plus">ยื่นคำขอใหม่</v-btn>
              <v-btn color="secondary" prepend-icon="fas fa-floppy-disk" variant="tonal">บันทึกร่าง</v-btn>
              <v-btn color="info" prepend-icon="fas fa-paper-plane" variant="tonal">ยื่นคำขอ</v-btn>
              <v-btn color="error" prepend-icon="fas fa-trash" variant="outlined">ยกเลิก</v-btn>
              <v-btn color="info" prepend-icon="fas fa-download" variant="tonal">ดาวน์โหลด PDF</v-btn>
              <v-btn color="primary" prepend-icon="fas fa-calendar-check" variant="outlined">นัดตรวจ</v-btn>
            </v-card-text>
          </v-card>
        </section>

        <!-- ─────────────────────────────────
             4. STATUS CHIPS
        ───────────────────────────────── -->
        <section :id="navSections[3].id" class="mb-10">
          <DSectionTitle :icon="navSections[3].icon" :title="navSections[3].title" />

          <DSubTitle title="Application Status — ทุกสถานะ" />
          <v-card class="mb-4">
            <v-card-text>
              <div class="d-flex flex-wrap ga-2">
                <v-chip
                  v-for="s in allStatuses"
                  :key="s.status"
                  :color="s.color"
                  size="small"
                  label
                >
                  <v-icon start :icon="s.icon" size="14" />
                  {{ s.label }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <DSubTitle title="Chip Variants & Sizes" />
          <v-card>
            <v-card-text>
              <div class="d-flex flex-wrap ga-2 mb-4">
                <v-chip color="primary" variant="elevated">elevated</v-chip>
                <v-chip color="primary" variant="tonal">tonal (default)</v-chip>
                <v-chip color="primary" variant="outlined">outlined</v-chip>
                <v-chip color="primary" variant="text">text</v-chip>
              </div>
              <div class="d-flex flex-wrap ga-2 align-center">
                <v-chip color="primary" size="x-small">x-small</v-chip>
                <v-chip color="primary" size="small">small</v-chip>
                <v-chip color="primary" size="default">default</v-chip>
                <v-chip color="primary" size="large">large</v-chip>
                <v-chip color="error" closable>closable</v-chip>
                <v-chip color="info" prepend-icon="fas fa-user">with icon</v-chip>
              </div>
            </v-card-text>
          </v-card>
        </section>

        <!-- ─────────────────────────────────
             5. FORM INPUTS
        ───────────────────────────────── -->
        <section :id="navSections[4].id" class="mb-10">
          <DSectionTitle :icon="navSections[4].icon" :title="navSections[4].title" />

          <v-form ref="_demoFormRef">

            <!-- ══ หมวด 1: ข้อมูลผู้ยื่นคำขอ ══ -->
            <v-card elevation="0" border rounded="xl" class="mb-4">
              <div class="d-flex align-center ga-2 px-4 py-3 border-b">
                <v-icon size="15" color="primary">fas fa-user</v-icon>
                <span class="text-subtitle-2 font-weight-bold">หมวดที่ 1 · ข้อมูลผู้ยื่นคำขอ</span>
                <v-spacer />
                <v-icon size="10" color="error" class="mr-1">fas fa-asterisk</v-icon>
                <span class="text-caption text-medium-emphasis">จำเป็นต้องกรอก</span>
              </div>
              <v-card-text class="pt-5">
                <v-row dense>
                  <v-col cols="12" sm="2">
                    <div class="field-label">คำนำหน้า <span class="req">*</span></div>
                    <v-select
                      v-model="form.namePrefix"
                      :items="['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <div class="field-label">ชื่อ <span class="req">*</span></div>
                    <v-text-field
                      v-model="form.firstName"
                      placeholder="ชื่อจริง"
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="5">
                    <div class="field-label">นามสกุล <span class="req">*</span></div>
                    <v-text-field
                      v-model="form.lastName"
                      placeholder="นามสกุล"
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">เลขบัตรประชาชน <span class="req">*</span></div>
                    <v-text-field
                      v-model="form.idCard"
                      placeholder="X-XXXX-XXXXX-XX-X"
                      prepend-inner-icon="fas fa-id-card"
                      :rules="[rules.required, rules.idCard]"
                      maxlength="13"
                      counter
                      hint="ตัวเลข 13 หลัก ไม่ใส่ขีด"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">เบอร์โทรศัพท์ <span class="req">*</span></div>
                    <v-text-field
                      v-model="form.phone"
                      placeholder="0XX-XXX-XXXX"
                      prepend-inner-icon="fas fa-phone"
                      :rules="[rules.required, rules.phone]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">อีเมล</div>
                    <v-text-field
                      v-model="form.email"
                      placeholder="example@email.com"
                      prepend-inner-icon="fas fa-envelope"
                      hint="ถ้ามี — ใช้รับการแจ้งเตือน"
                      persistent-hint
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ══ หมวด 2: ที่อยู่ที่ติดต่อ ══ -->
            <v-card elevation="0" border rounded="xl" class="mb-4">
              <div class="d-flex align-center ga-2 px-4 py-3 border-b">
                <v-icon size="15" color="primary">fas fa-location-dot</v-icon>
                <span class="text-subtitle-2 font-weight-bold">หมวดที่ 2 · ที่อยู่ที่ติดต่อ</span>
              </div>
              <v-card-text class="pt-5">
                <v-row dense>
                  <v-col cols="12" sm="9">
                    <div class="field-label">ที่อยู่ <span class="req">*</span></div>
                    <v-textarea
                      v-model="form.address"
                      placeholder="บ้านเลขที่ / หมู่ที่ / ซอย / ถนน"
                      prepend-inner-icon="fas fa-house"
                      rows="2"
                      auto-grow
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="field-label">รหัสไปรษณีย์</div>
                    <v-text-field
                      v-model="form.postalCode"
                      placeholder="XXXXX"
                      prepend-inner-icon="fas fa-map-pin"
                      maxlength="5"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">จังหวัด <span class="req">*</span></div>
                    <v-select
                      v-model="form.province"
                      :items="provinces"
                      prepend-inner-icon="fas fa-map"
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">อำเภอ / เขต <span class="req">*</span></div>
                    <v-select
                      v-model="form.district"
                      :items="['อำเภอเมือง', 'อำเภอปากช่อง', 'อำเภอโชคชัย', 'อำเภอสีคิ้ว']"
                      prepend-inner-icon="fas fa-city"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">ตำบล / แขวง <span class="req">*</span></div>
                    <v-select
                      v-model="form.subDistrict"
                      :items="['ตำบลในเมือง', 'ตำบลโพธิ์กลาง', 'ตำบลหนองไข่น้ำ']"
                      prepend-inner-icon="fas fa-map-pin"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ══ หมวด 3: ข้อมูลแปลงและการผลิต ══ -->
            <v-card elevation="0" border rounded="xl" class="mb-4">
              <div class="d-flex align-center ga-2 px-4 py-3 border-b">
                <v-icon size="15" color="primary">fas fa-seedling</v-icon>
                <span class="text-subtitle-2 font-weight-bold">หมวดที่ 3 · ข้อมูลแปลงและการผลิต</span>
              </div>
              <v-card-text class="pt-5">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <div class="field-label">ชนิดพืช <span class="req">*</span></div>
                    <v-select
                      v-model="form.cropTypes"
                      :items="cropTypes"
                      prepend-inner-icon="fas fa-seedling"
                      multiple chips closable-chips
                      :rules="[rules.required]"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-label">ผู้ตรวจประเมิน</div>
                    <v-autocomplete
                      v-model="form.inspector"
                      :items="inspectors"
                      prepend-inner-icon="fas fa-user-check"
                      clearable
                      hide-details="auto"
                    />
                  </v-col>

                  <!-- Sliders -->
                  <v-col cols="12" sm="6" class="mt-2">
                    <div class="d-flex align-center justify-space-between mb-1">
                      <span class="text-caption text-medium-emphasis">พื้นที่แปลงปลูก (ไร่)</span>
                      <v-text-field
                        v-model.number="form.area"
                        density="compact"
                        variant="outlined"
                        style="max-width:90px"
                        type="number"
                        suffix="ไร่"
                        hide-details
                        :min="0" :max="100"
                      />
                    </div>
                    <v-slider
                      v-model="form.area"
                      color="primary"
                      track-color="surface-variant"
                      :min="0" :max="100" :step="0.5"
                      thumb-label
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" sm="6" class="mt-2">
                    <div class="text-caption text-medium-emphasis mb-1">
                      ระดับความสูง (เมตร) &nbsp;
                      <strong>{{ form.elevRange[0] }}</strong> – <strong>{{ form.elevRange[1] }}</strong> ม.
                    </div>
                    <v-range-slider
                      v-model="form.elevRange"
                      color="info"
                      track-color="surface-variant"
                      :min="0" :max="2000" :step="50"
                      thumb-label
                      hide-details
                      class="mt-2"
                    />
                  </v-col>

                  <v-col cols="12"><v-divider class="my-2" /></v-col>

                  <!-- Radio / Switch / Checkbox -->
                  <v-col cols="12" sm="4">
                    <div class="field-label">ประเภทคำขอ</div>
                    <div class="rounded-lg pa-3" :style="isDark ? 'background:#272727' : 'background:#F0F0F0'">
                      <v-radio-group v-model="form.appType" color="primary" density="compact" hide-details>
                        <v-radio label="รายเดี่ยว" value="single" />
                        <v-radio label="รายกลุ่ม" value="group" />
                        <v-radio label="ต่ออายุ" value="renew" />
                      </v-radio-group>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">สถานะการผลิต</div>
                    <div class="rounded-lg pa-3" :style="isDark ? 'background:#272727' : 'background:#F0F0F0'">
                      <v-switch
                        v-model="form.organic"
                        label="เกษตรอินทรีย์"
                        color="primary"
                        base-color="grey-darken-1"
                        inset
                        density="compact"
                        hide-details
                        class="mb-2"
                      />
                      <v-switch
                        v-model="form.group"
                        label="ยื่นคำขอรายกลุ่ม"
                        color="info"
                        base-color="grey-darken-1"
                        inset
                        density="compact"
                        hide-details
                      />
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">ข้อกำหนด GAP</div>
                    <div class="rounded-lg pa-3" :style="isDark ? 'background:#272727' : 'background:#F0F0F0'">
                      <v-checkbox v-model="form.water"    label="มีแหล่งน้ำในพื้นที่"  color="primary" density="compact" hide-details class="mb-1" />
                      <v-checkbox v-model="form.record"   label="มีการบันทึกการผลิต"  color="primary" density="compact" hide-details class="mb-1" />
                      <v-checkbox v-model="form.chemical" label="บันทึกการใช้สารเคมี" color="warning" density="compact" hide-details />
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ══ หมวด 4: เอกสารและหลักฐาน ══ -->
            <v-card elevation="0" border rounded="xl" class="mb-4">
              <div class="d-flex align-center ga-2 px-4 py-3 border-b">
                <v-icon size="15" color="primary">fas fa-paperclip</v-icon>
                <span class="text-subtitle-2 font-weight-bold">หมวดที่ 4 · เอกสารและหลักฐาน</span>
                <v-spacer />
                <v-chip size="x-small" variant="tonal" color="warning">ไม่เกินไฟล์ละ 10 MB</v-chip>
              </div>
              <v-card-text class="pt-5">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <div class="field-label">เอกสารประกอบ</div>
                    <v-file-input
                      v-model="form.docs"
                      prepend-icon="fas fa-paperclip"
                      accept=".pdf,.doc,.docx"
                      multiple show-size chips
                      hint="สำเนาโฉนด, ผลวิเคราะห์น้ำ · รองรับ PDF, DOC"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-label">รูปภาพแปลงปลูก</div>
                    <v-file-input
                      v-model="form.photos"
                      prepend-icon="fas fa-camera"
                      accept="image/*"
                      multiple show-size chips
                      hint="JPG, PNG · ความละเอียดไม่ต่ำกว่า 1 MB"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12">
                    <div class="field-label">แท็กเพิ่มเติม</div>
                    <v-combobox
                      v-model="form.tags"
                      :items="suggestedTags"
                      prepend-inner-icon="fas fa-tags"
                      multiple chips closable-chips
                      hint="พิมพ์แล้ว Enter เพื่อเพิ่มแท็กใหม่"
                      persistent-hint
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ══ Field States ══ -->
            <v-card elevation="0" border rounded="xl" class="mb-4">
              <div class="d-flex align-center ga-2 px-4 py-3 border-b">
                <v-icon size="15" color="grey">fas fa-circle-info</v-icon>
                <span class="text-subtitle-2 font-weight-bold">Field States</span>
              </div>
              <v-card-text class="pt-5">
                <v-row dense>
                  <v-col cols="12" sm="4">
                    <div class="field-label">ปกติ (Normal)</div>
                    <v-text-field
                      placeholder="กรอกข้อมูล..."
                      hint="helper text"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">มีข้อมูล (Filled)</div>
                    <v-text-field
                      model-value="ข้อมูลที่กรอกไว้แล้ว"
                      hint="filled state"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">อ่านอย่างเดียว (Read-only)</div>
                    <v-text-field
                      model-value="อ่านได้อย่างเดียว"
                      readonly
                      hint="readonly state"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">ปิดใช้งาน (Disabled)</div>
                    <v-text-field
                      model-value="ไม่สามารถแก้ไขได้"
                      prepend-inner-icon="fas fa-lock"
                      disabled
                      hint="disabled state"
                      persistent-hint
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">บังคับกรอก (Error) <span class="req">*</span></div>
                    <v-text-field
                      :rules="[rules.required]"
                      model-value=""
                      hint="required · error state"
                      persistent-hint
                      validate-on="input"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="field-label">ผ่านการตรวจสอบ (Success)</div>
                    <v-text-field
                      model-value="ข้อมูลถูกต้องสมบูรณ์"
                      prepend-inner-icon="fas fa-circle-check"
                      color="success"
                      hint="success state"
                      persistent-hint
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- ══ Form Actions ══ -->
            <v-card elevation="0" border rounded="lg" color="surface-variant">
              <v-card-text class="d-flex align-center flex-wrap ga-3 py-3">
                <v-icon size="14" color="grey">fas fa-circle-info</v-icon>
                <span class="text-caption text-medium-emphasis flex-grow-1">
                  กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนยื่นคำขอ · ฟิลด์ที่มี * จำเป็นต้องกรอก
                </span>
                <v-btn variant="text" color="grey-darken-1" size="small">ล้างข้อมูล</v-btn>
                <v-btn variant="outlined" color="grey-darken-2" prepend-icon="fas fa-floppy-disk" size="small">
                  บันทึกร่าง
                </v-btn>
                <v-btn color="primary" prepend-icon="fas fa-paper-plane" size="small">
                  ยื่นคำขอ
                </v-btn>
              </v-card-text>
            </v-card>

          </v-form>
        </section>

        <!-- ─────────────────────────────────
             6. CARDS
        ───────────────────────────────── -->
        <section :id="navSections[5].id" class="mb-10">
          <DSectionTitle :icon="navSections[5].icon" :title="navSections[5].title" />

          <DSubTitle title="Stat Cards (Vuexy-style)" />
          <v-row class="mb-4">
            <v-col v-for="card in summaryCards" :key="card.title" cols="12" sm="6" md="3">
              <v-card>
                <v-card-text class="pa-5">
                  <div class="d-flex align-start">
                    <div class="flex-grow-1">
                      <div class="text-caption text-medium-emphasis mb-1 font-weight-medium">{{ card.title }}</div>
                      <div class="text-h5 font-weight-bold mb-2">{{ card.value }}</div>
                      <div class="d-flex align-center ga-1">
                        <v-chip
                          :color="card.trend >= 0 ? 'success' : 'error'"
                          size="x-small"
                          variant="tonal"
                          class="px-1"
                        >
                          <v-icon start :icon="card.trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" size="9" />
                          {{ Math.abs(card.trend) }}%
                        </v-chip>
                        <span class="text-caption text-medium-emphasis">vs เดือนที่แล้ว</span>
                      </div>
                    </div>
                    <div
                      class="stat-icon-box ml-3"
                      :style="`background:rgba(var(--v-theme-${card.color}),0.12)`"
                    >
                      <v-icon :icon="card.icon" :color="card.color" size="22" />
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <DSubTitle title="Content Cards" />
          <v-row>
            <v-col cols="12" md="4">
              <v-card rounded="lg" height="100%">
                <v-card-title>
                  <v-icon start color="primary">fas fa-file-lines</v-icon>
                  รายละเอียดคำขอ
                </v-card-title>
                <v-card-subtitle>GAP-2567-001234</v-card-subtitle>
                <v-divider />
                <v-card-text>
                  <v-list density="compact">
                    <v-list-item prepend-icon="fas fa-user"      title="นาย สมชาย ใจดี"     subtitle="เกษตรกร" />
                    <v-list-item prepend-icon="fas fa-seedling"       title="ข้าวหอมมะลิ"        subtitle="ชนิดพืช" />
                    <v-list-item prepend-icon="fas fa-location-dot"   title="จ.นครราชสีมา"       subtitle="จังหวัด" />
                    <v-list-item prepend-icon="fas fa-ruler-combined" title="12.5 ไร่"            subtitle="พื้นที่" />
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-chip color="orange" size="small" label>
                    <v-icon start size="13">fas fa-file-magnifying-glass</v-icon>ตรวจเอกสาร
                  </v-chip>
                  <v-spacer />
                  <v-btn variant="text" color="info" size="small" prepend-icon="fas fa-eye">ดู</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card variant="outlined" rounded="lg" hover height="100%">
                <v-card-title>
                  <v-icon start color="teal">fas fa-certificate</v-icon>
                  ใบรับรอง GAP
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12">
                      <div class="text-caption text-grey-darken-1">เลขที่ใบรับรอง</div>
                      <div class="text-body-2 font-weight-bold">GAP-C-2567-0089</div>
                    </v-col>
                    <v-col cols="12">
                      <div class="text-caption text-grey-darken-1">เกษตรกร</div>
                      <div class="text-body-2">นาง มาลี เกษตรกิจ</div>
                    </v-col>
                    <v-col cols="12">
                      <div class="text-caption text-grey-darken-1">วันหมดอายุ</div>
                      <div class="text-body-2 font-weight-bold text-warning">
                        <v-icon size="14">fas fa-clock</v-icon> 28 มี.ค. 2568
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-btn variant="tonal" color="info" prepend-icon="fas fa-download" size="small">PDF</v-btn>
                  <v-btn variant="text" color="primary" prepend-icon="fas fa-eye" size="small">รายละเอียด</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card rounded="lg" height="100%">
                <v-card-title>
                  <v-icon start color="indigo">fas fa-clipboard-check</v-icon>
                  ผลตรวจประเมิน
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <div class="text-center py-2">
                    <v-progress-circular
                      :model-value="87"
                      color="success"
                      size="80"
                      width="8"
                    >
                      <span class="text-h6 font-weight-bold text-success">87%</span>
                    </v-progress-circular>
                    <div class="text-body-2 mt-3 font-weight-bold">ผ่านเกณฑ์</div>
                    <div class="text-caption text-grey-darken-1">7 / 8 หมวด</div>
                  </div>
                  <v-progress-linear
                    model-value="87"
                    color="success"
                    rounded
                    height="6"
                    class="mt-2"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-chip color="success" size="small" label>
                    <v-icon start size="13">fas fa-circle-check</v-icon>อนุมัติ
                  </v-chip>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             7. DATA TABLE
        ───────────────────────────────── -->
        <section :id="navSections[6].id" class="mb-10">
          <DSectionTitle :icon="navSections[6].icon" :title="navSections[6].title" />
          <v-card>
            <div class="d-flex align-center flex-wrap ga-3 pa-5" style="border-bottom:1px solid rgb(var(--v-theme-border))">
              <div class="d-flex align-center ga-2">
                <div class="rounded-lg d-flex align-center justify-center"
                     style="width:34px;height:34px;background:rgba(var(--v-theme-primary),0.10)">
                  <v-icon color="primary" size="17">fas fa-file-lines</v-icon>
                </div>
                <div>
                  <div class="text-subtitle-2 font-weight-bold">รายการคำขอ GAP</div>
                  <div class="text-caption text-medium-emphasis">{{ tableItems.length }} รายการ</div>
                </div>
              </div>
              <v-spacer />
              <v-text-field
                v-model="tableSearch"
                prepend-inner-icon="fas fa-magnifying-glass"
                placeholder="ค้นหา..."
                density="compact"
                variant="outlined"
                hide-details
                style="max-width:220px"
              />
              <v-btn color="primary" prepend-icon="fas fa-plus" size="small">
                ยื่นคำขอใหม่
              </v-btn>
            </div>
            <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              :search="tableSearch"
              hover
              density="comfortable"
            >
              <template v-slot:item.status="{ value }">
                <v-chip :color="statusColorMap[value]" size="small" label>
                  <v-icon start :icon="statusIconMap[value]" size="13" />
                  {{ statusLabelMap[value] }}
                </v-chip>
              </template>
              <template v-slot:item.actions>
                <v-btn icon="fas fa-eye"    size="small" variant="text" color="info" />
                <v-btn icon="fas fa-pencil" size="small" variant="text" color="primary" />
                <v-btn icon="fas fa-trash" size="small" variant="text" color="error" />
              </template>
            </v-data-table>
          </v-card>
        </section>

        <!-- ─────────────────────────────────
             8. ALERTS
        ───────────────────────────────── -->
        <section :id="navSections[7].id" class="mb-10">
          <DSectionTitle :icon="navSections[7].icon" :title="navSections[7].title" />
          <v-row>
            <v-col cols="12" md="6">
              <DSubTitle title="Alerts" />
              <div class="d-flex flex-column ga-3">
                <v-alert type="success" color="success" variant="tonal" rounded="lg" border="start"
                  title="ยื่นคำขอสำเร็จ"
                  text="คำขอ GAP-2567-001234 ถูกส่งเรียบร้อยแล้ว เจ้าหน้าที่จะตรวจสอบภายใน 3-5 วันทำการ"
                />
                <v-alert type="info" color="info" variant="tonal" rounded="lg" border="start"
                  title="แจ้งเตือน"
                  text="ใบรับรองของท่านจะหมดอายุใน 30 วัน กรุณายื่นต่ออายุก่อนวันที่ 28 มี.ค. 2568"
                />
                <v-alert type="warning" color="warning" variant="tonal" rounded="lg" border="start"
                  title="เอกสารไม่ครบถ้วน"
                  text="กรุณาอัปโหลดสำเนาโฉนดที่ดินและผลวิเคราะห์น้ำ"
                />
                <v-alert type="error" color="error" variant="tonal" rounded="lg" border="start"
                  title="ไม่ผ่านการตรวจ"
                  text="แปลงไม่ผ่านหมวด 3 (วัตถุอันตรายทางการเกษตร) กรุณาแก้ไขและยื่นใหม่"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <DSubTitle title="Empty State & Snackbar" />
              <v-card variant="outlined" rounded="lg" class="mb-4">
                <v-card-text class="text-center pa-8">
                  <v-icon icon="far fa-file-lines" size="64" color="grey-lighten-1" class="mb-3" />
                  <div class="text-h6 text-grey-darken-1">ยังไม่มีคำขอ</div>
                  <div class="text-body-2 text-grey mt-1 mb-4">
                    เริ่มยื่นคำขอรับรอง GAP พืชของท่านได้เลย
                  </div>
                  <v-btn color="primary" prepend-icon="fas fa-plus">ยื่นคำขอแรก</v-btn>
                </v-card-text>
              </v-card>
              <v-btn color="primary" block @click="snackbar = true" class="mb-4">
                แสดง Snackbar
              </v-btn>
              <v-snackbar v-model="snackbar" color="primary" rounded="lg" :timeout="3000" location="bottom right">
                <v-icon start>fas fa-circle-check</v-icon>
                บันทึกข้อมูลสำเร็จแล้ว
                <template v-slot:actions>
                  <v-btn variant="text" color="white" @click="snackbar = false">ปิด</v-btn>
                </template>
              </v-snackbar>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             9. DIALOGS
        ───────────────────────────────── -->
        <section :id="navSections[8].id" class="mb-10">
          <DSectionTitle :icon="navSections[8].icon" :title="navSections[8].title" />
          <v-card>
            <v-card-text class="d-flex flex-wrap ga-3">

              <!-- Confirm Dialog -->
              <v-dialog v-model="confirmDialog" max-width="420">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" color="error" variant="outlined" prepend-icon="fas fa-trash">
                    Confirm Dialog
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-text class="pa-6 text-center">
                    <v-icon icon="fas fa-circle-exclamation" color="error" size="56" class="mb-3" />
                    <h3 class="text-h6 mb-2">ยืนยันการยกเลิกคำขอ</h3>
                    <p class="text-body-2 text-grey-darken-1">
                      คุณต้องการยกเลิกคำขอหมายเลข <strong>GAP-2567-001234</strong> ใช่หรือไม่?
                      การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </p>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" color="grey-darken-1" @click="confirmDialog = false">ยกเลิก</v-btn>
                    <v-btn color="error" @click="confirmDialog = false" prepend-icon="fas fa-trash">
                      ยืนยัน
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Form Dialog -->
              <v-dialog v-model="formDialog" max-width="560">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" color="primary" prepend-icon="fas fa-calendar-plus">
                    Form Dialog
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="d-flex align-center pa-5">
                    <v-icon start color="primary">fas fa-calendar-plus</v-icon>
                    นัดตรวจแปลง
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-5">
                    <v-row>
                      <v-col cols="12">
                        <div class="field-label">คำขอ</div>
                        <v-text-field model-value="GAP-2567-001234" readonly />
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="field-label">วันที่นัดตรวจ</div>
                        <v-text-field type="date" prepend-inner-icon="fas fa-calendar" />
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="field-label">ผู้ตรวจประเมิน</div>
                        <v-select :items="inspectors" prepend-inner-icon="fas fa-user" />
                      </v-col>
                      <v-col cols="12">
                        <div class="field-label">หมายเหตุ</div>
                        <v-textarea rows="2" />
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-divider />
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn variant="text" @click="formDialog = false">ยกเลิก</v-btn>
                    <v-btn color="primary" prepend-icon="fas fa-calendar-check" @click="formDialog = false">
                      บันทึก
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Info Dialog -->
              <v-dialog v-model="infoDialog" max-width="480">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" color="info" variant="tonal" prepend-icon="fas fa-circle-info">
                    Info Dialog
                  </v-btn>
                </template>
                <v-card rounded="xl">
                  <v-card-title class="d-flex align-center pa-5">
                    <v-icon start color="teal">fas fa-certificate</v-icon>
                    ใบรับรอง GAP-C-2567-0089
                  </v-card-title>
                  <v-divider />
                  <v-card-text class="pa-5">
                    <v-list density="compact">
                      <v-list-item prepend-icon="fas fa-user"        title="นาย สมชาย ใจดี"                subtitle="เกษตรกร" />
                      <v-list-item prepend-icon="fas fa-seedling"         title="ข้าวหอมมะลิ"                   subtitle="ชนิดพืช" />
                      <v-list-item prepend-icon="fas fa-ruler-combined"   title="12.5 ไร่"                       subtitle="พื้นที่" />
                      <v-list-item prepend-icon="fas fa-calendar-week" title="1 เม.ย. 67 – 31 มี.ค. 68"      subtitle="อายุใบรับรอง" />
                    </v-list>
                  </v-card-text>
                  <v-card-actions class="pa-4">
                    <v-btn variant="tonal" color="info" prepend-icon="fas fa-download">ดาวน์โหลด PDF</v-btn>
                    <v-spacer />
                    <v-btn variant="text" @click="infoDialog = false">ปิด</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-text>
          </v-card>
        </section>

        <!-- ─────────────────────────────────
             10. STEPPER
        ───────────────────────────────── -->
        <section :id="navSections[9].id" class="mb-10">
          <DSectionTitle :icon="navSections[9].icon" :title="navSections[9].title" />

          <!-- Custom Stepper matching Figma -->
          <v-card :style="`border-radius:24px;border:1px solid ${isDark ? '#2a2a2a' : '#E0E0E0'}`" elevation="0">
            <!-- Step Header -->
            <div class="d-flex align-center justify-center pa-6 pb-4">
              <template v-for="(step, idx) in stepperItems" :key="step.title">
                <!-- Step circle + label -->
                <div class="d-flex flex-column align-center" style="width:150px">
                  <div
                    class="d-flex align-center justify-center rounded-circle mb-2"
                    style="width:56px;height:56px;font-size:24px;font-weight:500;font-family:Kanit"
                    :style="stepperStep >= idx+1
                      ? 'background:#4CAF6E;color:#FFFFFF'
                      : (isDark ? 'background:#2a2a2a;color:#9E9E9E' : 'background:#ECF0F1;color:#757575')"
                  >
                    {{ idx + 1 }}
                  </div>
                  <div
                    style="font-size:16px;font-family:Kanit;text-align:center"
                    :style="stepperStep === idx+1 ? 'color:#4CAF6E;font-weight:500' : 'color:#757575;font-weight:400'"
                  >
                    {{ step.title }}
                  </div>
                </div>
                <!-- Connector bar (between steps) -->
                <div
                  v-if="idx < stepperItems.length - 1"
                  :style="`width:100px;height:6px;border-radius:4px;flex-shrink:0;margin-bottom:24px;background:${isDark ? '#2a2a2a' : '#ECF0F1'}`"
                />
              </template>
            </div>

            <v-divider />

            <!-- Step Content -->
            <div class="pa-6">
              <!-- step 1 content -->
              <div v-if="stepperStep === 1">
                <div class="text-h6 font-weight-medium mb-1">ข้อมูลผู้ยื่นคำขอ</div>
                <div class="text-body-1 text-medium-emphasis mb-4">ข้อมูลจาก SSO จะถูกดึงมาอัตโนมัติ</div>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="field-label">ชื่อ <span class="req">*</span></div>
                    <v-text-field prepend-inner-icon="fas fa-user" placeholder="ชื่อจริง" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="field-label">นามสกุล <span class="req">*</span></div>
                    <v-text-field prepend-inner-icon="fas fa-user" placeholder="นามสกุล" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="field-label">เลขบัตรประชาชน <span class="req">*</span></div>
                    <v-text-field prepend-inner-icon="fas fa-id-card" maxlength="13" placeholder="3-5001-12345-67-8" hint="13 หลัก ไม่ต้องมี - (ขีด)" persistent-hint />
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="field-label">เบอร์โทรศัพท์ <span class="req">*</span></div>
                    <v-text-field prepend-inner-icon="fas fa-phone" placeholder="0812345678" hint="10 หลัก ไม่ต้องมี - (ขีด)" persistent-hint />
                  </v-col>
                </v-row>
              </div>
              <!-- step 2 -->
              <div v-else-if="stepperStep === 2">
                <div class="text-h6 font-weight-medium mb-4">ข้อมูลแปลง</div>
                <v-row>
                  <v-col cols="12" md="4">
                    <div class="field-label">ชื่อแปลง</div>
                    <v-text-field />
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="field-label">พื้นที่ (ไร่)</div>
                    <v-text-field type="number" />
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="field-label">จังหวัด</div>
                    <v-select :items="provinces" />
                  </v-col>
                </v-row>
              </div>
              <!-- step 3 -->
              <div v-else-if="stepperStep === 3">
                <div class="text-h6 font-weight-medium mb-4">เอกสารแนบ</div>
                <div class="field-label">เอกสารประกอบ</div>
                <v-file-input multiple chips show-size accept=".pdf" />
              </div>
              <!-- step 4 -->
              <div v-else-if="stepperStep === 4">
                <div class="text-center py-8">
                  <v-icon icon="fas fa-circle-check" color="primary" size="64" class="mb-3" />
                  <div class="text-h6">ตรวจสอบข้อมูลเรียบร้อย</div>
                  <div class="text-body-1 text-medium-emphasis mt-2">กดยื่นคำขอเพื่อส่งข้อมูล</div>
                </div>
              </div>
            </div>

            <v-divider />

            <!-- Actions -->
            <div class="d-flex pa-4">
              <v-btn v-if="stepperStep > 1" variant="text" prepend-icon="fas fa-arrow-left" color="grey-darken-1" @click="stepperStep--">ย้อนกลับ</v-btn>
              <v-spacer />
              <v-btn variant="outlined" color="grey-darken-2" prepend-icon="fas fa-floppy-disk" class="mr-2">บันทึกร่าง</v-btn>
              <v-btn v-if="stepperStep < 4" color="primary" append-icon="fas fa-arrow-right" @click="stepperStep++">ถัดไป</v-btn>
              <v-btn v-else color="success" prepend-icon="fas fa-paper-plane">ยื่นคำขอ</v-btn>
            </div>
          </v-card>
        </section>

        <!-- ─────────────────────────────────
             11. EXPANSION PANELS · LISTS
        ───────────────────────────────── -->
        <section :id="navSections[10].id" class="mb-10">
          <DSectionTitle :icon="navSections[10].icon" :title="navSections[10].title" />
          <v-row>
            <v-col cols="12" md="6">
              <v-card elevation="0" border rounded="xl" class="overflow-hidden">
                <!-- Card header -->
                <div class="d-flex align-center ga-2 px-4 py-3 border-b">
                  <v-icon size="15" color="primary">fas fa-clipboard-check</v-icon>
                  <span class="text-subtitle-2 font-weight-bold">GAP Checklist</span>
                  <v-spacer />
                  <v-chip size="x-small" color="success" label>
                    ผ่าน {{ gapChecklist.flatMap(c => c.items).filter(i => i.result === 'PASS').length }}/{{ gapChecklist.flatMap(c => c.items).length }}
                  </v-chip>
                </div>

                <!-- Accordion panels -->
                <v-expansion-panels variant="accordion" flat>
                  <v-expansion-panel
                    v-for="cat in gapChecklist"
                    :key="cat.title"
                    :title="cat.title"
                    :bg-color="isDark ? '#1c1c1c' : 'white'"
                  >
                    <v-expansion-panel-text class="pa-0">
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th style="width:45%">ข้อกำหนด</th>
                            <th style="width:32%">ผลตรวจ</th>
                            <th>หมายเหตุ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, i) in cat.items" :key="i">
                            <td class="text-body-2 py-2">{{ item.label }}</td>
                            <td class="py-2">
                              <v-btn-toggle
                                v-model="item.result"
                                mandatory
                                density="compact"
                                rounded="lg"
                                divided
                              >
                                <v-btn
                                  value="PASS"
                                  size="x-small"
                                  :color="item.result === 'PASS' ? 'success' : undefined"
                                  :variant="item.result === 'PASS' ? 'flat' : 'tonal'"
                                >ผ่าน</v-btn>
                                <v-btn
                                  value="FAIL"
                                  size="x-small"
                                  :color="item.result === 'FAIL' ? 'error' : undefined"
                                  :variant="item.result === 'FAIL' ? 'flat' : 'tonal'"
                                >ไม่ผ่าน</v-btn>
                                <v-btn
                                  value="NA"
                                  size="x-small"
                                  :variant="item.result === 'NA' ? 'flat' : 'tonal'"
                                >N/A</v-btn>
                              </v-btn-toggle>
                            </td>
                            <td class="py-2">
                              <v-text-field
                                density="compact"
                                variant="outlined"
                                hide-details
                                placeholder="หมายเหตุ"
                                style="min-width:90px"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>

                <!-- Footer actions -->
                <v-divider />
                <div class="d-flex align-center pa-3 ga-2">
                  <span class="text-caption text-medium-emphasis">
                    ไม่ผ่าน {{ gapChecklist.flatMap(c => c.items).filter(i => i.result === 'FAIL').length }} รายการ
                  </span>
                  <v-spacer />
                  <v-btn size="small" variant="tonal" color="grey-darken-1" prepend-icon="fas fa-rotate-left">รีเซ็ต</v-btn>
                  <v-btn size="small" color="primary" prepend-icon="fas fa-floppy-disk">บันทึก</v-btn>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <DSubTitle title="Notification List" />
              <v-card>
                <v-list lines="two">
                  <template v-for="(noti, i) in notifications" :key="noti.id">
                    <v-list-item :prepend-icon="noti.icon" :base-color="noti.color">
                      <v-list-item-title class="text-body-2">{{ noti.message }}</v-list-item-title>
                      <v-list-item-subtitle>{{ noti.date }}</v-list-item-subtitle>
                      <template v-slot:append>
                        <v-chip :color="noti.chipColor" size="x-small" label>{{ noti.status }}</v-chip>
                      </template>
                    </v-list-item>
                    <v-divider v-if="i < notifications.length - 1" />
                  </template>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             12. PROGRESS & LOADING
        ───────────────────────────────── -->
        <section :id="navSections[11].id" class="mb-10">
          <DSectionTitle :icon="navSections[11].icon" :title="navSections[11].title" />
          <v-row>
            <v-col cols="12" md="6">
              <DSubTitle title="Progress Linear" />
              <v-card>
                <v-card-text class="d-flex flex-column ga-4">
                  <div>
                    <div class="text-caption text-grey-darken-1 mb-1">กำลังโหลด (indeterminate)</div>
                    <v-progress-linear color="primary" indeterminate rounded />
                  </div>
                  <div>
                    <div class="text-caption text-grey-darken-1 mb-1">ความคืบหน้า 65%</div>
                    <v-progress-linear color="primary" :model-value="65" rounded height="8" />
                  </div>
                  <div>
                    <div class="text-caption text-grey-darken-1 mb-1">อัปโหลดไฟล์ 82%</div>
                    <v-progress-linear color="info" :model-value="82" rounded height="8" striped />
                  </div>
                  <div>
                    <div class="text-caption text-grey-darken-1 mb-1">เกินกำหนด</div>
                    <v-progress-linear color="error" :model-value="100" rounded height="8" />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <DSubTitle title="Progress Circular" />
              <v-card height="100%">
                <v-card-text class="d-flex flex-column align-center ga-5 pt-5">
                  <div class="text-center">
                    <v-progress-circular color="primary" indeterminate size="56" />
                    <div class="text-caption mt-2">กำลังโหลด</div>
                  </div>
                  <div class="text-center">
                    <v-progress-circular color="success" :model-value="87" size="72" width="7">
                      <span class="text-body-2 font-weight-bold">87%</span>
                    </v-progress-circular>
                    <div class="text-caption mt-2">ผ่านเกณฑ์</div>
                  </div>
                  <div class="text-center">
                    <v-progress-circular color="warning" :model-value="35" size="72" width="7">
                      <span class="text-body-2 font-weight-bold">35%</span>
                    </v-progress-circular>
                    <div class="text-caption mt-2">กำลังดำเนินการ</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="3">
              <DSubTitle title="Skeleton Loader" />
              <v-card>
                <v-card-text>
                  <v-skeleton-loader type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             13. TIMELINE · BADGES · AVATARS
        ───────────────────────────────── -->
        <section :id="navSections[12].id" class="mb-10">
          <DSectionTitle :icon="navSections[12].icon" :title="navSections[12].title" />
          <v-row>
            <v-col cols="12" md="5">
              <DSubTitle title="Application Timeline" />
              <v-card>
                <v-card-text>
                  <v-timeline density="compact" align="start">
                    <v-timeline-item v-for="t in timeline" :key="t.date" :dot-color="t.color" size="small">
                      <template v-slot:opposite>
                        <span class="text-caption text-grey">{{ t.date }}</span>
                      </template>
                      <div :class="`text-body-2 font-weight-bold text-${t.color}`">{{ t.title }}</div>
                      <div class="text-caption text-grey-darken-1">{{ t.desc }}</div>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="7">
              <DSubTitle title="Badges & Avatars" />
              <v-card>
                <v-card-text class="d-flex flex-wrap ga-5 align-center">
                  <v-badge color="error" content="5">
                    <v-btn icon="fas fa-bell" color="primary" variant="tonal" />
                  </v-badge>
                  <v-badge color="success" icon="fas fa-check" floating>
                    <v-avatar color="primary" size="48">
                      <span class="text-h6 text-white">ส</span>
                    </v-avatar>
                  </v-badge>
                  <v-avatar color="secondary" size="48">
                    <v-icon icon="fas fa-user" color="white" />
                  </v-avatar>
                  <v-avatar color="info" size="48">
                    <span class="text-white font-weight-bold">GA</span>
                  </v-avatar>
                  <v-avatar color="indigo" size="48">
                    <v-icon icon="fas fa-user-tie" color="white" />
                  </v-avatar>
                  <v-badge color="warning" content="3" location="bottom end">
                    <v-avatar color="teal" size="48">
                      <v-icon icon="fas fa-users" color="white" />
                    </v-avatar>
                  </v-badge>
                </v-card-text>
              </v-card>

              <DSubTitle title="Rating" class="mt-4" />
              <v-card>
                <v-card-text>
                  <div class="text-body-2 text-grey-darken-1 mb-2">ผลการประเมินความพึงพอใจ</div>
                  <v-rating v-model="rating" color="amber-darken-2" half-increments hover />
                  <div class="text-caption text-grey mt-1">{{ rating }} / 5 ดาว</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             14. NAVIGATION
        ───────────────────────────────── -->
        <section :id="navSections[13].id" class="mb-10">
          <DSectionTitle :icon="navSections[13].icon" :title="navSections[13].title" />
          <v-row>
            <v-col cols="12" md="6">
              <DSubTitle title="Breadcrumbs" />
              <v-card class="mb-4">
                <v-card-text>
                  <v-breadcrumbs :items="breadcrumbs" density="compact">
                    <template v-slot:divider>
                      <v-icon icon="fas fa-chevron-right" size="16" />
                    </template>
                  </v-breadcrumbs>
                </v-card-text>
              </v-card>
              <DSubTitle title="Pagination" />
              <v-card>
                <v-card-text>
                  <v-pagination v-model="currentPage" :length="8" color="primary" rounded="lg" />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <DSubTitle title="Tabs" />
              <v-card>
                <v-tabs v-model="activeTab" color="primary">
                  <v-tab value="all">ทั้งหมด</v-tab>
                  <v-tab value="pending">รอดำเนินการ</v-tab>
                  <v-tab value="approved">อนุมัติแล้ว</v-tab>
                  <v-tab value="rejected">ไม่ผ่าน</v-tab>
                </v-tabs>
                <v-window v-model="activeTab">
                  <v-window-item v-for="t in ['all','pending','approved','rejected']" :key="t" :value="t">
                    <v-card flat>
                      <v-card-text class="text-center text-grey-darken-1 py-6 text-body-2">
                        รายการสำหรับแท็บ "{{ t }}"
                      </v-card-text>
                    </v-card>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
          </v-row>
        </section>

        <!-- ─────────────────────────────────
             15. ICONS
        ───────────────────────────────── -->
        <section :id="navSections[14].id" class="mb-10">
          <DSectionTitle :icon="navSections[14].icon" :title="navSections[14].title" />
          <v-card>
            <v-card-text>
              <v-row>
                <v-col v-for="ic in iconList" :key="ic.icon" cols="6" sm="4" md="3" lg="2">
                  <div class="d-flex flex-column align-center justify-center pa-4 rounded-lg ga-2"
                       style="min-height:80px;border:1px solid rgb(var(--v-theme-border));cursor:default;transition:all 0.15s ease"
                       @mouseenter="($event.currentTarget as HTMLElement).style.background='rgba(var(--v-theme-primary),0.06)'"
                       @mouseleave="($event.currentTarget as HTMLElement).style.background=''">
                    <div class="rounded-lg d-flex align-center justify-center"
                         style="width:40px;height:40px;background:rgba(var(--v-theme-primary),0.10)">
                      <v-icon :icon="ic.icon" color="primary" size="18" />
                    </div>
                    <span class="text-caption text-medium-emphasis text-center" style="font-size:10px">{{ ic.icon.replace(/^.+fa-/, '') }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </section>

        <!-- Footer -->
        <v-divider class="mb-4" />
        <div class="d-flex align-center justify-space-between flex-wrap ga-2 py-4">
          <span class="text-caption text-medium-emphasis">
            สงวนลิขสิทธิ์ © 2569 โดยกรมวิชาการเกษตร
          </span>
          <div class="d-flex align-center ga-3">
            <span class="text-caption text-medium-emphasis">ระบบรับรองแหล่งผลิต GAP พืช</span>
            <v-chip size="x-small" color="primary" variant="tonal">v1.0</v-chip>
          </div>
        </div>

      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h } from 'vue'
import { useThemeStore } from '@/stores/theme.store'

// ── Theme Store ─────────────────────────────────────────
const themeStore = useThemeStore()
const isDark     = computed(() => themeStore.isDark)

// ── App bar style (frosted glass — ใช้ surface token เทาดำ ใน dark mode) ──
const appBarStyle = computed(() => ({
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  background: isDark.value
    ? 'rgba(28, 28, 28, 0.92)'   // dark.surface #1c1c1c + opacity
    : 'rgba(255, 255, 255, 0.92)',
  borderBottom: isDark.value
    ? '1px solid rgba(51, 51, 51, 0.8)'  // dark.border #333333
    : '1px solid rgba(224, 224, 224, 0.8)', // light.border #E0E0E0
}))

// ── Inline Sub-components ──────────────────────────────
const DSectionTitle = defineComponent({
  props: { icon: String, title: String },
  setup(props) {
    return () => h('div', { class: 'mb-5' }, [
      h('div', { class: 'd-flex align-center ga-3 mb-4' }, [
        // Tonal icon box (Vuexy-style: colored tint bg, not filled)
        h('div', {
          class: 'rounded-lg d-flex align-center justify-center',
          style: 'width:34px;height:34px;flex-shrink:0;background:rgba(var(--v-theme-primary),0.12)'
        }, [
          h('v-icon', { icon: props.icon, color: 'primary', size: '17' }),
        ]),
        h('h2', { class: 'text-h6 font-weight-bold' }, props.title),
      ]),
      h('v-divider'),
    ])
  },
})

const DSubTitle = defineComponent({
  props: { title: String },
  setup(props) {
    return () => h('div', {
      class: 'text-caption font-weight-bold text-primary mb-3 mt-5',
      style: 'text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75'
    }, props.title)
  },
})

// ── State ──────────────────────────────────────────────
const drawer        = ref(true)
const rail          = ref(false)
const snackbar      = ref(false)
const confirmDialog = ref(false)
const formDialog    = ref(false)
const infoDialog    = ref(false)
const stepperStep   = ref(1)
const activeTab     = ref('all')
const currentPage   = ref(1)
const rating        = ref(4)
const tableSearch   = ref('')
const activeSection = ref('colors')
const _demoFormRef  = ref<InstanceType<typeof import('vuetify/components')['VForm']>>()

function toggleTheme() { themeStore.toggle() }
function scrollTo(id: string) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ── Form ───────────────────────────────────────────────
const form = ref({
  namePrefix: 'นาย', firstName: '', lastName: '',
  idCard: '', phone: '', email: '',
  address: '', postalCode: '', province: null, district: null, subDistrict: null,
  cropTypes: [], inspector: null, tags: [],
  water: true, record: false, chemical: false,
  organic: false, group: false, appType: 'single',
  area: 12, elevRange: [100, 500],
  docs: [], photos: [],
  // kept for backward compat
  fullName: '',
})

const rules = {
  required: (v: string) => !!v || 'กรุณากรอกข้อมูล',
  idCard:   (v: string) => /^\d{13}$/.test(v) || 'เลขบัตรประชาชน 13 หลัก',
  phone:    (v: string) => /^0\d{8,9}$/.test(v) || 'รูปแบบเบอร์โทรไม่ถูกต้อง',
}

// ── Nav Sections ───────────────────────────────────────
const navSections = [
  { id: 'colors',     icon: 'fas fa-palette',              title: '1. Color Palette' },
  { id: 'typography', icon: 'fas fa-font',          title: '2. Typography' },
  { id: 'buttons',    icon: 'fas fa-hand-pointer',   title: '3. Buttons' },
  { id: 'chips',      icon: 'fas fa-tag',                title: '4. Status Chips' },
  { id: 'forms',      icon: 'fas fa-keyboard',         title: '5. Form Inputs' },
  { id: 'cards',      icon: 'fas fa-address-card',            title: '6. Cards' },
  { id: 'table',      icon: 'fas fa-table',                title: '7. Data Table' },
  { id: 'alerts',     icon: 'fas fa-circle-exclamation',         title: '8. Alerts' },
  { id: 'dialogs',    icon: 'fas fa-message',         title: '9. Dialogs' },
  { id: 'stepper',    icon: 'fas fa-list-ol', title: '10. Stepper' },
  { id: 'expansion',  icon: 'fas fa-list',            title: '11. Panels & Lists' },
  { id: 'progress',   icon: 'fas fa-spinner',              title: '12. Progress' },
  { id: 'timeline',   icon: 'fas fa-timeline',             title: '13. Timeline' },
  { id: 'navigation', icon: 'fas fa-compass',           title: '14. Navigation' },
  { id: 'icons',      icon: 'fas fa-shapes',           title: '15. Icons' },
]

// ── Colors ─────────────────────────────────────────────
const lightThemeColors = [
  { key: 'primary',         label: 'primary',         hex: '#4CAF6E' },
  { key: 'secondary',       label: 'secondary',       hex: '#FF8F00' },
  { key: 'success',         label: 'success',         hex: '#43A047' },
  { key: 'warning',         label: 'warning',         hex: '#FB8C00' },
  { key: 'error',           label: 'error',           hex: '#FF5252' },
  { key: 'info',            label: 'info',            hex: '#1E88E5' },
  { key: 'background',      label: 'background',      hex: '#F5F5F5' },
  { key: 'surface',         label: 'surface',         hex: '#FFFFFF' },
  { key: 'surface-variant', label: 'surface-variant', hex: '#E9F7EF' },
]

const darkThemeColors = [
  { key: 'primary',         label: 'primary',         hex: '#A5D6A7' },
  { key: 'secondary',       label: 'secondary',       hex: '#FFB300' },
  { key: 'success',         label: 'success',         hex: '#A5D6A7' },
  { key: 'warning',         label: 'warning',         hex: '#FFCC80' },
  { key: 'error',           label: 'error',           hex: '#EF9A9A' },
  { key: 'info',            label: 'info',            hex: '#90CAF9' },
  { key: 'background',      label: 'background',      hex: '#111111' },
  { key: 'surface',         label: 'surface',         hex: '#1c1c1c' },
  { key: 'surface-variant', label: 'surface-variant', hex: '#2a2a2a' },
]

const themeColors = computed(() => isDark.value ? darkThemeColors : lightThemeColors)

const statusColors = [
  { status: 'DRAFT',                vuetify: 'grey',   label: 'ร่าง' },
  { status: 'SUBMITTED',            vuetify: 'blue',   label: 'ยื่นแล้ว' },
  { status: 'DOC_REVIEW',           vuetify: 'orange', label: 'ตรวจเอกสาร' },
  { status: 'INSPECTION_SCHEDULED', vuetify: 'purple', label: 'นัดตรวจ' },
  { status: 'INSPECTING',           vuetify: 'indigo', label: 'กำลังตรวจ' },
  { status: 'APPROVED',             vuetify: 'green',  label: 'อนุมัติ' },
  { status: 'REJECTED',             vuetify: 'red',    label: 'ไม่ผ่าน' },
  { status: 'CERT_ISSUED',          vuetify: 'teal',   label: 'ออกใบรับรอง' },
  { status: 'CERT_EXPIRED',         vuetify: 'brown',  label: 'หมดอายุ' },
]

// ── Typography ─────────────────────────────────────────
const typographyList = [
  { class: 'text-h4 font-weight-bold', sample: 'Heading 4 — ชื่อหน้า Dashboard', desc: 'Font size 34px · Bold' },
  { class: 'text-h5',                  sample: 'Heading 5 — ชื่อ Card หลัก',      desc: 'Font size 24px' },
  { class: 'text-h6 font-weight-bold', sample: 'Heading 6 — ชื่อ Section',        desc: 'Font size 20px · Bold' },
  { class: 'text-subtitle-1 font-weight-bold', sample: 'Subtitle 1 — หัวข้อย่อย', desc: 'Font size 16px · Bold' },
  { class: 'text-subtitle-2',          sample: 'Subtitle 2 — ชื่อ Field Label',    desc: 'Font size 14px · Medium' },
  { class: 'text-body-1',              sample: 'Body 1 — เนื้อหาหลัก ข้อความทั่วไปในระบบ', desc: 'Font size 16px' },
  { class: 'text-body-2',              sample: 'Body 2 — ข้อความใน List, Table, Card',  desc: 'Font size 14px' },
  { class: 'text-caption text-grey-darken-1', sample: 'Caption — หมายเหตุ วันที่ Label เล็ก', desc: 'Font size 12px' },
  { class: 'text-overline',            sample: 'OVERLINE — หัวหมวดหมู่',            desc: 'Font size 10px · Uppercase' },
]

// ── All Statuses ───────────────────────────────────────
const allStatuses = [
  { status: 'DRAFT',                color: 'grey',   icon: 'fas fa-pencil',        label: 'ร่าง' },
  { status: 'SUBMITTED',            color: 'blue',   icon: 'fas fa-paper-plane',          label: 'ยื่นแล้ว' },
  { status: 'DOC_REVIEW',           color: 'orange', icon: 'fas fa-file-magnifying-glass',   label: 'ตรวจเอกสาร' },
  { status: 'INSPECTION_SCHEDULED', color: 'purple', icon: 'fas fa-calendar-days',label: 'นัดตรวจ' },
  { status: 'INSPECTING',           color: 'indigo', icon: 'fas fa-clipboard-check',label: 'กำลังตรวจ' },
  { status: 'APPROVED',             color: 'green',  icon: 'fas fa-circle-check',  label: 'อนุมัติ' },
  { status: 'REJECTED',             color: 'red',    icon: 'fas fa-circle-xmark',  label: 'ไม่ผ่าน' },
  { status: 'CANCELLED',            color: 'grey',   icon: 'fas fa-ban',        label: 'ยกเลิก' },
  { status: 'CERT_ISSUED',          color: 'teal',   icon: 'fas fa-certificate',   label: 'ออกใบรับรอง' },
  { status: 'CERT_EXPIRED',         color: 'brown',  icon: 'fas fa-clock',   label: 'หมดอายุ' },
]

// ── Summary Cards (Vuexy stat card style) ──────────────
const summaryCards = [
  { title: 'คำขอทั้งหมด',          value: 128, icon: 'fas fa-copy',        color: 'primary', trend: 12.4 },
  { title: 'รอดำเนินการ',          value: 34,  icon: 'far fa-clock',        color: 'warning', trend: -3.2 },
  { title: 'ผ่านการรับรอง',         value: 82,  icon: 'far fa-circle-check', color: 'success', trend: 8.1  },
  { title: 'ใบรับรองที่ใช้งานอยู่',  value: 76,  icon: 'fas fa-certificate',  color: 'info',    trend: 5.7  },
]

// ── Table ──────────────────────────────────────────────
const tableHeaders = [
  { title: 'เลขที่คำขอ', key: 'no',       sortable: true },
  { title: 'เกษตรกร',    key: 'farmer',   sortable: true },
  { title: 'ชนิดพืช',    key: 'crop',     sortable: true },
  { title: 'จังหวัด',    key: 'province', sortable: true },
  { title: 'วันที่ยื่น',  key: 'date',     sortable: true },
  { title: 'สถานะ',      key: 'status',   sortable: false },
  { title: '',           key: 'actions',  sortable: false },
]
const tableItems = [
  { no: 'GAP-2567-001', farmer: 'นาย สมชาย ใจดี',     crop: 'ข้าวหอมมะลิ',  province: 'นครราชสีมา', date: '1 มี.ค. 67',  status: 'DOC_REVIEW' },
  { no: 'GAP-2567-002', farmer: 'นาง มาลี เกษตรกิจ',  crop: 'มันสำปะหลัง', province: 'ขอนแก่น',    date: '3 มี.ค. 67',  status: 'APPROVED' },
  { no: 'GAP-2567-003', farmer: 'นาย วิชัย ทำนา',     crop: 'อ้อย',         province: 'สุพรรณบุรี', date: '5 มี.ค. 67',  status: 'INSPECTING' },
  { no: 'GAP-2567-004', farmer: 'นาง สมศรี ปลูกผัก',  crop: 'ผักกาดขาว',   province: 'เชียงใหม่',  date: '7 มี.ค. 67',  status: 'SUBMITTED' },
  { no: 'GAP-2567-005', farmer: 'นาย ประสิทธิ์ ไร่ดี', crop: 'ข้าวโพด',     province: 'เพชรบูรณ์',  date: '9 มี.ค. 67',  status: 'CERT_ISSUED' },
]
const statusColorMap: Record<string, string> = {
  DRAFT: 'grey', SUBMITTED: 'blue', DOC_REVIEW: 'orange',
  INSPECTION_SCHEDULED: 'purple', INSPECTING: 'indigo',
  APPROVED: 'green', REJECTED: 'red', CERT_ISSUED: 'teal', CERT_EXPIRED: 'brown',
}
const statusIconMap: Record<string, string> = {
  DRAFT: 'fas fa-pencil', SUBMITTED: 'fas fa-paper-plane', DOC_REVIEW: 'fas fa-file-magnifying-glass',
  INSPECTION_SCHEDULED: 'fas fa-calendar-days', INSPECTING: 'fas fa-clipboard-check',
  APPROVED: 'fas fa-circle-check', REJECTED: 'fas fa-circle-xmark',
  CERT_ISSUED: 'fas fa-certificate', CERT_EXPIRED: 'fas fa-clock',
}
const statusLabelMap: Record<string, string> = {
  DRAFT: 'ร่าง', SUBMITTED: 'ยื่นแล้ว', DOC_REVIEW: 'ตรวจเอกสาร',
  INSPECTION_SCHEDULED: 'นัดตรวจ', INSPECTING: 'กำลังตรวจ',
  APPROVED: 'อนุมัติ', REJECTED: 'ไม่ผ่าน',
  CERT_ISSUED: 'ออกใบรับรอง', CERT_EXPIRED: 'หมดอายุ',
}

// ── Stepper ────────────────────────────────────────────
const stepperItems = [
  { title: 'ข้อมูลผู้ขอ',    value: 1 },
  { title: 'ข้อมูลแปลง',     value: 2 },
  { title: 'เอกสารแนบ',      value: 3 },
  { title: 'ตรวจสอบ & ยื่น', value: 4 },
]

// ── Checklist ──────────────────────────────────────────
const gapChecklist = ref([
  {
    title: '1. แหล่งน้ำ',
    items: [
      { label: 'แหล่งน้ำไม่มีการปนเปื้อนสารเคมี', result: 'PASS' },
      { label: 'มีระบบการจัดการน้ำอย่างเหมาะสม',   result: 'PASS' },
      { label: 'มีการตรวจวิเคราะห์คุณภาพน้ำ',      result: null },
    ],
  },
  {
    title: '2. พื้นที่ปลูก',
    items: [
      { label: 'พื้นที่ไม่มีสารปนเปื้อนในดิน', result: 'PASS' },
      { label: 'ไม่อยู่ใกล้แหล่งมลพิษ',        result: null },
    ],
  },
  {
    title: '3. วัตถุอันตรายทางการเกษตร',
    items: [
      { label: 'ใช้สารเคมีตามคำแนะนำ',              result: null },
      { label: 'มีการเก็บรักษาสารเคมีอย่างปลอดภัย', result: null },
    ],
  },
])

// ── Notifications ──────────────────────────────────────
const notifications = [
  { id: 1, icon: 'fas fa-paper-plane',         color: 'blue',           message: 'คำขอ GAP-2567-001 ถูกยื่นแล้ว',           date: '1 มี.ค. 67', status: 'ใหม่',       chipColor: 'blue' },
  { id: 2, icon: 'fas fa-calendar',     color: 'purple',         message: 'นัดตรวจแปลง 15 มี.ค. เวลา 09:00',         date: '3 มี.ค. 67', status: 'แจ้งเตือน',  chipColor: 'purple' },
  { id: 3, icon: 'fas fa-circle-check', color: 'success', message: 'คำขอ GAP-2567-002 ผ่านการอนุมัติแล้ว',    date: '5 มี.ค. 67', status: 'สำเร็จ',     chipColor: 'green' },
  { id: 4, icon: 'fas fa-clock',  color: 'warning',message: 'ใบรับรอง GAP-C-0089 จะหมดอายุใน 30 วัน', date: '7 มี.ค. 67', status: 'เร่งด่วน',   chipColor: 'orange' },
]

// ── Timeline ───────────────────────────────────────────
const timeline = [
  { date: '1 มี.ค. 67',  title: 'ยื่นคำขอ',         desc: 'สร้างคำขอ GAP-2567-001234',       color: 'grey' },
  { date: '3 มี.ค. 67',  title: 'ตรวจเอกสาร',        desc: 'เจ้าหน้าที่รับเรื่องแล้ว',          color: 'orange' },
  { date: '8 มี.ค. 67',  title: 'นัดตรวจแปลง',       desc: 'วันที่ 15 มี.ค. เวลา 09:00',       color: 'purple' },
  { date: '15 มี.ค. 67', title: 'ตรวจประเมินแปลง',   desc: 'ผ่านเกณฑ์ 7/8 หมวด',               color: 'indigo' },
  { date: '20 มี.ค. 67', title: 'อนุมัติ & ออกใบรับรอง', desc: 'GAP-C-2567-0089 อายุ 1 ปี',  color: 'success' },
]

// ── Navigation ─────────────────────────────────────────
const breadcrumbs = [
  { title: 'หน้าหลัก',  to: '/' },
  { title: 'คำขอ GAP',   to: '/applications' },
  { title: 'GAP-2567-001234' },
]


// ── Misc ───────────────────────────────────────────────
const provinces    = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ขอนแก่น', 'นครราชสีมา', 'สุพรรณบุรี', 'เพชรบูรณ์']
const cropTypes    = ['ข้าวหอมมะลิ', 'ข้าวโพด', 'มันสำปะหลัง', 'อ้อย', 'ผักกาดขาว', 'มะเขือเทศ']
const inspectors   = ['นาย วิจัย ตรวจดี', 'นาง สุดา ประเมิน', 'นาย ชัยวัฒน์ ผลตรวจ']
const suggestedTags = ['เกษตรอินทรีย์', 'ปลอดสาร', 'GAP', 'พืชส่งออก']

const iconList = [
  'fas fa-leaf', 'fas fa-seedling', 'fas fa-file-lines', 'fas fa-file-pen',
  'fas fa-certificate', 'fas fa-clipboard-check', 'fas fa-calendar-days', 'fas fa-location-dot',
  'fas fa-user', 'fas fa-users', 'fas fa-user-gear', 'fas fa-user-tie',
  'fas fa-paper-plane', 'fas fa-circle-check', 'fas fa-circle-xmark', 'fas fa-ban',
  'fas fa-clock', 'fas fa-bell', 'fas fa-download', 'fas fa-camera',
  'fas fa-magnifying-glass', 'fas fa-plus', 'fas fa-pencil', 'fas fa-trash',
  'fas fa-eye', 'fas fa-floppy-disk', 'fas fa-gear', 'fas fa-gauge',
  'fas fa-right-from-bracket', 'fas fa-file-magnifying-glass', 'fas fa-ruler-combined', 'fas fa-calendar-plus',
  'fas fa-paperclip', 'fas fa-tags', 'fas fa-circle-info', 'fas fa-timeline',
].map(icon => ({ icon }))
</script>
