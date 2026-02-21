<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('line_bind_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('token', 6)->unique()->comment('6桁の数字トークン（受付スタッフ発行）');
            $table->timestamp('expires_at')->comment('有効期限（発行かり10分）');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('line_bind_tokens');
    }
};
