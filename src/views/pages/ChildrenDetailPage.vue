<template>
  <ion-page>
    <z-header :title="t('children.details') || 'Child Details'">
      <template #end>
        <ion-button v-if="child" fill="clear" @click="router.push('/children-edit/' + child.id)"
                    class="text-teal-600 dark:text-teal-400">
          <ion-icon slot="icon-only" :icon="createOutline" class="text-xl"/>
        </ion-button>
      </template>
    </z-header>

    <ion-content>
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
        <div class="relative">
          <div class="absolute inset-0 rounded-full bg-teal-400/20 blur-xl animate-pulse"></div>
          <ion-spinner name="crescent" color="primary" class="w-12 h-12"></ion-spinner>
        </div>
        <p class="text-sm text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="child" class="max-w-md mx-auto px-4 py-4 space-y-4">

        <!-- Child ID Card (Click to preview & download) - Strict 85.60mm x 53.98mm Ratio -->
        <div
            @click="openCardPreview"
            class="id-card-cr80 relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg cursor-pointer group hover:shadow-xl hover:border-teal-500/40 transition-all duration-200 active:scale-[0.99] flex flex-col justify-between select-none"
            title="Click to preview & download"
        >
          <!-- Preview badge overlay -->
          <div class="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] text-white font-bold border border-white/20 shadow-sm group-hover:bg-teal-700/90 transition-all">
            <ion-icon :icon="scanOutline" class="text-xs" />
            <span>{{ t('children.preview_card') || 'কার্ড প্রিভিউ' }}</span>
          </div>

          <!-- Header -->
          <div class="bg-gradient-to-r from-[#004d40] via-[#00796b] to-[#004d40] px-3.5 py-2 text-white flex-shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md flex-shrink-0 p-0.5">
                <img src="/images/login-image.png" class="rounded-full w-full h-full object-cover" alt="Logo" />
              </div>

              <div>
                <div class="text-sm font-black tracking-wider leading-none">
                  BIVEEC
                </div>
                <p class="text-[9px] text-white/85 font-medium leading-tight mt-0.5">
                  Digital Health ID • EPI
                </p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-3 flex-1 flex items-center">
            <div class="grid grid-cols-12 gap-2.5 items-center w-full">
              <!-- Photo -->
              <div class="col-span-3 flex flex-col items-center">
                <img :src="LFA(child.photo) || '/images/offline.png'" class="w-[68px] h-[82px] rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 object-cover overflow-hidden flex items-center justify-center" />
                <span v-if="child.blood_group" class="mt-1 text-[8px] font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-1 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                  🩸 {{ child.blood_group }}
                </span>
              </div>

              <!-- Details -->
              <div class="col-span-6 min-w-0 pr-1">
                <div class="font-bold text-[#0c2340] dark:text-white text-sm truncate leading-tight">{{ child.name }}</div>
                <div v-if="child.name_bn" class="text-[10px] font-bold text-teal-600 dark:text-teal-400 truncate leading-tight">{{ child.name_bn }}</div>

                <div class="mt-1.5 space-y-0.5 text-[10px] text-zinc-700 dark:text-zinc-300">
                  <div class="truncate">
                    <span class="font-semibold text-zinc-500 dark:text-zinc-400">ID:</span>
                    <span class="font-mono font-bold ml-1 text-teal-900 dark:text-teal-300">{{ child.child_uid }}</span>
                  </div>

                  <div>
                    <span class="font-semibold text-zinc-500 dark:text-zinc-400">DOB:</span>
                    <span class="ml-1 font-medium">{{ formatDate(child.dob) }}</span>
                  </div>

                  <div>
                    <span class="font-semibold text-zinc-500 dark:text-zinc-400">Gender:</span>
                    <span class="ml-1 font-medium">{{ getGenderLabel(child.gender) }}</span>
                  </div>
                </div>
              </div>

              <!-- QR -->
              <div class="col-span-3 flex flex-col items-center justify-center">
                <div class="p-0.5 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-100">
                  <img v-if="qrCodeData" :src="qrCodeData" class="w-14 h-14 object-contain" alt="QR"/>
                </div>
                <span class="text-[7.5px] text-center text-zinc-500 dark:text-zinc-400 mt-0.5 font-bold uppercase tracking-wider">Scan Verify</span>
              </div>
            </div>
          </div>

          <!-- Footer with click prompt -->
          <div class="bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700 px-3 py-1 flex items-center justify-between flex-shrink-0">
            <span class="text-[9px] font-semibold text-[#006666] dark:text-teal-400">One Child, One Digital Health ID</span>
            <div class="flex items-center gap-1 text-[9px] font-bold text-teal-600 dark:text-teal-400 group-hover:underline">
              <ion-icon :icon="eyeOutline" class="text-xs" />
              <span>{{ t('children.click_to_view') || 'প্রিভিউ ও ডাউনলোড' }}</span>
            </div>
          </div>

        </div>

        <!-- Health Profile Section -->
        <div
            class="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-zinc-900/50">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
              <ion-icon :icon="heartOutline" class="text-rose-600 dark:text-rose-400 text-sm"/>
            </div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">Health Profile</h3>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Birth Weight</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {{ child.birth_weight_kg ? `${child.birth_weight_kg} kg` : '--' }}</p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Birth Type</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">
                {{ getBirthTypeLabel(child.birth_type) }}</p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Premature</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ child.premature ? 'Yes' : 'No' }}</p>
            </div>
            <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Disability</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{ child.disabled ? 'Yes' : 'No' }}</p>
            </div>
          </div>

          <div v-if="child.allergies"
               class="mt-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl p-2.5 border border-amber-100 dark:border-amber-900/20">
            <p class="text-[8px] text-amber-600 dark:text-amber-500 font-black uppercase tracking-wider">⚠️ Allergies</p>
            <p class="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">{{ child.allergies }}</p>
          </div>

          <div v-if="child.medical_conditions"
               class="mt-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl p-2.5 border border-blue-100 dark:border-blue-900/20">
            <p class="text-[8px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider">🏥 Medical Conditions</p>
            <p class="text-xs text-blue-800 dark:text-blue-300 font-medium mt-0.5">{{ child.medical_conditions }}</p>
          </div>

          <div v-if="child.disabled && child.disability_note"
               class="mt-2 bg-red-50 dark:bg-red-950/20 rounded-xl p-2.5 border border-red-100 dark:border-red-900/20">
            <p class="text-[8px] text-red-600 dark:text-red-400 font-black uppercase tracking-wider">📝 Disability Note</p>
            <p class="text-xs text-red-800 dark:text-red-300 font-medium mt-0.5">{{ child.disability_note }}</p>
          </div>
        </div>

        <!-- Location Section -->
        <div
            class="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-zinc-900/50">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <ion-icon :icon="locationOutline" class="text-emerald-600 dark:text-emerald-400 text-sm"/>
            </div>
            <h3 class="text-sm font-bold text-zinc-900 dark:text-zinc-50">Location</h3>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Division</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.division?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">District</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.district?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Upazila</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.upazila?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Union</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{ child.union?.name || '--' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-zinc-400 dark:text-zinc-500 font-medium">Village</span>
              <span class="font-bold text-zinc-800 dark:text-zinc-200">{{
                  child.village?.name || child.post_code || '--'
                }}</span>
            </div>
          </div>

          <div v-if="child.address" class="mt-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-2.5">
            <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Address</p>
            <p class="text-xs text-zinc-700 dark:text-zinc-300 font-medium mt-0.5">{{ child.address }}</p>
          </div>
        </div>

        <!-- Organization Section -->
        <div v-if="child.organization"
             class="bg-white dark:bg-zinc-900 rounded-3xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-100/50 dark:shadow-zinc-900/50">
          <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center flex-shrink-0">
              <ion-icon :icon="businessOutline" class="text-teal-600 dark:text-teal-400 text-lg"/>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[8px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider">Organization</p>
              <p class="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{{ child.organization?.name }}</p>
            </div>
          </div>
        </div>

        <div class="text-center py-2">
          <p class="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">
            Last updated: {{ formatDate(child.updated_at) || 'N/A' }}
          </p>
        </div>

      </div>

      <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-6">
        <div class="relative">
          <div
              class="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-950/30 dark:to-emerald-950/30 flex items-center justify-center">
            <ion-icon :icon="peopleOutline" class="text-5xl text-teal-500 dark:text-teal-400"/>
          </div>
          <div
              class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <span class="text-white text-xs font-bold">!</span>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">{{ t('children.not_found') }}</h3>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">{{ t('children.not_found_sub') }}</p>
        </div>
        <button
            @click="router.back()"
            class="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
        >
          ← Go Back
        </button>
      </div>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- CARD PREVIEW & DOWNLOAD MODAL (ISO/IEC 7810 ID-1 CR80) -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <ion-modal :is-open="isPreviewOpen" @didDismiss="closeCardPreview">
        <ion-header>
          <ion-toolbar class="border-b border-zinc-200 dark:border-zinc-800">
            <ion-buttons slot="start">
              <ion-button fill="clear" @click="closeCardPreview">
                <ion-icon slot="icon-only" :icon="closeOutline" class="text-xl" />
              </ion-button>
            </ion-buttons>
            <ion-title class="text-sm sm:text-base font-bold text-center">
              {{ t('children.health_card') || 'Child Digital Health Card' }}
            </ion-title>
            <ion-buttons slot="end">
              <ion-button fill="clear" color="primary" :disabled="isDownloading" @click="downloadCard('both')">
                <ion-spinner v-if="isDownloading" name="crescent" slot="icon-only" class="w-5 h-5" />
                <ion-icon v-else slot="icon-only" :icon="downloadOutline" class="text-xl" />
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="bg-zinc-100 dark:bg-zinc-950">
          <div v-if="child" class="max-w-md mx-auto px-4 py-4 space-y-4">

            <!-- Side Selector Segment -->
            <div class="bg-zinc-200/70 dark:bg-zinc-900 p-1 rounded-2xl">
              <ion-segment v-model="activeCardSide" mode="ios" class="bg-transparent">
                <ion-segment-button value="both" class="rounded-xl font-bold py-1.5">
                  <ion-label class="text-xs">{{ t('children.both_sides') || 'Both Sides' }}</ion-label>
                </ion-segment-button>
                <ion-segment-button value="front" class="rounded-xl font-bold py-1.5">
                  <ion-label class="text-xs">{{ t('children.front_side') || 'Front' }}</ion-label>
                </ion-segment-button>
                <ion-segment-button value="back" class="rounded-xl font-bold py-1.5">
                  <ion-label class="text-xs">{{ t('children.back_side') || 'Back' }}</ion-label>
                </ion-segment-button>
              </ion-segment>
            </div>

            <!-- Flip Button for single side view -->
            <div v-if="activeCardSide !== 'both'" class="flex justify-center">
              <button
                type="button"
                @click="toggleSingleSide"
                class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-teal-700 dark:text-teal-400 font-bold text-xs rounded-full shadow-sm hover:bg-teal-50 transition-all active:scale-95"
              >
                <ion-icon :icon="syncOutline" class="text-sm" />
                <span>{{ t('children.flip_card') || 'কার্ড উল্টান' }}</span>
              </button>
            </div>

            <!-- ──────────────── WRAPPER FOR BOTH SIDES (Target for html-to-image) ──────────────── -->
            <div ref="bothSidesRef" class="space-y-4 p-3 rounded-2xl flex flex-col items-center" style="background-color: transparent;">

              <!-- ──────── FRONT SIDE CARD (Pure Standard CSS: Zero oklch colors) ──────── -->
              <div
                v-show="activeCardSide === 'both' || activeCardSide === 'front'"
                ref="frontCardRef"
                class="id-card-cr80 rounded-2xl overflow-hidden flex flex-col justify-between select-none"
                style="background-color: #ffffff; color: #1e293b; border: 2px solid #94a3b8; box-shadow: none; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
              >
                <!-- Front Header -->
                <div
                  class="px-3.5 py-2 text-white flex items-center justify-between flex-shrink-0"
                  style="background: linear-gradient(135deg, #004d40 0%, #00796b 50%, #004d40 100%);"
                >
                  <div class="flex items-center gap-2">
                    <div class="rounded-full flex items-center justify-center p-0.5 flex-shrink-0" style="width: 32px; height: 32px; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                      <img src="/images/login-image.png" style="width: 100%; height: 100%; border-radius: 9999px; object-fit: cover;" alt="Logo" />
                    </div>
                    <div>
                      <div style="font-size: 10px; font-weight: 900; letter-spacing: 0.025em; line-height: 1.1; color: #ffffff; text-transform: uppercase;">
                        গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                      </div>
                      <div style="font-size: 8px; font-weight: 500; color: #ccfbf1; line-height: 1.1;">
                        স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় • EPI
                      </div>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <div style="font-size: 11px; font-weight: 900; letter-spacing: 0.05em; color: #6ee7b7; line-height: 1;">
                      BIVEEC
                    </div>
                    <span style="font-size: 7px; font-weight: 700; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-top: 2px;">
                      Health ID
                    </span>
                  </div>
                </div>

                <!-- Front Body -->
                <div class="p-2.5 flex-1 flex items-center" style="background-color: #ffffff;">
                  <div class="grid grid-cols-12 gap-2 items-center w-full">

                    <!-- Child Photo & Blood Group -->
                    <div class="col-span-3 flex flex-col items-center justify-center">
                      <div class="rounded-xl overflow-hidden flex items-center justify-center" style="width: 72px; height: 88px; border: 2px solid rgba(0, 77, 64, 0.25); background-color: #f8fafc;">
                        <img
                          :src="LFA(child.photo) || '/images/offline.png'"
                          style="width: 100%; height: 100%; object-fit: cover;"
                          alt="Child Photo"
                        />
                      </div>
                      <div v-if="child.blood_group" class="mt-1 px-1.5 py-0.5 rounded flex items-center gap-0.5" style="font-size: 8px; font-weight: 900; color: #be123c; background-color: #fff1f2; border: 1px solid #fecdd3;">
                        <span>🩸</span>
                        <span>{{ child.blood_group }}</span>
                      </div>
                    </div>

                    <!-- Child Details -->
                    <div class="col-span-6 min-w-0 pr-1">
                      <h3 style="font-size: 12px; font-weight: 900; line-height: 1.2; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ child.name }}
                      </h3>
                      <p v-if="child.name_bn" style="font-size: 10px; font-weight: 700; line-height: 1.2; margin-top: 2px; color: #00796b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        {{ child.name_bn }}
                      </p>

                      <div style="margin-top: 6px; font-size: 9px;">
                        <!-- UID Badge -->
                        <div class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded" style="background-color: #f0fdfa; border: 1px solid #99f6e4;">
                          <span style="font-size: 7.5px; font-weight: 900; text-transform: uppercase; color: #134e4a;">ID:</span>
                          <span style="font-family: monospace; font-size: 9px; font-weight: 800; color: #042f2e;">{{ child.child_uid }}</span>
                        </div>

                        <div style="margin-top: 3px; color: #334155; line-height: 1.3;">
                          <span style="font-weight: 700; color: #64748b;">DOB:</span>
                          <span style="margin-left: 4px; font-weight: 700; color: #0f172a;">{{ formatDate(child.dob) }}</span>
                        </div>

                        <div style="color: #334155; line-height: 1.3;">
                          <span style="font-weight: 700; color: #64748b;">Gender:</span>
                          <span style="margin-left: 4px; font-weight: 700; color: #0f172a;">{{ getGenderLabel(child.gender) }}</span>
                        </div>

                        <div style="color: #334155; line-height: 1.3;">
                          <span style="font-weight: 700; color: #64748b;">Age:</span>
                          <span style="margin-left: 4px; font-weight: 700; color: #0f172a;">{{ calculateAge(child.dob) }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- QR Code -->
                    <div class="col-span-3 flex flex-col items-center justify-center">
                      <div class="p-0.5 rounded-lg" style="background-color: #ffffff; border: 1px solid #cbd5e1;">
                        <img
                          v-if="highResQrCode || qrCodeData"
                          :src="highResQrCode || qrCodeData"
                          style="width: 64px; height: 64px; object-fit: contain;"
                          alt="Verification QR"
                        />
                      </div>
                      <span style="font-size: 7px; font-weight: 800; color: #64748b; text-align: center; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3px; display: block;">
                        Scan to Verify
                      </span>
                    </div>

                  </div>
                </div>

                <!-- Front Footer -->
                <div
                  class="px-3 py-1 flex items-center justify-between flex-shrink-0"
                  style="background-color: #f8fafc; border-top: 1px solid #e2e8f0;"
                >
                  <span style="font-size: 8px; font-weight: 700; color: #004d40;">
                    One Child, One Digital Health ID
                  </span>
                  <span style="font-size: 8px; font-weight: 600; color: #64748b;">
                    জাতীয় টিকাদান কর্মসূচি (EPI)
                  </span>
                </div>
              </div>

              <!-- ──────── BACK SIDE CARD (Pure Standard CSS: Zero oklch colors) ──────── -->
              <div
                v-show="activeCardSide === 'both' || activeCardSide === 'back'"
                ref="backCardRef"
                class="id-card-cr80 rounded-2xl overflow-hidden flex flex-col justify-between select-none"
                style="background-color: #ffffff; color: #1e293b; border: 2px solid #94a3b8; box-shadow: none; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
              >
                <!-- Back Header -->
                <div
                  class="px-3.5 py-1.5 text-white flex items-center justify-between flex-shrink-0"
                  style="background: linear-gradient(135deg, #004d40 0%, #00796b 50%, #004d40 100%);"
                >
                  <div class="flex items-center gap-1.5">
                    <span style="font-size: 12px;">🛡️</span>
                    <div>
                      <div style="font-size: 9.5px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.025em; color: #ffffff; line-height: 1.1;">
                        জরুরি ও অভিভাবকের তথ্য
                      </div>
                      <div style="font-size: 7.5px; font-weight: 500; color: #ccfbf1; line-height: 1.1;">
                        Emergency & Guardian Info • EPI Bangladesh
                      </div>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <span style="font-size: 9px; font-weight: 700; color: #6ee7b7;">BIVEEC</span>
                  </div>
                </div>

                <!-- Back Body (Simplified & Essential Info only) -->
                <div class="p-2.5 flex-1 flex flex-col justify-between" style="background-color: #ffffff; font-size: 9px;">

                  <!-- Clean 4-Row Guardian & Location Information -->
                  <div class="space-y-1 rounded-xl p-2" style="background-color: #f8fafc; border: 1px solid #e2e8f0;">
                    <!-- Row 1: Guardian Name & Relation -->
                    <div class="flex items-center justify-between" style="color: #334155;">
                      <div class="truncate pr-2">
                        <span style="color: #64748b; font-weight: 600;">অভিভাবক:</span>
                        <span style="font-weight: 700; color: #0f172a; margin-left: 4px;">{{ child.parents?.name || store.user?.name || '--' }}</span>
                      </div>
                      <div class="flex-shrink-0 px-1.5 py-0.5 rounded" style="font-size: 8.5px; color: #004d40; font-weight: 700; background-color: #f0fdfa; border: 1px solid #99f6e4;">
                        {{ getGuardianRelationLabel(child.guardian_relation) || 'পিতা/মাতা' }}
                      </div>
                    </div>

                    <!-- Row 2: Contact Mobile -->
                    <div style="color: #334155;">
                      <span style="color: #64748b; font-weight: 600;">জরুরি মোবাইল:</span>
                      <span style="font-family: monospace; font-weight: 800; color: #020617; margin-left: 4px;">{{ child.parents?.phone || store.user?.phone || '--' }}</span>
                    </div>

                    <!-- Row 3: Address -->
                    <div class="truncate" style="color: #334155;">
                      <span style="color: #64748b; font-weight: 600;">ঠিকানা:</span>
                      <span style="font-weight: 700; color: #0f172a; margin-left: 4px;">
                        {{ [child.village?.name || child.post_code, child.upazila?.name, child.district?.name].filter(Boolean).join(', ') || child.address || '--' }}
                      </span>
                    </div>

                    <!-- Row 4: Health Center -->
                    <div class="truncate" style="color: #334155;">
                      <span style="color: #64748b; font-weight: 600;">স্বাস্থ্যকেন্দ্র:</span>
                      <span style="font-weight: 700; color: #004d40; margin-left: 4px;">{{ child.organization?.name || 'উপজেলা স্বাস্থ্য কমপ্লেক্স' }}</span>
                    </div>
                  </div>

                  <!-- Emergency Hotline Strip -->
                  <div class="py-1 px-2 rounded-lg flex items-center justify-around" style="background-color: #fefce8; border: 1px solid #fef08a; color: #854d0e; font-size: 8px; font-weight: 700;">
                    <span>📞 স্বাস্থ্য বাতায়ন: <b style="color: #b91c1c; font-weight: 900;">১৬২৬৩</b></span>
                    <span>•</span>
                    <span>জরুরি: <b style="color: #b91c1c; font-weight: 900;">৯৯৯</b></span>
                    <span>•</span>
                    <span>তথ্য সেবা: <b style="color: #b91c1c; font-weight: 900;">৩৩৩</b></span>
                  </div>

                  <!-- Short Notice -->
                  <p style="font-size: 7.5px; line-height: 1.2; color: #64748b; text-align: center; margin: 0; padding: 0 4px;">
                    কার্ডটি পাওয়া গেলে নিকটস্থ উপজেলা স্বাস্থ্য কমপ্লেক্স বা স্বাস্থ্যকেন্দ্রে জমা দিন।
                  </p>
                </div>

                <!-- Back Footer -->
                <div
                  class="px-3 py-1 flex items-center justify-between flex-shrink-0"
                  style="background-color: #f8fafc; border-top: 1px solid #e2e8f0;"
                >
                  <span style="font-size: 7.5px; font-weight: 600; color: #64748b;">
                    www.biveec.gov.bd • DGHS
                  </span>
                </div>
              </div>

            </div>

            <!-- ──────────────── DOWNLOAD ACTION BUTTONS ──────────────── -->
            <div class="space-y-2 pt-1">
              <ion-button
                expand="block"
                class="h-12 font-bold text-sm shadow-md"
                style="--background: linear-gradient(to right, #008080, #0d9488); --border-radius: 16px; --color: #fff;"
                :disabled="isDownloading"
                @click="downloadCard('both')"
              >
                <ion-spinner v-if="isDownloading && downloadTarget === 'both'" name="crescent" slot="start" class="text-white" />
                <ion-icon v-else :icon="downloadOutline" slot="start" />
                {{ t('children.download_both') || 'উভয় পাশ ডাউনলোড (CR-80 সাইজ)' }}
              </ion-button>

              <div class="grid grid-cols-2 gap-2">
                <ion-button
                  expand="block"
                  fill="outline"
                  class="h-10 text-xs font-bold"
                  style="--border-radius: 14px; --border-color: #008080; --color: #008080;"
                  :disabled="isDownloading"
                  @click="downloadCard('front')"
                >
                  <ion-spinner v-if="isDownloading && downloadTarget === 'front'" name="crescent" slot="start" />
                  <ion-icon v-else :icon="downloadOutline" slot="start" />
                  {{ t('children.download_front') || 'সামনের দিক' }}
                </ion-button>

                <ion-button
                  expand="block"
                  fill="outline"
                  class="h-10 text-xs font-bold"
                  style="--border-radius: 14px; --border-color: #008080; --color: #008080;"
                  :disabled="isDownloading"
                  @click="downloadCard('back')"
                >
                  <ion-spinner v-if="isDownloading && downloadTarget === 'back'" name="crescent" slot="start" />
                  <ion-icon v-else :icon="downloadOutline" slot="start" />
                  {{ t('children.download_back') || 'পিছনের দিক' }}
                </ion-button>
              </div>
            </div>

          </div>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Capacitor } from '@capacitor/core'
import {
  IonPage, IonContent, IonButton, IonIcon, IonSpinner, toastController,
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/vue'
import {
  createOutline, businessOutline, heartOutline,
  locationOutline, peopleOutline, scanOutline, downloadOutline,
  eyeOutline, closeOutline, syncOutline
} from 'ionicons/icons'
import { useFunction, useStore, useCP } from "@/composables/index.js"
import ZHeader from "@/components/ZHeader.vue"

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const store = useStore()
const CP = useCP()
const { getData, formatDate, LFA } = useFunction()

const child = ref(null)
const qrCodeData = ref('')
const highResQrCode = ref('')
const loading = ref(true)

// Card preview state
const isPreviewOpen = ref(false)
const activeCardSide = ref('both')
const isDownloading = ref(false)
const downloadTarget = ref('both')

const frontCardRef = ref(null)
const backCardRef = ref(null)
const bothSidesRef = ref(null)

watch(() => child.value?.child_uid, async (childUid) => {
  qrCodeData.value = ''
  highResQrCode.value = ''

  if (!childUid) return

  try {
    qrCodeData.value = await QRCode.toDataURL(String(childUid), {
      width: 100,
      margin: 0,
    })

    highResQrCode.value = await QRCode.toDataURL(String(childUid), {
      width: 300,
      margin: 1,
      color: {
        dark: '#004d40',
        light: '#ffffff'
      }
    })
  } catch (error) {
    console.error('Error generating child QR code:', error)
  }
})

onMounted(async () => {
  const childId = Number(route.params.id)

  // 1. Try to load from cache first
  const cachedChild = await CP.get(`child_${childId}`)
  if (cachedChild) {
    child.value = cachedChild
    loading.value = false
  }

  // 2. Fetch fresh data from server
  await fetchChildDetails(childId)
})

const fetchChildDetails = async (childId) => {
  try {
    if (!child.value) {
      loading.value = true
    }

    const list = await getData({ url: 'children', rtn: true })
    if (list) {
      const found = list.find(c => c.id === childId)
      if (found) {
        child.value = found
        await CP.set(`child_${childId}`, found)
      } else {
        child.value = null
      }
    } else {
      console.error('Failed to fetch children list from server.')
    }
  } catch (error) {
    console.error('Error fetching child details:', error)
  } finally {
    loading.value = false
  }
}

const openCardPreview = async () => {
  activeCardSide.value = 'both'
  isPreviewOpen.value = true
}

const closeCardPreview = () => {
  isPreviewOpen.value = false
}

const toggleSingleSide = () => {
  activeCardSide.value = activeCardSide.value === 'front' ? 'back' : 'front'
}

const loadCanvasImage = (source) => new Promise((resolve, reject) => {
  if (!source) {
    reject(new Error('Image source is empty'))
    return
  }
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => resolve(image)
  image.onerror = () => reject(new Error(`Failed to load card image: ${source}`))
  image.src = source
})

const drawCoverImage = (context, image, x, y, width, height) => {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

const drawCardCanvas = async (side) => {
  const canvas = document.createElement('canvas')
  canvas.width = 856
  canvas.height = 540
  const context = canvas.getContext('2d')
  context.textBaseline = 'top'
  const radius = 28
  const roundedCardPath = () => {
    context.beginPath()
    context.moveTo(radius, 0)
    context.lineTo(canvas.width - radius, 0)
    context.quadraticCurveTo(canvas.width, 0, canvas.width, radius)
    context.lineTo(canvas.width, canvas.height - radius)
    context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height)
    context.lineTo(radius, canvas.height)
    context.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius)
    context.lineTo(0, radius)
    context.quadraticCurveTo(0, 0, radius, 0)
    context.closePath()
  }
  roundedCardPath()
  context.save()
  context.clip()
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const font = (size, weight = 600) => `${weight} ${size}px "Noto Sans Bengali", "Nirmala UI", "Segoe UI", Arial, sans-serif`
  const text = (value, x, y, size, color = '#0f172a', weight = 600) => {
    context.font = font(size, weight)
    context.fillStyle = color
    context.fillText(String(value ?? '--'), x, y)
  }
  const header = (title, subtitle) => {
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, '#004d40')
    gradient.addColorStop(0.5, '#00796b')
    gradient.addColorStop(1, '#004d40')
    context.fillStyle = gradient
    context.fillRect(0, 0, canvas.width, side === 'front' ? 110 : 90)
    text(title, 105, 34, side === 'front' ? 22 : 20, '#ffffff', 800)
    text(subtitle, 105, side === 'front' ? 66 : 60, 14, '#ccfbf1', 500)
    text('BIVEEC', 735, side === 'front' ? 35 : 38, 22, '#6ee7b7', 800)
  }

  if (side === 'front') {
    header('গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', 'স্বাস্থ্য ও পরিবার কল্যাণ মন্ত্রণালয় • EPI')
    try {
      const logo = await loadCanvasImage('/images/login-image.png')
      context.save()
      context.beginPath()
      context.arc(55, 55, 28, 0, Math.PI * 2)
      context.clip()
      drawCoverImage(context, logo, 27, 27, 56, 56)
      context.restore()
    } catch (error) {
      console.warn('Card logo could not be loaded:', error)
    }

    context.strokeStyle = '#b8cdcd'
    context.lineWidth = 5
    context.strokeRect(55, 170, 150, 185)
    try {
      const photo = await loadCanvasImage(LFA(child.value.photo))
      drawCoverImage(context, photo, 58, 173, 144, 179)
    } catch (error) {
      text('Photo unavailable', 70, 250, 13, '#64748b', 500)
    }

    text(child.value.name, 245, 175, 22, '#0f172a', 800)
    if (child.value.name_bn) text(child.value.name_bn, 245, 207, 16, '#00796b', 700)
    text(`ID: ${child.value.child_uid || '--'}`, 245, 250, 15, '#134e4a', 700)
    text(`DOB: ${formatDate(child.value.dob)}`, 245, 282, 15, '#334155', 700)
    text(`Gender: ${getGenderLabel(child.value.gender)}`, 245, 310, 15, '#334155', 700)
    text(`Age: ${calculateAge(child.value.dob)}`, 245, 338, 15, '#334155', 700)

    try {
      const qr = await loadCanvasImage(highResQrCode.value || qrCodeData.value)
      context.fillStyle = '#ffffff'
      context.fillRect(665, 170, 135, 135)
      drawCoverImage(context, qr, 675, 180, 115, 115)
    } catch (error) {
      console.warn('Card QR could not be loaded:', error)
    }
    text('SCAN TO VERIFY', 675, 320, 13, '#64748b', 800)
    context.fillStyle = '#f8fafc'
    context.fillRect(0, 475, canvas.width, 65)
    text('One Child, One Digital Health ID', 25, 500, 14, '#004d40', 700)
    text('জাতীয় টিকাদান কর্মসূচি (EPI)', 600, 500, 13, '#64748b', 600)
  } else {
    header('জরুরি ও অভিভাবকের তথ্য', 'Emergency & Guardian Info • EPI Bangladesh')
    context.fillStyle = '#f8fafc'
    context.fillRect(30, 120, 796, 220)
    context.strokeStyle = '#dbe4ee'
    context.lineWidth = 3
    context.strokeRect(30, 120, 796, 220)
    text(`অভিভাবক: ${child.value.parents?.name || store.user?.name || '--'}`, 55, 145, 16, '#0f172a', 700)
    text(getGuardianRelationLabel(child.value.guardian_relation) || 'পিতা/মাতা', 650, 145, 16, '#004d40', 700)
    text(`জরুরি মোবাইল: ${child.value.parents?.phone || store.user?.phone || '--'}`, 55, 195, 16, '#0f172a', 700)
    text(`ঠিকানা: ${[child.value.village?.name || child.value.post_code, child.value.upazila?.name, child.value.district?.name].filter(Boolean).join(', ') || child.value.address || '--'}`, 55, 245, 15, '#0f172a', 700)
    text(`স্বাস্থ্যকেন্দ্র: ${child.value.organization?.name || 'উপজেলা স্বাস্থ্য কমপ্লেক্স'}`, 55, 295, 15, '#004d40', 700)
    context.fillStyle = '#fefce8'
    context.fillRect(30, 375, 796, 45)
    text('📞 স্বাস্থ্য বাতায়ন: ১৬২৬৩     •     জরুরি: ৯৯৯     •     তথ্য সেবা: ৩৩৩', 70, 388, 14, '#854d0e', 700)
    text('কার্ডটি পাওয়া গেলে নিকটস্থ উপজেলা স্বাস্থ্য কমপ্লেক্স বা স্বাস্থ্যকেন্দ্রে জমা দিন।', 105, 445, 13, '#64748b', 500)
    context.fillStyle = '#f8fafc'
    context.fillRect(0, 485, canvas.width, 55)
    text(`Child ID: ${child.value.child_uid || '--'}`, 25, 505, 13, '#475569', 700)
    text('www.biveec.gov.bd • DGHS', 625, 505, 12, '#64748b', 600)
  }

  context.restore()
  roundedCardPath()
  context.strokeStyle = '#94a3b8'
  context.lineWidth = 5
  context.stroke()
  return canvas
}

