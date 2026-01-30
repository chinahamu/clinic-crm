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
        Schema::create('mail_scenarios', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('管理用シナリオ名');
            $table->boolean('is_active')->default(true);
            $table->string('trigger_type')->comment('after_visit, after_reservation 等');
            $table->integer('days_offset')->comment('基準日からの経過日数');
            $table->string('sender_name')->nullable()->comment('メール送信者名');
            $table->string('subject')->comment('メール件名');
            $table->text('body')->comment('本文テンプレート');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mail_scenarios');
    }
};
