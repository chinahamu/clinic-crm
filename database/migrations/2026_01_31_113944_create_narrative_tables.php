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
        Schema::create('patient_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('clinic_id')->constrained('clinics')->onDelete('cascade');
            $table->string('attribute_name');
            $table->integer('score'); // 1-5
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Uniqueness constraint to prevent duplicate attributes for same user/clinic
            $table->unique(['user_id', 'clinic_id', 'attribute_name']); 
        });

        Schema::create('life_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('occurred_at');
            $table->string('title');
            $table->string('category'); // family, work, health, other
            $table->integer('impact_level')->default(1); // 1-3
            $table->timestamps();
        });

        Schema::create('narrative_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // Assuming table name 'staff' for Staff model. 
            // If the table is different (e.g. 'users' with roles), this needs adjustment. 
            // Based on context, 'staff' seems to be a separate table or model.
            // Using 'staff' as per prompt instructions.
            $table->foreignId('staff_id')->constrained('staff'); 
            $table->text('content');
            $table->json('emotional_tags')->nullable();
            $table->string('context')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('narrative_logs');
        Schema::dropIfExists('life_events');
        Schema::dropIfExists('patient_values');
    }
};
