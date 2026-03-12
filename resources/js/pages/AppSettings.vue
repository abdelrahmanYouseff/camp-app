<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import { ArrowLeft, Phone, Check, Loader2, Plus, Settings, ChevronRight, Pencil } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';

interface WhatsAppPhone {
    id: string;
    display_phone_number: string;
    label?: string | null;
    verified_name?: string;
    phone_number_id?: string;
    business_account_id?: string;
    is_active?: boolean;
}

const goBack = () => router.visit('/');

const phones = ref<WhatsAppPhone[]>([]);
const activePhoneNumberId = ref<string | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const settingActive = ref<string | null>(null);

const showAddForm = ref(false);
const addSaving = ref(false);
const addForm = ref({
    label: '',
    phone_number: '',
    phone_number_id: '',
    business_account_id: '',
    access_token: '',
});
const addError = ref<string | null>(null);

const editingLabelId = ref<string | null>(null);
const editingLabelValue = ref('');
const savingLabelId = ref<string | null>(null);

const canEditLabel = (phone: WhatsAppPhone) => /^\d+$/.test(phone.id) && Number(phone.id) < 1000000;

const startEditLabel = (phone: WhatsAppPhone) => {
    if (!canEditLabel(phone)) return;
    editingLabelId.value = phone.id;
    editingLabelValue.value = phone.label || '';
};

const cancelEditLabel = () => {
    editingLabelId.value = null;
    editingLabelValue.value = '';
};

const saveLabel = async (phoneId: string) => {
    if (!canEditLabel({ id: phoneId } as WhatsAppPhone)) return;
    savingLabelId.value = phoneId;
    try {
        const res = await fetch(`/api/settings/whatsapp-accounts/${phoneId}/label`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ label: editingLabelValue.value.trim() || null }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (data.success) {
            const p = phones.value.find((x) => x.id === phoneId);
            if (p) p.label = data.label ?? null;
        }
    } finally {
        savingLabelId.value = null;
        editingLabelId.value = null;
        editingLabelValue.value = '';
    }
};

const fetchPhones = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await fetch('/api/settings/whatsapp-phone-numbers', {
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin',
        });
        let data: { success?: boolean; phone_numbers?: WhatsAppPhone[]; active_phone_number_id?: string | number | null; error?: string } = {};
        const text = await res.text();
        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            error.value = res.ok ? 'Invalid response' : `خطأ ${res.status}: ${res.statusText}`;
            loading.value = false;
            return;
        }
        if (data.success) {
            phones.value = data.phone_numbers || [];
            activePhoneNumberId.value = data.active_phone_number_id != null ? String(data.active_phone_number_id) : null;
        } else {
            error.value = data.error || 'Failed to load phone numbers';
        }
        if (!res.ok && !error.value) {
            error.value = data.error || `خطأ ${res.status}`;
        }
    } catch (e) {
        error.value = 'فشل الاتصال. تأكد أن السيرفر يعمل وأن الرابط صحيح.';
    } finally {
        loading.value = false;
    }
};

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

const setActive = async (phoneNumberId: string) => {
    if (activePhoneNumberId.value === phoneNumberId) return;
    settingActive.value = phoneNumberId;
    try {
        const res = await fetch('/api/settings/active-whatsapp-phone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ phone_number_id: phoneNumberId }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (data.success) {
            activePhoneNumberId.value = data.active_phone_number_id != null ? String(data.active_phone_number_id) : null;
        } else {
            alert(data.error || 'Failed to set active number');
        }
    } catch (e) {
        alert('Failed to set active number');
    } finally {
        settingActive.value = null;
    }
};

const submitAdd = async () => {
    if (!addForm.value.phone_number.trim() || !addForm.value.phone_number_id.trim() || !addForm.value.business_account_id.trim() || !addForm.value.access_token.trim()) {
        addError.value = 'رقم الهاتف ومعرّفات Meta مطلوبة';
        return;
    }
    addError.value = null;
    addSaving.value = true;
    try {
        const res = await fetch('/api/settings/whatsapp-accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                label: addForm.value.label.trim() || null,
                phone_number: addForm.value.phone_number.trim(),
                phone_number_id: addForm.value.phone_number_id.trim(),
                business_account_id: addForm.value.business_account_id.trim(),
                access_token: addForm.value.access_token.trim(),
            }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (data.success) {
            addForm.value = { label: '', phone_number: '', phone_number_id: '', business_account_id: '', access_token: '' };
            showAddForm.value = false;
            await fetchPhones();
        } else {
            addError.value = data.message || data.error || 'Failed to add account';
        }
    } catch (e) {
        addError.value = 'Failed to add account';
    } finally {
        addSaving.value = false;
    }
};

