<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $baseUrl = 'https://graph.facebook.com/v18.0';
    protected string $accessToken;
    protected string $phoneNumberId;
    protected string $businessAccountId;

    public function __construct()
    {
        $this->accessToken = config('services.whatsapp.access_token');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id');
        $this->businessAccountId = config('services.whatsapp.business_account_id');
    }

    /**
     * Get all message templates from WhatsApp Business API
     */
    public function getTemplates(): array
    {
        try {
            $response = Http::withToken($this->accessToken)
                ->get("{$this->baseUrl}/{$this->businessAccountId}/message_templates");

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
     * Normalize language code for WhatsApp API (fixes #132001).
     * Only expand "en" to "en_US"; pass all other codes from Meta as-is.
     */
    protected function normalizeLanguageCode(string $language): string
    {
        if ($language === 'en') {
            return 'en_US';
        }
        return $language;
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

            $response = Http::withToken($this->accessToken)
                ->post("{$this->baseUrl}/{$this->phoneNumberId}/messages", $payload);

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
                $errorCode = $responseData['error']['code'] ?? null;
                Log::error('WhatsApp API Error in Response', [
                    'to' => $to,
                    'template' => $templateName,
                    'language_sent' => $languageCode,
                    'error' => $responseData['error'],
                ]);
                if ((int) $errorCode === 132001) {
                    Log::warning('132001: Template/language mismatch. Check in Meta: template name exactly "' . $templateName . '", language code "' . $languageCode . '"', [
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
        try {
            $response = Http::withToken($this->accessToken)
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
