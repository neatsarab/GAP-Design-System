<template>
  <div style="--v-theme-primary: var(--v-theme-hcex-user)">
    <!-- Header -->
    <div class="d-flex align-center ga-3 mb-4">
      <v-btn
        icon="fas fa-arrow-left"
        variant="text"
        size="small"
        @click="router.back()"
      />
      <div>
        <h1 class="page-title mb-0">ชำระเงิน</h1>
        <p class="text-body-2 text-medium-emphasis mb-0 mt-1">
          เลขคำขอ:
          <span class="text-hcex-user font-weight-medium">{{
            route.params.id
          }}</span>
        </p>
      </div>
    </div>

    <v-row>
      <!-- ── Left ── -->
      <v-col cols="12" md="8">
        <!-- Application info -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-file-invoice" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold">ข้อมูลคำขอ</span>
          </div>
          <v-card-text class="pa-4">
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>เลขคำขอ</div>
                  <div class="field-label-en">Request No.</div>
                </div>
                <div class="info-value">{{ route.params.id }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ประเภทคำขอ</div>
                  <div class="field-label-en">Type</div>
                </div>
                <div class="info-value">ขึ้นทะเบียน</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>วันที่ยื่นคำขอ</div>
                  <div class="field-label-en">Submitted Date</div>
                </div>
                <div class="info-value">25/02/2569</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="field-label">
                  <div>ค่าธรรมเนียม</div>
                  <div class="field-label-en">Fee</div>
                </div>
                <div class="info-value font-weight-bold text-hcex-user">
                  500.00 บาท
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Payment method -->
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-credit-card" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >ช่องทางการชำระเงิน</span
            >
          </div>
          <v-card-text class="pa-4">
            <v-radio-group v-model="paymentMethod" hide-details>
              <!-- <v-radio value="qr" color="hcex-user">
                <template #label>
                  <div class="d-flex align-center ga-2 ml-1">
                    <v-icon icon="fas fa-qrcode" size="18" />
                    <div>
                      <div class="font-weight-medium">QR Code พร้อมเพย์</div>
                      <div class="text-caption text-medium-emphasis">
                        สแกนจ่ายผ่าน Mobile Banking
                      </div>
                    </div>
                  </div>
                </template>
              </v-radio> -->
              <!-- <v-radio value="transfer" color="hcex-user" class="mt-3">
                <template #label>
                  <div class="d-flex align-center ga-2 ml-1">
                    <v-icon icon="fas fa-building-columns" size="18" />
                    <div>
                      <div class="font-weight-medium">โอนเงินธนาคาร</div>
                      <div class="text-caption text-medium-emphasis">
                        ธนาคารกรุงไทย เลขที่บัญชี 012-3-45678-9
                      </div>
                    </div>
                  </div>
                </template>
              </v-radio> -->
              <v-radio value="gateway" color="hcex-user" class="mt-3">
                <template #label>
                  <div class="d-flex align-center ga-2 ml-1">
                    <v-icon icon="fas fa-file-pdf" size="18" />
                    <div>
                      <div class="font-weight-medium">
                        ชำระที่เคาน์เตอร์ธนาคาร
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        พิมพ์ใบแจ้งชำระเงิน นำไปชำระที่ธนาคารกรุงไทยทุกสาขา
                      </div>
                    </div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>

            <!-- QR placeholder -->
            <div
              v-if="paymentMethod === 'qr'"
              class="d-flex justify-center mt-5"
            >
              <v-card
                rounded="xl"
                variant="outlined"
                class="pa-5 d-flex flex-column align-center"
                width="220"
              >
                <v-icon icon="fas fa-qrcode" size="120" color="hcex-user" />
                <div class="text-caption text-medium-emphasis mt-3 text-center">
                  สแกนเพื่อชำระ<br />
                  <span class="font-weight-bold text-hcex-user"
                    >500.00 บาท</span
                  >
                </div>
              </v-card>
            </div>

            <!-- Bank transfer info -->
            <v-card
              v-if="paymentMethod === 'transfer'"
              rounded="xl"
              color="hcex-user"
              variant="tonal"
              class="pa-4 mt-4"
            >
              <div class="d-flex align-center ga-2 mb-3">
                <v-icon icon="fas fa-building-columns" size="15" />
                <span class="font-weight-bold text-body-2"
                  >ข้อมูลบัญชีธนาคาร</span
                >
              </div>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">ธนาคาร</div>
                  <div class="text-body-2 font-weight-medium">
                    ธนาคารกรุงไทย
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">ชื่อบัญชี</div>
                  <div class="text-body-2 font-weight-medium">
                    กรมวิชาการเกษตร
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">
                    เลขที่บัญชี
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    012-3-45678-9
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <div class="text-caption text-medium-emphasis">จำนวนเงิน</div>
                  <div class="text-body-2 font-weight-bold text-hcex-user">
                    500.00 บาท
                  </div>
                </v-col>
              </v-row>
            </v-card>

            <!-- Bank bill PDF -->
            <div v-if="paymentMethod === 'gateway'" class="mt-4">
              <!-- Bill preview -->
              <v-card
                rounded="xl"
                variant="outlined"
                class="mb-3 overflow-hidden"
              >
                <div class="bill-header px-4 py-3 d-flex align-center ga-2">
                  <v-icon
                    icon="fas fa-file-invoice-dollar"
                    size="18"
                    color="hcex-user"
                  />
                  <span class="font-weight-bold text-body-2"
                    >ใบแจ้งชำระเงินค่าธรรมเนียม</span
                  >
                  <v-spacer />
                  <v-chip size="x-small" color="warning" variant="tonal"
                    >รอชำระเงิน</v-chip
                  >
                </div>
                <v-divider />
                <div class="pa-4">
                  <v-row dense>
                    <v-col cols="6">
                      <div class="text-caption text-medium-emphasis">
                        เลขอ้างอิง
                      </div>
                      <div class="text-body-2 font-weight-bold text-hcex-user">
                        REF-{{ route.params.id }}-01
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div class="text-caption text-medium-emphasis">
                        ชำระภายใน
                      </div>
                      <div class="text-body-2 font-weight-medium">
                        30/04/2569
                      </div>
                    </v-col>
                    <v-col cols="6" class="mt-2">
                      <div class="text-caption text-medium-emphasis">
                        ชื่อผู้ชำระ
                      </div>
                      <div class="text-body-2 font-weight-medium">
                        บ.ไทย เอ็กซ์พอร์ต จก.
                      </div>
                    </v-col>
                    <v-col cols="6" class="mt-2">
                      <div class="text-caption text-medium-emphasis">
                        รายการ
                      </div>
                      <div class="text-body-2 font-weight-medium">
                        ค่าธรรมเนียมคำขอ
                      </div>
                    </v-col>
                  </v-row>
                  <v-divider class="my-3" />
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-body-2 text-medium-emphasis"
                      >ยอดที่ต้องชำระ</span
                    >
                    <span class="text-h6 font-weight-bold text-hcex-user"
                      >500.00 บาท</span
                    >
                  </div>
                  <v-divider class="my-3" />
                  <div class="text-caption text-medium-emphasis mb-1">
                    ธนาคารที่รับชำระ
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-icon
                      icon="fas fa-building-columns"
                      size="14"
                      color="hcex-user"
                    />
                    <span class="text-body-2"
                      >ธนาคารกรุงไทย ทุกสาขาทั่วประเทศ</span
                    >
                  </div>
                </div>
              </v-card>
              <v-btn
                block
                color="hcex-user"
                variant="tonal"
                rounded="lg"
                prepend-icon="fas fa-download"
              >
                ดาวน์โหลดใบแจ้งชำระเงิน (PDF)
              </v-btn>
              <p class="text-caption text-medium-emphasis text-center mt-2">
                นำใบแจ้งชำระเงินไปชำระที่ธนาคารกรุงไทยทุกสาขา
                จากนั้นแนบสลิปด้านล่าง
              </p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Upload slip -->
        <v-card rounded="xl" elevation="0" class="section-card">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-upload" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >แนบหลักฐานการชำระเงิน</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="field-label mb-2">
              <div>หลักฐานการชำระเงิน (สลิปโอนเงิน)</div>
              <div class="field-label-en">Payment Slip</div>
            </div>
            <v-file-input
              v-model="slipFile"
              accept="image/*,application/pdf"
              placeholder="เลือกไฟล์สลิป"
              prepend-icon=""
              prepend-inner-icon="fas fa-paperclip"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              show-size
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ── Right: summary ── -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="0" class="section-card mb-4">
          <div class="section-header px-4 py-3 d-flex align-center ga-2">
            <v-icon icon="fas fa-receipt" color="hcex-user" size="15" />
            <span class="text-subtitle-2 font-weight-bold"
              >สรุปการชำระเงิน</span
            >
          </div>
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-body-2 text-medium-emphasis"
                >ค่าธรรมเนียมคำขอ</span
              >
              <span class="text-body-2">500.00 บาท</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between align-center">
              <span class="font-weight-bold">รวมทั้งสิ้น</span>
              <span class="font-weight-bold text-hcex-user text-h6"
                >500.00 บาท</span
              >
            </div>
          </v-card-text>
        </v-card>

        <v-btn
          block
          color="hcex-user"
          size="large"
          rounded="lg"
          prepend-icon="fas fa-money-bill-wave"
          :disabled="!slipFile"
          @click="confirmDialog = true"
        >
          ยืนยันการชำระเงิน
        </v-btn>
        <p class="text-caption text-medium-emphasis text-center mt-2">
          กรุณาแนบสลิปก่อนยืนยัน
        </p>
      </v-col>
    </v-row>

    <!-- Confirm dialog -->
    <v-dialog v-model="confirmDialog" max-width="400" rounded="xl">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <v-icon
            icon="fas fa-money-bill-wave"
            size="40"
            color="hcex-user"
            class="mb-3"
          />
          <h3 class="text-h6 font-weight-bold mb-2">ยืนยันการชำระเงิน</h3>
          <p class="text-body-2 text-medium-emphasis">
            ยืนยันการชำระเงินค่าธรรมเนียม
            <strong>500.00 บาท</strong> สำหรับคำขอ
            <strong>{{ route.params.id }}</strong> ใช่หรือไม่?
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 pt-0 ga-2">
          <v-btn
            variant="tonal"
            color="grey"
            rounded="lg"
            flex="1"
            @click="confirmDialog = false"
            >ยกเลิก</v-btn
          >
          <v-btn
            color="hcex-user"
            variant="flat"
            rounded="lg"
            flex="1"
            @click="submitPayment"
            >ยืนยัน</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success dialog -->
    <v-dialog v-model="successDialog" max-width="400" rounded="xl" persistent>
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <div class="success-ring mx-auto mb-4">
            <v-icon icon="fas fa-check" size="28" color="white" />
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">ชำระเงินสำเร็จ</h3>
          <p class="text-body-2 text-medium-emphasis">
            บันทึกการชำระเงินเรียบร้อยแล้ว
            เจ้าหน้าที่จะดำเนินการตรวจสอบและออกใบรับรองต่อไป
          </p>
        </v-card-text>
        <v-card-actions class="px-6 pb-5 pt-0">
          <v-btn
            block
            color="hcex-user"
            variant="flat"
            rounded="lg"
            @click="router.push({ name: 'HCEXUserApplicationList' })"
            >กลับหน้ารายการ</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const paymentMethod = ref("qr");
const slipFile = ref(null);
const confirmDialog = ref(false);
const successDialog = ref(false);

function submitPayment() {
  confirmDialog.value = false;
  successDialog.value = true;
}
</script>

<style scoped>
.section-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.section-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.field-label {
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  margin-bottom: 4px;
  line-height: 1.3;
}
.field-label-en {
  font-size: 11px;
  opacity: 0.7;
}
.info-value {
  font-size: 14px;
  font-weight: 500;
}
.bill-header {
  background: rgba(var(--v-theme-on-surface), 0.03);
}
.success-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgb(var(--v-theme-success));
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