const downloadCard = async (side = 'both') => {
  if (!child.value) return

  downloadTarget.value = side
  isDownloading.value = true

  try {
    activeCardSide.value = side === 'both' ? 'both' : side
    await nextTick()

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98],
      compress: true
    })

    for (const [index, cardSide] of (side === 'both' ? ['front', 'back'] : [side]).entries()) {
      const canvas = await drawCardCanvas(cardSide)
      if (index > 0) pdf.addPage([85.6, 53.98], 'landscape')
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 85.6, 53.98, undefined, 'FAST')
    }

    const filename = `BIVEEC_Card_${child.value.child_uid}_${side === 'both' ? 'Full' : side[0].toUpperCase() + side.slice(1)}.pdf`
    const pdfDataUrl = pdf.output('datauristring')
    const base64Data = pdfDataUrl.split(',')[1]

    if (Capacitor.isNativePlatform()) {
      try {
        await Filesystem.writeFile({
          path: `Download/${filename}`,
          data: base64Data,
          directory: Directory.ExternalStorage,
          recursive: true
        })
        showToast(t('children.download_success') || 'কার্ড PDF সফলভাবে ডাউনলোড হয়েছে!', 'success')
      } catch (e) {
        try {
          await Filesystem.writeFile({
            path: filename,
            data: base64Data,
            directory: Directory.Documents,
            recursive: true
          })
          showToast(t('children.download_success') || 'কার্ড PDF সংরক্ষিত হয়েছে!', 'success')
        } catch (fsErr) {
          triggerWebDownload(pdfDataUrl, filename)
          showToast(t('children.download_success') || 'কার্ড PDF ডাউনলোড সম্পন্ন হয়েছে!', 'success')
        }
      }
    } else {
      triggerWebDownload(pdfDataUrl, filename)
      showToast(t('children.download_success') || 'কার্ড PDF সফলভাবে ডাউনলোড হয়েছে!', 'success')
    }
  } catch (error) {
    console.error('Failed to download card:', error)
    showToast(t('children.download_error') || 'কার্ড PDF ডাউনলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'danger')
  } finally {
    isDownloading.value = false
  }
}

