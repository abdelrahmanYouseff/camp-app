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
    Loader2
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
}

// File upload state
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const phoneNumbersCount = ref<number>(0);
const fileName = ref<string>('');

// Templates state
const templates = ref<Template[]>([]);
const isLoadingTemplates = ref(true);
const templatesError = ref<string | null>(null);

// Form state
const form = useForm({
    name: 'New broadcast',
    template: '',
    templateName: '',
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

// Handle template selection
const handleTemplateSelect = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    const selectedTemplate = templates.value.find(t => t.name === select.value);
    if (selectedTemplate) {
        form.template = selectedTemplate.name;
        form.templateName = selectedTemplate.name;
    } else {
        form.template = '';
        form.templateName = '';
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
                language: 'en',
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
