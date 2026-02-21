<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\WhatsAppController;
use App\Models\Campaign;

// Main page - Campaigns List
Route::get('/', function () {
    return Inertia::render('Campaigns');
})->name('home');

// New Campaign
Route::get('/new', function () {
    return Inertia::render('CampaignSender');
})->name('campaign.new');

// Campaign Status
Route::get('/campaign-status/{campaign}', function (Campaign $campaign) {
    return Inertia::render('CampaignStatus', [
        'campaign' => [
            'id' => $campaign->id,
            'name' => $campaign->name,
            'template' => $campaign->template_name,
            'status' => $campaign->status,
            'receivers' => $campaign->total_recipients,
            'sent' => $campaign->sent_count,
            'failed' => $campaign->failed_count,
            'progress' => $campaign->progress,
            'scheduledTime' => $campaign->created_at->toISOString(),
        ],
    ]);
})->name('campaign-status');

// WhatsApp API Routes
Route::get('/api/templates', [WhatsAppController::class, 'templates'])->name('api.templates');
Route::post('/api/campaign/send', [WhatsAppController::class, 'sendCampaign'])->name('api.campaign.send');
Route::get('/api/campaign/{campaign}', [WhatsAppController::class, 'getCampaignStatus'])->name('api.campaign.status');
Route::get('/api/campaigns', [WhatsAppController::class, 'getCampaigns'])->name('api.campaigns');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__.'/settings.php';