const triggerWebDownload = (dataUrl, filename) => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getGenderLabel = (value) => {
  const genders = store?.genders || []
  const found = genders.find(g => g.value === value || g.id === value)
  return found?.label || value || '--'
}

const getBirthTypeLabel = (value) => {
  const types = store?.birthTypes || []
  const found = types.find(t => t.value === value || t.id === value)
  return found?.label || value || '--'
}

const getGuardianRelationLabel = (relation) => {
  if (!relation) return ''
  const key = `children.guardian_relation_${relation}`
  const translated = t(key)
  if (translated && translated !== key) return translated
  return relation
}

const calculateAge = (dob) => {
  if (!dob) return ''
  const birthDate = new Date(dob)
  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--
    months += 12
  }

  if (years > 0) {
    return `${years}y ${months}m`
  }
  return `${months}m`
}

const showToast = async (message, color = 'success') => {
  const toast = await toastController.create({
    message,
    duration: 3000,
    color,
    position: 'bottom',
    buttons: [
      {
        text: 'OK',
        role: 'cancel'
      }
    ]
  })
  await toast.present()
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* ISO/IEC 7810 ID-1 (CR80) Standard Card Aspect Ratio: 85.60mm x 53.98mm */
.id-card-cr80 {
  width: 100%;
  max-width: 360px;
  aspect-ratio: 85.60 / 53.98;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
</style>
