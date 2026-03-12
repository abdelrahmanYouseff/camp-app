<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whatsapp_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('phone_number')->comment('WhatsApp phone number (display)');
            $table->string('phone_number_id')->comment('Meta phone_number_id for API');
            $table->string('business_account_id')->comment('Meta WhatsApp Business Account ID');
            $table->text('access_token')->comment('Meta access token');
            $table->boolean('is_active')->default(false)->comment('Use this account for sending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_accounts');
    }
};
