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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->date('birthday')->nullable()->after('phone');
            $table->string('gender')->nullable()->after('birthday');
            $table->text('address')->nullable()->after('gender');
            $table->string('referral_source')->nullable()->after('address');
            $table->string('consent_status')->nullable()->after('referral_source'); // e.g., 'agreed', 'pending'
            $table->boolean('caution_flag')->default(false)->after('consent_status');
            $table->text('caution_details')->nullable()->after('caution_flag');
            $table->timestamp('last_visit_at')->nullable()->after('caution_details');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'birthday',
                'gender',
                'address',
                'referral_source',
                'consent_status',
                'caution_flag',
                'caution_details',
                'last_visit_at',
            ]);
        });
    }
};
