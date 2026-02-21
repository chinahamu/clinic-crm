<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patient_values', function (Blueprint $table) {
            // 既存の score / attribute_name は残しつつ LTV属性を追加
            $table->unsignedBigInteger('ltv')->default(0)
                  ->comment('累計支払額（円）')
                  ->after('notes');
            $table->unsignedInteger('visit_count')->default(0)
                  ->comment('来院回数')
                  ->after('ltv');
            $table->timestamp('last_visit_at')->nullable()
                  ->comment('最終来院日時')
                  ->after('visit_count');
            $table->string('status_label', 20)->default('new')
                  ->comment('new / active / dormant')
                  ->after('last_visit_at');
        });
    }

    public function down(): void
    {
        Schema::table('patient_values', function (Blueprint $table) {
            $table->dropColumn(['ltv', 'visit_count', 'last_visit_at', 'status_label']);
        });
    }
};
