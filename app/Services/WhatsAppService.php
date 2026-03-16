<?php

namespace App\Services;

use App\Models\WhatsAppAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class WhatsAppService
{
    protected string $baseUrl = 'https://graph.facebook.com/v18.0';
    protected string $accessToken;
    protected string $phoneNumberId;
    protected string $businessAccountId;

    public const SETTING_ACTIVE_PHONE_NUMBER_ID = 'active_whatsapp_phone_number_id';

    public function __construct()
    {
        $this->accessToken = config('services.whatsapp.access_token');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id');
        $this->businessAccountId = config('services.whatsapp.business_account_id');
    }

    /**
     * Active credentials for API calls (from whatsapp_accounts or .env).
     * @return array{access_token: string, phone_number_id: string, business_account_id: string}
     */
    protected function getActiveCredentials(): array
    {
        if (Schema::hasTable('whatsapp_accounts')) {
            $account = WhatsAppAccount::active()->first();
            if ($account) {
                return [
                    'access_token' => $account->access_token,
                    'phone_number_id' => $account->phone_number_id,
                    'business_account_id' => $account->business_account_id,
                ];
            }
        }

        // Fallback to .env values, optionally overridden by settings table
        $phoneId = $this->phoneNumberId;
        if (Schema::hasTable('settings')) {
            $active = DB::table('settings')->where('key', self::SETTING_ACTIVE_PHONE_NUMBER_ID)->value('value');
            if ($active) {
                $phoneId = $active;
            }
        }

        return [
            'access_token' => $this->accessToken,
            'phone_number_id' => $phoneId ?: $this->phoneNumberId,
            'business_account_id' => $this->businessAccountId,
        ];
    }

    /**
     * Phone number ID used for sending (from active account, settings, or .env).
     */
    public function getPhoneNumberIdForSending(): string
    {
        $cred = $this->getActiveCredentials();
        return $cred['phone_number_id'];
    }

    /**
     * List WhatsApp accounts (from DB). If none, fallback to .env as single entry.
     */
    public function getPhoneNumbers(): array
    {
        if (Schema::hasTable('whatsapp_accounts')) {
            $accounts = WhatsAppAccount::orderBy('is_active', 'desc')->orderBy('id')->get();
            if ($accounts->isNotEmpty()) {
                return $accounts->map(fn ($a) => [
                    'id' => (string) $a->id,
                    'display_phone_number' => $a->phone_number,
                    'label' => $a->label,
                    'phone_number_id' => $a->phone_number_id,
                    'business_account_id' => $a->business_account_id,
                    'is_active' => $a->is_active,
                ])->all();
            }
        }

        $display = config('services.whatsapp.phone_number', '');
        return [
            [
                'id' => $this->phoneNumberId,
                'display_phone_number' => $display ?: ('ID: ' . $this->phoneNumberId),
                'label' => null,
                'phone_number_id' => $this->phoneNumberId,
                'business_account_id' => $this->businessAccountId,
                'is_active' => true,
            ],
        ];
    }

    /**
     * Active account ID for UI (DB id when using whatsapp_accounts, else phone_number_id).
     */
    public function getActivePhoneNumberId(): ?string
    {
        if (Schema::hasTable('whatsapp_accounts')) {
            $account = WhatsAppAccount::active()->first();
            return $account ? (string) $account->id : null;
        }
        if (Schema::hasTable('settings')) {
            return DB::table('settings')->where('key', self::SETTING_ACTIVE_PHONE_NUMBER_ID)->value('value');
        }
        return $this->phoneNumberId;
    }

    /**
     * Get all message templates from WhatsApp Business API
     */
    public function getTemplates(): array
    {
        $cred = $this->getActiveCredentials();
        try {
            $response = Http::withToken($cred['access_token'])
                ->get("{$this->baseUrl}/{$cred['business_account_id']}/message_templates");

            if ($response->successful()) {
                $templates = $response->json('data', []);
                
                // Filter only approved templates and normalize language to exact code (fixes #132001)
                return array_values(array_map(function ($template) {
                    $template['language'] = $template['language']['code'] ?? $template['language'] ?? 'en_US';
                    return $template;
                }, array_filter($templates, function ($template) {
                    return $template['status'] === 'APPROVED';
                })));
            }

            Log::error('WhatsApp API Error', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);

            return [];
        } catch (\Exception $e) {
            Log::error('WhatsApp Service Exception', [
                'message' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Upload an image file to WhatsApp and return media ID.
     */
    public function uploadImageToWhatsApp(string $path, string $mimeType): ?string
    {
        $cred = $this->getActiveCredentials();

        try {
            $response = Http::withToken($cred['access_token'])
                ->asMultipart()
                ->attach('file', fopen($path, 'r'), basename($path), ['Content-Type' => $mimeType])
                ->post("{$this->baseUrl}/{$cred['phone_number_id']}/media", [
                    'messaging_product' => 'whatsapp',
                    'type' => 'image',
                ]);

            if ($response->successful()) {
                return $response->json('id');
            }

            Log::error('WhatsApp media upload error', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
        } catch (\Exception $e) {
            Log::error('WhatsApp media upload exception', [
                'message' => $e->getMessage(),
            ]);
        }

        return null;
    }

    /**
     * Pass language as-is from Meta template list (no normalization).
     * Fixes #132001 when template is registered as "en" but we were sending "en_US" or vice versa.
     */
    protected function normalizeLanguageCode(string $language): string
    {
        return $language ?: 'en';
    }

    /**
     * Alternate language code for 132001 retry (en <-> en_US, ar <-> ar_AR).
     */
    protected function getAlternateLanguageCode(string $code): ?string
    {
        $alternates = [
            'en' => 'en_US',
            'en_US' => 'en',
            'ar' => 'ar_AR',
            'ar_AR' => 'ar',
        ];
        return $alternates[$code] ?? null;
    }

    /**
     * Send a template message to a phone number
     */
    public function sendTemplate(string $to, string $templateName, string $language = 'en', array $components = []): array
    {
        try {
            // Format phone number (remove + and spaces)
            $to = preg_replace('/[^0-9]/', '', $to);

            $languageCode = $this->normalizeLanguageCode($language);

            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => [
                        'policy' => 'deterministic',
                        'code' => $languageCode,
                    ],
                ],
            ];

            // Add components if provided (for templates with variables)
            if (!empty($components)) {
                $payload['template']['components'] = $components;
            }

            $cred = $this->getActiveCredentials();
            $response = Http::withToken($cred['access_token'])
                ->post("{$this->baseUrl}/{$cred['phone_number_id']}/messages", $payload);

            $responseData = $response->json();
            $isSuccessful = $response->successful();
            
            // Log the full response for debugging
            Log::info('WhatsApp API Response', [
                'to' => $to,
                'template' => $templateName,
                'status_code' => $response->status(),
                'successful' => $isSuccessful,
                'response' => $responseData,
            ]);

            // Check for errors in response even if status is 200
            if (isset($responseData['error'])) {
                $errorCode = (int) ($responseData['error']['code'] ?? 0);
                Log::error('WhatsApp API Error in Response', [
                    'to' => $to,
                    'template' => $templateName,
                    'language_sent' => $languageCode,
                    'error' => $responseData['error'],
                ]);

                // #132001: Template name does not exist in the translation — retry with alternate language code once
                if ($errorCode === 132001) {
                    $altCode = $this->getAlternateLanguageCode($languageCode);
                    if ($altCode !== null) {
                        Log::info('132001 retry with alternate language', [
                            'template' => $templateName,
                            'from' => $languageCode,
                            'to' => $altCode,
                        ]);
                        $payload['template']['language']['code'] = $altCode;
                        $retryResponse = Http::withToken($cred['access_token'])
                            ->post("{$this->baseUrl}/{$cred['phone_number_id']}/messages", $payload);
                        $retryData = $retryResponse->json();
                        if ($retryResponse->successful() && ! isset($retryData['error'])) {
                            Log::info('WhatsApp API Response (132001 retry succeeded)', [
                                'to' => $to,
                                'template' => $templateName,
                                'language_used' => $altCode,
                            ]);
                            return [
                                'success' => true,
                                'data' => $retryData,
                                'status' => $retryResponse->status(),
                            ];
                        }
                    }
                    Log::warning('132001: Template/language mismatch. Check in Meta: template "' . $templateName . '", language "' . $languageCode . '"', [
                        'payload_template' => $payload['template'],
                    ]);
                }
                $isSuccessful = false;
            }

            return [
                'success' => $isSuccessful,
                'data' => $responseData,
                'status' => $response->status(),
            ];
        } catch (\Exception $e) {
            Log::error('WhatsApp Send Exception', [
                'message' => $e->getMessage(),
                'to' => $to,
                'template' => $templateName,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send template message to multiple phone numbers with delay
     */
    public function sendBulkTemplates(array $phoneNumbers, string $templateName, string $language = 'en', int $delaySeconds = 1): array
    {
        $results = [
            'total' => count($phoneNumbers),
            'sent' => 0,
            'failed' => 0,
            'details' => [],
        ];

        foreach ($phoneNumbers as $phone) {
            $result = $this->sendTemplate($phone, $templateName, $language);
            
            if ($result['success']) {
                $results['sent']++;
            } else {
                $results['failed']++;
            }

            $results['details'][] = [
                'phone' => $phone,
                'success' => $result['success'],
                'response' => $result['data'] ?? $result['error'] ?? null,
            ];

            // Add delay between messages
            if ($delaySeconds > 0) {
                sleep($delaySeconds);
            }
        }

        return $results;
    }

    /**
     * Get message status from WhatsApp API
     */
    public function getMessageStatus(string $messageId): array
    {
        $cred = $this->getActiveCredentials();
        try {
            $response = Http::withToken($cred['access_token'])
                ->get("{$this->baseUrl}/{$messageId}");

            return [
                'success' => $response->successful(),
                'data' => $response->json(),
                'status' => $response->status(),
            ];
        } catch (\Exception $e) {
            Log::error('WhatsApp Get Message Status Exception', [
                'message' => $e->getMessage(),
                'message_id' => $messageId,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
