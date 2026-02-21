<?php

namespace App\Http\Controllers;

use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use App\Services\WhatsAppService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

        // Create campaign record
        $campaign = Campaign::create([
            'name' => $request->input('name'),
            'template_name' => $request->input('template_name'),
            'language' => $request->input('language', 'en'),
            'phone_numbers' => $request->input('phone_numbers'),
            'total_recipients' => count($request->input('phone_numbers')),
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
}