onMounted(fetchPhones);
</script>

<template>
    <Head title="الإعدادات" />

    <div class="min-h-screen bg-[#f8fafc]">
        <!-- Header -->
        <header class="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
            <div class="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
                <button
                    type="button"
                    @click="goBack"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    aria-label="رجوع"
                >
                    <ArrowLeft class="h-5 w-5" />
                </button>
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Settings class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                    <h1 class="truncate text-xl font-semibold tracking-tight text-slate-900">الإعدادات</h1>
                    <p class="truncate text-sm text-slate-500">إدارة أرقام واتساب بيزنس والإرسال</p>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <!-- Add account card -->
            <section class="mb-8">
                <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
                    <div class="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-5">
                        <h2 class="text-base font-semibold text-slate-900">إضافة رقم واتساب</h2>
                        <p class="mt-1 text-sm text-slate-500">أضف حساب واتساب بيزنس جديد باستخدام بيانات Meta.</p>
                    </div>
                    <div class="p-6">
                        <button
                            v-if="!showAddForm"
                            type="button"
                            @click="showAddForm = true"
                            class="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-4 text-sm font-medium text-slate-600 transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/5 hover:text-slate-900 sm:w-auto sm:px-6"
                        >
                            <Plus class="h-5 w-5" />
                            إضافة رقم جديد
                        </button>

                        <form v-else class="space-y-5" @submit.prevent="submitAdd">
                            <div class="grid gap-4 sm:grid-cols-1">
                                <div class="space-y-2">
                                    <Label for="label" class="text-slate-700">اسم الرقم / الوصف</Label>
                                    <Input
                                        id="label"
                                        v-model="addForm.label"
                                        type="text"
                                        placeholder="مثلاً: شركة عالم المغامرة"
                                        class="h-11 rounded-xl border-slate-200 bg-white focus:border-[#25D366]/50 focus:ring-[#25D366]/20"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label for="phone_number" class="text-slate-700">WhatsApp Phone number</Label>
                                    <Input
                                        id="phone_number"
                                        v-model="addForm.phone_number"
                                        type="text"
                                        placeholder="+966501234567"
                                        class="h-11 rounded-xl border-slate-200 bg-white focus:border-[#25D366]/50 focus:ring-[#25D366]/20"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label for="phone_number_id" class="text-slate-700">whatsapp_phone_number_id</Label>
                                    <Input
                                        id="phone_number_id"
                                        v-model="addForm.phone_number_id"
                                        type="text"
                                        placeholder="معرّف الرقم من Meta"
                                        class="h-11 rounded-xl border-slate-200 bg-white focus:border-[#25D366]/50 focus:ring-[#25D366]/20"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label for="business_account_id" class="text-slate-700">whatsapp_business_account_id</Label>
                                    <Input
                                        id="business_account_id"
                                        v-model="addForm.business_account_id"
                                        type="text"
                                        placeholder="معرّف حساب بيزنس"
                                        class="h-11 rounded-xl border-slate-200 bg-white focus:border-[#25D366]/50 focus:ring-[#25D366]/20"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <Label for="access_token" class="text-slate-700">whatsapp_access_token</Label>
                                    <Input
                                        id="access_token"
                                        v-model="addForm.access_token"
                                        type="password"
                                        placeholder="توكن الوصول"
                                        class="h-11 rounded-xl border-slate-200 bg-white focus:border-[#25D366]/50 focus:ring-[#25D366]/20"
                                    />
                                </div>
                            </div>
                            <p v-if="addError" class="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
                                {{ addError }}
                            </p>
                            <div class="flex flex-wrap gap-3 pt-1">
                                <Button
                                    type="submit"
                                    :disabled="addSaving"
                                    class="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 font-medium text-white shadow-sm transition-all hover:bg-[#20bd5a] disabled:opacity-70"
                                >
                                    <Loader2 v-if="addSaving" class="h-4 w-4 animate-spin shrink-0" />
                                    <span>{{ addSaving ? 'جاري الحفظ…' : 'حفظ الرقم' }}</span>
                                </Button>
                                <button
                                    type="button"
                                    @click="showAddForm = false; addError = null"
                                    class="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <!-- Linked numbers -->
            <section>
                <div class="mb-4 flex items-center justify-between">
                    <div>
                        <h2 class="text-base font-semibold text-slate-900">الأرقام المربوطة</h2>
                        <p class="mt-0.5 text-sm text-slate-500">اختر الرقم الذي يُرسل منه الحملات</p>
                    </div>
                </div>

                <div v-if="loading" class="flex items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white py-16 shadow-sm">
                    <Loader2 class="h-6 w-6 animate-spin text-slate-400" />
                    <span class="text-sm font-medium text-slate-500">جاري التحميل…</span>
                </div>

                <div v-else-if="error" class="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-700 shadow-sm">
                    {{ error }}
                </div>

                <ul v-else-if="phones.length" class="space-y-3">
                    <li
                        v-for="phone in phones"
                        :key="phone.id"
                        class="group flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-200/30 transition-all hover:border-slate-300/80 hover:shadow-md sm:p-5"
                        :class="{ 'ring-2 ring-[#25D366]/30 ring-offset-2': activePhoneNumberId === String(phone.id) }"
                    >
                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] transition-colors group-hover:bg-[#25D366]/15">
                            <Phone class="h-6 w-6" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <div v-if="editingLabelId === phone.id" class="flex items-center gap-2">
                                <input
                                    v-model="editingLabelValue"
                                    type="text"
                                    class="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-[#25D366]/50 focus:outline-none focus:ring-1 focus:ring-[#25D366]/30"
                                    placeholder="اسم الرقم"
                                    @keydown.enter="saveLabel(phone.id)"
                                    @blur="saveLabel(phone.id)"
                                />
                                <Loader2 v-if="savingLabelId === phone.id" class="h-4 w-4 animate-spin text-slate-400" />
                            </div>
                            <div v-else class="flex items-center gap-2">
                                <p
                                    class="truncate font-semibold"
                                    :class="[
                                        phone.label ? 'text-slate-900' : 'text-slate-500',
                                        { 'cursor-pointer rounded px-1 py-0.5 hover:bg-slate-100 hover:text-slate-700': canEditLabel(phone) }
                                    ]"
                                    @click="startEditLabel(phone)"
                                >
                                    {{ phone.label || (canEditLabel(phone) ? 'اضغط لإضافة اسم (مثلاً: شركة عالم المغامرة)' : (phone.display_phone_number || 'رقم واتساب')) }}
                                </p>
                                <button
                                    v-if="canEditLabel(phone)"
                                    type="button"
                                    class="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    aria-label="تعديل الاسم"
                                    @click.stop="startEditLabel(phone)"
                                >
                                    <Pencil class="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <p class="mt-0.5 truncate text-xs text-slate-500">
                                {{ phone.display_phone_number }}
                                <span v-if="phone.phone_number_id" class="text-slate-400"> · ID: {{ phone.phone_number_id }}</span>
                            </p>
                        </div>
                        <div class="flex shrink-0 items-center gap-3">
                            <span
                                v-if="activePhoneNumberId === String(phone.id)"
                                class="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#128C7E]"
                            >
                                <Check class="h-3.5 w-3.5" />
                                الإرسال من هذا الرقم
                            </span>
                            <button
                                v-else
                                type="button"
                                :disabled="settingActive !== null"
                                @click="setActive(phone.id)"
                                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                            >
                                <template v-if="settingActive === phone.id">
                                    <Loader2 class="h-4 w-4 animate-spin" />
                                </template>
                                <template v-else>
                                    اعيّن للإرسال
                                    <ChevronRight class="h-4 w-4 opacity-60" />
                                </template>
                            </button>
                        </div>
                    </li>
                </ul>

                <div v-else class="rounded-2xl border border-slate-200/80 bg-white py-16 text-center shadow-sm">
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Phone class="h-7 w-7" />
                    </div>
                    <p class="mt-4 text-sm font-medium text-slate-600">لا توجد أرقام مربوطة</p>
                    <p class="mt-1 text-sm text-slate-500">أضف رقمًا من البطاقة أعلاه أو تحقق من إعدادات .env</p>
                </div>
            </section>
        </main>
    </div>
</template>
