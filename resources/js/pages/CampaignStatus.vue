<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { 
    MessageSquare, 
    CheckCircle2, 
    RefreshCw, 
    Users, 
    Send, 
    XCircle, 
    Clock,
    ArrowLeft,
    Calendar,
    Zap,
    TrendingUp,
    AlertCircle,
    Loader2
} from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';

type Props = {
    campaign: {
        id: string | number;
        name: string;
        template: string;
        status: 'pending' | 'processing' | 'completed' | 'failed';
        receivers: number;
        sent: number;
        failed: number;
        progress?: number;
        scheduledTime: string;
    };
};

const props = defineProps<Props>();

// Live data from API
const liveData = ref({
    sent: props.campaign.sent,
    failed: props.campaign.failed,
    status: props.campaign.status,
    progress: props.campaign.progress || 0,
});

const isRefreshing = ref(false);

// Polling interval
let interval: ReturnType<typeof setInterval> | null = null;

// Fetch campaign status from API
const fetchStatus = async () => {
    try {
        const response = await fetch(`/api/campaign/${props.campaign.id}`);
        const data = await response.json();
        
        if (data.success && data.campaign) {
            liveData.value = {
                sent: data.campaign.sent_count,
                failed: data.campaign.failed_count,
                status: data.campaign.status,
                progress: data.progress,
            };
            
            if (data.campaign.status === 'completed' || data.campaign.status === 'failed') {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching campaign status:', error);
    }
};

onMounted(() => {
    if (props.campaign.status === 'pending' || props.campaign.status === 'processing') {
        fetchStatus();
        interval = setInterval(fetchStatus, 2000);
    }
});

onUnmounted(() => {
    if (interval) clearInterval(interval);
});

const statusConfig = {
    pending: { 
        label: 'Pending', 
        color: 'amber',
        bgColor: 'bg-amber-500/10', 
        textColor: 'text-amber-600',
        borderColor: 'border-amber-500/20',
        icon: Clock 
    },
    processing: { 
        label: 'Processing', 
        color: 'blue',
        bgColor: 'bg-blue-500/10', 
        textColor: 'text-blue-600',
        borderColor: 'border-blue-500/20',
        icon: Loader2 
    },
    completed: { 
        label: 'Completed', 
        color: 'emerald',
        bgColor: 'bg-emerald-500/10', 
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-500/20',
        icon: CheckCircle2 
    },
    failed: { 
        label: 'Failed', 
        color: 'red',
        bgColor: 'bg-red-500/10', 
        textColor: 'text-red-600',
        borderColor: 'border-red-500/20',
        icon: AlertCircle 
    },
};

const currentStatus = computed(() => statusConfig[liveData.value.status] || statusConfig.pending);

const progressPercentage = computed(() => {
    if (props.campaign.receivers === 0) return 0;
    return Math.round(((liveData.value.sent + liveData.value.failed) / props.campaign.receivers) * 100);
});

const successRate = computed(() => {
    const total = liveData.value.sent + liveData.value.failed;
    if (total === 0) return 0;
    return Math.round((liveData.value.sent / total) * 100);
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const handleRefresh = async () => {
    isRefreshing.value = true;
    await fetchStatus();
    setTimeout(() => {
        isRefreshing.value = false;
    }, 500);
};
</script>

<template>
    <Head :title="`Campaign: ${campaign.name}`" />

    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <!-- Header -->
        <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex h-16 items-center justify-between">
                    <div class="flex items-center gap-4">
                        <button 
                            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                            @click="router.visit('/')"
                        >
                            <ArrowLeft class="h-4 w-4" />
                            <span>Back to Campaigns</span>
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm"
                            class="gap-2"
                            @click="handleRefresh"
                            :disabled="isRefreshing"
                        >
                            <RefreshCw :class="['h-4 w-4', isRefreshing && 'animate-spin']" />
                            Refresh
                        </Button>
                        <Button 
                            size="sm"
                            class="gap-2 bg-slate-900 hover:bg-slate-800"
                            @click="router.visit('/new')"
                        >
                            <Zap class="h-4 w-4" />
                            New Campaign
                        </Button>
                    </div>
                </div>
            </div>
        </header>

        <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <!-- Campaign Header Card -->
            <div class="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div class="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
                    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div class="flex items-center gap-3">
                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900">
                                    <MessageSquare class="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 class="text-xl font-bold text-slate-900">{{ campaign.name }}</h1>
                                    <p class="text-sm text-slate-500">Campaign ID: #{{ campaign.id }}</p>
                                </div>
                            </div>
                        </div>
                        <div 
                            :class="[
                                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold',
                                currentStatus.bgColor,
                                currentStatus.textColor,
                                currentStatus.borderColor
                            ]"
                        >
                            <component 
                                :is="currentStatus.icon" 
                                :class="['h-4 w-4', liveData.status === 'processing' && 'animate-spin']"
                            />
                            {{ currentStatus.label }}
                        </div>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-slate-700">Progress</span>
                        <span class="text-sm font-bold text-slate-900">{{ progressPercentage }}%</span>
                    </div>
                    <div class="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div 
                            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                            :style="{ width: `${progressPercentage}%` }"
                        ></div>
                    </div>
                    <div class="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{{ liveData.sent + liveData.failed }} of {{ campaign.receivers }} processed</span>
                        <span v-if="liveData.status === 'processing'" class="flex items-center gap-1 text-blue-600">
                            <Loader2 class="h-3 w-3 animate-spin" />
                            Processing...
                        </span>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <!-- Total Recipients -->
                <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/5 transition-transform group-hover:scale-150"></div>
                    <div class="relative">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                            <Users class="h-6 w-6 text-blue-600" />
                        </div>
                        <p class="text-sm font-medium text-slate-500">Total Recipients</p>
                        <p class="mt-1 text-3xl font-bold text-slate-900">{{ campaign.receivers }}</p>
                    </div>
                </div>

                <!-- Sent -->
                <div class="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 transition-transform group-hover:scale-150"></div>
                    <div class="relative">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                            <Send class="h-6 w-6 text-emerald-600" />
                        </div>
                        <p class="text-sm font-medium text-emerald-600">Successfully Sent</p>
                        <p class="mt-1 text-3xl font-bold text-emerald-700">{{ liveData.sent }}</p>
                    </div>
                </div>

                <!-- Failed -->
                <div class="group relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-500/10 transition-transform group-hover:scale-150"></div>
                    <div class="relative">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20">
                            <XCircle class="h-6 w-6 text-red-600" />
                        </div>
                        <p class="text-sm font-medium text-red-600">Failed</p>
                        <p class="mt-1 text-3xl font-bold text-red-700">{{ liveData.failed }}</p>
                    </div>
                </div>

                <!-- Success Rate -->
                <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-500/5 transition-transform group-hover:scale-150"></div>
                    <div class="relative">
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
                            <TrendingUp class="h-6 w-6 text-violet-600" />
                        </div>
                        <p class="text-sm font-medium text-slate-500">Success Rate</p>
                        <p class="mt-1 text-3xl font-bold text-slate-900">{{ successRate }}%</p>
                    </div>
                </div>
            </div>

            <!-- Campaign Details Table -->
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div class="border-b border-slate-100 bg-slate-50 px-6 py-4">
                    <h2 class="text-lg font-semibold text-slate-900">Campaign Details</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-slate-100 bg-slate-50/50">
                                <th class="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Property
                                </th>
                                <th class="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Campaign Name
                                </td>
                                <td class="px-6 py-4 text-sm font-semibold text-slate-900">
                                    {{ campaign.name }}
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Template
                                </td>
                                <td class="px-6 py-4">
                                    <div class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                                        <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                                            <MessageSquare class="h-3 w-3 text-white" />
                                        </div>
                                        <span class="text-sm font-medium text-slate-700">{{ campaign.template }}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Status
                                </td>
                                <td class="px-6 py-4">
                                    <span 
                                        :class="[
                                            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                                            currentStatus.bgColor,
                                            currentStatus.textColor,
                                            currentStatus.borderColor
                                        ]"
                                    >
                                        <component 
                                            :is="currentStatus.icon" 
                                            :class="['h-3.5 w-3.5', liveData.status === 'processing' && 'animate-spin']"
                                        />
                                        {{ currentStatus.label }}
                                    </span>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Total Recipients
                                </td>
                                <td class="px-6 py-4 text-sm font-semibold text-slate-900">
                                    {{ campaign.receivers }}
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Successfully Sent
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm font-bold text-emerald-600">{{ liveData.sent }}</span>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Failed
                                </td>
                                <td class="px-6 py-4">
                                    <span class="text-sm font-bold text-red-600">{{ liveData.failed }}</span>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Progress
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                                            <div 
                                                class="h-full rounded-full bg-blue-500 transition-all duration-300"
                                                :style="{ width: `${progressPercentage}%` }"
                                            ></div>
                                        </div>
                                        <span class="text-sm font-bold text-slate-900">{{ progressPercentage }}%</span>
                                    </div>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-slate-50/50">
                                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                    Created At
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2 text-sm text-slate-700">
                                        <Calendar class="h-4 w-4 text-slate-400" />
                                        {{ formatDate(campaign.scheduledTime) }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>
