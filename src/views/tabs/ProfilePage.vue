<template>
  <ion-page>
    <z-header :title="$t('profile.title')">
      <template #end>
        <ion-button fill="clear" @click="openEditModal" class="text-indigo-600 dark:text-indigo-400">
          <ion-icon slot="icon-only" :icon="createOutline" />
        </ion-button>
      </template>
    </z-header>

    <ion-content class="bg-zinc-50 dark:bg-zinc-950">
      <!-- Profile Header Grid/Gradient background -->
      <div class="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 dark:from-zinc-900 dark:via-indigo-950 dark:to-zinc-900 pt-8 pb-24 px-4 shadow-inner">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div class="flex flex-col items-center relative z-10">
          <!-- Profile Photo -->
          <div class="relative group">
            <div class="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-800 shadow-2xl overflow-hidden bg-zinc-100 ring-4 ring-indigo-500/30">
              <img
                  v-if="profile?.photo"
                  :src="LFA(profile.photo)"
                  alt="Profile Photo"
                  class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-purple-100">
                <span class="text-4xl font-extrabold text-indigo-600 tracking-wide">
                  {{ getInitials(profile.name) }}
                </span>
              </div>
            </div>
            <button
                @click="openImagePicker('profile')"
                class="absolute bottom-1 right-1 bg-white dark:bg-zinc-800 rounded-full p-2.5 shadow-xl active:scale-95 transition-all border border-zinc-100 dark:border-zinc-700"
            >
              <ion-icon :icon="cameraOutline" class="text-indigo-600 dark:text-indigo-400 text-lg flex" />
            </button>
          </div>

          <!-- Name & Status Banner -->
          <h2 class="text-2xl font-black text-white mt-4 tracking-tight drop-shadow-sm">{{ profile.name || $t('profile.parent') }}</h2>

          <div class="flex flex-col items-center gap-2 mt-2">
            <div v-if="profile.is_account_verified" class="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30 text-white text-xs font-bold tracking-wide uppercase">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {{ $t('profile.verified_profile') }}
            </div>

            <div v-else class="flex flex-col sm:flex-row items-center gap-2">
              <div class="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 backdrop-blur-md rounded-full border border-amber-500/30 text-amber-200 text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                {{ $t('profile.verification_pending') }}
              </div>
              <button
                  @click="openNidModal"
                  class="flex items-center gap-1 px-4 py-1.5 dark:bg-zinc-800 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold shadow-lg active:scale-95 transition-all border dark:border-zinc-700"
              >
                <ion-icon :icon="shieldCheckmarkOutline" class="text-sm" />
                {{ $t('profile.get_verified') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content Container -->
      <div class="px-4 -mt-14 relative z-20">

        <!-- Personal Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100/80 dark:border-zinc-800 overflow-hidden mb-5">
          <div class="px-5 py-4.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <h3 class="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5 text-base">
              <div class="p-1.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg text-indigo-600 dark:text-indigo-400 flex">
                <ion-icon :icon="personOutline" />
              </div>
              {{ $t('profile.personal_info') }}
            </h3>
          </div>
          <div class="divide-y divide-zinc-100 dark:divide-zinc-800/60 px-2">
            <div class="px-3 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500">{{ $t('profile.full_name') }}</span>
              <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{{ profile.name || $t('profile.not_provided') }}</span>
            </div>
            <div class="px-3 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500">{{ $t('profile.gender') }}</span>
              <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 capitalize">
                {{ profile.gender ? $t(`profile.${profile.gender}`) : $t('profile.not_provided') }}
              </span>
            </div>
            <div class="px-3 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500">{{ $t('profile.address') }}</span>
              <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-left sm:text-right max-w-xs">{{ profile.address || $t('profile.not_provided') }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100/80 dark:border-zinc-800 overflow-hidden mb-5">
          <div class="px-5 py-4.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <h3 class="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5 text-base">
              <div class="p-1.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg text-emerald-600 dark:text-emerald-400 flex">
                <ion-icon :icon="callOutline" />
              </div>
              {{ $t('profile.contact_info') }}
            </h3>
          </div>
          <div class="divide-y divide-zinc-100 dark:divide-zinc-800/60 px-2">
            <!-- Phone field with Verify warning / checkmark icon only -->
            <div class="px-3 py-3.5 flex items-center justify-between gap-2">
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('profile.phone') }}</span>
                <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{{ profile.phone || $t('profile.not_provided') }}</span>
              </div>
              <div class="flex items-center">
                <span v-if="profile.phone_verified_at" class="text-emerald-500 flex text-2xl" :title="$t('profile.verified')">
                  <ion-icon :icon="checkmarkCircleOutline" />
                </span>
                <button
                    v-else-if="profile.phone"
                    @click="openOtpModal('phone')"
                    class="text-amber-500 hover:text-amber-600 flex text-2xl active:scale-90 transition-transform"
                    :title="$t('profile.get_verified')"
                >
                  <ion-icon :icon="alertCircleOutline" />
                </button>
              </div>
            </div>

            <!-- Email field with Verify warning / checkmark icon only -->
            <div class="px-3 py-3.5 flex items-center justify-between gap-2">
              <div class="flex flex-col gap-0.5">
                <span class="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{{ $t('profile.email') }}</span>
                <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{{ profile.email || $t('profile.not_provided') }}</span>
              </div>
              <div class="flex items-center">
                <span v-if="profile.email_verified_at" class="text-emerald-500 flex text-2xl" :title="$t('profile.verified')">
                  <ion-icon :icon="checkmarkCircleOutline" />
                </span>
                <button
                    v-else-if="profile.email"
                    @click="openOtpModal('email')"
                    class="text-amber-500 hover:text-amber-600 flex text-2xl active:scale-90 transition-transform"
                    :title="$t('profile.get_verified')"
                >
                  <ion-icon :icon="alertCircleOutline" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- NID Information Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100/80 dark:border-zinc-800 overflow-hidden mb-5">
          <div class="px-5 py-4.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <h3 class="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5 text-base">
              <div class="p-1.5 bg-purple-50 dark:bg-purple-950/50 rounded-lg text-purple-600 dark:text-purple-400 flex">
                <ion-icon :icon="cardOutline" />
              </div>
              {{ $t('profile.nid_info') }}
            </h3>
            <span
                class="text-xs px-2.5 py-1 rounded-xl font-bold tracking-wide uppercase"
                :class="profile.is_account_verified ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
            >
              {{ profile.is_account_verified ? $t('profile.verified') : $t('profile.unverified') }}
            </span>
          </div>
          <div class="divide-y divide-zinc-100 dark:divide-zinc-800/60 px-2">
            <div class="px-3 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500">{{ $t('profile.nid_number') }}</span>
              <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-wider">{{ profile.nid_number || $t('profile.not_provided') }}</span>
            </div>
            <div v-if="profile.nid_image_front" class="px-3 py-4">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500 block mb-3">{{ $t('profile.doc_images') }}</span>
              <div class="flex gap-4 flex-wrap">
                <div class="relative group">
                  <img :src="LFA(profile.nid_image_front)" alt="NID Document" class="w-36 h-24 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-md" />
                  <span class="absolute top-2 left-2 bg-zinc-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">{{ $t('profile.combined_card') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences Card -->
        <div class="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100/80 dark:border-zinc-800 overflow-hidden mb-6">
          <div class="px-5 py-4.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h3 class="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5 text-base">
              <div class="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 flex">
                <ion-icon :icon="settingsOutline" />
              </div>
              {{ $t('profile.preferences') }}
            </h3>
          </div>
          <div class="divide-y divide-zinc-100 dark:divide-zinc-800/60 px-2">
            <div class="px-3 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500">{{ $t('profile.lang_pref') }}</span>
              <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">{{ profile.locale || 'bn' }}</span>
            </div>
            <div class="px-3 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span class="text-sm font-medium text-zinc-400 dark:text-zinc-500">{{ $t('profile.display_theme') }}</span>
              <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200 capitalize tracking-wide">{{ profile.theme || 'light' }}</span>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="flex flex-col gap-3 mt-6 pb-8">
          <ion-button
              expand="block"
              fill="outline"
              class="h-13 rounded-2xl font-bold border-indigo-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400"
              @click="openChangePasswordModal"
          >
            <ion-icon :icon="lockClosedOutline" slot="start" class="text-lg" />
            {{ $t('profile.change_password') }}
          </ion-button>

          <ion-button
              expand="block"
              fill="clear"
              class="h-13 rounded-2xl font-bold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
              @click="logoutUser"
          >
            <ion-icon :icon="logOutOutline" slot="start" class="text-lg" />
            {{ $t('profile.logout_account') }}
          </ion-button>
        </div>
      </div>
    </ion-content>

    <!-- NID Account Verification Bottom Sheet Modal -->
    <ion-modal
        :is-open="isNidModalOpen"
        @didDismiss="closeNidModal"
        initial-breakpoint="0.85"
        :breakpoints="[0, 0.85, 0.95]"
        handle-behavior="cycle"
        class="otp-bottom-modal"
    >
      <div class="p-6 bg-white dark:bg-zinc-900 h-full overflow-y-auto text-zinc-800 dark:text-zinc-100 pb-12">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold flex items-center gap-2">
            <ion-icon :icon="shieldCheckmarkOutline" class="text-indigo-600" />
            {{ $t('profile.nid_info') }}
          </h3>
          <button @click="closeNidModal" class="text-zinc-400 dark:text-zinc-500 text-xl">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
          {{ $t('profile.nid_desc') }}
        </p>

        <div class="flex flex-col gap-4">
          <!-- NID Number input -->
          <my-input type="number" v-model="nidForm.nid_number" name="nid_number" :label="$t('profile.nid_number')" :placeholder="$t('profile.nid_number')" validate="required|number" />

          <!-- NID Front & Back side photos selection -->
          <div class="flex gap-4">
            <div class="flex-1 flex flex-col items-center">
              <label class="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-2 uppercase tracking-wider">{{ $t('profile.front_side') }}</label>
              <div
                  @click="openImagePicker('nid_front')"
                  class="w-full h-28 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-all"
              >
                <img v-if="nidForm.front" :src="nidForm.front" class="w-full h-full object-cover" />
                <div v-else class="flex flex-col items-center text-zinc-400 dark:text-zinc-600">
                  <ion-icon :icon="cameraOutline" class="text-2xl mb-1" />
                  <span class="text-[10px] font-bold">{{ $t('profile.capture_front') }}</span>
                </div>
              </div>
            </div>

            <div class="flex-1 flex flex-col items-center">
              <label class="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-2 uppercase tracking-wider">{{ $t('profile.back_side') }}</label>
              <div
                  @click="openImagePicker('nid_back')"
                  class="w-full h-28 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden cursor-pointer active:scale-95 transition-all"
              >
                <img v-if="nidForm.back" :src="nidForm.back" class="w-full h-full object-cover" />
                <div v-else class="flex flex-col items-center text-zinc-400 dark:text-zinc-600">
                  <ion-icon :icon="cameraOutline" class="text-2xl mb-1" />
                  <span class="text-[10px] font-bold">{{ $t('profile.capture_back') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit NID button -->
          <button
              @click="submitNidVerification"
              class="w-full h-12 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              :disabled="store.uploadLoading || store.submitLoading"
          >
            <span v-if="store.uploadLoading || store.submitLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ $t('profile.submit_verification') }}
          </button>
        </div>
      </div>
    </ion-modal>

    <!-- Phone & Email Verification Bottom Sheet Modal -->
    <ion-modal
        :is-open="isOtpModalOpen"
        @didDismiss="closeOtpModal"
        initial-breakpoint="0.55"
        :breakpoints="[0, 0.55, 0.75]"
        handle-behavior="cycle"
        class="otp-bottom-modal"
    >
      <div class="p-6 bg-white dark:bg-zinc-900 h-full text-zinc-800 dark:text-zinc-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">
            {{ $t('profile.verify_title', { target: otpTarget === 'phone' ? $t('profile.phone') : $t('profile.email') }) }}
          </h3>
          <button @click="closeOtpModal" class="text-zinc-400 dark:text-zinc-500 text-xl">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <p class="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
          {{ $t('profile.otp_instruction', { target: otpTarget === 'phone' ? $t('profile.phone') : $t('profile.email') }) }}
        </p>

        <!-- Step 1: Send OTP Button -->
        <div v-if="!isOtpSent">
          <button
              @click="sendOtpCode"
              class="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              :disabled="store.submitLoading || store.loading"
          >
            <span v-if="store.submitLoading || store.loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ $t('profile.send_otp') }}
          </button>
        </div>

        <!-- Step 2: OTP Input Field & Verify Button -->
        <div v-else class="flex flex-col gap-3 animate-fadeIn">
          <div>
            <input
                type="text"
                v-model="otpCode"
                maxlength="6"
                class="w-full h-12 px-4 rounded-xl border-2 border-indigo-500 bg-zinc-50 dark:bg-zinc-950 text-center text-lg font-bold tracking-[0.5em] text-zinc-900 dark:text-white focus:outline-none"
                placeholder="000000"
            />
          </div>
          <button
              @click="verifyOtpCode"
              class="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              :disabled="store.submitLoading || store.loading"
          >
            <span v-if="store.submitLoading || store.loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ $t('profile.verify_confirm') }}
          </button>
          
          <!-- Resend OTP Button -->
          <button 
              @click="sendOtpCode" 
              class="w-full h-11 border border-indigo-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-xl mt-1 active:scale-95 transition-all flex items-center justify-center gap-2"
              :disabled="store.submitLoading || store.loading"
          >
            <span v-if="store.submitLoading || store.loading" class="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></span>
            {{ $t('profile.resend_otp') }}
          </button>
        </div>
      </div>
    </ion-modal>

    <!-- Edit Profile Modal (Includes Name, Gender, Address, Phone, and Email) -->
    <ion-modal
        :is-open="isEditModalOpen"
        @didDismiss="closeEditModal"
        initial-breakpoint="0.85"
        :breakpoints="[0, 0.85, 0.95]"
        handle-behavior="cycle"
        class="otp-bottom-modal"
    >
      <div class="p-6 bg-white dark:bg-zinc-900 h-full overflow-y-auto text-zinc-800 dark:text-zinc-100 pb-12">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('profile.edit_profile') }}</h3>
          <button @click="closeEditModal" class="text-zinc-400 dark:text-zinc-500 text-xl">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <my-input  type="text" v-model="editForm.name" :label="$t('profile.full_name')" :placeholder="$t('profile.full_name')" name="full_name" validate="required"/>

          <my-input  v-model="editForm.gender" :label="$t('profile.gender')" :options="store.genders" name="gender" validate="required"/>
          <my-input type="text" v-model="editForm.address" :placeholder="$t('profile.address')" name="address" :label="$t('profile.address')" validate="required|max:200"/>

          <my-input type="text" v-model="editForm.phone" :placeholder="$t('profile.phone')" name="phone" :label="$t('profile.phone')" validate="required|phone"/>
          <my-input   type="email" v-model="editForm.email" :placeholder="$t('profile.email')" name="email" :label="$t('profile.email')" validate="required|email"/>

          <button
              @click="submitProfileEdit"
              class="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              :disabled="store.submitLoading || store.loading"
          >
            <span v-if="store.submitLoading || store.loading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ $t('profile.save_changes') }}
          </button>
        </div>
      </div>
    </ion-modal>

    <!-- Change Password Modal -->
    <ion-modal
        :is-open="isChangePasswordOpen"
        @didDismiss="closeChangePasswordModal"
        initial-breakpoint="0.65"
        :breakpoints="[0, 0.65, 0.8]"
        handle-behavior="cycle"
        class="otp-bottom-modal"
    >
      <div class="p-6 bg-white dark:bg-zinc-900 h-full text-zinc-800 dark:text-zinc-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('profile.change_password') }}</h3>
          <button @click="closeChangePasswordModal" class="text-zinc-400 dark:text-zinc-500 text-xl">
            <ion-icon :icon="closeOutline" />
          </button>
        </div>

        <div class="flex flex-col gap-4">

          <my-input type="password" v-model="passwordForm.current_password" :placeholder="$t('profile.current_password')" :label=" $t('profile.current_password') " validate="required" name="current_password" />

          <my-input type="password" v-model="passwordForm.password" :placeholder="$t('profile.new_password')" :label="$t('profile.new_password')" name="new_password" validate="required" />

          <my-input  type="password" v-model="passwordForm.password_confirmation" :placeholder="$t('profile.confirm_new_password')" :label="$t('profile.confirm_new_password')" name="confirm_new_password" validate="required" />

          <button
              @click="submitPasswordChange"
              class="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              :disabled="store.submitLoading || store.loading"
          >
            <span v-if="store.submitLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            {{ $t('profile.update_password') }}
          </button>
        </div>
      </div>
    </ion-modal>

    <!-- Global Image Picker Component -->
    <ImagePickerModal
        :is-open="isImagePickerOpen"
        :has-image="false"
        @update:is-open="isImagePickerOpen = $event"
        @image-selected="handleImageSelected"
        :edit="true"
    />

  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  IonPage, IonContent, IonButton, IonIcon, IonModal, onIonViewWillEnter
} from '@ionic/vue'
import {
  createOutline, cameraOutline, checkmarkCircleOutline,
  personOutline, callOutline, alertCircleOutline, cardOutline, settingsOutline,
  lockClosedOutline, logOutOutline, shieldCheckmarkOutline, closeOutline
} from 'ionicons/icons'
import ZHeader from '@/components/ZHeader.vue'
import ImagePickerModal from '@/components/ImagePickerModal.vue'
import {useCP, useFunction, useStore, useAlert, useForm} from "@/composables/index.js"
import MyInput from "@/components/MyInput.vue";
import { useI18n } from 'vue-i18n'

const CP = useCP()
const F = useForm()
const store = useStore()
const { toastAlert } = useAlert()
const { t } = useI18n()

const {
  loadUser,
  LFA,
  fileUpload,
  updateProfile,
  updateNidInfo,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailOtp,
  verifyEmailOtp,
  changePasswordApi,
  logout
} = useFunction()

// Reactive States
const profile = ref({})

// OTP Verification state
const isOtpModalOpen = ref(false)
const otpTarget = ref('phone') // 'phone' or 'email'
const isOtpSent = ref(false)
const otpCode = ref('')

// Edit Profile state
const isEditModalOpen = ref(false)
const editForm = ref({
  name: '',
  gender: '',
  address: '',
  phone: '',
  email: ''
})

// Change Password state
const isChangePasswordOpen = ref(false)
const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

// NID Verification state
const isNidModalOpen = ref(false)
const nidForm = ref({
  nid_number: '',
  front: null,
  back: null
})

// Image Picker state
const isImagePickerOpen = ref(false)
const imagePickerTarget = ref(null) // 'profile', 'nid_front', 'nid_back'

onIonViewWillEnter(async () => {
  profile.value = await CP.get('user')
  await loadUser()
  profile.value = await CP.get('user')
})

// Helper functions
const getInitials = (name) => {
  if (!name) return 'P'
  return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
}

// Edit Profile methods
const openEditModal = () => {
  editForm.value = {
    name: profile.value.name || '',
    gender: profile.value.gender || 'male',
    address: profile.value.address || '',
    phone: profile.value.phone || '',
    email: profile.value.email || ''
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const submitProfileEdit = async () => {
  const validate = await F.validate()
  if (!validate)return
  try {
    store.submitLoading = true
    const res = await updateProfile({
      name: editForm.value.name,
      gender: editForm.value.gender,
      address: editForm.value.address,
      phone: editForm.value.phone,
      email: editForm.value.email
    })
    if (res) {
      await loadUser()
      profile.value = await CP.get('user')
      closeEditModal()
    }
  } catch (err) {
    console.error(err)
    toastAlert('error', t('profile.update_failed'))
  } finally {
    store.submitLoading = false
  }
}

// OTP Modal Methods
const openOtpModal = (target) => {
  otpTarget.value = target
  otpCode.value = ''
  isOtpModalOpen.value = true
}

const closeOtpModal = () => {
  isOtpModalOpen.value = false
}

const sendOtpCode = async () => {
  try {
    store.submitLoading = true
    let res
    if (otpTarget.value === 'phone') {
      res = await sendPhoneOtp()
    } else {
      res = await sendEmailOtp()
    }

    if (res && parseInt(res.status) === 2000) {
      isOtpSent.value = true
      // Store OTP sent state for 5 minutes persistence
      toastAlert('success', res.message || t('profile.otp_sent_success'))
    } else if (res) {
      toastAlert('error', res.message || t('profile.otp_send_failed'))
    }
  } catch (err) {
    console.error(err)
    toastAlert('error', t('profile.otp_send_error'))
  } finally {
    store.submitLoading = false
  }
}

const verifyOtpCode = async () => {
  if (otpCode.value.length === 6) {
    try {
      store.submitLoading = true
      let res
      if (otpTarget.value === 'phone') {
        res = await verifyPhoneOtp(otpCode.value)
      } else {
        res = await verifyEmailOtp(otpCode.value)
      }

      if (res && parseInt(res.status) === 2000) {
        toastAlert('success', res.message || t('profile.verified_success'))
        await loadUser()
        profile.value = await CP.get('user')
        closeOtpModal()
      } else if (res) {
        toastAlert('error', res.message || t('profile.verify_failed'))
      }
    } catch (err) {
      console.error(err)
      toastAlert('error', t('profile.verify_error'))
    } finally {
      store.submitLoading = false
    }
  } else {
    toastAlert('error', t('profile.invalid_otp_alert'))
  }
}

// Change Password methods
const openChangePasswordModal = () => {
  passwordForm.value = {
    current_password: '',
    password: '',
    password_confirmation: ''
  }
  isChangePasswordOpen.value = true
}

const closeChangePasswordModal = () => {
  isChangePasswordOpen.value = false
}

const submitPasswordChange = async () => {
  const validate = await F.validate()
  if (!validate)return

  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    toastAlert('error', t('profile.password_mismatch'))
    return
  }

  try {
    store.submitLoading = true
    const res = await changePasswordApi({
      current_password: passwordForm.value.current_password,
      password: passwordForm.value.password,
      password_confirmation: passwordForm.value.password_confirmation
    })
    if (res && parseInt(res.status) === 2000) {
      toastAlert('success', res.message || t('profile.password_update_success'))
      closeChangePasswordModal()
    } else if (res) {
      toastAlert('error', res.message || t('profile.password_update_failed'))
    }
  } catch (err) {
    console.error(err)
    toastAlert('error', t('profile.password_update_error'))
  } finally {
    store.submitLoading = false
  }
}

// NID Verification methods
const openNidModal = () => {
  nidForm.value = {
    nid_number: profile.value.nid_number || '',
    front: null,
    back: null
  }
  isNidModalOpen.value = true
}

const closeNidModal = () => {
  isNidModalOpen.value = false
}

// Image Picker Integration
const openImagePicker = (target) => {
  imagePickerTarget.value = target
  isImagePickerOpen.value = true
}

const handleImageSelected = async (dataUrl) => {
  if (imagePickerTarget.value === 'profile') {
    try {
      store.submitLoading = true
      // Convert base64 dataUrl → Blob → File
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const ext = blob.type.split('/')[1] || 'jpg'
      const file = new File([blob], `avatar_${Date.now()}.${ext}`, { type: blob.type })

      const fakeEvent = { target: { files: [file] } }

      // Upload and save
      await fileUpload(fakeEvent, profile.value, 'photo')
      await updateProfile({
        name: profile.value.name,
        gender: profile.value.gender,
        address: profile.value.address,
        phone: profile.value.phone,
        email: profile.value.email,
        photo: profile.value.photo
      })
      await loadUser()
      profile.value = await CP.get('user')
    } catch (err) {
      console.error(err)
      toastAlert('error', t('profile.photo_upload_failed'))
    } finally {
      store.submitLoading = false
    }
  } else if (imagePickerTarget.value === 'nid_front') {
    nidForm.value.front = dataUrl
  } else if (imagePickerTarget.value === 'nid_back') {
    nidForm.value.back = dataUrl
  }
}

// Merge Front and Back NID cards side-by-side using HTML5 Canvas
const mergeNidImages = (frontUrl, backUrl) => {
  return new Promise((resolve, reject) => {
    const imgFront = new Image()
    const imgBack = new Image()

    let loadedCount = 0
    const onImageLoaded = () => {
      loadedCount++
      if (loadedCount === 2) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const targetHeight = 600
        const frontWidth = (imgFront.width / imgFront.height) * targetHeight
        const backWidth = (imgBack.width / imgBack.height) * targetHeight

        canvas.width = frontWidth + backWidth + 20
        canvas.height = targetHeight

        // Fill background with white
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw Front & Back Side images side-by-side
        ctx.drawImage(imgFront, 0, 0, frontWidth, targetHeight)
        ctx.drawImage(imgBack, frontWidth + 20, 0, backWidth, targetHeight)

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob from NID images'))
          }
        }, 'image/jpeg', 0.9)
      }
    }

    imgFront.onload = onImageLoaded
    imgBack.onload = onImageLoaded
    imgFront.onerror = reject
    imgBack.onerror = reject

    imgFront.src = frontUrl
    imgBack.src = backUrl
  })
}

