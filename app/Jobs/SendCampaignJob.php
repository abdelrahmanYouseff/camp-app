<?php

namespace App\Jobs;

use App\Models\Campaign;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
     * Check if campaign is paused and stop execution if so
     * Uses direct database query for more reliable checking
     */
    private function checkPauseAndStop(int $currentIndex): bool
    {
        // Use direct database query instead of refresh for more reliability
        $pausedAt = DB::table('campaigns')
            ->where('id', $this->campaign->id)
            ->value('paused_at');
        
        if ($pausedAt !== null) {
            Log::info('Campaign paused during execution', [
                'campaign_id' => $this->campaign->id,
                'last_processed_index' => $currentIndex,
                'paused_at' => $pausedAt,
            ]);
            
            // Refresh campaign model and save current progress
            $this->campaign->refresh();
            $this->campaign->update([
                'last_processed_index' => $currentIndex,
            ]);
            
            return true; // Stop execution
        }
        
        return false; // Continue execution
    }

    /**
     * Apply delay with pause checking
     * Uses direct database query for more reliable checking
     */
    private function applyDelayWithPauseCheck(float $delaySeconds): bool
    {
        // Split delay into small chunks (0.2 seconds each) to check for pause more frequently
        $chunkSize = 0.2; // 200ms chunks - check more frequently
        $remaining = $delaySeconds;
        
        while ($remaining > 0) {
            // Check if paused using direct database query (more reliable than refresh)
            $pausedAt = DB::table('campaigns')
                ->where('id', $this->campaign->id)
                ->value('paused_at');
            
            if ($pausedAt !== null) {
                Log::info('Campaign paused during delay', [
                    'campaign_id' => $this->campaign->id,
                    'paused_at' => $pausedAt,
                ]);
                return true; // Paused, stop delay
            }
            
            // Sleep for chunk or remaining time, whichever is smaller
            $sleepTime = min($chunkSize, $remaining);
            
            if (function_exists('usleep')) {
                usleep((int)($sleepTime * 1000000));
            } else {
                sleep((int)ceil($sleepTime));
            }
            
            $remaining -= $sleepTime;
        }
        
        return false; // Not paused
    }

    /**
     * Execute the job.
     */
    public function handle(WhatsAppService $whatsApp): void
    {
        Log::info('Starting campaign job', ['campaign_id' => $this->campaign->id]);

        // Check if campaign is paused using direct database query (more reliable)
        $pausedAt = DB::table('campaigns')
            ->where('id', $this->campaign->id)
            ->value('paused_at');
        
        if ($pausedAt !== null) {
            Log::info('Campaign is paused, stopping execution', [
                'campaign_id' => $this->campaign->id,
                'paused_at' => $pausedAt,
            ]);
            return;
        }
        
        // Refresh campaign to get latest data
        $this->campaign->refresh();

        // Update campaign status to processing (if not already)
        if ($this->campaign->status !== 'processing') {
            $this->campaign->update([
                'status' => 'processing',
                'started_at' => $this->campaign->started_at ?? now(),
                'paused_at' => null, // Clear pause if resuming
            ]);
        }

        // Load existing results or start fresh
        $results = $this->campaign->results ?? [];
        $sentCount = $this->campaign->sent_count ?? 0;
        $failedCount = $this->campaign->failed_count ?? 0;
        $totalRecipients = count($this->campaign->phone_numbers);
        $delaySeconds = $this->campaign->delay_seconds ?? 1;
        
        // Start from last processed index (for resume functionality)
        $startIndex = $this->campaign->last_processed_index ?? 0;

        // Allow sending to same phone numbers multiple times
        // No filtering of duplicate phone numbers

        Log::info('Campaign processing started', [
            'campaign_id' => $this->campaign->id,
            'total_recipients' => $totalRecipients,
            'delay_seconds' => $delaySeconds,
            'start_index' => $startIndex,
        ]);

        // Process phone numbers starting from last processed index
        $phoneNumbers = array_slice($this->campaign->phone_numbers, $startIndex);
        
        foreach ($phoneNumbers as $relativeIndex => $phone) {
            $index = $startIndex + $relativeIndex;
            
            // Check if campaign was paused BEFORE processing this phone
            // Check more frequently - before every phone number
            if ($this->checkPauseAndStop($index)) {
                // Update counts before stopping
                $this->campaign->update([
                    'sent_count' => $sentCount,
                    'failed_count' => $failedCount,
                    'results' => $results,
                ]);
                Log::info('Campaign execution stopped due to pause', [
                    'campaign_id' => $this->campaign->id,
                    'stopped_at_index' => $index,
                ]);
                return; // Stop execution
            }
            $startTime = microtime(true);
            
            // Allow sending to same phone numbers multiple times
            // No skipping of duplicate phone numbers
            
            try {
                $result = $whatsApp->sendTemplate(
                    $phone,
                    $this->campaign->template_name,
                    $this->campaign->language
                );

                // Check if response is successful and has valid message data
                $hasMessage = isset($result['data']['messages'][0]);
                $messageStatus = $hasMessage ? ($result['data']['messages'][0]['message_status'] ?? null) : null;
                $messageId = $hasMessage ? ($result['data']['messages'][0]['id'] ?? null) : null;
                
                // Log detailed response
                Log::info('Message send result', [
                    'campaign_id' => $this->campaign->id,
                    'phone' => $phone,
                    'success' => $result['success'],
                    'has_message' => $hasMessage,
                    'message_status' => $messageStatus,
                    'message_id' => $messageId,
                    'full_response' => $result['data'] ?? null,
                ]);
                
                if ($result['success'] && $hasMessage && $messageId) {
                    $sentCount++;
                    $results[] = [
                        'phone' => $phone,
                        'success' => true,
                        'message_id' => $messageId,
                        'message_status' => $messageStatus,
                    ];
                    
                    // Log warning if status is not "accepted"
                    if ($messageStatus !== 'accepted') {
                        Log::warning('Message status is not accepted', [
                            'campaign_id' => $this->campaign->id,
                            'phone' => $phone,
                            'message_status' => $messageStatus,
                            'message_id' => $messageId,
                        ]);
                    }
                } else {
                    $failedCount++;
                    $errorMessage = 'Unknown error';
                    
                    if (isset($result['data']['error'])) {
                        $errorMessage = $result['data']['error']['message'] ?? json_encode($result['data']['error']);
                    } elseif (!$hasMessage) {
                        $errorMessage = 'No message data in response';
                    } elseif (!$messageId) {
                        $errorMessage = 'No message ID in response';
                    }
                    
                    $results[] = [
                        'phone' => $phone,
                        'success' => false,
                        'error' => $errorMessage,
                        'response' => $result['data'] ?? null,
                    ];
                    
                    Log::error('Failed to send message', [
                        'campaign_id' => $this->campaign->id,
                        'phone' => $phone,
                        'error' => $errorMessage,
                        'response' => $result['data'] ?? null,
                    ]);
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

            // Update campaign progress in real-time (including last processed index)
            $this->campaign->update([
                'sent_count' => $sentCount,
                'failed_count' => $failedCount,
                'results' => $results,
                'last_processed_index' => $index + 1, // Next index to process
            ]);

            // Stop at max_sends limit (e.g. 250): complete campaign and do not send again
            $maxSends = DB::table('campaigns')->where('id', $this->campaign->id)->value('max_sends');
            if ($maxSends !== null && $sentCount >= (int) $maxSends) {
                $this->campaign->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                    'paused_at' => null,
                    'last_processed_index' => $index + 1,
                ]);
                Log::info('Campaign stopped at max_sends limit', [
                    'campaign_id' => $this->campaign->id,
                    'sent_count' => $sentCount,
                    'max_sends' => $maxSends,
                ]);
                return;
            }

            // Check pause immediately after sending (before delay)
            if ($this->checkPauseAndStop($index + 1)) {
                return; // Stop execution
            }

            // Calculate elapsed time and ensure exact delay between messages
            // مهم جداً: الالتزام بالوقت المحدد بين كل رسالة والأخرى
            $elapsedTime = microtime(true) - $startTime;
            $remainingDelay = max(0, $delaySeconds - $elapsedTime);

            // Apply delay between messages with pause checking
            // (يحدث بعد كل رسالة حتى الفاشلة)
            if ($remainingDelay > 0 && $index < $totalRecipients - 1) {
                // Only delay if not the last message
                // Use delay with pause checking - splits delay into chunks
                $wasPaused = $this->applyDelayWithPauseCheck($remainingDelay);
                
                if ($wasPaused) {
                    // Campaign was paused during delay, stop execution
                    $this->campaign->update([
                        'sent_count' => $sentCount,
                        'failed_count' => $failedCount,
                        'results' => $results,
                        'last_processed_index' => $index + 1,
                    ]);
                    return; // Stop execution
                }
                
                Log::debug('Delay applied', [
                    'campaign_id' => $this->campaign->id,
                    'phone' => $phone,
                    'requested_delay' => $delaySeconds,
                    'actual_delay' => round($remainingDelay, 2),
                    'elapsed_time' => round($elapsedTime, 2),
                ]);
            }
            
            // Check pause again after delay (before next iteration)
            if ($this->checkPauseAndStop($index + 1)) {
                $this->campaign->update([
                    'sent_count' => $sentCount,
                    'failed_count' => $failedCount,
                    'results' => $results,
                ]);
                return; // Stop execution
            }
        }

        // Mark campaign as completed
        $this->campaign->update([
            'status' => 'completed',
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
            'results' => $results,
            'completed_at' => now(),
            'paused_at' => null,
            'last_processed_index' => $totalRecipients,
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
