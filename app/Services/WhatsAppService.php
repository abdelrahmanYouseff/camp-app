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
                
                // Filter only approved templates
                return array_values(array_filter($templates, function ($template) {
                    return $template['status'] === 'APPROVED';
                }));
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
     * Send a template message to a phone number
     */
    public function sendTemplate(string $to, string $templateName, string $language = 'en', array $components = []): array
    {
        try {
            // Format phone number (remove + and spaces)
            $to = preg_replace('/[^0-9]/', '', $to);

            $payload = [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => [
                        'code' => $language,
                    ],
                ],
            ];

            // Add components if provided (for templates with variables)
            if (!empty($components)) {
                $payload['template']['components'] = $components;
            }

            $response = Http::withToken($this->accessToken)
                ->post("{$this->baseUrl}/{$this->phoneNumberId}/messages", $payload);

            return [
                'success' => $response->successful(),
                'data' => $response->json(),
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
}
