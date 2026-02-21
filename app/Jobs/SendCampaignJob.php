<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendCampaignJob implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 1;

    /**
     * The maximum number of seconds the job can run.
     */
    public int $timeout = 3600; // 1 hour

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Campaign $campaign
    ) {}

    /**
     * Execute the job.
     */
    public function handle(WhatsAppService $whatsApp): void
    {
        Log::info('Starting campaign job', ['campaign_id' => $this->campaign->id]);

        // Update campaign status to processing
        $this->campaign->update([
            'status' => 'processing',
            'started_at' => now(),
        ]);

        $results = [];
        $sentCount = 0;
        $failedCount = 0;

        foreach ($this->campaign->phone_numbers as $phone) {
            try {
                $result = $whatsApp->sendTemplate(
                    $phone,
                    $this->campaign->template_name,
                    $this->campaign->language
                );

                if ($result['success']) {
                    $sentCount++;
                    $results[] = [
                        'phone' => $phone,
                        'success' => true,
                        'message_id' => $result['data']['messages'][0]['id'] ?? null,
                    ];
                } else {
                    $failedCount++;
                    $results[] = [
                        'phone' => $phone,
                        'success' => false,
                        'error' => $result['data']['error']['message'] ?? 'Unknown error',
                    ];
                }

                // Update campaign progress in real-time
                $this->campaign->update([
                    'sent_count' => $sentCount,
                    'failed_count' => $failedCount,
                    'results' => $results,
                ]);

                // Add delay between messages
                if ($this->campaign->delay_seconds > 0) {
                    sleep($this->campaign->delay_seconds);
                }

            } catch (\Exception $e) {
                $failedCount++;
                $results[] = [
                    'phone' => $phone,
                    'success' => false,
                    'error' => $e->getMessage(),
                ];

                Log::error('Error sending to phone', [
                    'campaign_id' => $this->campaign->id,
                    'phone' => $phone,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Mark campaign as completed
        $this->campaign->update([
            'status' => 'completed',
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
            'results' => $results,
            'completed_at' => now(),
        ]);

        Log::info('Campaign completed', [
            'campaign_id' => $this->campaign->id,
            'sent' => $sentCount,
            'failed' => $failedCount,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Campaign job failed', [
            'campaign_id' => $this->campaign->id,
            'error' => $exception->getMessage(),
        ]);

        $this->campaign->update([
            'status' => 'failed',
            'completed_at' => now(),
        ]);
    }
}
