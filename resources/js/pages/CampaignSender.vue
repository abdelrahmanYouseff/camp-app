<script setup lang="ts">
import { Head, useForm, router } from '@inertiajs/vue3';
import { ref, computed, onMounted } from 'vue';
import { 
    Upload, 
    FileText, 
    Plus,
    X,
    Minus,
    ChevronDown,
    Loader2,
    Image as ImageIcon,
} from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import Label from '@/components/ui/label/Label.vue';
import Badge from '@/components/ui/badge/Badge.vue';

// Template type
interface Template {
    id: string;
    name: string;
    status: string;
    language: string;
    category: string;
    // We keep components as any because it comes directly from WhatsApp API
    components?: Array<{ type: string; text?: string }>;
}

// File upload state
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const phoneNumbersCount = ref<number>(0);
const fileName = ref<string>('');

// Image upload state
const imageInput = ref<HTMLInputElement | null>(null);
const selectedImage = ref<File | null>(null);
const imagePreviewUrl = ref<string | null>(null);
const imageUploadError = ref<string | null>(null);
const imageUploading = ref(false);
const imageMediaId = ref<string | null>(null);

// Templates state
const templates = ref<Template[]>([]);
const isLoadingTemplates = ref(true);
const templatesError = ref<string | null>(null);

const selectedTemplateObject = computed<Template | null>(() => {
    return templates.value.find(t => t.name === form.template) ?? null;
});

const templateBodyPreview = computed(() => {
    const t = selectedTemplateObject.value;
    if (!t || !t.components || !Array.isArray(t.components)) return '';
    const body = t.components.find(c => c.type === 'BODY' || c.type === 'body');
    if (!body || !body.text) return '';
    // Replace variable placeholders {{1}} with ellipsis
    return body.text.replace(/\{\{\d+\}\}/g, '…');
});

// Form state (language must match template's language in Meta to avoid #132001)
const form = useForm({
    name: 'New broadcast',
    template: '',
    templateName: '',
    language: 'en_US',
    image_media_id: null as string | null,
    usersPerMinute: 60,
    sendTime: 'now',
    file: null as File | null,
});

// Character count for name
const nameCharCount = computed(() => form.name.length);
const maxNameLength = 50;

const isSending = ref(false);

// Fetch templates on mount
onMounted(async () => {
    await fetchTemplates();
});

// Fetch templates from API
const fetchTemplates = async () => {
    isLoadingTemplates.value = true;
    templatesError.value = null;
    
    try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        
        if (data.success) {
            templates.value = data.templates;
        } else {
            templatesError.value = 'Failed to load templates';
        }
    } catch (error) {
        templatesError.value = 'Failed to connect to API';
        console.error('Error fetching templates:', error);
    } finally {
        isLoadingTemplates.value = false;
    }
};

// Handle template selection (use template's exact language code to avoid #132001)
const handleTemplateSelect = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const selectedTemplate = templates.value.find(t => t.name === select.value);
    if (selectedTemplate) {
        form.template = selectedTemplate.name;
        form.templateName = selectedTemplate.name;
        form.language = selectedTemplate.language || 'en_US';
    } else {
        form.template = '';
        form.templateName = '';
        form.language = 'en_US';
    }
};

// Handle file selection
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        // Check file extension
        const validExtensions = ['.txt', '.csv'];
        const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        
        if (validExtensions.includes(fileExtension) || file.type === 'text/plain' || file.type === 'text/csv') {
            processFile(file);
        } else {
            alert('Please upload a .txt or .csv file');
        }
    }
};

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
    const file = event.dataTransfer?.files[0];
    if (file) {
        const validExtensions = ['.txt', '.csv'];
        const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        
        if (validExtensions.includes(fileExtension) || file.type === 'text/plain' || file.type === 'text/csv') {
            processFile(file);
        } else {
            alert('Please upload a .txt or .csv file');
        }
    }
};

// Store phone numbers from file
const phoneNumbers = ref<string[]>([]);

// Process uploaded file
const processFile = (file: File) => {
    selectedFile.value = file;
    fileName.value = file.name;
    form.file = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        phoneNumbersCount.value = lines.length;
        phoneNumbers.value = lines.map(line => line.trim());
    };
    reader.readAsText(file);
};

