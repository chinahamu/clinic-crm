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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('menu_id')->constrained()->onDelete('cascade');
            $table->foreignId('staff_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('room_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('machine_id')->nullable()->constrained()->onDelete('set null');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('reservation_type')->default('new');
            $table->string('status')->default('confirmed');
            $table->string('reception_status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
