<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->unsignedInteger('max_sends')->nullable()->after('delay_seconds');
        });

        // Set limit 250 for campaign 13 (id may not exist yet; update is safe)
        DB::table('campaigns')->where('id', 13)->update(['max_sends' => 250]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('max_sends');
        });
    }
};
