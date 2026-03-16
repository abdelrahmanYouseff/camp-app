<?php

namespace App\Http\Controllers;

use App\Jobs\SendCampaignJob;
use App\Models\Campaign;
use App\Models\WhatsAppAccount;
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
            'image_media_id' => 'nullable|string',
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
            'image_media_id' => $request->input('image_media_id'),
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

    /**
     * List WhatsApp phone numbers and current sending number
     */
    public function whatsappPhoneNumbers(): JsonResponse
    {
        try {
            $phones = $this->whatsApp->getPhoneNumbers();
            $activeId = $this->whatsApp->getActivePhoneNumberId();

            return response()->json([
                'success' => true,
                'phone_numbers' => $phones,
                'active_phone_number_id' => $activeId,
            ]);
        } catch (\Throwable $e) {
            Log::error('whatsappPhoneNumbers failed', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'error' => 'Server error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Set which phone number is used for sending (by account id from DB)
     */
    public function setActiveWhatsAppPhone(Request $request): JsonResponse
    {
        $request->validate([
            'phone_number_id' => 'required', // can be string (legacy) or numeric (whatsapp_accounts.id)
        ]);

        $idOrPhoneNumberId = $request->input('phone_number_id');

        if (is_numeric($idOrPhoneNumberId) && WhatsAppAccount::where('id', (int) $idOrPhoneNumberId)->exists()) {
            WhatsAppAccount::query()->update(['is_active' => false]);
            WhatsAppAccount::where('id', (int) $idOrPhoneNumberId)->update(['is_active' => true]);
            return response()->json([
                'success' => true,
                'active_phone_number_id' => (string) $idOrPhoneNumberId,
            ]);
        }

        $phones = $this->whatsApp->getPhoneNumbers();
        $ids = array_column($phones, 'id');
        if (! in_array($idOrPhoneNumberId, $ids, true)) {
            return response()->json([
                'success' => false,
                'error' => 'Phone number not in your WhatsApp account',
            ], 400);
        }

        $key = WhatsAppService::SETTING_ACTIVE_PHONE_NUMBER_ID;
        $exists = DB::table('settings')->where('key', $key)->exists();
        if ($exists) {
            DB::table('settings')->where('key', $key)->update(['value' => $idOrPhoneNumberId, 'updated_at' => now()]);
        } else {
            DB::table('settings')->insert([
                'key' => $key,
                'value' => $idOrPhoneNumberId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'active_phone_number_id' => $idOrPhoneNumberId,
        ]);
    }

    /**
     * Add a new WhatsApp account (phone number + credentials)
     */
    public function storeWhatsAppAccount(Request $request): JsonResponse
    {
        $request->validate([
            'phone_number' => 'required|string|max:32',
            'label' => 'nullable|string|max:255',
            'phone_number_id' => 'required|string|max:64',
            'business_account_id' => 'required|string|max:64',
            'access_token' => 'required|string',
        ]);

        $isFirst = ! WhatsAppAccount::exists();

        $account = WhatsAppAccount::create([
            'phone_number' => $request->input('phone_number'),
            'label' => $request->input('label') ? trim($request->input('label')) : null,
            'phone_number_id' => $request->input('phone_number_id'),
            'business_account_id' => $request->input('business_account_id'),
            'access_token' => $request->input('access_token'),
            'is_active' => $isFirst,
        ]);

        return response()->json([
            'success' => true,
            'account' => [
                'id' => $account->id,
                'phone_number' => $account->phone_number,
                'label' => $account->label,
                'phone_number_id' => $account->phone_number_id,
                'business_account_id' => $account->business_account_id,
                'is_active' => $account->is_active,
            ],
        ]);
    }

    /**
     * Update WhatsApp account label (اسم/وصف الرقم)
     */
    public function updateWhatsAppAccountLabel(Request $request, WhatsAppAccount $account): JsonResponse
    {
        $request->validate([
            'label' => 'nullable|string|max:255',
        ]);

        $account->update([
            'label' => $request->input('label') ? trim($request->input('label')) : null,
        ]);

        return response()->json([
            'success' => true,
            'label' => $account->label,
        ]);
    }

    /**
     * Upload an image to WhatsApp and return media_id for use in campaigns.
     */
    public function uploadCampaignImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $file = $request->file('image');
        $path = $file->getRealPath();
        $mime = $file->getMimeType() ?? 'image/jpeg';

        $mediaId = $this->whatsApp->uploadImageToWhatsApp($path, $mime);

        if (! $mediaId) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to upload image to WhatsApp',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'media_id' => $mediaId,
        ]);
    }
}
