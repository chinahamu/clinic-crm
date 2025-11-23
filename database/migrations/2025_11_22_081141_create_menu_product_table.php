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
        if (!Schema::hasTable('menu_product')) {
            Schema::create('menu_product', function (Blueprint $table) {
                $table->id();
                // 外部キー制約はテーブル作成順序の影響を受けるため、ここでは単純な unsignedBigInteger を使う
                $table->unsignedBigInteger('menu_id');
                $table->unsignedBigInteger('product_id');
                $table->timestamps();

                $table->unique(['menu_id', 'product_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_product');
    }
};
