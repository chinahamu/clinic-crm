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
        Schema::table('step_mail_logs', function (Blueprint $table) {
            $table->string('channel')->after('mail_type')->nullable(); // 'mail' or 'line'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('step_mail_logs', function (Blueprint $table) {
            $table->dropColumn('channel');
        });
    }
};
