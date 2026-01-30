<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('signed_documents', function (Blueprint $table) {
            // ip_address and user_agent already exist in the original migration
            $table->string('file_hash')->nullable()->after('user_agent');
            $table->string('file_path')->nullable()->after('file_hash'); // Path to the PDF
            $table->json('signed_data')->nullable()->after('file_path');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->timestamp('overview_delivered_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signed_documents', function (Blueprint $table) {
            $table->dropColumn(['file_hash', 'file_path', 'signed_data']);
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('overview_delivered_at');
        });
    }
};
