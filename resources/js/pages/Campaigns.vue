<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';
import { Plus, RefreshCw, Search, Info, MessageCircle } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';

interface Campaign {
    id: number;
    name: string;
    template_name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    created_at: string;
}

const campaigns = ref<Campaign[]>([]);
const isLoading = ref(true);
const searchQuery = ref('');

const fetchCampaigns = async () => {
    isLoading.value = true;
    try {
        const response = await fetch('/api/campaigns');
        const data = await response.json();
        if (data.success) {
            campaigns.value = data.campaigns;
        }
    } catch (error) {
        console.error('Error fetching campaigns:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchCampaigns();
});

const filteredCampaigns = computed(() => {
    if (!searchQuery.value) return campaigns.value;
    return campaigns.value.filter(c => 
        c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').substring(0, 19);
};
</script>

<template>
    <Head title="Broadcasts" />

    <div class="min-h-screen bg-white">
        <!-- Header -->
        <header class="border-b border-gray-200 bg-white px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <h1 class="text-lg font-semibold text-gray-900">Broadcasts</h1>
                    <Info class="h-4 w-4 text-gray-400 cursor-help" />
                </div>
                
                <div class="flex items-center gap-3">
                    <button 
                        @click="fetchCampaigns"
                        class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                        :disabled="isLoading"
                    >
                        <RefreshCw :class="['h-4 w-4', isLoading && 'animate-spin']" />
                    </button>
                    <button 
                        @click="router.visit('/new')"
                        class="flex h-9 items-center gap-2 rounded-lg bg-[#0095f6] px-4 text-sm font-medium text-white hover:bg-[#0086e0] transition-colors"
                    >
                        <Plus class="h-4 w-4" />
                        Broadcast
                    </button>
                </div>
            </div>
        </header>

        <!-- Search -->
        <div class="border-b border-gray-200 bg-white px-6 py-4">
            <div class="relative max-w-xs">
                <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Search name"
                    class="h-9 w-full rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:ring-0"
                />
                <button class="absolute right-0 top-0 flex h-9 w-9 items-center justify-center text-gray-400">
                    <Search class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-gray-200">
                        <th class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500">
                            Name
                        </th>
                        <th class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500">
                            Message to send
                        </th>
                        <th class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500">
                            Status
                        </th>
                        <th class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-gray-500">
                            Receivers
                        </th>
                        <th class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-gray-500">
                            Sent
                        </th>
                        <th class="whitespace-nowrap px-6 py-3 text-right text-xs font-medium text-gray-500">
                            Failed
                        </th>
                        <th class="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500">
                            Scheduled Time
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr 
                        v-for="campaign in filteredCampaigns" 
                        :key="campaign.id"
                        class="hover:bg-gray-50 cursor-pointer transition-colors"
                        @click="router.visit(`/campaign-status/${campaign.id}`)"
                    >
                        <!-- Name -->
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="flex flex-col gap-1">
                                <span class="text-sm font-medium text-gray-900">{{ campaign.name }}</span>
                                <span class="inline-flex w-fit rounded bg-[#e8f5e9] px-1.5 py-0.5 text-[10px] font-medium uppercase text-[#2e7d32]">
                                    DEFAULT
                                </span>
                            </div>
                        </td>

                        <!-- Message to send -->
                        <td class="whitespace-nowrap px-6 py-4">
                            <div class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#25d366]">
                                    <MessageCircle class="h-3.5 w-3.5 text-white" />
                                </div>
                                <span class="text-sm text-gray-700">{{ campaign.template_name }}</span>
                            </div>
                        </td>

                        <!-- Status -->
                        <td class="whitespace-nowrap px-6 py-4">
                            <span
                                :class="[
                                    'inline-flex rounded-full px-3 py-1 text-xs font-medium',
                                    campaign.status === 'completed' ? 'bg-[#e8f5e9] text-[#2e7d32]' :
                                    campaign.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                                    campaign.status === 'failed' ? 'bg-red-50 text-red-600' :
                                    'bg-amber-50 text-amber-600'
                                ]"
                            >
                                {{ campaign.status === 'completed' ? 'Completed' : 
                                   campaign.status === 'processing' ? 'Processing' :
                                   campaign.status === 'failed' ? 'Failed' : 'Pending' }}
                            </span>
                        </td>

                        <!-- Receivers -->
                        <td class="whitespace-nowrap px-6 py-4 text-right">
                            <span class="text-sm text-gray-900">{{ campaign.total_recipients }}</span>
                        </td>

                        <!-- Sent -->
                        <td class="whitespace-nowrap px-6 py-4 text-right">
                            <span class="text-sm text-gray-900">{{ campaign.sent_count }}</span>
                        </td>

                        <!-- Failed -->
                        <td class="whitespace-nowrap px-6 py-4 text-right">
                            <span class="text-sm text-gray-900">{{ campaign.failed_count }}</span>
                        </td>

                        <!-- Scheduled Time -->
                        <td class="whitespace-nowrap px-6 py-4">
                            <span class="text-sm text-gray-500">{{ formatDate(campaign.created_at) }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="!isLoading && filteredCampaigns.length === 0" class="flex flex-col items-center justify-center py-20">
                <p class="text-sm text-gray-500">No broadcasts found</p>
                <button 
                    @click="router.visit('/new')"
                    class="mt-4 flex h-9 items-center gap-2 rounded-lg bg-[#0095f6] px-4 text-sm font-medium text-white hover:bg-[#0086e0] transition-colors"
                >
                    <Plus class="h-4 w-4" />
                    Create Broadcast
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-20">
                <RefreshCw class="h-6 w-6 animate-spin text-gray-400" />
            </div>
        </div>
    </div>
</template>
