<?php

namespace App\Http\Controllers;

use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WhatsAppController extends Controller
{
    public function __construct(
        protected WhatsAppService $whatsApp
    ) {}

    /**
     * Get all approved message templates
     */
    public function templates(): JsonResponse
    {
        $templates = $this->whatsApp->getTemplates();

        return response()->json([
            'success' => true,
            'templates' => $templates,
        ]);
    }

    /**
     * Send a campaign to multiple phone numbers (via Queue)
     */
    public function sendCampaign(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'phone_numbers' => 'required|array',
            'phone_numbers.*' => 'required|string',
            'template_name' => 'required|string',
            'language' => 'nullable|string',
            'delay_seconds' => 'nullable|integer|min:1',
        ]);

        $inputPhoneNumbers = $request->input('phone_numbers');
        
        // Allow sending to same phone numbers multiple times
        // No filtering of duplicate phone numbers from previous campaigns

        // Create campaign record with all phone numbers
        $campaign = Campaign::create([
            'name' => $request->input('name'),
            'template_name' => $request->input('template_name'),
            'language' => $request->input('language', 'en_US'),
            'phone_numbers' => $inputPhoneNumbers,
            'total_recipients' => count($inputPhoneNumbers),
            'delay_seconds' => $request->input('delay_seconds', 1),
            'status' => 'pending',
        ]);

        Log::info('Campaign created', ['campaign_id' => $campaign->id]);

        // Dispatch job to queue
        SendCampaignJob::dispatch($campaign);

        return response()->json([
            'success' => true,
            'campaign' => $campaign,
            'message' => 'Campaign queued for processing',
        ]);
    }

    /**
     * Get campaign status
     */
    public function getCampaignStatus(Campaign $campaign): JsonResponse
    {
        return response()->json([
            'success' => true,
            'campaign' => $campaign,
            'progress' => $campaign->progress,
        ]);
    }

    /**
     * Get all campaigns
     */
    public function getCampaigns(): JsonResponse
    {
        $campaigns = Campaign::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'campaigns' => $campaigns,
        ]);
    }

    /**
     * Pause a campaign
     */
    public function pauseCampaign(Campaign $campaign): JsonResponse
    {
        if ($campaign->status !== 'processing') {
            return response()->json([
                'success' => false,
                'error' => 'Campaign is not processing',
            ], 400);
        }

        $campaign->pause();

        Log::info('Campaign paused', ['campaign_id' => $campaign->id]);

        return response()->json([
            'success' => true,
            'message' => 'Campaign paused successfully',
            'campaign' => $campaign->fresh(),
        ]);
    }

    /**
     * Resume a paused campaign
     */
    public function resumeCampaign(Campaign $campaign): JsonResponse
    {
        if (!$campaign->isPaused()) {
            return response()->json([
                'success' => false,
                'error' => 'Campaign is not paused',
            ], 400);
        }

        $campaign->resume();

        // Dispatch job to continue processing
        SendCampaignJob::dispatch($campaign);

        Log::info('Campaign resumed', ['campaign_id' => $campaign->id]);

        return response()->json([
            'success' => true,
            'message' => 'Campaign resumed successfully',
            'campaign' => $campaign->fresh(),
        ]);
    }

    /**
     * Retry/Start a pending campaign
     */
    public function retryCampaign(Campaign $campaign): JsonResponse
    {
        if ($campaign->status === 'completed') {
            return response()->json([
                'success' => false,
                'error' => 'Campaign is already completed',
            ], 400);
        }

        if ($campaign->status === 'processing' && !$campaign->isPaused()) {
            return response()->json([
                'success' => false,
                'error' => 'Campaign is already processing',
            ], 400);
        }

        // If paused, resume it
        if ($campaign->isPaused()) {
            $campaign->resume();
        }

        // Update status to pending if needed
        if ($campaign->status !== 'pending' && $campaign->status !== 'processing') {
            $campaign->update(['status' => 'pending']);
        }

        // Dispatch job to start/continue processing
        SendCampaignJob::dispatch($campaign);

        Log::info('Campaign job dispatched', ['campaign_id' => $campaign->id]);

        return response()->json([
            'success' => true,
            'message' => 'Campaign job dispatched successfully',
            'campaign' => $campaign->fresh(),
        ]);
    }
}