// Clear file
const clearFile = () => {
    selectedFile.value = null;
    fileName.value = '';
    phoneNumbersCount.value = 0;
    form.file = null;
    if (fileInput.value) fileInput.value.value = '';
};

// Handle image selection and upload
const handleImageSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    imageUploadError.value = null;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        imageUploadError.value = 'Please upload a JPG, PNG, or WEBP image.';
        return;
    }

    selectedImage.value = file;
    if (imagePreviewUrl.value) URL.revokeObjectURL(imagePreviewUrl.value);
    imagePreviewUrl.value = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append('image', file);

    imageUploading.value = true;
    try {
        const response = await fetch('/api/campaign/upload-image', {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (data.success && data.media_id) {
            imageMediaId.value = data.media_id;
            form.image_media_id = data.media_id;
        } else {
            imageUploadError.value = data.error || 'Failed to upload image to WhatsApp.';
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        imageUploadError.value = 'Failed to upload image. Please try again.';
    } finally {
        imageUploading.value = false;
    }
};

const clearImage = () => {
    selectedImage.value = null;
    imageMediaId.value = null;
    form.image_media_id = null;
    if (imagePreviewUrl.value) {
        URL.revokeObjectURL(imagePreviewUrl.value);
        imagePreviewUrl.value = null;
    }
    if (imageInput.value) imageInput.value.value = '';
};

// Open file picker
const openFilePicker = () => {
    if (!fileName.value && fileInput.value) {
        fileInput.value.click();
    }
};

// Handle send button click
const handleSend = async () => {
    if (!selectedFile.value || !form.template || !form.name.trim()) return;
    
    isSending.value = true;
    
    try {
        // Send campaign to API (will be processed via Queue/Horizon)
        const response = await fetch('/api/campaign/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: form.name,
                phone_numbers: phoneNumbers.value,
                template_name: form.template,
                language: form.language || 'en_US',
                image_media_id: form.image_media_id,
                delay_seconds: Math.round(60 / form.usersPerMinute),
            }),
        });
        
        const data = await response.json();
        
        if (data.success && data.campaign) {
            // Navigate to status page with campaign ID
            router.visit(`/campaign-status/${data.campaign.id}`);
        } else {
            alert('Failed to send campaign: ' + (data.error || 'Unknown error'));
            isSending.value = false;
        }
    } catch (error) {
        console.error('Error sending campaign:', error);
        alert('Failed to send campaign. Please try again.');
        isSending.value = false;
    }
};

const canSend = computed(() => {
    return selectedFile.value && form.template && form.name.trim() !== '' && phoneNumbersCount.value > 0 && !isSending.value;
});

// Update users per minute
const updateUsersPerMinute = (value: number) => {
    if (value >= 1 && value <= 1000) form.usersPerMinute = value;
};

// Slider percentage for styling
const sliderPercentage = computed(() => ((form.usersPerMinute - 1) / (1000 - 1)) * 100);
</script>

