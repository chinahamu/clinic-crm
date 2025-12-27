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
        // Add columns to contracts table
        Schema::table('contracts', function (Blueprint $table) {
            $table->string('campaign_name')->nullable()->after('menu_id');
            $table->integer('discount_amount')->default(0)->after('total_price');
            $table->text('notes')->nullable()->after('status');
        });

        // Create contract_products table
        Schema::create('contract_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->integer('amount'); // Total amount for this product line
            $table->timestamps();
        });

        // Create contract_payments table
        Schema::create('contract_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->string('payment_method'); // cash, credit, loan, etc.
            $table->integer('amount');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_payments');
        Schema::dropIfExists('contract_products');
        
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn(['campaign_name', 'discount_amount', 'notes']);
        });
    }
};
