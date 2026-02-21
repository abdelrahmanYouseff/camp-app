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
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'phone_numbers' => 'array',
        'results' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
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
}