<template>
    <Head title="Add New Broadcast" />

    <div class="flex h-screen flex-col bg-[#f8f9fa]">
        <!-- Header -->
        <header class="flex-shrink-0 border-b bg-white">
            <div class="flex h-14 items-center justify-between px-6">
                <button 
                    class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    @click="router.visit('/')"
                >
                    <span class="text-gray-400">‹</span>
                    <span>Broadcasts</span>
                </button>
                
                <h1 class="text-base font-semibold text-gray-900">Add New Broadcast</h1>
                
                <div class="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        class="text-gray-600 hover:text-gray-900"
                    >
                        Cancel
                    </Button>
                    <Button 
                        :disabled="!canSend"
                        @click="handleSend"
                        size="sm"
                        class="bg-[#0095f6] hover:bg-[#0086e0] text-white px-6"
                    >
                        Save
                    </Button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-hidden p-6">
            <div class="grid h-full gap-6 lg:grid-cols-2">
                <!-- Left Column -->
                <div class="flex flex-col gap-4 overflow-auto">
                    <!-- Name Section -->
                    <div class="rounded-lg bg-white p-5 shadow-sm">
                        <div class="flex items-center justify-between mb-2">
                            <Label class="text-sm font-medium text-gray-700">Name</Label>
                            <span class="text-xs text-gray-400">{{ nameCharCount }}/{{ maxNameLength }}</span>
                        </div>
                        <Input
                            v-model="form.name"
                            type="text"
                            placeholder="New broadcast"
                            :maxlength="maxNameLength"
                            class="h-10 border-gray-200 bg-white focus:border-[#0095f6] focus:ring-[#0095f6]/20"
                        />
                    </div>

                    <!-- Targeting Section -->
                    <div class="flex-1 rounded-lg bg-white p-5 shadow-sm">
                        <div class="mb-3">
                            <Label class="text-sm font-medium text-gray-700">Targeting</Label>
                            <p class="mt-1 text-sm text-gray-500">
                                <span class="font-semibold text-[#0095f6]">{{ phoneNumbersCount }}</span>
                                targeted users, that match all of the following conditions:
                            </p>
                        </div>

                        <!-- Drop Zone -->
                        <div 
                            @click="openFilePicker"
                            @dragover.prevent
                            @drop.prevent="handleDrop"
                            :class="[
                                'relative rounded-lg border-2 border-dashed transition-all',
                                fileName 
                                    ? 'border-gray-200 bg-white p-4' 
                                    : 'border-gray-300 bg-gray-50 cursor-pointer hover:border-[#0095f6] hover:bg-[#0095f6]/5 p-8'
                            ]"
                        >
                            <input
                                ref="fileInput"
                                type="file"
                                accept=".txt,.csv,text/plain,text/csv,application/csv"
                                class="hidden"
                                @change="handleFileSelect"
                            />
                            
                            <!-- Empty State -->
                            <div v-if="!fileName" class="flex flex-col items-center justify-center gap-2 text-center">
                                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <Upload class="h-4 w-4 text-gray-400" />
                                </div>
                                <p class="text-sm text-gray-500">Click or drag file to upload</p>
                                <p class="text-xs text-gray-400">TXT, CSV files</p>
                            </div>

                            <!-- File Selected -->
                            <div v-else class="flex items-center gap-3">
                                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0095f6]/10">
                                    <FileText class="h-4 w-4 text-[#0095f6]" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="truncate text-sm font-medium text-gray-900">{{ fileName }}</p>
                                    <p class="text-xs text-gray-500">{{ phoneNumbersCount }} numbers</p>
                                </div>
                                <button 
                                    @click.stop="clearFile"
                                    class="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
                                >
                                    <X class="h-4 w-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <!-- Add Condition Button -->
                        <button 
                            v-if="!fileName"
                            @click="fileInput?.click()"
                            class="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-2.5 text-sm text-gray-500 hover:border-[#0095f6] hover:text-[#0095f6] transition-colors"
                        >
                            <Plus class="h-4 w-4" />
                            <span>Add Condition</span>
                        </button>
                    </div>

                    <!-- Optional Image Section -->
                    <div class="rounded-lg bg-white p-5 shadow-sm">
                        <div class="mb-3 flex items-center justify-between">
                            <div>
                                <Label class="text-sm font-medium text-gray-700">Optional image</Label>
                                <p class="mt-1 text-xs text-gray-500">
                                    If the selected template has an image header, this image will be used.
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
                                <template v-if="imagePreviewUrl">
                                    <img :src="imagePreviewUrl" alt="Preview" class="h-full w-full object-cover" />
                                </template>
                                <template v-else>
                                    <ImageIcon class="h-7 w-7 text-gray-300" />
                                </template>
                            </div>
                            <div class="flex-1 space-y-2">
                                <input
                                    ref="imageInput"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    class="hidden"
                                    @change="handleImageSelect"
                                />
                                <div class="flex flex-wrap items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        class="border-gray-300 text-gray-700"
                                        :disabled="imageUploading"
                                        @click="imageInput && imageInput.click()"
                                    >
                                        <Loader2 v-if="imageUploading" class="mr-2 h-4 w-4 animate-spin" />
                                        <template v-else>
                                            <ImageIcon class="mr-2 h-4 w-4" />
                                            Upload image
                                        </template>
                                    </Button>
                                    <button
                                        v-if="selectedImage"
                                        type="button"
                                        class="text-xs text-gray-500 hover:text-gray-700"
                                        @click="clearImage"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <p v-if="selectedImage" class="text-xs text-gray-500">
                                    {{ selectedImage.name }}
                                </p>
                                <p v-if="imageUploadError" class="text-xs text-red-600">
                                    {{ imageUploadError }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="flex flex-col gap-4 overflow-auto">
                    <!-- Broadcast Type -->
                    <div class="rounded-lg bg-white p-5 shadow-sm">
                        <div class="flex items-center justify-between">
                            <Label class="text-sm font-medium text-gray-700">Broadcast Type</Label>
                            <Badge class="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-xs font-medium">
                                DEFAULT
                            </Badge>
                        </div>
                    </div>

                    <!-- Message to send -->
                    <div class="rounded-lg bg-white p-5 shadow-sm">
                        <Label class="text-sm font-medium text-gray-700 mb-3 block">Message to send</Label>
                        
                        <!-- Loading State -->
                        <div v-if="isLoadingTemplates" class="flex items-center justify-center py-4">
                            <Loader2 class="h-5 w-5 animate-spin text-[#0095f6]" />
                            <span class="ml-2 text-sm text-gray-500">Loading templates...</span>
                        </div>

                        <!-- Error State -->
                        <div v-else-if="templatesError" class="rounded-lg border border-red-200 bg-red-50 p-4">
                            <p class="text-sm text-red-600">{{ templatesError }}</p>
                            <button 
                                @click="fetchTemplates"
                                class="mt-2 text-sm text-[#0095f6] hover:underline"
                            >
                                Try again
                            </button>
                        </div>

                        <!-- Templates Dropdown -->
                        <div v-else class="relative rounded-lg border border-gray-200 bg-white overflow-hidden">
                            <select
                                v-model="form.template"
                                @change="handleTemplateSelect"
                                class="w-full appearance-none bg-transparent px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0095f6]/20 focus:border-[#0095f6]"
                            >
                                <option value="">Choose Template</option>
                                <option 
                                    v-for="template in templates" 
                                    :key="template.id" 
                                    :value="template.name"
                                >
                                    {{ template.name }} ({{ template.language }})
                                </option>
                            </select>
                            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        
                        <p v-if="!form.template && !isLoadingTemplates && !templatesError" class="mt-3 text-center text-sm text-[#0095f6]">
                            Choose Template
                        </p>
                        
                        <!-- Selected Template Info -->
                        <div v-if="form.template" class="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                            <p class="text-sm font-medium text-green-700">Selected: {{ form.template }}</p>
                        </div>

                        <!-- No Templates Message -->
                        <div v-if="!isLoadingTemplates && !templatesError && templates.length === 0" class="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                            <p class="text-sm text-yellow-700">No approved templates found. Please create templates in Meta Business Suite.</p>
                        </div>
                    </div>

                    <!-- Max bot users per minute -->
                    <div class="rounded-lg bg-white p-5 shadow-sm">
                        <Label class="text-sm font-medium text-gray-700 mb-3 block">Max bot users per minute</Label>
                        
                        <!-- Slider -->
                        <div class="mb-3">
                            <input
                                type="range"
                                :min="1"
                                :max="1000"
                                :value="form.usersPerMinute"
                                @input="updateUsersPerMinute(Number(($event.target as HTMLInputElement).value))"
                                class="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                                :style="{
                                    background: `linear-gradient(to right, #0095f6 0%, #0095f6 ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`
                                }"
                            />
                        </div>

                        <!-- Controls -->
                        <div class="flex items-center justify-end gap-2">
                            <button
                                @click="updateUsersPerMinute(form.usersPerMinute - 1)"
                                class="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            >
                                <Minus class="h-3 w-3" />
                            </button>
                            <input
                                v-model.number="form.usersPerMinute"
                                type="number"
                                min="1"
                                max="1000"
                                class="h-8 w-14 rounded border border-gray-200 bg-white px-2 text-center text-sm focus:border-[#0095f6] focus:outline-none"
                            />
                            <button
                                @click="updateUsersPerMinute(form.usersPerMinute + 1)"
                                class="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                            >
                                <Plus class="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    <!-- When to send -->
                    <div class="rounded-lg bg-white p-5 shadow-sm">
                        <Label class="text-sm font-medium text-gray-700 mb-3 block">When to send this message?</Label>
                        <div class="relative rounded-lg border border-gray-200 bg-white overflow-hidden">
                            <select
                                v-model="form.sendTime"
                                class="w-full appearance-none bg-transparent px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0095f6]/20 focus:border-[#0095f6]"
                            >
                                <option value="now">Now</option>
                                <option value="schedule">Schedule</option>
                            </select>
                            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <!-- Save Button -->
                    <Button 
                        :disabled="!canSend"
                        @click="handleSend"
                        class="h-10 bg-[#0095f6] hover:bg-[#0086e0] text-white font-medium"
                    >
                        <span v-if="!isSending">Save</span>
                        <span v-else class="flex items-center gap-2">
                            <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                            Saving...
                        </span>
                    </Button>

                    <!-- WhatsApp Preview -->
                    <div class="mt-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                        <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                            WhatsApp preview
                        </p>
                        <!-- Phone frame -->
                        <div class="relative mx-auto w-full max-w-[270px]">
                            <!-- Outer phone body -->
                            <div class="rounded-[2.5rem] border border-gray-300 bg-neutral-100 p-2 shadow-xl shadow-gray-300/70">
                                <!-- Inner screen -->
                                <div class="relative h-[460px] rounded-[2rem] bg-[#f0f2f5] text-slate-900 overflow-hidden">
                                    <!-- Notch / sensors -->
                                    <div class="pointer-events-none absolute left-1/2 top-2 z-20 flex -translate-x-1/2 items-center gap-6 text-[8px] text-gray-400">
                                        <div class="flex items-center gap-1">
                                            <span class="inline-block h-1 w-6 rounded-full bg-black/60"></span>
                                            <span class="inline-block h-2 w-2 rounded-full bg-black/70"></span>
                                        </div>
                                        <span class="font-medium">9:41</span>
                                        <div class="flex items-center gap-0.5">
                                            <span class="inline-block h-1 w-3 rounded-full bg-white/70"></span>
                                            <span class="inline-block h-2 w-3 rounded-[3px] border border-white/60">
                                                <span class="block h-full w-1.5 bg-white/80"></span>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex h-full flex-col rounded-[2rem] overflow-hidden">
                                        <!-- Chat header -->
                                        <div class="mt-5 flex items-center gap-2 bg-white/95 px-3 py-2.5 text-xs shadow-sm">
                                            <div class="h-7 w-7 rounded-full bg-[#e4e6eb] ring-1 ring-white/60" />
                                            <div class="min-w-0 flex-1">
                                                <p class="truncate text-[11px] font-semibold">
                                                    {{ selectedTemplateObject?.name || 'WhatsApp Contact' }}
                                                </p>
                                                <p class="text-[10px] text-emerald-500">
                                                    online
                                                </p>
                                            </div>
                                            <div class="flex items-center gap-1 text-[9px] text-gray-400">
                                                <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                <span>WA</span>
                                            </div>
                                        </div>

                                        <!-- Chat area -->
                                        <div class="flex-1 bg-[url('https://static.whatsapp.net/rsrc.php/v4/yb/r/_YUsG-2D_Dg.png')] bg-cover bg-center/140 px-3 pb-3 pt-4 text-[11px] leading-snug">
                                            <div class="space-y-2">
                                                <!-- Image bubble -->
                                                <div v-if="imagePreviewUrl" class="flex justify-start">
                                                    <div class="max-w-[78%] overflow-hidden rounded-xl bg-white ring-1 ring-black/5 shadow-sm">
                                                        <img :src="imagePreviewUrl" alt="Image preview" class="h-32 w-full object-cover" />
                                                    </div>
                                                </div>
                                                <!-- Text bubble -->
                                                <div class="flex justify-start">
                                                    <div class="max-w-[80%] rounded-xl rounded-bl-sm bg-white px-3 py-2 text-[11px] text-slate-900 shadow-sm shadow-black/10 border border-gray-200/80">
                                                        <p v-if="templateBodyPreview">
                                                            {{ templateBodyPreview }}
                                                        </p>
                                                        <p v-else class="text-gray-400">
                                                            Choose a template to see how the message will look here.
                                                        </p>
                                                        <div class="mt-1 flex justify-end text-[9px] text-gray-400">
                                                            <span>09:41</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0095f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0095f6;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