const submitNidVerification = async () => {
  const validate = await F.validate()
  if (!validate)return

  if (!nidForm.value.front || !nidForm.value.back) {
    toastAlert('error', t('profile.capture_both_sides'))
    return
  }

  try {
    store.submitLoading = true
    store.uploadLoading = true

    // Merge NID images client-side
    const mergedBlob = await mergeNidImages(nidForm.value.front, nidForm.value.back)
    const file = new File([mergedBlob], `nid_combined_${Date.now()}.jpg`, { type: 'image/jpeg' })

    const fakeEvent = { target: { files: [file] } }

    // Upload NID merged photo using fileUpload helper
    await fileUpload(fakeEvent, profile.value, 'nid_image_front')

    // Submit verification info to the server
    const res = await updateNidInfo({
      nid_number: nidForm.value.nid_number,
      nid_image_front: profile.value.nid_image_front
    })

    if (res) {
      await loadUser()
      profile.value = await CP.get('user')
      toastAlert('success', t('profile.nid_submit_success'))
      closeNidModal()
    }
  } catch (err) {
    console.error(err)
    toastAlert('error', t('profile.nid_submit_failed'))
  } finally {
    store.submitLoading = false
    store.uploadLoading = false
  }
}

const logoutUser = async () => {
  await logout()
}
</script>

<style scoped>
ion-content {
  --background: transparent;
}

.h-13 {
  height: 3.25rem;
}

.bg-white {
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

/* Custom overlay background adjustment for Ionic Modal */
ion-modal.otp-bottom-modal {
  --border-radius: 24px 24px 0 0;
  --box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.1), 0 -8px 10px -6px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease forwards;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}
</style>