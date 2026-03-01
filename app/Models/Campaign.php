<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'name',
        'template_name',
        'language',
        'status',
        'total_recipients',
        'sent_count',
        'failed_count',
        'phone_numbers',
        'results',
        'delay_seconds',
        'max_sends',
        'started_at',
        'completed_at',
        'paused_at',
        'last_processed_index',
    ];

    protected $casts = [
        'phone_numbers' => 'array',
        'results' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'paused_at' => 'datetime',
    ];

    /**
     * Get the progress percentage
     */
    public function getProgressAttribute(): int
    {
        if ($this->total_recipients === 0) {
            return 0;
        }
        
        return (int) round(($this->sent_count + $this->failed_count) / $this->total_recipients * 100);
    }

    /**
     * Check if campaign is paused
     */
    public function isPaused(): bool
    {
        return $this->paused_at !== null;
    }

    /**
     * Pause the campaign
     */
    public function pause(): void
    {
        $this->update([
            'paused_at' => now(),
            'status' => 'processing', // Keep as processing to allow resume
        ]);
    }

    /**
     * Resume the campaign
     */
    public function resume(): void
    {
        $this->update([
            'paused_at' => null,
            'status' => 'processing',
        ]);
    }
}
