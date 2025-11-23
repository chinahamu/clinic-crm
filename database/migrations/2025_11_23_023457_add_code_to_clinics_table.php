<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->string('code', 10)->nullable()->after('id');
        });

        // Populate existing records
        DB::table('clinics')->orderBy('id')->chunk(100, function ($clinics) {
            foreach ($clinics as $clinic) {
                DB::table('clinics')
                    ->where('id', $clinic->id)
                    ->update(['code' => Str::random(10)]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clinics', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }
};
